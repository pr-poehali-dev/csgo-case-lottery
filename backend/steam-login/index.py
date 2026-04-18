import os
import urllib.parse

STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"

def handler(event: dict, context) -> dict:
    """Редирект пользователя на страницу авторизации Steam OpenID."""
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
    callback_url = os.environ.get("STEAM_CALLBACK_URL", f"{frontend_url}/steam-callback")

    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": callback_url,
        "openid.realm": frontend_url,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    }

    redirect_url = STEAM_OPENID_URL + "?" + urllib.parse.urlencode(params)

    return {
        "statusCode": 302,
        "headers": {
            "Location": redirect_url,
            "Access-Control-Allow-Origin": "*",
        },
        "body": ""
    }
