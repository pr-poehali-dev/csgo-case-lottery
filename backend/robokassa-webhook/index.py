import json
import os
import hashlib
import psycopg2
from urllib.parse import parse_qs

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p61313060_csgo_case_lottery')

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain'
}


def calculate_signature(*args) -> str:
    """MD5 подпись по документации Robokassa."""
    return hashlib.md5(':'.join(str(a) for a in args).encode()).hexdigest().upper()


def handler(event: dict, context) -> dict:
    """Result URL вебхук от Robokassa — подтверждает оплату и зачисляет баланс пользователю."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    password_2 = os.environ.get('ROBOKASSA_PASSWORD_2')
    if not password_2:
        return {'statusCode': 500, 'headers': HEADERS, 'body': 'Configuration error', 'isBase64Encoded': False}

    params = {}
    body = event.get('body', '')
    if body:
        if event.get('isBase64Encoded', False):
            import base64
            body = base64.b64decode(body).decode('utf-8')
        parsed = parse_qs(body)
        params = {k: v[0] for k, v in parsed.items()}
    if not params:
        params = event.get('queryStringParameters') or {}

    out_sum = params.get('OutSum', '')
    inv_id = params.get('InvId', '')
    signature_value = params.get('SignatureValue', '').upper()

    if not out_sum or not inv_id or not signature_value:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Missing params', 'isBase64Encoded': False}

    expected = calculate_signature(out_sum, inv_id, password_2)
    if signature_value != expected:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Invalid signature', 'isBase64Encoded': False}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"""
        UPDATE {SCHEMA}.orders
        SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE robokassa_inv_id = %s AND status = 'pending'
        RETURNING id, user_id, amount
    """, (int(inv_id),))

    result = cur.fetchone()

    if result:
        order_id, user_id, amount = result
        if user_id:
            cur.execute(f"""
                UPDATE {SCHEMA}.users
                SET balance = balance + %s
                WHERE id = %s
            """, (float(amount), user_id))
        conn.commit()

    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': HEADERS, 'body': f'OK{inv_id}', 'isBase64Encoded': False}
