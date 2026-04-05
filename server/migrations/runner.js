// Simple migration runner using a migrations table to track applied migrations.

import { up as m001 } from './001_buff_enemy_difficulty.js';

const MIGRATIONS = [
  { id: '001_buff_enemy_difficulty', up: m001 },
];

export async function runMigrations(pool) {
  // Ensure migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query('SELECT id FROM migrations');
  const applied = new Set(rows.map(r => r.id));

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    console.log(`Running migration: ${migration.id}`);
    await migration.up(pool);
    await pool.query(
      'INSERT INTO migrations (id) VALUES ($1)',
      [migration.id]
    );
  }
}
