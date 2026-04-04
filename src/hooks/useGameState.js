import { useReducer, useCallback, useMemo, useEffect, useRef } from 'react';
import { expForLevel, SKILLS, EXPLORE_TEXTS, CHARACTER_CLASSES, REGIONS, RANDOM_EVENTS, QUEST_VILLAGES, EXTRAORDINARY_TRADERS, UNIVERSAL_SKILLS, LEVEL_MILESTONES, STANCES, getMonsterSkillElement, canClassEquip } from '../data/gameData';
import { getTimePeriod, getWeather, getCombinedEffects } from './useGameClock';
import { getSkillElement, getWeatherSpellBuff } from '../engine/elements';
import { SKILL_TREES, getTreeSkill } from '../data/skillTrees';
import { calcDamage, getClassData, playerHasSkill, getEffectiveManaCost, getPlayerAtk, getPlayerDef, getPlayerDodgeChance, getBattleMaxHp, getBattleMaxMana, getSkillPassiveBonus, rollSpellEcho, getEffectiveDef, getExecuteMultiplier, getCharismaPriceBonus, getHealCost, getPlayerCritChance, getPlayerCritMultiplier, getMonsterCritChance, getMonsterCritMultiplier, getPlayerSpeed, playerGoesFirst, pickMonsterNextMove, PLAYER_CHANNEL_BONUS, PLAYER_CHANNEL_MANA_COST, getPlayerEvasion, getPlayerAccuracy, calcEvasionDodgeChance, getPlayerResistance, calcResistanceReduction, getPlayerTenacity, reduceDurationByTenacity, getPlayerAggression, calcAggressionDmgDealt, calcAggressionDmgTaken, getPlayerLuck, luckCritBonus, luckEnemyCritReduction, luckDodgeBonus, getPlayerFortitude, calcFortitudeSurviveChance, STUN_BASE_CHANCE, CONFUSION_BASE_CHANCE, calcElementalDamageMultiplier, checkComboChains, getStanceModifiers, PARRY_DAMAGE_REDUCTION, PARRY_COUNTER_MULTIPLIER, PERFECT_PARRY_COUNTER_MULTIPLIER, calcMonsterElementalDamage, calcStanceMomentum } from '../engine/combat';
import { applySkillEffect } from '../engine/skillEffects';
import { applyAttackPassives, applySkillPassives, applyLifeTap, tryBladeDance, tryLuckyStrike, applyTurnStartPassives, applyDamageReduction, applyManaShield, checkDodge, applySurvivalPassives, applyCursedBlood } from '../engine/passives';
import { scaleMonster, scaleBoss, scaleRewardByLevel } from '../engine/scaling';
import { rollDrop, rollBossDrop, rollBossMaterials, generateItem, generateRewardItem, rollMaterialDrop, generateCraftedItem, generateCampLoot, generateLocationItem, rollEggDrop, rollTicketDrop, openLootChest } from '../engine/loot';
import { createChestItem, CHEST_LOOKUP, TRADING_CHEST_LOOKUP } from '../data/lootChests';
import { createInitialBase, BUILDINGS, BREWERY_RECIPES, SMELTER_RECIPES, WORKSHOP_RECIPES, BUILDING_MATERIALS, FUEL_ITEMS, getChamberBuffs, getInnExpBonus, getWarehouseBonus, createMaterialItem, createEggItem, createTicketItem, REGION_TICKETS, SPARRING_DUMMIES, EGG_TYPES, getIncubatorSpeedBonus, getIncubatorSlots, getIncubatorFood, INCUBATOR_MAX_FOOD, INCUBATOR_FOOD, createCropFoodItem, rollSeedDrop, FARM_SEEDS, rollCropQuality, createCropItem } from '../data/baseData';
import { createInitialPetState, createPetInstance, PET_CATALOG, PET_MAX_BOND, PET_MAX_ENERGY, PET_MAX_SLOTS, PET_BOND_DECAY_PER_BATTLE, PET_ENERGY_COST_PER_BATTLE, PET_BUILDINGS, getPetBuildingBuffs, willPetFight, calcPetDamage, calcPetAbsorb, calcPetHeal, calcPetBuffs, PET_SNACKS, PET_ENERGY_POTIONS, PET_QUEST_POOL, PET_MAX_ACTIVE_QUESTS, pickQuestsToOffer, addPetXp, PET_MAX_LEVEL } from '../data/petData';
import { TAVERN_QUESTS, TAVERN_SHOP_UNLOCKS, REP_CROSS_EFFECTS, getRepLevel, FACTION_SKILLS, getUnlockedFactionSkills } from '../data/tavernData';
import { saveGame } from '../api';
import { prob } from '../data/probabilityStore';
import { generateArenaOpponent, getMinWager, getHighStakesReward, ARENA_TIERS } from '../engine/arena';
import {
  createInitialStats, createInitialTaskProgress,
  getActiveDailyTasks, getActiveWeeklyTasks, getActiveMonthlyTasks,
  STORY_TASKS, TUTORIAL_QUESTS, STORY_MISSIONS, SIDE_QUEST_CHAINS,
  getCurrentTutorial, isTutorialComplete, getMissionsForChapter, getUnlockedChapter,
  getSideQuestChain, getCurrentSideQuest, isSideChainComplete,
  isQuestLineActive, canActivateQuestLine, getQuestLineKey, MAX_ACTIVE_QUEST_LINES,
  isDailyExpired, isWeeklyExpired, isMonthlyExpired,
  getDailySeed, getWeeklySeed, getMonthlySeed,
  getQuestProgress,
  isCompoundQuestComplete,
} from '../data/tasks';

export const ENERGY_MAX = 100;
export const ENERGY_COST_PER_TRIP = 10;
const ENERGY_COST_PER_STEP = 2;
export const ENERGY_REGEN_PERCENT = 0.1;
export const ENERGY_REGEN_INTERVAL_MS = 15 * 60 * 1000;

// Passive HP/Mana regeneration (out of combat)
export const HP_REGEN_PERCENT = 0.05;     // 5% of max HP per tick
export const MANA_REGEN_PERCENT = 0.08;   // 8% of max Mana per tick
export const HP_MANA_REGEN_INTERVAL_MS = 2 * 60 * 1000; // every 2 minutes

// ---- INITIAL STATE ----
function createInitialPlayer() {
  return {
    name: 'Hero',
    characterClass: null,
    level: 1,
    exp: 0,
    expToLevel: expForLevel(1),
    maxHp: 50,
    hp: 50,
    maxMana: 30,
    mana: 30,
    baseAtk: 5,
    baseDef: 2,
    charisma: 3,
    wisdom: 3,
    athletics: 3,
    speed: 5,
    evasion: 3,
    accuracy: 4,
    resistance: 3,
    tenacity: 3,
    aggression: 3,
    luck: 3,
    fortitude: 3,
    gold: 30,
    equipment: { weapon: null, shield: null, helmet: null, armor: null, gloves: null, boots: null, belt: null, cape: null, amulet: null, accessory: null, accessory2: null },
    inventory: [],
    maxInventory: 30,
    skillTree: [],
    unlockedUniversalSkills: [], // universal combat skills unlocked through level milestones
    comboMaster: false, // combo chains deal +20% bonus
    stanceMaster: false, // stance bonuses increased by 50%
    perfectParryMaster: false, // parry counter deals 1.5x damage
  };
}

// ---- ITEM STACKING ----
// Returns a unique key for stackable items, or null if not stackable.
// Equipment (items with a slot) never stack. Consumables/materials stack by matching properties.
export function getStackKey(item) {
  if (item.slot) return null; // gear doesn't stack
  if (item.type === 'potion') return `potion_${item.name}_${item.rarity}_${item.healAmount}`;
  if (item.type === 'energy-drink') return `energy_${item.name}_${item.rarity}_${item.energyAmount}`;
  if (item.type === 'loot-chest') return `chest_${item.chestId}_${item.rarity}`;
  if (item.type === 'incubator-food') return `food_${item.name}_${item.rarity}_${item.fuelMinutes}`;
  if (item.type === 'material') return `mat_${item.materialId}`;
  if (item.type === 'seed') return `seed_${item.name}_${item.rarity}`;
  if (item.type === 'crop') return `crop_${item.name}_${item.rarity}`;
  if (item.type === 'pet-snack') return `petsnack_${item.name}_${item.rarity}`;
  if (item.type === 'pet-energy') return `petenergy_${item.name}_${item.rarity}`;
  return null;
}

// Try to add an item to inventory, stacking if possible.
// Returns the new inventory array, or null if inventory is full and can't stack.
function addToInventory(inventory, newItem, maxInventory) {
  const stackKey = getStackKey(newItem);
  if (stackKey) {
    const existingIndex = inventory.findIndex(i => getStackKey(i) === stackKey);
    if (existingIndex !== -1) {
      const updated = [...inventory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        stackCount: (updated[existingIndex].stackCount || 1) + (newItem.stackCount || 1),
      };
      return updated;
    }
  }
  if (maxInventory != null && inventory.length >= maxInventory) return null; // full
  return [...inventory, { ...newItem, stackCount: newItem.stackCount || 1 }];
}

// Remove one from a stack (by item id). If stack reaches 0, removes the entry entirely.
function removeOneFromStack(inventory, itemId) {
  const index = inventory.findIndex(i => i.id === itemId);
  if (index === -1) return inventory;
  const item = inventory[index];
  const count = item.stackCount || 1;
  if (count <= 1) {
    return inventory.filter(i => i.id !== itemId);
  }
  const updated = [...inventory];
  updated[index] = { ...item, stackCount: count - 1 };
  return updated;
}

// Check if an item can be added (either by stacking or free slot).
function canAddToInventory(inventory, newItem, maxInventory) {
  const stackKey = getStackKey(newItem);
  if (stackKey && inventory.some(i => getStackKey(i) === stackKey)) return true;
  return inventory.length < maxInventory;
}

function createInitialState() {
  return {
    screen: 'username-entry',
    player: createInitialPlayer(),
    currentRegion: null,
    currentLocation: null,
    battle: null,
    battleLog: [],
    battleResult: null,
    exploreText: '',
    message: null,
    energy: ENERGY_MAX,
    lastEnergyUpdate: Date.now(),
    lastHpManaRegenUpdate: Date.now(),
    pendingBoss: null,
    pendingLevelUps: [],
    stats: createInitialStats(),
    tasks: createInitialTaskProgress(),
    base: createInitialBase(),
    pets: createInitialPetState(),
    discoveredItemLocations: {}, // { itemName: [locationId, ...] }
    villageQuests: {
      discoveredVillages: [], // [villageId, ...]
      acceptedQuests: [],     // [{ questId, villageId, baseline }]
      completedQuests: [],    // [questId, ...]
    },
    tavern: {
      reputation: {},         // { npcId: number }
      acceptedQuests: [],     // [{ questId, npcId, baseline }]
      completedQuests: [],    // [questId, ...]
      learnedFactionSkills: [], // [factionSkillId, ...]
      shopPurchases: {},      // { itemKey: count }
    },
    activeTrader: null,       // current trader encounter
    activeVillage: null,      // current village encounter
    pendingChest: null,       // { itemId, chestId } for chest opening screen
    chestResult: null,        // result of opening a chest (displayed on screen)
    arena: null,              // { tierId, wager, gauntletActive, gauntletWins, gauntletWager }
    previousRegionId: null,   // saved when entering arena so player can return
  };
}

// ---- TAVERN BUFF HELPERS ----

// ---- STAT TRACKING HELPERS ----
function addStat(stats, key, amount = 1) {
  return { ...stats, [key]: (stats[key] || 0) + amount };
}

function setStatMax(stats, key, value) {
  return { ...stats, [key]: Math.max(stats[key] || 0, value) };
}

// Check if any resettable task cycles have expired and reset them
function refreshTaskCycles(tasks) {
  const now = Date.now();
  let t = tasks;
  if (isDailyExpired(t.lastDailySeed, now)) {
    t = { ...t, dailyProgress: {}, dailyClaimed: [], lastDailySeed: getDailySeed(now) };
  }
  if (isWeeklyExpired(t.lastWeeklySeed, now)) {
    t = { ...t, weeklyProgress: {}, weeklyClaimed: [], lastWeeklySeed: getWeeklySeed(now) };
  }
  if (isMonthlyExpired(t.lastMonthlySeed, now)) {
    t = { ...t, monthlyProgress: {}, monthlyClaimed: [], lastMonthlySeed: getMonthlySeed(now) };
  }
  return t;
}

// Increment task progress for matching stat key.
// Uses tasks._playerLevel (set by reducer) to scale daily/weekly task targets.
function incrementTaskProgress(tasks, statKey, amount = 1) {
  const now = Date.now();
  let t = refreshTaskCycles(tasks);
  const lvl = t._playerLevel || 1;

  // Helper to update progress for a task list (supports compound quests)
  const updateProgress = (activeTasks, progress) => {
    const updated = { ...progress };
    for (const task of activeTasks) {
      // Simple quest: single stat/target
      if (task.stat === statKey) {
        updated[task.id] = (updated[task.id] || 0) + amount;
      }
      // Compound quest: check each subquest's stat
      if (task.compound && task.subquests) {
        for (let idx = 0; idx < task.subquests.length; idx++) {
          const sq = task.subquests[idx];
          if (sq.stat === statKey) {
            const key = `${task.id}__${idx}`;
            updated[key] = (updated[key] || 0) + amount;
          }
        }
      }
    }
    return updated;
  };

  return {
    ...t,
    dailyProgress: updateProgress(getActiveDailyTasks(now, lvl), t.dailyProgress),
    weeklyProgress: updateProgress(getActiveWeeklyTasks(now, lvl), t.weeklyProgress),
    monthlyProgress: updateProgress(getActiveMonthlyTasks(now), t.monthlyProgress),
  };
}

// ---- HELPERS ----
const STAT_PICKS_PER_LEVEL = 3;

function processLevelUps(player) {
  const p = { ...player };
  const pendingLevels = [];
  const cls = getClassData(p);
  const growth = cls?.growth;
  while (p.exp >= p.expToLevel) {
    p.exp -= p.expToLevel;
    p.level++;
    p.expToLevel = expForLevel(p.level);
    const offers = {
      hpGain: (growth?.hp ?? 8) + Math.floor(Math.random() * (growth?.hpRand ?? 5)),
      atkGain: (growth?.atk ?? 1) + Math.floor(Math.random() * (growth?.atkRand ?? 2)),
      defGain: (growth?.def ?? 1) + Math.floor(Math.random() * (growth?.defRand ?? 2)),
      manaGain: (growth?.mana ?? 4) + Math.floor(Math.random() * (growth?.manaRand ?? 3)),
      charismaGain: (growth?.charisma ?? 0) + Math.floor(Math.random() * (growth?.charismaRand ?? 1)),
      wisdomGain: (growth?.wisdom ?? 0) + Math.floor(Math.random() * (growth?.wisdomRand ?? 1)),
      athleticsGain: (growth?.athletics ?? 0) + Math.floor(Math.random() * (growth?.athleticsRand ?? 1)),
      speedGain: (growth?.speed ?? 0) + Math.floor(Math.random() * (growth?.speedRand ?? 1)),
      evasionGain: (growth?.evasion ?? 0) + Math.floor(Math.random() * (growth?.evasionRand ?? 1)),
      accuracyGain: (growth?.accuracy ?? 0) + Math.floor(Math.random() * (growth?.accuracyRand ?? 1)),
      resistanceGain: (growth?.resistance ?? 0) + Math.floor(Math.random() * (growth?.resistanceRand ?? 1)),
      tenacityGain: (growth?.tenacity ?? 0) + Math.floor(Math.random() * (growth?.tenacityRand ?? 1)),
      aggressionGain: (growth?.aggression ?? 0) + Math.floor(Math.random() * (growth?.aggressionRand ?? 1)),
      luckGain: (growth?.luck ?? 0) + Math.floor(Math.random() * (growth?.luckRand ?? 1)),
      fortitudeGain: (growth?.fortitude ?? 0) + Math.floor(Math.random() * (growth?.fortitudeRand ?? 1)),
    };
    pendingLevels.push({ level: p.level, offers, picks: STAT_PICKS_PER_LEVEL });

    // Apply level milestones
    const milestone = LEVEL_MILESTONES[p.level];
    if (milestone) {
      if (milestone.reward === 'stat_boost' && milestone.stats) {
        for (const [key, val] of Object.entries(milestone.stats)) {
          p[key] = (p[key] || 0) + val;
        }
      } else if (milestone.reward.startsWith('unlock_')) {
        const skillKey = milestone.reward.replace('unlock_', '');
        if (!p.unlockedUniversalSkills.includes(skillKey)) {
          p.unlockedUniversalSkills = [...p.unlockedUniversalSkills, skillKey];
        }
      } else if (milestone.reward === 'combo_master') {
        p.comboMaster = true;
      } else if (milestone.reward === 'stance_master') {
        p.stanceMaster = true;
      } else if (milestone.reward === 'perfect_parry_master') {
        p.perfectParryMaster = true;
      }
      pendingLevels[pendingLevels.length - 1].milestone = milestone;
    }
  }
  // Restore HP/mana on level up (even before stat choices are made)
  if (pendingLevels.length > 0) {
    p.hp = p.maxHp;
    p.mana = p.maxMana;
  }
  return { player: p, pendingLevels };
}

function applyStatChoices(player, offers, selectedStats) {
  const p = { ...player };
  for (const stat of selectedStats) {
    switch (stat) {
      case 'hp': p.maxHp += offers.hpGain; p.hp = p.maxHp; break;
      case 'atk': p.baseAtk += offers.atkGain; break;
      case 'def': p.baseDef += offers.defGain; break;
      case 'mana': p.maxMana += offers.manaGain; p.mana = p.maxMana; break;
      case 'charisma': p.charisma = (p.charisma || 0) + offers.charismaGain; break;
      case 'wisdom': p.wisdom = (p.wisdom || 0) + offers.wisdomGain; break;
      case 'athletics': p.athletics = (p.athletics || 0) + offers.athleticsGain; break;
      case 'speed': p.speed = (p.speed || 5) + offers.speedGain; break;
      case 'evasion': p.evasion = (p.evasion || 3) + offers.evasionGain; break;
      case 'accuracy': p.accuracy = (p.accuracy || 4) + offers.accuracyGain; break;
      case 'resistance': p.resistance = (p.resistance || 3) + offers.resistanceGain; break;
      case 'tenacity': p.tenacity = (p.tenacity || 3) + offers.tenacityGain; break;
      case 'aggression': p.aggression = (p.aggression || 3) + offers.aggressionGain; break;
      case 'luck': p.luck = (p.luck || 3) + offers.luckGain; break;
      case 'fortitude': p.fortitude = (p.fortitude || 3) + offers.fortitudeGain; break;
    }
  }
  return p;
}

function regenEnergy(currentEnergy, lastEnergyUpdate, now = Date.now()) {
  const sanitizedEnergy = Math.max(0, Math.min(currentEnergy ?? ENERGY_MAX, ENERGY_MAX));
  const last = lastEnergyUpdate ?? now;
  if (sanitizedEnergy >= ENERGY_MAX) {
    return { energy: ENERGY_MAX, lastEnergyUpdate: now };
  }
  const elapsed = Math.max(0, now - last);
  const ticks = Math.floor(elapsed / ENERGY_REGEN_INTERVAL_MS);
  if (ticks <= 0) {
    return { energy: sanitizedEnergy, lastEnergyUpdate: last };
  }
  const gainPerTick = Math.max(1, Math.round(ENERGY_MAX * ENERGY_REGEN_PERCENT));
  const gained = gainPerTick * ticks;
  const nextEnergy = Math.min(ENERGY_MAX, sanitizedEnergy + gained);
  const consumed = ticks * ENERGY_REGEN_INTERVAL_MS;
  if (nextEnergy >= ENERGY_MAX) {
    return { energy: ENERGY_MAX, lastEnergyUpdate: now };
  }
  return { energy: nextEnergy, lastEnergyUpdate: last + consumed };
}

// Passive HP/Mana regen (out of combat, time-based like energy)
function regenHpMana(player, lastHpManaRegenUpdate, now = Date.now()) {
  const last = lastHpManaRegenUpdate ?? now;
  const hpFull = player.hp >= player.maxHp;
  const manaFull = player.mana >= player.maxMana;
  if (hpFull && manaFull) {
    return { player, lastHpManaRegenUpdate: now };
  }
  const elapsed = Math.max(0, now - last);
  const ticks = Math.floor(elapsed / HP_MANA_REGEN_INTERVAL_MS);
  if (ticks <= 0) {
    return { player, lastHpManaRegenUpdate: last };
  }
  const hpGain = Math.max(1, Math.floor(player.maxHp * HP_REGEN_PERCENT)) * ticks;
  const manaGain = Math.max(1, Math.floor(player.maxMana * MANA_REGEN_PERCENT)) * ticks;
  const newHp = Math.min(player.maxHp, player.hp + hpGain);
  const newMana = Math.min(player.maxMana, player.mana + manaGain);
  const consumed = ticks * HP_MANA_REGEN_INTERVAL_MS;
  const updatedPlayer = { ...player, hp: newHp, mana: newMana };
  if (newHp >= player.maxHp && newMana >= player.maxMana) {
    return { player: updatedPlayer, lastHpManaRegenUpdate: now };
  }
  return { player: updatedPlayer, lastHpManaRegenUpdate: last + consumed };
}

// Get the current combined time + weather gameplay effects
function getCurrentEffects() {
  const now = new Date();
  const period = getTimePeriod(now.getHours());
  const weather = getWeather(now);
  return getCombinedEffects(period.id, weather.id);
}

// Get current weather id for weather-specific event filtering
function getCurrentWeatherId() {
  const now = new Date();
  return getWeather(now).id;
}

// Extract the saveable portion of state (no transient battle data)
function extractSaveData(state) {
  let screen = state.screen;
  if (screen === 'battle' || screen === 'battle-result') screen = 'town';
  // Don't save setup screens; they'll see them on load based on player state
  if (screen === 'class-select') screen = 'class-select';
  if (screen === 'username-entry') screen = 'username-entry';
  return {
    player: state.player,
    screen: (state.screen === 'battle' || state.screen === 'battle-result' || state.screen === 'boss-confirm') ? 'town'
      : (state.screen === 'explore' || state.screen === 'random-event' || state.screen === 'event-result' || state.screen === 'quest-village' || state.screen === 'extraordinary-trader') ? 'locations'
      : state.screen,
    pendingLevelUps: state.pendingLevelUps || [],
    energy: state.energy,
    lastEnergyUpdate: state.lastEnergyUpdate,
    lastHpManaRegenUpdate: state.lastHpManaRegenUpdate,
    currentRegionId: state.currentRegion?.id || null,
    stats: state.stats,
    tasks: state.tasks,
    base: state.base,
    pets: state.pets,
    discoveredItemLocations: state.discoveredItemLocations,
    villageQuests: state.villageQuests,
    tavern: state.tavern,
    previousRegionId: state.previousRegionId || null,
  };
}

// ---- PET BATTLE HELPERS ----
function createBattleState(monster, player) {
  const pSpeed = player ? getPlayerSpeed(player) : 5;
  const mSpeed = monster.speed || 5;
  const isPlayerFirst = playerGoesFirst(pSpeed, mSpeed);
  const nextMove = isPlayerFirst ? pickMonsterNextMove(monster, null) : null;
  return {
    monster, isPlayerTurn: true, defending: false,
    poisonTurns: 0, atkDebuff: 0, defDebuff: 0, animating: false,
    monsterPoisonTurns: 0, monsterDoomTurns: 0,
    undyingWillUsed: false, deathsEmbraceUsed: false,
    defendedLastTurn: false, dodgeNextTurn: false, dodgeCharges: 0,
    showSkillMenu: false, showInspect: false, spellweaverActive: false,
    avatarTurns: 0, armorBreakTurns: 0, cursedBloodPoison: 0,
    petActions: [], // log of pet actions this turn
    petReviveUsed: false, // track phoenix revive
    // Speed system
    playerSpeed: pSpeed,
    monsterSpeed: mSpeed,
    playerIsFaster: isPlayerFirst,
    monsterNextMove: nextMove, // shown when player is faster
    // Channel system
    monsterChanneling: false,
    monsterChannelTurns: 0,
    monsterChannelSkillId: null,
    playerChanneling: false, // player channel state
    playerChannelBonusActive: false, // bonus active for next attack
    // Boss gimmick state
    gimmick: monster.gimmick || null,
    gimmickActive: false,
    gimmickData: {}, // dynamic gimmick state (counters, timers, etc.)
    turnCount: 0,
    // Speed debuff (from boss gimmicks)
    speedDebuffPct: 0,
    // Gimmick-specific flags
    playerFrozen: false, // skip player turn
    playerMissChance: 0, // extra miss chance from gimmicks
    monsterInvulnerable: false, // cannot take damage
    monsterDmgReduction: 0, // % damage reduction
    monsterReflectPct: 0, // reflect damage back
    noDefend: false, // cannot use defend action
    noRun: false, // cannot run
    healReduction: 0, // reduce healing effectiveness
    // Stun / confusion state
    playerStunTurns: 0, // player skips turns when > 0
    monsterStunTurns: 0, // monster skips turns when > 0
    playerConfusionTurns: 0, // player does random action when > 0
    monsterConfusionTurns: 0, // monster does random action when > 0
    // Fortitude (grit) - survive lethal once
    fortitudeUsed: false,
    monsterFortitudeUsed: false,
    // Stance system
    stance: 'balanced', // current stance: balanced, aggressive, defensive
    // Combo chain system
    actionHistory: [], // track recent player actions for combo detection
    activeCombo: null, // currently active combo bonus
    comboBleedTurns: 0, // bleed effect from relentless combo
    comboBleedPct: 0,
    // Parry system
    parrying: false, // player is parrying this turn
    // Elemental system
    monsterElement: monster.element || 'physical',
    // War Shout buff
    warShoutTurns: 0,
    warShoutAtkDebuff: 0,
    warShoutDefBuff: 0,
    // Stance momentum
    stanceMomentum: 0,
    lastStance: 'balanced',
    // Combo streak
    comboStreak: 0,
    // Universal skill cooldowns { skillId: turnsRemaining }
    universalCooldowns: {},
    // Elemental ward (from universal skill)
    elementalWardTurns: 0,
    // Last Stand used flag
    lastStandUsed: false,
    // Limit Break used flag
    limitBreakUsed: false,
    // Armor Shatter debuff on monster
    armorShatterTurns: 0,
    armorShatterPct: 0,
    // Frenzy combo buff
    frenzyBonusTurns: 0,
    frenzyBonusPct: 0,
    // Invulnerability from perfect parry combo
    playerInvulnTurns: 0,
    // Quest tracking: full-battle action flags
    usedDefend: false,
    usedPotion: false,
    damageTakenInBattle: 0,
  };
}

function getActiveBattlePets(state) {
  const equippedIds = state.pets?.equippedPets || [];
  const ownedPets = state.pets?.ownedPets || [];
  return equippedIds.map(id => ownedPets.find(p => p.instanceId === id)).filter(Boolean);
}

function processPetTurnActions(state, log) {
  const activePets = getActiveBattlePets(state);
  if (activePets.length === 0) return { state, log };

  const buffs = getPetBuildingBuffs(state.pets);
  let p = { ...state.player };
  let m = { ...state.battle.monster };
  let b = { ...state.battle };
  let newLog = [...log];
  let petsThatFought = [];

  for (const pet of activePets) {
    const fightCheck = willPetFight(pet);
    if (!fightCheck.fights) {
      newLog.push({ text: `${pet.name} refuses to fight! (${fightCheck.reason})`, type: 'info' });
      continue;
    }

    petsThatFought.push(pet.instanceId);

    switch (pet.ability?.type) {
      case 'damage': {
        const dmg = calcPetDamage(pet, m.def, buffs);
        m.hp = Math.max(0, m.hp - dmg);
        newLog.push({ text: `${pet.name} uses ${pet.ability.name} for ${dmg} damage!`, type: 'dmg-monster' });
        break;
      }
      case 'hybrid': {
        const dmg = calcPetDamage(pet, m.def, buffs);
        m.hp = Math.max(0, m.hp - dmg);
        newLog.push({ text: `${pet.name} uses ${pet.ability.name} for ${dmg} damage!`, type: 'dmg-monster' });
        // buff fallthrough handled by combat.js pet buff check
        break;
      }
      case 'heal': {
        const { heal, manaRestore } = calcPetHeal(pet, p.maxHp, buffs);
        if (heal > 0) {
          const healed = Math.min(heal, p.maxHp - p.hp);
          p.hp = Math.min(p.maxHp, p.hp + heal);
          if (healed > 0) newLog.push({ text: `${pet.name} heals you for ${healed} HP!`, type: 'heal' });
        }
        if (manaRestore > 0) {
          const maxMana = getBattleMaxMana(p);
          const restored = Math.min(manaRestore, maxMana - p.mana);
          p.mana = Math.min(maxMana, p.mana + manaRestore);
          if (restored > 0) newLog.push({ text: `${pet.name} restores ${restored} mana!`, type: 'info' });
        }
        break;
      }
      case 'buff': {
        const petBuffs = calcPetBuffs(pet, buffs);
        if (petBuffs.manaRegen > 0) {
          const maxMana = getBattleMaxMana(p);
          p.mana = Math.min(maxMana, p.mana + petBuffs.manaRegen);
        }
        newLog.push({ text: `${pet.name} uses ${pet.ability.name}!`, type: 'info' });
        break;
      }
      case 'defend': {
        // Defend happens during monster turn, just log presence
        newLog.push({ text: `${pet.name} stands guard.`, type: 'info' });
        break;
      }
    }
  }

  b.monster = m;

  // Deduct bond and energy from pets that fought
  const bondDecayMult = 1 - (buffs.bondDecayReduction || 0);
  const energyDecayMult = 1 - (buffs.energyDecayReduction || 0);
  const updatedPets = state.pets.ownedPets.map(pet => {
    if (petsThatFought.includes(pet.instanceId)) {
      return {
        ...pet,
        bond: Math.max(0, pet.bond - Math.ceil(PET_BOND_DECAY_PER_BATTLE * bondDecayMult)),
        energy: Math.max(0, pet.energy - Math.ceil(PET_ENERGY_COST_PER_BATTLE * energyDecayMult)),
      };
    }
    return pet;
  });

  return {
    state: {
      ...state,
      player: p,
      battle: b,
      pets: { ...state.pets, ownedPets: updatedPets },
    },
    log: newLog,
  };
}

function applyPetDefense(state, incomingDmg) {
  const activePets = getActiveBattlePets(state);
  const buffs = getPetBuildingBuffs(state.pets);
  let totalAbsorbed = 0;
  let totalReflected = 0;

  for (const pet of activePets) {
    if (pet.ability?.type === 'defend' && pet.energy > 0) {
      const fightCheck = willPetFight(pet);
      if (!fightCheck.fights) continue;
      const { absorbed, reflected } = calcPetAbsorb(pet, incomingDmg, buffs);
      totalAbsorbed += absorbed;
      totalReflected += reflected;
    }
  }
  return { absorbed: totalAbsorbed, reflected: totalReflected };
}

function getPetAtkBuff(state) {
  const activePets = getActiveBattlePets(state);
  const buffs = getPetBuildingBuffs(state.pets);
  let totalAtkBuff = 0;
  let totalDefBuff = 0;
  for (const pet of activePets) {
    if (pet.energy > 0 && (pet.ability?.type === 'buff' || pet.ability?.type === 'hybrid')) {
      const petBuffs = calcPetBuffs(pet, buffs);
      totalAtkBuff += petBuffs.atkBuff;
      totalDefBuff += petBuffs.defBuff;
    }
  }
  return { atkBuff: totalAtkBuff, defBuff: totalDefBuff };
}

// ---- PET QUEST HELPERS ----
function progressPetQuests(pets, questType, amount = 1, regionId = null) {
  // Progress quests of matching type on all equipped pets
  const equippedIds = new Set(pets.equippedPets || []);
  if (equippedIds.size === 0) return pets;

  let changed = false;
  const updatedPets = pets.ownedPets.map(pet => {
    if (!equippedIds.has(pet.instanceId)) return pet;
    const quests = pet.activeQuests || [];
    if (quests.length === 0) return pet;

    let questChanged = false;
    const updatedQuests = quests.map(q => {
      if (q.type !== questType) return q;
      // If quest requires a specific region, check it
      if (q.region && q.region !== regionId) return q;
      if (q.progress >= q.target) return q; // already complete
      questChanged = true;
      return { ...q, progress: Math.min(q.target, q.progress + amount) };
    });

    if (!questChanged) return pet;
    changed = true;
    return { ...pet, activeQuests: updatedQuests };
  });

  if (!changed) return pets;
  return { ...pets, ownedPets: updatedPets };
}

function progressSinglePetQuest(pets, petInstanceId, questType, amount = 1) {
  // Progress quests on a specific pet (for feed/give actions)
  const updatedPets = pets.ownedPets.map(pet => {
    if (pet.instanceId !== petInstanceId) return pet;
    const quests = pet.activeQuests || [];
    if (quests.length === 0) return pet;

    const updatedQuests = quests.map(q => {
      if (q.type !== questType) return q;
      if (q.progress >= q.target) return q;
      return { ...q, progress: Math.min(q.target, q.progress + amount) };
    });

    return { ...pet, activeQuests: updatedQuests };
  });

  return { ...pets, ownedPets: updatedPets };
}

