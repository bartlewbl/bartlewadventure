// Tavern NPC data — reputation, quests, skills, items, buffs, factions, and shop unlocks

// ---- REPUTATION THRESHOLDS ----
export const REP_LEVELS = [
  { level: 0, label: 'Stranger',    min: 0 },
  { level: 1, label: 'Acquaintance', min: 10 },
  { level: 2, label: 'Friendly',     min: 30 },
  { level: 3, label: 'Trusted',      min: 60 },
  { level: 4, label: 'Ally',         min: 100 },
  { level: 5, label: 'Bonded',       min: 150 },
];

export function getRepLevel(rep) {
  for (let i = REP_LEVELS.length - 1; i >= 0; i--) {
    if (rep >= REP_LEVELS[i].min) return REP_LEVELS[i];
  }
  return REP_LEVELS[0];
}

// ---- REPUTATION EFFECTS ----
// When completing a quest for an NPC, other NPCs' reputation shifts
// { npcId: delta } — positive = they approve, negative = they disapprove
// These are ANTAGONISTIC — helping one faction actively hurts others
export const REP_CROSS_EFFECTS = {
  bartender: { whisper: -1, fenwick: 2, mira: 0, thorne: 2 },    // Grog's old-guard loyalty irks Whisper
  whisper:   { bartender: -2, fenwick: -3, mira: -4, thorne: -1 }, // Everyone distrusts shadow work
  fenwick:   { bartender: 2, whisper: -3, mira: 0, thorne: 2 },   // The Old Guard despises the Syndicate
  mira:      { bartender: 0, whisper: -4, fenwick: -1, thorne: -3 }, // Mira's deals undercut everyone
  thorne:    { bartender: 1, whisper: -2, fenwick: 2, mira: -2 },   // Law & order clashes with criminals
};

// ---- SHOP UNLOCKS ----
// Items unlocked at the regular shop when reputation is high enough
export const TAVERN_SHOP_UNLOCKS = {
  bartender: [
    {
      reqRep: 1,
      items: [
        { name: "Grog's Special Ale", type: 'potion', healAmount: 50, buyPrice: 60, sellPrice: 25, rarity: 'Uncommon', desc: 'A hearty brew that restores HP and warms the soul' },
      ],
    },
    {
      reqRep: 3,
      items: [
        { name: 'Ironflask Reserve', type: 'potion', healAmount: 150, buyPrice: 200, sellPrice: 80, rarity: 'Rare', desc: "Grog's finest — aged to perfection" },
      ],
    },
    {
      reqRep: 5,
      items: [
        { name: "Flagon's Legacy", type: 'potion', healAmount: 400, buyPrice: 500, sellPrice: 200, rarity: 'Epic', desc: 'A legendary brew that fully invigorates the drinker' },
      ],
    },
  ],
  whisper: [
    {
      reqRep: 1,
      items: [
        { name: 'Smoke Bomb', type: 'consumable', consumableEffect: 'escape', buyPrice: 80, sellPrice: 30, rarity: 'Uncommon', desc: 'Guarantees escape from any non-boss battle' },
      ],
    },
    {
      reqRep: 3,
      items: [
        { name: 'Shadow Cloak', type: 'gear', slot: 'cape', atk: 0, def: 8, buyPrice: 350, sellPrice: 140, rarity: 'Rare', level: 8, desc: '+4% dodge woven into the fabric' },
      ],
    },
    {
      reqRep: 5,
      items: [
        { name: "Whisper's Edge", type: 'gear', slot: 'weapon', atk: 22, def: 0, buyPrice: 800, sellPrice: 320, rarity: 'Epic', level: 15, desc: 'A blade that strikes from the shadows' },
      ],
    },
  ],
  fenwick: [
    {
      reqRep: 1,
      items: [
        { name: "Fenwick's Old Shield", type: 'gear', slot: 'shield', atk: 0, def: 6, buyPrice: 100, sellPrice: 40, rarity: 'Uncommon', level: 3, desc: 'Battered but reliable — just like its former owner' },
      ],
    },
    {
      reqRep: 3,
      items: [
        { name: 'Dragonscale Amulet', type: 'gear', slot: 'amulet', atk: 5, def: 5, buyPrice: 400, sellPrice: 160, rarity: 'Rare', level: 10, desc: 'A memento from the northern peaks' },
      ],
    },
    {
      reqRep: 5,
      items: [
        { name: 'Blade of the Old Guard', type: 'gear', slot: 'weapon', atk: 18, def: 6, buyPrice: 750, sellPrice: 300, rarity: 'Epic', level: 14, desc: "Fenwick's prized blade from his adventuring days" },
      ],
    },
  ],
  mira: [
    {
      reqRep: 1,
      items: [
        { name: "Merchant's Belt", type: 'gear', slot: 'belt', atk: 1, def: 3, buyPrice: 90, sellPrice: 35, rarity: 'Uncommon', level: 4, desc: 'Many pouches for many coins' },
      ],
    },
    {
      reqRep: 3,
      items: [
        { name: 'Ring of Fortune', type: 'gear', slot: 'accessory', atk: 3, def: 3, buyPrice: 380, sellPrice: 150, rarity: 'Rare', level: 9, desc: 'Said to bring luck to its wearer' },
      ],
    },
    {
      reqRep: 5,
      items: [
        { name: "Goldspark Crown", type: 'gear', slot: 'helmet', atk: 8, def: 10, buyPrice: 900, sellPrice: 360, rarity: 'Epic', level: 16, desc: "Mira's personal treasure — she must really trust you" },
      ],
    },
  ],
  thorne: [
    {
      reqRep: 1,
      items: [
        { name: 'Guard-Issue Boots', type: 'gear', slot: 'boots', atk: 0, def: 5, buyPrice: 110, sellPrice: 45, rarity: 'Uncommon', level: 5, desc: 'Standard issue, but well-crafted' },
      ],
    },
    {
      reqRep: 3,
      items: [
        { name: "Captain's Gauntlets", type: 'gear', slot: 'gloves', atk: 4, def: 6, buyPrice: 420, sellPrice: 170, rarity: 'Rare', level: 11, desc: 'Reinforced knuckles for those tough situations' },
      ],
    },
    {
      reqRep: 5,
      items: [
        { name: "Thorne's Bulwark", type: 'gear', slot: 'armor', atk: 4, def: 20, buyPrice: 950, sellPrice: 380, rarity: 'Epic', level: 17, desc: 'The armor of a man who never retreats' },
      ],
    },
  ],
};

