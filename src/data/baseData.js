// ============================================================
// BASE BUILDING SYSTEM - Data definitions for player bases
// ============================================================

import { uid } from '../engine/utils';

// ---- FUEL ITEMS ----
// Items that can be burned to power buildings
export const FUEL_ITEMS = {
  'scrap-wood': { name: 'Scrap Wood', fuelValue: 5, burnTime: 30 },       // 30 min
  'charcoal': { name: 'Charcoal', fuelValue: 15, burnTime: 90 },          // 90 min
  'coal-chunk': { name: 'Coal Chunk', fuelValue: 25, burnTime: 150 },     // 150 min
  'oil-canister': { name: 'Oil Canister', fuelValue: 40, burnTime: 240 }, // 240 min
  'plasma-core': { name: 'Plasma Core', fuelValue: 80, burnTime: 480 },   // 480 min
};

// ---- BUILDING MATERIALS ----
// These drop from monsters in different regions with low drop rates
export const BUILDING_MATERIALS = {
  'scrap-wood': {
    id: 'scrap-wood', name: 'Scrap Wood', type: 'material',
    icon: 'material', description: 'Salvaged wooden planks. Burns well or used for construction.',
    rarity: 'Common', sellPrice: 3, isFuel: true,
    regions: ['neon-district', 'frozen-wastes'],
  },
  'iron-ore': {
    id: 'iron-ore', name: 'Iron Ore', type: 'material',
    icon: 'material', description: 'Raw iron chunks dug from rubble.',
    rarity: 'Common', sellPrice: 5,
    regions: ['neon-district', 'scorched-badlands'],
  },
  'charcoal': {
    id: 'charcoal', name: 'Charcoal', type: 'material',
    icon: 'material', description: 'Compressed burnt wood. Great fuel source.',
    rarity: 'Uncommon', sellPrice: 8, isFuel: true,
    regions: ['scorched-badlands', 'toxic-marshlands'],
  },
  'stone-block': {
    id: 'stone-block', name: 'Stone Block', type: 'material',
    icon: 'material', description: 'Heavy cut stone for sturdy construction.',
    rarity: 'Common', sellPrice: 4,
    regions: ['frozen-wastes', 'scorched-badlands'],
  },
  'copper-wire': {
    id: 'copper-wire', name: 'Copper Wire', type: 'material',
    icon: 'material', description: 'Salvaged copper wiring for mechanisms.',
    rarity: 'Uncommon', sellPrice: 10,
    regions: ['neon-district', 'abyssal-depths'],
  },
  'crystal-shard': {
    id: 'crystal-shard', name: 'Crystal Shard', type: 'material',
    icon: 'material', description: 'A glowing shard of raw crystal. Used in advanced crafting.',
    rarity: 'Rare', sellPrice: 25,
    regions: ['frozen-wastes', 'celestial-highlands'],
  },
  'toxic-resin': {
    id: 'toxic-resin', name: 'Toxic Resin', type: 'material',
    icon: 'material', description: 'Thick resin harvested from marsh plants. Used in potions.',
    rarity: 'Uncommon', sellPrice: 12,
    regions: ['toxic-marshlands'],
  },
  'deep-coral': {
    id: 'deep-coral', name: 'Deep Coral', type: 'material',
    icon: 'material', description: 'Rare coral from the ocean depths.',
    rarity: 'Rare', sellPrice: 20,
    regions: ['abyssal-depths'],
  },
  'coal-chunk': {
    id: 'coal-chunk', name: 'Coal Chunk', type: 'material',
    icon: 'material', description: 'Dense coal. Excellent fuel with long burn time.',
    rarity: 'Uncommon', sellPrice: 15, isFuel: true,
    regions: ['scorched-badlands', 'abyssal-depths'],
  },
  'starlight-dust': {
    id: 'starlight-dust', name: 'Starlight Dust', type: 'material',
    icon: 'material', description: 'Shimmering dust from the celestial realm.',
    rarity: 'Epic', sellPrice: 50,
    regions: ['celestial-highlands'],
  },
  'void-essence': {
    id: 'void-essence', name: 'Void Essence', type: 'material',
    icon: 'material', description: 'Distilled essence from the void between worlds.',
    rarity: 'Legendary', sellPrice: 100,
    regions: ['void-nexus'],
  },
  'oil-canister': {
    id: 'oil-canister', name: 'Oil Canister', type: 'material',
    icon: 'material', description: 'Salvaged petroleum. Burns very hot and long.',
    rarity: 'Rare', sellPrice: 30, isFuel: true,
    regions: ['neon-district', 'scorched-badlands'],
  },
  'plasma-core': {
    id: 'plasma-core', name: 'Plasma Core', type: 'material',
    icon: 'material', description: 'Concentrated energy core. The ultimate fuel.',
    rarity: 'Epic', sellPrice: 60, isFuel: true,
    regions: ['void-nexus', 'celestial-highlands'],
  },
  'iron-ingot': {
    id: 'iron-ingot', name: 'Iron Ingot', type: 'material',
    icon: 'material', description: 'Refined iron bar. Used in workshop crafting.',
    rarity: 'Uncommon', sellPrice: 15,
    smeltedFrom: 'iron-ore',
  },
  'herb-bundle': {
    id: 'herb-bundle', name: 'Herb Bundle', type: 'material',
    icon: 'material', description: 'A bundle of medicinal herbs for brewing.',
    rarity: 'Common', sellPrice: 6,
    regions: ['toxic-marshlands', 'frozen-wastes', 'celestial-highlands'],
  },
  'glass-vial': {
    id: 'glass-vial', name: 'Glass Vial', type: 'material',
    icon: 'material', description: 'Empty vial for holding brewed concoctions.',
    rarity: 'Common', sellPrice: 3,
    regions: ['neon-district', 'scorched-badlands'],
  },
};

// Material drop weights by region (added to monster drop tables)
export const MATERIAL_DROP_CONFIG = {
  'neon-district': {
    dropRate: 0.07,
    materials: [
      { id: 'scrap-wood', weight: 40 },
      { id: 'iron-ore', weight: 30 },
      { id: 'copper-wire', weight: 15 },
      { id: 'glass-vial', weight: 25 },
      { id: 'oil-canister', weight: 5 },
    ],
  },
  'frozen-wastes': {
    dropRate: 0.09,
    materials: [
      { id: 'scrap-wood', weight: 30 },
      { id: 'stone-block', weight: 35 },
      { id: 'crystal-shard', weight: 8 },
      { id: 'herb-bundle', weight: 20 },
    ],
  },
  'scorched-badlands': {
    dropRate: 0.09,
    materials: [
      { id: 'iron-ore', weight: 35 },
      { id: 'stone-block', weight: 30 },
      { id: 'charcoal', weight: 25 },
      { id: 'coal-chunk', weight: 15 },
      { id: 'glass-vial', weight: 20 },
      { id: 'oil-canister', weight: 8 },
    ],
  },
  'toxic-marshlands': {
    dropRate: 0.10,
    materials: [
      { id: 'charcoal', weight: 25 },
      { id: 'toxic-resin', weight: 30 },
      { id: 'herb-bundle', weight: 35 },
    ],
  },
  'abyssal-depths': {
    dropRate: 0.10,
    materials: [
      { id: 'deep-coral', weight: 25 },
      { id: 'copper-wire', weight: 20 },
      { id: 'coal-chunk', weight: 18 },
    ],
  },
  'celestial-highlands': {
    dropRate: 0.12,
    materials: [
      { id: 'crystal-shard', weight: 15 },
      { id: 'starlight-dust', weight: 10 },
      { id: 'herb-bundle', weight: 25 },
      { id: 'plasma-core', weight: 5 },
    ],
  },
  'void-nexus': {
    dropRate: 0.14,
    materials: [
      { id: 'void-essence', weight: 8 },
      { id: 'plasma-core', weight: 10 },
      { id: 'starlight-dust', weight: 15 },
      { id: 'crystal-shard', weight: 20 },
    ],
  },
};

