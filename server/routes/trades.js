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

// Send a trade offer to a friend
router.post('/send', requireAuth, async (req, res) => {
  const { toUserId, offerItems, offerGold } = req.body;

  if (!toUserId) {
    return res.status(400).json({ error: 'Recipient is required' });
  }
  if (toUserId === req.userId) {
    return res.status(400).json({ error: 'Cannot trade with yourself' });
  }

  const items = Array.isArray(offerItems) ? offerItems : [];
  const gold = Math.max(0, Math.floor(offerGold || 0));

  if (items.length === 0 && gold === 0) {
    return res.status(400).json({ error: 'Must offer at least one item or some gold' });
  }

  try {
    // Verify friendship
    const friendResult = await pool.query(
      `SELECT id FROM invites
       WHERE status = 'accepted'
         AND ((from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1))
       LIMIT 1`,
      [req.userId, toUserId]
    );
    if (friendResult.rows.length === 0) {
      return res.status(403).json({ error: 'You can only trade with friends' });
    }

    // Verify sender has the items and gold
    const senderSaveResult = await pool.query('SELECT save_data FROM game_saves WHERE user_id = $1', [req.userId]);
    const senderSave = senderSaveResult.rows[0];
    if (!senderSave) {
      return res.status(400).json({ error: 'No save data found' });
    }
    const saveData = JSON.parse(senderSave.save_data);
    const playerGold = saveData.player?.gold ?? 0;
    const playerInventory = saveData.player?.inventory ?? [];

    if (gold > playerGold) {
      return res.status(400).json({ error: 'Not enough gold' });
    }

    const offerItemIds = items.map(i => i.id);
    const uniqueIds = new Set(offerItemIds);
    if (uniqueIds.size !== offerItemIds.length) {
      return res.status(400).json({ error: 'Duplicate items in offer' });
    }
    for (const itemId of offerItemIds) {
      if (!playerInventory.some(i => i.id === itemId)) {
        return res.status(400).json({ error: 'Item not found in inventory' });
      }
    }

    const result = await pool.query(
      `INSERT INTO trades (from_user_id, to_user_id, offer_items, offer_gold, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [req.userId, toUserId, JSON.stringify(items), gold]
    );
    res.json({ ok: true, tradeId: result.rows[0].id });
  } catch (err) {
    console.error('Trade send error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all trades for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const incomingResult = await pool.query(
      `SELECT trades.id, trades.from_user_id, trades.offer_items, trades.offer_gold,
        trades.status, trades.created_at, users.username AS from_username
       FROM trades
       JOIN users ON trades.from_user_id = users.id
       WHERE trades.to_user_id = $1 AND trades.status = 'pending'
       ORDER BY trades.created_at DESC`,
      [req.userId]
    );

    const outgoingResult = await pool.query(
      `SELECT trades.id, trades.to_user_id, trades.offer_items, trades.offer_gold,
        trades.status, trades.created_at, users.username AS to_username
       FROM trades
       JOIN users ON trades.to_user_id = users.id
       WHERE trades.from_user_id = $1 AND trades.status = 'pending'
       ORDER BY trades.created_at DESC`,
      [req.userId]
    );

    const incoming = incomingResult.rows.map(t => ({
      ...t,
      offer_items: JSON.parse(t.offer_items),
    }));
    const outgoing = outgoingResult.rows.map(t => ({
      ...t,
      offer_items: JSON.parse(t.offer_items),
    }));

    res.json({ incoming, outgoing });
  } catch (err) {
    console.error('Trades get error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a trade (receiver provides their return items + gold)
router.post('/:id/accept', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tradeResult = await client.query('SELECT * FROM trades WHERE id = $1 FOR UPDATE', [req.params.id]);
    const trade = tradeResult.rows[0];
    if (!trade) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Trade not found' });
    }
    if (trade.to_user_id !== req.userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Not your trade to accept' });
    }
    if (trade.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Trade already handled' });
    }

    const { returnItems, returnGold } = req.body;
    const rItems = Array.isArray(returnItems) ? returnItems : [];
    const rGold = Math.max(0, Math.floor(returnGold || 0));

    // Load both saves
    const senderSaveResult = await client.query('SELECT save_data FROM game_saves WHERE user_id = $1', [trade.from_user_id]);
    const receiverSaveResult = await client.query('SELECT save_data FROM game_saves WHERE user_id = $1', [req.userId]);
    const senderSave = senderSaveResult.rows[0];
    const receiverSave = receiverSaveResult.rows[0];
    if (!senderSave || !receiverSave) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Save data not found' });
    }

    const senderData = JSON.parse(senderSave.save_data);
    const receiverData = JSON.parse(receiverSave.save_data);
    const senderPlayer = senderData.player;
    const receiverPlayer = receiverData.player;

    const offerItems = JSON.parse(trade.offer_items);
    const offerGold = trade.offer_gold;

    // Validate sender still has the offered items and gold
    const senderInventory = senderPlayer.inventory || [];
    for (const item of offerItems) {
      if (!senderInventory.some(i => i.id === item.id)) {
        await client.query('UPDATE trades SET status = $1 WHERE id = $2', ['cancelled', trade.id]);
        await client.query('COMMIT');
        return res.status(400).json({ error: 'Sender no longer has offered items. Trade cancelled.' });
      }
    }
    if (offerGold > (senderPlayer.gold ?? 0)) {
      await client.query('UPDATE trades SET status = $1 WHERE id = $2', ['cancelled', trade.id]);
      await client.query('COMMIT');
      return res.status(400).json({ error: 'Sender no longer has enough gold. Trade cancelled.' });
    }

    // Validate receiver has the return items and gold
    const receiverInventory = receiverPlayer.inventory || [];
    const returnItemIds = rItems.map(i => i.id);
    const uniqueReturnIds = new Set(returnItemIds);
    if (uniqueReturnIds.size !== returnItemIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Duplicate items in return offer' });
    }
    for (const item of rItems) {
      if (!receiverInventory.some(i => i.id === item.id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Item not found in your inventory' });
      }
    }
    if (rGold > (receiverPlayer.gold ?? 0)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough gold' });
    }

    // Check inventory space
    const senderMaxInv = senderPlayer.maxInventory || 30;
    const receiverMaxInv = receiverPlayer.maxInventory || 30;
    const senderNewSize = senderInventory.length - offerItems.length + rItems.length;
    const receiverNewSize = receiverInventory.length - rItems.length + offerItems.length;

    if (senderNewSize > senderMaxInv) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Sender\'s inventory would be too full' });
    }
    if (receiverNewSize > receiverMaxInv) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your inventory would be too full' });
    }

    // Execute the trade
    const offerItemIds = new Set(offerItems.map(i => i.id));
    const returnItemIdSet = new Set(returnItemIds);

    senderPlayer.inventory = senderInventory.filter(i => !offerItemIds.has(i.id)).concat(rItems);
    senderPlayer.gold = (senderPlayer.gold ?? 0) - offerGold + rGold;

    receiverPlayer.inventory = receiverInventory.filter(i => !returnItemIdSet.has(i.id)).concat(offerItems);
    receiverPlayer.gold = (receiverPlayer.gold ?? 0) - rGold + offerGold;

    senderData.player = senderPlayer;
    receiverData.player = receiverPlayer;

    await client.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [trade.from_user_id, JSON.stringify(senderData)]
    );
    await client.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [req.userId, JSON.stringify(receiverData)]
    );

    await client.query(
      `UPDATE trades SET status = 'completed', return_items = $1, return_gold = $2 WHERE id = $3`,
      [JSON.stringify(rItems), rGold, trade.id]
    );

    await client.query('COMMIT');
    res.json({ ok: true, receivedItems: offerItems, receivedGold: offerGold });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Trade accept error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Decline a trade
router.post('/:id/decline', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trades WHERE id = $1', [req.params.id]);
    const trade = result.rows[0];
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    if (trade.to_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not your trade to decline' });
    }
    if (trade.status !== 'pending') {
      return res.status(400).json({ error: 'Trade already handled' });
    }

    await pool.query('UPDATE trades SET status = $1 WHERE id = $2', ['declined', trade.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Trade decline error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel own outgoing trade
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trades WHERE id = $1', [req.params.id]);
    const trade = result.rows[0];
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    if (trade.from_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not your trade to cancel' });
    }
    if (trade.status !== 'pending') {
      return res.status(400).json({ error: 'Trade already handled' });
    }

    await pool.query('UPDATE trades SET status = $1 WHERE id = $2', ['cancelled', trade.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Trade cancel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