// ---- NPC QUESTS ----
// Each NPC has tiered quests that grant reputation + rewards
// stat: key in state.stats to track progress, target: amount needed
export const TAVERN_QUESTS = {
  bartender: [
    {
      id: 'grog_q1', name: 'A Round on Me',
      desc: 'Earn some gold so Grog knows you can pay your tab.',
      stat: 'goldEarned', target: 200,
      repReward: 10, goldReward: 50,
      reqRep: 0, reqLevel: 1,
    },
    {
      id: 'grog_q2', name: 'Pest Control',
      desc: 'Clear out the vermin scaring off customers.',
      stat: 'monstersKilled', target: 20,
      repReward: 15, goldReward: 100,
      reqRep: 1, reqLevel: 3,
    },
    {
      id: 'grog_q3', name: 'Word of Mouth',
      desc: 'Explore more of the world and spread word of the tavern.',
      stat: 'explorationsCompleted', target: 30,
      repReward: 20, goldReward: 200,
      reqRep: 2, reqLevel: 6,
    },
    {
      id: 'grog_q4', name: 'The Big Spender',
      desc: 'Spend gold generously to prove you are a patron of means.',
      stat: 'goldSpent', target: 2000,
      repReward: 25, goldReward: 400,
      reqRep: 3, reqLevel: 10,
    },
    {
      id: 'grog_q5', name: "Ironflask's Champion",
      desc: 'Defeat powerful bosses so the tavern has a champion to boast about.',
      stat: 'bossesKilled', target: 10,
      repReward: 35, goldReward: 800,
      reqRep: 4, reqLevel: 14,
    },
    {
      id: 'grog_q6', name: "The Rat King's Crown",
      desc: "The King Rat wears a crown made from my father's old tavern sign. Kill the beast 3 times — I want that crown mounted above the bar.",
      stat: 'killed_boss-king-rat', target: 3,
      repReward: 20, goldReward: 300,
      reqRep: 2, reqLevel: 5,
    },
    {
      id: 'grog_q7', name: "Ashes of the Forge",
      desc: "The Iron Titan destroyed my father's original forge in the Ironworks. That thing took everything from us. Put it down. Bring me proof it's dead.",
      stat: 'killed_boss-iron-titan', target: 1,
      repReward: 30, goldReward: 600,
      reqRep: 3, reqLevel: 15,
    },
    {
      id: 'grog_q8', name: "Barkeep's Endurance",
      desc: "Running a tavern means taking hits — from fists, from life, from everything. Show me you can take punishment and keep standing. Absorb 5000 damage total.",
      stat: 'damageTaken', target: 5000,
      repReward: 25, goldReward: 500,
      reqRep: 3, reqLevel: 10,
    },
    {
      id: 'grog_q9', name: "The Volcanic Inheritance",
      desc: "My grandfather's original Ironflask was forged inside the volcano. The Volcanic Titan guards the chamber where the mold still sits. I need that titan dead.",
      stat: 'killed_boss-volcanic-titan', target: 1,
      repReward: 40, goldReward: 1200,
      reqRep: 4, reqLevel: 18,
    },
    {
      id: 'grog_q10', name: "Void's End — For My Brother",
      desc: "My brother went to the Midnight Terminal ten years ago and never came back. The Void Overlord took him. Kill it twice. Once for him. Once for me.",
      stat: 'killed_boss-void-overlord', target: 2,
      repReward: 50, goldReward: 2000,
      reqRep: 5, reqLevel: 20,
    },
  ],
  whisper: [
    {
      id: 'whisper_q1', name: 'Prove Your Worth',
      desc: 'Win battles to show Whisper you can handle yourself.',
      stat: 'battlesWon', target: 15,
      repReward: 10, goldReward: 60,
      reqRep: 0, reqLevel: 2,
    },
    {
      id: 'whisper_q2', name: 'Shadow Work',
      desc: 'Deal massive damage — Whisper values efficiency.',
      stat: 'damageDealt', target: 2000,
      repReward: 15, goldReward: 120,
      reqRep: 1, reqLevel: 4,
    },
    {
      id: 'whisper_q3', name: 'Silent Takedowns',
      desc: 'Score critical hits to demonstrate precision.',
      stat: 'criticalHits', target: 25,
      repReward: 20, goldReward: 250,
      reqRep: 2, reqLevel: 7,
    },
    {
      id: 'whisper_q4', name: 'The Untouchable',
      desc: 'Dodge enemy attacks to prove your agility.',
      stat: 'dodgesPerformed', target: 20,
      repReward: 25, goldReward: 450,
      reqRep: 3, reqLevel: 11,
    },
    {
      id: 'whisper_q5', name: "Whisper's Blade",
      desc: 'Win battles without ever using potions — pure skill.',
      stat: 'winsWithoutPotion', target: 15,
      repReward: 35, goldReward: 900,
      reqRep: 4, reqLevel: 15,
    },
    {
      id: 'whisper_q6', name: "Syndicate Initiation",
      desc: "The Shadow Syndicate doesn't accept amateurs. Score 50 critical hits total. I need to know your blade finds its mark every time.",
      stat: 'criticalHits', target: 50,
      repReward: 20, goldReward: 350,
      reqRep: 2, reqLevel: 7,
    },
    {
      id: 'whisper_q7', name: "The Mire Queen's Venom",
      desc: "The Mire Queen produces a venom I need for... professional purposes. Kill her. Bring me the glands. Mira used to supply me, but that bridge burned long ago.",
      stat: 'killed_boss-mire-queen', target: 1,
      repReward: 30, goldReward: 600,
      reqRep: 3, reqLevel: 12,
    },
    {
      id: 'whisper_q8', name: "Shadow Lord's Secrets",
      desc: "The Shadow Lord in the alleys has been intercepting my intelligence network. Kill him 5 times — each time he reforms, he carries new documents. I need them all.",
      stat: 'killed_boss-shadow-lord', target: 5,
      repReward: 25, goldReward: 500,
      reqRep: 3, reqLevel: 8,
    },
    {
      id: 'whisper_q9', name: "The Pressure Lord's Ledger",
      desc: "Deep in the Abyss, the Pressure Lord guards a ledger that details every smuggling route Mira has ever used. Bring it to me and I'll have leverage she can't buy her way out of.",
      stat: 'killed_boss-pressure-lord', target: 1,
      repReward: 40, goldReward: 1200,
      reqRep: 4, reqLevel: 17,
    },
    {
      id: 'whisper_q10', name: "Abyssal Proof of Loyalty",
      desc: "Kill the Abyssal Leviathan. The most dangerous creature in the known world. Do this, and you'll be the only person alive I fully trust. Don't disappoint me.",
      stat: 'killed_boss-abyssal-leviathan', target: 1,
      repReward: 50, goldReward: 2000,
      reqRep: 5, reqLevel: 20,
    },
  ],
  fenwick: [
    {
      id: 'fenwick_q1', name: "Old Man's Errand",
      desc: 'Explore the wilderness like Fenwick used to.',
      stat: 'explorationsCompleted', target: 10,
      repReward: 10, goldReward: 40,
      reqRep: 0, reqLevel: 1,
    },
    {
      id: 'fenwick_q2', name: 'Loot Collector',
      desc: 'Find items on your adventures — Fenwick loves souvenirs.',
      stat: 'itemsLooted', target: 15,
      repReward: 15, goldReward: 90,
      reqRep: 1, reqLevel: 3,
    },
    {
      id: 'fenwick_q3', name: 'Potion Master',
      desc: 'Use potions wisely in battle — a skill Fenwick always preached.',
      stat: 'potionsUsed', target: 20,
      repReward: 20, goldReward: 200,
      reqRep: 2, reqLevel: 5,
    },
    {
      id: 'fenwick_q4', name: 'Region Explorer',
      desc: 'Visit new regions and expand your horizons.',
      stat: 'regionsVisited', target: 4,
      repReward: 25, goldReward: 350,
      reqRep: 3, reqLevel: 8,
    },
    {
      id: 'fenwick_q5', name: "The Old Guard's Trial",
      desc: 'Win flawless victories — take no damage in battle.',
      stat: 'flawlessVictories', target: 5,
      repReward: 35, goldReward: 700,
      reqRep: 4, reqLevel: 12,
    },
    {
      id: 'fenwick_q6', name: "The Canyon Drake's Due",
      desc: "My old partner, Harlen, died fighting the Canyon Drake thirty years ago. I was too slow to save him. Kill the beast. Let Harlen rest.",
      stat: 'killed_boss-canyon-drake', target: 1,
      repReward: 25, goldReward: 400,
      reqRep: 2, reqLevel: 10,
    },
    {
      id: 'fenwick_q7', name: "The Frozen Expedition",
      desc: "The Frozen Emperor... my last unfinished quest. I was supposed to slay it decades ago, but my knees gave out in the snow. Finish what I started.",
      stat: 'killed_boss-frozen-emperor', target: 1,
      repReward: 35, goldReward: 800,
      reqRep: 3, reqLevel: 16,
    },
    {
      id: 'fenwick_q8', name: "Veteran's Perfection",
      desc: "In the Old Guard, we didn't just win — we won without a scratch. Achieve 10 flawless victories. That's the real standard, not the watered-down version Thorne teaches.",
      stat: 'flawlessVictories', target: 10,
      repReward: 30, goldReward: 600,
      reqRep: 3, reqLevel: 12,
    },
    {
      id: 'fenwick_q9', name: "Crystal Heart of the Caverns",
      desc: "Deep in the Crystal Caverns, the Crystal Titan guards a gemstone from the founding of the Old Guard. It was our order's heartstone. Bring it back.",
      stat: 'killed_boss-crystal-titan', target: 1,
      repReward: 40, goldReward: 1000,
      reqRep: 4, reqLevel: 16,
    },
    {
      id: 'fenwick_q10', name: "The Beast That Ended Us",
      desc: "The Abyssal Leviathan destroyed the Old Guard's final expedition. Twelve of us went in. I was the only one who crawled out. Kill it. End the nightmare that's haunted me for forty years.",
      stat: 'killed_boss-abyssal-leviathan', target: 1,
      repReward: 50, goldReward: 2000,
      reqRep: 5, reqLevel: 20,
    },
  ],
  mira: [
    {
      id: 'mira_q1', name: 'First Transaction',
      desc: 'Sell some items to show Mira you understand trade.',
      stat: 'itemsSold', target: 5,
      repReward: 10, goldReward: 50,
      reqRep: 0, reqLevel: 1,
    },
    {
      id: 'mira_q2', name: 'Bulk Buyer',
      desc: 'Buy items from shops — Mira respects a good customer.',
      stat: 'itemsBought', target: 10,
      repReward: 15, goldReward: 100,
      reqRep: 1, reqLevel: 3,
    },
    {
      id: 'mira_q3', name: 'Gold Rush',
      desc: 'Accumulate gold from monster drops.',
      stat: 'goldFromMonsters', target: 1000,
      repReward: 20, goldReward: 250,
      reqRep: 2, reqLevel: 6,
    },
    {
      id: 'mira_q4', name: 'Material Hoarder',
      desc: 'Loot items extensively to build a merchant reputation.',
      stat: 'itemsLooted', target: 50,
      repReward: 25, goldReward: 400,
      reqRep: 3, reqLevel: 9,
    },
    {
      id: 'mira_q5', name: "Goldspark's Partner",
      desc: 'Earn a massive fortune through all means necessary.',
      stat: 'goldEarned', target: 10000,
      repReward: 35, goldReward: 1000,
      reqRep: 4, reqLevel: 13,
    },
    {
      id: 'mira_q6', name: "Liquidation Sale",
      desc: "I need the market flooded with goods to crash a competitor's prices. Sell 30 items. Don't ask who the competitor is — Whisper would love to know, and that's exactly why I'm not telling.",
      stat: 'itemsSold', target: 30,
      repReward: 20, goldReward: 350,
      reqRep: 2, reqLevel: 6,
    },
    {
      id: 'mira_q7', name: "The Sandstorm King's Hoard",
      desc: "The Sandstorm King sits on a pile of ancient trade goods worth more than this entire tavern. Kill him twice — the hoard reforms each time with different treasures.",
      stat: 'killed_boss-sandstorm-king', target: 2,
      repReward: 25, goldReward: 500,
      reqRep: 3, reqLevel: 10,
    },
    {
      id: 'mira_q8', name: "Coral Fortune",
      desc: "The Coral Colossus's shell contains veins of pure crystallized gold. One kill and I can harvest enough to fund my next three trade expeditions. Thorne's been trying to seize my shipping routes — I need the capital to fight him in court.",
      stat: 'killed_boss-coral-colossus', target: 1,
      repReward: 30, goldReward: 800,
      reqRep: 3, reqLevel: 14,
    },
    {
      id: 'mira_q9', name: "Kraken's Lost Cargo",
      desc: "The Kraken Prime swallowed my finest cargo ship whole — enchanted silks, void crystals, the lot. Kill it and I can salvage what's left from its belly. That cargo is worth more than Fenwick's entire 'legacy'.",
      stat: 'killed_boss-kraken-prime', target: 1,
      repReward: 40, goldReward: 1500,
      reqRep: 4, reqLevel: 18,
    },
    {
      id: 'mira_q10', name: "The Golden Empire",
      desc: "Earn 50,000 gold total. Do that, and you're not just my partner — you're my equal. There are only two people in this world I respect: myself, and whoever can match my fortune.",
      stat: 'goldEarned', target: 50000,
      repReward: 50, goldReward: 3000,
      reqRep: 5, reqLevel: 20,
    },
  ],
  thorne: [
    {
      id: 'thorne_q1', name: 'Basic Training',
      desc: 'Kill monsters to prove your combat readiness.',
      stat: 'monstersKilled', target: 10,
      repReward: 10, goldReward: 50,
      reqRep: 0, reqLevel: 2,
    },
    {
      id: 'thorne_q2', name: 'Hold the Line',
      desc: 'Take damage in battle and survive — Thorne values resilience.',
      stat: 'damageTaken', target: 500,
      repReward: 15, goldReward: 110,
      reqRep: 1, reqLevel: 4,
    },
    {
      id: 'thorne_q3', name: 'Skill Advancement',
      desc: 'Unlock skills in your class tree to grow stronger.',
      stat: 'skillsUnlocked', target: 3,
      repReward: 20, goldReward: 220,
      reqRep: 2, reqLevel: 6,
    },
    {
      id: 'thorne_q4', name: 'Boss Hunter',
      desc: 'Hunt down and defeat bosses threatening the realm.',
      stat: 'bossesKilled', target: 5,
      repReward: 25, goldReward: 400,
      reqRep: 3, reqLevel: 10,
    },
    {
      id: 'thorne_q5', name: 'Unbreakable',
      desc: 'Win battles without ever defending — pure offense under pressure.',
      stat: 'winsWithoutDefend', target: 10,
      repReward: 35, goldReward: 850,
      reqRep: 4, reqLevel: 14,
    },
    {
      id: 'thorne_q6', name: "Storm Watch Patrol",
      desc: "The Storm Sentinel has been disrupting supply routes along the Skyline. I've lost two patrols to that thing. Kill it twice — once to stop the attacks, once to make sure it stays down.",
      stat: 'killed_boss-storm-sentinel', target: 2,
      repReward: 20, goldReward: 400,
      reqRep: 2, reqLevel: 12,
    },
    {
      id: 'thorne_q7', name: "The Conductor's Interference",
      desc: "The Conductor's spectral energy jams our communication crystals. Three kills should drain enough of its power to clear the interference permanently. Fenwick says he fought it once — I doubt it.",
      stat: 'killed_boss-conductor', target: 3,
      repReward: 25, goldReward: 500,
      reqRep: 3, reqLevel: 10,
    },
    {
      id: 'thorne_q8', name: "Plague Containment Protocol",
      desc: "The Plague Lord is spreading infection toward populated zones. This is a military-grade threat. I need someone who can kill it before Whisper tries to weaponize its spores. Yes, I know about her 'professional purposes.'",
      stat: 'killed_boss-plague-lord', target: 1,
      repReward: 35, goldReward: 800,
      reqRep: 3, reqLevel: 15,
    },
    {
      id: 'thorne_q9', name: "Iron Titan Supply Line",
      desc: "The Iron Titan has cut off our primary supply route through the Ironworks. Two kills. The first clears the path, the second sends a message. Mira's been price-gouging us for alternative routes — I won't give her the satisfaction.",
      stat: 'killed_boss-iron-titan', target: 2,
      repReward: 40, goldReward: 1200,
      reqRep: 4, reqLevel: 16,
    },
    {
      id: 'thorne_q10', name: "Void Overlord Extermination Protocol",
      desc: "Kill the Void Overlord. Twice. The Steel Legion's top brass won't act because they're cowards. Grog thinks there's a conspiracy — maybe he's right. But conspiracies don't matter if the threat is eliminated.",
      stat: 'killed_boss-void-overlord', target: 2,
      repReward: 50, goldReward: 2000,
      reqRep: 5, reqLevel: 20,
    },
  ],
};

