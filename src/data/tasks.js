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
//   highestDamage, totalHealing,
//   fireRitualsLit, fireRitualsDefended, fireRitualMonstersKilled, wavesSurvived

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

// ---- LEVEL SCALING HELPERS ----
// Scale quest targets and rewards based on player level.
// This makes daily/weekly quests feel appropriately challenging at every stage.

// Scale a target value by player level (grows ~8% per level, capped at 10x base)
export function scaleTarget(base, level) {
  return Math.floor(base * Math.min(10, 1 + (level - 1) * 0.08));
}

// Scale a reward gold value by player level (grows ~6% per level)
export function scaleRewardGold(base, level) {
  return Math.floor(base * (1 + (level - 1) * 0.06));
}

// Apply level scaling to a simple task (single stat/target)
function scaleSimpleTask(task, level) {
  return {
    ...task,
    target: scaleTarget(task.baseTarget || task.target, level),
    description: task.descTemplate
      ? task.descTemplate(scaleTarget(task.baseTarget || task.target, level))
      : task.description,
    reward: {
      ...task.reward,
      gold: task.reward.gold ? scaleRewardGold(task.reward.gold, level) : 0,
    },
  };
}

// Apply level scaling to a compound task (subquests)
function scaleCompoundTask(task, level) {
  return {
    ...task,
    subquests: task.subquests.map(sq => ({
      ...sq,
      target: scaleTarget(sq.baseTarget || sq.target, level),
      description: sq.descTemplate
        ? sq.descTemplate(scaleTarget(sq.baseTarget || sq.target, level))
        : sq.description,
    })),
    reward: {
      ...task.reward,
      gold: task.reward.gold ? scaleRewardGold(task.reward.gold, level) : 0,
    },
  };
}

// Scale any task (simple or compound) by player level
export function scaleTask(task, level) {
  if (task.compound) return scaleCompoundTask(task, level);
  return scaleSimpleTask(task, level);
}

// ---- COMPOUND QUEST HELPERS ----
// Compound quests have multiple sub-objectives that must ALL be completed.
// Each subquest tracks its own stat/target independently.

// Check if a compound quest is complete given progress data
export function isCompoundQuestComplete(task, progressObj) {
  if (!task.compound || !task.subquests) return false;
  return task.subquests.every((sq, idx) => {
    const key = `${task.id}__${idx}`;
    return (progressObj[key] || 0) >= sq.target;
  });
}

// Get overall progress fraction for a compound quest (for display)
export function getCompoundQuestProgress(task, progressObj) {
  if (!task.compound || !task.subquests) return { completed: 0, total: 0, subquests: [] };
  const subquests = task.subquests.map((sq, idx) => {
    const key = `${task.id}__${idx}`;
    const progress = progressObj[key] || 0;
    return { ...sq, progress: Math.min(progress, sq.target), complete: progress >= sq.target };
  });
  return {
    completed: subquests.filter(s => s.complete).length,
    total: subquests.length,
    subquests,
  };
}

// ---- DAILY TASKS ----
// Reset every 24 hours. Small, achievable goals.
// Targets and rewards scale with player level via scaleTask().
// Tasks can be simple (single stat/target) or compound (multiple subquests).
export const DAILY_TASKS = [
  {
    id: 'daily_kill_5',
    name: 'Pest Control',
    description: 'Defeat 5 monsters',
    stat: 'monstersKilled',
    baseTarget: 5,
    target: 5,
    descTemplate: (t) => `Defeat ${t} monsters`,
    reward: { gold: 25, energyDrinks: 1 },
  },
  {
    id: 'daily_explore_3',
    name: 'Scout Duty',
    description: 'Complete 3 explorations',
    stat: 'explorationsCompleted',
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Complete ${t} explorations`,
    reward: { gold: 15, energyDrinks: 1 },
  },
  {
    id: 'daily_deal_500',
    name: 'Heavy Hitter',
    description: 'Deal 500 total damage',
    stat: 'damageDealt',
    baseTarget: 500,
    target: 500,
    descTemplate: (t) => `Deal ${t.toLocaleString()} total damage`,
    reward: { gold: 20, energyDrinks: 1 },
  },
  {
    id: 'daily_earn_100g',
    name: 'Gold Rush',
    description: 'Earn 100 gold',
    stat: 'goldEarned',
    baseTarget: 100,
    target: 100,
    descTemplate: (t) => `Earn ${t.toLocaleString()} gold`,
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
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Win ${t} battles`,
    reward: { gold: 20, energyDrinks: 1 },
  },
  {
    id: 'daily_loot_2',
    name: 'Scavenger',
    description: 'Loot 2 items',
    stat: 'itemsLooted',
    baseTarget: 2,
    target: 2,
    descTemplate: (t) => `Loot ${t} items`,
    reward: { gold: 15 },
  },
  // --- NEW: Compound daily quests ---
  {
    id: 'daily_hunter_gather',
    name: 'Hunter-Gatherer',
    description: 'Kill monsters and collect materials in one outing.',
    compound: true,
    subquests: [
      { name: 'Hunt Monsters', stat: 'monstersKilled', baseTarget: 3, target: 3, descTemplate: (t) => `Defeat ${t} monsters` },
      { name: 'Collect Materials', stat: 'materialsCollected', baseTarget: 2, target: 2, descTemplate: (t) => `Collect ${t} materials` },
    ],
    reward: { gold: 35, energyDrinks: 1 },
  },
  {
    id: 'daily_slash_and_sell',
    name: 'Slash & Sell',
    description: 'Fight for loot and sell what you find.',
    compound: true,
    subquests: [
      { name: 'Loot Items', stat: 'itemsLooted', baseTarget: 2, target: 2, descTemplate: (t) => `Loot ${t} items` },
      { name: 'Sell Items', stat: 'itemsSold', baseTarget: 1, target: 1, descTemplate: (t) => `Sell ${t} item${t > 1 ? 's' : ''}` },
    ],
    reward: { gold: 25 },
  },
  {
    id: 'daily_combat_medic',
    name: 'Combat Medic',
    description: 'Fight hard and patch yourself up.',
    compound: true,
    subquests: [
      { name: 'Deal Damage', stat: 'damageDealt', baseTarget: 300, target: 300, descTemplate: (t) => `Deal ${t.toLocaleString()} damage` },
      { name: 'Use Potions', stat: 'potionsUsed', target: 1 },
    ],
    reward: { gold: 20, energyDrinks: 1 },
  },
  {
    id: 'daily_crit_striker',
    name: 'Precision Strikes',
    description: 'Land critical hits in combat.',
    stat: 'criticalHits',
    baseTarget: 2,
    target: 2,
    descTemplate: (t) => `Land ${t} critical hits`,
    reward: { gold: 20 },
  },
  {
    id: 'daily_dodge_master',
    name: 'Nimble Feet',
    description: 'Dodge enemy attacks.',
    stat: 'dodgesPerformed',
    baseTarget: 2,
    target: 2,
    descTemplate: (t) => `Dodge ${t} attacks`,
    reward: { gold: 15 },
  },
  {
    id: 'daily_material_run',
    name: 'Material Run',
    description: 'Gather materials from the wilds.',
    stat: 'materialsCollected',
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Collect ${t} materials`,
    reward: { gold: 20, energyDrinks: 1 },
  },
  {
    id: 'daily_chest_opener',
    name: 'Treasure Trove',
    description: 'Open loot chests.',
    stat: 'chestsOpened',
    baseTarget: 1,
    target: 1,
    descTemplate: (t) => `Open ${t} chest${t > 1 ? 's' : ''}`,
    reward: { gold: 20 },
  },
  {
    id: 'daily_boss_rush',
    name: 'Boss Rush',
    description: 'Challenge a boss and emerge victorious.',
    stat: 'bossesKilled',
    target: 1,
    reward: { gold: 40, energyDrinks: 1 },
  },
  {
    id: 'daily_skill_user',
    name: 'Ability Showcase',
    description: 'Use skills in combat.',
    stat: 'skillsUsed',
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Use ${t} skills in combat`,
    reward: { gold: 15 },
  },
  {
    id: 'daily_flawless',
    name: 'Flawless Victory',
    description: 'Win a battle without taking any damage.',
    stat: 'flawlessVictories',
    target: 1,
    reward: { gold: 35, energyDrinks: 1 },
  },
  {
    id: 'daily_combo_chain',
    name: 'Combo Artist',
    description: 'Trigger combo chains in battle.',
    stat: 'comboTriggered',
    baseTarget: 1,
    target: 1,
    descTemplate: (t) => `Trigger ${t} combo chain${t > 1 ? 's' : ''}`,
    reward: { gold: 25 },
  },
  {
    id: 'daily_no_block_win',
    name: 'All-Out Assault',
    description: 'Win a battle without using defend.',
    stat: 'winsWithoutDefend',
    target: 1,
    reward: { gold: 30 },
  },
  {
    id: 'daily_parry_master',
    name: 'Perfect Timing',
    description: 'Perform perfect parries in battle.',
    stat: 'perfectParries',
    baseTarget: 1,
    target: 1,
    descTemplate: (t) => `Perform ${t} perfect parr${t > 1 ? 'ies' : 'y'}`,
    reward: { gold: 25 },
  },
  {
    id: 'daily_merchant_meet',
    name: 'Chance Encounter',
    description: 'Find an extraordinary trader while exploring.',
    stat: 'merchantEncounters',
    target: 1,
    reward: { gold: 30, energyDrinks: 1 },
  },
  {
    id: 'daily_explore_and_fight',
    name: 'Full Expedition',
    description: 'Explore the world and defeat what you find.',
    compound: true,
    subquests: [
      { name: 'Explore', stat: 'explorationsCompleted', baseTarget: 3, target: 3, descTemplate: (t) => `Complete ${t} explorations` },
      { name: 'Defeat Monsters', stat: 'monstersKilled', baseTarget: 2, target: 2, descTemplate: (t) => `Defeat ${t} monsters` },
      { name: 'Earn Gold', stat: 'goldEarned', baseTarget: 50, target: 50, descTemplate: (t) => `Earn ${t} gold` },
    ],
    reward: { gold: 40, energyDrinks: 1 },
  },
  // --- Delivery quests: fetch an item and turn it in ---
  {
    id: 'daily_deliver_shiv',
    name: 'Shiv Courier',
    description: 'Find a Rusty Shiv in Neon Mile and deliver it. Watch out — dying means losing it!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 45, energyDrinks: 1 },
    itemRequirements: [{ itemName: 'Rusty Shiv', locationId: 'neon-mile', locationName: 'Neon Mile' }],
  },
  {
    id: 'daily_deliver_dagger',
    name: 'Dagger Drop-off',
    description: 'Retrieve a Copper Dagger from Neon Mile or Shadow Alley. Don\'t die or you\'ll lose it!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 40 },
    itemRequirements: [{ itemName: 'Copper Dagger', locationId: 'neon-mile', locationName: 'Neon Mile' }],
  },
  {
    id: 'daily_deliver_pipe',
    name: 'Pipe Runner',
    description: 'Grab a Bent Pipe Bludgeon from Neon Mile and bring it back in one piece.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 35 },
    itemRequirements: [{ itemName: 'Bent Pipe Bludgeon', locationId: 'neon-mile', locationName: 'Neon Mile' }],
  },
  {
    id: 'daily_deliver_switchblade',
    name: 'Alley Pickup',
    description: 'Find a Switchblade Special in Shadow Alley. Death means starting over!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 45, energyDrinks: 1 },
    itemRequirements: [{ itemName: 'Switchblade Special', locationId: 'shadow-alley', locationName: 'Shadow Alley' }],
  },
];

// Number of daily tasks to randomly select each day
export const DAILY_TASK_COUNT = 4;

