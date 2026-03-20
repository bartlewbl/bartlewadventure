import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 2-20 characters' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
      [username, hash]
    );
    const userId = result.rows[0].id;

    const sessionId = uuidv4();
    await pool.query('INSERT INTO sessions (id, user_id) VALUES ($1, $2)', [sessionId, userId]);

    res.json({ sessionId, username, userId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const sessionId = uuidv4();
    await pool.query('INSERT INTO sessions (id, user_id) VALUES ($1, $2)', [sessionId, user.id]);

    res.json({ sessionId, username: user.username, userId: user.id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user from session
router.get('/me', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await pool.query(
      'SELECT sessions.*, users.username FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = $1',
      [sessionId]
    );
    const session = result.rows[0];
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    res.json({ username: session.username, userId: session.user_id });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
  }
  res.json({ ok: true });
});

export default router;