// ---- RIVALRY QUESTS ----
// These appear on MULTIPLE NPCs. You can only complete each for ONE NPC.
// Choosing a side grants massive rep to the chosen NPC and punishes the rival(s).
// Once completed for one NPC, the quest is PERMANENTLY locked for the other(s).
export const RIVALRY_QUESTS = [
  {
    id: 'rivalry_enchanted_ore',
    name: 'The Enchanted Ore Shipment',
    desc: "A new shipment of enchanted ore has been located in the Ironworks — the same kind that tore Whisper and Mira apart years ago. Whoever controls it controls the underground economy.",
    lore: "Five years ago, Whisper and Mira ran a joint smuggling operation. Mira sold Whisper's share of an enchanted ore shipment to a rival buyer and pocketed the difference. Whisper has never forgiven her. Now a new vein has been discovered — and both want it.",
    stat: 'killed_boss-iron-titan', target: 1,
    reqLevel: 15,
    reqRep: 3,
    involvedNpcs: ['whisper', 'mira'],
    rewards: {
      whisper: { repReward: 35, goldReward: 800, repPenalties: { mira: -25, fenwick: -5 }, turnInText: "Give the ore to Whisper — let her rebuild her network." },
      mira:    { repReward: 35, goldReward: 1000, repPenalties: { whisper: -25, thorne: -5 }, turnInText: "Give the ore to Mira — let her profit and expand." },
    },
  },
  {
    id: 'rivalry_war_records',
    name: "The Old Guard's War Records",
    desc: "Frozen in the Permafrost Ruins are the Old Guard's original war records — documents that contain damning intelligence about the early Shadow Syndicate operations.",
    lore: "Fenwick's Old Guard once nearly destroyed the Shadow Syndicate. The war records contain names, safe houses, and operational details that would be devastating if released. Fenwick wants them preserved as history. Whisper wants them destroyed — or better yet, in her own hands to ensure they never surface.",
    stat: 'killed_boss-permafrost-king', target: 1,
    reqLevel: 12,
    reqRep: 2,
    involvedNpcs: ['fenwick', 'whisper'],
    rewards: {
      fenwick: { repReward: 35, goldReward: 600, repPenalties: { whisper: -25, mira: -5 }, turnInText: "Give the records to Fenwick — preserve the Old Guard's legacy." },
      whisper: { repReward: 35, goldReward: 700, repPenalties: { fenwick: -25, thorne: -5 }, turnInText: "Give the records to Whisper — let the past stay buried." },
    },
  },
  {
    id: 'rivalry_thornes_debt',
    name: "Thorne's Blood Debt",
    desc: "Hidden deep in Shadow Alley, the Shadow Lord guards evidence of a debt Thorne owes Whisper — a favor from his younger days that could end his career if it came to light.",
    lore: "Years ago, Thorne was framed for a crime he didn't commit. Whisper made the evidence disappear — but she kept copies. She's been holding this over Thorne ever since. The proof is stashed in the Shadow Lord's domain. Whoever retrieves it controls Thorne's fate.",
    stat: 'killed_boss-shadow-lord', target: 3,
    reqLevel: 8,
    reqRep: 2,
    involvedNpcs: ['thorne', 'whisper'],
    rewards: {
      thorne:  { repReward: 35, goldReward: 700, repPenalties: { whisper: -30, mira: -5 }, turnInText: "Give the evidence to Thorne — free him from Whisper's grip forever." },
      whisper: { repReward: 35, goldReward: 600, repPenalties: { thorne: -30, fenwick: -5 }, turnInText: "Return the evidence to Whisper — her leverage over Thorne remains." },
    },
  },
  {
    id: 'rivalry_dragon_testimony',
    name: "The Dragon's Testimony",
    desc: "Fenwick claims the dragon of the northern peaks spoke to him. In the Frozen Emperor's domain lies proof — dragon scales inscribed with ancient prophecy. But dragon artifacts are also worth a fortune.",
    lore: "Fenwick's dragon encounter is the defining story of his life, but nobody believes him. The inscribed scales would prove he's telling the truth. Mira, however, knows a collector who'd pay a king's ransom for authentic dragon artifacts — and she doesn't care about an old man's reputation.",
    stat: 'killed_boss-frozen-emperor', target: 1,
    reqLevel: 16,
    reqRep: 3,
    involvedNpcs: ['fenwick', 'mira'],
    rewards: {
      fenwick: { repReward: 40, goldReward: 500, repPenalties: { mira: -20, whisper: -5 }, turnInText: "Give the scales to Fenwick — let the world know the dragon was real." },
      mira:    { repReward: 40, goldReward: 1200, repPenalties: { fenwick: -25, bartender: -10 }, turnInText: "Sell the scales through Mira — Fenwick's story doesn't pay the bills." },
    },
  },
  {
    id: 'rivalry_void_conspiracy',
    name: "The Void Conspiracy",
    desc: "Evidence in the Midnight Terminal suggests someone in the Steel Legion's high command has been feeding intelligence to the Void Overlord. Grog wants it public. Thorne wants it handled quietly.",
    lore: "Grog's brother died in the Midnight Terminal on a mission that was supposed to be classified. Someone leaked the route. Grog believes the military covered it up to protect their own. Thorne knows the truth is more complicated — and that exposing it could destabilize the entire Legion.",
    stat: 'killed_boss-void-overlord', target: 1,
    reqLevel: 18,
    reqRep: 4,
    involvedNpcs: ['bartender', 'thorne'],
    rewards: {
      bartender: { repReward: 45, goldReward: 1000, repPenalties: { thorne: -30, whisper: -5 }, turnInText: "Give the evidence to Grog — let the truth come out, no matter the cost." },
      thorne:    { repReward: 45, goldReward: 800, repPenalties: { bartender: -25, fenwick: -10 }, turnInText: "Give the evidence to Thorne — let the military handle its own." },
    },
  },
  {
    id: 'rivalry_smugglers_manifest',
    name: "The Smuggler's Manifest",
    desc: "The Kraken Prime swallowed a ship carrying a manifest that details illegal weapons trafficking through the Golden Cartel. It could put Mira away for life — or make her untouchable.",
    lore: "Mira's Golden Cartel has been smuggling military-grade weapons to unknown buyers. Thorne has suspected it for years but never had proof. The manifest, trapped in the Kraken's belly, would give him everything he needs. But Mira wants it destroyed — and she's willing to pay handsomely for your silence.",
    stat: 'killed_boss-kraken-prime', target: 1,
    reqLevel: 18,
    reqRep: 4,
    involvedNpcs: ['mira', 'thorne'],
    rewards: {
      mira:   { repReward: 45, goldReward: 2000, repPenalties: { thorne: -30, fenwick: -10 }, turnInText: "Destroy the manifest for Mira — the Golden Cartel's secrets stay buried." },
      thorne: { repReward: 45, goldReward: 800, repPenalties: { mira: -30, whisper: -5 }, turnInText: "Hand the manifest to Thorne — justice will be served." },
    },
  },
];

