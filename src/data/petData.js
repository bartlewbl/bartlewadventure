// ============================================================
// PET SYSTEM - Data definitions for pets, pet shop, pet items
// ============================================================

import { uid } from '../engine/utils';

// ---- PET ROLES ----
// attacker: deals damage each turn
// defender: absorbs damage for player
// healer: heals player each turn
// buffer: gives stat buffs during battle
// hybrid: mix of abilities

// ---- PET DEFINITIONS ----
export const PET_CATALOG = [
  // --- ATTACKERS ---
  {
    id: 'fire-imp',
    name: 'Fire Imp',
    role: 'attacker',
    description: 'A small fiery creature that hurls fireballs at enemies.',
    baseAtk: 6, baseDef: 2, baseHp: 30,
    ability: { name: 'Fireball', type: 'damage', power: 1.2, desc: 'Deals 120% ATK as fire damage.' },
    buyPrice: 200,
    levelReq: 3,
    rarity: 'Common',
    icon: 'fire-imp',
  },
  {
    id: 'shadow-cat',
    name: 'Shadow Cat',
    role: 'attacker',
    description: 'A stealthy feline that strikes from the shadows with critical hits.',
    baseAtk: 9, baseDef: 3, baseHp: 25,
    ability: { name: 'Shadow Strike', type: 'damage', power: 1.5, critChance: 0.3, desc: 'Deals 150% ATK with 30% crit chance (2x).' },
    buyPrice: 450,
    levelReq: 8,
    rarity: 'Uncommon',
    icon: 'shadow-cat',
  },
  {
    id: 'thunder-hawk',
    name: 'Thunder Hawk',
    role: 'attacker',
    description: 'A majestic bird of prey that calls down lightning.',
    baseAtk: 14, baseDef: 4, baseHp: 35,
    ability: { name: 'Lightning Dive', type: 'damage', power: 1.8, desc: 'Deals 180% ATK as lightning damage.' },
    buyPrice: 900,
    levelReq: 14,
    rarity: 'Rare',
    icon: 'thunder-hawk',
  },
  {
    id: 'void-serpent',
    name: 'Void Serpent',
    role: 'attacker',
    description: 'A terrifying snake from the void that devours enemy defenses.',
    baseAtk: 20, baseDef: 5, baseHp: 40,
    ability: { name: 'Void Fang', type: 'damage', power: 2.0, piercePercent: 0.5, desc: 'Deals 200% ATK, ignores 50% DEF.' },
    buyPrice: 2000,
    levelReq: 20,
    rarity: 'Epic',
    icon: 'void-serpent',
  },

  // --- DEFENDERS ---
  {
    id: 'stone-turtle',
    name: 'Stone Turtle',
    role: 'defender',
    description: 'A sturdy turtle that shields you from incoming attacks.',
    baseAtk: 2, baseDef: 10, baseHp: 50,
    ability: { name: 'Shell Guard', type: 'defend', absorbPercent: 0.25, desc: 'Absorbs 25% of damage dealt to you.' },
    buyPrice: 250,
    levelReq: 4,
    rarity: 'Common',
    icon: 'stone-turtle',
  },
  {
    id: 'iron-golem',
    name: 'Iron Golem',
    role: 'defender',
    description: 'A mechanical guardian that takes hits meant for you.',
    baseAtk: 3, baseDef: 16, baseHp: 70,
    ability: { name: 'Iron Wall', type: 'defend', absorbPercent: 0.35, desc: 'Absorbs 35% of damage dealt to you.' },
    buyPrice: 600,
    levelReq: 10,
    rarity: 'Uncommon',
    icon: 'iron-golem',
  },
  {
    id: 'crystal-guardian',
    name: 'Crystal Guardian',
    role: 'defender',
    description: 'A living crystal that reflects damage back at attackers.',
    baseAtk: 5, baseDef: 22, baseHp: 90,
    ability: { name: 'Crystal Reflect', type: 'defend', absorbPercent: 0.40, reflectPercent: 0.15, desc: 'Absorbs 40% damage, reflects 15% back.' },
    buyPrice: 1400,
    levelReq: 16,
    rarity: 'Rare',
    icon: 'crystal-guardian',
  },

  // --- HEALERS ---
  {
    id: 'forest-sprite',
    name: 'Forest Sprite',
    role: 'healer',
    description: 'A gentle nature spirit that mends your wounds.',
    baseAtk: 1, baseDef: 3, baseHp: 20,
    ability: { name: 'Nature\'s Touch', type: 'heal', healPercent: 0.08, desc: 'Heals 8% of your max HP each turn.' },
    buyPrice: 300,
    levelReq: 5,
    rarity: 'Common',
    icon: 'forest-sprite',
  },
  {
    id: 'moon-fox',
    name: 'Moon Fox',
    role: 'healer',
    description: 'A mystical fox whose moonlight restores health and mana.',
    baseAtk: 4, baseDef: 5, baseHp: 30,
    ability: { name: 'Moonlight', type: 'heal', healPercent: 0.12, manaRestore: 3, desc: 'Heals 12% max HP and restores 3 mana each turn.' },
    buyPrice: 750,
    levelReq: 11,
    rarity: 'Uncommon',
    icon: 'moon-fox',
  },
  {
    id: 'celestial-phoenix',
    name: 'Celestial Phoenix',
    role: 'healer',
    description: 'A legendary bird of rebirth that can bring you back from the brink.',
    baseAtk: 8, baseDef: 8, baseHp: 45,
    ability: { name: 'Rebirth Flame', type: 'heal', healPercent: 0.18, reviveOnce: true, desc: 'Heals 18% max HP/turn. Once per battle: revives you at 25% HP if defeated.' },
    buyPrice: 2500,
    levelReq: 22,
    rarity: 'Epic',
    icon: 'celestial-phoenix',
  },

  // --- BUFFERS ---
  {
    id: 'war-pup',
    name: 'War Pup',
    role: 'buffer',
    description: 'A loyal pup that boosts your fighting spirit.',
    baseAtk: 3, baseDef: 3, baseHp: 25,
    ability: { name: 'Battle Cry', type: 'buff', atkBuff: 0.10, desc: 'Boosts your ATK by 10%.' },
    buyPrice: 350,
    levelReq: 6,
    rarity: 'Common',
    icon: 'war-pup',
  },
  {
    id: 'mystic-owl',
    name: 'Mystic Owl',
    role: 'buffer',
    description: 'A wise owl that enhances your magical abilities.',
    baseAtk: 5, baseDef: 6, baseHp: 30,
    ability: { name: 'Arcane Hoot', type: 'buff', atkBuff: 0.08, defBuff: 0.10, manaRegen: 2, desc: '+8% ATK, +10% DEF, +2 mana/turn.' },
    buyPrice: 800,
    levelReq: 12,
    rarity: 'Uncommon',
    icon: 'mystic-owl',
  },
  {
    id: 'dragon-whelp',
    name: 'Dragon Whelp',
    role: 'hybrid',
    description: 'A baby dragon with devastating breath and protective scales.',
    baseAtk: 16, baseDef: 12, baseHp: 60,
    ability: { name: 'Dragon Breath', type: 'hybrid', power: 1.5, atkBuff: 0.12, defBuff: 0.08, desc: 'Attacks for 150% ATK + gives you +12% ATK, +8% DEF.' },
    buyPrice: 3500,
    levelReq: 25,
    rarity: 'Legendary',
    icon: 'dragon-whelp',
  },
];

