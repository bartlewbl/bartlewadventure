// ============================================================
// TASK DEFINITIONS - Daily, Weekly, Monthly, and Story tasks.
// Each task has a unique id, display info, type, and completion criteria.
//
// Task Management API (in useGameState):
//   - Stats are tracked automatically via reducer actions
//   - Tasks auto-check completion when stats change
//   - Resettable tasks (daily/weekly/monthly) reset via RESET_TASKS action
//   - Story tasks persist forever once completed
//
// Adding new tasks:
//   1. Add the definition below with a unique id
//   2. Set the `stat` field to match a key in `state.stats`
//   3. Set `target` to the required count
//   4. Rewards are applied automatically on completion
// ============================================================

// ---- STAT KEYS ----
// These are the keys tracked in state.stats:
//   monstersKilled, bossesKilled, battlesWon, battlesLost, battlesRun,
//   damageDealt, damageTaken, goldEarned, goldSpent, itemsLooted,
//   itemsSold, potionsUsed, explorationsCompleted, regionsVisited,
//   skillsUnlocked, levelsGained, criticalHits, dodgesPerformed,
//   highestDamage, totalHealing

export const TASK_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  STORY: 'story',
  TUTORIAL: 'tutorial',
  MISSION: 'mission',
  SIDEQUEST: 'sidequest',
};

// Max active quest lines (tutorial, story missions, side quest chains)
export const MAX_ACTIVE_QUEST_LINES = 2;

// Quest line type identifiers
export const QUEST_LINE_TYPES = {
  TUTORIAL: 'tutorial',
  MISSION: 'mission',
  SIDEQUEST: 'sidequest', // side quest chains use 'side_<chainId>'
};

// ---- DAILY TASKS ----
// Reset every 24 hours. Small, achievable goals.
export const DAILY_TASKS = [
  {
    id: 'daily_kill_5',
    name: 'Pest Control',
    description: 'Defeat 5 monsters',
    stat: 'monstersKilled',
    target: 5,
    reward: { gold: 25 },
  },
  {
    id: 'daily_explore_3',
    name: 'Scout Duty',
    description: 'Complete 3 explorations',
    stat: 'explorationsCompleted',
    target: 3,
    reward: { gold: 15 },
  },
  {
    id: 'daily_deal_500',
    name: 'Heavy Hitter',
    description: 'Deal 500 total damage',
    stat: 'damageDealt',
    target: 500,
    reward: { gold: 20 },
  },
  {
    id: 'daily_earn_100g',
    name: 'Gold Rush',
    description: 'Earn 100 gold',
    stat: 'goldEarned',
    target: 100,
    reward: { gold: 30 },
  },
  {
    id: 'daily_use_potion',
    name: 'First Aid',
    description: 'Use 1 potion',
    stat: 'potionsUsed',
    target: 1,
    reward: { gold: 10 },
  },
  {
    id: 'daily_win_3',
    name: 'Winning Streak',
    description: 'Win 3 battles',
    stat: 'battlesWon',
    target: 3,
    reward: { gold: 20 },
  },
  {
    id: 'daily_loot_2',
    name: 'Scavenger',
    description: 'Loot 2 items',
    stat: 'itemsLooted',
    target: 2,
    reward: { gold: 15 },
  },
];

// Number of daily tasks to randomly select each day
export const DAILY_TASK_COUNT = 4;

// ---- WEEKLY TASKS ----
// Reset every 7 days. Medium-term goals.
export const WEEKLY_TASKS = [
  {
    id: 'weekly_kill_50',
    name: 'Monster Hunter',
    description: 'Defeat 50 monsters',
    stat: 'monstersKilled',
    target: 50,
    reward: { gold: 200 },
  },
  {
    id: 'weekly_boss_3',
    name: 'Boss Slayer',
    description: 'Defeat 3 bosses',
    stat: 'bossesKilled',
    target: 3,
    reward: { gold: 300 },
  },
  {
    id: 'weekly_deal_5000',
    name: 'Damage Dealer',
    description: 'Deal 5,000 total damage',
    stat: 'damageDealt',
    target: 5000,
    reward: { gold: 250 },
  },
  {
    id: 'weekly_earn_1000g',
    name: 'Profit Margin',
    description: 'Earn 1,000 gold',
    stat: 'goldEarned',
    target: 1000,
    reward: { gold: 350 },
  },
  {
    id: 'weekly_explore_20',
    name: 'Cartographer',
    description: 'Complete 20 explorations',
    stat: 'explorationsCompleted',
    target: 20,
    reward: { gold: 200 },
  },
  {
    id: 'weekly_sell_10',
    name: 'Merchant',
    description: 'Sell 10 items',
    stat: 'itemsSold',
    target: 10,
    reward: { gold: 150 },
  },
];

// Number of weekly tasks to randomly select each week
export const WEEKLY_TASK_COUNT = 3;

// ---- MONTHLY TASKS ----
// Reset every 30 days. Long-term challenges.
export const MONTHLY_TASKS = [
  {
    id: 'monthly_kill_300',
    name: 'Exterminator',
    description: 'Defeat 300 monsters',
    stat: 'monstersKilled',
    target: 300,
    reward: { gold: 1000 },
  },
  {
    id: 'monthly_boss_15',
    name: 'Apex Predator',
    description: 'Defeat 15 bosses',
    stat: 'bossesKilled',
    target: 15,
    reward: { gold: 1500 },
  },
  {
    id: 'monthly_deal_50000',
    name: 'Wrecking Ball',
    description: 'Deal 50,000 total damage',
    stat: 'damageDealt',
    target: 50000,
    reward: { gold: 1200 },
  },
  {
    id: 'monthly_earn_10000g',
    name: 'Tycoon',
    description: 'Earn 10,000 gold',
    stat: 'goldEarned',
    target: 10000,
    reward: { gold: 2000 },
  },
  {
    id: 'monthly_explore_100',
    name: 'World Walker',
    description: 'Complete 100 explorations',
    stat: 'explorationsCompleted',
    target: 100,
    reward: { gold: 800 },
  },
];