// ---- NPC CORE DATA (dialogue + metadata) ----
export const TAVERN_NPCS = [
  {
    id: 'bartender',
    name: 'Grog Ironflask',
    role: 'Tavern Keep',
    faction: 'ironforge_covenant',
    color: '#d4956a',
    greeting: "Welcome to the Dusty Flagon! Pull up a stool. I hear everything that goes on in this town — and beyond.",
    greetingByRep: {
      1: "Good to see a familiar face! What'll it be?",
      3: "My favorite patron! I've got something special set aside for you.",
      5: "You're practically family now. The Flagon is your second home.",
    },
    topics: [
      {
        id: 'relationships',
        label: 'Tell me about the regulars',
        lines: [
          "See that hooded woman in the corner? That's Whisper. She knows things — dangerous things. Don't cross her. I tolerate her because she pays her tab, but she's poison to everyone she touches.",
          "Old Fenwick's been coming here since before I took over. My father trusted him, so I do too. He's the real deal — don't let anyone tell you otherwise.",
          "Mira over there? Sharp eye for rare goods, empty heart for people. She and Whisper destroyed each other over some enchanted ore years back. Now they both sit in MY tavern pretending the other doesn't exist.",
          "Captain Thorne stops by when he's off duty. Good man, but he owes Whisper something he won't talk about. I've seen the way she looks at him — like a cat watching a mouse.",
          "Between you and me? I don't trust Mira. She'd sell her own mother if the price was right. And Whisper... Whisper is worse. At least Mira's honest about being greedy.",
        ],
      },
      {
        id: 'backstory',
        label: 'Tell me about your family',
        lines: [
          "My father built this tavern with his bare hands. The Ironflask name means something in this town.",
          "I had a brother. Older. Stronger. He went to the Midnight Terminal on some fool's errand and never came back. The Void Overlord got him.",
          "The military said it was a 'routine mission.' Routine. My brother is dead and they call it routine. Thorne was in the Legion then — he knows more than he's saying.",
          "My grandfather was a blacksmith. The original Ironflask was forged in the volcano before the Titan claimed it. Everything we were, that thing took from us.",
          "So yeah, I pour drinks. But don't mistake me for someone who doesn't have stakes in this fight.",
        ],
      },
      {
        id: 'rumors',
        label: 'Heard any rumors?',
        lines: [
          "They say there's a hidden dungeon beneath the old ruins. Nobody who's gone in has come back... yet.",
          "A trader came through last week babbling about dragon sightings in the northern peaks. Fenwick nearly fell off his stool.",
          "The market's been volatile lately. Mira's been hoarding rare materials — driving prices up. Don't let her sweet-talk you into thinking it's natural supply and demand.",
          "Word is, Whisper's been recruiting. More agents, more informants. Whatever she's planning, it's big. And it's bad news for everyone else.",
        ],
      },
    ],
  },
  {
    id: 'whisper',
    name: 'Whisper',
    role: 'Information Broker',
    faction: 'shadow_syndicate',
    color: '#9b59b6',
    greeting: "...You want information? Everything has a price. But I'll give you a taste, since Grog seems to trust you.",
    greetingByRep: {
      1: "Back again? At least you're persistent. Let's talk.",
      3: "You've proven useful. I might have some real work for you.",
      5: "You're one of the few I trust. That's not something I say lightly.",
    },
    topics: [
      {
        id: 'relationships',
        label: 'Who are your enemies?',
        lines: [
          "Enemies? Everyone in this room, to varying degrees. Grog tolerates me because I bring him business. The moment I stop being useful, I'm out.",
          "Mira and I worked together once. She sold my share of enchanted ore to a rival buyer and smiled while doing it. She'll tell you she 'survived.' I call it betrayal.",
          "Fenwick knows more about the old world than he lets on. His senile act doesn't fool me. He has Old Guard war records that could destroy my organization — and he knows it.",
          "Captain Thorne owes me a blood debt. I saved his career once. He hates me for it, because as long as I hold that proof, he'll never be free. And I will NEVER let it go.",
          "The only person in this tavern I'd hesitate to cross is Grog — not because he's dangerous, but because good bartenders are hard to find.",
        ],
      },
      {
        id: 'backstory',
        label: 'Who are you, really?',
        lines: [
          "I am no one. That's the point. Names are liabilities in my line of work.",
          "I grew up in the Shadow Alleys. No parents. No friends. Just information and the will to use it.",
          "The Shadow Syndicate isn't a criminal organization — it's an intelligence network. The distinction matters. Criminals get caught. I don't.",
          "Mira thinks she's clever because she plays the markets. But markets run on information, and information is MY territory. Her betrayal didn't break me — it taught me never to share power.",
          "One day I'll have enough leverage over every person in this room to make them do exactly what I want. That day is closer than any of them think.",
        ],
      },
      {
        id: 'secrets',
        label: 'Tell me a secret',
        lines: [
          "The shopkeepers rotate their best stock. Visit at different times and you'll find different deals.",
          "Certain monsters only appear in specific weather. Pay attention to the sky.",
          "Your base holds more potential than you think. The deeper you upgrade, the more you unlock.",
          "There's a pattern to the extraordinary traders. Learn it, and you'll never miss a rare deal again.",
          "Here's one for free: Mira's Golden Cartel has been trafficking military weapons. Thorne suspects it but can't prove it. The manifest is somewhere in the Abyss.",
        ],
      },
    ],
  },
  {
    id: 'fenwick',
    name: 'Old Fenwick',
    role: 'Retired Adventurer',
    faction: 'old_guard_order',
    color: '#e67e22',
    greeting: "Eh? Another young adventurer! Sit down, sit down. Let old Fenwick tell you a thing or two about the world.",
    greetingByRep: {
      1: "Ah, you again! Pull up a chair, I've got more stories.",
      3: "You remind me of myself, back when I could swing a sword without my back giving out!",
      5: "You're the finest adventurer I've ever mentored. And that includes Captain Thorne!",
    },
    topics: [
      {
        id: 'relationships',
        label: 'What do you think of the others?',
        lines: [
          "I was the best swordsman in three regions! ...Or was it two? The memory's not what it used to be. But I remember my enemies just fine.",
          "Grog's father ran this tavern before him. Good man. I taught him everything. Grog turned out alright, but he's too trusting. Letting Whisper drink here is a mistake.",
          "Whisper thinks I'm a senile old fool. GOOD. Let her underestimate me. I've survived things she can't imagine because I know when to play dumb. But I have war records that would burn her little Syndicate to the ground.",
          "Mira reminds me of my old partner Harlen — always chasing the next treasure. Harlen died fighting the Canyon Drake. Mira will die chasing gold too, mark my words.",
          "Thorne was my student once. He learned discipline from me, but he forgot the most important lesson: loyalty. He serves the Legion, but the Legion serves itself.",
        ],
      },
      {
        id: 'backstory',
        label: 'Tell me about the Old Guard',
        lines: [
          "The Old Guard was the greatest adventuring order this world has ever seen. Twelve members. We answered to no one.",
          "We slew the Canyon Drake's mother. We mapped the Crystal Caverns. We pushed into the Abyss before anyone else dared.",
          "Then the Abyssal Leviathan happened. Twelve of us went in. I crawled out alone. The Old Guard died that day.",
          "The heartstone of our order — a crystal from the founding — is still down there, guarded by the Crystal Titan. It haunts me.",
          "Whisper's Syndicate rose from the ashes of our failure. Without the Old Guard keeping order, the shadows moved in. That's on me. And I'll carry it until I die.",
        ],
      },
      {
        id: 'stories',
        label: 'Tell me a story',
        lines: [
          "Did I ever tell you about the Ghost of Greyhollow? Twelve rows of teeth and a wail that'd freeze your blood!",
          "Once found a chest in a dungeon that screamed when you opened it. Still had great loot though!",
          "The dragon of the northern peaks? I've seen it. Beautiful and terrifying. It spoke to me — said the world was changing. Nobody believes me. Mira offered to 'sell the story' to a collector. As if my life's defining moment is merchandise.",
          "There used to be more quest villages. Some vanished overnight. Whisper knows why. She'll never tell.",
          "The Frozen Emperor guards the dragon scales that would prove my story. One day someone will bring them to me. And then they'll ALL have to believe.",
        ],
      },
    ],
  },
  {
    id: 'mira',
    name: 'Mira Goldspark',
    role: 'Wandering Merchant',
    faction: 'golden_cartel',
    color: '#f1c40f',
    greeting: "Ah, a fellow traveler! I've been to every corner of this land. Looking to trade stories — or something more valuable?",
    greetingByRep: {
      1: "You're getting a nose for deals. I like that.",
      3: "I don't offer discounts — but for you, I'll share my best stock.",
      5: "Partners in trade! I've never trusted anyone else with my inventory.",
    },
    topics: [
      {
        id: 'relationships',
        label: 'What about the others?',
        lines: [
          "Grog buys my surplus stock sometimes. He waters down the ale, but he's honest where it counts. One of the few people here I don't actively scheme against.",
          "Whisper and I had a falling out. She says I betrayed her — I say I made a business decision. She had the same information I did. I just acted faster. That's not betrayal, it's commerce.",
          "Old Fenwick once sold me a 'magic' sword that turned out to be a rusty heirloom. I still made a profit reselling it! He's a relic. Literally and figuratively.",
          "Captain Thorne has been trying to shut down my shipping routes for two years. He calls it 'regulation.' I call it persecution. The man can't prove anything because there's nothing to prove. Officially.",
          "Whisper keeps files on everyone. She thinks she has leverage. But leverage only works if you care about your reputation. I don't. I care about gold.",
        ],
      },
      {
        id: 'backstory',
        label: 'How did you build the Cartel?',
        lines: [
          "The Golden Cartel started with a single coin. My mother's. She gave it to me before she died and said, 'Make it multiply.' So I did.",
          "I've traded in every region on this continent. I've been robbed, betrayed, left for dead. The Kraken Prime swallowed my finest cargo ship whole. I'm still here.",
          "Whisper was my first real partner. We ran the underground markets together. Then she got greedy for POWER, not gold. There's a difference. Gold is honest. Power is a disease.",
          "Thorne seized one of my warehouses last year. 'Suspected contraband,' he said. It was silk. SILK. The man can't tell a weapon from a bedsheet.",
          "One day the Golden Cartel will own every trade route on this continent. And every person in this tavern will come to me. They'll have no choice.",
        ],
      },
      {
        id: 'trading',
        label: 'Trading tips?',
        lines: [
          "Buy low in the market, sell high at the shop. Patience is the merchant's greatest weapon.",
          "Building materials are always in demand. Stockpile them when prices dip.",
          "The featured shop rotates daily. Some days the deals are incredible — check it every day.",
          "Pet items are a niche market, but the margins are fantastic if you find the right buyer.",
          "Here's a free tip Whisper would kill for: the Sandstorm King's hoard respawns with different ancient trade goods each time. Kill him twice and you'll have enough to corner any market.",
        ],
      },
    ],
  },
  {
    id: 'thorne',
    name: 'Captain Thorne',
    role: 'Off-Duty Guard',
    faction: 'steel_legion',
    color: '#3498db',
    greeting: "At ease, adventurer. I'm off the clock. But if you've got questions about the dangers out there, I'm your man.",
    greetingByRep: {
      1: "Soldier! Good to see you taking the fight seriously.",
      3: "You've earned my respect. Not many can say that.",
      5: "I'd trust you with my life — and I don't say that to anyone outside my unit.",
    },
    topics: [
      {
        id: 'relationships',
        label: 'What do you think of the others?',
        lines: [
          "Grog and I go way back. He's saved my hide more than once with a well-timed drink and a listening ear. He's the only person here I'd call a friend without hesitation.",
          "Whisper... she saved my career once. Destroyed evidence that would have ruined me. But she kept copies. She ALWAYS keeps copies. I've been under her thumb ever since and I hate every second of it.",
          "Old Fenwick trained me. He's the reason I can fight. But he's stuck in the past, and his Old Guard methods don't work in the modern world. He thinks discipline alone wins wars. It doesn't.",
          "Mira is a smuggler. I can't prove it yet, but I know it in my gut. She supplies my off-duty squad with equipment, and half of it has serial numbers filed off. One day I'll catch her. Mark my words.",
          "Between Whisper's blackmail and Mira's smuggling, sometimes I wonder if I'm the only honest person in this tavern. Then I remember Grog waters down his ale. Nobody's clean.",
        ],
      },
      {
        id: 'backstory',
        label: 'Tell me about your service',
        lines: [
          "I joined the Steel Legion at sixteen. Youngest recruit in a decade. Fenwick wrote my recommendation letter.",
          "I rose to Captain by twenty-five. Youngest in the Legion's history. Then Whisper happened.",
          "I was framed for a crime I didn't commit. Whisper made the evidence disappear. I was grateful... until I realized the price. She's held that favor over me for years.",
          "The Void Overlord is the greatest threat this world faces, and the Legion's high command won't act. There's a conspiracy — Grog believes it too. His brother died because someone in our ranks leaked classified routes.",
          "I enforce the law because someone has to. But when the people who make the laws are corrupt, and the people who break them hold your secrets... the line between justice and survival gets very thin.",
        ],
      },
      {
        id: 'combat',
        label: 'Combat advice?',
        lines: [
          "Know your class strengths. A warrior who tries to be a mage is a dead warrior.",
          "Skills can turn the tide of any battle. Invest in them early and practice the timing.",
          "Don't neglect defense. I've seen too many adventurers go full attack and get one-shot by a boss. Fenwick taught me that — it's the one thing he got right.",
          "Pets aren't just cute companions. A well-trained pet can mean the difference between victory and defeat.",
          "The bosses in this world are no joke. The Storm Sentinel has killed two of my patrols. The Plague Lord is a military-grade biohazard. And the Void Overlord? That thing needs to die. Twice.",
        ],
      },
    ],
  },
];