// ---- BUILDINGS ----
export const BUILDINGS = {
  brewery: {
    id: 'brewery',
    name: 'Brewery',
    description: 'Craft potions and energy drinks from gathered herbs and materials.',
    buildCost: { gold: 750, materials: { 'scrap-wood': 15, 'stone-block': 8, 'copper-wire': 5, 'glass-vial': 8, 'herb-bundle': 6, 'toxic-resin': 3, 'oil-canister': 1 } },
    icon: 'brewery',
    levelReq: 5,
  },
  smelter: {
    id: 'smelter',
    name: 'Smelter',
    description: 'Smelt raw ores and items into refined materials like iron ingots.',
    buildCost: { gold: 900, materials: { 'stone-block': 15, 'iron-ore': 12, 'charcoal': 8, 'coal-chunk': 4, 'copper-wire': 6, 'oil-canister': 2, 'scrap-wood': 10 } },
    icon: 'smelter',
    levelReq: 8,
  },
  workshop: {
    id: 'workshop',
    name: 'Workshop',
    description: 'Craft tools, gear, and medium-complexity items from refined materials.',
    buildCost: { gold: 1200, materials: { 'scrap-wood': 20, 'iron-ore': 15, 'copper-wire': 12, 'stone-block': 8, 'charcoal': 6, 'glass-vial': 4, 'iron-ingot': 3 } },
    icon: 'workshop',
    levelReq: 10,
  },
  inn: {
    id: 'inn',
    name: 'Inn',
    description: 'Pay gold for timed EXP boosts. Upgrade the inn for stronger boosts.',
    buildCost: { gold: 1000, materials: { 'scrap-wood': 25, 'stone-block': 15, 'glass-vial': 8, 'iron-ore': 10, 'copper-wire': 4, 'herb-bundle': 5 } },
    icon: 'inn',
    upgrades: [
      {
        level: 1, name: 'Basic Inn', expBonus: 0.10, desc: '+10% EXP boosts available',
        boosts: [
          { id: 'boost-1-short', name: 'Quick Meal', cost: 50, duration: 30 * 60 * 1000, desc: '+10% EXP for 30 min' },
          { id: 'boost-1-med', name: 'Hearty Dinner', cost: 120, duration: 2 * 60 * 60 * 1000, desc: '+10% EXP for 2 hours' },
        ],
      },
      {
        level: 2, name: 'Improved Inn', expBonus: 0.20, desc: '+20% EXP boosts available',
        upgradeCost: { gold: 1200, materials: { 'scrap-wood': 15, 'crystal-shard': 2 } },
        boosts: [
          { id: 'boost-2-short', name: 'Quick Feast', cost: 80, duration: 30 * 60 * 1000, desc: '+20% EXP for 30 min' },
          { id: 'boost-2-med', name: 'Tavern Special', cost: 180, duration: 2 * 60 * 60 * 1000, desc: '+20% EXP for 2 hours' },
          { id: 'boost-2-long', name: 'Room & Board', cost: 350, duration: 8 * 60 * 60 * 1000, desc: '+20% EXP for 8 hours' },
        ],
      },
      {
        level: 3, name: 'Grand Inn', expBonus: 0.35, desc: '+35% EXP boosts available',
        upgradeCost: { gold: 2500, materials: { 'scrap-wood': 25, 'crystal-shard': 5, 'starlight-dust': 2 } },
        boosts: [
          { id: 'boost-3-short', name: 'Grand Feast', cost: 120, duration: 30 * 60 * 1000, desc: '+35% EXP for 30 min' },
          { id: 'boost-3-med', name: 'VIP Dining', cost: 250, duration: 2 * 60 * 60 * 1000, desc: '+35% EXP for 2 hours' },
          { id: 'boost-3-long', name: 'Grand Suite', cost: 500, duration: 8 * 60 * 60 * 1000, desc: '+35% EXP for 8 hours' },
          { id: 'boost-3-day', name: 'Royal Treatment', cost: 900, duration: 24 * 60 * 60 * 1000, desc: '+35% EXP for 24 hours' },
        ],
      },
    ],
    levelReq: 7,
  },
  chamber: {
    id: 'chamber',
    name: 'Chamber',
    description: 'Your personal quarters. Upgrades improve healing and provide passive buffs.',
    buildCost: { gold: 600, materials: { 'scrap-wood': 18, 'stone-block': 12, 'iron-ore': 6, 'glass-vial': 4, 'charcoal': 3, 'copper-wire': 2 } },
    icon: 'chamber',
    subUpgrades: {
      bed: {
        id: 'bed', name: 'Bed',
        levels: [
          { level: 1, name: 'Straw Mattress', healBonus: 0.10, desc: 'Rest heals 10% more', cost: { gold: 200, materials: { 'scrap-wood': 5 } } },
          { level: 2, name: 'Wooden Bed', healBonus: 0.25, desc: 'Rest heals 25% more', cost: { gold: 500, materials: { 'scrap-wood': 10, 'iron-ore': 3 } } },
          { level: 3, name: 'Royal Bed', healBonus: 0.50, desc: 'Rest heals 50% more + regen over time', cost: { gold: 1500, materials: { 'crystal-shard': 3, 'starlight-dust': 1 } } },
        ],
      },
      kitchen: {
        id: 'kitchen', name: 'Kitchen',
        levels: [
          { level: 1, name: 'Campfire Grill', atkBuff: 2, desc: '+2 ATK passive buff', cost: { gold: 300, materials: { 'stone-block': 5, 'scrap-wood': 3, 'charcoal': 2 } } },
          { level: 2, name: 'Proper Kitchen', atkBuff: 5, defBuff: 2, desc: '+5 ATK, +2 DEF passive buff', cost: { gold: 800, materials: { 'iron-ore': 5, 'copper-wire': 3, 'charcoal': 5 } } },
          { level: 3, name: 'Gourmet Kitchen', atkBuff: 10, defBuff: 5, hpBuff: 20, desc: '+10 ATK, +5 DEF, +20 Max HP', cost: { gold: 2000, materials: { 'crystal-shard': 2, 'deep-coral': 3, 'starlight-dust': 1 } } },
        ],
      },
      study: {
        id: 'study', name: 'Study',
        levels: [
          { level: 1, name: 'Bookshelf', wisdomBuff: 2, desc: '+2 Wisdom', cost: { gold: 250, materials: { 'scrap-wood': 8 } } },
          { level: 2, name: 'Library', wisdomBuff: 5, manaBuff: 10, desc: '+5 Wisdom, +10 Max Mana', cost: { gold: 700, materials: { 'scrap-wood': 15, 'crystal-shard': 2 } } },
          { level: 3, name: 'Arcane Study', wisdomBuff: 10, manaBuff: 25, desc: '+10 Wisdom, +25 Max Mana', cost: { gold: 1800, materials: { 'crystal-shard': 4, 'void-essence': 1 } } },
        ],
      },
    },
    levelReq: 3,
  },
  adventureCamp: {
    id: 'adventureCamp',
    name: 'Adventure Camp',
    description: 'Send squads to pillage for you. Returns random items and gold after a set time.',
    buildCost: { gold: 1500, materials: { 'scrap-wood': 25, 'stone-block': 20, 'iron-ore': 15, 'copper-wire': 8, 'charcoal': 6, 'glass-vial': 4, 'herb-bundle': 5 } },
    icon: 'camp',
    missions: [
      { id: 'quick-raid', name: 'Quick Raid', duration: 1 * 60 * 60 * 1000, desc: '1 hour - Small loot', lootTier: 1, goldRange: [10, 50] },
      { id: 'supply-run', name: 'Supply Run', duration: 4 * 60 * 60 * 1000, desc: '4 hours - Moderate loot', lootTier: 2, goldRange: [30, 120] },
      { id: 'deep-expedition', name: 'Deep Expedition', duration: 8 * 60 * 60 * 1000, desc: '8 hours - Good loot', lootTier: 3, goldRange: [80, 250] },
      { id: 'full-campaign', name: 'Full Campaign', duration: 24 * 60 * 60 * 1000, desc: '24 hours - Best loot', lootTier: 4, goldRange: [200, 600] },
    ],
    levelReq: 12,
  },
  sparringRange: {
    id: 'sparringRange',
    name: 'Sparring Range',
    description: 'Test your kits, spells, and strategies against training dummies.',
    buildCost: { gold: 900, materials: { 'scrap-wood': 20, 'iron-ore': 12, 'stone-block': 8, 'charcoal': 5, 'copper-wire': 4, 'glass-vial': 3, 'coal-chunk': 2 } },
    icon: 'spar',
    levelReq: 6,
  },
  bank: {
    id: 'bank',
    name: 'Bank',
    description: 'Deposit gold safely (10% fee), borrow funds, or freeze gold for interest.',
    buildCost: { gold: 2500, materials: { 'stone-block': 25, 'iron-ore': 20, 'copper-wire': 15, 'crystal-shard': 5, 'deep-coral': 3, 'charcoal': 8, 'glass-vial': 6, 'oil-canister': 3 } },
    icon: 'bank',
    depositFee: 0.10,
    freezeOptions: [
      { id: 'freeze-7', days: 7, interestRate: 0.01, desc: '7 days - 1% return' },
      { id: 'freeze-14', days: 14, interestRate: 0.021, desc: '14 days - 2.1% return' },
      { id: 'freeze-31', days: 31, interestRate: 0.05, desc: '31 days - 5% return' },
    ],
    maxFreezeAmount: 1000,
    maxLoanAmount: 1000,
    levelReq: 15,
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    description: 'Plant seeds found while exploring, grow crops, and sell them for profit.',
    buildCost: { gold: 800, materials: { 'scrap-wood': 20, 'stone-block': 10, 'herb-bundle': 8, 'iron-ore': 5, 'glass-vial': 3 } },
    icon: 'farm',
    plots: 3,
    crops: [
      // --- Tier 1: Quick crops (15-45 min) ---
      { id: 'herb-patch', name: 'Herb Patch', growTime: 30 * 60 * 1000, desc: '30 min - Herb Bundles + Food', cost: { gold: 20 }, yield: { materialId: 'herb-bundle', qty: [2, 4] }, foodYield: { name: 'Fresh Herbs', fuelMinutes: 10 } },
      { id: 'iron-root', name: 'Iron Root', growTime: 45 * 60 * 1000, desc: '45 min - Iron Ore + Food', cost: { gold: 30 }, yield: { materialId: 'iron-ore', qty: [2, 4] }, foodYield: { name: 'Root Vegetables', fuelMinutes: 15 } },
      { id: 'neon-lettuce', name: 'Neon Lettuce', growTime: 15 * 60 * 1000, desc: '15 min - Quick food crop', cost: { gold: 10 }, yield: { gold: [12, 18] }, foodYield: { name: 'Neon Lettuce Wrap', fuelMinutes: 5 } },
      { id: 'glow-radish', name: 'Glow Radish', growTime: 20 * 60 * 1000, desc: '20 min - Glass Vials + Food', cost: { gold: 15 }, yield: { materialId: 'glass-vial', qty: [1, 3] }, foodYield: { name: 'Pickled Radish', fuelMinutes: 8 } },
      { id: 'scrap-moss', name: 'Scrap Moss', growTime: 25 * 60 * 1000, desc: '25 min - Scrap Wood + Food', cost: { gold: 18 }, yield: { materialId: 'scrap-wood', qty: [2, 5] }, foodYield: { name: 'Moss Soup', fuelMinutes: 9 } },
      { id: 'rust-wheat', name: 'Rust Wheat', growTime: 35 * 60 * 1000, desc: '35 min - Gold + Food', cost: { gold: 25 }, yield: { gold: [30, 50] }, foodYield: { name: 'Rust Bread', fuelMinutes: 12 } },

      // --- Tier 2: Medium crops (1-2 hours) ---
      { id: 'toxic-vine', name: 'Toxic Vine', growTime: 1 * 60 * 60 * 1000, desc: '1 hour - Toxic Resin + Food', cost: { gold: 40 }, yield: { materialId: 'toxic-resin', qty: [1, 3] }, foodYield: { name: 'Vine Berries', fuelMinutes: 20 } },
      { id: 'crystal-bloom', name: 'Crystal Bloom', growTime: 2 * 60 * 60 * 1000, desc: '2 hours - Crystal Shards + Food', cost: { gold: 80 }, yield: { materialId: 'crystal-shard', qty: [1, 2] }, foodYield: { name: 'Crystal Nectar', fuelMinutes: 40 } },
      { id: 'charcoal-fungus', name: 'Charcoal Fungus', growTime: 1.5 * 60 * 60 * 1000, desc: '1.5 hours - Charcoal + Food', cost: { gold: 50 }, yield: { materialId: 'charcoal', qty: [2, 4] }, foodYield: { name: 'Smoked Mushroom', fuelMinutes: 25 } },
      { id: 'copper-melon', name: 'Copper Melon', growTime: 1 * 60 * 60 * 1000, desc: '1 hour - Copper Wire + Food', cost: { gold: 45 }, yield: { materialId: 'copper-wire', qty: [1, 2] }, foodYield: { name: 'Melon Slices', fuelMinutes: 22 } },
      { id: 'stone-tuber', name: 'Stone Tuber', growTime: 50 * 60 * 1000, desc: '50 min - Stone Blocks + Food', cost: { gold: 35 }, yield: { materialId: 'stone-block', qty: [2, 4] }, foodYield: { name: 'Baked Tuber', fuelMinutes: 18 } },
      { id: 'marsh-pepper', name: 'Marsh Pepper', growTime: 1.25 * 60 * 60 * 1000, desc: '1.25 hours - Toxic Resin + Food', cost: { gold: 55 }, yield: { materialId: 'toxic-resin', qty: [2, 4] }, foodYield: { name: 'Spicy Pepper Stew', fuelMinutes: 28 } },
      { id: 'ember-corn', name: 'Ember Corn', growTime: 1 * 60 * 60 * 1000, desc: '1 hour - Coal Chunks + Food', cost: { gold: 60 }, yield: { materialId: 'coal-chunk', qty: [1, 2] }, foodYield: { name: 'Popped Ember Corn', fuelMinutes: 30 } },
      { id: 'frost-carrot', name: 'Frost Carrot', growTime: 1.5 * 60 * 60 * 1000, desc: '1.5 hours - Stone Blocks + Food', cost: { gold: 65 }, yield: { materialId: 'stone-block', qty: [3, 5] }, foodYield: { name: 'Frost Carrot Cake', fuelMinutes: 32 } },

      // --- Tier 3: Slow crops (3-6 hours) ---
      { id: 'gold-grain', name: 'Gold Grain', growTime: 4 * 60 * 60 * 1000, desc: '4 hours - Gold harvest + Food', cost: { gold: 100 }, yield: { gold: [150, 300] }, foodYield: { name: 'Golden Porridge', fuelMinutes: 50 } },
      { id: 'coral-bulb', name: 'Coral Bulb', growTime: 3 * 60 * 60 * 1000, desc: '3 hours - Deep Coral + Food', cost: { gold: 120 }, yield: { materialId: 'deep-coral', qty: [1, 2] }, foodYield: { name: 'Coral Chowder', fuelMinutes: 60 } },
      { id: 'iron-pumpkin', name: 'Iron Pumpkin', growTime: 3.5 * 60 * 60 * 1000, desc: '3.5 hours - Iron Ore + Food', cost: { gold: 90 }, yield: { materialId: 'iron-ore', qty: [4, 8] }, foodYield: { name: 'Pumpkin Pie', fuelMinutes: 45 } },
      { id: 'plasma-grape', name: 'Plasma Grape', growTime: 5 * 60 * 60 * 1000, desc: '5 hours - Gold + Food', cost: { gold: 150 }, yield: { gold: [220, 420] }, foodYield: { name: 'Plasma Wine', fuelMinutes: 75 } },
      { id: 'thunder-bean', name: 'Thunder Bean', growTime: 4 * 60 * 60 * 1000, desc: '4 hours - Crystal Shards + Food', cost: { gold: 130 }, yield: { materialId: 'crystal-shard', qty: [2, 3] }, foodYield: { name: 'Thunder Bean Chili', fuelMinutes: 65 } },
      { id: 'oil-seed', name: 'Oil Seed', growTime: 3 * 60 * 60 * 1000, desc: '3 hours - Oil Canisters + Food', cost: { gold: 110 }, yield: { materialId: 'oil-canister', qty: [1, 2] }, foodYield: { name: 'Fried Oil Cakes', fuelMinutes: 55 } },

      // --- Tier 4: Long crops (6-12 hours) ---
      { id: 'starlight-flower', name: 'Starlight Flower', growTime: 8 * 60 * 60 * 1000, desc: '8 hours - Starlight Dust + Food', cost: { gold: 200 }, yield: { materialId: 'starlight-dust', qty: [1, 2] }, foodYield: { name: 'Starlight Salad', fuelMinutes: 100 } },
      { id: 'void-orchid', name: 'Void Orchid', growTime: 12 * 60 * 60 * 1000, desc: '12 hours - Void Essence + Food', cost: { gold: 400 }, yield: { materialId: 'void-essence', qty: [1, 1] }, foodYield: { name: 'Void Truffle Risotto', fuelMinutes: 200 } },
      { id: 'celestial-fig', name: 'Celestial Fig', growTime: 10 * 60 * 60 * 1000, desc: '10 hours - Gold + Food', cost: { gold: 300 }, yield: { gold: [500, 800] }, foodYield: { name: 'Celestial Fig Tart', fuelMinutes: 150 } },
      { id: 'abyssal-kelp', name: 'Abyssal Kelp', growTime: 6 * 60 * 60 * 1000, desc: '6 hours - Deep Coral + Food', cost: { gold: 180 }, yield: { materialId: 'deep-coral', qty: [2, 3] }, foodYield: { name: 'Kelp Noodle Bowl', fuelMinutes: 90 } },
    ],
    levelReq: 4,
  },
  incubator: {
    id: 'incubator',
    name: 'Incubator',
    description: 'Place rare eggs found from monsters to hatch them into pets over time.',
    buildCost: { gold: 1200, materials: { 'stone-block': 12, 'crystal-shard': 4, 'copper-wire': 6, 'scrap-wood': 15, 'herb-bundle': 5 } },
    icon: 'incubator',
    levelReq: 8,
    upgrades: [
      { level: 1, name: 'Basic Incubator', slots: 1, desc: '1 egg slot' },
      {
        level: 2, name: 'Heated Incubator', slots: 2, desc: '2 egg slots, 15% faster hatching',
        speedBonus: 0.15,
        upgradeCost: { gold: 2000, materials: { 'crystal-shard': 5, 'charcoal': 8, 'copper-wire': 4, 'coal-chunk': 3 } },
      },
      {
        level: 3, name: 'Arcane Incubator', slots: 3, desc: '3 egg slots, 30% faster hatching',
        speedBonus: 0.30,
        upgradeCost: { gold: 4000, materials: { 'crystal-shard': 8, 'starlight-dust': 3, 'void-essence': 1, 'plasma-core': 2 } },
      },
    ],
  },
  warehouse: {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Expand your inventory capacity. Upgrade for even more storage space.',
    buildCost: { gold: 1000, materials: { 'scrap-wood': 22, 'stone-block': 15, 'iron-ore': 10, 'copper-wire': 6, 'charcoal': 4 } },
    icon: 'warehouse',
    upgrades: [
      { level: 1, name: 'Basic Warehouse', inventoryBonus: 20, desc: '+20 inventory slots (50 total)' },
      { level: 2, name: 'Expanded Warehouse', inventoryBonus: 30, desc: '+30 inventory slots (60 total)', upgradeCost: { gold: 1500, materials: { 'scrap-wood': 15, 'stone-block': 10, 'iron-ore': 8, 'copper-wire': 4 } } },
      { level: 3, name: 'Reinforced Warehouse', inventoryBonus: 40, desc: '+40 inventory slots (70 total)', upgradeCost: { gold: 2500, materials: { 'iron-ingot': 5, 'stone-block': 15, 'crystal-shard': 3, 'copper-wire': 6 } } },
      { level: 4, name: 'Grand Warehouse', inventoryBonus: 50, desc: '+50 inventory slots (80 total)', upgradeCost: { gold: 4000, materials: { 'iron-ingot': 8, 'crystal-shard': 5, 'deep-coral': 3, 'starlight-dust': 2 } } },
      { level: 5, name: 'Legendary Vault', inventoryBonus: 60, desc: '+60 inventory slots (90 total)', upgradeCost: { gold: 7000, materials: { 'iron-ingot': 12, 'crystal-shard': 8, 'starlight-dust': 4, 'void-essence': 2 } } },
    ],
    levelReq: 5,
  },
};

// ---- BREWERY RECIPES ----
export const BREWERY_RECIPES = [
  {
    id: 'brew-small-potion', name: 'Brew Small Medkit',
    materials: { 'herb-bundle': 2, 'glass-vial': 1 },
    result: { type: 'potion', tier: 0 }, craftTime: 5000,
    desc: 'Brew a basic healing potion.',
  },
  {
    id: 'brew-medkit', name: 'Brew Standard Medkit',
    materials: { 'herb-bundle': 4, 'glass-vial': 1, 'toxic-resin': 1 },
    result: { type: 'potion', tier: 1 }, craftTime: 10000,
    desc: 'Brew a standard healing potion.',
  },
  {
    id: 'brew-combat-stim', name: 'Brew Combat Stim',
    materials: { 'herb-bundle': 5, 'glass-vial': 2, 'toxic-resin': 2, 'crystal-shard': 1 },
    result: { type: 'potion', tier: 2 }, craftTime: 15000,
    desc: 'Brew a powerful combat stimulant.',
  },
  {
    id: 'brew-energy-shot', name: 'Brew Cheap Energy Shot',
    materials: { 'herb-bundle': 1, 'glass-vial': 1 },
    result: { type: 'energy-drink', tier: 0 }, craftTime: 5000,
    desc: 'Brew a basic energy drink.',
  },
  {
    id: 'brew-energy-drink', name: 'Brew Standard Energy Drink',
    materials: { 'herb-bundle': 3, 'glass-vial': 1, 'toxic-resin': 1 },
    result: { type: 'energy-drink', tier: 1 }, craftTime: 10000,
    desc: 'Brew a decent energy drink.',
  },
  {
    id: 'brew-hyperdrive', name: 'Brew Hyperdrive Elixir',
    materials: { 'herb-bundle': 8, 'glass-vial': 3, 'toxic-resin': 3, 'starlight-dust': 1 },
    result: { type: 'energy-drink', tier: 3 }, craftTime: 20000,
    desc: 'Brew the ultimate energy restoration elixir.',
  },
  // --- TAVERN-UNLOCKED RECIPES ---
  {
    id: 'brew-grogs-tonic', name: "Brew Grog's Fortifying Tonic",
    tavernNpc: 'bartender', tavernReqRep: 2,
    materials: { 'herb-bundle': 6, 'glass-vial': 2, 'toxic-resin': 2 },
    result: { type: 'potion', tier: 2 }, craftTime: 12000,
    desc: "Grog's secret recipe. Heals more than a standard combat stim.",
  },
  {
    id: 'brew-whisper-venom', name: "Brew Whisper's Venom Draught",
    tavernNpc: 'whisper', tavernReqRep: 3,
    materials: { 'toxic-resin': 5, 'glass-vial': 2, 'herb-bundle': 3 },
    result: { type: 'potion', tier: 3 }, craftTime: 18000,
    desc: "Whisper's poison-turned-medicine. Potent healing with a bitter aftertaste.",
  },
  {
    id: 'brew-fenwick-elixir', name: "Brew Fenwick's Veteran Elixir",
    tavernNpc: 'fenwick', tavernReqRep: 3,
    materials: { 'herb-bundle': 10, 'crystal-shard': 2, 'glass-vial': 3 },
    result: { type: 'energy-drink', tier: 2 }, craftTime: 15000,
    desc: "Old Fenwick's personal energy blend from his adventuring days.",
  },
  {
    id: 'brew-mira-profit-potion', name: "Brew Mira's Golden Draught",
    tavernNpc: 'mira', tavernReqRep: 2,
    materials: { 'herb-bundle': 4, 'glass-vial': 2, 'crystal-shard': 1 },
    result: { type: 'potion', tier: 1 }, craftTime: 8000,
    desc: "Mira's budget-friendly recipe. Cheap to make, sells well.",
  },
  {
    id: 'brew-thorne-battlestim', name: "Brew Thorne's Field Stim",
    tavernNpc: 'thorne', tavernReqRep: 2,
    materials: { 'herb-bundle': 5, 'glass-vial': 2, 'iron-ore': 2 },
    result: { type: 'energy-drink', tier: 1 }, craftTime: 10000,
    desc: "Military-grade energy stim. Thorne's squad swears by it.",
  },
];

