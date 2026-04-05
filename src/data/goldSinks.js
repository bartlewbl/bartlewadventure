// ============================================================
// GOLD SINKS - Data definitions for gold spending features
// ============================================================

// ---- STAT RESPEC ----
// Cost scales with player level
export function getRespecCost(playerLevel) {
  return Math.floor(50 * playerLevel);
}

// Base stat values per class (what stats reset to)
export const CLASS_BASE_STATS = {
  warrior: { maxHp: 65, maxMana: 20, baseAtk: 8, baseDef: 5, charisma: 2, wisdom: 2, athletics: 5, speed: 4, evasion: 2, accuracy: 4, resistance: 4, tenacity: 4, aggression: 4, luck: 2, fortitude: 4 },
  mage: { maxHp: 40, maxMana: 50, baseAtk: 4, baseDef: 2, charisma: 3, wisdom: 6, athletics: 2, speed: 5, evasion: 3, accuracy: 5, resistance: 5, tenacity: 3, aggression: 3, luck: 3, fortitude: 2 },
  rogue: { maxHp: 45, maxMana: 30, baseAtk: 7, baseDef: 3, charisma: 4, wisdom: 3, athletics: 4, speed: 7, evasion: 5, accuracy: 5, resistance: 2, tenacity: 3, aggression: 4, luck: 5, fortitude: 2 },
  cleric: { maxHp: 55, maxMana: 45, baseAtk: 4, baseDef: 4, charisma: 4, wisdom: 5, athletics: 3, speed: 4, evasion: 3, accuracy: 4, resistance: 4, tenacity: 4, aggression: 2, luck: 3, fortitude: 4 },
  ranger: { maxHp: 50, maxMana: 35, baseAtk: 6, baseDef: 3, charisma: 3, wisdom: 3, athletics: 4, speed: 6, evasion: 4, accuracy: 6, resistance: 3, tenacity: 3, aggression: 3, luck: 4, fortitude: 3 },
};

// ---- ITEM ENCHANTING ----
export const ENCHANT_LEVELS = [
  { level: 1, label: '+1', costMult: 1, statBonus: 1, successRate: 0.90 },
  { level: 2, label: '+2', costMult: 2, statBonus: 2, successRate: 0.75 },
  { level: 3, label: '+3', costMult: 4, statBonus: 3, successRate: 0.55 },
  { level: 4, label: '+4', costMult: 7, statBonus: 5, successRate: 0.35 },
  { level: 5, label: '+5', costMult: 12, statBonus: 8, successRate: 0.20 },
];

export function getEnchantCost(item, currentEnchantLevel) {
  const tier = ENCHANT_LEVELS[currentEnchantLevel] || ENCHANT_LEVELS[0];
  const basePrice = item.sellPrice || 50;
  return Math.floor(basePrice * tier.costMult + 50);
}

export function getEnchantSuccess(currentEnchantLevel) {
  const tier = ENCHANT_LEVELS[currentEnchantLevel] || ENCHANT_LEVELS[0];
  return tier.successRate;
}

export const MAX_ENCHANT_LEVEL = ENCHANT_LEVELS.length;

// ---- BOUNTY BOARD ----
export const BOUNTIES = [
  {
    id: 'bounty-street-thug', name: 'Street Thug Cleanup', desc: 'Clear out the street thugs roaming the alleys.',
    fee: 50, killTarget: 5, goldReward: 150, expReward: 80,
    minLevel: 1, region: 'neon-district',
  },
  {
    id: 'bounty-sewer-rats', name: 'Sewer Rat Infestation', desc: 'Exterminate the giant rats in the sewers.',
    fee: 80, killTarget: 8, goldReward: 250, expReward: 120,
    minLevel: 3, region: 'neon-district',
  },
  {
    id: 'bounty-fire-elemental', name: 'Scorched Patrol', desc: 'Hunt fire elementals in the badlands.',
    fee: 150, killTarget: 6, goldReward: 450, expReward: 200,
    minLevel: 8, region: 'scorched-badlands',
  },
  {
    id: 'bounty-frost-beast', name: 'Frozen Hunt', desc: 'Track and kill frost beasts in the tundra.',
    fee: 200, killTarget: 5, goldReward: 600, expReward: 300,
    minLevel: 12, region: 'frozen-wastes',
  },
  {
    id: 'bounty-toxic-crawler', name: 'Swamp Purge', desc: 'Eliminate toxic crawlers from the marshlands.',
    fee: 300, killTarget: 7, goldReward: 850, expReward: 400,
    minLevel: 16, region: 'toxic-marshlands',
  },
  {
    id: 'bounty-deep-lurker', name: 'Abyssal Stalker', desc: 'Dive deep and slay the lurking horrors below.',
    fee: 500, killTarget: 5, goldReward: 1400, expReward: 600,
    minLevel: 22, region: 'abyssal-depths',
  },
  {
    id: 'bounty-celestial', name: 'Celestial Warden', desc: 'Challenge the celestial guardians in the highlands.',
    fee: 750, killTarget: 4, goldReward: 2200, expReward: 900,
    minLevel: 28, region: 'celestial-highlands',
  },
];

