import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Default probability values — seeded on first access
const DEFAULTS = [
  // --- Combat ---
  { key: 'combat.damageVarianceLow', value: 0.85, category: 'Combat', label: 'Damage Variance Low', description: 'Minimum damage multiplier (0.85 = 85% of base)' },
  { key: 'combat.damageVarianceRange', value: 0.3, category: 'Combat', label: 'Damage Variance Range', description: 'Random range added to low variance (0.3 means 0.85-1.15)' },
  { key: 'combat.baseCritChance', value: 0.03, category: 'Combat', label: 'Base Crit Chance', description: 'Player base critical hit chance (3%)' },
  { key: 'combat.critPerAthletics', value: 0.002, category: 'Combat', label: 'Crit Per Athletics', description: 'Crit chance added per athletics point (+0.2%)' },
  { key: 'combat.critPerWisdom', value: 0.001, category: 'Combat', label: 'Crit Per Wisdom', description: 'Crit chance added per wisdom point (+0.1%)' },
  { key: 'combat.critCap', value: 0.20, category: 'Combat', label: 'Crit Chance Cap', description: 'Maximum player crit chance (20%)' },
  { key: 'combat.critMultiplier', value: 1.5, category: 'Combat', label: 'Crit Damage Multiplier', description: 'Damage multiplier on critical hit (1.5 = 150%)' },
  { key: 'combat.monsterCritBase', value: 0.05, category: 'Combat', label: 'Monster Crit Base', description: 'Base monster crit chance (5%)' },
  { key: 'combat.monsterCritPerLevel', value: 0.001, category: 'Combat', label: 'Monster Crit Per Level', description: 'Crit chance added per monster level' },
  { key: 'combat.monsterCritCap', value: 0.12, category: 'Combat', label: 'Monster Crit Cap', description: 'Maximum monster crit chance (12%)' },
  { key: 'combat.monsterCritMultiplier', value: 1.6, category: 'Combat', label: 'Monster Crit Multiplier', description: 'Monster crit damage multiplier' },
  { key: 'combat.monsterSkillChance', value: 0.4, category: 'Combat', label: 'Monster Skill Chance', description: 'Chance monster uses a skill instead of basic attack (40%)' },
  { key: 'combat.escapeChanceBase', value: 0.5, category: 'Combat', label: 'Escape Chance (Base)', description: 'Base escape chance from battle (50%)' },
  { key: 'combat.escapeChanceGreed', value: 0.75, category: 'Combat', label: 'Escape Chance (Greed)', description: 'Escape chance with Greed passive (75%)' },

  // --- Loot ---
  { key: 'loot.monsterDropChance', value: 0.10, category: 'Loot', label: 'Monster Loot Drop Chance', description: 'Chance a normal monster drops loot (10%)' },
  { key: 'loot.bossMaterialMin', value: 3, category: 'Loot', label: 'Boss Material Min', description: 'Minimum materials dropped by a boss' },
  { key: 'loot.bossMaterialMax', value: 5, category: 'Loot', label: 'Boss Material Max', description: 'Maximum materials dropped by a boss' },
  { key: 'loot.locationItemChance', value: 0.4, category: 'Loot', label: 'Location Item Chance', description: 'Chance to find a location-specific item vs generic (40%)' },
  { key: 'loot.shopEpicWeight', value: 0.02, category: 'Loot', label: 'Shop Epic Weight Mult', description: 'Weight multiplier for Epic items in shops (2%)' },
  { key: 'loot.shopLegendaryWeight', value: 0.002, category: 'Loot', label: 'Shop Legendary Weight Mult', description: 'Weight multiplier for Legendary items in shops (0.2%)' },

  // --- Exploration ---
  { key: 'explore.bossRate', value: 0.005, category: 'Exploration', label: 'Boss Encounter Rate', description: 'Chance to encounter a boss while exploring (0.5%)' },
  { key: 'explore.randomEventChance', value: 0.05, category: 'Exploration', label: 'Random Event Chance', description: 'Base chance for a random event during exploration (5%)' },
  { key: 'explore.goldFindChance', value: 0.3, category: 'Exploration', label: 'Gold Find Chance', description: 'Chance to find loose gold when no loot drops (30%)' },
  { key: 'explore.goldFindMin', value: 3, category: 'Exploration', label: 'Gold Find Min Mult', description: 'Minimum gold find multiplier (3 + random * level * 2)' },
  { key: 'explore.goldFindRange', value: 2, category: 'Exploration', label: 'Gold Find Range', description: 'Additional base gold above minimum' },

  // --- Scaling ---
  { key: 'scaling.monsterHpMult', value: 1.65, category: 'Scaling', label: 'Monster HP Multiplier', description: 'HP multiplier for all monsters (1.65 = +65%)' },
  { key: 'scaling.monsterAtkMult', value: 1.45, category: 'Scaling', label: 'Monster ATK Multiplier', description: 'ATK multiplier for all monsters (1.45 = +45%)' },
  { key: 'scaling.monsterDefMult', value: 1.35, category: 'Scaling', label: 'Monster DEF Multiplier', description: 'DEF multiplier for all monsters (1.35 = +35%)' },
  { key: 'scaling.monsterLevelScale', value: 0.3, category: 'Scaling', label: 'Monster Level Scale', description: 'Per-level scaling for monsters (30% per level)' },
  { key: 'scaling.bossLevelScale', value: 0.32, category: 'Scaling', label: 'Boss Level Scale', description: 'Per-level scaling for bosses (32% per level)' },
  { key: 'scaling.goldPerLevel', value: 0.02, category: 'Scaling', label: 'Gold Per Level', description: 'Gold reward increase per player level (2%)' },
  { key: 'scaling.monsterGoldVariance', value: 5, category: 'Scaling', label: 'Monster Gold Variance', description: 'Max random bonus gold from monsters' },
  { key: 'scaling.bossGoldVariance', value: 15, category: 'Scaling', label: 'Boss Gold Variance', description: 'Max random bonus gold from bosses' },

  // --- Passives: Heal/Drain ---
  { key: 'passive.lifetapHeal', value: 0.15, category: 'Passives', label: 'Lifetap Heal %', description: 'Necromancer Lifetap: heal % of damage on attacks (15%)' },
  { key: 'passive.vampiricAura', value: 0.10, category: 'Passives', label: 'Vampiric Aura Heal %', description: 'Heal % of all damage dealt (10%)' },
  { key: 'passive.soulSiphonChance', value: 0.25, category: 'Passives', label: 'Soul Siphon Chance', description: 'Chance to restore 5 mana on attack (25%)' },
  { key: 'passive.bloodlustHeal', value: 0.20, category: 'Passives', label: 'Bloodlust Heal %', description: 'Heal % of damage when below 30% HP (20%)' },
  { key: 'passive.regeneration', value: 0.03, category: 'Passives', label: 'Regeneration Heal %', description: 'Warrior regen: heal % of max HP per turn (3%)' },
  { key: 'passive.endurance', value: 0.05, category: 'Passives', label: 'Endurance Heal %', description: 'Endurance: heal % of max HP per turn (5%)' },
  { key: 'passive.indestructible', value: 0.08, category: 'Passives', label: 'Indestructible Heal %', description: 'Indestructible: heal % of max HP per turn (8%)' },
  { key: 'passive.soulFortressHeal', value: 0.05, category: 'Passives', label: 'Soul Fortress Heal %', description: 'Soul Fortress: heal % of max HP per turn (5%)' },
  { key: 'passive.darkPactDrain', value: 0.05, category: 'Passives', label: 'Dark Pact Drain %', description: 'Dark Pact: HP sacrifice per turn (5%)' },
  { key: 'passive.darkPactUpgradedDrain', value: 0.03, category: 'Passives', label: 'Dark Pact Upgraded Drain %', description: 'Dark Pact with Undying Servitude drain (3%)' },
  { key: 'passive.pactOfUndeath', value: 0.01, category: 'Passives', label: 'Pact of Undeath Drain %', description: 'Pact of Undeath: HP drain per turn (1%)' },
  { key: 'passive.manaRegen', value: 0.08, category: 'Passives', label: 'Mana Regen %', description: 'Mana Regeneration: restore % of max mana per turn (8%)' },
  { key: 'passive.leylineTap', value: 0.12, category: 'Passives', label: 'Leyline Tap %', description: 'Leyline Tap: restore % of max mana per turn (12%)' },

  // --- Passives: Dodge ---
  { key: 'passive.shadowStep', value: 0.15, category: 'Passives', label: 'Shadow Step Dodge', description: 'Shadow Step dodge chance (15%)' },
  { key: 'passive.evasionMastery', value: 0.10, category: 'Passives', label: 'Evasion Mastery Dodge', description: 'Evasion Mastery additional dodge (10%)' },
  { key: 'passive.cloakOfShadows', value: 0.20, category: 'Passives', label: 'Cloak of Shadows Dodge', description: 'Cloak of Shadows additional dodge (20%)' },
  { key: 'passive.phantomExistence', value: 0.50, category: 'Passives', label: 'Phantom Existence Dodge', description: 'Phantom Existence additional dodge (50%)' },
  { key: 'passive.livingShadow', value: 0.75, category: 'Passives', label: 'Living Shadow Dodge', description: 'Living Shadow additional dodge (75%)' },
  { key: 'passive.dodgeCap', value: 0.90, category: 'Passives', label: 'Dodge Chance Cap', description: 'Maximum dodge chance (90%)' },
  { key: 'passive.aegisChance', value: 0.15, category: 'Passives', label: 'Aegis Block Chance', description: 'Aegis chance to fully block (15%)' },
  { key: 'passive.aegisUpgraded', value: 0.25, category: 'Passives', label: 'Aegis+ Block Chance', description: 'Aegis upgraded chance to fully block (25%)' },
  { key: 'passive.smokeBomb', value: 0.25, category: 'Passives', label: 'Smoke Bomb Dodge Chance', description: 'Smoke Bomb chance to dodge after hit (25%)' },
  { key: 'passive.cursedBlood', value: 0.20, category: 'Passives', label: 'Cursed Blood Poison Chance', description: 'Cursed Blood chance to poison attacker (20%)' },

  // --- Passives: Combat Procs ---
  { key: 'passive.bladeDance', value: 0.10, category: 'Passives', label: 'Blade Dance Chance', description: 'Blade Dance chance to double attack (10%)' },
  { key: 'passive.swiftStrikes', value: 0.20, category: 'Passives', label: 'Swift Strikes Bonus', description: 'Swift Strikes additional double attack chance (20%)' },
  { key: 'passive.luckyStrike', value: 0.20, category: 'Passives', label: 'Lucky Strike Chance', description: 'Lucky Strike chance for double damage (20%)' },
  { key: 'passive.opportunityStrikes', value: 0.35, category: 'Passives', label: 'Opportunity Strikes Chance', description: 'Opportunity Strikes upgraded lucky strike (35%)' },
  { key: 'passive.spellEcho', value: 0.20, category: 'Passives', label: 'Spell Echo Chance', description: 'Spell Echo chance for double spell damage (20%)' },
  { key: 'passive.spellEchoUpgraded', value: 0.35, category: 'Passives', label: 'Spell Echo+ Chance', description: 'Spell Echo upgraded chance (35%)' },

  // --- Passives: Damage Reduction ---
  { key: 'passive.defendBlock', value: 0.5, category: 'Passives', label: 'Defend Block Rate', description: 'Normal defend blocks this % of damage (50%)' },
  { key: 'passive.fortifyBlock', value: 0.3, category: 'Passives', label: 'Fortify Block Rate', description: 'Fortify passive block rate (30%)' },
  { key: 'passive.bulwarkBlock', value: 0.15, category: 'Passives', label: 'Bulwark Block Rate', description: 'Bulwark block rate (15% = 85% reduction)' },
  { key: 'passive.phalanxBlock', value: 0.05, category: 'Passives', label: 'Phalanx Block Rate', description: 'Phalanx block rate (5% = 95% reduction)' },
  { key: 'passive.ironSkin', value: 0.9, category: 'Passives', label: 'Iron Skin Mult', description: 'Iron Skin damage multiplier (0.9 = 10% less)' },
  { key: 'passive.thickSkin', value: 0.92, category: 'Passives', label: 'Thick Skin Mult', description: 'Thick Skin damage multiplier (0.92 = 8% less)' },
  { key: 'passive.fortress', value: 0.8, category: 'Passives', label: 'Fortress Mult', description: 'Fortress damage multiplier (0.8 = 20% less)' },
  { key: 'passive.soulFortressDR', value: 0.85, category: 'Passives', label: 'Soul Fortress DR Mult', description: 'Soul Fortress damage reduction (0.85 = 15% less)' },
  { key: 'passive.eternalGuardian', value: 0.5, category: 'Passives', label: 'Eternal Guardian Mult', description: 'Eternal Guardian damage multiplier (0.5 = 50% less)' },
  { key: 'passive.battleHardenedRate', value: 0.02, category: 'Passives', label: 'Battle Hardened Rate', description: 'Damage reduction gain per turn (2%)' },
  { key: 'passive.battleHardenedCap', value: 0.40, category: 'Passives', label: 'Battle Hardened Cap', description: 'Maximum Battle Hardened reduction (40%)' },

  // --- Material Drops ---
  { key: 'material.neonDistrict', value: 0.07, category: 'Material Drops', label: 'Neon District Drop Rate', description: 'Material drop rate in Neon District (7%)' },
  { key: 'material.frozenWastes', value: 0.09, category: 'Material Drops', label: 'Frozen Wastes Drop Rate', description: 'Material drop rate in Frozen Wastes (9%)' },
  { key: 'material.scorchedBadlands', value: 0.09, category: 'Material Drops', label: 'Scorched Badlands Drop Rate', description: 'Material drop rate in Scorched Badlands (9%)' },
  { key: 'material.toxicMarshlands', value: 0.10, category: 'Material Drops', label: 'Toxic Marshlands Drop Rate', description: 'Material drop rate in Toxic Marshlands (10%)' },
  { key: 'material.abyssalDepths', value: 0.10, category: 'Material Drops', label: 'Abyssal Depths Drop Rate', description: 'Material drop rate in Abyssal Depths (10%)' },
  { key: 'material.celestialHighlands', value: 0.12, category: 'Material Drops', label: 'Celestial Highlands Drop Rate', description: 'Material drop rate in Celestial Highlands (12%)' },
  { key: 'material.voidNexus', value: 0.14, category: 'Material Drops', label: 'Void Nexus Drop Rate', description: 'Material drop rate in Void Nexus (14%)' },

  // --- Egg Drops ---
  { key: 'egg.neonDistrict', value: 0.002, category: 'Egg Drops', label: 'Neon District Egg Rate', description: 'Egg drop rate in Neon District (0.2%)' },
  { key: 'egg.frozenWastes', value: 0.003, category: 'Egg Drops', label: 'Frozen Wastes Egg Rate', description: 'Egg drop rate in Frozen Wastes (0.3%)' },
  { key: 'egg.scorchedBadlands', value: 0.004, category: 'Egg Drops', label: 'Scorched Badlands Egg Rate', description: 'Egg drop rate in Scorched Badlands (0.4%)' },
  { key: 'egg.toxicMarshlands', value: 0.004, category: 'Egg Drops', label: 'Toxic Marshlands Egg Rate', description: 'Egg drop rate in Toxic Marshlands (0.4%)' },
  { key: 'egg.abyssalDepths', value: 0.005, category: 'Egg Drops', label: 'Abyssal Depths Egg Rate', description: 'Egg drop rate in Abyssal Depths (0.5%)' },
  { key: 'egg.celestialHighlands', value: 0.006, category: 'Egg Drops', label: 'Celestial Highlands Egg Rate', description: 'Egg drop rate in Celestial Highlands (0.6%)' },
  { key: 'egg.voidNexus', value: 0.007, category: 'Egg Drops', label: 'Void Nexus Egg Rate', description: 'Egg drop rate in Void Nexus (0.7%)' },

  // --- Energy ---
  { key: 'energy.regenRate', value: 0.1, category: 'Energy', label: 'Energy Regen Rate', description: 'Percentage of max energy regenerated per interval (10%)' },
  { key: 'energy.regenIntervalMin', value: 15, category: 'Energy', label: 'Energy Regen Interval (min)', description: 'Minutes between energy regeneration ticks' },

  // --- Charisma ---
  { key: 'charisma.pricePerPoint', value: 0.01, category: 'Charisma', label: 'Price Bonus Per Point', description: 'Price discount per charisma point (1%)' },
  { key: 'charisma.priceCap', value: 0.25, category: 'Charisma', label: 'Price Bonus Cap', description: 'Maximum charisma price discount (25%)' },
];

