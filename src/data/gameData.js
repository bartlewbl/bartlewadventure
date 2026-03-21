// ============================================================
// PURE GAME DATA - Constants and definitions only.
// All game logic lives in src/engine/*.js modules.
// ============================================================

// ---- LOCATIONS ----
export const LOCATIONS = [
  {
    id: 'neon-mile', name: 'Neon Mile',
    description: 'Flickering billboards and cracked asphalt full of gutter pests.',
    levelReq: 1,
    monsters: ['rat', 'slime', 'sewer-roach', 'stray-cat', 'neon-beetle', 'alley-mutt', 'junk-spider', 'rust-moth', 'grime-crawler', 'pixel-pest'],
    encounterRate: 0.5, lootRate: 0.2, bgKey: 'street',
    boss: 'boss-king-rat', bossRate: 0.005,
  },
  {
    id: 'shadow-alley', name: 'Shadow Alley',
    description: 'Tight passages where feral vagrants lurk between dumpsters.',
    levelReq: 3,
    monsters: ['rat', 'vagrant', 'slime', 'shadow-bat', 'dumpster-snake', 'gutter-goblin', 'alley-wolf', 'trash-golem', 'sewer-lurker', 'neon-phantom', 'wire-rat'],
    encounterRate: 0.55, lootRate: 0.2, bgKey: 'alley',
    boss: 'boss-shadow-lord', bossRate: 0.005,
  },
  {
    id: 'metro-underpass', name: 'Metro Underpass',
    description: 'Abandoned train tunnels dripping with mutant slime.',
    levelReq: 6,
    monsters: ['slime', 'alpha-rat', 'rogue-vagrant', 'tunnel-bat', 'rail-wraith', 'metro-snake', 'pipe-golem', 'sludge-slime', 'volt-spider', 'rust-skeleton', 'signal-ghost'],
    encounterRate: 0.6, lootRate: 0.25, bgKey: 'station',
    boss: 'boss-conductor', bossRate: 0.005,
  },
  {
    id: 'skyline-rooftops', name: 'Skyline Rooftops',
    description: 'Windy roofs patrolled by organized scavenger crews.',
    levelReq: 10,
    monsters: ['vagrant', 'rogue-vagrant', 'alpha-rat', 'sky-hawk', 'roof-stalker', 'antenna-golem', 'wind-phantom', 'drone-wasp', 'scaffold-wolf', 'neon-gargoyle', 'rooftop-sniper', 'sky-serpent'],
    encounterRate: 0.65, lootRate: 0.3, bgKey: 'rooftop',
    boss: 'boss-storm-sentinel', bossRate: 0.005,
  },
  {
    id: 'ironworks-yard', name: 'Ironworks Yard',
    description: 'Industrial lots buzzing with toxic runoff and slime.',
    levelReq: 14,
    monsters: ['toxic-slime', 'rogue-vagrant', 'alpha-rat', 'forge-elemental', 'scrap-golem', 'molten-slime', 'factory-drone', 'acid-sprayer', 'iron-wolf', 'chain-wraith', 'furnace-bat', 'steam-skeleton'],
    encounterRate: 0.7, lootRate: 0.35, bgKey: 'industrial',
    boss: 'boss-iron-titan', bossRate: 0.005,
  },
  {
    id: 'midnight-terminal', name: 'Midnight Terminal',
    description: 'Final stop where bold-face enforcers push back the grime.',
    levelReq: 18,
    monsters: ['rogue-vagrant', 'toxic-slime', 'terminal-enforcer', 'midnight-wolf', 'phantom-conductor', 'glitch-golem', 'void-slime', 'dark-assassin', 'shadow-dragon', 'neon-reaper'],
    encounterRate: 0.72, lootRate: 0.4, bgKey: 'station',
    boss: 'boss-void-overlord', bossRate: 0.005,
  },
];

// ---- MONSTERS ----
export const MONSTERS = {
  rat: {
    name: 'Gutter Rat', sprite: 'rat', baseHp: 22, baseAtk: 5, baseDef: 1,
    baseExp: 12, baseGold: 6, skills: ['bite'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'boots', weight: 8 }, { type: 'gloves', weight: 4 }, { type: 'energy-drink', weight: 5 }],
  },
  'alpha-rat': {
    name: 'Alpha Rat', sprite: 'rat', baseHp: 40, baseAtk: 10, baseDef: 3,
    baseExp: 24, baseGold: 15, skills: ['bite'],
    dropTable: [{ type: 'sword', weight: 12 }, { type: 'armor', weight: 8 }, { type: 'belt', weight: 4 }, { type: 'potion', weight: 20 }, { type: 'energy-drink', weight: 5 }],
  },
  slime: {
    name: 'Neon Slime', sprite: 'slime', baseHp: 28, baseAtk: 6, baseDef: 2,
    baseExp: 16, baseGold: 8, skills: [],
    dropTable: [{ type: 'potion', weight: 45 }, { type: 'ring', weight: 5 }, { type: 'amulet', weight: 4 }, { type: 'energy-drink', weight: 8 }],
  },
  'toxic-slime': {
    name: 'Toxic Slime', sprite: 'slime', baseHp: 45, baseAtk: 12, baseDef: 4,
    baseExp: 34, baseGold: 20, skills: ['poison'],
    dropTable: [{ type: 'armor', weight: 10 }, { type: 'ring', weight: 7 }, { type: 'cape', weight: 4 }, { type: 'potion', weight: 35 }],
  },
  vagrant: {
    name: 'Feral Vagrant', sprite: 'vagrant', baseHp: 36, baseAtk: 12, baseDef: 5,
    baseExp: 30, baseGold: 18, skills: ['slash'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'gloves', weight: 5 }, { type: 'potion', weight: 25 }, { type: 'energy-drink', weight: 6 }],
  },
  'rogue-vagrant': {
    name: 'Rogue Vagrant', sprite: 'vagrant', baseHp: 60, baseAtk: 18, baseDef: 7,
    baseExp: 48, baseGold: 28, skills: ['slash', 'steal'],
    dropTable: [{ type: 'armor', weight: 12 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 6 }, { type: 'cape', weight: 5 }, { type: 'amulet', weight: 4 }, { type: 'potion', weight: 30 }, { type: 'energy-drink', weight: 7 }],
  },
  'sewer-roach': {
    name: 'Sewer Roach', sprite: 'rat', baseHp: 18, baseAtk: 4, baseDef: 1,
    baseExp: 10, baseGold: 4, skills: ['sting', 'venom'],
    dropTable: [{ type: 'potion', weight: 40 }, { type: 'boots', weight: 5 }],
  },
  'stray-cat': {
    name: 'Stray Cat', sprite: 'rat', baseHp: 20, baseAtk: 6, baseDef: 1,
    baseExp: 11, baseGold: 5, skills: ['scratch'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'ring', weight: 6 }],
  },
  'neon-beetle': {
    name: 'Neon Beetle', sprite: 'rat', baseHp: 16, baseAtk: 3, baseDef: 3,
    baseExp: 9, baseGold: 5, skills: [],
    dropTable: [{ type: 'potion', weight: 40 }, { type: 'helmet', weight: 5 }, { type: 'energy-drink', weight: 8 }],
  },
  'alley-mutt': {
    name: 'Alley Mutt', sprite: 'wolf', baseHp: 26, baseAtk: 7, baseDef: 2,
    baseExp: 14, baseGold: 7, skills: ['bite'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'boots', weight: 8 }, { type: 'sword', weight: 5 }],
  },
  'junk-spider': {
    name: 'Junk Spider', sprite: 'rat', baseHp: 15, baseAtk: 5, baseDef: 1,
    baseExp: 10, baseGold: 4, skills: ['web', 'venom'],
    dropTable: [{ type: 'potion', weight: 40 }, { type: 'ring', weight: 4 }],
  },
  'rust-moth': {
    name: 'Rust Moth', sprite: 'bat', baseHp: 14, baseAtk: 4, baseDef: 0,
    baseExp: 8, baseGold: 3, skills: ['screech'],
    dropTable: [{ type: 'potion', weight: 45 }],
  },
  'grime-crawler': {
    name: 'Grime Crawler', sprite: 'snake', baseHp: 20, baseAtk: 5, baseDef: 2,
    baseExp: 11, baseGold: 6, skills: ['poison'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'boots', weight: 6 }],
  },
  'pixel-pest': {
    name: 'Pixel Pest', sprite: 'slime', baseHp: 12, baseAtk: 3, baseDef: 0,
    baseExp: 7, baseGold: 3, skills: [],
    dropTable: [{ type: 'potion', weight: 50 }],
  },
  'shadow-bat': {
    name: 'Shadow Bat', sprite: 'bat', baseHp: 24, baseAtk: 8, baseDef: 2,
    baseExp: 18, baseGold: 9, skills: ['screech', 'bite'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'helmet', weight: 8 }, { type: 'cape', weight: 4 }],
  },
  'dumpster-snake': {
    name: 'Dumpster Snake', sprite: 'snake', baseHp: 28, baseAtk: 9, baseDef: 3,
    baseExp: 20, baseGold: 10, skills: ['venom', 'bite'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'ring', weight: 7 }, { type: 'boots', weight: 6 }, { type: 'belt', weight: 4 }],
  },
  'gutter-goblin': {
    name: 'Gutter Goblin', sprite: 'goblin', baseHp: 30, baseAtk: 10, baseDef: 3,
    baseExp: 22, baseGold: 12, skills: ['slash', 'steal'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'helmet', weight: 7 }, { type: 'gloves', weight: 5 }, { type: 'potion', weight: 25 }, { type: 'energy-drink', weight: 6 }],
  },
  'alley-wolf': {
    name: 'Alley Wolf', sprite: 'wolf', baseHp: 32, baseAtk: 11, baseDef: 4,
    baseExp: 24, baseGold: 13, skills: ['bite', 'howl'],
    dropTable: [{ type: 'armor', weight: 7 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 25 }],
  },
  'trash-golem': {
    name: 'Trash Golem', sprite: 'golem', baseHp: 42, baseAtk: 8, baseDef: 6,
    baseExp: 26, baseGold: 14, skills: ['bash', 'stun_bash'],
    dropTable: [{ type: 'shield', weight: 10 }, { type: 'armor', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'sewer-lurker': {
    name: 'Sewer Lurker', sprite: 'snake', baseHp: 26, baseAtk: 10, baseDef: 3,
    baseExp: 19, baseGold: 11, skills: ['poison', 'confuse'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'ring', weight: 5 }],
  },
  'neon-phantom': {
    name: 'Neon Phantom', sprite: 'ghost', baseHp: 22, baseAtk: 12, baseDef: 2,
    baseExp: 21, baseGold: 10, skills: ['curse', 'drain', 'confuse'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 30 }],
  },
  'wire-rat': {
    name: 'Wire Rat', sprite: 'rat', baseHp: 25, baseAtk: 9, baseDef: 2,
    baseExp: 17, baseGold: 9, skills: ['shock', 'bite'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'ring', weight: 6 }],
  },
  'tunnel-bat': {
    name: 'Tunnel Bat', sprite: 'bat', baseHp: 32, baseAtk: 13, baseDef: 4,
    baseExp: 28, baseGold: 15, skills: ['screech', 'drain'],
    dropTable: [{ type: 'potion', weight: 25 }, { type: 'helmet', weight: 10 }],
  },
  'rail-wraith': {
    name: 'Rail Wraith', sprite: 'ghost', baseHp: 38, baseAtk: 15, baseDef: 5,
    baseExp: 34, baseGold: 18, skills: ['curse', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 22 }],
  },
  'metro-snake': {
    name: 'Metro Snake', sprite: 'snake', baseHp: 35, baseAtk: 14, baseDef: 4,
    baseExp: 30, baseGold: 16, skills: ['venom', 'slash'],
    dropTable: [{ type: 'potion', weight: 28 }, { type: 'boots', weight: 8 }, { type: 'ring', weight: 6 }],
  },
  'pipe-golem': {
    name: 'Pipe Golem', sprite: 'golem', baseHp: 55, baseAtk: 12, baseDef: 8,
    baseExp: 36, baseGold: 20, skills: ['bash', 'slam', 'stun_bash'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'belt', weight: 5 }, { type: 'potion', weight: 18 }],
  },
  'sludge-slime': {
    name: 'Sludge Slime', sprite: 'slime', baseHp: 40, baseAtk: 11, baseDef: 5,
    baseExp: 30, baseGold: 15, skills: ['poison'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'ring', weight: 6 }],
  },
  'volt-spider': {
    name: 'Volt Spider', sprite: 'rat', baseHp: 30, baseAtk: 16, baseDef: 3,
    baseExp: 32, baseGold: 17, skills: ['shock', 'web', 'venom'],
    dropTable: [{ type: 'ring', weight: 9 }, { type: 'potion', weight: 28 }],
  },
  'rust-skeleton': {
    name: 'Rust Skeleton', sprite: 'skeleton', baseHp: 42, baseAtk: 14, baseDef: 6,
    baseExp: 33, baseGold: 18, skills: ['slash', 'curse'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 22 }],
  },
  'signal-ghost': {
    name: 'Signal Ghost', sprite: 'ghost', baseHp: 34, baseAtk: 15, baseDef: 4,
    baseExp: 31, baseGold: 16, skills: ['shock', 'curse', 'mind_fog'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'helmet', weight: 7 }, { type: 'potion', weight: 25 }],
  },
  'sky-hawk': {
    name: 'Sky Hawk', sprite: 'bat', baseHp: 44, baseAtk: 20, baseDef: 6,
    baseExp: 42, baseGold: 22, skills: ['slash', 'screech'],
    dropTable: [{ type: 'helmet', weight: 10 }, { type: 'boots', weight: 9 }, { type: 'cape', weight: 6 }, { type: 'potion', weight: 22 }],
  },
  'roof-stalker': {
    name: 'Roof Stalker', sprite: 'vagrant', baseHp: 50, baseAtk: 22, baseDef: 7,
    baseExp: 46, baseGold: 25, skills: ['backstab', 'steal', 'venom'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'amulet', weight: 5 }, { type: 'gloves', weight: 5 }, { type: 'potion', weight: 20 }],
  },
  'antenna-golem': {
    name: 'Antenna Golem', sprite: 'golem', baseHp: 70, baseAtk: 16, baseDef: 10,
    baseExp: 48, baseGold: 26, skills: ['shock', 'bash', 'thunder_slam'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'belt', weight: 5 }, { type: 'gloves', weight: 5 }, { type: 'potion', weight: 16 }],
  },
  'wind-phantom': {
    name: 'Wind Phantom', sprite: 'ghost', baseHp: 40, baseAtk: 23, baseDef: 5,
    baseExp: 44, baseGold: 23, skills: ['curse', 'drain', 'hex'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'cape', weight: 6 }, { type: 'amulet', weight: 5 }, { type: 'potion', weight: 25 }],
  },
  'drone-wasp': {
    name: 'Drone Wasp', sprite: 'bat', baseHp: 38, baseAtk: 21, baseDef: 5,
    baseExp: 40, baseGold: 22, skills: ['sting', 'poison'],
    dropTable: [{ type: 'potion', weight: 28 }, { type: 'boots', weight: 8 }, { type: 'ring', weight: 6 }],
  },
  'scaffold-wolf': {
    name: 'Scaffold Wolf', sprite: 'wolf', baseHp: 52, baseAtk: 20, baseDef: 8,
    baseExp: 45, baseGold: 24, skills: ['bite', 'howl', 'charge'],
    dropTable: [{ type: 'armor', weight: 9 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 22 }],
  },
  'neon-gargoyle': {
    name: 'Neon Gargoyle', sprite: 'golem', baseHp: 58, baseAtk: 19, baseDef: 9,
    baseExp: 47, baseGold: 25, skills: ['slam', 'screech', 'concuss'],
    dropTable: [{ type: 'shield', weight: 10 }, { type: 'helmet', weight: 9 }, { type: 'potion', weight: 18 }],
  },
  'rooftop-sniper': {
    name: 'Rooftop Sniper', sprite: 'vagrant', baseHp: 42, baseAtk: 25, baseDef: 5,
    baseExp: 44, baseGold: 24, skills: ['backstab'],
    dropTable: [{ type: 'sword', weight: 12 }, { type: 'ring', weight: 7 }, { type: 'potion', weight: 20 }],
  },
  'sky-serpent': {
    name: 'Sky Serpent', sprite: 'snake', baseHp: 48, baseAtk: 21, baseDef: 7,
    baseExp: 43, baseGold: 23, skills: ['venom', 'charge'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 25 }],
  },
  'forge-elemental': {
    name: 'Forge Elemental', sprite: 'slime', baseHp: 62, baseAtk: 24, baseDef: 8,
    baseExp: 55, baseGold: 30, skills: ['firebreath', 'slam'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'gloves', weight: 6 }, { type: 'belt', weight: 4 }, { type: 'potion', weight: 20 }],
  },
  'scrap-golem': {
    name: 'Scrap Golem', sprite: 'golem', baseHp: 80, baseAtk: 20, baseDef: 12,
    baseExp: 58, baseGold: 32, skills: ['bash', 'slam', 'charge', 'petrify'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 16 }],
  },
  'molten-slime': {
    name: 'Molten Slime', sprite: 'slime', baseHp: 55, baseAtk: 22, baseDef: 7,
    baseExp: 52, baseGold: 28, skills: ['firebreath', 'poison'],
    dropTable: [{ type: 'potion', weight: 28 }, { type: 'ring', weight: 8 }, { type: 'armor', weight: 6 }],
  },
  'factory-drone': {
    name: 'Factory Drone', sprite: 'bat', baseHp: 48, baseAtk: 26, baseDef: 7,
    baseExp: 54, baseGold: 29, skills: ['shock', 'charge'],
    dropTable: [{ type: 'helmet', weight: 9 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 22 }, { type: 'energy-drink', weight: 6 }],
  },
  'acid-sprayer': {
    name: 'Acid Sprayer', sprite: 'snake', baseHp: 50, baseAtk: 23, baseDef: 6,
    baseExp: 52, baseGold: 27, skills: ['venom', 'screech', 'poison'],
    dropTable: [{ type: 'potion', weight: 25 }, { type: 'ring', weight: 8 }, { type: 'boots', weight: 7 }],
  },
  'iron-wolf': {
    name: 'Iron Wolf', sprite: 'wolf', baseHp: 65, baseAtk: 24, baseDef: 10,
    baseExp: 56, baseGold: 30, skills: ['bite', 'charge', 'howl'],
    dropTable: [{ type: 'armor', weight: 10 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'chain-wraith': {
    name: 'Chain Wraith', sprite: 'ghost', baseHp: 52, baseAtk: 25, baseDef: 7,
    baseExp: 54, baseGold: 28, skills: ['curse', 'drain', 'slash', 'deathgrip', 'psychic_wave'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'furnace-bat': {
    name: 'Furnace Bat', sprite: 'bat', baseHp: 45, baseAtk: 27, baseDef: 6,
    baseExp: 53, baseGold: 28, skills: ['firebreath', 'screech'],
    dropTable: [{ type: 'helmet', weight: 9 }, { type: 'potion', weight: 25 }],
  },
  'steam-skeleton': {
    name: 'Steam Skeleton', sprite: 'skeleton', baseHp: 58, baseAtk: 23, baseDef: 9,
    baseExp: 55, baseGold: 29, skills: ['slash', 'bash', 'curse'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 9 }, { type: 'potion', weight: 18 }],
  },
  'terminal-enforcer': {
    name: 'Terminal Enforcer', sprite: 'vagrant', baseHp: 72, baseAtk: 28, baseDef: 10,
    baseExp: 65, baseGold: 35, skills: ['slash', 'bash', 'charge', 'flash_bang'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 9 }, { type: 'gloves', weight: 5 }, { type: 'cape', weight: 4 }, { type: 'potion', weight: 18 }, { type: 'energy-drink', weight: 7 }],
  },
  'midnight-wolf': {
    name: 'Midnight Wolf', sprite: 'wolf', baseHp: 70, baseAtk: 27, baseDef: 11,
    baseExp: 63, baseGold: 34, skills: ['bite', 'howl', 'frenzy'],
    dropTable: [{ type: 'armor', weight: 10 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'phantom-conductor': {
    name: 'Phantom Conductor', sprite: 'ghost', baseHp: 60, baseAtk: 30, baseDef: 8,
    baseExp: 66, baseGold: 35, skills: ['shock', 'curse', 'drain', 'madness'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'amulet', weight: 6 }, { type: 'potion', weight: 18 }],
  },
  'glitch-golem': {
    name: 'Glitch Golem', sprite: 'golem', baseHp: 90, baseAtk: 24, baseDef: 14,
    baseExp: 68, baseGold: 36, skills: ['slam', 'shock', 'bash', 'petrify'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 15 }],
  },
  'void-slime': {
    name: 'Void Slime', sprite: 'slime', baseHp: 65, baseAtk: 26, baseDef: 9,
    baseExp: 64, baseGold: 33, skills: ['drain', 'poison', 'curse'],
    dropTable: [{ type: 'ring', weight: 9 }, { type: 'potion', weight: 25 }],
  },
  'dark-assassin': {
    name: 'Dark Assassin', sprite: 'vagrant', baseHp: 55, baseAtk: 32, baseDef: 7,
    baseExp: 67, baseGold: 36, skills: ['backstab', 'steal', 'venom'],
    dropTable: [{ type: 'sword', weight: 12 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 18 }, { type: 'energy-drink', weight: 5 }],
  },
  'shadow-dragon': {
    name: 'Shadow Dragon', sprite: 'dragon', baseHp: 85, baseAtk: 30, baseDef: 12,
    baseExp: 72, baseGold: 40, skills: ['firebreath', 'venom', 'charge'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'cape', weight: 5 }, { type: 'belt', weight: 4 }, { type: 'gloves', weight: 4 }, { type: 'amulet', weight: 4 }, { type: 'potion', weight: 15 }],
  },
  'neon-reaper': {
    name: 'Neon Reaper', sprite: 'skeleton', baseHp: 68, baseAtk: 31, baseDef: 9,
    baseExp: 70, baseGold: 38, skills: ['curse', 'drain', 'slash', 'hex'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 9 }, { type: 'potion', weight: 18 }],
  },
  // ---- FROZEN WASTES MONSTERS ----
  'frost-wolf': {
    name: 'Frost Wolf', sprite: 'wolf', baseHp: 35, baseAtk: 10, baseDef: 3,
    baseExp: 20, baseGold: 12, skills: ['bite', 'frostbite'],
    dropTable: [{ type: 'boots', weight: 8 }, { type: 'potion', weight: 30 }],
  },
  'ice-crawler': {
    name: 'Ice Crawler', sprite: 'snake', baseHp: 28, baseAtk: 8, baseDef: 4,
    baseExp: 16, baseGold: 9, skills: ['freeze'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'ring', weight: 6 }],
  },
  'snow-wraith': {
    name: 'Snow Wraith', sprite: 'ghost', baseHp: 30, baseAtk: 12, baseDef: 2,
    baseExp: 22, baseGold: 11, skills: ['frostbite', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 28 }],
  },
  'glacial-golem': {
    name: 'Glacial Golem', sprite: 'golem', baseHp: 55, baseAtk: 9, baseDef: 8,
    baseExp: 28, baseGold: 16, skills: ['bash', 'freeze', 'stun_bash'],
    dropTable: [{ type: 'shield', weight: 10 }, { type: 'armor', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'frost-spider': {
    name: 'Frost Spider', sprite: 'rat', baseHp: 24, baseAtk: 11, baseDef: 2,
    baseExp: 18, baseGold: 10, skills: ['web', 'frostbite'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'ring', weight: 5 }],
  },
  'tundra-stalker': {
    name: 'Tundra Stalker', sprite: 'vagrant', baseHp: 42, baseAtk: 14, baseDef: 5,
    baseExp: 30, baseGold: 18, skills: ['backstab', 'frostbite'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'helmet', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'ice-phantom': {
    name: 'Ice Phantom', sprite: 'ghost', baseHp: 34, baseAtk: 16, baseDef: 3,
    baseExp: 26, baseGold: 14, skills: ['blizzard', 'curse', 'mind_fog'],
    dropTable: [{ type: 'ring', weight: 9 }, { type: 'potion', weight: 25 }],
  },
  'blizzard-hawk': {
    name: 'Blizzard Hawk', sprite: 'bat', baseHp: 32, baseAtk: 15, baseDef: 4,
    baseExp: 24, baseGold: 13, skills: ['slash', 'blizzard'],
    dropTable: [{ type: 'helmet', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'crystal-beetle': {
    name: 'Crystal Beetle', sprite: 'rat', baseHp: 20, baseAtk: 6, baseDef: 6,
    baseExp: 14, baseGold: 8, skills: ['bash'],
    dropTable: [{ type: 'potion', weight: 35 }, { type: 'shield', weight: 6 }],
  },
  'permafrost-skeleton': {
    name: 'Permafrost Skeleton', sprite: 'skeleton', baseHp: 48, baseAtk: 13, baseDef: 6,
    baseExp: 32, baseGold: 17, skills: ['slash', 'freeze', 'frostbite'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'frozen-vagrant': {
    name: 'Frozen Vagrant', sprite: 'vagrant', baseHp: 50, baseAtk: 16, baseDef: 6,
    baseExp: 35, baseGold: 20, skills: ['slash', 'frostbite'],
    dropTable: [{ type: 'armor', weight: 9 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'arctic-serpent': {
    name: 'Arctic Serpent', sprite: 'snake', baseHp: 38, baseAtk: 14, baseDef: 4,
    baseExp: 28, baseGold: 15, skills: ['venom', 'blizzard'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 23 }],
  },
  // ---- SCORCHED BADLANDS MONSTERS ----
  'sand-crawler': {
    name: 'Sand Crawler', sprite: 'snake', baseHp: 38, baseAtk: 14, baseDef: 5,
    baseExp: 28, baseGold: 16, skills: ['sandblast', 'bite'],
    dropTable: [{ type: 'boots', weight: 8 }, { type: 'potion', weight: 28 }],
  },
  'ember-wolf': {
    name: 'Ember Wolf', sprite: 'wolf', baseHp: 45, baseAtk: 18, baseDef: 5,
    baseExp: 36, baseGold: 20, skills: ['bite', 'scorch'],
    dropTable: [{ type: 'armor', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'ash-golem': {
    name: 'Ash Golem', sprite: 'golem', baseHp: 68, baseAtk: 14, baseDef: 10,
    baseExp: 40, baseGold: 22, skills: ['bash', 'heatwave'],
    dropTable: [{ type: 'shield', weight: 11 }, { type: 'armor', weight: 9 }, { type: 'potion', weight: 16 }],
  },
  'lava-slime': {
    name: 'Lava Slime', sprite: 'slime', baseHp: 42, baseAtk: 16, baseDef: 4,
    baseExp: 32, baseGold: 18, skills: ['scorch', 'firebreath'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'potion', weight: 28 }],
  },
  'scorpion-drone': {
    name: 'Scorpion Drone', sprite: 'rat', baseHp: 35, baseAtk: 20, baseDef: 5,
    baseExp: 34, baseGold: 19, skills: ['sting', 'poison'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'ring', weight: 7 }],
  },
  'heat-phantom': {
    name: 'Heat Phantom', sprite: 'ghost', baseHp: 40, baseAtk: 22, baseDef: 3,
    baseExp: 38, baseGold: 21, skills: ['heatwave', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 24 }],
  },
  'magma-serpent': {
    name: 'Magma Serpent', sprite: 'snake', baseHp: 50, baseAtk: 20, baseDef: 6,
    baseExp: 42, baseGold: 24, skills: ['firebreath', 'sandblast'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'cinder-wraith': {
    name: 'Cinder Wraith', sprite: 'ghost', baseHp: 44, baseAtk: 24, baseDef: 4,
    baseExp: 44, baseGold: 25, skills: ['scorch', 'curse'],
    dropTable: [{ type: 'sword', weight: 9 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'flame-beetle': {
    name: 'Flame Beetle', sprite: 'rat', baseHp: 30, baseAtk: 12, baseDef: 7,
    baseExp: 26, baseGold: 14, skills: ['scorch'],
    dropTable: [{ type: 'potion', weight: 32 }, { type: 'helmet', weight: 6 }],
  },
  'desert-vagrant': {
    name: 'Desert Vagrant', sprite: 'vagrant', baseHp: 55, baseAtk: 22, baseDef: 7,
    baseExp: 46, baseGold: 26, skills: ['slash', 'heatwave', 'steal'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'charred-skeleton': {
    name: 'Charred Skeleton', sprite: 'skeleton', baseHp: 52, baseAtk: 21, baseDef: 7,
    baseExp: 43, baseGold: 24, skills: ['slash', 'scorch', 'bash'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 19 }],
  },
  'volcanic-bat': {
    name: 'Volcanic Bat', sprite: 'bat', baseHp: 36, baseAtk: 23, baseDef: 4,
    baseExp: 37, baseGold: 20, skills: ['firebreath', 'screech'],
    dropTable: [{ type: 'helmet', weight: 8 }, { type: 'potion', weight: 26 }],
  },
  // ---- TOXIC MARSHLANDS MONSTERS ----
  'bog-lurker': {
    name: 'Bog Lurker', sprite: 'snake', baseHp: 55, baseAtk: 20, baseDef: 7,
    baseExp: 42, baseGold: 24, skills: ['poison', 'bite'],
    dropTable: [{ type: 'boots', weight: 8 }, { type: 'potion', weight: 26 }],
  },
  'mire-snake': {
    name: 'Mire Snake', sprite: 'snake', baseHp: 48, baseAtk: 22, baseDef: 5,
    baseExp: 40, baseGold: 22, skills: ['venom', 'toxicspore'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'potion', weight: 28 }],
  },
  'fungal-zombie': {
    name: 'Fungal Zombie', sprite: 'golem', baseHp: 65, baseAtk: 18, baseDef: 9,
    baseExp: 46, baseGold: 26, skills: ['bash', 'toxicspore'],
    dropTable: [{ type: 'armor', weight: 9 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'spore-cloud': {
    name: 'Spore Cloud', sprite: 'slime', baseHp: 38, baseAtk: 15, baseDef: 3,
    baseExp: 34, baseGold: 18, skills: ['toxicspore', 'plague'],
    dropTable: [{ type: 'potion', weight: 32 }, { type: 'ring', weight: 7 }],
  },
  'marsh-wolf': {
    name: 'Marsh Wolf', sprite: 'wolf', baseHp: 58, baseAtk: 24, baseDef: 8,
    baseExp: 50, baseGold: 28, skills: ['bite', 'howl', 'poison'],
    dropTable: [{ type: 'armor', weight: 8 }, { type: 'boots', weight: 7 }, { type: 'potion', weight: 20 }],
  },
  'toxic-frog': {
    name: 'Toxic Frog', sprite: 'slime', baseHp: 42, baseAtk: 19, baseDef: 5,
    baseExp: 38, baseGold: 20, skills: ['poison', 'slash'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'boots', weight: 6 }],
  },
  'plague-rat': {
    name: 'Plague Rat', sprite: 'rat', baseHp: 35, baseAtk: 17, baseDef: 4,
    baseExp: 32, baseGold: 17, skills: ['bite', 'plague'],
    dropTable: [{ type: 'potion', weight: 34 }, { type: 'ring', weight: 5 }],
  },
  'rot-golem': {
    name: 'Rot Golem', sprite: 'golem', baseHp: 80, baseAtk: 22, baseDef: 12,
    baseExp: 55, baseGold: 32, skills: ['fungalslam', 'rotburst'],
    dropTable: [{ type: 'shield', weight: 11 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 15 }],
  },
  'swamp-wraith': {
    name: 'Swamp Wraith', sprite: 'ghost', baseHp: 50, baseAtk: 26, baseDef: 5,
    baseExp: 48, baseGold: 26, skills: ['curse', 'drain', 'toxicspore'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 22 }],
  },
  'vine-strangler': {
    name: 'Vine Strangler', sprite: 'snake', baseHp: 60, baseAtk: 21, baseDef: 8,
    baseExp: 44, baseGold: 24, skills: ['bash', 'poison', 'web'],
    dropTable: [{ type: 'armor', weight: 8 }, { type: 'sword', weight: 7 }, { type: 'potion', weight: 20 }],
  },
  'marsh-crawler': {
    name: 'Marsh Crawler', sprite: 'snake', baseHp: 45, baseAtk: 20, baseDef: 6,
    baseExp: 39, baseGold: 21, skills: ['bite', 'toxicspore'],
    dropTable: [{ type: 'boots', weight: 7 }, { type: 'potion', weight: 28 }],
  },
  'poison-bat': {
    name: 'Poison Bat', sprite: 'bat', baseHp: 40, baseAtk: 23, baseDef: 4,
    baseExp: 41, baseGold: 23, skills: ['screech', 'plague'],
    dropTable: [{ type: 'helmet', weight: 8 }, { type: 'potion', weight: 26 }],
  },
  // ---- ABYSSAL DEPTHS MONSTERS ----
  'tide-crawler': {
    name: 'Tide Crawler', sprite: 'snake', baseHp: 55, baseAtk: 22, baseDef: 8,
    baseExp: 48, baseGold: 28, skills: ['drown', 'bash'],
    dropTable: [{ type: 'armor', weight: 8 }, { type: 'potion', weight: 26 }],
  },
  'deep-angler': {
    name: 'Deep Angler', sprite: 'rat', baseHp: 48, baseAtk: 26, baseDef: 5,
    baseExp: 50, baseGold: 28, skills: ['bite', 'drain'],
    dropTable: [{ type: 'potion', weight: 28 }, { type: 'ring', weight: 8 }],
  },
  'coral-golem': {
    name: 'Coral Golem', sprite: 'golem', baseHp: 85, baseAtk: 20, baseDef: 14,
    baseExp: 56, baseGold: 32, skills: ['bash', 'slam', 'drown'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 15 }],
  },
  'pressure-wraith': {
    name: 'Pressure Wraith', sprite: 'ghost', baseHp: 52, baseAtk: 28, baseDef: 6,
    baseExp: 54, baseGold: 30, skills: ['crushingdepth', 'curse'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 22 }],
  },
  'abyssal-jellyfish': {
    name: 'Abyssal Jellyfish', sprite: 'slime', baseHp: 45, baseAtk: 20, baseDef: 4,
    baseExp: 44, baseGold: 24, skills: ['shock', 'poison'],
    dropTable: [{ type: 'potion', weight: 30 }, { type: 'ring', weight: 7 }],
  },
  'sea-serpent': {
    name: 'Sea Serpent', sprite: 'snake', baseHp: 65, baseAtk: 26, baseDef: 9,
    baseExp: 58, baseGold: 34, skills: ['tidalwave', 'venom'],
    dropTable: [{ type: 'sword', weight: 9 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'drowned-vagrant': {
    name: 'Drowned Vagrant', sprite: 'vagrant', baseHp: 60, baseAtk: 25, baseDef: 8,
    baseExp: 52, baseGold: 30, skills: ['slash', 'drown', 'steal'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'barnacle-beast': {
    name: 'Barnacle Beast', sprite: 'golem', baseHp: 75, baseAtk: 22, baseDef: 12,
    baseExp: 54, baseGold: 31, skills: ['bash', 'drown'],
    dropTable: [{ type: 'shield', weight: 10 }, { type: 'armor', weight: 9 }, { type: 'potion', weight: 17 }],
  },
  'trench-stalker': {
    name: 'Trench Stalker', sprite: 'vagrant', baseHp: 58, baseAtk: 30, baseDef: 7,
    baseExp: 58, baseGold: 34, skills: ['backstab', 'crushingdepth'],
    dropTable: [{ type: 'sword', weight: 11 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'void-fish': {
    name: 'Void Fish', sprite: 'slime', baseHp: 42, baseAtk: 24, baseDef: 5,
    baseExp: 46, baseGold: 26, skills: ['drain', 'shock'],
    dropTable: [{ type: 'ring', weight: 9 }, { type: 'potion', weight: 26 }],
  },
  'depth-phantom': {
    name: 'Depth Phantom', sprite: 'ghost', baseHp: 50, baseAtk: 30, baseDef: 6,
    baseExp: 56, baseGold: 32, skills: ['abyssalgrip', 'curse', 'drown'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'kraken-spawn': {
    name: 'Kraken Spawn', sprite: 'snake', baseHp: 70, baseAtk: 28, baseDef: 10,
    baseExp: 60, baseGold: 36, skills: ['tidalwave', 'bash', 'drown'],
    dropTable: [{ type: 'armor', weight: 10 }, { type: 'sword', weight: 9 }, { type: 'potion', weight: 16 }],
  },
  // ---- CELESTIAL HIGHLANDS MONSTERS ----
  'cloud-wisp': {
    name: 'Cloud Wisp', sprite: 'ghost', baseHp: 50, baseAtk: 26, baseDef: 5,
    baseExp: 52, baseGold: 30, skills: ['shock', 'drain'],
    dropTable: [{ type: 'ring', weight: 9 }, { type: 'potion', weight: 26 }],
  },
  'storm-hawk': {
    name: 'Storm Hawk', sprite: 'bat', baseHp: 55, baseAtk: 30, baseDef: 7,
    baseExp: 58, baseGold: 34, skills: ['slash', 'thunderclap'],
    dropTable: [{ type: 'helmet', weight: 9 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 20 }],
  },
  'solar-elemental': {
    name: 'Solar Elemental', sprite: 'slime', baseHp: 62, baseAtk: 28, baseDef: 8,
    baseExp: 56, baseGold: 32, skills: ['smite', 'firebreath'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 24 }],
  },
  'astral-golem': {
    name: 'Astral Golem', sprite: 'golem', baseHp: 95, baseAtk: 24, baseDef: 16,
    baseExp: 64, baseGold: 38, skills: ['slam', 'starfall'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 14 }],
  },
  'comet-shard': {
    name: 'Comet Shard', sprite: 'slime', baseHp: 44, baseAtk: 32, baseDef: 4,
    baseExp: 54, baseGold: 30, skills: ['starfall', 'charge'],
    dropTable: [{ type: 'sword', weight: 9 }, { type: 'potion', weight: 26 }],
  },
  'sky-wolf': {
    name: 'Sky Wolf', sprite: 'wolf', baseHp: 68, baseAtk: 28, baseDef: 10,
    baseExp: 60, baseGold: 34, skills: ['bite', 'howl', 'charge'],
    dropTable: [{ type: 'armor', weight: 9 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 19 }],
  },
  'celestial-knight': {
    name: 'Celestial Knight', sprite: 'vagrant', baseHp: 72, baseAtk: 30, baseDef: 12,
    baseExp: 66, baseGold: 38, skills: ['smite', 'slash', 'judgment'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 14 }],
  },
  'starfall-wraith': {
    name: 'Starfall Wraith', sprite: 'ghost', baseHp: 58, baseAtk: 32, baseDef: 6,
    baseExp: 62, baseGold: 36, skills: ['starfall', 'curse', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 22 }],
  },
  'thunder-drake': {
    name: 'Thunder Drake', sprite: 'dragon', baseHp: 80, baseAtk: 32, baseDef: 12,
    baseExp: 68, baseGold: 40, skills: ['thunderclap', 'charge', 'firebreath'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 9 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 14 }],
  },
  'wind-dancer': {
    name: 'Wind Dancer', sprite: 'bat', baseHp: 48, baseAtk: 30, baseDef: 6,
    baseExp: 55, baseGold: 31, skills: ['slash', 'screech', 'charge'],
    dropTable: [{ type: 'boots', weight: 9 }, { type: 'helmet', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'empyrean-sentinel': {
    name: 'Empyrean Sentinel', sprite: 'golem', baseHp: 90, baseAtk: 28, baseDef: 15,
    baseExp: 66, baseGold: 39, skills: ['smite', 'slam', 'judgment'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 12 }],
  },
  'light-phantom': {
    name: 'Light Phantom', sprite: 'ghost', baseHp: 52, baseAtk: 34, baseDef: 5,
    baseExp: 60, baseGold: 34, skills: ['holybeam', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 24 }],
  },
  // ---- VOID NEXUS MONSTERS ----
  'rift-stalker': {
    name: 'Rift Stalker', sprite: 'vagrant', baseHp: 65, baseAtk: 32, baseDef: 9,
    baseExp: 64, baseGold: 38, skills: ['voidrift', 'backstab'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'null-wraith': {
    name: 'Null Wraith', sprite: 'ghost', baseHp: 58, baseAtk: 35, baseDef: 6,
    baseExp: 66, baseGold: 38, skills: ['nullify', 'drain', 'curse'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 22 }],
  },
  'entropy-slime': {
    name: 'Entropy Slime', sprite: 'slime', baseHp: 55, baseAtk: 28, baseDef: 7,
    baseExp: 58, baseGold: 34, skills: ['entropy', 'poison'],
    dropTable: [{ type: 'ring', weight: 8 }, { type: 'potion', weight: 28 }],
  },
  'paradox-golem': {
    name: 'Paradox Golem', sprite: 'golem', baseHp: 100, baseAtk: 28, baseDef: 18,
    baseExp: 72, baseGold: 42, skills: ['slam', 'voidrift', 'bash'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 13 }],
  },
  'singularity-shade': {
    name: 'Singularity Shade', sprite: 'ghost', baseHp: 52, baseAtk: 36, baseDef: 5,
    baseExp: 68, baseGold: 40, skills: ['voidrift', 'drain', 'entropy'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'void-wolf': {
    name: 'Void Wolf', sprite: 'wolf', baseHp: 75, baseAtk: 32, baseDef: 12,
    baseExp: 68, baseGold: 40, skills: ['bite', 'howl', 'voidrift'],
    dropTable: [{ type: 'armor', weight: 10 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 17 }],
  },
  'reality-bender': {
    name: 'Reality Bender', sprite: 'ghost', baseHp: 60, baseAtk: 38, baseDef: 7,
    baseExp: 74, baseGold: 44, skills: ['oblivion', 'nullify'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 18 }],
  },
  'dimension-crawler': {
    name: 'Dimension Crawler', sprite: 'snake', baseHp: 62, baseAtk: 30, baseDef: 9,
    baseExp: 64, baseGold: 38, skills: ['voidrift', 'venom'],
    dropTable: [{ type: 'boots', weight: 8 }, { type: 'ring', weight: 7 }, { type: 'potion', weight: 22 }],
  },
  'oblivion-knight': {
    name: 'Oblivion Knight', sprite: 'vagrant', baseHp: 80, baseAtk: 34, baseDef: 14,
    baseExp: 76, baseGold: 46, skills: ['oblivion', 'slash', 'charge'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 12 }],
  },
  'chaos-phantom': {
    name: 'Chaos Phantom', sprite: 'ghost', baseHp: 56, baseAtk: 36, baseDef: 6,
    baseExp: 70, baseGold: 42, skills: ['entropy', 'curse', 'drain'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'potion', weight: 24 }],
  },
  'nexus-serpent': {
    name: 'Nexus Serpent', sprite: 'snake', baseHp: 70, baseAtk: 32, baseDef: 10,
    baseExp: 72, baseGold: 42, skills: ['venom', 'voidrift', 'charge'],
    dropTable: [{ type: 'sword', weight: 9 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 19 }],
  },
  'abyss-watcher': {
    name: 'Abyss Watcher', sprite: 'dragon', baseHp: 90, baseAtk: 36, baseDef: 14,
    baseExp: 78, baseGold: 48, skills: ['oblivion', 'firebreath', 'voidrift'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 12 }],
  },
};

// ---- BOSSES ----
export const BOSSES = {
  'boss-king-rat': {
    name: 'King Rat', sprite: 'rat', isBoss: true, baseHp: 120, baseAtk: 14, baseDef: 5, baseSpeed: 7,
    baseExp: 80, baseGold: 50, skills: ['bite', 'screech', 'frenzy', 'channel_fury'],
    dropTable: [{ type: 'sword', weight: 15 }, { type: 'armor', weight: 12 }, { type: 'ring', weight: 10 }, { type: 'potion', weight: 20 }, { type: 'energy-drink', weight: 8 }],
    title: 'Monarch of the Gutter',
  },
  'boss-shadow-lord': {
    name: 'Shadow Lord', sprite: 'vagrant', isBoss: true, baseHp: 180, baseAtk: 22, baseDef: 8, baseSpeed: 6,
    baseExp: 150, baseGold: 90, skills: ['shadowstrike', 'curse', 'drain', 'channel_fury'],
    dropTable: [{ type: 'sword', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'ring', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 18 }],
    title: 'Lord of the Dark Alleys',
  },
  'boss-conductor': {
    name: 'The Conductor', sprite: 'ghost', isBoss: true, baseHp: 250, baseAtk: 28, baseDef: 10, baseSpeed: 6,
    baseExp: 240, baseGold: 140, skills: ['shock', 'thunderclap', 'drain', 'curse', 'channel_storm'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 15 }, { type: 'energy-drink', weight: 6 }],
    title: 'Spectral Master of the Rails',
  },
  'boss-storm-sentinel': {
    name: 'Storm Sentinel', sprite: 'golem', isBoss: true, baseHp: 340, baseAtk: 34, baseDef: 14, baseSpeed: 3,
    baseExp: 350, baseGold: 200, skills: ['thunderclap', 'slam', 'charge', 'roar', 'channel_storm'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'helmet', weight: 10 }, { type: 'sword', weight: 8 }, { type: 'potion', weight: 12 }],
    title: 'Guardian of the Skyline',
  },
  'boss-iron-titan': {
    name: 'Iron Titan', sprite: 'golem', isBoss: true, baseHp: 450, baseAtk: 40, baseDef: 18, baseSpeed: 2,
    baseExp: 480, baseGold: 280, skills: ['ironcrush', 'firebreath', 'slam', 'charge', 'channel_flame'],
    dropTable: [{ type: 'armor', weight: 12 }, { type: 'sword', weight: 12 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 10 }],
    title: 'Colossus of the Ironworks',
  },
  'boss-void-overlord': {
    name: 'Void Overlord', sprite: 'dragon', isBoss: true, baseHp: 600, baseAtk: 48, baseDef: 20, baseSpeed: 5,
    baseExp: 650, baseGold: 400, skills: ['voidblast', 'inferno', 'deathgrip', 'frenzy', 'channel_void'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }, { type: 'energy-drink', weight: 6 }],
    title: 'Final Terminus Overlord',
  },
  // ---- FROZEN WASTES BOSSES ----
  'boss-frost-warden': {
    name: 'Frost Warden', sprite: 'vagrant', isBoss: true, baseHp: 140, baseAtk: 16, baseDef: 6, baseSpeed: 5,
    baseExp: 90, baseGold: 55, skills: ['frostbite', 'blizzard', 'slash', 'channel_ice'],
    dropTable: [{ type: 'sword', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'potion', weight: 18 }],
    title: 'Guardian of the Outpost',
  },
  'boss-glacier-wyrm': {
    name: 'Glacier Wyrm', sprite: 'dragon', isBoss: true, baseHp: 200, baseAtk: 22, baseDef: 9, baseSpeed: 4,
    baseExp: 160, baseGold: 95, skills: ['blizzard', 'icicle', 'charge', 'frostbite', 'channel_ice'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 16 }],
    title: 'Serpent of the Deep Ice',
  },
  'boss-permafrost-king': {
    name: 'Permafrost King', sprite: 'skeleton', isBoss: true, baseHp: 260, baseAtk: 26, baseDef: 11, baseSpeed: 3,
    baseExp: 240, baseGold: 140, skills: ['freeze', 'blizzard', 'slam', 'curse', 'channel_ice'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 14 }],
    title: 'Undead Ruler of the Ruins',
  },
  'boss-blizzard-lord': {
    name: 'Blizzard Lord', sprite: 'ghost', isBoss: true, baseHp: 320, baseAtk: 30, baseDef: 12, baseSpeed: 6,
    baseExp: 320, baseGold: 180, skills: ['blizzard', 'frostbite', 'thunderclap', 'freeze', 'channel_ice'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 12 }],
    title: 'Master of the Endless Storm',
  },
  'boss-crystal-titan': {
    name: 'Crystal Titan', sprite: 'golem', isBoss: true, baseHp: 400, baseAtk: 34, baseDef: 16, baseSpeed: 2,
    baseExp: 420, baseGold: 240, skills: ['slam', 'blizzard', 'freeze', 'charge', 'channel_ice'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 10 }],
    title: 'Colossus of the Crystal Caverns',
  },
  'boss-frozen-emperor': {
    name: 'Frozen Emperor', sprite: 'dragon', isBoss: true, baseHp: 500, baseAtk: 40, baseDef: 18, baseSpeed: 4,
    baseExp: 540, baseGold: 320, skills: ['blizzard', 'icicle', 'frostbite', 'frenzy', 'channel_ice'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Sovereign of Eternal Frost',
  },
  // ---- SCORCHED BADLANDS BOSSES ----
  'boss-sandstorm-king': {
    name: 'Sandstorm King', sprite: 'golem', isBoss: true, baseHp: 220, baseAtk: 24, baseDef: 10, baseSpeed: 3,
    baseExp: 180, baseGold: 100, skills: ['sandblast', 'heatwave', 'slam', 'channel_flame'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'sword', weight: 10 }, { type: 'potion', weight: 16 }],
    title: 'Wrath of the Dunes',
  },
  'boss-canyon-drake': {
    name: 'Canyon Drake', sprite: 'dragon', isBoss: true, baseHp: 280, baseAtk: 30, baseDef: 12, baseSpeed: 5,
    baseExp: 260, baseGold: 150, skills: ['firebreath', 'scorch', 'charge', 'sandblast', 'channel_flame'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 14 }],
    title: 'Terror of the Canyon',
  },
  'boss-magma-lord': {
    name: 'Magma Lord', sprite: 'slime', isBoss: true, baseHp: 340, baseAtk: 34, baseDef: 13, baseSpeed: 3,
    baseExp: 340, baseGold: 200, skills: ['firebreath', 'eruption', 'heatwave', 'channel_flame'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 12 }],
    title: 'Molten Heart of the Vents',
  },
  'boss-ashen-warden': {
    name: 'Ashen Warden', sprite: 'skeleton', isBoss: true, baseHp: 400, baseAtk: 38, baseDef: 14, baseSpeed: 4,
    baseExp: 420, baseGold: 240, skills: ['scorch', 'curse', 'slash', 'heatwave', 'channel_flame'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 12 }],
    title: 'Keeper of the Ashen Ruins',
  },
  'boss-inferno-beast': {
    name: 'Inferno Beast', sprite: 'dragon', isBoss: true, baseHp: 480, baseAtk: 42, baseDef: 16, baseSpeed: 5,
    baseExp: 520, baseGold: 300, skills: ['inferno', 'eruption', 'charge', 'firebreath', 'channel_flame'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Devourer of the Inferno Pit',
  },
  'boss-volcanic-titan': {
    name: 'Volcanic Titan', sprite: 'golem', isBoss: true, baseHp: 580, baseAtk: 46, baseDef: 20, baseSpeed: 2,
    baseExp: 640, baseGold: 380, skills: ['eruption', 'ironcrush', 'firebreath', 'frenzy', 'channel_flame'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Forgemaster of the Volcano',
  },
  // ---- TOXIC MARSHLANDS BOSSES ----
  'boss-bog-horror': {
    name: 'Bog Horror', sprite: 'snake', isBoss: true, baseHp: 320, baseAtk: 30, baseDef: 11, baseSpeed: 3,
    baseExp: 280, baseGold: 160, skills: ['poison', 'bash', 'toxicspore', 'channel_plague'],
    dropTable: [{ type: 'armor', weight: 12 }, { type: 'boots', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'potion', weight: 16 }],
    title: 'Nightmare of the Bog',
  },
  'boss-mire-queen': {
    name: 'Mire Queen', sprite: 'snake', isBoss: true, baseHp: 380, baseAtk: 34, baseDef: 12, baseSpeed: 4,
    baseExp: 360, baseGold: 200, skills: ['plague', 'venom', 'drain', 'toxicspore', 'channel_plague'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 14 }],
    title: 'Sovereign of the Mire',
  },
  'boss-fungal-behemoth': {
    name: 'Fungal Behemoth', sprite: 'golem', isBoss: true, baseHp: 460, baseAtk: 36, baseDef: 16, baseSpeed: 2,
    baseExp: 440, baseGold: 260, skills: ['fungalslam', 'rotburst', 'slam', 'toxicspore', 'channel_plague'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Living Mountain of Fungus',
  },
  'boss-venom-matriarch': {
    name: 'Venom Matriarch', sprite: 'snake', isBoss: true, baseHp: 520, baseAtk: 40, baseDef: 14, baseSpeed: 5,
    baseExp: 520, baseGold: 300, skills: ['rotburst', 'plague', 'venom', 'frenzy', 'channel_plague'],
    dropTable: [{ type: 'ring', weight: 10 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'boots', weight: 8 }, { type: 'potion', weight: 12 }],
    title: 'Mother of All Poisons',
  },
  'boss-plague-lord': {
    name: 'Plague Lord', sprite: 'skeleton', isBoss: true, baseHp: 580, baseAtk: 44, baseDef: 16, baseSpeed: 3,
    baseExp: 600, baseGold: 360, skills: ['plague', 'curse', 'rotburst', 'drain', 'channel_plague'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 10 }],
    title: 'Herald of the Pestilence',
  },
  'boss-rot-titan': {
    name: 'Rot Titan', sprite: 'golem', isBoss: true, baseHp: 680, baseAtk: 48, baseDef: 20, baseSpeed: 2,
    baseExp: 700, baseGold: 440, skills: ['fungalslam', 'rotburst', 'plague', 'frenzy', 'channel_plague'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Decay Incarnate',
  },
  // ---- ABYSSAL DEPTHS BOSSES ----
  'boss-tidal-warden': {
    name: 'Tidal Warden', sprite: 'golem', isBoss: true, baseHp: 400, baseAtk: 34, baseDef: 14, baseSpeed: 3,
    baseExp: 380, baseGold: 220, skills: ['tidalwave', 'bash', 'drown', 'channel_abyss'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 10 }, { type: 'sword', weight: 10 }, { type: 'potion', weight: 14 }],
    title: 'Guardian of the Tides',
  },
  'boss-sunken-king': {
    name: 'Sunken King', sprite: 'skeleton', isBoss: true, baseHp: 480, baseAtk: 40, baseDef: 16, baseSpeed: 4,
    baseExp: 480, baseGold: 280, skills: ['tidalwave', 'curse', 'drown', 'slash', 'channel_abyss'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 12 }],
    title: 'Drowned Monarch of the Bazaar',
  },
  'boss-coral-colossus': {
    name: 'Coral Colossus', sprite: 'golem', isBoss: true, baseHp: 580, baseAtk: 42, baseDef: 20, baseSpeed: 2,
    baseExp: 580, baseGold: 340, skills: ['crushingdepth', 'slam', 'tidalwave', 'charge', 'channel_abyss'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'helmet', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Living Reef Fortress',
  },
  'boss-pressure-lord': {
    name: 'Pressure Lord', sprite: 'ghost', isBoss: true, baseHp: 640, baseAtk: 46, baseDef: 16, baseSpeed: 5,
    baseExp: 660, baseGold: 400, skills: ['crushingdepth', 'abyssalgrip', 'curse', 'drain', 'channel_abyss'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Tyrant of the Deep Pressure',
  },
  'boss-kraken-prime': {
    name: 'Kraken Prime', sprite: 'dragon', isBoss: true, baseHp: 740, baseAtk: 50, baseDef: 18, baseSpeed: 4,
    baseExp: 760, baseGold: 460, skills: ['tidalwave', 'crushingdepth', 'abyssalgrip', 'frenzy', 'channel_abyss'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Ancient Terror of the Abyss',
  },
  'boss-abyssal-leviathan': {
    name: 'Abyssal Leviathan', sprite: 'dragon', isBoss: true, baseHp: 860, baseAtk: 56, baseDef: 22, baseSpeed: 3,
    baseExp: 880, baseGold: 540, skills: ['tidalwave', 'crushingdepth', 'inferno', 'frenzy', 'channel_abyss'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Primordial Devourer of the Trench',
  },
  // ---- CELESTIAL HIGHLANDS BOSSES ----
  'boss-cloud-sovereign': {
    name: 'Cloud Sovereign', sprite: 'ghost', isBoss: true, baseHp: 540, baseAtk: 42, baseDef: 14, baseSpeed: 6,
    baseExp: 520, baseGold: 300, skills: ['thunderclap', 'smite', 'drain', 'channel_light'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'helmet', weight: 10 }, { type: 'sword', weight: 10 }, { type: 'potion', weight: 14 }],
    title: 'Ruler of the Cloud Walkway',
  },
  'boss-stormspire-warden': {
    name: 'Stormspire Warden', sprite: 'golem', isBoss: true, baseHp: 640, baseAtk: 46, baseDef: 18, baseSpeed: 3,
    baseExp: 640, baseGold: 380, skills: ['thunderclap', 'slam', 'smite', 'charge', 'channel_light'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Lightning Guardian of the Tower',
  },
  'boss-solar-titan': {
    name: 'Solar Titan', sprite: 'golem', isBoss: true, baseHp: 740, baseAtk: 50, baseDef: 20, baseSpeed: 2,
    baseExp: 760, baseGold: 460, skills: ['holybeam', 'firebreath', 'slam', 'starfall', 'channel_light'],
    dropTable: [{ type: 'armor', weight: 12 }, { type: 'shield', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Burning Heart of the Solar Fields',
  },
  'boss-astral-guardian': {
    name: 'Astral Guardian', sprite: 'dragon', isBoss: true, baseHp: 820, baseAtk: 54, baseDef: 20, baseSpeed: 4,
    baseExp: 860, baseGold: 520, skills: ['starfall', 'smite', 'judgment', 'charge', 'channel_light'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Keeper of the Astral Gardens',
  },
  'boss-comet-lord': {
    name: 'Comet Lord', sprite: 'ghost', isBoss: true, baseHp: 900, baseAtk: 58, baseDef: 18, baseSpeed: 7,
    baseExp: 960, baseGold: 580, skills: ['starfall', 'holybeam', 'frenzy', 'charge', 'channel_light'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Blazing Harbinger of the Sky',
  },
  'boss-empyrean-judge': {
    name: 'Empyrean Judge', sprite: 'dragon', isBoss: true, baseHp: 1000, baseAtk: 62, baseDef: 24, baseSpeed: 5,
    baseExp: 1100, baseGold: 660, skills: ['holybeam', 'judgment', 'starfall', 'frenzy', 'channel_light'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Final Arbiter of the Heavens',
  },
  // ---- VOID NEXUS BOSSES ----
  'boss-rift-keeper': {
    name: 'Rift Keeper', sprite: 'ghost', isBoss: true, baseHp: 700, baseAtk: 50, baseDef: 16, baseSpeed: 6,
    baseExp: 700, baseGold: 420, skills: ['voidrift', 'entropy', 'drain', 'channel_void'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 12 }],
    title: 'Watcher at the Rift\'s Edge',
  },
  'boss-null-sovereign': {
    name: 'Null Sovereign', sprite: 'skeleton', isBoss: true, baseHp: 800, baseAtk: 54, baseDef: 18, baseSpeed: 4,
    baseExp: 820, baseGold: 500, skills: ['nullify', 'oblivion', 'curse', 'drain', 'channel_void'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 8 }, { type: 'potion', weight: 10 }],
    title: 'Emperor of Nothing',
  },
  'boss-entropy-lord': {
    name: 'Entropy Lord', sprite: 'ghost', isBoss: true, baseHp: 900, baseAtk: 58, baseDef: 18, baseSpeed: 5,
    baseExp: 940, baseGold: 580, skills: ['entropy', 'oblivion', 'voidrift', 'drain', 'channel_void'],
    dropTable: [{ type: 'ring', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Architect of Decay',
  },
  'boss-paradox-king': {
    name: 'Paradox King', sprite: 'golem', isBoss: true, baseHp: 1000, baseAtk: 60, baseDef: 22, baseSpeed: 2,
    baseExp: 1060, baseGold: 660, skills: ['voidrift', 'slam', 'oblivion', 'charge', 'channel_void'],
    dropTable: [{ type: 'shield', weight: 12 }, { type: 'armor', weight: 12 }, { type: 'sword', weight: 10 }, { type: 'ring', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'Lord of Contradictions',
  },
  'boss-singularity-titan': {
    name: 'Singularity Titan', sprite: 'golem', isBoss: true, baseHp: 1100, baseAtk: 64, baseDef: 24, baseSpeed: 2,
    baseExp: 1200, baseGold: 740, skills: ['oblivion', 'voidrift', 'entropy', 'frenzy', 'channel_void'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'potion', weight: 10 }],
    title: 'Gravity Well Made Flesh',
  },
  'boss-oblivion-god': {
    name: 'Oblivion God', sprite: 'dragon', isBoss: true, baseHp: 1300, baseAtk: 70, baseDef: 26, baseSpeed: 5,
    baseExp: 1400, baseGold: 900, skills: ['oblivion', 'entropy', 'voidrift', 'frenzy', 'channel_void'],
    dropTable: [{ type: 'sword', weight: 10 }, { type: 'armor', weight: 10 }, { type: 'shield', weight: 10 }, { type: 'ring', weight: 10 }, { type: 'helmet', weight: 8 }, { type: 'potion', weight: 8 }],
    title: 'End of All Things',
  },
};

// ---- REGIONS ----
export const REGIONS = [
  {
    id: 'neon-district', name: 'Neon District',
    description: 'The urban sprawl where it all began. Neon lights and gutter grime.',
    levelReq: 1, travelCost: 200, bgKey: 'neon-district',
    locations: LOCATIONS,
  },
  {
    id: 'frozen-wastes', name: 'Frozen Wastes',
    description: 'A desolate tundra of howling blizzards and ancient ice.',
    levelReq: 5, travelCost: 500, bgKey: 'frozen-wastes',
    locations: [
      { id: 'frostbite-outpost', name: 'Frostbite Outpost', description: 'An abandoned outpost encrusted in rime and ice.', levelReq: 5,
        monsters: ['frost-wolf', 'ice-crawler', 'crystal-beetle', 'frost-spider', 'snow-wraith', 'frozen-vagrant'],
        encounterRate: 0.5, lootRate: 0.2, bgKey: 'tundra', boss: 'boss-frost-warden', bossRate: 0.005 },
      { id: 'glacier-tunnels', name: 'Glacier Tunnels', description: 'Winding passages carved through translucent blue ice.', levelReq: 8,
        monsters: ['ice-crawler', 'glacial-golem', 'frost-spider', 'snow-wraith', 'crystal-beetle', 'arctic-serpent', 'permafrost-skeleton'],
        encounterRate: 0.55, lootRate: 0.22, bgKey: 'tundra', boss: 'boss-glacier-wyrm', bossRate: 0.005 },
      { id: 'permafrost-ruins', name: 'Permafrost Ruins', description: 'Crumbling ruins preserved beneath layers of eternal frost.', levelReq: 12,
        monsters: ['permafrost-skeleton', 'frozen-vagrant', 'tundra-stalker', 'ice-phantom', 'glacial-golem', 'snow-wraith', 'arctic-serpent'],
        encounterRate: 0.6, lootRate: 0.25, bgKey: 'tundra', boss: 'boss-permafrost-king', bossRate: 0.005 },
      { id: 'blizzard-peak', name: 'Blizzard Peak', description: 'The summit where the wind never stops screaming.', levelReq: 16,
        monsters: ['blizzard-hawk', 'ice-phantom', 'tundra-stalker', 'frozen-vagrant', 'permafrost-skeleton', 'frost-wolf', 'glacial-golem'],
        encounterRate: 0.65, lootRate: 0.28, bgKey: 'tundra', boss: 'boss-blizzard-lord', bossRate: 0.005 },
      { id: 'crystal-caverns', name: 'Crystal Caverns', description: 'Shimmering caves of razor-sharp crystal formations.', levelReq: 20,
        monsters: ['crystal-beetle', 'glacial-golem', 'ice-phantom', 'arctic-serpent', 'tundra-stalker', 'permafrost-skeleton', 'blizzard-hawk'],
        encounterRate: 0.68, lootRate: 0.32, bgKey: 'tundra', boss: 'boss-crystal-titan', bossRate: 0.005 },
      { id: 'frozen-citadel', name: 'Frozen Citadel', description: 'An imposing fortress of solid ice, seat of the Frozen Emperor.', levelReq: 25,
        monsters: ['frozen-vagrant', 'tundra-stalker', 'ice-phantom', 'blizzard-hawk', 'permafrost-skeleton', 'glacial-golem', 'arctic-serpent'],
        encounterRate: 0.72, lootRate: 0.35, bgKey: 'tundra', boss: 'boss-frozen-emperor', bossRate: 0.005 },
    ],
  },
  {
    id: 'arena', name: 'The Arena',
    description: 'A lawless fighting pit where warriors wager gold and test their mettle.',
    levelReq: 5, travelCost: 0, bgKey: 'street',
    isArena: true,
    locations: [],
  },
  {
    id: 'scorched-badlands', name: 'Scorched Badlands',
    description: 'Sun-blasted deserts and volcanic wastelands of searing heat.',
    levelReq: 10, travelCost: 1000, bgKey: 'scorched-badlands',
    locations: [
      { id: 'ember-flats', name: 'Ember Flats', description: 'Cracked earth radiates heat from smoldering coal seams below.', levelReq: 10,
        monsters: ['sand-crawler', 'flame-beetle', 'ember-wolf', 'lava-slime', 'scorpion-drone', 'volcanic-bat'],
        encounterRate: 0.52, lootRate: 0.22, bgKey: 'desert', boss: 'boss-sandstorm-king', bossRate: 0.005 },
      { id: 'sunscorch-canyon', name: 'Sunscorch Canyon', description: 'Narrow gorges where the sun bakes everything to ash.', levelReq: 14,
        monsters: ['sand-crawler', 'ember-wolf', 'scorpion-drone', 'heat-phantom', 'charred-skeleton', 'volcanic-bat', 'desert-vagrant'],
        encounterRate: 0.57, lootRate: 0.24, bgKey: 'desert', boss: 'boss-canyon-drake', bossRate: 0.005 },
      { id: 'magma-vents', name: 'Magma Vents', description: 'Geysers of molten rock erupt without warning from the ground.', levelReq: 18,
        monsters: ['lava-slime', 'ash-golem', 'magma-serpent', 'heat-phantom', 'cinder-wraith', 'ember-wolf', 'charred-skeleton'],
        encounterRate: 0.62, lootRate: 0.27, bgKey: 'desert', boss: 'boss-magma-lord', bossRate: 0.005 },
      { id: 'ashen-ruins', name: 'Ashen Ruins', description: 'Civilization swallowed by volcanic eruptions centuries ago.', levelReq: 22,
        monsters: ['charred-skeleton', 'ash-golem', 'cinder-wraith', 'desert-vagrant', 'magma-serpent', 'heat-phantom', 'scorpion-drone'],
        encounterRate: 0.66, lootRate: 0.3, bgKey: 'desert', boss: 'boss-ashen-warden', bossRate: 0.005 },
      { id: 'inferno-pit', name: 'Inferno Pit', description: 'A gaping chasm where fire never ceases to burn.', levelReq: 26,
        monsters: ['lava-slime', 'cinder-wraith', 'magma-serpent', 'ash-golem', 'heat-phantom', 'desert-vagrant', 'volcanic-bat'],
        encounterRate: 0.7, lootRate: 0.33, bgKey: 'desert', boss: 'boss-inferno-beast', bossRate: 0.005 },
      { id: 'volcanic-forge', name: 'Volcanic Forge', description: 'An ancient forge built into the heart of an active volcano.', levelReq: 30,
        monsters: ['ash-golem', 'lava-slime', 'cinder-wraith', 'magma-serpent', 'desert-vagrant', 'charred-skeleton', 'heat-phantom'],
        encounterRate: 0.72, lootRate: 0.36, bgKey: 'desert', boss: 'boss-volcanic-titan', bossRate: 0.005 },
    ],
  },
  {
    id: 'toxic-marshlands', name: 'Toxic Marshlands',
    description: 'Festering swamps choked with poisonous spores and rotting growth.',
    levelReq: 18, travelCost: 2500, bgKey: 'toxic-marshlands',
    locations: [
      { id: 'bogs-edge', name: 'Bog\'s Edge', description: 'Where solid ground ends and treacherous muck begins.', levelReq: 18,
        monsters: ['bog-lurker', 'plague-rat', 'toxic-frog', 'mire-snake', 'marsh-crawler', 'poison-bat'],
        encounterRate: 0.55, lootRate: 0.22, bgKey: 'swamp', boss: 'boss-bog-horror', bossRate: 0.005 },
      { id: 'mire-depths', name: 'Mire Depths', description: 'The deeper marshes where the water turns black.', levelReq: 22,
        monsters: ['mire-snake', 'bog-lurker', 'spore-cloud', 'toxic-frog', 'marsh-wolf', 'poison-bat', 'swamp-wraith'],
        encounterRate: 0.6, lootRate: 0.25, bgKey: 'swamp', boss: 'boss-mire-queen', bossRate: 0.005 },
      { id: 'fungal-hollow', name: 'Fungal Hollow', description: 'A cave system overrun by massive bioluminescent fungi.', levelReq: 26,
        monsters: ['fungal-zombie', 'spore-cloud', 'marsh-crawler', 'rot-golem', 'vine-strangler', 'poison-bat', 'swamp-wraith'],
        encounterRate: 0.63, lootRate: 0.28, bgKey: 'swamp', boss: 'boss-fungal-behemoth', bossRate: 0.005 },
      { id: 'venomous-thicket', name: 'Venomous Thicket', description: 'Dense vegetation that drips with corrosive sap.', levelReq: 30,
        monsters: ['vine-strangler', 'marsh-wolf', 'mire-snake', 'toxic-frog', 'swamp-wraith', 'rot-golem', 'bog-lurker'],
        encounterRate: 0.67, lootRate: 0.3, bgKey: 'swamp', boss: 'boss-venom-matriarch', bossRate: 0.005 },
      { id: 'plague-ponds', name: 'Plague Ponds', description: 'Stagnant pools seething with viral contagion.', levelReq: 34,
        monsters: ['plague-rat', 'swamp-wraith', 'rot-golem', 'fungal-zombie', 'spore-cloud', 'marsh-wolf', 'vine-strangler'],
        encounterRate: 0.7, lootRate: 0.33, bgKey: 'swamp', boss: 'boss-plague-lord', bossRate: 0.005 },
      { id: 'rot-core', name: 'Rot Core', description: 'The pulsating heart of the marshland\'s corruption.', levelReq: 38,
        monsters: ['rot-golem', 'fungal-zombie', 'swamp-wraith', 'vine-strangler', 'marsh-wolf', 'poison-bat', 'spore-cloud'],
        encounterRate: 0.72, lootRate: 0.36, bgKey: 'swamp', boss: 'boss-rot-titan', bossRate: 0.005 },
    ],
  },
  {
    id: 'abyssal-depths', name: 'Abyssal Depths',
    description: 'Sunken ruins and ocean trenches teeming with deep-sea horrors.',
    levelReq: 25, travelCost: 5000, bgKey: 'abyssal-depths',
    locations: [
      { id: 'tidal-caves', name: 'Tidal Caves', description: 'Sea caves flooded by the relentless tide.', levelReq: 25,
        monsters: ['tide-crawler', 'deep-angler', 'abyssal-jellyfish', 'barnacle-beast', 'void-fish', 'drowned-vagrant'],
        encounterRate: 0.58, lootRate: 0.25, bgKey: 'ocean', boss: 'boss-tidal-warden', bossRate: 0.005 },
      { id: 'sunken-bazaar', name: 'Sunken Bazaar', description: 'A once-thriving marketplace now drowned beneath the waves.', levelReq: 30,
        monsters: ['drowned-vagrant', 'tide-crawler', 'sea-serpent', 'coral-golem', 'abyssal-jellyfish', 'deep-angler', 'barnacle-beast'],
        encounterRate: 0.62, lootRate: 0.28, bgKey: 'ocean', boss: 'boss-sunken-king', bossRate: 0.005 },
      { id: 'coral-labyrinth', name: 'Coral Labyrinth', description: 'A twisting maze of living coral that reshapes itself.', levelReq: 35,
        monsters: ['coral-golem', 'sea-serpent', 'pressure-wraith', 'barnacle-beast', 'trench-stalker', 'void-fish', 'abyssal-jellyfish'],
        encounterRate: 0.65, lootRate: 0.3, bgKey: 'ocean', boss: 'boss-coral-colossus', bossRate: 0.005 },
      { id: 'pressure-rift', name: 'Pressure Rift', description: 'A crack in the ocean floor where crushing pressure warps reality.', levelReq: 38,
        monsters: ['pressure-wraith', 'depth-phantom', 'trench-stalker', 'coral-golem', 'sea-serpent', 'void-fish', 'kraken-spawn'],
        encounterRate: 0.68, lootRate: 0.32, bgKey: 'ocean', boss: 'boss-pressure-lord', bossRate: 0.005 },
      { id: 'krakens-rest', name: 'Kraken\'s Rest', description: 'The lair of something ancient and impossibly large.', levelReq: 42,
        monsters: ['kraken-spawn', 'trench-stalker', 'depth-phantom', 'pressure-wraith', 'sea-serpent', 'drowned-vagrant', 'coral-golem'],
        encounterRate: 0.7, lootRate: 0.35, bgKey: 'ocean', boss: 'boss-kraken-prime', bossRate: 0.005 },
      { id: 'abyssal-trench', name: 'Abyssal Trench', description: 'The deepest point of the ocean where light never reaches.', levelReq: 48,
        monsters: ['depth-phantom', 'kraken-spawn', 'pressure-wraith', 'trench-stalker', 'sea-serpent', 'void-fish', 'coral-golem'],
        encounterRate: 0.72, lootRate: 0.38, bgKey: 'ocean', boss: 'boss-abyssal-leviathan', bossRate: 0.005 },
    ],
  },
  {
    id: 'celestial-highlands', name: 'Celestial Highlands',
    description: 'Floating islands bathed in starlight and guarded by divine constructs.',
    levelReq: 35, travelCost: 10000, bgKey: 'celestial-highlands',
    locations: [
      { id: 'cloud-walkway', name: 'Cloud Walkway', description: 'Bridges of solidified cloud stretching between floating isles.', levelReq: 35,
        monsters: ['cloud-wisp', 'wind-dancer', 'storm-hawk', 'sky-wolf', 'solar-elemental', 'celestial-knight'],
        encounterRate: 0.6, lootRate: 0.28, bgKey: 'celestial', boss: 'boss-cloud-sovereign', bossRate: 0.005 },
      { id: 'stormspire-tower', name: 'Stormspire Tower', description: 'A tower that pierces the storm clouds themselves.', levelReq: 39,
        monsters: ['storm-hawk', 'empyrean-sentinel', 'cloud-wisp', 'thunder-drake', 'celestial-knight', 'starfall-wraith', 'wind-dancer'],
        encounterRate: 0.63, lootRate: 0.3, bgKey: 'celestial', boss: 'boss-stormspire-warden', bossRate: 0.005 },
      { id: 'solar-fields', name: 'Solar Fields', description: 'Vast plains of golden light where the sun never sets.', levelReq: 43,
        monsters: ['solar-elemental', 'light-phantom', 'astral-golem', 'comet-shard', 'celestial-knight', 'sky-wolf', 'storm-hawk'],
        encounterRate: 0.66, lootRate: 0.32, bgKey: 'celestial', boss: 'boss-solar-titan', bossRate: 0.005 },
      { id: 'astral-gardens', name: 'Astral Gardens', description: 'Impossible gardens growing in the void between stars.', levelReq: 47,
        monsters: ['astral-golem', 'starfall-wraith', 'celestial-knight', 'light-phantom', 'empyrean-sentinel', 'cloud-wisp', 'thunder-drake'],
        encounterRate: 0.68, lootRate: 0.34, bgKey: 'celestial', boss: 'boss-astral-guardian', bossRate: 0.005 },
      { id: 'comets-trail', name: 'Comet\'s Trail', description: 'A glowing path left by a comet that circles eternally.', levelReq: 51,
        monsters: ['comet-shard', 'starfall-wraith', 'light-phantom', 'thunder-drake', 'empyrean-sentinel', 'astral-golem', 'sky-wolf'],
        encounterRate: 0.7, lootRate: 0.36, bgKey: 'celestial', boss: 'boss-comet-lord', bossRate: 0.005 },
      { id: 'empyrean-gate', name: 'Empyrean Gate', description: 'The final gateway to the realm beyond the sky.', levelReq: 55,
        monsters: ['empyrean-sentinel', 'celestial-knight', 'thunder-drake', 'astral-golem', 'light-phantom', 'starfall-wraith', 'comet-shard'],
        encounterRate: 0.72, lootRate: 0.38, bgKey: 'celestial', boss: 'boss-empyrean-judge', bossRate: 0.005 },
    ],
  },
  {
    id: 'void-nexus', name: 'Void Nexus',
    description: 'The edge of existence where reality unravels into nothingness.',
    levelReq: 45, travelCost: 25000, bgKey: 'void-nexus',
    locations: [
      { id: 'rifts-edge', name: 'Rift\'s Edge', description: 'Where the fabric of reality begins to fray and tear.', levelReq: 45,
        monsters: ['rift-stalker', 'null-wraith', 'entropy-slime', 'void-wolf', 'dimension-crawler', 'chaos-phantom'],
        encounterRate: 0.62, lootRate: 0.3, bgKey: 'void', boss: 'boss-rift-keeper', bossRate: 0.005 },
      { id: 'null-chamber', name: 'Null Chamber', description: 'A vast chamber where all sensation ceases to exist.', levelReq: 49,
        monsters: ['null-wraith', 'paradox-golem', 'rift-stalker', 'singularity-shade', 'chaos-phantom', 'entropy-slime', 'void-wolf'],
        encounterRate: 0.65, lootRate: 0.32, bgKey: 'void', boss: 'boss-null-sovereign', bossRate: 0.005 },
      { id: 'entropy-garden', name: 'Entropy Garden', description: 'A mockery of life where everything decays in reverse.', levelReq: 53,
        monsters: ['entropy-slime', 'reality-bender', 'dimension-crawler', 'null-wraith', 'oblivion-knight', 'chaos-phantom', 'void-wolf'],
        encounterRate: 0.67, lootRate: 0.34, bgKey: 'void', boss: 'boss-entropy-lord', bossRate: 0.005 },
      { id: 'paradox-maze', name: 'Paradox Maze', description: 'A labyrinth where the path forward leads backward.', levelReq: 57,
        monsters: ['paradox-golem', 'reality-bender', 'oblivion-knight', 'singularity-shade', 'nexus-serpent', 'rift-stalker', 'abyss-watcher'],
        encounterRate: 0.7, lootRate: 0.36, bgKey: 'void', boss: 'boss-paradox-king', bossRate: 0.005 },
      { id: 'singularity-well', name: 'Singularity Well', description: 'A point of infinite density that devours all light.', levelReq: 61,
        monsters: ['singularity-shade', 'abyss-watcher', 'oblivion-knight', 'reality-bender', 'nexus-serpent', 'paradox-golem', 'chaos-phantom'],
        encounterRate: 0.72, lootRate: 0.38, bgKey: 'void', boss: 'boss-singularity-titan', bossRate: 0.005 },
      { id: 'oblivion-throne', name: 'Oblivion Throne', description: 'The seat of ultimate destruction at the end of all things.', levelReq: 65,
        monsters: ['oblivion-knight', 'abyss-watcher', 'reality-bender', 'singularity-shade', 'nexus-serpent', 'paradox-golem', 'null-wraith'],
        encounterRate: 0.75, lootRate: 0.4, bgKey: 'void', boss: 'boss-oblivion-god', bossRate: 0.005 },
    ],
  },
];

// ---- SPECIAL LOCATIONS (per region) ----
// Special locations have higher encounter rates, rarer loot, and random-level encounters
// where monster levels vary within a range rather than being fixed.
export const SPECIAL_LOCATIONS = {
  'neon-district': [
    {
      id: 'glitch-zone', name: 'Glitch Zone', description: 'A pocket of corrupted reality where digital ghosts flicker in and out.',
      levelReq: 8, special: true,
      monsters: ['neon-phantom', 'glitch-golem', 'void-slime', 'pixel-pest', 'wire-rat', 'signal-ghost'],
      encounterRate: 0.8, lootRate: 0.5, bgKey: 'street',
      boss: 'boss-void-overlord', bossRate: 0.012,
      levelRange: [-3, 5], rareLootBonus: 1.5,
    },
    {
      id: 'syndicate-vault', name: 'Syndicate Vault', description: 'A hidden underground vault guarded by the city\'s deadliest enforcers.',
      levelReq: 14, special: true,
      monsters: ['dark-assassin', 'neon-reaper', 'shadow-dragon', 'terminal-enforcer', 'midnight-wolf'],
      encounterRate: 0.85, lootRate: 0.55, bgKey: 'alley',
      boss: 'boss-shadow-lord', bossRate: 0.015,
      levelRange: [-2, 8], rareLootBonus: 2.0,
    },
  ],
  'frozen-wastes': [
    {
      id: 'avalanche-pass', name: 'Avalanche Pass', description: 'A treacherous mountain path where the snow itself is the enemy.',
      levelReq: 12, special: true,
      monsters: ['blizzard-hawk', 'ice-phantom', 'frost-wolf', 'glacial-golem', 'arctic-serpent', 'snow-wraith'],
      encounterRate: 0.82, lootRate: 0.5, bgKey: 'tundra',
      boss: 'boss-blizzard-lord', bossRate: 0.012,
      levelRange: [-3, 6], rareLootBonus: 1.5,
    },
    {
      id: 'frost-dragon-lair', name: 'Frost Dragon Lair', description: 'An ancient cavern encrusted with gems and dragon bones.',
      levelReq: 20, special: true,
      monsters: ['crystal-beetle', 'glacial-golem', 'ice-phantom', 'tundra-stalker', 'blizzard-hawk', 'permafrost-skeleton'],
      encounterRate: 0.88, lootRate: 0.55, bgKey: 'tundra',
      boss: 'boss-crystal-titan', bossRate: 0.018,
      levelRange: [-2, 10], rareLootBonus: 2.0,
    },
  ],
  'scorched-badlands': [
    {
      id: 'dragon-graveyard', name: 'Dragon Graveyard', description: 'A vast desert littered with the fossilized remains of ancient fire drakes.',
      levelReq: 18, special: true,
      monsters: ['ash-golem', 'cinder-wraith', 'magma-serpent', 'flame-beetle', 'heat-phantom', 'ember-wolf'],
      encounterRate: 0.82, lootRate: 0.52, bgKey: 'desert',
      boss: 'boss-inferno-beast', bossRate: 0.012,
      levelRange: [-3, 7], rareLootBonus: 1.5,
    },
    {
      id: 'molten-sanctum', name: 'Molten Sanctum', description: 'A temple built inside an active lava flow, worshipping the fire within.',
      levelReq: 26, special: true,
      monsters: ['lava-slime', 'magma-serpent', 'ash-golem', 'cinder-wraith', 'charred-skeleton', 'desert-vagrant'],
      encounterRate: 0.88, lootRate: 0.58, bgKey: 'desert',
      boss: 'boss-volcanic-titan', bossRate: 0.018,
      levelRange: [-2, 10], rareLootBonus: 2.0,
    },
  ],
  'toxic-marshlands': [
    {
      id: 'spore-nexus', name: 'Spore Nexus', description: 'The origin point of the marsh\'s toxic fungal network. The air itself is alive.',
      levelReq: 24, special: true,
      monsters: ['fungal-zombie', 'spore-cloud', 'rot-golem', 'vine-strangler', 'swamp-wraith', 'marsh-wolf'],
      encounterRate: 0.82, lootRate: 0.52, bgKey: 'swamp',
      boss: 'boss-fungal-behemoth', bossRate: 0.012,
      levelRange: [-3, 7], rareLootBonus: 1.5,
    },
    {
      id: 'plague-heart', name: 'Plague Heart', description: 'The throbbing organ at the center of the corruption — destroying it might cure the swamp.',
      levelReq: 34, special: true,
      monsters: ['rot-golem', 'plague-rat', 'swamp-wraith', 'fungal-zombie', 'vine-strangler', 'poison-bat'],
      encounterRate: 0.88, lootRate: 0.58, bgKey: 'swamp',
      boss: 'boss-rot-titan', bossRate: 0.018,
      levelRange: [-2, 10], rareLootBonus: 2.0,
    },
  ],
  'abyssal-depths': [
    {
      id: 'leviathan-graveyard', name: 'Leviathan Graveyard', description: 'Where colossal sea creatures come to die. Their bones hum with power.',
      levelReq: 32, special: true,
      monsters: ['kraken-spawn', 'depth-phantom', 'pressure-wraith', 'sea-serpent', 'trench-stalker', 'coral-golem'],
      encounterRate: 0.84, lootRate: 0.52, bgKey: 'ocean',
      boss: 'boss-kraken-prime', bossRate: 0.012,
      levelRange: [-3, 8], rareLootBonus: 1.5,
    },
    {
      id: 'drowned-palace', name: 'Drowned Palace', description: 'An opulent palace swallowed by the sea. Its treasures still glitter in the dark.',
      levelReq: 42, special: true,
      monsters: ['drowned-vagrant', 'coral-golem', 'sea-serpent', 'pressure-wraith', 'depth-phantom', 'void-fish'],
      encounterRate: 0.9, lootRate: 0.6, bgKey: 'ocean',
      boss: 'boss-abyssal-leviathan', bossRate: 0.02,
      levelRange: [-2, 12], rareLootBonus: 2.0,
    },
  ],
  'celestial-highlands': [
    {
      id: 'star-forge', name: 'Star Forge', description: 'A divine workshop where celestial weapons are hammered from starlight.',
      levelReq: 42, special: true,
      monsters: ['solar-elemental', 'empyrean-sentinel', 'celestial-knight', 'astral-golem', 'starfall-wraith', 'comet-shard'],
      encounterRate: 0.84, lootRate: 0.55, bgKey: 'celestial',
      boss: 'boss-solar-titan', bossRate: 0.012,
      levelRange: [-3, 8], rareLootBonus: 1.5,
    },
    {
      id: 'throne-of-light', name: 'Throne of Light', description: 'The seat of a forgotten god. Blinding radiance and impossible guardians.',
      levelReq: 52, special: true,
      monsters: ['empyrean-sentinel', 'celestial-knight', 'thunder-drake', 'light-phantom', 'comet-shard', 'astral-golem'],
      encounterRate: 0.9, lootRate: 0.6, bgKey: 'celestial',
      boss: 'boss-empyrean-judge', bossRate: 0.02,
      levelRange: [-2, 12], rareLootBonus: 2.0,
    },
  ],
  'void-nexus': [
    {
      id: 'reality-fracture', name: 'Reality Fracture', description: 'A scar in spacetime where multiple dimensions collide and merge.',
      levelReq: 52, special: true,
      monsters: ['reality-bender', 'paradox-golem', 'rift-stalker', 'chaos-phantom', 'null-wraith', 'singularity-shade'],
      encounterRate: 0.86, lootRate: 0.55, bgKey: 'void',
      boss: 'boss-paradox-king', bossRate: 0.015,
      levelRange: [-3, 10], rareLootBonus: 1.8,
    },
    {
      id: 'end-of-everything', name: 'End of Everything', description: 'Beyond the void lies this — the final frontier where existence ends.',
      levelReq: 62, special: true,
      monsters: ['oblivion-knight', 'abyss-watcher', 'reality-bender', 'nexus-serpent', 'singularity-shade', 'paradox-golem'],
      encounterRate: 0.92, lootRate: 0.65, bgKey: 'void',
      boss: 'boss-oblivion-god', bossRate: 0.025,
      levelRange: [-2, 15], rareLootBonus: 2.5,
    },
  ],
};

// ---- SPEED BY SPRITE TYPE (base speed for monsters) ----
export const SPRITE_BASE_SPEED = {
  rat: 8, bat: 9, ghost: 7, slime: 3, snake: 6,
  vagrant: 5, goblin: 5, wolf: 7, golem: 2, skeleton: 4, dragon: 5,
};

// Get base speed for a monster/boss entry (uses explicit baseSpeed or sprite lookup)
export function getMonsterBaseSpeed(entry) {
  if (entry.baseSpeed != null) return entry.baseSpeed;
  return SPRITE_BASE_SPEED[entry.sprite] || 5;
}

// ---- COMBAT STATS BY SPRITE TYPE ----
// evasion: dodge chance base, accuracy: hit chance base, resistance: skill/magic dmg reduction
// tenacity: debuff duration reduction, aggression: dmg dealt/taken multiplier, luck: crit/dodge/loot
// fortitude: chance to survive lethal hit at 1 HP
export const SPRITE_BASE_COMBAT_STATS = {
  rat:      { evasion: 6, accuracy: 4, resistance: 1, tenacity: 2, aggression: 3, luck: 5, fortitude: 1 },
  bat:      { evasion: 8, accuracy: 3, resistance: 1, tenacity: 1, aggression: 2, luck: 4, fortitude: 1 },
  ghost:    { evasion: 7, accuracy: 5, resistance: 6, tenacity: 4, aggression: 2, luck: 3, fortitude: 3 },
  slime:    { evasion: 1, accuracy: 3, resistance: 4, tenacity: 6, aggression: 1, luck: 2, fortitude: 5 },
  snake:    { evasion: 5, accuracy: 6, resistance: 2, tenacity: 3, aggression: 5, luck: 3, fortitude: 2 },
  vagrant:  { evasion: 4, accuracy: 5, resistance: 3, tenacity: 3, aggression: 4, luck: 3, fortitude: 3 },
  goblin:   { evasion: 5, accuracy: 4, resistance: 2, tenacity: 2, aggression: 5, luck: 6, fortitude: 2 },
  wolf:     { evasion: 6, accuracy: 6, resistance: 2, tenacity: 3, aggression: 6, luck: 3, fortitude: 3 },
  golem:    { evasion: 0, accuracy: 4, resistance: 7, tenacity: 8, aggression: 3, luck: 1, fortitude: 7 },
  skeleton: { evasion: 3, accuracy: 4, resistance: 5, tenacity: 5, aggression: 4, luck: 2, fortitude: 4 },
  dragon:   { evasion: 4, accuracy: 7, resistance: 6, tenacity: 6, aggression: 7, luck: 4, fortitude: 5 },
};

export function getMonsterBaseCombatStats(entry) {
  const base = SPRITE_BASE_COMBAT_STATS[entry.sprite] || { evasion: 3, accuracy: 4, resistance: 3, tenacity: 3, aggression: 3, luck: 3, fortitude: 2 };
  return { ...base, ...(entry.combatStats || {}) };
}

// ---- MONSTER ELEMENT TYPES ----
// Each sprite type has a primary element. Bosses can override.
export const SPRITE_ELEMENT = {
  rat: 'physical',
  bat: 'shadow',
  ghost: 'shadow',
  slime: 'nature',
  snake: 'nature',
  vagrant: 'physical',
  goblin: 'physical',
  wolf: 'physical',
  golem: 'physical',
  skeleton: 'shadow',
  dragon: 'fire',
};

// Location-based element overrides for thematic monsters
export const MONSTER_ELEMENT_OVERRIDE = {
  'frost-wolf': 'ice', 'ice-crawler': 'ice', 'snow-wraith': 'ice', 'glacial-golem': 'ice',
  'frost-spider': 'ice', 'tundra-stalker': 'ice', 'ice-phantom': 'ice', 'blizzard-hawk': 'ice',
  'crystal-beetle': 'ice', 'permafrost-skeleton': 'ice',
  'forge-elemental': 'fire', 'molten-slime': 'fire', 'furnace-bat': 'fire',
  'toxic-slime': 'nature', 'sludge-slime': 'nature', 'void-slime': 'arcane',
  'neon-phantom': 'arcane', 'signal-ghost': 'lightning', 'wind-phantom': 'arcane',
  'phantom-conductor': 'lightning', 'glitch-golem': 'lightning', 'dark-assassin': 'shadow',
  'shadow-dragon': 'shadow', 'neon-reaper': 'shadow', 'wire-rat': 'lightning',
  'volt-spider': 'lightning', 'steam-skeleton': 'fire', 'iron-wolf': 'physical',
  'chain-wraith': 'shadow', 'drone-wasp': 'lightning', 'factory-drone': 'lightning',
  'acid-sprayer': 'nature',
};

export function getMonsterElement(entry) {
  if (entry.element) return entry.element;
  if (MONSTER_ELEMENT_OVERRIDE[entry.id]) return MONSTER_ELEMENT_OVERRIDE[entry.id];
  return SPRITE_ELEMENT[entry.sprite] || 'physical';
}

// ---- COMBO CHAIN DEFINITIONS ----
// Patterns of actions that grant bonuses when executed in sequence
export const COMBO_CHAINS = {
  'power_combo': {
    name: 'Power Combo', sequence: ['attack', 'attack', 'skill'], bonus: 'dmg_boost',
    boostPct: 0.5, desc: 'ATK → ATK → Skill: Next skill deals +50% damage',
  },
  'tactical_combo': {
    name: 'Tactical Strike', sequence: ['defend', 'attack'], bonus: 'crit_boost',
    critBoost: 0.4, desc: 'Defend → ATK: Guaranteed +40% crit chance on attack',
  },
  'channel_combo': {
    name: 'Overcharge', sequence: ['channel', 'skill'], bonus: 'double_channel',
    desc: 'Channel → Skill: Channel bonus applies to skill too (stacks)',
  },
  'relentless_combo': {
    name: 'Relentless', sequence: ['attack', 'attack', 'attack'], bonus: 'bleed',
    bleedPct: 0.04, bleedTurns: 2, desc: 'ATK × 3: Enemy bleeds 4% HP/turn for 2 turns',
  },
  'counter_combo': {
    name: 'Counter Rush', sequence: ['parry', 'attack'], bonus: 'pierce',
    piercePct: 0.5, desc: 'Parry → ATK: Attack ignores 50% DEF',
  },
  'fortress_crush': {
    name: 'Fortress Crush', sequence: ['defend', 'defend', 'attack'], bonus: 'armor_break',
    armorBreakPct: 0.4, armorBreakTurns: 3, desc: 'Defend × 2 → ATK: Break enemy armor -40% DEF for 3 turns',
  },
  'arcane_surge': {
    name: 'Arcane Surge', sequence: ['skill', 'skill', 'skill'], bonus: 'mana_restore',
    restorePct: 0.25, desc: 'Skill × 3: Restore 25% max mana',
  },
  'perfect_parry': {
    name: 'Perfect Parry', sequence: ['parry', 'parry'], bonus: 'invuln',
    invulnTurns: 1, desc: 'Parry × 2: Become invulnerable for 1 turn',
  },
  'berserker_chain': {
    name: 'Berserker Chain', sequence: ['attack', 'skill', 'attack'], bonus: 'frenzy',
    frenzyBonus: 0.35, desc: 'ATK → Skill → ATK: +35% damage for 2 turns',
  },
  'channel_strike': {
    name: 'Focused Strike', sequence: ['channel', 'attack'], bonus: 'crit_guarantee',
    desc: 'Channel → ATK: Guaranteed critical hit',
  },
};

// ---- STANCE DEFINITIONS ----
export const STANCES = {
  balanced: { name: 'Balanced', dmgDealt: 1.0, dmgTaken: 1.0, critMod: 0, dodgeMod: 0, manaMod: 1.0 },
  aggressive: { name: 'Aggressive', dmgDealt: 1.3, dmgTaken: 1.2, critMod: 0.1, dodgeMod: -0.05, manaMod: 1.15 },
  defensive: { name: 'Defensive', dmgDealt: 0.7, dmgTaken: 0.6, critMod: -0.05, dodgeMod: 0.1, manaMod: 0.9 },
  evasive: { name: 'Evasive', dmgDealt: 0.85, dmgTaken: 0.9, critMod: 0, dodgeMod: 0.2, manaMod: 1.0 },
};

// ---- STANCE MOMENTUM ----
// Staying in the same stance builds momentum, increasing bonuses
export const STANCE_MOMENTUM_PER_TURN = 0.05; // +5% per turn staying in same stance
export const STANCE_MOMENTUM_CAP = 0.3; // max +30%

// ---- UNIVERSAL COMBAT SKILLS (learnable by all classes through progression) ----
export const UNIVERSAL_SKILLS = {
  parry: { name: 'Parry', desc: 'Block and counter — take 80% less damage, counter for 0.8x ATK if hit', manaCost: 5, unlockLevel: 5, cooldown: 0 },
  stun_strike: { name: 'Stun Strike', desc: 'Attack for 0.8x damage with 55% chance to stun for 1 turn', manaCost: 8, multiplier: 0.8, unlockLevel: 8, cooldown: 2 },
  war_shout: { name: 'War Shout', desc: 'Reduce enemy ATK by 20% and boost your DEF by 15% for 3 turns', manaCost: 10, unlockLevel: 12, cooldown: 4 },
  mind_blast: { name: 'Mind Blast', desc: '1.0x damage with 50% chance to confuse enemy for 2 turns', manaCost: 10, multiplier: 1.0, unlockLevel: 15, cooldown: 3 },
  life_drain: { name: 'Life Drain', desc: '1.2x damage, heal 40% of damage dealt', manaCost: 12, multiplier: 1.2, unlockLevel: 18, cooldown: 2 },
  elemental_strike: { name: 'Elemental Strike', desc: '1.5x damage matching weather element, +30% in matching weather', manaCost: 14, multiplier: 1.5, unlockLevel: 22, cooldown: 2 },
  armor_shatter: { name: 'Armor Shatter', desc: '0.6x damage but reduces enemy DEF by 30% for 3 turns', manaCost: 10, multiplier: 0.6, unlockLevel: 26, cooldown: 4 },
  mana_burst: { name: 'Mana Burst', desc: 'Convert 20% of current mana into pure damage (ignores DEF)', manaCost: 0, unlockLevel: 28, cooldown: 3 },
  last_stand: { name: 'Last Stand', desc: 'Heal 30% max HP and gain +50% ATK for 2 turns (once per battle)', manaCost: 15, unlockLevel: 32, cooldown: 99 },
  elemental_ward: { name: 'Elemental Ward', desc: 'Resist 50% of elemental damage for 3 turns', manaCost: 12, unlockLevel: 36, cooldown: 5 },
  execute: { name: 'Execute', desc: '2.5x damage to enemies below 25% HP, otherwise 0.5x', manaCost: 15, multiplier: 0.5, unlockLevel: 38, cooldown: 3 },
  limit_break: { name: 'Limit Break', desc: 'Consume all mana for massive damage (scales with mana consumed)', manaCost: 0, unlockLevel: 42, cooldown: 99 },
};

// ---- SKILL ELEMENT MAPPING FOR MONSTER SKILLS ----
// Maps monster skill IDs to their element for elemental damage calculations
export const MONSTER_SKILL_ELEMENTS = {
  firebreath: 'fire', inferno: 'fire', scorch: 'fire', heatwave: 'fire', eruption: 'fire',
  channel_flame: 'fire', channel_storm: 'lightning',
  blizzard: 'ice', freeze: 'ice', frostbite: 'ice', icicle: 'ice', channel_ice: 'ice',
  shock: 'lightning', thunderclap: 'lightning', flash_bang: 'lightning', thunder_slam: 'lightning',
  voidblast: 'arcane', voidrift: 'arcane', nullify: 'arcane', oblivion: 'arcane', channel_void: 'arcane',
  shadowstrike: 'shadow', deathgrip: 'shadow', entropy: 'shadow', hex: 'shadow',
  madness: 'shadow', mind_fog: 'shadow', psychic_wave: 'arcane', confuse: 'arcane',
  poison: 'nature', venom: 'nature', toxicspore: 'nature', plague: 'nature', rotburst: 'nature',
  channel_plague: 'nature', fungalslam: 'nature',
  tidalwave: 'ice', drown: 'ice', abyssalgrip: 'shadow', crushingdepth: 'ice', channel_abyss: 'shadow',
  smite: 'arcane', holybeam: 'arcane', starfall: 'arcane', judgment: 'arcane', channel_light: 'arcane',
  sandblast: 'physical', petrify: 'nature', stun_bash: 'physical', concuss: 'physical',
};

// ---- MILESTONE PROGRESSION REWARDS ----
// Permanent bonuses at specific levels
export const LEVEL_MILESTONES = {
  3:  { reward: 'stat_boost', stats: { maxHp: 5, maxMana: 5 }, desc: '+5 HP, +5 Mana' },
  5:  { reward: 'unlock_parry', desc: 'Parry unlocked — block and counter in combat' },
  7:  { reward: 'stat_boost', stats: { maxHp: 10, baseAtk: 1 }, desc: '+10 HP, +1 ATK' },
  8:  { reward: 'unlock_stun_strike', desc: 'Stun Strike unlocked — stun enemies in combat' },
  10: { reward: 'stat_boost', stats: { maxHp: 15, maxMana: 10 }, desc: '+15 HP, +10 Mana' },
  12: { reward: 'unlock_war_shout', desc: 'War Shout unlocked — buff DEF and debuff enemy ATK' },
  14: { reward: 'stat_boost', stats: { maxHp: 10, baseDef: 2, resistance: 2 }, desc: '+10 HP, +2 DEF, +2 RES' },
  15: { reward: 'unlock_mind_blast', desc: 'Mind Blast unlocked — confuse enemies' },
  17: { reward: 'stat_boost', stats: { maxMana: 10, accuracy: 2, evasion: 2 }, desc: '+10 Mana, +2 ACC, +2 EVA' },
  18: { reward: 'unlock_life_drain', desc: 'Life Drain unlocked — heal through damage' },
  20: { reward: 'stat_boost', stats: { maxHp: 25, maxMana: 15, baseAtk: 3, baseDef: 2 }, desc: '+25 HP, +15 Mana, +3 ATK, +2 DEF' },
  22: { reward: 'unlock_elemental_strike', desc: 'Elemental Strike unlocked — element-based attack' },
  24: { reward: 'stat_boost', stats: { speed: 2, luck: 3, tenacity: 2 }, desc: '+2 SPD, +3 LCK, +2 TEN' },
  25: { reward: 'combo_master', desc: 'Combo Master — combo chains deal +20% bonus damage' },
  26: { reward: 'unlock_armor_shatter', desc: 'Armor Shatter unlocked — reduce enemy DEF' },
  28: { reward: 'unlock_mana_burst', desc: 'Mana Burst unlocked — convert mana to pure damage' },
  30: { reward: 'stat_boost', stats: { maxHp: 40, maxMana: 20, baseAtk: 5, baseDef: 3, speed: 2 }, desc: '+40 HP, +20 Mana, +5 ATK, +3 DEF, +2 SPD' },
  32: { reward: 'unlock_last_stand', desc: 'Last Stand unlocked — emergency heal and damage boost' },
  35: { reward: 'stance_master', desc: 'Stance Master — stance bonuses increased by 50%' },
  36: { reward: 'unlock_elemental_ward', desc: 'Elemental Ward unlocked — resist elemental damage' },
  38: { reward: 'unlock_execute', desc: 'Execute unlocked — massive damage to low HP enemies' },
  40: { reward: 'stat_boost', stats: { maxHp: 50, maxMana: 30, baseAtk: 8, baseDef: 5, speed: 3, evasion: 3, accuracy: 3 }, desc: 'Major stat boost at level 40' },
  42: { reward: 'unlock_limit_break', desc: 'Limit Break unlocked — consume all mana for massive damage' },
  45: { reward: 'stat_boost', stats: { maxHp: 60, maxMana: 40, baseAtk: 10, baseDef: 7, fortitude: 5, aggression: 3 }, desc: 'Ultimate stat boost at level 45' },
  48: { reward: 'perfect_parry_master', desc: 'Perfect Parry — parry counter deals 1.5x damage' },
  50: { reward: 'stat_boost', stats: { maxHp: 100, maxMana: 50, baseAtk: 15, baseDef: 10, speed: 5, luck: 5 }, desc: 'Legendary stat boost at level 50' },
};

export function getMonsterSkillElement(skillId, monsterElement) {
  if (MONSTER_SKILL_ELEMENTS[skillId]) return MONSTER_SKILL_ELEMENTS[skillId];
  return monsterElement || 'physical';
}

// ---- MONSTER/BOSS SKILLS ----
export const SKILLS = {
  bite:       { name: 'Bite',        multiplier: 1.3 },
  slash:      { name: 'Slash',       multiplier: 1.4 },
  screech:    { name: 'Screech',     multiplier: 0.8, effect: 'lower_def' },
  poison:     { name: 'Poison',      multiplier: 0.6, effect: 'poison' },
  steal:      { name: 'Steal',       multiplier: 0.5, effect: 'steal_gold' },
  curse:      { name: 'Curse',       multiplier: 0.7, effect: 'lower_atk' },
  slam:       { name: 'Slam',        multiplier: 1.6 },
  firebreath: { name: 'Fire Breath', multiplier: 1.8 },
  sting:      { name: 'Sting',       multiplier: 1.2 },
  scratch:    { name: 'Scratch',     multiplier: 1.1 },
  web:        { name: 'Web',         multiplier: 0.5, effect: 'lower_def' },
  howl:       { name: 'Howl',        multiplier: 0.9, effect: 'lower_atk' },
  drain:      { name: 'Drain',       multiplier: 1.0, effect: 'drain_hp' },
  venom:      { name: 'Venom',       multiplier: 0.8, effect: 'poison' },
  shock:      { name: 'Shock',       multiplier: 1.5 },
  backstab:   { name: 'Backstab',    multiplier: 1.7 },
  bash:       { name: 'Bash',        multiplier: 1.4 },
  roar:       { name: 'Roar',        multiplier: 0.6, effect: 'lower_atk' },
  frenzy:     { name: 'Frenzy',      multiplier: 1.9 },
  charge:     { name: 'Charge',      multiplier: 1.6 },
  shadowstrike: { name: 'Shadow Strike', multiplier: 1.8 },
  inferno:    { name: 'Inferno',     multiplier: 2.0 },
  voidblast:  { name: 'Void Blast',  multiplier: 2.2 },
  ironcrush:  { name: 'Iron Crush',  multiplier: 1.7 },
  thunderclap: { name: 'Thunderclap', multiplier: 1.9, effect: 'lower_def' },
  deathgrip:  { name: 'Death Grip',  multiplier: 1.5, effect: 'poison' },
  // Frozen Wastes skills
  frostbite:  { name: 'Frostbite',   multiplier: 1.3, effect: 'lower_atk' },
  blizzard:   { name: 'Blizzard',    multiplier: 1.7 },
  freeze:     { name: 'Freeze',      multiplier: 0.9, effect: 'lower_def' },
  icicle:     { name: 'Icicle',      multiplier: 1.4 },
  // Scorched Badlands skills
  sandblast:  { name: 'Sandblast',   multiplier: 1.4, effect: 'lower_def' },
  heatwave:   { name: 'Heatwave',    multiplier: 1.6 },
  scorch:     { name: 'Scorch',      multiplier: 1.5 },
  eruption:   { name: 'Eruption',    multiplier: 1.9 },
  // Toxic Marshlands skills
  toxicspore: { name: 'Toxic Spore', multiplier: 0.7, effect: 'poison' },
  plague:     { name: 'Plague',       multiplier: 0.8, effect: 'poison' },
  fungalslam: { name: 'Fungal Slam', multiplier: 1.5 },
  rotburst:   { name: 'Rot Burst',   multiplier: 1.6, effect: 'poison' },
  // Abyssal Depths skills
  tidalwave:  { name: 'Tidal Wave',  multiplier: 1.8 },
  drown:      { name: 'Drown',       multiplier: 1.2, effect: 'lower_def' },
  abyssalgrip:{ name: 'Abyssal Grip',multiplier: 1.5, effect: 'drain_hp' },
  crushingdepth:{ name: 'Crushing Depth', multiplier: 1.7 },
  // Celestial Highlands skills
  smite:      { name: 'Smite',       multiplier: 1.9 },
  holybeam:   { name: 'Holy Beam',   multiplier: 2.0 },
  starfall:   { name: 'Starfall',    multiplier: 1.7 },
  judgment:   { name: 'Judgment',    multiplier: 1.8, effect: 'lower_atk' },
  // Void Nexus skills
  voidrift:   { name: 'Void Rift',   multiplier: 1.6, effect: 'lower_def' },
  nullify:    { name: 'Nullify',     multiplier: 1.4, effect: 'lower_atk' },
  oblivion:   { name: 'Oblivion',    multiplier: 2.3 },
  entropy:    { name: 'Entropy',     multiplier: 1.5, effect: 'drain_hp' },
  // Channel skills - enemy charges energy then unleashes boosted attack
  channel_fury:   { name: 'Channel Fury',   multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.5, unleashName: 'Unleash Fury', unleashMult: 2.5 },
  channel_storm:  { name: 'Channel Storm',  multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.2, unleashName: 'Unleash Storm', unleashMult: 2.2, unleashEffect: 'lower_def' },
  channel_void:   { name: 'Channel Void',   multiplier: 0, effect: 'channel', channelTurns: 2, channelBonus: 3.0, unleashName: 'Void Detonation', unleashMult: 3.0, unleashEffect: 'drain_hp' },
  channel_flame:  { name: 'Channel Flame',  multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.0, unleashName: 'Flame Burst', unleashMult: 2.0 },
  channel_ice:    { name: 'Channel Ice',    multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.0, unleashName: 'Glacial Shatter', unleashMult: 2.0, unleashEffect: 'lower_atk' },
  channel_plague: { name: 'Channel Plague', multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 1.8, unleashName: 'Plague Nova', unleashMult: 1.8, unleashEffect: 'poison' },
  channel_abyss:  { name: 'Channel Abyss',  multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.3, unleashName: 'Abyssal Crush', unleashMult: 2.3 },
  channel_light:  { name: 'Channel Light',  multiplier: 0, effect: 'channel', channelTurns: 1, channelBonus: 2.4, unleashName: 'Divine Wrath', unleashMult: 2.4 },
  // Stun skills - target skips their next turn
  stun_bash:    { name: 'Stun Bash',     multiplier: 0.8, effect: 'stun', stunTurns: 1 },
  thunder_slam: { name: 'Thunder Slam',  multiplier: 1.2, effect: 'stun', stunTurns: 1 },
  petrify:      { name: 'Petrify',       multiplier: 0.5, effect: 'stun', stunTurns: 2 },
  flash_bang:   { name: 'Flash Bang',    multiplier: 0.6, effect: 'stun', stunTurns: 1 },
  concuss:      { name: 'Concuss',       multiplier: 1.0, effect: 'stun', stunTurns: 1 },
  // Confusion skills - target does random/wrong action
  confuse:      { name: 'Confuse',       multiplier: 0.4, effect: 'confusion', confusionTurns: 2 },
  mind_fog:     { name: 'Mind Fog',      multiplier: 0.3, effect: 'confusion', confusionTurns: 3 },
  psychic_wave: { name: 'Psychic Wave',  multiplier: 0.7, effect: 'confusion', confusionTurns: 2 },
  hex:          { name: 'Hex',           multiplier: 0.5, effect: 'confusion', confusionTurns: 2 },
  madness:      { name: 'Madness',       multiplier: 0.6, effect: 'confusion', confusionTurns: 3 },
};

// ---- BOSS GIMMICKS ----
// Each boss has a unique mechanic that triggers during battle
export const BOSS_GIMMICKS = {
  // Neon District bosses
  'boss-king-rat': { type: 'summon_swarm', name: 'Rat Swarm', desc: 'Summons rats that deal damage each turn', triggerHpPct: 0.5, swarmDmgPct: 0.03, duration: 4 },
  'boss-shadow-lord': { type: 'shadow_cloak', name: 'Shadow Cloak', desc: 'Becomes untargetable for 1 turn, heals 10%', triggerHpPct: 0.4, healPct: 0.1, duration: 1 },
  'boss-conductor': { type: 'overcharge', name: 'Rail Overcharge', desc: 'Charges the rails - next attack hits twice', triggerHpPct: 0.6, doubleStrike: true },
  'boss-storm-sentinel': { type: 'lightning_field', name: 'Lightning Field', desc: 'Creates a field that zaps attacker for 5% max HP', triggerHpPct: 0.5, reflectPct: 0.05, duration: 3 },
  'boss-iron-titan': { type: 'armor_up', name: 'Iron Plating', desc: 'Doubles DEF for 3 turns', triggerHpPct: 0.5, defMult: 2.0, duration: 3 },
  'boss-void-overlord': { type: 'phase_shift', name: 'Phase Shift', desc: 'Alternates between physical and void form each turn - wrong attacks deal half damage', triggerHpPct: 0.7, phases: ['physical', 'void'] },

  // Frozen Wastes bosses
  'boss-frost-warden': { type: 'frost_aura', name: 'Frost Aura', desc: 'Slows player speed by 50% for 3 turns', triggerHpPct: 0.5, speedDebuffPct: 0.5, duration: 3 },
  'boss-glacier-wyrm': { type: 'ice_armor', name: 'Ice Armor', desc: 'Absorbs next 2 hits completely', triggerHpPct: 0.4, charges: 2 },
  'boss-permafrost-king': { type: 'frozen_ground', name: 'Frozen Ground', desc: 'Player takes 4% max HP cold damage each turn', triggerHpPct: 0.6, dmgPct: 0.04, duration: 5 },
  'boss-blizzard-lord': { type: 'whiteout', name: 'Whiteout', desc: 'Player attacks have 40% miss chance for 3 turns', triggerHpPct: 0.5, missPct: 0.4, duration: 3 },
  'boss-crystal-titan': { type: 'crystal_reflect', name: 'Crystal Reflect', desc: 'Reflects 30% of damage taken for 3 turns', triggerHpPct: 0.5, reflectPct: 0.3, duration: 3 },
  'boss-frozen-emperor': { type: 'absolute_zero', name: 'Absolute Zero', desc: 'Freezes player for 1 turn (skip turn), then channels massive attack', triggerHpPct: 0.3, freezeTurns: 1 },

  // Scorched Badlands bosses
  'boss-sandstorm-king': { type: 'sandstorm', name: 'Sandstorm', desc: 'Reduces player accuracy - 30% miss chance for 4 turns', triggerHpPct: 0.5, missPct: 0.3, duration: 4 },
  'boss-canyon-drake': { type: 'fire_breath_charge', name: 'Inferno Charge', desc: 'Charges for 1 turn then breathes fire for 3x damage', triggerHpPct: 0.5, channelMult: 3.0 },
  'boss-magma-lord': { type: 'lava_pool', name: 'Lava Pool', desc: 'Creates lava that deals 5% max HP per turn', triggerHpPct: 0.6, dmgPct: 0.05, duration: 4 },
  'boss-ashen-warden': { type: 'ash_resurrection', name: 'Ash Resurrection', desc: 'Revives once at 30% HP when killed', triggerHpPct: 0, reviveHpPct: 0.3 },
  'boss-inferno-beast': { type: 'enrage', name: 'Inferno Rage', desc: 'ATK increases by 15% every 2 turns', triggerHpPct: 0.7, atkBoostPct: 0.15, interval: 2 },
  'boss-volcanic-titan': { type: 'eruption_timer', name: 'Volcanic Eruption', desc: 'After 8 turns, erupts for 50% player max HP', triggerHpPct: 1.0, timer: 8, eruptDmgPct: 0.5 },

  // Toxic Marshlands bosses
  'boss-bog-horror': { type: 'regeneration', name: 'Bog Regeneration', desc: 'Heals 5% max HP per turn', triggerHpPct: 0.7, healPct: 0.05 },
  'boss-mire-queen': { type: 'poison_nova', name: 'Poison Nova', desc: 'Poisons player for 5 turns and reduces healing by 50%', triggerHpPct: 0.5, poisonDuration: 5, healReduction: 0.5 },
  'boss-fungal-behemoth': { type: 'spore_shield', name: 'Spore Shield', desc: 'Takes 50% less damage while poisoned enemies are present', triggerHpPct: 0.6, dmgReduction: 0.5 },
  'boss-venom-matriarch': { type: 'venom_stacks', name: 'Venom Stacks', desc: 'Each attack adds venom stacks - at 5 stacks, deals 25% max HP', triggerHpPct: 1.0, maxStacks: 5, burstDmgPct: 0.25 },
  'boss-plague-lord': { type: 'pandemic', name: 'Pandemic', desc: 'Poison damage doubled and spreads to reduce stats', triggerHpPct: 0.4, poisonMultiplier: 2 },
  'boss-rot-titan': { type: 'decompose', name: 'Decompose', desc: 'Player loses 2 ATK and 1 DEF per turn permanently', triggerHpPct: 0.6, atkLoss: 2, defLoss: 1 },

  // Abyssal Depths bosses
  'boss-tidal-warden': { type: 'tidal_surge', name: 'Tidal Surge', desc: 'Every 3rd turn deals double damage', triggerHpPct: 1.0, interval: 3, dmgMult: 2.0 },
  'boss-sunken-king': { type: 'drowned_court', name: 'Drowned Court', desc: 'Summons undead that drain 3% max HP per turn', triggerHpPct: 0.5, drainPct: 0.03, duration: 5 },
  'boss-coral-colossus': { type: 'hardening', name: 'Coral Hardening', desc: 'DEF increases by 3 each turn permanently', triggerHpPct: 1.0, defGainPerTurn: 3 },
  'boss-pressure-lord': { type: 'crushing_pressure', name: 'Crushing Pressure', desc: 'Player max HP reduced by 10% permanently each phase', triggerHpPct: 0.6, hpReductionPct: 0.1 },
  'boss-kraken-prime': { type: 'tentacle_grab', name: 'Tentacle Grab', desc: 'Grabs player - cannot defend or run for 2 turns', triggerHpPct: 0.5, duration: 2 },
  'boss-abyssal-leviathan': { type: 'devour', name: 'Devour', desc: 'At 25% HP, attempts to devour for 60% max HP damage', triggerHpPct: 0.25, devourDmgPct: 0.6 },

  // Celestial Highlands bosses
  'boss-cloud-sovereign': { type: 'divine_shield', name: 'Divine Shield', desc: 'Immune to damage for 2 turns, then vulnerable for 1', triggerHpPct: 0.5, shieldTurns: 2, vulnerableTurns: 1 },
  'boss-stormspire-warden': { type: 'chain_lightning', name: 'Chain Lightning', desc: 'Attacks hit 3 times for 50% damage each', triggerHpPct: 0.5, hits: 3, dmgPct: 0.5 },
  'boss-solar-titan': { type: 'solar_flare', name: 'Solar Flare', desc: 'Charges for 2 turns then hits for 4x damage', triggerHpPct: 0.4, channelTurns: 2, unleashMult: 4.0 },
  'boss-astral-guardian': { type: 'star_alignment', name: 'Star Alignment', desc: 'Every 4th turn, all stats doubled for 1 turn', triggerHpPct: 1.0, interval: 4, duration: 1 },
  'boss-comet-lord': { type: 'comet_impact', name: 'Comet Impact', desc: 'Charges a comet that hits for 40% max HP after 3 turns', triggerHpPct: 0.5, timer: 3, impactDmgPct: 0.4 },
  'boss-empyrean-judge': { type: 'judgment_phase', name: 'Divine Judgment', desc: 'At 50% HP tests the player - fail to deal enough damage in 3 turns and take massive hit', triggerHpPct: 0.5, testTurns: 3, dmgThreshold: 0.15, failDmgPct: 0.5 },

  // Void Nexus bosses
  'boss-rift-keeper': { type: 'reality_tear', name: 'Reality Tear', desc: 'Randomly nullifies one player stat for 2 turns', triggerHpPct: 0.6, duration: 2 },
  'boss-null-sovereign': { type: 'null_zone', name: 'Null Zone', desc: 'Disables all player passives and skill bonuses for 3 turns', triggerHpPct: 0.5, duration: 3 },
  'boss-entropy-lord': { type: 'entropy_decay', name: 'Entropy Decay', desc: 'Player ATK decreases by 5% per turn cumulatively', triggerHpPct: 0.7, decayPct: 0.05 },
  'boss-paradox-king': { type: 'paradox_mirror', name: 'Paradox Mirror', desc: 'Copies player ATK - deals same damage player would deal', triggerHpPct: 0.5 },
  'boss-singularity-titan': { type: 'gravity_well', name: 'Gravity Well', desc: 'Cannot run, speed halved, pulls in damage - takes 3% HP per turn', triggerHpPct: 0.6, dmgPct: 0.03, speedDebuff: 0.5 },
  'boss-oblivion-god': { type: 'oblivion_countdown', name: 'Oblivion Countdown', desc: 'Counts down from 10. At 0, instant kill. Each player hit reduces count by 1', triggerHpPct: 0.5, countdown: 10 },
};

// ---- RARITIES ----
export const RARITIES = [
  { name: 'Common',    cssClass: 'rarity-common',    color: '#ccc',    multiplier: 1.0, weight: 72 },
  { name: 'Uncommon',  cssClass: 'rarity-uncommon',  color: '#4fc3f7', multiplier: 1.3, weight: 20 },
  { name: 'Rare',      cssClass: 'rarity-rare',      color: '#ab47bc', multiplier: 1.7, weight: 5 },
  { name: 'Epic',      cssClass: 'rarity-epic',      color: '#ffa726', multiplier: 2.2, weight: 2.5 },
  { name: 'Legendary', cssClass: 'rarity-legendary', color: '#ffd700', multiplier: 3.0, weight: 0.5 },
];

export const RARITY_LOOKUP = RARITIES.reduce((acc, rarity) => {
  acc[rarity.name] = rarity;
  return acc;
}, {});

// ---- POTION TIERS ----
export const POTION_TIERS = [
  { name: 'Small Medkit', baseHeal: 35 },
  { name: 'Field Syringe', baseHeal: 55 },
  { name: 'Combat Stims', baseHeal: 75 },
  { name: 'Mega Infusion', baseHeal: 100 },
  { name: 'Phoenix Serum', baseHeal: 130 },
];

// ---- ENERGY DRINK TIERS ----
export const ENERGY_DRINK_TIERS = [
  { name: 'Cheap Energy Shot', baseEnergy: 10 },
  { name: 'Neon Buzz Cola', baseEnergy: 15 },
  { name: 'Volt Surge Drink', baseEnergy: 20 },
  { name: 'Plasma Energy Blast', baseEnergy: 30 },
  { name: 'Hyperdrive Elixir', baseEnergy: 50 },
];

// ---- CLASS-SPECIFIC ITEM RESTRICTIONS ----

const ALL_CLASS_IDS = ['berserker', 'warrior', 'thief', 'mage', 'necromancer'];

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Weapon-specific class keywords (checked first for weapon slot)
const WEAPON_CLASS_KEYWORDS = {
  berserker: ['axe', 'club', 'maul', 'cleaver', 'bludgeon', 'hammer', 'buzzsaw', 'reaver', 'greatsword', 'guillotine', 'crusher', 'wrath'],
  warrior: ['sword', 'halberd', 'falchion', 'pike', 'claymore', 'saber', 'longsword', 'warblade', 'flamberge', 'spear', 'baton'],
  thief: ['dagger', 'shiv', 'knife', 'katana', 'stiletto', 'rapier', 'switchblade', 'machete', 'tanto', 'whip', 'lancet', 'scimitar'],
  mage: ['staff', 'rod', 'wand', 'splicer', 'starblade'],
  necromancer: ['scythe', 'glaive', 'trident'],
};

// Global thematic keywords (all slots, checked after weapon-specific)
const GLOBAL_CLASS_KEYWORDS = {
  berserker: ['berserker', 'frenzy', 'annihilat', 'havoc', 'doomsday', 'warhead', 'warcry', 'assault', 'titan'],
  warrior: ['sentinel', 'vanguard', 'bastion', 'bulwark', 'rampart', 'ironclad', 'fortress', 'pavise', 'fortify'],
  thief: ['phantom', 'assassin', 'pickpocket', 'nightstalk', 'catfoot', 'ghostweave', 'shadow', 'flicker'],
  mage: ['arcane', 'oracle', 'mystic', 'celestial', 'prism', 'aurora', 'hologram', 'singularity', 'nebula', 'binary'],
  necromancer: ['wraith', 'cursed', 'nightshade', 'blight', 'plague', 'rot ', 'drain', 'void', 'null', 'entropy', 'fungal', 'spectral', 'miasma'],
};

function getItemClasses(name, slot, level, rarity) {
  // Class-agnostic: level 1 Common starter items
  if (level <= 1 && rarity === 'Common') return null;

  const lowerName = name.toLowerCase();

  // Check weapon-specific keywords first
  if (slot === 'weapon') {
    for (const classId of ALL_CLASS_IDS) {
      const keywords = WEAPON_CLASS_KEYWORDS[classId];
      if (keywords && keywords.some(kw => lowerName.includes(kw))) {
        return [classId];
      }
    }
  }

  // Check global keywords
  for (const classId of ALL_CLASS_IDS) {
    const keywords = GLOBAL_CLASS_KEYWORDS[classId];
    if (keywords && keywords.some(kw => lowerName.includes(kw))) {
      return [classId];
    }
  }

  // Hash-based fallback for even distribution
  return [ALL_CLASS_IDS[simpleHash(name) % 5]];
}

export function canClassEquip(item, playerClass) {
  if (!item.classes) return true; // null/undefined = class-agnostic
  return item.classes.includes(playerClass);
}

export function getClassName(classId) {
  return CHARACTER_CLASSES[classId]?.name || classId;
}

export function getClassColor(classId) {
  return CHARACTER_CLASSES[classId]?.color || '#ccc';
}

export function getClassShortName(classId) {
  return CHARACTER_CLASSES[classId]?.shortName || classId.charAt(0).toUpperCase();
}

// ---- ITEM LIBRARY ----
function createGearList(slot, icon, entries) {
  return entries.map(entry => {
    const item = {
      ...entry,
      slot,
      icon,
      baseAtk: entry.baseAtk ?? 0,
      baseDef: entry.baseDef ?? 0,
      weight: entry.weight ?? (RARITY_LOOKUP[entry.rarity]?.weight ?? 1),
    };
    if (!item.classes) {
      item.classes = getItemClasses(item.name, slot, item.level, item.rarity);
    }
    return item;
  });
}

export const ITEM_LIBRARY = {
  sword: createGearList('weapon', 'sword', [
    { name: 'Rusty Shiv', rarity: 'Uncommon', level: 1, baseAtk: 3, findableAt: ['neon-mile'] },
    { name: 'Copper Dagger', rarity: 'Common', level: 2, baseAtk: 4, findableAt: ['neon-mile', 'shadow-alley'] },
    { name: 'Scrap Axe', rarity: 'Rare', level: 3, baseAtk: 5, findableAt: ['shadow-alley'] },
    { name: 'Rebar Club', rarity: 'Common', level: 4, baseAtk: 6, baseDef: 1, findableAt: ['shadow-alley', 'metro-underpass'] },
    { name: 'Iron Shortsword', rarity: 'Epic', level: 5, baseAtk: 7, findableAt: ['metro-underpass'] },
    { name: 'Tempered Rod', rarity: 'Common', level: 6, baseAtk: 8, findableAt: ['metro-underpass'] },
    { name: 'Serrated Baton', rarity: 'Legendary', level: 7, baseAtk: 9, findableAt: ['metro-underpass'] },
    { name: 'Carbon Spear', rarity: 'Rare', level: 8, baseAtk: 10, baseDef: 1, findableAt: ['skyline-rooftops'] },
    { name: 'Twin Cleavers', rarity: 'Common', level: 9, baseAtk: 11, findableAt: ['skyline-rooftops'] },
    { name: 'Storm Falchion', rarity: 'Uncommon', level: 10, baseAtk: 12, findableAt: ['skyline-rooftops'] },
    { name: 'Chainbreaker Axe', rarity: 'Epic', level: 11, baseAtk: 13, baseDef: 1, findableAt: ['ironworks-yard'] },
    { name: 'Volt Edge', rarity: 'Common', level: 12, baseAtk: 14, findableAt: ['ironworks-yard'] },
    { name: 'Neon Katana', rarity: 'Legendary', level: 13, baseAtk: 15, findableAt: ['midnight-terminal'] },
    { name: 'Solar Halberd', rarity: 'Uncommon', level: 14, baseAtk: 16, baseDef: 1, findableAt: ['ironworks-yard'] },
    { name: 'Tempest Claymore', rarity: 'Rare', level: 15, baseAtk: 17, findableAt: ['midnight-terminal'] },
    { name: 'Graviton Pike', rarity: 'Common', level: 16, baseAtk: 19, baseDef: 1, findableAt: ['midnight-terminal'] },
    { name: 'Phantom Rapier', rarity: 'Epic', level: 17, baseAtk: 20, findableAt: ['midnight-terminal'] },
    { name: 'Apex Warstaff', rarity: 'Rare', level: 18, baseAtk: 21 },
    { name: 'Singularity Edge', rarity: 'Uncommon', level: 19, baseAtk: 23 },
    { name: 'Cosmic Guillotine', rarity: 'Epic', level: 20, baseAtk: 25, baseDef: 2 },
    { name: 'Plasma Cutter', rarity: 'Legendary', level: 2, baseAtk: 5, findableAt: ['neon-mile'] },
    { name: 'Voltage Switchblade', rarity: 'Rare', level: 5, baseAtk: 9, findableAt: ['metro-underpass'] },
    { name: 'Overclocked Cleaver', rarity: 'Epic', level: 8, baseAtk: 13, findableAt: ['skyline-rooftops'] },
    { name: 'Berserker Maul', rarity: 'Common', level: 11, baseAtk: 15, findableAt: ['ironworks-yard'] },
    { name: 'Crimson Buzzsaw', rarity: 'Uncommon', level: 14, baseAtk: 19, findableAt: ['ironworks-yard'] },
    { name: 'Wrath of Neon', rarity: 'Rare', level: 16, baseAtk: 21, findableAt: ['midnight-terminal'] },
    { name: 'Oblivion Reaver', rarity: 'Common', level: 18, baseAtk: 24 },
    { name: 'Doomsday Splicer', rarity: 'Uncommon', level: 20, baseAtk: 28 },
    { name: 'Concrete Greatsword', rarity: 'Common', level: 15, baseAtk: 14 },
    { name: 'Gridline Machete', rarity: 'Common', level: 18, baseAtk: 16 },
    { name: 'Rusted Titan Blade', rarity: 'Common', level: 20, baseAtk: 18 },
    { name: 'Neon Whisper', rarity: 'Legendary', level: 3, baseAtk: 4, findableAt: ['shadow-alley'] },
    { name: 'Chrono Fang', rarity: 'Legendary', level: 6, baseAtk: 6, findableAt: ['metro-underpass'] },
    { name: 'Spectral Tanto', rarity: 'Rare', level: 2, baseAtk: 3, findableAt: ['neon-mile'] },
    { name: 'Glitch Knife', rarity: 'Epic', level: 4, baseAtk: 5, findableAt: ['shadow-alley'] },
    { name: 'Salvaged Vorpal Edge', rarity: 'Uncommon', level: 16, baseAtk: 15 },
    // Frozen Wastes tier
    { name: 'Frostbite Cleaver', rarity: 'Rare', level: 22, baseAtk: 26, findableAt: ['glacier-tunnels', 'permafrost-ruins'] },
    { name: 'Glacier Fang', rarity: 'Epic', level: 25, baseAtk: 29, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Ember Scimitar', rarity: 'Uncommon', level: 28, baseAtk: 30, findableAt: ['sunscorch-canyon', 'magma-vents'] },
    { name: 'Volcanic Greataxe', rarity: 'Rare', level: 30, baseAtk: 33, findableAt: ['inferno-pit', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Venomstrike Blade', rarity: 'Epic', level: 34, baseAtk: 36, findableAt: ['venomous-thicket', 'plague-ponds'] },
    { name: 'Rotwood Glaive', rarity: 'Common', level: 38, baseAtk: 38, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Coral Trident', rarity: 'Rare', level: 40, baseAtk: 40, findableAt: ['coral-labyrinth', 'pressure-rift'] },
    { name: 'Leviathan Tooth', rarity: 'Legendary', level: 45, baseAtk: 44, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starblade Saber', rarity: 'Epic', level: 50, baseAtk: 48, findableAt: ['solar-fields', 'astral-gardens'] },
    { name: 'Empyrean Warblade', rarity: 'Rare', level: 55, baseAtk: 52, findableAt: ['empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Severer', rarity: 'Legendary', level: 58, baseAtk: 55, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Nullpoint Edge', rarity: 'Epic', level: 62, baseAtk: 58, findableAt: ['singularity-well'] },
    { name: 'Oblivion Blade', rarity: 'Legendary', level: 65, baseAtk: 62, baseDef: 3, findableAt: ['oblivion-throne'] },
    // Additional swords
    { name: 'Bent Pipe Bludgeon', rarity: 'Common', level: 1, baseAtk: 2, findableAt: ['neon-mile'] },
    { name: 'Switchblade Special', rarity: 'Common', level: 3, baseAtk: 4, findableAt: ['shadow-alley'] },
    { name: 'Sewer Grate Edge', rarity: 'Common', level: 5, baseAtk: 6, findableAt: ['metro-underpass'] },
    { name: 'Rooftop Antenna Spear', rarity: 'Common', level: 7, baseAtk: 8, findableAt: ['skyline-rooftops'] },
    { name: 'Foundry Hammer', rarity: 'Common', level: 10, baseAtk: 10, findableAt: ['ironworks-yard'] },
    { name: 'Midnight Stiletto', rarity: 'Common', level: 13, baseAtk: 12, findableAt: ['midnight-terminal'] },
    { name: 'Corroded Machete', rarity: 'Uncommon', level: 3, baseAtk: 5, findableAt: ['shadow-alley'] },
    { name: 'Signal Wire Whip', rarity: 'Uncommon', level: 7, baseAtk: 9, findableAt: ['skyline-rooftops'] },
    { name: 'Hydraulic Cutter', rarity: 'Uncommon', level: 11, baseAtk: 14, findableAt: ['ironworks-yard'] },
    { name: 'Tungsten Baton', rarity: 'Uncommon', level: 15, baseAtk: 18 },
    { name: 'Cryo Lancet', rarity: 'Uncommon', level: 23, baseAtk: 27, findableAt: ['glacier-tunnels'] },
    { name: 'Sandstorm Scythe', rarity: 'Uncommon', level: 29, baseAtk: 31, findableAt: ['sunscorch-canyon'] },
    { name: 'Swamp Machete', rarity: 'Uncommon', level: 35, baseAtk: 37, findableAt: ['venomous-thicket'] },
    { name: 'Pressure Cutter', rarity: 'Uncommon', level: 41, baseAtk: 41, findableAt: ['pressure-rift'] },
    { name: 'Cloudpiercer Lance', rarity: 'Uncommon', level: 51, baseAtk: 49, findableAt: ['cloud-walkway'] },
    { name: 'Void Shard Dagger', rarity: 'Uncommon', level: 60, baseAtk: 56 },
    { name: 'Frostfire Saber', rarity: 'Rare', level: 24, baseAtk: 28, findableAt: ['permafrost-ruins', 'crystal-caverns'] },
    { name: 'Ashfall Glaive', rarity: 'Rare', level: 32, baseAtk: 35, findableAt: ['inferno-pit', 'ashen-ruins'] },
    { name: 'Miasma Blade', rarity: 'Rare', level: 36, baseAtk: 38, findableAt: ['plague-ponds', 'mire-depths'] },
    { name: 'Depth Charge Blade', rarity: 'Rare', level: 42, baseAtk: 42, findableAt: ['sunken-bazaar'] },
    { name: 'Nebula Slicer', rarity: 'Rare', level: 52, baseAtk: 50, findableAt: ['stormspire-tower'] },
    { name: 'Entropic Edge', rarity: 'Rare', level: 60, baseAtk: 57, findableAt: ['entropy-garden'] },
    { name: 'Blizzard Fury', rarity: 'Epic', level: 23, baseAtk: 28, baseDef: 1, findableAt: ['blizzard-peak'] },
    { name: 'Inferno Greatsword', rarity: 'Epic', level: 31, baseAtk: 35, findableAt: ['volcanic-forge'] },
    { name: 'Plaguebearer Scythe', rarity: 'Epic', level: 36, baseAtk: 38, baseDef: 2, findableAt: ['rot-core'] },
    { name: 'Abyssal Trident', rarity: 'Epic', level: 43, baseAtk: 43, findableAt: ['abyssal-trench'] },
    { name: 'Celestial Flamberge', rarity: 'Epic', level: 53, baseAtk: 51, findableAt: ['empyrean-gate'] },
    { name: 'Frozen Citadel Longsword', rarity: 'Common', level: 24, baseAtk: 25, findableAt: ['frozen-citadel'] },
    { name: 'Ashen Ruins Cleaver', rarity: 'Common', level: 30, baseAtk: 30, findableAt: ['ashen-ruins'] },
    { name: 'Mire Depths Spike', rarity: 'Common', level: 36, baseAtk: 35, findableAt: ['mire-depths'] },
    { name: 'Sunken Coral Blade', rarity: 'Common', level: 42, baseAtk: 39, findableAt: ['sunken-bazaar'] },
    { name: 'Cloud Walkway Saber', rarity: 'Common', level: 52, baseAtk: 46, findableAt: ['cloud-walkway'] },
    { name: 'Null Chamber Spike', rarity: 'Common', level: 60, baseAtk: 53, findableAt: ['null-chamber'] },
    // Class-specific weapons
    { name: 'Rage Cleaver', rarity: 'Rare', level: 10, baseAtk: 14, classes: ['berserker'], findableAt: ['skyline-rooftops'] },
    { name: 'Titan Crusher', rarity: 'Epic', level: 26, baseAtk: 29, classes: ['berserker'], findableAt: ['magma-vents'] },
    { name: 'Guardian Longsword', rarity: 'Rare', level: 12, baseAtk: 15, classes: ['warrior'], findableAt: ['ironworks-yard'] },
    { name: 'Sentinel Broadsword', rarity: 'Epic', level: 35, baseAtk: 37, classes: ['warrior'], findableAt: ['venomous-thicket'] },
    { name: 'Silent Fang Dagger', rarity: 'Rare', level: 14, baseAtk: 18, classes: ['thief'], findableAt: ['ironworks-yard'] },
    { name: 'Nightfall Stiletto', rarity: 'Epic', level: 40, baseAtk: 41, classes: ['thief'], findableAt: ['coral-labyrinth'] },
    { name: 'Ether Conduit Rod', rarity: 'Rare', level: 18, baseAtk: 22, classes: ['mage'], findableAt: ['midnight-terminal'] },
    { name: 'Starweave Wand', rarity: 'Epic', level: 48, baseAtk: 46, classes: ['mage'], findableAt: ['krakens-rest'] },
    { name: 'Bonechill Scythe', rarity: 'Rare', level: 20, baseAtk: 24, classes: ['necromancer'], findableAt: ['glacier-tunnels'] },
    { name: 'Soulreap Glaive', rarity: 'Epic', level: 44, baseAtk: 44, classes: ['necromancer'], findableAt: ['abyssal-trench'] },
  ]),
  shield: createGearList('shield', 'shield', [
    { name: 'Splintered Plank', rarity: 'Rare', level: 1, baseDef: 3, findableAt: ['neon-mile'] },
    { name: 'Tin Buckler', rarity: 'Common', level: 2, baseDef: 4, findableAt: ['neon-mile'] },
    { name: 'Patchwork Guard', rarity: 'Epic', level: 3, baseDef: 5, findableAt: ['shadow-alley'] },
    { name: 'Riveted Disc', rarity: 'Common', level: 4, baseDef: 6, findableAt: ['shadow-alley'] },
    { name: 'Bronze Kite Shield', rarity: 'Legendary', level: 5, baseDef: 7, findableAt: ['metro-underpass'] },
    { name: 'Chainmail Barrier', rarity: 'Common', level: 6, baseDef: 8, findableAt: ['metro-underpass'] },
    { name: 'Iron Tower Shield', rarity: 'Uncommon', level: 7, baseDef: 9, findableAt: ['metro-underpass'] },
    { name: 'Reinforced Pavise', rarity: 'Common', level: 8, baseDef: 10, findableAt: ['skyline-rooftops'] },
    { name: 'Shock Bumper', rarity: 'Epic', level: 9, baseDef: 11, baseAtk: 1, findableAt: ['skyline-rooftops'] },
    { name: 'Mirror Aegis', rarity: 'Rare', level: 10, baseDef: 12, findableAt: ['skyline-rooftops'] },
    { name: 'Bulwark of Cogs', rarity: 'Uncommon', level: 11, baseDef: 13, findableAt: ['ironworks-yard'] },
    { name: 'Helios Ward', rarity: 'Legendary', level: 12, baseDef: 14, findableAt: ['ironworks-yard'] },
    { name: 'Stormbreaker Rampart', rarity: 'Common', level: 13, baseDef: 15, findableAt: ['ironworks-yard'] },
    { name: 'Dragon Spine Shield', rarity: 'Rare', level: 14, baseDef: 16, findableAt: ['ironworks-yard'] },
    { name: 'Obsidian Bulwark', rarity: 'Uncommon', level: 15, baseDef: 17, findableAt: ['midnight-terminal'] },
    { name: 'Nova Barrier', rarity: 'Epic', level: 16, baseDef: 18, findableAt: ['midnight-terminal'] },
    { name: 'Eternity Wall', rarity: 'Common', level: 17, baseDef: 19, findableAt: ['midnight-terminal'] },
    { name: 'Voidcarapace', rarity: 'Rare', level: 18, baseDef: 20 },
    { name: 'Celestial Rampart', rarity: 'Uncommon', level: 19, baseDef: 21 },
    { name: 'Infinity Guard', rarity: 'Legendary', level: 20, baseDef: 23 },
    { name: 'Junkyard Barricade', rarity: 'Epic', level: 1, baseDef: 4, findableAt: ['neon-mile'] },
    { name: 'Scrapwall Gate', rarity: 'Uncommon', level: 3, baseDef: 6, findableAt: ['shadow-alley'] },
    { name: 'Titanium Kiteshield', rarity: 'Legendary', level: 6, baseDef: 10, findableAt: ['metro-underpass'] },
    { name: 'Hardlight Projector', rarity: 'Common', level: 9, baseDef: 13 },
    { name: 'Fortress Matrix', rarity: 'Uncommon', level: 12, baseDef: 16 },
    { name: 'Impenetrable Ward', rarity: 'Common', level: 15, baseDef: 19 },
    { name: 'Dimensional Barricade', rarity: 'Rare', level: 18, baseDef: 22 },
    { name: 'Absolute Zero Wall', rarity: 'Epic', level: 20, baseDef: 25 },
    { name: 'Blast Door Fragment', rarity: 'Common', level: 16, baseDef: 14 },
    { name: 'Manhole Cover Shield', rarity: 'Common', level: 19, baseDef: 16 },
    { name: 'Scrap Titan Shield', rarity: 'Common', level: 20, baseDef: 17 },
    { name: 'Pixelated Ward', rarity: 'Legendary', level: 2, baseDef: 3, findableAt: ['neon-mile'] },
    { name: 'Data Lattice Buckler', rarity: 'Legendary', level: 5, baseDef: 5, findableAt: ['metro-underpass'] },
    { name: 'Hologram Deflector', rarity: 'Epic', level: 3, baseDef: 4, findableAt: ['shadow-alley'] },
    { name: 'Corroded Riot Shield', rarity: 'Uncommon', level: 17, baseDef: 14 },
    // Frozen Wastes tier
    { name: 'Glacier Barricade', rarity: 'Rare', level: 22, baseDef: 24, findableAt: ['glacier-tunnels', 'permafrost-ruins'] },
    { name: 'Permafrost Bulwark', rarity: 'Epic', level: 25, baseDef: 27, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Magma Shield', rarity: 'Uncommon', level: 28, baseDef: 28, findableAt: ['magma-vents', 'ashen-ruins'] },
    { name: 'Volcanic Rampart', rarity: 'Rare', level: 30, baseDef: 30, findableAt: ['inferno-pit', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Fungal Carapace', rarity: 'Epic', level: 34, baseDef: 33, findableAt: ['fungal-hollow', 'venomous-thicket'] },
    { name: 'Rot Ward', rarity: 'Common', level: 38, baseDef: 35, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Coral Bulwark', rarity: 'Rare', level: 40, baseDef: 37, findableAt: ['coral-labyrinth'] },
    { name: 'Leviathan Scale', rarity: 'Legendary', level: 45, baseDef: 40, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starlight Aegis', rarity: 'Epic', level: 50, baseDef: 44, findableAt: ['solar-fields', 'astral-gardens'] },
    { name: 'Empyrean Ward', rarity: 'Rare', level: 55, baseDef: 48, findableAt: ['empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Barrier', rarity: 'Legendary', level: 58, baseDef: 50, findableAt: ['paradox-maze'] },
    { name: 'Nullpoint Shield', rarity: 'Epic', level: 62, baseDef: 53, findableAt: ['singularity-well'] },
    { name: 'Oblivion Guard', rarity: 'Legendary', level: 65, baseDef: 58, findableAt: ['oblivion-throne'] },
    // Additional shields
    { name: 'Trash Can Lid', rarity: 'Common', level: 1, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Dumpster Door Panel', rarity: 'Common', level: 3, baseDef: 5, findableAt: ['shadow-alley'] },
    { name: 'Subway Grate Shield', rarity: 'Common', level: 5, baseDef: 7, findableAt: ['metro-underpass'] },
    { name: 'Rooftop Vent Guard', rarity: 'Common', level: 8, baseDef: 9, findableAt: ['skyline-rooftops'] },
    { name: 'Factory Plate Guard', rarity: 'Common', level: 11, baseDef: 12, findableAt: ['ironworks-yard'] },
    { name: 'Terminal Blast Door', rarity: 'Common', level: 14, baseDef: 15, findableAt: ['midnight-terminal'] },
    { name: 'Wire Mesh Buckler', rarity: 'Uncommon', level: 2, baseDef: 4, findableAt: ['neon-mile'] },
    { name: 'Alley Barricade Slab', rarity: 'Uncommon', level: 5, baseDef: 7, findableAt: ['metro-underpass'] },
    { name: 'Shock Absorber Shield', rarity: 'Uncommon', level: 8, baseDef: 10, findableAt: ['skyline-rooftops'] },
    { name: 'Chromium Deflector', rarity: 'Uncommon', level: 13, baseDef: 14 },
    { name: 'Frostbark Shield', rarity: 'Uncommon', level: 23, baseDef: 25, findableAt: ['glacier-tunnels'] },
    { name: 'Heatblast Deflector', rarity: 'Uncommon', level: 29, baseDef: 29, findableAt: ['magma-vents'] },
    { name: 'Spore Shell Guard', rarity: 'Uncommon', level: 35, baseDef: 32, findableAt: ['fungal-hollow'] },
    { name: 'Barnacle Plate', rarity: 'Uncommon', level: 42, baseDef: 36, findableAt: ['tidal-caves'] },
    { name: 'Aurora Shield', rarity: 'Uncommon', level: 51, baseDef: 43, findableAt: ['stormspire-tower'] },
    { name: 'Void Static Barrier', rarity: 'Uncommon', level: 60, baseDef: 51 },
    { name: 'Crystal Ice Aegis', rarity: 'Rare', level: 24, baseDef: 26, findableAt: ['crystal-caverns'] },
    { name: 'Cinder Block Fortress', rarity: 'Rare', level: 31, baseDef: 31, findableAt: ['volcanic-forge'] },
    { name: 'Toxic Bloom Shield', rarity: 'Rare', level: 36, baseDef: 34, findableAt: ['plague-ponds'] },
    { name: 'Pressure Hull Guard', rarity: 'Rare', level: 43, baseDef: 38, findableAt: ['pressure-rift'] },
    { name: 'Comet Dust Aegis', rarity: 'Rare', level: 53, baseDef: 47, findableAt: ['comets-trail'] },
    { name: 'Entropic Ward', rarity: 'Rare', level: 60, baseDef: 52, findableAt: ['entropy-garden'] },
    { name: 'Avalanche Bulwark', rarity: 'Epic', level: 24, baseDef: 26, baseAtk: 1, findableAt: ['blizzard-peak'] },
    { name: 'Obsidian Fortress', rarity: 'Epic', level: 32, baseDef: 32, findableAt: ['inferno-pit'] },
    { name: 'Blight Barrier', rarity: 'Epic', level: 37, baseDef: 35, findableAt: ['rot-core'] },
    { name: 'Kraken Shell Shield', rarity: 'Epic', level: 44, baseDef: 39, findableAt: ['krakens-rest'] },
    { name: 'Solar Flare Aegis', rarity: 'Epic', level: 53, baseDef: 46, findableAt: ['solar-fields'] },
    { name: 'Frozen Expanse Wall', rarity: 'Common', level: 24, baseDef: 23, findableAt: ['permafrost-ruins'] },
    { name: 'Ashen Bulwark', rarity: 'Common', level: 31, baseDef: 28, findableAt: ['ashen-ruins'] },
    { name: 'Swamp Reed Shield', rarity: 'Common', level: 37, baseDef: 33, findableAt: ['bogs-edge'] },
    { name: 'Coral Reef Plate', rarity: 'Common', level: 43, baseDef: 36, findableAt: ['coral-labyrinth'] },
    { name: 'Stardust Barrier', rarity: 'Common', level: 52, baseDef: 42, findableAt: ['astral-gardens'] },
    { name: 'Null Fragment Shield', rarity: 'Common', level: 61, baseDef: 50, findableAt: ['null-chamber'] },
    // Class-specific shields
    { name: 'Battering Ram Plate', rarity: 'Rare', level: 15, baseDef: 16, baseAtk: 2, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Wrath-Forged Buckler', rarity: 'Epic', level: 38, baseDef: 35, baseAtk: 3, classes: ['berserker'], findableAt: ['rot-core'] },
    { name: 'Commander\'s Tower Shield', rarity: 'Rare', level: 20, baseDef: 22, classes: ['warrior'], findableAt: ['glacier-tunnels'] },
    { name: 'Juggernaut Rampart', rarity: 'Epic', level: 46, baseDef: 42, classes: ['warrior'], findableAt: ['krakens-rest'] },
    { name: 'Smoke Screen Buckler', rarity: 'Rare', level: 12, baseDef: 14, baseAtk: 1, classes: ['thief'], findableAt: ['ironworks-yard'] },
    { name: 'Vanishing Act Deflector', rarity: 'Epic', level: 42, baseDef: 37, baseAtk: 2, classes: ['thief'], findableAt: ['sunken-bazaar'] },
    { name: 'Mana Prism Barrier', rarity: 'Rare', level: 16, baseDef: 17, classes: ['mage'], findableAt: ['midnight-terminal'] },
    { name: 'Arcane Resonance Ward', rarity: 'Epic', level: 50, baseDef: 44, classes: ['mage'], findableAt: ['solar-fields'] },
    { name: 'Bone Lattice Guard', rarity: 'Rare', level: 22, baseDef: 24, classes: ['necromancer'], findableAt: ['permafrost-ruins'] },
    { name: 'Soulbound Carapace', rarity: 'Epic', level: 48, baseDef: 43, classes: ['necromancer'], findableAt: ['krakens-rest'] },
  ]),
  helmet: createGearList('helmet', 'helmet', [
    { name: 'Frayed Bandana', rarity: 'Common', level: 1, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Cloth Cap', rarity: 'Legendary', level: 2, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Leather Hood', rarity: 'Uncommon', level: 3, baseDef: 3, findableAt: ['shadow-alley'] },
    { name: 'Welded Visor', rarity: 'Rare', level: 4, baseDef: 4, findableAt: ['shadow-alley'] },
    { name: 'Scrap Helm', rarity: 'Common', level: 5, baseDef: 4, baseAtk: 1, findableAt: ['metro-underpass'] },
    { name: 'Chainmail Cowl', rarity: 'Epic', level: 6, baseDef: 5, findableAt: ['metro-underpass'] },
    { name: 'Iron Dome', rarity: 'Common', level: 7, baseDef: 6, findableAt: ['metro-underpass'] },
    { name: 'Carbon Mask', rarity: 'Legendary', level: 8, baseDef: 6, baseAtk: 1, findableAt: ['skyline-rooftops'] },
    { name: 'Tactical Goggles', rarity: 'Uncommon', level: 9, baseDef: 7, findableAt: ['skyline-rooftops'] },
    { name: 'Hazard Rebreather', rarity: 'Common', level: 10, baseDef: 8, findableAt: ['skyline-rooftops'] },
    { name: 'Sentinel Helm', rarity: 'Rare', level: 11, baseDef: 9, findableAt: ['ironworks-yard'] },
    { name: 'Aurora Crown', rarity: 'Epic', level: 12, baseDef: 9, baseAtk: 1, findableAt: ['ironworks-yard'] },
    { name: 'Stormcall Circlet', rarity: 'Common', level: 13, baseDef: 10 },
    { name: 'Dragon Crest Helm', rarity: 'Uncommon', level: 14, baseDef: 11, findableAt: ['ironworks-yard'] },
    { name: 'Vanguard Visage', rarity: 'Rare', level: 15, baseDef: 12, findableAt: ['midnight-terminal'] },
    { name: 'Celestial Veil', rarity: 'Uncommon', level: 16, baseDef: 13, findableAt: ['midnight-terminal'] },
    { name: 'Phoenix Halo', rarity: 'Epic', level: 17, baseDef: 14, findableAt: ['midnight-terminal'] },
    { name: 'Void Prophet Hood', rarity: 'Common', level: 18, baseDef: 15 },
    { name: 'Astral Mindguard', rarity: 'Rare', level: 19, baseDef: 16 },
    { name: 'Infinity Circlet', rarity: 'Legendary', level: 20, baseDef: 17, baseAtk: 2 },
    { name: 'Targeting Visor', rarity: 'Rare', level: 2, baseAtk: 2, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Neural Amp Helm', rarity: 'Epic', level: 5, baseAtk: 3, baseDef: 2, findableAt: ['metro-underpass'] },
    { name: 'Fury Circuit Crown', rarity: 'Common', level: 9, baseAtk: 5, baseDef: 3 },
    { name: 'Warhead Casing', rarity: 'Uncommon', level: 13, baseAtk: 7, baseDef: 4 },
    { name: 'Berserker Faceplate', rarity: 'Common', level: 16, baseAtk: 9, baseDef: 4 },
    { name: 'Annihilator Helm', rarity: 'Rare', level: 20, baseAtk: 11, baseDef: 5 },
    { name: 'Welder\'s Full Mask', rarity: 'Common', level: 14, baseDef: 9, findableAt: ['ironworks-yard'] },
    { name: 'Hardhat Mk-IX', rarity: 'Common', level: 18, baseDef: 12 },
    { name: 'Concrete Cranium', rarity: 'Common', level: 20, baseDef: 13 },
    { name: 'Glitchborn Tiara', rarity: 'Legendary', level: 2, baseDef: 2, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Flickering Diadem', rarity: 'Legendary', level: 5, baseDef: 3, baseAtk: 2, findableAt: ['metro-underpass'] },
    { name: 'Cracked Oracle Visor', rarity: 'Epic', level: 4, baseDef: 3, baseAtk: 1, findableAt: ['shadow-alley'] },
    { name: 'Makeshift Cage Helm', rarity: 'Uncommon', level: 15, baseDef: 10 },
    // Frozen Wastes tier
    { name: 'Frostguard Helm', rarity: 'Rare', level: 22, baseDef: 18, findableAt: ['frostbite-outpost', 'glacier-tunnels'] },
    { name: 'Glacier Crown', rarity: 'Epic', level: 25, baseDef: 20, baseAtk: 2, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Ember Visor', rarity: 'Uncommon', level: 28, baseDef: 21, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Crest', rarity: 'Rare', level: 30, baseDef: 23, findableAt: ['magma-vents', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Sporefilter Mask', rarity: 'Epic', level: 34, baseDef: 25, baseAtk: 2, findableAt: ['fungal-hollow', 'plague-ponds'] },
    { name: 'Rot Helm', rarity: 'Common', level: 38, baseDef: 27, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Deepwater Crown', rarity: 'Rare', level: 40, baseDef: 28, findableAt: ['sunken-bazaar', 'coral-labyrinth'] },
    { name: 'Leviathan Crest', rarity: 'Legendary', level: 45, baseDef: 31, baseAtk: 3, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starforged Circlet', rarity: 'Epic', level: 50, baseDef: 34, findableAt: ['stormspire-tower', 'solar-fields'] },
    { name: 'Empyrean Halo', rarity: 'Rare', level: 55, baseDef: 37, baseAtk: 3, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Mindguard', rarity: 'Legendary', level: 58, baseDef: 39, findableAt: ['rifts-edge', 'null-chamber'] },
    { name: 'Nullpoint Crown', rarity: 'Epic', level: 62, baseDef: 42, baseAtk: 4, findableAt: ['entropy-garden', 'singularity-well'] },
    { name: 'Oblivion Diadem', rarity: 'Legendary', level: 65, baseDef: 45, baseAtk: 5, findableAt: ['oblivion-throne'] },
    // Additional helmets
    { name: 'Cardboard Visor', rarity: 'Common', level: 1, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Bucket Helm', rarity: 'Common', level: 3, baseDef: 3, findableAt: ['shadow-alley'] },
    { name: 'Tunnel Hardhat', rarity: 'Common', level: 6, baseDef: 5, findableAt: ['metro-underpass'] },
    { name: 'Antenna Array Cap', rarity: 'Common', level: 8, baseDef: 6, findableAt: ['skyline-rooftops'] },
    { name: 'Slag Faceguard', rarity: 'Common', level: 11, baseDef: 8, findableAt: ['ironworks-yard'] },
    { name: 'Midnight Cowl', rarity: 'Common', level: 15, baseDef: 11 },
    { name: 'Alley Rat Mask', rarity: 'Uncommon', level: 2, baseDef: 2, findableAt: ['neon-mile', 'shadow-alley'] },
    { name: 'Metro Breath Mask', rarity: 'Uncommon', level: 6, baseDef: 5, findableAt: ['metro-underpass'] },
    { name: 'Skyline Spotter Helm', rarity: 'Uncommon', level: 10, baseDef: 8 },
    { name: 'Alloy Brain Cage', rarity: 'Uncommon', level: 14, baseDef: 10, baseAtk: 1 },
    { name: 'Frost Visor', rarity: 'Uncommon', level: 23, baseDef: 19, findableAt: ['frostbite-outpost'] },
    { name: 'Ash Breath Mask', rarity: 'Uncommon', level: 29, baseDef: 22, findableAt: ['ember-flats'] },
    { name: 'Spore Hood', rarity: 'Uncommon', level: 35, baseDef: 24, findableAt: ['fungal-hollow'] },
    { name: 'Diving Bell Helm', rarity: 'Uncommon', level: 42, baseDef: 27, findableAt: ['sunken-bazaar'] },
    { name: 'Aurora Visor', rarity: 'Uncommon', level: 52, baseDef: 33, findableAt: ['astral-gardens'] },
    { name: 'Null Frequency Hood', rarity: 'Uncommon', level: 60, baseDef: 38 },
    { name: 'Icebound Crown', rarity: 'Rare', level: 24, baseDef: 19, baseAtk: 1, findableAt: ['crystal-caverns'] },
    { name: 'Cinder Crest', rarity: 'Rare', level: 32, baseDef: 24, findableAt: ['volcanic-forge'] },
    { name: 'Blight Helm', rarity: 'Rare', level: 36, baseDef: 26, baseAtk: 2, findableAt: ['plague-ponds'] },
    { name: 'Abyssal Diver Crown', rarity: 'Rare', level: 43, baseDef: 29, findableAt: ['pressure-rift'] },
    { name: 'Comet Trail Crown', rarity: 'Rare', level: 53, baseDef: 36, baseAtk: 3, findableAt: ['comets-trail'] },
    { name: 'Entropy Cowl', rarity: 'Rare', level: 60, baseDef: 40, findableAt: ['entropy-garden'] },
    { name: 'Avalanche Helm', rarity: 'Epic', level: 24, baseDef: 20, baseAtk: 2, findableAt: ['blizzard-peak'] },
    { name: 'Magma Core Helm', rarity: 'Epic', level: 31, baseDef: 23, baseAtk: 2, findableAt: ['magma-vents'] },
    { name: 'Rot Prophet Mask', rarity: 'Epic', level: 37, baseDef: 27, findableAt: ['rot-core'] },
    { name: 'Kraken Bone Crown', rarity: 'Epic', level: 44, baseDef: 30, baseAtk: 3, findableAt: ['abyssal-trench'] },
    { name: 'Solar Radiance Crown', rarity: 'Epic', level: 53, baseDef: 35, baseAtk: 3, findableAt: ['solar-fields'] },
    { name: 'Glacial Dome', rarity: 'Common', level: 24, baseDef: 17, findableAt: ['permafrost-ruins'] },
    { name: 'Scorched Cage Helm', rarity: 'Common', level: 31, baseDef: 21, findableAt: ['ashen-ruins'] },
    { name: 'Bog Moss Hood', rarity: 'Common', level: 37, baseDef: 24, findableAt: ['bogs-edge'] },
    { name: 'Coral Crest Helm', rarity: 'Common', level: 43, baseDef: 27, findableAt: ['coral-labyrinth'] },
    { name: 'Stargazer Cap', rarity: 'Common', level: 52, baseDef: 31, findableAt: ['cloud-walkway'] },
    { name: 'Void Echo Helm', rarity: 'Common', level: 61, baseDef: 37, findableAt: ['rifts-edge'] },
    // Class-specific helmets
    { name: 'Fury-Scarred Faceplate', rarity: 'Rare', level: 18, baseDef: 14, baseAtk: 3, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Berserker War Crown', rarity: 'Epic', level: 40, baseDef: 28, baseAtk: 5, classes: ['berserker'], findableAt: ['coral-labyrinth'] },
    { name: 'Champion\'s Great Helm', rarity: 'Rare', level: 25, baseDef: 20, classes: ['warrior'], findableAt: ['crystal-caverns'] },
    { name: 'Fortress Visage', rarity: 'Epic', level: 45, baseDef: 31, baseAtk: 3, classes: ['warrior'], findableAt: ['abyssal-trench'] },
    { name: 'Phantom Cowl', rarity: 'Rare', level: 10, baseDef: 8, baseAtk: 2, classes: ['thief'], findableAt: ['skyline-rooftops'] },
    { name: 'Shadow Dancer Mask', rarity: 'Epic', level: 35, baseDef: 25, baseAtk: 4, classes: ['thief'], findableAt: ['venomous-thicket'] },
    { name: 'Starlight Diadem', rarity: 'Rare', level: 15, baseDef: 12, baseAtk: 2, classes: ['mage'], findableAt: ['midnight-terminal'] },
    { name: 'Celestial Mind Crown', rarity: 'Epic', level: 48, baseDef: 33, baseAtk: 4, classes: ['mage'], findableAt: ['krakens-rest'] },
    { name: 'Deathseer Hood', rarity: 'Rare', level: 20, baseDef: 16, baseAtk: 2, classes: ['necromancer'], findableAt: ['glacier-tunnels'] },
    { name: 'Lich King\'s Diadem', rarity: 'Epic', level: 55, baseDef: 38, baseAtk: 5, classes: ['necromancer'], findableAt: ['empyrean-gate'] },
  ]),
  armor: createGearList('armor', 'armor', [
    { name: 'Tattered Vest', rarity: 'Uncommon', level: 1, baseDef: 4, findableAt: ['neon-mile'] },
    { name: 'Scrap Leathers', rarity: 'Common', level: 2, baseDef: 5, findableAt: ['neon-mile'] },
    { name: 'Patchwork Coat', rarity: 'Legendary', level: 3, baseDef: 6, findableAt: ['shadow-alley'] },
    { name: 'Street Brigandine', rarity: 'Rare', level: 4, baseDef: 7, findableAt: ['shadow-alley'] },
    { name: 'Chainmail Vest', rarity: 'Common', level: 5, baseDef: 8, findableAt: ['metro-underpass'] },
    { name: 'Iron Carapace', rarity: 'Epic', level: 6, baseDef: 9, findableAt: ['metro-underpass'] },
    { name: 'Reinforced Jacket', rarity: 'Common', level: 7, baseDef: 9, baseAtk: 1 },
    { name: 'Alloy Breastplate', rarity: 'Uncommon', level: 8, baseDef: 10 },
    { name: 'Composite Harness', rarity: 'Legendary', level: 9, baseDef: 11 },
    { name: 'Dynamo Mail', rarity: 'Common', level: 10, baseDef: 12 },
    { name: 'Riot Gear Hauberk', rarity: 'Uncommon', level: 11, baseDef: 13 },
    { name: 'Arctic Exo-Shell', rarity: 'Rare', level: 12, baseDef: 14 },
    { name: 'Solar Scale Armor', rarity: 'Common', level: 13, baseDef: 15 },
    { name: 'Thunderborn Plate', rarity: 'Rare', level: 14, baseDef: 16 },
    { name: 'Obsidian Warplate', rarity: 'Uncommon', level: 15, baseDef: 17 },
    { name: 'Voidwoven Raiment', rarity: 'Epic', level: 16, baseDef: 18 },
    { name: 'Phoenix Bodyguard', rarity: 'Rare', level: 17, baseDef: 19 },
    { name: 'Celestial Bulwark Suit', rarity: 'Common', level: 18, baseDef: 20 },
    { name: 'Eternium Aegis Frame', rarity: 'Epic', level: 19, baseDef: 21 },
    { name: 'Singularity Battlesuit', rarity: 'Legendary', level: 20, baseDef: 23, baseAtk: 1 },
    { name: 'Lead-Lined Poncho', rarity: 'Rare', level: 2, baseDef: 6 },
    { name: 'Riot Suppression Suit', rarity: 'Legendary', level: 6, baseDef: 11 },
    { name: 'Neutronium Plate', rarity: 'Common', level: 10, baseDef: 15 },
    { name: 'Monolith Exoskeleton', rarity: 'Uncommon', level: 14, baseDef: 19 },
    { name: 'Event Horizon Shell', rarity: 'Common', level: 18, baseDef: 23 },
    { name: 'Omega Fortress Armor', rarity: 'Epic', level: 20, baseDef: 26 },
    { name: 'Industrial Coveralls', rarity: 'Common', level: 15, baseDef: 13 },
    { name: 'Sewer Plate Carrier', rarity: 'Common', level: 19, baseDef: 16 },
    { name: 'Forklift Exo-Rig', rarity: 'Common', level: 20, baseDef: 17 },
    { name: 'Phantom Weave Vest', rarity: 'Legendary', level: 3, baseDef: 4 },
    { name: 'Starthread Robe', rarity: 'Legendary', level: 6, baseDef: 6 },
    { name: 'Wraithcloth Tunic', rarity: 'Epic', level: 4, baseDef: 5 },
    { name: 'Surplus Combat Jacket', rarity: 'Uncommon', level: 17, baseDef: 15 },
    // Frozen Wastes tier
    { name: 'Frostweave Coat', rarity: 'Rare', level: 22, baseDef: 24, findableAt: ['frostbite-outpost', 'blizzard-peak'] },
    { name: 'Glacier Plate', rarity: 'Epic', level: 25, baseDef: 27, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Heatshield Vest', rarity: 'Uncommon', level: 28, baseDef: 28, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Mail', rarity: 'Rare', level: 30, baseDef: 31, findableAt: ['magma-vents', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Sporeward Armor', rarity: 'Epic', level: 34, baseDef: 34, findableAt: ['fungal-hollow', 'venomous-thicket'] },
    { name: 'Rot Carapace', rarity: 'Common', level: 38, baseDef: 36, findableAt: ['plague-ponds', 'rot-core'] },
    // Abyssal Depths tier
    { name: 'Abyssal Mail', rarity: 'Rare', level: 40, baseDef: 38, findableAt: ['tidal-caves', 'pressure-rift'] },
    { name: 'Leviathan Plate', rarity: 'Legendary', level: 45, baseDef: 42, baseAtk: 2, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starweave Raiment', rarity: 'Epic', level: 50, baseDef: 46, findableAt: ['cloud-walkway', 'solar-fields'] },
    { name: 'Empyrean Battleplate', rarity: 'Rare', level: 55, baseDef: 50, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Warden Suit', rarity: 'Legendary', level: 58, baseDef: 53, findableAt: ['rifts-edge', 'entropy-garden'] },
    { name: 'Nullpoint Armor', rarity: 'Epic', level: 62, baseDef: 56, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Mantle', rarity: 'Legendary', level: 65, baseDef: 60, baseAtk: 3, findableAt: ['oblivion-throne'] },
    // Additional armor
    { name: 'Garbage Bag Poncho', rarity: 'Common', level: 1, baseDef: 3, findableAt: ['neon-mile'] },
    { name: 'Duct Tape Vest', rarity: 'Common', level: 3, baseDef: 5, findableAt: ['shadow-alley'] },
    { name: 'Tunnel Worker Jacket', rarity: 'Common', level: 6, baseDef: 7, findableAt: ['metro-underpass'] },
    { name: 'Scaffold Harness', rarity: 'Common', level: 9, baseDef: 10, findableAt: ['skyline-rooftops'] },
    { name: 'Smelter Apron', rarity: 'Common', level: 12, baseDef: 13, findableAt: ['ironworks-yard'] },
    { name: 'Night Shift Vest', rarity: 'Common', level: 16, baseDef: 16 },
    { name: 'Neon Leather Jacket', rarity: 'Uncommon', level: 2, baseDef: 5, findableAt: ['neon-mile'] },
    { name: 'Shadow Kevlar', rarity: 'Uncommon', level: 5, baseDef: 8, findableAt: ['metro-underpass'] },
    { name: 'Rooftop Runner Gear', rarity: 'Uncommon', level: 9, baseDef: 11 },
    { name: 'Tempered Iron Coat', rarity: 'Uncommon', level: 13, baseDef: 15 },
    { name: 'Permafrost Coat', rarity: 'Uncommon', level: 23, baseDef: 25, findableAt: ['frostbite-outpost'] },
    { name: 'Cinder Mail', rarity: 'Uncommon', level: 29, baseDef: 29, findableAt: ['sunscorch-canyon'] },
    { name: 'Fungal Hide Armor', rarity: 'Uncommon', level: 35, baseDef: 33, findableAt: ['fungal-hollow'] },
    { name: 'Pressurized Dive Suit', rarity: 'Uncommon', level: 42, baseDef: 37, findableAt: ['tidal-caves'] },
    { name: 'Constellation Weave', rarity: 'Uncommon', level: 52, baseDef: 45, findableAt: ['stormspire-tower'] },
    { name: 'Null Thread Robe', rarity: 'Uncommon', level: 60, baseDef: 52 },
    { name: 'Frost Plate Armor', rarity: 'Rare', level: 24, baseDef: 25, findableAt: ['crystal-caverns', 'permafrost-ruins'] },
    { name: 'Lava Forged Mail', rarity: 'Rare', level: 32, baseDef: 32, findableAt: ['inferno-pit'] },
    { name: 'Toxic Bark Armor', rarity: 'Rare', level: 36, baseDef: 35, findableAt: ['venomous-thicket'] },
    { name: 'Trench Plate', rarity: 'Rare', level: 43, baseDef: 39, findableAt: ['pressure-rift'] },
    { name: 'Nebula Silk Raiment', rarity: 'Rare', level: 53, baseDef: 48, findableAt: ['comets-trail'] },
    { name: 'Entropy Mantle', rarity: 'Rare', level: 61, baseDef: 54, findableAt: ['entropy-garden'] },
    { name: 'Blizzard Plate', rarity: 'Epic', level: 24, baseDef: 27, findableAt: ['blizzard-peak'] },
    { name: 'Volcanic Exoskeleton', rarity: 'Epic', level: 32, baseDef: 33, findableAt: ['volcanic-forge'] },
    { name: 'Plague Warden Suit', rarity: 'Epic', level: 37, baseDef: 36, baseAtk: 2, findableAt: ['rot-core'] },
    { name: 'Kraken Hide Armor', rarity: 'Epic', level: 44, baseDef: 41, findableAt: ['abyssal-trench'] },
    { name: 'Supernova Shell', rarity: 'Epic', level: 54, baseDef: 49, baseAtk: 2, findableAt: ['empyrean-gate'] },
    { name: 'Icy Cavern Mail', rarity: 'Common', level: 24, baseDef: 23, findableAt: ['glacier-tunnels'] },
    { name: 'Charred Plate Vest', rarity: 'Common', level: 31, baseDef: 28, findableAt: ['ashen-ruins'] },
    { name: 'Moss-Covered Chain', rarity: 'Common', level: 37, baseDef: 33, findableAt: ['bogs-edge'] },
    { name: 'Barnacle Mail', rarity: 'Common', level: 43, baseDef: 36, findableAt: ['sunken-bazaar'] },
    { name: 'Starweave Tunic', rarity: 'Common', level: 52, baseDef: 43, findableAt: ['cloud-walkway'] },
    { name: 'Null Plating', rarity: 'Common', level: 61, baseDef: 50, findableAt: ['null-chamber'] },
    // Class-specific armor
    { name: 'Rage-Tempered Harness', rarity: 'Rare', level: 14, baseDef: 16, baseAtk: 2, classes: ['berserker'], findableAt: ['ironworks-yard'] },
    { name: 'Warlord\'s Battle Plate', rarity: 'Epic', level: 42, baseDef: 41, baseAtk: 3, classes: ['berserker'], findableAt: ['sunken-bazaar'] },
    { name: 'Vanguard Fortress Plate', rarity: 'Rare', level: 30, baseDef: 31, classes: ['warrior'], findableAt: ['volcanic-forge'] },
    { name: 'Paragon Battleplate', rarity: 'Epic', level: 50, baseDef: 47, classes: ['warrior'], findableAt: ['solar-fields'] },
    { name: 'Shadow Silk Armor', rarity: 'Rare', level: 12, baseDef: 14, baseAtk: 1, classes: ['thief'], findableAt: ['ironworks-yard'] },
    { name: 'Nightrunner Vest', rarity: 'Epic', level: 38, baseDef: 36, baseAtk: 2, classes: ['thief'], findableAt: ['rot-core'] },
    { name: 'Ethereal Silk Robe', rarity: 'Rare', level: 20, baseDef: 22, classes: ['mage'], findableAt: ['glacier-tunnels'] },
    { name: 'Archmage\'s Vestment', rarity: 'Epic', level: 52, baseDef: 48, baseAtk: 2, classes: ['mage'], findableAt: ['stormspire-tower'] },
    { name: 'Graveweave Shroud', rarity: 'Rare', level: 18, baseDef: 20, classes: ['necromancer'], findableAt: ['midnight-terminal'] },
    { name: 'Blightborn Vestments', rarity: 'Epic', level: 45, baseDef: 42, baseAtk: 2, classes: ['necromancer'], findableAt: ['abyssal-trench'] },
  ]),
  boots: createGearList('boots', 'boots', [
    { name: 'Cracked Sandals', rarity: 'Epic', level: 1, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Street Sneakers', rarity: 'Common', level: 2, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Reinforced Work Boots', rarity: 'Uncommon', level: 3, baseDef: 2, findableAt: ['shadow-alley'] },
    { name: 'Courier Striders', rarity: 'Legendary', level: 4, baseDef: 2, baseAtk: 1 },
    { name: 'Chain-Lashed Greaves', rarity: 'Common', level: 5, baseDef: 3 },
    { name: 'Iron March Boots', rarity: 'Rare', level: 6, baseDef: 3, baseAtk: 1 },
    { name: 'Shock Dampers', rarity: 'Common', level: 7, baseDef: 4 },
    { name: 'Carbon Skates', rarity: 'Epic', level: 8, baseDef: 4, baseAtk: 1 },
    { name: 'Scout Talons', rarity: 'Common', level: 9, baseDef: 5 },
    { name: 'Dynamo Greaves', rarity: 'Legendary', level: 10, baseDef: 5, baseAtk: 1 },
    { name: 'Meteor Treads', rarity: 'Uncommon', level: 11, baseDef: 6 },
    { name: 'Stormsurge Boots', rarity: 'Rare', level: 12, baseDef: 6, baseAtk: 1 },
    { name: 'Phoenix Spurs', rarity: 'Common', level: 13, baseDef: 7, baseAtk: 1 },
    { name: 'Grav-null Boots', rarity: 'Uncommon', level: 14, baseDef: 7 },
    { name: 'Tempest Striders', rarity: 'Rare', level: 15, baseDef: 8 },
    { name: 'Voidstep Boots', rarity: 'Common', level: 16, baseDef: 8, baseAtk: 2 },
    { name: 'Celestial Walkers', rarity: 'Epic', level: 17, baseDef: 9 },
    { name: 'Chrono Greaves', rarity: 'Uncommon', level: 18, baseDef: 9, baseAtk: 1 },
    { name: 'Rift Sabatons', rarity: 'Rare', level: 19, baseDef: 10 },
    { name: 'Infinity Marchers', rarity: 'Legendary', level: 20, baseDef: 11, baseAtk: 2 },
    { name: 'Spike-Tipped Runners', rarity: 'Epic', level: 3, baseAtk: 2, baseDef: 1 },
    { name: 'Blitz Stompers', rarity: 'Legendary', level: 7, baseAtk: 3, baseDef: 2 },
    { name: 'Razor Striders', rarity: 'Common', level: 10, baseAtk: 4, baseDef: 3 },
    { name: 'Assault Thrusters', rarity: 'Uncommon', level: 14, baseAtk: 5, baseDef: 4 },
    { name: 'Havoc Tramples', rarity: 'Rare', level: 17, baseAtk: 6, baseDef: 5 },
    { name: 'Annihilation Treads', rarity: 'Common', level: 20, baseAtk: 8, baseDef: 5 },
    { name: 'Steel-Toed Waders', rarity: 'Common', level: 14, baseDef: 6 },
    { name: 'Foundry Stompers', rarity: 'Common', level: 18, baseDef: 8 },
    { name: 'Concrete Crushers', rarity: 'Common', level: 20, baseDef: 9 },
    { name: 'Phantom Step Wraps', rarity: 'Legendary', level: 2, baseDef: 1, baseAtk: 1 },
    { name: 'Holo-Sprint Anklets', rarity: 'Legendary', level: 5, baseDef: 2, baseAtk: 2 },
    { name: 'Flickerstep Sandals', rarity: 'Epic', level: 3, baseDef: 2, baseAtk: 1 },
    { name: 'Patched Running Shoes', rarity: 'Uncommon', level: 16, baseDef: 7 },
    // Frozen Wastes tier
    { name: 'Frostmarch Boots', rarity: 'Rare', level: 22, baseDef: 11, baseAtk: 2, findableAt: ['frostbite-outpost', 'glacier-tunnels'] },
    { name: 'Glacier Treads', rarity: 'Epic', level: 25, baseDef: 13, baseAtk: 2, findableAt: ['blizzard-peak', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Magma Stompers', rarity: 'Uncommon', level: 28, baseDef: 14, findableAt: ['ember-flats', 'magma-vents'] },
    { name: 'Volcanic Greaves', rarity: 'Rare', level: 30, baseDef: 15, baseAtk: 3, findableAt: ['inferno-pit', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Bogwalker Boots', rarity: 'Epic', level: 34, baseDef: 16, baseAtk: 3, findableAt: ['bogs-edge', 'mire-depths'] },
    { name: 'Rot Striders', rarity: 'Common', level: 38, baseDef: 18, findableAt: ['plague-ponds', 'rot-core'] },
    // Abyssal Depths tier
    { name: 'Tidal Walkers', rarity: 'Rare', level: 40, baseDef: 19, baseAtk: 3, findableAt: ['tidal-caves', 'sunken-bazaar'] },
    { name: 'Leviathan Sabatons', rarity: 'Legendary', level: 45, baseDef: 22, baseAtk: 4, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starstrider Boots', rarity: 'Epic', level: 50, baseDef: 24, baseAtk: 4, findableAt: ['cloud-walkway', 'astral-gardens'] },
    { name: 'Empyrean Walkers', rarity: 'Rare', level: 55, baseDef: 26, baseAtk: 5, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Step Boots', rarity: 'Legendary', level: 58, baseDef: 28, baseAtk: 5, findableAt: ['rifts-edge', 'null-chamber'] },
    { name: 'Nullpoint Treads', rarity: 'Epic', level: 62, baseDef: 30, baseAtk: 6, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Marchers', rarity: 'Legendary', level: 65, baseDef: 33, baseAtk: 7, findableAt: ['oblivion-throne'] },
    // Additional boots
    { name: 'Worn Flip-Flops', rarity: 'Common', level: 1, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Gutter Waders', rarity: 'Common', level: 3, baseDef: 2, findableAt: ['shadow-alley'] },
    { name: 'Subway Treads', rarity: 'Common', level: 6, baseDef: 3, findableAt: ['metro-underpass'] },
    { name: 'Skyline Grippers', rarity: 'Common', level: 8, baseDef: 4, findableAt: ['skyline-rooftops'] },
    { name: 'Mill Floor Boots', rarity: 'Common', level: 12, baseDef: 6, findableAt: ['ironworks-yard'] },
    { name: 'Terminal Runners', rarity: 'Common', level: 16, baseDef: 8 },
    { name: 'Neon Sole Kicks', rarity: 'Uncommon', level: 2, baseDef: 1, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Catfoot Slippers', rarity: 'Uncommon', level: 5, baseDef: 3, findableAt: ['metro-underpass'] },
    { name: 'Voltage Treads', rarity: 'Uncommon', level: 9, baseDef: 5, baseAtk: 1 },
    { name: 'Chrome Greaves', rarity: 'Uncommon', level: 13, baseDef: 7 },
    { name: 'Snowshoe Boots', rarity: 'Uncommon', level: 23, baseDef: 12, findableAt: ['frostbite-outpost'] },
    { name: 'Heat-Resistant Treads', rarity: 'Uncommon', level: 29, baseDef: 14, baseAtk: 2, findableAt: ['ember-flats'] },
    { name: 'Swamp Stalker Boots', rarity: 'Uncommon', level: 35, baseDef: 16, baseAtk: 2, findableAt: ['mire-depths'] },
    { name: 'Coral-Soled Boots', rarity: 'Uncommon', level: 42, baseDef: 19, baseAtk: 3, findableAt: ['sunken-bazaar'] },
    { name: 'Skywalker Boots', rarity: 'Uncommon', level: 52, baseDef: 24, baseAtk: 4, findableAt: ['cloud-walkway'] },
    { name: 'Phase Shift Boots', rarity: 'Uncommon', level: 60, baseDef: 28, baseAtk: 5 },
    { name: 'Icebreaker Greaves', rarity: 'Rare', level: 24, baseDef: 12, baseAtk: 2, findableAt: ['crystal-caverns'] },
    { name: 'Magma Walker Boots', rarity: 'Rare', level: 32, baseDef: 15, baseAtk: 3, findableAt: ['volcanic-forge'] },
    { name: 'Blight Stalkers', rarity: 'Rare', level: 36, baseDef: 17, baseAtk: 3, findableAt: ['plague-ponds'] },
    { name: 'Deep Pressure Boots', rarity: 'Rare', level: 43, baseDef: 20, baseAtk: 3, findableAt: ['pressure-rift'] },
    { name: 'Comet Dust Striders', rarity: 'Rare', level: 53, baseDef: 25, baseAtk: 5, findableAt: ['comets-trail'] },
    { name: 'Entropy Walkers', rarity: 'Rare', level: 60, baseDef: 29, baseAtk: 5, findableAt: ['entropy-garden'] },
    { name: 'Blizzard Stompers', rarity: 'Epic', level: 24, baseDef: 13, baseAtk: 2, findableAt: ['blizzard-peak'] },
    { name: 'Volcanic Jet Boots', rarity: 'Epic', level: 32, baseDef: 16, baseAtk: 3, findableAt: ['inferno-pit'] },
    { name: 'Plague Striders', rarity: 'Epic', level: 37, baseDef: 18, baseAtk: 3, findableAt: ['rot-core'] },
    { name: 'Leviathan Fin Boots', rarity: 'Epic', level: 44, baseDef: 21, baseAtk: 4, findableAt: ['krakens-rest'] },
    { name: 'Supernova Walkers', rarity: 'Epic', level: 54, baseDef: 26, baseAtk: 5, findableAt: ['empyrean-gate'] },
    { name: 'Tundra Stompers', rarity: 'Common', level: 24, baseDef: 10, findableAt: ['permafrost-ruins'] },
    { name: 'Scorchland Boots', rarity: 'Common', level: 31, baseDef: 13, findableAt: ['ashen-ruins'] },
    { name: 'Marsh Wader Boots', rarity: 'Common', level: 37, baseDef: 16, findableAt: ['bogs-edge'] },
    { name: 'Tidepull Boots', rarity: 'Common', level: 43, baseDef: 18, findableAt: ['tidal-caves'] },
    { name: 'Star Trail Boots', rarity: 'Common', level: 52, baseDef: 22, findableAt: ['astral-gardens'] },
    { name: 'Null Walk Treads', rarity: 'Common', level: 61, baseDef: 27, findableAt: ['null-chamber'] },
  ]),
  ring: createGearList('accessory', 'ring', [
    { name: 'Copper Ring', rarity: 'Legendary', level: 1, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Wired Loop', rarity: 'Rare', level: 2, baseAtk: 1, baseDef: 1, findableAt: ['neon-mile', 'shadow-alley'] },
    { name: 'Scrap Charm', rarity: 'Common', level: 3, baseAtk: 1, baseDef: 1, findableAt: ['shadow-alley'] },
    { name: 'Fiber Bracelet', rarity: 'Epic', level: 4, baseAtk: 2, baseDef: 1 },
    { name: 'Chainlink Pendant', rarity: 'Common', level: 5, baseAtk: 2, baseDef: 1 },
    { name: 'Silver Band', rarity: 'Common', level: 6, baseAtk: 2, baseDef: 2 },
    { name: 'Static Anklet', rarity: 'Rare', level: 7, baseAtk: 3, baseDef: 1 },
    { name: 'Neon Choker', rarity: 'Legendary', level: 8, baseAtk: 3, baseDef: 2 },
    { name: 'Dynamo Locket', rarity: 'Common', level: 9, baseAtk: 4, baseDef: 2 },
    { name: 'Quartz Signet', rarity: 'Uncommon', level: 10, baseAtk: 4, baseDef: 3 },
    { name: 'Reactor Torque', rarity: 'Epic', level: 11, baseAtk: 5, baseDef: 2 },
    { name: 'Stormcall Ring', rarity: 'Common', level: 12, baseAtk: 5, baseDef: 3 },
    { name: 'Phoenix Emblem', rarity: 'Uncommon', level: 13, baseAtk: 6, baseDef: 3 },
    { name: 'Void Harmonizer', rarity: 'Rare', level: 14, baseAtk: 6, baseDef: 4 },
    { name: 'Celestial Prism', rarity: 'Common', level: 15, baseAtk: 7, baseDef: 4 },
    { name: 'Chrono Loop', rarity: 'Rare', level: 16, baseAtk: 8, baseDef: 4 },
    { name: 'Nova Signet', rarity: 'Uncommon', level: 17, baseAtk: 8, baseDef: 5 },
    { name: 'Infinity Anklet', rarity: 'Epic', level: 18, baseAtk: 9, baseDef: 5 },
    { name: 'Singularity Charm', rarity: 'Uncommon', level: 19, baseAtk: 10, baseDef: 5 },
    { name: 'Paradox Halo', rarity: 'Legendary', level: 20, baseAtk: 11, baseDef: 6 },
    { name: 'Jagged Tooth Necklace', rarity: 'Rare', level: 1, baseAtk: 2 },
    { name: 'Voltage Coil', rarity: 'Epic', level: 3, baseAtk: 3 },
    { name: 'Razorwire Bracelet', rarity: 'Legendary', level: 6, baseAtk: 4, baseDef: 1 },
    { name: 'Plasma Core Pendant', rarity: 'Common', level: 9, baseAtk: 6, baseDef: 1 },
    { name: 'Warcry Amplifier', rarity: 'Uncommon', level: 12, baseAtk: 7, baseDef: 2 },
    { name: 'Berserker Torque', rarity: 'Common', level: 15, baseAtk: 9, baseDef: 2 },
    { name: 'Destruction Matrix', rarity: 'Uncommon', level: 18, baseAtk: 11, baseDef: 3 },
    { name: 'Apocalypse Sigil', rarity: 'Rare', level: 20, baseAtk: 13, baseDef: 3 },
    { name: 'Iron Wristguard', rarity: 'Epic', level: 2, baseDef: 2, baseAtk: 1 },
    { name: 'Hardened Amulet', rarity: 'Legendary', level: 4, baseDef: 3 },
    { name: 'Dampening Coil', rarity: 'Common', level: 7, baseDef: 4, baseAtk: 1 },
    { name: 'Shield Emitter Band', rarity: 'Uncommon', level: 10, baseDef: 5, baseAtk: 2 },
    { name: 'Aegis Frequency Ring', rarity: 'Common', level: 12, baseDef: 6, baseAtk: 2 },
    { name: 'Bastion Core', rarity: 'Rare', level: 15, baseDef: 7, baseAtk: 3 },
    { name: 'Immortal Shell Locket', rarity: 'Common', level: 18, baseDef: 9, baseAtk: 3 },
    { name: 'Eternity Ward Halo', rarity: 'Uncommon', level: 20, baseDef: 10, baseAtk: 4 },
    { name: 'Bent Nail Pendant', rarity: 'Common', level: 13, baseAtk: 4, baseDef: 3 },
    { name: 'Duct Tape Bracelet', rarity: 'Common', level: 16, baseAtk: 5, baseDef: 4 },
    { name: 'Rebar Knuckle Ring', rarity: 'Common', level: 19, baseAtk: 6, baseDef: 5 },
    { name: 'Junkyard Dog Tags', rarity: 'Common', level: 20, baseAtk: 7, baseDef: 5 },
    { name: 'Glitch Prism', rarity: 'Legendary', level: 1, baseAtk: 1, baseDef: 1 },
    { name: 'Neon Ghost Locket', rarity: 'Legendary', level: 4, baseAtk: 2, baseDef: 1 },
    { name: 'Starfall Shard', rarity: 'Legendary', level: 7, baseAtk: 3, baseDef: 2 },
    { name: 'Wraithbone Charm', rarity: 'Epic', level: 2, baseAtk: 1, baseDef: 1 },
    { name: 'Pixelated Amulet', rarity: 'Epic', level: 5, baseAtk: 2, baseDef: 2 },
    { name: 'Cursed Lucky Penny', rarity: 'Epic', level: 8, baseAtk: 3, baseDef: 2 },
    { name: 'Faded Heirloom Ring', rarity: 'Rare', level: 1, baseAtk: 1 },
    { name: 'Recycled Coil Band', rarity: 'Rare', level: 16, baseAtk: 6, baseDef: 3 },
    { name: 'Jury-Rigged Scope', rarity: 'Uncommon', level: 15, baseAtk: 5, baseDef: 3 },
    { name: 'Cracked Data Chip', rarity: 'Uncommon', level: 18, baseAtk: 6, baseDef: 4 },
    // Frozen Wastes tier
    { name: 'Frostcore Pendant', rarity: 'Rare', level: 22, baseAtk: 12, baseDef: 6, findableAt: ['frostbite-outpost', 'permafrost-ruins'] },
    { name: 'Glacier Heart Ring', rarity: 'Epic', level: 25, baseAtk: 14, baseDef: 7, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Ember Signet', rarity: 'Uncommon', level: 28, baseAtk: 15, baseDef: 7, findableAt: ['ember-flats', 'ashen-ruins'] },
    { name: 'Volcanic Core Amulet', rarity: 'Rare', level: 30, baseAtk: 16, baseDef: 8, findableAt: ['inferno-pit', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Toxin Ward Band', rarity: 'Epic', level: 34, baseAtk: 18, baseDef: 9, findableAt: ['mire-depths', 'venomous-thicket'] },
    { name: 'Rot Charm', rarity: 'Common', level: 38, baseAtk: 19, baseDef: 10, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Tidal Charm', rarity: 'Rare', level: 40, baseAtk: 20, baseDef: 10, findableAt: ['tidal-caves', 'coral-labyrinth'] },
    { name: 'Leviathan Eye Ring', rarity: 'Legendary', level: 45, baseAtk: 22, baseDef: 12, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starfall Pendant', rarity: 'Epic', level: 50, baseAtk: 24, baseDef: 13, findableAt: ['stormspire-tower', 'astral-gardens'] },
    { name: 'Empyrean Sigil', rarity: 'Rare', level: 55, baseAtk: 26, baseDef: 14, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Shard Locket', rarity: 'Legendary', level: 58, baseAtk: 28, baseDef: 15, findableAt: ['rifts-edge', 'entropy-garden'] },
    { name: 'Nullpoint Ring', rarity: 'Epic', level: 62, baseAtk: 30, baseDef: 16, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Halo', rarity: 'Legendary', level: 65, baseAtk: 33, baseDef: 18, findableAt: ['oblivion-throne'] },
    // Additional rings/accessories
    { name: 'Paperclip Chain', rarity: 'Common', level: 1, baseAtk: 1, baseDef: 0, findableAt: ['neon-mile'] },
    { name: 'Bottle Cap Pendant', rarity: 'Common', level: 3, baseAtk: 1, baseDef: 1, findableAt: ['shadow-alley'] },
    { name: 'Subway Token Ring', rarity: 'Common', level: 6, baseAtk: 2, baseDef: 2, findableAt: ['metro-underpass'] },
    { name: 'Lightning Rod Band', rarity: 'Common', level: 8, baseAtk: 3, baseDef: 2 },
    { name: 'Cog Tooth Charm', rarity: 'Common', level: 11, baseAtk: 4, baseDef: 3, findableAt: ['ironworks-yard'] },
    { name: 'Midnight Signal Ring', rarity: 'Common', level: 14, baseAtk: 5, baseDef: 3 },
    { name: 'Neon Wire Bracelet', rarity: 'Uncommon', level: 2, baseAtk: 1, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Shadow Charm', rarity: 'Uncommon', level: 5, baseAtk: 2, baseDef: 2, findableAt: ['shadow-alley'] },
    { name: 'Relay Coil Band', rarity: 'Uncommon', level: 8, baseAtk: 3, baseDef: 2 },
    { name: 'Arc Frequency Ring', rarity: 'Uncommon', level: 13, baseAtk: 5, baseDef: 3 },
    { name: 'Frostbitten Pendant', rarity: 'Uncommon', level: 23, baseAtk: 13, baseDef: 6, findableAt: ['frostbite-outpost'] },
    { name: 'Ember Core Ring', rarity: 'Uncommon', level: 29, baseAtk: 15, baseDef: 7, findableAt: ['sunscorch-canyon'] },
    { name: 'Spore Charm', rarity: 'Uncommon', level: 35, baseAtk: 17, baseDef: 8, findableAt: ['venomous-thicket'] },
    { name: 'Pearl Amulet', rarity: 'Uncommon', level: 42, baseAtk: 19, baseDef: 10, findableAt: ['sunken-bazaar'] },
    { name: 'Astral Band', rarity: 'Uncommon', level: 52, baseAtk: 23, baseDef: 12, findableAt: ['astral-gardens'] },
    { name: 'Null Frequency Ring', rarity: 'Uncommon', level: 60, baseAtk: 27, baseDef: 14 },
    { name: 'Ice Crystal Signet', rarity: 'Rare', level: 24, baseAtk: 13, baseDef: 6, findableAt: ['crystal-caverns'] },
    { name: 'Magma Heart Amulet', rarity: 'Rare', level: 32, baseAtk: 17, baseDef: 8, findableAt: ['volcanic-forge'] },
    { name: 'Blight Ward Band', rarity: 'Rare', level: 36, baseAtk: 19, baseDef: 9, findableAt: ['plague-ponds'] },
    { name: 'Abyssal Pearl Ring', rarity: 'Rare', level: 43, baseAtk: 21, baseDef: 11, findableAt: ['pressure-rift'] },
    { name: 'Comet Shard Pendant', rarity: 'Rare', level: 53, baseAtk: 25, baseDef: 13, findableAt: ['comets-trail'] },
    { name: 'Entropy Loop', rarity: 'Rare', level: 60, baseAtk: 29, baseDef: 15, findableAt: ['entropy-garden'] },
    { name: 'Avalanche Core Ring', rarity: 'Epic', level: 24, baseAtk: 14, baseDef: 7, findableAt: ['blizzard-peak'] },
    { name: 'Volcanic Heart', rarity: 'Epic', level: 32, baseAtk: 18, baseDef: 9, findableAt: ['inferno-pit'] },
    { name: 'Plague Signet', rarity: 'Epic', level: 37, baseAtk: 20, baseDef: 10, findableAt: ['rot-core'] },
    { name: 'Kraken Tooth Charm', rarity: 'Epic', level: 44, baseAtk: 22, baseDef: 12, findableAt: ['abyssal-trench'] },
    { name: 'Solar Core Pendant', rarity: 'Epic', level: 54, baseAtk: 26, baseDef: 14, findableAt: ['empyrean-gate'] },
    { name: 'Frozen Trinket', rarity: 'Common', level: 24, baseAtk: 11, baseDef: 5, findableAt: ['glacier-tunnels'] },
    { name: 'Charred Bone Ring', rarity: 'Common', level: 31, baseAtk: 14, baseDef: 7, findableAt: ['ashen-ruins'] },
    { name: 'Bog Bead Necklace', rarity: 'Common', level: 37, baseAtk: 17, baseDef: 8, findableAt: ['bogs-edge'] },
    { name: 'Shell Fragment Charm', rarity: 'Common', level: 43, baseAtk: 19, baseDef: 9, findableAt: ['coral-labyrinth'] },
    { name: 'Starlight Trinket', rarity: 'Common', level: 52, baseAtk: 22, baseDef: 11, findableAt: ['cloud-walkway'] },
    { name: 'Void Fragment Ring', rarity: 'Common', level: 61, baseAtk: 26, baseDef: 13, findableAt: ['rifts-edge'] },
  ]),
  gloves: createGearList('gloves', 'gloves', [
    // Neon District tier
    { name: 'Fingerless Street Gloves', rarity: 'Common', level: 1, baseDef: 1, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Rubber Work Gloves', rarity: 'Common', level: 2, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Scrap Knuckle Guards', rarity: 'Uncommon', level: 2, baseDef: 1, baseAtk: 2, findableAt: ['neon-mile'] },
    { name: 'Neon Grip Gloves', rarity: 'Rare', level: 3, baseDef: 2, baseAtk: 2, findableAt: ['neon-mile'] },
    { name: 'Holographic Handwraps', rarity: 'Legendary', level: 2, baseDef: 2, baseAtk: 2, findableAt: ['neon-mile'] },
    // Shadow Alley tier
    { name: 'Pickpocket Mitts', rarity: 'Common', level: 3, baseDef: 2, baseAtk: 1, findableAt: ['shadow-alley'] },
    { name: 'Shadow Grip Gauntlets', rarity: 'Uncommon', level: 4, baseDef: 2, baseAtk: 2, findableAt: ['shadow-alley'] },
    { name: 'Razorwire Gloves', rarity: 'Rare', level: 4, baseDef: 2, baseAtk: 3, findableAt: ['shadow-alley'] },
    { name: 'Phantom Touch Wraps', rarity: 'Epic', level: 4, baseDef: 3, baseAtk: 3, findableAt: ['shadow-alley'] },
    { name: 'Ghostweave Gloves', rarity: 'Legendary', level: 3, baseDef: 3, baseAtk: 2, findableAt: ['shadow-alley'] },
    // Metro Underpass tier
    { name: 'Tunnel Digger Gauntlets', rarity: 'Common', level: 5, baseDef: 3, baseAtk: 2, findableAt: ['metro-underpass'] },
    { name: 'Copper-Plated Fists', rarity: 'Uncommon', level: 6, baseDef: 3, baseAtk: 3, findableAt: ['metro-underpass'] },
    { name: 'Shock Conductor Gloves', rarity: 'Rare', level: 6, baseDef: 3, baseAtk: 4, findableAt: ['metro-underpass'] },
    { name: 'Arc Discharge Gauntlets', rarity: 'Epic', level: 7, baseDef: 4, baseAtk: 4, findableAt: ['metro-underpass'] },
    { name: 'Tesla Grip', rarity: 'Legendary', level: 6, baseDef: 4, baseAtk: 4, findableAt: ['metro-underpass'] },
    // Skyline Rooftops tier
    { name: 'Climbing Grip Gloves', rarity: 'Common', level: 8, baseDef: 4, baseAtk: 3, findableAt: ['skyline-rooftops'] },
    { name: 'Carbon Fiber Handguards', rarity: 'Uncommon', level: 9, baseDef: 5, baseAtk: 3, findableAt: ['skyline-rooftops'] },
    { name: 'Grapple Gauntlets', rarity: 'Rare', level: 9, baseDef: 4, baseAtk: 5, findableAt: ['skyline-rooftops'] },
    { name: 'Windshear Handwraps', rarity: 'Epic', level: 10, baseDef: 5, baseAtk: 5, findableAt: ['skyline-rooftops'] },
    // Ironworks Yard tier
    { name: 'Foundry Mittens', rarity: 'Common', level: 11, baseDef: 6, baseAtk: 4, findableAt: ['ironworks-yard'] },
    { name: 'Alloy-Plated Gauntlets', rarity: 'Uncommon', level: 12, baseDef: 6, baseAtk: 5, findableAt: ['ironworks-yard'] },
    { name: 'Forgehammer Fists', rarity: 'Rare', level: 12, baseDef: 6, baseAtk: 6, findableAt: ['ironworks-yard'] },
    { name: 'Magma-Touched Grips', rarity: 'Epic', level: 13, baseDef: 7, baseAtk: 6, findableAt: ['ironworks-yard'] },
    // Midnight Terminal tier
    { name: 'Midnight Grip Gloves', rarity: 'Common', level: 14, baseDef: 7, baseAtk: 5, findableAt: ['midnight-terminal'] },
    { name: 'Data Stream Gauntlets', rarity: 'Uncommon', level: 15, baseDef: 8, baseAtk: 6 },
    { name: 'Neon Pulse Fists', rarity: 'Rare', level: 16, baseDef: 8, baseAtk: 7, findableAt: ['midnight-terminal'] },
    { name: 'Void Grip Gauntlets', rarity: 'Epic', level: 17, baseDef: 9, baseAtk: 8, findableAt: ['midnight-terminal'] },
    { name: 'Singularity Grasp', rarity: 'Legendary', level: 20, baseDef: 10, baseAtk: 9 },
    // Frozen Wastes tier
    { name: 'Frostbite Gauntlets', rarity: 'Rare', level: 22, baseDef: 11, baseAtk: 8, findableAt: ['frostbite-outpost', 'glacier-tunnels'] },
    { name: 'Glacier Grip', rarity: 'Epic', level: 25, baseDef: 13, baseAtk: 10, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    { name: 'Permafrost Mittens', rarity: 'Uncommon', level: 23, baseDef: 12, baseAtk: 7, findableAt: ['permafrost-ruins'] },
    { name: 'Avalanche Fists', rarity: 'Epic', level: 24, baseDef: 12, baseAtk: 9, findableAt: ['blizzard-peak'] },
    // Scorched Badlands tier
    { name: 'Ember Gauntlets', rarity: 'Uncommon', level: 28, baseDef: 14, baseAtk: 10, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Fists', rarity: 'Rare', level: 30, baseDef: 15, baseAtk: 12, findableAt: ['magma-vents', 'volcanic-forge'] },
    { name: 'Inferno Grips', rarity: 'Epic', level: 32, baseDef: 16, baseAtk: 13, findableAt: ['inferno-pit'] },
    // Toxic Marshlands tier
    { name: 'Spore-Coated Gloves', rarity: 'Uncommon', level: 35, baseDef: 16, baseAtk: 12, findableAt: ['fungal-hollow'] },
    { name: 'Venomweave Gauntlets', rarity: 'Epic', level: 34, baseDef: 17, baseAtk: 14, findableAt: ['venomous-thicket', 'plague-ponds'] },
    { name: 'Rot Touch Mitts', rarity: 'Common', level: 38, baseDef: 18, baseAtk: 13, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Coral Knuckle Guards', rarity: 'Rare', level: 40, baseDef: 19, baseAtk: 15, findableAt: ['coral-labyrinth', 'tidal-caves'] },
    { name: 'Leviathan Scale Gloves', rarity: 'Legendary', level: 45, baseDef: 22, baseAtk: 17, findableAt: ['krakens-rest', 'abyssal-trench'] },
    { name: 'Pressure Gauntlets', rarity: 'Uncommon', level: 42, baseDef: 19, baseAtk: 14, findableAt: ['pressure-rift'] },
    // Celestial Highlands tier
    { name: 'Starforged Gauntlets', rarity: 'Epic', level: 50, baseDef: 24, baseAtk: 19, findableAt: ['solar-fields', 'astral-gardens'] },
    { name: 'Empyrean Handguards', rarity: 'Rare', level: 55, baseDef: 26, baseAtk: 21, findableAt: ['comets-trail', 'empyrean-gate'] },
    { name: 'Cloud-Touched Gloves', rarity: 'Uncommon', level: 52, baseDef: 24, baseAtk: 18, findableAt: ['cloud-walkway'] },
    // Void Nexus tier
    { name: 'Rift Weaver Gloves', rarity: 'Legendary', level: 58, baseDef: 28, baseAtk: 22, findableAt: ['rifts-edge', 'entropy-garden'] },
    { name: 'Nullpoint Gauntlets', rarity: 'Epic', level: 62, baseDef: 30, baseAtk: 24, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Grip', rarity: 'Legendary', level: 65, baseDef: 33, baseAtk: 26, findableAt: ['oblivion-throne'] },
    // Berserker gloves
    { name: 'Spiked Rage Gauntlets', rarity: 'Common', level: 4, baseDef: 2, baseAtk: 3, classes: ['berserker'], findableAt: ['shadow-alley'] },
    { name: 'Bloodknuckle Wraps', rarity: 'Uncommon', level: 10, baseDef: 5, baseAtk: 6, classes: ['berserker'], findableAt: ['skyline-rooftops'] },
    { name: 'Fury-Plated Fists', rarity: 'Rare', level: 18, baseDef: 9, baseAtk: 10, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Wrath Engine Gauntlets', rarity: 'Epic', level: 28, baseDef: 14, baseAtk: 13, classes: ['berserker'], findableAt: ['sunscorch-canyon'] },
    { name: 'Titan Smash Fists', rarity: 'Rare', level: 38, baseDef: 18, baseAtk: 15, classes: ['berserker'], findableAt: ['rot-core'] },
    { name: 'Doombreaker Gauntlets', rarity: 'Epic', level: 50, baseDef: 24, baseAtk: 20, classes: ['berserker'], findableAt: ['solar-fields'] },
    { name: 'Apocalypse Knuckles', rarity: 'Legendary', level: 60, baseDef: 30, baseAtk: 24, classes: ['berserker'], findableAt: ['entropy-garden'] },
    // Warrior gloves
    { name: 'Recruit\'s Gauntlets', rarity: 'Common', level: 4, baseDef: 3, baseAtk: 1, classes: ['warrior'], findableAt: ['shadow-alley'] },
    { name: 'Iron Guard Gloves', rarity: 'Uncommon', level: 10, baseDef: 6, baseAtk: 4, classes: ['warrior'], findableAt: ['skyline-rooftops'] },
    { name: 'Bastion Gauntlets', rarity: 'Rare', level: 20, baseDef: 10, baseAtk: 8, classes: ['warrior'], findableAt: ['glacier-tunnels'] },
    { name: 'Fortress Plate Gloves', rarity: 'Epic', level: 30, baseDef: 16, baseAtk: 12, classes: ['warrior'], findableAt: ['volcanic-forge'] },
    { name: 'Champion\'s Gauntlets', rarity: 'Rare', level: 42, baseDef: 20, baseAtk: 15, classes: ['warrior'], findableAt: ['sunken-bazaar'] },
    { name: 'Paladin\'s Grip', rarity: 'Epic', level: 55, baseDef: 27, baseAtk: 21, classes: ['warrior'], findableAt: ['empyrean-gate'] },
    { name: 'Aegis Commander Gloves', rarity: 'Legendary', level: 63, baseDef: 31, baseAtk: 25, classes: ['warrior'], findableAt: ['singularity-well'] },
    // Thief gloves
    { name: 'Cutpurse Gloves', rarity: 'Common', level: 3, baseDef: 1, baseAtk: 2, classes: ['thief'], findableAt: ['shadow-alley'] },
    { name: 'Lockpick Finger Wraps', rarity: 'Uncommon', level: 8, baseDef: 4, baseAtk: 5, classes: ['thief'], findableAt: ['skyline-rooftops'] },
    { name: 'Silent Strike Gloves', rarity: 'Rare', level: 16, baseDef: 8, baseAtk: 9, classes: ['thief'], findableAt: ['midnight-terminal'] },
    { name: 'Shadowstep Handwraps', rarity: 'Epic', level: 26, baseDef: 13, baseAtk: 12, classes: ['thief'], findableAt: ['magma-vents'] },
    { name: 'Phantom Grip Gloves', rarity: 'Rare', level: 36, baseDef: 17, baseAtk: 14, classes: ['thief'], findableAt: ['plague-ponds'] },
    { name: 'Nightblade Gauntlets', rarity: 'Epic', level: 48, baseDef: 23, baseAtk: 19, classes: ['thief'], findableAt: ['krakens-rest'] },
    { name: 'Master Assassin Wraps', rarity: 'Legendary', level: 61, baseDef: 29, baseAtk: 23, classes: ['thief'], findableAt: ['null-chamber'] },
    // Mage gloves
    { name: 'Apprentice Channelers', rarity: 'Common', level: 5, baseDef: 2, baseAtk: 3, classes: ['mage'], findableAt: ['metro-underpass'] },
    { name: 'Ether-Woven Gloves', rarity: 'Uncommon', level: 12, baseDef: 6, baseAtk: 5, classes: ['mage'], findableAt: ['ironworks-yard'] },
    { name: 'Mystic Focus Wraps', rarity: 'Rare', level: 22, baseDef: 11, baseAtk: 9, classes: ['mage'], findableAt: ['permafrost-ruins'] },
    { name: 'Arcane Conduit Gloves', rarity: 'Epic', level: 34, baseDef: 17, baseAtk: 14, classes: ['mage'], findableAt: ['venomous-thicket'] },
    { name: 'Celestial Touch Wraps', rarity: 'Rare', level: 44, baseDef: 21, baseAtk: 17, classes: ['mage'], findableAt: ['abyssal-trench'] },
    { name: 'Starweaver Gloves', rarity: 'Epic', level: 56, baseDef: 28, baseAtk: 22, classes: ['mage'], findableAt: ['empyrean-gate'] },
    { name: 'Cosmic Channelers', rarity: 'Legendary', level: 64, baseDef: 32, baseAtk: 25, classes: ['mage'], findableAt: ['oblivion-throne'] },
    // Necromancer gloves
    { name: 'Gravedigger Mitts', rarity: 'Common', level: 5, baseDef: 2, baseAtk: 3, classes: ['necromancer'], findableAt: ['metro-underpass'] },
    { name: 'Deathtouch Wraps', rarity: 'Uncommon', level: 11, baseDef: 5, baseAtk: 6, classes: ['necromancer'], findableAt: ['ironworks-yard'] },
    { name: 'Blightweave Gloves', rarity: 'Rare', level: 20, baseDef: 10, baseAtk: 9, classes: ['necromancer'], findableAt: ['glacier-tunnels'] },
    { name: 'Soul Siphon Gauntlets', rarity: 'Epic', level: 32, baseDef: 16, baseAtk: 13, classes: ['necromancer'], findableAt: ['inferno-pit'] },
    { name: 'Plague Doctor Gloves', rarity: 'Rare', level: 40, baseDef: 19, baseAtk: 15, classes: ['necromancer'], findableAt: ['coral-labyrinth'] },
    { name: 'Lichborne Grippers', rarity: 'Epic', level: 52, baseDef: 25, baseAtk: 20, classes: ['necromancer'], findableAt: ['stormspire-tower'] },
    { name: 'Void Grasp Gauntlets', rarity: 'Legendary', level: 62, baseDef: 31, baseAtk: 24, classes: ['necromancer'], findableAt: ['singularity-well'] },
  ]),
  amulet: createGearList('amulet', 'amulet', [
    // Neon District tier
    { name: 'Twisted Wire Pendant', rarity: 'Common', level: 1, baseAtk: 1, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Neon Shard Necklace', rarity: 'Uncommon', level: 2, baseAtk: 2, baseDef: 1, findableAt: ['neon-mile'] },
    { name: 'Glowing Circuit Amulet', rarity: 'Rare', level: 3, baseAtk: 2, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Hologram Locket', rarity: 'Legendary', level: 2, baseAtk: 2, baseDef: 2, findableAt: ['neon-mile'] },
    // Shadow Alley tier
    { name: 'Tarnished Medallion', rarity: 'Common', level: 3, baseAtk: 2, baseDef: 1, findableAt: ['shadow-alley'] },
    { name: 'Shadow Fang Pendant', rarity: 'Uncommon', level: 4, baseAtk: 2, baseDef: 2, findableAt: ['shadow-alley'] },
    { name: 'Obsidian Eye Amulet', rarity: 'Epic', level: 4, baseAtk: 3, baseDef: 2, findableAt: ['shadow-alley'] },
    { name: 'Nightshade Choker', rarity: 'Legendary', level: 4, baseAtk: 3, baseDef: 3, findableAt: ['shadow-alley'] },
    // Metro Underpass tier
    { name: 'Subway Token Necklace', rarity: 'Common', level: 5, baseAtk: 3, baseDef: 2, findableAt: ['metro-underpass'] },
    { name: 'Charged Coil Pendant', rarity: 'Uncommon', level: 6, baseAtk: 3, baseDef: 3, findableAt: ['metro-underpass'] },
    { name: 'Arc Reactor Amulet', rarity: 'Rare', level: 7, baseAtk: 4, baseDef: 3, findableAt: ['metro-underpass'] },
    { name: 'Thundercore Pendant', rarity: 'Epic', level: 7, baseAtk: 5, baseDef: 3, findableAt: ['metro-underpass'] },
    // Skyline Rooftops tier
    { name: 'Antenna Fragment Chain', rarity: 'Common', level: 8, baseAtk: 4, baseDef: 3, findableAt: ['skyline-rooftops'] },
    { name: 'Skyward Talisman', rarity: 'Uncommon', level: 9, baseAtk: 5, baseDef: 3, findableAt: ['skyline-rooftops'] },
    { name: 'Windcaller Pendant', rarity: 'Rare', level: 10, baseAtk: 5, baseDef: 4, findableAt: ['skyline-rooftops'] },
    // Ironworks Yard tier
    { name: 'Cog Chain Necklace', rarity: 'Common', level: 11, baseAtk: 5, baseDef: 4, findableAt: ['ironworks-yard'] },
    { name: 'Alloy Core Pendant', rarity: 'Uncommon', level: 12, baseAtk: 6, baseDef: 4, findableAt: ['ironworks-yard'] },
    { name: 'Reactor Heart Amulet', rarity: 'Rare', level: 13, baseAtk: 7, baseDef: 5, findableAt: ['ironworks-yard'] },
    { name: 'Forge Emblem', rarity: 'Epic', level: 13, baseAtk: 8, baseDef: 5, findableAt: ['ironworks-yard'] },
    // Midnight Terminal tier
    { name: 'Datachip Pendant', rarity: 'Common', level: 14, baseAtk: 7, baseDef: 5, findableAt: ['midnight-terminal'] },
    { name: 'Encryption Key Amulet', rarity: 'Uncommon', level: 15, baseAtk: 8, baseDef: 5 },
    { name: 'Signal Jammer Choker', rarity: 'Rare', level: 16, baseAtk: 9, baseDef: 6, findableAt: ['midnight-terminal'] },
    { name: 'Binary Star Pendant', rarity: 'Epic', level: 18, baseAtk: 10, baseDef: 7, findableAt: ['midnight-terminal'] },
    { name: 'Singularity Core Amulet', rarity: 'Legendary', level: 20, baseAtk: 12, baseDef: 8 },
    // Frozen Wastes tier
    { name: 'Frostcore Amulet', rarity: 'Rare', level: 22, baseAtk: 13, baseDef: 8, findableAt: ['frostbite-outpost', 'glacier-tunnels'] },
    { name: 'Glacier Tear Pendant', rarity: 'Epic', level: 25, baseAtk: 15, baseDef: 9, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    { name: 'Icicle Shard Chain', rarity: 'Uncommon', level: 23, baseAtk: 14, baseDef: 7, findableAt: ['permafrost-ruins'] },
    // Scorched Badlands tier
    { name: 'Ember Heart Amulet', rarity: 'Uncommon', level: 28, baseAtk: 16, baseDef: 9, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Shard Pendant', rarity: 'Rare', level: 30, baseAtk: 18, baseDef: 10, findableAt: ['magma-vents', 'volcanic-forge'] },
    { name: 'Inferno Core Choker', rarity: 'Epic', level: 32, baseAtk: 20, baseDef: 11, findableAt: ['inferno-pit'] },
    // Toxic Marshlands tier
    { name: 'Spore Cluster Necklace', rarity: 'Uncommon', level: 35, baseAtk: 19, baseDef: 10, findableAt: ['fungal-hollow'] },
    { name: 'Venom Fang Pendant', rarity: 'Epic', level: 34, baseAtk: 20, baseDef: 12, findableAt: ['venomous-thicket', 'plague-ponds'] },
    { name: 'Rot Blossom Amulet', rarity: 'Common', level: 38, baseAtk: 21, baseDef: 11, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Deep Coral Pendant', rarity: 'Rare', level: 40, baseAtk: 22, baseDef: 12, findableAt: ['coral-labyrinth', 'tidal-caves'] },
    { name: 'Leviathan Fang Chain', rarity: 'Legendary', level: 45, baseAtk: 25, baseDef: 14, findableAt: ['krakens-rest', 'abyssal-trench'] },
    { name: 'Pressure Pearl Amulet', rarity: 'Uncommon', level: 42, baseAtk: 21, baseDef: 12, findableAt: ['pressure-rift'] },
    // Celestial Highlands tier
    { name: 'Star Ember Pendant', rarity: 'Epic', level: 50, baseAtk: 27, baseDef: 15, findableAt: ['solar-fields', 'astral-gardens'] },
    { name: 'Empyrean Talisman', rarity: 'Rare', level: 55, baseAtk: 29, baseDef: 16, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Shard Pendant', rarity: 'Legendary', level: 58, baseAtk: 31, baseDef: 17, findableAt: ['rifts-edge', 'entropy-garden'] },
    { name: 'Nullpoint Amulet', rarity: 'Epic', level: 62, baseAtk: 33, baseDef: 18, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Talisman', rarity: 'Legendary', level: 65, baseAtk: 36, baseDef: 20, findableAt: ['oblivion-throne'] },
    // Berserker amulets
    { name: 'Rage Tooth Pendant', rarity: 'Common', level: 4, baseAtk: 3, baseDef: 1, classes: ['berserker'], findableAt: ['shadow-alley'] },
    { name: 'Bloodfury Choker', rarity: 'Uncommon', level: 9, baseAtk: 5, baseDef: 3, classes: ['berserker'], findableAt: ['skyline-rooftops'] },
    { name: 'Warcry Medallion', rarity: 'Rare', level: 16, baseAtk: 9, baseDef: 5, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Titan\'s Fury Chain', rarity: 'Epic', level: 26, baseAtk: 16, baseDef: 8, classes: ['berserker'], findableAt: ['magma-vents'] },
    { name: 'Berserker\'s Heart Pendant', rarity: 'Rare', level: 36, baseAtk: 20, baseDef: 10, classes: ['berserker'], findableAt: ['plague-ponds'] },
    { name: 'Bloodrage Core Amulet', rarity: 'Epic', level: 48, baseAtk: 26, baseDef: 14, classes: ['berserker'], findableAt: ['krakens-rest'] },
    { name: 'Doomsday Pendant', rarity: 'Legendary', level: 58, baseAtk: 31, baseDef: 17, classes: ['berserker'], findableAt: ['rifts-edge'] },
    { name: 'Havoc Core Talisman', rarity: 'Rare', level: 55, baseAtk: 28, baseDef: 15, classes: ['berserker'], findableAt: ['comets-trail'] },
    // Warrior amulets
    { name: 'Shield Bearer\'s Emblem', rarity: 'Common', level: 5, baseAtk: 3, baseDef: 2, classes: ['warrior'], findableAt: ['metro-underpass'] },
    { name: 'Iron Resolve Pendant', rarity: 'Uncommon', level: 11, baseAtk: 6, baseDef: 4, classes: ['warrior'], findableAt: ['ironworks-yard'] },
    { name: 'Vanguard\'s Medallion', rarity: 'Rare', level: 20, baseAtk: 11, baseDef: 7, classes: ['warrior'], findableAt: ['glacier-tunnels'] },
    { name: 'Sentinel\'s Core Chain', rarity: 'Epic', level: 30, baseAtk: 18, baseDef: 10, classes: ['warrior'], findableAt: ['volcanic-forge'] },
    { name: 'Fortress Heart Amulet', rarity: 'Rare', level: 40, baseAtk: 22, baseDef: 12, classes: ['warrior'], findableAt: ['coral-labyrinth'] },
    { name: 'Paragon\'s Emblem', rarity: 'Epic', level: 52, baseAtk: 27, baseDef: 15, classes: ['warrior'], findableAt: ['stormspire-tower'] },
    { name: 'Ironclad Talisman', rarity: 'Legendary', level: 62, baseAtk: 33, baseDef: 18, classes: ['warrior'], findableAt: ['singularity-well'] },
    { name: 'Bastion Core Pendant', rarity: 'Rare', level: 45, baseAtk: 24, baseDef: 13, classes: ['warrior'], findableAt: ['abyssal-trench'] },
    // Thief amulets
    { name: 'Pickpocket\'s Lucky Charm', rarity: 'Common', level: 3, baseAtk: 2, baseDef: 1, classes: ['thief'], findableAt: ['shadow-alley'] },
    { name: 'Shadow Mark Pendant', rarity: 'Uncommon', level: 8, baseAtk: 4, baseDef: 2, classes: ['thief'], findableAt: ['skyline-rooftops'] },
    { name: 'Phantom Strike Choker', rarity: 'Rare', level: 14, baseAtk: 7, baseDef: 4, classes: ['thief'], findableAt: ['ironworks-yard'] },
    { name: 'Assassin\'s Mark Amulet', rarity: 'Epic', level: 24, baseAtk: 14, baseDef: 7, classes: ['thief'], findableAt: ['crystal-caverns'] },
    { name: 'Nightblade Pendant', rarity: 'Rare', level: 34, baseAtk: 19, baseDef: 9, classes: ['thief'], findableAt: ['venomous-thicket'] },
    { name: 'Shadow Dancer\'s Chain', rarity: 'Epic', level: 46, baseAtk: 25, baseDef: 13, classes: ['thief'], findableAt: ['krakens-rest'] },
    { name: 'Ghost Step Talisman', rarity: 'Legendary', level: 60, baseAtk: 30, baseDef: 16, classes: ['thief'], findableAt: ['entropy-garden'] },
    { name: 'Flickerblade Charm', rarity: 'Rare', level: 50, baseAtk: 26, baseDef: 14, classes: ['thief'], findableAt: ['solar-fields'] },
    // Mage amulets
    { name: 'Mana Shard Pendant', rarity: 'Common', level: 4, baseAtk: 2, baseDef: 2, classes: ['mage'], findableAt: ['shadow-alley'] },
    { name: 'Ether Crystal Necklace', rarity: 'Uncommon', level: 10, baseAtk: 5, baseDef: 4, classes: ['mage'], findableAt: ['skyline-rooftops'] },
    { name: 'Arcane Focus Amulet', rarity: 'Rare', level: 18, baseAtk: 10, baseDef: 6, classes: ['mage'], findableAt: ['midnight-terminal'] },
    { name: 'Celestial Prism Pendant', rarity: 'Epic', level: 28, baseAtk: 17, baseDef: 9, classes: ['mage'], findableAt: ['sunscorch-canyon'] },
    { name: 'Starweave Talisman', rarity: 'Rare', level: 38, baseAtk: 21, baseDef: 11, classes: ['mage'], findableAt: ['rot-core'] },
    { name: 'Nebula Core Amulet', rarity: 'Epic', level: 50, baseAtk: 27, baseDef: 15, classes: ['mage'], findableAt: ['solar-fields'] },
    { name: 'Cosmic Resonance Chain', rarity: 'Legendary', level: 63, baseAtk: 34, baseDef: 19, classes: ['mage'], findableAt: ['singularity-well'] },
    { name: 'Prism Heart Pendant', rarity: 'Rare', level: 53, baseAtk: 28, baseDef: 15, classes: ['mage'], findableAt: ['comets-trail'] },
    // Necromancer amulets
    { name: 'Bone Shard Necklace', rarity: 'Common', level: 5, baseAtk: 3, baseDef: 2, classes: ['necromancer'], findableAt: ['metro-underpass'] },
    { name: 'Deathmark Pendant', rarity: 'Uncommon', level: 12, baseAtk: 6, baseDef: 4, classes: ['necromancer'], findableAt: ['ironworks-yard'] },
    { name: 'Blight Sigil Choker', rarity: 'Rare', level: 22, baseAtk: 13, baseDef: 7, classes: ['necromancer'], findableAt: ['permafrost-ruins'] },
    { name: 'Soul Harvest Amulet', rarity: 'Epic', level: 32, baseAtk: 18, baseDef: 9, classes: ['necromancer'], findableAt: ['inferno-pit'] },
    { name: 'Plague Bearer\'s Chain', rarity: 'Rare', level: 42, baseAtk: 22, baseDef: 12, classes: ['necromancer'], findableAt: ['sunken-bazaar'] },
    { name: 'Lich\'s Phylactery', rarity: 'Epic', level: 54, baseAtk: 28, baseDef: 15, classes: ['necromancer'], findableAt: ['empyrean-gate'] },
    { name: 'Void Whisper Talisman', rarity: 'Legendary', level: 61, baseAtk: 32, baseDef: 17, classes: ['necromancer'], findableAt: ['null-chamber'] },
    { name: 'Entropy Shard Pendant', rarity: 'Rare', level: 48, baseAtk: 25, baseDef: 13, classes: ['necromancer'], findableAt: ['krakens-rest'] },
  ]),
  belt: createGearList('belt', 'belt', [
    // Neon District tier
    { name: 'Frayed Rope Belt', rarity: 'Common', level: 1, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Wire-Stitched Sash', rarity: 'Uncommon', level: 2, baseDef: 2, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Neon Strip Belt', rarity: 'Rare', level: 3, baseDef: 3, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Holographic Waistguard', rarity: 'Legendary', level: 2, baseDef: 3, baseAtk: 1, findableAt: ['neon-mile'] },
    // Shadow Alley tier
    { name: 'Leather Tool Belt', rarity: 'Common', level: 3, baseDef: 3, findableAt: ['shadow-alley'] },
    { name: 'Shadow Cinch', rarity: 'Uncommon', level: 4, baseDef: 3, baseAtk: 1, findableAt: ['shadow-alley'] },
    { name: 'Assassin\'s Sash', rarity: 'Rare', level: 5, baseDef: 4, baseAtk: 2, findableAt: ['shadow-alley'] },
    { name: 'Phantom Waistband', rarity: 'Epic', level: 4, baseDef: 4, baseAtk: 2, findableAt: ['shadow-alley'] },
    // Metro Underpass tier
    { name: 'Conductor\'s Belt', rarity: 'Common', level: 6, baseDef: 4, baseAtk: 1, findableAt: ['metro-underpass'] },
    { name: 'Cable-Wound Girdle', rarity: 'Uncommon', level: 7, baseDef: 5, baseAtk: 1, findableAt: ['metro-underpass'] },
    { name: 'Arc Stabilizer Belt', rarity: 'Rare', level: 7, baseDef: 5, baseAtk: 2, findableAt: ['metro-underpass'] },
    { name: 'Tesla Coil Sash', rarity: 'Epic', level: 7, baseDef: 6, baseAtk: 2, findableAt: ['metro-underpass'] },
    // Skyline Rooftops tier
    { name: 'Grapple Harness Belt', rarity: 'Common', level: 8, baseDef: 5, baseAtk: 1, findableAt: ['skyline-rooftops'] },
    { name: 'Windrunner Sash', rarity: 'Uncommon', level: 9, baseDef: 6, baseAtk: 2, findableAt: ['skyline-rooftops'] },
    { name: 'Skyline Utility Belt', rarity: 'Rare', level: 10, baseDef: 7, baseAtk: 2, findableAt: ['skyline-rooftops'] },
    // Ironworks Yard tier
    { name: 'Forgemaster\'s Girdle', rarity: 'Common', level: 11, baseDef: 7, baseAtk: 2, findableAt: ['ironworks-yard'] },
    { name: 'Alloy Chain Belt', rarity: 'Uncommon', level: 12, baseDef: 8, baseAtk: 2, findableAt: ['ironworks-yard'] },
    { name: 'Anvil Guard Belt', rarity: 'Rare', level: 13, baseDef: 9, baseAtk: 3, findableAt: ['ironworks-yard'] },
    { name: 'Molten Core Girdle', rarity: 'Epic', level: 13, baseDef: 9, baseAtk: 3, findableAt: ['ironworks-yard'] },
    // Midnight Terminal tier
    { name: 'Circuit Board Belt', rarity: 'Common', level: 14, baseDef: 9, baseAtk: 2, findableAt: ['midnight-terminal'] },
    { name: 'Encrypted Sash', rarity: 'Uncommon', level: 15, baseDef: 10, baseAtk: 3 },
    { name: 'Datastream Girdle', rarity: 'Rare', level: 16, baseDef: 11, baseAtk: 3, findableAt: ['midnight-terminal'] },
    { name: 'Void Anchor Belt', rarity: 'Epic', level: 18, baseDef: 12, baseAtk: 4, findableAt: ['midnight-terminal'] },
    { name: 'Singularity Waistguard', rarity: 'Legendary', level: 20, baseDef: 14, baseAtk: 4 },
    // Frozen Wastes tier
    { name: 'Frostbind Belt', rarity: 'Rare', level: 22, baseDef: 14, baseAtk: 4, findableAt: ['frostbite-outpost', 'glacier-tunnels'] },
    { name: 'Glacier Chain Girdle', rarity: 'Epic', level: 25, baseDef: 16, baseAtk: 5, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    // Scorched Badlands tier
    { name: 'Heatshield Sash', rarity: 'Uncommon', level: 28, baseDef: 17, baseAtk: 5, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Band Belt', rarity: 'Rare', level: 30, baseDef: 19, baseAtk: 6, findableAt: ['magma-vents', 'volcanic-forge'] },
    // Toxic Marshlands tier
    { name: 'Spore Guard Belt', rarity: 'Uncommon', level: 35, baseDef: 20, baseAtk: 6, findableAt: ['fungal-hollow'] },
    { name: 'Toxin Ward Girdle', rarity: 'Epic', level: 34, baseDef: 21, baseAtk: 7, findableAt: ['venomous-thicket', 'plague-ponds'] },
    { name: 'Rot Wrap Belt', rarity: 'Common', level: 38, baseDef: 22, baseAtk: 6, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Coral Chain Belt', rarity: 'Rare', level: 40, baseDef: 23, baseAtk: 7, findableAt: ['coral-labyrinth', 'tidal-caves'] },
    { name: 'Leviathan Hide Girdle', rarity: 'Legendary', level: 45, baseDef: 26, baseAtk: 9, findableAt: ['krakens-rest', 'abyssal-trench'] },
    // Celestial Highlands tier
    { name: 'Starweave Belt', rarity: 'Epic', level: 50, baseDef: 29, baseAtk: 10, findableAt: ['solar-fields', 'astral-gardens'] },
    { name: 'Empyrean Girdle', rarity: 'Rare', level: 55, baseDef: 32, baseAtk: 11, findableAt: ['comets-trail', 'empyrean-gate'] },
    // Void Nexus tier
    { name: 'Rift Anchor Belt', rarity: 'Legendary', level: 58, baseDef: 34, baseAtk: 12, findableAt: ['rifts-edge', 'entropy-garden'] },
    { name: 'Nullpoint Girdle', rarity: 'Epic', level: 62, baseDef: 36, baseAtk: 13, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Waistguard', rarity: 'Legendary', level: 65, baseDef: 40, baseAtk: 15, findableAt: ['oblivion-throne'] },
    // Berserker belts
    { name: 'Spike Chain Belt', rarity: 'Common', level: 4, baseDef: 3, baseAtk: 1, classes: ['berserker'], findableAt: ['shadow-alley'] },
    { name: 'Rage Buckle Girdle', rarity: 'Uncommon', level: 10, baseDef: 7, baseAtk: 3, classes: ['berserker'], findableAt: ['skyline-rooftops'] },
    { name: 'Fury-Forged Waistplate', rarity: 'Rare', level: 16, baseDef: 11, baseAtk: 4, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Titan Grip Belt', rarity: 'Epic', level: 24, baseDef: 15, baseAtk: 6, classes: ['berserker'], findableAt: ['crystal-caverns'] },
    { name: 'Warbelt of Carnage', rarity: 'Rare', level: 32, baseDef: 20, baseAtk: 7, classes: ['berserker'], findableAt: ['inferno-pit'] },
    { name: 'Berserker\'s Trophy Belt', rarity: 'Epic', level: 40, baseDef: 24, baseAtk: 8, classes: ['berserker'], findableAt: ['coral-labyrinth'] },
    { name: 'Doomsday Girdle', rarity: 'Legendary', level: 52, baseDef: 30, baseAtk: 11, classes: ['berserker'], findableAt: ['stormspire-tower'] },
    { name: 'Havoc Chain Belt', rarity: 'Rare', level: 45, baseDef: 26, baseAtk: 9, classes: ['berserker'], findableAt: ['abyssal-trench'] },
    { name: 'Annihilator\'s Girdle', rarity: 'Epic', level: 58, baseDef: 34, baseAtk: 13, classes: ['berserker'], findableAt: ['paradox-maze'] },
    // Warrior belts
    { name: 'Recruit\'s Utility Belt', rarity: 'Common', level: 3, baseDef: 3, classes: ['warrior'], findableAt: ['shadow-alley'] },
    { name: 'Iron Plate Girdle', rarity: 'Uncommon', level: 9, baseDef: 7, baseAtk: 2, classes: ['warrior'], findableAt: ['skyline-rooftops'] },
    { name: 'Sentinel\'s Waistguard', rarity: 'Rare', level: 18, baseDef: 12, baseAtk: 3, classes: ['warrior'], findableAt: ['midnight-terminal'] },
    { name: 'Bastion Belt', rarity: 'Epic', level: 26, baseDef: 17, baseAtk: 5, classes: ['warrior'], findableAt: ['magma-vents'] },
    { name: 'Vanguard\'s Girdle', rarity: 'Rare', level: 34, baseDef: 21, baseAtk: 7, classes: ['warrior'], findableAt: ['venomous-thicket'] },
    { name: 'Fortress Chain Belt', rarity: 'Epic', level: 44, baseDef: 27, baseAtk: 9, classes: ['warrior'], findableAt: ['abyssal-trench'] },
    { name: 'Champion\'s Waistplate', rarity: 'Legendary', level: 55, baseDef: 33, baseAtk: 12, classes: ['warrior'], findableAt: ['empyrean-gate'] },
    { name: 'Ironclad Girdle', rarity: 'Rare', level: 50, baseDef: 29, baseAtk: 10, classes: ['warrior'], findableAt: ['solar-fields'] },
    { name: 'Rampart Utility Belt', rarity: 'Epic', level: 62, baseDef: 37, baseAtk: 14, classes: ['warrior'], findableAt: ['singularity-well'] },
    // Thief belts
    { name: 'Pickpocket\'s Sash', rarity: 'Common', level: 3, baseDef: 2, baseAtk: 1, classes: ['thief'], findableAt: ['shadow-alley'] },
    { name: 'Shadow Runner Belt', rarity: 'Uncommon', level: 8, baseDef: 5, baseAtk: 2, classes: ['thief'], findableAt: ['skyline-rooftops'] },
    { name: 'Phantom Sash', rarity: 'Rare', level: 14, baseDef: 9, baseAtk: 3, classes: ['thief'], findableAt: ['ironworks-yard'] },
    { name: 'Assassin\'s Utility Belt', rarity: 'Epic', level: 22, baseDef: 13, baseAtk: 5, classes: ['thief'], findableAt: ['permafrost-ruins'] },
    { name: 'Night Stalker Cinch', rarity: 'Rare', level: 30, baseDef: 19, baseAtk: 6, classes: ['thief'], findableAt: ['volcanic-forge'] },
    { name: 'Ghost Weave Sash', rarity: 'Epic', level: 38, baseDef: 22, baseAtk: 8, classes: ['thief'], findableAt: ['rot-core'] },
    { name: 'Flickerblade Belt', rarity: 'Legendary', level: 50, baseDef: 29, baseAtk: 10, classes: ['thief'], findableAt: ['solar-fields'] },
    { name: 'Shadow Dance Cinch', rarity: 'Rare', level: 42, baseDef: 24, baseAtk: 8, classes: ['thief'], findableAt: ['sunken-bazaar'] },
    { name: 'Nightfall Sash', rarity: 'Epic', level: 60, baseDef: 35, baseAtk: 13, classes: ['thief'], findableAt: ['entropy-garden'] },
    // Mage belts
    { name: 'Mana Thread Sash', rarity: 'Common', level: 5, baseDef: 4, baseAtk: 1, classes: ['mage'], findableAt: ['metro-underpass'] },
    { name: 'Ether-Woven Belt', rarity: 'Uncommon', level: 11, baseDef: 8, baseAtk: 2, classes: ['mage'], findableAt: ['ironworks-yard'] },
    { name: 'Arcane Channeler Belt', rarity: 'Rare', level: 20, baseDef: 13, baseAtk: 4, classes: ['mage'], findableAt: ['glacier-tunnels'] },
    { name: 'Celestial Cord', rarity: 'Epic', level: 28, baseDef: 17, baseAtk: 6, classes: ['mage'], findableAt: ['sunscorch-canyon'] },
    { name: 'Starlight Girdle', rarity: 'Rare', level: 36, baseDef: 21, baseAtk: 7, classes: ['mage'], findableAt: ['plague-ponds'] },
    { name: 'Nebula Weave Belt', rarity: 'Epic', level: 46, baseDef: 27, baseAtk: 9, classes: ['mage'], findableAt: ['krakens-rest'] },
    { name: 'Cosmic Thread Sash', rarity: 'Legendary', level: 56, baseDef: 33, baseAtk: 12, classes: ['mage'], findableAt: ['empyrean-gate'] },
    { name: 'Prism Focus Belt', rarity: 'Rare', level: 48, baseDef: 28, baseAtk: 10, classes: ['mage'], findableAt: ['krakens-rest'] },
    { name: 'Aurora Woven Girdle', rarity: 'Epic', level: 63, baseDef: 38, baseAtk: 14, classes: ['mage'], findableAt: ['singularity-well'] },
    // Necromancer belts
    { name: 'Bone Fragment Belt', rarity: 'Common', level: 5, baseDef: 3, baseAtk: 1, classes: ['necromancer'], findableAt: ['metro-underpass'] },
    { name: 'Grave Dust Sash', rarity: 'Uncommon', level: 12, baseDef: 8, baseAtk: 3, classes: ['necromancer'], findableAt: ['ironworks-yard'] },
    { name: 'Blight Anchor Belt', rarity: 'Rare', level: 22, baseDef: 14, baseAtk: 4, classes: ['necromancer'], findableAt: ['permafrost-ruins'] },
    { name: 'Soul Leech Girdle', rarity: 'Epic', level: 30, baseDef: 19, baseAtk: 6, classes: ['necromancer'], findableAt: ['volcanic-forge'] },
    { name: 'Plague Cord Belt', rarity: 'Rare', level: 38, baseDef: 22, baseAtk: 7, classes: ['necromancer'], findableAt: ['rot-core'] },
    { name: 'Lich\'s Waistguard', rarity: 'Epic', level: 48, baseDef: 28, baseAtk: 10, classes: ['necromancer'], findableAt: ['krakens-rest'] },
    { name: 'Void Tether Belt', rarity: 'Legendary', level: 58, baseDef: 34, baseAtk: 12, classes: ['necromancer'], findableAt: ['paradox-maze'] },
    { name: 'Entropy Cord Sash', rarity: 'Rare', level: 52, baseDef: 30, baseAtk: 11, classes: ['necromancer'], findableAt: ['stormspire-tower'] },
    { name: 'Null Binding Girdle', rarity: 'Epic', level: 61, baseDef: 36, baseAtk: 13, classes: ['necromancer'], findableAt: ['null-chamber'] },
  ]),
  cape: createGearList('cape', 'cape', [
    // Neon District tier
    { name: 'Tattered Cloak', rarity: 'Common', level: 1, baseDef: 2, findableAt: ['neon-mile'] },
    { name: 'Neon-Trimmed Cape', rarity: 'Uncommon', level: 2, baseDef: 2, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Flickering Mantle', rarity: 'Rare', level: 3, baseDef: 3, baseAtk: 1, findableAt: ['neon-mile'] },
    { name: 'Holographic Shroud', rarity: 'Legendary', level: 2, baseDef: 3, baseAtk: 1, findableAt: ['neon-mile'] },
    // Shadow Alley tier
    { name: 'Ragpicker\'s Shawl', rarity: 'Common', level: 3, baseDef: 3, findableAt: ['shadow-alley'] },
    { name: 'Shadow Veil', rarity: 'Uncommon', level: 4, baseDef: 3, baseAtk: 1, findableAt: ['shadow-alley'] },
    { name: 'Nightstalker Cape', rarity: 'Rare', level: 5, baseDef: 4, baseAtk: 2, findableAt: ['shadow-alley'] },
    { name: 'Phantom Cloak', rarity: 'Epic', level: 4, baseDef: 5, baseAtk: 1, findableAt: ['shadow-alley'] },
    { name: 'Wraithweave Mantle', rarity: 'Legendary', level: 4, baseDef: 5, baseAtk: 2, findableAt: ['shadow-alley'] },
    // Metro Underpass tier
    { name: 'Conductor\'s Cape', rarity: 'Common', level: 6, baseDef: 4, baseAtk: 1, findableAt: ['metro-underpass'] },
    { name: 'Voltage Shroud', rarity: 'Uncommon', level: 7, baseDef: 5, baseAtk: 1, findableAt: ['metro-underpass'] },
    { name: 'Spark Trail Cloak', rarity: 'Rare', level: 7, baseDef: 5, baseAtk: 2, findableAt: ['metro-underpass'] },
    { name: 'Arc Storm Mantle', rarity: 'Epic', level: 7, baseDef: 6, baseAtk: 2, findableAt: ['metro-underpass'] },
    // Skyline Rooftops tier
    { name: 'Windcatcher Cape', rarity: 'Common', level: 8, baseDef: 5, baseAtk: 1, findableAt: ['skyline-rooftops'] },
    { name: 'Gale Runner Cloak', rarity: 'Uncommon', level: 9, baseDef: 6, baseAtk: 2, findableAt: ['skyline-rooftops'] },
    { name: 'Stormweave Mantle', rarity: 'Rare', level: 10, baseDef: 7, baseAtk: 2, findableAt: ['skyline-rooftops'] },
    // Ironworks Yard tier
    { name: 'Soot-Stained Cloak', rarity: 'Common', level: 11, baseDef: 7, baseAtk: 2, findableAt: ['ironworks-yard'] },
    { name: 'Fireproof Mantle', rarity: 'Uncommon', level: 12, baseDef: 8, baseAtk: 2, findableAt: ['ironworks-yard'] },
    { name: 'Forge Ember Cape', rarity: 'Rare', level: 13, baseDef: 9, baseAtk: 3, findableAt: ['ironworks-yard'] },
    { name: 'Molten Shroud', rarity: 'Epic', level: 13, baseDef: 10, baseAtk: 3, findableAt: ['ironworks-yard'] },
    // Midnight Terminal tier
    { name: 'Data Veil Cape', rarity: 'Common', level: 14, baseDef: 9, baseAtk: 2, findableAt: ['midnight-terminal'] },
    { name: 'Signal Ghost Cloak', rarity: 'Uncommon', level: 15, baseDef: 10, baseAtk: 3 },
    { name: 'Encrypted Shroud', rarity: 'Rare', level: 16, baseDef: 11, baseAtk: 3, findableAt: ['midnight-terminal'] },
    { name: 'Void Trail Mantle', rarity: 'Epic', level: 18, baseDef: 13, baseAtk: 4, findableAt: ['midnight-terminal'] },
    { name: 'Cosmic Shroud', rarity: 'Legendary', level: 20, baseDef: 14, baseAtk: 5 },
    // Frozen Wastes tier
    { name: 'Blizzard Cloak', rarity: 'Rare', level: 22, baseDef: 15, baseAtk: 4, findableAt: ['frostbite-outpost', 'blizzard-peak'] },
    { name: 'Glacier Veil', rarity: 'Epic', level: 25, baseDef: 17, baseAtk: 5, findableAt: ['crystal-caverns', 'frozen-citadel'] },
    { name: 'Snowdrift Cape', rarity: 'Uncommon', level: 23, baseDef: 14, baseAtk: 4, findableAt: ['glacier-tunnels'] },
    // Scorched Badlands tier
    { name: 'Heatwave Cloak', rarity: 'Uncommon', level: 28, baseDef: 18, baseAtk: 5, findableAt: ['ember-flats', 'sunscorch-canyon'] },
    { name: 'Volcanic Ash Mantle', rarity: 'Rare', level: 30, baseDef: 20, baseAtk: 6, findableAt: ['magma-vents', 'volcanic-forge'] },
    { name: 'Inferno Shroud', rarity: 'Epic', level: 32, baseDef: 21, baseAtk: 7, findableAt: ['inferno-pit'] },
    // Toxic Marshlands tier
    { name: 'Fungal Spore Cape', rarity: 'Uncommon', level: 35, baseDef: 21, baseAtk: 6, findableAt: ['fungal-hollow', 'bogs-edge'] },
    { name: 'Plague Veil', rarity: 'Epic', level: 34, baseDef: 22, baseAtk: 7, findableAt: ['venomous-thicket', 'plague-ponds'] },
    { name: 'Rot Mantle', rarity: 'Common', level: 38, baseDef: 23, baseAtk: 6, findableAt: ['rot-core'] },
    // Abyssal Depths tier
    { name: 'Tidal Cloak', rarity: 'Rare', level: 40, baseDef: 24, baseAtk: 7, findableAt: ['tidal-caves', 'sunken-bazaar'] },
    { name: 'Leviathan Scale Cape', rarity: 'Legendary', level: 45, baseDef: 28, baseAtk: 9, findableAt: ['krakens-rest', 'abyssal-trench'] },
    { name: 'Pressure Depth Mantle', rarity: 'Uncommon', level: 42, baseDef: 24, baseAtk: 7, findableAt: ['pressure-rift'] },
    // Celestial Highlands tier
    { name: 'Starlight Mantle', rarity: 'Epic', level: 50, baseDef: 30, baseAtk: 10, findableAt: ['stormspire-tower', 'solar-fields'] },
    { name: 'Empyrean Wings', rarity: 'Rare', level: 55, baseDef: 33, baseAtk: 11, findableAt: ['comets-trail', 'empyrean-gate'] },
    { name: 'Aurora Veil', rarity: 'Uncommon', level: 52, baseDef: 29, baseAtk: 9, findableAt: ['astral-gardens'] },
    // Void Nexus tier
    { name: 'Rift Tear Cape', rarity: 'Legendary', level: 58, baseDef: 35, baseAtk: 12, findableAt: ['rifts-edge', 'null-chamber'] },
    { name: 'Nullpoint Shroud', rarity: 'Epic', level: 62, baseDef: 38, baseAtk: 14, findableAt: ['paradox-maze', 'singularity-well'] },
    { name: 'Oblivion Mantle Cape', rarity: 'Legendary', level: 65, baseDef: 42, baseAtk: 16, findableAt: ['oblivion-throne'] },
    // Berserker capes
    { name: 'Blood-Splattered Cloak', rarity: 'Common', level: 4, baseDef: 3, baseAtk: 1, classes: ['berserker'], findableAt: ['shadow-alley'] },
    { name: 'Fury Mantle', rarity: 'Uncommon', level: 10, baseDef: 7, baseAtk: 3, classes: ['berserker'], findableAt: ['skyline-rooftops'] },
    { name: 'Warchief\'s Cape', rarity: 'Rare', level: 18, baseDef: 12, baseAtk: 4, classes: ['berserker'], findableAt: ['midnight-terminal'] },
    { name: 'Titan\'s War Mantle', rarity: 'Epic', level: 28, baseDef: 18, baseAtk: 6, classes: ['berserker'], findableAt: ['sunscorch-canyon'] },
    { name: 'Berserker\'s Trophy Cloak', rarity: 'Rare', level: 38, baseDef: 23, baseAtk: 7, classes: ['berserker'], findableAt: ['rot-core'] },
    { name: 'Doomcloak of Carnage', rarity: 'Epic', level: 50, baseDef: 30, baseAtk: 10, classes: ['berserker'], findableAt: ['solar-fields'] },
    { name: 'Havoc Shroud', rarity: 'Legendary', level: 60, baseDef: 36, baseAtk: 13, classes: ['berserker'], findableAt: ['entropy-garden'] },
    { name: 'Annihilator\'s Mantle', rarity: 'Rare', level: 45, baseDef: 26, baseAtk: 9, classes: ['berserker'], findableAt: ['abyssal-trench'] },
    // Warrior capes
    { name: 'Standard Bearer\'s Cape', rarity: 'Common', level: 5, baseDef: 4, baseAtk: 1, classes: ['warrior'], findableAt: ['metro-underpass'] },
    { name: 'Iron Sentinel\'s Cloak', rarity: 'Uncommon', level: 12, baseDef: 8, baseAtk: 2, classes: ['warrior'], findableAt: ['ironworks-yard'] },
    { name: 'Vanguard\'s Mantle', rarity: 'Rare', level: 20, baseDef: 14, baseAtk: 4, classes: ['warrior'], findableAt: ['glacier-tunnels'] },
    { name: 'Bastion Cape', rarity: 'Epic', level: 30, baseDef: 20, baseAtk: 6, classes: ['warrior'], findableAt: ['volcanic-forge'] },
    { name: 'Fortress Cloak', rarity: 'Rare', level: 40, baseDef: 24, baseAtk: 7, classes: ['warrior'], findableAt: ['coral-labyrinth'] },
    { name: 'Champion\'s War Cape', rarity: 'Epic', level: 52, baseDef: 31, baseAtk: 10, classes: ['warrior'], findableAt: ['stormspire-tower'] },
    { name: 'Ironclad Commander\'s Cloak', rarity: 'Legendary', level: 62, baseDef: 38, baseAtk: 14, classes: ['warrior'], findableAt: ['singularity-well'] },
    { name: 'Rampart Mantle', rarity: 'Rare', level: 48, baseDef: 28, baseAtk: 9, classes: ['warrior'], findableAt: ['krakens-rest'] },
    // Thief capes
    { name: 'Pickpocket\'s Cloak', rarity: 'Common', level: 3, baseDef: 3, baseAtk: 1, classes: ['thief'], findableAt: ['shadow-alley'] },
    { name: 'Smoke Trail Cape', rarity: 'Uncommon', level: 9, baseDef: 6, baseAtk: 2, classes: ['thief'], findableAt: ['skyline-rooftops'] },
    { name: 'Shadow Dancer\'s Cloak', rarity: 'Rare', level: 15, baseDef: 10, baseAtk: 3, classes: ['thief'], findableAt: ['midnight-terminal'] },
    { name: 'Phantom\'s Shroud', rarity: 'Epic', level: 25, baseDef: 16, baseAtk: 5, classes: ['thief'], findableAt: ['crystal-caverns'] },
    { name: 'Ghost Silk Cape', rarity: 'Rare', level: 35, baseDef: 21, baseAtk: 6, classes: ['thief'], findableAt: ['venomous-thicket'] },
    { name: 'Nightblade\'s Mantle', rarity: 'Epic', level: 46, baseDef: 27, baseAtk: 9, classes: ['thief'], findableAt: ['krakens-rest'] },
    { name: 'Flickering Shadow Cloak', rarity: 'Legendary', level: 57, baseDef: 34, baseAtk: 12, classes: ['thief'], findableAt: ['paradox-maze'] },
    { name: 'Silent Step Shroud', rarity: 'Rare', level: 42, baseDef: 24, baseAtk: 8, classes: ['thief'], findableAt: ['sunken-bazaar'] },
    // Mage capes
    { name: 'Apprentice\'s Cloak', rarity: 'Common', level: 4, baseDef: 3, baseAtk: 1, classes: ['mage'], findableAt: ['shadow-alley'] },
    { name: 'Ether-Woven Cape', rarity: 'Uncommon', level: 11, baseDef: 8, baseAtk: 2, classes: ['mage'], findableAt: ['ironworks-yard'] },
    { name: 'Arcane Drift Mantle', rarity: 'Rare', level: 19, baseDef: 13, baseAtk: 4, classes: ['mage'], findableAt: ['glacier-tunnels'] },
    { name: 'Celestial Wings Cloak', rarity: 'Epic', level: 28, baseDef: 18, baseAtk: 6, classes: ['mage'], findableAt: ['sunscorch-canyon'] },
    { name: 'Starweave Cape', rarity: 'Rare', level: 38, baseDef: 23, baseAtk: 7, classes: ['mage'], findableAt: ['rot-core'] },
    { name: 'Nebula Drift Mantle', rarity: 'Epic', level: 50, baseDef: 30, baseAtk: 10, classes: ['mage'], findableAt: ['solar-fields'] },
    { name: 'Cosmic Resonance Cloak', rarity: 'Legendary', level: 61, baseDef: 37, baseAtk: 14, classes: ['mage'], findableAt: ['null-chamber'] },
    { name: 'Prism Light Cape', rarity: 'Rare', level: 55, baseDef: 33, baseAtk: 11, classes: ['mage'], findableAt: ['empyrean-gate'] },
    // Necromancer capes
    { name: 'Gravecloth Shawl', rarity: 'Common', level: 5, baseDef: 4, baseAtk: 1, classes: ['necromancer'], findableAt: ['metro-underpass'] },
    { name: 'Blightweave Cloak', rarity: 'Uncommon', level: 12, baseDef: 8, baseAtk: 3, classes: ['necromancer'], findableAt: ['ironworks-yard'] },
    { name: 'Soul Shroud', rarity: 'Rare', level: 20, baseDef: 14, baseAtk: 4, classes: ['necromancer'], findableAt: ['glacier-tunnels'] },
    { name: 'Plague Doctor\'s Cape', rarity: 'Epic', level: 30, baseDef: 20, baseAtk: 7, classes: ['necromancer'], findableAt: ['volcanic-forge'] },
    { name: 'Deathveil Mantle', rarity: 'Rare', level: 40, baseDef: 24, baseAtk: 7, classes: ['necromancer'], findableAt: ['coral-labyrinth'] },
    { name: 'Lich\'s Shroud', rarity: 'Epic', level: 52, baseDef: 31, baseAtk: 11, classes: ['necromancer'], findableAt: ['stormspire-tower'] },
    { name: 'Void Mantle of Decay', rarity: 'Legendary', level: 63, baseDef: 39, baseAtk: 15, classes: ['necromancer'], findableAt: ['singularity-well'] },
    { name: 'Entropy Shroud', rarity: 'Rare', level: 48, baseDef: 28, baseAtk: 9, classes: ['necromancer'], findableAt: ['krakens-rest'] },
  ]),
};

// ---- CHARACTER CLASSES ----
export const CHARACTER_CLASSES = {
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    shortName: 'B',
    description: 'A reckless brawler who trades defense for overwhelming aggression. Grows stronger as HP drops.',
    color: '#ff4444',
    baseStats: { maxHp: 55, maxMana: 15, baseAtk: 8, baseDef: 1, charisma: 2, wisdom: 1, athletics: 5, speed: 5, evasion: 2, accuracy: 5, resistance: 1, tenacity: 4, aggression: 7, luck: 3, fortitude: 5 },
    growth: { hp: 10, hpRand: 6, atk: 2, atkRand: 2, def: 1, defRand: 1, mana: 2, manaRand: 2, charisma: 0, charismaRand: 1, wisdom: 0, wisdomRand: 1, athletics: 1, athleticsRand: 1, speed: 0, speedRand: 1, evasion: 0, evasionRand: 1, accuracy: 0, accuracyRand: 1, resistance: 0, resistanceRand: 1, tenacity: 1, tenacityRand: 1, aggression: 1, aggressionRand: 1, luck: 0, luckRand: 1, fortitude: 1, fortitudeRand: 1 },
    passive: 'Rage',
    passiveDesc: '+30% ATK when below 40% HP',
    skillName: 'Frenzy',
    skillDesc: '2.0x ATK damage, take 10% max HP recoil',
    skillMultiplier: 2.0,
    skillEffect: 'recoil',
    skillManaCost: 10,
  },
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    shortName: 'W',
    description: 'A disciplined fighter with balanced offense and strong defense. Hard to kill.',
    color: '#4488ff',
    baseStats: { maxHp: 65, maxMana: 25, baseAtk: 5, baseDef: 4, charisma: 2, wisdom: 3, athletics: 4, speed: 4, evasion: 3, accuracy: 4, resistance: 5, tenacity: 6, aggression: 3, luck: 3, fortitude: 7 },
    growth: { hp: 10, hpRand: 4, atk: 1, atkRand: 2, def: 2, defRand: 2, mana: 3, manaRand: 2, charisma: 0, charismaRand: 1, wisdom: 1, wisdomRand: 1, athletics: 1, athleticsRand: 1, speed: 0, speedRand: 1, evasion: 0, evasionRand: 1, accuracy: 0, accuracyRand: 1, resistance: 1, resistanceRand: 1, tenacity: 1, tenacityRand: 1, aggression: 0, aggressionRand: 1, luck: 0, luckRand: 1, fortitude: 1, fortitudeRand: 1 },
    passive: 'Fortify',
    passiveDesc: 'Defend blocks 70% damage instead of 50%',
    skillName: 'Shield Bash',
    skillDesc: '1.4x ATK damage, reduces enemy ATK by 15% for the fight',
    skillMultiplier: 1.4,
    skillEffect: 'weaken',
    skillManaCost: 8,
  },
  thief: {
    id: 'thief',
    name: 'Thief',
    shortName: 'T',
    description: 'A cunning rogue who strikes fast and steals more. Higher escape chance and bonus gold.',
    color: '#44dd44',
    baseStats: { maxHp: 42, maxMana: 25, baseAtk: 7, baseDef: 2, charisma: 5, wisdom: 2, athletics: 4, speed: 8, evasion: 7, accuracy: 6, resistance: 2, tenacity: 3, aggression: 4, luck: 7, fortitude: 2 },
    growth: { hp: 7, hpRand: 4, atk: 2, atkRand: 2, def: 1, defRand: 1, mana: 3, manaRand: 3, charisma: 1, charismaRand: 1, wisdom: 0, wisdomRand: 1, athletics: 1, athleticsRand: 1, speed: 1, speedRand: 1, evasion: 1, evasionRand: 1, accuracy: 1, accuracyRand: 1, resistance: 0, resistanceRand: 1, tenacity: 0, tenacityRand: 1, aggression: 0, aggressionRand: 1, luck: 1, luckRand: 1, fortitude: 0, fortitudeRand: 1 },
    passive: 'Greed',
    passiveDesc: '+25% gold from battles, 75% escape chance',
    skillName: 'Backstab',
    skillDesc: '2.2x ATK damage, ignores 50% of enemy DEF',
    skillMultiplier: 2.2,
    skillEffect: 'pierce',
    skillManaCost: 10,
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    shortName: 'M',
    description: 'A scholar of arcane arts who channels devastating spells. High mana, fragile body.',
    color: '#bb66ff',
    baseStats: { maxHp: 38, maxMana: 50, baseAtk: 6, baseDef: 1, charisma: 3, wisdom: 5, athletics: 1, speed: 3, evasion: 2, accuracy: 3, resistance: 6, tenacity: 3, aggression: 3, luck: 5, fortitude: 2 },
    growth: { hp: 6, hpRand: 3, atk: 2, atkRand: 1, def: 1, defRand: 1, mana: 6, manaRand: 4, charisma: 0, charismaRand: 1, wisdom: 1, wisdomRand: 1, athletics: 0, athleticsRand: 1, speed: 0, speedRand: 1, evasion: 0, evasionRand: 1, accuracy: 0, accuracyRand: 1, resistance: 1, resistanceRand: 1, tenacity: 0, tenacityRand: 1, aggression: 0, aggressionRand: 1, luck: 1, luckRand: 1, fortitude: 0, fortitudeRand: 1 },
    passive: 'Arcane Mind',
    passiveDesc: 'Skill attacks deal +40% damage',
    skillName: 'Arcane Blast',
    skillDesc: '1.8x ATK damage, ignores all enemy DEF',
    skillMultiplier: 1.8,
    skillEffect: 'true_damage',
    skillManaCost: 12,
  },
  necromancer: {
    id: 'necromancer',
    name: 'Necromancer',
    shortName: 'N',
    description: 'A dark caster who siphons life from enemies. Sustains through draining attacks.',
    color: '#cc44cc',
    baseStats: { maxHp: 45, maxMana: 40, baseAtk: 6, baseDef: 2, charisma: 3, wisdom: 5, athletics: 2, speed: 4, evasion: 3, accuracy: 4, resistance: 5, tenacity: 5, aggression: 4, luck: 4, fortitude: 4 },
    growth: { hp: 7, hpRand: 4, atk: 1, atkRand: 2, def: 1, defRand: 2, mana: 5, manaRand: 3, charisma: 0, charismaRand: 1, wisdom: 1, wisdomRand: 1, athletics: 0, athleticsRand: 1, speed: 0, speedRand: 1, evasion: 0, evasionRand: 1, accuracy: 0, accuracyRand: 1, resistance: 1, resistanceRand: 1, tenacity: 1, tenacityRand: 1, aggression: 0, aggressionRand: 1, luck: 0, luckRand: 1, fortitude: 1, fortitudeRand: 1 },
    passive: 'Lifetap',
    passiveDesc: 'Normal attacks heal 15% of damage dealt',
    skillName: 'Drain Life',
    skillDesc: '1.5x ATK damage, heal 40% of damage dealt',
    skillMultiplier: 1.5,
    skillEffect: 'drain',
    skillManaCost: 10,
  },
};

// ---- XP FORMULA ----
// Steeper progression: each level demands significantly more XP than the last,
// outpacing the better exp drops from higher-level areas.
export function expForLevel(level) {
  return Math.floor(50 * Math.pow(level, 1.8) + 10 * Math.pow(level, 2.1));
}

// ---- EXPLORE TEXTS ----
export const EXPLORE_TEXTS = {
  street: [
    'Neon signs buzz overhead as you weave between rusted cars...',
    'A busted hydrant steams, bathing the block in hazy pink light...',
    'You sidestep shattered glass and listen for skittering claws...',
    'Graffiti tags glow faintly under ultraviolet lamps...',
    'The hum of distant transformers blankets the asphalt...',
  ],
  alley: [
    'Water drips from fire escapes onto the cracked pavement...',
    'Dumpster fires flicker against the brick walls...',
    'You pass overturned crates and torn tarps fluttering like ghosts...',
    'Echoes bounce between walls, masking careful footsteps...',
    'A chain-link gate creaks somewhere deeper in the maze...',
  ],
  station: [
    'The underpass lights flicker, revealing streaks of neon slime...',
    'Broken railcars loom like beasts in the dim glow...',
    'You follow old maintenance lines painted across concrete...',
    'Vents exhale metallic air that smells of ozone...',
    'The distant rumble of trains that no longer run shakes dust loose...',
  ],
  rooftop: [
    'Wind howls between aerials and satellite dishes...',
    'You leap rooftop gaps, scanning for hostile silhouettes...',
    'Glass gardens glimmer beside jury-rigged antenna towers...',
    'Warning strobes pulse red, painting the skyline...',
    'You duck behind a billboard as drones buzz overhead...',
  ],
  industrial: [
    'Conveyor belts sit silent beneath layers of grime...',
    'You squeeze between shipping containers stained with chemicals...',
    'Loose chains rattle as steam hisses from cracked pipes...',
    'Old forklifts rest like sleeping beasts in the dark...',
    'Puddles of toxic runoff glow faint green under the moon...',
  ],
  tundra: [
    'Snow crunches under your boots as the wind bites through your gear...',
    'Icicles hang like daggers from the frozen overhang above...',
    'A distant howl echoes across the white emptiness...',
    'Frost crystals form patterns on every exposed surface...',
    'The temperature drops further as you push deeper into the wastes...',
  ],
  desert: [
    'Heat shimmers rise from the cracked, sun-baked earth...',
    'Sand swirls around your ankles in the scorching wind...',
    'The air tastes like ash and sulfur this deep in the badlands...',
    'Volcanic vents hiss steam into the burning sky...',
    'Charred rock formations jut from the dunes like blackened teeth...',
  ],
  swamp: [
    'Murky water bubbles with toxic gas as you wade forward...',
    'Vines drip with corrosive sap, hissing where they touch stone...',
    'Bioluminescent fungi cast an eerie green glow through the mist...',
    'The stench of decay grows stronger with every step...',
    'Something moves beneath the surface of the dark water...',
  ],
  ocean: [
    'Bioluminescent creatures drift past in the crushing darkness...',
    'The pressure makes your ears ring as you descend deeper...',
    'Barnacle-encrusted ruins loom out of the murky water...',
    'A current of freezing water pushes against you relentlessly...',
    'Distant whale song reverberates through the deep trenches...',
  ],
  celestial: [
    'Golden light bathes the floating pathway beneath your feet...',
    'Stars wheel overhead in patterns that defy comprehension...',
    'Wind chimes of crystal sing in harmonies that lift your spirit...',
    'The clouds below glow with the reflected light of distant suns...',
    'An aurora of impossible colors dances across the sky...',
  ],
  void: [
    'Reality flickers like a dying screen at the edges of your vision...',
    'The ground shifts beneath you, solid one moment, nothing the next...',
    'Whispers in languages that have never existed fill the silence...',
    'Your shadow moves independently, reaching toward the darkness...',
    'Time stutters, seconds repeating themselves before lurching forward...',
  ],
};

// ---- RANDOM EVENTS ----
// Events that can occur during exploration with risk/reward choices.
// Each event has choices with weighted outcomes (odds sum to 1.0).
// outcome.type: 'gold', 'item', 'damage', 'energy_drain', 'battle', 'nothing', 'heal'
export const RANDOM_EVENTS = [
  {
    id: 'mysterious-chest',
    title: 'Mysterious Chest',
    description: 'You spot an ornate chest sitting in the open. It could be a stash of loot... or a trap.',
    choices: [
      {
        label: 'Open the Chest',
        outcomes: [
          { weight: 0.45, type: 'item', text: 'The chest creaks open revealing valuable loot inside!' },
          { weight: 0.25, type: 'gold_big', text: 'Jackpot! The chest is packed with gold coins.' },
          { weight: 0.20, type: 'damage', amount: 0.30, text: 'TRAP! A poison dart shoots from the lock and pierces your arm!' },
          { weight: 0.10, type: 'battle_hard', text: 'The chest was a mimic! It springs to life and attacks!' },
        ],
      },
      {
        label: 'Leave It Alone',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'You walk away cautiously. Better safe than sorry.' },
        ],
      },
    ],
  },
  {
    id: 'wounded-traveler',
    title: 'Wounded Traveler',
    description: 'A figure lies slumped against the wall, groaning for help. They could be genuine... or bait.',
    choices: [
      {
        label: 'Help Them',
        outcomes: [
          { weight: 0.40, type: 'gold', text: 'Grateful, they press a pouch of coins into your hand before limping away.' },
          { weight: 0.20, type: 'item', text: '"Take this," they say, handing you gear they can no longer carry.' },
          { weight: 0.25, type: 'energy_drain', amount: 4, text: 'You spend time patching them up but they have nothing to offer. Energy wasted.' },
          { weight: 0.15, type: 'ambush', text: 'It was an ambush! They leap up and accomplices emerge from the shadows!' },
        ],
      },
      {
        label: 'Ignore Them',
        outcomes: [
          { weight: 0.70, type: 'nothing', text: 'You keep moving. Not your problem.' },
          { weight: 0.30, type: 'guilt_gold', text: 'You walk past but guilt nags you. You toss them a few coins.' },
        ],
      },
    ],
  },
  {
    id: 'strange-merchant',
    title: 'Strange Merchant',
    description: 'A hooded figure beckons from the shadows, offering a "once in a lifetime deal" for some gold.',
    choices: [
      {
        label: 'Pay Up',
        outcomes: [
          { weight: 0.30, type: 'item_rare', text: 'They hand over something genuinely valuable. A rare find!' },
          { weight: 0.25, type: 'item', text: 'Decent gear, roughly worth what you paid. Fair enough.' },
          { weight: 0.20, type: 'scam', text: 'The item crumbles to dust in your hands. You\'ve been scammed!' },
          { weight: 0.10, type: 'item_great', text: 'Your eyes widen. This piece is incredible — worth ten times what you paid!' },
          { weight: 0.15, type: 'energy_drinks', amount: 2, text: 'The merchant pulls out a stash of energy drinks from under their cloak!' },
        ],
      },
      {
        label: 'Walk Away',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'You decline. The merchant shrugs and melts back into the dark.' },
        ],
      },
    ],
  },
  {
    id: 'energy-peddler',
    title: 'Neon Juice Peddler',
    description: 'A twitchy figure with a glowing backpack rattles with cans. "Psst! You look tired. I got the good stuff — pure liquid energy!"',
    choices: [
      {
        label: 'Buy the Stash',
        outcomes: [
          { weight: 0.30, type: 'energy_drinks', amount: 3, text: 'They hand over a small bundle of energy drinks. Three cans, ice cold!' },
          { weight: 0.25, type: 'energy_drinks', amount: 5, text: 'The peddler grins and dumps a hefty pile of drinks into your arms!' },
          { weight: 0.15, type: 'energy_drinks', amount: 7, text: 'Jackpot! The peddler empties their entire backpack for you. Seven cans!' },
          { weight: 0.15, type: 'energy_drinks', amount: 1, text: 'They sheepishly hand over a single can. "That\'s all I got left, friend."' },
          { weight: 0.15, type: 'scam', text: 'The cans are empty. Every single one. You\'ve been played.' },
        ],
      },
      {
        label: 'Haggle',
        outcomes: [
          { weight: 0.40, type: 'energy_drinks', amount: 2, text: 'After some back and forth, you get a couple cans at a fair price.' },
          { weight: 0.30, type: 'energy_drinks', amount: 4, text: 'Your negotiation skills impress them. They throw in extra cans!' },
          { weight: 0.30, type: 'nothing', text: '"No deal!" The peddler zips up their backpack and vanishes.' },
        ],
      },
      {
        label: 'Walk Away',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'You pass on the offer. The peddler shrugs and disappears into the crowd.' },
        ],
      },
    ],
  },
  {
    id: 'glowing-shrine',
    title: 'Glowing Shrine',
    description: 'A faintly glowing shrine hums with energy. You sense it could restore or drain you.',
    choices: [
      {
        label: 'Touch the Shrine',
        outcomes: [
          { weight: 0.35, type: 'heal', amount: 0.40, text: 'Warm light floods through you. Your wounds close and you feel revitalized!' },
          { weight: 0.25, type: 'energy_restore', amount: 10, text: 'A surge of energy courses through your body!' },
          { weight: 0.25, type: 'damage', amount: 0.25, text: 'The shrine crackles and zaps you with dark energy!' },
          { weight: 0.15, type: 'energy_drain', amount: 6, text: 'The shrine siphons your vitality. You feel drained and sluggish.' },
        ],
      },
      {
        label: 'Pray at the Shrine',
        outcomes: [
          { weight: 0.50, type: 'heal', amount: 0.15, text: 'A gentle warmth washes over you. Minor wounds mend themselves.' },
          { weight: 0.50, type: 'nothing', text: 'Nothing happens. The glow fades as you finish your prayer.' },
        ],
      },
    ],
  },
  {
    id: 'abandoned-camp',
    title: 'Abandoned Camp',
    description: 'A recently abandoned campsite with supplies scattered around. Someone left in a hurry.',
    choices: [
      {
        label: 'Scavenge the Camp',
        outcomes: [
          { weight: 0.35, type: 'item', text: 'You find usable gear stashed under a blanket.' },
          { weight: 0.25, type: 'gold', text: 'A coin purse sits forgotten near the dead fire.' },
          { weight: 0.20, type: 'battle_hard', text: 'The owner returns and they are NOT happy to see you!' },
          { weight: 0.20, type: 'energy_drain', amount: 3, text: 'You search everywhere but find nothing of value. Wasted effort.' },
        ],
      },
      {
        label: 'Rest Here',
        outcomes: [
          { weight: 0.60, type: 'heal', amount: 0.20, text: 'You sit by the remains of the fire and catch your breath.' },
          { weight: 0.40, type: 'ambush', text: 'You let your guard down and creatures creep in while you rest!' },
        ],
      },
    ],
  },
  {
    id: 'locked-door',
    title: 'Locked Door',
    description: 'A heavy door with strange markings blocks a side passage. You hear faint sounds from within.',
    choices: [
      {
        label: 'Force It Open',
        outcomes: [
          { weight: 0.30, type: 'gold_big', text: 'The door gives way to a hidden cache of treasure!' },
          { weight: 0.25, type: 'item_rare', text: 'Inside you find a pristine piece of equipment on a pedestal.' },
          { weight: 0.25, type: 'damage', amount: 0.20, text: 'The door was booby-trapped! An explosion throws you backwards.' },
          { weight: 0.20, type: 'battle_hard', text: 'Something terrible was locked behind that door for a reason!' },
        ],
      },
      {
        label: 'Move On',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'Some doors are better left closed. You continue on your way.' },
        ],
      },
    ],
  },
  {
    id: 'gambling-stranger',
    title: 'Gambling Stranger',
    description: 'A grinning stranger offers a coin-flip gamble: "Double your gold or lose it all. Well... some of it."',
    choices: [
      {
        label: 'Take the Bet',
        outcomes: [
          { weight: 0.45, type: 'gold_double', text: 'Lady luck smiles on you! Your wager doubles!' },
          { weight: 0.45, type: 'gold_lose', text: 'The stranger cackles as they pocket your coins. Better luck next time.' },
          { weight: 0.10, type: 'gold_jackpot', text: 'Triple payout! The stranger stares in disbelief and reluctantly pays up.' },
        ],
      },
      {
        label: 'Decline',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: '"No guts, no glory," they shrug and shuffle away.' },
        ],
      },
    ],
  },
  {
    id: 'suspicious-potion',
    title: 'Suspicious Potion',
    description: 'A bubbling vial sits on a makeshift shelf, its contents shifting between colors.',
    choices: [
      {
        label: 'Drink It',
        outcomes: [
          { weight: 0.30, type: 'heal', amount: 0.50, text: 'Incredible! A powerful healing elixir surges through your veins!' },
          { weight: 0.25, type: 'energy_restore', amount: 15, text: 'A jolt of pure energy! You feel like you could explore forever!' },
          { weight: 0.25, type: 'damage', amount: 0.35, text: 'POISON! Your stomach lurches and your vision swims!' },
          { weight: 0.20, type: 'energy_drain', amount: 8, text: 'A sedative! Your limbs grow heavy and you can barely keep your eyes open.' },
        ],
      },
      {
        label: 'Leave It',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'You\'re not that desperate. The mystery potion stays on the shelf.' },
        ],
      },
    ],
  },
  {
    id: 'crumbling-bridge',
    title: 'Crumbling Bridge',
    description: 'A narrow bridge spans a dark chasm. It looks like it could collapse at any moment, but something glints on the other side.',
    choices: [
      {
        label: 'Cross It',
        outcomes: [
          { weight: 0.35, type: 'gold_big', text: 'You make it across! A forgotten stash of treasure awaits you.' },
          { weight: 0.25, type: 'item_rare', text: 'On the far side, a pristine weapon leans against the wall.' },
          { weight: 0.25, type: 'damage', amount: 0.30, text: 'The bridge gives way! You barely grab the edge, scraping yourself badly on the fall.' },
          { weight: 0.15, type: 'energy_drain', amount: 6, text: 'The bridge holds but the crossing is exhausting. You arrive winded and empty-handed.' },
        ],
      },
      {
        label: 'Find Another Way',
        outcomes: [
          { weight: 0.60, type: 'nothing', text: 'You take the long way around. Safe, but nothing to show for it.' },
          { weight: 0.40, type: 'gold', text: 'The detour leads past a hidden coin stash tucked in a wall crack.' },
        ],
      },
    ],
  },
  {
    id: 'rival-adventurer',
    title: 'Rival Adventurer',
    description: 'Another adventurer blocks your path, arms crossed. "This area is mine. Pay the toll or fight for passage."',
    choices: [
      {
        label: 'Pay the Toll',
        outcomes: [
          { weight: 0.40, type: 'gold_lose', text: 'You hand over some coins. They step aside with a smirk.' },
          { weight: 0.30, type: 'item', text: '"Respect," they nod, and toss you a spare piece of gear as thanks.' },
          { weight: 0.30, type: 'scam', text: 'You pay up and they demand more. When you refuse, they shove you and run off with your gold!' },
        ],
      },
      {
        label: 'Fight Them',
        outcomes: [
          { weight: 0.50, type: 'battle_hard', text: 'They draw their weapon. It\'s a fight!' },
          { weight: 0.30, type: 'gold_big', text: 'You step forward aggressively. They flinch, drop their coin purse, and bolt!' },
          { weight: 0.20, type: 'nothing', text: 'You square up but they back down. "Fine, not worth it." They walk away.' },
        ],
      },
    ],
  },
  {
    id: 'strange-noise',
    title: 'Strange Noise',
    description: 'An eerie sound echoes from a dark passage. It could be a creature in distress... or something luring prey.',
    choices: [
      {
        label: 'Investigate',
        outcomes: [
          { weight: 0.25, type: 'item', text: 'You find a wounded animal guarding a stash of dropped supplies.' },
          { weight: 0.25, type: 'gold', text: 'The sound leads to a hidden alcove with scattered coins.' },
          { weight: 0.30, type: 'ambush', text: 'It was a lure! Creatures swarm you from the shadows!' },
          { weight: 0.20, type: 'energy_drain', amount: 4, text: 'You explore the passage but find nothing. Just the wind playing tricks.' },
        ],
      },
      {
        label: 'Keep Moving',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'You ignore the sound and press on. Some mysteries are best left unsolved.' },
        ],
      },
    ],
  },
  {
    id: 'ancient-inscription',
    title: 'Ancient Inscription',
    description: 'Strange symbols are carved into the wall, faintly pulsing with light. You feel compelled to trace them with your finger.',
    choices: [
      {
        label: 'Trace the Symbols',
        outcomes: [
          { weight: 0.30, type: 'heal', amount: 0.35, text: 'The symbols flash bright and warmth floods your body. Ancient healing magic!' },
          { weight: 0.20, type: 'energy_restore', amount: 12, text: 'Knowledge flows into your mind. You feel invigorated and focused!' },
          { weight: 0.25, type: 'damage', amount: 0.25, text: 'The symbols burn red-hot! Pain sears through your hand and up your arm!' },
          { weight: 0.25, type: 'battle_hard', text: 'The wall cracks open and a guardian construct awakens to punish the intruder!' },
        ],
      },
      {
        label: 'Read Without Touching',
        outcomes: [
          { weight: 0.50, type: 'nothing', text: 'The symbols are indecipherable. Interesting, but useless to you.' },
          { weight: 0.50, type: 'gold', text: 'You recognize a symbol — it\'s a marker for a nearby cache! You find some coins.' },
        ],
      },
    ],
  },
  {
    id: 'fallen-crate',
    title: 'Fallen Supply Crate',
    description: 'A supply crate has fallen from somewhere above, its contents spilling out. But it landed near unstable ground.',
    choices: [
      {
        label: 'Grab What You Can',
        outcomes: [
          { weight: 0.35, type: 'item', text: 'You snatch up usable gear before the ground shifts!' },
          { weight: 0.25, type: 'gold', text: 'Coins and valuables scatter — you pocket a handful.' },
          { weight: 0.20, type: 'damage', amount: 0.20, text: 'The ground gives way and debris rains down on you!' },
          { weight: 0.20, type: 'energy_drain', amount: 5, text: 'You dig through the crate frantically but it\'s all junk. Exhausting waste of time.' },
        ],
      },
      {
        label: 'Leave It',
        outcomes: [
          { weight: 1.0, type: 'nothing', text: 'Not worth the risk. You step around the wreckage and move on.' },
        ],
      },
    ],
  },
  {
    id: 'dying-campfire',
    title: 'Dying Campfire',
    description: 'Embers still glow in an abandoned fire pit. A pot of something bubbles over the coals, and a satchel sits nearby.',
    choices: [
      {
        label: 'Eat from the Pot',
        outcomes: [
          { weight: 0.40, type: 'heal', amount: 0.30, text: 'A hearty stew! It warms you up and mends some aches.' },
          { weight: 0.30, type: 'energy_restore', amount: 8, text: 'Whatever was in that stew, it fills you with vigor!' },
          { weight: 0.30, type: 'damage', amount: 0.20, text: 'The food has gone bad. Your stomach cramps violently!' },
        ],
      },
      {
        label: 'Search the Satchel',
        outcomes: [
          { weight: 0.30, type: 'gold', text: 'A few coins and trinkets — someone\'s emergency fund.' },
          { weight: 0.25, type: 'item', text: 'Useful gear tucked inside. Finders keepers.' },
          { weight: 0.25, type: 'ambush', text: 'The satchel\'s owner returns with friends. "That\'s MINE!"' },
          { weight: 0.20, type: 'nothing', text: 'Nothing but old rags and a broken compass.' },
        ],
      },
    ],
  },
  {
    id: 'mysterious-fog',
    title: 'Mysterious Fog',
    description: 'A thick, unnatural fog rolls in suddenly. You can barely see your own hands. Something whispers your name.',
    choices: [
      {
        label: 'Follow the Voice',
        outcomes: [
          { weight: 0.25, type: 'item_rare', text: 'The voice leads you to a hidden treasure, then fades away.' },
          { weight: 0.25, type: 'gold_big', text: 'You stumble into a forgotten vault obscured by the fog!' },
          { weight: 0.25, type: 'battle_hard', text: 'The voice belongs to something hungry. It lunges from the mist!' },
          { weight: 0.25, type: 'damage', amount: 0.25, text: 'You wander blindly and walk straight into a wall. The fog lifts, revealing nothing.' },
        ],
      },
      {
        label: 'Wait It Out',
        outcomes: [
          { weight: 0.50, type: 'nothing', text: 'The fog clears after a while. Nothing happened. Your nerves are shot though.' },
          { weight: 0.30, type: 'energy_drain', amount: 4, text: 'You wait for what feels like an eternity. The fog saps your will.' },
          { weight: 0.20, type: 'heal', amount: 0.15, text: 'The mist carries a faint restorative quality. You feel slightly better.' },
        ],
      },
    ],
  },
  {
    id: 'haunted-well',
    title: 'Haunted Well',
    description: 'An old well pulses with eerie light. Ghostly whispers drift up from the darkness below. A rope still dangles inside.',
    choices: [
      {
        label: 'Climb Down',
        outcomes: [
          { weight: 0.25, type: 'gold_big', text: 'At the bottom you find a skeleton clutching a bag of ancient gold coins!' },
          { weight: 0.25, type: 'item_rare', text: 'A spectral hand offers you a gleaming weapon, then vanishes.' },
          { weight: 0.25, type: 'damage', amount: 0.30, text: 'The rope snaps! You tumble into the darkness and hit the stones below.' },
          { weight: 0.25, type: 'battle_hard', text: 'A restless spirit materializes and attacks with howling fury!' },
        ],
      },
      {
        label: 'Toss a Coin In',
        outcomes: [
          { weight: 0.40, type: 'heal', amount: 0.20, text: 'The spirits accept your offering. A warm glow surrounds you.' },
          { weight: 0.30, type: 'gold_lose', text: 'The coin vanishes into the abyss. That\'s a few coins you won\'t see again.' },
          { weight: 0.30, type: 'energy_restore', amount: 8, text: 'The well hums louder and fills you with supernatural energy!' },
        ],
      },
    ],
  },
  {
    id: 'training-dummy',
    title: 'Training Grounds',
    description: 'A forgotten training area with battered dummies and scattered weapons. The equipment looks like it might still be usable.',
    choices: [
      {
        label: 'Practice Combat',
        outcomes: [
          { weight: 0.40, type: 'energy_drain', amount: 5, text: 'You push yourself through drills until you\'re exhausted, but feel sharper.' },
          { weight: 0.30, type: 'item', text: 'You find a usable weapon hidden among the training gear!' },
          { weight: 0.30, type: 'heal', amount: 0.10, text: 'The rhythmic exercise clears your mind and eases your tensions.' },
        ],
      },
      {
        label: 'Search the Area',
        outcomes: [
          { weight: 0.40, type: 'gold', text: 'You find coins dropped by previous trainees.' },
          { weight: 0.30, type: 'item', text: 'A stash of supplies under a bench — someone\'s forgotten kit.' },
          { weight: 0.30, type: 'nothing', text: 'Nothing useful. Just rust and splinters.' },
        ],
      },
    ],
  },
  {
    id: 'crystal-cave',
    title: 'Crystal Cave',
    description: 'A small cave entrance glitters with crystalline formations. The crystals hum with stored energy, but the cave looks unstable.',
    choices: [
      {
        label: 'Harvest Crystals',
        outcomes: [
          { weight: 0.30, type: 'gold_big', text: 'You pry loose several valuable crystals worth a fortune!' },
          { weight: 0.20, type: 'energy_restore', amount: 15, text: 'The crystals shatter and release pure energy that flows into you!' },
          { weight: 0.25, type: 'damage', amount: 0.35, text: 'The cave collapses! Rocks and crystal shards rain down on you!' },
          { weight: 0.25, type: 'battle_hard', text: 'A crystal golem forms from the walls and defends its domain!' },
        ],
      },
      {
        label: 'Meditate Inside',
        outcomes: [
          { weight: 0.40, type: 'heal', amount: 0.25, text: 'The crystal resonance soothes your body and mind.' },
          { weight: 0.30, type: 'energy_restore', amount: 6, text: 'The ambient energy recharges your spirit.' },
          { weight: 0.30, type: 'nothing', text: 'It\'s peaceful but nothing special happens. At least you got to rest.' },
        ],
      },
    ],
  },
  {
    id: 'bounty-board-random',
    title: 'Roadside Bounty Board',
    description: 'A weathered bounty board stands at a crossroads. One notice catches your eye — a monster nearby with a price on its head.',
    choices: [
      {
        label: 'Hunt the Bounty',
        outcomes: [
          { weight: 0.35, type: 'battle_hard', text: 'You track down the target. It spots you and charges!' },
          { weight: 0.25, type: 'gold_big', text: 'You find the beast already dead. Someone else got it, but the bounty gold is unclaimed!' },
          { weight: 0.20, type: 'item_rare', text: 'You ambush the target and claim both the bounty and its rare gear!' },
          { weight: 0.20, type: 'energy_drain', amount: 6, text: 'Hours of tracking lead nowhere. The trail has gone cold.' },
        ],
      },
      {
        label: 'Read Other Notices',
        outcomes: [
          { weight: 0.50, type: 'gold', text: 'A smaller notice mentions a reward for information. You happen to know the answer!' },
          { weight: 0.50, type: 'nothing', text: 'Old postings and expired bounties. Nothing useful remains.' },
        ],
      },
    ],
  },
  {
    id: 'rusted-automaton',
    title: 'Rusted Automaton',
    description: 'A mechanical construct lies half-buried in rubble, sparking weakly. Its chest compartment appears accessible.',
    choices: [
      {
        label: 'Open the Compartment',
        outcomes: [
          { weight: 0.30, type: 'item_rare', text: 'Inside lies a perfectly preserved piece of ancient tech — still functional!' },
          { weight: 0.25, type: 'gold', text: 'Salvageable parts and precious metal components. Not bad!' },
          { weight: 0.25, type: 'damage', amount: 0.25, text: 'A defense mechanism triggers! Electric shock courses through you!' },
          { weight: 0.20, type: 'battle_hard', text: 'Your tampering reactivates it. The automaton lurches to life and attacks!' },
        ],
      },
      {
        label: 'Salvage Externally',
        outcomes: [
          { weight: 0.50, type: 'gold', text: 'You strip some external plating worth a few coins.' },
          { weight: 0.30, type: 'item', text: 'A detachable component turns out to be useful gear.' },
          { weight: 0.20, type: 'nothing', text: 'Everything on the outside is too corroded to be valuable.' },
        ],
      },
    ],
  },
  {
    id: 'ghostly-merchant',
    title: 'Phantom Peddler',
    description: 'A translucent figure hovers before you, ghostly wares floating around them. "Trade with the dead," they whisper.',
    choices: [
      {
        label: 'Browse Their Wares',
        outcomes: [
          { weight: 0.25, type: 'item_great', text: 'A spectral blade materializes into solid form in your hands. Extraordinary!' },
          { weight: 0.25, type: 'item_rare', text: 'You select an ethereal piece that solidifies when you grasp it. Quality gear!' },
          { weight: 0.15, type: 'gold_lose', text: 'You hand over gold but the item dissolves. The phantom cackles and vanishes!' },
          { weight: 0.15, type: 'energy_drain', amount: 5, text: 'The phantom\'s presence drains your life force just by being near it.' },
          { weight: 0.20, type: 'energy_drinks', amount: 3, text: 'Ghostly energy drinks materialize in your hands. They feel ice cold and very real!' },
        ],
      },
      {
        label: 'Banish the Spirit',
        outcomes: [
          { weight: 0.40, type: 'gold_big', text: 'The phantom shrieks and disperses, dropping solidified coins!' },
          { weight: 0.30, type: 'damage', amount: 0.20, text: 'The spirit curses you as it fades. Spectral wounds appear on your body!' },
          { weight: 0.30, type: 'nothing', text: 'The phantom fades peacefully. "Perhaps another time..." it whispers.' },
        ],
      },
    ],
  },
  {
    id: 'mirror-pool',
    title: 'Mirror Pool',
    description: 'A perfectly still pool reflects not the sky above, but visions of other places. Your reflection seems to move independently.',
    choices: [
      {
        label: 'Reach Into the Water',
        outcomes: [
          { weight: 0.25, type: 'item_rare', text: 'Your reflection hands you something from the other side. It\'s real!' },
          { weight: 0.25, type: 'heal', amount: 0.40, text: 'The water heals all wounds on contact. Ancient magic at work.' },
          { weight: 0.25, type: 'damage', amount: 0.30, text: 'Your reflection grabs your arm and tries to pull you in! You wrench free, injured.' },
          { weight: 0.25, type: 'energy_drain', amount: 7, text: 'The pool absorbs your energy. Your reflection grows stronger as you weaken.' },
        ],
      },
      {
        label: 'Study the Visions',
        outcomes: [
          { weight: 0.40, type: 'gold', text: 'The visions reveal a nearby hidden cache. You go find it!' },
          { weight: 0.30, type: 'energy_restore', amount: 5, text: 'The mesmerizing visions are oddly refreshing. You feel centered.' },
          { weight: 0.30, type: 'nothing', text: 'Beautiful but meaningless. The visions fade as clouds pass overhead.' },
        ],
      },
    ],
  },
  // ---- WEATHER-SPECIFIC EVENTS ----
  // These only appear during matching weather conditions (weather field)
  {
    id: 'rain-flooded-path',
    title: 'Flooded Path',
    weather: 'rain',
    description: 'Heavy rain has flooded the path ahead. Water rushes through the corridor, carrying debris — and possibly treasure.',
    choices: [
      {
        label: 'Wade Through',
        outcomes: [
          { weight: 0.30, type: 'item', text: 'You spot something caught in the current and grab it — usable gear!' },
          { weight: 0.25, type: 'gold', text: 'Coins washed from upstream glint beneath the water. You scoop them up.' },
          { weight: 0.25, type: 'damage', amount: 0.20, text: 'The current is stronger than expected! You\'re slammed against the wall.' },
          { weight: 0.20, type: 'energy_drain', amount: 5, text: 'Fighting the water exhausts you completely, and you find nothing for your trouble.' },
        ],
      },
      {
        label: 'Wait It Out',
        outcomes: [
          { weight: 0.50, type: 'heal', amount: 0.10, text: 'The rain is oddly soothing. You rest and let the water subside.' },
          { weight: 0.50, type: 'nothing', text: 'You wait until the flood recedes. Safe, but time-consuming.' },
        ],
      },
    ],
  },
  {
    id: 'rain-slippery-merchant',
    title: 'Drenched Merchant',
    weather: 'rain',
    description: 'A soaked merchant huddles under a collapsed awning, desperately trying to protect their wares. "Please, buy something before it\'s all ruined!"',
    choices: [
      {
        label: 'Browse Discounted Wares',
        outcomes: [
          { weight: 0.30, type: 'item_rare', text: 'Desperate prices! You snag a fantastic piece of gear for a steal.' },
          { weight: 0.25, type: 'item', text: 'Decent gear at a fair price — the rain hasn\'t ruined everything.' },
          { weight: 0.25, type: 'gold_lose', text: 'The goods are waterlogged and useless. You wasted your gold.' },
          { weight: 0.20, type: 'energy_drinks', amount: 4, text: 'The merchant throws in a waterproof case of energy drinks as a bonus!' },
        ],
      },
      {
        label: 'Help Them Move Stock',
        outcomes: [
          { weight: 0.35, type: 'gold', text: 'Grateful, they pay you for the help and toss in a bonus.' },
          { weight: 0.25, type: 'item', text: '"Keep this," they say, handing you a piece they can\'t sell wet.' },
          { weight: 0.15, type: 'energy_drinks', amount: 2, text: '"You look tired from all that lifting — here, have some energy drinks on the house!"' },
          { weight: 0.25, type: 'energy_drain', amount: 4, text: 'Moving crates in the rain drains you. They nod thanks but offer nothing.' },
        ],
      },
    ],
  },
  {
    id: 'storm-lightning-strike',
    title: 'Lightning Field',
    weather: 'storm',
    description: 'Lightning crashes around you, striking the ground repeatedly. One bolt illuminates something metallic in a crater.',
    choices: [
      {
        label: 'Dash to the Crater',
        outcomes: [
          { weight: 0.25, type: 'item_great', text: 'A weapon fused with lightning energy! It crackles with power in your hands!' },
          { weight: 0.25, type: 'gold_big', text: 'A vein of electrum exposed by the strike — worth a fortune!' },
          { weight: 0.30, type: 'damage', amount: 0.35, text: 'Lightning strikes nearby! The shockwave throws you off your feet!' },
          { weight: 0.20, type: 'battle_hard', text: 'A creature made of pure electricity forms from the strike and attacks!' },
        ],
      },
      {
        label: 'Take Shelter',
        outcomes: [
          { weight: 0.40, type: 'heal', amount: 0.15, text: 'You find shelter and rest while the storm passes.' },
          { weight: 0.30, type: 'energy_restore', amount: 6, text: 'The charged atmosphere fills you with energy.' },
          { weight: 0.30, type: 'nothing', text: 'You hunker down until it passes. Nothing gained, nothing lost.' },
        ],
      },
    ],
  },
  {
    id: 'storm-power-surge',
    title: 'Power Conduit Overload',
    weather: 'storm',
    description: 'A nearby power conduit is sparking violently in the storm. Energy arcs wildly — it could supercharge your gear or fry you.',
    choices: [
      {
        label: 'Touch the Conduit',
        outcomes: [
          { weight: 0.30, type: 'energy_restore', amount: 20, text: 'RAW POWER surges through you! Your energy is fully supercharged!' },
          { weight: 0.25, type: 'heal', amount: 0.50, text: 'The energy surge repairs your body at a cellular level!' },
          { weight: 0.25, type: 'damage', amount: 0.40, text: 'ZAPPED! Electricity courses through your body painfully!' },
          { weight: 0.20, type: 'battle_hard', text: 'The conduit explodes and a surge elemental manifests from the wreckage!' },
        ],
      },
      {
        label: 'Salvage the Wiring',
        outcomes: [
          { weight: 0.50, type: 'gold', text: 'You carefully strip valuable components from the damaged conduit.' },
          { weight: 0.50, type: 'item', text: 'A still-functional component pops free — this could be useful.' },
        ],
      },
    ],
  },
  {
    id: 'fog-shadow-figure',
    title: 'Figure in the Fog',
    weather: 'fog',
    description: 'A silhouette stands motionless in the thick fog ahead. You can\'t tell if it\'s friend, foe, or just a signpost.',
    choices: [
      {
        label: 'Approach Cautiously',
        outcomes: [
          { weight: 0.25, type: 'item_rare', text: 'It\'s an old scarecrow dressed in amazing gear. Finders keepers!' },
          { weight: 0.25, type: 'gold', text: 'A forgotten statue with coins piled at its base. You help yourself.' },
          { weight: 0.25, type: 'ambush', text: 'It moves! You\'ve walked right into a trap!' },
          { weight: 0.25, type: 'nothing', text: 'Just a dead tree. The fog made it look humanoid.' },
        ],
      },
      {
        label: 'Call Out to It',
        outcomes: [
          { weight: 0.30, type: 'heal', amount: 0.20, text: '"Lost traveler?" A healer emerges from the fog and tends to your wounds.' },
          { weight: 0.30, type: 'item', text: 'A fellow adventurer appears. "Take this, you\'ll need it more than me."' },
          { weight: 0.40, type: 'battle_hard', text: 'Your voice draws something hostile out of the mist!' },
        ],
      },
    ],
  },
  {
    id: 'fog-hidden-cache',
    title: 'Fog-Veiled Ruins',
    weather: 'fog',
    description: 'The dense fog reveals crumbling ruins you\'ve never noticed before. They seem to appear and vanish with the mist.',
    choices: [
      {
        label: 'Explore the Ruins',
        outcomes: [
          { weight: 0.30, type: 'item_rare', text: 'Ancient artifacts preserved perfectly in the fog-sealed chambers!' },
          { weight: 0.25, type: 'gold_big', text: 'A treasure vault hidden for centuries, revealed by today\'s fog!' },
          { weight: 0.25, type: 'battle_hard', text: 'Guardian spirits awaken to defend their forgotten domain!' },
          { weight: 0.20, type: 'energy_drain', amount: 7, text: 'The ruins are a maze. You wander lost until the fog lifts, drained.' },
        ],
      },
      {
        label: 'Mark the Location',
        outcomes: [
          { weight: 0.50, type: 'gold', text: 'You grab a few loose coins near the entrance and mark the spot.' },
          { weight: 0.50, type: 'nothing', text: 'By the time you turn around, the ruins have vanished into the fog.' },
        ],
      },
    ],
  },
  {
    id: 'wind-blown-treasure',
    title: 'Wind-Scattered Loot',
    weather: 'wind',
    description: 'Strong gusts have torn apart a traveling merchant\'s cart. Goods are scattered everywhere, blowing across the landscape.',
    choices: [
      {
        label: 'Chase the Loot',
        outcomes: [
          { weight: 0.30, type: 'item', text: 'You snatch a piece of gear from the air before it blows away!' },
          { weight: 0.20, type: 'gold', text: 'Coins scatter across the ground — you pocket everything you can grab!' },
          { weight: 0.15, type: 'energy_drain', amount: 6, text: 'You sprint after the goods but the wind is too strong. Exhausting!' },
          { weight: 0.20, type: 'item_rare', text: 'A rare item lodges against a wall. Lucky catch!' },
          { weight: 0.15, type: 'energy_drinks', amount: 3, text: 'A crate of energy drinks crashes at your feet. Free drinks!' },
        ],
      },
      {
        label: 'Help the Merchant',
        outcomes: [
          { weight: 0.40, type: 'gold', text: 'The merchant rewards your kindness with a generous payment.' },
          { weight: 0.25, type: 'item', text: '"You\'ve earned this," they say, giving you something from their stock.' },
          { weight: 0.15, type: 'heal', amount: 0.15, text: 'The merchant shares a restorative drink with you. "For your trouble."' },
          { weight: 0.20, type: 'energy_drinks', amount: 2, text: '"Here, take some energy drinks — you earned them helping me!"' },
        ],
      },
    ],
  },
  {
    id: 'wind-sail-glider',
    title: 'Abandoned Glider',
    weather: 'wind',
    description: 'A makeshift glider is wedged between buildings, its sail still intact. The wind could carry you over the danger zone ahead.',
    choices: [
      {
        label: 'Ride the Wind',
        outcomes: [
          { weight: 0.30, type: 'energy_restore', amount: 12, text: 'The glider carries you effortlessly! You arrive refreshed and energized!' },
          { weight: 0.25, type: 'gold_big', text: 'You soar over a hidden rooftop stash and swoop down to claim it!' },
          { weight: 0.25, type: 'damage', amount: 0.25, text: 'A gust catches the glider wrong! You crash-land painfully!' },
          { weight: 0.20, type: 'item', text: 'You spot something shiny mid-flight and grab it on the way down.' },
        ],
      },
      {
        label: 'Salvage the Materials',
        outcomes: [
          { weight: 0.60, type: 'gold', text: 'The sail fabric and frame materials are worth a few coins.' },
          { weight: 0.40, type: 'nothing', text: 'The materials are too damaged to be useful.' },
        ],
      },
    ],
  },
  {
    id: 'heatwave-mirage',
    title: 'Shimmering Mirage',
    weather: 'heatwave',
    description: 'The brutal heat creates shimmering mirages. One seems more solid than the others — an oasis? A treasure? A trap?',
    choices: [
      {
        label: 'Investigate the Mirage',
        outcomes: [
          { weight: 0.25, type: 'heal', amount: 0.40, text: 'It\'s real! A hidden spring of cool, restorative water!' },
          { weight: 0.25, type: 'item_rare', text: 'Not a mirage — a heat-warped cache of perfectly preserved gear!' },
          { weight: 0.25, type: 'energy_drain', amount: 8, text: 'Just a mirage. You waste precious energy chasing nothing in the heat.' },
          { weight: 0.25, type: 'damage', amount: 0.30, text: 'The "oasis" is a heat vent! Scalding air blasts you!' },
        ],
      },
      {
        label: 'Conserve Energy',
        outcomes: [
          { weight: 0.50, type: 'energy_restore', amount: 3, text: 'Smart choice. You rest in the shade and conserve your strength.' },
          { weight: 0.50, type: 'nothing', text: 'You press on carefully, avoiding the heat traps.' },
        ],
      },
    ],
  },
  {
    id: 'heatwave-forge',
    title: 'Overheated Forge',
    weather: 'heatwave',
    description: 'An abandoned forge is radiating extreme heat, its embers reignited by the heatwave. Tools and materials still lie inside.',
    choices: [
      {
        label: 'Brave the Heat',
        outcomes: [
          { weight: 0.30, type: 'item_great', text: 'You grab a weapon from the forge — the heat tempered it to perfection!' },
          { weight: 0.25, type: 'item_rare', text: 'Quality gear left behind by the blacksmith. Still usable!' },
          { weight: 0.25, type: 'damage', amount: 0.30, text: 'The heat is unbearable! You burn yourself grabbing at red-hot metal!' },
          { weight: 0.20, type: 'energy_drain', amount: 7, text: 'You can barely breathe in the scorching forge. You retreat empty-handed.' },
        ],
      },
      {
        label: 'Fan the Coals and Sell',
        outcomes: [
          { weight: 0.50, type: 'gold_big', text: 'You stoke the forge and attract a passing smith who pays well for the setup.' },
          { weight: 0.50, type: 'gold', text: 'You sell the leftover materials to a passing scavenger.' },
        ],
      },
    ],
  },
];

// ---- QUEST VILLAGES ----
// Hidden villages/towns that can only be found via random events while exploring specific regions.
// Each village has a set of quests. To turn in a quest, you must find the village again.
export const QUEST_VILLAGES = {
  'neon-district': [
    {
      id: 'pixel-haven', name: 'Pixel Haven',
      description: 'A tiny community of rogue hackers hidden behind a holographic wall in Neon Mile.',
      quests: [
        { id: 'ph-q1', name: 'Debug the Grid', description: 'Defeat 8 Neon Beetles to clear the power grid.', stat: 'monstersKilled', target: 8, reward: { gold: 120, item: 'ring' } },
        { id: 'ph-q2', name: 'Gutter Cleanup', description: 'Defeat 15 monsters in Neon Mile.', stat: 'monstersKilled', target: 15, reward: { gold: 200, item: 'sword' } },
        { id: 'ph-q3', name: 'Data Recovery', description: 'Explore 10 times.', stat: 'explorationsCompleted', target: 10, reward: { gold: 300, item: 'helmet' } },
        { id: 'ph-q4', name: 'Neon Salvage Op', description: 'Retrieve a Rusty Shiv from Neon Mile and a Scrap Axe from Shadow Alley for our defenses.', stat: 'monstersKilled', target: 0, reward: { gold: 400, item: 'amulet' }, itemRequirements: [{ itemName: 'Rusty Shiv', locationId: 'neon-mile', locationName: 'Neon Mile' }, { itemName: 'Scrap Axe', locationId: 'shadow-alley', locationName: 'Shadow Alley' }] },
      ],
      traders: [
        {
          name: 'Byte the Fixer',
          greeting: 'A hacker with neon-green circuit tattoos glances up from a jury-rigged terminal. "Need parts? I got parts."',
          deals: [
            { id: 'ph-t1', description: 'Copper Wire (x2)', cost: 40, type: 'material', materialId: 'copper-wire', quantity: 2, stock: 2 },
            { id: 'ph-t2', description: 'Glass Vial (x2)', cost: 30, type: 'material', materialId: 'glass-vial', quantity: 2, stock: 2 },
            { id: 'ph-t3', description: 'Restore 20 energy', cost: 45, type: 'energy_restore', amount: 20, stock: 3 },
            { id: 'ph-t4', description: 'Hacked gear piece', cost: 120, type: 'rare_item', stock: 1 },
          ],
        },
        {
          name: 'Glitch the Data Broker',
          greeting: 'A kid in an oversized hoodie peers from behind stacks of humming hard drives. "I deal in information... and the occasional upgrade."',
          deals: [
            { id: 'ph-t5', description: 'Iron Ore (x2)', cost: 50, type: 'material', materialId: 'iron-ore', quantity: 2, stock: 2 },
            { id: 'ph-t6', description: 'Full Mana restore', cost: 35, type: 'full_mana', stock: 2 },
            { id: 'ph-t7', description: 'Weapon upgrade (+3 levels)', cost: 140, type: 'weapon_upgrade', stock: 1 },
          ],
        },
      ],
    },
    {
      id: 'undervolt', name: 'Undervolt',
      description: 'An underground bazaar powered by stolen energy cells, tucked beneath Shadow Alley.',
      quests: [
        { id: 'uv-q1', name: 'Blackout Patrol', description: 'Win 10 battles.', stat: 'battlesWon', target: 10, reward: { gold: 180, item: 'armor' } },
        { id: 'uv-q2', name: 'Voltage Collector', description: 'Earn 500 gold from any source.', stat: 'goldEarned', target: 500, reward: { gold: 350, item: 'amulet' } },
        { id: 'uv-q3', name: 'Power Cell Assembly', description: 'Bring a Copper Dagger from Neon Mile and an Iron Shortsword from Metro Underpass to build a power cell.', stat: 'monstersKilled', target: 0, reward: { gold: 500, item: 'ring' }, itemRequirements: [{ itemName: 'Copper Dagger', locationId: 'neon-mile', locationName: 'Neon Mile' }, { itemName: 'Iron Shortsword', locationId: 'metro-underpass', locationName: 'Metro Underpass' }] },
      ],
      traders: [
        {
          name: 'Sparks the Cell Runner',
          greeting: 'A wiry figure plugged into a wall of humming batteries grins. "Power cells, potions, you name it — all off the grid."',
          deals: [
            { id: 'uv-t1', description: 'Oil Canister (x1)', cost: 55, type: 'material', materialId: 'oil-canister', quantity: 1, stock: 1 },
            { id: 'uv-t2', description: 'Full HP restoration', cost: 40, type: 'full_heal', stock: 2 },
            { id: 'uv-t3', description: 'Scrap Wood (x3)', cost: 25, type: 'material', materialId: 'scrap-wood', quantity: 3, stock: 2 },
            { id: 'uv-t4', description: 'Overclocked weapon', cost: 160, type: 'rare_item', stock: 1 },
          ],
        },
        {
          name: 'Amp the Juice Dealer',
          greeting: 'A twitchy figure surrounded by sparking cables beckons. "Need a recharge? I got the good stuff — pure voltage."',
          deals: [
            { id: 'uv-t5', description: 'Restore 30 energy', cost: 60, type: 'energy_restore', amount: 30, stock: 2 },
            { id: 'uv-t6', description: 'Mysterious Egg (Common)', cost: 130, type: 'egg', eggId: 'common-egg', stock: 1 },
            { id: 'uv-t7', description: 'Charcoal (x3)', cost: 35, type: 'material', materialId: 'charcoal', quantity: 3, stock: 2 },
          ],
        },
      ],
    },
  ],
  'frozen-wastes': [
    {
      id: 'frostfire-camp', name: 'Frostfire Camp',
      description: 'A warm encampment built around a volcanic vent in the middle of the frozen tundra.',
      quests: [
        { id: 'ff-q1', name: 'Thaw the Passage', description: 'Defeat 12 Frost Wolves to clear the mountain pass.', stat: 'monstersKilled', target: 12, reward: { gold: 250, item: 'boots' } },
        { id: 'ff-q2', name: 'Icebreaker', description: 'Deal 2000 total damage.', stat: 'damageDealt', target: 2000, reward: { gold: 400, item: 'sword' } },
        { id: 'ff-q3', name: 'Avalanche Watch', description: 'Explore 15 times.', stat: 'explorationsCompleted', target: 15, reward: { gold: 500, item: 'shield' } },
        { id: 'ff-q4', name: 'Frostforging Supplies', description: 'Bring a Frostbite Cleaver from Glacier Tunnels and a Cryo Lancet from Glacier Tunnels to fuel the forge.', stat: 'monstersKilled', target: 0, reward: { gold: 700, item: 'armor' }, itemRequirements: [{ itemName: 'Frostbite Cleaver', locationId: 'glacier-tunnels', locationName: 'Glacier Tunnels' }, { itemName: 'Cryo Lancet', locationId: 'glacier-tunnels', locationName: 'Glacier Tunnels' }] },
      ],
      traders: [
        {
          name: 'Helga the Hearthkeeper',
          greeting: 'A broad-shouldered woman stirs a bubbling cauldron by the volcanic vent. "Warm yourself, and browse my wares."',
          deals: [
            { id: 'ff-t1', description: 'Herb Bundle (x2)', cost: 50, type: 'material', materialId: 'herb-bundle', quantity: 2, stock: 2 },
            { id: 'ff-t2', description: 'Crystal Shard (x1)', cost: 120, type: 'material', materialId: 'crystal-shard', quantity: 1, stock: 1 },
            { id: 'ff-t3', description: 'Full HP + Mana restore', cost: 70, type: 'full_heal_mana', stock: 2 },
            { id: 'ff-t4', description: 'Frostforged gear piece', cost: 200, type: 'rare_item', stock: 1 },
          ],
        },
        {
          name: 'Sven the Fur Trader',
          greeting: 'A burly man wrapped in layers of pelts slaps a frozen table. "Finest materials in the tundra! Warm and sturdy."',
          deals: [
            { id: 'ff-t5', description: 'Scrap Wood (x4)', cost: 30, type: 'material', materialId: 'scrap-wood', quantity: 4, stock: 2 },
            { id: 'ff-t6', description: 'Stone Block (x2)', cost: 45, type: 'material', materialId: 'stone-block', quantity: 2, stock: 2 },
            { id: 'ff-t7', description: 'Armor upgrade (+3 levels)', cost: 170, type: 'armor_upgrade', stock: 1 },
            { id: 'ff-t8', description: 'Gleaming Egg (Uncommon)', cost: 380, type: 'egg', eggId: 'uncommon-egg', stock: 1 },
          ],
        },
      ],
    },
  ],
  'scorched-badlands': [
    {
      id: 'oasis-outpost', name: 'Oasis Outpost',
      description: 'A hidden oasis town where desert traders gather to exchange rare goods and stories.',
      quests: [
        { id: 'oo-q1', name: 'Sand Viper Hunt', description: 'Win 15 battles in the badlands.', stat: 'battlesWon', target: 15, reward: { gold: 350, item: 'ring' } },
        { id: 'oo-q2', name: 'Forge Materials', description: 'Loot 10 items.', stat: 'itemsLooted', target: 10, reward: { gold: 450, item: 'armor' } },
        { id: 'oo-q3', name: 'Mirage Runner', description: 'Explore 20 times.', stat: 'explorationsCompleted', target: 20, reward: { gold: 600, item: 'cape' } },
        { id: 'oo-q4', name: 'Desert Arms Deal', description: 'Bring an Ember Scimitar from Sunscorch Canyon and a Volcanic Greataxe from Inferno Pit for the outpost armory.', stat: 'monstersKilled', target: 0, reward: { gold: 900, item: 'sword' }, itemRequirements: [{ itemName: 'Ember Scimitar', locationId: 'sunscorch-canyon', locationName: 'Sunscorch Canyon' }, { itemName: 'Volcanic Greataxe', locationId: 'inferno-pit', locationName: 'Inferno Pit' }] },
      ],
      traders: [
        {
          name: 'Raziq the Sand Merchant',
          greeting: 'A weathered trader in flowing desert robes spreads out a rug of goods. "The desert provides, if you know where to look."',
          deals: [
            { id: 'oo-t1', description: 'Iron Ore (x2)', cost: 55, type: 'material', materialId: 'iron-ore', quantity: 2, stock: 2 },
            { id: 'oo-t2', description: 'Charcoal (x3)', cost: 40, type: 'material', materialId: 'charcoal', quantity: 3, stock: 1 },
            { id: 'oo-t3', description: 'Weapon upgrade (+3 levels)', cost: 180, type: 'weapon_upgrade', stock: 1 },
            { id: 'oo-t4', description: 'Stone Block (x3)', cost: 45, type: 'material', materialId: 'stone-block', quantity: 3, stock: 2 },
          ],
        },
        {
          name: 'Mirra the Water Seller',
          greeting: 'A woman guards a cart of glowing blue bottles. "Water is life out here. But I carry more than water..."',
          deals: [
            { id: 'oo-t5', description: 'Full HP restoration', cost: 45, type: 'full_heal', stock: 2 },
            { id: 'oo-t6', description: 'Restore 25 energy', cost: 55, type: 'energy_restore', amount: 25, stock: 3 },
            { id: 'oo-t7', description: 'High-level gear piece', cost: 140, type: 'high_level_item', stock: 1 },
          ],
        },
      ],
    },
    {
      id: 'ember-sanctum', name: 'Ember Sanctum',
      description: 'A monastery built into a dormant volcano, home to fire monks who seek balance.',
      quests: [
        { id: 'es-q1', name: 'Trial by Fire', description: 'Deal 5000 total damage.', stat: 'damageDealt', target: 5000, reward: { gold: 500, item: 'sword' } },
        { id: 'es-q2', name: 'Inner Peace', description: 'Use 10 potions.', stat: 'potionsUsed', target: 10, reward: { gold: 350, item: 'amulet' } },
      ],
      traders: [
        {
          name: 'Brother Cinder',
          greeting: 'A monk with smoldering eyes bows slightly. "The flames have tempered these offerings. Take what you need."',
          deals: [
            { id: 'es-t1', description: 'Coal Chunk (x2)', cost: 65, type: 'material', materialId: 'coal-chunk', quantity: 2, stock: 2 },
            { id: 'es-t2', description: 'Full HP restoration', cost: 50, type: 'full_heal', stock: 2 },
            { id: 'es-t3', description: 'Armor upgrade (+3 levels)', cost: 180, type: 'armor_upgrade', stock: 1 },
            { id: 'es-t4', description: 'Glass Vial (x3)', cost: 35, type: 'material', materialId: 'glass-vial', quantity: 3, stock: 2 },
          ],
        },
        {
          name: 'Sister Ash',
          greeting: 'A serene woman meditates beside a wall of glowing embers. "The volcano gives freely to those who respect it."',
          deals: [
            { id: 'es-t5', description: 'Iron Ore (x3)', cost: 70, type: 'material', materialId: 'iron-ore', quantity: 3, stock: 1 },
            { id: 'es-t6', description: 'Full Mana restore', cost: 40, type: 'full_mana', stock: 2 },
            { id: 'es-t7', description: 'Mysterious Egg (Common)', cost: 140, type: 'egg', eggId: 'common-egg', stock: 1 },
          ],
        },
      ],
    },
  ],
  'toxic-marshlands': [
    {
      id: 'sporehaven', name: 'Sporehaven',
      description: 'A village of mushroom houses built on stilts above the toxic mire. Surprisingly cozy.',
      quests: [
        { id: 'sh-q1', name: 'Fungal Purge', description: 'Defeat 20 monsters.', stat: 'monstersKilled', target: 20, reward: { gold: 500, item: 'boots' } },
        { id: 'sh-q2', name: 'Antidote Run', description: 'Win 18 battles.', stat: 'battlesWon', target: 18, reward: { gold: 600, item: 'shield' } },
        { id: 'sh-q3', name: 'Marsh Surveyor', description: 'Explore 25 times.', stat: 'explorationsCompleted', target: 25, reward: { gold: 800, item: 'cape' } },
      ],
      traders: [
        {
          name: 'Mireena the Apothecary',
          greeting: 'A woman with mushroom-cap earrings tends rows of bubbling flasks. "My tonics will keep the toxins at bay."',
          deals: [
            { id: 'sh-t1', description: 'Toxic Resin (x2)', cost: 75, type: 'material', materialId: 'toxic-resin', quantity: 2, stock: 1 },
            { id: 'sh-t2', description: 'Herb Bundle (x3)', cost: 60, type: 'material', materialId: 'herb-bundle', quantity: 3, stock: 2 },
            { id: 'sh-t3', description: 'Full HP + Mana restore', cost: 80, type: 'full_heal_mana', stock: 2 },
            { id: 'sh-t4', description: 'Mysterious Egg (Common)', cost: 150, type: 'egg', eggId: 'common-egg', stock: 1 },
          ],
        },
        {
          name: 'Boggart the Scrap Dredger',
          greeting: 'A squat figure in a gas mask hauls a dripping net of salvage onto the dock. "Pulled these right out of the muck. Still good!"',
          deals: [
            { id: 'sh-t5', description: 'Copper Wire (x3)', cost: 55, type: 'material', materialId: 'copper-wire', quantity: 3, stock: 2 },
            { id: 'sh-t6', description: 'Oil Canister (x1)', cost: 60, type: 'material', materialId: 'oil-canister', quantity: 1, stock: 1 },
            { id: 'sh-t7', description: 'Weapon upgrade (+3 levels)', cost: 200, type: 'weapon_upgrade', stock: 1 },
            { id: 'sh-t8', description: 'Double your gold (up to 200g)', cost: 0, type: 'gold_gamble', stock: 2 },
          ],
        },
      ],
    },
  ],
  'abyssal-depths': [
    {
      id: 'deep-haven', name: 'Deep Haven',
      description: 'A bioluminescent city in an air pocket deep beneath the waves, inhabited by reclusive scholars.',
      quests: [
        { id: 'dh-q1', name: 'Leviathan Slayer', description: 'Defeat 25 monsters in the depths.', stat: 'monstersKilled', target: 25, reward: { gold: 800, item: 'sword' } },
        { id: 'dh-q2', name: 'Pressure Test', description: 'Deal 8000 total damage.', stat: 'damageDealt', target: 8000, reward: { gold: 1000, item: 'armor' } },
        { id: 'dh-q3', name: 'Abyssal Explorer', description: 'Explore 30 times.', stat: 'explorationsCompleted', target: 30, reward: { gold: 1200, item: 'ring' } },
        { id: 'dh-q4', name: 'Trench Expedition Gear', description: 'Retrieve a Coral Trident from the Coral Labyrinth and a Leviathan Tooth from Kraken\'s Rest for our deep-sea research.', stat: 'monstersKilled', target: 0, reward: { gold: 2000, item: 'armor' }, itemRequirements: [{ itemName: 'Coral Trident', locationId: 'coral-labyrinth', locationName: 'Coral Labyrinth' }, { itemName: 'Leviathan Tooth', locationId: 'krakens-rest', locationName: "Kraken's Rest" }] },
      ],
      traders: [
        {
          name: 'Scholar Tidepool',
          greeting: 'A figure in barnacle-studded robes adjusts luminescent goggles. "I\'ve catalogued treasures from the deepest trenches."',
          deals: [
            { id: 'dh-t1', description: 'Deep Coral (x2)', cost: 180, type: 'material', materialId: 'deep-coral', quantity: 2, stock: 1 },
            { id: 'dh-t2', description: 'Copper Wire (x3)', cost: 60, type: 'material', materialId: 'copper-wire', quantity: 3, stock: 2 },
            { id: 'dh-t3', description: 'Abyssal gear piece', cost: 300, type: 'rare_item', stock: 1 },
            { id: 'dh-t4', description: 'Gleaming Egg (Uncommon)', cost: 400, type: 'egg', eggId: 'uncommon-egg', stock: 1 },
          ],
        },
        {
          name: 'Barnacle Jim',
          greeting: 'An old diver with a cracked helmet and a crooked grin. "Found these on my last dive. Almost didn\'t make it back!"',
          deals: [
            { id: 'dh-t5', description: 'Deep Coral (x1)', cost: 100, type: 'material', materialId: 'deep-coral', quantity: 1, stock: 2 },
            { id: 'dh-t6', description: 'Mystery Box (could be amazing... or terrible)', cost: 120, type: 'mystery_box', stock: 1 },
            { id: 'dh-t7', description: 'Full HP restoration', cost: 55, type: 'full_heal', stock: 2 },
            { id: 'dh-t8', description: 'Iron Ore (x3)', cost: 65, type: 'material', materialId: 'iron-ore', quantity: 3, stock: 1 },
          ],
        },
      ],
    },
    {
      id: 'coral-refuge', name: 'Coral Refuge',
      description: 'A settlement built inside a massive living coral formation, its inhabitants communicate through bioluminescent signals.',
      quests: [
        { id: 'cr-q1', name: 'Coral Defense', description: 'Win 20 battles.', stat: 'battlesWon', target: 20, reward: { gold: 700, item: 'shield' } },
        { id: 'cr-q2', name: 'Deep Harvest', description: 'Loot 15 items.', stat: 'itemsLooted', target: 15, reward: { gold: 900, item: 'boots' } },
      ],
      traders: [
        {
          name: 'Lumina the Signal Keeper',
          greeting: 'Bioluminescent patterns pulse across her skin as she gestures to a shelf of coral-carved goods. "The reef offers its bounty."',
          deals: [
            { id: 'cr-t1', description: 'Coal Chunk (x2)', cost: 70, type: 'material', materialId: 'coal-chunk', quantity: 2, stock: 2 },
            { id: 'cr-t2', description: 'Restore 30 energy', cost: 90, type: 'energy_restore', amount: 30, stock: 2 },
            { id: 'cr-t3', description: 'Deep-sea weapon', cost: 350, type: 'legendary_item', stock: 1 },
          ],
        },
      ],
    },
  ],
  'celestial-highlands': [
    {
      id: 'starfall-village', name: 'Starfall Village',
      description: 'A floating village built on cloud platforms, illuminated by perpetual starlight.',
      quests: [
        { id: 'sv-q1', name: 'Star Collector', description: 'Defeat 30 monsters.', stat: 'monstersKilled', target: 30, reward: { gold: 1000, item: 'ring' } },
        { id: 'sv-q2', name: 'Sky Warrior', description: 'Deal 10000 total damage.', stat: 'damageDealt', target: 10000, reward: { gold: 1500, item: 'sword' } },
        { id: 'sv-q3', name: 'Celestial Survey', description: 'Explore 35 times.', stat: 'explorationsCompleted', target: 35, reward: { gold: 1800, item: 'cape' } },
      ],
      traders: [
        {
          name: 'Astra the Starweaver',
          greeting: 'A woman draped in shimmering starlight fabric floats down to meet you. "The stars have guided you here for a reason."',
          deals: [
            { id: 'sv-t1', description: 'Starlight Dust (x2)', cost: 200, type: 'material', materialId: 'starlight-dust', quantity: 2, stock: 1 },
            { id: 'sv-t2', description: 'Crystal Shard (x2)', cost: 180, type: 'material', materialId: 'crystal-shard', quantity: 2, stock: 2 },
            { id: 'sv-t3', description: 'Celestial gear piece', cost: 400, type: 'legendary_item', stock: 1 },
            { id: 'sv-t4', description: 'Radiant Egg (Rare)', cost: 800, type: 'egg', eggId: 'rare-egg', stock: 1 },
          ],
        },
        {
          name: 'Orion the Cloud Shepherd',
          greeting: 'A gentle giant tends a flock of luminous cloud-creatures. "They produce the finest materials in the highlands. Have a look."',
          deals: [
            { id: 'sv-t5', description: 'Herb Bundle (x4)', cost: 80, type: 'material', materialId: 'herb-bundle', quantity: 4, stock: 1 },
            { id: 'sv-t6', description: 'Plasma Core (x1)', cost: 260, type: 'material', materialId: 'plasma-core', quantity: 1, stock: 1 },
            { id: 'sv-t7', description: 'Full HP + Mana restore', cost: 90, type: 'full_heal_mana', stock: 2 },
          ],
        },
      ],
    },
    {
      id: 'moonbridge-shrine', name: 'Moonbridge Shrine',
      description: 'An ancient temple connected by bridges of solidified moonlight. The monks here study cosmic energy.',
      quests: [
        { id: 'ms-q1', name: 'Cosmic Alignment', description: 'Win 25 battles.', stat: 'battlesWon', target: 25, reward: { gold: 1200, item: 'amulet' } },
        { id: 'ms-q2', name: 'Astral Meditation', description: 'Use 15 potions.', stat: 'potionsUsed', target: 15, reward: { gold: 800, item: 'helmet' } },
      ],
      traders: [
        {
          name: 'Sage Moonwhisper',
          greeting: 'An ancient monk sits cross-legged on a bridge of light. "The cosmos rewards those who seek balance."',
          deals: [
            { id: 'ms-t1', description: 'Plasma Core (x1)', cost: 250, type: 'material', materialId: 'plasma-core', quantity: 1, stock: 1 },
            { id: 'ms-t2', description: 'Full HP + Mana restore', cost: 100, type: 'full_heal_mana', stock: 2 },
            { id: 'ms-t3', description: 'Herb Bundle (x3)', cost: 70, type: 'material', materialId: 'herb-bundle', quantity: 3, stock: 2 },
          ],
        },
        {
          name: 'Novice Prism',
          greeting: 'A young monk juggles glowing orbs of solidified moonlight. "Master Moonwhisper lets me sell my practice crystals. They still work, I promise!"',
          deals: [
            { id: 'ms-t4', description: 'Crystal Shard (x3)', cost: 250, type: 'material', materialId: 'crystal-shard', quantity: 3, stock: 1 },
            { id: 'ms-t5', description: 'Restore 35 energy', cost: 100, type: 'energy_restore', amount: 35, stock: 2 },
            { id: 'ms-t6', description: 'Gleaming Egg (Uncommon)', cost: 420, type: 'egg', eggId: 'uncommon-egg', stock: 1 },
          ],
        },
      ],
    },
  ],
  'void-nexus': [
    {
      id: 'echoing-bastion', name: 'Echoing Bastion',
      description: 'A fortress that exists in multiple dimensions simultaneously. Its inhabitants are fragments of lost travelers.',
      quests: [
        { id: 'eb-q1', name: 'Reality Anchor', description: 'Defeat 35 monsters.', stat: 'monstersKilled', target: 35, reward: { gold: 1500, item: 'armor' } },
        { id: 'eb-q2', name: 'Void Walker', description: 'Explore 40 times.', stat: 'explorationsCompleted', target: 40, reward: { gold: 2000, item: 'ring' } },
        { id: 'eb-q3', name: 'Dimensional Rift', description: 'Deal 15000 total damage.', stat: 'damageDealt', target: 15000, reward: { gold: 2500, item: 'sword' } },
        { id: 'eb-q4', name: 'Reality Stabilizer Parts', description: 'Bring a Rift Severer from the Paradox Maze and a Nullpoint Edge from the Singularity Well to stabilize the dimensional rift.', stat: 'monstersKilled', target: 0, reward: { gold: 3500, item: 'cape' }, itemRequirements: [{ itemName: 'Rift Severer', locationId: 'paradox-maze', locationName: 'Paradox Maze' }, { itemName: 'Nullpoint Edge', locationId: 'singularity-well', locationName: 'Singularity Well' }] },
      ],
      traders: [
        {
          name: 'Echo the Fragmentist',
          greeting: 'A figure that flickers between multiple forms extends a hand. "I carry wares from realities that never were."',
          deals: [
            { id: 'eb-t1', description: 'Void Essence (x2)', cost: 300, type: 'material', materialId: 'void-essence', quantity: 2, stock: 1 },
            { id: 'eb-t2', description: 'Plasma Core (x1)', cost: 280, type: 'material', materialId: 'plasma-core', quantity: 1, stock: 1 },
            { id: 'eb-t3', description: 'Void-forged legendary gear', cost: 500, type: 'legendary_item', stock: 1 },
            { id: 'eb-t4', description: 'Restore 40 energy', cost: 120, type: 'energy_restore', amount: 40, stock: 2 },
          ],
        },
        {
          name: 'Rift the Paradox Peddler',
          greeting: 'A merchant who appears to be both old and young simultaneously. "My wares exist in superposition. Until you buy them, they are everything at once."',
          deals: [
            { id: 'eb-t5', description: 'Cursed item (powerful but risky)', cost: 120, type: 'cursed_item', stock: 1 },
            { id: 'eb-t6', description: 'Starlight Dust (x2)', cost: 240, type: 'material', materialId: 'starlight-dust', quantity: 2, stock: 1 },
            { id: 'eb-t7', description: 'Void Essence (x1)', cost: 160, type: 'material', materialId: 'void-essence', quantity: 1, stock: 2 },
            { id: 'eb-t8', description: 'Radiant Egg (Rare) — VERY RARE!', cost: 850, type: 'egg', eggId: 'rare-egg', stock: 1 },
          ],
        },
      ],
    },
    {
      id: 'null-market', name: 'The Null Market',
      description: 'A bazaar where space folds in on itself. Merchants from every dimension peddle impossible wares.',
      quests: [
        { id: 'nm-q1', name: 'Interdimensional Trade', description: 'Earn 3000 gold.', stat: 'goldEarned', target: 3000, reward: { gold: 2000, item: 'cape' } },
        { id: 'nm-q2', name: 'Null Zone Sweep', description: 'Win 30 battles.', stat: 'battlesWon', target: 30, reward: { gold: 1800, item: 'shield' } },
      ],
      traders: [
        {
          name: 'The Null Broker',
          greeting: 'A faceless entity behind a counter that seems to stretch infinitely. "Everything has a price. Even nothing."',
          deals: [
            { id: 'nm-t1', description: 'Starlight Dust (x2)', cost: 220, type: 'material', materialId: 'starlight-dust', quantity: 2, stock: 1 },
            { id: 'nm-t2', description: 'Mystery Box (could be amazing... or terrible)', cost: 150, type: 'mystery_box', stock: 1 },
            { id: 'nm-t3', description: 'Cursed item (powerful but risky)', cost: 100, type: 'cursed_item', stock: 1 },
            { id: 'nm-t4', description: 'Radiant Egg (Rare) — VERY RARE!', cost: 900, type: 'egg', eggId: 'rare-egg', stock: 1 },
          ],
        },
        {
          name: 'Zephyr the Probability Trader',
          greeting: 'A translucent figure shuffles cards made of compressed spacetime. "In this market, luck is just another commodity."',
          deals: [
            { id: 'nm-t5', description: 'Double your gold (up to 300g)', cost: 0, type: 'gold_gamble', stock: 2 },
            { id: 'nm-t6', description: 'Mystery Box (could be amazing... or terrible)', cost: 100, type: 'mystery_box', stock: 1 },
            { id: 'nm-t7', description: 'Void-touched legendary weapon', cost: 600, type: 'legendary_item', stock: 1 },
            { id: 'nm-t8', description: 'Full HP + Mana restore', cost: 110, type: 'full_heal_mana', stock: 2 },
          ],
        },
      ],
    },
  ],
};

// ---- EXTRAORDINARY TRADERS ----
// Rare traders with unique deals, encountered via random events
export const EXTRAORDINARY_TRADERS = [
  {
    id: 'trader-nyx', name: 'Nyx the Shadow Dealer',
    greeting: 'A cloaked figure with glowing purple eyes materializes from thin air. "I deal in things others cannot find..."',
    deals: [
      { id: 'nyx-1', description: 'Mystery Box (could be amazing... or terrible)', cost: 100, type: 'mystery_box' },
      { id: 'nyx-2', description: 'Full HP restoration', cost: 50, type: 'full_heal' },
      { id: 'nyx-3', description: 'Rare equipment piece', cost: 250, type: 'rare_item' },
    ],
  },
  {
    id: 'trader-grizzle', name: 'Grizzle the Wandering Smith',
    greeting: 'A grizzled dwarf with a portable anvil strapped to his back waves you over. "Best prices this side of the wasteland!"',
    deals: [
      { id: 'grz-1', description: 'Weapon upgrade (+3 levels)', cost: 150, type: 'weapon_upgrade' },
      { id: 'grz-2', description: 'Armor upgrade (+3 levels)', cost: 150, type: 'armor_upgrade' },
      { id: 'grz-3', description: 'Random legendary-tier gear', cost: 500, type: 'legendary_item' },
    ],
  },
  {
    id: 'trader-luna', name: 'Luna the Energy Witch',
    greeting: 'A woman with crackling electricity arcing between her fingers smiles. "Need a pick-me-up, traveler?"',
    deals: [
      { id: 'luna-1', description: 'Restore 30 energy', cost: 80, type: 'energy_restore' },
      { id: 'luna-2', description: 'Mana crystal (full mana restore)', cost: 60, type: 'full_mana' },
      { id: 'luna-3', description: 'Lucky charm (boosted loot next 5 fights)', cost: 200, type: 'lucky_charm' },
    ],
  },
  {
    id: 'trader-bones', name: 'Old Bones the Collector',
    greeting: 'A skeletal figure in tattered robes rattles a bag of trinkets. "Trade you... something nice for something shiny..."',
    deals: [
      { id: 'bones-1', description: 'Trade 100g for a high-level item', cost: 100, type: 'high_level_item' },
      { id: 'bones-2', description: 'Double your gold (up to 200g)', cost: 0, type: 'gold_gamble' },
      { id: 'bones-3', description: 'Cursed item (powerful but risky)', cost: 75, type: 'cursed_item' },
    ],
  },
  {
    id: 'trader-flora', name: 'Flora the Egg Keeper',
    greeting: 'A woman in leaf-woven robes cradles something warm and glowing. "I\'ve been nurturing these for months... perhaps one needs a new home?"',
    deals: [
      { id: 'flora-1', description: 'Mysterious Egg (Common)', cost: 150, type: 'egg', eggId: 'common-egg' },
      { id: 'flora-2', description: 'Gleaming Egg (Uncommon) — RARE!', cost: 400, type: 'egg', eggId: 'uncommon-egg' },
      { id: 'flora-3', description: 'Full HP restoration', cost: 40, type: 'full_heal' },
    ],
  },
  {
    id: 'trader-anvil', name: 'Krag the Material Hoarder',
    greeting: 'A massive figure with arms like tree trunks drops a sack of clinking materials. "Need building supplies? I got the good stuff."',
    deals: [
      { id: 'krag-1', description: 'Bundle of Scrap Wood (x3)', cost: 30, type: 'material', materialId: 'scrap-wood', quantity: 3 },
      { id: 'krag-2', description: 'Iron Ore (x2)', cost: 60, type: 'material', materialId: 'iron-ore', quantity: 2 },
      { id: 'krag-3', description: 'Crystal Shard (x1) — RARE!', cost: 200, type: 'material', materialId: 'crystal-shard', quantity: 1 },
      { id: 'krag-4', description: 'Stone Block (x3)', cost: 40, type: 'material', materialId: 'stone-block', quantity: 3 },
    ],
  },
  {
    id: 'trader-whisper', name: 'Whisper the Void Merchant',
    greeting: 'The air shimmers and a figure steps out of nowhere. Their voice echoes strangely. "I carry things from... elsewhere."',
    deals: [
      { id: 'whsp-1', description: 'Radiant Egg (Rare) — VERY RARE!', cost: 800, type: 'egg', eggId: 'rare-egg' },
      { id: 'whsp-2', description: 'Deep Coral (x1)', cost: 150, type: 'material', materialId: 'deep-coral', quantity: 1 },
      { id: 'whsp-3', description: 'Void-touched weapon', cost: 350, type: 'legendary_item' },
    ],
  },
  {
    id: 'trader-patch', name: 'Patch the Scavenger',
    greeting: 'A scrappy kid with an oversized backpack grins up at you. "Found all this stuff! Wanna trade?"',
    deals: [
      { id: 'patch-1', description: 'Charcoal (x2)', cost: 35, type: 'material', materialId: 'charcoal', quantity: 2 },
      { id: 'patch-2', description: 'Copper Wire (x2)', cost: 50, type: 'material', materialId: 'copper-wire', quantity: 2 },
      { id: 'patch-3', description: 'Random gear piece', cost: 80, type: 'rare_item' },
      { id: 'patch-4', description: 'Restore 20 energy', cost: 50, type: 'energy_restore' },
    ],
  },
  {
    id: 'trader-ember', name: 'Ember the Fire Dancer',
    greeting: 'Flames dance around her hands as she twirls to face you. "The fire speaks to me... it says you need something."',
    deals: [
      { id: 'ember-1', description: 'Toxic Resin (x2)', cost: 80, type: 'material', materialId: 'toxic-resin', quantity: 2 },
      { id: 'ember-2', description: 'Mysterious Egg (Common)', cost: 120, type: 'egg', eggId: 'common-egg' },
      { id: 'ember-3', description: 'Blazing weapon (high level)', cost: 300, type: 'legendary_item' },
    ],
  },
  {
    id: 'trader-deep', name: 'Captain Murk the Deep Diver',
    greeting: 'A barnacle-encrusted figure emerges from the shadows, dripping wet. "From the depths I bring treasures unseen..."',
    deals: [
      { id: 'murk-1', description: 'Deep Coral (x2)', cost: 250, type: 'material', materialId: 'deep-coral', quantity: 2 },
      { id: 'murk-2', description: 'Gleaming Egg (Uncommon)', cost: 350, type: 'egg', eggId: 'uncommon-egg' },
      { id: 'murk-3', description: 'Full HP + Mana restore', cost: 100, type: 'full_heal_mana' },
    ],
  },
];