// Number of monthly tasks to randomly select each month
export const MONTHLY_TASK_COUNT = 3;

// ---- STORY TASKS ----
// Never reset. One-time achievements tied to progression milestones.
export const STORY_TASKS = [
  {
    id: 'story_first_kill',
    name: 'First Blood',
    description: 'Defeat your first monster',
    stat: 'monstersKilled',
    target: 1,
    reward: { gold: 10 },
  },
  {
    id: 'story_kill_10',
    name: 'Getting Started',
    description: 'Defeat 10 monsters',
    stat: 'monstersKilled',
    target: 10,
    reward: { gold: 50 },
  },
  {
    id: 'story_kill_100',
    name: 'Seasoned Fighter',
    description: 'Defeat 100 monsters',
    stat: 'monstersKilled',
    target: 100,
    reward: { gold: 200 },
  },
  {
    id: 'story_kill_500',
    name: 'Veteran Slayer',
    description: 'Defeat 500 monsters',
    stat: 'monstersKilled',
    target: 500,
    reward: { gold: 500 },
  },
  {
    id: 'story_kill_1000',
    name: 'Legend of the Streets',
    description: 'Defeat 1,000 monsters',
    stat: 'monstersKilled',
    target: 1000,
    reward: { gold: 1000 },
  },
  {
    id: 'story_first_boss',
    name: 'Boss Challenger',
    description: 'Defeat your first boss',
    stat: 'bossesKilled',
    target: 1,
    reward: { gold: 100 },
  },
  {
    id: 'story_boss_10',
    name: 'Boss Breaker',
    description: 'Defeat 10 bosses',
    stat: 'bossesKilled',
    target: 10,
    reward: { gold: 500 },
  },
  {
    id: 'story_level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    stat: 'levelsGained',
    target: 9,
    reward: { gold: 100 },
  },
  {
    id: 'story_level_25',
    name: 'Hardened Warrior',
    description: 'Reach level 25',
    stat: 'levelsGained',
    target: 24,
    reward: { gold: 300 },
  },
  {
    id: 'story_level_50',
    name: 'Master of the Grind',
    description: 'Reach level 50',
    stat: 'levelsGained',
    target: 49,
    reward: { gold: 1000 },
  },
  {
    id: 'story_earn_5000g',
    name: 'Fat Stacks',
    description: 'Earn 5,000 total gold',
    stat: 'goldEarned',
    target: 5000,
    reward: { gold: 250 },
  },
  {
    id: 'story_earn_50000g',
    name: 'Gold Baron',
    description: 'Earn 50,000 total gold',
    stat: 'goldEarned',
    target: 50000,
    reward: { gold: 2000 },
  },
  {
    id: 'story_deal_10000',
    name: 'Devastator',
    description: 'Deal 10,000 total damage',
    stat: 'damageDealt',
    target: 10000,
    reward: { gold: 200 },
  },
  {
    id: 'story_deal_100000',
    name: 'Force of Nature',
    description: 'Deal 100,000 total damage',
    stat: 'damageDealt',
    target: 100000,
    reward: { gold: 1000 },
  },
  {
    id: 'story_explore_50',
    name: 'Pathfinder',
    description: 'Complete 50 explorations',
    stat: 'explorationsCompleted',
    target: 50,
    reward: { gold: 150 },
  },
  {
    id: 'story_explore_500',
    name: 'Trailblazer',
    description: 'Complete 500 explorations',
    stat: 'explorationsCompleted',
    target: 500,
    reward: { gold: 1000 },
  },
  {
    id: 'story_skill_5',
    name: 'Apprentice',
    description: 'Unlock 5 skills',
    stat: 'skillsUnlocked',
    target: 5,
    reward: { gold: 100 },
  },
  {
    id: 'story_skill_10',
    name: 'Specialist',
    description: 'Unlock 10 skills',
    stat: 'skillsUnlocked',
    target: 10,
    reward: { gold: 300 },
  },
  {
    id: 'story_potion_20',
    name: 'Pharmacist',
    description: 'Use 20 potions',
    stat: 'potionsUsed',
    target: 20,
    reward: { gold: 100 },
  },
  {
    id: 'story_sell_50',
    name: 'Market Mogul',
    description: 'Sell 50 items',
    stat: 'itemsSold',
    target: 50,
    reward: { gold: 200 },
  },
];