// ---- WEEKLY TASKS ----
// Reset every 7 days. Medium-term goals.
// Targets and rewards scale with player level via scaleTask().
export const WEEKLY_TASKS = [
  {
    id: 'weekly_kill_50',
    name: 'Monster Hunter',
    description: 'Defeat 50 monsters',
    stat: 'monstersKilled',
    baseTarget: 50,
    target: 50,
    descTemplate: (t) => `Defeat ${t} monsters`,
    reward: { gold: 200, chestId: 'shadow-lockbox', energyDrinks: 2 },
  },
  {
    id: 'weekly_boss_3',
    name: 'Boss Slayer',
    description: 'Defeat 3 bosses',
    stat: 'bossesKilled',
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Defeat ${t} bosses`,
    reward: { gold: 300, chestId: 'mercenary-bounty', energyDrinks: 2 },
  },
  {
    id: 'weekly_deal_5000',
    name: 'Damage Dealer',
    description: 'Deal 5,000 total damage',
    stat: 'damageDealt',
    baseTarget: 5000,
    target: 5000,
    descTemplate: (t) => `Deal ${t.toLocaleString()} total damage`,
    reward: { gold: 250, energyDrinks: 2 },
  },
  {
    id: 'weekly_earn_1000g',
    name: 'Profit Margin',
    description: 'Earn 1,000 gold',
    stat: 'goldEarned',
    baseTarget: 1000,
    target: 1000,
    descTemplate: (t) => `Earn ${t.toLocaleString()} gold`,
    reward: { gold: 350, chestId: 'street-crate' },
  },
  {
    id: 'weekly_explore_20',
    name: 'Cartographer',
    description: 'Complete 20 explorations',
    stat: 'explorationsCompleted',
    baseTarget: 20,
    target: 20,
    descTemplate: (t) => `Complete ${t} explorations`,
    reward: { gold: 200, energyDrinks: 2 },
  },
  {
    id: 'weekly_sell_10',
    name: 'Merchant',
    description: 'Sell 10 items',
    stat: 'itemsSold',
    baseTarget: 10,
    target: 10,
    descTemplate: (t) => `Sell ${t} items`,
    reward: { gold: 150, energyDrinks: 1 },
  },
  // --- NEW: Compound weekly quests ---
  {
    id: 'weekly_material_hoarder',
    name: 'Material Hoarder',
    description: 'Gather a large stock of building materials.',
    stat: 'materialsCollected',
    baseTarget: 15,
    target: 15,
    descTemplate: (t) => `Collect ${t} materials`,
    reward: { gold: 250, energyDrinks: 2 },
  },
  {
    id: 'weekly_well_rounded',
    name: 'Well-Rounded Adventurer',
    description: 'Prove your skills in all aspects of adventuring.',
    compound: true,
    subquests: [
      { name: 'Slay Monsters', stat: 'monstersKilled', baseTarget: 20, target: 20, descTemplate: (t) => `Defeat ${t} monsters` },
      { name: 'Gather Materials', stat: 'materialsCollected', baseTarget: 5, target: 5, descTemplate: (t) => `Collect ${t} materials` },
      { name: 'Sell Loot', stat: 'itemsSold', baseTarget: 5, target: 5, descTemplate: (t) => `Sell ${t} items` },
      { name: 'Explore', stat: 'explorationsCompleted', baseTarget: 10, target: 10, descTemplate: (t) => `Complete ${t} explorations` },
    ],
    reward: { gold: 400, chestId: 'street-crate', energyDrinks: 2 },
  },
  {
    id: 'weekly_boss_no_potion',
    name: 'Unstoppable Force',
    description: 'Defeat a boss without using any potions during the fight.',
    stat: 'bossKilledNoPotion',
    target: 1,
    reward: { gold: 350, chestId: 'mercenary-bounty', energyDrinks: 2 },
  },
  {
    id: 'weekly_boss_no_defend',
    name: 'Reckless Fury',
    description: 'Defeat a boss without using defend once.',
    stat: 'bossKilledNoDefend',
    target: 1,
    reward: { gold: 350, energyDrinks: 2 },
  },
  {
    id: 'weekly_flawless_streak',
    name: 'Untouchable',
    description: 'Win battles without taking damage.',
    stat: 'flawlessVictories',
    baseTarget: 3,
    target: 3,
    descTemplate: (t) => `Win ${t} flawless battles`,
    reward: { gold: 300, energyDrinks: 2 },
  },
  {
    id: 'weekly_crit_machine',
    name: 'Critical Mass',
    description: 'Land critical hits to devastate your foes.',
    stat: 'criticalHits',
    baseTarget: 10,
    target: 10,
    descTemplate: (t) => `Land ${t} critical hits`,
    reward: { gold: 200, energyDrinks: 1 },
  },
  {
    id: 'weekly_merchant_finder',
    name: 'Trader Network',
    description: 'Encounter extraordinary traders while exploring.',
    stat: 'merchantEncounters',
    baseTarget: 2,
    target: 2,
    descTemplate: (t) => `Find ${t} extraordinary traders`,
    reward: { gold: 250, energyDrinks: 2 },
  },
  {
    id: 'weekly_parry_champion',
    name: 'Parry Champion',
    description: 'Master the art of the parry.',
    stat: 'perfectParries',
    baseTarget: 5,
    target: 5,
    descTemplate: (t) => `Perform ${t} perfect parries`,
    reward: { gold: 200, energyDrinks: 1 },
  },
  {
    id: 'weekly_war_profiteer',
    name: 'War Profiteer',
    description: 'Fight, loot, and profit from your spoils of war.',
    compound: true,
    subquests: [
      { name: 'Win Battles', stat: 'battlesWon', baseTarget: 15, target: 15, descTemplate: (t) => `Win ${t} battles` },
      { name: 'Loot Items', stat: 'itemsLooted', baseTarget: 8, target: 8, descTemplate: (t) => `Loot ${t} items` },
      { name: 'Earn Gold', stat: 'goldEarned', baseTarget: 500, target: 500, descTemplate: (t) => `Earn ${t.toLocaleString()} gold` },
    ],
    reward: { gold: 350, chestId: 'shadow-lockbox', energyDrinks: 2 },
  },
  {
    id: 'weekly_combo_master',
    name: 'Combo Maestro',
    description: 'Chain combos and dodge attacks to dominate combat.',
    compound: true,
    subquests: [
      { name: 'Trigger Combos', stat: 'comboTriggered', baseTarget: 5, target: 5, descTemplate: (t) => `Trigger ${t} combos` },
      { name: 'Dodge Attacks', stat: 'dodgesPerformed', baseTarget: 5, target: 5, descTemplate: (t) => `Dodge ${t} attacks` },
    ],
    reward: { gold: 250, energyDrinks: 2 },
  },
  {
    id: 'weekly_chest_and_craft',
    name: 'Treasure & Tools',
    description: 'Open chests and gather crafting materials.',
    compound: true,
    subquests: [
      { name: 'Open Chests', stat: 'chestsOpened', baseTarget: 3, target: 3, descTemplate: (t) => `Open ${t} chests` },
      { name: 'Collect Materials', stat: 'materialsCollected', baseTarget: 8, target: 8, descTemplate: (t) => `Collect ${t} materials` },
    ],
    reward: { gold: 200, chestId: 'street-crate', energyDrinks: 1 },
  },
  {
    id: 'weekly_no_potion_streak',
    name: 'Natural Toughness',
    description: 'Win battles without relying on potions.',
    stat: 'winsWithoutPotion',
    baseTarget: 5,
    target: 5,
    descTemplate: (t) => `Win ${t} battles without using potions`,
    reward: { gold: 250, energyDrinks: 2 },
  },
  {
    id: 'weekly_pure_offense',
    name: 'Pure Offense',
    description: 'Win battles using only attacks and skills—no defending allowed.',
    stat: 'winsWithoutDefend',
    baseTarget: 5,
    target: 5,
    descTemplate: (t) => `Win ${t} battles without defending`,
    reward: { gold: 200, energyDrinks: 1 },
  },
  {
    id: 'weekly_grand_expedition',
    name: 'Grand Expedition',
    description: 'A true adventure: explore, fight, gather, and profit.',
    compound: true,
    subquests: [
      { name: 'Explore', stat: 'explorationsCompleted', baseTarget: 15, target: 15, descTemplate: (t) => `Complete ${t} explorations` },
      { name: 'Slay Monsters', stat: 'monstersKilled', baseTarget: 25, target: 25, descTemplate: (t) => `Defeat ${t} monsters` },
      { name: 'Collect Materials', stat: 'materialsCollected', baseTarget: 8, target: 8, descTemplate: (t) => `Collect ${t} materials` },
      { name: 'Earn Gold', stat: 'goldEarned', baseTarget: 800, target: 800, descTemplate: (t) => `Earn ${t.toLocaleString()} gold` },
      { name: 'Sell Loot', stat: 'itemsSold', baseTarget: 5, target: 5, descTemplate: (t) => `Sell ${t} items` },
    ],
    reward: { gold: 500, chestId: 'mercenary-bounty', energyDrinks: 3 },
  },
  // --- Delivery quests ---
  {
    id: 'weekly_deliver_twin_blades',
    name: 'Rooftop Arms Deal',
    description: 'Retrieve a Carbon Spear from Skyline Rooftops and a Rebar Club from Shadow Alley. Dying means losing them both!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 300, energyDrinks: 2 },
    itemRequirements: [
      { itemName: 'Carbon Spear', locationId: 'skyline-rooftops', locationName: 'Skyline Rooftops' },
      { itemName: 'Rebar Club', locationId: 'shadow-alley', locationName: 'Shadow Alley' },
    ],
  },
  {
    id: 'weekly_deliver_ironworks',
    name: 'Ironworks Requisition',
    description: 'Bring a Chainbreaker Axe from Ironworks Yard and a Volt Edge from Ironworks Yard. Guard them with your life!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 350, chestId: 'street-crate', energyDrinks: 2 },
    itemRequirements: [
      { itemName: 'Chainbreaker Axe', locationId: 'ironworks-yard', locationName: 'Ironworks Yard' },
      { itemName: 'Volt Edge', locationId: 'ironworks-yard', locationName: 'Ironworks Yard' },
    ],
  },
  {
    id: 'weekly_deliver_neon_katana',
    name: 'Midnight Retrieval',
    description: 'Recover a Neon Katana from the Midnight Terminal. This legendary blade must not be lost to death!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 400, chestId: 'shadow-lockbox', energyDrinks: 2 },
    itemRequirements: [
      { itemName: 'Neon Katana', locationId: 'midnight-terminal', locationName: 'Midnight Terminal' },
    ],
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
    reward: { gold: 1000, chestId: 'skyline-strongbox', energyDrinks: 3 },
  },
  {
    id: 'monthly_boss_15',
    name: 'Apex Predator',
    description: 'Defeat 15 bosses',
    stat: 'bossesKilled',
    target: 15,
    reward: { gold: 1500, chestId: 'neon-treasure', energyDrinks: 3 },
  },
  {
    id: 'monthly_deal_50000',
    name: 'Wrecking Ball',
    description: 'Deal 50,000 total damage',
    stat: 'damageDealt',
    target: 50000,
    reward: { gold: 1200, energyDrinks: 3 },
  },
  {
    id: 'monthly_earn_10000g',
    name: 'Tycoon',
    description: 'Earn 10,000 gold',
    stat: 'goldEarned',
    target: 10000,
    reward: { gold: 2000, chestId: 'ironworks-coffer', energyDrinks: 3 },
  },
  {
    id: 'monthly_explore_100',
    name: 'World Walker',
    description: 'Complete 100 explorations',
    stat: 'explorationsCompleted',
    target: 100,
    reward: { gold: 800, energyDrinks: 3 },
  },
  // --- Delivery quests ---
  {
    id: 'monthly_deliver_glacier_set',
    name: 'Frostbound Shipment',
    description: 'Recover a Frostbite Cleaver from Glacier Tunnels and a Frostfire Saber from Permafrost Ruins. The frozen wastes are deadly — die and they\'re gone.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 1500, chestId: 'skyline-strongbox', energyDrinks: 3 },
    itemRequirements: [
      { itemName: 'Frostbite Cleaver', locationId: 'glacier-tunnels', locationName: 'Glacier Tunnels' },
      { itemName: 'Frostfire Saber', locationId: 'permafrost-ruins', locationName: 'Permafrost Ruins' },
    ],
  },
  {
    id: 'monthly_deliver_volcanic_arms',
    name: 'Volcanic Arsenal',
    description: 'Bring an Ember Scimitar from Sunscorch Canyon and a Volcanic Greataxe from Inferno Pit. These weapons must survive the journey!',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 1800, chestId: 'neon-treasure', energyDrinks: 3 },
    itemRequirements: [
      { itemName: 'Ember Scimitar', locationId: 'sunscorch-canyon', locationName: 'Sunscorch Canyon' },
      { itemName: 'Volcanic Greataxe', locationId: 'inferno-pit', locationName: 'Inferno Pit' },
    ],
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
    reward: { gold: 200, chestId: 'metro-vault', energyDrinks: 2 },
  },
  {
    id: 'story_kill_500',
    name: 'Veteran Slayer',
    description: 'Defeat 500 monsters',
    stat: 'monstersKilled',
    target: 500,
    reward: { gold: 500, energyDrinks: 3 },
  },
  {
    id: 'story_kill_1000',
    name: 'Legend of the Streets',
    description: 'Defeat 1,000 monsters',
    stat: 'monstersKilled',
    target: 1000,
    reward: { gold: 1000, chestId: 'void-reliquary', energyDrinks: 5 },
  },
  {
    id: 'story_first_boss',
    name: 'Boss Challenger',
    description: 'Defeat your first boss',
    stat: 'bossesKilled',
    target: 1,
    reward: { gold: 100, energyDrinks: 1 },
  },
  {
    id: 'story_boss_10',
    name: 'Boss Breaker',
    description: 'Defeat 10 bosses',
    stat: 'bossesKilled',
    target: 10,
    reward: { gold: 500, chestId: 'skyline-strongbox', energyDrinks: 3 },
  },
  {
    id: 'story_level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    stat: 'levelsGained',
    target: 9,
    reward: { gold: 100, energyDrinks: 2 },
  },
  {
    id: 'story_level_25',
    name: 'Hardened Warrior',
    description: 'Reach level 25',
    stat: 'levelsGained',
    target: 24,
    reward: { gold: 300, energyDrinks: 3 },
  },
  {
    id: 'story_level_50',
    name: 'Master of the Grind',
    description: 'Reach level 50',
    stat: 'levelsGained',
    target: 49,
    reward: { gold: 1000, chestId: 'legendary-ark', energyDrinks: 5 },
  },
  {
    id: 'story_earn_5000g',
    name: 'Fat Stacks',
    description: 'Earn 5,000 total gold',
    stat: 'goldEarned',
    target: 5000,
    reward: { gold: 250, energyDrinks: 2 },
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
    reward: { gold: 200, energyDrinks: 2 },
  },
  {
    id: 'story_deal_100000',
    name: 'Force of Nature',
    description: 'Deal 100,000 total damage',
    stat: 'damageDealt',
    target: 100000,
    reward: { gold: 1000, chestId: 'void-reliquary', energyDrinks: 4 },
  },
  {
    id: 'story_explore_50',
    name: 'Pathfinder',
    description: 'Complete 50 explorations',
    stat: 'explorationsCompleted',
    target: 50,
    reward: { gold: 150, energyDrinks: 2 },
  },
  {
    id: 'story_explore_500',
    name: 'Trailblazer',
    description: 'Complete 500 explorations',
    stat: 'explorationsCompleted',
    target: 500,
    reward: { gold: 1000, energyDrinks: 5 },
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
    reward: { gold: 100, energyDrinks: 2 },
  },
  {
    id: 'story_sell_50',
    name: 'Market Mogul',
    description: 'Sell 50 items',
    stat: 'itemsSold',
    target: 50,
    reward: { gold: 200 },
  },
  // --- Delivery story quests (one-time milestones) ---
  {
    id: 'story_deliver_iron_shortsword',
    name: 'Underground Courier',
    description: 'Retrieve an Iron Shortsword from Metro Underpass. A powerful patron needs it — don\'t die on the way.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 150, energyDrinks: 1 },
    itemRequirements: [{ itemName: 'Iron Shortsword', locationId: 'metro-underpass', locationName: 'Metro Underpass' }],
  },
  {
    id: 'story_deliver_storm_falchion',
    name: 'Rooftop Relic',
    description: 'Recover a Storm Falchion from the Skyline Rooftops. The guild will reward you handsomely — if you survive.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 300, chestId: 'street-crate', energyDrinks: 2 },
    itemRequirements: [{ itemName: 'Storm Falchion', locationId: 'skyline-rooftops', locationName: 'Skyline Rooftops' }],
  },
  {
    id: 'story_deliver_coral_trident',
    name: 'Abyssal Retrieval',
    description: 'Retrieve a Coral Trident from the Coral Labyrinth. The depths are unforgiving — lose this and you start over.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 800, chestId: 'metro-vault', energyDrinks: 3 },
    itemRequirements: [{ itemName: 'Coral Trident', locationId: 'coral-labyrinth', locationName: 'Coral Labyrinth' }],
  },
  {
    id: 'story_deliver_oblivion_blade',
    name: 'Void\'s Edge',
    description: 'Bring an Oblivion Blade from the Oblivion Throne. The ultimate delivery — death erases all progress.',
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 2000, chestId: 'void-reliquary', energyDrinks: 5 },
    itemRequirements: [{ itemName: 'Oblivion Blade', locationId: 'oblivion-throne', locationName: 'Oblivion Throne' }],
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
// The Ironflask Legacy — a multi-chapter narrative tying together every
// tavern NPC and several wandering NPCs. Each chapter is centered on a
// different NPC's personal arc while the main mystery — who betrayed
// Torren Ironflask to the Void Overlord — runs underneath all seven acts.
export const STORY_MISSIONS = [
  // ================== CHAPTER 1: THE AWAKENING ==================
  // A new face walks into the Dusty Flagon. Grog, the tavern keep, sees
  // something in you and starts you down a road he himself cannot walk.
  {
    id: 'mission_ch1_1',
    chapter: 1,
    chapterName: 'The Awakening',
    chapterSubtitle: "Grog Ironflask's Audition",
    chapterIntro: "Rain streaks the neon signs outside the Dusty Flagon. Inside, a bear of a man polishes a mug that does not need polishing. He puts it down when he sees you. 'Sit,' Grog Ironflask says. 'You've got the look of someone who walked too far. I need someone like that. Let's see what you're made of.'",
    name: 'A Stool at the Flagon',
    description: "Grog won't talk to strangers who haven't bled for the Neon Mile. Clear out 10 Gutter Rats — the ones nesting beneath his cellar doors.",
    storyText: "The rats came with the new tenants in the alleys above. They chew through kegs, steal from the pantry, and one of them bit the ear off Grog's old hound. Grog has a bat behind the bar and no patience left for vermin. He wants proof you can swing something heavier than a mug.",
    npc: 'bartender',
    npcName: 'Grog Ironflask',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "You want my trust? Start with the rats. Ten of them. Don't bring me twenty — I want a number I can count on.",
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
    name: 'Read the Room',
    description: "Grog wants you to walk the Neon Mile before you drink it in. Explore the district 8 times and learn its rhythms.",
    storyText: "'Look,' Grog says, leaning on the bar. 'Before I put a quest in your hand, you need to know who's watching you. Whisper's in the corner — don't meet her eye. Mira's counting coins by the window. Old Fenwick is half-asleep, but he sees everything. And Captain Thorne? He pretends he's off-duty. He isn't.' Walk the streets. Learn the faces. Come back and tell me which ones scared you.",
    npc: 'bartender',
    npcName: 'Grog Ironflask',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "The streets will teach you more than I can. Go. Keep your hands out of your pockets.",
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
    name: "The Drifter's Warning",
    description: "A wandering knight who calls himself Rook corners you in the alley. He says someone has been watching the tavern. Prove your strength by dealing 1,000 damage so he'll tell you more.",
    storyText: "You find Rook the Ironclad leaning against a dumpster in Shadow Alley, helmet dented, sword chipped. 'Someone's been asking about Grog,' he says. 'Not asking friendly. Asking like a hunter.' Rook will not name the watcher until he sees you fight. 'Strength speaks where words lie,' he growls. 'Bleed a thousand drops of damage out there. Then I'll bleed the rest of the story.'",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad (wandering)',
    npcLocation: 'Neon District — Shadow Alley',
    npcQuote: "Strength speaks where words lie. Deal a thousand drops of damage out there. Then I'll bleed the rest of the story.",
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
    name: 'The Shadow Behind the Curtain',
    description: "Rook names the watcher: a Shadow Lord tied to the old Syndicate. Hunt it down and put it in the ground.",
    storyText: "Rook's voice is steel scraping steel. 'There's a Shadow Lord in these alleys. He wears the old Syndicate collar. He's been cataloguing Grog's patrons for months — and Grog is on the list.' He doesn't know who hired the Lord, but he knows where it prowls. Kill it before it kills a regular.",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad (wandering)',
    npcLocation: 'Neon District — Shadow Alley',
    npcQuote: "The Shadow Lord doesn't want you. It wants whoever's paying Grog's tab next. End it before another body shows up in the gutter.",
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
    name: "Grog's Confession",
    description: "Return to the Dusty Flagon. Grog has something to show you — but first, prove yourself in 25 battles so the tavern's patrons will trust your face.",
    storyText: "Grog waits until the last drunk stumbles out. Then he unlocks a drawer under the bar and takes out a sealed letter. 'My brother Torren died in the Midnight Terminal,' he says. 'Void Overlord got him, they said. Routine mission, they said. This letter came a week after the funeral. No return address. Says — says the Void didn't find him. Someone in the tavern told it where to look.' He looks up at you, eyes red. 'I need someone the Flagon trusts before I let you help me. Win twenty-five fights. Come back a regular.'",
    npc: 'bartender',
    npcName: 'Grog Ironflask',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "Someone in the tavern told the Void where to look. I've been sitting on this letter for ten years because nobody I trusted was strong enough to open it with me.",
    stat: 'battlesWon',
    target: 25,
    reward: { gold: 250, energyDrinks: 2 },
    order: 5,
    regionHint: 'Neon District',
  },
  {
    id: 'mission_ch1_6',
    chapter: 1,
    chapterName: 'The Awakening',
    chapterOutro: "Grog nails the Rat King's Iron Crown above the bar. For the first time in ten years, he pours himself a drink from Torren's bottle. 'Next one,' he whispers. 'Next one's for the letter.' Outside, the rain has stopped. A woman in a hooded cloak across the room lifts her glass to you. Whisper is watching.",
    name: "The Rat King's Iron Crown",
    description: "Grog's first real test of loyalty: reclaim the Iron Crown the Rat King forged from his father's stolen tavern sign. Bring it back to the Dusty Flagon before you die — the sewers swallow the dead.",
    storyText: "The Rat King wears a crown hammered from the original 'DUSTY FLAGON' sign. Grog's father wept the day he saw it. Grog never forgot. Reclaim the crown and mount it above the bar where it belongs. (Mechanically: recover a Scrap Axe from Shadow Alley — the crown is fused to its haft.)",
    npc: 'bartender',
    npcName: 'Grog Ironflask',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "Don't die in the sewers. If you die, the crown is lost. I'm not sending another hero after it.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 200, energyDrinks: 1 },
    order: 6,
    regionHint: 'Neon District',
    itemRequirements: [{ itemName: 'Scrap Axe', locationId: 'shadow-alley', locationName: 'Shadow Alley' }],
  },

  // ================== CHAPTER 2: WHISPERS IN THE WASTES ==================
  // Whisper corners you at the bar. She knows Grog showed you the letter.
  // She offers information for sale — and her price is a trip north into
  // the Frozen Wastes, where an old contact went silent.
  {
    id: 'mission_ch2_1',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    chapterSubtitle: "The Information Broker's Price",
    chapterIntro: "Whisper slides onto the stool beside you without a sound. 'Grog thinks the Void found Torren by accident,' she says, swirling her drink. 'He's wrong. Torren's route was leaked by a courier in the Frozen Wastes. That courier worked for me. He went silent three weeks ago. Find out why — and I'll give you a name to give to Grog.'",
    name: 'Cold Reception',
    description: "Whisper's contact operated out of the old Frostforge outpost. Frost Wolves have overrun the trail. Kill 15 of them to clear the approach.",
    storyText: "The Frozen Wastes do not forgive strangers. Whisper's contact, a courier named Velka, would leave wolf pelts at the outpost entrance every week as a signal she was alive. The last signal was three weeks ago. The wolves at the trailhead are the first problem.",
    npc: 'whisper',
    npcName: 'Whisper',
    npcLocation: 'Dusty Flagon (Tavern) — corner booth',
    npcQuote: "Kill the wolves. Leave me one pelt — I'll know if you lie about the count. I always know.",
    stat: 'killed_frost-wolf',
    target: 15,
    reward: { gold: 200 },
    order: 1,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_2',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    name: "Velka's Last Route",
    description: "Velka's dead-drops are hidden across the glacier tunnels. Explore 20 times and retrace the route she walked the day she vanished.",
    storyText: "Whisper's couriers leave signs no one else would notice: a chalk mark here, a cracked icicle there, a rune burned into moss. You follow them deeper into the glacier, past the bodies of frozen scouts. Whoever killed Velka wanted her silenced before she could deliver her last report.",
    npc: 'whisper',
    npcName: 'Whisper',
    npcLocation: 'By proxy (follow the trail)',
    npcQuote: "Read the chalk marks. Read the icicles. If you find nothing, I owe you nothing. If you find her body, I owe you everything.",
    stat: 'explorationsCompleted',
    target: 20,
    reward: { gold: 250 },
    order: 2,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_3',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    name: 'Ember in the Cold',
    description: "Ember the Ashen Priestess finds you in the tunnels, sheltering a dying flame. She'll trade a blessing for raw strength — deal 5,000 damage to feed the fire.",
    storyText: "You find Ember kneeling over a dying ember in a snow-choked shrine. 'The Flame remembers Torren,' she says. 'He passed through here once. His ghost still walks the ice.' She cannot speak further until the Flame is fed. The Flame feeds on violence.",
    npc: 'tnpc-ember',
    npcName: 'Ember the Ashen Priestess (wandering)',
    npcLocation: 'Frozen Wastes — ruined shrine',
    npcQuote: "Feed the Flame. Five thousand drops of damage. The Flame speaks when it burns bright enough.",
    stat: 'damageDealt',
    target: 5000,
    reward: { gold: 300 },
    order: 3,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_4',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    name: "What Velka Saw",
    description: "Ember's Flame reveals what Velka saw before she died: four frozen guardians were posted at the site of Torren's death. Hunt them down — all of them.",
    storyText: "The Flame shows you Velka's final memory: four frozen knights guarding a collapsed tunnel, the one where Torren's team was ambushed. Velka tried to send word. She never made it. The guardians still stand their post, preserving whatever truth lies under the ice.",
    npc: 'tnpc-ember',
    npcName: 'Ember the Ashen Priestess (wandering)',
    npcLocation: 'Frozen Wastes — ruined shrine',
    npcQuote: "Four guardians. Four bosses. The Flame will not lie for me — nor will it lie to you.",
    stat: 'bossesKilled',
    target: 4,
    reward: { gold: 400 },
    order: 4,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_5',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    name: "The Name Whisper Sells",
    description: "Return to Whisper at the tavern. She will only name Torren's betrayer if you prove you've grown strong enough to survive what comes next — reach level 15.",
    storyText: "Whisper listens to your report in total silence. Then she lights a candle. 'The courier who leaked Torren's route wasn't working for me,' she whispers. 'She was working for someone who paid in the OLD Syndicate coin. That coin hasn't been minted in twenty years. Which means someone at this bar is older than they look.' She pauses. 'Reach level fifteen. I'll give you the name. Anyone weaker dies carrying it.'",
    npc: 'whisper',
    npcName: 'Whisper',
    npcLocation: 'Dusty Flagon (Tavern) — corner booth',
    npcQuote: "The betrayer used old Syndicate coin. That coin is twenty years dead. Someone at this bar is older than they look.",
    stat: 'levelsGained',
    target: 14,
    reward: { gold: 500, energyDrinks: 2 },
    order: 5,
    regionHint: 'Frozen Wastes',
  },
  {
    id: 'mission_ch2_6',
    chapter: 2,
    chapterName: 'Whispers in the Wastes',
    chapterOutro: "Whisper takes the Cryo Lancet from your hand, rolls back her sleeve, and cuts a thin line on her forearm. The wound does not bleed — it glows. 'Proof I am who I say I am,' she breathes. 'Now listen. The name I have is a LIE, whispered to me twenty years ago. The person who betrayed Torren is one of four: Grog, Mira, Fenwick, or Thorne. I cannot narrow it further. Find out which one. Then decide what to do.'",
    name: "Cryo Lancet Courier",
    description: "Whisper demands a Cryo Lancet from the Glacier Tunnels as the price of her revelation. The lancet is sharp and easy to lose — die on the way back and it shatters in the snow.",
    storyText: "The Cryo Lancet is a weapon that never dulls and never thaws. Whisper wants it for 'a personal project'. You suspect the project is a threat. But she has the name you need.",
    npc: 'whisper',
    npcName: 'Whisper',
    npcLocation: 'Dusty Flagon (Tavern) — corner booth',
    npcQuote: "Bring the lancet. Don't die on the way back. The cold breaks both lancets and couriers.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 400, energyDrinks: 2 },
    order: 6,
    regionHint: 'Frozen Wastes',
    itemRequirements: [{ itemName: 'Cryo Lancet', locationId: 'glacier-tunnels', locationName: 'Glacier Tunnels' }],
  },

  // ================== CHAPTER 3: ASHES OF THE OLD GUARD ==================
  // Whisper's revelation sends you to Fenwick — because the Old Guard
  // kept records on every Syndicate courier from that era. Fenwick, half
  // asleep in his chair, comes alive when he hears what you've uncovered.
  {
    id: 'mission_ch3_1',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    chapterSubtitle: "Old Fenwick's Unfinished Business",
    chapterIntro: "Old Fenwick doesn't look at you when you mention the old Syndicate coin. He looks at the door. 'I wondered,' he rasps, 'when someone would finally come asking about that coin. I carry a list of names from those days, friend. But I'll only read it to someone who has walked where I walked. Come with me to the Scorched Badlands. Let me show you the grave of my best friend.'",
    name: 'Heat Wave',
    description: "Fenwick's old partner Harlen died in the Scorched Badlands thirty years ago. The path to his grave is choked with Lava Slimes. Clear 20 of them — let Fenwick walk it one last time.",
    storyText: "The slimes have multiplied in the heat vents. Fenwick remembers when there were two of them — a curiosity. Now they carpet the stone. He watches you fight, leaning on a cane he didn't used to need, muttering Old Guard battle prayers under his breath.",
    npc: 'fenwick',
    npcName: 'Old Fenwick',
    npcLocation: 'Scorched Badlands — Harlen\'s Trail',
    npcQuote: "Clear the slimes. I used to do this in my sleep. Now I just... watch. Make an old man proud, hmm?",
    stat: 'killed_lava-slime',
    target: 20,
    reward: { gold: 400 },
    order: 1,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_2',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    name: "Marshal's Memory",
    description: "Marshal Greaves remembers the Old Guard's last campaign. Find him wandering the dunes — explore 40 times until you cross his path, and he'll tell you what Fenwick forgot.",
    storyText: "Marshal Greaves, retired war hero, walks the badlands with a warhammer on his shoulder. He was there when the Old Guard fell. He remembers names Fenwick's grief has erased. 'Fenwick never told you about the thirteenth member, did he?' the Marshal asks you. 'Of course he didn't. He was the one who sent the thirteenth into the fire.'",
    npc: 'tnpc-marshal',
    npcName: 'Marshal Greaves (wandering)',
    npcLocation: 'Scorched Badlands — dunes',
    npcQuote: "Fenwick's Old Guard had thirteen, not twelve. The thirteenth was a Syndicate plant. Fenwick knew. Fenwick sent him in anyway.",
    stat: 'explorationsCompleted',
    target: 40,
    reward: { gold: 450 },
    order: 2,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_3',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    name: "Burn Out the Lies",
    description: "Confront Fenwick at the grave. He will not confirm or deny the thirteenth member until you have proven your wrath against the desert — deal 20,000 damage.",
    storyText: "Fenwick sits by Harlen's stone cairn and refuses to meet your eyes. 'If the Marshal told you about the thirteenth, he told you half a story,' he says. 'Burn your way across this desert until your anger matches mine. Then I will tell you the other half.'",
    npc: 'fenwick',
    npcName: 'Old Fenwick',
    npcLocation: "Scorched Badlands — Harlen's Cairn",
    npcQuote: "Anger is a bridge. Build it with twenty thousand sparks. Then walk it back to me.",
    stat: 'damageDealt',
    target: 20000,
    reward: { gold: 500 },
    order: 3,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_4',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    name: "The Thirteenth Member",
    description: "Fenwick confesses: the thirteenth Old Guard was a Syndicate spy named Kav. Kav survived. Kav still walks among you. Hunt 8 bosses — Fenwick believes Kav has possessed one of them as a test of your strength.",
    storyText: "'Kav was young and brilliant,' Fenwick says, voice cracking. 'He laughed at the Old Guard prayer. I thought it was youthful arrogance. It wasn't. He wore our sigil while selling our routes to the Syndicate. When the Leviathan killed eleven of us, I found Kav's body. Only it wasn't his body. It was someone who looked like him.' Fenwick stands. 'Kav is still out there. And I think the name Whisper sold you — the betrayer of Torren — is Kav, wearing another face.'",
    npc: 'fenwick',
    npcName: 'Old Fenwick',
    npcLocation: "Scorched Badlands — Harlen's Cairn",
    npcQuote: "Kav laughed at the Old Guard prayer. Men who laugh at prayers live forever. Bring me eight boss skulls and I'll know which one wears his soul.",
    stat: 'bossesKilled',
    target: 8,
    reward: { gold: 600 },
    order: 4,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_5',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    name: "Forged in Harlen's Ashes",
    description: "Fenwick has been keeping a fragment of Harlen's burned cloak. Carrying it as a talisman, reach level 25 — Harlen's strength will flow into you.",
    storyText: "The cloak fragment smells of old smoke and older loyalty. Fenwick presses it into your hand. 'Harlen was the brother I never had,' he says. 'He fought the Canyon Drake to save me. He lost. Carry this until you are as strong as he was the day he died. Then you will be ready for what comes next.'",
    npc: 'fenwick',
    npcName: 'Old Fenwick',
    npcLocation: "Scorched Badlands — Harlen's Cairn",
    npcQuote: "Harlen died at level twenty-five. He was outnumbered six to one. Match him. Then we talk again.",
    stat: 'levelsGained',
    target: 24,
    reward: { gold: 750, energyDrinks: 3 },
    order: 5,
    regionHint: 'Scorched Badlands',
  },
  {
    id: 'mission_ch3_6',
    chapter: 3,
    chapterName: 'Ashes of the Old Guard',
    chapterOutro: "Fenwick holds the Sandstorm Scythe against his chest and weeps without sound. Then he looks at you with eyes that are suddenly young again. 'Kav wore a merchant's face the last time I saw him alive,' he whispers. 'A merchant. You understand what I'm saying, friend. Go find Mira Goldspark. Find out what she's really selling. And be ready — she is either the traitor, or the next victim.'",
    name: "Sandstorm Scythe — Harlen's Rite",
    description: "The Old Guard funeral rite demands a blade from where the brother fell. Recover a Sandstorm Scythe from Sunscorch Canyon. If you die, the rite is lost and Harlen's ghost walks unquiet.",
    storyText: "The Scythe is the weapon that killed Harlen. Fenwick wants to bury it with him — not as trophy, as closure. A reversal of the old Sunscorch custom. Die on the way back and you bury nothing.",
    npc: 'fenwick',
    npcName: 'Old Fenwick',
    npcLocation: "Scorched Badlands — Harlen's Cairn",
    npcQuote: "The scythe killed him. He would have laughed to see it buried with him. Don't let the desert eat you on the way back.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 600, energyDrinks: 2 },
    order: 6,
    regionHint: 'Scorched Badlands',
    itemRequirements: [{ itemName: 'Sandstorm Scythe', locationId: 'sunscorch-canyon', locationName: 'Sunscorch Canyon' }],
  },

  // Chapter 4: Toxic Marshlands - The Golden Web (Mira Goldspark's arc)
  {
    id: 'mission_ch4_1',
    chapter: 4,
    chapterName: 'The Golden Web',
    chapterSubtitle: "Mira Goldspark's Deception",
    chapterIntro: "Mira Goldspark keeps her ledger locked in a glass case behind the bar — the kind of glass that stops bullets and the kind of lock that stops saints. Everyone in the Neon Mile owes her money, and she owes the truth to nobody. When you tell her Fenwick sent you asking about Kav, her smile doesn't move, but her left hand slides under the counter and stays there. 'That's a name I haven't heard in years,' she says. 'Sit down. Have a drink. Let me tell you about the Toxic Marshlands — because you can't ask my questions without paying my price first.'",
    name: "Mira's Price",
    description: "Mira never gives information for free. She wants a demonstration — thin the fungal zombies rotting in the Hollow. Destroy 25 Fungal Zombies.",
    storyText: "'There's a ledger buried out in the Hollow,' Mira tells you, sliding a map across the bar. 'My ledger. Kav stole it the night he betrayed the Old Guard, and he dumped it in the marsh when the Syndicate cleaners came for him. The fungals grew up around it — ate the leather, ate the ink, ate the men I sent to fetch it. I need you to clear them out before I risk another runner. Understand this: I am not a charity. Every name in that ledger owes me. And one of those names owes Grog Ironflask a dead brother.'",
    npc: 'mira',
    npcName: 'Mira Goldspark',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "Kav thought he could hide a secret in a swamp. But secrets, darling, are like interest. They compound.",
    stat: 'killed_fungal-zombie',
    target: 25,
    reward: { gold: 600 },
    order: 1,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_2',
    chapter: 4,
    chapterName: 'The Golden Web',
    name: 'The Whispering Merchant',
    description: "Sable the Whispering Merchant has been trailing you since you left the Flagon. Walk the marsh paths until she decides to show herself. Complete 60 explorations.",
    storyText: "On the third day in the marshlands, you notice footprints behind yours that shouldn't be there. On the fifth, a lantern that doesn't belong to you. On the seventh, a woman in a moth-grey cloak steps out from behind a rotted tree and says your name before you can draw. 'I am Sable,' she says. 'I buy and sell the things people forget. And Mira Goldspark is lying to you about the ledger. She didn't send runners to fetch it. She sent runners to destroy it. Keep walking — I'll show you why.'",
    npc: 'tnpc-sable',
    npcName: 'Sable, the Whispering Merchant',
    npcLocation: 'Toxic Marshlands (Wandering)',
    npcQuote: "I trade in the truths that other people pay to bury. Yours isn't ready yet. Keep walking, hero — the marsh will teach you what I cannot.",
    stat: 'explorationsCompleted',
    target: 60,
    reward: { gold: 650 },
    order: 2,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_3',
    chapter: 4,
    chapterName: 'The Golden Web',
    name: 'Ledger of Lies',
    description: "Sable leads you to a buried strongbox. Inside — not a ledger. A bomb, primed to erase evidence. Fight your way clear. Deal 50,000 damage.",
    storyText: "The strongbox is half-sunk in a pool of phosphor-green water. Sable kneels beside it and picks the lock with a pin drawn from her hair. Inside: not leather, not paper, but a cylinder of shaped charge wired to a tripwire. 'Mira wanted you to die opening this,' Sable says calmly. 'She knew you'd come. She knew you'd dig. The fungals weren't guarding a ledger — they were guarding her alibi.' The tripwire sings. The marsh comes alive around you. Fight.",
    npc: 'tnpc-sable',
    npcName: 'Sable, the Whispering Merchant',
    npcLocation: 'The Hollow (Toxic Marshlands)',
    npcQuote: "Every merchant keeps two sets of books, hero. The one she sells you, and the one she buries. Mira buried hers in gunpowder.",
    stat: 'damageDealt',
    target: 50000,
    reward: { gold: 750 },
    order: 3,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_4',
    chapter: 4,
    chapterName: 'The Golden Web',
    name: "The Syndicate's Collectors",
    description: "Mira sent more than a bomb. She sent Marsh Sovereigns — Syndicate boss-class enforcers on her payroll. Defeat 12 bosses to break her grip on the swamp.",
    storyText: "Sable fades into the reeds as the first collector rises out of the mire — nine feet of lacquered armour and corroded glaive, a Syndicate sigil etched into its breastplate. Behind it, more. Mira has been feeding the marsh Syndicate gold for years, letting them farm it, letting them hide in it. She let you walk into a factory floor of paid killers and called it a favour. Every boss you drop is a name Mira can no longer call.",
    npc: 'mira',
    npcName: 'Mira Goldspark (absent)',
    npcLocation: 'Toxic Marshlands',
    npcQuote: "'Nothing personal, hero. It's just that some debts are bigger than loyalty.' — Mira's note, found pinned to the first corpse.",
    stat: 'bossesKilled',
    target: 12,
    reward: { gold: 900 },
    order: 4,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_5',
    chapter: 4,
    chapterName: 'The Golden Web',
    name: 'The Choice at the Altar',
    description: "Sable leads you to a ruined altar deep in the marsh. Here, she tells you, is where Kav was killed — and where Mira made her deal with the Void. Grow strong enough to face what comes next. Reach level 35.",
    storyText: "The altar is black stone veined with gold — Mira's gold, poured molten into the cracks to seal something beneath. Sable kneels and runs a finger along the inlay. 'Kav didn't betray the Old Guard,' she says quietly. 'Mira did. Kav found out. She killed him here and paid the Void Overlord's cult in gold to burn the body and blame the dead. Every coin you've seen her count is a piece of Harlen's blood. The question is — do you tell Fenwick? He will put a bullet through her skull before she can speak. Or do you let her live, and use her as bait?' She hands you the choice. The marsh holds its breath.",
    npc: 'tnpc-sable',
    npcName: 'Sable, the Whispering Merchant',
    npcLocation: 'The Gold-Veined Altar',
    npcQuote: "A dead informant is a silent informant. A living traitor is a road — and roads lead to masters.",
    stat: 'levelsGained',
    target: 34,
    reward: { gold: 1000, energyDrinks: 3 },
    order: 5,
    regionHint: 'Toxic Marshlands',
  },
  {
    id: 'mission_ch4_6',
    chapter: 4,
    chapterName: 'The Golden Web',
    name: 'Venomstrike — A Widow-Maker',
    chapterOutro: "You return to the Dusty Flagon with the Venomstrike Blade across your back and the altar's truth burning in your chest. Mira is gone — her glass case shattered, her ledger missing, a single gold coin left spinning on the bar. Grog stares at the coin for a long time. 'She ran,' he says. 'Means she knew you knew.' Fenwick lights a cigarette with hands that won't stop shaking. Then Thorne stands up from the corner booth where he's been drinking alone for three days, and in a voice like rust on iron he says: 'I know where she ran to. The Abyssal Depths. My old ship still sails those waters. And the man who captains it now owes me a death.' He puts his glass down. 'Meet me at the harbour, hero. It's time you met the sea.'",
    description: "Extract a Venomstrike Blade from the Venomous Thicket — the weapon Kav used to kill his last Syndicate handler before Mira silenced him forever. The marsh devours the careless. Die and it's gone.",
    storyText: "Sable presses a rusted key into your palm. 'There's a lockbox buried in the Venomous Thicket,' she tells you. 'Kav stashed the blade there the night before he died. He knew Mira was coming. He wanted someone — anyone — to find it and finish what he started. Consider this your inheritance, hero. The thicket is alive. It knows when you bleed. Do not fall.' The blade is jade-green and weeping poison that never dries. It hums when you lift it, as if it remembers the last hand that held it.",
    npc: 'tnpc-sable',
    npcName: 'Sable, the Whispering Merchant',
    npcLocation: 'Venomous Thicket',
    npcQuote: "Carry it carefully. It was paid for in a good man's life, and it has not been paid in full.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 800, energyDrinks: 2 },
    order: 6,
    regionHint: 'Toxic Marshlands',
    itemRequirements: [{ itemName: 'Venomstrike Blade', locationId: 'venomous-thicket', locationName: 'Venomous Thicket' }],
  },

  // Chapter 5: Abyssal Depths - The Captain's Debt (Thorne Blackwater's arc)
  {
    id: 'mission_ch5_1',
    chapter: 5,
    chapterName: "The Captain's Debt",
    chapterSubtitle: "Thorne Blackwater's Burden",
    chapterIntro: "The harbour at Last Breath stinks of fish-oil and gunsmoke. Thorne Blackwater waits at the end of the longest pier, sea-coat dripping, a bone-handled flintlock balanced across his knees. When you step onto the boards he does not rise. 'I was a Syndicate captain before I was anything else,' he says to the water. 'Before the Dusty Flagon. Before Grog pulled me out of a bottle and told me I could be a man again. I ran cargo between the Void cults and the Neon Mile for six years, hero. And in year four I carried a woman named Mira Goldspark across these waters with a chest full of blood-money and a name in her mouth. That name was Torren Ironflask.' He finally looks up. 'The sea remembers. And the sea wants its captain back.'",
    name: "Into the Black Water",
    description: "Thorne's old first mate commands a pirate fleet in the Depths now — and he's hunting Mira on Thorne's orders. Eliminate 30 Kraken Spawn in the Syndicate's tithing waters.",
    storyText: "'The Kraken Spawn are tithe-beasts,' Thorne explains as the dinghy slides beneath phosphor-lit waves. 'The Syndicate feeds them sailors they want silenced. Kill one and you get nothing. Kill thirty and my old crew will believe you're me — reborn. They'll bring you to the ship. To Captain Ilric.' He hands you a harpoon etched with his old name. 'Ilric was my first mate. I taught him everything I know. Including how to lie to me.'",
    npc: 'thorne',
    npcName: 'Thorne Blackwater',
    npcLocation: 'Dusty Flagon (Tavern)',
    npcQuote: "I buried my captain's coat in the marsh when I swore off the sea. It's going to come out of the ground soon. I can feel it rotting toward me.",
    stat: 'killed_kraken-spawn',
    target: 30,
    reward: { gold: 900 },
    order: 1,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_2',
    chapter: 5,
    chapterName: "The Captain's Debt",
    name: 'The Scrapper of the Deep',
    description: "Vex the Scrapmonger has been diving wrecks in the Depths for decades. He knows where Ilric's ship sails, and he'll tell you — for a price. Complete 100 explorations charting the seabed with him.",
    storyText: "You find Vex hanging upside-down in a rusted dive-bell half-buried in coral, welding a propeller with a torch he claims is powered by lightning. 'WELL WELL WELL!' he shouts through a mouthful of solder. 'A SURFACE-WALKER looking for the Black Ilric! I know where he moors! I know what he's afraid of! I know the code-word he uses when he thinks he's dying!' He drops out of the bell and hands you a rebreather cobbled together from six different helmets. 'But first — you walk the seabed with me. Every wreck down here has a story, and I'm collecting them. You want my knowledge? You help me fill my map.'",
    npc: 'tnpc-vex',
    npcName: 'Vex the Scrapmonger',
    npcLocation: 'Abyssal Depths (Wandering)',
    npcQuote: "Ilric threw a man overboard wearing THIS helmet! I pulled it out of a coral reef! I wear it on Thursdays! ISN'T THAT WONDERFUL?",
    stat: 'explorationsCompleted',
    target: 100,
    reward: { gold: 1000 },
    order: 2,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_3',
    chapter: 5,
    chapterName: "The Captain's Debt",
    name: 'Broadside at Midnight',
    description: "Ilric's ship, the Black Maw, finds you before you find it. Fight through the boarding party. Deal 100,000 damage.",
    storyText: "The fog breaks and there she is — the Black Maw, three-masted and bristling with harpoon-guns, a crew of ninety cutthroats and one ghost at her wheel. Thorne stands beside you, flintlock drawn, his old coat finally back on his shoulders. 'Ilric knows I'm aboard you,' he murmurs. 'He's going to try to kill me first so he doesn't have to look me in the eye while he does it. Don't let him.' Grappling hooks clatter against the hull. The sea roars. You fight.",
    npc: 'thorne',
    npcName: 'Thorne Blackwater',
    npcLocation: 'Open Abyss',
    npcQuote: "Everything I ran from is coming up out of the water, hero. Let it come. I'm not running anymore.",
    stat: 'damageDealt',
    target: 100000,
    reward: { gold: 1200 },
    order: 3,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_4',
    chapter: 5,
    chapterName: "The Captain's Debt",
    name: "Ilric's Admirals",
    description: "The Black Maw sails with an escort of four pirate lords — each one a Syndicate Admiral bought with Mira's gold. Sink their ships and execute their captains. Defeat 20 bosses.",
    storyText: "Admiral Brine — Admiral Chain — Admiral Hollow — Admiral Salt. Thorne names them each as they rise from the lower decks, and each name is a bruise on his face. He trained them all. He drank with them all. 'I loved these men,' he says quietly, reloading his flintlock. 'And they sold their souls for Mira's interest payments. Every kill here is mine to claim. But I need your sword arm.' The deck runs red. The abyss takes each body with a sound like a grateful sigh.",
    npc: 'thorne',
    npcName: 'Thorne Blackwater',
    npcLocation: 'Decks of the Black Maw',
    npcQuote: "I am not taking revenge, hero. I am closing accounts. There is a difference, and I will explain it to you when we are both still breathing.",
    stat: 'bossesKilled',
    target: 20,
    reward: { gold: 1500 },
    order: 4,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_5',
    chapter: 5,
    chapterName: "The Captain's Debt",
    name: "The Name in Ilric's Mouth",
    description: "Thorne fights Ilric alone in the captain's cabin. You hold the deck. Grow strong enough to walk out alive. Reach level 45.",
    storyText: "You hear the shots through the cabin door — two, then a pause, then three more in a rhythm Thorne taught you himself on the Flagon's back porch. When the door opens Thorne is bleeding from a hole in his thigh and Ilric is slumped against the charts with his last breath leaking through a torn lung. 'Ask him,' Thorne rasps to you. 'Ask him who paid for the Void ritual that killed Torren Ironflask. I cannot hear it from my mate's mouth. I cannot.' You kneel. Ilric smiles red teeth at you and whispers a name that stops the world. It is not Mira Goldspark. It is a name you have already heard spoken kindly at the Flagon bar. Remember it. Say nothing yet.",
    npc: 'thorne',
    npcName: 'Thorne Blackwater',
    npcLocation: "Captain's Cabin, the Black Maw",
    npcQuote: "There's a reason I drink alone at the back booth, hero. It's so I can watch the door. Someone in that tavern is the ninth knife. And they have been eating at my table for five years.",
    stat: 'levelsGained',
    target: 44,
    reward: { gold: 2000, energyDrinks: 4 },
    order: 5,
    regionHint: 'Abyssal Depths',
  },
  {
    id: 'mission_ch5_6',
    chapter: 5,
    chapterName: "The Captain's Debt",
    name: "Leviathan Tooth — The Oath Relic",
    chapterOutro: "You bring the Leviathan Tooth back to Last Breath wrapped in Thorne's old coat. Grog takes one look at it, sets it on the bar beside the other four relics — the Scrap Axe, the Cryo Lancet, the Sandstorm Scythe, the Venomstrike Blade — and his hands begin to shake. 'Five of seven,' he says. 'Torren's old kit. The blades the Old Guard carried the night he died. Someone scattered them across the wasteland on purpose. Someone wanted them buried where no hero would ever pull them all free at once.' Fenwick looks up from his corner. Whisper looks up from his journal. Thorne lights a cigarette with his left hand because his right is bandaged to the elbow. And Grog slowly pulls down a map of the Celestial Highlands. 'Two left, hero. The Starblade in the Solar Fields. The Rift Severer in the Paradox Maze. And when you bring them home —' his voice cracks '— we will find out which of us has been lying to us all.'",
    description: "Salvage the Leviathan Tooth from Kraken's Rest — the relic Torren Ironflask was carrying the night he died, stolen by the Void cult and dropped here during the escape. The deep devours all who fall. Die and it returns to the abyss.",
    storyText: "Vex drops you at the lip of Kraken's Rest with a lantern that burns blue and a warning that the creature guarding the Tooth is not a kraken but a memory — a leviathan grown from the grief of every drowned sailor in these waters. 'Weapon won't do you any good unless you believe in what you're taking back,' he shouts over the waves. 'Think about Grog's brother. Think about Harlen. Think about the men Thorne killed tonight to get you here. Then ASK the leviathan for the Tooth. Don't take it. ASK.' The blue lantern sinks beneath the water. You follow it down.",
    npc: 'tnpc-vex',
    npcName: 'Vex the Scrapmonger',
    npcLocation: "Kraken's Rest",
    npcQuote: "The relics aren't weapons, hero! They're PROMISES! And promises don't work if you break them on the way up!",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 1500, energyDrinks: 3 },
    order: 6,
    regionHint: 'Abyssal Depths',
    itemRequirements: [{ itemName: 'Leviathan Tooth', locationId: 'krakens-rest', locationName: "Kraken's Rest" }],
  },

  // Chapter 6: Celestial Highlands - The Betrayer Revealed
  {
    id: 'mission_ch6_1',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    chapterSubtitle: "Whisper's Final Confession",
    chapterIntro: "You return to the Dusty Flagon with the name Ilric gave you burning a hole through your tongue. It is the name of Whisper — the frail, sad-eyed archivist who sits at the corner table with his journal and his tea and has never said an unkind word in five years. You sit across from him without speaking. He closes his book. He pours you a cup. 'I wondered when you would come,' he says softly. 'I have been waiting. I have been waiting for years. Please, before you draw — let me tell you what I did. And let me tell you why. Then you may choose. The Celestial Highlands have the only door to the Void Nexus. We can open it together. Or I can walk up there alone and finish what Torren started — and end what I started.' He smiles, and the smile is the saddest thing you have ever seen.",
    name: "The Knight Who Knelt",
    description: "Whisper's story begins in the Celestial Highlands, where he once served as a Knight before he broke his oath. Kill 35 Celestial Knights — his old order — to prove you can walk where he fled.",
    storyText: "'I was Cherubim of the Ninth House,' Whisper says. 'I carried the Starblade. I guarded the Gate. And when the Void Overlord offered me the life of one man — any man — in exchange for never having to bury my little sister, I agreed. The man I named was Torren Ironflask. I did not know him. I only knew that Grog loved him, and that Grog had once refused me a drink on a night when I needed it. That is how small the seed of my sin was. That is how enormous the tree has grown. My sister died anyway, hero. The Void Overlord lied. And I have been hiding in Grog's corner booth ever since, trying to make his brother's life meaningful in the only way I know how — by watching his brother love the world without him.'",
    npc: 'whisper',
    npcName: 'Whisper (the Cherubim)',
    npcLocation: 'Dusty Flagon (Corner Booth)',
    npcQuote: "I was not the brains of the Old Guard, hero. I was the knife in the back of it. And I have been waiting for you to find me since the day you walked into this tavern.",
    stat: 'killed_celestial-knight',
    target: 35,
    reward: { gold: 1500 },
    order: 1,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_2',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    name: "The Stargazer's Map",
    description: "Zara the Stargazer reads the sky-paths that lead to the Gate. Walk them with her. Complete 150 explorations of the Celestial Highlands.",
    storyText: "Zara waits for you on a floating island shaped like a broken bell. The stars above her do not match the stars above the rest of the wasteland; they spell a word in a language no mortal tongue can pronounce. 'The Void Overlord has a name, hero,' she says without turning around. 'I have known it for nine years. I could not speak it until you arrived. The stars forbade me. They do not forbid me anymore — they demand it. Walk the sky-paths with me. Every island you chart erases a line of the curse the Overlord laid on this realm. When the last line falls, the Gate will be visible to mortal eyes. And then you may choose — save the man who betrayed your friend, or walk through and end the war forever.'",
    npc: 'tnpc-zara',
    npcName: 'Zara the Stargazer',
    npcLocation: 'Celestial Highlands (Wandering)',
    npcQuote: "There is a mercy at the heart of the Void, hero. It is not the Overlord's mercy. It is the mercy of an ending. Be careful what you take from it.",
    stat: 'explorationsCompleted',
    target: 150,
    reward: { gold: 1600 },
    order: 2,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_3',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    name: "The Cherubim's Penance",
    description: "Whisper tries to unmake his oath by turning his old power against its source. Channel his rage through your weapons. Deal 250,000 damage.",
    storyText: "Whisper walks beside you now in a Knight's half-armour he has not worn in a decade. The plate hangs on him like a borrowed coat. 'Every blow I do not strike myself is a penance I must pay forward,' he whispers. 'Strike for me. Strike for Torren. Strike for the sister I could not save. The Void will hear each one and it will know I am coming.' His old colleagues rise from the mist in ranks, faces blank with the authority of heaven. He does not weep. He has run out of tears — years ago, in a corner booth, over a cup of cold tea.",
    npc: 'whisper',
    npcName: 'Whisper (the Cherubim)',
    npcLocation: 'Celestial Highlands',
    npcQuote: "I am not asking you to forgive me, hero. I am asking you to let me be useful one last time. Then you may do as you like with what is left.",
    stat: 'damageDealt',
    target: 250000,
    reward: { gold: 2000 },
    order: 3,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_4',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    name: "The Nine Archons",
    description: "The Void Overlord has bought the loyalty of the Nine Archons of the Celestial High Court. Execute them all. Defeat 30 bosses.",
    storyText: "The Archons were once Whisper's brothers. He names them as they fall: Sister Dawnlight, Brother Stormcrown, the Twin Sisters Ember and Ash, Judge Meridian, Lord Eventide, Mother of Wings, Father of Silver, and finally Archon Primus, whose face is Whisper's face from a decade ago, preserved in a mirror of cosmic ice. Whisper stands before the mirror a long time. Then he raises his old Starblade and shatters it — both the mirror and the blade. 'I am not that man any longer,' he says quietly. 'And this man has a job to finish.' The Gate to the Void Nexus opens at last.",
    npc: 'whisper',
    npcName: 'Whisper (the Cherubim)',
    npcLocation: 'The High Court of the Celestial Highlands',
    npcQuote: "Heaven has been bought, hero. The only clean thing left in this realm is the hand that holds your weapon. Strike true.",
    stat: 'bossesKilled',
    target: 30,
    reward: { gold: 2500 },
    order: 4,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_5',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    name: "The Choice at the Gate",
    description: "Zara tells you the Gate will only open for one who is worthy to close it. Become that one. Reach level 55.",
    storyText: "At the foot of the Gate, Zara takes your hand and presses into your palm a small disc of black glass. 'This is the Stargazer's Mercy,' she says. 'If you give it to Whisper at the threshold, it will let him pass through in your place — and he will not come back. If you keep it, he lives to answer to Grog for what he did. Both choices are right. Neither choice is easy. The stars cannot see past this moment; whatever happens next, you are writing it alone.' Whisper watches you from a respectful distance, his old helm under his arm, his eyes dry and patient. Decide, hero. Decide who lives to see the morning.",
    npc: 'tnpc-zara',
    npcName: 'Zara the Stargazer',
    npcLocation: 'The Celestial Gate',
    npcQuote: "A mercy given to the guilty is a weight placed on the forgiver. A mercy denied is a weight placed on no one. Choose the weight you can carry.",
    stat: 'levelsGained',
    target: 54,
    reward: { gold: 3000, energyDrinks: 5 },
    order: 5,
    regionHint: 'Celestial Highlands',
  },
  {
    id: 'mission_ch6_6',
    chapter: 6,
    chapterName: 'The Betrayer Revealed',
    name: "Starblade — The Cherubim's Legacy",
    chapterOutro: "You return to the Dusty Flagon with the Starblade Saber across your back and Whisper walking one step behind you, or not walking at all — depending on what you chose at the Gate. Grog meets you at the door. He looks at you, and then past you, and whatever he sees in that one glance is the end of five years of corner-booth silence. He pours six drinks: one for himself, one for Fenwick, one for Mira's empty chair, one for Thorne, one for you, and one for Torren. 'Whatever you decided up there,' he says, 'I'll carry it with you. Now — there is one relic left. The Rift Severer. And there is one door left. The Void Nexus. And there is one brother left unavenged.' He raises his glass. 'To the Old Guard. To the Neon Mile. To the end of the war.' The glasses meet. The Flagon holds its breath. Outside, the rain has stopped.",
    description: "Claim the Starblade Saber from the Solar Fields — the same blade Whisper carried the night he made his terrible bargain. He wants it back. Or he wants it buried. Perish and the stars reclaim it.",
    storyText: "The Solar Fields are a plain of molten glass beneath three suns. Whisper cannot follow you here — the suns remember his face and burn it. Zara walks beside you instead, her cloak drawn tight, her feet leaving prints that fill with light. 'The Starblade will not answer to any hand that is not Whisper's,' she warns you. 'You must carry it home for him. And when you put it in his palm, watch his face. If he weeps, he is still worth saving. If he smiles, we will know the Void has already taken him.' You lift the blade out of the molten glass. It is lighter than any weapon you have ever held, and it hums the same old hymn Whisper used to hum over his cold tea.",
    npc: 'tnpc-zara',
    npcName: 'Zara the Stargazer',
    npcLocation: 'Solar Fields',
    npcQuote: "The blade remembers, hero. Whatever Whisper has forgotten, the steel will remind him. Carry it gently.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 2500, energyDrinks: 4 },
    order: 6,
    regionHint: 'Celestial Highlands',
    itemRequirements: [{ itemName: 'Starblade Saber', locationId: 'solar-fields', locationName: 'Solar Fields' }],
  },

  // Chapter 7: Void Nexus - The Ironflask Legacy
  {
    id: 'mission_ch7_1',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    chapterSubtitle: "The Final Stand of the Old Guard",
    chapterIntro: "The Void Nexus is not a place. It is a wound in the world. When you step through the Celestial Gate, you do not walk — you are remembered into it, piece by piece, by a mind that has been waiting for you since Torren Ironflask drew his last breath. Behind you, the Dusty Flagon has closed its doors for the first time in fifty years and boarded up its windows. Inside the Flagon: Grog Ironflask polishing his brother's old mug; Fenwick loading every gun he owns; Thorne bandaging wounds he cannot spare the time to heal; Whisper kneeling at the corner booth in silent prayer; and at the door, Rook the Ironclad — returned at last, visor up, the oath he could never speak finally falling from his lips: 'I was Torren Ironflask's shield. And tonight, I am yours.' They are marching on the Nexus behind you. You have a head start. Use it.",
    name: 'Void Touched',
    description: "The outer Nexus is guarded by Oblivion Knights — mortals the Void Overlord has remade in his image. Destroy 40 of them and clear a path for the Old Guard.",
    storyText: "Rook walks one pace behind you through the ash. His armour is dented in places you do not remember from your first meeting on the road — places that look like grief. 'I was Torren's sworn shield,' he says quietly. 'The oath I could not speak was that I had failed him. I was not at the ritual site when the Void took him. I was three valleys away chasing a lie Whisper had planted for me. I have walked this wasteland for ten years looking for anyone strong enough to finish what Torren started. I found you in an alley with a dead rat and a loaf of bread, and I knew. I knew then. Tonight we finish it. Together.'",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad',
    npcLocation: 'Void Nexus (Outer Ring)',
    npcQuote: "I have carried this shield for ten years waiting to give it to a worthy hand. Take it when I fall, hero. Do not look back.",
    stat: 'killed_oblivion-knight',
    target: 40,
    reward: { gold: 2500 },
    order: 1,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_2',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    name: 'The Breaking of Reality',
    description: "The Nexus has no map. It rewrites itself with every step. Walk it anyway. Complete 250 explorations of the fractured paths.",
    storyText: "You walk for what feels like days. The sky above the Nexus is a mirror — and in the mirror you can see the Dusty Flagon marching through the wasteland behind you. Grog at the head of the column, Torren's old kit on his back. Fenwick to his right. Thorne to his left. Whisper a step behind Grog, hands empty, head bowed. Mira — if she lived — bringing up the rear, bound in ropes Fenwick refuses to loosen. Every mile you walk in the Nexus, they walk two in the real world. Every step echoes. Every step is a promise kept.",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad',
    npcLocation: 'The Fractured Paths',
    npcQuote: "The Nexus wants you to doubt your direction. There is no direction. There is only forward.",
    stat: 'explorationsCompleted',
    target: 250,
    reward: { gold: 3000 },
    order: 2,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_3',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    name: "Oblivion's Edge",
    description: "The Void Overlord has gathered every soul he ever stole and hurled them at you as a single weapon. Break that weapon. Deal 500,000 total damage.",
    storyText: "The hordes come at you in the shape of every face you've ever loved and lost — and every face the Old Guard ever loved and lost. Harlen the unburied. Mira's first husband. Thorne's drowned daughter. Whisper's sister. Fenwick's lost partner. Torren himself, screaming for Grog from inside a mask of black glass. Rook breaks the mask with a single hammer-blow and roars: 'THESE ARE NOT OUR DEAD! THESE ARE HIS LIES! STRIKE THROUGH THEM!' You do. It hurts more than anything you have ever done. It cleanses something that has been rotten for longer than you have been alive.",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad',
    npcLocation: "The Overlord's Approach",
    npcQuote: "The dead do not accuse us, hero. Only the living do. And tonight, the living walk beside you.",
    stat: 'damageDealt',
    target: 500000,
    reward: { gold: 3500 },
    order: 3,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_4',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    name: "The Old Guard Arrives",
    description: "Grog and the others catch up to you at the Nexus Gate — and the Void Overlord sends every boss it has ever made. Defeat 50 bosses in the final charge.",
    storyText: "They come marching out of the ash behind you singing an old sailor's song Thorne started and Grog finished. Fenwick fires twin pistols from the hip; Whisper unsheathes his Starblade for the first time in a decade; Thorne has his bone-handled flintlock and Torren's old coat; Grog carries nothing but his brother's mug and a rage ten years deep. Behind them — everyone you have ever helped. Sable. Vex. Zara. Ember. Marshal Greaves. Even Mira, if you chose mercy, with a crossbow in her cuffed hands and tears on her face. The charge is louder than the world. The Void Overlord's bosses come at you from every direction. And you are not alone. You have never been alone.",
    npc: 'bartender',
    npcName: 'Grog Ironflask',
    npcLocation: 'Void Nexus Gate',
    npcQuote: "MY BROTHER'S NAME WAS TORREN IRONFLASK! SAY IT BEFORE YOU DIE, YOU VOID-EATING BASTARDS! SAY IT SO HE CAN HEAR IT!",
    stat: 'bossesKilled',
    target: 50,
    reward: { gold: 4000 },
    order: 4,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_5',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    name: "The Throne of Unmaking",
    description: "The Void Overlord sits on a throne made of Torren's bones. Be strong enough to tear him off it. Reach level 65.",
    storyText: "The throne room is silent. The Old Guard stops at the threshold — this fight is yours. The Overlord rises. He wears Torren's face, crudely, the way a child wears a borrowed coat. 'I have been waiting,' he says, and his voice is every voice you have ever loved. 'You are the seventh hero to stand where you stand. The other six broke. Show me why you are different.' Behind you, Rook unstraps his shield and presses it into your hand. 'Because you are not alone,' he says quietly. 'That is the only difference that ever mattered.' You step forward. The war ends here.",
    npc: 'tnpc-rook',
    npcName: 'Rook the Ironclad',
    npcLocation: "The Throne of Unmaking",
    npcQuote: "Torren's shield has waited ten years for a worthy arm. Tonight it finds one. Strike, hero. Strike for all of us.",
    stat: 'levelsGained',
    target: 64,
    reward: { gold: 5000, energyDrinks: 7 },
    order: 5,
    regionHint: 'Void Nexus',
  },
  {
    id: 'mission_ch7_6',
    chapter: 7,
    chapterName: 'The Ironflask Legacy',
    name: "Rift Severer — The Last Relic",
    chapterOutro: "The Void Overlord falls to his knees with the Rift Severer through his chest and a look of something almost like relief on Torren's borrowed face. The throne cracks. The Nexus begins to fold in on itself. Rook hauls you to your feet and runs you back through the collapsing halls while Grog, weeping, bends to pick up the Scrap Axe, the Cryo Lancet, the Sandstorm Scythe, the Venomstrike Blade, the Leviathan Tooth, the Starblade Saber, and finally the Rift Severer — his brother's full kit, reunited at last. You return to the Dusty Flagon at dawn. The boards come off the windows. Grog sets seven relics on the back wall above the bar — a shrine. He pours eight drinks: one for every member of the Old Guard who survived, one for Torren, and one for you. 'You are the newest member of the Old Guard, hero,' he says, his voice rough. 'The Dusty Flagon is your home now. The Neon Mile is your beat. And if the Void ever comes crawling back out of its hole —' he raises his glass '— we will be here. Together. Always.' Outside, the sun rises over the wasteland for the first time in ten years without the Void's shadow on it. Inside, an old bartender polishes his dead brother's mug one last time — and then sets it down on the shelf beside the relics, where it belongs. The end of the Ironflask Legacy. The beginning of yours.",
    description: "The Void must be sealed forever. Retrieve the Rift Severer from the Paradox Maze and drive it through the Overlord's heart. Fall here and the blade is lost to the void — and so is everything.",
    storyText: "The Paradox Maze is the last place Torren Ironflask was ever alive. Whisper walks with you as far as the threshold — the one place his old oath gives him power enough to enter. 'I knelt here,' he says quietly. 'I knelt on this stone and I took the Overlord's coin. I will kneel here again tonight. But this time I kneel as your guide, not as his servant.' He points to the shimmering rift at the centre of the maze. The Rift Severer rests inside it — a blade made of folded dimensions and Torren's own silenced scream. 'Take it. Carry it home. End this. And when you come back — come back to the Flagon. Grog has been saving a chair for you at the bar. He has been saving it since the night you walked in with the rats still fresh on your boots.'",
    npc: 'whisper',
    npcName: 'Whisper (the Cherubim, redeemed)',
    npcLocation: 'Paradox Maze',
    npcQuote: "I kneel here one last time, hero. Not to pray. To point. Go. The Old Guard is waiting, and so is your seat at the bar.",
    stat: 'monstersKilled',
    target: 0,
    reward: { gold: 4000, energyDrinks: 5 },
    order: 6,
    regionHint: 'Void Nexus',
    itemRequirements: [{ itemName: 'Rift Severer', locationId: 'paradox-maze', locationName: 'Paradox Maze' }],
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
      { id: 'side_bh_4', name: 'Big Game', description: 'The guild has a special contract. Defeat 2 bosses.', stat: 'bossesKilled', target: 2, reward: { gold: 350, energyDrinks: 1 }, order: 4 },
      { id: 'side_bh_5', name: 'Legendary Bounty', description: 'Only the finest bounty hunters reach this rank. Kill 20 Shadow Dragons.', stat: 'killed_shadow-dragon', target: 20, reward: { gold: 500 }, order: 5 },
      { id: 'side_bh_6', name: 'Death Dealer', description: 'Your reputation precedes you. Deal 15,000 total damage.', stat: 'damageDealt', target: 15000, reward: { gold: 600 }, order: 6 },
      { id: 'side_bh_7', name: 'Apex Hunter', description: 'Become the ultimate predator. Defeat 10 bosses.', stat: 'bossesKilled', target: 10, reward: { gold: 1000, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_ts_4', name: 'Hoarder\'s Delight', description: 'Collect everything you can find. Loot 15 items.', stat: 'itemsLooted', target: 15, reward: { gold: 200, energyDrinks: 1 }, order: 4 },
      { id: 'side_ts_5', name: 'Cartographer\'s Dream', description: 'Leave no stone unturned. Complete 40 explorations.', stat: 'explorationsCompleted', target: 40, reward: { gold: 350 }, order: 5 },
      { id: 'side_ts_6', name: 'Treasure Vault', description: 'Your collection grows legendary. Loot 40 items.', stat: 'itemsLooted', target: 40, reward: { gold: 500 }, order: 6 },
      { id: 'side_ts_7', name: 'World Explorer', description: 'You have seen it all. Complete 100 explorations.', stat: 'explorationsCompleted', target: 100, reward: { gold: 800, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_mp_7', name: 'Merchant Prince', description: 'You rule the markets. Sell 75 items.', stat: 'itemsSold', target: 75, reward: { gold: 1200, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_iw_5', name: 'War Machine', description: 'Win 40 battles to prove your resilience.', stat: 'battlesWon', target: 40, reward: { gold: 350, energyDrinks: 1 }, order: 5 },
      { id: 'side_iw_6', name: 'Alchemist\'s Best Friend', description: 'Use 20 potions to sustain your fight.', stat: 'potionsUsed', target: 20, reward: { gold: 300 }, order: 6 },
      { id: 'side_iw_7', name: 'Immortal', description: 'Absorb 10,000 damage. Nothing can stop you.', stat: 'damageTaken', target: 10000, reward: { gold: 900, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_sm_7', name: 'Transcendent', description: 'Reach level 40 and unlock your true potential.', stat: 'levelsGained', target: 39, reward: { gold: 1000, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_ac_5', name: 'Arena Veteran', description: 'Win 50 battles to earn veteran status.', stat: 'battlesWon', target: 50, reward: { gold: 400, energyDrinks: 2 }, order: 5 },
      { id: 'side_ac_6', name: 'One-Hit Wonder', description: 'Land a devastating 150+ damage single hit.', stat: 'highestDamage', target: 150, reward: { gold: 600 }, order: 6 },
      { id: 'side_ac_7', name: 'Arena Legend', description: 'Win 100 battles. You are the undisputed champion.', stat: 'battlesWon', target: 100, reward: { gold: 1500, energyDrinks: 4 }, order: 7 },
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
      { id: 'side_hp_5', name: 'Potion Addict', description: 'Use 30 potions. You always come prepared.', stat: 'potionsUsed', target: 30, reward: { gold: 400, energyDrinks: 2 }, order: 5 },
      { id: 'side_hp_6', name: 'Miracle Worker', description: 'Heal 5,000 total HP across all your adventures.', stat: 'totalHealing', target: 5000, reward: { gold: 700 }, order: 6 },
      { id: 'side_hp_7', name: 'Undying', description: 'Heal 15,000 total HP. Death cannot claim you.', stat: 'totalHealing', target: 15000, reward: { gold: 1200, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_co_7', name: 'True Completionist', description: 'Deal 75,000 total damage. You have done it all.', stat: 'damageDealt', target: 75000, reward: { gold: 1500, energyDrinks: 4 }, order: 7 },
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
      { id: 'side_fw_7', name: 'Frost Warden', description: 'Master the frozen wastes. Win 60 battles.', stat: 'battlesWon', target: 60, reward: { gold: 900, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_fd_7', name: 'Flame Dancer', description: 'Become one with the fire. Win 80 battles.', stat: 'battlesWon', target: 80, reward: { gold: 1100, energyDrinks: 3 }, order: 7 },
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
      { id: 'side_pb_7', name: 'Poison Brewer', description: 'Master the toxic arts. Heal 8,000 total HP.', stat: 'totalHealing', target: 8000, reward: { gold: 1400, energyDrinks: 4 }, order: 7 },
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
      { id: 'side_ad_7', name: 'Abyssal Diver', description: 'You have conquered the void beneath the waves. Win 120 battles.', stat: 'battlesWon', target: 120, reward: { gold: 1800, energyDrinks: 4 }, order: 7 },
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
      { id: 'side_sc_7', name: 'Star Chaser', description: 'You have touched the stars. Sell 60 items for your celestial collection.', stat: 'itemsSold', target: 60, reward: { gold: 2500, energyDrinks: 5 }, order: 7 },
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
      { id: 'side_vw_7', name: 'Void Walker', description: 'You exist between worlds. Earn 25,000 total gold.', stat: 'goldEarned', target: 25000, reward: { gold: 4000, energyDrinks: 5 }, order: 7 },
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
      { id: 'side_eg_7', name: 'Eternal Legend', description: 'Win 200 battles. You have transcended the grind.', stat: 'battlesWon', target: 200, reward: { gold: 5000, energyDrinks: 7 }, order: 7 },
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
      { id: 'side_sd_4', name: 'Speed Demon', description: 'Finish the rush. Deal 800 total damage.', stat: 'damageDealt', target: 800, reward: { gold: 300, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_gf_4', name: 'Gold Fever', description: 'Sell 5 more items to cash out big.', stat: 'itemsSold', target: 5, reward: { gold: 350, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_ds_4', name: 'Dungeon Sprint Champion', description: 'Finish the sprint. Complete 10 explorations.', stat: 'explorationsCompleted', target: 10, reward: { gold: 300, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_gc_5', name: 'Nuclear Option', description: 'End it with a bang. Deal 2,000 total damage.', stat: 'damageDealt', target: 2000, reward: { gold: 400, energyDrinks: 2 }, order: 5 },
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
      { id: 'side_lg_4', name: 'Loot Goblin Supreme', description: 'Loot 12 items total. Your pockets overflow.', stat: 'itemsLooted', target: 12, reward: { gold: 350, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_pc_4', name: 'Bottomless Stomach', description: 'Heal 800 total HP through sheer consumption.', stat: 'totalHealing', target: 800, reward: { gold: 350, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_cs_4', name: 'Crit Machine', description: 'You can\'t miss. Land 10 critical hits.', stat: 'criticalHits', target: 10, reward: { gold: 400, energyDrinks: 2 }, order: 4 },
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
      { id: 'side_ck_5', name: 'Comeback Kid', description: 'Deal 3,000 damage to prove you\'re unstoppable.', stat: 'damageDealt', target: 3000, reward: { gold: 500, energyDrinks: 2 }, order: 5 },
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
      { id: 'side_br_4', name: 'Boss Rush Complete', description: 'Defeat 4 bosses in your rush.', stat: 'bossesKilled', target: 4, reward: { gold: 750, energyDrinks: 3 }, order: 4 },
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
      { id: 'side_er_5', name: 'Marathon Complete', description: 'Cross the finish line. Complete 15 explorations.', stat: 'explorationsCompleted', target: 15, reward: { gold: 600, energyDrinks: 2 }, order: 5 },
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
      { id: 'side_nb_4', name: 'Neon Blitz', description: 'Own the night. Earn 100 gold.', stat: 'goldEarned', target: 100, reward: { gold: 250, energyDrinks: 1 }, order: 4 },
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
      { id: 'side_scr_4', name: 'Scrap King', description: 'Cash out big. Earn 300 gold total.', stat: 'goldEarned', target: 300, reward: { gold: 400, energyDrinks: 2 }, order: 4 },
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

  // Chain: Courier's Guild - delivery quests across all regions (Lv 1)
  {
    chainId: 'couriers_guild',
    chainName: "Courier's Guild",
    chainDescription: 'Deliver weapons across the world. Die and you lose the package — the guild doesn\'t forgive failure.',
    chainIcon: 'compass',
    levelReq: 1,
    quests: [
      { id: 'side_cg_1', name: 'First Delivery', description: 'Prove yourself to the guild. Deliver a Rusty Shiv from Neon Mile.', stat: 'monstersKilled', target: 0, reward: { gold: 60 }, order: 1, itemRequirements: [{ itemName: 'Rusty Shiv', locationId: 'neon-mile', locationName: 'Neon Mile' }] },
      { id: 'side_cg_2', name: 'Double Package', description: 'Two deliveries at once. Bring a Copper Dagger from Neon Mile and a Rebar Club from Shadow Alley.', stat: 'monstersKilled', target: 0, reward: { gold: 150 }, order: 2, itemRequirements: [{ itemName: 'Copper Dagger', locationId: 'neon-mile', locationName: 'Neon Mile' }, { itemName: 'Rebar Club', locationId: 'shadow-alley', locationName: 'Shadow Alley' }] },
      { id: 'side_cg_3', name: 'Metro Express', description: 'The underpass is dangerous. Retrieve an Iron Shortsword from Metro Underpass.', stat: 'monstersKilled', target: 0, reward: { gold: 250 }, order: 3, itemRequirements: [{ itemName: 'Iron Shortsword', locationId: 'metro-underpass', locationName: 'Metro Underpass' }] },
      { id: 'side_cg_4', name: 'Rooftop Relay', description: 'A high-altitude pickup. Deliver a Carbon Spear from the Skyline Rooftops and Twin Cleavers from the same area.', stat: 'monstersKilled', target: 0, reward: { gold: 400, energyDrinks: 1 }, order: 4, itemRequirements: [{ itemName: 'Carbon Spear', locationId: 'skyline-rooftops', locationName: 'Skyline Rooftops' }, { itemName: 'Twin Cleavers', locationId: 'skyline-rooftops', locationName: 'Skyline Rooftops' }] },
      { id: 'side_cg_5', name: 'Frost Courier', description: 'Brave the cold. Bring a Cryo Lancet from Glacier Tunnels. The ice is unforgiving.', stat: 'monstersKilled', target: 0, reward: { gold: 500, energyDrinks: 2 }, order: 5, itemRequirements: [{ itemName: 'Cryo Lancet', locationId: 'glacier-tunnels', locationName: 'Glacier Tunnels' }] },
      { id: 'side_cg_6', name: 'Desert Express', description: 'Run through the scorching heat. Deliver an Ember Scimitar from Sunscorch Canyon and an Ashfall Glaive from Inferno Pit.', stat: 'monstersKilled', target: 0, reward: { gold: 700, energyDrinks: 2 }, order: 6, itemRequirements: [{ itemName: 'Ember Scimitar', locationId: 'sunscorch-canyon', locationName: 'Sunscorch Canyon' }, { itemName: 'Ashfall Glaive', locationId: 'inferno-pit', locationName: 'Inferno Pit' }] },
      { id: 'side_cg_7', name: 'Guild Master Delivery', description: 'The final test. Deliver a Coral Trident from Coral Labyrinth and a Starblade Saber from Solar Fields. Fail and the guild disowns you.', stat: 'monstersKilled', target: 0, reward: { gold: 1500, energyDrinks: 4 }, order: 7, itemRequirements: [{ itemName: 'Coral Trident', locationId: 'coral-labyrinth', locationName: 'Coral Labyrinth' }, { itemName: 'Starblade Saber', locationId: 'solar-fields', locationName: 'Solar Fields' }] },
    ],
  },

  // Chain: Smuggler's Run - high-risk delivery sprint (Lv 10)
  {
    chainId: 'smugglers_run',
    chainName: "Smuggler's Run",
    chainDescription: 'Smuggle rare weapons through hostile territory. Get caught dead? You lose the goods.',
    chainIcon: 'skull',
    levelReq: 10,
    quests: [
      { id: 'side_sr_1', name: 'Small Time Smuggle', description: 'Start small. Move a Switchblade Special out of Shadow Alley.', stat: 'monstersKilled', target: 0, reward: { gold: 100 }, order: 1, itemRequirements: [{ itemName: 'Switchblade Special', locationId: 'shadow-alley', locationName: 'Shadow Alley' }] },
      { id: 'side_sr_2', name: 'Ironworks Heist', description: 'Grab a Chainbreaker Axe from Ironworks Yard. Security is tight.', stat: 'monstersKilled', target: 0, reward: { gold: 200 }, order: 2, itemRequirements: [{ itemName: 'Chainbreaker Axe', locationId: 'ironworks-yard', locationName: 'Ironworks Yard' }] },
      { id: 'side_sr_3', name: 'Midnight Run', description: 'Steal a Neon Katana from Midnight Terminal under cover of darkness.', stat: 'monstersKilled', target: 0, reward: { gold: 350, energyDrinks: 1 }, order: 3, itemRequirements: [{ itemName: 'Neon Katana', locationId: 'midnight-terminal', locationName: 'Midnight Terminal' }] },
      { id: 'side_sr_4', name: 'Frozen Contraband', description: 'Smuggle a Glacier Fang from Crystal Caverns past the frost patrols.', stat: 'monstersKilled', target: 0, reward: { gold: 500, energyDrinks: 2 }, order: 4, itemRequirements: [{ itemName: 'Glacier Fang', locationId: 'crystal-caverns', locationName: 'Crystal Caverns' }] },
      { id: 'side_sr_5', name: 'Toxic Cargo', description: 'Transport a Swamp Machete from the Venomous Thicket. Don\'t breathe the fumes — and don\'t die.', stat: 'monstersKilled', target: 0, reward: { gold: 700, energyDrinks: 2 }, order: 5, itemRequirements: [{ itemName: 'Swamp Machete', locationId: 'venomous-thicket', locationName: 'Venomous Thicket' }] },
      { id: 'side_sr_6', name: 'Deep Smuggle', description: 'Retrieve a Depth Charge Blade from Sunken Bazaar. The pressure alone can kill you.', stat: 'monstersKilled', target: 0, reward: { gold: 1000, energyDrinks: 3 }, order: 6, itemRequirements: [{ itemName: 'Depth Charge Blade', locationId: 'sunken-bazaar', locationName: 'Sunken Bazaar' }] },
      { id: 'side_sr_7', name: 'Kingpin Delivery', description: 'The big score. Deliver a Rift Severer from Paradox Maze and a Nullpoint Edge from Singularity Well. Die and everything is lost.', stat: 'monstersKilled', target: 0, reward: { gold: 2500, energyDrinks: 5 }, order: 7, itemRequirements: [{ itemName: 'Rift Severer', locationId: 'paradox-maze', locationName: 'Paradox Maze' }, { itemName: 'Nullpoint Edge', locationId: 'singularity-well', locationName: 'Singularity Well' }] },
    ],
  },

  // Chain: Fire Keeper - location-directed fire ritual quests (Lv 3)
  // fireRitual field: { locationId, requiresDefense } — drives discovery & ritual screen behavior
  {
    chainId: 'fire_keeper',
    chainName: 'Fire Keeper',
    chainDescription: 'Seek out abandoned campfires and ancient ritual circles. Light the flame — and when darkness falls, defend it.',
    chainIcon: 'flame',
    levelReq: 3,
    quests: [
      { id: 'side_fk_1', name: 'First Spark', description: 'Find a burned-out campfire in the Neon Mile and light it with fuel.', stat: 'fireRitualLit_neon-mile', target: 1, reward: { gold: 50 }, order: 1, fireRitual: { locationId: 'neon-mile', requiresDefense: false } },
      { id: 'side_fk_2', name: 'Shadow Flames', description: 'Venture into Shadow Alley and light a ritual fire in the darkness.', stat: 'fireRitualLit_shadow-alley', target: 1, reward: { gold: 80, energyDrinks: 1 }, order: 2, fireRitual: { locationId: 'shadow-alley', requiresDefense: false } },
      { id: 'side_fk_3', name: 'Night Watch', description: 'Light a fire in Shadow Alley and defend it through the night. Survive all waves of attackers.', stat: 'fireRitualDefended_shadow-alley', target: 1, reward: { gold: 200, energyDrinks: 1 }, order: 3, fireRitual: { locationId: 'shadow-alley', requiresDefense: true } },
      { id: 'side_fk_4', name: 'Tunnel Torch', description: 'The Metro Underpass is pitch black. Find a ritual circle and bring light to the tunnels.', stat: 'fireRitualLit_metro-underpass', target: 1, reward: { gold: 150 }, order: 4, fireRitual: { locationId: 'metro-underpass', requiresDefense: false } },
      { id: 'side_fk_5', name: 'Underground Siege', description: 'Light a fire deep in the Metro Underpass and hold it against the tunnel creatures.', stat: 'fireRitualDefended_metro-underpass', target: 1, reward: { gold: 300, energyDrinks: 2 }, order: 5, fireRitual: { locationId: 'metro-underpass', requiresDefense: true } },
      { id: 'side_fk_6', name: 'Flame Network', description: 'Return to the Neon Mile and Shadow Alley. Light more fires to create a network of safe havens.', stat: 'fireRitualsLit', target: 6, reward: { gold: 350 }, order: 6 },
      { id: 'side_fk_7', name: 'Eternal Keeper', description: 'Defend 3 ritual fires across any location. You are the Fire Keeper — nothing extinguishes your light.', stat: 'fireRitualsDefended', target: 3, reward: { gold: 600, energyDrinks: 3 }, order: 7 },
    ],
  },

  // Chain: Flame Sentinel - harder location-directed fire defense quests (Lv 14)
  {
    chainId: 'flame_sentinel',
    chainName: 'Flame Sentinel',
    chainDescription: 'The ancient pyres call to those strong enough to guard them. Face brutal waves through the longest nights.',
    chainIcon: 'flame',
    levelReq: 14,
    quests: [
      { id: 'side_fs_1', name: 'Rooftop Beacon', description: 'Climb to the Skyline Rooftops and light a signal pyre. The city needs to see the flame.', stat: 'fireRitualLit_skyline-rooftops', target: 1, reward: { gold: 250 }, order: 1, fireRitual: { locationId: 'skyline-rooftops', requiresDefense: false } },
      { id: 'side_fs_2', name: 'Skyline Siege', description: 'The rooftop gangs attack at night. Defend the signal pyre on Skyline Rooftops.', stat: 'fireRitualDefended_skyline-rooftops', target: 1, reward: { gold: 400, energyDrinks: 1 }, order: 2, fireRitual: { locationId: 'skyline-rooftops', requiresDefense: true } },
      { id: 'side_fs_3', name: 'Iron Forge Ritual', description: 'Find the ancient forge circle in the Ironworks Yard. Light it and defend it from the machines.', stat: 'fireRitualDefended_ironworks-yard', target: 1, reward: { gold: 500, energyDrinks: 2 }, order: 3, fireRitual: { locationId: 'ironworks-yard', requiresDefense: true } },
      { id: 'side_fs_4', name: 'Midnight Vigil', description: 'The darkest location demands the brightest fire. Light and defend at Midnight Terminal.', stat: 'fireRitualDefended_midnight-terminal', target: 1, reward: { gold: 650, energyDrinks: 2 }, order: 4, fireRitual: { locationId: 'midnight-terminal', requiresDefense: true } },
      { id: 'side_fs_5', name: 'Warden\'s Trail', description: 'Retrace your steps. Light fires in the Ironworks Yard and Midnight Terminal.', stat: 'fireRitualsLit', target: 12, reward: { gold: 500 }, order: 5 },
      { id: 'side_fs_6', name: 'Ashen Warlord', description: 'Kill 50 creatures during fire defense across any location. They burn in your light.', stat: 'fireRitualMonstersKilled', target: 50, reward: { gold: 800 }, order: 6 },
      { id: 'side_fs_7', name: 'Flame Sentinel', description: 'Defend 10 ritual fires total. You are the last line between the flame and the void.', stat: 'fireRitualsDefended', target: 10, reward: { gold: 1200, energyDrinks: 4 }, order: 7 },
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
// Pass playerLevel to scale targets & rewards; defaults to 1 for backward compat.
export function getActiveDailyTasks(now = Date.now(), playerLevel = 1) {
  const selected = selectTasks(DAILY_TASKS, DAILY_TASK_COUNT, getDailySeed(now));
  if (playerLevel <= 1) return selected;
  return selected.map(t => scaleTask(t, playerLevel));
}

export function getActiveWeeklyTasks(now = Date.now(), playerLevel = 1) {
  const selected = selectTasks(WEEKLY_TASKS, WEEKLY_TASK_COUNT, getWeeklySeed(now));
  if (playerLevel <= 1) return selected;
  return selected.map(t => scaleTask(t, playerLevel));
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
    // Extended stats
    criticalHits: 0,
    dodgesPerformed: 0,
    timesRested: 0,
    deaths: 0,
    questsClaimed: 0,
    regionsVisited: 0,
    locationsExplored: 0,
    itemsBought: 0,
    skillsUsed: 0,
    universalSkillsUsed: 0,
    comboTriggered: 0,
    totalTurns: 0,
    perfectParries: 0,
    poisonDamageDealt: 0,
    bleedDamageDealt: 0,
    goldFromMonsters: 0,
    goldFromChests: 0,
    goldFromQuests: 0,
    swordsLooted: 0,
    armorsLooted: 0,
    shieldsLooted: 0,
    helmetsLooted: 0,
    ringsLooted: 0,
    potionsLooted: 0,
    bootsLooted: 0,
    glovesLooted: 0,
    capesLooted: 0,
    beltsLooted: 0,
    amuletsLooted: 0,
    accessoriesLooted: 0,
    energyDrinksLooted: 0,
    petsFound: 0,
    petQuestsCompleted: 0,
    // Extended stats for new quest types
    materialsCollected: 0,
    merchantEncounters: 0,
    flawlessVictories: 0,
    winsWithoutDefend: 0,
    winsWithoutPotion: 0,
    bossKilledNoDefend: 0,
    bossKilledNoPotion: 0,
    // Fire ritual stats (global)
    fireRitualsLit: 0,
    fireRitualsDefended: 0,
    fireRitualMonstersKilled: 0,
    wavesSurvived: 0,
    // Fire ritual stats (per-location) - dynamically extended via addStat
  };
}
