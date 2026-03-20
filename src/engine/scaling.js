// Monster and boss scaling functions

import { MONSTERS, BOSSES, getMonsterBaseSpeed, BOSS_GIMMICKS } from '../data/gameData';
import { prob } from '../data/probabilityStore';

// Scale a gold reward by player level.
export function scaleRewardByLevel(baseGold, playerLevel) {
  return Math.floor(baseGold * (1 + (playerLevel - 1) * prob('scaling.goldPerLevel')));
}

export function scaleMonster(monsterId, areaLevel) {
  const base = MONSTERS[monsterId];
  if (!base) return null;
  const scale = 1 + (areaLevel - 1) * prob('scaling.monsterLevelScale');
  const hp = Math.floor(base.baseHp * scale * prob('scaling.monsterHpMult'));
  const baseSpeed = getMonsterBaseSpeed(base);
  return {
    id: monsterId,
    name: base.name,
    sprite: base.sprite,
    maxHp: hp,
    hp,
    atk: Math.floor(base.baseAtk * scale * prob('scaling.monsterAtkMult')),
    def: Math.floor(base.baseDef * scale * prob('scaling.monsterDefMult')),
    speed: Math.floor(baseSpeed * (1 + (areaLevel - 1) * 0.02)),
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * prob('scaling.monsterGoldVariance')),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
  };
}

export function scaleBoss(bossId, areaLevel) {
  const base = BOSSES[bossId];
  if (!base) return null;
  const scale = 1 + (areaLevel - 1) * prob('scaling.bossLevelScale');
  const hp = Math.floor(base.baseHp * scale * prob('scaling.monsterHpMult'));
  const baseSpeed = getMonsterBaseSpeed(base);
  const gimmick = BOSS_GIMMICKS[bossId] || null;
  return {
    id: bossId,
    name: base.name,
    sprite: base.sprite,
    isBoss: true,
    title: base.title,
    maxHp: hp,
    hp,
    atk: Math.floor(base.baseAtk * scale * prob('scaling.monsterAtkMult')),
    def: Math.floor(base.baseDef * scale * prob('scaling.monsterDefMult')),
    speed: Math.floor(baseSpeed * (1 + (areaLevel - 1) * 0.02)),
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * prob('scaling.bossGoldVariance')),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
    gimmick,
  };
}
