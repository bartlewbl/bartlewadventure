// Monster and boss scaling functions

import { MONSTERS, BOSSES, getMonsterBaseSpeed, getMonsterBaseCombatStats, getMonsterElement, BOSS_GIMMICKS } from '../data/gameData';
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
  const cs = getMonsterBaseCombatStats(base);
  const statScale = 1 + (areaLevel - 1) * 0.03;
  return {
    id: monsterId,
    name: base.name,
    sprite: base.sprite,
    maxHp: hp,
    hp,
    atk: Math.floor(base.baseAtk * scale * prob('scaling.monsterAtkMult')),
    def: Math.floor(base.baseDef * scale * prob('scaling.monsterDefMult')),
    speed: Math.floor(baseSpeed * (1 + (areaLevel - 1) * 0.02)),
    evasion: Math.floor(cs.evasion * statScale),
    accuracy: Math.floor(cs.accuracy * statScale),
    resistance: Math.floor(cs.resistance * statScale),
    tenacity: Math.floor(cs.tenacity * statScale),
    aggression: Math.floor(cs.aggression * statScale),
    luck: Math.floor(cs.luck * statScale),
    fortitude: Math.floor(cs.fortitude * statScale),
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * prob('scaling.monsterGoldVariance')),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
    element: getMonsterElement(base),
  };
}

export function scaleBoss(bossId, areaLevel) {
  const base = BOSSES[bossId];
  if (!base) return null;
  const scale = 1 + (areaLevel - 1) * prob('scaling.bossLevelScale');
  const hp = Math.floor(base.baseHp * scale * prob('scaling.monsterHpMult'));
  const baseSpeed = getMonsterBaseSpeed(base);
  const cs = getMonsterBaseCombatStats(base);
  const statScale = 1 + (areaLevel - 1) * 0.04; // bosses scale combat stats faster
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
    evasion: Math.floor(cs.evasion * statScale) + 2,
    accuracy: Math.floor(cs.accuracy * statScale) + 2,
    resistance: Math.floor(cs.resistance * statScale) + 2,
    tenacity: Math.floor(cs.tenacity * statScale) + 3,
    aggression: Math.floor(cs.aggression * statScale) + 1,
    luck: Math.floor(cs.luck * statScale) + 2,
    fortitude: Math.floor(cs.fortitude * statScale) + 3,
    exp: Math.floor(base.baseExp * scale),
    gold: Math.floor(base.baseGold * scale) + Math.floor(Math.random() * prob('scaling.bossGoldVariance')),
    skills: base.skills,
    dropTable: base.dropTable,
    level: areaLevel,
    element: getMonsterElement(base),
    gimmick,
  };
}