// ---- TUTORIAL QUESTS ----
// Sequential guided quests for new players. Must be completed in order.
// Each tutorial unlocks the next one. They teach core game mechanics.
export const TUTORIAL_QUESTS = [
  {
    id: 'tut_first_explore',
    name: 'Into the Unknown',
    description: 'Complete your first exploration to learn how adventuring works.',
    hint: 'Go to Explore > Neon District > Neon Mile and start an expedition.',
    stat: 'explorationsCompleted',
    target: 1,
    reward: { gold: 15 },
    order: 1,
  },
  {
    id: 'tut_first_battle',
    name: 'Stand and Fight',
    description: 'Win your first battle against a monster.',
    hint: 'When you encounter a monster during exploration, choose Attack to fight!',
    stat: 'battlesWon',
    target: 1,
    reward: { gold: 20 },
    order: 2,
  },
  {
    id: 'tut_kill_3',
    name: 'Proving Ground',
    description: 'Defeat 3 monsters to prove your combat skills.',
    hint: 'Keep exploring and fighting. Each victory counts toward this quest.',
    stat: 'monstersKilled',
    target: 3,
    reward: { gold: 30 },
    order: 3,
  },
  {
    id: 'tut_loot_item',
    name: 'Spoils of War',
    description: 'Loot your first item from a defeated enemy.',
    hint: 'Monsters drop items after battle. Keep fighting to find loot!',
    stat: 'itemsLooted',
    target: 1,
    reward: { gold: 15 },
    order: 4,
  },
  {
    id: 'tut_earn_gold',
    name: 'Building a Fortune',
    description: 'Earn 50 gold from any source.',
    hint: 'Gold comes from battles, selling items, and quest rewards.',
    stat: 'goldEarned',
    target: 50,
    reward: { gold: 25 },
    order: 5,
  },
  {
    id: 'tut_use_potion',
    name: 'Heal Thyself',
    description: 'Use a potion to restore your health during battle.',
    hint: 'In battle, click the Potion button to use a health potion from your inventory.',
    stat: 'potionsUsed',
    target: 1,
    reward: { gold: 15 },
    order: 6,
  },
  {
    id: 'tut_level_up',
    name: 'Growing Stronger',
    description: 'Gain your first level up through combat experience.',
    hint: 'Keep fighting monsters to gain EXP. When your bar fills, you level up!',
    stat: 'levelsGained',
    target: 1,
    reward: { gold: 30 },
    order: 7,
  },
  {
    id: 'tut_explore_5',
    name: 'Seasoned Explorer',
    description: 'Complete 5 explorations to learn the lay of the land.',
    hint: 'Visit different locations in the Neon District and explore them.',
    stat: 'explorationsCompleted',
    target: 5,
    reward: { gold: 35 },
    order: 8,
  },
  {
    id: 'tut_deal_damage',
    name: 'Damage Output',
    description: 'Deal a total of 200 damage across all your battles.',
    hint: 'Every attack in battle contributes to your total damage dealt.',
    stat: 'damageDealt',
    target: 200,
    reward: { gold: 40 },
    order: 9,
  },
  {
    id: 'tut_sell_item',
    name: 'Supply and Demand',
    description: 'Sell an item at the shop to learn the economy.',
    hint: 'Open your Inventory, select an item, and choose Sell.',
    stat: 'itemsSold',
    target: 1,
    reward: { gold: 20 },
    order: 10,
  },
  {
    id: 'tut_kill_10',
    name: 'Monster Slayer',
    description: 'Defeat 10 monsters. You are ready for real challenges.',
    hint: 'This is the final tutorial step. After this, story missions unlock!',
    stat: 'monstersKilled',
    target: 10,
    reward: { gold: 50 },
    order: 11,
  },
];