// Seed defaults if table is empty
async function seedDefaults() {
  const countResult = await pool.query('SELECT COUNT(*) as cnt FROM probability_config');
  const { cnt } = countResult.rows[0];
  if (parseInt(cnt) === 0) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const d of DEFAULTS) {
        await client.query(
          `INSERT INTO probability_config (key, value, category, label, description, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [d.key, d.value, d.category, d.label, d.description || '']
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Seed defaults error:', err);
    } finally {
      client.release();
    }
  }
}

// Seed on import
seedDefaults().catch(err => console.error('Seed error:', err));

// GET all probability configs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value, category, label, description FROM probability_config ORDER BY category, key');
    res.json({ configs: result.rows });
  } catch (err) {
    console.error('Probability config get error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update a single config value
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (value == null || typeof value !== 'number') {
    return res.status(400).json({ error: 'Value must be a number' });
  }
  try {
    const existing = await pool.query('SELECT key, value, category, label, description FROM probability_config WHERE key = $1', [key]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Config key not found' });
    }
    const row = existing.rows[0];
    await pool.query(
      `INSERT INTO probability_config (key, value, category, label, description, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value, row.category, row.label, row.description]
    );
    res.json({ ok: true, key, value });
  } catch (err) {
    console.error('Probability config update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST bulk update multiple configs
router.post('/bulk', async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Updates must be an array of { key, value }' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { key, value } of updates) {
      if (typeof value !== 'number') continue;
      const existing = await client.query('SELECT key, category, label, description FROM probability_config WHERE key = $1', [key]);
      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        await client.query(
          `INSERT INTO probability_config (key, value, category, label, description, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [key, value, row.category, row.label, row.description]
        );
      }
    }
    await client.query('COMMIT');
    const result = await pool.query('SELECT key, value, category, label, description FROM probability_config ORDER BY category, key');
    res.json({ ok: true, configs: result.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// POST reset all to defaults
router.post('/reset', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const d of DEFAULTS) {
      await client.query(
        `INSERT INTO probability_config (key, value, category, label, description, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [d.key, d.value, d.category, d.label, d.description || '']
      );
    }
    await client.query('COMMIT');
    const result = await pool.query('SELECT key, value, category, label, description FROM probability_config ORDER BY category, key');
    res.json({ ok: true, configs: result.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

export default router;