// ---- REDUCER ----
function gameReducer(state, action) {
  // Sync player level into tasks so incrementTaskProgress can scale daily/weekly targets
  if (state.player && state.tasks && state.tasks._playerLevel !== state.player.level) {
    state = { ...state, tasks: { ...state.tasks, _playerLevel: state.player.level } };
  }
  switch (action.type) {
    case 'LOAD_SAVE': {
      const { player, screen, energy, lastEnergyUpdate, lastHpManaRegenUpdate, currentRegionId, stats, tasks, base: savedBase, pendingLevelUps: savedPending, discoveredItemLocations: savedDiscovered, pets: savedPets, villageQuests: savedVillageQuests, tavern: savedTavern, previousRegionId: savedPreviousRegionId } = action.saveData || {};
      const baseState = createInitialState();
      const regen = regenEnergy(
        energy ?? baseState.energy,
        lastEnergyUpdate ?? baseState.lastEnergyUpdate,
      );
      let mergedPlayer = { ...baseState.player, ...player };
      // Apply passive HP/Mana regen accumulated while offline
      const hpManaRegen = regenHpMana(mergedPlayer, lastHpManaRegenUpdate ?? baseState.lastHpManaRegenUpdate);
      mergedPlayer = hpManaRegen.player;
      // Migrate maxInventory: ensure existing saves get the new base of 30
      // Calculate what maxInventory should be: base (30) + warehouse bonus if any
      const warehouseLvl = savedBase?.warehouseLevel || 0;
      const warehouseBonus = warehouseLvl > 0 ? (BUILDINGS.warehouse?.upgrades?.[warehouseLvl - 1]?.inventoryBonus || 0) : 0;
      const expectedMinInventory = baseState.player.maxInventory + warehouseBonus;
      if (mergedPlayer.maxInventory < expectedMinInventory) {
        mergedPlayer.maxInventory = expectedMinInventory;
      }
      // Migrate equipment: ensure new slots exist for old saves
      if (mergedPlayer.equipment) {
        mergedPlayer.equipment = { ...baseState.player.equipment, ...mergedPlayer.equipment };
      }
      // If the player has no custom name, send them to username entry
      // If they have a name but no class, send them to class select
      let resolvedScreen = screen || 'town';
      if (!mergedPlayer.characterClass) resolvedScreen = 'class-select';
      if (mergedPlayer.name === 'Hero') resolvedScreen = 'username-entry';
      const savedRegion = currentRegionId ? REGIONS.find(r => r.id === currentRegionId) : null;
      // If saved on locations/regions screen but region is missing, fall back to town
      if ((resolvedScreen === 'locations' || resolvedScreen === 'explore') && !savedRegion) {
        resolvedScreen = 'town';
      }
      const mergedStats = { ...createInitialStats(), ...stats };
      const mergedTasks = refreshTaskCycles({ ...createInitialTaskProgress(), ...tasks });
      const mergedBase = { ...createInitialBase(), ...savedBase };
      const mergedPets = { ...createInitialPetState(), ...savedPets };
      const mergedPending = savedPending || [];
      // If there are pending level-ups, redirect to stat selection
      if (mergedPending.length > 0 && resolvedScreen !== 'class-select' && resolvedScreen !== 'username-entry') {
        resolvedScreen = 'stat-select';
      }
      return {
        ...baseState,
        screen: resolvedScreen,
        player: mergedPlayer,
        energy: regen.energy,
        lastEnergyUpdate: regen.lastEnergyUpdate,
        lastHpManaRegenUpdate: hpManaRegen.lastHpManaRegenUpdate,
        currentRegion: savedRegion,
        stats: mergedStats,
        tasks: mergedTasks,
        base: mergedBase,
        pets: mergedPets,
        pendingLevelUps: mergedPending,
        discoveredItemLocations: savedDiscovered || {},
        villageQuests: { ...baseState.villageQuests, ...savedVillageQuests },
        tavern: { ...baseState.tavern, ...savedTavern },
        previousRegionId: savedPreviousRegionId || null,
      };
    }

    case 'START_GAME':
      return createInitialState();

    case 'SET_USERNAME': {
      const name = action.name;
      if (!name || name.length < 2) return state;
      return {
        ...state,
        screen: 'class-select',
        player: { ...state.player, name },
      };
    }

    case 'SELECT_CLASS': {
      const cls = CHARACTER_CLASSES[action.classId];
      if (!cls) return state;
      const p = {
        ...state.player,
        characterClass: cls.id,
        maxHp: cls.baseStats.maxHp,
        hp: cls.baseStats.maxHp,
        maxMana: cls.baseStats.maxMana,
        mana: cls.baseStats.maxMana,
        baseAtk: cls.baseStats.baseAtk,
        baseDef: cls.baseStats.baseDef,
        charisma: cls.baseStats.charisma,
        wisdom: cls.baseStats.wisdom,
        athletics: cls.baseStats.athletics,
        speed: cls.baseStats.speed || 5,
        evasion: cls.baseStats.evasion || 3,
        accuracy: cls.baseStats.accuracy || 4,
        resistance: cls.baseStats.resistance || 3,
        tenacity: cls.baseStats.tenacity || 3,
        aggression: cls.baseStats.aggression || 3,
        luck: cls.baseStats.luck || 3,
        fortitude: cls.baseStats.fortitude || 3,
      };
      return { ...state, screen: 'town', player: p };
    }

    case 'GO_TO_TOWN':
      return { ...state, screen: 'town', currentLocation: null, battle: null, battleResult: null, battleLog: [], pendingBoss: null };

    case 'SHOW_SCREEN':
      return { ...state, screen: action.screen };

    case 'SELECT_REGION': {
      const region = action.region;
      if (!region) return state;
      // Already in this region — just show locations, no cost
      if (state.currentRegion?.id === region.id) {
        return { ...state, screen: 'locations' };
      }
      // Arena is always free to travel to; save previous region so player can return
      if (region.isArena) {
        return {
          ...state,
          screen: 'locations',
          currentRegion: region,
          previousRegionId: state.currentRegion?.id || null,
        };
      }
      // Neon District (starter region) is always free
      // First region selection (new player, no current region) goes to Neon District free
      const isStarter = region.id === 'neon-district';
      const isFirstTravel = !state.currentRegion;
      const needsTicket = !isStarter && !isFirstTravel ? !!REGION_TICKETS[region.id] : (!isStarter && isFirstTravel);
      if (needsTicket) {
        const ticketIdx = state.player.inventory.findIndex(i => i.type === 'ticket' && i.ticketRegionId === region.id);
        if (ticketIdx === -1) {
          const ticketName = REGION_TICKETS[region.id]?.name || 'a ticket';
          return { ...state, message: `You need a ${ticketName} to travel there! Find one exploring or craft it in the Workshop.` };
        }
        // Consume the ticket
        const newInventory = [...state.player.inventory];
        newInventory.splice(ticketIdx, 1);
        let regionStats = state.stats;
        regionStats = addStat(regionStats, 'regionsVisited');
        return {
          ...state,
          screen: 'locations',
          currentRegion: region,
          previousRegionId: null,
          stats: regionStats,
          player: { ...state.player, inventory: newInventory },
        };
      }
      let regionStats = state.stats;
      regionStats = addStat(regionStats, 'regionsVisited');
      return {
        ...state,
        screen: 'locations',
        currentRegion: region,
        previousRegionId: null,
        stats: regionStats,
      };
    }

    case 'BACK_TO_REGIONS':
      return { ...state, screen: 'regions' };

    case 'LEAVE_LOCATION':
      return { ...state, screen: 'locations', currentLocation: null, battle: null, battleResult: null, battleLog: [], pendingBoss: null };

    case 'ENTER_LOCATION': {
      const now = Date.now();
      const { energy, lastEnergyUpdate } = regenEnergy(state.energy, state.lastEnergyUpdate, now);
      if (energy < ENERGY_COST_PER_TRIP) {
        return {
          ...state,
          energy,
          lastEnergyUpdate,
          message: 'Too exhausted to travel. Wait for energy to recover.',
        };
      }
      return {
        ...state,
        screen: 'explore',
        currentLocation: action.location,
        exploreText: 'You enter ' + action.location.name + '...',
        exploreFoundItem: null,
        energy: energy - ENERGY_COST_PER_TRIP,
        lastEnergyUpdate,
        stats: addStat(state.stats, 'locationsExplored'),
      };
    }

    case 'EXPLORE_STEP': {
      const loc = state.currentLocation;
      if (!loc) return state;

      // Drain energy each time the player continues exploring
      const nowExplore = Date.now();
      const exploreRegen = regenEnergy(state.energy, state.lastEnergyUpdate, nowExplore);
      if (exploreRegen.energy < ENERGY_COST_PER_STEP) {
        return {
          ...state,
          energy: exploreRegen.energy,
          lastEnergyUpdate: exploreRegen.lastEnergyUpdate,
          screen: 'locations',
          currentLocation: null,
          message: 'Too exhausted to continue. Wait for energy to recover.',
        };
      }
      const exploreEnergy = exploreRegen.energy - ENERGY_COST_PER_STEP;
      const exploreLastUpdate = exploreRegen.lastEnergyUpdate;

      const texts = EXPLORE_TEXTS[loc.bgKey] || EXPLORE_TEXTS.street;
      const text = texts[Math.floor(Math.random() * texts.length)];

      // Progress pet explore quests
      const exploreRegionId = state.currentRegion?.id || null;
      const petsAfterExplore = progressPetQuests(state.pets || createInitialPetState(), 'explore', 1, exploreRegionId);

      // Boss encounter check
      if (loc.boss && Math.random() < (loc.bossRate || prob('explore.bossRate'))) {
        // Special locations scale bosses with random level offset
        let bossLevel = loc.levelReq;
        if (loc.special && loc.levelRange) {
          const [minOff, maxOff] = loc.levelRange;
          bossLevel = Math.max(1, loc.levelReq + Math.floor((minOff + maxOff) / 2) + Math.floor(Math.random() * Math.ceil((maxOff - minOff) / 2)));
        }
        const boss = scaleBoss(loc.boss, bossLevel);
        if (boss) {
          return {
            ...state, screen: 'boss-confirm',
            exploreText: text,
            pendingBoss: boss,
            energy: exploreEnergy,
            lastEnergyUpdate: exploreLastUpdate,
            pets: petsAfterExplore,
          };
        }
      }

      // Event boss encounter check (slightly higher rate than normal bosses)
      if (loc.eventBoss && Math.random() < (loc.eventBossRate || 0.008)) {
        let eventBossLevel = loc.levelReq;
        if (loc.special && loc.levelRange) {
          const [minOff, maxOff] = loc.levelRange;
          eventBossLevel = Math.max(1, loc.levelReq + Math.floor((minOff + maxOff) / 2) + Math.floor(Math.random() * Math.ceil((maxOff - minOff) / 2)));
        }
        const eventBoss = scaleBoss(loc.eventBoss, eventBossLevel);
        if (eventBoss) {
          return {
            ...state, screen: 'boss-confirm',
            exploreText: text,
            pendingBoss: eventBoss,
            energy: exploreEnergy,
            lastEnergyUpdate: exploreLastUpdate,
            pets: petsAfterExplore,
          };
        }
      }

      // Random event check (5% base chance, modified by time/weather)
      const effects = getCurrentEffects();
      const weatherId = getCurrentWeatherId();
      const eventChance = prob('explore.randomEventChance') * effects.eventChanceMult;
      if (Math.random() < eventChance) {
        // Filter events: include universal events + weather-matching events
        const eligibleEvents = RANDOM_EVENTS.filter(e => !e.weather || e.weather === weatherId);
        const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
        return {
          ...state, screen: 'random-event',
          exploreText: text,
          energy: exploreEnergy,
          lastEnergyUpdate: exploreLastUpdate,
          randomEvent: event,
          pets: petsAfterExplore,
        };
      }

      // Quest village discovery check (~1% chance, only in regions with villages)
      const regionId = state.currentRegion?.id;
      const regionVillages = regionId ? (QUEST_VILLAGES[regionId] || []) : [];
      if (regionVillages.length > 0 && Math.random() < 0.01) {
        const village = regionVillages[Math.floor(Math.random() * regionVillages.length)];
        const isNewDiscovery = !(state.villageQuests.discoveredVillages || []).includes(village.id);
        const newDiscovered = isNewDiscovery
          ? [...(state.villageQuests.discoveredVillages || []), village.id]
          : state.villageQuests.discoveredVillages || [];
        return {
          ...state, screen: 'quest-village',
          exploreText: text,
          energy: exploreEnergy,
          lastEnergyUpdate: exploreLastUpdate,
          pets: petsAfterExplore,
          activeVillage: village,
          villageQuests: { ...state.villageQuests, discoveredVillages: newDiscovered },
        };
      }

      // Extraordinary trader encounter check (~1.5% chance)
      if (Math.random() < 0.015) {
        const trader = EXTRAORDINARY_TRADERS[Math.floor(Math.random() * EXTRAORDINARY_TRADERS.length)];
        // Track merchant encounter for quests
        const traderStats = addStat(state.stats, 'merchantEncounters');
        let traderTasks = incrementTaskProgress(state.tasks, 'merchantEncounters');
        return {
          ...state, screen: 'extraordinary-trader',
          exploreText: text,
          energy: exploreEnergy,
          lastEnergyUpdate: exploreLastUpdate,
          pets: petsAfterExplore,
          activeTrader: trader,
          stats: traderStats,
          tasks: traderTasks,
        };
      }

      const adjustedEncounterRate = loc.encounterRate * effects.encounterMult;
      if (Math.random() < adjustedEncounterRate) {
        const monsterId = loc.monsters[Math.floor(Math.random() * loc.monsters.length)];
        // Special locations have random-level encounters within their levelRange
        let encounterLevel = loc.levelReq;
        if (loc.special && loc.levelRange) {
          const [minOffset, maxOffset] = loc.levelRange;
          encounterLevel = Math.max(1, loc.levelReq + minOffset + Math.floor(Math.random() * (maxOffset - minOffset + 1)));
        }
        const monster = scaleMonster(monsterId, encounterLevel);
        const levelInfo = loc.special ? ` (Lv.${encounterLevel})` : '';
        const encBattle = createBattleState(monster, state.player);
        const encLog = [{ text: `A ${monster.name}${levelInfo} appears!`, type: 'info' }];
        if (encBattle.playerIsFaster && encBattle.monsterNextMove) {
          encLog.push({ text: `You're faster! Enemy intends to: ${encBattle.monsterNextMove.name}`, type: 'info' });
        } else if (!encBattle.playerIsFaster) {
          encLog.push({ text: `${monster.name} is faster and strikes first!`, type: 'info' });
        }
        return {
          ...state, screen: 'battle',
          exploreText: text,
          energy: exploreEnergy,
          lastEnergyUpdate: exploreLastUpdate,
          pets: petsAfterExplore,
          battle: encBattle,
          battleLog: encLog,
          battleResult: null,
        };
      }

      // No encounter - roll for material drop from scavenging
      const scavengeRegionId = state.currentRegion?.id || null;
      let scavengedMaterial = null;
      if (scavengeRegionId) {
        scavengedMaterial = rollMaterialDrop(scavengeRegionId);
      }

      // No encounter - chance to find loot, gold, or nothing (modified by time/weather)
      const lootChance = (loc.lootRate ?? 0.3) * effects.lootMult;
      let newText = text;
      let newPlayer = state.player;
      let newDiscovered = state.discoveredItemLocations;
      let newFoundItem = null;
      // Special locations have more gear-focused loot tables (no common potions/energy-drinks)
      const lootTable = loc.special
        ? ['ring', 'boots', 'helmet', 'armor', 'sword', 'shield', 'gloves', 'amulet', 'belt', 'cape']
        : ['potion', 'ring', 'boots', 'helmet', 'armor', 'sword', 'shield', 'energy-drink'];

      // Add scavenged material to inventory
      if (scavengedMaterial) {
        const scavInv = addToInventory(newPlayer === state.player ? state.player.inventory : newPlayer.inventory, scavengedMaterial, state.player.maxInventory);
        if (scavInv) {
          newPlayer = { ...newPlayer, inventory: scavInv };
          newText = text + `\n\nYou salvage ${scavengedMaterial.name} from the wreckage.`;
          newFoundItem = scavengedMaterial;
        }
      }

      // Seed drop chance (~4%, location-specific)
      const seedDrop = scavengeRegionId ? rollSeedDrop(scavengeRegionId, loc.id, loc.name) : null;
      if (seedDrop) {
        const seedInvResult = addToInventory(newPlayer === state.player ? state.player.inventory : newPlayer.inventory, seedDrop, state.player.maxInventory);
        if (seedInvResult) {
          newPlayer = { ...newPlayer, inventory: seedInvResult };
          const seedMsg = `\n\nYou spot a ${seedDrop.name} nestled in the rubble.`;
          newText = (newText !== text ? newText : text) + seedMsg;
          if (!newFoundItem) newFoundItem = seedDrop;
        }
      }

      if (Math.random() < lootChance) {
        if (newPlayer.inventory.length < newPlayer.maxInventory) {
          let foundItem;
          // Special locations boost effective loot level based on their rareLootBonus
          const baseLootLevel = Math.max(loc.levelReq, state.player.level);
          const effectiveLootLevel = loc.special && loc.rareLootBonus
            ? Math.floor(baseLootLevel + (loc.rareLootBonus - 1) * 5)
            : baseLootLevel;
          if (Math.random() < prob('loot.locationItemChance') * (loc.rareLootBonus || 1)) {
            foundItem = generateLocationItem(loc.id, effectiveLootLevel);
          }
          if (!foundItem) {
            const dropType = lootTable[Math.floor(Math.random() * lootTable.length)];
            foundItem = generateItem(dropType, effectiveLootLevel);
          }
          // Track discovery if the item has a foundLocation
          if (foundItem.foundLocation) {
            const existing = newDiscovered[foundItem.name] || [];
            if (!existing.includes(foundItem.foundLocation)) {
              newDiscovered = { ...newDiscovered, [foundItem.name]: [...existing, foundItem.foundLocation] };
            }
          }
          const lootInv = addToInventory(newPlayer.inventory, foundItem, newPlayer.maxInventory);
          if (lootInv) {
            newPlayer = { ...newPlayer, inventory: lootInv };
            newText = (scavengedMaterial ? newText : text) + `\n\nYou scavenge ${foundItem.name} from a busted crate.`;
            newFoundItem = foundItem;
          }
        } else {
          newText = (scavengedMaterial ? newText : text) + '\n\nYou find loot but your pack is full.';
        }
      } else if (Math.random() < prob('explore.goldFindChance')) {
        const found = Math.floor(prob('explore.goldFindMin') + Math.random() * Math.max(prob('explore.goldFindRange'), state.player.level * 2));
        newPlayer = { ...newPlayer, gold: newPlayer.gold + found };
        newText = (scavengedMaterial ? newText : text) + `\n\nYou find ${found} gold tucked under debris.`;
      } else if (!scavengedMaterial) {
        newText = text + '\n\nNothing but distant sirens... for now.';
      }
      // Track exploration
      let newStats = addStat(state.stats, 'explorationsCompleted');
      let newTasks = incrementTaskProgress(state.tasks, 'explorationsCompleted');
      if (newPlayer !== state.player && newPlayer.inventory.length > state.player.inventory.length) {
        newStats = addStat(newStats, 'itemsLooted');
        newTasks = incrementTaskProgress(newTasks, 'itemsLooted');
      }
      if (newPlayer !== state.player && newPlayer.gold > state.player.gold) {
        const goldFound = newPlayer.gold - state.player.gold;
        newStats = addStat(newStats, 'goldEarned', goldFound);
        newTasks = incrementTaskProgress(newTasks, 'goldEarned', goldFound);
      }
      // Track material collection from scavenging
      if (scavengedMaterial) {
        newStats = addStat(newStats, 'materialsCollected');
        newTasks = incrementTaskProgress(newTasks, 'materialsCollected');
      }
      return { ...state, exploreText: newText, exploreFoundItem: newFoundItem, player: newPlayer, stats: newStats, tasks: newTasks, energy: exploreEnergy, lastEnergyUpdate: exploreLastUpdate, discoveredItemLocations: newDiscovered, pets: petsAfterExplore };
    }

    case 'RANDOM_EVENT_CHOOSE': {
      const { choiceIndex } = action;
      const event = state.randomEvent;
      if (!event) return { ...state, screen: 'explore' };

      const choice = event.choices[choiceIndex];
      if (!choice) return { ...state, screen: 'explore' };

      // Roll weighted outcome
      const roll = Math.random();
      let cumulative = 0;
      let outcome = choice.outcomes[choice.outcomes.length - 1];
      for (const o of choice.outcomes) {
        cumulative += o.weight;
        if (roll < cumulative) { outcome = o; break; }
      }

      const loc = state.currentLocation;
      const lvl = Math.max(loc?.levelReq || 1, state.player.level);
      let p = { ...state.player };
      let newEnergy = state.energy;
      let resultText = outcome.text;
      let resultType = 'neutral';

      const nowEvent = Date.now();
      const eventRegen = regenEnergy(newEnergy, state.lastEnergyUpdate, nowEvent);
      newEnergy = eventRegen.energy;
      const eventLastUpdate = eventRegen.lastEnergyUpdate;

      switch (outcome.type) {
        case 'gold': {
          const amount = Math.floor(5 + Math.random() * Math.max(3, lvl * 2));
          p = { ...p, gold: p.gold + amount };
          resultText += ` (+${amount} gold)`;
          resultType = 'good';
          break;
        }
        case 'gold_big': {
          const amount = Math.floor(10 + Math.random() * Math.max(5, lvl * 4));
          p = { ...p, gold: p.gold + amount };
          resultText += ` (+${amount} gold)`;
          resultType = 'great';
          break;
        }
        case 'gold_double': {
          const wager = Math.floor(Math.min(p.gold, Math.max(5, lvl * 2)));
          p = { ...p, gold: p.gold + wager };
          resultText += ` (+${wager} gold)`;
          resultType = 'great';
          break;
        }
        case 'gold_jackpot': {
          const wager = Math.floor(Math.min(p.gold, Math.max(5, lvl * 3)));
          p = { ...p, gold: p.gold + wager * 2 };
          resultText += ` (+${wager * 2} gold)`;
          resultType = 'great';
          break;
        }
        case 'gold_lose': {
          const loss = Math.floor(Math.min(p.gold, Math.max(3, lvl)));
          p = { ...p, gold: Math.max(0, p.gold - loss) };
          resultText += ` (-${loss} gold)`;
          resultType = 'bad';
          break;
        }
        case 'guilt_gold': {
          const loss = Math.floor(Math.min(p.gold, Math.max(1, Math.floor(lvl * 0.5))));
          p = { ...p, gold: Math.max(0, p.gold - loss) };
          resultText += ` (-${loss} gold)`;
          resultType = 'bad';
          break;
        }
        case 'scam': {
          const loss = Math.floor(Math.min(p.gold, Math.max(5, lvl * 2)));
          p = { ...p, gold: Math.max(0, p.gold - loss) };
          resultText += ` (-${loss} gold)`;
          resultType = 'bad';
          break;
        }
        case 'item': {
          const lootTypes = ['potion', 'ring', 'boots', 'helmet', 'armor', 'sword', 'shield'];
          const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
          const foundItem = generateItem(dropType, lvl);
          const itemInv = addToInventory(p.inventory, foundItem, p.maxInventory);
          if (itemInv) {
            p = { ...p, inventory: itemInv };
            resultText += ` (Found: ${foundItem.name})`;
            resultType = 'good';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'item_rare': {
          const lootTypes = ['ring', 'boots', 'helmet', 'armor', 'sword', 'shield'];
          const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
          const foundItem = generateItem(dropType, lvl + 3);
          const rareInv = addToInventory(p.inventory, foundItem, p.maxInventory);
          if (rareInv) {
            p = { ...p, inventory: rareInv };
            resultText += ` (Found: ${foundItem.name})`;
            resultType = 'great';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'item_great': {
          const lootTypes = ['ring', 'sword', 'armor', 'shield'];
          const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
          const foundItem = generateItem(dropType, lvl + 6);
          const greatInv = addToInventory(p.inventory, foundItem, p.maxInventory);
          if (greatInv) {
            p = { ...p, inventory: greatInv };
            resultText += ` (Found: ${foundItem.name})`;
            resultType = 'great';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'energy_drinks': {
          const count = outcome.amount || Math.floor(Math.random() * 7) + 1;
          let awarded = 0;
          let currentInv = [...p.inventory];
          for (let i = 0; i < count; i++) {
            const drink = generateItem('energy-drink', lvl);
            if (!drink) continue;
            const drinkInv = addToInventory(currentInv, drink, p.maxInventory);
            if (!drinkInv) break;
            currentInv = drinkInv;
            awarded++;
          }
          if (awarded > 0) {
            p = { ...p, inventory: currentInv };
            resultText += ` (Got ${awarded} Energy Drink${awarded > 1 ? 's' : ''}!)`;
            resultType = 'great';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'damage': {
          const dmg = Math.max(1, Math.floor(p.maxHp * (outcome.amount || 0.25)));
          p = { ...p, hp: Math.max(1, p.hp - dmg) };
          resultText += ` (-${dmg} HP)`;
          resultType = 'bad';
          break;
        }
        case 'heal': {
          const healAmt = Math.max(1, Math.floor(p.maxHp * (outcome.amount || 0.20)));
          p = { ...p, hp: Math.min(p.maxHp, p.hp + healAmt) };
          resultText += ` (+${healAmt} HP)`;
          resultType = 'good';
          break;
        }
        case 'energy_drain': {
          const drain = outcome.amount || 4;
          newEnergy = Math.max(0, newEnergy - drain);
          resultText += ` (-${drain} energy)`;
          resultType = 'bad';
          break;
        }
        case 'energy_restore': {
          const restore = outcome.amount || 10;
          newEnergy = Math.min(ENERGY_MAX, newEnergy + restore);
          resultText += ` (+${restore} energy)`;
          resultType = 'good';
          break;
        }
        case 'battle_hard':
        case 'ambush': {
          // Start a battle with a scaled monster from current location
          const monsterId = loc.monsters[Math.floor(Math.random() * loc.monsters.length)];
          const monster = scaleMonster(monsterId, loc.levelReq);
          // Ambush: monster gets slight stat boost
          monster.hp = Math.floor(monster.hp * 1.15);
          monster.maxHp = monster.hp;
          monster.atk = Math.floor(monster.atk * 1.1);
          const ambushText = outcome.type === 'ambush' ? 'AMBUSH! ' : '';
          return {
            ...state, screen: 'battle',
            exploreText: resultText,
            energy: newEnergy,
            lastEnergyUpdate: eventLastUpdate,
            player: p,
            randomEvent: null,
            battle: createBattleState(monster, p),
            battleLog: [{ text: `${ambushText}A ${monster.name} attacks!`, type: 'info' }],
            battleResult: null,
          };
        }
        case 'nothing':
        default:
          resultType = 'neutral';
          break;
      }

      return {
        ...state,
        screen: 'event-result',
        player: p,
        energy: newEnergy,
        lastEnergyUpdate: eventLastUpdate,
        eventResult: { text: resultText, type: resultType, eventTitle: event.title },
      };
    }

    case 'EVENT_RESULT_CONTINUE': {
      return {
        ...state,
        screen: 'explore',
        randomEvent: null,
        eventResult: null,
      };
    }

    // ---- QUEST VILLAGE ACTIONS ----
    case 'VILLAGE_ACCEPT_QUEST': {
      const { questId, villageId } = action;
      const vq = state.villageQuests;
      // Don't accept duplicates
      if ((vq.acceptedQuests || []).some(q => q.questId === questId)) return state;
      if ((vq.completedQuests || []).includes(questId)) return state;
      // Set baseline from current stats so progress counts from now
      const village = Object.values(QUEST_VILLAGES).flat().find(v => v.id === villageId);
      const questDef = village?.quests.find(q => q.id === questId);
      if (!questDef) return state;
      const baseline = state.stats[questDef.stat] || 0;
      return {
        ...state,
        villageQuests: {
          ...vq,
          acceptedQuests: [...(vq.acceptedQuests || []), { questId, villageId, baseline }],
        },
        message: `Quest accepted: ${questDef.name}`,
      };
    }

    case 'VILLAGE_TURN_IN_QUEST': {
      const { questId, villageId } = action;
      const vq = state.villageQuests;
      const accepted = (vq.acceptedQuests || []).find(q => q.questId === questId);
      if (!accepted) return state;
      // Find quest definition
      const village = Object.values(QUEST_VILLAGES).flat().find(v => v.id === villageId);
      const questDef = village?.quests.find(q => q.id === questId);
      if (!questDef) return state;
      // Check stat progress (skip check if target is 0, meaning item-only quest)
      const progress = (state.stats[questDef.stat] || 0) - accepted.baseline;
      if (questDef.target > 0 && progress < questDef.target) return state;
      // Check item requirements if any
      if (questDef.itemRequirements && questDef.itemRequirements.length > 0) {
        const inv = state.player.inventory;
        for (const req of questDef.itemRequirements) {
          const hasItem = inv.some(item => item.name === req.itemName && item.foundLocation === req.locationId);
          if (!hasItem) return state;
        }
      }
      // Give rewards
      let p = { ...state.player };
      // Remove required items from inventory
      if (questDef.itemRequirements && questDef.itemRequirements.length > 0) {
        let newInv = [...p.inventory];
        for (const req of questDef.itemRequirements) {
          const idx = newInv.findIndex(item => item.name === req.itemName && item.foundLocation === req.locationId);
          if (idx !== -1) newInv.splice(idx, 1);
        }
        p = { ...p, inventory: newInv };
      }
      p.gold += questDef.reward.gold;
      // Generate reward item if applicable
      if (questDef.reward.item) {
        const loc = state.currentLocation;
        const lvl = Math.max(loc?.levelReq || 1, p.level);
        const rewardItem = generateItem(questDef.reward.item, lvl + 2);
        const questInv = addToInventory(p.inventory, rewardItem, p.maxInventory);
        if (questInv) p = { ...p, inventory: questInv };
      }
      return {
        ...state,
        player: p,
        villageQuests: {
          ...vq,
          acceptedQuests: (vq.acceptedQuests || []).filter(q => q.questId !== questId),
          completedQuests: [...(vq.completedQuests || []), questId],
        },
        stats: addStat(state.stats, 'goldEarned', questDef.reward.gold),
        message: `Quest complete: ${questDef.name}! +${questDef.reward.gold}g`,
      };
    }

    case 'VILLAGE_LEAVE': {
      return {
        ...state,
        screen: 'explore',
        activeVillage: null,
      };
    }

    case 'VILLAGE_TRADER_BUY': {
      const village = state.activeVillage;
      const vTraders = village?.traders || (village?.trader ? [village.trader] : []);
      if (!vTraders.length) return state;
      // Find which trader has this deal
      const matchedTrader = vTraders.find(t => t.deals.some(d => d.id === action.dealId));
      if (!matchedTrader) return state;
      // Check stock limits for village trader deals
      const vDeal = matchedTrader.deals.find(d => d.id === action.dealId);
      if (vDeal && vDeal.stock != null) {
        const vPurchases = state.villagePurchases || {};
        const bought = vPurchases[action.dealId] || 0;
        if (bought >= vDeal.stock) {
          return { ...state, message: 'Sold out!' };
        }
      }
      // Reuse TRADER_BUY logic by synthesizing an activeTrader context
      const result = gameReducer({ ...state, activeTrader: matchedTrader }, { type: 'TRADER_BUY', dealId: action.dealId });
      // If purchase succeeded (gold changed or message differs), track the purchase
      if (result.player.gold !== state.player.gold || (result.message && result.message !== 'Not enough gold!' && result.message !== 'Inventory full!')) {
        const updatedPurchases = { ...(result.villagePurchases || state.villagePurchases || {}) };
        updatedPurchases[action.dealId] = (updatedPurchases[action.dealId] || 0) + 1;
        return { ...result, activeTrader: state.activeTrader, villagePurchases: updatedPurchases };
      }
      return { ...result, activeTrader: state.activeTrader };
    }

    // ---- EXTRAORDINARY TRADER ACTIONS ----
    case 'TRADER_BUY': {
      const { dealId } = action;
      const trader = state.activeTrader;
      if (!trader) return state;
      const deal = trader.deals.find(d => d.id === dealId);
      if (!deal) return state;
      let p = { ...state.player };
      if (deal.cost > 0 && p.gold < deal.cost) {
        return { ...state, message: 'Not enough gold!' };
      }
      p.gold -= deal.cost;
      let newEnergy = state.energy;
      const loc = state.currentLocation;
      const lvl = Math.max(loc?.levelReq || 1, p.level);
      let msg = '';

      switch (deal.type) {
        case 'full_heal':
          p.hp = p.maxHp;
          msg = 'HP fully restored!';
          break;
        case 'full_mana':
          p.mana = p.maxMana;
          msg = 'Mana fully restored!';
          break;
        case 'energy_restore': {
          const restoreAmt = deal.amount || 30;
          newEnergy = Math.min(ENERGY_MAX, newEnergy + restoreAmt);
          msg = `+${restoreAmt} energy!`;
          break;
        }
        case 'rare_item': {
          const types = ['ring', 'sword', 'armor', 'shield', 'boots', 'helmet'];
          const item = generateItem(types[Math.floor(Math.random() * types.length)], lvl + 3);
          const rareInv = addToInventory(p.inventory, item, p.maxInventory);
          if (rareInv) {
            p = { ...p, inventory: rareInv };
            msg = `Received: ${item.name}`;
          } else {
            p.gold += deal.cost;
            msg = 'Inventory full!';
          }
          break;
        }
        case 'legendary_item': {
          const types = ['sword', 'armor', 'shield', 'ring'];
          const item = generateItem(types[Math.floor(Math.random() * types.length)], lvl + 6);
          const legInv = addToInventory(p.inventory, item, p.maxInventory);
          if (legInv) {
            p = { ...p, inventory: legInv };
            msg = `Received: ${item.name}`;
          } else {
            p.gold += deal.cost;
            msg = 'Inventory full!';
          }
          break;
        }
        case 'high_level_item': {
          const types = ['sword', 'armor', 'shield', 'helmet', 'boots', 'ring', 'amulet'];
          const item = generateItem(types[Math.floor(Math.random() * types.length)], lvl + 4);
          const hlInv = addToInventory(p.inventory, item, p.maxInventory);
          if (hlInv) {
            p = { ...p, inventory: hlInv };
            msg = `Received: ${item.name}`;
          } else {
            p.gold += deal.cost;
            msg = 'Inventory full!';
          }
          break;
        }
        case 'mystery_box': {
          if (Math.random() < 0.5) {
            const item = generateItem('sword', lvl + 5);
            const mystInv = addToInventory(p.inventory, item, p.maxInventory);
            if (mystInv) {
              p = { ...p, inventory: mystInv };
              msg = `Amazing! Got: ${item.name}`;
            } else {
              p.gold += deal.cost;
              msg = 'Inventory full!';
            }
          } else {
            const dmg = Math.floor(p.maxHp * 0.2);
            p.hp = Math.max(1, p.hp - dmg);
            msg = `The box exploded! -${dmg} HP`;
          }
          break;
        }
        case 'weapon_upgrade': {
          if (p.equipment.weapon) {
            const w = { ...p.equipment.weapon };
            w.atk = (w.atk || 0) + Math.floor(3 + lvl * 0.5);
            w.name = w.name + '+';
            p = { ...p, equipment: { ...p.equipment, weapon: w } };
            msg = `${w.name} upgraded!`;
          } else {
            p.gold += deal.cost;
            msg = 'No weapon equipped!';
          }
          break;
        }
        case 'armor_upgrade': {
          if (p.equipment.armor) {
            const a = { ...p.equipment.armor };
            a.def = (a.def || 0) + Math.floor(3 + lvl * 0.5);
            a.name = a.name + '+';
            p = { ...p, equipment: { ...p.equipment, armor: a } };
            msg = `${a.name} upgraded!`;
          } else {
            p.gold += deal.cost;
            msg = 'No armor equipped!';
          }
          break;
        }
        case 'gold_gamble': {
          const wager = Math.min(p.gold, 200);
          if (Math.random() < 0.45) {
            p.gold += wager;
            msg = `Doubled! +${wager}g`;
          } else {
            p.gold = Math.max(0, p.gold - Math.floor(wager * 0.5));
            msg = `Lost the gamble! -${Math.floor(wager * 0.5)}g`;
          }
          break;
        }
        case 'cursed_item': {
          const types = ['sword', 'ring', 'armor'];
          const item = generateItem(types[Math.floor(Math.random() * types.length)], lvl + 8);
          item.name = 'Cursed ' + item.name;
          const cursedInv = addToInventory(p.inventory, item, p.maxInventory);
          if (cursedInv) {
            p = { ...p, inventory: cursedInv };
            const dmg = Math.floor(p.maxHp * 0.15);
            p.hp = Math.max(1, p.hp - dmg);
            msg = `Got ${item.name}! But it cursed you for ${dmg} HP!`;
          } else {
            p.gold += deal.cost;
            msg = 'Inventory full!';
          }
          break;
        }
        case 'lucky_charm': {
          msg = 'A lucky glow surrounds you! (Boosted loot for next encounters)';
          break;
        }
        case 'full_heal_mana': {
          p.hp = p.maxHp;
          p.mana = p.maxMana;
          msg = 'HP and Mana fully restored!';
          break;
        }
        case 'egg': {
          const eggItem = createEggItem(deal.eggId);
          if (eggItem) {
            const eggInv = addToInventory(p.inventory, eggItem, p.maxInventory);
            if (eggInv) {
              p = { ...p, inventory: eggInv };
              msg = `Received: ${eggItem.name}!`;
            } else {
              p.gold += deal.cost;
              msg = 'Inventory full!';
            }
          } else {
            p.gold += deal.cost;
            msg = 'The egg crumbled...';
          }
          break;
        }
        case 'material': {
          const matItem = createMaterialItem(deal.materialId, deal.quantity || 1);
          if (matItem) {
            const matInv = addToInventory(p.inventory, matItem, p.maxInventory);
            if (matInv) {
              p = { ...p, inventory: matInv };
              msg = `Received: ${matItem.name} x${deal.quantity || 1}!`;
            } else {
              p.gold += deal.cost;
              msg = 'Inventory full!';
            }
          } else {
            p.gold += deal.cost;
            msg = 'The material disintegrated...';
          }
          break;
        }
        default:
          msg = 'The trader nods and hands you something.';
      }

      return {
        ...state,
        player: p,
        energy: newEnergy,
        stats: deal.cost > 0 ? addStat(state.stats, 'goldSpent', deal.cost) : state.stats,
        message: msg,
      };
    }

    case 'TRADER_LEAVE': {
      return {
        ...state,
        screen: 'explore',
        activeTrader: null,
      };
    }

    case 'TRADER_ACCEPT_QUEST': {
      const { questId, traderId } = action;
      const trader = state.activeTrader;
      if (!trader || !trader.quests) return state;
      const questDef = trader.quests.find(q => q.id === questId);
      if (!questDef) return state;
      const vq = state.villageQuests;
      // Don't accept duplicates
      if ((vq.acceptedQuests || []).some(q => q.questId === questId)) return state;
      if ((vq.completedQuests || []).includes(questId)) return state;
      const baseline = state.stats[questDef.stat] || 0;
      return {
        ...state,
        villageQuests: {
          ...vq,
          acceptedQuests: [...(vq.acceptedQuests || []), { questId, villageId: traderId, baseline }],
        },
        message: `Quest accepted: ${questDef.name}`,
      };
    }

    case 'TRADER_TURN_IN_QUEST': {
      const { questId, traderId } = action;
      const trader = EXTRAORDINARY_TRADERS.find(t => t.id === traderId);
      if (!trader || !trader.quests) return state;
      const questDef = trader.quests.find(q => q.id === questId);
      if (!questDef) return state;
      const vq = state.villageQuests;
      const accepted = (vq.acceptedQuests || []).find(q => q.questId === questId);
      if (!accepted) return state;
      const progress = (state.stats[questDef.stat] || 0) - accepted.baseline;
      if (questDef.target > 0 && progress < questDef.target) return state;
      let p = { ...state.player };
      p.gold += questDef.reward.gold;
      if (questDef.reward.item) {
        const loc = state.currentLocation;
        const lvl = Math.max(loc?.levelReq || 1, p.level);
        const rewardItem = generateItem(questDef.reward.item, lvl + 2);
        const questInv = addToInventory(p.inventory, rewardItem, p.maxInventory);
        if (questInv) p = { ...p, inventory: questInv };
      }
      return {
        ...state,
        player: p,
        villageQuests: {
          ...vq,
          acceptedQuests: (vq.acceptedQuests || []).filter(q => q.questId !== questId),
          completedQuests: [...(vq.completedQuests || []), questId],
        },
        stats: addStat(state.stats, 'goldEarned', questDef.reward.gold),
        message: `Quest complete: ${questDef.name}! +${questDef.reward.gold}g`,
      };
    }

    case 'BATTLE_PLAYER_ATTACK': {
      let b = { ...state.battle };
      let m = { ...b.monster };
      let p = { ...state.player };
      const cls = getClassData(p);
      let log = [...state.battleLog];

      // Check if player is stunned
      if (b.playerStunTurns > 0) {
        b.playerStunTurns--;
        b.showSkillMenu = false;
        b.showInspect = false;
        log.push({ text: `You are stunned and cannot act! (${b.playerStunTurns} turns left)`, type: 'dmg-player' });
        return { ...state, battle: b, battleLog: log };
      }

      // Check if player is confused - random action
      if (b.playerConfusionTurns > 0) {
        b.playerConfusionTurns--;
        const confRoll = Math.random();
        if (confRoll < 0.3) {
          // Skip turn entirely
          log.push({ text: 'You are confused and stumble around!', type: 'dmg-player' });
          return { ...state, battle: b, battleLog: log };
        } else if (confRoll < 0.5) {
          // Hit yourself
          const selfDmg = Math.floor(calcDamage(getPlayerAtk(p, b), 0) * 0.3);
          p = { ...p, hp: Math.max(1, p.hp - selfDmg) };
          log.push({ text: `Confused! You hit yourself for ${selfDmg} damage!`, type: 'dmg-player' });
          return { ...state, player: p, battle: b, battleLog: log };
        }
        // else: attack normally but with reduced accuracy
        log.push({ text: 'You shake off some confusion...', type: 'info' });
      }

      // Check if player is frozen (boss gimmick)
      if (b.playerFrozen) {
        b.playerFrozen = false;
        log.push({ text: 'You are frozen and cannot act this turn!', type: 'dmg-player' });
        return { ...state, battle: b, battleLog: log };
      }

      // Gimmick miss chance check
      if (b.playerMissChance > 0 && Math.random() < b.playerMissChance) {
        b.defending = false;
        b.defendedLastTurn = false;
        b.showSkillMenu = false;
        b.showInspect = false;
        log.push({ text: 'Your attack misses!', type: 'info' });
        return { ...state, battle: b, battleLog: log };
      }

      // Monster evasion check (monster dodges based on evasion vs player accuracy)
      const mEvasion = m.evasion || 0;
      const pAccuracy = getPlayerAccuracy(p, b);
      const mDodgeChance = calcEvasionDodgeChance(mEvasion, pAccuracy);
      if (mDodgeChance > 0 && Math.random() < mDodgeChance) {
        b.defending = false;
        b.defendedLastTurn = false;
        b.showSkillMenu = false;
        b.showInspect = false;
        log.push({ text: `${m.name} evades your attack!`, type: 'info' });
        return { ...state, battle: b, battleLog: log };
      }

      // Monster invulnerability check
      if (b.monsterInvulnerable) {
        b.defending = false;
        b.showSkillMenu = false;
        b.showInspect = false;
        log.push({ text: `${m.name} is invulnerable! Your attack has no effect!`, type: 'info' });
        return { ...state, battle: b, battleLog: log };
      }

      // Apply armor shatter debuff to monster DEF
      const effectiveMonsterDef = b.armorShatterTurns > 0 ? Math.floor(m.def * (1 - b.armorShatterPct)) : m.def;
      let dmg = calcDamage(getPlayerAtk(p, b), effectiveMonsterDef);

      // Apply frenzy combo buff
      if (b.frenzyBonusTurns > 0 && b.frenzyBonusPct > 0) {
        dmg = Math.floor(dmg * (1 + b.frenzyBonusPct));
      }

      // Apply channel bonus
      if (b.playerChannelBonusActive) {
        dmg = Math.floor(dmg * PLAYER_CHANNEL_BONUS);
        b.playerChannelBonusActive = false;
        log.push({ text: `Channeled energy released! ${PLAYER_CHANNEL_BONUS}x damage!`, type: 'info' });
      }

      // Stance modifier on outgoing damage
      const stanceMods = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);
      dmg = Math.floor(dmg * stanceMods.dmgDealt);

      // Aggression bonus: increased outgoing damage
      const pAggression = getPlayerAggression(p);
      if (pAggression > 0) {
        dmg = Math.floor(dmg * calcAggressionDmgDealt(pAggression));
      }

      // Elemental damage multiplier (player attack element vs monster element)
      const playerAttackElement = getSkillElement(null, p.characterClass);
      const elemMult = calcElementalDamageMultiplier(playerAttackElement, b.monsterElement);
      if (elemMult !== 1.0) {
        dmg = Math.floor(dmg * elemMult);
        if (elemMult > 1.0) log.push({ text: 'Super effective!', type: 'info' });
        else log.push({ text: 'Not very effective...', type: 'info' });
      }

      const lucky = tryLuckyStrike(p, dmg);
      dmg = lucky.dmg;

      // Critical hit check (includes luck bonus + stance crit mod + guaranteed crit)
      let playerCrit = false;
      const pLuck = getPlayerLuck(p);
      const critChance = getPlayerCritChance(p) + luckCritBonus(pLuck) + stanceMods.critMod;
      if (b.guaranteedCrit || Math.random() < critChance) {
        dmg = Math.floor(dmg * getPlayerCritMultiplier(p));
        playerCrit = true;
        if (b.guaranteedCrit) {
          b.guaranteedCrit = false;
        }
      }

      // Monster damage reduction (boss gimmick)
      if (b.monsterDmgReduction > 0) {
        dmg = Math.floor(dmg * (1 - b.monsterDmgReduction));
      }

      // Monster resistance reduces skill damage (applied to basic attacks lightly)
      const mRes = m.resistance || 0;
      if (mRes > 0) {
        const resReduct = calcResistanceReduction(mRes) * 0.3; // basic attacks only 30% affected
        dmg = Math.floor(dmg * (1 - resReduct));
      }

      m.hp = Math.max(0, m.hp - dmg);

      // Monster fortitude: survive lethal blow once at 1 HP
      if (m.hp <= 0 && !b.monsterFortitudeUsed) {
        const mFort = m.fortitude || 0;
        const surviveChance = calcFortitudeSurviveChance(mFort);
        if (surviveChance > 0 && Math.random() < surviveChance) {
          m.hp = 1;
          b.monsterFortitudeUsed = true;
          log.push({ text: `${m.name} endures the lethal blow with sheer willpower!`, type: 'info' });
        }
      }
      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;
      b.showSkillMenu = false;
      b.showInspect = false;

      if (lucky.procced && playerCrit) {
        log.push({ text: `Lucky Strike + CRIT! Devastating ${dmg} damage!`, type: 'dmg-monster' });
      } else if (lucky.procced) {
        log.push({ text: `Lucky Strike! Double damage for ${dmg}!`, type: 'dmg-monster' });
      } else if (playerCrit) {
        log.push({ text: `CRITICAL HIT! You attack for ${dmg} damage!`, type: 'dmg-monster' });
      } else {
        log.push({ text: `You attack for ${dmg} damage!`, type: 'dmg-monster' });
      }

      // Track action in combo history
      b.actionHistory = [...(b.actionHistory || []), 'attack'].slice(-5);
      // Check combo chains
      const combos = checkComboChains(b.actionHistory, p.comboMaster);
      if (combos.length > 0) {
        for (const combo of combos) {
          log.push({ text: `Combo: ${combo.name}!`, type: 'info' });
          if (combo.bonus === 'dmg_boost') {
            const comboDmg = Math.floor(dmg * combo.boostPct);
            m.hp = Math.max(0, m.hp - comboDmg);
            log.push({ text: `Combo bonus damage: ${comboDmg}!`, type: 'dmg-monster' });
          } else if (combo.bonus === 'bleed') {
            b.comboBleedTurns = combo.bleedTurns || 2;
            b.comboBleedPct = combo.bleedPct || 0.04;
            log.push({ text: `Enemy is bleeding!`, type: 'info' });
          } else if (combo.bonus === 'pierce') {
            // Pierce: next attack ignores 50% DEF — already dealt
          } else if (combo.bonus === 'armor_break') {
            b.armorShatterTurns = combo.armorBreakTurns || 3;
            b.armorShatterPct = combo.armorBreakPct || 0.4;
            log.push({ text: `Fortress Crush! Enemy armor broken!`, type: 'info' });
          } else if (combo.bonus === 'mana_restore') {
            const restored = Math.floor(getBattleMaxMana(p) * (combo.restorePct || 0.25));
            p = { ...p, mana: Math.min(getBattleMaxMana(p), p.mana + restored) };
            log.push({ text: `Arcane Surge restores ${restored} mana!`, type: 'heal' });
          } else if (combo.bonus === 'invuln') {
            b.playerInvulnTurns = combo.invulnTurns || 1;
            log.push({ text: 'Perfect Parry! You become invulnerable!', type: 'info' });
          } else if (combo.bonus === 'frenzy') {
            b.frenzyBonusTurns = 2;
            b.frenzyBonusPct = combo.frenzyBonus || 0.35;
            log.push({ text: `Berserker frenzy! +${Math.round(b.frenzyBonusPct * 100)}% damage for 2 turns!`, type: 'info' });
          } else if (combo.bonus === 'crit_guarantee') {
            b.guaranteedCrit = true;
            log.push({ text: 'Focused Strike — guaranteed critical next attack!', type: 'info' });
          }
          b.activeCombo = combo;
          b.comboStreak = (b.comboStreak || 0) + 1;
        }
        b.actionHistory = []; // reset after combo completes
      }

      // Monster reflect damage (boss gimmick)
      if (b.monsterReflectPct > 0) {
        const reflectDmg = Math.floor(dmg * b.monsterReflectPct);
        if (reflectDmg > 0) {
          p = { ...p, hp: Math.max(0, p.hp - reflectDmg) };
          log.push({ text: `${m.name} reflects ${reflectDmg} damage back!`, type: 'dmg-player' });
        }
      }

      // Post-attack passives (lifetap, vampiric aura, soul siphon, bloodlust, etc.)
      ({ player: p, monster: m, battle: b, log } = applyAttackPassives({ player: p, monster: m, battle: b, log, dmg, cls }));

      // Blade Dance: 10% chance to attack twice
      const blade = tryBladeDance(p, b, calcDamage, getPlayerAtk);
      if (blade.attacked) {
        m = { ...m, hp: Math.max(0, m.hp - blade.dmg) };
        b = { ...b, monster: m };
        log.push({ text: `Blade Dance! Extra attack for ${blade.dmg}!`, type: 'dmg-monster' });
      }

      // Track total damage dealt
      let totalDmg = dmg + (blade.attacked ? blade.dmg : 0);
      let newStats = addStat(state.stats, 'damageDealt', totalDmg);
      newStats = setStatMax(newStats, 'highestDamage', dmg);
      newStats = addStat(newStats, 'totalTurns');
      if (playerCrit) {
        newStats = addStat(newStats, 'criticalHits');
      }
      if (combos.length > 0) {
        newStats = addStat(newStats, 'comboTriggered', combos.length);
      }
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', totalDmg);
      if (playerCrit) {
        newTasks = incrementTaskProgress(newTasks, 'criticalHits');
      }

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks });
      }

      // Pet turn actions (after player attack, before monster turn)
      const petResult = processPetTurnActions({ ...state, player: p, battle: { ...b, monster: m }, pets: state.pets }, log);
      p = petResult.state.player;
      m = petResult.state.battle.monster;
      b = { ...petResult.state.battle };
      log = petResult.log;
      const updatedPetsAtk = petResult.state.pets;

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: updatedPetsAtk });
      }
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: updatedPetsAtk };
    }

    case 'BATTLE_PLAYER_SKILL': {
      let b = { ...state.battle };
      let m = { ...b.monster };
      let p = { ...state.player };
      const cls = getClassData(p);
      const skillName = cls?.skillName || 'Power Strike';
      const skillMult = cls?.skillMultiplier || 1.5;
      const skillEffect = cls?.skillEffect || null;
      const stanceModsSkill = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);
      const manaCostRaw = cls?.skillManaCost || 0;
      const manaCost = getEffectiveManaCost(p, Math.ceil(manaCostRaw * (stanceModsSkill.manaMod || 1.0)), b);

      if (manaCost > 0 && p.mana < manaCost) {
        return { ...state, message: `Not enough mana! (${manaCost} needed)` };
      }
      p = { ...p, mana: p.mana - manaCost };

      let passiveBonus = getSkillPassiveBonus(p);
      const echoProc = rollSpellEcho(p);
      if (echoProc) passiveBonus *= 2;

      // Weather spell buff for class skill
      const classElement = getSkillElement(null, p.characterClass);
      const classWeatherBuff = getWeatherSpellBuff(getCurrentWeatherId(), classElement);
      const atkValue = Math.floor(getPlayerAtk(p, b) * skillMult * passiveBonus * classWeatherBuff);

      p = applyLifeTap(p, manaCost);

      // Apply armor shatter debuff to monster DEF
      const effectiveMonsterDefSkill = b.armorShatterTurns > 0 ? Math.floor(m.def * (1 - b.armorShatterPct)) : m.def;
      const effectiveDef = getEffectiveDef(effectiveMonsterDefSkill, skillEffect);
      let dmg = calcDamage(atkValue, effectiveDef);

      // Apply frenzy combo buff
      if (b.frenzyBonusTurns > 0 && b.frenzyBonusPct > 0) {
        dmg = Math.floor(dmg * (1 + b.frenzyBonusPct));
      }

      // Stance modifier on outgoing damage
      dmg = Math.floor(dmg * stanceModsSkill.dmgDealt);

      // Elemental damage multiplier (skill element vs monster element)
      const elemMultSkill = calcElementalDamageMultiplier(classElement, b.monsterElement);
      if (elemMultSkill !== 1.0) {
        dmg = Math.floor(dmg * elemMultSkill);
      }

      // Critical hit check for skills (includes stance crit mod)
      let skillCrit = false;
      const pLuckSkill = getPlayerLuck(p);
      const skillCritChance = getPlayerCritChance(p) + luckCritBonus(pLuckSkill) + stanceModsSkill.critMod;
      if (Math.random() < skillCritChance) {
        dmg = Math.floor(dmg * getPlayerCritMultiplier(p));
        skillCrit = true;
      }

      m.hp = Math.max(0, m.hp - dmg);
      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;
      b.showSkillMenu = false;
      b.showInspect = false;
      let log = [...state.battleLog];
      const classWeatherLabel = classWeatherBuff !== 1.0
        ? ` (${classWeatherBuff > 1 ? '+' : ''}${Math.round((classWeatherBuff - 1) * 100)}% weather)`
        : '';
      if (elemMultSkill > 1.0) log.push({ text: 'Super effective!', type: 'info' });
      else if (elemMultSkill < 1.0) log.push({ text: 'Not very effective...', type: 'info' });
      const critLabel = skillCrit ? 'CRIT! ' : '';
      if (echoProc) {
        log.push({ text: `${critLabel}Spell Echo! ${skillName} for ${dmg} damage!${classWeatherLabel}`, type: 'dmg-monster' });
      } else {
        log.push({ text: `${critLabel}${skillName} for ${dmg} damage!${classWeatherLabel}`, type: 'dmg-monster' });
      }

      // Track in combo history
      b.actionHistory = [...(b.actionHistory || []), 'skill'].slice(-5);
      // Check combo chains
      const skillCombos = checkComboChains(b.actionHistory, p.comboMaster);
      if (skillCombos.length > 0) {
        for (const combo of skillCombos) {
          log.push({ text: `Combo: ${combo.name}!`, type: 'info' });
          if (combo.bonus === 'mana_restore') {
            const restored = Math.floor(getBattleMaxMana(p) * (combo.restorePct || 0.25));
            p = { ...p, mana: Math.min(getBattleMaxMana(p), p.mana + restored) };
            log.push({ text: `Arcane Surge restores ${restored} mana!`, type: 'heal' });
          } else if (combo.bonus === 'frenzy') {
            b.frenzyBonusTurns = 2;
            b.frenzyBonusPct = combo.frenzyBonus || 0.35;
            log.push({ text: `Frenzy! +${Math.round(b.frenzyBonusPct * 100)}% damage for 2 turns!`, type: 'info' });
          } else if (combo.bonus === 'dmg_boost') {
            const comboDmg = Math.floor(dmg * combo.boostPct);
            m.hp = Math.max(0, m.hp - comboDmg);
            log.push({ text: `Combo bonus damage: ${comboDmg}!`, type: 'dmg-monster' });
          }
          b.activeCombo = combo;
          b.comboStreak = (b.comboStreak || 0) + 1;
        }
        b.actionHistory = [];
      }

      // Apply class skill effect (recoil, weaken, drain, etc.)
      if (skillEffect) {
        const battleMaxHp = getBattleMaxHp(p);
        const fx = applySkillEffect(skillEffect, { dmg, player: p, monster: m, battle: b, battleMaxHp, log, manaCost });
        p = fx.player || p;
        m = fx.monster || m;
        b = fx.battle || b;
        log = fx.log || log;
        if (fx.monster) b = { ...b, monster: m };
      }

      // Post-skill passives (vampiric aura, bloodlust, soul siphon)
      ({ player: p, log } = applySkillPassives({ player: p, log, dmg }));

      // Track damage
      let newStats = addStat(state.stats, 'damageDealt', dmg);
      newStats = setStatMax(newStats, 'highestDamage', dmg);
      newStats = addStat(newStats, 'skillsUsed');
      newStats = addStat(newStats, 'totalTurns');
      if (skillCrit) {
        newStats = addStat(newStats, 'criticalHits');
      }
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', dmg);
      if (skillCrit) {
        newTasks = incrementTaskProgress(newTasks, 'criticalHits');
      }

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks });
      }

      // Pet turn actions
      const petResultSkill = processPetTurnActions({ ...state, player: p, battle: { ...b, monster: m }, pets: state.pets }, log);
      p = petResultSkill.state.player;
      m = petResultSkill.state.battle.monster;
      b = { ...petResultSkill.state.battle };
      log = petResultSkill.log;

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResultSkill.state.pets });
      }
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResultSkill.state.pets };
    }

    case 'BATTLE_USE_TREE_SKILL': {
      let b = { ...state.battle };
      let m = { ...b.monster };
      let p = { ...state.player };
      const skill = getTreeSkill(action.skillId);
      if (!skill || skill.type !== 'active') return state;
      const stanceModsTree = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);
      const manaCost = getEffectiveManaCost(p, Math.ceil((skill.manaCost || 0) * (stanceModsTree.manaMod || 1.0)), b);
      if (manaCost > 0 && p.mana < manaCost) {
        return { ...state, message: `Not enough mana! (${manaCost} needed)` };
      }
      p = { ...p, mana: p.mana - manaCost };

      let passiveBonus = getSkillPassiveBonus(p);
      const echoProc = rollSpellEcho(p);
      if (echoProc) passiveBonus *= 2;

      // Weather spell buff: element-based damage modifier
      const skillElement = getSkillElement(action.skillId, p.characterClass);
      const weatherSpellBuff = getWeatherSpellBuff(getCurrentWeatherId(), skillElement);
      const atkValue = Math.floor(getPlayerAtk(p, b) * skill.multiplier * passiveBonus * weatherSpellBuff);
      const battleMaxHp = getBattleMaxHp(p);

      p = applyLifeTap(p, manaCost);

      // Apply armor shatter debuff to monster DEF
      const effectiveMonsterDefTree = b.armorShatterTurns > 0 ? Math.floor(m.def * (1 - b.armorShatterPct)) : m.def;
      const effectiveDef = getEffectiveDef(effectiveMonsterDefTree, skill.effect);
      let finalMult = getExecuteMultiplier(skill.effect, m.hp, m.maxHp);
      if (skill.effect === 'counter' && b.defendedLastTurn) finalMult = 1.25;

      let dmg = calcDamage(Math.floor(atkValue * finalMult), effectiveDef);

      // Apply frenzy combo buff
      if (b.frenzyBonusTurns > 0 && b.frenzyBonusPct > 0) {
        dmg = Math.floor(dmg * (1 + b.frenzyBonusPct));
      }

      // Stance modifier on outgoing damage
      dmg = Math.floor(dmg * stanceModsTree.dmgDealt);

      // Elemental damage multiplier (skill element vs monster element)
      const elemMultTree = calcElementalDamageMultiplier(skillElement, b.monsterElement);
      if (elemMultTree !== 1.0) {
        dmg = Math.floor(dmg * elemMultTree);
      }

      // Critical hit check for tree skills (includes stance crit mod + luck)
      let treeCrit = false;
      const pLuckTree = getPlayerLuck(p);
      const treeCritChance = getPlayerCritChance(p) + luckCritBonus(pLuckTree) + stanceModsTree.critMod;
      if (Math.random() < treeCritChance) {
        dmg = Math.floor(dmg * getPlayerCritMultiplier(p));
        treeCrit = true;
      }

      m.hp = Math.max(0, m.hp - dmg);
      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;
      b.showSkillMenu = false;
      b.showInspect = false;
      let log = [...state.battleLog];
      const weatherBuffLabel = weatherSpellBuff !== 1.0
        ? ` (${weatherSpellBuff > 1 ? '+' : ''}${Math.round((weatherSpellBuff - 1) * 100)}% weather)`
        : '';
      if (elemMultTree > 1.0) log.push({ text: 'Super effective!', type: 'info' });
      else if (elemMultTree < 1.0) log.push({ text: 'Not very effective...', type: 'info' });
      const treeCritLabel = treeCrit ? 'CRIT! ' : '';
      if (echoProc) {
        log.push({ text: `${treeCritLabel}Spell Echo! ${skill.name} for ${dmg} damage!${weatherBuffLabel}`, type: 'dmg-monster' });
      } else {
        log.push({ text: `${treeCritLabel}${skill.name} for ${dmg} damage!${weatherBuffLabel}`, type: 'dmg-monster' });
      }

      // Track in combo history
      b.actionHistory = [...(b.actionHistory || []), 'skill'].slice(-5);
      // Check combo chains
      const treeCombos = checkComboChains(b.actionHistory, p.comboMaster);
      if (treeCombos.length > 0) {
        for (const combo of treeCombos) {
          log.push({ text: `Combo: ${combo.name}!`, type: 'info' });
          if (combo.bonus === 'mana_restore') {
            const restored = Math.floor(getBattleMaxMana(p) * (combo.restorePct || 0.25));
            p = { ...p, mana: Math.min(getBattleMaxMana(p), p.mana + restored) };
            log.push({ text: `Arcane Surge restores ${restored} mana!`, type: 'heal' });
          } else if (combo.bonus === 'frenzy') {
            b.frenzyBonusTurns = 2;
            b.frenzyBonusPct = combo.frenzyBonus || 0.35;
            log.push({ text: `Frenzy! +${Math.round(b.frenzyBonusPct * 100)}% damage for 2 turns!`, type: 'info' });
          } else if (combo.bonus === 'dmg_boost') {
            const comboDmg = Math.floor(dmg * combo.boostPct);
            m.hp = Math.max(0, m.hp - comboDmg);
            log.push({ text: `Combo bonus damage: ${comboDmg}!`, type: 'dmg-monster' });
          }
          b.activeCombo = combo;
          b.comboStreak = (b.comboStreak || 0) + 1;
        }
        b.actionHistory = [];
      }

      // Apply skill effect via data-driven registry
      if (skill.effect) {
        const fx = applySkillEffect(skill.effect, { dmg, player: p, monster: m, battle: b, battleMaxHp, log, manaCost });
        p = fx.player || p;
        m = fx.monster || m;
        b = fx.battle || b;
        log = fx.log || log;
        if (fx.monster) b = { ...b, monster: m };
      }

      // Spellweaver: after using a skill, next normal attack +50%
      if (playerHasSkill(p, 'mag_t8a')) {
        b = { ...b, spellweaverActive: true };
      }

      // Post-skill passives (vampiric aura, bloodlust, soul siphon)
      ({ player: p, log } = applySkillPassives({ player: p, log, dmg }));

      // Track damage
      let newStats = addStat(state.stats, 'damageDealt', dmg);
      newStats = setStatMax(newStats, 'highestDamage', dmg);
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', dmg);

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks });
      }

      // Pet turn actions
      const petResultTree = processPetTurnActions({ ...state, player: p, battle: { ...b, monster: m }, pets: state.pets }, log);
      p = petResultTree.state.player;
      m = petResultTree.state.battle.monster;
      b = { ...petResultTree.state.battle };
      log = petResultTree.log;

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResultTree.state.pets });
      }
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResultTree.state.pets };
    }

    case 'TOGGLE_SKILL_MENU': {
      if (!state.battle) return state;
      return { ...state, battle: { ...state.battle, showSkillMenu: !state.battle.showSkillMenu, showInspect: false } };
    }

    case 'TOGGLE_INSPECT_MONSTER': {
      if (!state.battle) return state;
      return { ...state, battle: { ...state.battle, showInspect: !state.battle.showInspect, showSkillMenu: false } };
    }

    case 'UNLOCK_SKILL': {
      const { skillId } = action;
      const p = { ...state.player };
      const tree = p.skillTree || [];
      // Prevent duplicates
      if (tree.includes(skillId)) return state;
      // Verify the skill exists and the player meets requirements
      const classTree = SKILL_TREES[p.characterClass];
      if (!classTree) return state;
      let valid = false;
      for (const tier of classTree.tiers) {
        if (p.level < tier.level) break;
        // Check if this tier already has a choice
        const tierChoiceIds = tier.choices.map(c => c.id);
        const alreadyChosen = tree.some(id => tierChoiceIds.includes(id));
        if (alreadyChosen) continue;
        if (tierChoiceIds.includes(skillId)) {
          // Check that all previous tiers have been filled
          const tierIdx = classTree.tiers.indexOf(tier);
          let prevFilled = true;
          for (let i = 0; i < tierIdx; i++) {
            const prevIds = classTree.tiers[i].choices.map(c => c.id);
            if (!tree.some(id => prevIds.includes(id))) {
              prevFilled = false;
              break;
            }
          }
          if (prevFilled) valid = true;
          break;
        }
      }
      if (!valid) return state;
      p.skillTree = [...tree, skillId];
      const newStats = addStat(state.stats, 'skillsUnlocked');
      const newTasks = incrementTaskProgress(state.tasks, 'skillsUnlocked');
      return { ...state, player: p, stats: newStats, tasks: newTasks };
    }

    // Player channels energy for a boosted next attack
    case 'BATTLE_CHANNEL': {
      let b = { ...state.battle, showSkillMenu: false, showInspect: false };
      let p = { ...state.player };
      if (b.playerStunTurns > 0) {
        return { ...state, message: 'You are stunned and cannot act!' };
      }
      const manaCost = PLAYER_CHANNEL_MANA_COST;
      if (p.mana < manaCost) {
        return { ...state, message: `Not enough mana to channel! (${manaCost} needed)` };
      }
      p = { ...p, mana: p.mana - manaCost };
      b.playerChanneling = true;
      b.playerChannelBonusActive = false;
      b.defending = false;
      b.defendedLastTurn = false;
      b.actionHistory = [...(b.actionHistory || []), 'channel'].slice(-5);
      const log = [...state.battleLog, { text: `You channel energy... Next attack will deal ${PLAYER_CHANNEL_BONUS}x damage!`, type: 'info' }];
      return { ...state, player: p, battle: b, battleLog: log };
    }

    case 'BATTLE_DEFEND': {
      if (state.battle.noDefend) {
        return { ...state, message: 'You cannot defend right now!' };
      }
      const b = { ...state.battle, defending: true, defendedLastTurn: true, usedDefend: true, showSkillMenu: false, showInspect: false, actionHistory: [...(state.battle.actionHistory || []), 'defend'].slice(-5) };
      let p = { ...state.player };
      const log = [...state.battleLog, { text: 'You brace for impact!', type: 'info' }];
      // Arcane Barrier: defend restores 10 mana
      if (playerHasSkill(p, 'mag_t7a')) {
        const battleMana = getBattleMaxMana(p);
        p = { ...p, mana: Math.min(battleMana, p.mana + 10) };
        log.push({ text: 'Arcane Barrier restores 10 mana!', type: 'heal' });
      }
      return { ...state, player: p, battle: b, battleLog: log };
    }

    case 'BATTLE_USE_POTION': {
      const potion = state.player.inventory.find(i => i.type === 'potion');
      if (!potion) return { ...state, message: 'No potions!' };
      const bMaxHp = getBattleMaxHp(state.player);
      let potionHeal = potion.healAmount;
      if (playerHasSkill(state.player, 'thf_t5a')) potionHeal = Math.floor(potionHeal * 1.3);
      if (playerHasSkill(state.player, 'nec_t10a')) potionHeal = potionHeal * 2; // Lich Form
      const healed = Math.min(potionHeal, bMaxHp - state.player.hp);
      if (healed === 0) return { ...state, message: 'HP is already full!' };
      const p = { ...state.player, hp: state.player.hp + healed, inventory: removeOneFromStack(state.player.inventory, potion.id) };
      const b = { ...state.battle, defending: false, usedPotion: true, showSkillMenu: false, showInspect: false };
      const log = [...state.battleLog, { text: `Used ${potion.name}, healed ${healed} HP!`, type: 'heal' }];
      let newStats = addStat(state.stats, 'potionsUsed');
      newStats = addStat(newStats, 'totalHealing', healed);
      let newTasks = incrementTaskProgress(state.tasks, 'potionsUsed');
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks };
    }

    case 'BOSS_ACCEPT': {
      const boss = state.pendingBoss;
      if (!boss) return { ...state, screen: 'explore', pendingBoss: null };
      const bossBattle = createBattleState(boss, state.player);
      const bossLog = [
        { text: `BOSS BATTLE!`, type: 'info' },
        { text: `${boss.name} - ${boss.title} appears!`, type: 'info' },
      ];
      if (boss.gimmick) {
        bossLog.push({ text: `Boss Gimmick: ${boss.gimmick.name} - ${boss.gimmick.desc}`, type: 'info' });
      }
      if (bossBattle.playerIsFaster && bossBattle.monsterNextMove) {
        bossLog.push({ text: `Your speed advantage lets you see the enemy's intent: ${bossBattle.monsterNextMove.name}`, type: 'info' });
      }
      return {
        ...state, screen: 'battle',
        pendingBoss: null,
        battle: bossBattle,
        battleLog: bossLog,
        battleResult: null,
      };
    }

    case 'BOSS_DECLINE': {
      return {
        ...state, screen: 'explore', pendingBoss: null,
        exploreText: 'You sense a powerful presence but decide to retreat...',
      };
    }

    case 'BATTLE_RUN': {
      if (state.battle.noRun) {
        return { ...state, message: 'You cannot escape!' };
      }
      const cls = getClassData(state.player);
      let escapeChance = (cls?.passive === 'Greed') ? prob('combat.escapeChanceGreed') : prob('combat.escapeChanceBase');
      if (playerHasSkill(state.player, 'thf_t7a')) escapeChance = 1.0;
      if (Math.random() < escapeChance) {
        const newStats = addStat(state.stats, 'battlesRun');
        return {
          ...state, screen: 'explore', battle: null, battleLog: [],
          exploreText: 'You escaped the battle...',
          stats: newStats,
        };
      }
      const b = { ...state.battle, defending: false };
      const log = [...state.battleLog, { text: 'Failed to escape!', type: 'info' }];
      return { ...state, battle: b, battleLog: log };
    }

    case 'MONSTER_TURN': {
      let b = { ...state.battle };
      let m = { ...b.monster };
      let log = [...state.battleLog];
      let p = { ...state.player };
      const cls = getClassData(p);
      let playerDodgedThisTurn = false;

      // Increment turn counter
      b.turnCount = (b.turnCount || 0) + 1;

      // If player was channeling, activate bonus for next attack
      if (b.playerChanneling) {
        b.playerChanneling = false;
        b.playerChannelBonusActive = true;
        log.push({ text: 'Your channeled energy is ready to unleash!', type: 'info' });
      }

      // Monster poison tick
      if (b.monsterPoisonTurns > 0) {
        const poisonDmg = Math.floor(m.maxHp * 0.06);
        m.hp = Math.max(0, m.hp - poisonDmg);
        b.monsterPoisonTurns--;
        log.push({ text: `Poison deals ${poisonDmg} to ${m.name}!`, type: 'dmg-monster' });
        if (m.hp <= 0) {
          b.monster = m;
          return handleVictory({ ...state, player: p, battle: b, battleLog: log });
        }
      }
      // Monster doom tick
      if (b.monsterDoomTurns > 0) {
        const doomDmg = Math.floor(m.maxHp * 0.08);
        m.hp = Math.max(0, m.hp - doomDmg);
        b.monsterDoomTurns--;
        log.push({ text: `Doom deals ${doomDmg} to ${m.name}!`, type: 'dmg-monster' });
        if (m.hp <= 0) {
          b.monster = m;
          return handleVictory({ ...state, player: p, battle: b, battleLog: log });
        }
      }

      // Stance momentum: build up if staying in same stance
      if (b.stance === b.lastStance && b.stance !== 'balanced') {
        b.stanceMomentum = calcStanceMomentum(b.stanceMomentum, b.stance);
      }
      b.lastStance = b.stance;

      // Tick down universal skill cooldowns
      const cds = { ...b.universalCooldowns };
      for (const key of Object.keys(cds)) {
        if (cds[key] > 0) cds[key]--;
        if (cds[key] <= 0) delete cds[key];
      }
      b.universalCooldowns = cds;

      // Tick down buffs
      if (b.avatarTurns > 0) b.avatarTurns--;
      if (b.armorBreakTurns > 0) b.armorBreakTurns--;
      if (b.elementalWardTurns > 0) b.elementalWardTurns--;
      if (b.frenzyBonusTurns > 0) b.frenzyBonusTurns--;
      if (b.playerInvulnTurns > 0) b.playerInvulnTurns--;
      if (b.armorShatterTurns > 0) {
        b.armorShatterTurns--;
        if (b.armorShatterTurns <= 0) b.armorShatterPct = 0;
      }
      if (b.warShoutTurns > 0) {
        b.warShoutTurns--;
        if (b.warShoutTurns <= 0) {
          b.warShoutAtkDebuff = 0;
          b.warShoutDefBuff = 0;
        }
      }
      // Faction: burn DoT tick
      if (b.monsterBurnTurns > 0) {
        const burnDmg = Math.floor(m.maxHp * 0.05);
        m.hp = Math.max(0, m.hp - burnDmg);
        b.monsterBurnTurns--;
        log.push({ text: `Burn deals ${burnDmg} to ${m.name}!`, type: 'dmg-monster' });
        if (m.hp <= 0) {
          b.monster = m;
          return handleVictory({ ...state, player: p, battle: b, battleLog: log });
        }
      }
      // Faction: forge shield tick
      if (b.forgeShieldTurns > 0) b.forgeShieldTurns--;
      // Faction: ancestral ward tick
      if (b.ancestralWardTurns > 0) b.ancestralWardTurns--;
      // Combo bleed tick
      if (b.comboBleedTurns > 0) {
        const bleedDmg = Math.floor(m.maxHp * (b.comboBleedPct || 0.04));
        m.hp = Math.max(0, m.hp - bleedDmg);
        b.comboBleedTurns--;
        log.push({ text: `Bleed deals ${bleedDmg} to ${m.name}!`, type: 'dmg-monster' });
        if (m.hp <= 0) {
          b.monster = m;
          return handleVictory({ ...state, player: p, battle: b, battleLog: log });
        }
      }
      // Reset parry flag at start of monster turn
      b.parrying = false;

      // ---- BOSS GIMMICK PROCESSING ----
      if (b.gimmick && m.isBoss) {
        const g = b.gimmick;
        const gd = { ...b.gimmickData };
        const hpPct = m.hp / m.maxHp;

        // Activate gimmick when HP threshold reached
        if (!b.gimmickActive && hpPct <= g.triggerHpPct) {
          b.gimmickActive = true;
          log.push({ text: `${m.name} activates ${g.name}!`, type: 'info' });
        }

        if (b.gimmickActive) {
          switch (g.type) {
            case 'regeneration':
              const regenAmt = Math.floor(m.maxHp * g.healPct);
              m = { ...m, hp: Math.min(m.maxHp, m.hp + regenAmt) };
              log.push({ text: `${m.name} regenerates ${regenAmt} HP!`, type: 'heal' });
              break;
            case 'enrage':
              if (b.turnCount % g.interval === 0) {
                gd.enrageStacks = (gd.enrageStacks || 0) + 1;
                const boost = Math.floor(m.atk * g.atkBoostPct);
                m = { ...m, atk: m.atk + boost };
                log.push({ text: `${m.name}'s rage intensifies! ATK +${boost}!`, type: 'info' });
              }
              break;
            case 'hardening':
              m = { ...m, def: m.def + g.defGainPerTurn };
              log.push({ text: `${m.name}'s coral hardens! DEF +${g.defGainPerTurn}!`, type: 'info' });
              break;
            case 'frost_aura':
              if (!gd.frostAuraApplied) {
                b.speedDebuffPct = g.speedDebuffPct;
                gd.frostAuraApplied = true;
                gd.frostAuraTurns = g.duration;
                log.push({ text: `Frost Aura slows you! Speed reduced by ${g.speedDebuffPct * 100}%!`, type: 'dmg-player' });
              }
              if (gd.frostAuraTurns > 0) {
                gd.frostAuraTurns--;
                if (gd.frostAuraTurns <= 0) b.speedDebuffPct = 0;
              }
              break;
            case 'lava_pool':
            case 'frozen_ground':
            case 'drowned_court':
            case 'gravity_well': {
              gd.dotTurns = gd.dotTurns ?? g.duration ?? 99;
              if (gd.dotTurns > 0) {
                const dotPct = g.dmgPct || g.drainPct || 0.03;
                const dotDmg = Math.floor(p.maxHp * dotPct);
                p = { ...p, hp: Math.max(0, p.hp - dotDmg) };
                gd.dotTurns--;
                log.push({ text: `${g.name} deals ${dotDmg} damage!`, type: 'dmg-player' });
              }
              break;
            }
            case 'eruption_timer': {
              gd.eruptionCounter = (gd.eruptionCounter || 0) + 1;
              const remaining = g.timer - gd.eruptionCounter;
              if (remaining > 0) {
                log.push({ text: `Volcanic Eruption in ${remaining} turns...`, type: 'info' });
              } else if (remaining === 0) {
                const eruptDmg = Math.floor(p.maxHp * g.eruptDmgPct);
                p = { ...p, hp: Math.max(0, p.hp - eruptDmg) };
                log.push({ text: `VOLCANIC ERUPTION! ${eruptDmg} damage!`, type: 'dmg-player' });
                gd.eruptionCounter = 0; // reset timer
              }
              break;
            }
            case 'decompose':
              p = { ...p, baseAtk: Math.max(1, p.baseAtk - g.atkLoss), baseDef: Math.max(0, p.baseDef - g.defLoss) };
              log.push({ text: `Decompose drains your strength! ATK -${g.atkLoss}, DEF -${g.defLoss}!`, type: 'dmg-player' });
              break;
            case 'entropy_decay':
              b.entropyAtkDecay = (b.entropyAtkDecay || 0) + g.decayPct;
              log.push({ text: `Entropy decays your power! ATK -${Math.round(g.decayPct * 100)}%!`, type: 'dmg-player' });
              break;
            case 'venom_stacks':
              gd.venomStacks = (gd.venomStacks || 0) + 1;
              log.push({ text: `Venom Stack: ${gd.venomStacks}/${g.maxStacks}`, type: 'dmg-player' });
              if (gd.venomStacks >= g.maxStacks) {
                const burstDmg = Math.floor(p.maxHp * g.burstDmgPct);
                p = { ...p, hp: Math.max(0, p.hp - burstDmg) };
                gd.venomStacks = 0;
                log.push({ text: `Venom Burst! ${burstDmg} damage!`, type: 'dmg-player' });
              }
              break;
            case 'tidal_surge':
              if (b.turnCount % g.interval === 0) {
                gd.tidalSurgeActive = true;
                log.push({ text: 'Tidal Surge! Next attack deals double damage!', type: 'info' });
              }
              break;
            case 'oblivion_countdown': {
              gd.countdown = gd.countdown ?? g.countdown;
              gd.countdown--;
              if (gd.countdown <= 0) {
                p = { ...p, hp: 0 };
                log.push({ text: 'OBLIVION! The countdown reaches zero!', type: 'dmg-player' });
              } else {
                log.push({ text: `Oblivion Countdown: ${gd.countdown}...`, type: 'info' });
              }
              break;
            }
            case 'lightning_field':
              gd.fieldTurns = gd.fieldTurns ?? g.duration;
              if (gd.fieldTurns > 0) {
                b.monsterReflectPct = g.reflectPct;
                gd.fieldTurns--;
              } else {
                b.monsterReflectPct = 0;
              }
              break;
            case 'sandstorm':
            case 'whiteout':
              gd.missTurns = gd.missTurns ?? g.duration;
              if (gd.missTurns > 0) {
                b.playerMissChance = g.missPct;
                gd.missTurns--;
              } else {
                b.playerMissChance = 0;
              }
              break;
            case 'tentacle_grab':
              gd.grabTurns = gd.grabTurns ?? g.duration;
              if (gd.grabTurns > 0) {
                b.noDefend = true;
                b.noRun = true;
                gd.grabTurns--;
                log.push({ text: 'Tentacles hold you! Cannot defend or run!', type: 'dmg-player' });
              } else {
                b.noDefend = false;
                b.noRun = false;
              }
              break;
            case 'spore_shield':
              if (b.poisonTurns > 0) {
                b.monsterDmgReduction = g.dmgReduction;
              } else {
                b.monsterDmgReduction = 0;
              }
              break;
            case 'armor_up':
              if (!gd.armorUpApplied) {
                gd.armorUpApplied = true;
                gd.armorUpTurns = g.duration;
                gd.originalDef = m.def;
                m = { ...m, def: Math.floor(m.def * g.defMult) };
                log.push({ text: `${m.name}'s defense doubled!`, type: 'info' });
              }
              if (gd.armorUpTurns > 0) {
                gd.armorUpTurns--;
                if (gd.armorUpTurns <= 0 && gd.originalDef) {
                  m = { ...m, def: gd.originalDef };
                }
              }
              break;
            case 'crystal_reflect':
              gd.reflectTurns = gd.reflectTurns ?? g.duration;
              if (gd.reflectTurns > 0) {
                b.monsterReflectPct = g.reflectPct;
                gd.reflectTurns--;
              } else {
                b.monsterReflectPct = 0;
              }
              break;
            case 'null_zone':
              gd.nullTurns = gd.nullTurns ?? g.duration;
              if (gd.nullTurns > 0) {
                gd.nullTurns--;
                log.push({ text: `Null Zone active! Passives disabled! (${gd.nullTurns} turns)`, type: 'info' });
              }
              break;
            default:
              break;
          }
        }
        b.gimmickData = gd;
      }

      // Turn-start passives (regeneration, meditation, mana regen, dark pact)
      ({ player: p, battle: b, log } = applyTurnStartPassives({ player: p, battle: b, log }));

      // ---- MONSTER STUN CHECK ----
      if (b.monsterStunTurns > 0) {
        b.monsterStunTurns--;
        log.push({ text: `${m.name} is stunned and cannot act! (${b.monsterStunTurns} turns left)`, type: 'info' });
        b.monster = m;
        b.isPlayerTurn = true;
        b.defending = false;
        if (b.playerIsFaster) {
          b.monsterNextMove = pickMonsterNextMove(m, b);
        }
        return { ...state, player: p, battle: b, battleLog: log };
      }

      // ---- MONSTER CONFUSION CHECK ----
      if (b.monsterConfusionTurns > 0) {
        b.monsterConfusionTurns--;
        const confRoll = Math.random();
        if (confRoll < 0.35) {
          // Skip turn
          log.push({ text: `${m.name} is confused and stumbles around!`, type: 'info' });
          b.monster = m;
          b.isPlayerTurn = true;
          b.defending = false;
          if (b.playerIsFaster) {
            b.monsterNextMove = pickMonsterNextMove(m, b);
          }
          return { ...state, player: p, battle: b, battleLog: log };
        } else if (confRoll < 0.55) {
          // Hit self
          const selfDmg = Math.floor(calcDamage(m.atk, 0) * 0.25);
          m = { ...m, hp: Math.max(1, m.hp - selfDmg) };
          log.push({ text: `${m.name} is confused and hits itself for ${selfDmg} damage!`, type: 'dmg-monster' });
          b.monster = m;
          b.isPlayerTurn = true;
          b.defending = false;
          if (b.playerIsFaster) {
            b.monsterNextMove = pickMonsterNextMove(m, b);
          }
          return { ...state, player: p, battle: b, battleLog: log };
        }
        // else: attack normally
        log.push({ text: `${m.name} shakes off some confusion...`, type: 'info' });
      }

      // ---- MONSTER CHANNELING ----
      if (b.monsterChanneling) {
        b.monsterChannelTurns--;
        if (b.monsterChannelTurns <= 0) {
          // Unleash the channeled attack
          const channelSkill = SKILLS[b.monsterChannelSkillId];
          if (channelSkill) {
            const unleashAtk = Math.floor(m.atk * channelSkill.unleashMult);
            let unleashDmg = calcDamage(unleashAtk, getPlayerDef(p, b));
            // Tidal surge doubles damage
            if (b.gimmickData?.tidalSurgeActive) {
              unleashDmg = Math.floor(unleashDmg * 2);
              b.gimmickData.tidalSurgeActive = false;
            }
            unleashDmg = applyDamageReduction(unleashDmg, p, b, cls);
            unleashDmg = Math.max(1, unleashDmg);
            p = { ...p, hp: Math.max(0, p.hp - unleashDmg) };
            log.push({ text: `${m.name} unleashes ${channelSkill.unleashName || 'Unleash'}! ${unleashDmg} damage!`, type: 'dmg-player' });
            // Apply unleash effect
            if (channelSkill.unleashEffect === 'poison') {
              if (!playerHasSkill(p, 'nec_t10a')) {
                b.poisonTurns = 3;
                log.push({ text: 'You are poisoned!', type: 'dmg-player' });
              }
            } else if (channelSkill.unleashEffect === 'lower_def') {
              b.defDebuff = (b.defDebuff || 0) + 3;
              log.push({ text: 'Your defense shattered!', type: 'dmg-player' });
            } else if (channelSkill.unleashEffect === 'lower_atk') {
              b.atkDebuff = (b.atkDebuff || 0) + 3;
              log.push({ text: 'Your attack weakened!', type: 'dmg-player' });
            } else if (channelSkill.unleashEffect === 'drain_hp') {
              const healed = Math.floor(unleashDmg * 0.5);
              m = { ...m, hp: Math.min(m.maxHp, m.hp + healed) };
              log.push({ text: `${m.name} drained ${healed} HP!`, type: 'heal' });
            }
          }
          b.monsterChanneling = false;
          b.monsterChannelSkillId = null;
        } else {
          log.push({ text: `${m.name} continues channeling energy... (${b.monsterChannelTurns} turns left)`, type: 'info' });
        }
      } else {
        // Normal monster attack (not channeling)
        // Stance dodge modifier
        const stanceModsDefend = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);

        // Player evasion-based dodge (separate from skill-based dodge)
        const pEvasion = getPlayerEvasion(p, b);
        const mAccuracy = m.accuracy || 4;
        const pLuckVal = getPlayerLuck(p);
        const evasionDodge = calcEvasionDodgeChance(pEvasion, mAccuracy) + luckDodgeBonus(pLuckVal) + stanceModsDefend.dodgeMod;

        // Check dodge (shadow step, evasion mastery, shadow dance, aegis)
        let dodged;
        ({ dodged, battle: b, log } = checkDodge(p, b, log));

        // Evasion dodge if skill dodge didn't trigger
        if (!dodged && evasionDodge > 0 && Math.random() < evasionDodge) {
          dodged = true;
          log.push({ text: 'You nimbly evade the attack!', type: 'info' });
        }
        if (dodged) playerDodgedThisTurn = true;

        if (!dodged) {
          // Monster AI: smarter skill selection based on situation
          let mSkillId = null;
          let mSkill = null;
          if (m.skills.length > 0) {
            const mHpPctNow = m.hp / m.maxHp;
            const pHpPctNow = p.hp / p.maxHp;
            const skillChance = prob('combat.monsterSkillChance');
            // Higher chance to use skills when either side is low HP
            const adjustedChance = Math.min(0.8, skillChance + (mHpPctNow < 0.3 ? 0.2 : 0) + (pHpPctNow < 0.3 ? 0.1 : 0));
            if (Math.random() < adjustedChance) {
              // Prioritize stun/confusion when player is healthy (crowd control)
              // Prioritize damage when player is low HP (finish them)
              // Prioritize healing/drain when monster is low HP
              const ccSkills = m.skills.filter(s => { const sk = SKILLS[s]; return sk && (sk.effect === 'stun' || sk.effect === 'confusion'); });
              const dmgSkills = m.skills.filter(s => { const sk = SKILLS[s]; return sk && sk.multiplier >= 1.2 && sk.effect !== 'channel'; });
              const drainSkills = m.skills.filter(s => { const sk = SKILLS[s]; return sk && sk.effect === 'drain_hp'; });
              const debuffSkills = m.skills.filter(s => { const sk = SKILLS[s]; return sk && (sk.effect === 'lower_def' || sk.effect === 'lower_atk' || sk.effect === 'poison'); });
              const channelSkills = m.skills.filter(s => { const sk = SKILLS[s]; return sk && sk.effect === 'channel'; });

              // Elemental awareness: prefer skills that are strong against player's class element
              const playerClassElem = getSkillElement(null, p.characterClass);
              const elemStrongSkills = m.skills.filter(s => {
                const sElem = getMonsterSkillElement(s, b.monsterElement);
                return sElem && sElem !== 'physical' && calcElementalDamageMultiplier(sElem, playerClassElem) > 1.0;
              });

              // Stance reaction: if player is in aggressive stance, use CC; if defensive, use debuffs
              const stanceReaction = b.stance === 'aggressive' ? ccSkills
                : b.stance === 'defensive' ? dmgSkills
                : b.stance === 'evasive' ? debuffSkills
                : null;

              let pool;
              if (mHpPctNow < 0.3 && drainSkills.length > 0 && Math.random() < 0.5) {
                pool = drainSkills;
              } else if (pHpPctNow < 0.3 && dmgSkills.length > 0 && Math.random() < 0.6) {
                pool = dmgSkills;
              } else if (stanceReaction && stanceReaction.length > 0 && Math.random() < 0.35) {
                pool = stanceReaction;
              } else if (elemStrongSkills.length > 0 && Math.random() < 0.4) {
                pool = elemStrongSkills;
              } else if (pHpPctNow > 0.6 && ccSkills.length > 0 && b.playerStunTurns <= 0 && b.playerConfusionTurns <= 0 && Math.random() < 0.4) {
                pool = ccSkills;
              } else if (b.turnCount <= 2 && channelSkills.length > 0 && Math.random() < 0.3) {
                pool = channelSkills;
              } else if (debuffSkills.length > 0 && Math.random() < 0.3) {
                pool = debuffSkills;
              } else {
                pool = m.skills;
              }
              mSkillId = pool[Math.floor(Math.random() * pool.length)];
              mSkill = mSkillId ? SKILLS[mSkillId] : null;
            }
          }

          // Check if monster starts channeling
          if (mSkill && mSkill.effect === 'channel') {
            b.monsterChanneling = true;
            b.monsterChannelTurns = mSkill.channelTurns || 1;
            b.monsterChannelSkillId = mSkillId;
            log.push({ text: `${m.name} begins channeling ${mSkill.name}! (${b.monsterChannelTurns} turn${b.monsterChannelTurns > 1 ? 's' : ''})`, type: 'info' });
          } else {
            // Player invulnerability from perfect parry combo
            if (b.playerInvulnTurns > 0) {
              log.push({ text: 'You are invulnerable! The attack passes through you!', type: 'info' });
              b.monster = m;
              b.isPlayerTurn = true;
              b.defending = false;
              if (b.playerIsFaster) {
                b.monsterNextMove = pickMonsterNextMove(m, b);
              }
              return { ...state, player: p, battle: b, battleLog: log };
            }

            let dmg;
            const isSkillAttack = !!mSkill;
            // Apply armor shatter to monster DEF for player's benefit (reversed: here reducing player def from monster perspective isn't right)
            // Actually armor shatter reduces MONSTER def, applied in player attacks - for monster attacks, we use player DEF normally
            if (mSkill) {
              const rawAtk = Math.floor(m.atk * mSkill.multiplier);
              dmg = calcDamage(rawAtk, getPlayerDef(p, b));
            } else {
              dmg = calcDamage(m.atk, getPlayerDef(p, b));
            }

            // Monster elemental damage bonus/penalty vs player
            const mSkillElem = isSkillAttack ? getMonsterSkillElement(mSkillId, b.monsterElement) : b.monsterElement;
            dmg = calcMonsterElementalDamage(dmg, b.monsterElement, mSkillElem, b);

            // Monster aggression: increases outgoing damage
            const mAgg = m.aggression || 0;
            if (mAgg > 0) {
              dmg = Math.floor(dmg * calcAggressionDmgDealt(mAgg));
            }

            // Tidal surge doubles damage
            if (b.gimmickData?.tidalSurgeActive) {
              dmg = Math.floor(dmg * 2);
              b.gimmickData.tidalSurgeActive = false;
              log.push({ text: 'Tidal Surge amplifies the attack!', type: 'info' });
            }

            // Monster critical hit check (reduced by player luck)
            let monsterCrit = false;
            const mCritChance = Math.max(0.01, getMonsterCritChance(m) + (m.luck || 0) * 0.003 - luckEnemyCritReduction(pLuckVal));
            if (Math.random() < mCritChance) {
              dmg = Math.floor(dmg * getMonsterCritMultiplier());
              monsterCrit = true;
            }

            // Player resistance reduces skill damage
            if (isSkillAttack) {
              const pRes = getPlayerResistance(p, b);
              if (pRes > 0) {
                const resReduct = calcResistanceReduction(pRes);
                dmg = Math.floor(dmg * (1 - resReduct));
              }
            }

            // Stance modifier on incoming damage
            dmg = Math.floor(dmg * stanceModsDefend.dmgTaken);

            // Player aggression: takes more damage
            const pAgg = getPlayerAggression(p);
            if (pAgg > 0) {
              dmg = Math.floor(dmg * calcAggressionDmgTaken(pAgg));
            }

            // Faction: Forge Shield damage reduction + thorns
            if (b.forgeShieldTurns > 0) {
              const shieldReduct = b.forgeShieldReduction || 0.25;
              const dmgBefore = dmg;
              dmg = Math.floor(dmg * (1 - shieldReduct));
              if (b.forgeShieldThorns > 0) {
                const thornsDmg = Math.floor(dmgBefore * b.forgeShieldThorns);
                m = { ...m, hp: Math.max(0, m.hp - thornsDmg) };
                log.push({ text: `Forge Shield reflects ${thornsDmg} fire damage!`, type: 'dmg-monster' });
              }
            }
            // Faction: Ancestral Ward DEF bonus (reduces incoming damage)
            if (b.ancestralWardTurns > 0 && b.ancestralWardBonus > 0) {
              dmg = Math.floor(dmg * (1 - b.ancestralWardBonus));
            }

            // Parry: massive damage reduction + counter attack
            if (b.parrying) {
              dmg = Math.floor(dmg * (1 - PARRY_DAMAGE_REDUCTION));
              log.push({ text: `Parried! Blocked ${Math.round(PARRY_DAMAGE_REDUCTION * 100)}% of damage!`, type: 'info' });
              // Counter attack (enhanced by perfect parry master)
              const counterMult = p.perfectParryMaster ? PERFECT_PARRY_COUNTER_MULTIPLIER : PARRY_COUNTER_MULTIPLIER;
              const counterDmg = Math.floor(calcDamage(Math.floor(getPlayerAtk(p, b) * counterMult), m.def));
              m = { ...m, hp: Math.max(0, m.hp - counterDmg) };
              log.push({ text: `${p.perfectParryMaster ? 'Perfect ' : ''}Counter attack for ${counterDmg} damage!`, type: 'dmg-monster' });
              b.parrying = false;
            }

            // War Shout ATK debuff on monster
            if (b.warShoutTurns > 0) {
              dmg = Math.max(1, dmg - b.warShoutAtkDebuff);
            }

            // Damage reduction passives (defend, iron skin, thick skin, fortress)
            dmg = applyDamageReduction(dmg, p, b, cls);

            // Mana Shield absorption
            const shield = applyManaShield(dmg, p);
            dmg = shield.dmg;
            if (shield.manaUsed > 0) {
              p = { ...p, mana: p.mana - shield.manaUsed };
              log.push({ text: `Mana Shield absorbs ${shield.manaUsed} damage!`, type: 'info' });
            }

            // Pet defense absorption
            const petDef = applyPetDefense(state, dmg);
            if (petDef.absorbed > 0) {
              dmg = Math.max(1, dmg - petDef.absorbed);
              log.push({ text: `Pet absorbs ${petDef.absorbed} damage!`, type: 'info' });
            }
            if (petDef.reflected > 0) {
              m = { ...m, hp: Math.max(0, m.hp - petDef.reflected) };
              log.push({ text: `Pet reflects ${petDef.reflected} damage back!`, type: 'dmg-monster' });
            }

            dmg = Math.max(1, dmg);
            p = { ...p, hp: Math.max(0, p.hp - dmg) };

            // Player fortitude: survive lethal blow once at 1 HP
            if (p.hp <= 0 && !b.fortitudeUsed) {
              const pFort = getPlayerFortitude(p);
              const surviveChance = calcFortitudeSurviveChance(pFort);
              if (surviveChance > 0 && Math.random() < surviveChance) {
                p = { ...p, hp: 1 };
                b.fortitudeUsed = true;
                log.push({ text: 'Fortitude! You endure the lethal blow at 1 HP!', type: 'info' });
              }
            }

            const critPrefix = monsterCrit ? 'CRIT! ' : '';
            if (mSkill) {
              log.push({ text: `${critPrefix}${m.name} uses ${mSkill.name} for ${dmg} damage!`, type: 'dmg-player' });
              if (mSkill.effect === 'poison') {
                if (playerHasSkill(p, 'nec_t10a')) {
                  log.push({ text: 'Lich Form: immune to poison!', type: 'info' });
                } else {
                  let dur = 3;
                  dur = reduceDurationByTenacity(dur, getPlayerTenacity(p));
                  if (playerHasSkill(p, 'brs_t7a')) dur = Math.max(1, dur - 1);
                  b.poisonTurns = dur;
                }
                log.push({ text: 'You are poisoned!', type: 'dmg-player' });
              } else if (mSkill.effect === 'lower_def') {
                b.defDebuff = (b.defDebuff || 0) + 2;
                log.push({ text: 'Your defense dropped!', type: 'dmg-player' });
              } else if (mSkill.effect === 'lower_atk') {
                b.atkDebuff = (b.atkDebuff || 0) + 2;
                log.push({ text: 'Your attack dropped!', type: 'dmg-player' });
              } else if (mSkill.effect === 'steal_gold') {
                const stolen = Math.floor(Math.random() * 10 + 1);
                p = { ...p, gold: Math.max(0, p.gold - stolen) };
                log.push({ text: `Stole ${stolen} gold!`, type: 'dmg-player' });
              } else if (mSkill.effect === 'drain_hp') {
                const healed = Math.floor(dmg * 0.5);
                m = { ...m, hp: Math.min(m.maxHp, m.hp + healed) };
                log.push({ text: `${m.name} drained ${healed} HP!`, type: 'dmg-player' });
              } else if (mSkill.effect === 'stun') {
                // Stun: chance based on STUN_BASE_CHANCE, reduced by tenacity
                const pTen = getPlayerTenacity(p);
                const stunChance = Math.max(0.1, STUN_BASE_CHANCE - pTen * 0.02);
                if (Math.random() < stunChance) {
                  const stunDur = reduceDurationByTenacity(mSkill.stunTurns || 1, pTen);
                  b.playerStunTurns = stunDur;
                  log.push({ text: `You are stunned for ${stunDur} turn${stunDur > 1 ? 's' : ''}!`, type: 'dmg-player' });
                } else {
                  log.push({ text: 'You resist the stun!', type: 'info' });
                }
              } else if (mSkill.effect === 'confusion') {
                const pTen = getPlayerTenacity(p);
                const confChance = Math.max(0.1, CONFUSION_BASE_CHANCE - pTen * 0.02);
                if (Math.random() < confChance) {
                  const confDur = reduceDurationByTenacity(mSkill.confusionTurns || 2, pTen);
                  b.playerConfusionTurns = confDur;
                  log.push({ text: `You are confused for ${confDur} turns!`, type: 'dmg-player' });
                } else {
                  log.push({ text: 'You resist the confusion!', type: 'info' });
                }
              }
            } else {
              log.push({ text: `${critPrefix}${m.name} attacks for ${dmg} damage!`, type: 'dmg-player' });
            }
          }
        }

        // Cursed Blood: chance to poison attacker when hit
        if (!dodged) {
          ({ battle: b, log } = applyCursedBlood(p, b, log));
        }
      }

      // Player poison tick
      if (b.poisonTurns > 0) {
        const poisonDmg = Math.floor(p.maxHp * 0.05);
        if (playerHasSkill(p, 'war_t9a')) {
          p = { ...p, hp: Math.max(1, p.hp - poisonDmg) };
        } else {
          p = { ...p, hp: Math.max(0, p.hp - poisonDmg) };
        }
        b.poisonTurns--;
        log.push({ text: `Poison deals ${poisonDmg} damage!`, type: 'dmg-player' });
      }

      // Player fortitude check after poison
      if (p.hp <= 0 && !b.fortitudeUsed) {
        const pFortPoison = getPlayerFortitude(p);
        const surviveChanceP = calcFortitudeSurviveChance(pFortPoison);
        if (surviveChanceP > 0 && Math.random() < surviveChanceP) {
          p = { ...p, hp: 1 };
          b.fortitudeUsed = true;
          log.push({ text: 'Fortitude! You endure at 1 HP!', type: 'info' });
        }
      }

      // Survival passives (undying will, death's embrace)
      ({ player: p, battle: b, log } = applySurvivalPassives({ player: p, battle: b, log }));

      b.monster = m;
      b.isPlayerTurn = true;
      b.defending = false;

      // Pick next monster move for preview (if player is faster)
      if (b.playerIsFaster) {
        b.monsterNextMove = pickMonsterNextMove(m, b);
      }

      // Track damage taken (difference from start hp)
      const hpLost = Math.max(0, state.player.hp - p.hp);
      if (hpLost > 0) b.damageTakenInBattle = (b.damageTakenInBattle || 0) + hpLost;
      let newStats = hpLost > 0 ? addStat(state.stats, 'damageTaken', hpLost) : state.stats;
      if (playerDodgedThisTurn) {
        newStats = addStat(newStats, 'dodgesPerformed');
      }

      if (p.hp <= 0) {
        // Boss resurrection gimmick check
        if (b.gimmick?.type === 'ash_resurrection' && !b.gimmickData?.resurrected) {
          const revHp = Math.floor(m.maxHp * b.gimmick.reviveHpPct);
          m = { ...m, hp: revHp };
          b.monster = m;
          b.gimmickData = { ...b.gimmickData, resurrected: true };
          log.push({ text: `${m.name} rises from the ashes with ${revHp} HP!`, type: 'info' });
        }

        // Phoenix pet revive check
        if (!b.petReviveUsed) {
          const activePets = getActiveBattlePets(state);
          const phoenix = activePets.find(pet => pet.ability?.reviveOnce && pet.energy > 0);
          if (phoenix) {
            const reviveHp = Math.floor(p.maxHp * 0.25);
            p = { ...p, hp: reviveHp };
            b.petReviveUsed = true;
            log.push({ text: `${phoenix.name} uses Rebirth Flame! You are revived with ${reviveHp} HP!`, type: 'heal' });
          }
        }
      }

      if (p.hp <= 0) {
        return handleDefeat({ ...state, player: p, battle: b, battleLog: log, stats: newStats });
      }

      // Boss ash resurrection check (when monster dies)
      if (m.hp <= 0 && b.gimmick?.type === 'ash_resurrection' && !b.gimmickData?.resurrected) {
        const revHp = Math.floor(m.maxHp * b.gimmick.reviveHpPct);
        m = { ...m, hp: revHp };
        b.monster = m;
        b.gimmickData = { ...b.gimmickData, resurrected: true };
        log.push({ text: `${m.name} rises from the ashes with ${revHp} HP!`, type: 'info' });
        return { ...state, player: p, battle: b, battleLog: log, stats: newStats };
      }

      return { ...state, player: p, battle: b, battleLog: log, stats: newStats };
    }

    case 'CONTINUE_AFTER_BATTLE': {
      // Arena battle return
      if (state.battleResult?.isArena) {
        if (state.arena?.gauntletActive) {
          // Gauntlet win: stay in arena region so player can continue or cash out
          return { ...state, screen: 'locations', battle: null, battleResult: null, battleLog: [] };
        }
        // Arena done (win/lose): stay in arena region
        return { ...state, screen: 'locations', battle: null, battleResult: null, battleLog: [], arena: null };
      }

      if (state.battleResult?.defeated) {
        return { ...state, screen: 'town', battle: null, battleResult: null, battleLog: [], currentLocation: null };
      }
      // If there are pending level-ups, go to stat selection
      if (state.pendingLevelUps?.length > 0) {
        return { ...state, screen: 'stat-select', battle: null, battleResult: null, battleLog: [] };
      }
      return {
        ...state, screen: 'explore', battle: null, battleResult: null, battleLog: [],
        exploreText: 'You continue exploring ' + (state.currentLocation?.name || '') + '...', exploreFoundItem: null,
      };
    }

    case 'APPLY_STAT_CHOICES': {
      const { selectedStats } = action;
      const pending = state.pendingLevelUps || [];
      if (pending.length === 0) return state;
      const current = pending[0];
      const updatedPlayer = applyStatChoices(state.player, current.offers, selectedStats);
      const remaining = pending.slice(1);
      // If more pending level-ups, stay on stat-select screen
      if (remaining.length > 0) {
        return { ...state, player: updatedPlayer, pendingLevelUps: remaining };
      }
      // All level-ups processed, continue exploring
      return {
        ...state,
        player: updatedPlayer,
        pendingLevelUps: [],
        screen: 'explore',
        exploreText: 'You continue exploring ' + (state.currentLocation?.name || '') + '...',
      };
    }

    case 'REST_AT_INN': {
      const healCost = getHealCost(state.player);
      if (state.player.gold < healCost) return { ...state, message: `Not enough gold! (${healCost}g needed)` };
      const chamberBuffs = getChamberBuffs(state.base);
      const healBonus = chamberBuffs.healBonus || 0;
      let newStats = addStat(state.stats, 'goldSpent', healCost);
      newStats = addStat(newStats, 'timesRested');
      const maxHpWithBuff = state.player.maxHp + (chamberBuffs.hpBuff || 0);
      const maxManaWithBuff = state.player.maxMana + (chamberBuffs.manaBuff || 0);
      return {
        ...state, message: healBonus > 0 ? `HP restored for ${healCost}g! (+${Math.round(healBonus * 100)}% chamber bonus)` : `HP restored for ${healCost}g!`,
        stats: newStats,
        player: {
          ...state.player,
          gold: state.player.gold - healCost,
          hp: maxHpWithBuff,
          mana: maxManaWithBuff,
        },
      };
    }

    case 'EQUIP_ITEM': {
      const item = action.item;
      if (item.level && item.level > state.player.level) {
        return { ...state, message: `You need to be level ${item.level} to equip ${item.name}!` };
      }
      if (item.classes && !item.classes.includes(state.player.characterClass)) {
        const classNames = item.classes.map(c => CHARACTER_CLASSES[c]?.name || c).join(', ');
        return { ...state, message: `${item.name} can only be equipped by: ${classNames}` };
      }
      let slot = item.slot;
      const p = { ...state.player, equipment: { ...state.player.equipment } };
      // For accessories, support dual ring slots
      if (slot === 'accessory') {
        // If a specific slot was requested (via drag-drop), use it
        if (action.targetSlot === 'accessory2') {
          slot = 'accessory2';
        } else if (action.targetSlot === 'accessory') {
          slot = 'accessory';
        } else {
          // Auto-pick: prefer empty slot, otherwise replace primary
          if (!p.equipment.accessory) {
            slot = 'accessory';
          } else if (!p.equipment.accessory2) {
            slot = 'accessory2';
          } else {
            slot = 'accessory'; // default to replacing primary
          }
        }
      }
      let inv = [...p.inventory];
      if (p.equipment[slot]) {
        inv.push(p.equipment[slot]);
      }
      p.equipment[slot] = item;
      inv = inv.filter(i => i.id !== item.id);
      p.inventory = inv;
      return { ...state, player: p };
    }

    case 'UNEQUIP_ITEM': {
      const p = { ...state.player, equipment: { ...state.player.equipment } };
      if (p.inventory.length >= p.maxInventory) return { ...state, message: 'Inventory full!' };
      const item = p.equipment[action.slot];
      if (!item) return state;
      p.inventory = [...p.inventory, item];
      p.equipment[action.slot] = null;
      return { ...state, player: p };
    }

    case 'USE_ITEM': {
      const item = action.item;
      if (item.type === 'potion') {
        const healed = Math.min(item.healAmount, state.player.maxHp - state.player.hp);
        if (healed === 0) return { ...state, message: 'HP is already full!' };
        const p = {
          ...state.player,
          hp: state.player.hp + healed,
          inventory: removeOneFromStack(state.player.inventory, item.id),
        };
        let newStats = addStat(state.stats, 'potionsUsed');
        newStats = addStat(newStats, 'totalHealing', healed);
        const newTasks = incrementTaskProgress(state.tasks, 'potionsUsed');
        return { ...state, player: p, message: `Healed ${healed} HP!`, stats: newStats, tasks: newTasks };
      }
      if (item.type === 'energy-drink') {
        const now = Date.now();
        const { energy: currentEnergy, lastEnergyUpdate: currentLEU } = regenEnergy(state.energy, state.lastEnergyUpdate, now);
        if (currentEnergy >= ENERGY_MAX) return { ...state, message: 'Energy is already full!' };
        const restored = Math.min(item.energyAmount, ENERGY_MAX - currentEnergy);
        const p = {
          ...state.player,
          inventory: removeOneFromStack(state.player.inventory, item.id),
        };
        return {
          ...state,
          player: p,
          energy: currentEnergy + restored,
          lastEnergyUpdate: now,
          message: `Restored ${restored} energy!`,
        };
      }
      // Food items: "use" feeds the incubator
      if (item.type === 'incubator-food') {
        if (!state.base.buildings.incubator?.built) return { ...state, message: 'Build an Incubator first!' };
        const now = Date.now();
        const currentFood = getIncubatorFood(state.base);
        const addMinutes = item.fuelMinutes || 0;
        const newFood = Math.min(INCUBATOR_MAX_FOOD, currentFood + addMinutes);
        const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
        return {
          ...state,
          player: p,
          base: { ...state.base, incubatorFood: newFood, incubatorFoodLastUpdate: now },
          message: `Fed incubator with ${item.name}! +${addMinutes} min`,
        };
      }
      // Loot chests: "use" opens the chest (redirects to OPEN_CHEST screen)
      if (item.type === 'loot-chest') {
        return {
          ...state,
          screen: 'chest-opening',
          pendingChest: { itemId: item.id, chestId: item.chestId },
        };
      }
      // Material items: "use" stores them in base
      if (item.type === 'material') {
        const matId = item.materialId;
        const qty = item.stackQuantity || 1;
        const mats = { ...state.base.materials };
        mats[matId] = (mats[matId] || 0) + qty;
        const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
        return {
          ...state,
          player: p,
          base: { ...state.base, materials: mats },
          message: `Stored ${qty}x ${item.name} in base.`,
        };
      }
      return state;
    }

    case 'OPEN_CHEST': {
      // Actually open the pending chest and generate loot
      const pending = state.pendingChest;
      if (!pending) return state;
      const chestDef = CHEST_LOOKUP[pending.chestId];
      if (!chestDef) return { ...state, pendingChest: null, screen: 'inventory' };

      const result = openLootChest(pending.chestId, state.player.level, state.player.characterClass);
      let p = { ...state.player, inventory: [...state.player.inventory] };

      // Remove one chest from inventory (handles stacked chests)
      p.inventory = removeOneFromStack(p.inventory, pending.itemId);

      // Add gold
      const scaledGold = scaleRewardByLevel(result.gold, p.level);
      p.gold += scaledGold;

      // Add items (up to inventory cap, stacking where possible)
      const addedItems = [];
      for (const item of result.items) {
        const chestInv = addToInventory(p.inventory, item, p.maxInventory);
        if (chestInv) {
          p.inventory = chestInv;
          addedItems.push(item);
        }
      }

      let newStats = addStat(state.stats, 'chestsOpened');
      newStats = addStat(newStats, 'goldEarned', scaledGold);
      newStats = addStat(newStats, 'goldFromChests', scaledGold);
      const newTasks = incrementTaskProgress(state.tasks, 'chestsOpened');

      return {
        ...state,
        player: p,
        stats: newStats,
        tasks: newTasks,
        chestResult: {
          chestName: chestDef.name,
          chestRarity: chestDef.rarity,
          gold: scaledGold,
          items: addedItems,
          overflowCount: result.items.length - addedItems.length,
        },
        pendingChest: null,
      };
    }

    case 'CLOSE_CHEST_RESULT': {
      return {
        ...state,
        screen: 'inventory',
        chestResult: null,
        pendingChest: null,
      };
    }

    case 'SELL_ITEM': {
      const item = action.item;
      const charismaBonus = getCharismaPriceBonus(state.player);
      const adjustedSellPrice = Math.floor(item.sellPrice * (1 + charismaBonus));
      const p = {
        ...state.player,
        gold: state.player.gold + adjustedSellPrice,
        inventory: removeOneFromStack(state.player.inventory, item.id),
      };
      let newStats = addStat(state.stats, 'itemsSold');
      newStats = addStat(newStats, 'goldEarned', item.sellPrice);
      let newTasks = incrementTaskProgress(state.tasks, 'itemsSold');
      newTasks = incrementTaskProgress(newTasks, 'goldEarned', item.sellPrice);
      return { ...state, player: p, message: `Sold for ${item.sellPrice}g!`, stats: newStats, tasks: newTasks };
    }

    case 'SELL_UNEQUIPPABLE': {
      const playerClass = state.player.characterClass;
      const playerLevel = state.player.level;
      const charismaBonus = getCharismaPriceBonus(state.player);
      const unequippable = state.player.inventory.filter(item => {
        if (!item.slot) return false;
        const levelLocked = item.level && item.level > playerLevel;
        const classLocked = !canClassEquip(item, playerClass);
        return levelLocked || classLocked;
      });
      if (unequippable.length === 0) {
        return { ...state, message: 'No unequippable equipment to sell.' };
      }
      let totalGold = 0;
      let remaining = [...state.player.inventory];
      let soldCount = 0;
      let newStats = { ...state.stats };
      let newTasks = { ...state.tasks };
      for (const item of unequippable) {
        const count = item.stackCount || 1;
        const price = Math.floor(item.sellPrice * (1 + charismaBonus));
        totalGold += price * count;
        soldCount += count;
        remaining = remaining.filter(i => i.id !== item.id);
        newStats = addStat(newStats, 'itemsSold', count);
        newStats = addStat(newStats, 'goldEarned', item.sellPrice * count);
        newTasks = incrementTaskProgress(newTasks, 'itemsSold', count);
        newTasks = incrementTaskProgress(newTasks, 'goldEarned', item.sellPrice * count);
      }
      const p = { ...state.player, gold: state.player.gold + totalGold, inventory: remaining };
      return { ...state, player: p, message: `Sold ${soldCount} unequippable item${soldCount !== 1 ? 's' : ''} for ${totalGold}g!`, stats: newStats, tasks: newTasks };
    }

    case 'REORDER_INVENTORY': {
      const inventory = state.player.inventory || [];
      if (inventory.length < 2) return state;
      const fromIndex = Math.max(0, Math.min(action.fromIndex ?? 0, inventory.length - 1));
      let toIndex = Math.max(0, Math.min(action.toIndex ?? fromIndex, inventory.length));
      if (fromIndex === toIndex || fromIndex + 1 === toIndex) return state;
      const newInventory = [...inventory];
      const [moved] = newInventory.splice(fromIndex, 1);
      if (!moved) return state;
      if (fromIndex < toIndex) toIndex -= 1;
      newInventory.splice(toIndex, 0, moved);
      return {
        ...state,
        player: { ...state.player, inventory: newInventory },
      };
    }

    case 'BUY_ITEM': {
      const item = action.item;
      const charismaBuyBonus = getCharismaPriceBonus(state.player);
      const weatherDiscount = getCurrentEffects().shopDiscount || 0;
      const adjustedBuyPrice = Math.max(1, Math.floor(item.buyPrice * (1 - charismaBuyBonus - weatherDiscount)));
      if (state.player.gold < adjustedBuyPrice) return { ...state, message: 'Not enough gold!' };
      const newItem = { ...item, id: 'item_' + Date.now() + '_' + Math.random() };
      delete newItem.buyPrice;
      delete newItem.stock;
      delete newItem.shopStockKey;
      if (!canAddToInventory(state.player.inventory, newItem, state.player.maxInventory)) return { ...state, message: 'Inventory full!' };
      // Reset shop purchases if the shop seed has changed (stock refresh)
      const currentSeed = action.shopSeed;
      let purchases = state.shopPurchases || {};
      if (currentSeed != null && state.shopPurchaseSeed !== currentSeed) {
        purchases = {};
      }
      // Check stock limit
      if (item.stock != null) {
        const stockKey = item.shopStockKey || item.name + '_' + item.level;
        const bought = purchases[stockKey] || 0;
        if (bought >= item.stock) return { ...state, message: 'Sold out!' };
      }
      const newInv = addToInventory(state.player.inventory, newItem, state.player.maxInventory);
      const p = {
        ...state.player,
        gold: state.player.gold - adjustedBuyPrice,
        inventory: newInv,
      };
      let newStats = addStat(state.stats, 'goldSpent', item.buyPrice);
      newStats = addStat(newStats, 'itemsBought');
      // Track purchase for stock
      let shopPurchases = { ...purchases };
      if (item.stock != null) {
        const stockKey = item.shopStockKey || item.name + '_' + item.level;
        shopPurchases[stockKey] = (shopPurchases[stockKey] || 0) + 1;
      }
      return { ...state, player: p, shopPurchases, shopPurchaseSeed: currentSeed ?? state.shopPurchaseSeed, message: `Purchased ${item.name}!`, stats: newStats };
    }

    case 'TRADE_MATERIALS_FOR_CHEST': {
      const chestId = action.chestId;
      const tradingChest = TRADING_CHEST_LOOKUP[chestId];
      if (!tradingChest) return { ...state, message: 'Unknown chest!' };
      if (state.player.level < tradingChest.minLevel) return { ...state, message: `Requires level ${tradingChest.minLevel}!` };

      // Check material costs against base warehouse
      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(tradingChest.materialCost)) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}! (have ${mats[matId] || 0})` };
        }
      }

      // Check inventory space
      const chestItem = createChestItem(chestId);
      if (!chestItem) return { ...state, message: 'Error creating chest!' };
      if (!canAddToInventory(state.player.inventory, chestItem, state.player.maxInventory)) {
        return { ...state, message: 'Inventory full!' };
      }

      // Deduct materials
      for (const [matId, qty] of Object.entries(tradingChest.materialCost)) {
        mats[matId] = (mats[matId] || 0) - qty;
      }

      // Add chest to inventory
      const newInv = addToInventory(state.player.inventory, chestItem, state.player.maxInventory);
      let newStats = addStat(state.stats, 'itemsBought');
      const newTasks = incrementTaskProgress(state.tasks, 'itemsBought');

      return {
        ...state,
        player: { ...state.player, inventory: newInv },
        base: { ...state.base, materials: mats },
        stats: newStats,
        tasks: newTasks,
        message: `Forged ${tradingChest.name}!`,
      };
    }

    case 'APPLY_TRADE': {
      // After accepting a trade: add received items, remove given items, adjust gold
      const { receivedItems, receivedGold, givenItems, givenGold } = action;
      let p = { ...state.player, inventory: [...state.player.inventory] };
      // Remove given items
      if (givenItems && givenItems.length > 0) {
        const givenIds = new Set(givenItems.map(i => i.id));
        p.inventory = p.inventory.filter(i => !givenIds.has(i.id));
      }
      // Add received items (with stacking)
      if (receivedItems && receivedItems.length > 0) {
        for (const ri of receivedItems) {
          const tradeInv = addToInventory(p.inventory, ri, p.maxInventory);
          if (tradeInv) p.inventory = tradeInv;
          else p.inventory = [...p.inventory, ri]; // fallback: add anyway for trades
        }
      }
      // Adjust gold
      p.gold = (p.gold || 0) + (receivedGold || 0) - (givenGold || 0);
      return { ...state, player: p, message: 'Trade completed!' };
    }

    case 'MARKET_TRANSACTION': {
      const tx = action.transaction;
      let p = { ...state.player, inventory: [...state.player.inventory] };
      if (tx.type === 'buy') {
        // Add purchased item, update gold to server-reported value
        if (tx.item) {
          const txInv = addToInventory(p.inventory, tx.item, p.maxInventory);
          p.inventory = txInv || [...p.inventory, tx.item];
        }
        if (tx.newGold !== undefined) p.gold = tx.newGold;
      } else if (tx.type === 'list') {
        // Remove listed item, update gold (listing fee deducted)
        if (tx.removedItemId) p.inventory = p.inventory.filter(i => i.id !== tx.removedItemId);
        if (tx.newGold !== undefined) p.gold = tx.newGold;
      } else if (tx.type === 'cancel') {
        // Return cancelled item to inventory
        if (tx.returnedItem) {
          const retInv = addToInventory(p.inventory, tx.returnedItem, p.maxInventory);
          p.inventory = retInv || [...p.inventory, tx.returnedItem];
        }
      }
      return { ...state, player: p };
    }

    case 'CLEAR_MESSAGE':
      return { ...state, message: null };

    case 'CLAIM_DAILY_REWARD': {
      const { rewards, label } = action;
      if (!rewards || rewards.length === 0) return state;
      let p = { ...state.player, inventory: [...state.player.inventory] };
      let newEnergy = state.energy;
      const itemNames = [];
      for (const r of rewards) {
        switch (r.kind) {
          case 'gold':
            p.gold += scaleRewardByLevel(r.amount, p.level);
            break;
          case 'energy':
            newEnergy = Math.min(ENERGY_MAX, newEnergy + r.amount);
            break;
          case 'item':
          case 'potion': {
            const generated = generateRewardItem(r, p.level);
            if (generated) {
              const rewInv = addToInventory(p.inventory, generated, p.maxInventory);
              if (rewInv) {
                p.inventory = rewInv;
                itemNames.push(generated.name);
              }
            }
            break;
          }
          case 'chest': {
            const chestItem = createChestItem(r.chestId);
            if (chestItem) {
              const chInv = addToInventory(p.inventory, chestItem, p.maxInventory);
              if (chInv) {
                p.inventory = chInv;
                itemNames.push(chestItem.name);
              }
            }
            break;
          }
        }
      }
      const msg = itemNames.length > 0
        ? `Day reward: ${label} (${itemNames.join(', ')})`
        : `Day reward: ${label}`;
      return { ...state, player: p, energy: newEnergy, message: msg };
    }

    case 'CLAIM_TASK': {
      const { taskId, taskType } = action;
      const tasks = refreshTaskCycles(state.tasks);
      const claimedKey = taskType === 'sidequest' ? 'sideQuestClaimed' : taskType + 'Claimed';
      if (tasks[claimedKey]?.includes(taskId)) return state; // already claimed

      // Quest line enforcement for tutorial, mission, sidequest
      const activeLines = tasks.activeQuestLines || [];
      if (taskType === 'tutorial') {
        if (!isQuestLineActive(activeLines, 'tutorial')) return state;
      } else if (taskType === 'mission') {
        if (!isQuestLineActive(activeLines, 'mission')) return state;
      } else if (taskType === 'sidequest') {
        const chainId = action.chainId;
        if (!chainId || !isQuestLineActive(activeLines, `side_${chainId}`)) return state;
      }

      // Find the task definition and verify completion
      const now = Date.now();
      const lvl = state.player.level || 1;
      let taskDef = null;
      let progress = 0;
      let isCompound = false;
      if (taskType === 'daily') {
        taskDef = getActiveDailyTasks(now, lvl).find(t => t.id === taskId);
        if (taskDef?.compound) {
          isCompound = true;
          progress = isCompoundQuestComplete(taskDef, tasks.dailyProgress) ? taskDef.subquests.length : 0;
        } else {
          progress = tasks.dailyProgress[taskId] || 0;
        }
      } else if (taskType === 'weekly') {
        taskDef = getActiveWeeklyTasks(now, lvl).find(t => t.id === taskId);
        if (taskDef?.compound) {
          isCompound = true;
          progress = isCompoundQuestComplete(taskDef, tasks.weeklyProgress) ? taskDef.subquests.length : 0;
        } else {
          progress = tasks.weeklyProgress[taskId] || 0;
        }
      } else if (taskType === 'monthly') {
        taskDef = getActiveMonthlyTasks(now).find(t => t.id === taskId);
        progress = tasks.monthlyProgress[taskId] || 0;
      } else if (taskType === 'story') {
        taskDef = STORY_TASKS.find(t => t.id === taskId);
        progress = state.stats[taskDef?.stat] || 0;
      } else if (taskType === 'tutorial') {
        taskDef = TUTORIAL_QUESTS.find(t => t.id === taskId);
        // Tutorial must be the current one (sequential)
        const currentTut = getCurrentTutorial(tasks.tutorialClaimed);
        if (!currentTut || currentTut.id !== taskId) return state;
        progress = getQuestProgress(state.stats, taskId, taskDef?.stat, tasks.questBaselines);
      } else if (taskType === 'mission') {
        taskDef = STORY_MISSIONS.find(t => t.id === taskId);
        if (!taskDef) return state;
        // Must have completed tutorial first
        if (!isTutorialComplete(tasks.tutorialClaimed)) return state;
        // Check chapter is unlocked (all prior chapter missions claimed)
        const unlockedCh = getUnlockedChapter(tasks.missionClaimed);
        if (taskDef.chapter > unlockedCh) return state;
        // Check order within chapter (previous missions must be claimed)
        if (taskDef.order > 1) {
          const prevMission = STORY_MISSIONS.find(m => m.chapter === taskDef.chapter && m.order === taskDef.order - 1);
          if (prevMission && !(tasks.missionClaimed || []).includes(prevMission.id)) return state;
        }
        progress = getQuestProgress(state.stats, taskId, taskDef?.stat, tasks.questBaselines);
      } else if (taskType === 'sidequest') {
        const chainId = action.chainId;
        const chain = getSideQuestChain(chainId);
        if (!chain) return state;
        taskDef = chain.quests.find(q => q.id === taskId);
        if (!taskDef) return state;
        // Must be the current quest in the chain (sequential)
        const currentSQ = getCurrentSideQuest(chainId, tasks.sideQuestClaimed);
        if (!currentSQ || currentSQ.id !== taskId) return state;
        progress = getQuestProgress(state.stats, taskId, taskDef?.stat, tasks.questBaselines);
      }

      // For compound quests, completion means all subquests are done
      if (!taskDef) return state;
      if (isCompound) {
        if (progress < taskDef.subquests.length) return state;
      } else {
        // For delivery quests with target 0, skip stat check
        if (taskDef.target > 0 && progress < taskDef.target) return state;
      }

      // Check item requirements for delivery quests
      if (taskDef.itemRequirements && taskDef.itemRequirements.length > 0) {
        const inv = state.player.inventory;
        for (const req of taskDef.itemRequirements) {
          const hasItem = inv.some(item => item.name === req.itemName && item.foundLocation === req.locationId);
          if (!hasItem) return state;
        }
      }

      // Apply reward — daily and weekly gold already scaled by scaleTask
      let p = { ...state.player, inventory: [...state.player.inventory] };

      // Remove required delivery items from inventory
      if (taskDef.itemRequirements && taskDef.itemRequirements.length > 0) {
        for (const req of taskDef.itemRequirements) {
          const idx = p.inventory.findIndex(item => item.name === req.itemName && item.foundLocation === req.locationId);
          if (idx !== -1) p.inventory.splice(idx, 1);
        }
      }
      const goldAmount = taskDef.reward.gold || 0;
      if (goldAmount) {
        p.gold += goldAmount;
      }

      // Award chest if the task reward includes one
      let chestMsg = '';
      if (taskDef.reward.chestId) {
        const chestItem = createChestItem(taskDef.reward.chestId);
        if (chestItem) {
          const chInv = addToInventory(p.inventory, chestItem, p.maxInventory);
          if (chInv) {
            p.inventory = chInv;
            chestMsg = ` + ${chestItem.name}`;
          }
        }
      }

      // Award energy drinks if the task reward includes them
      let energyMsg = '';
      if (taskDef.reward.energyDrinks && taskDef.reward.energyDrinks > 0) {
        let awarded = 0;
        for (let i = 0; i < taskDef.reward.energyDrinks; i++) {
          const drink = generateItem('energy-drink', p.level);
          if (!drink) continue;
          const drinkInv = addToInventory(p.inventory, drink, p.maxInventory);
          if (!drinkInv) break;
          p.inventory = drinkInv;
          awarded++;
        }
        if (awarded > 0) {
          energyMsg = ` + ${awarded} Energy Drink${awarded > 1 ? 's' : ''}`;
        }
      }

      let newStats = goldAmount ? addStat(state.stats, 'goldEarned', goldAmount) : state.stats;
      if (goldAmount) newStats = addStat(newStats, 'goldFromQuests', goldAmount);
      newStats = addStat(newStats, 'questsClaimed');
      const newTasks = {
        ...tasks,
        [claimedKey]: [...(tasks[claimedKey] || []), taskId],
      };

      // Set baseline for the next quest in the line so pre-existing stats don't count
      let newBaselines = { ...(newTasks.questBaselines || {}) };
      if (taskType === 'tutorial') {
        const nextQ = getCurrentTutorial(newTasks.tutorialClaimed);
        if (nextQ) newBaselines[nextQ.id] = newStats[nextQ.stat] || 0;
      } else if (taskType === 'mission') {
        const ch = getUnlockedChapter(newTasks.missionClaimed);
        const chMissions = getMissionsForChapter(ch);
        const nextQ = chMissions.find(m => !newTasks.missionClaimed.includes(m.id));
        if (nextQ) newBaselines[nextQ.id] = newStats[nextQ.stat] || 0;
      } else if (taskType === 'sidequest') {
        const chainId = action.chainId;
        const nextQ = getCurrentSideQuest(chainId, newTasks.sideQuestClaimed);
        if (nextQ) newBaselines[nextQ.id] = newStats[nextQ.stat] || 0;
      }
      newTasks.questBaselines = newBaselines;

      // Auto-remove from pinned if it was pinned
      if (newTasks.pinnedQuests?.includes(taskId)) {
        newTasks.pinnedQuests = newTasks.pinnedQuests.filter(id => id !== taskId);
      }

      // Auto-remove completed quest lines from active slots
      if (taskType === 'tutorial' && isTutorialComplete(newTasks.tutorialClaimed)) {
        newTasks.activeQuestLines = (newTasks.activeQuestLines || []).filter(k => k !== 'tutorial');
      } else if (taskType === 'mission') {
        // Check if all missions across all chapters are done
        const allMissionsDone = STORY_MISSIONS.every(m => newTasks.missionClaimed.includes(m.id));
        if (allMissionsDone) {
          newTasks.activeQuestLines = (newTasks.activeQuestLines || []).filter(k => k !== 'mission');
        }
      } else if (taskType === 'sidequest') {
        const chainId = action.chainId;
        if (isSideChainComplete(chainId, newTasks.sideQuestClaimed)) {
          newTasks.activeQuestLines = (newTasks.activeQuestLines || []).filter(k => k !== `side_${chainId}`);
        }
      }

      return {
        ...state,
        player: p,
        stats: newStats,
        tasks: newTasks,
        message: `Task complete: ${taskDef.name}! +${goldAmount}g${chestMsg}${energyMsg}`,
      };
    }

    case 'PIN_QUEST': {
      const { questId } = action;
      const pinned = state.tasks.pinnedQuests || [];
      if (pinned.includes(questId)) return state;
      if (pinned.length >= 3) return { ...state, message: 'Max 3 pinned quests. Unpin one first.' };
      return {
        ...state,
        tasks: { ...state.tasks, pinnedQuests: [...pinned, questId] },
        message: 'Quest pinned!',
      };
    }

    case 'UNPIN_QUEST': {
      const { questId } = action;
      const pinned = state.tasks.pinnedQuests || [];
      if (!pinned.includes(questId)) return state;
      return {
        ...state,
        tasks: { ...state.tasks, pinnedQuests: pinned.filter(id => id !== questId) },
        message: 'Quest unpinned.',
      };
    }

    case 'ACTIVATE_QUEST_LINE': {
      const { lineKey } = action;
      const active = state.tasks.activeQuestLines || [];
      if (active.includes(lineKey)) return state;
      if (active.length >= MAX_ACTIVE_QUEST_LINES) {
        return { ...state, message: `Max ${MAX_ACTIVE_QUEST_LINES} quest lines active. Abandon one first.` };
      }
      // Validate the line key
      if (lineKey === 'tutorial' && isTutorialComplete(state.tasks.tutorialClaimed)) {
        return { ...state, message: 'Tutorial already completed.' };
      }
      if (lineKey === 'mission' && !isTutorialComplete(state.tasks.tutorialClaimed || [])) {
        return { ...state, message: 'Complete the tutorial first.' };
      }
      if (lineKey === 'mission') {
        const allDone = STORY_MISSIONS.every(m => (state.tasks.missionClaimed || []).includes(m.id));
        if (allDone) return { ...state, message: 'All story missions completed.' };
      }
      if (lineKey.startsWith('side_')) {
        const chainId = lineKey.replace('side_', '');
        const chain = getSideQuestChain(chainId);
        if (!chain) return state;
        if (chain.levelReq && state.player.level < chain.levelReq) {
          return { ...state, message: `Requires level ${chain.levelReq} to activate.` };
        }
        if (isSideChainComplete(chainId, state.tasks.sideQuestClaimed)) {
          return { ...state, message: 'This quest chain is already completed.' };
        }
      }
      // Snapshot stat baselines for the current quest in this line
      let newBaselines = { ...(state.tasks.questBaselines || {}) };
      if (lineKey === 'tutorial') {
        const currentQ = getCurrentTutorial(state.tasks.tutorialClaimed || []);
        if (currentQ) newBaselines[currentQ.id] = state.stats[currentQ.stat] || 0;
      } else if (lineKey === 'mission') {
        const mClaimed = state.tasks.missionClaimed || [];
        const ch = getUnlockedChapter(mClaimed);
        const chMissions = getMissionsForChapter(ch);
        const currentQ = chMissions.find(m => !mClaimed.includes(m.id));
        if (currentQ) newBaselines[currentQ.id] = state.stats[currentQ.stat] || 0;
      } else if (lineKey.startsWith('side_')) {
        const chainId = lineKey.replace('side_', '');
        const currentQ = getCurrentSideQuest(chainId, state.tasks.sideQuestClaimed || []);
        if (currentQ) newBaselines[currentQ.id] = state.stats[currentQ.stat] || 0;
      }
      return {
        ...state,
        tasks: { ...state.tasks, activeQuestLines: [...active, lineKey], questBaselines: newBaselines },
        message: 'Quest line activated!',
      };
    }

    case 'ABANDON_QUEST_LINE': {
      const { lineKey } = action;
      const active = state.tasks.activeQuestLines || [];
      if (!active.includes(lineKey)) return state;
      // Also remove any pinned quests from this line
      let newPinned = state.tasks.pinnedQuests || [];
      if (lineKey === 'tutorial') {
        const tutIds = TUTORIAL_QUESTS.map(q => q.id);
        newPinned = newPinned.filter(id => !tutIds.includes(id));
      } else if (lineKey === 'mission') {
        const mIds = STORY_MISSIONS.map(q => q.id);
        newPinned = newPinned.filter(id => !mIds.includes(id));
      } else if (lineKey.startsWith('side_')) {
        const chainId = lineKey.replace('side_', '');
        const chain = getSideQuestChain(chainId);
        if (chain) {
          const sIds = chain.quests.map(q => q.id);
          newPinned = newPinned.filter(id => !sIds.includes(id));
        }
      }
      // Clear baselines for quests in this line so re-activation gets fresh baselines
      let newBaselines = { ...(state.tasks.questBaselines || {}) };
      if (lineKey === 'tutorial') {
        TUTORIAL_QUESTS.forEach(q => { delete newBaselines[q.id]; });
      } else if (lineKey === 'mission') {
        STORY_MISSIONS.forEach(q => { delete newBaselines[q.id]; });
      } else if (lineKey.startsWith('side_')) {
        const cId = lineKey.replace('side_', '');
        const ch = getSideQuestChain(cId);
        if (ch) ch.quests.forEach(q => { delete newBaselines[q.id]; });
      }
      return {
        ...state,
        tasks: {
          ...state.tasks,
          activeQuestLines: active.filter(k => k !== lineKey),
          pinnedQuests: newPinned,
          questBaselines: newBaselines,
        },
        message: 'Quest line abandoned.',
      };
    }

    case 'ENERGY_TICK': {
      const now = action.now ?? Date.now();
      const { energy, lastEnergyUpdate } = regenEnergy(state.energy, state.lastEnergyUpdate, now);
      // Passive HP/Mana regen only when not in battle
      const inBattle = state.screen === 'battle' || state.screen === 'boss-confirm';
      let newPlayer = state.player;
      let newLastHpManaRegen = state.lastHpManaRegenUpdate;
      if (!inBattle) {
        const hmRegen = regenHpMana(state.player, state.lastHpManaRegenUpdate, now);
        newPlayer = hmRegen.player;
        newLastHpManaRegen = hmRegen.lastHpManaRegenUpdate;
      } else {
        // Reset timer while in battle so it doesn't accumulate
        newLastHpManaRegen = now;
      }
      const energyChanged = energy !== state.energy || lastEnergyUpdate !== state.lastEnergyUpdate;
      const playerChanged = newPlayer !== state.player;
      const hpManaTimerChanged = newLastHpManaRegen !== state.lastHpManaRegenUpdate;
      if (!energyChanged && !playerChanged && !hpManaTimerChanged) return state;
      return { ...state, energy, lastEnergyUpdate, player: newPlayer, lastHpManaRegenUpdate: newLastHpManaRegen };
    }

    // ========== BASE BUILDING SYSTEM ==========

    case 'BASE_BUILD': {
      const buildingDef = BUILDINGS[action.buildingId];
      if (!buildingDef) return state;
      if (state.base.buildings[action.buildingId]?.built) return { ...state, message: 'Already built!' };
      if (state.player.level < buildingDef.levelReq) return { ...state, message: `Requires level ${buildingDef.levelReq}!` };

      const cost = buildingDef.buildCost;
      if (state.player.gold < cost.gold) return { ...state, message: `Need ${cost.gold}g! (have ${state.player.gold}g)` };

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}! (have ${mats[matId] || 0})` };
        }
      }

      // Deduct costs
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        mats[matId] = (mats[matId] || 0) - qty;
      }

      const newBase = {
        ...state.base,
        materials: mats,
        buildings: { ...state.base.buildings, [action.buildingId]: { built: true, level: 1 } },
      };

      // Farm: initialize empty plots
      if (action.buildingId === 'farm') {
        newBase.farmPlots = Array(buildingDef.plots).fill(null);
      }

      // Incubator: initialize empty slots
      if (action.buildingId === 'incubator') {
        newBase.incubatorLevel = 1;
        newBase.incubatorSlots = Array(BUILDINGS.incubator.upgrades[0].slots).fill(null);
      }

      // Warehouse: set initial level and increase maxInventory
      const newPlayer = { ...state.player, gold: state.player.gold - cost.gold };
      if (action.buildingId === 'warehouse') {
        newBase.warehouseLevel = 1;
        const bonus = BUILDINGS.warehouse.upgrades[0].inventoryBonus;
        newPlayer.maxInventory = (state.player.maxInventory || 30) + bonus;
      }

      return {
        ...state,
        base: newBase,
        player: newPlayer,
        message: `${buildingDef.name} constructed!`,
      };
    }

    case 'BASE_ADD_FUEL': {
      const item = action.item;
      if (!item || item.type !== 'material' || !item.isFuel) return { ...state, message: 'This item cannot be used as fuel!' };
      const fuelData = FUEL_ITEMS[item.materialId];
      if (!fuelData) return { ...state, message: 'Not a valid fuel!' };

      const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
      const now = Date.now();
      let currentFuel = state.base.fuel || 0;
      // Recalculate elapsed fuel
      if (state.base.fuelLastUpdate) {
        const elapsed = (now - state.base.fuelLastUpdate) / 60000; // minutes
        currentFuel = Math.max(0, currentFuel - elapsed);
      }

      return {
        ...state,
        player: p,
        base: {
          ...state.base,
          fuel: currentFuel + fuelData.burnTime,
          fuelLastUpdate: now,
        },
        message: `Added ${fuelData.name}! +${fuelData.burnTime} min fuel.`,
      };
    }

    case 'BASE_ADD_FUEL_FROM_STORAGE': {
      const matId = action.materialId;
      const fuelData = FUEL_ITEMS[matId];
      if (!fuelData) return { ...state, message: 'Not a valid fuel!' };
      const mats = { ...state.base.materials };
      if ((mats[matId] || 0) < 1) return { ...state, message: 'No fuel materials in storage!' };
      mats[matId] = (mats[matId] || 0) - 1;

      const now = Date.now();
      let currentFuel = state.base.fuel || 0;
      if (state.base.fuelLastUpdate) {
        const elapsed = (now - state.base.fuelLastUpdate) / 60000;
        currentFuel = Math.max(0, currentFuel - elapsed);
      }

      return {
        ...state,
        base: { ...state.base, materials: mats, fuel: currentFuel + fuelData.burnTime, fuelLastUpdate: now },
        message: `Burned ${fuelData.name}! +${fuelData.burnTime} min fuel.`,
      };
    }

    case 'BASE_STORE_MATERIAL': {
      const item = action.item;
      if (!item || item.type !== 'material') return state;
      const matId = item.materialId;
      const qty = item.stackQuantity || 1;
      const mats = { ...state.base.materials };
      mats[matId] = (mats[matId] || 0) + qty;
      const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
      return {
        ...state,
        player: p,
        base: { ...state.base, materials: mats },
        message: `Stored ${qty}x ${item.name}.`,
      };
    }

    case 'BASE_WITHDRAW_MATERIAL': {
      const wMatId = action.materialId;
      const wMats = { ...state.base.materials };
      if ((wMats[wMatId] || 0) < 1) return { ...state, message: 'No materials to withdraw!' };
      const matDef = BUILDING_MATERIALS[wMatId];
      if (!matDef) return state;
      const matItem = createMaterialItem(wMatId, 1);
      if (!matItem) return state;
      const wInv = addToInventory(state.player.inventory, matItem, state.player.maxInventory);
      if (!wInv) return { ...state, message: 'Inventory is full!' };
      wMats[wMatId] = wMats[wMatId] - 1;
      return {
        ...state,
        player: { ...state.player, inventory: wInv },
        base: { ...state.base, materials: wMats },
        message: `Withdrew 1x ${matDef.name}.`,
      };
    }

    case 'BASE_BREW': {
      if (!state.base.buildings.brewery?.built) return { ...state, message: 'Build a Brewery first!' };
      if (state.base.craftingQueue) return { ...state, message: 'Already crafting something!' };

      // Check fuel
      const now = Date.now();
      let currentFuel = state.base.fuel || 0;
      if (state.base.fuelLastUpdate) {
        const elapsed = (now - state.base.fuelLastUpdate) / 60000;
        currentFuel = Math.max(0, currentFuel - elapsed);
      }
      if (currentFuel <= 0) return { ...state, message: 'No fuel! Add wood, charcoal, or other fuel.' };

      const recipe = BREWERY_RECIPES.find(r => r.id === action.recipeId);
      if (!recipe) return state;
      if (recipe.tavernNpc && recipe.tavernReqRep) {
        const tRep = state.tavern?.reputation?.[recipe.tavernNpc] || 0;
        if (getRepLevel(tRep).level < recipe.tavernReqRep) return { ...state, message: 'Not enough tavern reputation!' };
      }

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        mats[matId] -= qty;
      }

      return {
        ...state,
        base: {
          ...state.base,
          materials: mats,
          fuel: currentFuel,
          fuelLastUpdate: now,
          craftingQueue: { recipeId: recipe.id, building: 'brewery', startTime: now, craftTime: recipe.craftTime },
        },
        message: `Brewing ${recipe.name}...`,
      };
    }

    case 'BASE_SMELT': {
      if (!state.base.buildings.smelter?.built) return { ...state, message: 'Build a Smelter first!' };
      if (state.base.craftingQueue) return { ...state, message: 'Already crafting something!' };

      const now = Date.now();
      let currentFuel = state.base.fuel || 0;
      if (state.base.fuelLastUpdate) {
        const elapsed = (now - state.base.fuelLastUpdate) / 60000;
        currentFuel = Math.max(0, currentFuel - elapsed);
      }
      if (currentFuel <= 0) return { ...state, message: 'No fuel! Add wood, charcoal, or other fuel.' };

      const recipe = SMELTER_RECIPES.find(r => r.id === action.recipeId);
      if (!recipe) return state;
      if (recipe.tavernNpc && recipe.tavernReqRep) {
        const tRep = state.tavern?.reputation?.[recipe.tavernNpc] || 0;
        if (getRepLevel(tRep).level < recipe.tavernReqRep) return { ...state, message: 'Not enough tavern reputation!' };
      }

      const mats = { ...state.base.materials };
      if (recipe.materials) {
        for (const [matId, qty] of Object.entries(recipe.materials)) {
          if ((mats[matId] || 0) < qty) {
            const matName = BUILDING_MATERIALS[matId]?.name || matId;
            return { ...state, message: `Need ${qty}x ${matName}!` };
          }
        }
        for (const [matId, qty] of Object.entries(recipe.materials)) {
          mats[matId] -= qty;
        }
      }

      // Handle salvage gear (smelt equipment from inventory)
      let p = state.player;
      if (recipe.salvageGear) {
        const gearItem = action.gearItem;
        if (!gearItem || !gearItem.slot) return { ...state, message: 'Select an equipment item to salvage!' };
        p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== gearItem.id) };
      }

      return {
        ...state,
        player: p,
        base: {
          ...state.base,
          materials: mats,
          fuel: currentFuel,
          fuelLastUpdate: now,
          craftingQueue: { recipeId: recipe.id, building: 'smelter', startTime: now, craftTime: recipe.craftTime },
        },
        message: `Smelting ${recipe.name}...`,
      };
    }

    case 'BASE_CRAFT': {
      if (!state.base.buildings.workshop?.built) return { ...state, message: 'Build a Workshop first!' };
      if (state.base.craftingQueue) return { ...state, message: 'Already crafting something!' };

      const now = Date.now();
      let currentFuel = state.base.fuel || 0;
      if (state.base.fuelLastUpdate) {
        const elapsed = (now - state.base.fuelLastUpdate) / 60000;
        currentFuel = Math.max(0, currentFuel - elapsed);
      }
      if (currentFuel <= 0) return { ...state, message: 'No fuel! Add wood, charcoal, or other fuel.' };

      const recipe = WORKSHOP_RECIPES.find(r => r.id === action.recipeId);
      if (!recipe) return state;
      if (recipe.tavernNpc && recipe.tavernReqRep) {
        const tRep = state.tavern?.reputation?.[recipe.tavernNpc] || 0;
        if (getRepLevel(tRep).level < recipe.tavernReqRep) return { ...state, message: 'Not enough tavern reputation!' };
      }

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        mats[matId] -= qty;
      }

      return {
        ...state,
        base: {
          ...state.base,
          materials: mats,
          fuel: currentFuel,
          fuelLastUpdate: now,
          craftingQueue: { recipeId: recipe.id, building: 'workshop', startTime: now, craftTime: recipe.craftTime },
        },
        message: `Crafting ${recipe.name}...`,
      };
    }

    case 'BASE_COLLECT_CRAFT': {
      const queue = state.base.craftingQueue;
      if (!queue) return { ...state, message: 'Nothing is being crafted!' };
      const now = Date.now();
      if (now - queue.startTime < queue.craftTime) return { ...state, message: 'Still crafting...' };

      let p = { ...state.player, inventory: [...state.player.inventory] };
      let msg = 'Collected!';

      if (queue.building === 'brewery') {
        const recipe = BREWERY_RECIPES.find(r => r.id === queue.recipeId);
        if (recipe) {
          const item = generateItem(recipe.result.type, Math.max(1, state.player.level));
          if (item) {
            const brewInv = addToInventory(p.inventory, item, p.maxInventory);
            if (brewInv) {
              p.inventory = brewInv;
              msg = `Brewed ${item.name}!`;
            } else {
              return { ...state, message: 'Inventory full!' };
            }
          }
        }
      } else if (queue.building === 'smelter') {
        const recipe = SMELTER_RECIPES.find(r => r.id === queue.recipeId);
        if (recipe?.result) {
          const mats = { ...state.base.materials };
          mats[recipe.result.materialId] = (mats[recipe.result.materialId] || 0) + recipe.result.quantity;
          const matName = BUILDING_MATERIALS[recipe.result.materialId]?.name || recipe.result.materialId;
          msg = `Smelted ${recipe.result.quantity}x ${matName}!`;
          return {
            ...state,
            player: p,
            base: { ...state.base, materials: mats, craftingQueue: null },
            message: msg,
          };
        }
      } else if (queue.building === 'workshop') {
        const recipe = WORKSHOP_RECIPES.find(r => r.id === queue.recipeId);
        if (recipe?.result?.ticketRegionId) {
          // Ticket crafting
          const ticketItem = createTicketItem(recipe.result.ticketRegionId);
          if (ticketItem) {
            const ticketInv = addToInventory(p.inventory, ticketItem, p.maxInventory);
            if (ticketInv) {
              p.inventory = ticketInv;
              msg = `Forged ${ticketItem.name}!`;
            } else {
              return { ...state, message: 'Inventory full!' };
            }
          }
        } else if (recipe?.result?.template) {
          const item = generateCraftedItem(recipe.result.template, state.player.level);
          if (item) {
            const craftInv = addToInventory(p.inventory, item, p.maxInventory);
            if (craftInv) {
              p.inventory = craftInv;
              msg = `Crafted ${item.name}!`;
            } else {
              return { ...state, message: 'Inventory full!' };
            }
          }
        }
      }

      return {
        ...state,
        player: p,
        base: { ...state.base, craftingQueue: null },
        message: msg,
      };
    }

    case 'BASE_UPGRADE_INN': {
      if (!state.base.buildings.inn?.built) return { ...state, message: 'Build an Inn first!' };
      const currentLevel = state.base.innLevel || 1;
      const nextUpgrade = BUILDINGS.inn.upgrades.find(u => u.level === currentLevel + 1);
      if (!nextUpgrade) return { ...state, message: 'Inn is at max level!' };
      const cost = nextUpgrade.upgradeCost;
      if (!cost) return state;
      if (state.player.gold < cost.gold) return { ...state, message: `Need ${cost.gold}g!` };

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        mats[matId] -= qty;
      }

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cost.gold },
        base: { ...state.base, materials: mats, innLevel: currentLevel + 1 },
        message: `Inn upgraded to ${nextUpgrade.name}! ${nextUpgrade.desc}`,
      };
    }

    case 'BASE_BUY_INN_BOOST': {
      if (!state.base.buildings.inn?.built) return { ...state, message: 'Build an Inn first!' };
      const innLvl = state.base.innLevel || 1;
      const tierData = BUILDINGS.inn.upgrades.find(u => u.level === innLvl);
      if (!tierData || !tierData.boosts) return state;
      const boost = tierData.boosts.find(b => b.id === action.boostId);
      if (!boost) return state;
      if (state.player.gold < boost.cost) return { ...state, message: `Need ${boost.cost}g!` };

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - boost.cost },
        base: {
          ...state.base,
          innBoost: {
            expBonus: tierData.expBonus,
            startTime: Date.now(),
            duration: boost.duration,
            boostName: boost.name,
          },
        },
        message: `${boost.name} activated! ${boost.desc}`,
      };
    }

    case 'BASE_UPGRADE_CHAMBER': {
      if (!state.base.buildings.chamber?.built) return { ...state, message: 'Build a Chamber first!' };
      const subId = action.subUpgradeId; // 'bed', 'kitchen', 'study'
      const subDef = BUILDINGS.chamber.subUpgrades[subId];
      if (!subDef) return state;

      const currentLevel = (state.base.chamberUpgrades || {})[subId] || 0;
      const nextLevel = subDef.levels[currentLevel]; // 0-indexed, currentLevel is next to unlock
      if (!nextLevel) return { ...state, message: `${subDef.name} is at max level!` };

      const cost = nextLevel.cost;
      if (state.player.gold < cost.gold) return { ...state, message: `Need ${cost.gold}g!` };

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        mats[matId] -= qty;
      }

      const chamberUpgrades = { ...state.base.chamberUpgrades, [subId]: currentLevel + 1 };

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cost.gold },
        base: { ...state.base, materials: mats, chamberUpgrades },
        message: `${nextLevel.name} installed! ${nextLevel.desc}`,
      };
    }

    // ---- FARM ----
    case 'BASE_FARM_PLANT': {
      if (!state.base.buildings.farm?.built) return { ...state, message: 'Build a Farm first!' };
      const plotIndex = action.plotIndex;
      const cropId = action.cropId;
      const cropDef = BUILDINGS.farm.crops.find(c => c.id === cropId);
      if (!cropDef) return state;
      const plots = [...(state.base.farmPlots || [])];
      if (plotIndex < 0 || plotIndex >= plots.length) return state;
      if (plots[plotIndex] !== null) return { ...state, message: 'Plot already planted!' };
      if (state.player.gold < cropDef.cost.gold) return { ...state, message: `Need ${cropDef.cost.gold}g to plant!` };

      plots[plotIndex] = { cropId, plantedAt: Date.now() };
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cropDef.cost.gold },
        base: { ...state.base, farmPlots: plots },
        message: `Planted ${cropDef.name}!`,
      };
    }

    case 'BASE_FARM_PLANT_SEED': {
      if (!state.base.buildings.farm?.built) return { ...state, message: 'Build a Farm first!' };
      const seedPlotIndex = action.plotIndex;
      const seedItemId = action.seedItemId;
      const seedItem = state.player.inventory.find(i => i.id === seedItemId && i.type === 'seed');
      if (!seedItem) return { ...state, message: 'Seed not found in inventory!' };
      const seedDef = FARM_SEEDS[seedItem.seedId];
      if (!seedDef) return state;
      const seedPlots = [...(state.base.farmPlots || [])];
      if (seedPlotIndex < 0 || seedPlotIndex >= seedPlots.length) return state;
      if (seedPlots[seedPlotIndex] !== null) return { ...state, message: 'Plot already planted!' };

      seedPlots[seedPlotIndex] = { seedId: seedItem.seedId, plantedAt: Date.now(), isSeed: true };
      const seedInv = removeOneFromStack(state.player.inventory, seedItemId);
      return {
        ...state,
        player: { ...state.player, inventory: seedInv },
        base: { ...state.base, farmPlots: seedPlots },
        message: `Planted ${seedDef.name}!`,
      };
    }

    case 'BASE_FARM_HARVEST': {
      if (!state.base.buildings.farm?.built) return { ...state, message: 'Build a Farm first!' };
      const hPlotIndex = action.plotIndex;
      const plots = [...(state.base.farmPlots || [])];
      const plot = plots[hPlotIndex];
      if (!plot) return { ...state, message: 'Nothing planted here!' };

      // Handle seed-based crops
      if (plot.isSeed) {
        const seedDef = FARM_SEEDS[plot.seedId];
        if (!seedDef) return state;
        const seedElapsed = Date.now() - plot.plantedAt;
        if (seedElapsed < seedDef.growTime) return { ...state, message: 'Not ready yet!' };

        plots[hPlotIndex] = null;
        const quality = rollCropQuality();
        const cropItem = createCropItem(plot.seedId, quality);
        if (!cropItem) return state;

        const cropInv = addToInventory(state.player.inventory, cropItem, state.player.maxInventory);
        if (!cropInv) {
          return { ...state, base: { ...state.base, farmPlots: plots }, message: `Harvested ${cropItem.name} but your inventory is full! The crop was lost.` };
        }

        return {
          ...state,
          player: { ...state.player, inventory: cropInv },
          base: { ...state.base, farmPlots: plots },
          message: `Harvested ${quality.name} ${seedDef.cropName}! (Sell value: ${cropItem.sellPrice}g)`,
        };
      }

      const hCropDef = BUILDINGS.farm.crops.find(c => c.id === plot.cropId);
      if (!hCropDef) return state;
      const elapsed = Date.now() - plot.plantedAt;
      if (elapsed < hCropDef.growTime) return { ...state, message: 'Not ready yet!' };

      // Clear the plot
      plots[hPlotIndex] = null;
      const newMats = { ...state.base.materials };
      let harvestMsg = '';

      // Create food item from crop (if inventory has space)
      const foodItem = createCropFoodItem(hCropDef);
      const canAddFood = foodItem && state.player.inventory.length < state.player.maxInventory;
      const newInv = canAddFood ? [...state.player.inventory, foodItem] : [...state.player.inventory];
      const foodMsg = canAddFood ? ` + ${foodItem.name} (+${foodItem.fuelMinutes}min food)` : '';

      if (hCropDef.yield.gold) {
        const [minG, maxG] = hCropDef.yield.gold;
        const goldYield = minG + Math.floor(Math.random() * (maxG - minG + 1));
        return {
          ...state,
          player: { ...state.player, gold: state.player.gold + goldYield, inventory: newInv },
          base: { ...state.base, farmPlots: plots },
          message: `Harvested ${hCropDef.name}! +${goldYield}g${foodMsg}`,
        };
      }

      const [minQ, maxQ] = hCropDef.yield.qty;
      const qty = minQ + Math.floor(Math.random() * (maxQ - minQ + 1));
      const matId = hCropDef.yield.materialId;
      newMats[matId] = (newMats[matId] || 0) + qty;
      harvestMsg = `Harvested ${hCropDef.name}! +${qty}x ${BUILDING_MATERIALS[matId]?.name || matId}${foodMsg}`;

      return {
        ...state,
        player: { ...state.player, inventory: newInv },
        base: { ...state.base, farmPlots: plots, materials: newMats },
        message: harvestMsg,
      };
    }

    // ---- WAREHOUSE ----
    case 'BASE_UPGRADE_WAREHOUSE': {
      if (!state.base.buildings.warehouse?.built) return { ...state, message: 'Build a Warehouse first!' };
      const currentWLevel = state.base.warehouseLevel || 1;
      const nextWUpgrade = BUILDINGS.warehouse.upgrades.find(u => u.level === currentWLevel + 1);
      if (!nextWUpgrade) return { ...state, message: 'Warehouse is at max level!' };
      const wCost = nextWUpgrade.upgradeCost;
      if (!wCost) return state;
      if (state.player.gold < wCost.gold) return { ...state, message: `Need ${wCost.gold}g!` };

      const wMats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(wCost.materials || {})) {
        if ((wMats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(wCost.materials || {})) {
        wMats[matId] -= qty;
      }

      const prevBonus = BUILDINGS.warehouse.upgrades.find(u => u.level === currentWLevel)?.inventoryBonus || 0;
      const newBonus = nextWUpgrade.inventoryBonus;
      const inventoryIncrease = newBonus - prevBonus;

      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - wCost.gold,
          maxInventory: (state.player.maxInventory || 30) + inventoryIncrease,
        },
        base: { ...state.base, materials: wMats, warehouseLevel: currentWLevel + 1 },
        message: `${nextWUpgrade.name}! ${nextWUpgrade.desc}`,
      };
    }

    // ---- INCUBATOR ----
    case 'BASE_PLACE_EGG': {
      if (!state.base.buildings.incubator?.built) return { ...state, message: 'Build an Incubator first!' };
      const eggItem = state.player.inventory.find(i => i.id === action.itemId && i.type === 'egg');
      if (!eggItem) return { ...state, message: 'Egg not found in inventory!' };

      // Check food level
      const currentFood = getIncubatorFood(state.base);
      if (currentFood <= 0) return { ...state, message: 'Incubator has no food! Add food from the Grocery shop first.' };

      const maxSlots = getIncubatorSlots(state.base);
      const slots = [...(state.base.incubatorSlots || [])];
      // Find empty slot
      let placed = false;
      const now = Date.now();
      for (let i = 0; i < maxSlots; i++) {
        if (!slots[i]) {
          slots[i] = { eggId: eggItem.eggId, placedAt: now, itemName: eggItem.name, rarity: eggItem.rarity };
          placed = true;
          break;
        }
      }
      if (!placed) return { ...state, message: 'All incubator slots are full!' };

      return {
        ...state,
        player: { ...state.player, inventory: removeOneFromStack(state.player.inventory, action.itemId) },
        base: { ...state.base, incubatorSlots: slots, incubatorFood: currentFood, incubatorFoodLastUpdate: now },
        message: `Placed ${eggItem.name} in the incubator!`,
      };
    }

    case 'BASE_FEED_INCUBATOR': {
      if (!state.base.buildings.incubator?.built) return { ...state, message: 'Build an Incubator first!' };
      const foodItem = state.player.inventory.find(i => i.id === action.itemId && i.type === 'incubator-food');
      if (!foodItem) return { ...state, message: 'Food item not found!' };

      const now = Date.now();
      const currentFood = getIncubatorFood(state.base);
      const addMinutes = foodItem.fuelMinutes || 0;
      const newFood = Math.min(INCUBATOR_MAX_FOOD, currentFood + addMinutes);

      return {
        ...state,
        player: { ...state.player, inventory: removeOneFromStack(state.player.inventory, action.itemId) },
        base: { ...state.base, incubatorFood: newFood, incubatorFoodLastUpdate: now },
        message: `Fed incubator with ${foodItem.name}! +${addMinutes} min (${Math.floor(newFood)} / ${INCUBATOR_MAX_FOOD} min)`,
      };
    }

    case 'BASE_COLLECT_HATCH': {
      if (!state.base.buildings.incubator?.built) return { ...state, message: 'Build an Incubator first!' };
      const slotIdx = action.slotIndex;
      const slots = [...(state.base.incubatorSlots || [])];
      const slot = slots[slotIdx];
      if (!slot) return { ...state, message: 'Nothing in that slot!' };

      const eggDef = EGG_TYPES[slot.eggId];
      if (!eggDef) return { ...state, message: 'Unknown egg type!' };

      const speedBonus = getIncubatorSpeedBonus(state.base);
      const effectiveTime = eggDef.incubateTime * (1 - speedBonus);

      // Calculate actual incubation progress considering food availability
      // Eggs only progress when food > 0
      const now = Date.now();
      const elapsed = now - slot.placedAt;
      // Simple check: if enough wall-clock time has passed AND food was available
      // (food depletes in real time while eggs are present, so if food ran out
      // the egg stalls; we approximate by checking if elapsed >= effectiveTime)
      if (elapsed < effectiveTime) return { ...state, message: 'Still incubating...' };

      // Also verify food didn't completely run out before the egg could finish
      const currentFood = getIncubatorFood(state.base);

      // Pick a pet from the hatch table
      const totalWeight = eggDef.hatchTable.reduce((s, e) => s + e.weight, 0);
      let roll = Math.random() * totalWeight;
      let hatchedPetId = eggDef.hatchTable[eggDef.hatchTable.length - 1].petId;
      for (const entry of eggDef.hatchTable) {
        roll -= entry.weight;
        if (roll <= 0) {
          hatchedPetId = entry.petId;
          break;
        }
      }

      // Create pet instance
      const newPet = createPetInstance(hatchedPetId);
      if (!newPet) return { ...state, message: 'Failed to hatch pet!' };

      const updatedPets = { ...state.pets, ownedPets: [...state.pets.ownedPets, newPet] };

      // Clear the slot
      slots[slotIdx] = null;

      const petDef = PET_CATALOG.find(p => p.id === hatchedPetId);
      return {
        ...state,
        pets: updatedPets,
        base: { ...state.base, incubatorSlots: slots, incubatorFood: currentFood, incubatorFoodLastUpdate: now },
        message: `The egg hatched into a ${petDef?.name || 'pet'}! [${petDef?.rarity || 'Unknown'}]`,
      };
    }

    case 'BASE_UPGRADE_INCUBATOR': {
      if (!state.base.buildings.incubator?.built) return { ...state, message: 'Build an Incubator first!' };
      const curLevel = state.base.incubatorLevel || 1;
      const nextUpgrade = BUILDINGS.incubator.upgrades.find(u => u.level === curLevel + 1);
      if (!nextUpgrade) return { ...state, message: 'Incubator is at max level!' };
      const iCost = nextUpgrade.upgradeCost;
      if (!iCost) return state;
      if (state.player.gold < iCost.gold) return { ...state, message: `Need ${iCost.gold}g!` };

      const iMats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(iCost.materials || {})) {
        if ((iMats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(iCost.materials || {})) {
        iMats[matId] -= qty;
      }

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - iCost.gold },
        base: { ...state.base, materials: iMats, incubatorLevel: curLevel + 1 },
        message: `${nextUpgrade.name}! ${nextUpgrade.desc}`,
      };
    }

    case 'BASE_SEND_MISSION': {
      if (!state.base.buildings.adventureCamp?.built) return { ...state, message: 'Build an Adventure Camp first!' };
      if (state.base.activeMission) return { ...state, message: 'A squad is already out!' };
      const mission = BUILDINGS.adventureCamp.missions.find(m => m.id === action.missionId);
      if (!mission) return state;

      return {
        ...state,
        base: {
          ...state.base,
          activeMission: { missionId: mission.id, startTime: Date.now(), duration: mission.duration },
        },
        message: `Squad sent on ${mission.name}! Returns in ${mission.desc.split(' - ')[0]}.`,
      };
    }

    case 'BASE_COLLECT_MISSION': {
      const mission = state.base.activeMission;
      if (!mission) return { ...state, message: 'No active mission!' };
      const now = Date.now();
      if (now - mission.startTime < mission.duration) {
        const remaining = Math.ceil((mission.duration - (now - mission.startTime)) / 60000);
        return { ...state, message: `Squad returns in ${remaining} min!` };
      }

      const missionDef = BUILDINGS.adventureCamp.missions.find(m => m.id === mission.missionId);
      if (!missionDef) return state;

      // Generate gold
      const goldMin = missionDef.goldRange[0];
      const goldMax = missionDef.goldRange[1];
      const goldReward = goldMin + Math.floor(Math.random() * (goldMax - goldMin + 1));

      // Generate loot
      const lootItems = generateCampLoot(missionDef.lootTier, state.player.level);

      let p = { ...state.player, gold: state.player.gold + goldReward, inventory: [...state.player.inventory] };
      const mats = { ...state.base.materials };
      const addedNames = [];

      for (const item of lootItems) {
        if (item.type === 'material') {
          const matId = item.materialId;
          const qty = item.stackQuantity || 1;
          mats[matId] = (mats[matId] || 0) + qty;
          addedNames.push(`${qty}x ${item.name}`);
        } else {
          const campInv = addToInventory(p.inventory, item, p.maxInventory);
          if (campInv) {
            p.inventory = campInv;
            addedNames.push(item.name);
          }
        }
      }

      const lootMsg = addedNames.length > 0 ? ` Loot: ${addedNames.join(', ')}` : '';

      return {
        ...state,
        player: p,
        base: { ...state.base, materials: mats, activeMission: null },
        message: `Squad returned! +${goldReward}g.${lootMsg}`,
      };
    }

    case 'BASE_BANK_DEPOSIT': {
      if (!state.base.buildings.bank?.built) return { ...state, message: 'Build a Bank first!' };
      const amount = Math.floor(action.amount || 0);
      if (amount <= 0) return state;
      if (state.player.gold < amount) return { ...state, message: 'Not enough gold!' };
      const fee = Math.floor(amount * BUILDINGS.bank.depositFee);
      const deposited = amount - fee;

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - amount },
        base: { ...state.base, bankDeposit: (state.base.bankDeposit || 0) + deposited },
        message: `Deposited ${deposited}g (${fee}g fee). Safe balance: ${(state.base.bankDeposit || 0) + deposited}g`,
      };
    }

    case 'BASE_BANK_WITHDRAW': {
      if (!state.base.buildings.bank?.built) return { ...state, message: 'Build a Bank first!' };
      const amount = Math.floor(action.amount || 0);
      if (amount <= 0) return state;
      if ((state.base.bankDeposit || 0) < amount) return { ...state, message: 'Not enough in deposit!' };

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + amount },
        base: { ...state.base, bankDeposit: (state.base.bankDeposit || 0) - amount },
        message: `Withdrew ${amount}g. Wallet: ${state.player.gold + amount}g`,
      };
    }

    case 'BASE_BANK_FREEZE': {
      if (!state.base.buildings.bank?.built) return { ...state, message: 'Build a Bank first!' };
      if (state.base.frozenGold) return { ...state, message: 'Already have frozen gold!' };
      const amount = Math.floor(action.amount || 0);
      const option = BUILDINGS.bank.freezeOptions.find(o => o.id === action.freezeOptionId);
      if (!option) return state;
      if (amount <= 0 || amount > BUILDINGS.bank.maxFreezeAmount) return { ...state, message: `Freeze limit: 1-${BUILDINGS.bank.maxFreezeAmount}g` };
      if ((state.base.bankDeposit || 0) < amount) return { ...state, message: 'Not enough in deposit!' };

      return {
        ...state,
        base: {
          ...state.base,
          bankDeposit: (state.base.bankDeposit || 0) - amount,
          frozenGold: {
            amount,
            startTime: Date.now(),
            duration: option.days * 24 * 60 * 60 * 1000,
            interestRate: option.interestRate,
            optionDesc: option.desc,
          },
        },
        message: `Froze ${amount}g for ${option.days} days at ${option.interestRate * 100}% interest.`,
      };
    }

    case 'BASE_BANK_COLLECT_FROZEN': {
      if (!state.base.frozenGold) return { ...state, message: 'No frozen gold!' };
      const frozen = state.base.frozenGold;
      const now = Date.now();
      if (now - frozen.startTime < frozen.duration) {
        const daysLeft = Math.ceil((frozen.duration - (now - frozen.startTime)) / (24 * 60 * 60 * 1000));
        return { ...state, message: `${daysLeft} day(s) remaining before unfreezing.` };
      }
      const interest = Math.floor(frozen.amount * frozen.interestRate);
      const total = frozen.amount + interest;

      return {
        ...state,
        base: {
          ...state.base,
          bankDeposit: (state.base.bankDeposit || 0) + total,
          frozenGold: null,
        },
        message: `Unfroze ${frozen.amount}g + ${interest}g interest = ${total}g!`,
      };
    }

    case 'BASE_BANK_LOAN': {
      if (!state.base.buildings.bank?.built) return { ...state, message: 'Build a Bank first!' };
      if (state.base.loan) return { ...state, message: 'Already have an active loan!' };
      const amount = Math.floor(action.amount || 0);
      if (amount <= 0 || amount > BUILDINGS.bank.maxLoanAmount) return { ...state, message: `Loan limit: 1-${BUILDINGS.bank.maxLoanAmount}g` };

      // Loan due in 7 days with 15% interest
      const dueTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const repayAmount = Math.floor(amount * 1.15);

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + amount },
        base: { ...state.base, loan: { amount: repayAmount, dueTime } },
        message: `Borrowed ${amount}g. Repay ${repayAmount}g within 7 days.`,
      };
    }

    case 'BASE_BANK_REPAY': {
      if (!state.base.loan) return { ...state, message: 'No active loan!' };
      const owed = state.base.loan.amount;
      if (state.player.gold < owed) return { ...state, message: `Need ${owed}g to repay! (have ${state.player.gold}g)` };

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - owed },
        base: { ...state.base, loan: null },
        message: `Loan repaid! (${owed}g)`,
      };
    }

    case 'BASE_START_SPAR': {
      if (!state.base.buildings.sparringRange?.built) return { ...state, message: 'Build a Sparring Range first!' };
      const dummy = SPARRING_DUMMIES.find(d => d.id === action.dummyId);
      if (!dummy) return state;
      return {
        ...state,
        base: { ...state.base, sparringDummy: dummy, sparringHp: dummy.hp },
      };
    }

    case 'BASE_SPAR_ATTACK': {
      if (!state.base.sparringDummy) return state;
      const dummy = state.base.sparringDummy;
      const p = state.player;
      const atkBonus = Object.values(p.equipment || {}).reduce((sum, item) => sum + (item?.atk || 0), 0);
      const chamberBuffs = getChamberBuffs(state.base);
      const totalAtk = p.baseAtk + atkBonus + (chamberBuffs.atkBuff || 0);
      const dmg = Math.max(1, totalAtk - dummy.def + Math.floor(Math.random() * 5));
      const newHp = Math.max(0, (state.base.sparringHp || 0) - dmg);

      return {
        ...state,
        base: { ...state.base, sparringHp: newHp },
        message: newHp <= 0 ? `Dummy destroyed! You dealt ${dmg} damage.` : `Hit for ${dmg}! Dummy HP: ${newHp}/${dummy.hp}`,
      };
    }

    case 'BASE_SPAR_SKILL': {
      if (!state.base.sparringDummy) return state;
      const dummy = state.base.sparringDummy;
      const p = state.player;
      const cls = getClassData(p);
      const skillMult = cls?.skillMultiplier || 1.5;
      const atkBonus = Object.values(p.equipment || {}).reduce((sum, item) => sum + (item?.atk || 0), 0);
      const chamberBuffs = getChamberBuffs(state.base);
      const totalAtk = p.baseAtk + atkBonus + (chamberBuffs.atkBuff || 0);
      const rawDmg = Math.floor(totalAtk * skillMult);
      const dmg = Math.max(1, rawDmg - dummy.def + Math.floor(Math.random() * 5));
      const newHp = Math.max(0, (state.base.sparringHp || 0) - dmg);

      return {
        ...state,
        base: { ...state.base, sparringHp: newHp },
        message: newHp <= 0 ? `Dummy destroyed! Skill dealt ${dmg} damage.` : `Skill hit for ${dmg}! Dummy HP: ${newHp}/${dummy.hp}`,
      };
    }

    case 'BASE_RESET_SPAR': {
      return {
        ...state,
        base: { ...state.base, sparringDummy: null, sparringHp: 0 },
      };
    }

    // ========== PET SYSTEM ==========

    case 'BUY_PET': {
      const petId = action.petId;
      const template = PET_CATALOG.find(p => p.id === petId);
      if (!template) return state;
      if (state.pets.ownedPets.some(p => p.id === petId)) return { ...state, message: 'You already own this pet!' };
      if (state.player.gold < template.buyPrice) return { ...state, message: 'Not enough gold!' };

      const petInstance = createPetInstance(petId);
      if (!petInstance) return state;

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - template.buyPrice },
        pets: {
          ...state.pets,
          ownedPets: [...state.pets.ownedPets, petInstance],
        },
        message: `Adopted ${template.name}!`,
      };
    }

    case 'BUY_PET_ITEM': {
      const item = action.item;
      if (!item || !item.buyPrice) return state;
      if (state.player.gold < item.buyPrice) return { ...state, message: 'Not enough gold!' };

      const newItem = { ...item, id: 'petitem_' + Date.now() + '_' + Math.random() };
      delete newItem.buyPrice;
      const petItemInv = addToInventory(state.player.inventory, newItem, state.player.maxInventory);
      if (!petItemInv) return { ...state, message: 'Inventory full!' };
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - item.buyPrice,
          inventory: petItemInv,
        },
        message: `Purchased ${item.name}!`,
      };
    }

    case 'EQUIP_PET': {
      const petInstanceId = action.petInstanceId;
      const equipped = state.pets.equippedPets || [];
      if (equipped.length >= PET_MAX_SLOTS) return { ...state, message: `Max ${PET_MAX_SLOTS} pets can be equipped!` };
      if (equipped.includes(petInstanceId)) return { ...state, message: 'Pet already equipped!' };
      const pet = state.pets.ownedPets.find(p => p.instanceId === petInstanceId);
      if (!pet) return state;

      return {
        ...state,
        pets: { ...state.pets, equippedPets: [...equipped, petInstanceId] },
        message: `${pet.name} is now your companion!`,
      };
    }

    case 'UNEQUIP_PET': {
      const petInstanceId = action.petInstanceId;
      const equipped = state.pets.equippedPets || [];
      if (!equipped.includes(petInstanceId)) return state;
      const pet = state.pets.ownedPets.find(p => p.instanceId === petInstanceId);

      return {
        ...state,
        pets: { ...state.pets, equippedPets: equipped.filter(id => id !== petInstanceId) },
        message: pet ? `${pet.name} unequipped.` : 'Pet unequipped.',
      };
    }

    case 'FEED_PET': {
      const { petInstanceId, item } = action;
      if (!item || item.type !== 'pet-snack') return state;
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      if (pet.bond >= PET_MAX_BOND) return { ...state, message: 'Bond is already full!' };
      pet.bond = Math.min(PET_MAX_BOND, pet.bond + (item.bondRestore || 10));
      pets.ownedPets[idx] = pet;

      const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
      // Progress feed_snack quests
      const feedPets = progressSinglePetQuest(pets, petInstanceId, 'feed_snack', 1);
      return { ...state, player: p, pets: feedPets, message: `Fed ${pet.name}! Bond +${item.bondRestore}` };
    }

    case 'ENERGY_PET': {
      const { petInstanceId, item } = action;
      if (!item || item.type !== 'pet-energy') return state;
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      if (pet.energy >= PET_MAX_ENERGY) return { ...state, message: 'Energy is already full!' };
      pet.energy = Math.min(PET_MAX_ENERGY, pet.energy + (item.energyRestore || 15));
      pets.ownedPets[idx] = pet;

      const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };
      // Progress give_potion quests
      const energyPets = progressSinglePetQuest(pets, petInstanceId, 'give_potion', 1);
      return { ...state, player: p, pets: energyPets, message: `${pet.name} energy +${item.energyRestore}!` };
    }

    case 'PET_BUILD': {
      const buildingDef = PET_BUILDINGS[action.buildingId];
      if (!buildingDef) return state;
      if (state.pets.petBuildings?.[action.buildingId]?.built) return { ...state, message: 'Already built!' };
      if (state.player.level < buildingDef.levelReq) return { ...state, message: `Requires level ${buildingDef.levelReq}!` };

      const cost = buildingDef.buildCost;
      if (state.player.gold < cost.gold) return { ...state, message: `Need ${cost.gold}g!` };

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(cost.materials || {})) {
        mats[matId] = (mats[matId] || 0) - qty;
      }

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cost.gold },
        base: { ...state.base, materials: mats },
        pets: {
          ...state.pets,
          petBuildings: { ...state.pets.petBuildings, [action.buildingId]: { built: true, level: 1 } },
        },
        message: `${buildingDef.name} constructed!`,
      };
    }

    case 'PET_UPGRADE_BUILDING': {
      const buildingDef = PET_BUILDINGS[action.buildingId];
      if (!buildingDef) return state;
      const bState = state.pets.petBuildings?.[action.buildingId];
      if (!bState?.built) return { ...state, message: 'Build it first!' };

      const currentLevel = bState.level || 1;
      const nextUpgrade = buildingDef.upgrades.find(u => u.level === currentLevel + 1);
      if (!nextUpgrade) return { ...state, message: 'Already at max level!' };
      if (!nextUpgrade.upgradeCost) return state;

      if (state.player.gold < nextUpgrade.upgradeCost.gold) return { ...state, message: `Need ${nextUpgrade.upgradeCost.gold}g!` };

      const mats = { ...state.base.materials };
      for (const [matId, qty] of Object.entries(nextUpgrade.upgradeCost.materials || {})) {
        if ((mats[matId] || 0) < qty) {
          const matName = BUILDING_MATERIALS[matId]?.name || matId;
          return { ...state, message: `Need ${qty}x ${matName}!` };
        }
      }
      for (const [matId, qty] of Object.entries(nextUpgrade.upgradeCost.materials || {})) {
        mats[matId] -= qty;
      }

      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - nextUpgrade.upgradeCost.gold },
        base: { ...state.base, materials: mats },
        pets: {
          ...state.pets,
          petBuildings: {
            ...state.pets.petBuildings,
            [action.buildingId]: { ...bState, level: currentLevel + 1 },
          },
        },
        message: `${buildingDef.name} upgraded to ${nextUpgrade.name}!`,
      };
    }

    // ========== PET QUEST SYSTEM ==========

    case 'ACCEPT_PET_QUEST': {
      const { petInstanceId, questId } = action;
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      const activeQuests = pet.activeQuests || [];
      if (activeQuests.length >= PET_MAX_ACTIVE_QUESTS) return { ...state, message: `Max ${PET_MAX_ACTIVE_QUESTS} active quests per pet!` };
      if (activeQuests.some(q => q.id === questId)) return { ...state, message: 'Quest already active!' };

      // Find quest definition
      const allQuests = [...(PET_QUEST_POOL.generic || []), ...(PET_QUEST_POOL[pet.id] || [])];
      const questDef = allQuests.find(q => q.id === questId);
      if (!questDef) return state;
      if ((pet.completedQuests || []).includes(questId)) return { ...state, message: 'Quest already completed!' };

      pet.activeQuests = [...activeQuests, { ...questDef, progress: 0 }];
      pets.ownedPets[idx] = pet;

      return { ...state, pets, message: `Quest accepted: ${questDef.name}!` };
    }

    case 'ABANDON_PET_QUEST': {
      const { petInstanceId, questId } = action;
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      pet.activeQuests = (pet.activeQuests || []).filter(q => q.id !== questId);
      pets.ownedPets[idx] = pet;

      return { ...state, pets, message: 'Quest abandoned.' };
    }

    case 'COMPLETE_PET_QUEST': {
      const { petInstanceId, questId } = action;
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      const quest = (pet.activeQuests || []).find(q => q.id === questId);
      if (!quest) return state;
      if (quest.progress < quest.target) return { ...state, message: 'Quest not yet complete!' };

      // Apply rewards
      pet.bond = Math.min(PET_MAX_BOND, pet.bond + (quest.bondReward || 0));
      pet.activeQuests = (pet.activeQuests || []).filter(q => q.id !== questId);
      pet.completedQuests = [...(pet.completedQuests || []), questId];

      // Grant XP and handle level ups
      const xpReward = quest.xpReward || 0;
      let levelUpMsg = '';
      if (xpReward > 0) {
        const result = addPetXp(pet, xpReward);
        Object.assign(pet, result.pet);
        if (result.levelsGained > 0) {
          levelUpMsg = ` ${pet.name} leveled up to Lv.${pet.level}!`;
        }
      }

      pets.ownedPets[idx] = pet;

      const bondMsg = quest.bondReward ? ` Bond +${quest.bondReward}` : '';
      const xpMsg = xpReward > 0 ? ` +${xpReward} XP` : '';
      return { ...state, pets, message: `Quest complete: ${quest.name}!${bondMsg}${xpMsg}${levelUpMsg}` };
    }

    case 'PET_QUEST_GIVE_ITEM': {
      const { petInstanceId, item } = action;
      if (!item || !item.slot) return { ...state, message: 'Must be an equipment item!' };
      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      // Check this pet has an active give_item quest
      const pet = { ...pets.ownedPets[idx] };
      const hasQuest = (pet.activeQuests || []).some(q => q.type === 'give_item' && q.progress < q.target);
      if (!hasQuest) return { ...state, message: 'No active item quest for this pet!' };

      // Remove item from inventory
      const p = { ...state.player, inventory: removeOneFromStack(state.player.inventory, item.id) };

      // Progress quest
      const updatedQuests = (pet.activeQuests || []).map(q => {
        if (q.type === 'give_item' && q.progress < q.target) {
          return { ...q, progress: Math.min(q.target, q.progress + 1) };
        }
        return q;
      });
      pet.activeQuests = updatedQuests;
      pets.ownedPets[idx] = pet;

      return { ...state, player: p, pets, message: `Gave ${item.name} to ${pet.name}!` };
    }

    case 'PET_QUEST_GIVE_GOLD': {
      const { petInstanceId, amount } = action;
      const goldAmount = Math.floor(amount || 0);
      if (goldAmount <= 0) return state;
      if (state.player.gold < goldAmount) return { ...state, message: 'Not enough gold!' };

      const pets = { ...state.pets, ownedPets: [...state.pets.ownedPets] };
      const idx = pets.ownedPets.findIndex(p => p.instanceId === petInstanceId);
      if (idx === -1) return state;

      const pet = { ...pets.ownedPets[idx] };
      const hasQuest = (pet.activeQuests || []).some(q => q.type === 'give_gold' && q.progress < q.target);
      if (!hasQuest) return { ...state, message: 'No active gold quest for this pet!' };

      const p = { ...state.player, gold: state.player.gold - goldAmount };
      const updatedQuests = (pet.activeQuests || []).map(q => {
        if (q.type === 'give_gold' && q.progress < q.target) {
          return { ...q, progress: Math.min(q.target, q.progress + goldAmount) };
        }
        return q;
      });
      pet.activeQuests = updatedQuests;
      pets.ownedPets[idx] = pet;

      return { ...state, player: p, pets, message: `Donated ${goldAmount}g to ${pet.name}!` };
    }

    // ---- STANCE SYSTEM ----
    case 'BATTLE_CHANGE_STANCE': {
      if (!state.battle) return state;
      const newStance = action.stance;
      if (!STANCES[newStance]) return state;
      const stanceLog = [...state.battleLog, { text: `Switched to ${STANCES[newStance].name} stance!`, type: 'info' }];
      // Reset momentum when switching stances
      const resetMomentum = newStance !== state.battle.stance ? 0 : state.battle.stanceMomentum;
      return { ...state, battle: { ...state.battle, stance: newStance, stanceMomentum: resetMomentum, lastStance: newStance, showSkillMenu: false, showInspect: false }, battleLog: stanceLog };
    }

    // ---- PARRY SYSTEM ----
    case 'BATTLE_PARRY': {
      if (!state.battle) return state;
      let b = { ...state.battle, showSkillMenu: false, showInspect: false };
      let p = { ...state.player };
      if (b.playerStunTurns > 0) {
        return { ...state, message: 'You are stunned and cannot act!' };
      }
      if (!p.unlockedUniversalSkills?.includes('parry')) {
        return { ...state, message: 'You have not unlocked Parry yet!' };
      }
      const parryCost = UNIVERSAL_SKILLS.parry.manaCost || 5;
      if (p.mana < parryCost) {
        return { ...state, message: `Not enough mana to parry! (${parryCost} needed)` };
      }
      p = { ...p, mana: p.mana - parryCost };
      b.parrying = true;
      b.defending = false;
      b.defendedLastTurn = false;
      // Track in combo history
      b.actionHistory = [...(b.actionHistory || []), 'parry'].slice(-5);
      const parryLog = [...state.battleLog, { text: 'You ready a parry stance!', type: 'info' }];
      return { ...state, player: p, battle: b, battleLog: parryLog };
    }

    // ---- UNIVERSAL COMBAT SKILLS ----
    case 'BATTLE_UNIVERSAL_SKILL': {
      if (!state.battle) return state;
      let b = { ...state.battle, showSkillMenu: false, showInspect: false };
      let m = { ...b.monster };
      let p = { ...state.player };
      let log = [...state.battleLog];
      const uSkillId = action.skillId;
      const uSkill = UNIVERSAL_SKILLS[uSkillId];
      if (!uSkill) return state;
      if (!p.unlockedUniversalSkills?.includes(uSkillId)) {
        return { ...state, message: `You have not unlocked ${uSkill.name} yet!` };
      }
      if (b.playerStunTurns > 0) {
        b.playerStunTurns--;
        log.push({ text: `You are stunned and cannot act! (${b.playerStunTurns} turns left)`, type: 'dmg-player' });
        return { ...state, battle: b, battleLog: log };
      }
      // Check cooldown
      if (b.universalCooldowns[uSkillId] > 0) {
        return { ...state, message: `${uSkill.name} is on cooldown! (${b.universalCooldowns[uSkillId]} turns)` };
      }
      // Special mana handling for mana_burst and limit_break
      const isManaBurst = uSkillId === 'mana_burst';
      const isLimitBreak = uSkillId === 'limit_break';
      if (!isManaBurst && !isLimitBreak) {
        const uCost = getEffectiveManaCost(p, uSkill.manaCost || 0, b);
        if (p.mana < uCost) {
          return { ...state, message: `Not enough mana! (${uCost} needed)` };
        }
        p = { ...p, mana: p.mana - uCost };
      }

      // Set cooldown
      if (uSkill.cooldown > 0) {
        b.universalCooldowns = { ...b.universalCooldowns, [uSkillId]: uSkill.cooldown };
      }

      // Track in combo history
      b.actionHistory = [...(b.actionHistory || []), 'skill'].slice(-5);

      const stanceMods = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);
      const effectiveMDef = b.armorShatterTurns > 0 ? Math.floor(m.def * (1 - b.armorShatterPct)) : m.def;

      switch (uSkillId) {
        case 'stun_strike': {
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * (uSkill.multiplier || 0.8)), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          log.push({ text: `Stun Strike for ${dmg} damage!`, type: 'dmg-monster' });
          const mTen = m.tenacity || 0;
          const stunChance = Math.max(0.1, STUN_BASE_CHANCE - mTen * 0.02);
          if (Math.random() < stunChance) {
            const dur = reduceDurationByTenacity(1, mTen);
            b.monsterStunTurns = dur;
            log.push({ text: `${m.name} is stunned for ${dur} turn!`, type: 'info' });
          } else {
            log.push({ text: `${m.name} resists the stun!`, type: 'info' });
          }
          break;
        }
        case 'war_shout': {
          b.warShoutTurns = 3;
          b.warShoutAtkDebuff = Math.floor(m.atk * 0.2);
          b.warShoutDefBuff = Math.floor(getPlayerDef(p, b) * 0.15);
          log.push({ text: `War Shout! Enemy ATK reduced, your DEF boosted for 3 turns!`, type: 'info' });
          break;
        }
        case 'mind_blast': {
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * (uSkill.multiplier || 1.0)), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          log.push({ text: `Mind Blast for ${dmg} damage!`, type: 'dmg-monster' });
          const mTen = m.tenacity || 0;
          const confChance = Math.max(0.1, CONFUSION_BASE_CHANCE - mTen * 0.02);
          if (Math.random() < confChance) {
            const dur = reduceDurationByTenacity(2, mTen);
            b.monsterConfusionTurns = dur;
            log.push({ text: `${m.name} is confused for ${dur} turns!`, type: 'info' });
          } else {
            log.push({ text: `${m.name} resists the confusion!`, type: 'info' });
          }
          break;
        }
        case 'life_drain': {
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * (uSkill.multiplier || 1.2)), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          const healed = Math.floor(dmg * 0.4);
          p = { ...p, hp: Math.min(p.maxHp, p.hp + healed) };
          log.push({ text: `Life Drain for ${dmg} damage! Healed ${healed} HP!`, type: 'dmg-monster' });
          break;
        }
        case 'elemental_strike': {
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * (uSkill.multiplier || 1.5)), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          const weatherElem = getCurrentWeatherId();
          const elemBonus = weatherElem === 'thunderstorm' || weatherElem === 'rain' ? 1.3 : 1.0;
          dmg = Math.floor(dmg * elemBonus);
          const atkElem = getSkillElement(null, p.characterClass);
          const eMult = calcElementalDamageMultiplier(atkElem, b.monsterElement);
          dmg = Math.floor(dmg * eMult);
          m.hp = Math.max(0, m.hp - dmg);
          log.push({ text: `Elemental Strike for ${dmg} damage!${elemBonus > 1 ? ' (Weather boost!)' : ''}`, type: 'dmg-monster' });
          if (eMult > 1.0) log.push({ text: 'Super effective!', type: 'info' });
          else if (eMult < 1.0) log.push({ text: 'Not very effective...', type: 'info' });
          break;
        }
        case 'armor_shatter': {
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * (uSkill.multiplier || 0.6)), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          b.armorShatterTurns = 3;
          b.armorShatterPct = 0.3;
          log.push({ text: `Armor Shatter for ${dmg} damage! Enemy DEF reduced by 30% for 3 turns!`, type: 'dmg-monster' });
          break;
        }
        case 'mana_burst': {
          const manaSpent = Math.floor(p.mana * 0.2);
          p = { ...p, mana: p.mana - manaSpent };
          let dmg = Math.floor(manaSpent * 3); // 3x mana as true damage
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          log.push({ text: `Mana Burst! Converted ${manaSpent} mana into ${dmg} true damage!`, type: 'dmg-monster' });
          break;
        }
        case 'last_stand': {
          if (b.lastStandUsed) {
            return { ...state, message: 'Last Stand can only be used once per battle!' };
          }
          const uCostLS = getEffectiveManaCost(p, uSkill.manaCost || 15, b);
          if (p.mana < uCostLS) return { ...state, message: `Not enough mana! (${uCostLS} needed)` };
          p = { ...p, mana: p.mana - uCostLS };
          const healAmt = Math.floor(p.maxHp * 0.3);
          p = { ...p, hp: Math.min(p.maxHp, p.hp + healAmt) };
          b.frenzyBonusTurns = 2;
          b.frenzyBonusPct = 0.5;
          b.lastStandUsed = true;
          log.push({ text: `Last Stand! Healed ${healAmt} HP and gained +50% ATK for 2 turns!`, type: 'heal' });
          break;
        }
        case 'elemental_ward': {
          const uCostEW = getEffectiveManaCost(p, uSkill.manaCost || 12, b);
          if (p.mana < uCostEW) return { ...state, message: `Not enough mana! (${uCostEW} needed)` };
          p = { ...p, mana: p.mana - uCostEW };
          b.elementalWardTurns = 3;
          log.push({ text: 'Elemental Ward! Resist 50% of elemental damage for 3 turns!', type: 'info' });
          break;
        }
        case 'execute': {
          const uCostEx = getEffectiveManaCost(p, uSkill.manaCost || 15, b);
          if (p.mana < uCostEx) return { ...state, message: `Not enough mana! (${uCostEx} needed)` };
          p = { ...p, mana: p.mana - uCostEx };
          const mHpPctExec = m.hp / m.maxHp;
          const execMult = mHpPctExec < 0.25 ? 2.5 : 0.5;
          let dmg = calcDamage(Math.floor(getPlayerAtk(p, b) * execMult), effectiveMDef);
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          if (execMult > 1) {
            log.push({ text: `EXECUTE! Massive ${dmg} damage to weakened enemy!`, type: 'dmg-monster' });
          } else {
            log.push({ text: `Execute for ${dmg} damage (enemy too healthy for full effect)`, type: 'dmg-monster' });
          }
          break;
        }
        case 'limit_break': {
          if (b.limitBreakUsed) {
            return { ...state, message: 'Limit Break can only be used once per battle!' };
          }
          const manaConsumed = p.mana;
          if (manaConsumed < 10) return { ...state, message: 'Not enough mana for Limit Break! (need at least 10)' };
          p = { ...p, mana: 0 };
          let dmg = Math.floor(manaConsumed * 5); // 5x mana as true damage
          dmg = Math.floor(dmg * stanceMods.dmgDealt);
          m.hp = Math.max(0, m.hp - dmg);
          b.limitBreakUsed = true;
          log.push({ text: `LIMIT BREAK! Consumed ${manaConsumed} mana for ${dmg} devastating damage!`, type: 'dmg-monster' });
          break;
        }
        default:
          log.push({ text: `Used ${uSkill.name}!`, type: 'info' });
          break;
      }

      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;

      // Check combos
      const uCombos = checkComboChains(b.actionHistory, p.comboMaster);
      if (uCombos.length > 0) {
        for (const combo of uCombos) {
          log.push({ text: `Combo: ${combo.name}!`, type: 'info' });
          if (combo.bonus === 'mana_restore') {
            const restored = Math.floor(getBattleMaxMana(p) * (combo.restorePct || 0.25));
            p = { ...p, mana: Math.min(getBattleMaxMana(p), p.mana + restored) };
            log.push({ text: `Arcane Surge restores ${restored} mana!`, type: 'heal' });
          } else if (combo.bonus === 'frenzy') {
            b.frenzyBonusTurns = 2;
            b.frenzyBonusPct = combo.frenzyBonus || 0.35;
            log.push({ text: `Berserker frenzy! +${Math.round(b.frenzyBonusPct * 100)}% damage for 2 turns!`, type: 'info' });
          } else if (combo.bonus === 'invuln') {
            b.playerInvulnTurns = combo.invulnTurns || 1;
            log.push({ text: 'You become invulnerable!', type: 'info' });
          } else if (combo.bonus === 'armor_break') {
            b.armorShatterTurns = combo.armorBreakTurns || 3;
            b.armorShatterPct = combo.armorBreakPct || 0.4;
            log.push({ text: `Fortress Crush! Enemy armor broken!`, type: 'info' });
          } else if (combo.bonus === 'crit_guarantee') {
            log.push({ text: 'Focused Strike — guaranteed critical next attack!', type: 'info' });
          }
          b.activeCombo = combo;
          b.comboStreak = (b.comboStreak || 0) + 1;
        }
        b.actionHistory = [];
      }

      let newStats = addStat(state.stats, 'universalSkillsUsed');
      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats });
      }
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats };
    }

    // ---- ARENA ACTIONS ----
    case 'ARENA_START_DUEL': {
      const { tierId, wager } = action;
      const tier = ARENA_TIERS.find(t => t.id === tierId);
      if (!tier) return state;

      const minW = getMinWager(state.player.level);
      if (state.player.level < tier.levelReq) return { ...state, message: `Reach level ${tier.levelReq} to enter this arena.` };
      if (wager < minW || wager > state.player.gold) return { ...state, message: `Invalid wager amount.` };

      const offset = tier.levelOffset();
      const opponent = generateArenaOpponent(state.player.level, offset);
      const battle = { ...createBattleState(opponent, state.player), noRun: true };
      const log = [
        { text: `Arena Match: ${opponent.name} (Lv.${opponent.arenaLevel})`, type: 'info' },
        { text: `Class: ${opponent.arenaClassName} · ${opponent.arenaEquipMode}`, type: 'info' },
        { text: `Wager: ${wager}g`, type: 'info' },
      ];
      if (battle.playerIsFaster && battle.monsterNextMove) {
        log.push({ text: `You're faster! Enemy intends to: ${battle.monsterNextMove.name}`, type: 'info' });
      } else if (!battle.playerIsFaster) {
        log.push({ text: `${opponent.name} is faster and strikes first!`, type: 'info' });
      }

      return {
        ...state,
        screen: 'battle',
        player: { ...state.player, gold: state.player.gold - wager },
        battle,
        battleLog: log,
        battleResult: null,
        arena: {
          tierId,
          wager,
          gauntletActive: false,
          gauntletWins: 0,
          gauntletWager: 0,
        },
      };
    }

    case 'ARENA_GAUNTLET_CONTINUE': {
      const arena = state.arena;
      if (!arena || !arena.gauntletActive) return state;

      const tier = ARENA_TIERS.find(t => t.id === 'gauntlet');
      const offset = tier ? tier.levelOffset() : 0;
      const opponent = generateArenaOpponent(state.player.level, offset);
      const battle = { ...createBattleState(opponent, state.player), noRun: true };
      const log = [
        { text: `Gauntlet Round ${arena.gauntletWins + 1}: ${opponent.name} (Lv.${opponent.arenaLevel})`, type: 'info' },
        { text: `Class: ${opponent.arenaClassName} · ${opponent.arenaEquipMode}`, type: 'info' },
        { text: `Current Pot: ${arena.gauntletWager}g`, type: 'info' },
      ];
      if (battle.playerIsFaster && battle.monsterNextMove) {
        log.push({ text: `You're faster! Enemy intends to: ${battle.monsterNextMove.name}`, type: 'info' });
      } else if (!battle.playerIsFaster) {
        log.push({ text: `${opponent.name} is faster and strikes first!`, type: 'info' });
      }

      return {
        ...state,
        screen: 'battle',
        battle,
        battleLog: log,
        battleResult: null,
        arena: { ...arena, gauntletActive: false },
      };
    }

    case 'ARENA_LEAVE': {
      // Return to previous region (free travel back)
      const prevId = state.previousRegionId;
      const prevRegion = prevId ? REGIONS.find(r => r.id === prevId) : null;
      if (prevRegion) {
        return {
          ...state,
          screen: 'locations',
          currentRegion: prevRegion,
          previousRegionId: null,
          arena: null,
        };
      }
      // No previous region, go to region select
      return { ...state, screen: 'regions', arena: null, previousRegionId: null };
    }

    case 'ARENA_GAUNTLET_CASHOUT': {
      const arena = state.arena;
      if (!arena) return state;
      const payout = arena.gauntletWager;
      return {
        ...state,
        screen: 'locations',
        player: { ...state.player, gold: state.player.gold + payout },
        battle: null,
        battleResult: null,
        battleLog: [],
        arena: null,
        message: `Cashed out ${payout}g from the Gauntlet!`,
      };
    }

    // ---- TAVERN ACTIONS ----
    case 'TAVERN_ACCEPT_QUEST': {
      const { questId, npcId } = action;
      const tavern = state.tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
      const npcQuests = TAVERN_QUESTS[npcId];
      if (!npcQuests) return state;
      const questDef = npcQuests.find(q => q.id === questId);
      if (!questDef) return state;
      if (tavern.completedQuests.includes(questId)) return { ...state, message: 'Already completed!' };
      if (tavern.acceptedQuests.some(q => q.questId === questId)) return { ...state, message: 'Already accepted!' };
      const rep = tavern.reputation[npcId] || 0;
      const repLvl = getRepLevel(rep).level;
      if (repLvl < questDef.reqRep) return { ...state, message: 'Not enough reputation!' };
      if (state.player.level < questDef.reqLevel) return { ...state, message: `Requires level ${questDef.reqLevel}!` };
      return {
        ...state,
        tavern: {
          ...tavern,
          acceptedQuests: [...tavern.acceptedQuests, { questId, npcId, baseline: state.stats[questDef.stat] || 0 }],
        },
        message: `Quest accepted: ${questDef.name}`,
      };
    }

    case 'TAVERN_TURN_IN_QUEST': {
      const { questId, npcId } = action;
      const tavern = state.tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
      const npcQuests = TAVERN_QUESTS[npcId];
      if (!npcQuests) return state;
      const questDef = npcQuests.find(q => q.id === questId);
      if (!questDef) return state;
      const accepted = tavern.acceptedQuests.find(q => q.questId === questId);
      if (!accepted) return state;
      const progress = (state.stats[questDef.stat] || 0) - accepted.baseline;
      if (progress < questDef.target) return { ...state, message: 'Quest not complete yet!' };
      // Grant reputation to this NPC
      const newRep = { ...tavern.reputation };
      newRep[npcId] = (newRep[npcId] || 0) + questDef.repReward;
      // Cross-NPC reputation effects
      const crossEffects = REP_CROSS_EFFECTS[npcId] || {};
      for (const [otherNpcId, delta] of Object.entries(crossEffects)) {
        newRep[otherNpcId] = (newRep[otherNpcId] || 0) + delta;
      }
      // Grant gold reward
      let newStats = addStat(state.stats, 'goldEarned', questDef.goldReward);
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + questDef.goldReward },
        tavern: {
          ...tavern,
          reputation: newRep,
          acceptedQuests: tavern.acceptedQuests.filter(q => q.questId !== questId),
          completedQuests: [...tavern.completedQuests, questId],
        },
        stats: newStats,
        message: `Quest complete! +${questDef.goldReward}g, +${questDef.repReward} rep with ${npcId}`,
      };
    }

    case 'TAVERN_LEARN_FACTION_SKILL': {
      const { skillId, npcId } = action;
      const tavern = state.tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
      const npcFactionSkills = FACTION_SKILLS[npcId];
      if (!npcFactionSkills) return state;
      const skillDef = npcFactionSkills.find(s => s.id === skillId);
      if (!skillDef) return state;
      if ((tavern.learnedFactionSkills || []).includes(skillId)) return { ...state, message: 'Already learned!' };
      const rep = tavern.reputation[npcId] || 0;
      const repLvl = getRepLevel(rep).level;
      if (repLvl < skillDef.reqRep) return { ...state, message: 'Not enough reputation!' };
      return {
        ...state,
        tavern: {
          ...tavern,
          learnedFactionSkills: [...(tavern.learnedFactionSkills || []), skillId],
        },
        message: `Learned faction skill: ${skillDef.name}!`,
      };
    }

    case 'BATTLE_USE_FACTION_SKILL': {
      if (!state.battle) return state;
      let b = { ...state.battle };
      let m = { ...b.monster };
      let p = { ...state.player };
      const factionSkills = getUnlockedFactionSkills(state.tavern);
      const skill = factionSkills.find(s => s.id === action.skillId);
      if (!skill) return state;
      const stanceMods = getStanceModifiers(b.stance, p.stanceMaster, b.stanceMomentum);
      const manaCost = getEffectiveManaCost(p, Math.ceil((skill.manaCost || 0) * (stanceMods.manaMod || 1.0)), b);
      if (manaCost > 0 && p.mana < manaCost) {
        return { ...state, message: `Not enough mana! (${manaCost} needed)` };
      }
      p = { ...p, mana: p.mana - manaCost };

      let passiveBonus = getSkillPassiveBonus(p);
      const echoProc = rollSpellEcho(p);
      if (echoProc) passiveBonus *= 2;

      const atkValue = Math.floor(getPlayerAtk(p, b) * skill.multiplier * passiveBonus);
      const battleMaxHp = getBattleMaxHp(p);

      p = applyLifeTap(p, manaCost);

      const effectiveMonsterDef = b.armorShatterTurns > 0 ? Math.floor(m.def * (1 - b.armorShatterPct)) : m.def;
      const effectiveDef = getEffectiveDef(effectiveMonsterDef, skill.effect);
      let finalMult = getExecuteMultiplier(skill.effect, m.hp, m.maxHp);

      let dmg = calcDamage(Math.floor(atkValue * finalMult), effectiveDef);

      if (b.frenzyBonusTurns > 0 && b.frenzyBonusPct > 0) {
        dmg = Math.floor(dmg * (1 + b.frenzyBonusPct));
      }
      dmg = Math.floor(dmg * stanceMods.dmgDealt);

      // Ancestral ward ATK bonus
      if (b.ancestralWardTurns > 0 && b.ancestralWardBonus > 0) {
        dmg = Math.floor(dmg * (1 + b.ancestralWardBonus));
      }

      let facCrit = false;
      const pLuck = getPlayerLuck(p);
      const facCritChance = getPlayerCritChance(p) + luckCritBonus(pLuck) + stanceMods.critMod;
      if (Math.random() < facCritChance) {
        dmg = Math.floor(dmg * getPlayerCritMultiplier(p));
        facCrit = true;
      }

      m.hp = Math.max(0, m.hp - dmg);
      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;
      b.showSkillMenu = false;
      b.showInspect = false;
      let log = [...state.battleLog];
      const critLabel = facCrit ? 'CRIT! ' : '';
      if (echoProc) {
        log.push({ text: `${critLabel}Spell Echo! ${skill.name} for ${dmg} damage!`, type: 'dmg-monster' });
      } else {
        log.push({ text: `${critLabel}${skill.name} for ${dmg} damage!`, type: 'dmg-monster' });
      }

      b.actionHistory = [...(b.actionHistory || []), 'skill'].slice(-5);
      const facCombos = checkComboChains(b.actionHistory, p.comboMaster);
      if (facCombos.length > 0) {
        for (const combo of facCombos) {
          log.push({ text: `Combo: ${combo.name}!`, type: 'info' });
          if (combo.bonus === 'mana_restore') {
            const restored = Math.floor(getBattleMaxMana(p) * (combo.restorePct || 0.25));
            p = { ...p, mana: Math.min(getBattleMaxMana(p), p.mana + restored) };
            log.push({ text: `Arcane Surge restores ${restored} mana!`, type: 'heal' });
          } else if (combo.bonus === 'frenzy') {
            b.frenzyBonusTurns = 2;
            b.frenzyBonusPct = combo.frenzyBonus || 0.35;
            log.push({ text: `Frenzy! +${Math.round(b.frenzyBonusPct * 100)}% damage for 2 turns!`, type: 'info' });
          } else if (combo.bonus === 'dmg_boost') {
            const comboDmg = Math.floor(dmg * combo.boostPct);
            m.hp = Math.max(0, m.hp - comboDmg);
            log.push({ text: `Combo bonus damage: ${comboDmg}!`, type: 'dmg-monster' });
          }
          b.activeCombo = combo;
          b.comboStreak = (b.comboStreak || 0) + 1;
        }
        b.actionHistory = [];
      }

      if (skill.effect) {
        const fx = applySkillEffect(skill.effect, { dmg, player: p, monster: m, battle: b, battleMaxHp, log, manaCost });
        p = fx.player || p;
        m = fx.monster || m;
        b = fx.battle || b;
        log = fx.log || log;
        if (fx.monster) b = { ...b, monster: m };
      }

      ({ player: p, log } = applySkillPassives({ player: p, log, dmg }));

      let newStats = addStat(state.stats, 'damageDealt', dmg);
      newStats = setStatMax(newStats, 'highestDamage', dmg);
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', dmg);

      // Golden Gambit gold bonus on kill
      if (b.goldenGambitActive && m.hp <= 0) {
        const bonusGold = Math.floor(20 + Math.random() * 50);
        p = { ...p, gold: p.gold + bonusGold };
        log.push({ text: `Fortune's Gambit bonus: +${bonusGold} gold!`, type: 'info' });
        b.goldenGambitActive = false;
      }

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks });
      }

      const petResult = processPetTurnActions({ ...state, player: p, battle: { ...b, monster: m }, pets: state.pets }, log);
      p = petResult.state.player;
      m = petResult.state.battle.monster;
      b = { ...petResult.state.battle };
      log = petResult.log;

      if (m.hp <= 0) {
        return handleVictory({ ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResult.state.pets });
      }
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks, pets: petResult.state.pets };
    }

    case 'TAVERN_BUY_ITEM': {
      const { itemDef, npcId } = action;
      const tavern = state.tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
      if (state.player.gold < itemDef.buyPrice) return { ...state, message: 'Not enough gold!' };
      const newItem = {
        id: 'tav_' + Date.now() + '_' + Math.random(),
        name: itemDef.name,
        type: itemDef.type === 'gear' ? 'equipment' : itemDef.type,
        slot: itemDef.slot || null,
        level: itemDef.level || 1,
        rarity: itemDef.rarity,
        rarityClass: 'rarity-' + (itemDef.rarity || 'common').toLowerCase(),
        rarityColor: itemDef.rarity === 'Epic' ? '#ce93d8' : itemDef.rarity === 'Rare' ? '#ffd700' : itemDef.rarity === 'Uncommon' ? '#4fc3f7' : '#ccc',
        atk: itemDef.atk || 0,
        def: itemDef.def || 0,
        healAmount: itemDef.healAmount || 0,
        sellPrice: itemDef.sellPrice || Math.floor(itemDef.buyPrice * 0.4),
        consumableEffect: itemDef.consumableEffect || null,
      };
      if (!canAddToInventory(state.player.inventory, newItem, state.player.maxInventory)) return { ...state, message: 'Inventory full!' };
      const newInv = addToInventory(state.player.inventory, newItem, state.player.maxInventory);
      const stockKey = npcId + '_' + itemDef.name;
      const newShopPurchases = { ...tavern.shopPurchases, [stockKey]: (tavern.shopPurchases[stockKey] || 0) + 1 };
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - itemDef.buyPrice, inventory: newInv },
        tavern: { ...tavern, shopPurchases: newShopPurchases },
        stats: addStat(state.stats, 'goldSpent', itemDef.buyPrice),
        message: `Purchased ${itemDef.name}!`,
      };
    }

    default:
      return state;
  }
}