// ---- SMELTER RECIPES ----
export const SMELTER_RECIPES = [
  {
    id: 'smelt-iron', name: 'Smelt Iron Ingot',
    materials: { 'iron-ore': 3 },
    fuelRequired: 5,
    result: { materialId: 'iron-ingot', quantity: 1 }, craftTime: 8000,
    desc: 'Refine iron ore into a usable ingot.',
  },
  {
    id: 'smelt-crystal', name: 'Refine Crystal',
    materials: { 'crystal-shard': 2, 'coal-chunk': 1 },
    fuelRequired: 15,
    result: { materialId: 'crystal-shard', quantity: 3 }, craftTime: 15000,
    desc: 'Purify crystal shards into more refined pieces.',
  },
  {
    id: 'smelt-scrap-to-iron', name: 'Reclaim Iron from Gear',
    salvageGear: true,
    fuelRequired: 10,
    result: { materialId: 'iron-ore', quantity: 2 }, craftTime: 10000,
    desc: 'Melt down equipment to extract raw iron ore.',
  },
  {
    id: 'smelt-copper', name: 'Refine Copper Wire',
    materials: { 'copper-wire': 2, 'coal-chunk': 1 },
    fuelRequired: 8,
    result: { materialId: 'copper-wire', quantity: 3 }, craftTime: 10000,
    desc: 'Purify and extend copper wiring.',
  },
  // --- TAVERN-UNLOCKED RECIPES ---
  {
    id: 'smelt-whisper-alloy', name: "Whisper's Shadow Alloy",
    tavernNpc: 'whisper', tavernReqRep: 3,
    materials: { 'iron-ore': 4, 'coal-chunk': 2, 'void-essence': 1 },
    fuelRequired: 20,
    result: { materialId: 'iron-ingot', quantity: 5 }, craftTime: 15000,
    desc: "Whisper's contacts taught her this high-yield smelting technique.",
  },
  {
    id: 'smelt-thorne-reforge', name: "Thorne's Military Reforge",
    tavernNpc: 'thorne', tavernReqRep: 4,
    salvageGear: true,
    fuelRequired: 15,
    result: { materialId: 'iron-ingot', quantity: 3 }, craftTime: 12000,
    desc: "Military-grade salvage technique. Extracts more material from gear.",
  },
  {
    id: 'smelt-mira-crystal-refine', name: "Mira's Crystal Purification",
    tavernNpc: 'mira', tavernReqRep: 4,
    materials: { 'crystal-shard': 1, 'starlight-dust': 1 },
    fuelRequired: 25,
    result: { materialId: 'crystal-shard', quantity: 5 }, craftTime: 20000,
    desc: "Mira's trade secret for multiplying crystal shards.",
  },
];

// ---- WORKSHOP RECIPES ----
export const WORKSHOP_RECIPES = [
  // --- WEAPONS (5) ---
  {
    id: 'craft-iron-dagger', name: 'Forge Iron Dagger',
    materials: { 'iron-ingot': 2, 'scrap-wood': 1 },
    result: { type: 'sword', template: 'crafted-iron-dagger' }, craftTime: 8000,
    desc: 'A light, quick iron dagger.',
  },
  {
    id: 'craft-iron-sword', name: 'Forge Iron Blade',
    materials: { 'iron-ingot': 3, 'scrap-wood': 2 },
    result: { type: 'sword', template: 'crafted-iron-blade' }, craftTime: 12000,
    desc: 'Forge a sturdy iron blade.',
  },
  {
    id: 'craft-crystal-staff', name: 'Craft Crystal Staff',
    materials: { 'crystal-shard': 4, 'scrap-wood': 3, 'copper-wire': 1 },
    result: { type: 'sword', template: 'crafted-crystal-staff' }, craftTime: 14000,
    desc: 'Channel crystal energy through a wooden staff.',
  },
  {
    id: 'craft-plasma-edge', name: 'Forge Plasma Edge',
    materials: { 'plasma-core': 2, 'iron-ingot': 3, 'crystal-shard': 1 },
    result: { type: 'sword', template: 'crafted-plasma-edge' }, craftTime: 20000,
    desc: 'A blade infused with raw plasma energy.',
  },
  {
    id: 'craft-void-cleaver', name: 'Forge Void Cleaver',
    materials: { 'void-essence': 2, 'iron-ingot': 4, 'crystal-shard': 2 },
    result: { type: 'sword', template: 'crafted-void-cleaver' }, craftTime: 25000,
    desc: 'A devastating weapon forged from the void.',
  },
  // --- SHIELDS (4) ---
  {
    id: 'craft-iron-shield', name: 'Forge Iron Buckler',
    materials: { 'iron-ingot': 4, 'copper-wire': 2 },
    result: { type: 'shield', template: 'crafted-iron-buckler' }, craftTime: 12000,
    desc: 'Hammer out a reliable iron shield.',
  },
  {
    id: 'craft-reinforced-barricade', name: 'Forge Reinforced Barricade',
    materials: { 'iron-ingot': 5, 'stone-block': 4, 'copper-wire': 2 },
    result: { type: 'shield', template: 'crafted-reinforced-barricade' }, craftTime: 16000,
    desc: 'A heavy shield built to absorb massive blows.',
  },
  {
    id: 'craft-crystal-ward', name: 'Craft Crystal Ward',
    materials: { 'crystal-shard': 4, 'iron-ingot': 2, 'glass-vial': 1 },
    result: { type: 'shield', template: 'crafted-crystal-ward' }, craftTime: 14000,
    desc: 'A shimmering shield of woven crystal.',
  },
  {
    id: 'craft-coral-bulwark', name: 'Craft Coral Bulwark',
    materials: { 'deep-coral': 4, 'iron-ingot': 3, 'copper-wire': 2 },
    result: { type: 'shield', template: 'crafted-coral-bulwark' }, craftTime: 18000,
    desc: 'Deep-sea coral shaped into a resilient barrier.',
  },
  // --- HELMETS (4) ---
  {
    id: 'craft-iron-helm', name: 'Forge Iron Helm',
    materials: { 'iron-ingot': 2, 'copper-wire': 1 },
    result: { type: 'helmet', template: 'crafted-iron-helm' }, craftTime: 10000,
    desc: 'Shape iron into a protective helmet.',
  },
  {
    id: 'craft-copper-circlet', name: 'Craft Copper Circlet',
    materials: { 'copper-wire': 3, 'iron-ingot': 1 },
    result: { type: 'helmet', template: 'crafted-copper-circlet' }, craftTime: 10000,
    desc: 'A lightweight circlet woven from copper.',
  },
  {
    id: 'craft-crystal-tiara', name: 'Craft Crystal Tiara',
    materials: { 'crystal-shard': 3, 'copper-wire': 2, 'glass-vial': 1 },
    result: { type: 'helmet', template: 'crafted-crystal-tiara' }, craftTime: 14000,
    desc: 'A tiara set with focusing crystal shards.',
  },
  {
    id: 'craft-starlight-crown', name: 'Forge Starlight Crown',
    materials: { 'starlight-dust': 2, 'crystal-shard': 3, 'iron-ingot': 2 },
    result: { type: 'helmet', template: 'crafted-starlight-crown' }, craftTime: 22000,
    desc: 'A radiant crown forged from starlight.',
  },
  // --- ARMOR (4) ---
  {
    id: 'craft-iron-armor', name: 'Forge Iron Chestplate',
    materials: { 'iron-ingot': 5, 'copper-wire': 3 },
    result: { type: 'armor', template: 'crafted-iron-chestplate' }, craftTime: 15000,
    desc: 'Forge heavy iron body armor.',
  },
  {
    id: 'craft-stone-vest', name: 'Forge Stone Guard Vest',
    materials: { 'stone-block': 5, 'iron-ingot': 3, 'scrap-wood': 3 },
    result: { type: 'armor', template: 'crafted-stone-vest' }, craftTime: 14000,
    desc: 'Sturdy armor reinforced with cut stone.',
  },
  {
    id: 'craft-coral-chainmail', name: 'Craft Coral Chainmail',
    materials: { 'deep-coral': 3, 'iron-ingot': 4, 'copper-wire': 3 },
    result: { type: 'armor', template: 'crafted-coral-chainmail' }, craftTime: 18000,
    desc: 'Interlocking coral plates over iron chain.',
  },
  {
    id: 'craft-starlight-robe', name: 'Weave Starlight Robe',
    materials: { 'starlight-dust': 3, 'crystal-shard': 4, 'scrap-wood': 4 },
    result: { type: 'armor', template: 'crafted-starlight-robe' }, craftTime: 22000,
    desc: 'A radiant robe woven from celestial dust.',
  },
  // --- BOOTS (4) ---
  {
    id: 'craft-iron-greaves', name: 'Forge Iron Greaves',
    materials: { 'iron-ingot': 3, 'copper-wire': 2, 'stone-block': 2 },
    result: { type: 'boots', template: 'crafted-iron-greaves' }, craftTime: 12000,
    desc: 'Heavy iron greaves for maximum protection.',
  },
  {
    id: 'craft-explorer-boots', name: 'Craft Explorer Boots',
    materials: { 'iron-ingot': 2, 'toxic-resin': 2, 'deep-coral': 1 },
    result: { type: 'boots', template: 'crafted-explorer-boots' }, craftTime: 12000,
    desc: 'Sturdy boots for long expeditions.',
  },
  {
    id: 'craft-marsh-striders', name: 'Craft Marsh Striders',
    materials: { 'toxic-resin': 4, 'scrap-wood': 3, 'herb-bundle': 2 },
    result: { type: 'boots', template: 'crafted-marsh-striders' }, craftTime: 12000,
    desc: 'Resin-coated boots that grip any terrain.',
  },
  {
    id: 'craft-crystal-walkers', name: 'Craft Crystal Walkers',
    materials: { 'crystal-shard': 3, 'iron-ingot': 2, 'glass-vial': 2 },
    result: { type: 'boots', template: 'crafted-crystal-walkers' }, craftTime: 16000,
    desc: 'Boots lined with crystal for agility and defense.',
  },
  // --- ACCESSORIES (4) ---
  {
    id: 'craft-iron-bracelet', name: 'Craft Iron Bracelet',
    materials: { 'iron-ingot': 2, 'copper-wire': 2 },
    result: { type: 'ring', template: 'crafted-iron-bracelet' }, craftTime: 8000,
    desc: 'A solid iron bangle for wrist protection.',
  },
  {
    id: 'craft-crystal-ring', name: 'Craft Crystal Ring',
    materials: { 'crystal-shard': 3, 'copper-wire': 2, 'iron-ingot': 1 },
    result: { type: 'ring', template: 'crafted-crystal-ring' }, craftTime: 12000,
    desc: 'Set crystal into a powerful ring.',
  },
  {
    id: 'craft-coral-charm', name: 'Craft Coral Charm',
    materials: { 'deep-coral': 2, 'copper-wire': 2, 'glass-vial': 1 },
    result: { type: 'ring', template: 'crafted-coral-charm' }, craftTime: 12000,
    desc: 'A deep-sea coral amulet with protective properties.',
  },
  {
    id: 'craft-starlight-pendant', name: 'Craft Starlight Pendant',
    materials: { 'starlight-dust': 2, 'crystal-shard': 2, 'copper-wire': 1 },
    result: { type: 'ring', template: 'crafted-starlight-pendant' }, craftTime: 20000,
    desc: 'A pendant that radiates with celestial power.',
  },
  // --- GLOVES (3) ---
  {
    id: 'craft-iron-gauntlets', name: 'Craft Iron Gauntlets',
    materials: { 'iron-ingot': 3, 'scrap-wood': 1 },
    result: { type: 'gloves', template: 'crafted-iron-gauntlets' }, craftTime: 10000,
    desc: 'Sturdy iron gauntlets for hand protection.',
  },
  {
    id: 'craft-crystal-handguards', name: 'Craft Crystal Handguards',
    materials: { 'crystal-shard': 3, 'iron-ingot': 2, 'copper-wire': 1 },
    result: { type: 'gloves', template: 'crafted-crystal-handguards' }, craftTime: 14000,
    desc: 'Crystal-reinforced handguards with arcane power.',
  },
  {
    id: 'craft-starlight-grips', name: 'Craft Starlight Grips',
    materials: { 'starlight-dust': 2, 'crystal-shard': 2, 'iron-ingot': 1 },
    result: { type: 'gloves', template: 'crafted-starlight-grips' }, craftTime: 20000,
    desc: 'Gloves infused with starlight energy.',
  },
  // --- AMULETS (3) ---
  {
    id: 'craft-copper-pendant', name: 'Craft Copper Pendant',
    materials: { 'copper-wire': 3, 'glass-vial': 1 },
    result: { type: 'amulet', template: 'crafted-copper-pendant' }, craftTime: 8000,
    desc: 'A simple copper pendant with modest power.',
  },
  {
    id: 'craft-crystal-amulet', name: 'Craft Crystal Amulet',
    materials: { 'crystal-shard': 3, 'copper-wire': 2, 'glass-vial': 1 },
    result: { type: 'amulet', template: 'crafted-crystal-amulet' }, craftTime: 14000,
    desc: 'An amulet with a crystal core that amplifies power.',
  },
  {
    id: 'craft-starlight-talisman', name: 'Craft Starlight Talisman',
    materials: { 'starlight-dust': 3, 'crystal-shard': 1, 'copper-wire': 1 },
    result: { type: 'amulet', template: 'crafted-starlight-talisman' }, craftTime: 20000,
    desc: 'A talisman radiating with celestial energy.',
  },
  // --- BELTS (3) ---
  {
    id: 'craft-iron-girdle', name: 'Craft Iron Girdle',
    materials: { 'iron-ingot': 2, 'scrap-wood': 2 },
    result: { type: 'belt', template: 'crafted-iron-girdle' }, craftTime: 10000,
    desc: 'A heavy iron girdle for core protection.',
  },
  {
    id: 'craft-crystal-belt', name: 'Craft Crystal Belt',
    materials: { 'crystal-shard': 2, 'iron-ingot': 2, 'copper-wire': 1 },
    result: { type: 'belt', template: 'crafted-crystal-belt' }, craftTime: 14000,
    desc: 'A belt reinforced with crystal plating.',
  },
  {
    id: 'craft-starlight-sash', name: 'Craft Starlight Sash',
    materials: { 'starlight-dust': 2, 'crystal-shard': 1, 'iron-ingot': 1 },
    result: { type: 'belt', template: 'crafted-starlight-sash' }, craftTime: 20000,
    desc: 'A sash woven from threads of starlight.',
  },
  // --- CAPES (3) ---
  {
    id: 'craft-woven-cloak', name: 'Craft Woven Cloak',
    materials: { 'herb-bundle': 2, 'scrap-wood': 2, 'glass-vial': 1 },
    result: { type: 'cape', template: 'crafted-woven-cloak' }, craftTime: 10000,
    desc: 'A sturdy woven cloak for protection.',
  },
  {
    id: 'craft-crystal-mantle', name: 'Craft Crystal Mantle',
    materials: { 'crystal-shard': 3, 'herb-bundle': 2, 'glass-vial': 1 },
    result: { type: 'cape', template: 'crafted-crystal-mantle' }, craftTime: 14000,
    desc: 'A mantle threaded with crystal fibers.',
  },
  {
    id: 'craft-starlight-shroud', name: 'Craft Starlight Shroud',
    materials: { 'starlight-dust': 2, 'crystal-shard': 2, 'herb-bundle': 1 },
    result: { type: 'cape', template: 'crafted-starlight-shroud' }, craftTime: 20000,
    desc: 'A shroud that shimmers with celestial light.',
  },
  // --- TAVERN-UNLOCKED RECIPES ---
  {
    id: 'craft-grogs-stein', name: "Forge Grog's Iron Stein",
    tavernNpc: 'bartender', tavernReqRep: 3,
    materials: { 'iron-ingot': 3, 'copper-wire': 2, 'glass-vial': 2 },
    result: { type: 'accessory', template: 'crafted-grogs-stein' }, craftTime: 15000,
    desc: "A sturdy drinking stein that Grog designed. Boosts vitality.",
  },
  {
    id: 'craft-whisper-dagger', name: "Forge Whisper's Stiletto",
    tavernNpc: 'whisper', tavernReqRep: 4,
    materials: { 'void-essence': 2, 'iron-ingot': 3, 'crystal-shard': 2 },
    result: { type: 'sword', template: 'crafted-whisper-stiletto' }, craftTime: 22000,
    desc: "A lethal blade designed by Whisper for silent strikes.",
  },
  {
    id: 'craft-fenwick-shield', name: "Forge Fenwick's Oathshield",
    tavernNpc: 'fenwick', tavernReqRep: 4,
    materials: { 'iron-ingot': 5, 'stone-block': 4, 'starlight-dust': 1 },
    result: { type: 'shield', template: 'crafted-fenwick-oathshield' }, craftTime: 22000,
    desc: "A replica of Fenwick's legendary adventuring shield.",
  },
  {
    id: 'craft-mira-crown', name: "Forge Mira's Merchant Crown",
    tavernNpc: 'mira', tavernReqRep: 4,
    materials: { 'crystal-shard': 4, 'copper-wire': 3, 'starlight-dust': 2 },
    result: { type: 'helmet', template: 'crafted-mira-merchant-crown' }, craftTime: 22000,
    desc: "A crown that Mira claims brings fortune to its wearer.",
  },
  {
    id: 'craft-thorne-armor', name: "Forge Thorne's Commandplate",
    tavernNpc: 'thorne', tavernReqRep: 5,
    materials: { 'iron-ingot': 6, 'void-essence': 2, 'starlight-dust': 2, 'plasma-core': 1 },
    result: { type: 'armor', template: 'crafted-thorne-commandplate' }, craftTime: 30000,
    desc: "The legendary armor of the Guard Commander. Thorne's masterwork.",
  },
  // --- REGION TICKETS ---
  {
    id: 'craft-ticket-toxic-marshlands', name: 'Forge Marshland Visa',
    materials: { 'toxic-resin': 12, 'herb-bundle': 8, 'glass-vial': 6, 'copper-wire': 5 },
    result: { type: 'ticket', ticketRegionId: 'toxic-marshlands' }, craftTime: 60000,
    desc: 'Forge a toxin-resistant visa for the Toxic Marshlands.',
  },
  {
    id: 'craft-ticket-abyssal-depths', name: 'Forge Abyssal Dive Charter',
    materials: { 'deep-coral': 10, 'crystal-shard': 8, 'copper-wire': 6, 'iron-ingot': 5 },
    result: { type: 'ticket', ticketRegionId: 'abyssal-depths' }, craftTime: 90000,
    desc: 'Forge a pressurized charter for the Abyssal Depths.',
  },
  {
    id: 'craft-ticket-celestial-highlands', name: 'Forge Celestial Ascent Token',
    materials: { 'starlight-dust': 10, 'crystal-shard': 12, 'plasma-core': 4, 'void-essence': 2 },
    result: { type: 'ticket', ticketRegionId: 'celestial-highlands' }, craftTime: 120000,
    desc: 'Forge a radiant token to ascend to the Celestial Highlands.',
  },
  {
    id: 'craft-ticket-void-nexus', name: 'Forge Void Rift Key',
    materials: { 'void-essence': 10, 'plasma-core': 8, 'starlight-dust': 6, 'crystal-shard': 10 },
    result: { type: 'ticket', ticketRegionId: 'void-nexus' }, craftTime: 180000,
    desc: 'Forge a key from collapsed reality to breach the Void Nexus.',
  },
];

