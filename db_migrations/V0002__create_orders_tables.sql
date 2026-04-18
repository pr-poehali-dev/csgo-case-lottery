CREATE TABLE t_p61313060_csgo_case_lottery.orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES t_p61313060_csgo_case_lottery.users(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    robokassa_inv_id INTEGER UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    payment_url TEXT,
    order_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

CREATE TABLE t_p61313060_csgo_case_lottery.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES t_p61313060_csgo_case_lottery.orders(id) ON UPDATE CASCADE,
    product_id VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_robokassa_inv_id ON t_p61313060_csgo_case_lottery.orders(robokassa_inv_id);
CREATE INDEX idx_orders_status ON t_p61313060_csgo_case_lottery.orders(status);
CREATE INDEX idx_order_items_order_id ON t_p61313060_csgo_case_lottery.order_items(order_id);
