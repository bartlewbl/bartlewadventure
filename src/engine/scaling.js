// Monster and boss scaling functions

import { MONSTERS, BOSSES } from '../data/gameData';

// Scale a gold reward by player level.
// Each level adds 2% more gold (e.g. level 10 = +18% gold).
export function scaleRewardByLevel(baseGold, playerLevel) {
  return Math.floor(baseGold * (1 + (playerLevel - 1) * 0.02));
}

// Extra equipment slots (gloves, amulet, belt, cape, ring 2) give players
// significantly more stats, so monsters are buffed to compensate.
const MONSTER_HP_MULT = 1.25;
const MONSTER_ATK_MULT = 1.15;
const MONSTER_DEF_MULT = 1.15;

export function scaleMonster(monsterId, areaLevel) {
  const base = MONSTERS[monsterId];
  if (!base) return null;
  const scale = 1 + (areaLevel - 1) * 0.2;
  const hp = Math.floor(base.baseHp * scale * MONSTER_HP_MULT);
  return {
    id: monsterId,
    name: base.name,
    sprite: base.sprite,
    maxHp: hp,
    hp,
    atk: Math.floor(base.baseAtk * scale * MONSTER_ATK_MULT),
    def: Math.floor(base.baseDef * scale * MONSTER_DEF_MULT),
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * 5),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
  };
}

export function scaleBoss(bossId, areaLevel) {
  const base = BOSSES[bossId];
  if (!base) return null;
  const scale = 1 + (areaLevel - 1) * 0.25;
  const hp = Math.floor(base.baseHp * scale * MONSTER_HP_MULT);
  return {
    id: bossId,
    name: base.name,
    sprite: base.sprite,
    isBoss: true,
    title: base.title,
    maxHp: hp,
    hp,
    atk: Math.floor(base.baseAtk * scale * MONSTER_ATK_MULT),
    def: Math.floor(base.baseDef * scale * MONSTER_DEF_MULT),
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * 15),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
  };
}