// Crafted item templates (used by workshop)
export const CRAFTED_ITEMS = {
  // Weapons
  'crafted-iron-dagger': { name: 'Iron Dagger', slot: 'weapon', rarity: 'Common', baseAtk: 8, baseDef: 0, baseLevel: 6, classes: ['thief'] },
  'crafted-iron-blade': { name: 'Iron Blade', slot: 'weapon', rarity: 'Uncommon', baseAtk: 12, baseDef: 0, baseLevel: 8, classes: ['warrior'] },
  'crafted-crystal-staff': { name: 'Crystal Staff', slot: 'weapon', rarity: 'Rare', baseAtk: 18, baseDef: 2, baseLevel: 15, classes: ['mage'] },
  'crafted-plasma-edge': { name: 'Plasma Edge', slot: 'weapon', rarity: 'Epic', baseAtk: 26, baseDef: 3, baseLevel: 22, classes: ['necromancer'] },
  'crafted-void-cleaver': { name: 'Void Cleaver', slot: 'weapon', rarity: 'Epic', baseAtk: 30, baseDef: 0, baseLevel: 25, classes: ['berserker'] },
  // Shields
  'crafted-iron-buckler': { name: 'Iron Buckler', slot: 'shield', rarity: 'Uncommon', baseAtk: 2, baseDef: 10, baseLevel: 8, classes: ['berserker'] },
  'crafted-reinforced-barricade': { name: 'Reinforced Barricade', slot: 'shield', rarity: 'Rare', baseAtk: 1, baseDef: 16, baseLevel: 14, classes: ['warrior'] },
  'crafted-crystal-ward': { name: 'Crystal Ward', slot: 'shield', rarity: 'Rare', baseAtk: 4, baseDef: 12, baseLevel: 16, classes: ['mage'] },
  'crafted-coral-bulwark': { name: 'Coral Bulwark', slot: 'shield', rarity: 'Rare', baseAtk: 2, baseDef: 18, baseLevel: 18, classes: ['necromancer'] },
  // Helmets
  'crafted-iron-helm': { name: 'Iron Helm', slot: 'helmet', rarity: 'Uncommon', baseAtk: 1, baseDef: 8, baseLevel: 8, classes: ['warrior'] },
  'crafted-copper-circlet': { name: 'Copper Circlet', slot: 'helmet', rarity: 'Uncommon', baseAtk: 3, baseDef: 5, baseLevel: 9, classes: ['necromancer'] },
  'crafted-crystal-tiara': { name: 'Crystal Tiara', slot: 'helmet', rarity: 'Rare', baseAtk: 6, baseDef: 7, baseLevel: 15, classes: ['mage'] },
  'crafted-starlight-crown': { name: 'Starlight Crown', slot: 'helmet', rarity: 'Epic', baseAtk: 8, baseDef: 12, baseLevel: 22, classes: ['berserker'] },
  // Armor
  'crafted-iron-chestplate': { name: 'Iron Chestplate', slot: 'armor', rarity: 'Uncommon', baseAtk: 0, baseDef: 14, baseLevel: 10, classes: ['warrior'] },
  'crafted-stone-vest': { name: 'Stone Guard Vest', slot: 'armor', rarity: 'Uncommon', baseAtk: 2, baseDef: 12, baseLevel: 11, classes: ['berserker'] },
  'crafted-coral-chainmail': { name: 'Coral Chainmail', slot: 'armor', rarity: 'Rare', baseAtk: 3, baseDef: 16, baseLevel: 16, classes: ['thief'] },
  'crafted-starlight-robe': { name: 'Starlight Robe', slot: 'armor', rarity: 'Epic', baseAtk: 10, baseDef: 10, baseLevel: 22, classes: ['mage'] },
  // Boots
  'crafted-iron-greaves': { name: 'Iron Greaves', slot: 'boots', rarity: 'Uncommon', baseAtk: 1, baseDef: 10, baseLevel: 10, classes: ['warrior'] },
  'crafted-explorer-boots': { name: 'Explorer Boots', slot: 'boots', rarity: 'Rare', baseAtk: 3, baseDef: 9, baseLevel: 12, classes: ['thief'] },
  'crafted-marsh-striders': { name: 'Marsh Striders', slot: 'boots', rarity: 'Uncommon', baseAtk: 5, baseDef: 6, baseLevel: 12, classes: ['necromancer'] },
  'crafted-crystal-walkers': { name: 'Crystal Walkers', slot: 'boots', rarity: 'Rare', baseAtk: 5, baseDef: 11, baseLevel: 17, classes: ['mage'] },
  // Accessories
  'crafted-iron-bracelet': { name: 'Iron Bracelet', slot: 'accessory', rarity: 'Uncommon', baseAtk: 4, baseDef: 4, baseLevel: 8, classes: ['berserker'] },
  'crafted-crystal-ring': { name: 'Crystal Ring', slot: 'accessory', rarity: 'Rare', baseAtk: 8, baseDef: 5, baseLevel: 15, classes: ['mage'] },
  'crafted-coral-charm': { name: 'Coral Charm', slot: 'accessory', rarity: 'Rare', baseAtk: 5, baseDef: 7, baseLevel: 14, classes: ['necromancer'] },
  'crafted-starlight-pendant': { name: 'Starlight Pendant', slot: 'accessory', rarity: 'Epic', baseAtk: 12, baseDef: 8, baseLevel: 20, classes: ['thief'] },
  // Gloves
  'crafted-iron-gauntlets': { name: 'Iron Gauntlets', slot: 'gloves', rarity: 'Uncommon', baseAtk: 3, baseDef: 5, baseLevel: 8, classes: ['warrior'] },
  'crafted-crystal-handguards': { name: 'Crystal Handguards', slot: 'gloves', rarity: 'Rare', baseAtk: 6, baseDef: 7, baseLevel: 15, classes: ['necromancer'] },
  'crafted-starlight-grips': { name: 'Starlight Grips', slot: 'gloves', rarity: 'Epic', baseAtk: 10, baseDef: 10, baseLevel: 22, classes: ['thief'] },
  // Amulets
  'crafted-copper-pendant': { name: 'Copper Pendant', slot: 'amulet', rarity: 'Uncommon', baseAtk: 4, baseDef: 3, baseLevel: 8, classes: ['berserker'] },
  'crafted-crystal-amulet': { name: 'Crystal Amulet', slot: 'amulet', rarity: 'Rare', baseAtk: 7, baseDef: 5, baseLevel: 15, classes: ['mage'] },
  'crafted-starlight-talisman': { name: 'Starlight Talisman', slot: 'amulet', rarity: 'Epic', baseAtk: 11, baseDef: 8, baseLevel: 22, classes: ['necromancer'] },
  // Belts
  'crafted-iron-girdle': { name: 'Iron Girdle', slot: 'belt', rarity: 'Uncommon', baseAtk: 2, baseDef: 6, baseLevel: 8, classes: ['warrior'] },
  'crafted-crystal-belt': { name: 'Crystal Belt', slot: 'belt', rarity: 'Rare', baseAtk: 4, baseDef: 8, baseLevel: 15, classes: ['thief'] },
  'crafted-starlight-sash': { name: 'Starlight Sash', slot: 'belt', rarity: 'Epic', baseAtk: 6, baseDef: 12, baseLevel: 22, classes: ['mage'] },
  // Capes
  'crafted-woven-cloak': { name: 'Woven Cloak', slot: 'cape', rarity: 'Uncommon', baseAtk: 2, baseDef: 6, baseLevel: 8, classes: ['thief'] },
  'crafted-crystal-mantle': { name: 'Crystal Mantle', slot: 'cape', rarity: 'Rare', baseAtk: 4, baseDef: 9, baseLevel: 15, classes: ['necromancer'] },
  'crafted-starlight-shroud': { name: 'Starlight Shroud', slot: 'cape', rarity: 'Epic', baseAtk: 7, baseDef: 12, baseLevel: 22, classes: ['berserker'] },
  // Tavern-unlocked items
  'crafted-grogs-stein': { name: "Grog's Iron Stein", slot: 'accessory', rarity: 'Rare', baseAtk: 4, baseDef: 8, baseLevel: 12 },
  'crafted-whisper-stiletto': { name: "Whisper's Stiletto", slot: 'weapon', rarity: 'Epic', baseAtk: 28, baseDef: 0, baseLevel: 20 },
  'crafted-fenwick-oathshield': { name: "Fenwick's Oathshield", slot: 'shield', rarity: 'Epic', baseAtk: 3, baseDef: 22, baseLevel: 20 },
  'crafted-mira-merchant-crown': { name: "Mira's Merchant Crown", slot: 'helmet', rarity: 'Epic', baseAtk: 10, baseDef: 12, baseLevel: 20 },
  'crafted-thorne-commandplate': { name: "Thorne's Commandplate", slot: 'armor', rarity: 'Legendary', baseAtk: 8, baseDef: 28, baseLevel: 25 },
};

// ---- EGG ITEMS ----
// Extremely rare drops from monsters. Can be placed in the Incubator to hatch into pets.
export const EGG_TYPES = {
  'common-egg': {
    id: 'common-egg', name: 'Mysterious Egg', type: 'egg',
    rarity: 'Common', sellPrice: 25,
    description: 'A warm, slightly glowing egg. Something stirs inside.',
    incubateTime: 30 * 60 * 1000, // 30 minutes
    hatchTable: [
      { petId: 'fire-imp', weight: 30 },
      { petId: 'stone-turtle', weight: 30 },
      { petId: 'forest-sprite', weight: 25 },
      { petId: 'war-pup', weight: 25 },
    ],
  },
  'uncommon-egg': {
    id: 'uncommon-egg', name: 'Gleaming Egg', type: 'egg',
    rarity: 'Uncommon', sellPrice: 80,
    description: 'A polished egg that pulses with faint energy.',
    incubateTime: 2 * 60 * 60 * 1000, // 2 hours
    hatchTable: [
      { petId: 'shadow-cat', weight: 25 },
      { petId: 'iron-golem', weight: 25 },
      { petId: 'moon-fox', weight: 25 },
      { petId: 'mystic-owl', weight: 25 },
    ],
  },
  'rare-egg': {
    id: 'rare-egg', name: 'Radiant Egg', type: 'egg',
    rarity: 'Rare', sellPrice: 200,
    description: 'A brilliant egg humming with power. Rare indeed.',
    incubateTime: 6 * 60 * 60 * 1000, // 6 hours
    hatchTable: [
      { petId: 'thunder-hawk', weight: 35 },
      { petId: 'crystal-guardian', weight: 35 },
      { petId: 'shadow-cat', weight: 15 },
      { petId: 'moon-fox', weight: 15 },
    ],
  },
  'epic-egg': {
    id: 'epic-egg', name: 'Prismatic Egg', type: 'egg',
    rarity: 'Epic', sellPrice: 500,
    description: 'An egg that shifts through every color. Immense power sleeps within.',
    incubateTime: 12 * 60 * 60 * 1000, // 12 hours
    hatchTable: [
      { petId: 'void-serpent', weight: 30 },
      { petId: 'celestial-phoenix', weight: 30 },
      { petId: 'thunder-hawk', weight: 20 },
      { petId: 'crystal-guardian', weight: 20 },
    ],
  },
  'legendary-egg': {
    id: 'legendary-egg', name: 'Celestial Egg', type: 'egg',
    rarity: 'Legendary', sellPrice: 1500,
    description: 'An egg wreathed in starfire. Legends speak of what lies within.',
    incubateTime: 24 * 60 * 60 * 1000, // 24 hours
    hatchTable: [
      { petId: 'dragon-whelp', weight: 40 },
      { petId: 'celestial-phoenix', weight: 30 },
      { petId: 'void-serpent', weight: 30 },
    ],
  },
};