// ---- STORY MISSIONS ----
// Narrative-driven quest chains organized by chapter. Each chapter has sequential
// missions tied to regions. Completing all missions in a chapter unlocks the next.
export const STORY_MISSIONS = [
  // Chapter 1: Neon District - The Awakening
  {
    id: 'mission_ch1_1',
    chapter: 1,
    chapterName: 'The Awakening',
    name: 'Street Rat',
    description: 'Clear out the vermin infesting Neon Mile. The locals need help.',
    stat: 'monstersKilled',
    target: 15,
    reward: { gold: 75 },
    order: 1,
    regionHint: 'Neon District',
  },
  {
    id: 'mission_ch1_2',
    chapter: 1,
    chapterName: 'The Awakening',
    name: 'Shadow Stalker',
    description: 'Something lurks in Shadow Alley. Investigate by exploring it.',
    stat: 'explorationsCompleted',
    target: 8,
    reward: { gold: 100 },
    order: 2,
    regionHint: 'Neon District',
  },
  {
    id: 'mission_ch1_3',
    chapter: 1,
    chapterName: 'The Awakening',
    name: 'Damage Report',
    description: 'Prove your combat prowess by dealing massive damage.',
    stat: 'damageDealt',
    target: 1000,
    reward: { gold: 120 },
    order: 3,
    regionHint: 'Neon District',
  },
  {
    id: 'mission_ch1_4',
    chapter: 1,
    chapterName: 'The Awakening',
    name: 'Underground Authority',
    description: 'Challenge the bosses lurking beneath the neon lights.',
    stat: 'bossesKilled',
    target: 1,
    reward: { gold: 200 },
    order: 4,
    regionHint: 'Neon District',
  },
  {
    id: 'mission_ch1_5',
    chapter: 1,
    chapterName: 'The Awakening',
    name: 'Neon Legend',
    description: 'Become the undisputed champion of the Neon District.',
    stat: 'battlesWon',
    target: 25,
    reward: { gold: 250 },
    order: 5,
    regionHint: 'Neon District',
  },

  // Chapter 2: Frozen Wastes - The Frost Expedition
  {
    id: 'mission_ch2_1',
    chapter: 2,
    chapterName: 'The Frost Expedition',
    name: 'Cold Reception',
    description: 'Brave the frozen wastes. Defeat 30 of the frost-hardened creatures.',
    stat: 'monstersKilled',
    target: 50,
    reward: { gold: 200 },
    order: 1,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_2',
    chapter: 2,
    chapterName: 'The Frost Expedition',
    name: 'Glacier Explorer',
    description: 'Map the frozen tunnels. Complete 20 explorations.',
    stat: 'explorationsCompleted',
    target: 20,
    reward: { gold: 250 },
    order: 2,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_3',
    chapter: 2,
    chapterName: 'The Frost Expedition',
    name: 'Frostbite Fighter',
    description: 'The cold makes you stronger. Deal 5,000 total damage.',
    stat: 'damageDealt',
    target: 5000,
    reward: { gold: 300 },
    order: 3,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_4',
    chapter: 2,
    chapterName: 'The Frost Expedition',
    name: 'Ice Breaker',
    description: 'Face the frozen guardians. Defeat 3 bosses.',
    stat: 'bossesKilled',
    target: 4,
    reward: { gold: 400 },
    order: 4,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_5',
    chapter: 2,
    chapterName: 'The Frost Expedition',
    name: 'Thaw the Throne',
    description: 'Conquer the Frozen Wastes by reaching level 15.',
    stat: 'levelsGained',
    target: 14,
    reward: { gold: 500 },
    order: 5,
    regionHint: 'Frozen Wastes',
  },

  // Chapter 3: Scorched Badlands - Trial by Fire
  {
    id: 'mission_ch3_1',
    chapter: 3,
    chapterName: 'Trial by Fire',
    name: 'Heat Wave',
    description: 'The desert burns all who enter. Defeat 80 monsters to adapt.',
    stat: 'monstersKilled',
    target: 100,
    reward: { gold: 400 },
    order: 1,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_2',
    chapter: 3,
    chapterName: 'Trial by Fire',
    name: 'Desert Cartographer',
    description: 'Chart the scorched terrain. Complete 40 explorations.',
    stat: 'explorationsCompleted',
    target: 40,
    reward: { gold: 450 },
    order: 2,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_3',
    chapter: 3,
    chapterName: 'Trial by Fire',
    name: 'Inferno Wrath',
    description: 'Channel the heat into your attacks. Deal 20,000 total damage.',
    stat: 'damageDealt',
    target: 20000,
    reward: { gold: 500 },
    order: 3,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_4',
    chapter: 3,
    chapterName: 'Trial by Fire',
    name: 'Volcanic Vanquisher',
    description: 'Defeat the fire lords. Slay 8 bosses total.',
    stat: 'bossesKilled',
    target: 8,
    reward: { gold: 600 },
    order: 4,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_5',
    chapter: 3,
    chapterName: 'Trial by Fire',
    name: 'Forged in Flame',
    description: 'Emerge from the badlands as a hardened warrior. Reach level 25.',
    stat: 'levelsGained',
    target: 24,
    reward: { gold: 750 },
    order: 5,
    regionHint: 'Scorched Badlands',
  },

  // Chapter 4: Toxic Marshlands - The Corruption
  {
    id: 'mission_ch4_1',
    chapter: 4,
    chapterName: 'The Corruption',
    name: 'Swamp Things',
    description: 'The marsh teems with corrupted life. Defeat 150 monsters.',
    stat: 'monstersKilled',
    target: 200,
    reward: { gold: 600 },
    order: 1,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_2',
    chapter: 4,
    chapterName: 'The Corruption',
    name: 'Toxic Traversal',
    description: 'Navigate the poisonous bogs. Complete 60 explorations.',
    stat: 'explorationsCompleted',
    target: 60,
    reward: { gold: 650 },
    order: 2,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_3',
    chapter: 4,
    chapterName: 'The Corruption',
    name: 'Purification Strike',
    description: 'Cleanse the corruption with overwhelming force. Deal 50,000 damage.',
    stat: 'damageDealt',
    target: 50000,
    reward: { gold: 750 },
    order: 3,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_4',
    chapter: 4,
    chapterName: 'The Corruption',
    name: 'Corruption\'s End',
    description: 'Destroy the source of the marsh\'s corruption. Defeat 12 bosses.',
    stat: 'bossesKilled',
    target: 12,
    reward: { gold: 900 },
    order: 4,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_5',
    chapter: 4,
    chapterName: 'The Corruption',
    name: 'Marsh Sovereign',
    description: 'Only the strongest survive the marshes. Reach level 35.',
    stat: 'levelsGained',
    target: 34,
    reward: { gold: 1000 },
    order: 5,
    regionHint: 'Toxic Marshlands',
  },

  // Chapter 5: Abyssal Depths - Into the Abyss
  {
    id: 'mission_ch5_1',
    chapter: 5,
    chapterName: 'Into the Abyss',
    name: 'Depth Crawler',
    description: 'Descend into the darkness. Defeat 300 monsters.',
    stat: 'monstersKilled',
    target: 350,
    reward: { gold: 900 },
    order: 1,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_2',
    chapter: 5,
    chapterName: 'Into the Abyss',
    name: 'Abyss Walker',
    description: 'Chart the uncharted depths. Complete 100 explorations.',
    stat: 'explorationsCompleted',
    target: 100,
    reward: { gold: 1000 },
    order: 2,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_3',
    chapter: 5,
    chapterName: 'Into the Abyss',
    name: 'Abyssal Fury',
    description: 'Unleash devastating power. Deal 100,000 total damage.',
    stat: 'damageDealt',
    target: 100000,
    reward: { gold: 1200 },
    order: 3,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_4',
    chapter: 5,
    chapterName: 'Into the Abyss',
    name: 'Deep Sea Slayer',
    description: 'No creature of the abyss can stand before you. Defeat 20 bosses.',
    stat: 'bossesKilled',
    target: 20,
    reward: { gold: 1500 },
    order: 4,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_5',
    chapter: 5,
    chapterName: 'Into the Abyss',
    name: 'Abyssal Conqueror',
    description: 'Master the depths and emerge reborn. Reach level 45.',
    stat: 'levelsGained',
    target: 44,
    reward: { gold: 2000 },
    order: 5,
    regionHint: 'Abyssal Depths',
  },

  // Chapter 6: Celestial Highlands - Ascension
  {
    id: 'mission_ch6_1',
    chapter: 6,
    chapterName: 'Ascension',
    name: 'Sky Raider',
    description: 'Storm the celestial realm. Defeat 500 monsters.',
    stat: 'monstersKilled',
    target: 500,
    reward: { gold: 1500 },
    order: 1,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_2',
    chapter: 6,
    chapterName: 'Ascension',
    name: 'Heaven\'s Cartographer',
    description: 'Map the floating islands. Complete 150 explorations.',
    stat: 'explorationsCompleted',
    target: 150,
    reward: { gold: 1600 },
    order: 2,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_3',
    chapter: 6,
    chapterName: 'Ascension',
    name: 'Divine Wrath',
    description: 'Strike with the force of thunder. Deal 250,000 total damage.',
    stat: 'damageDealt',
    target: 250000,
    reward: { gold: 2000 },
    order: 3,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_4',
    chapter: 6,
    chapterName: 'Ascension',
    name: 'God Slayer',
    description: 'Topple the celestial guardians. Defeat 30 bosses.',
    stat: 'bossesKilled',
    target: 30,
    reward: { gold: 2500 },
    order: 4,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_5',
    chapter: 6,
    chapterName: 'Ascension',
    name: 'Ascended',
    description: 'Transcend mortal limits. Reach level 55.',
    stat: 'levelsGained',
    target: 54,
    reward: { gold: 3000 },
    order: 5,
    regionHint: 'Celestial Highlands',
  },

  // Chapter 7: Void Nexus - The Final Stand
  {
    id: 'mission_ch7_1',
    chapter: 7,
    chapterName: 'The Final Stand',
    name: 'Void Touched',
    description: 'Enter the Void Nexus and face the ultimate darkness. Defeat 750 monsters.',
    stat: 'monstersKilled',
    target: 750,
    reward: { gold: 2500 },
    order: 1,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_2',
    chapter: 7,
    chapterName: 'The Final Stand',
    name: 'Reality Mapper',
    description: 'Chart the tears in reality. Complete 250 explorations.',
    stat: 'explorationsCompleted',
    target: 250,
    reward: { gold: 3000 },
    order: 2,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_3',
    chapter: 7,
    chapterName: 'The Final Stand',
    name: 'Oblivion\'s Edge',
    description: 'Wield power that tears the void itself. Deal 500,000 total damage.',
    stat: 'damageDealt',
    target: 500000,
    reward: { gold: 3500 },
    order: 3,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_4',
    chapter: 7,
    chapterName: 'The Final Stand',
    name: 'Void Breaker',
    description: 'Shatter every boss the void can conjure. Defeat 50 bosses.',
    stat: 'bossesKilled',
    target: 50,
    reward: { gold: 4000 },
    order: 4,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_5',
    chapter: 7,
    chapterName: 'The Final Stand',
    name: 'Pixel Legend',
    description: 'Complete your destiny. Reach level 65 and become a true legend.',
    stat: 'levelsGained',
    target: 64,
    reward: { gold: 5000 },
    order: 5,
    regionHint: 'Void Nexus',
  },
];

