// ============================================================
// Loot Chest Definitions
//
// 10 thematic loot chests with weighted loot tables.
// Chests are primarily earned through quests, daily logins,
// and very rarely purchasable in the shop.
//
// Each chest defines:
//   id         - unique chest identifier
//   name       - display name
//   rarity     - chest rarity tier (affects visual styling)
//   desc       - flavor text
//   icon       - display icon
//   itemCount  - { min, max } items rolled when opened
//   goldBonus  - { min, max } bonus gold when opened
//   lootTable  - weighted array of { type, rarityMin?, rarityMax?, weight }
//   buyPrice   - null if not purchasable, number if buyable in shop
//   sellPrice  - gold received when selling unopened chest
// ============================================================

export const LOOT_CHESTS = [
  {
    id: 'street-crate',
    name: 'Street Crate',
    rarity: 'Common',
    desc: 'A battered crate scavenged from the neon gutters. Mostly junk, but sometimes surprises.',
    icon: 'chest',
    itemCount: { min: 1, max: 2 },
    goldBonus: { min: 5, max: 20 },
    lootTable: [
      { type: 'potion', weight: 35 },
      { type: 'energy-drink', weight: 15 },
      { type: 'boots', rarityMax: 'Uncommon', weight: 10 },
      { type: 'gloves', rarityMax: 'Uncommon', weight: 10 },
      { type: 'helmet', rarityMax: 'Uncommon', weight: 8 },
      { type: 'belt', rarityMax: 'Common', weight: 7 },
      { type: 'material', materialPool: 'common', weight: 15 },
    ],
    buyPrice: null,
    sellPrice: 15,
  },
  {
    id: 'shadow-lockbox',
    name: 'Shadow Lockbox',
    rarity: 'Uncommon',
    desc: 'A reinforced lockbox lifted from the back alleys. The lock glows faintly purple.',
    icon: 'chest',
    itemCount: { min: 1, max: 3 },
    goldBonus: { min: 15, max: 40 },
    lootTable: [
      { type: 'sword', rarityMin: 'Common', rarityMax: 'Rare', weight: 12 },
      { type: 'armor', rarityMin: 'Common', rarityMax: 'Rare', weight: 10 },
      { type: 'shield', rarityMin: 'Common', rarityMax: 'Rare', weight: 8 },
      { type: 'potion', weight: 20 },
      { type: 'ring', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 8 },
      { type: 'cape', rarityMin: 'Common', rarityMax: 'Uncommon', weight: 6 },
      { type: 'energy-drink', weight: 12 },
      { type: 'material', materialPool: 'common', weight: 10 },
    ],
    buyPrice: null,
    sellPrice: 30,
  },
  {
    id: 'metro-vault',
    name: 'Metro Vault',
    rarity: 'Uncommon',
    desc: 'A sealed container from the abandoned metro tunnels. Rusted shut but worth prying open.',
    icon: 'chest',
    itemCount: { min: 2, max: 3 },
    goldBonus: { min: 20, max: 50 },
    lootTable: [
      { type: 'helmet', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 10 },
      { type: 'armor', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 10 },
      { type: 'boots', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 8 },
      { type: 'sword', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 10 },
      { type: 'potion', weight: 18 },
      { type: 'gloves', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 8 },
      { type: 'amulet', rarityMin: 'Common', rarityMax: 'Uncommon', weight: 6 },
      { type: 'material', materialPool: 'uncommon', weight: 12 },
      { type: 'energy-drink', weight: 8 },
    ],
    buyPrice: null,
    sellPrice: 45,
  },
  {
    id: 'skyline-strongbox',
    name: 'Skyline Strongbox',
    rarity: 'Rare',
    desc: 'A wind-scored strongbox found on the rooftops. The scavengers guarded it well.',
    icon: 'chest',
    itemCount: { min: 2, max: 4 },
    goldBonus: { min: 30, max: 80 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'shield', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'helmet', rarityMin: 'Uncommon', rarityMax: 'Epic', weight: 8 },
      { type: 'ring', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'cape', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 6 },
      { type: 'amulet', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 6 },
      { type: 'potion', weight: 15 },
      { type: 'material', materialPool: 'rare', weight: 10 },
      { type: 'energy-drink', weight: 8 },
    ],
    buyPrice: null,
    sellPrice: 75,
  },
  {
    id: 'ironworks-coffer',
    name: 'Ironworks Coffer',
    rarity: 'Rare',
    desc: 'A heat-warped coffer from the industrial yards. Smells of molten iron and opportunity.',
    icon: 'chest',
    itemCount: { min: 2, max: 4 },
    goldBonus: { min: 40, max: 100 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'shield', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'boots', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'gloves', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'belt', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 6 },
      { type: 'potion', weight: 12 },
      { type: 'material', materialPool: 'rare', weight: 14 },
      { type: 'energy-drink', weight: 6 },
    ],
    buyPrice: null,
    sellPrice: 90,
  },
  {
    id: 'neon-treasure',
    name: 'Neon Treasure Chest',
    rarity: 'Epic',
    desc: 'A pulsing neon-lit chest radiating raw energy. Whatever is inside, it was worth protecting.',
    icon: 'chest',
    itemCount: { min: 3, max: 5 },
    goldBonus: { min: 60, max: 150 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Legendary', weight: 10 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Legendary', weight: 9 },
      { type: 'shield', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'helmet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'ring', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'amulet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 6 },
      { type: 'cape', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
      { type: 'boots', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
      { type: 'potion', weight: 10 },
      { type: 'material', materialPool: 'epic', weight: 8 },
    ],
    buyPrice: null,
    sellPrice: 150,
  },
  {
    id: 'void-reliquary',
    name: 'Void Reliquary',
    rarity: 'Epic',
    desc: 'A dark vessel humming with abyssal power. Opening it feels like staring into the void.',
    icon: 'chest',
    itemCount: { min: 3, max: 5 },
    goldBonus: { min: 80, max: 200 },
    lootTable: [
      { type: 'sword', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 10 },
      { type: 'armor', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 9 },
      { type: 'shield', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 7 },
      { type: 'ring', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'amulet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'cape', rarityMin: 'Rare', rarityMax: 'Epic', weight: 6 },
      { type: 'helmet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 6 },
      { type: 'boots', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
      { type: 'gloves', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
      { type: 'potion', weight: 8 },
    ],
    buyPrice: null,
    sellPrice: 200,
  },
  {
    id: 'cyberpunk-cache',
    name: 'Cyberpunk Cache',
    rarity: 'Rare',
    desc: 'A chrome-plated cache wired with tech salvage. Popular among street runners.',
    icon: 'chest',
    itemCount: { min: 2, max: 4 },
    goldBonus: { min: 35, max: 90 },
    lootTable: [
      { type: 'sword', rarityMin: 'Uncommon', rarityMax: 'Epic', weight: 10 },
      { type: 'gloves', rarityMin: 'Uncommon', rarityMax: 'Epic', weight: 9 },
      { type: 'boots', rarityMin: 'Uncommon', rarityMax: 'Epic', weight: 8 },
      { type: 'belt', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 7 },
      { type: 'ring', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 7 },
      { type: 'energy-drink', weight: 15 },
      { type: 'potion', weight: 12 },
      { type: 'material', materialPool: 'uncommon', weight: 12 },
    ],
    buyPrice: null,
    sellPrice: 65,
  },
  {
    id: 'mercenary-bounty',
    name: 'Mercenary Bounty Box',
    rarity: 'Rare',
    desc: 'A battle-scarred box awarded to those who prove themselves in combat. Weapons guaranteed.',
    icon: 'chest',
    itemCount: { min: 2, max: 3 },
    goldBonus: { min: 50, max: 120 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Epic', weight: 25 },
      { type: 'shield', rarityMin: 'Rare', rarityMax: 'Epic', weight: 15 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Epic', weight: 12 },
      { type: 'helmet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'potion', weight: 15 },
      { type: 'energy-drink', weight: 8 },
    ],
    buyPrice: null,
    sellPrice: 80,
  },
  {
    id: 'legendary-ark',
    name: 'Legendary Ark',
    rarity: 'Legendary',
    desc: 'An ancient ark crackling with legendary power. Only the most dedicated adventurers earn this.',
    icon: 'chest',
    itemCount: { min: 4, max: 6 },
    goldBonus: { min: 150, max: 400 },
    lootTable: [
      { type: 'sword', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 12 },
      { type: 'armor', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 11 },
      { type: 'shield', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'helmet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 7 },
      { type: 'ring', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'amulet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 6 },
      { type: 'cape', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
      { type: 'boots', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
      { type: 'gloves', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
      { type: 'belt', rarityMin: 'Rare', rarityMax: 'Epic', weight: 4 },
      { type: 'potion', weight: 6 },
    ],
    buyPrice: null,
    sellPrice: 350,
  },
];

// Lookup by chest id
export const CHEST_LOOKUP = LOOT_CHESTS.reduce((acc, chest) => {
  acc[chest.id] = chest;
  return acc;
}, {});

// Rarity order for filtering loot table entries
export const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// Material pool mapping — which materials appear per pool tier
export const CHEST_MATERIAL_POOLS = {
  common: ['scrap-wood', 'iron-ore', 'stone-block', 'charcoal'],
  uncommon: ['iron-ore', 'copper-wire', 'toxic-resin', 'coal-chunk'],
  rare: ['crystal-shard', 'deep-coral', 'starlight-dust', 'oil-canister'],
  epic: ['crystal-shard', 'void-essence', 'plasma-core', 'starlight-dust'],
};

// Helper to create a chest inventory item from a chest definition
export function createChestItem(chestId) {
  const def = CHEST_LOOKUP[chestId];
  if (!def) return null;
  return {
    id: 'chest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    name: def.name,
    type: 'loot-chest',
    chestId: def.id,
    rarity: def.rarity,
    rarityClass: 'rarity-' + def.rarity.toLowerCase(),
    rarityColor: null, // will use CSS class
    slot: null,
    icon: 'chest',
    desc: def.desc,
    sellPrice: def.sellPrice,
  };
}

// ============================================================
// Trading Market — Trade materials for powerful loot chests
// ============================================================

export const TRADING_MARKET_CHESTS = [
  {
    id: 'scavengers-haul',
    name: "Scavenger's Haul",
    rarity: 'Rare',
    desc: 'A reinforced crate assembled from salvaged parts. Contains gear a cut above what you find on the streets.',
    icon: 'chest',
    itemCount: { min: 2, max: 3 },
    goldBonus: { min: 30, max: 70 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Epic', weight: 14 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Epic', weight: 12 },
      { type: 'shield', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'helmet', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 8 },
      { type: 'boots', rarityMin: 'Uncommon', rarityMax: 'Rare', weight: 8 },
      { type: 'potion', weight: 12 },
      { type: 'material', materialPool: 'rare', weight: 8 },
    ],
    sellPrice: 60,
    materialCost: {
      'scrap-wood': 15,
      'iron-ore': 10,
      'stone-block': 10,
      'charcoal': 5,
    },
    minLevel: 6,
  },
  {
    id: 'alchemists-crucible',
    name: "Alchemist's Crucible",
    rarity: 'Rare',
    desc: 'A sealed crucible forged with rare reagents. Accessories of unusual power crystallize within.',
    icon: 'chest',
    itemCount: { min: 2, max: 4 },
    goldBonus: { min: 50, max: 120 },
    lootTable: [
      { type: 'sword', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'armor', rarityMin: 'Rare', rarityMax: 'Epic', weight: 9 },
      { type: 'ring', rarityMin: 'Rare', rarityMax: 'Epic', weight: 12 },
      { type: 'amulet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 10 },
      { type: 'cape', rarityMin: 'Uncommon', rarityMax: 'Epic', weight: 7 },
      { type: 'potion', weight: 10 },
      { type: 'material', materialPool: 'rare', weight: 8 },
    ],
    sellPrice: 100,
    materialCost: {
      'charcoal': 10,
      'copper-wire': 10,
      'toxic-resin': 8,
      'coal-chunk': 6,
    },
    minLevel: 10,
  },
  {
    id: 'crystalforged-coffer',
    name: 'Crystalforged Coffer',
    rarity: 'Epic',
    desc: 'A coffer reinforced with crystalline lattice. Every item inside is forged to epic standards.',
    icon: 'chest',
    itemCount: { min: 3, max: 5 },
    goldBonus: { min: 80, max: 180 },
    lootTable: [
      { type: 'sword', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 14 },
      { type: 'shield', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 10 },
      { type: 'armor', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 10 },
      { type: 'helmet', rarityMin: 'Rare', rarityMax: 'Epic', weight: 8 },
      { type: 'gloves', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'boots', rarityMin: 'Rare', rarityMax: 'Epic', weight: 7 },
      { type: 'belt', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
    ],
    sellPrice: 150,
    materialCost: {
      'crystal-shard': 8,
      'deep-coral': 6,
      'oil-canister': 5,
      'iron-ore': 15,
    },
    minLevel: 14,
  },
  {
    id: 'voidforged-reliquary',
    name: 'Voidforged Reliquary',
    rarity: 'Epic',
    desc: 'A reliquary tempered in void energy. The power sealed within rivals that of ancient legends.',
    icon: 'chest',
    itemCount: { min: 4, max: 5 },
    goldBonus: { min: 120, max: 280 },
    lootTable: [
      { type: 'sword', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 13 },
      { type: 'armor', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 11 },
      { type: 'shield', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'ring', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 10 },
      { type: 'amulet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'helmet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 6 },
      { type: 'cape', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
      { type: 'boots', rarityMin: 'Rare', rarityMax: 'Epic', weight: 5 },
    ],
    sellPrice: 220,
    materialCost: {
      'starlight-dust': 8,
      'crystal-shard': 10,
      'plasma-core': 4,
      'deep-coral': 6,
    },
    minLevel: 18,
  },
  {
    id: 'celestial-armory',
    name: 'Celestial Armory',
    rarity: 'Legendary',
    desc: 'A radiant armory forged from the rarest materials in existence. Only legendary gear resides within.',
    icon: 'chest',
    itemCount: { min: 5, max: 7 },
    goldBonus: { min: 200, max: 500 },
    lootTable: [
      { type: 'sword', rarityMin: 'Legendary', rarityMax: 'Legendary', weight: 14 },
      { type: 'armor', rarityMin: 'Legendary', rarityMax: 'Legendary', weight: 12 },
      { type: 'shield', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 9 },
      { type: 'ring', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 10 },
      { type: 'amulet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 8 },
      { type: 'helmet', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 7 },
      { type: 'cape', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
      { type: 'boots', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
      { type: 'gloves', rarityMin: 'Epic', rarityMax: 'Legendary', weight: 5 },
    ],
    sellPrice: 450,
    materialCost: {
      'void-essence': 10,
      'plasma-core': 8,
      'starlight-dust': 12,
      'crystal-shard': 15,
    },
    minLevel: 22,
  },
];

// Lookup for trading market chests
export const TRADING_CHEST_LOOKUP = TRADING_MARKET_CHESTS.reduce((acc, chest) => {
  acc[chest.id] = chest;
  return acc;
}, {});

// Also add trading chests to the main lookup so OPEN_CHEST can find them
TRADING_MARKET_CHESTS.forEach(chest => {
  CHEST_LOOKUP[chest.id] = chest;
});

// Get trading market stock filtered by player level
export function getTradingMarketStock(playerLevel) {
  return TRADING_MARKET_CHESTS.filter(c => playerLevel >= c.minLevel);
}

// Chests available for rare purchase in the shop (only a few, expensive)
export function getChestShopStock(playerLevel) {
  // Only show chests the player is high enough level for, max 2 at a time
  const buyable = LOOT_CHESTS.filter(c => c.buyPrice !== null);
  const levelFiltered = buyable.filter(c => {
    if (c.rarity === 'Rare') return playerLevel >= 8;
    if (c.rarity === 'Epic') return playerLevel >= 14;
    if (c.rarity === 'Legendary') return playerLevel >= 20;
    return true;
  });
  return levelFiltered.map(c => ({
    ...createChestItem(c.id),
    buyPrice: c.buyPrice,
    stock: 2,
  }));
}
