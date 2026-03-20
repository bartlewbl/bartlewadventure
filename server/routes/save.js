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

// Load game save
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT save_data, updated_at FROM game_saves WHERE user_id = $1',
      [req.userId]
    );
    const save = result.rows[0];
    if (!save) {
      return res.json({ hasSave: false });
    }
    res.json({ hasSave: true, saveData: JSON.parse(save.save_data), updatedAt: save.updated_at });
  } catch (err) {
    console.error('Load save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save game
router.post('/', requireAuth, async (req, res) => {
  const { saveData } = req.body;
  if (!saveData) {
    return res.status(400).json({ error: 'No save data provided' });
  }
  try {
    await pool.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT(user_id)
       DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [req.userId, JSON.stringify(saveData)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete save (new game)
router.delete('/', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM game_saves WHERE user_id = $1', [req.userId]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
