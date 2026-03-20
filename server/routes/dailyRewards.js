import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Auth middleware
async function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [sessionId]);
    const session = result.rows[0];
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    req.userId = session.user_id;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function getTodayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayUTC() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// GET /api/daily-rewards - get current streak status
router.get('/', requireAuth, async (req, res) => {
  try {
    const today = getTodayUTC();
    const latestResult = await pool.query(
      'SELECT * FROM daily_logins WHERE user_id = $1 ORDER BY login_date DESC LIMIT 1',
      [req.userId]
    );
    const latest = latestResult.rows[0];

    if (!latest) {
      return res.json({ streak: 0, rewardDay: 0, claimedToday: false, history: [] });
    }

    const claimedToday = latest.login_date === today;
    const yesterday = getYesterdayUTC();
    const streakActive = latest.login_date === today || latest.login_date === yesterday;
    const currentStreak = streakActive ? latest.streak : 0;
    const currentRewardDay = streakActive ? latest.reward_day : 0;

    const historyResult = await pool.query(
      'SELECT login_date, streak, reward_day FROM daily_logins WHERE user_id = $1 ORDER BY login_date DESC LIMIT 30',
      [req.userId]
    );

    res.json({
      streak: currentStreak,
      rewardDay: currentRewardDay,
      claimedToday,
      history: historyResult.rows,
    });
  } catch (err) {
    console.error('Daily rewards get error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/daily-rewards/claim - claim today's reward
router.post('/claim', requireAuth, async (req, res) => {
  try {
    const today = getTodayUTC();
    const latestResult = await pool.query(
      'SELECT * FROM daily_logins WHERE user_id = $1 ORDER BY login_date DESC LIMIT 1',
      [req.userId]
    );
    const latest = latestResult.rows[0];

    if (latest && latest.login_date === today) {
      return res.status(400).json({ error: 'Already claimed today' });
    }

    let newStreak = 1;
    let newRewardDay = 1;

    if (latest) {
      const yesterday = getYesterdayUTC();
      if (latest.login_date === yesterday) {
        newStreak = latest.streak + 1;
        newRewardDay = latest.reward_day < 30 ? latest.reward_day + 1 : 1;
      }
    }

    await pool.query(
      'INSERT INTO daily_logins (user_id, login_date, streak, reward_day) VALUES ($1, $2, $3, $4)',
      [req.userId, today, newStreak, newRewardDay]
    );

    res.json({ streak: newStreak, rewardDay: newRewardDay, claimedToday: true });
  } catch (err) {
    console.error('Daily rewards claim error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
