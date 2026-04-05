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
  // ---- SPRITE COSMETICS ----
  hairColors: [
    { id: 'hair-blonde', name: 'Blonde', desc: 'Golden blonde locks.', cost: 200, type: 'hairColor', color: '#d4a843' },
    { id: 'hair-red', name: 'Fiery Red', desc: 'Striking red hair.', cost: 300, type: 'hairColor', color: '#a83232' },
    { id: 'hair-white', name: 'Silver', desc: 'Wise silver-white hair.', cost: 400, type: 'hairColor', color: '#c8c8d0' },
    { id: 'hair-blue', name: 'Ocean Blue', desc: 'Hair dyed deep blue.', cost: 500, type: 'hairColor', color: '#2a4a8a' },
    { id: 'hair-green', name: 'Forest Green', desc: 'Hair infused with nature magic.', cost: 500, type: 'hairColor', color: '#2a6a3a', reqFaction: 'fenwick', reqRep: 2 },
    { id: 'hair-purple', name: 'Void Violet', desc: 'Hair touched by the abyss.', cost: 800, type: 'hairColor', color: '#6a2a8a', reqStat: 'bossesKilled', reqStatValue: 10 },
    { id: 'hair-pink', name: 'Sakura Pink', desc: 'Delicate cherry blossom pink.', cost: 350, type: 'hairColor', color: '#d4708a' },
    { id: 'hair-black', name: 'Jet Black', desc: 'Deep raven-black hair.', cost: 150, type: 'hairColor', color: '#1a1a22' },
  ],
  skinTones: [
    { id: 'skin-pale', name: 'Pale', desc: 'Fair complexion.', cost: 150, type: 'skinTone', color: '#ffe8d0', accent: '#e0b090' },
    { id: 'skin-tan', name: 'Tan', desc: 'Sun-kissed skin.', cost: 150, type: 'skinTone', color: '#d4a878', accent: '#b08050' },
    { id: 'skin-dark', name: 'Dark', desc: 'Rich dark skin.', cost: 150, type: 'skinTone', color: '#8a6040', accent: '#6a4030' },
    { id: 'skin-olive', name: 'Olive', desc: 'Warm olive complexion.', cost: 150, type: 'skinTone', color: '#c8a870', accent: '#a08050' },
    { id: 'skin-ashen', name: 'Ashen', desc: 'Ghostly pale, marked by death.', cost: 600, type: 'skinTone', color: '#c0c0c8', accent: '#909098', reqStat: 'deaths', reqStatValue: 5 },
  ],
  armorDyes: [
    { id: 'dye-red', name: 'Crimson Armor', desc: 'Blood-red armor dye.', cost: 400, type: 'armorDye', color: '#a83232' },
    { id: 'dye-green', name: 'Emerald Armor', desc: 'Deep green armor dye.', cost: 400, type: 'armorDye', color: '#2a7a3a' },
    { id: 'dye-purple', name: 'Royal Armor', desc: 'Regal purple dye.', cost: 600, type: 'armorDye', color: '#6a3a9a' },
    { id: 'dye-black', name: 'Shadow Armor', desc: 'Dark as midnight.', cost: 500, type: 'armorDye', color: '#2a2a30', reqFaction: 'whisper', reqRep: 2 },
    { id: 'dye-gold', name: 'Golden Armor', desc: 'Gleaming golden plate.', cost: 1000, type: 'armorDye', color: '#b8962a', reqFaction: 'mira', reqRep: 3 },
    { id: 'dye-white', name: 'Holy Armor', desc: 'Pure white, blessed by light.', cost: 800, type: 'armorDye', color: '#d0d0e0' },
    { id: 'dye-frost', name: 'Frost Armor', desc: 'Ice-cold blue plate.', cost: 700, type: 'armorDye', color: '#4a8ab0', reqStat: 'battlesWon', reqStatValue: 100 },
  ],
  hats: [
    { id: 'hat-crown', name: 'Golden Crown', desc: 'A crown fit for royalty.', cost: 2000, type: 'hat', reqStat: 'bossesKilled', reqStatValue: 25 },
    { id: 'hat-hood', name: 'Rogue Hood', desc: 'A shadowy hood.', cost: 500, type: 'hat', reqFaction: 'whisper', reqRep: 1 },
    { id: 'hat-horns', name: 'Demon Horns', desc: 'Twisted horns from the depths.', cost: 1200, type: 'hat', reqStat: 'monstersKilled', reqStatValue: 500 },
    { id: 'hat-halo', name: 'Angelic Halo', desc: 'A glowing ring of light.', cost: 1500, type: 'hat', reqStat: 'totalHealing', reqStatValue: 5000 },
    { id: 'hat-helmet', name: "Knight's Helm", desc: 'A sturdy iron helmet.', cost: 600, type: 'hat', reqFaction: 'fenwick', reqRep: 1 },
    { id: 'hat-witch', name: 'Witch Hat', desc: 'A pointy wizard hat.', cost: 400, type: 'hat' },
    { id: 'hat-bandana', name: 'Pirate Bandana', desc: 'Yarr, matey!', cost: 300, type: 'hat', reqFaction: 'bartender', reqRep: 1 },
  ],
  auras: [
    { id: 'aura-fire', name: 'Flame Aura', desc: 'Wreathed in fire.', cost: 1500, type: 'aura', color: '#ff4400', reqStat: 'damageDealt', reqStatValue: 50000 },
    { id: 'aura-ice', name: 'Frost Aura', desc: 'Chilling presence.', cost: 1500, type: 'aura', color: '#44aaff', reqFaction: 'fenwick', reqRep: 3 },
    { id: 'aura-shadow', name: 'Shadow Aura', desc: 'Darkness clings to you.', cost: 2000, type: 'aura', color: '#6633aa', reqFaction: 'whisper', reqRep: 4 },
    { id: 'aura-holy', name: 'Holy Aura', desc: 'Radiant golden light.', cost: 2500, type: 'aura', color: '#ffdd44', reqStat: 'bossesKilled', reqStatValue: 50 },
    { id: 'aura-nature', name: 'Nature Aura', desc: 'Life energy flows around you.', cost: 1200, type: 'aura', color: '#44dd44', reqFaction: 'mira', reqRep: 2 },
    { id: 'aura-void', name: 'Void Aura', desc: 'The abyss gazes back.', cost: 3000, type: 'aura', color: '#aa22ff', reqStat: 'monstersKilled', reqStatValue: 1000 },
  ],
};