// ---- SIDE QUEST CHAINS ----
// Optional quest chains that provide variety and extra rewards.
// Each chain has a unique chainId. Quests within a chain are sequential.
// Players must activate a chain to work on it (uses a quest line slot).
export const SIDE_QUEST_CHAINS = [
  // Chain: Bounty Hunter - kill-focused challenges
  {
    chainId: 'bounty_hunter',
    chainName: 'Bounty Hunter',
    chainDescription: 'Take on increasingly dangerous bounties for the Hunter\'s Guild.',
    chainIcon: 'skull',
    quests: [
      { id: 'side_bh_1', name: 'Rat Catcher', description: 'The guild needs someone to handle the vermin problem. Kill 20 monsters.', stat: 'monstersKilled', target: 20, reward: { gold: 60 }, order: 1 },
      { id: 'side_bh_2', name: 'Pest Exterminator', description: 'Bigger pests have emerged. Eliminate 50 monsters.', stat: 'monstersKilled', target: 50, reward: { gold: 150 }, order: 2 },
      { id: 'side_bh_3', name: 'Hunter\'s Mark', description: 'Target high-value prey. Deal 3,000 total damage.', stat: 'damageDealt', target: 3000, reward: { gold: 200 }, order: 3 },
      { id: 'side_bh_4', name: 'Big Game', description: 'The guild has a special contract. Defeat 2 bosses.', stat: 'bossesKilled', target: 2, reward: { gold: 350 }, order: 4 },
      { id: 'side_bh_5', name: 'Legendary Bounty', description: 'Only the finest bounty hunters reach this rank. Kill 150 monsters.', stat: 'monstersKilled', target: 150, reward: { gold: 500 }, order: 5 },
      { id: 'side_bh_6', name: 'Death Dealer', description: 'Your reputation precedes you. Deal 15,000 total damage.', stat: 'damageDealt', target: 15000, reward: { gold: 600 }, order: 6 },
      { id: 'side_bh_7', name: 'Apex Hunter', description: 'Become the ultimate predator. Defeat 10 bosses.', stat: 'bossesKilled', target: 10, reward: { gold: 1000 }, order: 7 },
    ],
  },

  // Chain: Treasure Seeker - exploration and loot focused
  {
    chainId: 'treasure_seeker',
    chainName: 'Treasure Seeker',
    chainDescription: 'Search every corner of the world for hidden riches.',
    chainIcon: 'chest',
    quests: [
      { id: 'side_ts_1', name: 'Curious Wanderer', description: 'Start your treasure-hunting career. Complete 5 explorations.', stat: 'explorationsCompleted', target: 5, reward: { gold: 40 }, order: 1 },
      { id: 'side_ts_2', name: 'Lucky Find', description: 'Fortune favors the bold. Loot 5 items.', stat: 'itemsLooted', target: 5, reward: { gold: 80 }, order: 2 },
      { id: 'side_ts_3', name: 'Dungeon Diver', description: 'Go deeper into the unknown. Complete 15 explorations.', stat: 'explorationsCompleted', target: 15, reward: { gold: 120 }, order: 3 },
      { id: 'side_ts_4', name: 'Hoarder\'s Delight', description: 'Collect everything you can find. Loot 15 items.', stat: 'itemsLooted', target: 15, reward: { gold: 200 }, order: 4 },
      { id: 'side_ts_5', name: 'Cartographer\'s Dream', description: 'Leave no stone unturned. Complete 40 explorations.', stat: 'explorationsCompleted', target: 40, reward: { gold: 350 }, order: 5 },
      { id: 'side_ts_6', name: 'Treasure Vault', description: 'Your collection grows legendary. Loot 40 items.', stat: 'itemsLooted', target: 40, reward: { gold: 500 }, order: 6 },
      { id: 'side_ts_7', name: 'World Explorer', description: 'You have seen it all. Complete 100 explorations.', stat: 'explorationsCompleted', target: 100, reward: { gold: 800 }, order: 7 },
    ],
  },

  // Chain: Merchant Prince - economy focused
  {
    chainId: 'merchant_prince',
    chainName: 'Merchant Prince',
    chainDescription: 'Build a trading empire from nothing.',
    chainIcon: 'coin',
    quests: [
      { id: 'side_mp_1', name: 'First Sale', description: 'Every empire starts with a single sale. Sell 2 items.', stat: 'itemsSold', target: 2, reward: { gold: 30 }, order: 1 },
      { id: 'side_mp_2', name: 'Pocket Change', description: 'Start building your wealth. Earn 200 gold.', stat: 'goldEarned', target: 200, reward: { gold: 60 }, order: 2 },
      { id: 'side_mp_3', name: 'Shopkeeper', description: 'Move more inventory through your stall. Sell 10 items.', stat: 'itemsSold', target: 10, reward: { gold: 120 }, order: 3 },
      { id: 'side_mp_4', name: 'Trade Baron', description: 'Your wealth grows. Earn 1,000 gold total.', stat: 'goldEarned', target: 1000, reward: { gold: 250 }, order: 4 },
      { id: 'side_mp_5', name: 'Market Dominator', description: 'Corner the market. Sell 30 items.', stat: 'itemsSold', target: 30, reward: { gold: 400 }, order: 5 },
      { id: 'side_mp_6', name: 'Gold Magnate', description: 'Your fortune is the talk of the town. Earn 5,000 gold.', stat: 'goldEarned', target: 5000, reward: { gold: 700 }, order: 6 },
      { id: 'side_mp_7', name: 'Merchant Prince', description: 'You rule the markets. Sell 75 items.', stat: 'itemsSold', target: 75, reward: { gold: 1200 }, order: 7 },
    ],
  },

  // Chain: Iron Will - survival/defense focused
  {
    chainId: 'iron_will',
    chainName: 'Iron Will',
    chainDescription: 'Endure the worst the world throws at you and come back stronger.',
    chainIcon: 'shield',
    quests: [
      { id: 'side_iw_1', name: 'Tough Skin', description: 'Take hits and keep going. Absorb 500 total damage.', stat: 'damageTaken', target: 500, reward: { gold: 50 }, order: 1 },
      { id: 'side_iw_2', name: 'Battle Scarred', description: 'Win 10 battles through sheer determination.', stat: 'battlesWon', target: 10, reward: { gold: 100 }, order: 2 },
      { id: 'side_iw_3', name: 'Potion Master', description: 'Learn the value of preparation. Use 5 potions.', stat: 'potionsUsed', target: 5, reward: { gold: 80 }, order: 3 },
      { id: 'side_iw_4', name: 'Unbreakable', description: 'Endure 2,000 total damage taken.', stat: 'damageTaken', target: 2000, reward: { gold: 200 }, order: 4 },
      { id: 'side_iw_5', name: 'War Machine', description: 'Win 40 battles to prove your resilience.', stat: 'battlesWon', target: 40, reward: { gold: 350 }, order: 5 },
      { id: 'side_iw_6', name: 'Alchemist\'s Best Friend', description: 'Use 20 potions to sustain your fight.', stat: 'potionsUsed', target: 20, reward: { gold: 300 }, order: 6 },
      { id: 'side_iw_7', name: 'Immortal', description: 'Absorb 10,000 damage. Nothing can stop you.', stat: 'damageTaken', target: 10000, reward: { gold: 900 }, order: 7 },
    ],
  },

  // Chain: Skill Master - progression and skill focused
  {
    chainId: 'skill_master',
    chainName: 'Skill Master',
    chainDescription: 'Seek mastery over every technique and ability.',
    chainIcon: 'star',
    quests: [
      { id: 'side_sm_1', name: 'Quick Study', description: 'Level up twice to start your journey of mastery.', stat: 'levelsGained', target: 2, reward: { gold: 50 }, order: 1 },
      { id: 'side_sm_2', name: 'Talent Scout', description: 'Unlock 2 skills from your skill tree.', stat: 'skillsUnlocked', target: 2, reward: { gold: 100 }, order: 2 },
      { id: 'side_sm_3', name: 'Rising Power', description: 'Reach level 8 to access new abilities.', stat: 'levelsGained', target: 7, reward: { gold: 150 }, order: 3 },
      { id: 'side_sm_4', name: 'Technique Collector', description: 'Unlock 5 skills to broaden your arsenal.', stat: 'skillsUnlocked', target: 5, reward: { gold: 250 }, order: 4 },
      { id: 'side_sm_5', name: 'Power Spike', description: 'Reach level 20 for true power.', stat: 'levelsGained', target: 19, reward: { gold: 400 }, order: 5 },
      { id: 'side_sm_6', name: 'Grand Master', description: 'Master 8 skills to become a legend.', stat: 'skillsUnlocked', target: 8, reward: { gold: 600 }, order: 6 },
      { id: 'side_sm_7', name: 'Transcendent', description: 'Reach level 40 and unlock your true potential.', stat: 'levelsGained', target: 39, reward: { gold: 1000 }, order: 7 },
    ],
  },

  // Chain: Arena Champion - pure combat wins
  {
    chainId: 'arena_champion',
    chainName: 'Arena Champion',
    chainDescription: 'Fight your way to the top of the arena rankings.',
    chainIcon: 'sword',
    quests: [
      { id: 'side_ac_1', name: 'Arena Debut', description: 'Win your first 5 battles in the arena.', stat: 'battlesWon', target: 5, reward: { gold: 40 }, order: 1 },
      { id: 'side_ac_2', name: 'Crowd Pleaser', description: 'Deal 1,500 damage to excite the crowd.', stat: 'damageDealt', target: 1500, reward: { gold: 80 }, order: 2 },
      { id: 'side_ac_3', name: 'Win Streak', description: 'Rack up 15 total victories.', stat: 'battlesWon', target: 15, reward: { gold: 150 }, order: 3 },
      { id: 'side_ac_4', name: 'Devastating Blow', description: 'Land a hit of at least 50 damage in a single strike.', stat: 'highestDamage', target: 50, reward: { gold: 200 }, order: 4 },
      { id: 'side_ac_5', name: 'Arena Veteran', description: 'Win 50 battles to earn veteran status.', stat: 'battlesWon', target: 50, reward: { gold: 400 }, order: 5 },
      { id: 'side_ac_6', name: 'One-Hit Wonder', description: 'Land a devastating 150+ damage single hit.', stat: 'highestDamage', target: 150, reward: { gold: 600 }, order: 6 },
      { id: 'side_ac_7', name: 'Arena Legend', description: 'Win 100 battles. You are the undisputed champion.', stat: 'battlesWon', target: 100, reward: { gold: 1500 }, order: 7 },
    ],
  },

  // Chain: Healer's Path - healing focused
  {
    chainId: 'healers_path',
    chainName: 'Healer\'s Path',
    chainDescription: 'Master the art of staying alive through restoration.',
    chainIcon: 'heart',
    quests: [
      { id: 'side_hp_1', name: 'First Aid Kit', description: 'Use 3 potions to patch yourself up.', stat: 'potionsUsed', target: 3, reward: { gold: 35 }, order: 1 },
      { id: 'side_hp_2', name: 'Restoration', description: 'Heal 200 total HP through any means.', stat: 'totalHealing', target: 200, reward: { gold: 70 }, order: 2 },
      { id: 'side_hp_3', name: 'Field Medic', description: 'Use 10 potions during your adventures.', stat: 'potionsUsed', target: 10, reward: { gold: 120 }, order: 3 },
      { id: 'side_hp_4', name: 'Rejuvenation', description: 'Heal 1,000 total HP. You know how to survive.', stat: 'totalHealing', target: 1000, reward: { gold: 250 }, order: 4 },
      { id: 'side_hp_5', name: 'Potion Addict', description: 'Use 30 potions. You always come prepared.', stat: 'potionsUsed', target: 30, reward: { gold: 400 }, order: 5 },
      { id: 'side_hp_6', name: 'Miracle Worker', description: 'Heal 5,000 total HP across all your adventures.', stat: 'totalHealing', target: 5000, reward: { gold: 700 }, order: 6 },
      { id: 'side_hp_7', name: 'Undying', description: 'Heal 15,000 total HP. Death cannot claim you.', stat: 'totalHealing', target: 15000, reward: { gold: 1200 }, order: 7 },
    ],
  },

  // Chain: Completionist - mixed objectives
  {
    chainId: 'completionist',
    chainName: 'The Completionist',
    chainDescription: 'Do everything. See everything. Collect everything.',
    chainIcon: 'trophy',
    quests: [
      { id: 'side_co_1', name: 'Jack of All Trades', description: 'Win 5 battles and complete 5 explorations.', stat: 'battlesWon', target: 5, reward: { gold: 50 }, order: 1 },
      { id: 'side_co_2', name: 'Collector', description: 'Loot 10 items from your adventures.', stat: 'itemsLooted', target: 10, reward: { gold: 100 }, order: 2 },
      { id: 'side_co_3', name: 'Well Rounded', description: 'Reach level 12 to prove your versatility.', stat: 'levelsGained', target: 11, reward: { gold: 180 }, order: 3 },
      { id: 'side_co_4', name: 'Conqueror', description: 'Defeat 5 bosses across all regions.', stat: 'bossesKilled', target: 5, reward: { gold: 300 }, order: 4 },
      { id: 'side_co_5', name: 'Wealthy Adventurer', description: 'Earn 3,000 gold through any means.', stat: 'goldEarned', target: 3000, reward: { gold: 500 }, order: 5 },
      { id: 'side_co_6', name: 'Globetrotter', description: 'Complete 75 explorations across all regions.', stat: 'explorationsCompleted', target: 75, reward: { gold: 800 }, order: 6 },
      { id: 'side_co_7', name: 'True Completionist', description: 'Deal 75,000 total damage. You have done it all.', stat: 'damageDealt', target: 75000, reward: { gold: 1500 }, order: 7 },
    ],
  },
];