// ---- PET SNACKS (restore bond) ----
export const PET_SNACKS = [
  {
    id: 'basic-treat',
    name: 'Basic Treat',
    type: 'pet-snack',
    bondRestore: 10,
    buyPrice: 15,
    sellPrice: 5,
    rarity: 'Common',
    description: 'A simple snack. Restores 10 bond.',
  },
  {
    id: 'tasty-biscuit',
    name: 'Tasty Biscuit',
    type: 'pet-snack',
    bondRestore: 25,
    buyPrice: 40,
    sellPrice: 15,
    rarity: 'Uncommon',
    description: 'A delicious biscuit. Restores 25 bond.',
  },
  {
    id: 'gourmet-feast',
    name: 'Gourmet Feast',
    type: 'pet-snack',
    bondRestore: 50,
    buyPrice: 100,
    sellPrice: 40,
    rarity: 'Rare',
    description: 'A lavish meal for your pet. Restores 50 bond.',
  },
  {
    id: 'legendary-delicacy',
    name: 'Legendary Delicacy',
    type: 'pet-snack',
    bondRestore: 100,
    buyPrice: 250,
    sellPrice: 100,
    rarity: 'Epic',
    description: 'The finest pet food in the land. Restores 100 bond.',
  },
];

// ---- PET ENERGY POTIONS ----
export const PET_ENERGY_POTIONS = [
  {
    id: 'pet-energy-drop',
    name: 'Pet Energy Drop',
    type: 'pet-energy',
    energyRestore: 15,
    buyPrice: 20,
    sellPrice: 8,
    rarity: 'Common',
    description: 'A small energy potion for pets. Restores 15 energy.',
  },
  {
    id: 'pet-vitality-serum',
    name: 'Vitality Serum',
    type: 'pet-energy',
    energyRestore: 35,
    buyPrice: 55,
    sellPrice: 20,
    rarity: 'Uncommon',
    description: 'A potent serum. Restores 35 pet energy.',
  },
  {
    id: 'pet-hyper-elixir',
    name: 'Hyper Elixir',
    type: 'pet-energy',
    energyRestore: 70,
    buyPrice: 120,
    sellPrice: 50,
    rarity: 'Rare',
    description: 'A powerful pet elixir. Restores 70 energy.',
  },
  {
    id: 'pet-ultimate-tonic',
    name: 'Ultimate Tonic',
    type: 'pet-energy',
    energyRestore: 100,
    buyPrice: 280,
    sellPrice: 110,
    rarity: 'Epic',
    description: 'Fully restores pet energy.',
  },
];