// ---- FACTIONS ----
// Each tavern NPC leads a faction that specializes in different combat styles.
// Players unlock faction combat skills at high reputation, usable in battle.
export const FACTIONS = {
  bartender: {
    id: 'ironforge_covenant',
    name: 'Ironforge Covenant',
    icon: '🔥',
    color: '#e67e22',
    desc: 'Masters of flame and fortification. Their attacks burn and their shields endure.',
    specialty: 'Fire damage & damage reduction',
  },
  whisper: {
    id: 'shadow_syndicate',
    name: 'Shadow Syndicate',
    icon: '🗡️',
    color: '#9b59b6',
    desc: 'Assassins who strike from the darkness. Poison and evasion are their weapons.',
    specialty: 'Poison & evasion',
  },
  fenwick: {
    id: 'old_guard_order',
    name: 'Old Guard Order',
    icon: '🛡️',
    color: '#e67e22',
    desc: 'Veterans who blend offense with recovery. They heal as they fight.',
    specialty: 'Healing & buffs',
  },
  mira: {
    id: 'golden_cartel',
    name: 'Golden Cartel',
    icon: '✨',
    color: '#f1c40f',
    desc: 'Fortune favors the bold. Their attacks are unpredictable but devastating.',
    specialty: 'Random effects & bonus gold',
  },
  thorne: {
    id: 'steel_legion',
    name: 'Steel Legion',
    icon: '⚔️',
    color: '#3498db',
    desc: 'Disciplined soldiers who break enemy defenses with overwhelming force.',
    specialty: 'Raw damage & enemy debuffs',
  },
};