// Get the total number of chapters
export const MISSION_CHAPTER_COUNT = 7;

// Get missions for a specific chapter
export function getMissionsForChapter(chapter) {
  return STORY_MISSIONS.filter(m => m.chapter === chapter).sort((a, b) => a.order - b.order);
}

// Get the current tutorial quest (first unclaimed one)
export function getCurrentTutorial(tutorialClaimed) {
  const claimed = tutorialClaimed || [];
  return TUTORIAL_QUESTS.find(q => !claimed.includes(q.id)) || null;
}

// Check if all tutorials are completed
export function isTutorialComplete(tutorialClaimed) {
  const claimed = tutorialClaimed || [];
  return TUTORIAL_QUESTS.every(q => claimed.includes(q.id));
}

// Get the current unlocked chapter based on mission progress
export function getUnlockedChapter(missionClaimed) {
  const claimed = missionClaimed || [];
  for (let ch = 1; ch <= MISSION_CHAPTER_COUNT; ch++) {
    const chapterMissions = getMissionsForChapter(ch);
    const allDone = chapterMissions.every(m => claimed.includes(m.id));
    if (!allDone) return ch;
  }
  return MISSION_CHAPTER_COUNT;
}

// Get a side quest chain by ID
export function getSideQuestChain(chainId) {
  return SIDE_QUEST_CHAINS.find(c => c.chainId === chainId) || null;
}

