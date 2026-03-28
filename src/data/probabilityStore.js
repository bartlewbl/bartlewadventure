// Centralized probability config store.
// Loads values from the database on init; engine files read from here.
// Falls back to hardcoded defaults if the DB hasn't been fetched yet.

import { getProbabilityConfig } from '../api';

const DEFAULTS = {
  'combat.damageVarianceLow': 0.85,
  'combat.damageVarianceRange': 0.3,
  'combat.baseCritChance': 0.03,
  'combat.critPerAthletics': 0.002,
  'combat.critPerWisdom': 0.001,
  'combat.critCap': 0.20,
  'combat.critMultiplier': 1.4,
  'combat.monsterCritBase': 0.03,
  'combat.monsterCritPerLevel': 0.0005,
  'combat.monsterCritCap': 0.08,
  'combat.monsterCritMultiplier': 1.4,
  'combat.monsterSkillChance': 0.3,
  'combat.escapeChanceBase': 0.5,
  'combat.escapeChanceGreed': 0.75,
  'loot.monsterDropChance': 0.10,
  'loot.bossMaterialMin': 3,
  'loot.bossMaterialMax': 5,
  'loot.locationItemChance': 0.4,
  'loot.shopEpicWeight': 0.02,
  'loot.shopLegendaryWeight': 0.002,
  'explore.bossRate': 0.005,
  'explore.randomEventChance': 0.05,
  'explore.goldFindChance': 0.3,
  'explore.goldFindMin': 3,
  'explore.goldFindRange': 2,
  'scaling.monsterHpMult': 1.25,
  'scaling.monsterAtkMult': 1.15,
  'scaling.monsterDefMult': 1.15,
  'scaling.monsterLevelScale': 0.2,
  'scaling.bossLevelScale': 0.25,
  'scaling.goldPerLevel': 0.02,
  'scaling.monsterGoldVariance': 5,
  'scaling.bossGoldVariance': 15,
  'passive.lifetapHeal': 0.08,
  'passive.vampiricAura': 0.06,
  'passive.soulSiphonChance': 0.15,
  'passive.bloodlustHeal': 0.12,
  'passive.regeneration': 0.02,
  'passive.endurance': 0.03,
  'passive.indestructible': 0.05,
  'passive.soulFortressHeal': 0.03,
  'passive.darkPactDrain': 0.04,
  'passive.darkPactUpgradedDrain': 0.02,
  'passive.pactOfUndeath': 0.008,
  'passive.manaRegen': 0.05,
  'passive.leylineTap': 0.07,
  'passive.shadowStep': 0.08,
  'passive.evasionMastery': 0.06,
  'passive.cloakOfShadows': 0.12,
  'passive.phantomExistence': 0.25,
  'passive.livingShadow': 0.40,
  'passive.dodgeCap': 0.60,
  'passive.aegisChance': 0.08,
  'passive.aegisUpgraded': 0.15,
  'passive.smokeBomb': 0.15,
  'passive.cursedBlood': 0.12,
  'passive.bladeDance': 0.06,
  'passive.swiftStrikes': 0.12,
  'passive.luckyStrike': 0.12,
  'passive.opportunityStrikes': 0.20,
  'passive.spellEcho': 0.12,
  'passive.spellEchoUpgraded': 0.20,
  'passive.defendBlock': 0.5,
  'passive.fortifyBlock': 0.35,
  'passive.bulwarkBlock': 0.20,
  'passive.phalanxBlock': 0.10,
  'passive.ironSkin': 0.93,
  'passive.thickSkin': 0.95,
  'passive.fortress': 0.87,
  'passive.soulFortressDR': 0.90,
  'passive.eternalGuardian': 0.65,
  'passive.battleHardenedRate': 0.01,
  'passive.battleHardenedCap': 0.25,
  'material.neonDistrict': 0.07,
  'material.frozenWastes': 0.09,
  'material.scorchedBadlands': 0.09,
  'material.toxicMarshlands': 0.10,
  'material.abyssalDepths': 0.10,
  'material.celestialHighlands': 0.12,
  'material.voidNexus': 0.14,
  'egg.neonDistrict': 0.002,
  'egg.frozenWastes': 0.003,
  'egg.scorchedBadlands': 0.004,
  'egg.toxicMarshlands': 0.004,
  'egg.abyssalDepths': 0.005,
  'egg.celestialHighlands': 0.006,
  'egg.voidNexus': 0.007,
  'energy.regenRate': 0.1,
  'energy.regenIntervalMin': 15,
  'charisma.pricePerPoint': 0.01,
  'charisma.priceCap': 0.25,
};

// Live config object — starts with defaults, overwritten by DB fetch
const config = { ...DEFAULTS };

let loaded = false;
let loadPromise = null;

/** Get a probability value by key. Always returns immediately (uses cached/default). */
export function prob(key) {
  return config[key] ?? DEFAULTS[key] ?? 0;
}

/** Load config from database. Safe to call multiple times. */
export async function loadProbabilityConfig() {
  if (loadPromise) return loadPromise;
  loadPromise = getProbabilityConfig()
    .then(data => {
      if (data?.configs) {
        for (const row of data.configs) {
          config[row.key] = row.value;
        }
      }
      loaded = true;
    })
    .catch(() => {
      // Silently use defaults if fetch fails
      loaded = true;
    });
  return loadPromise;
}

/** Update a single value locally (after saving to DB). */
export function setProb(key, value) {
  config[key] = value;
}

/** Replace all values from a fresh DB fetch result. */
export function replaceAll(configs) {
  for (const row of configs) {
    config[row.key] = row.value;
  }
}

/** Check if config has been loaded from DB. */
export function isLoaded() {
  return loaded;
}
