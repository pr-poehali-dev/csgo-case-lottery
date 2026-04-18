import json
import os
import hashlib
import psycopg2
import random
from urllib.parse import urlencode
from datetime import datetime

ROBOKASSA_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx'
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p61313060_csgo_case_lottery')

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Id, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
}


def calculate_signature(*args) -> str:
    """MD5 подпись по документации Robokassa."""
    return hashlib.md5(':'.join(str(a) for a in args).encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Создаёт заказ на пополнение баланса и возвращает ссылку на оплату Robokassa (СБП / карта / QR)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'}), 'isBase64Encoded': False}

    merchant_login = os.environ.get('ROBOKASSA_MERCHANT_LOGIN')
    password_1 = os.environ.get('ROBOKASSA_PASSWORD_1')

    if not merchant_login or not password_1:
        return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': 'Robokassa not configured'}), 'isBase64Encoded': False}

    payload = json.loads(event.get('body', '{}'))
    amount = float(payload.get('amount', 0))
    user_id = payload.get('user_id')
    user_name = str(payload.get('user_name', 'Игрок'))
    user_email = str(payload.get('user_email', 'noreply@drop.ru'))
    success_url = str(payload.get('success_url', ''))
    fail_url = str(payload.get('fail_url', ''))

    if amount < 50:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Минимальная сумма — 50 ₽'}), 'isBase64Encoded': False}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    for _ in range(10):
        inv_id = random.randint(100000, 2147483647)
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.orders WHERE robokassa_inv_id = %s", (inv_id,))
        if cur.fetchone()[0] == 0:
            break

    order_number = f"DEP-{datetime.now().strftime('%Y%m%d')}-{inv_id}"
    amount_str = f"{amount:.2f}"

    if success_url or fail_url:
        signature = calculate_signature(merchant_login, amount_str, inv_id, success_url, 'GET', fail_url, 'GET', password_1)
    else:
        signature = calculate_signature(merchant_login, amount_str, inv_id, password_1)

    query_params = {
        'MerchantLogin': merchant_login,
        'OutSum': amount_str,
        'InvoiceID': inv_id,
        'SignatureValue': signature,
        'Email': user_email,
        'Culture': 'ru',
        'Description': f'Пополнение баланса DROP Platform',
    }
    if success_url:
        query_params['SuccessUrl2'] = success_url
        query_params['SuccessUrl2Method'] = 'GET'
    if fail_url:
        query_params['FailUrl2'] = fail_url
        query_params['FailUrl2Method'] = 'GET'

    payment_url = f"{ROBOKASSA_URL}?{urlencode(query_params)}"

    cur.execute(f"""
        INSERT INTO {SCHEMA}.orders
          (order_number, user_id, user_name, user_email, amount, robokassa_inv_id, status, payment_url, order_comment)
        VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s, 'balance_top_up')
        RETURNING id
    """, (order_number, user_id, user_name, user_email, round(amount, 2), inv_id, payment_url))

    order_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'payment_url': payment_url, 'order_id': order_id, 'order_number': order_number}),
        'isBase64Encoded': False
    }
