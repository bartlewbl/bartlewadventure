import { Router } from 'express';
import pool from '../db.js';

const router = Router();

const LISTING_FEE_PERCENT = 0.05; // 5% listing fee
const SALE_TAX_PERCENT = 0.10;    // 10% tax on sale proceeds
const MIN_PRICE = 10;
const MAX_PRICE = 999999;
const MAX_ACTIVE_LISTINGS = 8;
const MIN_LEVEL = 10;

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

function getItemCategory(item) {
  if (item.type === 'potion') return 'potions';
  if (item.type === 'energy-drink') return 'energy-drinks';
  if (item.slot === 'weapon') return 'weapons';
  if (item.slot === 'shield') return 'shields';
  if (item.slot === 'helmet') return 'helmets';
  if (item.slot === 'armor') return 'armor';
  if (item.slot === 'boots') return 'boots';
  if (item.slot === 'accessory') return 'accessories';
  return 'misc';
}

// List an item on the market
router.post('/list', requireAuth, async (req, res) => {
  const { itemId, price } = req.body;

  if (!itemId) {
    return res.status(400).json({ error: 'Item is required' });
  }
  if (!price || price < MIN_PRICE || price > MAX_PRICE) {
    return res.status(400).json({ error: `Price must be between ${MIN_PRICE} and ${MAX_PRICE} gold` });
  }

  const intPrice = Math.floor(price);

  try {
    // Load seller's save
    const saveResult = await pool.query('SELECT save_data FROM game_saves WHERE user_id = $1', [req.userId]);
    const sellerSave = saveResult.rows[0];
    if (!sellerSave) {
      return res.status(400).json({ error: 'No save data found' });
    }
    const saveData = JSON.parse(sellerSave.save_data);
    const player = saveData.player;

    // Check level requirement
    if ((player.level || 1) < MIN_LEVEL) {
      return res.status(403).json({ error: `You must be level ${MIN_LEVEL} or higher to use the market` });
    }

    // Check active listing count
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM market_listings WHERE seller_user_id = $1 AND status = 'active'",
      [req.userId]
    );
    if (parseInt(countResult.rows[0].count) >= MAX_ACTIVE_LISTINGS) {
      return res.status(400).json({ error: `You can only have ${MAX_ACTIVE_LISTINGS} active listings at a time` });
    }

    // Find the item in inventory
    const inventory = player.inventory || [];
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(400).json({ error: 'Item not found in your inventory' });
    }
    const item = inventory[itemIndex];

    // Calculate listing fee
    const listingFee = Math.max(1, Math.floor(intPrice * LISTING_FEE_PERCENT));
    if (player.gold < listingFee) {
      return res.status(400).json({ error: `Not enough gold for the listing fee (${listingFee}g)` });
    }

    // Remove item from inventory and deduct fee
    player.inventory = inventory.filter((_, i) => i !== itemIndex);
    player.gold -= listingFee;
    saveData.player = player;
    await pool.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [req.userId, JSON.stringify(saveData)]
    );

    // Create the listing
    const category = getItemCategory(item);
    const result = await pool.query(
      `INSERT INTO market_listings (seller_user_id, item_data, price, category, rarity, item_level, item_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') RETURNING id`,
      [req.userId, JSON.stringify(item), intPrice, category, item.rarity || 'Common', item.level || 1, item.name || 'Unknown Item']
    );

    res.json({
      ok: true,
      listingId: result.rows[0].id,
      listingFee,
      newGold: player.gold,
      removedItemId: itemId,
    });
  } catch (err) {
    console.error('Market list error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Browse market listings
router.get('/listings', requireAuth, async (req, res) => {
  const { category, search } = req.query;

  try {
    let result;
    if (search) {
      const term = `%${search}%`;
      result = await pool.query(
        `SELECT market_listings.*, users.username AS seller_name
         FROM market_listings
         JOIN users ON market_listings.seller_user_id = users.id
         WHERE market_listings.status = 'active'
           AND (market_listings.item_name ILIKE $1 OR market_listings.category ILIKE $1 OR market_listings.rarity ILIKE $1)
         ORDER BY market_listings.created_at DESC
         LIMIT 200`,
        [term]
      );
    } else if (category && category !== 'all') {
      result = await pool.query(
        `SELECT market_listings.*, users.username AS seller_name
         FROM market_listings
         JOIN users ON market_listings.seller_user_id = users.id
         WHERE market_listings.status = 'active' AND market_listings.category = $1
         ORDER BY market_listings.created_at DESC
         LIMIT 200`,
        [category]
      );
    } else {
      result = await pool.query(
        `SELECT market_listings.*, users.username AS seller_name
         FROM market_listings
         JOIN users ON market_listings.seller_user_id = users.id
         WHERE market_listings.status = 'active'
         ORDER BY market_listings.created_at DESC
         LIMIT 200`
      );
    }

    const parsed = result.rows.map(l => ({
      id: l.id,
      sellerName: l.seller_name,
      sellerId: l.seller_user_id,
      item: JSON.parse(l.item_data),
      price: l.price,
      category: l.category,
      rarity: l.rarity,
      itemLevel: l.item_level,
      itemName: l.item_name,
      createdAt: l.created_at,
    }));

    res.json({ listings: parsed });
  } catch (err) {
    console.error('Market listings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my listings (active + recently sold)
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const activeResult = await pool.query(
      `SELECT market_listings.*, users.username AS seller_name
       FROM market_listings
       JOIN users ON market_listings.seller_user_id = users.id
       WHERE market_listings.seller_user_id = $1 AND market_listings.status = 'active'
       ORDER BY market_listings.created_at DESC`,
      [req.userId]
    );

    const soldResult = await pool.query(
      `SELECT market_listings.*, users.username AS seller_name,
        u2.username AS buyer_name
       FROM market_listings
       JOIN users ON market_listings.seller_user_id = users.id
       LEFT JOIN users u2 ON market_listings.buyer_user_id = u2.id
       WHERE market_listings.seller_user_id = $1 AND market_listings.status = 'sold'
       ORDER BY market_listings.sold_at DESC
       LIMIT 20`,
      [req.userId]
    );

    const active = activeResult.rows.map(l => ({
      id: l.id,
      item: JSON.parse(l.item_data),
      price: l.price,
      category: l.category,
      rarity: l.rarity,
      itemName: l.item_name,
      status: l.status,
      createdAt: l.created_at,
    }));

    const sold = soldResult.rows.map(l => ({
      id: l.id,
      item: JSON.parse(l.item_data),
      price: l.price,
      category: l.category,
      rarity: l.rarity,
      itemName: l.item_name,
      status: l.status,
      buyerName: l.buyer_name,
      soldAt: l.sold_at,
    }));

    res.json({ active, sold });
  } catch (err) {
    console.error('My listings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buy an item from the market
router.post('/:id/buy', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const listingResult = await client.query('SELECT * FROM market_listings WHERE id = $1 FOR UPDATE', [req.params.id]);
    const listing = listingResult.rows[0];
    if (!listing) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (listing.status !== 'active') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This listing is no longer available' });
    }
    if (listing.seller_user_id === req.userId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot buy your own listing' });
    }

    // Load buyer's save
    const buyerSaveResult = await client.query('SELECT save_data FROM game_saves WHERE user_id = $1', [req.userId]);
    const buyerSave = buyerSaveResult.rows[0];
    if (!buyerSave) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No save data found' });
    }
    const buyerData = JSON.parse(buyerSave.save_data);
    const buyerPlayer = buyerData.player;

    if ((buyerPlayer.level || 1) < MIN_LEVEL) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: `You must be level ${MIN_LEVEL} or higher to use the market` });
    }
    if (buyerPlayer.gold < listing.price) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough gold' });
    }

    const buyerInv = buyerPlayer.inventory || [];
    const buyerMaxInv = buyerPlayer.maxInventory || 30;
    if (buyerInv.length >= buyerMaxInv) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your inventory is full' });
    }

    // Load seller's save
    const sellerSaveResult = await client.query('SELECT save_data FROM game_saves WHERE user_id = $1', [listing.seller_user_id]);
    const sellerSave = sellerSaveResult.rows[0];
    if (!sellerSave) {
      await client.query('ROLLBACK');
      return res.status(500).json({ error: 'Seller data not found' });
    }
    const sellerData = JSON.parse(sellerSave.save_data);
    const sellerPlayer = sellerData.player;

    const item = JSON.parse(listing.item_data);

    // Calculate sale tax
    const saleTax = Math.max(1, Math.floor(listing.price * SALE_TAX_PERCENT));
    const sellerProceeds = listing.price - saleTax;

    // Execute the purchase
    buyerPlayer.gold -= listing.price;
    buyerPlayer.inventory = [...buyerInv, item];
    buyerData.player = buyerPlayer;

    sellerPlayer.gold = (sellerPlayer.gold || 0) + sellerProceeds;
    sellerData.player = sellerPlayer;

    await client.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [req.userId, JSON.stringify(buyerData)]
    );
    await client.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [listing.seller_user_id, JSON.stringify(sellerData)]
    );

    await client.query(
      "UPDATE market_listings SET status = 'sold', buyer_user_id = $1, sold_at = NOW() WHERE id = $2",
      [req.userId, listing.id]
    );

    await client.query('COMMIT');
    res.json({ ok: true, item, price: listing.price, saleTax, newGold: buyerPlayer.gold });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Market buy error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Cancel own listing (item returned to inventory)
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const listingResult = await pool.query('SELECT * FROM market_listings WHERE id = $1', [req.params.id]);
    const listing = listingResult.rows[0];
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (listing.seller_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not your listing to cancel' });
    }
    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Listing is no longer active' });
    }

    // Return item to seller's inventory
    const saveResult = await pool.query('SELECT save_data FROM game_saves WHERE user_id = $1', [req.userId]);
    const sellerSave = saveResult.rows[0];
    if (!sellerSave) {
      return res.status(400).json({ error: 'No save data found' });
    }
    const saveData = JSON.parse(sellerSave.save_data);
    const player = saveData.player;
    const inventory = player.inventory || [];
    const maxInv = player.maxInventory || 30;

    if (inventory.length >= maxInv) {
      return res.status(400).json({ error: 'Your inventory is full. Make room before cancelling.' });
    }

    const item = JSON.parse(listing.item_data);
    player.inventory = [...inventory, item];
    saveData.player = player;
    await pool.query(
      `INSERT INTO game_saves (user_id, save_data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET save_data = $2, updated_at = NOW()`,
      [req.userId, JSON.stringify(saveData)]
    );

    await pool.query("UPDATE market_listings SET status = 'cancelled' WHERE id = $1", [listing.id]);

    res.json({ ok: true, returnedItem: item });
  } catch (err) {
    console.error('Market cancel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
