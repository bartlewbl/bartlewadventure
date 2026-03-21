// Arena system - generates NPC opponents that mirror player-like stats
// Opponents are generated based on the player's level and class system.

import { CHARACTER_CLASSES, expForLevel } from '../data/gameData';
import { generateItem } from './loot';

const CLASS_IDS = Object.keys(CHARACTER_CLASSES);

const ARENA_NAMES = [
  'Iron Fang', 'Crimson Edge', 'Shadow Vex', 'Volt Strike', 'Neon Blade',
  'Pixel Fury', 'Ash Render', 'Rust Knuckle', 'Storm Cell', 'Void Drift',
  'Blaze Wire', 'Frost Spike', 'Grim Hack', 'Data Slash', 'Chrome Bite',
  'Hex Pulse', 'Glitch Fist', 'Warp Claw', 'Rift Jaw', 'Null Edge',
  'Torch Burn', 'Echo Blade', 'Dusk Fang', 'Bright Scar', 'Havoc Rend',
  'Shard Pierce', 'Flare Dust', 'Grave Bolt', 'Thorn Axe', 'Quake Palm',
];

// Equipment slots that can be randomized
const EQUIP_SLOTS = ['weapon', 'shield', 'helmet', 'armor', 'gloves', 'boots', 'belt', 'cape', 'amulet', 'accessory'];
const SLOT_TO_ITEM_TYPE = {
  weapon: 'sword', shield: 'shield', helmet: 'helmet', armor: 'armor',
  gloves: 'gloves', boots: 'boots', belt: 'belt', cape: 'cape',
  amulet: 'amulet', accessory: 'ring',
};

/**
 * Determines which equipment slots the arena opponent has equipped.
 * Returns one of: 'all', 'partial', 'none' and the actual equipment object.
 */
function rollEquipmentMode() {
  const roll = Math.random();
  if (roll < 0.35) return 'all';
  if (roll < 0.75) return 'partial';
  return 'none';
}

/**
 * Generate equipment for an arena opponent at a given level.
 */
function generateOpponentEquipment(level, mode) {
  const equipment = { weapon: null, shield: null, helmet: null, armor: null, gloves: null, boots: null, belt: null, cape: null, amulet: null, accessory: null, accessory2: null };
  if (mode === 'none') return equipment;

  let slots = [...EQUIP_SLOTS];
  if (mode === 'partial') {
    // Keep 3-6 random slots
    const keepCount = 3 + Math.floor(Math.random() * 4);
    slots.sort(() => Math.random() - 0.5);
    slots = slots.slice(0, keepCount);
  }

  for (const slot of slots) {
    const itemType = SLOT_TO_ITEM_TYPE[slot];
    if (!itemType) continue;
    const item = generateItem(itemType, level);
    if (item) {
      equipment[slot] = item;
    }
  }
  return equipment;
}

/**
 * Simulate stat growth for an NPC of a given class up to a given level.
 * Uses the same growth rates as player classes with some randomness.
 */
function simulateStats(classId, level) {
  const cls = CHARACTER_CLASSES[classId];
  if (!cls) return null;

  const stats = { ...cls.baseStats };

  for (let i = 2; i <= level; i++) {
    const g = cls.growth;
    stats.maxHp += g.hp + Math.floor(Math.random() * (g.hpRand + 1));
    stats.maxMana += g.mana + Math.floor(Math.random() * (g.manaRand + 1));
    stats.baseAtk += g.atk + Math.floor(Math.random() * (g.atkRand + 1));
    stats.baseDef += g.def + Math.floor(Math.random() * (g.defRand + 1));
    stats.charisma += g.charisma + Math.floor(Math.random() * (g.charismaRand + 1));
    stats.wisdom += g.wisdom + Math.floor(Math.random() * (g.wisdomRand + 1));
    stats.athletics += g.athletics + Math.floor(Math.random() * (g.athleticsRand + 1));
    stats.speed += g.speed + Math.floor(Math.random() * (g.speedRand + 1));
    stats.evasion += g.evasion + Math.floor(Math.random() * (g.evasionRand + 1));
    stats.accuracy += g.accuracy + Math.floor(Math.random() * (g.accuracyRand + 1));
    stats.resistance += g.resistance + Math.floor(Math.random() * (g.resistanceRand + 1));
    stats.tenacity += g.tenacity + Math.floor(Math.random() * (g.tenacityRand + 1));
    stats.aggression += g.aggression + Math.floor(Math.random() * (g.aggressionRand + 1));
    stats.luck += g.luck + Math.floor(Math.random() * (g.luckRand + 1));
    stats.fortitude += g.fortitude + Math.floor(Math.random() * (g.fortitudeRand + 1));
  }

  return stats;
}

