// Migration 001: Buff enemy difficulty
// Increases monster scaling multipliers, crit stats, and skill chance.
// Does NOT change boss-only values (bossLevelScale stays at 0.25 -> 0.32 was set in defaults).

const UPDATES = [
  // Scaling - monsters hit harder, tankier, scale faster per level
  { key: 'scaling.monsterHpMult', value: 1.65 },
  { key: 'scaling.monsterAtkMult', value: 1.45 },
  { key: 'scaling.monsterDefMult', value: 1.35 },
  { key: 'scaling.monsterLevelScale', value: 0.3 },
  { key: 'scaling.bossLevelScale', value: 0.32 },

  // Combat - monsters crit more often and harder, use skills more
  { key: 'combat.monsterCritBase', value: 0.05 },
  { key: 'combat.monsterCritPerLevel', value: 0.001 },
  { key: 'combat.monsterCritCap', value: 0.12 },
  { key: 'combat.monsterCritMultiplier', value: 1.6 },
  { key: 'combat.monsterSkillChance', value: 0.4 },
];

export async function up(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { key, value } of UPDATES) {
      await client.query(
        `UPDATE probability_config SET value = $1, updated_at = NOW() WHERE key = $2`,
        [value, key]
      );
    }
    await client.query('COMMIT');
    console.log('Migration 001: Buffed enemy difficulty');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