// Get the current quest in a side quest chain (first unclaimed)
export function getCurrentSideQuest(chainId, sideQuestClaimed) {
  const chain = getSideQuestChain(chainId);
  if (!chain) return null;
  const claimed = sideQuestClaimed || [];
  return chain.quests.find(q => !claimed.includes(q.id)) || null;
}

// Check if a side quest chain is fully completed
export function isSideChainComplete(chainId, sideQuestClaimed) {
  const chain = getSideQuestChain(chainId);
  if (!chain) return false;
  const claimed = sideQuestClaimed || [];
  return chain.quests.every(q => claimed.includes(q.id));
}

// Get quest line key for a given type
export function getQuestLineKey(type, chainId) {
  if (type === 'tutorial') return 'tutorial';
  if (type === 'mission') return 'mission';
  if (type === 'sidequest') return `side_${chainId}`;
  return null;
}

// Count active quest lines
export function countActiveQuestLines(activeQuestLines) {
  return (activeQuestLines || []).length;
}

// Check if a quest line is active
export function isQuestLineActive(activeQuestLines, lineKey) {
  return (activeQuestLines || []).includes(lineKey);
}

// Check if we can activate another quest line
export function canActivateQuestLine(activeQuestLines) {
  return countActiveQuestLines(activeQuestLines) < MAX_ACTIVE_QUEST_LINES;
}

