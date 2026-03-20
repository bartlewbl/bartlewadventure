import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

// Initialize tables
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS game_saves (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      save_data TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS daily_logins (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      login_date TEXT NOT NULL,
      streak INTEGER NOT NULL DEFAULT 1,
      reward_day INTEGER NOT NULL DEFAULT 1,
      claimed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, login_date)
    );

    CREATE TABLE IF NOT EXISTS invites (
      id SERIAL PRIMARY KEY,
      from_user_id INTEGER NOT NULL REFERENCES users(id),
      to_user_id INTEGER NOT NULL REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(from_user_id, to_user_id)
    );

    CREATE TABLE IF NOT EXISTS trades (
      id SERIAL PRIMARY KEY,
      from_user_id INTEGER NOT NULL REFERENCES users(id),
      to_user_id INTEGER NOT NULL REFERENCES users(id),
      offer_items TEXT NOT NULL DEFAULT '[]',
      offer_gold INTEGER NOT NULL DEFAULT 0,
      return_items TEXT NOT NULL DEFAULT '[]',
      return_gold INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS market_listings (
      id SERIAL PRIMARY KEY,
      seller_user_id INTEGER NOT NULL REFERENCES users(id),
      item_data TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      rarity TEXT NOT NULL DEFAULT 'Common',
      item_level INTEGER NOT NULL DEFAULT 1,
      item_name TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active',
      buyer_user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      sold_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_market_status ON market_listings(status);
    CREATE INDEX IF NOT EXISTS idx_market_category ON market_listings(category, status);
    CREATE INDEX IF NOT EXISTS idx_market_seller ON market_listings(seller_user_id, status);

    CREATE TABLE IF NOT EXISTS probability_config (
      key TEXT PRIMARY KEY,
      value REAL NOT NULL,
      category TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

export default pool;