// ---- PET CONSTANTS ----
export const PET_MAX_BOND = 100;
export const PET_MAX_ENERGY = 100;
export const PET_BOND_DECAY_PER_BATTLE = 3;  // bond lost per battle
export const PET_ENERGY_COST_PER_BATTLE = 8; // energy cost per battle
export const PET_LOW_BOND_THRESHOLD = 30;     // below this, pet may refuse to fight
export const PET_REFUSE_CHANCE_LOW_BOND = 0.4; // 40% chance to refuse if bond < 30
export const PET_MAX_SLOTS = 3;               // max active/equipped pets

// ---- PET BASE BUILDINGS ----
export const PET_BUILDINGS = {
  kennel: {
    id: 'kennel',
    name: 'Pet Kennel',
    description: 'A cozy home for your pets. Passively restores pet bond over time.',
    buildCost: { gold: 500, materials: { 'scrap-wood': 12, 'stone-block': 6, 'herb-bundle': 4 } },
    icon: 'kennel',
    levelReq: 5,
    upgrades: [
      { level: 1, name: 'Basic Kennel', bondRegen: 1, desc: '+1 bond/hour for all pets', energyRegen: 0 },
      {
        level: 2, name: 'Comfortable Den', bondRegen: 2, energyRegen: 1, desc: '+2 bond/hour, +1 energy/hour',
        upgradeCost: { gold: 800, materials: { 'scrap-wood': 15, 'crystal-shard': 2, 'copper-wire': 4 } },
      },
      {
        level: 3, name: 'Luxury Sanctuary', bondRegen: 4, energyRegen: 3, desc: '+4 bond/hour, +3 energy/hour',
        upgradeCost: { gold: 2000, materials: { 'crystal-shard': 4, 'starlight-dust': 2, 'deep-coral': 3 } },
      },
    ],
  },
  trainingGround: {
    id: 'trainingGround',
    name: 'Training Ground',
    description: 'Train your pets to be stronger in battle. Buffs pet stats.',
    buildCost: { gold: 800, materials: { 'stone-block': 10, 'iron-ore': 8, 'scrap-wood': 10, 'charcoal': 4 } },
    icon: 'training',
    levelReq: 8,
    upgrades: [
      { level: 1, name: 'Basic Arena', petAtkBuff: 0.10, petDefBuff: 0.05, desc: '+10% pet ATK, +5% pet DEF in battle' },
      {
        level: 2, name: 'Advanced Arena', petAtkBuff: 0.20, petDefBuff: 0.15, petHpBuff: 0.10, desc: '+20% ATK, +15% DEF, +10% HP',
        upgradeCost: { gold: 1500, materials: { 'iron-ore': 12, 'crystal-shard': 3, 'copper-wire': 6 } },
      },
      {
        level: 3, name: 'Champion Colosseum', petAtkBuff: 0.35, petDefBuff: 0.25, petHpBuff: 0.20, desc: '+35% ATK, +25% DEF, +20% HP',
        upgradeCost: { gold: 3500, materials: { 'crystal-shard': 6, 'starlight-dust': 3, 'void-essence': 1 } },
      },
    ],
  },
  feedingStation: {
    id: 'feedingStation',
    name: 'Feeding Station',
    description: 'Automatically feeds your pets, reducing bond and energy decay.',
    buildCost: { gold: 600, materials: { 'scrap-wood': 8, 'herb-bundle': 8, 'glass-vial': 4, 'toxic-resin': 2 } },
    icon: 'feeding',
    levelReq: 7,
    upgrades: [
      { level: 1, name: 'Basic Trough', bondDecayReduction: 0.20, energyDecayReduction: 0.15, desc: '-20% bond loss, -15% energy loss in battles' },
      {
        level: 2, name: 'Auto-Feeder', bondDecayReduction: 0.40, energyDecayReduction: 0.30, desc: '-40% bond loss, -30% energy loss',
        upgradeCost: { gold: 1000, materials: { 'copper-wire': 6, 'herb-bundle': 10, 'crystal-shard': 2 } },
      },
      {
        level: 3, name: 'Gourmet Station', bondDecayReduction: 0.60, energyDecayReduction: 0.50, desc: '-60% bond loss, -50% energy loss',
        upgradeCost: { gold: 2500, materials: { 'crystal-shard': 4, 'starlight-dust': 2, 'deep-coral': 2 } },
      },
    ],
  },
};

