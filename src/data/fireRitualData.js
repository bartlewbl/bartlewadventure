// ============================================================
// FIRE RITUAL SYSTEM - Ritual sites, wave configs, fuel costs
// ============================================================

// Ritual site types found during exploration
export const RITUAL_SITES = {
  'burned-campfire': {
    name: 'Burned-Out Campfire',
    description: 'A circle of scorched stones surrounds cold ash. Someone camped here long ago.',
    fuelCost: 1, // number of fuel items needed
  },
  'ritual-circle': {
    name: 'Ancient Ritual Circle',
    description: 'Strange symbols are etched into the ground around a stone pedestal. It hums with faint energy.',
    fuelCost: 2,
  },
  'signal-pyre': {
    name: 'Abandoned Signal Pyre',
    description: 'A tall pyre built from scrap and timber, meant to be lit as a beacon. It stands unlit and forgotten.',
    fuelCost: 3,
  },
};

// Which ritual sites appear in which locations
export const RITUAL_SITE_BY_LOCATION = {
  'neon-mile': ['burned-campfire'],
  'shadow-alley': ['burned-campfire', 'ritual-circle'],
  'metro-underpass': ['burned-campfire', 'ritual-circle'],
  'skyline-rooftops': ['ritual-circle', 'signal-pyre'],
  'ironworks-yard': ['ritual-circle', 'signal-pyre'],
  'midnight-terminal': ['signal-pyre'],
};

// Chance to discover a ritual site during exploration (per step)
export const RITUAL_DISCOVER_CHANCE = 0.04;

// Wave defense configurations by difficulty tier
// tier is determined by the quest or by location level
export const WAVE_CONFIGS = {
  easy: {
    waves: 2,
    monstersPerWave: 1,
    hpScale: 0.8,   // monsters have 80% normal HP
    atkScale: 0.8,
    restHealPct: 0.25, // heal 25% HP between waves
  },
  medium: {
    waves: 3,
    monstersPerWave: 1,
    hpScale: 1.0,
    atkScale: 1.0,
    restHealPct: 0.20,
  },
  hard: {
    waves: 4,
    monstersPerWave: 1,
    hpScale: 1.1,
    atkScale: 1.1,
    restHealPct: 0.15,
  },
  brutal: {
    waves: 5,
    monstersPerWave: 1,
    hpScale: 1.3,
    atkScale: 1.2,
    restHealPct: 0.10,
  },
};

// Gold/exp bonus multiplier for completing a wave defense
export const WAVE_DEFENSE_BONUS = {
  easy: { goldMult: 1.5, expMult: 1.5 },
  medium: { goldMult: 2.0, expMult: 2.0 },
  hard: { goldMult: 2.5, expMult: 2.5 },
  brutal: { goldMult: 3.0, expMult: 3.0 },
};

// Pick a random ritual site for a location
export function pickRitualSite(locationId) {
  const sites = RITUAL_SITE_BY_LOCATION[locationId];
  if (!sites || sites.length === 0) return null;
  const siteId = sites[Math.floor(Math.random() * sites.length)];
  return { ...RITUAL_SITES[siteId], id: siteId };
}

// Check if player has enough fuel items to light a fire
export function countFuelItems(inventory) {
  return inventory.filter(item => item.isFuel || item.type === 'material' && isFuelMaterial(item.materialId || item.id)).length;
}

// Known fuel material IDs
const FUEL_MATERIAL_IDS = ['scrap-wood', 'charcoal', 'coal-chunk', 'oil-canister', 'plasma-core'];

export function isFuelMaterial(materialId) {
  return FUEL_MATERIAL_IDS.includes(materialId);
}

// Find fuel items in inventory (returns array of indices)
export function findFuelItems(inventory, count) {
  const indices = [];
  for (let i = 0; i < inventory.length && indices.length < count; i++) {
    const item = inventory[i];
    if (item.isFuel) {
      indices.push(i);
    } else if (item.type === 'material' && isFuelMaterial(item.materialId || item.id)) {
      indices.push(i);
    }
  }
  return indices;
}

// Get wave difficulty tier based on location level requirement
export function getWaveTier(locationLevelReq) {
  if (locationLevelReq >= 18) return 'brutal';
  if (locationLevelReq >= 10) return 'hard';
  if (locationLevelReq >= 3) return 'medium';
  return 'easy';
}