// Egg drop chances per region (checked after battle victory)
// Overall chance is very low; higher-tier regions can drop rarer eggs
export const EGG_DROP_CONFIG = {
  'neon-district': {
    dropRate: 0.002, // 0.2% chance per kill
    eggs: [
      { id: 'common-egg', weight: 90 },
      { id: 'uncommon-egg', weight: 10 },
    ],
  },
  'frozen-wastes': {
    dropRate: 0.003,
    eggs: [
      { id: 'common-egg', weight: 70 },
      { id: 'uncommon-egg', weight: 25 },
      { id: 'rare-egg', weight: 5 },
    ],
  },
  'scorched-badlands': {
    dropRate: 0.004,
    eggs: [
      { id: 'common-egg', weight: 55 },
      { id: 'uncommon-egg', weight: 30 },
      { id: 'rare-egg', weight: 12 },
      { id: 'epic-egg', weight: 3 },
    ],
  },
  'toxic-marshlands': {
    dropRate: 0.004,
    eggs: [
      { id: 'common-egg', weight: 50 },
      { id: 'uncommon-egg', weight: 30 },
      { id: 'rare-egg', weight: 15 },
      { id: 'epic-egg', weight: 5 },
    ],
  },
  'abyssal-depths': {
    dropRate: 0.005,
    eggs: [
      { id: 'common-egg', weight: 35 },
      { id: 'uncommon-egg', weight: 30 },
      { id: 'rare-egg', weight: 20 },
      { id: 'epic-egg', weight: 12 },
      { id: 'legendary-egg', weight: 3 },
    ],
  },
  'celestial-highlands': {
    dropRate: 0.006,
    eggs: [
      { id: 'uncommon-egg', weight: 30 },
      { id: 'rare-egg', weight: 30 },
      { id: 'epic-egg', weight: 25 },
      { id: 'legendary-egg', weight: 15 },
    ],
  },
  'void-nexus': {
    dropRate: 0.007,
    eggs: [
      { id: 'uncommon-egg', weight: 20 },
      { id: 'rare-egg', weight: 25 },
      { id: 'epic-egg', weight: 30 },
      { id: 'legendary-egg', weight: 25 },
    ],
  },
};

// ---- INCUBATOR FOOD ----
// Food items fuel the incubator. Without food, eggs won't progress.
// Each food item provides a certain number of minutes of incubation fuel.
export const INCUBATOR_FOOD = {
  'dried-crickets': {
    id: 'dried-crickets', name: 'Dried Crickets', type: 'incubator-food',
    fuelMinutes: 15,
    rarity: 'Common', buyPrice: 10, sellPrice: 3,
    description: 'Crunchy dried insects. Basic incubator fuel.',
  },
  'nutrient-paste': {
    id: 'nutrient-paste', name: 'Nutrient Paste', type: 'incubator-food',
    fuelMinutes: 45,
    rarity: 'Common', buyPrice: 25, sellPrice: 8,
    description: 'A thick paste packed with vitamins. Steady incubator fuel.',
  },
  'golden-grub': {
    id: 'golden-grub', name: 'Golden Grub', type: 'incubator-food',
    fuelMinutes: 120,
    rarity: 'Uncommon', buyPrice: 60, sellPrice: 20,
    description: 'A plump golden larvae. Premium egg nourishment.',
  },
  'moonberry-jam': {
    id: 'moonberry-jam', name: 'Moonberry Jam', type: 'incubator-food',
    fuelMinutes: 300,
    rarity: 'Rare', buyPrice: 140, sellPrice: 50,
    description: 'Enchanted berry jam that accelerates egg development.',
  },
  'phoenix-nectar': {
    id: 'phoenix-nectar', name: 'Phoenix Nectar', type: 'incubator-food',
    fuelMinutes: 720,
    rarity: 'Epic', buyPrice: 300, sellPrice: 110,
    description: 'Legendary nectar said to awaken the strongest creatures.',
  },
};

// Max incubator food capacity in minutes
export const INCUBATOR_MAX_FOOD = 1440; // 24 hours

// ---- GROCERY SHOP ----
// Stock available at the grocery shop (food items for incubator and general consumables)
export const GROCERY_ITEMS = [
  // --- Common (Lv.1) ---
  { id: 'shop-dried-crickets', name: 'Dried Crickets', type: 'incubator-food', fuelMinutes: 15, rarity: 'Common', buyPrice: 10, sellPrice: 3, description: 'Crunchy dried insects. Basic incubator fuel. +15 min.', levelReq: 1 },
  { id: 'shop-nutrient-paste', name: 'Nutrient Paste', type: 'incubator-food', fuelMinutes: 45, rarity: 'Common', buyPrice: 25, sellPrice: 8, description: 'Thick vitamin paste. Steady incubator fuel. +45 min.', levelReq: 1 },
  { id: 'shop-stale-bread', name: 'Stale Bread', type: 'incubator-food', fuelMinutes: 10, rarity: 'Common', buyPrice: 6, sellPrice: 2, description: 'Hard bread. Better than nothing. +10 min.', levelReq: 1 },
  { id: 'shop-worm-jerky', name: 'Worm Jerky', type: 'incubator-food', fuelMinutes: 20, rarity: 'Common', buyPrice: 12, sellPrice: 4, description: 'Chewy dried worms. +20 min.', levelReq: 1 },
  { id: 'shop-rice-ball', name: 'Rice Ball', type: 'incubator-food', fuelMinutes: 25, rarity: 'Common', buyPrice: 15, sellPrice: 5, description: 'Simple rice ball wrapped in seaweed. +25 min.', levelReq: 1 },
  { id: 'shop-mushroom-broth', name: 'Mushroom Broth', type: 'incubator-food', fuelMinutes: 30, rarity: 'Common', buyPrice: 18, sellPrice: 6, description: 'Warm savory broth. +30 min.', levelReq: 1 },
  { id: 'shop-dried-fruit', name: 'Dried Fruit Mix', type: 'incubator-food', fuelMinutes: 35, rarity: 'Common', buyPrice: 20, sellPrice: 7, description: 'Assorted dehydrated fruits. +35 min.', levelReq: 1 },
  { id: 'shop-oat-biscuit', name: 'Oat Biscuit', type: 'incubator-food', fuelMinutes: 40, rarity: 'Common', buyPrice: 22, sellPrice: 7, description: 'Dense oat biscuit with honey. +40 min.', levelReq: 1 },

  // --- Common (Lv.3-5) ---
  { id: 'shop-egg-custard', name: 'Egg Custard', type: 'incubator-food', fuelMinutes: 50, rarity: 'Common', buyPrice: 28, sellPrice: 9, description: 'Creamy custard. Eggs love irony. +50 min.', levelReq: 3 },
  { id: 'shop-honey-cake', name: 'Honey Cake', type: 'incubator-food', fuelMinutes: 55, rarity: 'Common', buyPrice: 32, sellPrice: 10, description: 'Sweet cake dripping with wild honey. +55 min.', levelReq: 3 },
  { id: 'shop-smoked-fish', name: 'Smoked Fish', type: 'incubator-food', fuelMinutes: 60, rarity: 'Common', buyPrice: 35, sellPrice: 11, description: 'Salt-cured and smoked to perfection. +1 hour.', levelReq: 4 },
  { id: 'shop-cheese-wedge', name: 'Cheese Wedge', type: 'incubator-food', fuelMinutes: 65, rarity: 'Common', buyPrice: 38, sellPrice: 12, description: 'Aged cave cheese. Pungent but nutritious. +65 min.', levelReq: 5 },

  // --- Uncommon (Lv.6-10) ---
  { id: 'shop-golden-grub', name: 'Golden Grub', type: 'incubator-food', fuelMinutes: 120, rarity: 'Uncommon', buyPrice: 60, sellPrice: 20, description: 'Premium golden larvae. +2 hours of incubation.', levelReq: 6 },
  { id: 'shop-spiced-sausage', name: 'Spiced Sausage', type: 'incubator-food', fuelMinutes: 80, rarity: 'Uncommon', buyPrice: 45, sellPrice: 15, description: 'Hearty sausage with marsh peppers. +80 min.', levelReq: 6 },
  { id: 'shop-crystal-candy', name: 'Crystal Candy', type: 'incubator-food', fuelMinutes: 90, rarity: 'Uncommon', buyPrice: 50, sellPrice: 16, description: 'Hard candy infused with crystal dust. +90 min.', levelReq: 7 },
  { id: 'shop-stuffed-pepper', name: 'Stuffed Pepper', type: 'incubator-food', fuelMinutes: 100, rarity: 'Uncommon', buyPrice: 55, sellPrice: 18, description: 'Marsh pepper stuffed with grain. +100 min.', levelReq: 7 },
  { id: 'shop-meat-pie', name: 'Meat Pie', type: 'incubator-food', fuelMinutes: 110, rarity: 'Uncommon', buyPrice: 58, sellPrice: 19, description: 'Flaky crust with seasoned filling. +110 min.', levelReq: 8 },
  { id: 'shop-neon-noodles', name: 'Neon Noodles', type: 'incubator-food', fuelMinutes: 130, rarity: 'Uncommon', buyPrice: 65, sellPrice: 21, description: 'Glowing street noodles from the Neon District. +130 min.', levelReq: 9 },
  { id: 'shop-frost-cream', name: 'Frost Cream', type: 'incubator-food', fuelMinutes: 140, rarity: 'Uncommon', buyPrice: 70, sellPrice: 23, description: 'Never-melting frozen dessert. +140 min.', levelReq: 9 },
  { id: 'shop-ember-steak', name: 'Ember Steak', type: 'incubator-food', fuelMinutes: 150, rarity: 'Uncommon', buyPrice: 75, sellPrice: 25, description: 'Thick steak seared over ember coals. +150 min.', levelReq: 10 },

  // --- Rare (Lv.12-16) ---
  { id: 'shop-moonberry-jam', name: 'Moonberry Jam', type: 'incubator-food', fuelMinutes: 300, rarity: 'Rare', buyPrice: 140, sellPrice: 50, description: 'Enchanted jam. +5 hours of incubation.', levelReq: 12 },
  { id: 'shop-coral-sashimi', name: 'Coral Sashimi', type: 'incubator-food', fuelMinutes: 200, rarity: 'Rare', buyPrice: 100, sellPrice: 35, description: 'Fresh-cut deep sea delicacy. +200 min.', levelReq: 12 },
  { id: 'shop-dragon-dumpling', name: 'Dragon Dumpling', type: 'incubator-food', fuelMinutes: 240, rarity: 'Rare', buyPrice: 115, sellPrice: 40, description: 'Steamed dumpling with fiery filling. +4 hours.', levelReq: 13 },
  { id: 'shop-thunder-mochi', name: 'Thunder Mochi', type: 'incubator-food', fuelMinutes: 270, rarity: 'Rare', buyPrice: 125, sellPrice: 44, description: 'Stretchy rice cake that crackles with energy. +270 min.', levelReq: 14 },
  { id: 'shop-shadow-truffle', name: 'Shadow Truffle', type: 'incubator-food', fuelMinutes: 330, rarity: 'Rare', buyPrice: 155, sellPrice: 55, description: 'Rare fungus found only in void-touched soil. +330 min.', levelReq: 15 },
  { id: 'shop-plasma-pudding', name: 'Plasma Pudding', type: 'incubator-food', fuelMinutes: 360, rarity: 'Rare', buyPrice: 170, sellPrice: 60, description: 'Luminescent dessert that hums with power. +6 hours.', levelReq: 16 },

  // --- Epic (Lv.18-22) ---
  { id: 'shop-phoenix-nectar', name: 'Phoenix Nectar', type: 'incubator-food', fuelMinutes: 720, rarity: 'Epic', buyPrice: 300, sellPrice: 110, description: 'Legendary nectar. +12 hours of incubation.', levelReq: 18 },
  { id: 'shop-celestial-fondue', name: 'Celestial Fondue', type: 'incubator-food', fuelMinutes: 480, rarity: 'Epic', buyPrice: 220, sellPrice: 80, description: 'Melted starlight cheese with cosmic bread. +8 hours.', levelReq: 18 },
  { id: 'shop-void-ramen', name: 'Void Ramen', type: 'incubator-food', fuelMinutes: 540, rarity: 'Epic', buyPrice: 250, sellPrice: 90, description: 'Broth simmered in the space between worlds. +9 hours.', levelReq: 20 },
  { id: 'shop-titan-roast', name: 'Titan Roast', type: 'incubator-food', fuelMinutes: 600, rarity: 'Epic', buyPrice: 270, sellPrice: 100, description: 'Massive slow-roasted feast fit for a titan. +10 hours.', levelReq: 20 },

  // --- Legendary (Lv.25+) ---
  { id: 'shop-ambrosia-cake', name: 'Ambrosia Cake', type: 'incubator-food', fuelMinutes: 960, rarity: 'Legendary', buyPrice: 500, sellPrice: 180, description: 'Divine pastry that transcends mortal baking. +16 hours.', levelReq: 25 },
  { id: 'shop-eternity-stew', name: 'Eternity Stew', type: 'incubator-food', fuelMinutes: 1440, rarity: 'Legendary', buyPrice: 800, sellPrice: 300, description: 'A stew that simmers outside of time itself. +24 hours.', levelReq: 28 },
];

export function getGroceryStock(playerLevel) {
  return GROCERY_ITEMS.filter(item => playerLevel >= item.levelReq).map(item => ({ ...item, stock: 5 }));
}

// ---- SHOP MATERIAL ITEMS (rarely available) ----
export const SHOP_MATERIALS = [
  { id: 'scrap-wood', buyPrice: 12, weight: 30 },
  { id: 'iron-ore', buyPrice: 18, weight: 20 },
  { id: 'glass-vial', buyPrice: 10, weight: 25 },
  { id: 'stone-block', buyPrice: 15, weight: 15 },
  { id: 'herb-bundle', buyPrice: 20, weight: 10 },
  { id: 'charcoal', buyPrice: 30, weight: 8 },
];

// Chance to show material items in the daily shop (low)
export const SHOP_MATERIAL_CHANCE = 0.25;
export const SHOP_MATERIAL_COUNT = 2;

// ---- SPARRING DUMMIES ----
export const SPARRING_DUMMIES = [
  { id: 'dummy-basic', name: 'Straw Dummy', hp: 100, def: 0, desc: 'No defense. Good for testing raw damage.' },
  { id: 'dummy-armored', name: 'Iron Dummy', hp: 200, def: 15, desc: 'High defense. Test your armor penetration.' },
  { id: 'dummy-tough', name: 'Reinforced Dummy', hp: 500, def: 8, desc: 'Lots of HP. Test sustained damage output.' },
  { id: 'dummy-boss', name: 'Boss Dummy', hp: 800, def: 20, desc: 'Boss-tier stats. Prepare for the real thing.' },
];

