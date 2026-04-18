import os
import json
import re
import secrets
import urllib.parse
import urllib.request
import psycopg2

STEAM_API_URL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"


def verify_openid(params):
    """Верифицирует ответ Steam OpenID и возвращает steam_id или None."""
    check_params = dict(params)
    check_params["openid.mode"] = "check_authentication"
    data = urllib.parse.urlencode(check_params).encode()
    req = urllib.request.Request(STEAM_OPENID_URL, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode()
    if "is_valid:true" not in body:
        return None
    claimed_id = params.get("openid.claimed_id", "")
    match = re.search(r"https://steamcommunity\.com/openid/id/(\d+)", claimed_id)
    return match.group(1) if match else None


def get_steam_profile(steam_id):
    """Получает профиль пользователя через Steam Web API."""
    api_key = os.environ.get("STEAM_API_KEY", "")
    url = f"{STEAM_API_URL}?key={api_key}&steamids={steam_id}"
    with urllib.request.urlopen(url, timeout=10) as resp:
        data = json.loads(resp.read().decode())
    players = data.get("response", {}).get("players", [])
    return players[0] if players else {}


def upsert_user(conn, steam_id, username, avatar_url, ref_code_from):
    """Создаёт или обновляет пользователя в БД, возвращает данные пользователя."""
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    with conn.cursor() as cur:
        ref_code = secrets.token_urlsafe(8)
        cur.execute("""
            INSERT INTO {schema}.users (steam_id, username, avatar_url, referral_code, last_seen_at)
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT (steam_id) DO UPDATE SET
                username = EXCLUDED.username,
                avatar_url = EXCLUDED.avatar_url,
                last_seen_at = NOW()
            RETURNING id, steam_id, username, avatar_url, balance, cases_opened,
                      referral_code, referral_earnings, created_at
        """.replace("{schema}", schema), (steam_id, username, avatar_url, ref_code))
        row = cur.fetchone()
        user_id = row[0]

        if ref_code_from:
            cur.execute("""
                SELECT id FROM {schema}.users WHERE referral_code = %s
            """.replace("{schema}", schema), (ref_code_from,))
            referrer = cur.fetchone()
            if referrer and referrer[0] != user_id:
                cur.execute("""
                    INSERT INTO {schema}.referrals (referrer_id, referee_id)
                    VALUES (%s, %s)
                    ON CONFLICT (referee_id) DO NOTHING
                """.replace("{schema}", schema), (referrer[0], user_id))
                cur.execute("""
                    UPDATE {schema}.users SET referred_by = %s WHERE id = %s AND referred_by IS NULL
                """.replace("{schema}", schema), (referrer[0], user_id))

        session_token = secrets.token_urlsafe(32)
        cur.execute("""
            UPDATE {schema}.users SET session_token = %s WHERE id = %s
        """.replace("{schema}", schema), (session_token, user_id))
        conn.commit()

        return {
            "id": row[0],
            "steam_id": row[1],
            "username": row[2],
            "avatar_url": row[3],
            "balance": float(row[4]),
            "cases_opened": row[5],
            "referral_code": row[6],
            "referral_earnings": float(row[7]),
            "session_token": session_token,
        }


def handler(event: dict, context) -> dict:
    """Обрабатывает callback от Steam OpenID, создаёт/обновляет пользователя и редиректит на главную."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": ""
        }

    frontend_url = os.environ.get("FRONTEND_URL", "https://p61313060.poehali.dev")
    params = event.get("queryStringParameters") or {}

    if not params.get("openid.mode"):
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            "body": json.dumps({"status": "steam_callback_ready"})
        }

    steam_id = verify_openid(params)
    if not steam_id:
        return {
            "statusCode": 302,
            "headers": {"Location": f"{frontend_url}?error=steam_auth_failed", "Access-Control-Allow-Origin": "*"},
            "body": ""
        }

    profile = get_steam_profile(steam_id)
    username = profile.get("personaname", f"User_{steam_id[-6:]}")
    avatar_url = profile.get("avatarfull", "")

    ref_code_from = params.get("ref", None)

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    user = upsert_user(conn, steam_id, username, avatar_url, ref_code_from)
    conn.close()

    redirect = (
        f"{frontend_url}?"
        f"token={user['session_token']}&"
        f"username={urllib.parse.quote(user['username'])}&"
        f"avatar={urllib.parse.quote(user['avatar_url'])}&"
        f"balance={user['balance']}&"
        f"cases={user['cases_opened']}&"
        f"ref_code={user['referral_code']}&"
        f"ref_earnings={user['referral_earnings']}"
    )

    return {
        "statusCode": 302,
        "headers": {
            "Location": redirect,
            "Access-Control-Allow-Origin": "*",
        },
        "body": ""
    }