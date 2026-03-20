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

// Send an invite to a user by username
router.post('/send', requireAuth, async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const targetResult = await pool.query('SELECT id, username FROM users WHERE username = $1', [username]);
    const targetUser = targetResult.rows[0];
    if (!targetUser) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (targetUser.id === req.userId) {
      return res.status(400).json({ error: 'Cannot invite yourself' });
    }

    // Check if already friends
    const existingResult = await pool.query(
      `SELECT * FROM invites WHERE ((from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1)) AND status = 'accepted'`,
      [req.userId, targetUser.id]
    );
    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Already friends with this player' });
    }

    const insertResult = await pool.query(
      `INSERT INTO invites (from_user_id, to_user_id, status) VALUES ($1, $2, 'pending') ON CONFLICT (from_user_id, to_user_id) DO NOTHING RETURNING id`,
      [req.userId, targetUser.id]
    );
    if (insertResult.rows.length === 0) {
      return res.status(409).json({ error: 'Invite already sent' });
    }

    res.json({ ok: true, toUsername: targetUser.username });
  } catch (err) {
    console.error('Invite send error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all invites (received, sent, and friends)
router.get('/', requireAuth, async (req, res) => {
  try {
    const receivedResult = await pool.query(
      `SELECT invites.id, invites.status, invites.created_at,
        users.username AS from_username, invites.from_user_id
       FROM invites
       JOIN users ON invites.from_user_id = users.id
       WHERE invites.to_user_id = $1 AND invites.status = 'pending'
       ORDER BY invites.created_at DESC`,
      [req.userId]
    );

    const sentResult = await pool.query(
      `SELECT invites.id, invites.status, invites.created_at,
        users.username AS to_username, invites.to_user_id
       FROM invites
       JOIN users ON invites.to_user_id = users.id
       WHERE invites.from_user_id = $1 AND invites.status = 'pending'
       ORDER BY invites.created_at DESC`,
      [req.userId]
    );

    const friendsResult = await pool.query(
      `SELECT users.id AS user_id, users.username
       FROM invites
       JOIN users ON (
         CASE WHEN invites.from_user_id = $1 THEN invites.to_user_id ELSE invites.from_user_id END
       ) = users.id
       WHERE invites.status = 'accepted'
         AND (invites.from_user_id = $1 OR invites.to_user_id = $1)
       ORDER BY users.username`,
      [req.userId]
    );

    res.json({ received: receivedResult.rows, sent: sentResult.rows, friends: friendsResult.rows });
  } catch (err) {
    console.error('Invites get error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept an invite
router.post('/:id/accept', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invites WHERE id = $1', [req.params.id]);
    const invite = result.rows[0];
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    if (invite.to_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not your invite' });
    }
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'Invite already handled' });
    }

    await pool.query('UPDATE invites SET status = $1 WHERE id = $2', ['accepted', invite.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Invite accept error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline an invite
router.post('/:id/decline', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invites WHERE id = $1', [req.params.id]);
    const invite = result.rows[0];
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    if (invite.to_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not your invite' });
    }
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'Invite already handled' });
    }

    await pool.query('UPDATE invites SET status = $1 WHERE id = $2', ['declined', invite.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Invite decline error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