// ---- HELPER: Create initial pet state ----
export function createInitialPetState() {
  return {
    ownedPets: [],       // [{ ...petData, bond, energy, id }]
    equippedPets: [],    // pet ids (up to PET_MAX_SLOTS)
    petBuildings: {},    // { buildingId: { built: true, level: 1 } }
    petBuildingLastUpdate: null,
  };
}

// ---- HELPER: Create a pet instance from catalog ----
export function createPetInstance(catalogId) {
  const template = PET_CATALOG.find(p => p.id === catalogId);
  if (!template) return null;
  return {
    ...template,
    instanceId: uid(),
    bond: PET_MAX_BOND,
    energy: PET_MAX_ENERGY,
    hp: template.baseHp,
  };
}

// ---- HELPER: Get pet building buffs ----
export function getPetBuildingBuffs(petState) {
  const buffs = {
    bondRegen: 0,
    energyRegen: 0,
    petAtkBuff: 0,
    petDefBuff: 0,
    petHpBuff: 0,
    bondDecayReduction: 0,
    energyDecayReduction: 0,
  };
  if (!petState?.petBuildings) return buffs;

  for (const [buildingId, buildingState] of Object.entries(petState.petBuildings)) {
    if (!buildingState?.built) continue;
    const def = PET_BUILDINGS[buildingId];
    if (!def?.upgrades) continue;
    const level = buildingState.level || 1;
    const upgrade = def.upgrades.find(u => u.level === level);
    if (!upgrade) continue;

    if (upgrade.bondRegen) buffs.bondRegen += upgrade.bondRegen;
    if (upgrade.energyRegen) buffs.energyRegen += upgrade.energyRegen;
    if (upgrade.petAtkBuff) buffs.petAtkBuff += upgrade.petAtkBuff;
    if (upgrade.petDefBuff) buffs.petDefBuff += upgrade.petDefBuff;
    if (upgrade.petHpBuff) buffs.petHpBuff += upgrade.petHpBuff;
    if (upgrade.bondDecayReduction) buffs.bondDecayReduction += upgrade.bondDecayReduction;
    if (upgrade.energyDecayReduction) buffs.energyDecayReduction += upgrade.energyDecayReduction;
  }

  return buffs;
}

