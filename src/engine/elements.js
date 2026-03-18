// Elemental spell type system with weather interactions and counters
// Elements are derived from skill names/effects — no changes to existing skill data needed

// ---- ELEMENT DEFINITIONS ----
export const ELEMENTS = {
  fire:      { id: 'fire',      label: 'Fire',      icon: '\u{1F525}', color: '#ff6347' },
  ice:       { id: 'ice',       label: 'Ice',        icon: '\u2744',    color: '#4fc3f7' },
  lightning: { id: 'lightning',  label: 'Lightning',  icon: '\u26A1',    color: '#ffeb3b' },
  shadow:    { id: 'shadow',     label: 'Shadow',     icon: '\u{1F311}', color: '#9c27b0' },
  nature:    { id: 'nature',     label: 'Nature',     icon: '\u{1F33F}', color: '#4caf50' },
  arcane:    { id: 'arcane',     label: 'Arcane',     icon: '\u2728',    color: '#7c4dff' },
  physical:  { id: 'physical',   label: 'Physical',   icon: '\u2694',    color: '#9e9e9e' },
};

// ---- COUNTER SYSTEM ----
// Fire > Ice > Lightning > Fire (triangle 1)
// Shadow > Nature > Arcane > Shadow (triangle 2)
// Physical is neutral
const COUNTERS = {
  fire: 'ice',
  ice: 'lightning',
  lightning: 'fire',
  shadow: 'nature',
  nature: 'arcane',
  arcane: 'shadow',
};

const WEAK_TO = {};
for (const [strong, weak] of Object.entries(COUNTERS)) {
  WEAK_TO[weak] = strong;
}

export function getElementCounter(elementId) {
  return COUNTERS[elementId] || null; // what this element is strong against
}

export function getElementWeakness(elementId) {
  return WEAK_TO[elementId] || null; // what this element is weak to
}