function handleVictory(state) {
  const m = state.battle.monster;

  // Arena victory handling
  if (m.isArenaOpponent && state.arena) {
    return handleArenaVictory(state);
  }

  const innBonus = getInnExpBonus(state.base);
  const worldEffects = getCurrentEffects();
  const expGain = Math.floor(m.exp * (1 + innBonus) * worldEffects.xpMult);
  const cls = getClassData(state.player);
  let goldMult = 1.0;
  if (cls?.passive === 'Greed') goldMult *= 1.25;
  if (playerHasSkill(state.player, 'thf_t2a')) goldMult *= 1.50;
  goldMult *= worldEffects.goldMult;
  const goldGain = Math.floor(m.gold * goldMult);

  let p = { ...state.player, exp: state.player.exp + expGain, gold: state.player.gold + goldGain };

  // Roll for building material drop based on region
  let materialDrop = null;
  let bossMaterials = null;
  const regionId = state.currentRegion?.id;
  if (regionId) {
    if (m.isBoss) {
      // Bosses always drop many materials
      const mats = rollBossMaterials(regionId);
      const added = [];
      for (const mat of mats) {
        if (p.inventory.length < p.maxInventory) {
          p.inventory = [...p.inventory, mat];
          added.push(mat);
        }
      }
      if (added.length > 0) bossMaterials = added;
    } else {
      materialDrop = rollMaterialDrop(regionId);
      if (materialDrop && p.inventory.length < p.maxInventory) {
        p.inventory = [...p.inventory, materialDrop];
      } else if (materialDrop) {
        materialDrop = null; // inventory full
      }
    }
  }

  // Roll for rare egg drop
  let eggDrop = null;
  if (regionId) {
    eggDrop = rollEggDrop(regionId);
    if (eggDrop && p.inventory.length < p.maxInventory) {
      p.inventory = [...p.inventory, eggDrop];
    } else if (eggDrop) {
      eggDrop = null; // inventory full
    }
  }

  // Roll for extremely rare region ticket drop
  let ticketDrop = null;
  if (regionId) {
    ticketDrop = rollTicketDrop(regionId);
    if (ticketDrop && p.inventory.length < p.maxInventory) {
      p.inventory = [...p.inventory, ticketDrop];
    } else if (ticketDrop) {
      ticketDrop = null; // inventory full
    }
  }

  // Bosses always drop a gear item of at least Rare quality
  const droppedItem = m.isBoss
    ? rollBossDrop(m.dropTable, m.level)
    : rollDrop(m.dropTable, m.level);
  let lootAdded = false;
  let lostItemName = null;
  if (droppedItem) {
    if (p.inventory.length < p.maxInventory) {
      p.inventory = [...p.inventory, droppedItem];
      lootAdded = true;
    } else {
      lostItemName = droppedItem.name;
    }
  }

  const prevLevel = state.player.level;
  const { player: leveledPlayer, pendingLevels } = processLevelUps(p);

  // Track stats
  let newStats = state.stats || createInitialStats();
  newStats = addStat(newStats, 'monstersKilled');
  newStats = addStat(newStats, 'battlesWon');
  newStats = addStat(newStats, 'goldEarned', goldGain);
  newStats = addStat(newStats, 'goldFromMonsters', goldGain);
  if (m.id) newStats = addStat(newStats, `killed_${m.id}`);
  if (m.isBoss) newStats = addStat(newStats, 'bossesKilled');
  // Track combat restriction achievements
  const b = state.battle;
  if (!b.usedDefend) {
    newStats = addStat(newStats, 'winsWithoutDefend');
    if (m.isBoss) newStats = addStat(newStats, 'bossKilledNoDefend');
  }
  if (!b.usedPotion) {
    newStats = addStat(newStats, 'winsWithoutPotion');
    if (m.isBoss) newStats = addStat(newStats, 'bossKilledNoPotion');
  }
  if ((b.damageTakenInBattle || 0) === 0) {
    newStats = addStat(newStats, 'flawlessVictories');
  }
  // Track materials collected from battle drops
  if (materialDrop) newStats = addStat(newStats, 'materialsCollected');
  if (bossMaterials) newStats = addStat(newStats, 'materialsCollected', bossMaterials.length);
  if (lootAdded) {
    newStats = addStat(newStats, 'itemsLooted');
    if (droppedItem?.type) {
      const typeKey = { sword: 'swordsLooted', armor: 'armorsLooted', shield: 'shieldsLooted', helmet: 'helmetsLooted', ring: 'ringsLooted', potion: 'potionsLooted', boots: 'bootsLooted', gloves: 'glovesLooted', cape: 'capesLooted', belt: 'beltsLooted', amulet: 'amuletsLooted', accessory: 'accessoriesLooted', 'energy-drink': 'energyDrinksLooted' }[droppedItem.type];
      if (typeKey) newStats = addStat(newStats, typeKey);
    }
  }
  if (leveledPlayer.level > prevLevel) {
    newStats = addStat(newStats, 'levelsGained', leveledPlayer.level - prevLevel);
  }

  // Track tasks
  let newTasks = state.tasks || createInitialTaskProgress();
  newTasks = incrementTaskProgress(newTasks, 'monstersKilled');
  newTasks = incrementTaskProgress(newTasks, 'battlesWon');
  newTasks = incrementTaskProgress(newTasks, 'goldEarned', goldGain);
  if (m.id) newTasks = incrementTaskProgress(newTasks, `killed_${m.id}`);
  if (m.isBoss) newTasks = incrementTaskProgress(newTasks, 'bossesKilled');
  // Track combat restriction quest progress
  if (!b.usedDefend) {
    newTasks = incrementTaskProgress(newTasks, 'winsWithoutDefend');
    if (m.isBoss) newTasks = incrementTaskProgress(newTasks, 'bossKilledNoDefend');
  }
  if (!b.usedPotion) {
    newTasks = incrementTaskProgress(newTasks, 'winsWithoutPotion');
    if (m.isBoss) newTasks = incrementTaskProgress(newTasks, 'bossKilledNoPotion');
  }
  if ((b.damageTakenInBattle || 0) === 0) {
    newTasks = incrementTaskProgress(newTasks, 'flawlessVictories');
  }
  // Track materials collected from battle drops
  if (materialDrop) newTasks = incrementTaskProgress(newTasks, 'materialsCollected');
  if (bossMaterials) newTasks = incrementTaskProgress(newTasks, 'materialsCollected', bossMaterials.length);
  if (lootAdded) newTasks = incrementTaskProgress(newTasks, 'itemsLooted');
  if (leveledPlayer.level > prevLevel) {
    newTasks = incrementTaskProgress(newTasks, 'levelsGained', leveledPlayer.level - prevLevel);
  }

  // Merge any existing pending level-ups (from previous battles) with new ones
  const existingPending = state.pendingLevelUps || [];

  // Progress pet quests (slay, win_battles, slay_boss)
  let updatedPets = state.pets || createInitialPetState();
  updatedPets = progressPetQuests(updatedPets, 'slay', 1, regionId);
  updatedPets = progressPetQuests(updatedPets, 'win_battles', 1, regionId);
  if (m.isBoss) {
    updatedPets = progressPetQuests(updatedPets, 'slay_boss', 1, regionId);
  }

  // Restore energy on level up (like HP/mana)
  const newEnergy = pendingLevels.length > 0 ? ENERGY_MAX : state.energy;

  return {
    ...state,
    screen: 'battle-result',
    player: leveledPlayer,
    stats: newStats,
    tasks: newTasks,
    pets: updatedPets,
    energy: newEnergy,
    pendingLevelUps: [...existingPending, ...pendingLevels],
    battleResult: {
      victory: true, expGain, goldGain,
      droppedItem: lootAdded ? droppedItem : null,
      materialDrop: materialDrop || null,
      bossMaterials: bossMaterials || null,
      eggDrop: eggDrop || null,
      ticketDrop: ticketDrop || null,
      lostItemName,
      levelUps: pendingLevels,
      newLevel: leveledPlayer.level,
      isBoss: !!m.isBoss,
      bossName: m.isBoss ? m.name : null,
      innBonus: innBonus > 0 ? innBonus : null,
    },
  };
}