// ---- TASK HELPERS ----

// Select N random tasks from a pool using a seed for deterministic selection
export function selectTasks(pool, count, seed) {
  // Simple seeded shuffle
  const shuffled = [...pool];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// Get the seed for daily/weekly/monthly reset cycles
export function getDailySeed(now = Date.now()) {
  return Math.floor(now / (24 * 60 * 60 * 1000));
}

export function getWeeklySeed(now = Date.now()) {
  return Math.floor(now / (7 * 24 * 60 * 60 * 1000));
}

export function getMonthlySeed(now = Date.now()) {
  const d = new Date(now);
  return d.getFullYear() * 100 + d.getMonth();
}

// Get the active tasks for the current cycle
export function getActiveDailyTasks(now = Date.now()) {
  return selectTasks(DAILY_TASKS, DAILY_TASK_COUNT, getDailySeed(now));
}

export function getActiveWeeklyTasks(now = Date.now()) {
  return selectTasks(WEEKLY_TASKS, WEEKLY_TASK_COUNT, getWeeklySeed(now));
}

export function getActiveMonthlyTasks(now = Date.now()) {
  return selectTasks(MONTHLY_TASKS, MONTHLY_TASK_COUNT, getMonthlySeed(now));
}

// Check if a task's cycle has expired (needs reset)
export function isDailyExpired(lastDailySeed, now = Date.now()) {
  return getDailySeed(now) !== lastDailySeed;
}

export function isWeeklyExpired(lastWeeklySeed, now = Date.now()) {
  return getWeeklySeed(now) !== lastWeeklySeed;
}

export function isMonthlyExpired(lastMonthlySeed, now = Date.now()) {
  return getMonthlySeed(now) !== lastMonthlySeed;
}

// Create initial task progress object
export function createInitialTaskProgress() {
  return {
    // Tracks progress for resettable tasks: { [taskId]: currentCount }
    dailyProgress: {},
    weeklyProgress: {},
    monthlyProgress: {},
    // Set of completed task IDs (for claimed rewards)
    dailyClaimed: [],
    weeklyClaimed: [],
    monthlyClaimed: [],
    storyClaimed: [],
    tutorialClaimed: [],
    missionClaimed: [],
    sideQuestClaimed: [],
    // Active quest line keys (max 2): 'tutorial', 'mission', 'side_<chainId>'
    activeQuestLines: [],
    // Pinned quest IDs shown on location screen (max 3)
    pinnedQuests: [],
    // Seeds for cycle tracking
    lastDailySeed: getDailySeed(),
    lastWeeklySeed: getWeeklySeed(),
    lastMonthlySeed: getMonthlySeed(),
  };
}

// Create initial stats object
export function createInitialStats() {
  return {
    monstersKilled: 0,
    bossesKilled: 0,
    battlesWon: 0,
    battlesLost: 0,
    battlesRun: 0,
    damageDealt: 0,
    damageTaken: 0,
    goldEarned: 0,
    goldSpent: 0,
    itemsLooted: 0,
    itemsSold: 0,
    potionsUsed: 0,
    explorationsCompleted: 0,
    skillsUnlocked: 0,
    levelsGained: 0,
    highestDamage: 0,
    totalHealing: 0,
  };
}