// ---- MERCENARY HIRE ----
export const MERCENARIES = [
  {
    id: 'merc-bruiser', name: 'Street Bruiser', desc: 'A tough brawler. Deals extra damage each turn.',
    cost: 100, duration: 5, // 5 battles
    atkBonus: 5, defBonus: 0, minLevel: 1, rarity: 'Common',
  },
  {
    id: 'merc-bodyguard', name: 'Iron Bodyguard', desc: 'A defensive specialist. Absorbs hits for you.',
    cost: 200, duration: 5,
    atkBonus: 2, defBonus: 8, minLevel: 5, rarity: 'Uncommon',
  },
  {
    id: 'merc-assassin', name: 'Shadow Assassin', desc: 'Quick and deadly. High damage, low defense.',
    cost: 400, duration: 5,
    atkBonus: 12, defBonus: 0, minLevel: 10, rarity: 'Rare',
  },
  {
    id: 'merc-knight', name: 'Veteran Knight', desc: 'Balanced fighter. Solid ATK and DEF.',
    cost: 750, duration: 5,
    atkBonus: 8, defBonus: 6, minLevel: 15, rarity: 'Rare',
  },
  {
    id: 'merc-arcane', name: 'Arcane Battlemage', desc: 'Empowers your attacks with magical energy.',
    cost: 1200, duration: 5,
    atkBonus: 15, defBonus: 3, minLevel: 20, rarity: 'Epic',
  },
  {
    id: 'merc-champion', name: 'Arena Champion', desc: 'The best money can buy. Devastating power.',
    cost: 2500, duration: 5,
    atkBonus: 20, defBonus: 10, minLevel: 25, rarity: 'Legendary',
  },
];

// ---- GAMBLING / DICE GAME ----
export const DICE_WAGERS = [25, 50, 100, 250, 500, 1000];

// Roll 2d6, player picks over/under 7
// Over 7 (8-12): pays 2x
// Under 7 (2-6): pays 2x
// Exactly 7: house wins (probability 6/36 = 16.7%)
// Player edge: 41.7% to win on either side

export const COIN_FLIP_WAGERS = [10, 25, 50, 100, 250, 500];
// Simple heads/tails, 48% win rate (slight house edge), pays 2x

export const WHEEL_SEGMENTS = [
  { label: 'x0', mult: 0, weight: 20, color: '#444' },
  { label: 'x1', mult: 1, weight: 30, color: '#666' },
  { label: 'x2', mult: 2, weight: 25, color: '#4fc3f7' },
  { label: 'x3', mult: 3, weight: 15, color: '#ffd700' },
  { label: 'x5', mult: 5, weight: 8, color: '#ce93d8' },
  { label: 'x10', mult: 10, weight: 2, color: '#ff6b6b' },
];

export const WHEEL_WAGERS = [25, 50, 100, 250, 500];

export function spinWheel() {
  const totalWeight = WHEEL_SEGMENTS.reduce((s, seg) => s + seg.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const seg of WHEEL_SEGMENTS) {
    roll -= seg.weight;
    if (roll <= 0) return seg;
  }
  return WHEEL_SEGMENTS[0];
}

export function rollDice() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  return { d1, d2, total: d1 + d2 };
}

export function flipCoin() {
  // 48% heads (player wins on heads)
  return Math.random() < 0.48 ? 'heads' : 'tails';
}

// ---- COSMETIC SHOP ----
export const COSMETICS = {
  titles: [
    { id: 'title-slayer', name: 'Monster Slayer', desc: 'A title for the battle-hardened.', cost: 200, type: 'title' },
    { id: 'title-merchant', name: 'Master Merchant', desc: 'A title for the shrewd trader.', cost: 300, type: 'title' },
    { id: 'title-legend', name: 'Living Legend', desc: 'A title for the truly accomplished.', cost: 1000, type: 'title' },
    { id: 'title-shadow', name: 'Shadow Walker', desc: 'One who walks unseen.', cost: 500, type: 'title' },
    { id: 'title-phoenix', name: 'Phoenix Reborn', desc: 'Risen from the ashes.', cost: 750, type: 'title' },
    { id: 'title-void', name: 'Void Touched', desc: 'Marked by the abyss itself.', cost: 1500, type: 'title' },
  ],
  nameColors: [
    { id: 'color-crimson', name: 'Crimson', color: '#ff4444', cost: 300, type: 'nameColor' },
    { id: 'color-gold', name: 'Gold', color: '#ffd700', cost: 500, type: 'nameColor' },
    { id: 'color-electric', name: 'Electric Blue', color: '#00ccff', cost: 400, type: 'nameColor' },
    { id: 'color-toxic', name: 'Toxic Green', color: '#00ff88', cost: 400, type: 'nameColor' },
    { id: 'color-purple', name: 'Royal Purple', color: '#cc66ff', cost: 600, type: 'nameColor' },
    { id: 'color-pink', name: 'Neon Pink', color: '#ff66cc', cost: 350, type: 'nameColor' },
  ],
  frames: [
    { id: 'frame-iron', name: 'Iron Frame', desc: 'A simple iron border.', cost: 250, type: 'frame', style: 'solid 2px #888' },
    { id: 'frame-gold', name: 'Golden Frame', desc: 'A prestigious golden border.', cost: 800, type: 'frame', style: 'solid 2px #ffd700' },
    { id: 'frame-fire', name: 'Flame Frame', desc: 'A fiery red border.', cost: 600, type: 'frame', style: 'solid 2px #ff4444' },
    { id: 'frame-frost', name: 'Frost Frame', desc: 'An icy blue border.', cost: 600, type: 'frame', style: 'solid 2px #4fc3f7' },
    { id: 'frame-void', name: 'Void Frame', desc: 'A dark purple border from the abyss.', cost: 1200, type: 'frame', style: 'solid 2px #9933ff' },
    { id: 'frame-celestial', name: 'Celestial Frame', desc: 'A shimmering celestial border.', cost: 2000, type: 'frame', style: 'double 3px #ffeedd' },
  ],
};