function handleDefeat(state) {
  const m = state.battle.monster;

  // Arena defeat handling - you already paid the wager, just lose
  if (m.isArenaOpponent && state.arena) {
    return handleArenaDefeat(state);
  }

  const goldLost = Math.floor(state.player.gold * 0.2);

  // Collect all delivery quest item requirements from active quests
  const deliveryItemNames = new Set();
  const tasks = state.tasks || {};
  const lvl = state.player.level || 1;
  const now = Date.now();
  // Daily delivery quests
  const dailyTasks = getActiveDailyTasks(now, lvl);
  for (const t of dailyTasks) {
    if (t.itemRequirements && !(tasks.dailyClaimed || []).includes(t.id)) {
      for (const req of t.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Weekly delivery quests
  const weeklyTasks = getActiveWeeklyTasks(now, lvl);
  for (const t of weeklyTasks) {
    if (t.itemRequirements && !(tasks.weeklyClaimed || []).includes(t.id)) {
      for (const req of t.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Monthly delivery quests
  const monthlyTasks = getActiveMonthlyTasks(now);
  for (const t of monthlyTasks) {
    if (t.itemRequirements && !(tasks.monthlyClaimed || []).includes(t.id)) {
      for (const req of t.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Story delivery quests
  for (const t of STORY_TASKS) {
    if (t.itemRequirements && !(tasks.storyClaimed || []).includes(t.id)) {
      for (const req of t.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Story mission delivery quests
  for (const t of STORY_MISSIONS) {
    if (t.itemRequirements && !(tasks.missionClaimed || []).includes(t.id)) {
      for (const req of t.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Side quest chain delivery quests
  for (const chain of SIDE_QUEST_CHAINS) {
    const current = getCurrentSideQuest(chain.chainId, tasks.sideQuestClaimed);
    if (current?.itemRequirements) {
      for (const req of current.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }
  // Village delivery quests
  const acceptedVQ = tasks.villageQuests?.accepted || [];
  const completedVQ = tasks.villageQuests?.completedQuests || [];
  for (const aq of acceptedVQ) {
    if (completedVQ.includes(aq.questId)) continue;
    const village = Object.values(QUEST_VILLAGES).flat().find(v => v.id === aq.villageId);
    const questDef = village?.quests.find(q => q.id === aq.questId);
    if (questDef?.itemRequirements) {
      for (const req of questDef.itemRequirements) deliveryItemNames.add(req.itemName);
    }
  }

  // Remove delivery quest items from inventory on death
  let newInventory = [...state.player.inventory];
  const lostDeliveryItems = [];
  if (deliveryItemNames.size > 0) {
    newInventory = newInventory.filter(item => {
      if (deliveryItemNames.has(item.name)) {
        lostDeliveryItems.push(item.name);
        return false;
      }
      return true;
    });
  }

  const p = {
    ...state.player,
    gold: state.player.gold - goldLost,
    hp: Math.floor(state.player.maxHp * 0.3),
    mana: Math.floor(state.player.maxMana * 0.5),
    inventory: newInventory,
  };

  let newStats = addStat(state.stats || createInitialStats(), 'battlesLost');
  newStats = addStat(newStats, 'deaths');

  return {
    ...state,
    screen: 'battle-result',
    player: p,
    stats: newStats,
    battleResult: {
      defeated: true, goldLost,
      lostDeliveryItems: lostDeliveryItems.length > 0 ? lostDeliveryItems : null,
      isBoss: !!m?.isBoss,
      bossName: m?.isBoss ? m.name : null,
    },
  };
}

function handleArenaVictory(state) {
  const arena = state.arena;
  const m = state.battle.monster;
  const wager = arena.wager;

  let newStats = state.stats || createInitialStats();
  newStats = addStat(newStats, 'arenaWins');
  newStats = addStat(newStats, 'battlesWon');

  if (arena.tierId === 'normal') {
    // Normal arena: win back wager + earn same amount
    const winnings = wager * 2;
    return {
      ...state,
      screen: 'battle-result',
      player: { ...state.player, gold: state.player.gold + winnings },
      stats: newStats,
      battleResult: {
        victory: true,
        isArena: true,
        arenaType: 'normal',
        goldGain: winnings,
        expGain: 0,
        opponentName: m.name,
        opponentClass: m.arenaClassName,
        wager,
      },
    };
  }

  if (arena.tierId === 'gauntlet') {
    // Gauntlet: keep doubling
    const newWager = (arena.gauntletWager || wager) * 2;
    const wins = (arena.gauntletWins || 0) + 1;
    return {
      ...state,
      screen: 'battle-result',
      stats: newStats,
      arena: {
        ...arena,
        gauntletActive: true,
        gauntletWins: wins,
        gauntletWager: newWager,
      },
      battleResult: {
        victory: true,
        isArena: true,
        arenaType: 'gauntlet',
        goldGain: 0,
        expGain: 0,
        opponentName: m.name,
        opponentClass: m.arenaClassName,
        gauntletWins: wins,
        gauntletPot: newWager,
        wager,
      },
    };
  }

  if (arena.tierId === 'highstakes') {
    // High stakes: win back wager + 1.5x bonus + possible item
    const reward = getHighStakesReward(wager, state.player.level);
    const totalGold = wager + wager + reward.bonusGold;
    let p = { ...state.player, gold: state.player.gold + totalGold };

    let rewardItem = null;
    if (reward.rewardItem && p.inventory.length < p.maxInventory) {
      p = { ...p, inventory: [...p.inventory, reward.rewardItem] };
      rewardItem = reward.rewardItem;
    }

    return {
      ...state,
      screen: 'battle-result',
      player: p,
      stats: newStats,
      battleResult: {
        victory: true,
        isArena: true,
        arenaType: 'highstakes',
        goldGain: totalGold,
        expGain: 0,
        opponentName: m.name,
        opponentClass: m.arenaClassName,
        wager,
        bonusGold: reward.bonusGold,
        droppedItem: rewardItem,
      },
    };
  }

  return state;
}

function handleArenaDefeat(state) {
  const arena = state.arena;
  const m = state.battle.monster;
  const wagerLost = arena.wager;

  // In gauntlet, lose the accumulated pot
  const gauntletLoss = arena.gauntletWager || 0;

  let newStats = state.stats || createInitialStats();
  newStats = addStat(newStats, 'arenaLosses');
  newStats = addStat(newStats, 'battlesLost');

  // Restore HP/Mana partially (arena isn't lethal)
  const p = {
    ...state.player,
    hp: Math.floor(state.player.maxHp * 0.5),
    mana: Math.floor(state.player.maxMana * 0.5),
  };

  return {
    ...state,
    screen: 'battle-result',
    player: p,
    stats: newStats,
    battleResult: {
      defeated: true,
      isArena: true,
      arenaType: arena.tierId,
      goldLost: wagerLost,
      gauntletLoss,
      opponentName: m.name,
      opponentClass: m.arenaClassName,
    },
  };
}

// ---- HOOK ----
export function useGameState(isLoggedIn) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const saveTimerRef = useRef(null);
  const lastSaveRef = useRef(null);

  const playerAtk = useMemo(() => getPlayerAtk(state.player, state.battle), [state.player, state.battle]);
  const playerDef = useMemo(() => getPlayerDef(state.player, state.battle), [state.player, state.battle]);

  // Auto-save to server on every meaningful state change (debounced)
  useEffect(() => {
    if (!isLoggedIn) return;
    if (state.screen === 'town' && state.player.level === 1 && state.player.exp === 0 && state.player.gold === 30) {
      // Don't save the initial default state
    }

    const data = extractSaveData(state);
    const serialized = JSON.stringify(data);

    // Skip if nothing changed
    if (serialized === lastSaveRef.current) return;
    lastSaveRef.current = serialized;

    // Debounce saves to avoid flooding the server
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGame(data).catch(() => {
        // Silent fail - game continues locally
      });
    }, 500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.player, state.screen, state.energy, state.lastEnergyUpdate, state.stats, state.tasks, state.base, state.pets, state.pendingLevelUps, state.discoveredItemLocations, isLoggedIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'ENERGY_TICK', now: Date.now() });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const actions = useMemo(() => ({
    startGame: () => dispatch({ type: 'START_GAME' }),
    setUsername: (name) => dispatch({ type: 'SET_USERNAME', name }),
    selectClass: (classId) => dispatch({ type: 'SELECT_CLASS', classId }),
    goToTown: () => dispatch({ type: 'GO_TO_TOWN' }),
    showScreen: (screen) => dispatch({ type: 'SHOW_SCREEN', screen }),
    selectRegion: (region) => dispatch({ type: 'SELECT_REGION', region }),
    backToRegions: () => dispatch({ type: 'BACK_TO_REGIONS' }),
    leaveLocation: () => dispatch({ type: 'LEAVE_LOCATION' }),
    enterLocation: (loc) => dispatch({ type: 'ENTER_LOCATION', location: loc }),
    exploreStep: () => dispatch({ type: 'EXPLORE_STEP' }),
    randomEventChoose: (choiceIndex) => dispatch({ type: 'RANDOM_EVENT_CHOOSE', choiceIndex }),
    eventResultContinue: () => dispatch({ type: 'EVENT_RESULT_CONTINUE' }),
    villageAcceptQuest: (questId, villageId) => dispatch({ type: 'VILLAGE_ACCEPT_QUEST', questId, villageId }),
    villageTurnInQuest: (questId, villageId) => dispatch({ type: 'VILLAGE_TURN_IN_QUEST', questId, villageId }),
    villageTraderBuy: (dealId) => dispatch({ type: 'VILLAGE_TRADER_BUY', dealId }),
    villageLeave: () => dispatch({ type: 'VILLAGE_LEAVE' }),
    traderBuy: (dealId) => dispatch({ type: 'TRADER_BUY', dealId }),
    traderLeave: () => dispatch({ type: 'TRADER_LEAVE' }),
    traderAcceptQuest: (questId, traderId) => dispatch({ type: 'TRADER_ACCEPT_QUEST', questId, traderId }),
    traderTurnInQuest: (questId, traderId) => dispatch({ type: 'TRADER_TURN_IN_QUEST', questId, traderId }),
    tavernAcceptQuest: (questId, npcId) => dispatch({ type: 'TAVERN_ACCEPT_QUEST', questId, npcId }),
    tavernTurnInQuest: (questId, npcId) => dispatch({ type: 'TAVERN_TURN_IN_QUEST', questId, npcId }),
    tavernBuyItem: (itemDef, npcId) => dispatch({ type: 'TAVERN_BUY_ITEM', itemDef, npcId }),
    tavernLearnFactionSkill: (skillId, npcId) => dispatch({ type: 'TAVERN_LEARN_FACTION_SKILL', skillId, npcId }),
    battleFactionSkill: (skillId) => dispatch({ type: 'BATTLE_USE_FACTION_SKILL', skillId }),
    battleAttack: () => dispatch({ type: 'BATTLE_PLAYER_ATTACK' }),
    battleSkill: () => dispatch({ type: 'BATTLE_PLAYER_SKILL' }),
    battleTreeSkill: (skillId) => dispatch({ type: 'BATTLE_USE_TREE_SKILL', skillId }),
    battleDefend: () => dispatch({ type: 'BATTLE_DEFEND' }),
    battleChannel: () => dispatch({ type: 'BATTLE_CHANNEL' }),
    battlePotion: () => dispatch({ type: 'BATTLE_USE_POTION' }),
    battleRun: () => dispatch({ type: 'BATTLE_RUN' }),
    toggleSkillMenu: () => dispatch({ type: 'TOGGLE_SKILL_MENU' }),
    toggleInspectMonster: () => dispatch({ type: 'TOGGLE_INSPECT_MONSTER' }),
    unlockSkill: (skillId) => dispatch({ type: 'UNLOCK_SKILL', skillId }),
    bossAccept: () => dispatch({ type: 'BOSS_ACCEPT' }),
    bossDecline: () => dispatch({ type: 'BOSS_DECLINE' }),
    monsterTurn: () => dispatch({ type: 'MONSTER_TURN' }),
    battleParry: () => dispatch({ type: 'BATTLE_PARRY' }),
    battleChangeStance: (stance) => dispatch({ type: 'BATTLE_CHANGE_STANCE', stance }),
    battleUniversalSkill: (skillId) => dispatch({ type: 'BATTLE_UNIVERSAL_SKILL', skillId }),
    continueAfterBattle: () => dispatch({ type: 'CONTINUE_AFTER_BATTLE' }),
    applyStatChoices: (selectedStats) => dispatch({ type: 'APPLY_STAT_CHOICES', selectedStats }),
    restAtInn: () => dispatch({ type: 'REST_AT_INN' }),
    equipItem: (item, targetSlot) => dispatch({ type: 'EQUIP_ITEM', item, targetSlot }),
    unequipItem: (slot) => dispatch({ type: 'UNEQUIP_ITEM', slot }),
    useItem: (item) => dispatch({ type: 'USE_ITEM', item }),
    sellItem: (item) => dispatch({ type: 'SELL_ITEM', item }),
    sellUnequippable: () => dispatch({ type: 'SELL_UNEQUIPPABLE' }),
    reorderInventory: (fromIndex, toIndex) => dispatch({ type: 'REORDER_INVENTORY', fromIndex, toIndex }),
    buyItem: (item, shopSeed) => dispatch({ type: 'BUY_ITEM', item, shopSeed }),
    tradeForChest: (chestId) => dispatch({ type: 'TRADE_MATERIALS_FOR_CHEST', chestId }),
    claimDailyReward: (rewards, label) => dispatch({ type: 'CLAIM_DAILY_REWARD', rewards, label }),
    claimTask: (taskId, taskType, chainId) => dispatch({ type: 'CLAIM_TASK', taskId, taskType, chainId }),
    pinQuest: (questId) => dispatch({ type: 'PIN_QUEST', questId }),
    unpinQuest: (questId) => dispatch({ type: 'UNPIN_QUEST', questId }),
    activateQuestLine: (lineKey) => dispatch({ type: 'ACTIVATE_QUEST_LINE', lineKey }),
    abandonQuestLine: (lineKey) => dispatch({ type: 'ABANDON_QUEST_LINE', lineKey }),
    applyTrade: (receivedItems, receivedGold, givenItems, givenGold) => dispatch({ type: 'APPLY_TRADE', receivedItems, receivedGold, givenItems, givenGold }),
    applyMarketTransaction: (transaction) => dispatch({ type: 'MARKET_TRANSACTION', transaction }),
    openChest: () => dispatch({ type: 'OPEN_CHEST' }),
    closeChestResult: () => dispatch({ type: 'CLOSE_CHEST_RESULT' }),
    clearMessage: () => dispatch({ type: 'CLEAR_MESSAGE' }),
    loadSave: (saveData) => dispatch({ type: 'LOAD_SAVE', saveData }),
    // Base building actions
    baseBuild: (buildingId) => dispatch({ type: 'BASE_BUILD', buildingId }),
    baseAddFuel: (item) => dispatch({ type: 'BASE_ADD_FUEL', item }),
    baseAddFuelFromStorage: (materialId) => dispatch({ type: 'BASE_ADD_FUEL_FROM_STORAGE', materialId }),
    baseStoreMaterial: (item) => dispatch({ type: 'BASE_STORE_MATERIAL', item }),
    baseWithdrawMaterial: (materialId) => dispatch({ type: 'BASE_WITHDRAW_MATERIAL', materialId }),
    baseBrew: (recipeId) => dispatch({ type: 'BASE_BREW', recipeId }),
    baseSmelt: (recipeId, gearItem) => dispatch({ type: 'BASE_SMELT', recipeId, gearItem }),
    baseCraft: (recipeId) => dispatch({ type: 'BASE_CRAFT', recipeId }),
    baseCollectCraft: () => dispatch({ type: 'BASE_COLLECT_CRAFT' }),
    baseUpgradeInn: () => dispatch({ type: 'BASE_UPGRADE_INN' }),
    baseBuyInnBoost: (boostId) => dispatch({ type: 'BASE_BUY_INN_BOOST', boostId }),
    baseUpgradeChamber: (subUpgradeId) => dispatch({ type: 'BASE_UPGRADE_CHAMBER', subUpgradeId }),
    baseSendMission: (missionId) => dispatch({ type: 'BASE_SEND_MISSION', missionId }),
    baseCollectMission: () => dispatch({ type: 'BASE_COLLECT_MISSION' }),
    baseBankDeposit: (amount) => dispatch({ type: 'BASE_BANK_DEPOSIT', amount }),
    baseBankWithdraw: (amount) => dispatch({ type: 'BASE_BANK_WITHDRAW', amount }),
    baseBankFreeze: (amount, freezeOptionId) => dispatch({ type: 'BASE_BANK_FREEZE', amount, freezeOptionId }),
    baseBankCollectFrozen: () => dispatch({ type: 'BASE_BANK_COLLECT_FROZEN' }),
    baseBankLoan: (amount) => dispatch({ type: 'BASE_BANK_LOAN', amount }),
    baseBankRepay: () => dispatch({ type: 'BASE_BANK_REPAY' }),
    baseStartSpar: (dummyId) => dispatch({ type: 'BASE_START_SPAR', dummyId }),
    baseSparAttack: () => dispatch({ type: 'BASE_SPAR_ATTACK' }),
    baseSparSkill: () => dispatch({ type: 'BASE_SPAR_SKILL' }),
    baseResetSpar: () => dispatch({ type: 'BASE_RESET_SPAR' }),
    baseFarmPlant: (plotIndex, cropId) => dispatch({ type: 'BASE_FARM_PLANT', plotIndex, cropId }),
    baseFarmPlantSeed: (plotIndex, seedItemId) => dispatch({ type: 'BASE_FARM_PLANT_SEED', plotIndex, seedItemId }),
    baseFarmHarvest: (plotIndex) => dispatch({ type: 'BASE_FARM_HARVEST', plotIndex }),
    baseUpgradeWarehouse: () => dispatch({ type: 'BASE_UPGRADE_WAREHOUSE' }),
    basePlaceEgg: (itemId) => dispatch({ type: 'BASE_PLACE_EGG', itemId }),
    baseFeedIncubator: (itemId) => dispatch({ type: 'BASE_FEED_INCUBATOR', itemId }),
    baseCollectHatch: (slotIndex) => dispatch({ type: 'BASE_COLLECT_HATCH', slotIndex }),
    baseUpgradeIncubator: () => dispatch({ type: 'BASE_UPGRADE_INCUBATOR' }),
    // Pet actions
    buyPet: (petId) => dispatch({ type: 'BUY_PET', petId }),
    buyPetItem: (item) => dispatch({ type: 'BUY_PET_ITEM', item }),
    equipPet: (petInstanceId) => dispatch({ type: 'EQUIP_PET', petInstanceId }),
    unequipPet: (petInstanceId) => dispatch({ type: 'UNEQUIP_PET', petInstanceId }),
    feedPet: (petInstanceId, item) => dispatch({ type: 'FEED_PET', petInstanceId, item }),
    energyPet: (petInstanceId, item) => dispatch({ type: 'ENERGY_PET', petInstanceId, item }),
    petBuild: (buildingId) => dispatch({ type: 'PET_BUILD', buildingId }),
    petUpgradeBuilding: (buildingId) => dispatch({ type: 'PET_UPGRADE_BUILDING', buildingId }),
    // Pet quest actions
    acceptPetQuest: (petInstanceId, questId) => dispatch({ type: 'ACCEPT_PET_QUEST', petInstanceId, questId }),
    abandonPetQuest: (petInstanceId, questId) => dispatch({ type: 'ABANDON_PET_QUEST', petInstanceId, questId }),
    completePetQuest: (petInstanceId, questId) => dispatch({ type: 'COMPLETE_PET_QUEST', petInstanceId, questId }),
    petQuestGiveItem: (petInstanceId, item) => dispatch({ type: 'PET_QUEST_GIVE_ITEM', petInstanceId, item }),
    petQuestGiveGold: (petInstanceId, amount) => dispatch({ type: 'PET_QUEST_GIVE_GOLD', petInstanceId, amount }),
    // Arena actions
    arenaStartDuel: (tierId, wager) => dispatch({ type: 'ARENA_START_DUEL', tierId, wager }),
    arenaGauntletContinue: () => dispatch({ type: 'ARENA_GAUNTLET_CONTINUE' }),
    arenaGauntletCashout: () => dispatch({ type: 'ARENA_GAUNTLET_CASHOUT' }),
    arenaLeave: () => dispatch({ type: 'ARENA_LEAVE' }),
  }), []);

  return { state, actions, playerAtk, playerDef };
}