// ---- ADVENTURE CAMP LOOT TABLES ----
export const CAMP_LOOT_TABLES = {
  1: { // Quick Raid
    items: [
      { type: 'material', id: 'scrap-wood', weight: 35, qtyRange: [1, 3] },
      { type: 'material', id: 'iron-ore', weight: 25, qtyRange: [1, 2] },
      { type: 'material', id: 'glass-vial', weight: 20, qtyRange: [1, 2] },
      { type: 'material', id: 'herb-bundle', weight: 15, qtyRange: [1, 2] },
      { type: 'gear', gearType: 'potion', weight: 30 },
    ],
    maxItems: 2,
  },
  2: { // Supply Run
    items: [
      { type: 'material', id: 'scrap-wood', weight: 30, qtyRange: [2, 5] },
      { type: 'material', id: 'iron-ore', weight: 25, qtyRange: [2, 4] },
      { type: 'material', id: 'charcoal', weight: 15, qtyRange: [1, 3] },
      { type: 'material', id: 'copper-wire', weight: 12, qtyRange: [1, 2] },
      { type: 'material', id: 'stone-block', weight: 20, qtyRange: [2, 4] },
      { type: 'gear', gearType: 'potion', weight: 20 },
      { type: 'gear', gearType: 'energy-drink', weight: 15 },
    ],
    maxItems: 3,
  },
  3: { // Deep Expedition
    items: [
      { type: 'material', id: 'iron-ore', weight: 25, qtyRange: [3, 6] },
      { type: 'material', id: 'charcoal', weight: 20, qtyRange: [2, 4] },
      { type: 'material', id: 'crystal-shard', weight: 8, qtyRange: [1, 2] },
      { type: 'material', id: 'toxic-resin', weight: 15, qtyRange: [2, 3] },
      { type: 'material', id: 'deep-coral', weight: 10, qtyRange: [1, 2] },
      { type: 'material', id: 'coal-chunk', weight: 12, qtyRange: [1, 3] },
      { type: 'gear', gearType: 'sword', weight: 10 },
      { type: 'gear', gearType: 'armor', weight: 8 },
    ],
    maxItems: 4,
  },
  4: { // Full Campaign
    items: [
      { type: 'material', id: 'crystal-shard', weight: 15, qtyRange: [2, 4] },
      { type: 'material', id: 'starlight-dust', weight: 6, qtyRange: [1, 2] },
      { type: 'material', id: 'deep-coral', weight: 12, qtyRange: [2, 3] },
      { type: 'material', id: 'copper-wire', weight: 15, qtyRange: [3, 6] },
      { type: 'material', id: 'iron-ore', weight: 20, qtyRange: [4, 8] },
      { type: 'material', id: 'oil-canister', weight: 8, qtyRange: [1, 2] },
      { type: 'material', id: 'void-essence', weight: 3, qtyRange: [1, 1] },
      { type: 'gear', gearType: 'sword', weight: 12 },
      { type: 'gear', gearType: 'armor', weight: 10 },
      { type: 'gear', gearType: 'shield', weight: 8 },
      { type: 'gear', gearType: 'ring', weight: 8 },
    ],
    maxItems: 5,
  },
};

// ---- INITIAL BASE STATE ----
export function createInitialBase() {
  return {
    buildings: {},       // { buildingId: { built: true, level: 1, ... } }
    materials: {},       // { materialId: quantity }
    fuel: 0,             // current fuel minutes remaining
    fuelLastUpdate: null,
    // Adventure camp
    activeMission: null, // { missionId, startTime, duration }
    // Bank
    bankDeposit: 0,
    frozenGold: null,    // { amount, startTime, duration, interestRate }
    loan: null,          // { amount, dueTime }
    // Sparring
    sparringDummy: null,
    sparringHp: 0,
    // Chamber upgrades
    chamberUpgrades: {}, // { bed: 0, kitchen: 0, study: 0 }
    // Inn
    innLevel: 0,
    innBoost: null,  // { expBonus, startTime, duration, boostName }
    // Crafting
    craftingQueue: null, // { recipeId, building, startTime, craftTime }
    // Farm
    farmPlots: [],       // [{ cropId, plantedAt } | null, ...]
    // Warehouse
    warehouseLevel: 0,
    // Incubator
    incubatorLevel: 0,
    incubatorSlots: [], // [{ eggId, placedAt } | null, ...]
    incubatorFood: 0,   // minutes of food remaining
    incubatorFoodLastUpdate: null,
  };
}

// ---- HELPER: Get total chamber buffs ----
export function getChamberBuffs(base) {
  const upgrades = base?.chamberUpgrades || {};
  const chamber = BUILDINGS.chamber;
  let buffs = { atkBuff: 0, defBuff: 0, hpBuff: 0, manaBuff: 0, healBonus: 0, wisdomBuff: 0 };

  for (const [subId, subData] of Object.entries(chamber.subUpgrades)) {
    const level = upgrades[subId] || 0;
    if (level > 0) {
      const levelData = subData.levels[level - 1];
      if (levelData) {
        if (levelData.atkBuff) buffs.atkBuff += levelData.atkBuff;
        if (levelData.defBuff) buffs.defBuff += levelData.defBuff;
        if (levelData.hpBuff) buffs.hpBuff += levelData.hpBuff;
        if (levelData.manaBuff) buffs.manaBuff += levelData.manaBuff;
        if (levelData.healBonus) buffs.healBonus += levelData.healBonus;
        if (levelData.wisdomBuff) buffs.wisdomBuff += levelData.wisdomBuff;
      }
    }
  }
  return buffs;
}

// ---- HELPER: Get inn EXP bonus (timed boost system) ----
export function getInnExpBonus(base) {
  if (!base?.buildings?.inn?.built) return 0;
  const boost = base.innBoost;
  if (!boost) return 0;
  const now = Date.now();
  if (now - boost.startTime >= boost.duration) return 0; // expired
  return boost.expBonus || 0;
}

// ---- HELPER: Get warehouse inventory bonus ----
export function getWarehouseBonus(base) {
  if (!base?.buildings?.warehouse?.built) return 0;
  const level = base.warehouseLevel || 1;
  const upgradeDef = BUILDINGS.warehouse.upgrades.find(u => u.level === level);
  return upgradeDef?.inventoryBonus || 0;
}

// ---- HELPER: Get current incubator food (minutes remaining) ----
// Food only depletes while there are eggs incubating
export function getIncubatorFood(base) {
  if (!base?.buildings?.incubator?.built) return 0;
  let food = base.incubatorFood || 0;
  const lastUpdate = base.incubatorFoodLastUpdate;
  if (lastUpdate && food > 0) {
    // Only consume food if there are active eggs
    const hasActiveEggs = (base.incubatorSlots || []).some(s => s != null);
    if (hasActiveEggs) {
      const elapsed = (Date.now() - lastUpdate) / 60000; // minutes
      food = Math.max(0, food - elapsed);
    }
  }
  return food;
}

// ---- HELPER: Get incubator speed bonus ----
export function getIncubatorSpeedBonus(base) {
  if (!base?.buildings?.incubator?.built) return 0;
  const level = base.incubatorLevel || 1;
  const upgradeDef = BUILDINGS.incubator.upgrades.find(u => u.level === level);
  return upgradeDef?.speedBonus || 0;
}

// ---- HELPER: Get incubator slot count ----
export function getIncubatorSlots(base) {
  if (!base?.buildings?.incubator?.built) return 0;
  const level = base.incubatorLevel || 1;
  const upgradeDef = BUILDINGS.incubator.upgrades.find(u => u.level === level);
  return upgradeDef?.slots || 1;
}

// Generate a food item from a farm crop harvest
export function createCropFoodItem(cropDef) {
  if (!cropDef?.foodYield) return null;
  const rarity = cropDef.cost.gold >= 100 ? 'Uncommon' : 'Common';
  return {
    id: uid(),
    name: cropDef.foodYield.name,
    type: 'incubator-food',
    slot: null,
    level: 1,
    rarity,
    rarityClass: rarity.toLowerCase(),
    description: `Harvested from ${cropDef.name}. Incubator fuel.`,
    fuelMinutes: cropDef.foodYield.fuelMinutes,
    sellPrice: Math.max(1, Math.floor(cropDef.cost.gold * 0.25)),
  };
}

// Generate a food item for inventory
export function createFoodItem(foodId) {
  const food = INCUBATOR_FOOD[foodId];
  if (!food) return null;
  return {
    id: uid(),
    foodId: foodId,
    name: food.name,
    type: 'incubator-food',
    slot: null,
    level: 1,
    rarity: food.rarity,
    rarityClass: food.rarity.toLowerCase(),
    rarityColor: null,
    icon: 'food',
    description: food.description,
    fuelMinutes: food.fuelMinutes,
    sellPrice: food.sellPrice,
    buyPrice: food.buyPrice,
  };
}

// Generate an egg item for inventory/drops
export function createEggItem(eggId) {
  const egg = EGG_TYPES[eggId];
  if (!egg) return null;
  return {
    id: uid(),
    eggId: eggId,
    name: egg.name,
    type: 'egg',
    slot: null,
    level: 1,
    rarity: egg.rarity,
    rarityClass: egg.rarity.toLowerCase(),
    rarityColor: null,
    icon: 'egg',
    description: egg.description,
    sellPrice: egg.sellPrice,
  };
}

// ---- FARM SEEDS & CROP QUALITIES ----
// Seeds are found during exploration and planted in the farm for profit

export const FARM_SEEDS = {
  // ---- Generic seeds (found across multiple locations) ----
  'dusty-seed':      { id: 'dusty-seed',      name: 'Dusty Seed',      rarity: 'Common',    growTime: 10 * 60 * 1000,     baseValue: [15, 25],   cropName: 'Dusty Root',      desc: '10 min - A gritty root with mild value' },
  'vibrant-seed':    { id: 'vibrant-seed',     name: 'Vibrant Seed',    rarity: 'Uncommon',  growTime: 30 * 60 * 1000,     baseValue: [40, 70],   cropName: 'Vibrant Melon',   desc: '30 min - A bright, juicy melon' },
  'luminous-seed':   { id: 'luminous-seed',    name: 'Luminous Seed',   rarity: 'Rare',      growTime: 60 * 60 * 1000,     baseValue: [100, 180], cropName: 'Luminous Bloom',  desc: '1 hour - A glowing flower prized by traders' },
  'prismatic-seed':  { id: 'prismatic-seed',   name: 'Prismatic Seed',  rarity: 'Epic',      growTime: 2 * 60 * 60 * 1000, baseValue: [250, 400], cropName: 'Prismatic Fruit', desc: '2 hours - A shimmering fruit of great worth' },
  'celestial-seed':  { id: 'celestial-seed',   name: 'Celestial Seed',  rarity: 'Legendary', growTime: 4 * 60 * 60 * 1000, baseValue: [600, 1000], cropName: 'Celestial Peach', desc: '4 hours - An otherworldly peach of immense value' },

  // ---- Neon District location-specific seeds ----
  'neon-sprout':     { id: 'neon-sprout',     name: 'Neon Sprout',     rarity: 'Common',    growTime: 8 * 60 * 1000,      baseValue: [12, 20],   cropName: 'Neon Cabbage',     desc: '8 min - Glows faintly in the dark',          foundAt: 'neon-mile',         foundAtName: 'Neon Mile' },
  'shadow-pip':      { id: 'shadow-pip',      name: 'Shadow Pip',      rarity: 'Uncommon',  growTime: 20 * 60 * 1000,     baseValue: [35, 55],   cropName: 'Shadow Berry',     desc: '20 min - A dark berry with a bitter taste',  foundAt: 'shadow-alley',      foundAtName: 'Shadow Alley' },
  'metro-bulb':      { id: 'metro-bulb',      name: 'Metro Bulb',      rarity: 'Uncommon',  growTime: 25 * 60 * 1000,     baseValue: [38, 60],   cropName: 'Metro Onion',      desc: '25 min - Pungent underground tuber',         foundAt: 'metro-underpass',   foundAtName: 'Metro Underpass' },
  'skyline-bean':    { id: 'skyline-bean',    name: 'Skyline Bean',    rarity: 'Common',    growTime: 7 * 60 * 1000,      baseValue: [10, 18],   cropName: 'Skyline Sprout',   desc: '7 min - Quick bean from the rooftops',       foundAt: 'skyline-rooftops',  foundAtName: 'Skyline Rooftops' },
  'iron-weed':       { id: 'iron-weed',       name: 'Iron Weed',       rarity: 'Common',    growTime: 9 * 60 * 1000,      baseValue: [11, 19],   cropName: 'Iron Turnip',      desc: '9 min - Hardy root from the scrapyard',      foundAt: 'ironworks-yard',    foundAtName: 'Ironworks Yard' },
  'midnight-clover': { id: 'midnight-clover', name: 'Midnight Clover', rarity: 'Common',    growTime: 6 * 60 * 1000,      baseValue: [8, 16],    cropName: 'Midnight Leaf',    desc: '6 min - Fast-growing terminal weed',         foundAt: 'midnight-terminal', foundAtName: 'Midnight Terminal' },

  // ---- Frozen Wastes location-specific seeds ----
  'frost-kernel':    { id: 'frost-kernel',    name: 'Frost Kernel',    rarity: 'Uncommon',  growTime: 25 * 60 * 1000,     baseValue: [30, 50],   cropName: 'Frost Apple',      desc: '25 min - An ice-cold fruit',                 foundAt: 'frostbite-outpost', foundAtName: 'Frostbite Outpost' },
  'glacier-spore':   { id: 'glacier-spore',   name: 'Glacier Spore',   rarity: 'Rare',      growTime: 50 * 60 * 1000,     baseValue: [80, 140],  cropName: 'Glacier Truffle',  desc: '50 min - Rare fungus from the ice tunnels',  foundAt: 'glacier-tunnels',   foundAtName: 'Glacier Tunnels' },
  'crystal-pip':     { id: 'crystal-pip',     name: 'Crystal Pip',     rarity: 'Rare',      growTime: 55 * 60 * 1000,     baseValue: [90, 160],  cropName: 'Crystal Grape',    desc: '55 min - Translucent fruit of the caverns',  foundAt: 'crystal-caverns',   foundAtName: 'Crystal Caverns' },
  'permafrost-nut':  { id: 'permafrost-nut',  name: 'Permafrost Nut',  rarity: 'Common',    growTime: 10 * 60 * 1000,     baseValue: [13, 22],   cropName: 'Permafrost Chestnut', desc: '10 min - Frozen nut from the ruins',      foundAt: 'permafrost-ruins',  foundAtName: 'Permafrost Ruins' },
  'blizzard-flake':  { id: 'blizzard-flake',  name: 'Blizzard Flake',  rarity: 'Common',    growTime: 8 * 60 * 1000,      baseValue: [11, 20],   cropName: 'Snow Pea',         desc: '8 min - Tiny pea that thrives in storms',    foundAt: 'blizzard-peak',     foundAtName: 'Blizzard Peak' },

  // ---- Scorched Badlands location-specific seeds ----
  'ember-pit':       { id: 'ember-pit',       name: 'Ember Pit',       rarity: 'Uncommon',  growTime: 30 * 60 * 1000,     baseValue: [45, 75],   cropName: 'Ember Pepper',     desc: '30 min - Fiery hot pepper from the flats',   foundAt: 'ember-flats',       foundAtName: 'Ember Flats' },
  'magma-stone':     { id: 'magma-stone',     name: 'Magma Stone',     rarity: 'Rare',      growTime: 70 * 60 * 1000,     baseValue: [110, 190], cropName: 'Magma Melon',      desc: '70 min - Scorching fruit from the vents',    foundAt: 'magma-vents',       foundAtName: 'Magma Vents' },
  'ashen-kernel':    { id: 'ashen-kernel',    name: 'Ashen Kernel',    rarity: 'Epic',      growTime: 100 * 60 * 1000,    baseValue: [200, 340], cropName: 'Ashen Pomegranate', desc: '100 min - Charred fruit of rare value',     foundAt: 'ashen-ruins',       foundAtName: 'Ashen Ruins' },
  'canyon-thorn':    { id: 'canyon-thorn',    name: 'Canyon Thorn',    rarity: 'Common',    growTime: 7 * 60 * 1000,      baseValue: [10, 18],   cropName: 'Canyon Cactus',    desc: '7 min - Spiky fruit from the canyon walls',  foundAt: 'sunscorch-canyon',  foundAtName: 'Sunscorch Canyon' },
  'cinder-puff':     { id: 'cinder-puff',     name: 'Cinder Puff',     rarity: 'Common',    growTime: 9 * 60 * 1000,      baseValue: [12, 21],   cropName: 'Cinder Mushroom',  desc: '9 min - Smoky mushroom from the inferno',    foundAt: 'inferno-pit',       foundAtName: 'Inferno Pit' },

  // ---- Toxic Marshlands location-specific seeds ----
  'bog-pearl':       { id: 'bog-pearl',       name: 'Bog Pearl',       rarity: 'Uncommon',  growTime: 35 * 60 * 1000,     baseValue: [50, 80],   cropName: 'Bog Lotus',        desc: '35 min - Beautiful flower from the swamp',   foundAt: 'bogs-edge',         foundAtName: "Bog's Edge" },
  'fungal-node':     { id: 'fungal-node',     name: 'Fungal Node',     rarity: 'Rare',      growTime: 65 * 60 * 1000,     baseValue: [95, 170],  cropName: 'Fungal Cap',       desc: '65 min - Massive mushroom cap',              foundAt: 'fungal-hollow',     foundAtName: 'Fungal Hollow' },
  'plague-spore':    { id: 'plague-spore',    name: 'Plague Spore',    rarity: 'Epic',      growTime: 110 * 60 * 1000,    baseValue: [220, 370], cropName: 'Plague Blossom',   desc: '110 min - Toxic yet incredibly valuable',    foundAt: 'plague-ponds',      foundAtName: 'Plague Ponds' },
  'mire-reed':       { id: 'mire-reed',       name: 'Mire Reed',       rarity: 'Common',    growTime: 8 * 60 * 1000,      baseValue: [11, 19],   cropName: 'Mire Celery',      desc: '8 min - Stringy stalk from the mire',        foundAt: 'mire-depths',       foundAtName: 'Mire Depths' },
  'venom-bud':       { id: 'venom-bud',       name: 'Venom Bud',       rarity: 'Common',    growTime: 10 * 60 * 1000,     baseValue: [13, 23],   cropName: 'Venom Radish',     desc: '10 min - Prickly radish from the thicket',   foundAt: 'venomous-thicket',  foundAtName: 'Venomous Thicket' },

  // ---- Abyssal Depths location-specific seeds ----
  'tidal-bulb':      { id: 'tidal-bulb',      name: 'Tidal Bulb',      rarity: 'Rare',      growTime: 55 * 60 * 1000,     baseValue: [85, 150],  cropName: 'Tidal Kelp',       desc: '55 min - Luminescent sea plant',             foundAt: 'tidal-caves',       foundAtName: 'Tidal Caves' },
  'coral-seed':      { id: 'coral-seed',      name: 'Coral Seed',      rarity: 'Rare',      growTime: 75 * 60 * 1000,     baseValue: [120, 200], cropName: 'Coral Pear',       desc: '75 min - Smooth pear-shaped coral fruit',    foundAt: 'coral-labyrinth',   foundAtName: 'Coral Labyrinth' },
  'abyssal-pit':     { id: 'abyssal-pit',     name: 'Abyssal Pit',     rarity: 'Epic',      growTime: 130 * 60 * 1000,    baseValue: [280, 450], cropName: 'Abyssal Plum',     desc: '130 min - Jet-black plum from the deep',     foundAt: 'abyssal-trench',    foundAtName: 'Abyssal Trench' },
  'barnacle-nub':    { id: 'barnacle-nub',    name: 'Barnacle Nub',    rarity: 'Common',    growTime: 9 * 60 * 1000,      baseValue: [12, 22],   cropName: 'Barnacle Tuber',   desc: '9 min - Crunchy tuber from the bazaar',      foundAt: 'sunken-bazaar',     foundAtName: 'Sunken Bazaar' },
  'pressure-pod':    { id: 'pressure-pod',    name: 'Pressure Pod',    rarity: 'Common',    growTime: 11 * 60 * 1000,     baseValue: [14, 24],   cropName: 'Pressure Bean',    desc: '11 min - Dense bean from the rift',          foundAt: 'pressure-rift',     foundAtName: 'Pressure Rift' },

  // ---- Celestial Highlands location-specific seeds ----
  'cloud-wisp':      { id: 'cloud-wisp',      name: 'Cloud Wisp',      rarity: 'Rare',      growTime: 60 * 60 * 1000,     baseValue: [105, 185], cropName: 'Cloud Cotton',     desc: '60 min - Fluffy fiber that fetches gold',    foundAt: 'cloud-walkway',     foundAtName: 'Cloud Walkway' },
  'solar-grain':     { id: 'solar-grain',     name: 'Solar Grain',     rarity: 'Epic',      growTime: 120 * 60 * 1000,    baseValue: [240, 380], cropName: 'Solar Wheat',      desc: '120 min - Golden grain infused with light',  foundAt: 'solar-fields',      foundAtName: 'Solar Fields' },
  'starbloom-seed':  { id: 'starbloom-seed',  name: 'Starbloom Seed',  rarity: 'Legendary', growTime: 5 * 60 * 60 * 1000, baseValue: [700, 1200], cropName: 'Starbloom Rose',  desc: '5 hours - Legendary rose of the highlands',  foundAt: 'empyrean-gate',     foundAtName: 'Empyrean Gate' },
  'storm-pip':       { id: 'storm-pip',       name: 'Storm Pip',       rarity: 'Common',    growTime: 10 * 60 * 1000,     baseValue: [14, 25],   cropName: 'Storm Berry',      desc: '10 min - Tiny berry charged with static',    foundAt: 'stormspire-tower',  foundAtName: 'Stormspire Tower' },
  'astral-mote':     { id: 'astral-mote',     name: 'Astral Mote',     rarity: 'Common',    growTime: 12 * 60 * 1000,     baseValue: [15, 26],   cropName: 'Astral Herb',      desc: '12 min - Fragrant herb from the gardens',    foundAt: 'astral-gardens',    foundAtName: 'Astral Gardens' },

  // ---- Void Nexus location-specific seeds ----
  'null-spore':      { id: 'null-spore',      name: 'Null Spore',      rarity: 'Epic',      growTime: 90 * 60 * 1000,     baseValue: [260, 420], cropName: 'Null Fig',          desc: '90 min - A fig that exists between realities', foundAt: 'null-chamber',    foundAtName: 'Null Chamber' },
  'entropy-seed':    { id: 'entropy-seed',    name: 'Entropy Seed',    rarity: 'Epic',      growTime: 150 * 60 * 1000,    baseValue: [300, 480], cropName: 'Entropy Gourd',     desc: '150 min - Decays and reforms endlessly',      foundAt: 'entropy-garden',  foundAtName: 'Entropy Garden' },
  'void-heart':      { id: 'void-heart',      name: 'Void Heart',      rarity: 'Legendary', growTime: 6 * 60 * 60 * 1000, baseValue: [800, 1400], cropName: 'Void Dragonfruit', desc: '6 hours - The rarest crop in existence',     foundAt: 'oblivion-throne', foundAtName: 'Oblivion Throne' },
  'rift-sprout':     { id: 'rift-sprout',     name: 'Rift Sprout',     rarity: 'Common',    growTime: 11 * 60 * 1000,     baseValue: [14, 24],   cropName: 'Rift Lettuce',      desc: '11 min - Flickering lettuce from the edge',   foundAt: 'rifts-edge',      foundAtName: "Rift's Edge" },
  'paradox-pip':     { id: 'paradox-pip',     name: 'Paradox Pip',     rarity: 'Common',    growTime: 12 * 60 * 1000,     baseValue: [15, 26],   cropName: 'Paradox Potato',    desc: '12 min - A potato that tastes different each time', foundAt: 'paradox-maze', foundAtName: 'Paradox Maze' },
};

