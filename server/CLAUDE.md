# Server - Express Backend

Node.js + Express 5 API with PostgreSQL. Auth via session tokens.

## Database Schema

```sql
-- User accounts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,           -- bcrypt (10 rounds)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session-based auth
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,                   -- UUID
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game state (one save per user, entire state as JSON)
CREATE TABLE game_saves (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  save_data TEXT,                        -- JSON string: { player: { gold, inventory, level, ... }, ... }
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily login streak tracking
CREATE TABLE daily_logins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  login_date TEXT,                       -- 'YYYY-MM-DD' UTC
  streak INTEGER DEFAULT 1,
  reward_day INTEGER DEFAULT 1,          -- cycles 1-30
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, login_date)
);

-- Friend system
CREATE TABLE invites (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending',         -- pending | accepted | declined
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Player-to-player trades
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  offer_items TEXT DEFAULT '[]',         -- JSON array of items
  offer_gold INTEGER DEFAULT 0,
  return_items TEXT DEFAULT '[]',
  return_gold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',         -- pending | completed | declined | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global marketplace
CREATE TABLE market_listings (
  id SERIAL PRIMARY KEY,
  seller_user_id INTEGER REFERENCES users(id),
  item_data TEXT,                        -- JSON item object
  price INTEGER,                         -- 10-999999 gold
  category TEXT,                         -- potions|energy-drinks|weapons|shields|helmets|armor|boots|accessories|misc
  rarity TEXT DEFAULT 'Common',
  item_level INTEGER DEFAULT 1,
  item_name TEXT DEFAULT '',
  status TEXT DEFAULT 'active',          -- active | sold | cancelled
  buyer_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ
);
-- Indexes: idx_market_status, idx_market_category, idx_market_seller

-- Tunable game balance parameters (120+ keys)
CREATE TABLE probability_config (
  key TEXT PRIMARY KEY,
  value REAL,
  category TEXT,                         -- Combat|Loot|Exploration|Scaling|Passives|Material Drops|Egg Drops|Energy|Charisma
  label TEXT,
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Auth (`/api/auth`) — No auth required for register/login
| Method | Path | Body | Notes |
|--------|------|------|-------|
| POST | /register | `{ username, password }` | Username 2-20 chars, password 4+ |
| POST | /login | `{ username, password }` | Returns sessionId |
| GET | /me | — | Requires `X-Session-ID` header |
| POST | /logout | — | Invalidates session |

### Save (`/api/save`) — Auth required
| Method | Path | Notes |
|--------|------|-------|
| GET | / | Load save |
| POST | / | Upsert save (`{ saveData }`) |
| DELETE | / | Delete save (new game) |

### Daily Rewards (`/api/daily-rewards`) — Auth required
| Method | Path | Notes |
|--------|------|-------|
| GET | / | Streak status + 30-day history |
| POST | /claim | Claim today's reward, resets streak if day missed |

### Friends (`/api/invites`) — Auth required
| Method | Path | Notes |
|--------|------|-------|
| POST | /send | `{ username }` — send invite |
| GET | / | List received, sent, friends |
| POST | /:id/accept | Accept invite |
| POST | /:id/decline | Decline invite |

### Trades (`/api/trades`) — Auth required, friends only
| Method | Path | Notes |
|--------|------|-------|
| POST | /send | `{ toUserId, offerItems, offerGold }` |
| GET | / | Incoming + outgoing pending |
| POST | /:id/accept | `{ returnItems, returnGold }` — transactional |
| POST | /:id/decline | Decline trade |
| POST | /:id/cancel | Cancel own trade |

### Market (`/api/market`) — Auth required, level 10+
| Method | Path | Notes |
|--------|------|-------|
| POST | /list | `{ itemId, price }` — 5% listing fee, max 8 active |
| GET | /listings | `?category=&search=` — browse (200 limit) |
| GET | /my-listings | Own active + 20 recent sold |
| POST | /:id/buy | Transactional, 10% sale tax from seller |
| POST | /:id/cancel | Cancel listing, return item |

### Probability Config (`/api/probability-config`) — No auth (admin/debug)
| Method | Path | Notes |
|--------|------|-------|
| GET | / | All configs grouped by category |
| PUT | /:key | `{ value }` — update single |
| POST | /bulk | `{ updates: [{key, value}] }` |
| POST | /reset | Reset all to defaults |

## Architecture Notes

- **Auth pattern:** All protected routes check `X-Session-ID` header → look up session → get user_id
- **Save model:** Entire game state is one JSON blob in `save_data` column. Inventory, gold, stats — all in there.
- **Transactions:** Trade accept and market buy use `BEGIN/COMMIT` with `FOR UPDATE` row locks on both users' saves
- **Market economy:** 5% listing fee (upfront) + 10% sale tax (from proceeds). Trades between friends have no fees.
- **Friendship check:** Bidirectional — `(A→B accepted) OR (B→A accepted)`
