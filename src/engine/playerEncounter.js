// Player encounter system - generates AI-controlled "player" enemies
// that use real class stats, equipment, and skills during exploration.

import { CHARACTER_CLASSES } from '../data/gameData';
import { generateItem } from './loot';

const CLASS_IDS = Object.keys(CHARACTER_CLASSES);

// Names for encountered players — cyberpunk / wasteland themed
const ENCOUNTER_NAMES = [
  'Neon Ghost', 'Scrap Baron', 'Wire Phantom', 'Rust Prowler', 'Grim Circuit',
  'Ash Drifter', 'Volt Runner', 'Data Wraith', 'Chrome Stalker', 'Glitch Hunter',
  'Shard Breaker', 'Hollow Jack', 'Flare Nomad', 'Slag Fist', 'Torn Signal',
  'Null Walker', 'Hex Vagrant', 'Smog Dancer', 'Bright Ruin', 'Echo Scar',
  'Dusk Raider', 'Storm Picker', 'Warp Shade', 'Blaze Hopper', 'Rift Lurker',
  'Gutter King', 'Spark Thief', 'Venom Patch', 'Iron Haze', 'Pixel Rogue',
  'Dead Signal', 'Torch Drifter', 'Grave Static', 'Arc Fang', 'Dust Render',
];

const EQUIP_SLOTS = ['weapon', 'shield', 'helmet', 'armor', 'gloves', 'boots', 'belt', 'cape', 'amulet', 'accessory'];
const SLOT_TO_ITEM_TYPE = {
  weapon: 'sword', shield: 'shield', helmet: 'helmet', armor: 'armor',
  gloves: 'gloves', boots: 'boots', belt: 'belt', cape: 'cape',
  amulet: 'amulet', accessory: 'ring',
};

// Class-specific skill IDs that exist in the SKILLS constant (monster skill pool)
// These let encountered players use thematic attacks during combat
const CLASS_COMBAT_SKILLS = {
  berserker:   ['frenzy', 'bash', 'charge'],
  warrior:     ['bash', 'slam', 'charge'],
  thief:       ['backstab', 'venom', 'shadowstrike'],
  mage:        ['shock', 'inferno', 'voidblast'],
  necromancer: ['drain', 'venom', 'deathgrip'],
};

/**
 * Generate equipment for an encountered player at a given level.
 * Always equips at least a weapon; other slots have diminishing chance.
 */
function generateEncounterEquipment(level) {
  const equipment = {
    weapon: null, shield: null, helmet: null, armor: null,
    gloves: null, boots: null, belt: null, cape: null,
    amulet: null, accessory: null, accessory2: null,
  };

  // Always has a weapon
  const weaponItem = generateItem('sword', level);
  if (weaponItem) equipment.weapon = weaponItem;

  // Other slots: 70% chance each, decreasing slightly for accessories
  const slotChances = {
    shield: 0.55, helmet: 0.60, armor: 0.70,
    gloves: 0.55, boots: 0.60, belt: 0.45,
    cape: 0.40, amulet: 0.45, accessory: 0.35,
  };

  for (const [slot, chance] of Object.entries(slotChances)) {
    if (Math.random() < chance) {
      const itemType = SLOT_TO_ITEM_TYPE[slot];
      if (!itemType) continue;
      const item = generateItem(itemType, level);
      if (item) equipment[slot] = item;
    }
  }

  return equipment;
}

/**
 * Simulate stat growth for a class up to a given level.
 * Same formula as real players use on level-up.
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
 * Pick loot drops from defeated player encounter.
 * Has a chance to drop 1-2 of their equipped items.
 */
export function rollPlayerEncounterDrops(equipment) {
  const equipped = [];
  for (const [slot, item] of Object.entries(equipment)) {
    if (item && slot !== 'accessory2') equipped.push(item);
  }
  if (equipped.length === 0) return [];

  // Always drop 1 item, 30% chance for a second
  const drops = [];
  const shuffled = [...equipped].sort(() => Math.random() - 0.5);
  drops.push(shuffled[0]);
  if (shuffled.length > 1 && Math.random() < 0.30) {
    drops.push(shuffled[1]);
  }
  return drops;
}

/**
 * Generate a player-like enemy for exploration encounters.
 * Uses the same class system, stat growth, and equipment as real players.
 *
 * @param {number} areaLevel - The area level (from location levelReq)
 * @param {number} playerLevel - The actual player's level
 * @returns {object} A monster-compatible object with player encounter data
 */
export function generatePlayerEncounter(areaLevel, playerLevel) {
  const classId = CLASS_IDS[Math.floor(Math.random() * CLASS_IDS.length)];
  const cls = CHARACTER_CLASSES[classId];

  // Encounter level: near the area level, with slight variance
  const levelVariance = Math.floor(Math.random() * 3) - 1; // -1 to +1
  const encounterLevel = Math.max(1, areaLevel + levelVariance);

  // Generate stats and equipment
  const stats = simulateStats(classId, encounterLevel);
  const equipment = generateEncounterEquipment(encounterLevel);

  // Sum equipment ATK/DEF
  let equipAtk = 0;
  let equipDef = 0;
  for (const item of Object.values(equipment)) {
    if (item) {
      equipAtk += item.atk || 0;
      equipDef += item.def || 0;
    }
  }

  const name = ENCOUNTER_NAMES[Math.floor(Math.random() * ENCOUNTER_NAMES.length)];

  // Use class-specific combat skills that exist in the SKILLS pool
  const skills = CLASS_COMBAT_SKILLS[classId] || ['bash'];

  // Calculate exp and gold rewards (comparable to monsters of similar level)
  const baseExp = 20 + encounterLevel * 8;
  const baseGold = 15 + encounterLevel * 5;

  // Tougher than regular monsters but not as tough as bosses
  // Apply a slight buff since they have real stat scaling + equipment
  const totalAtk = stats.baseAtk + equipAtk;
  const totalDef = stats.baseDef + equipDef;

  return {
    id: `player-enc-${classId}-${encounterLevel}`,
    name: `${name} the ${cls.name}`,
    sprite: 'vagrant',
    level: encounterLevel,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    atk: totalAtk,
    def: totalDef,
    speed: stats.speed,
    evasion: stats.evasion,
    accuracy: stats.accuracy,
    resistance: stats.resistance,
    tenacity: stats.tenacity,
    aggression: stats.aggression,
    luck: stats.luck,
    fortitude: stats.fortitude,
    exp: baseExp,
    gold: baseGold + Math.floor(Math.random() * (encounterLevel * 3)),
    skills,
    dropTable: [], // drops handled by rollPlayerEncounterDrops instead
    element: 'physical',
    // Player encounter flags
    isPlayerEncounter: true,
    encounterClassId: classId,
    encounterClassName: cls.name,
    encounterClassColor: cls.color,
    encounterEquipment: equipment,
    encounterLevel,
  };
}