export const CROP_QUALITIES = [
  { id: 'wilted',      name: 'Wilted',      multiplier: 0.5, weight: 25, color: '#888' },
  { id: 'normal',      name: 'Normal',      multiplier: 1.0, weight: 45, color: '#ccc' },
  { id: 'flourishing', name: 'Flourishing', multiplier: 1.5, weight: 20, color: '#5c5' },
  { id: 'perfect',     name: 'Perfect',     multiplier: 2.0, weight: 8,  color: '#5bf' },
  { id: 'golden',      name: 'Golden',      multiplier: 3.0, weight: 2,  color: '#fa0' },
];

// Location-specific seed drop tables. Each location lists which seeds can drop there with weights.
// Locations not listed here use a fallback based on their region's generic seeds.
export const SEED_DROP_CONFIG = {
  dropChance: 0.04, // 4% chance per explore step (when no encounter)
  // Location-specific drop tables: location seeds are exclusive to that location
  locationSeeds: {
    // Neon District (Common-heavy, no Epic/Legendary)
    'neon-mile':         [{ id: 'neon-sprout', weight: 50 }, { id: 'dusty-seed', weight: 35 }, { id: 'vibrant-seed', weight: 12 }, { id: 'luminous-seed', weight: 3 }],
    'shadow-alley':      [{ id: 'dusty-seed', weight: 35 }, { id: 'shadow-pip', weight: 30 }, { id: 'neon-sprout', weight: 20 }, { id: 'vibrant-seed', weight: 12 }, { id: 'luminous-seed', weight: 3 }],
    'metro-underpass':   [{ id: 'dusty-seed', weight: 30 }, { id: 'metro-bulb', weight: 30 }, { id: 'neon-sprout', weight: 20 }, { id: 'vibrant-seed', weight: 15 }, { id: 'luminous-seed', weight: 5 }],
    'skyline-rooftops':  [{ id: 'skyline-bean', weight: 50 }, { id: 'dusty-seed', weight: 25 }, { id: 'vibrant-seed', weight: 18 }, { id: 'luminous-seed', weight: 7 }],
    'ironworks-yard':    [{ id: 'iron-weed', weight: 45 }, { id: 'dusty-seed', weight: 25 }, { id: 'vibrant-seed', weight: 20 }, { id: 'luminous-seed', weight: 10 }],
    'midnight-terminal': [{ id: 'midnight-clover', weight: 42 }, { id: 'dusty-seed', weight: 23 }, { id: 'vibrant-seed', weight: 22 }, { id: 'luminous-seed', weight: 13 }],
    // Frozen Wastes (Common dominant, Rare uncommon, Epic very rare)
    'frostbite-outpost': [{ id: 'permafrost-nut', weight: 30 }, { id: 'frost-kernel', weight: 25 }, { id: 'dusty-seed', weight: 20 }, { id: 'blizzard-flake', weight: 15 }, { id: 'vibrant-seed', weight: 8 }, { id: 'luminous-seed', weight: 2 }],
    'glacier-tunnels':   [{ id: 'blizzard-flake', weight: 35 }, { id: 'permafrost-nut', weight: 20 }, { id: 'vibrant-seed', weight: 18 }, { id: 'glacier-spore', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'prismatic-seed', weight: 2 }],
    'permafrost-ruins':  [{ id: 'permafrost-nut', weight: 45 }, { id: 'dusty-seed', weight: 20 }, { id: 'blizzard-flake', weight: 15 }, { id: 'vibrant-seed', weight: 12 }, { id: 'luminous-seed', weight: 6 }, { id: 'prismatic-seed', weight: 2 }],
    'blizzard-peak':     [{ id: 'blizzard-flake', weight: 45 }, { id: 'permafrost-nut', weight: 18 }, { id: 'vibrant-seed', weight: 15 }, { id: 'frost-kernel', weight: 10 }, { id: 'luminous-seed', weight: 8 }, { id: 'prismatic-seed', weight: 4 }],
    'crystal-caverns':   [{ id: 'permafrost-nut', weight: 30 }, { id: 'blizzard-flake', weight: 25 }, { id: 'vibrant-seed', weight: 15 }, { id: 'crystal-pip', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'prismatic-seed', weight: 5 }],
    'frozen-citadel':    [{ id: 'blizzard-flake', weight: 30 }, { id: 'permafrost-nut', weight: 25 }, { id: 'frost-kernel', weight: 15 }, { id: 'luminous-seed', weight: 12 }, { id: 'glacier-spore', weight: 8 }, { id: 'crystal-pip', weight: 5 }, { id: 'prismatic-seed', weight: 5 }],
    // Scorched Badlands (Common dominant, Epic ~3-4%, Legendary ~1%)
    'ember-flats':       [{ id: 'canyon-thorn', weight: 40 }, { id: 'cinder-puff', weight: 20 }, { id: 'dusty-seed', weight: 15 }, { id: 'ember-pit', weight: 15 }, { id: 'vibrant-seed', weight: 7 }, { id: 'luminous-seed', weight: 3 }],
    'sunscorch-canyon':  [{ id: 'canyon-thorn', weight: 45 }, { id: 'cinder-puff', weight: 18 }, { id: 'vibrant-seed', weight: 15 }, { id: 'ember-pit', weight: 12 }, { id: 'luminous-seed', weight: 8 }, { id: 'prismatic-seed', weight: 2 }],
    'magma-vents':       [{ id: 'cinder-puff', weight: 35 }, { id: 'canyon-thorn', weight: 25 }, { id: 'vibrant-seed', weight: 15 }, { id: 'magma-stone', weight: 12 }, { id: 'luminous-seed', weight: 8 }, { id: 'prismatic-seed', weight: 5 }],
    'ashen-ruins':       [{ id: 'canyon-thorn', weight: 35 }, { id: 'cinder-puff', weight: 25 }, { id: 'luminous-seed', weight: 15 }, { id: 'magma-stone', weight: 12 }, { id: 'vibrant-seed', weight: 8 }, { id: 'ashen-kernel', weight: 4 }, { id: 'prismatic-seed', weight: 1 }],
    'inferno-pit':       [{ id: 'cinder-puff', weight: 40 }, { id: 'canyon-thorn', weight: 20 }, { id: 'ember-pit', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'magma-stone', weight: 7 }, { id: 'ashen-kernel', weight: 4 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 1 }],
    'volcanic-forge':    [{ id: 'cinder-puff', weight: 35 }, { id: 'canyon-thorn', weight: 20 }, { id: 'luminous-seed', weight: 15 }, { id: 'magma-stone', weight: 12 }, { id: 'ember-pit', weight: 8 }, { id: 'ashen-kernel', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 1 }],
    // Toxic Marshlands (Common dominant, Epic ~3-5%, Legendary ~1%)
    'bogs-edge':         [{ id: 'mire-reed', weight: 40 }, { id: 'venom-bud', weight: 25 }, { id: 'bog-pearl', weight: 15 }, { id: 'vibrant-seed', weight: 12 }, { id: 'luminous-seed', weight: 5 }, { id: 'prismatic-seed', weight: 3 }],
    'mire-depths':       [{ id: 'mire-reed', weight: 42 }, { id: 'venom-bud', weight: 20 }, { id: 'bog-pearl', weight: 15 }, { id: 'vibrant-seed', weight: 10 }, { id: 'luminous-seed', weight: 7 }, { id: 'fungal-node', weight: 4 }, { id: 'prismatic-seed', weight: 2 }],
    'fungal-hollow':     [{ id: 'mire-reed', weight: 30 }, { id: 'venom-bud', weight: 25 }, { id: 'bog-pearl', weight: 15 }, { id: 'fungal-node', weight: 15 }, { id: 'luminous-seed', weight: 8 }, { id: 'vibrant-seed', weight: 5 }, { id: 'prismatic-seed', weight: 2 }],
    'venomous-thicket':  [{ id: 'venom-bud', weight: 40 }, { id: 'mire-reed', weight: 22 }, { id: 'luminous-seed', weight: 12 }, { id: 'fungal-node', weight: 10 }, { id: 'bog-pearl', weight: 8 }, { id: 'plague-spore', weight: 4 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 1 }],
    'plague-ponds':      [{ id: 'venom-bud', weight: 35 }, { id: 'mire-reed', weight: 25 }, { id: 'fungal-node', weight: 12 }, { id: 'luminous-seed', weight: 10 }, { id: 'bog-pearl', weight: 8 }, { id: 'plague-spore', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 1 }],
    'rot-core':          [{ id: 'venom-bud', weight: 32 }, { id: 'mire-reed', weight: 25 }, { id: 'luminous-seed', weight: 12 }, { id: 'fungal-node', weight: 10 }, { id: 'bog-pearl', weight: 8 }, { id: 'plague-spore', weight: 5 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 2 }, { id: 'vibrant-seed', weight: 1 }],
    // Abyssal Depths (Common dominant, Epic ~3-5%, Legendary ~1-2%)
    'tidal-caves':       [{ id: 'barnacle-nub', weight: 38 }, { id: 'pressure-pod', weight: 25 }, { id: 'tidal-bulb', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'vibrant-seed', weight: 7 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 2 }],
    'sunken-bazaar':     [{ id: 'barnacle-nub', weight: 42 }, { id: 'pressure-pod', weight: 22 }, { id: 'tidal-bulb', weight: 12 }, { id: 'luminous-seed', weight: 10 }, { id: 'coral-seed', weight: 8 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 2 }],
    'coral-labyrinth':   [{ id: 'barnacle-nub', weight: 35 }, { id: 'pressure-pod', weight: 22 }, { id: 'coral-seed', weight: 18 }, { id: 'tidal-bulb', weight: 10 }, { id: 'luminous-seed', weight: 7 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 2 }, { id: 'abyssal-pit', weight: 1 }],
    'pressure-rift':     [{ id: 'pressure-pod', weight: 40 }, { id: 'barnacle-nub', weight: 22 }, { id: 'coral-seed', weight: 12 }, { id: 'tidal-bulb', weight: 10 }, { id: 'luminous-seed', weight: 7 }, { id: 'abyssal-pit', weight: 4 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 2 }],
    'krakens-rest':      [{ id: 'pressure-pod', weight: 35 }, { id: 'barnacle-nub', weight: 25 }, { id: 'coral-seed', weight: 12 }, { id: 'tidal-bulb', weight: 10 }, { id: 'luminous-seed', weight: 7 }, { id: 'abyssal-pit', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 2 }],
    'abyssal-trench':    [{ id: 'pressure-pod', weight: 32 }, { id: 'barnacle-nub', weight: 28 }, { id: 'coral-seed', weight: 12 }, { id: 'tidal-bulb', weight: 8 }, { id: 'luminous-seed', weight: 7 }, { id: 'abyssal-pit', weight: 6 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 3 }],
    // Celestial Highlands (Common dominant, Epic ~3-5%, Legendary ~1-2%)
    'cloud-walkway':     [{ id: 'storm-pip', weight: 40 }, { id: 'astral-mote', weight: 25 }, { id: 'cloud-wisp', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'prismatic-seed', weight: 5 }, { id: 'solar-grain', weight: 3 }, { id: 'celestial-seed', weight: 2 }],
    'stormspire-tower':  [{ id: 'storm-pip', weight: 42 }, { id: 'astral-mote', weight: 22 }, { id: 'cloud-wisp', weight: 13 }, { id: 'luminous-seed', weight: 10 }, { id: 'solar-grain', weight: 5 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 2 }, { id: 'starbloom-seed', weight: 1 }],
    'solar-fields':      [{ id: 'astral-mote', weight: 38 }, { id: 'storm-pip', weight: 25 }, { id: 'cloud-wisp', weight: 13 }, { id: 'luminous-seed', weight: 10 }, { id: 'solar-grain', weight: 6 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 2 }, { id: 'starbloom-seed', weight: 1 }],
    'astral-gardens':    [{ id: 'astral-mote', weight: 42 }, { id: 'storm-pip', weight: 22 }, { id: 'cloud-wisp', weight: 12 }, { id: 'luminous-seed', weight: 8 }, { id: 'solar-grain', weight: 6 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 3 }, { id: 'starbloom-seed', weight: 2 }],
    'comets-trail':      [{ id: 'storm-pip', weight: 35 }, { id: 'astral-mote', weight: 25 }, { id: 'cloud-wisp', weight: 13 }, { id: 'luminous-seed', weight: 8 }, { id: 'solar-grain', weight: 7 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 4 }, { id: 'starbloom-seed', weight: 3 }],
    'empyrean-gate':     [{ id: 'astral-mote', weight: 32 }, { id: 'storm-pip', weight: 28 }, { id: 'cloud-wisp', weight: 12 }, { id: 'luminous-seed', weight: 7 }, { id: 'solar-grain', weight: 8 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 4 }, { id: 'starbloom-seed', weight: 4 }],
    // Void Nexus (Common dominant, Epic ~4-6%, Legendary ~1-3%)
    'rifts-edge':        [{ id: 'rift-sprout', weight: 40 }, { id: 'paradox-pip', weight: 25 }, { id: 'luminous-seed', weight: 15 }, { id: 'vibrant-seed', weight: 8 }, { id: 'null-spore', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'entropy-seed', weight: 2 }, { id: 'celestial-seed', weight: 1 }],
    'null-chamber':      [{ id: 'rift-sprout', weight: 35 }, { id: 'paradox-pip', weight: 28 }, { id: 'luminous-seed', weight: 13 }, { id: 'vibrant-seed', weight: 8 }, { id: 'null-spore', weight: 7 }, { id: 'prismatic-seed', weight: 4 }, { id: 'entropy-seed', weight: 3 }, { id: 'celestial-seed', weight: 1 }, { id: 'void-heart', weight: 1 }],
    'entropy-garden':    [{ id: 'paradox-pip', weight: 35 }, { id: 'rift-sprout', weight: 28 }, { id: 'luminous-seed', weight: 12 }, { id: 'vibrant-seed', weight: 7 }, { id: 'entropy-seed', weight: 7 }, { id: 'null-spore', weight: 5 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 2 }, { id: 'void-heart', weight: 1 }],
    'paradox-maze':      [{ id: 'paradox-pip', weight: 40 }, { id: 'rift-sprout', weight: 25 }, { id: 'luminous-seed', weight: 10 }, { id: 'vibrant-seed', weight: 7 }, { id: 'null-spore', weight: 5 }, { id: 'entropy-seed', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 2 }, { id: 'void-heart', weight: 2 }],
    'singularity-well':  [{ id: 'rift-sprout', weight: 35 }, { id: 'paradox-pip', weight: 28 }, { id: 'luminous-seed', weight: 10 }, { id: 'null-spore', weight: 6 }, { id: 'entropy-seed', weight: 6 }, { id: 'prismatic-seed', weight: 5 }, { id: 'vibrant-seed', weight: 4 }, { id: 'celestial-seed', weight: 3 }, { id: 'void-heart', weight: 3 }],
    'oblivion-throne':   [{ id: 'paradox-pip', weight: 32 }, { id: 'rift-sprout', weight: 28 }, { id: 'luminous-seed', weight: 10 }, { id: 'null-spore', weight: 7 }, { id: 'entropy-seed', weight: 7 }, { id: 'prismatic-seed', weight: 5 }, { id: 'celestial-seed', weight: 4 }, { id: 'void-heart', weight: 4 }, { id: 'starbloom-seed', weight: 3 }],
  },
  // Fallback for special locations or unknown locations - uses region generic weights
  regionFallback: {
    'neon-district':       [{ id: 'dusty-seed', weight: 40 }, { id: 'neon-sprout', weight: 18 }, { id: 'skyline-bean', weight: 14 }, { id: 'iron-weed', weight: 12 }, { id: 'midnight-clover', weight: 10 }, { id: 'vibrant-seed', weight: 5 }, { id: 'luminous-seed', weight: 1 }],
    'frozen-wastes':       [{ id: 'permafrost-nut', weight: 30 }, { id: 'blizzard-flake', weight: 28 }, { id: 'frost-kernel', weight: 15 }, { id: 'dusty-seed', weight: 10 }, { id: 'vibrant-seed', weight: 8 }, { id: 'luminous-seed', weight: 5 }, { id: 'glacier-spore', weight: 2 }, { id: 'crystal-pip', weight: 1 }, { id: 'prismatic-seed', weight: 1 }],
    'scorched-badlands':   [{ id: 'canyon-thorn', weight: 30 }, { id: 'cinder-puff', weight: 28 }, { id: 'ember-pit', weight: 15 }, { id: 'dusty-seed', weight: 8 }, { id: 'vibrant-seed', weight: 7 }, { id: 'luminous-seed', weight: 5 }, { id: 'magma-stone', weight: 3 }, { id: 'ashen-kernel', weight: 2 }, { id: 'prismatic-seed', weight: 1 }, { id: 'celestial-seed', weight: 1 }],
    'toxic-marshlands':    [{ id: 'mire-reed', weight: 30 }, { id: 'venom-bud', weight: 28 }, { id: 'bog-pearl', weight: 15 }, { id: 'vibrant-seed', weight: 8 }, { id: 'luminous-seed', weight: 7 }, { id: 'fungal-node', weight: 5 }, { id: 'prismatic-seed', weight: 3 }, { id: 'plague-spore', weight: 2 }, { id: 'celestial-seed', weight: 1 }, { id: 'dusty-seed', weight: 1 }],
    'abyssal-depths':      [{ id: 'barnacle-nub', weight: 30 }, { id: 'pressure-pod', weight: 28 }, { id: 'tidal-bulb', weight: 12 }, { id: 'luminous-seed', weight: 10 }, { id: 'coral-seed', weight: 8 }, { id: 'vibrant-seed', weight: 5 }, { id: 'prismatic-seed', weight: 3 }, { id: 'abyssal-pit', weight: 2 }, { id: 'celestial-seed', weight: 1 }, { id: 'dusty-seed', weight: 1 }],
    'celestial-highlands': [{ id: 'storm-pip', weight: 30 }, { id: 'astral-mote', weight: 28 }, { id: 'cloud-wisp', weight: 15 }, { id: 'luminous-seed', weight: 10 }, { id: 'vibrant-seed', weight: 7 }, { id: 'solar-grain', weight: 4 }, { id: 'prismatic-seed', weight: 3 }, { id: 'celestial-seed', weight: 2 }, { id: 'starbloom-seed', weight: 1 }],
    'void-nexus':          [{ id: 'rift-sprout', weight: 30 }, { id: 'paradox-pip', weight: 28 }, { id: 'luminous-seed', weight: 15 }, { id: 'vibrant-seed', weight: 8 }, { id: 'null-spore', weight: 5 }, { id: 'entropy-seed', weight: 5 }, { id: 'prismatic-seed', weight: 4 }, { id: 'celestial-seed', weight: 3 }, { id: 'void-heart', weight: 2 }],
  },
};

