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
export const REP_CROSS_EFFECTS = {
  bartender: { whisper: 2, fenwick: 3, mira: 1, thorne: 2 },
  whisper:   { bartender: 1, fenwick: -2, mira: -3, thorne: 1 },
  fenwick:   { bartender: 3, whisper: -1, mira: 2, thorne: 3 },
  mira:      { bartender: 1, whisper: -3, fenwick: 1, thorne: 2 },
  thorne:    { bartender: 2, whisper: 1, fenwick: 3, mira: 1 },
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
  ],
};

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
          "See that hooded woman in the corner? That's Whisper. She knows things — dangerous things. Don't cross her.",
          "Old Fenwick's been coming here since before I took over. Harmless, mostly. Just don't get him started on dragons.",
          "Mira over there is a wandering merchant. Sharp eye for rare goods. She and Whisper don't get along — some old rivalry.",
          "Captain Thorne stops by when he's off duty. Good man, but haunted by something he won't talk about.",
        ],
      },
      {
        id: 'rumors',
        label: 'Heard any rumors?',
        lines: [
          "They say there's a hidden dungeon beneath the old ruins. Nobody who's gone in has come back... yet.",
          "A trader came through last week babbling about dragon sightings in the northern peaks.",
          "The market's been volatile lately. Someone's been hoarding rare materials — driving prices up.",
          "Word is, the Arena's getting a new champion soon. Some foreigner with strange magic.",
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
        label: 'Who do you know?',
        lines: [
          "Grog thinks he runs this place. He does — but only because I let him. We have an... arrangement.",
          "Mira and I worked together once. She betrayed my trust over a shipment of enchanted ore. I don't forget.",
          "Fenwick knows more about the old world than he lets on. His 'senile old man' act doesn't fool me.",
          "Captain Thorne owes me a favor. A big one. He knows I'll collect when the time is right.",
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
        label: 'Who were you back in the day?',
        lines: [
          "I was the best swordsman in three regions! ...Or was it two? The memory's not what it used to be.",
          "Grog's father ran this tavern before him. Good man. I taught him everything he knows about adventuring.",
          "Whisper thinks I'm a fool. Let her. I've survived things she can't imagine because I know when to play dumb.",
          "Mira reminds me of my old partner — always chasing the next treasure. I hope she fares better than he did.",
        ],
      },
      {
        id: 'stories',
        label: 'Tell me a story',
        lines: [
          "Did I ever tell you about the Ghost of Greyhollow? Twelve rows of teeth and a wail that'd freeze your blood!",
          "Once found a chest in a dungeon that screamed when you opened it. Still had great loot though!",
          "The dragon of the northern peaks? I've seen it. Beautiful and terrifying. It spoke to me — said the world was changing.",
          "There used to be more quest villages. Some vanished overnight. Nobody knows why... or nobody's willing to say.",
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
        label: 'Who do you trade with?',
        lines: [
          "Grog buys my surplus stock sometimes. He waters down the ale, but he's honest where it counts.",
          "Whisper and I had a falling out. She says I betrayed her — I say I survived. There's a difference.",
          "Old Fenwick once sold me a 'magic' sword that turned out to be a rusty heirloom. I still made a profit reselling it!",
          "Captain Thorne has connections in the military supply chain. Very useful for rare equipment.",
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
        label: 'How do you know the others?',
        lines: [
          "Grog and I go way back. He's saved my hide more than once with a well-timed drink and a listening ear.",
          "Whisper... she has information I need. But dealing with her is like handling a venomous snake — carefully.",
          "Old Fenwick trained half the adventurers in this town, including me. He won't admit it, but he misses the action.",
          "Mira supplies my off-duty squad with equipment. Fair prices, but always haggle — it's what she expects.",
        ],
      },
      {
        id: 'combat',
        label: 'Combat advice?',
        lines: [
          "Know your class strengths. A warrior who tries to be a mage is a dead warrior.",
          "Skills can turn the tide of any battle. Invest in them early and practice the timing.",
          "Don't neglect defense. I've seen too many adventurers go full attack and get one-shot by a boss.",
          "Pets aren't just cute companions. A well-trained pet can mean the difference between victory and defeat.",
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