// ---- HELPER: Check if a pet will fight ----
export function willPetFight(pet) {
  if (pet.energy <= 0) return { fights: false, reason: 'No energy' };
  if (pet.bond < PET_LOW_BOND_THRESHOLD && Math.random() < PET_REFUSE_CHANCE_LOW_BOND) {
    return { fights: false, reason: 'Bond too low' };
  }
  return { fights: true, reason: null };
}

// ---- HELPER: Calculate pet combat damage ----
export function calcPetDamage(pet, monsterDef, buffs) {
  const atkMult = 1 + (buffs?.petAtkBuff || 0);
  const bondBonus = pet.bond >= 80 ? 1.15 : pet.bond >= 50 ? 1.0 : 0.85;
  const baseAtk = Math.floor(pet.baseAtk * atkMult * bondBonus);
  const effectiveDef = Math.max(0, monsterDef * (pet.ability?.piercePercent ? (1 - pet.ability.piercePercent) : 1));
  const base = Math.max(1, baseAtk - effectiveDef * 0.4);
  const variance = 0.85 + Math.random() * 0.3;
  let dmg = Math.max(1, Math.floor(base * (pet.ability?.power || 1.0) * variance));

  // Crit check for shadow cat etc
  if (pet.ability?.critChance && Math.random() < pet.ability.critChance) {
    dmg = dmg * 2;
  }

  return dmg;
}

// ---- HELPER: Calculate pet defend absorption ----
export function calcPetAbsorb(pet, incomingDmg, buffs) {
  if (pet.ability?.type !== 'defend') return { absorbed: 0, reflected: 0 };
  const defMult = 1 + (buffs?.petDefBuff || 0);
  const absorbPct = (pet.ability.absorbPercent || 0) * defMult;
  const absorbed = Math.floor(incomingDmg * Math.min(0.6, absorbPct)); // cap at 60%
  const reflected = pet.ability.reflectPercent ? Math.floor(incomingDmg * pet.ability.reflectPercent) : 0;
  return { absorbed, reflected };
}

// ---- HELPER: Calculate pet healing ----
export function calcPetHeal(pet, playerMaxHp, buffs) {
  if (pet.ability?.type !== 'heal') return { heal: 0, manaRestore: 0 };
  const bondBonus = pet.bond >= 80 ? 1.2 : pet.bond >= 50 ? 1.0 : 0.8;
  const heal = Math.floor(playerMaxHp * (pet.ability.healPercent || 0) * bondBonus);
  const manaRestore = pet.ability.manaRestore || 0;
  return { heal, manaRestore };
}

// ---- HELPER: Get pet buff contributions ----
export function calcPetBuffs(pet, buffs) {
  if (pet.ability?.type !== 'buff' && pet.ability?.type !== 'hybrid') return { atkBuff: 0, defBuff: 0, manaRegen: 0 };
  const bondBonus = pet.bond >= 80 ? 1.15 : pet.bond >= 50 ? 1.0 : 0.85;
  return {
    atkBuff: (pet.ability.atkBuff || 0) * bondBonus,
    defBuff: (pet.ability.defBuff || 0) * bondBonus,
    manaRegen: pet.ability.manaRegen || 0,
  };
}

// ---- SHOP HELPERS ----
export function getPetShopStock(playerLevel) {
  return PET_CATALOG.filter(p => p.levelReq <= playerLevel + 2);
}

export function getPetItemShop(playerLevel) {
  const snacks = PET_SNACKS.filter((s, i) => i <= Math.floor(playerLevel / 5) + 1);
  const potions = PET_ENERGY_POTIONS.filter((p, i) => i <= Math.floor(playerLevel / 6) + 1);
  return [...snacks, ...potions];
}

// ---- RARITY CSS HELPERS ----
export function getPetRarityClass(rarity) {
  switch (rarity) {
    case 'Common': return 'common';
    case 'Uncommon': return 'uncommon';
    case 'Rare': return 'rare';
    case 'Epic': return 'epic';
    case 'Legendary': return 'legendary';
    default: return '';
  }
}
