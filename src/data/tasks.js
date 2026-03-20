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
    reward: { gold: 200, chestId: 'shadow-lockbox' },
  },
  {
    id: 'weekly_boss_3',
    name: 'Boss Slayer',
    description: 'Defeat 3 bosses',
    stat: 'bossesKilled',
    target: 3,
    reward: { gold: 300, chestId: 'mercenary-bounty' },
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
    reward: { gold: 350, chestId: 'street-crate' },
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
    reward: { gold: 1000, chestId: 'skyline-strongbox' },
  },
  {
    id: 'monthly_boss_15',
    name: 'Apex Predator',
    description: 'Defeat 15 bosses',
    stat: 'bossesKilled',
    target: 15,
    reward: { gold: 1500, chestId: 'neon-treasure' },
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
    reward: { gold: 2000, chestId: 'ironworks-coffer' },
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
    reward: { gold: 200, chestId: 'metro-vault' },
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
    reward: { gold: 1000, chestId: 'void-reliquary' },
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
    reward: { gold: 500, chestId: 'skyline-strongbox' },
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
    reward: { gold: 1000, chestId: 'legendary-ark' },
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
    reward: { gold: 2000, chestId: 'neon-treasure' },
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
    reward: { gold: 1000, chestId: 'void-reliquary' },
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
    description: 'Clear out the Gutter Rats infesting Neon Mile. The locals need help.',
    stat: 'killed_rat',
    target: 10,
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
    description: 'Brave the frozen wastes. Hunt down 15 Frost Wolves prowling the outpost.',
    stat: 'killed_frost-wolf',
    target: 15,
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
    description: 'The desert burns all who enter. Slay 20 Lava Slimes oozing from the vents.',
    stat: 'killed_lava-slime',
    target: 20,
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
    description: 'The marsh teems with corrupted life. Destroy 25 Fungal Zombies shambling through the hollow.',
    stat: 'killed_fungal-zombie',
    target: 25,
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
    description: 'Descend into the darkness. Eliminate 30 Kraken Spawn lurking in the deep.',
    stat: 'killed_kraken-spawn',
    target: 30,
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
    description: 'Storm the celestial realm. Vanquish 35 Celestial Knights guarding the highlands.',
    stat: 'killed_celestial-knight',
    target: 35,
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
    description: 'Enter the Void Nexus and face the ultimate darkness. Destroy 40 Oblivion Knights.',
    stat: 'killed_oblivion-knight',
    target: 40,
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
  // Chain: Bounty Hunter - kill-focused challenges (Lv 1)
  {
    chainId: 'bounty_hunter',
    chainName: 'Bounty Hunter',
    chainDescription: 'Take on increasingly dangerous bounties for the Hunter\'s Guild.',
    chainIcon: 'skull',
    levelReq: 1,
    quests: [
      { id: 'side_bh_1', name: 'Rat Catcher', description: 'The guild needs someone to handle the vermin problem. Kill 10 Gutter Rats.', stat: 'killed_rat', target: 10, reward: { gold: 60 }, order: 1 },
      { id: 'side_bh_2', name: 'Pest Exterminator', description: 'Bigger pests have emerged. Eliminate 8 Toxic Slimes.', stat: 'killed_toxic-slime', target: 8, reward: { gold: 150 }, order: 2 },
      { id: 'side_bh_3', name: 'Hunter\'s Mark', description: 'Target high-value prey. Deal 3,000 total damage.', stat: 'damageDealt', target: 3000, reward: { gold: 200 }, order: 3 },
      { id: 'side_bh_4', name: 'Big Game', description: 'The guild has a special contract. Defeat 2 bosses.', stat: 'bossesKilled', target: 2, reward: { gold: 350 }, order: 4 },
      { id: 'side_bh_5', name: 'Legendary Bounty', description: 'Only the finest bounty hunters reach this rank. Kill 20 Shadow Dragons.', stat: 'killed_shadow-dragon', target: 20, reward: { gold: 500 }, order: 5 },
      { id: 'side_bh_6', name: 'Death Dealer', description: 'Your reputation precedes you. Deal 15,000 total damage.', stat: 'damageDealt', target: 15000, reward: { gold: 600 }, order: 6 },
      { id: 'side_bh_7', name: 'Apex Hunter', description: 'Become the ultimate predator. Defeat 10 bosses.', stat: 'bossesKilled', target: 10, reward: { gold: 1000 }, order: 7 },
    ],
  },

  // Chain: Treasure Seeker - exploration and loot focused (Lv 1)
  {
    chainId: 'treasure_seeker',
    chainName: 'Treasure Seeker',
    chainDescription: 'Search every corner of the world for hidden riches.',
    chainIcon: 'chest',
    levelReq: 1,
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

  // Chain: Merchant Prince - economy focused (Lv 3)
  {
    chainId: 'merchant_prince',
    chainName: 'Merchant Prince',
    chainDescription: 'Build a trading empire from nothing.',
    chainIcon: 'coin',
    levelReq: 3,
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

  // Chain: Iron Will - survival/defense focused (Lv 5)
  {
    chainId: 'iron_will',
    chainName: 'Iron Will',
    chainDescription: 'Endure the worst the world throws at you and come back stronger.',
    chainIcon: 'shield',
    levelReq: 5,
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

  // Chain: Skill Master - progression and skill focused (Lv 5)
  {
    chainId: 'skill_master',
    chainName: 'Skill Master',
    chainDescription: 'Seek mastery over every technique and ability.',
    chainIcon: 'star',
    levelReq: 5,
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

  // Chain: Arena Champion - pure combat wins (Lv 8)
  {
    chainId: 'arena_champion',
    chainName: 'Arena Champion',
    chainDescription: 'Fight your way to the top of the arena rankings.',
    chainIcon: 'sword',
    levelReq: 8,
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

  // Chain: Healer's Path - healing focused (Lv 8)
  {
    chainId: 'healers_path',
    chainName: 'Healer\'s Path',
    chainDescription: 'Master the art of staying alive through restoration.',
    chainIcon: 'heart',
    levelReq: 8,
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

  // Chain: Completionist - mixed objectives (Lv 10)
  {
    chainId: 'completionist',
    chainName: 'The Completionist',
    chainDescription: 'Do everything. See everything. Collect everything.',
    chainIcon: 'trophy',
    levelReq: 10,
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

  // Chain: Frost Warden - unlocks at Lv 12 (Frozen Wastes tier)
  {
    chainId: 'frost_warden',
    chainName: 'Frost Warden',
    chainDescription: 'Prove yourself against the bitter cold and its frozen inhabitants.',
    chainIcon: 'snowflake',
    levelReq: 12,
    quests: [
      { id: 'side_fw_1', name: 'Cold Blooded', description: 'The frost tests all newcomers. Defeat 15 Ice Crawlers.', stat: 'killed_ice-crawler', target: 15, reward: { gold: 150 }, order: 1 },
      { id: 'side_fw_2', name: 'Frozen Fortitude', description: 'Endure the chill. Take 1,500 total damage and survive.', stat: 'damageTaken', target: 1500, reward: { gold: 200 }, order: 2 },
      { id: 'side_fw_3', name: 'Blizzard Runner', description: 'Navigate the storms. Complete 25 explorations.', stat: 'explorationsCompleted', target: 25, reward: { gold: 250 }, order: 3 },
      { id: 'side_fw_4', name: 'Ice Shard Collector', description: 'Scavenge the frozen ruins. Loot 20 items.', stat: 'itemsLooted', target: 20, reward: { gold: 300 }, order: 4 },
      { id: 'side_fw_5', name: 'Permafrost Punisher', description: 'Crush the frozen elite. Deal 10,000 total damage.', stat: 'damageDealt', target: 10000, reward: { gold: 450 }, order: 5 },
      { id: 'side_fw_6', name: 'Glacial Guardian', description: 'Challenge the frozen lords. Defeat 6 bosses.', stat: 'bossesKilled', target: 6, reward: { gold: 600 }, order: 6 },
      { id: 'side_fw_7', name: 'Frost Warden', description: 'Master the frozen wastes. Win 60 battles.', stat: 'battlesWon', target: 60, reward: { gold: 900 }, order: 7 },
    ],
  },

  // Chain: Flame Dancer - unlocks at Lv 18 (Scorched Badlands tier)
  {
    chainId: 'flame_dancer',
    chainName: 'Flame Dancer',
    chainDescription: 'Dance with fire and bend the scorching heat to your will.',
    chainIcon: 'flame',
    levelReq: 18,
    quests: [
      { id: 'side_fd_1', name: 'Ember Walker', description: 'Walk through the flames. Complete 35 explorations.', stat: 'explorationsCompleted', target: 35, reward: { gold: 250 }, order: 1 },
      { id: 'side_fd_2', name: 'Burn Notice', description: 'Set the desert ablaze. Deal 12,000 total damage.', stat: 'damageDealt', target: 12000, reward: { gold: 350 }, order: 2 },
      { id: 'side_fd_3', name: 'Scorched Earth', description: 'Leave nothing standing. Slay 20 Magma Serpents.', stat: 'killed_magma-serpent', target: 20, reward: { gold: 400 }, order: 3 },
      { id: 'side_fd_4', name: 'Ashen Trader', description: 'Profit from the wastelands. Sell 20 items.', stat: 'itemsSold', target: 20, reward: { gold: 350 }, order: 4 },
      { id: 'side_fd_5', name: 'Inferno Survivor', description: 'Endure the heat. Take 4,000 total damage.', stat: 'damageTaken', target: 4000, reward: { gold: 500 }, order: 5 },
      { id: 'side_fd_6', name: 'Magma Lord Slayer', description: 'Topple the lords of fire. Defeat 8 bosses.', stat: 'bossesKilled', target: 8, reward: { gold: 700 }, order: 6 },
      { id: 'side_fd_7', name: 'Flame Dancer', description: 'Become one with the fire. Win 80 battles.', stat: 'battlesWon', target: 80, reward: { gold: 1100 }, order: 7 },
    ],
  },

  // Chain: Poison Brewer - unlocks at Lv 25 (Toxic Marshlands tier)
  {
    chainId: 'poison_brewer',
    chainName: 'Poison Brewer',
    chainDescription: 'Learn the secrets of the marshes and turn toxins into tools.',
    chainIcon: 'flask',
    levelReq: 25,
    quests: [
      { id: 'side_pb_1', name: 'Bog Wader', description: 'Trudge through the muck. Complete 50 explorations.', stat: 'explorationsCompleted', target: 50, reward: { gold: 400 }, order: 1 },
      { id: 'side_pb_2', name: 'Antidote Expert', description: 'Build up resistance. Use 15 potions.', stat: 'potionsUsed', target: 15, reward: { gold: 350 }, order: 2 },
      { id: 'side_pb_3', name: 'Marsh Slaughter', description: 'Purge the corrupted creatures. Destroy 25 Vine Stranglers.', stat: 'killed_vine-strangler', target: 25, reward: { gold: 550 }, order: 3 },
      { id: 'side_pb_4', name: 'Toxic Fortune', description: 'The marsh pays well for the brave. Earn 4,000 gold.', stat: 'goldEarned', target: 4000, reward: { gold: 600 }, order: 4 },
      { id: 'side_pb_5', name: 'Venomous Strike', description: 'Strike with lethal precision. Deal 35,000 total damage.', stat: 'damageDealt', target: 35000, reward: { gold: 700 }, order: 5 },
      { id: 'side_pb_6', name: 'Swamp King Slayer', description: 'Defeat the marsh overlords. Defeat 12 bosses.', stat: 'bossesKilled', target: 12, reward: { gold: 900 }, order: 6 },
      { id: 'side_pb_7', name: 'Poison Brewer', description: 'Master the toxic arts. Heal 8,000 total HP.', stat: 'totalHealing', target: 8000, reward: { gold: 1400 }, order: 7 },
    ],
  },

  // Chain: Abyssal Diver - unlocks at Lv 32 (Abyssal Depths tier)
  {
    chainId: 'abyssal_diver',
    chainName: 'Abyssal Diver',
    chainDescription: 'Plunge into the lightless depths where sanity frays.',
    chainIcon: 'anchor',
    levelReq: 32,
    quests: [
      { id: 'side_ad_1', name: 'Pressure Test', description: 'Survive the crushing depths. Take 6,000 total damage.', stat: 'damageTaken', target: 6000, reward: { gold: 500 }, order: 1 },
      { id: 'side_ad_2', name: 'Deep Sea Harvest', description: 'Scavenge the abyss. Loot 35 items.', stat: 'itemsLooted', target: 35, reward: { gold: 600 }, order: 2 },
      { id: 'side_ad_3', name: 'Leviathan Hunter', description: 'Hunt the deep ones. Slay 30 Deep Anglers.', stat: 'killed_deep-angler', target: 30, reward: { gold: 750 }, order: 3 },
      { id: 'side_ad_4', name: 'Abyssal Cartography', description: 'Map the unmappable. Complete 80 explorations.', stat: 'explorationsCompleted', target: 80, reward: { gold: 800 }, order: 4 },
      { id: 'side_ad_5', name: 'Crushing Force', description: 'Strike with the weight of the ocean. Deal 60,000 damage.', stat: 'damageDealt', target: 60000, reward: { gold: 1000 }, order: 5 },
      { id: 'side_ad_6', name: 'Kraken Killer', description: 'Slay the terrors of the deep. Defeat 18 bosses.', stat: 'bossesKilled', target: 18, reward: { gold: 1300 }, order: 6 },
      { id: 'side_ad_7', name: 'Abyssal Diver', description: 'You have conquered the void beneath the waves. Win 120 battles.', stat: 'battlesWon', target: 120, reward: { gold: 1800 }, order: 7 },
    ],
  },

  // Chain: Star Chaser - unlocks at Lv 40 (Celestial tier)
  {
    chainId: 'star_chaser',
    chainName: 'Star Chaser',
    chainDescription: 'Reach for the heavens and claim the power of the stars.',
    chainIcon: 'star',
    levelReq: 40,
    quests: [
      { id: 'side_sc_1', name: 'Sky Bound', description: 'Ascend to the heights. Complete 100 explorations.', stat: 'explorationsCompleted', target: 100, reward: { gold: 800 }, order: 1 },
      { id: 'side_sc_2', name: 'Celestial Harvest', description: 'Gather the riches of the heavens. Earn 8,000 gold.', stat: 'goldEarned', target: 8000, reward: { gold: 900 }, order: 2 },
      { id: 'side_sc_3', name: 'Angel Slayer', description: 'Not all that is celestial is good. Destroy 35 Storm Hawks.', stat: 'killed_storm-hawk', target: 35, reward: { gold: 1000 }, order: 3 },
      { id: 'side_sc_4', name: 'Star Forged', description: 'Unleash cosmic power. Deal 120,000 total damage.', stat: 'damageDealt', target: 120000, reward: { gold: 1200 }, order: 4 },
      { id: 'side_sc_5', name: 'Divine Resilience', description: 'Endure heavenly wrath. Take 12,000 total damage.', stat: 'damageTaken', target: 12000, reward: { gold: 1400 }, order: 5 },
      { id: 'side_sc_6', name: 'Constellation Breaker', description: 'Shatter the celestial order. Defeat 25 bosses.', stat: 'bossesKilled', target: 25, reward: { gold: 1800 }, order: 6 },
      { id: 'side_sc_7', name: 'Star Chaser', description: 'You have touched the stars. Sell 60 items for your celestial collection.', stat: 'itemsSold', target: 60, reward: { gold: 2500 }, order: 7 },
    ],
  },

  // Chain: Void Walker - unlocks at Lv 50 (Void Nexus tier)
  {
    chainId: 'void_walker',
    chainName: 'Void Walker',
    chainDescription: 'Step between realities and command the power of nothingness.',
    chainIcon: 'void',
    levelReq: 50,
    quests: [
      { id: 'side_vw_1', name: 'Reality Tear', description: 'Pierce through reality. Complete 150 explorations.', stat: 'explorationsCompleted', target: 150, reward: { gold: 1200 }, order: 1 },
      { id: 'side_vw_2', name: 'Void Consumption', description: 'Consume the void\'s power. Deal 200,000 total damage.', stat: 'damageDealt', target: 200000, reward: { gold: 1500 }, order: 2 },
      { id: 'side_vw_3', name: 'Null and Void', description: 'Erase all opposition. Destroy 40 Null Wraiths.', stat: 'killed_null-wraith', target: 40, reward: { gold: 1800 }, order: 3 },
      { id: 'side_vw_4', name: 'Event Horizon', description: 'Nothing escapes you. Win 150 battles.', stat: 'battlesWon', target: 150, reward: { gold: 2000 }, order: 4 },
      { id: 'side_vw_5', name: 'Entropy\'s Embrace', description: 'Let chaos flow through you. Take 20,000 total damage.', stat: 'damageTaken', target: 20000, reward: { gold: 2200 }, order: 5 },
      { id: 'side_vw_6', name: 'Reality Breaker', description: 'Shatter the foundations. Defeat 40 bosses.', stat: 'bossesKilled', target: 40, reward: { gold: 3000 }, order: 6 },
      { id: 'side_vw_7', name: 'Void Walker', description: 'You exist between worlds. Earn 25,000 total gold.', stat: 'goldEarned', target: 25000, reward: { gold: 4000 }, order: 7 },
    ],
  },

  // Chain: Eternal Grinder - unlocks at Lv 55 (endgame grind)
  {
    chainId: 'eternal_grinder',
    chainName: 'Eternal Grinder',
    chainDescription: 'The grind never ends. Push every stat to its absolute limit.',
    chainIcon: 'infinity',
    levelReq: 55,
    quests: [
      { id: 'side_eg_1', name: 'No Rest', description: 'The grind starts here. Complete 200 explorations.', stat: 'explorationsCompleted', target: 200, reward: { gold: 1500 }, order: 1 },
      { id: 'side_eg_2', name: 'Mass Extinction', description: 'Eliminate the deadliest threats. Destroy 50 Paradox Golems.', stat: 'killed_paradox-golem', target: 50, reward: { gold: 2000 }, order: 2 },
      { id: 'side_eg_3', name: 'Damage Incarnate', description: 'Become damage itself. Deal 400,000 total damage.', stat: 'damageDealt', target: 400000, reward: { gold: 2500 }, order: 3 },
      { id: 'side_eg_4', name: 'Market Emperor', description: 'Own every market in every region. Sell 100 items.', stat: 'itemsSold', target: 100, reward: { gold: 2000 }, order: 4 },
      { id: 'side_eg_5', name: 'Boss Annihilator', description: 'No boss is safe from you. Defeat 60 bosses.', stat: 'bossesKilled', target: 60, reward: { gold: 3500 }, order: 5 },
      { id: 'side_eg_6', name: 'Infinite Resilience', description: 'Absorb pain without end. Take 30,000 total damage.', stat: 'damageTaken', target: 30000, reward: { gold: 3000 }, order: 6 },
      { id: 'side_eg_7', name: 'Eternal Legend', description: 'Win 200 battles. You have transcended the grind.', stat: 'battlesWon', target: 200, reward: { gold: 5000 }, order: 7 },
    ],
  },

  // ============================================================
  // DAILY QUEST LINES - Completable in a single day of play.
  // Shorter chains (3-5 quests) with generous rewards.
  // ============================================================

  // Chain: Speed Demon - fast-paced kill rush (Lv 1)
  {
    chainId: 'speed_demon',
    chainName: 'Speed Demon',
    chainDescription: 'Blitz through enemies at breakneck speed. No time to rest.',
    chainIcon: 'lightning',
    levelReq: 1,
    quests: [
      { id: 'side_sd_1', name: 'Quick Draw', description: 'Start fast. Defeat 3 Gutter Rats.', stat: 'killed_rat', target: 3, reward: { gold: 50 }, order: 1 },
      { id: 'side_sd_2', name: 'Rampage', description: 'Keep the momentum going. Win 5 battles.', stat: 'battlesWon', target: 5, reward: { gold: 100 }, order: 2 },
      { id: 'side_sd_3', name: 'Blitz Kill', description: 'Don\'t slow down. Defeat 5 Shadow Bats.', stat: 'killed_shadow-bat', target: 5, reward: { gold: 150 }, order: 3 },
      { id: 'side_sd_4', name: 'Speed Demon', description: 'Finish the rush. Deal 800 total damage.', stat: 'damageDealt', target: 800, reward: { gold: 300 }, order: 4 },
    ],
  },

  // Chain: Gold Fever - earn gold fast (Lv 1)
  {
    chainId: 'gold_fever',
    chainName: 'Gold Fever',
    chainDescription: 'The gold rush is on. Stack as much coin as you can before sundown.',
    chainIcon: 'coin',
    levelReq: 1,
    quests: [
      { id: 'side_gf_1', name: 'Pocket Lint', description: 'Scrape together your first earnings. Earn 30 gold.', stat: 'goldEarned', target: 30, reward: { gold: 40 }, order: 1 },
      { id: 'side_gf_2', name: 'Quick Flip', description: 'Sell 2 items for a quick profit.', stat: 'itemsSold', target: 2, reward: { gold: 75 }, order: 2 },
      { id: 'side_gf_3', name: 'Cash Grab', description: 'The gold is flowing. Earn 150 gold.', stat: 'goldEarned', target: 150, reward: { gold: 150 }, order: 3 },
      { id: 'side_gf_4', name: 'Gold Fever', description: 'Sell 5 more items to cash out big.', stat: 'itemsSold', target: 5, reward: { gold: 350 }, order: 4 },
    ],
  },

  // Chain: Dungeon Sprint - explore quickly (Lv 1)
  {
    chainId: 'dungeon_sprint',
    chainName: 'Dungeon Sprint',
    chainDescription: 'Race through as many dungeons as you can in a single day.',
    chainIcon: 'compass',
    levelReq: 1,
    quests: [
      { id: 'side_ds_1', name: 'Door Kicker', description: 'Bust into your first dungeon. Complete 2 explorations.', stat: 'explorationsCompleted', target: 2, reward: { gold: 40 }, order: 1 },
      { id: 'side_ds_2', name: 'Room Clearer', description: 'Keep pushing deeper. Complete 5 explorations.', stat: 'explorationsCompleted', target: 5, reward: { gold: 80 }, order: 2 },
      { id: 'side_ds_3', name: 'Speedrunner', description: 'You can\'t stop now. Loot 4 items.', stat: 'itemsLooted', target: 4, reward: { gold: 120 }, order: 3 },
      { id: 'side_ds_4', name: 'Dungeon Sprint Champion', description: 'Finish the sprint. Complete 10 explorations.', stat: 'explorationsCompleted', target: 10, reward: { gold: 300 }, order: 4 },
    ],
  },

  // Chain: Glass Cannon - deal damage, take damage (Lv 3)
  {
    chainId: 'glass_cannon',
    chainName: 'Glass Cannon',
    chainDescription: 'Hit hard, get hit harder. Pure offense, zero defense.',
    chainIcon: 'flame',
    levelReq: 3,
    quests: [
      { id: 'side_gc_1', name: 'Reckless Strike', description: 'Swing first, ask questions never. Deal 300 damage.', stat: 'damageDealt', target: 300, reward: { gold: 60 }, order: 1 },
      { id: 'side_gc_2', name: 'Pain Trade', description: 'You give and you take. Absorb 200 damage.', stat: 'damageTaken', target: 200, reward: { gold: 80 }, order: 2 },
      { id: 'side_gc_3', name: 'All In', description: 'Hold nothing back. Deal 1,000 total damage.', stat: 'damageDealt', target: 1000, reward: { gold: 150 }, order: 3 },
      { id: 'side_gc_4', name: 'Glass Cannon', description: 'Survive the carnage. Use 3 potions to stay alive.', stat: 'potionsUsed', target: 3, reward: { gold: 250 }, order: 4 },
      { id: 'side_gc_5', name: 'Nuclear Option', description: 'End it with a bang. Deal 2,000 total damage.', stat: 'damageDealt', target: 2000, reward: { gold: 400 }, order: 5 },
    ],
  },

  // Chain: Loot Goblin - loot everything (Lv 3)
  {
    chainId: 'loot_goblin',
    chainName: 'Loot Goblin',
    chainDescription: 'If it drops, you grab it. If it shines, it\'s yours.',
    chainIcon: 'chest',
    levelReq: 3,
    quests: [
      { id: 'side_lg_1', name: 'Sticky Fingers', description: 'Grab your first haul. Loot 3 items.', stat: 'itemsLooted', target: 3, reward: { gold: 50 }, order: 1 },
      { id: 'side_lg_2', name: 'Five Finger Discount', description: 'Keep looting. Grab 6 more items.', stat: 'itemsLooted', target: 6, reward: { gold: 100 }, order: 2 },
      { id: 'side_lg_3', name: 'Hoard Mode', description: 'Sell off the excess. Sell 4 items.', stat: 'itemsSold', target: 4, reward: { gold: 150 }, order: 3 },
      { id: 'side_lg_4', name: 'Loot Goblin Supreme', description: 'Loot 12 items total. Your pockets overflow.', stat: 'itemsLooted', target: 12, reward: { gold: 350 }, order: 4 },
    ],
  },

  // Chain: Potion Chugger - use potions aggressively (Lv 5)
  {
    chainId: 'potion_chugger',
    chainName: 'Potion Chugger',
    chainDescription: 'Why fight smart when you can just drink more potions?',
    chainIcon: 'flask',
    levelReq: 5,
    quests: [
      { id: 'side_pc_1', name: 'Taste Test', description: 'Start chugging. Use 2 potions.', stat: 'potionsUsed', target: 2, reward: { gold: 60 }, order: 1 },
      { id: 'side_pc_2', name: 'Chug Chug Chug', description: 'Keep drinking. Heal 300 total HP.', stat: 'totalHealing', target: 300, reward: { gold: 100 }, order: 2 },
      { id: 'side_pc_3', name: 'Potion Addict', description: 'You can\'t stop. Use 5 more potions.', stat: 'potionsUsed', target: 5, reward: { gold: 175 }, order: 3 },
      { id: 'side_pc_4', name: 'Bottomless Stomach', description: 'Heal 800 total HP through sheer consumption.', stat: 'totalHealing', target: 800, reward: { gold: 350 }, order: 4 },
    ],
  },

  // Chain: Critical Striker - crit-focused (Lv 5)
  {
    chainId: 'critical_striker',
    chainName: 'Critical Striker',
    chainDescription: 'Every hit should be a critical hit. Aim for the weak spots.',
    chainIcon: 'crosshair',
    levelReq: 5,
    quests: [
      { id: 'side_cs_1', name: 'Lucky Hit', description: 'Land your first critical hits. Get 2 crits.', stat: 'criticalHits', target: 2, reward: { gold: 75 }, order: 1 },
      { id: 'side_cs_2', name: 'Weak Point', description: 'Exploit every weakness. Land 5 critical hits.', stat: 'criticalHits', target: 5, reward: { gold: 125 }, order: 2 },
      { id: 'side_cs_3', name: 'Surgical Precision', description: 'Make every swing count. Deal 1,500 total damage.', stat: 'damageDealt', target: 1500, reward: { gold: 200 }, order: 3 },
      { id: 'side_cs_4', name: 'Crit Machine', description: 'You can\'t miss. Land 10 critical hits.', stat: 'criticalHits', target: 10, reward: { gold: 400 }, order: 4 },
    ],
  },

  // Chain: Comeback Kid - survive and win (Lv 8)
  {
    chainId: 'comeback_kid',
    chainName: 'Comeback Kid',
    chainDescription: 'Get knocked down, get back up, and win anyway.',
    chainIcon: 'heart',
    levelReq: 8,
    quests: [
      { id: 'side_ck_1', name: 'Eat Dirt', description: 'Take a beating first. Absorb 500 damage.', stat: 'damageTaken', target: 500, reward: { gold: 80 }, order: 1 },
      { id: 'side_ck_2', name: 'Patch Up', description: 'Heal through the pain. Heal 400 HP.', stat: 'totalHealing', target: 400, reward: { gold: 120 }, order: 2 },
      { id: 'side_ck_3', name: 'Refuse to Die', description: 'Use 4 potions and keep fighting.', stat: 'potionsUsed', target: 4, reward: { gold: 175 }, order: 3 },
      { id: 'side_ck_4', name: 'The Comeback', description: 'Win 8 battles despite everything.', stat: 'battlesWon', target: 8, reward: { gold: 250 }, order: 4 },
      { id: 'side_ck_5', name: 'Comeback Kid', description: 'Deal 3,000 damage to prove you\'re unstoppable.', stat: 'damageDealt', target: 3000, reward: { gold: 500 }, order: 5 },
    ],
  },

  // Chain: Boss Rush - kill bosses fast (Lv 10)
  {
    chainId: 'boss_rush',
    chainName: 'Boss Rush',
    chainDescription: 'Skip the small fry. Only bosses matter today.',
    chainIcon: 'skull',
    levelReq: 10,
    quests: [
      { id: 'side_br_1', name: 'Opening Act', description: 'Defeat your first boss of the day.', stat: 'bossesKilled', target: 1, reward: { gold: 150 }, order: 1 },
      { id: 'side_br_2', name: 'Double Down', description: 'Two bosses down. Keep pushing.', stat: 'bossesKilled', target: 2, reward: { gold: 250 }, order: 2 },
      { id: 'side_br_3', name: 'Boss Breaker', description: 'Deal 5,000 damage to the big ones.', stat: 'damageDealt', target: 5000, reward: { gold: 400 }, order: 3 },
      { id: 'side_br_4', name: 'Boss Rush Complete', description: 'Defeat 4 bosses in your rush.', stat: 'bossesKilled', target: 4, reward: { gold: 750 }, order: 4 },
    ],
  },

  // Chain: Endurance Run - long play session (Lv 10)
  {
    chainId: 'endurance_run',
    chainName: 'Endurance Run',
    chainDescription: 'See how far you can push in a single marathon session.',
    chainIcon: 'infinity',
    levelReq: 10,
    quests: [
      { id: 'side_er_1', name: 'Warm Up', description: 'Get moving. Complete 5 explorations.', stat: 'explorationsCompleted', target: 5, reward: { gold: 75 }, order: 1 },
      { id: 'side_er_2', name: 'Into the Zone', description: 'Hit your stride. Win 10 battles.', stat: 'battlesWon', target: 10, reward: { gold: 150 }, order: 2 },
      { id: 'side_er_3', name: 'Second Wind', description: 'Push through the wall. Deal 4,000 damage.', stat: 'damageDealt', target: 4000, reward: { gold: 250 }, order: 3 },
      { id: 'side_er_4', name: 'Runner\'s High', description: 'Loot 8 items along the way.', stat: 'itemsLooted', target: 8, reward: { gold: 300 }, order: 4 },
      { id: 'side_er_5', name: 'Marathon Complete', description: 'Cross the finish line. Complete 15 explorations.', stat: 'explorationsCompleted', target: 15, reward: { gold: 600 }, order: 5 },
    ],
  },

  // Chain: Neon Blitz - Neon District speed challenge (Lv 1)
  {
    chainId: 'neon_blitz',
    chainName: 'Neon Blitz',
    chainDescription: 'Light up the Neon District with an all-out blitz.',
    chainIcon: 'lightning',
    levelReq: 1,
    quests: [
      { id: 'side_nb_1', name: 'Neon Lights', description: 'Hit the streets. Complete 3 explorations.', stat: 'explorationsCompleted', target: 3, reward: { gold: 35 }, order: 1 },
      { id: 'side_nb_2', name: 'Street Fight', description: 'Brawl in the alleyways. Win 4 battles.', stat: 'battlesWon', target: 4, reward: { gold: 65 }, order: 2 },
      { id: 'side_nb_3', name: 'Neon Hunter', description: 'Clear the district. Defeat 5 Gutter Goblins.', stat: 'killed_gutter-goblin', target: 5, reward: { gold: 100 }, order: 3 },
      { id: 'side_nb_4', name: 'Neon Blitz', description: 'Own the night. Earn 100 gold.', stat: 'goldEarned', target: 100, reward: { gold: 250 }, order: 4 },
    ],
  },

  // Chain: Scrap Dealer - sell everything (Lv 5)
  {
    chainId: 'scrap_dealer',
    chainName: 'Scrap Dealer',
    chainDescription: 'One adventurer\'s junk is another\'s treasure. Sell it all.',
    chainIcon: 'coin',
    levelReq: 5,
    quests: [
      { id: 'side_scr_1', name: 'Junk Collector', description: 'Loot 4 items to start your inventory.', stat: 'itemsLooted', target: 4, reward: { gold: 50 }, order: 1 },
      { id: 'side_scr_2', name: 'Yard Sale', description: 'Sell 3 items for quick cash.', stat: 'itemsSold', target: 3, reward: { gold: 100 }, order: 2 },
      { id: 'side_scr_3', name: 'Bulk Discount', description: 'Keep the deals flowing. Sell 6 items total.', stat: 'itemsSold', target: 6, reward: { gold: 200 }, order: 3 },
      { id: 'side_scr_4', name: 'Scrap King', description: 'Cash out big. Earn 300 gold total.', stat: 'goldEarned', target: 300, reward: { gold: 400 }, order: 4 },
    ],
  },

  // Chain: Frostbite Blitz - frozen wastes quick run (Lv 12)
  {
    chainId: 'frostbite_blitz',
    chainName: 'Frostbite Blitz',
    chainDescription: 'Raid the Frozen Wastes before the cold claims you.',
    chainIcon: 'snowflake',
    levelReq: 12,
    quests: [
      { id: 'side_fb_1', name: 'Cold Snap', description: 'Brave the cold. Complete 6 explorations.', stat: 'explorationsCompleted', target: 6, reward: { gold: 120 }, order: 1 },
      { id: 'side_fb_2', name: 'Frozen Fury', description: 'Crush the frost beasts. Defeat 8 Glacial Golems.', stat: 'killed_glacial-golem', target: 8, reward: { gold: 200 }, order: 2 },
      { id: 'side_fb_3', name: 'Ice Breaker', description: 'Shatter their defenses. Deal 3,000 damage.', stat: 'damageDealt', target: 3000, reward: { gold: 300 }, order: 3 },
      { id: 'side_fb_4', name: 'Frostbite Blitz', description: 'Finish the raid. Win 10 battles.', stat: 'battlesWon', target: 10, reward: { gold: 500 }, order: 4 },
    ],
  },

  // Chain: Inferno Sprint - scorched badlands quick run (Lv 18)
  {
    chainId: 'inferno_sprint',
    chainName: 'Inferno Sprint',
    chainDescription: 'Sprint through the Scorched Badlands before you burn to ash.',
    chainIcon: 'flame',
    levelReq: 18,
    quests: [
      { id: 'side_is_1', name: 'Heat Stroke', description: 'Charge into the heat. Defeat 10 Ember Wolves.', stat: 'killed_ember-wolf', target: 10, reward: { gold: 200 }, order: 1 },
      { id: 'side_is_2', name: 'Scorching Path', description: 'Blaze a trail. Complete 8 explorations.', stat: 'explorationsCompleted', target: 8, reward: { gold: 275 }, order: 2 },
      { id: 'side_is_3', name: 'Flame Surge', description: 'Unleash your fire. Deal 6,000 total damage.', stat: 'damageDealt', target: 6000, reward: { gold: 400 }, order: 3 },
      { id: 'side_is_4', name: 'Inferno Sprint', description: 'Survive and profit. Earn 500 gold.', stat: 'goldEarned', target: 500, reward: { gold: 650 }, order: 4 },
    ],
  },

  // Chain: Swamp Blitz - toxic marshlands quick run (Lv 25)
  {
    chainId: 'swamp_blitz',
    chainName: 'Swamp Blitz',
    chainDescription: 'Slash through the Toxic Marshlands before the poison sets in.',
    chainIcon: 'flask',
    levelReq: 25,
    quests: [
      { id: 'side_sb_1', name: 'Muck Rusher', description: 'Dive into the swamp. Complete 8 explorations.', stat: 'explorationsCompleted', target: 8, reward: { gold: 250 }, order: 1 },
      { id: 'side_sb_2', name: 'Toxic Takedown', description: 'Clear the corruption fast. Defeat 12 Plague Rats.', stat: 'killed_plague-rat', target: 12, reward: { gold: 350 }, order: 2 },
      { id: 'side_sb_3', name: 'Antidote Rush', description: 'Keep yourself alive. Use 4 potions.', stat: 'potionsUsed', target: 4, reward: { gold: 300 }, order: 3 },
      { id: 'side_sb_4', name: 'Swamp Blitz', description: 'Escape the marsh victorious. Deal 10,000 damage.', stat: 'damageDealt', target: 10000, reward: { gold: 750 }, order: 4 },
    ],
  },

  // Chain: Abyss Dive - abyssal depths quick run (Lv 32)
  {
    chainId: 'abyss_dive',
    chainName: 'Abyss Dive',
    chainDescription: 'Plunge into the Abyssal Depths for a smash-and-grab raid.',
    chainIcon: 'anchor',
    levelReq: 32,
    quests: [
      { id: 'side_adv_1', name: 'Deep Plunge', description: 'Descend fast. Complete 10 explorations.', stat: 'explorationsCompleted', target: 10, reward: { gold: 350 }, order: 1 },
      { id: 'side_adv_2', name: 'Pressure Crush', description: 'Overwhelm them. Defeat 15 Coral Golems.', stat: 'killed_coral-golem', target: 15, reward: { gold: 500 }, order: 2 },
      { id: 'side_adv_3', name: 'Abyssal Loot', description: 'Scavenge the depths. Loot 8 items.', stat: 'itemsLooted', target: 8, reward: { gold: 450 }, order: 3 },
      { id: 'side_adv_4', name: 'Depth Charge', description: 'Annihilate. Deal 15,000 total damage.', stat: 'damageDealt', target: 15000, reward: { gold: 900 }, order: 4 },
    ],
  },

  // Chain: Celestial Dash - celestial highlands quick run (Lv 40)
  {
    chainId: 'celestial_dash',
    chainName: 'Celestial Dash',
    chainDescription: 'Race across the Celestial Highlands and claim heavenly spoils.',
    chainIcon: 'star',
    levelReq: 40,
    quests: [
      { id: 'side_cd_1', name: 'Sky Rush', description: 'Ascend quickly. Complete 10 explorations.', stat: 'explorationsCompleted', target: 10, reward: { gold: 500 }, order: 1 },
      { id: 'side_cd_2', name: 'Angel Slaughter', description: 'Cut through the celestials. Defeat 20 Solar Elementals.', stat: 'killed_solar-elemental', target: 20, reward: { gold: 650 }, order: 2 },
      { id: 'side_cd_3', name: 'Heaven\'s Toll', description: 'Collect the riches above. Earn 800 gold.', stat: 'goldEarned', target: 800, reward: { gold: 600 }, order: 3 },
      { id: 'side_cd_4', name: 'Celestial Dash', description: 'Strike with divine force. Deal 25,000 damage.', stat: 'damageDealt', target: 25000, reward: { gold: 1200 }, order: 4 },
    ],
  },

  // Chain: Void Raid - void nexus quick run (Lv 50)
  {
    chainId: 'void_raid',
    chainName: 'Void Raid',
    chainDescription: 'A suicidal raid into the Void Nexus. Get in, hit hard, get out.',
    chainIcon: 'void',
    levelReq: 50,
    quests: [
      { id: 'side_vr_1', name: 'Breach Point', description: 'Tear through the void. Complete 10 explorations.', stat: 'explorationsCompleted', target: 10, reward: { gold: 750 }, order: 1 },
      { id: 'side_vr_2', name: 'Void Storm', description: 'Unleash chaos. Destroy 20 Rift Stalkers.', stat: 'killed_rift-stalker', target: 20, reward: { gold: 900 }, order: 2 },
      { id: 'side_vr_3', name: 'Reality Shatter', description: 'Break everything. Deal 40,000 total damage.', stat: 'damageDealt', target: 40000, reward: { gold: 1200 }, order: 3 },
      { id: 'side_vr_4', name: 'Void Raid', description: 'Defeat a void boss and escape. Defeat 2 bosses.', stat: 'bossesKilled', target: 2, reward: { gold: 2000 }, order: 4 },
    ],
  },

  // Chain: Dodge Master - evasion focused (Lv 8)
  {
    chainId: 'dodge_master',
    chainName: 'Dodge Master',
    chainDescription: 'Why block when you can simply not get hit?',
    chainIcon: 'wind',
    levelReq: 8,
    quests: [
      { id: 'side_dm_1', name: 'Side Step', description: 'Start dodging. Perform 3 dodges.', stat: 'dodgesPerformed', target: 3, reward: { gold: 75 }, order: 1 },
      { id: 'side_dm_2', name: 'Untouchable', description: 'Keep evading. Win 6 battles.', stat: 'battlesWon', target: 6, reward: { gold: 125 }, order: 2 },
      { id: 'side_dm_3', name: 'Ghost', description: 'They can\'t hit what they can\'t see. Dodge 8 times.', stat: 'dodgesPerformed', target: 8, reward: { gold: 200 }, order: 3 },
      { id: 'side_dm_4', name: 'Dodge Master', description: 'Strike back hard. Deal 2,500 total damage.', stat: 'damageDealt', target: 2500, reward: { gold: 450 }, order: 4 },
    ],
  },

  // Chain: One Punch - highest damage focused (Lv 15)
  {
    chainId: 'one_punch',
    chainName: 'One Punch',
    chainDescription: 'Channel everything into a single devastating blow.',
    chainIcon: 'fist',
    levelReq: 15,
    quests: [
      { id: 'side_op_1', name: 'Warm Up Swing', description: 'Start hitting hard. Land a 30+ damage hit.', stat: 'highestDamage', target: 30, reward: { gold: 100 }, order: 1 },
      { id: 'side_op_2', name: 'Power Strike', description: 'Build momentum. Win 6 battles.', stat: 'battlesWon', target: 6, reward: { gold: 150 }, order: 2 },
      { id: 'side_op_3', name: 'Haymaker', description: 'Hit harder. Land a 75+ damage hit.', stat: 'highestDamage', target: 75, reward: { gold: 250 }, order: 3 },
      { id: 'side_op_4', name: 'Skull Crusher', description: 'Destroy everything. Deal 5,000 total damage.', stat: 'damageDealt', target: 5000, reward: { gold: 400 }, order: 4 },
      { id: 'side_op_5', name: 'One Punch', description: 'The ultimate hit. Land a 120+ damage single strike.', stat: 'highestDamage', target: 120, reward: { gold: 750 }, order: 5 },
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
    // Stat baselines for quest line quests: { [questId]: statValueWhenActivated }
    // Progress = currentStat - baseline, so only post-acceptance actions count
    questBaselines: {},
    // Seeds for cycle tracking
    lastDailySeed: getDailySeed(),
    lastWeeklySeed: getWeeklySeed(),
    lastMonthlySeed: getMonthlySeed(),
  };
}

// Get progress for a quest relative to its baseline (only counts post-acceptance actions)
export function getQuestProgress(stats, questId, stat, baselines) {
  const total = stats[stat] || 0;
  const baseline = (baselines || {})[questId];
  // If no baseline exists (legacy save), use full stat value for backward compat
  if (baseline === undefined) return total;
  return Math.max(0, total - baseline);
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
    chestsOpened: 0,
  };
}