// ---- SKILL → ELEMENT MAPPING ----
// Derived from skill names, effects, and themes
const SKILL_ELEMENT_MAP = {
  // Mage - Fire skills
  'mag_t1b': 'fire',      // Fireball
  'mag_t3b': 'fire',      // Meteor
  'mag_t8b': 'fire',      // Pyroblast
  'mag_t11b': 'fire',     // Inferno
  'mag_t17b': 'fire',     // Apocalyptic Fire

  // Mage - Ice skills
  'mag_t2b': 'ice',       // Ice Lance
  'mag_t5b': 'ice',       // Frost Nova
  'mag_t7b': 'ice',       // Blizzard

  // Mage - Lightning skills
  'mag_t4b': 'lightning',  // Chain Lightning
  'mag_t6b': 'lightning',  // Lightning Bolt

  // Mage - Arcane skills
  'mag_t9b': 'arcane',    // Arcane Torrent
  'mag_t10b': 'arcane',   // Cataclysm
  'mag_t12b': 'arcane',   // Arcane Missiles
  'mag_t13b': 'arcane',   // Comet
  'mag_t14b': 'arcane',   // Void Bolt
  'mag_t15b': 'arcane',   // Supernova
  'mag_t16b': 'arcane',   // Disintegrate
  'mag_t18b': 'arcane',   // Gravity Well
  'mag_t19b': 'arcane',   // Starfall
  'mag_t20b': 'arcane',   // Singularity
  'mag_t21b': 'arcane',   // Chain Destruction
  'mag_t22b': 'arcane',   // Dimensional Rift
  'mag_t23b': 'arcane',   // Cosmic Ray
  'mag_t24b': 'arcane',   // Oblivion Beam
  'mag_t25b': 'arcane',   // Big Bang

  // Necromancer - Shadow skills
  'nec_t1b': 'shadow',    // Bone Spear
  'nec_t2b': 'nature',    // Plague (disease/nature)
  'nec_t3b': 'shadow',    // Soul Harvest
  'nec_t4b': 'shadow',    // Death Coil
  'nec_t5b': 'shadow',    // Corpse Explosion
  'nec_t6b': 'shadow',    // Wither
  'nec_t7b': 'shadow',    // Doom
  'nec_t8b': 'shadow',    // Army of the Dead
  'nec_t9b': 'shadow',    // Blood Pact
  'nec_t10b': 'shadow',   // Devouring Darkness
  'nec_t11b': 'shadow',   // Bone Storm
  'nec_t12b': 'shadow',   // Soul Rend
  'nec_t13b': 'shadow',   // Necrotic Blast
  'nec_t14b': 'shadow',   // Grave Grasp
  'nec_t15b': 'shadow',   // Apocalypse (nec)
  'nec_t16b': 'shadow',   // Death Sentence
  'nec_t17b': 'shadow',   // Plague of Shadows
  'nec_t18b': 'shadow',   // Blood Reaper
  'nec_t19b': 'shadow',   // Abyssal Nova
  'nec_t20b': 'shadow',   // Extinction Event
  'nec_t21b': 'shadow',   // Soul Shatter
  'nec_t22b': 'shadow',   // Cursed Touch
  'nec_t23b': 'shadow',   // Dark Harvest
  'nec_t24b': 'shadow',   // Void Eruption
  'nec_t25b': 'shadow',   // Death Incarnate

  // Thief - Shadow/Nature mix
  'thf_t1b': 'shadow',    // Backstab
  'thf_t2b': 'shadow',    // Assassinate
  'thf_t3b': 'nature',    // Poison Blade
  'thf_t4b': 'shadow',    // Cheap Shot
  'thf_t5b': 'nature',    // Toxic Barrage
  'thf_t6b': 'shadow',    // Phantom Blade
  'thf_t7b': 'shadow',    // Shadow Dance
  'thf_t8b': 'shadow',    // Shadow Assault
  'thf_t9b': 'shadow',    // Shadow Step
  'thf_t10b': 'shadow',   // Death Mark
  'thf_t11b': 'nature',   // Venom Strike
  'thf_t12b': 'shadow',   // Throat Slit
  'thf_t13b': 'shadow',   // Blade Flurry
  'thf_t14b': 'shadow',   // Night Slash
  'thf_t15b': 'shadow',   // Phantom Existence (skill)
  'thf_t16b': 'shadow',   // Lethal Tempo
  'thf_t17b': 'nature',   // Crippling Toxin
  'thf_t18b': 'shadow',   // Ethereal Strike
  'thf_t19b': 'shadow',   // Umbral Devastation
  'thf_t20b': 'shadow',   // Death Lotus
  'thf_t21b': 'shadow',   // Shadow Rend
  'thf_t22b': 'shadow',   // Spectral Blade
  'thf_t23b': 'shadow',   // Execution (thf)
  'thf_t24b': 'shadow',   // Void Assassination
  'thf_t25b': 'shadow',   // Eclipse

  // Berserker - Physical (fire for rage-themed)
  'brs_t1b': 'physical',  // Savage Strike
  'brs_t2b': 'physical',  // Cleave
  'brs_t3b': 'fire',      // Rampage (fury-fire)
  'brs_t4b': 'physical',  // Skull Crusher
  'brs_t5b': 'physical',  // Whirlwind
  'brs_t6b': 'physical',  // Decimate
  'brs_t7b': 'physical',  // Execution
  'brs_t8b': 'physical',  // Devastating Blow
  'brs_t9b': 'fire',      // Blood Nova (blood-fire)
  'brs_t10b': 'fire',     // Apocalypse (brs)
  'brs_t11a': 'physical', // Gore
  'brs_t12b': 'physical', // Crushing Blow
  'brs_t13b': 'physical', // Reckless Charge
  'brs_t14b': 'physical', // Annihilate
  'brs_t15b': 'fire',     // Worldbreaker
  'brs_t16b': 'physical', // Eviscerate
  'brs_t17b': 'physical', // Cataclysmic Slam
  'brs_t18b': 'physical', // Massacre
  'brs_t19b': 'physical', // Oblivion Strike
  'brs_t20b': 'fire',     // Ragnarök
  'brs_t21b': 'physical', // Sundering Blow
  'brs_t22b': 'physical', // Titan Blow
  'brs_t23b': 'physical', // Devastating Arc
  'brs_t24b': 'physical', // Extinction
  'brs_t25b': 'fire',     // Armageddon

  // Warrior - Physical/Nature
  'war_t1b': 'physical',  // Shield Bash
  'war_t2b': 'physical',  // Power Strike
  'war_t3b': 'nature',    // War Cry
  'war_t4b': 'physical',  // Quake
  'war_t5b': 'physical',  // Shield Slam
  'war_t6b': 'physical',  // Judgement
  'war_t7b': 'physical',  // Riposte
  'war_t8b': 'physical',  // Full Force
  'war_t9b': 'physical',  // Rally
  'war_t10b': 'physical', // Final Stand
  'war_t11b': 'lightning', // Thunder Strike
  'war_t12b': 'physical', // Fortress Breaker
  'war_t13b': 'physical', // Blade Storm
  'war_t14b': 'physical', // Shield Charge
  'war_t15b': 'physical', // Wrath of the Fortress
  'war_t16b': 'physical', // Ground Pound
  'war_t17b': 'physical', // Retribution
  'war_t18b': 'physical', // Titan Crash
  'war_t19b': 'physical', // Colossus Slam
  'war_t20b': 'physical', // Wrath of Ages
  'war_t21b': 'physical', // Tectonic Slam
  'war_t22b': 'physical', // Earthquake
  'war_t23b': 'physical', // Sentinel Smash
  'war_t24b': 'physical', // Unstoppable Force
  'war_t25b': 'physical', // World Ender
};

