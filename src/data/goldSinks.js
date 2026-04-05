// ============================================================
// GOLD SINKS - Data definitions for gold spending features
// ============================================================

// ---- STAT RESPEC (via Grog the bartender) ----
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

// ---- ITEM ENCHANTING (via Ember NPC in tavern) ----
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

// ---- NPC BOUNTIES (per tavern NPC) ----
// Each NPC posts bounties through their faction contacts
export const NPC_BOUNTIES = {
  bartender: [
    {
      id: 'grog-bounty-1', name: 'Bar Tab Enforcement', desc: "Some deadbeats skipped their tab and fled to the alleys. Rough 'em up.",
      fee: 50, killTarget: 5, goldReward: 150, expReward: 80, reqRep: 1, reqLevel: 1,
    },
    {
      id: 'grog-bounty-2', name: 'Cellar Infestation', desc: 'Giant rats got into the cellar again. Clear them out before they spoil the ale.',
      fee: 80, killTarget: 8, goldReward: 250, expReward: 120, reqRep: 2, reqLevel: 3,
    },
    {
      id: 'grog-bounty-3', name: "Ironflask's Revenge", desc: "The creatures that killed my brother roam the deep. Hunt them for me.",
      fee: 300, killTarget: 6, goldReward: 850, expReward: 400, reqRep: 3, reqLevel: 12,
    },
  ],
  whisper: [
    {
      id: 'whis-bounty-1', name: 'Loose Ends', desc: 'Some informants have gone rogue. Silence them permanently.',
      fee: 80, killTarget: 6, goldReward: 200, expReward: 100, reqRep: 1, reqLevel: 3,
    },
    {
      id: 'whis-bounty-2', name: 'Shadow Purge', desc: 'A rival syndicate is moving in. Remove their enforcers.',
      fee: 200, killTarget: 8, goldReward: 600, expReward: 250, reqRep: 2, reqLevel: 8,
    },
    {
      id: 'whis-bounty-3', name: 'The Dead Drop', desc: 'Eliminate the couriers carrying intelligence to our enemies in the depths.',
      fee: 500, killTarget: 5, goldReward: 1400, expReward: 600, reqRep: 4, reqLevel: 20,
    },
  ],
  fenwick: [
    {
      id: 'fen-bounty-1', name: "Old Guard's Honor", desc: "Monsters dishonor the old battlefields. Show them what we're made of.",
      fee: 60, killTarget: 7, goldReward: 180, expReward: 90, reqRep: 1, reqLevel: 2,
    },
    {
      id: 'fen-bounty-2', name: 'Frozen Memories', desc: 'The frost beasts guard relics of the Old Guard. Recover them.',
      fee: 200, killTarget: 5, goldReward: 600, expReward: 300, reqRep: 2, reqLevel: 10,
    },
    {
      id: 'fen-bounty-3', name: 'Avenge the Fallen', desc: 'The creatures of the Abyss killed my comrades. Make them pay.',
      fee: 500, killTarget: 5, goldReward: 1400, expReward: 600, reqRep: 4, reqLevel: 22,
    },
  ],
  mira: [
    {
      id: 'mira-bounty-1', name: 'Route Clearance', desc: 'Bandits are disrupting my trade routes. Handle it.',
      fee: 70, killTarget: 6, goldReward: 200, expReward: 100, reqRep: 1, reqLevel: 2,
    },
    {
      id: 'mira-bounty-2', name: 'Specimen Collection', desc: 'Kill rare creatures and their parts will fetch a fortune. I keep the parts, you keep the bounty.',
      fee: 150, killTarget: 6, goldReward: 450, expReward: 200, reqRep: 2, reqLevel: 8,
    },
    {
      id: 'mira-bounty-3', name: "Cartel's Wrath", desc: "Someone stole a Golden Cartel shipment. The creatures guarding it must die so we can recover the goods.",
      fee: 750, killTarget: 4, goldReward: 2200, expReward: 900, reqRep: 4, reqLevel: 25,
    },
  ],
  thorne: [
    {
      id: 'thorne-bounty-1', name: 'Patrol Duty', desc: 'Clear hostiles from the patrol routes so the guards can move freely.',
      fee: 60, killTarget: 8, goldReward: 200, expReward: 100, reqRep: 1, reqLevel: 2,
    },
    {
      id: 'thorne-bounty-2', name: 'Scorched Earth', desc: 'Fire elementals threaten the outpost. Eliminate them.',
      fee: 150, killTarget: 6, goldReward: 450, expReward: 200, reqRep: 2, reqLevel: 8,
    },
    {
      id: 'thorne-bounty-3', name: "Legion's Justice", desc: "High-value targets in the celestial highlands. The Legion needs them dead.",
      fee: 750, killTarget: 4, goldReward: 2200, expReward: 900, reqRep: 4, reqLevel: 28,
    },
  ],
};

// Flat list for reducer lookups
export const ALL_BOUNTIES = Object.values(NPC_BOUNTIES).flat();