export function rollCropQuality() {
  const totalWeight = CROP_QUALITIES.reduce((sum, q) => sum + q.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const q of CROP_QUALITIES) {
    roll -= q.weight;
    if (roll <= 0) return q;
  }
  return CROP_QUALITIES[1]; // fallback: Normal
}

export function createSeedItem(seedId, foundLocationName) {
  const seed = FARM_SEEDS[seedId];
  if (!seed) return null;
  const locationLabel = foundLocationName || seed.foundAtName || null;
  return {
    id: uid(),
    seedId: seedId,
    name: seed.name,
    type: 'seed',
    slot: null,
    level: 1,
    rarity: seed.rarity,
    rarityClass: seed.rarity.toLowerCase(),
    icon: 'seed',
    description: seed.foundAt
      ? `${seed.desc} (found at: ${seed.foundAtName})`
      : seed.desc,
    foundAt: locationLabel,
    sellPrice: Math.floor(seed.baseValue[0] * 0.3),
  };
}

export function createCropItem(seedId, quality) {
  const seed = FARM_SEEDS[seedId];
  if (!seed) return null;
  const [minVal, maxVal] = seed.baseValue;
  const baseGold = minVal + Math.floor(Math.random() * (maxVal - minVal + 1));
  const sellPrice = Math.max(1, Math.floor(baseGold * quality.multiplier));
  const qualityPrefix = quality.id === 'normal' ? '' : `${quality.name} `;
  return {
    id: uid(),
    name: `${qualityPrefix}${seed.cropName}`,
    type: 'crop',
    slot: null,
    level: 1,
    rarity: seed.rarity,
    rarityClass: seed.rarity.toLowerCase(),
    icon: 'crop',
    description: `${quality.name} quality crop grown from a ${seed.name}. Sell it for profit!`,
    sellPrice,
    cropQuality: quality.id,
    cropQualityColor: quality.color,
  };
}

export function rollSeedDrop(regionId, locationId, locationName) {
  if (Math.random() >= SEED_DROP_CONFIG.dropChance) return null;
  // Try location-specific table first, then fall back to region generic
  const weights = SEED_DROP_CONFIG.locationSeeds[locationId] || SEED_DROP_CONFIG.regionFallback[regionId];
  if (!weights) return null;
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of weights) {
    roll -= entry.weight;
    if (roll <= 0) return createSeedItem(entry.id, locationName);
  }
  return createSeedItem(weights[0].id, locationName);
}

// Generate a material item for inventory/drops
export function createMaterialItem(materialId, quantity = 1) {
  const mat = BUILDING_MATERIALS[materialId];
  if (!mat) return null;
  return {
    id: uid(),
    materialId: materialId,
    name: mat.name,
    type: 'material',
    slot: null,
    level: 1,
    rarity: mat.rarity,
    rarityClass: mat.rarity.toLowerCase(),
    rarityColor: null,
    icon: 'material',
    description: mat.description,
    sellPrice: mat.sellPrice,
    stackQuantity: quantity,
    isFuel: !!mat.isFuel,
  };
}

// ---- REGION TICKETS ----
// Tickets required to access higher-level regions. Very rare drops or crafted in workshop.
// Neon District (starter) and Arena (free) don't need tickets.
export const REGION_TICKETS = {
  'toxic-marshlands': {
    id: 'ticket-toxic-marshlands', name: 'Marshland Visa', type: 'ticket',
    rarity: 'Epic', sellPrice: 600,
    description: 'A sealed document coated in anti-toxin resin. Required for the Toxic Marshlands.',
    regionId: 'toxic-marshlands', regionName: 'Toxic Marshlands',
  },
  'abyssal-depths': {
    id: 'ticket-abyssal-depths', name: 'Abyssal Dive Charter', type: 'ticket',
    rarity: 'Epic', sellPrice: 1200,
    description: 'A pressurized charter granting safe descent into the Abyssal Depths.',
    regionId: 'abyssal-depths', regionName: 'Abyssal Depths',
  },
  'celestial-highlands': {
    id: 'ticket-celestial-highlands', name: 'Celestial Ascent Token', type: 'ticket',
    rarity: 'Legendary', sellPrice: 2500,
    description: 'A radiant token that parts the clouds and opens the path to the Celestial Highlands.',
    regionId: 'celestial-highlands', regionName: 'Celestial Highlands',
  },
  'void-nexus': {
    id: 'ticket-void-nexus', name: 'Void Rift Key', type: 'ticket',
    rarity: 'Legendary', sellPrice: 5000,
    description: 'A fragment of collapsed reality. The only way to breach the Void Nexus.',
    regionId: 'void-nexus', regionName: 'Void Nexus',
  },
};

// Create a ticket item for inventory
export function createTicketItem(regionId) {
  const ticket = REGION_TICKETS[regionId];
  if (!ticket) return null;
  return {
    id: uid(),
    ticketRegionId: regionId,
    name: ticket.name,
    type: 'ticket',
    slot: null,
    level: 1,
    rarity: ticket.rarity,
    rarityClass: ticket.rarity.toLowerCase(),
    rarityColor: null,
    icon: 'ticket',
    description: ticket.description,
    sellPrice: ticket.sellPrice,
  };
}

// Ticket drop config per region — tickets for HIGHER regions drop very rarely in current region
// Drop rates are intentionally extremely low (0.3% - 0.8%)
export const TICKET_DROP_CONFIG = {
  'neon-district': {
    dropRate: 0.003,
    tickets: [
      { regionId: 'toxic-marshlands', weight: 5 },
    ],
  },
  'frozen-wastes': {
    dropRate: 0.003,
    tickets: [
      { regionId: 'toxic-marshlands', weight: 10 },
    ],
  },
  'scorched-badlands': {
    dropRate: 0.005,
    tickets: [
      { regionId: 'toxic-marshlands', weight: 50 },
      { regionId: 'abyssal-depths', weight: 8 },
    ],
  },
  'toxic-marshlands': {
    dropRate: 0.005,
    tickets: [
      { regionId: 'abyssal-depths', weight: 50 },
      { regionId: 'celestial-highlands', weight: 5 },
    ],
  },
  'abyssal-depths': {
    dropRate: 0.006,
    tickets: [
      { regionId: 'celestial-highlands', weight: 50 },
      { regionId: 'void-nexus', weight: 5 },
    ],
  },
  'celestial-highlands': {
    dropRate: 0.008,
    tickets: [
      { regionId: 'void-nexus', weight: 50 },
    ],
  },
};