// ---- FACTION COMBAT SKILLS ----
// Learnable special attacks tied to NPC faction reputation.
// Each NPC has 2 combat skills (active, usable in battle).
// Shape mirrors tree skills: id, name, desc, manaCost, multiplier, effect, icon
export const FACTION_SKILLS = {
  bartender: [
    {
      id: 'fac_ironforge_molten_slam',
      name: 'Molten Slam',
      desc: '1.4x fire damage. Burns the enemy for 3 turns.',
      manaCost: 14,
      multiplier: 1.4,
      effect: 'faction_molten_slam',
      icon: '🔥',
      reqRep: 3,   // Trusted
    },
    {
      id: 'fac_ironforge_forge_shield',
      name: 'Forge Shield',
      desc: '0.8x damage. Gain a fire shield that reduces damage by 25% for 3 turns and reflects 15% damage.',
      manaCost: 18,
      multiplier: 0.8,
      effect: 'faction_forge_shield',
      icon: '🛡️',
      reqRep: 5,   // Bonded
    },
  ],
  whisper: [
    {
      id: 'fac_shadow_venomstrike',
      name: 'Venomstrike',
      desc: '1.3x damage. Applies deadly poison for 4 turns.',
      manaCost: 12,
      multiplier: 1.3,
      effect: 'faction_venomstrike',
      icon: '☠️',
      reqRep: 3,
    },
    {
      id: 'fac_shadow_shadowstep',
      name: 'Shadowstep',
      desc: '1.8x damage from the shadows. Dodge the next 2 attacks.',
      manaCost: 22,
      multiplier: 1.8,
      effect: 'faction_shadowstep',
      icon: '👤',
      reqRep: 5,
    },
  ],
  fenwick: [
    {
      id: 'fac_oldguard_smite',
      name: "Guardian's Smite",
      desc: '1.2x damage. Heal 30% of damage dealt.',
      manaCost: 14,
      multiplier: 1.2,
      effect: 'faction_guardian_smite',
      icon: '✝️',
      reqRep: 3,
    },
    {
      id: 'fac_oldguard_ancestral_ward',
      name: 'Ancestral Ward',
      desc: '0.6x damage. Boost ATK and DEF by 20% for 4 turns.',
      manaCost: 20,
      multiplier: 0.6,
      effect: 'faction_ancestral_ward',
      icon: '🏛️',
      reqRep: 5,
    },
  ],
  mira: [
    {
      id: 'fac_golden_gambit',
      name: "Fortune's Gambit",
      desc: '0.5x-2.5x random damage. Always drops bonus gold on kill.',
      manaCost: 15,
      multiplier: 1.0,
      effect: 'faction_fortunes_gambit',
      icon: '🎲',
      reqRep: 3,
    },
    {
      id: 'fac_golden_barrage',
      name: 'Gilded Barrage',
      desc: 'Hits 3 times at 0.7x each. Each hit has 25% chance to stun.',
      manaCost: 24,
      multiplier: 0.7,
      effect: 'faction_gilded_barrage',
      icon: '💰',
      reqRep: 5,
    },
  ],
  thorne: [
    {
      id: 'fac_steel_disciplined_strike',
      name: 'Disciplined Strike',
      desc: '1.5x damage. Reduce enemy ATK by 15% for 3 turns.',
      manaCost: 14,
      multiplier: 1.5,
      effect: 'faction_disciplined_strike',
      icon: '🗡️',
      reqRep: 3,
    },
    {
      id: 'fac_steel_commanders_charge',
      name: "Commander's Charge",
      desc: '2.0x massive damage. 40% chance to stun for 1 turn.',
      manaCost: 26,
      multiplier: 2.0,
      effect: 'faction_commanders_charge',
      icon: '⚔️',
      reqRep: 5,
    },
  ],
};

// Helper: get all faction skills a player has unlocked based on tavern reputation
export function getUnlockedFactionSkills(tavern) {
  if (!tavern) return [];
  const skills = [];
  for (const [npcId, factionSkills] of Object.entries(FACTION_SKILLS)) {
    const rep = tavern.reputation?.[npcId] || 0;
    const repLevel = getRepLevel(rep);
    for (const skill of factionSkills) {
      if (repLevel.level >= skill.reqRep && tavern.learnedFactionSkills?.includes(skill.id)) {
        skills.push({ ...skill, npcId, factionId: FACTIONS[npcId].id, factionName: FACTIONS[npcId].name, isFactionSkill: true });
      }
    }
  }
  return skills;
}