// ---- FACTION MERCENARIES (per NPC, require rep) ----
export const NPC_MERCENARIES = {
  bartender: [
    { id: 'merc-tavern-brawler', name: 'Tavern Brawler', desc: "One of Grog's regulars who fights for drink money.", cost: 100, duration: 5, atkBonus: 5, defBonus: 2, reqRep: 1, rarity: 'Common' },
    { id: 'merc-ironforge-guard', name: 'Ironforge Guard', desc: 'A loyal Covenant defender.', cost: 500, duration: 5, atkBonus: 8, defBonus: 8, reqRep: 3, rarity: 'Rare' },
  ],
  whisper: [
    { id: 'merc-shadow-blade', name: 'Shadow Blade', desc: 'A Syndicate assassin. Deadly but fragile.', cost: 200, duration: 5, atkBonus: 10, defBonus: 0, reqRep: 1, rarity: 'Uncommon' },
    { id: 'merc-phantom', name: 'Phantom Operative', desc: 'Elite Syndicate agent. Strikes from the dark.', cost: 800, duration: 5, atkBonus: 18, defBonus: 2, reqRep: 3, rarity: 'Epic' },
  ],
  fenwick: [
    { id: 'merc-old-guard-recruit', name: 'Old Guard Recruit', desc: 'A young soldier trained in the old ways.', cost: 150, duration: 5, atkBonus: 4, defBonus: 6, reqRep: 1, rarity: 'Common' },
    { id: 'merc-old-guard-veteran', name: 'Old Guard Veteran', desc: 'A seasoned warrior from the old order.', cost: 700, duration: 5, atkBonus: 10, defBonus: 10, reqRep: 3, rarity: 'Rare' },
  ],
  mira: [
    { id: 'merc-cartel-enforcer', name: 'Cartel Enforcer', desc: "Mira's hired muscle. Fights for gold.", cost: 200, duration: 5, atkBonus: 7, defBonus: 3, reqRep: 1, rarity: 'Uncommon' },
    { id: 'merc-gold-champion', name: 'Goldspark Champion', desc: "The Cartel's finest warrior.", cost: 1200, duration: 5, atkBonus: 15, defBonus: 5, reqRep: 4, rarity: 'Epic' },
  ],
  thorne: [
    { id: 'merc-legion-soldier', name: 'Legion Soldier', desc: 'An off-duty Steel Legion trooper.', cost: 150, duration: 5, atkBonus: 4, defBonus: 8, reqRep: 1, rarity: 'Uncommon' },
    { id: 'merc-legion-captain', name: 'Legion Captain', desc: 'A commanding officer of the Steel Legion.', cost: 1000, duration: 5, atkBonus: 12, defBonus: 12, reqRep: 4, rarity: 'Epic' },
  ],
};

// Flat list for reducer lookups
export const ALL_MERCENARIES = Object.values(NPC_MERCENARIES).flat();

// ---- ENCHANTER NPC (new tavern NPC) ----
export const ENCHANTER_NPC = {
  id: 'ember',
  name: 'Ember Ashveil',
  role: 'Enchantress',
  color: '#ff7043',
  greeting: "Ah, another soul seeking power beyond the forge. I weave magic into steel — for a price. Bring me your finest gear and enough gold, and I'll make it sing.",
  topics: [
    {
      id: 'enchanting',
      label: 'How does enchanting work?',
      lines: [
        "I channel raw magical energy into your equipment, strengthening its bonuses. Each enhancement level increases ATK and DEF.",
        "The first enchantment is almost guaranteed. But as I push further, the magic becomes unstable. Higher levels risk failure.",
        "A failed enchantment won't destroy your gear — the magic simply dissipates. But you still pay for my time and materials.",
        "The finest warriors in the land carry +5 gear. Getting there takes gold, patience, and a fair bit of luck.",
      ],
    },
    {
      id: 'backstory',
      label: 'Where did you learn this?',
      lines: [
        "I studied under the Crystal Weavers in the highlands. They taught me to see the threads of magic in all things.",
        "Most enchanters burned out — literally. The magic consumes you if you're not careful. I survived because I respect the flame.",
        "Grog lets me work here in exchange for keeping the tavern's heating crystals charged. A fair trade.",
      ],
    },
  ],
};

// ---- DEALER NPC (gambling in tavern) ----
export const DEALER_NPC = {
  id: 'dealer',
  name: 'Rattlebone Jack',
  role: 'Dealer',
  color: '#ffd700',
  greeting: "Step right up, friend. The dice are hot, the coins are cold, and the wheel waits for no one. What's your poison?",
  topics: [
    {
      id: 'odds',
      label: 'What are the odds?',
      lines: [
        "Dice: bet over or under 7 on a 2d6 roll. Land exactly 7? That's mine. Otherwise, it's a clean double-or-nothing.",
        "Coin flip: call heads or tails. Simple as it gets. Almost fair, too.",
        "The Wheel? Now that's where the real thrill is. Could walk away with ten times your wager... or nothing at all.",
      ],
    },
    {
      id: 'backstory',
      label: "Who are you?",
      lines: [
        "They call me Rattlebone Jack. Been running games since before Grog opened this dump.",
        "I used to deal cards in the Undercity. Lost an eye and three fingers down there. Tavern life suits me better.",
        "Don't worry about me cheating — Grog would break my remaining fingers. The house edge is built into the games.",
      ],
    },
  ],
};

// ---- GAMBLING / DICE GAME (in tavern) ----
export const DICE_WAGERS = [25, 50, 100, 250, 500, 1000];

export const COIN_FLIP_WAGERS = [10, 25, 50, 100, 250, 500];

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
  return Math.random() < 0.48 ? 'heads' : 'tails';
}

// ---- COSMETIC SHOP (in shop screen) ----
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