// Class base skill elements
const CLASS_SKILL_ELEMENTS = {
  berserker: 'physical',
  warrior: 'physical',
  thief: 'shadow',
  mage: 'arcane',
  necromancer: 'shadow',
};

export function getSkillElement(skillId, classId) {
  if (SKILL_ELEMENT_MAP[skillId]) return SKILL_ELEMENT_MAP[skillId];
  if (classId && CLASS_SKILL_ELEMENTS[classId]) return CLASS_SKILL_ELEMENTS[classId];
  return 'physical';
}

// ---- WEATHER → ELEMENT BUFF TABLE ----
// Positive = buffed, negative = debuffed. Values are multipliers added to 1.0
// e.g. 0.30 means +30% damage, -0.25 means -25% damage
const WEATHER_ELEMENT_BUFFS = {
  clear:   {},  // No element bonuses
  cloudy:  {},  // No element bonuses
  rain:    { ice: 0.20, fire: -0.25, lightning: 0.10, nature: 0.10 },
  storm:   { lightning: 0.30, fire: -0.15, arcane: 0.10 },
  fog:     { shadow: 0.25, nature: 0.15, fire: -0.10 },
  wind:    { lightning: 0.15, arcane: 0.10, nature: -0.10 },
  heatwave:{ fire: 0.30, ice: -0.25, nature: -0.15 },
};

// Get the weather buff multiplier for a spell of given element
export function getWeatherSpellBuff(weatherId, elementId) {
  const buffs = WEATHER_ELEMENT_BUFFS[weatherId];
  if (!buffs || !elementId || elementId === 'physical') return 1.0;
  const mod = buffs[elementId] || 0;
  return 1.0 + mod;
}

// Get all active weather spell buffs for display
export function getWeatherSpellBuffList(weatherId) {
  const buffs = WEATHER_ELEMENT_BUFFS[weatherId];
  if (!buffs) return [];
  return Object.entries(buffs).map(([elemId, mod]) => ({
    element: ELEMENTS[elemId],
    mod,
    label: `${mod > 0 ? '+' : ''}${Math.round(mod * 100)}% ${ELEMENTS[elemId].label}`,
    positive: mod > 0,
  }));
}

// Get counter bonus: if your spell element counters the enemy's "type"
// For simplicity, monsters don't have elements, so counters apply
// when the weather favors a counter chain
export function getCounterInfo(elementId) {
  if (!elementId || elementId === 'physical') return null;
  const strong = COUNTERS[elementId];
  const weak = WEAK_TO[elementId];
  return {
    strongAgainst: strong ? ELEMENTS[strong] : null,
    weakTo: weak ? ELEMENTS[weak] : null,
  };
}