/**
 * Calculate minimum wager for arena at a given level.
 * Level 5: 100g base, +20g per level above 5.
 */
export function getMinWager(playerLevel) {
  return 100 + Math.max(0, playerLevel - 5) * 20;
}

/**
 * Generate a single arena opponent monster-like object for combat.
 * The opponent is similar in power to a player of the given level.
 * @param {number} playerLevel - The player's current level
 * @param {number} levelOffset - Extra levels to add (for unfair arena: positive = stronger)
 * @returns {object} A monster-compatible object for the battle system
 */
export function generateArenaOpponent(playerLevel, levelOffset = 0) {
  const classId = CLASS_IDS[Math.floor(Math.random() * CLASS_IDS.length)];
  const cls = CHARACTER_CLASSES[classId];
  const opponentLevel = Math.max(1, playerLevel + levelOffset);

  const equipMode = rollEquipmentMode();
  const equipment = generateOpponentEquipment(opponentLevel, equipMode);

  // Simulate base stats from class growth
  const stats = simulateStats(classId, opponentLevel);

  // Calculate equipment bonuses
  let equipAtk = 0;
  let equipDef = 0;
  for (const item of Object.values(equipment)) {
    if (item) {
      equipAtk += item.atk || 0;
      equipDef += item.def || 0;
    }
  }

  const name = ARENA_NAMES[Math.floor(Math.random() * ARENA_NAMES.length)];

  const equipLabel = equipMode === 'all' ? 'Fully Equipped' : equipMode === 'partial' ? 'Partly Equipped' : 'Unequipped';

  return {
    id: `arena-${classId}-${opponentLevel}`,
    name: `${name} the ${cls.name}`,
    sprite: 'vagrant',
    level: opponentLevel,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    atk: stats.baseAtk + equipAtk,
    def: stats.baseDef + equipDef,
    speed: stats.speed,
    exp: 0,       // arena doesn't give exp
    gold: 0,      // gold is handled by wager system
    isBoss: false,
    isArenaOpponent: true,
    arenaClassId: classId,
    arenaClassName: cls.name,
    arenaClassColor: cls.color,
    arenaEquipMode: equipLabel,
    arenaLevel: opponentLevel,
    skills: [cls.skillName?.toLowerCase().replace(/\s+/g, '-') || 'slash'],
    // Use class skill for the opponent
    classSkill: {
      name: cls.skillName,
      multiplier: cls.skillMultiplier,
      effect: cls.skillEffect,
      manaCost: cls.skillManaCost,
    },
    dropTable: [], // no regular drops
  };
}

/**
 * Arena tier definitions.
 */
export const ARENA_TIERS = [
  {
    id: 'normal',
    name: 'Proving Grounds',
    description: 'Duel a single opponent near your level. Win to double your wager.',
    levelReq: 5,
    levelOffset: () => Math.floor(Math.random() * 3) - 1, // -1 to +1
  },
  {
    id: 'gauntlet',
    name: 'The Gauntlet',
    description: 'Fight opponents back-to-back. Keep winning to keep doubling your wager. One loss and it\'s over.',
    levelReq: 15,
    levelOffset: () => Math.floor(Math.random() * 3) - 1, // -1 to +1
  },
  {
    id: 'highstakes',
    name: 'High Stakes Pit',
    description: 'Unfair fights against stronger opponents. Bet everything you have. Great rewards if you survive.',
    levelReq: 30,
    levelOffset: () => 3 + Math.floor(Math.random() * 5), // +3 to +7 levels higher
  },
];

/**
 * Calculate high-stakes reward based on wager amount (all gold).
 * Returns an object with bonus gold and possibly a reward item.
 */
export function getHighStakesReward(wagerAmount, playerLevel) {
  // Win back wager + 1.5x bonus (so total = wager * 2.5)
  const bonusGold = Math.floor(wagerAmount * 1.5);

  // Chance for a bonus item at higher wagers
  let rewardItem = null;
  if (wagerAmount >= 500) {
    const itemTypes = ['sword', 'armor', 'shield', 'helmet', 'cape', 'amulet', 'ring'];
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    rewardItem = generateItem(type, playerLevel + 2);
  }

  return { bonusGold, rewardItem };
}
