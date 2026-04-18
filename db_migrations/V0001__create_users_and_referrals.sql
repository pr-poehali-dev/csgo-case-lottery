CREATE TABLE t_p61313060_csgo_case_lottery.users (
  id SERIAL PRIMARY KEY,
  steam_id VARCHAR(64) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  balance NUMERIC(12,2) DEFAULT 0,
  cases_opened INTEGER DEFAULT 0,
  referral_code VARCHAR(32) UNIQUE NOT NULL,
  referred_by INTEGER REFERENCES t_p61313060_csgo_case_lottery.users(id),
  referral_earnings NUMERIC(12,2) DEFAULT 0,
  session_token VARCHAR(128),
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p61313060_csgo_case_lottery.referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES t_p61313060_csgo_case_lottery.users(id),
  referee_id INTEGER NOT NULL REFERENCES t_p61313060_csgo_case_lottery.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referee_id)
);
