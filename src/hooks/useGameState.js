import { useReducer, useCallback, useMemo, useEffect, useRef } from 'react';
import { expForLevel, SKILLS, EXPLORE_TEXTS, CHARACTER_CLASSES, REGIONS, RANDOM_EVENTS } from '../data/gameData';
import { getTimePeriod, getWeather, getCombinedEffects } from './useGameClock';
import { getSkillElement, getWeatherSpellBuff } from '../engine/elements';
import { SKILL_TREES, getTreeSkill } from '../data/skillTrees';
import { calcDamage, getClassData, playerHasSkill, getEffectiveManaCost, getPlayerAtk, getPlayerDef, getPlayerDodgeChance, getBattleMaxHp, getBattleMaxMana, getSkillPassiveBonus, rollSpellEcho, getEffectiveDef, getExecuteMultiplier, getCharismaPriceBonus, getPlayerCritChance, getPlayerCritMultiplier, getMonsterCritChance, getMonsterCritMultiplier } from '../engine/combat';
import { applySkillEffect } from '../engine/skillEffects';
import { applyAttackPassives, applySkillPassives, applyLifeTap, tryBladeDance, tryLuckyStrike, applyTurnStartPassives, applyDamageReduction, applyManaShield, checkDodge, applySurvivalPassives, applyCursedBlood } from '../engine/passives';
import { scaleMonster, scaleBoss, scaleRewardByLevel } from '../engine/scaling';
import { rollDrop, generateItem, generateRewardItem, rollMaterialDrop, generateCraftedItem, generateCampLoot, generateLocationItem, rollEggDrop } from '../engine/loot';
import { createInitialBase, BUILDINGS, BREWERY_RECIPES, SMELTER_RECIPES, WORKSHOP_RECIPES, BUILDING_MATERIALS, FUEL_ITEMS, getChamberBuffs, getInnExpBonus, getWarehouseBonus, createMaterialItem, SPARRING_DUMMIES, EGG_TYPES, getIncubatorSpeedBonus, getIncubatorSlots, getIncubatorFood, INCUBATOR_MAX_FOOD, INCUBATOR_FOOD, createCropFoodItem } from '../data/baseData';
import { createInitialPetState, createPetInstance, PET_CATALOG, PET_MAX_BOND, PET_MAX_ENERGY, PET_MAX_SLOTS, PET_BOND_DECAY_PER_BATTLE, PET_ENERGY_COST_PER_BATTLE, PET_BUILDINGS, getPetBuildingBuffs, willPetFight, calcPetDamage, calcPetAbsorb, calcPetHeal, calcPetBuffs, PET_SNACKS, PET_ENERGY_POTIONS, PET_QUEST_POOL, PET_MAX_ACTIVE_QUESTS, pickQuestsToOffer } from '../data/petData';
import { saveGame } from '../api';
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
} from '../data/tasks';

export const ENERGY_MAX = 100;
export const ENERGY_COST_PER_TRIP = 10;
const ENERGY_COST_PER_STEP = 2;
export const ENERGY_REGEN_PERCENT = 0.1;
export const ENERGY_REGEN_INTERVAL_MS = 15 * 60 * 1000;

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
    gold: 30,
    equipment: { weapon: null, shield: null, helmet: null, armor: null, gloves: null, boots: null, belt: null, cape: null, amulet: null, accessory: null, accessory2: null },
    inventory: [],
    maxInventory: 20,
    skillTree: [],
  };
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
    pendingBoss: null,
    pendingLevelUps: [],
    stats: createInitialStats(),
    tasks: createInitialTaskProgress(),
    base: createInitialBase(),
    pets: createInitialPetState(),
    discoveredItemLocations: {}, // { itemName: [locationId, ...] }
  };
}

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

// Increment task progress for matching stat key
function incrementTaskProgress(tasks, statKey, amount = 1) {
  const now = Date.now();
  let t = refreshTaskCycles(tasks);

  // Helper to update progress for a task list
  const updateProgress = (activeTasks, progress) => {
    const updated = { ...progress };
    for (const task of activeTasks) {
      if (task.stat === statKey) {
        updated[task.id] = (updated[task.id] || 0) + amount;
      }
    }
    return updated;
  };

  return {
    ...t,
    dailyProgress: updateProgress(getActiveDailyTasks(now), t.dailyProgress),
    weeklyProgress: updateProgress(getActiveWeeklyTasks(now), t.weeklyProgress),
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
    };
    pendingLevels.push({ level: p.level, offers, picks: STAT_PICKS_PER_LEVEL });
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
    screen: (state.screen === 'battle' || state.screen === 'battle-result' || state.screen === 'boss-confirm') ? 'town' : state.screen,
    pendingLevelUps: state.pendingLevelUps || [],
    energy: state.energy,
    lastEnergyUpdate: state.lastEnergyUpdate,
    currentRegionId: state.currentRegion?.id || null,
    stats: state.stats,
    tasks: state.tasks,
    base: state.base,
    pets: state.pets,
    discoveredItemLocations: state.discoveredItemLocations,
  };
}

// ---- PET BATTLE HELPERS ----
function createBattleState(monster) {
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
  switch (action.type) {
    case 'LOAD_SAVE': {
      const { player, screen, energy, lastEnergyUpdate, currentRegionId, stats, tasks, base: savedBase, pendingLevelUps: savedPending, discoveredItemLocations: savedDiscovered, pets: savedPets } = action.saveData || {};
      const baseState = createInitialState();
      const regen = regenEnergy(
        energy ?? baseState.energy,
        lastEnergyUpdate ?? baseState.lastEnergyUpdate,
      );
      const mergedPlayer = { ...baseState.player, ...player };
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
        currentRegion: savedRegion,
        stats: mergedStats,
        tasks: mergedTasks,
        base: mergedBase,
        pets: mergedPets,
        pendingLevelUps: mergedPending,
        discoveredItemLocations: savedDiscovered || {},
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
      };
      return { ...state, screen: 'town', player: p };
    }

    case 'GO_TO_TOWN':
      return { ...state, screen: 'town', currentRegion: null, currentLocation: null, battle: null, battleResult: null, battleLog: [], pendingBoss: null };

    case 'SHOW_SCREEN':
      return { ...state, screen: action.screen };

    case 'SELECT_REGION': {
      const region = action.region;
      if (!region) return state;
      const cost = region.travelCost || 0;
      if (cost > 0 && state.player.gold < cost) {
        return { ...state, message: `Not enough gold for the ticket! (${cost}g needed)` };
      }
      return {
        ...state,
        screen: 'locations',
        currentRegion: region,
        player: cost > 0
          ? { ...state.player, gold: state.player.gold - cost }
          : state.player,
      };
    }

    case 'BACK_TO_REGIONS':
      return { ...state, screen: 'regions', currentRegion: null };

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
          screen: 'town',
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

      // Boss encounter check (0.5% chance when location has a boss)
      if (loc.boss && Math.random() < (loc.bossRate || 0.005)) {
        const boss = scaleBoss(loc.boss, loc.levelReq);
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

      // Random event check (5% base chance, modified by time/weather)
      const effects = getCurrentEffects();
      const weatherId = getCurrentWeatherId();
      const eventChance = 0.05 * effects.eventChanceMult;
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

      const adjustedEncounterRate = loc.encounterRate * effects.encounterMult;
      if (Math.random() < adjustedEncounterRate) {
        const monsterId = loc.monsters[Math.floor(Math.random() * loc.monsters.length)];
        const monster = scaleMonster(monsterId, loc.levelReq);
        return {
          ...state, screen: 'battle',
          exploreText: text,
          energy: exploreEnergy,
          lastEnergyUpdate: exploreLastUpdate,
          pets: petsAfterExplore,
          battle: createBattleState(monster),
          battleLog: [{ text: `A ${monster.name} appears!`, type: 'info' }],
          battleResult: null,
        };
      }

      // No encounter - chance to find loot, gold, or nothing (modified by time/weather)
      const lootChance = (loc.lootRate ?? 0.3) * effects.lootMult;
      let newText = text;
      let newPlayer = state.player;
      let newDiscovered = state.discoveredItemLocations;
      let newFoundItem = null;
      const lootTable = ['potion', 'ring', 'boots', 'helmet', 'armor', 'sword', 'shield', 'energy-drink'];

      if (Math.random() < lootChance) {
        if (state.player.inventory.length < state.player.maxInventory) {
          let foundItem;
          // 40% chance to find a location-specific item
          if (Math.random() < 0.4) {
            foundItem = generateLocationItem(loc.id, Math.max(loc.levelReq, state.player.level));
          }
          if (!foundItem) {
            const dropType = lootTable[Math.floor(Math.random() * lootTable.length)];
            foundItem = generateItem(dropType, Math.max(loc.levelReq, state.player.level));
          }
          // Track discovery if the item has a foundLocation
          if (foundItem.foundLocation) {
            const existing = newDiscovered[foundItem.name] || [];
            if (!existing.includes(foundItem.foundLocation)) {
              newDiscovered = { ...newDiscovered, [foundItem.name]: [...existing, foundItem.foundLocation] };
            }
          }
          newPlayer = { ...state.player, inventory: [...state.player.inventory, foundItem] };
          newText = text + `\n\nYou scavenge ${foundItem.name} from a busted crate.`;
          newFoundItem = foundItem;
        } else {
          newText = text + '\n\nYou find loot but your pack is full.';
        }
      } else if (Math.random() < 0.3) {
        const found = Math.floor(3 + Math.random() * Math.max(2, state.player.level * 2));
        newPlayer = { ...state.player, gold: state.player.gold + found };
        newText = text + `\n\nYou find ${found} gold tucked under debris.`;
      } else {
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
          if (p.inventory.length < p.maxInventory) {
            const lootTypes = ['potion', 'ring', 'boots', 'helmet', 'armor', 'sword', 'shield'];
            const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
            const foundItem = generateItem(dropType, lvl);
            p = { ...p, inventory: [...p.inventory, foundItem] };
            resultText += ` (Found: ${foundItem.name})`;
            resultType = 'good';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'item_rare': {
          if (p.inventory.length < p.maxInventory) {
            const lootTypes = ['ring', 'boots', 'helmet', 'armor', 'sword', 'shield'];
            const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
            const foundItem = generateItem(dropType, lvl + 3);
            p = { ...p, inventory: [...p.inventory, foundItem] };
            resultText += ` (Found: ${foundItem.name})`;
            resultType = 'great';
          } else {
            resultText += ' But your inventory is full!';
            resultType = 'neutral';
          }
          break;
        }
        case 'item_great': {
          if (p.inventory.length < p.maxInventory) {
            const lootTypes = ['ring', 'sword', 'armor', 'shield'];
            const dropType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
            const foundItem = generateItem(dropType, lvl + 6);
            p = { ...p, inventory: [...p.inventory, foundItem] };
            resultText += ` (Found: ${foundItem.name})`;
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
            battle: createBattleState(monster),
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

    case 'BATTLE_PLAYER_ATTACK': {
      let b = { ...state.battle };
      let m = { ...b.monster };
      let p = { ...state.player };
      const cls = getClassData(p);
      let dmg = calcDamage(getPlayerAtk(p, b), m.def);

      const lucky = tryLuckyStrike(p, dmg);
      dmg = lucky.dmg;

      // Critical hit check (stacks with lucky strike)
      let playerCrit = false;
      if (Math.random() < getPlayerCritChance(p)) {
        dmg = Math.floor(dmg * getPlayerCritMultiplier(p));
        playerCrit = true;
      }

      m.hp = Math.max(0, m.hp - dmg);
      b.monster = m;
      b.defending = false;
      b.defendedLastTurn = false;
      b.showSkillMenu = false;
      b.showInspect = false;
      let log = [...state.battleLog];
      if (lucky.procced && playerCrit) {
        log.push({ text: `Lucky Strike + CRIT! Devastating ${dmg} damage!`, type: 'dmg-monster' });
      } else if (lucky.procced) {
        log.push({ text: `Lucky Strike! Double damage for ${dmg}!`, type: 'dmg-monster' });
      } else if (playerCrit) {
        log.push({ text: `CRITICAL HIT! You attack for ${dmg} damage!`, type: 'dmg-monster' });
      } else {
        log.push({ text: `You attack for ${dmg} damage!`, type: 'dmg-monster' });
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
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', totalDmg);

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
      const manaCost = getEffectiveManaCost(p, cls?.skillManaCost || 0, b);

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

      const effectiveDef = getEffectiveDef(m.def, skillEffect);
      let dmg = calcDamage(atkValue, effectiveDef);

      // Critical hit check for skills
      let skillCrit = false;
      if (Math.random() < getPlayerCritChance(p)) {
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
      const critLabel = skillCrit ? 'CRIT! ' : '';
      if (echoProc) {
        log.push({ text: `${critLabel}Spell Echo! ${skillName} for ${dmg} damage!${classWeatherLabel}`, type: 'dmg-monster' });
      } else {
        log.push({ text: `${critLabel}${skillName} for ${dmg} damage!${classWeatherLabel}`, type: 'dmg-monster' });
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
      let newTasks = incrementTaskProgress(state.tasks, 'damageDealt', dmg);

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
      const manaCost = getEffectiveManaCost(p, skill.manaCost || 0, b);
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

      const effectiveDef = getEffectiveDef(m.def, skill.effect);
      let finalMult = getExecuteMultiplier(skill.effect, m.hp, m.maxHp);
      if (skill.effect === 'counter' && b.defendedLastTurn) finalMult = 1.25;

      let dmg = calcDamage(Math.floor(atkValue * finalMult), effectiveDef);

      // Critical hit check for tree skills
      let treeCrit = false;
      if (Math.random() < getPlayerCritChance(p)) {
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
      const treeCritLabel = treeCrit ? 'CRIT! ' : '';
      if (echoProc) {
        log.push({ text: `${treeCritLabel}Spell Echo! ${skill.name} for ${dmg} damage!${weatherBuffLabel}`, type: 'dmg-monster' });
      } else {
        log.push({ text: `${treeCritLabel}${skill.name} for ${dmg} damage!${weatherBuffLabel}`, type: 'dmg-monster' });
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

    case 'BATTLE_DEFEND': {
      const b = { ...state.battle, defending: true, defendedLastTurn: true, showSkillMenu: false, showInspect: false };
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
      const potionIdx = state.player.inventory.findIndex(i => i.type === 'potion');
      if (potionIdx === -1) return { ...state, message: 'No potions!' };
      const potion = state.player.inventory[potionIdx];
      const bMaxHp = getBattleMaxHp(state.player);
      let potionHeal = potion.healAmount;
      if (playerHasSkill(state.player, 'thf_t5a')) potionHeal = Math.floor(potionHeal * 1.3);
      if (playerHasSkill(state.player, 'nec_t10a')) potionHeal = potionHeal * 2; // Lich Form
      const healed = Math.min(potionHeal, bMaxHp - state.player.hp);
      if (healed === 0) return { ...state, message: 'HP is already full!' };
      const newInv = state.player.inventory.filter((_, i) => i !== potionIdx);
      const p = { ...state.player, hp: state.player.hp + healed, inventory: newInv };
      const b = { ...state.battle, defending: false, showSkillMenu: false, showInspect: false };
      const log = [...state.battleLog, { text: `Used ${potion.name}, healed ${healed} HP!`, type: 'heal' }];
      let newStats = addStat(state.stats, 'potionsUsed');
      newStats = addStat(newStats, 'totalHealing', healed);
      let newTasks = incrementTaskProgress(state.tasks, 'potionsUsed');
      return { ...state, player: p, battle: b, battleLog: log, stats: newStats, tasks: newTasks };
    }

    case 'BOSS_ACCEPT': {
      const boss = state.pendingBoss;
      if (!boss) return { ...state, screen: 'explore', pendingBoss: null };
      return {
        ...state, screen: 'battle',
        pendingBoss: null,
        battle: createBattleState(boss),
        battleLog: [
          { text: `BOSS BATTLE!`, type: 'info' },
          { text: `${boss.name} - ${boss.title} appears!`, type: 'info' },
        ],
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
      const cls = getClassData(state.player);
      let escapeChance = (cls?.passive === 'Greed') ? 0.75 : 0.5;
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

      // Tick down buffs
      if (b.avatarTurns > 0) b.avatarTurns--;
      if (b.armorBreakTurns > 0) b.armorBreakTurns--;

      // Turn-start passives (regeneration, meditation, mana regen, dark pact)
      ({ player: p, battle: b, log } = applyTurnStartPassives({ player: p, battle: b, log }));

      // Check dodge (shadow step, evasion mastery, shadow dance, aegis)
      let dodged;
      ({ dodged, battle: b, log } = checkDodge(p, b, log));

      if (!dodged) {
        const useSkill = m.skills.length > 0 && Math.random() < 0.3;
        const mSkillId = useSkill ? m.skills[Math.floor(Math.random() * m.skills.length)] : null;
        const mSkill = mSkillId ? SKILLS[mSkillId] : null;

        let dmg;
        if (mSkill) {
          const rawAtk = Math.floor(m.atk * mSkill.multiplier);
          dmg = calcDamage(rawAtk, getPlayerDef(p, b));
        } else {
          dmg = calcDamage(m.atk, getPlayerDef(p, b));
        }

        // Monster critical hit check
        let monsterCrit = false;
        if (Math.random() < getMonsterCritChance(m)) {
          dmg = Math.floor(dmg * getMonsterCritMultiplier());
          monsterCrit = true;
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

        const critPrefix = monsterCrit ? 'CRIT! ' : '';
        if (mSkill) {
          log.push({ text: `${critPrefix}${m.name} uses ${mSkill.name} for ${dmg} damage!`, type: 'dmg-player' });
          if (mSkill.effect === 'poison') {
            if (playerHasSkill(p, 'nec_t10a')) {
              log.push({ text: 'Lich Form: immune to poison!', type: 'info' });
            } else {
              let dur = 3;
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
          }
        } else {
          log.push({ text: `${critPrefix}${m.name} attacks for ${dmg} damage!`, type: 'dmg-player' });
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

      // Cursed Blood: chance to poison attacker when hit
      if (!dodged) {
        ({ battle: b, log } = applyCursedBlood(p, b, log));
      }

      // Survival passives (undying will, death's embrace)
      ({ player: p, battle: b, log } = applySurvivalPassives({ player: p, battle: b, log }));

      b.monster = m;
      b.isPlayerTurn = true;
      b.defending = false;

      // Track damage taken (difference from start hp)
      const hpLost = Math.max(0, state.player.hp - p.hp);
      const newStats = hpLost > 0 ? addStat(state.stats, 'damageTaken', hpLost) : state.stats;

      if (p.hp <= 0) {
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

      return { ...state, player: p, battle: b, battleLog: log, stats: newStats };
    }

    case 'CONTINUE_AFTER_BATTLE': {
      if (state.battleResult?.defeated) {
        return { ...state, screen: 'town', battle: null, battleResult: null, battleLog: [], currentLocation: null, currentRegion: null };
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
      if (state.player.gold < 10) return { ...state, message: 'Not enough gold! (10g needed)' };
      const chamberBuffs = getChamberBuffs(state.base);
      const healBonus = chamberBuffs.healBonus || 0;
      const newStats = addStat(state.stats, 'goldSpent', 10);
      const maxHpWithBuff = state.player.maxHp + (chamberBuffs.hpBuff || 0);
      const maxManaWithBuff = state.player.maxMana + (chamberBuffs.manaBuff || 0);
      return {
        ...state, message: healBonus > 0 ? `HP restored! (+${Math.round(healBonus * 100)}% chamber bonus)` : 'HP restored!',
        stats: newStats,
        player: {
          ...state.player,
          gold: state.player.gold - 10,
          hp: maxHpWithBuff,
          mana: maxManaWithBuff,
        },
      };
    }

    case 'EQUIP_ITEM': {
      const item = action.item;
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
          inventory: state.player.inventory.filter(i => i.id !== item.id),
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
          inventory: state.player.inventory.filter(i => i.id !== item.id),
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
        const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
        return {
          ...state,
          player: p,
          base: { ...state.base, incubatorFood: newFood, incubatorFoodLastUpdate: now },
          message: `Fed incubator with ${item.name}! +${addMinutes} min`,
        };
      }
      // Material items: "use" stores them in base
      if (item.type === 'material') {
        const matId = item.materialId;
        const qty = item.stackQuantity || 1;
        const mats = { ...state.base.materials };
        mats[matId] = (mats[matId] || 0) + qty;
        const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
        return {
          ...state,
          player: p,
          base: { ...state.base, materials: mats },
          message: `Stored ${qty}x ${item.name} in base.`,
        };
      }
      return state;
    }

    case 'SELL_ITEM': {
      const item = action.item;
      const charismaBonus = getCharismaPriceBonus(state.player);
      const adjustedSellPrice = Math.floor(item.sellPrice * (1 + charismaBonus));
      const p = {
        ...state.player,
        gold: state.player.gold + adjustedSellPrice,
        inventory: state.player.inventory.filter(i => i.id !== item.id),
      };
      let newStats = addStat(state.stats, 'itemsSold');
      newStats = addStat(newStats, 'goldEarned', item.sellPrice);
      let newTasks = incrementTaskProgress(state.tasks, 'itemsSold');
      newTasks = incrementTaskProgress(newTasks, 'goldEarned', item.sellPrice);
      return { ...state, player: p, message: `Sold for ${item.sellPrice}g!`, stats: newStats, tasks: newTasks };
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
      if (state.player.inventory.length >= state.player.maxInventory) return { ...state, message: 'Inventory full!' };
      const newItem = { ...item, id: 'item_' + Date.now() + '_' + Math.random() };
      delete newItem.buyPrice;
      const p = {
        ...state.player,
        gold: state.player.gold - adjustedBuyPrice,
        inventory: [...state.player.inventory, newItem],
      };
      const newStats = addStat(state.stats, 'goldSpent', item.buyPrice);
      return { ...state, player: p, message: `Purchased ${item.name}!`, stats: newStats };
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
      // Add received items
      if (receivedItems && receivedItems.length > 0) {
        p.inventory = p.inventory.concat(receivedItems);
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
        if (tx.item) p.inventory = [...p.inventory, tx.item];
        if (tx.newGold !== undefined) p.gold = tx.newGold;
      } else if (tx.type === 'list') {
        // Remove listed item, update gold (listing fee deducted)
        if (tx.removedItemId) p.inventory = p.inventory.filter(i => i.id !== tx.removedItemId);
        if (tx.newGold !== undefined) p.gold = tx.newGold;
      } else if (tx.type === 'cancel') {
        // Return cancelled item to inventory
        if (tx.returnedItem) p.inventory = [...p.inventory, tx.returnedItem];
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
            if (p.inventory.length < p.maxInventory) {
              const generated = generateRewardItem(r, p.level);
              if (generated) {
                p.inventory.push(generated);
                itemNames.push(generated.name);
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
      let taskDef = null;
      let progress = 0;
      if (taskType === 'daily') {
        taskDef = getActiveDailyTasks(now).find(t => t.id === taskId);
        progress = tasks.dailyProgress[taskId] || 0;
      } else if (taskType === 'weekly') {
        taskDef = getActiveWeeklyTasks(now).find(t => t.id === taskId);
        progress = tasks.weeklyProgress[taskId] || 0;
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

      if (!taskDef || progress < taskDef.target) return state;

      // Apply reward — daily and weekly gold scales with player level
      let p = { ...state.player };
      const scaleGold = taskType === 'daily' || taskType === 'weekly';
      const goldAmount = taskDef.reward.gold
        ? (scaleGold ? scaleRewardByLevel(taskDef.reward.gold, p.level) : taskDef.reward.gold)
        : 0;
      if (goldAmount) {
        p.gold += goldAmount;
      }

      const newStats = goldAmount ? addStat(state.stats, 'goldEarned', goldAmount) : state.stats;
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
        message: `Task complete: ${taskDef.name}! +${goldAmount}g`,
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
      if (energy === state.energy && lastEnergyUpdate === state.lastEnergyUpdate) return state;
      return { ...state, energy, lastEnergyUpdate };
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
        newPlayer.maxInventory = (state.player.maxInventory || 20) + bonus;
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

      const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
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
      const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
      return {
        ...state,
        player: p,
        base: { ...state.base, materials: mats },
        message: `Stored ${qty}x ${item.name}.`,
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
          if (item && p.inventory.length < p.maxInventory) {
            p.inventory.push(item);
            msg = `Brewed ${item.name}!`;
          } else {
            return { ...state, message: 'Inventory full!' };
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
        if (recipe?.result?.template) {
          const item = generateCraftedItem(recipe.result.template, state.player.level);
          if (item && p.inventory.length < p.maxInventory) {
            p.inventory.push(item);
            msg = `Crafted ${item.name}!`;
          } else {
            return { ...state, message: 'Inventory full!' };
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

    case 'BASE_FARM_HARVEST': {
      if (!state.base.buildings.farm?.built) return { ...state, message: 'Build a Farm first!' };
      const hPlotIndex = action.plotIndex;
      const plots = [...(state.base.farmPlots || [])];
      const plot = plots[hPlotIndex];
      if (!plot) return { ...state, message: 'Nothing planted here!' };
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
          maxInventory: (state.player.maxInventory || 20) + inventoryIncrease,
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
        player: { ...state.player, inventory: state.player.inventory.filter(i => i.id !== action.itemId) },
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
        player: { ...state.player, inventory: state.player.inventory.filter(i => i.id !== action.itemId) },
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
        } else if (p.inventory.length < p.maxInventory) {
          p.inventory.push(item);
          addedNames.push(item.name);
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
      if (state.player.inventory.length >= state.player.maxInventory) return { ...state, message: 'Inventory full!' };

      const newItem = { ...item, id: 'petitem_' + Date.now() + '_' + Math.random() };
      delete newItem.buyPrice;
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - item.buyPrice,
          inventory: [...state.player.inventory, newItem],
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

      const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
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

      const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };
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
      pets.ownedPets[idx] = pet;

      const goldReward = quest.goldReward || 0;
      const p = goldReward > 0
        ? { ...state.player, gold: state.player.gold + goldReward }
        : state.player;

      const bondMsg = quest.bondReward ? ` Bond +${quest.bondReward}` : '';
      const goldMsg = goldReward > 0 ? ` +${goldReward}g` : '';
      return { ...state, player: p, pets, message: `Quest complete: ${quest.name}!${bondMsg}${goldMsg}` };
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
      const p = { ...state.player, inventory: state.player.inventory.filter(i => i.id !== item.id) };

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

    default:
      return state;
  }
}

function handleVictory(state) {
  const m = state.battle.monster;
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
  const regionId = state.currentRegion?.id;
  if (regionId) {
    materialDrop = rollMaterialDrop(regionId);
    if (materialDrop && p.inventory.length < p.maxInventory) {
      p.inventory = [...p.inventory, materialDrop];
    } else if (materialDrop) {
      materialDrop = null; // inventory full
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

  const droppedItem = rollDrop(m.dropTable, m.level);
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
  if (m.isBoss) newStats = addStat(newStats, 'bossesKilled');
  if (lootAdded) newStats = addStat(newStats, 'itemsLooted');
  if (leveledPlayer.level > prevLevel) {
    newStats = addStat(newStats, 'levelsGained', leveledPlayer.level - prevLevel);
  }

  // Track tasks
  let newTasks = state.tasks || createInitialTaskProgress();
  newTasks = incrementTaskProgress(newTasks, 'monstersKilled');
  newTasks = incrementTaskProgress(newTasks, 'battlesWon');
  newTasks = incrementTaskProgress(newTasks, 'goldEarned', goldGain);
  if (m.isBoss) newTasks = incrementTaskProgress(newTasks, 'bossesKilled');
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

  return {
    ...state,
    screen: 'battle-result',
    player: leveledPlayer,
    stats: newStats,
    tasks: newTasks,
    pets: updatedPets,
    pendingLevelUps: [...existingPending, ...pendingLevels],
    battleResult: {
      victory: true, expGain, goldGain,
      droppedItem: lootAdded ? droppedItem : null,
      materialDrop: materialDrop || null,
      eggDrop: eggDrop || null,
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
  const goldLost = Math.floor(state.player.gold * 0.2);
  const p = {
    ...state.player,
    gold: state.player.gold - goldLost,
    hp: Math.floor(state.player.maxHp * 0.3),
    mana: Math.floor(state.player.maxMana * 0.5),
  };

  const newStats = addStat(state.stats || createInitialStats(), 'battlesLost');

  return {
    ...state,
    screen: 'battle-result',
    player: p,
    stats: newStats,
    battleResult: {
      defeated: true, goldLost,
      isBoss: !!m?.isBoss,
      bossName: m?.isBoss ? m.name : null,
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
    enterLocation: (loc) => dispatch({ type: 'ENTER_LOCATION', location: loc }),
    exploreStep: () => dispatch({ type: 'EXPLORE_STEP' }),
    randomEventChoose: (choiceIndex) => dispatch({ type: 'RANDOM_EVENT_CHOOSE', choiceIndex }),
    eventResultContinue: () => dispatch({ type: 'EVENT_RESULT_CONTINUE' }),
    battleAttack: () => dispatch({ type: 'BATTLE_PLAYER_ATTACK' }),
    battleSkill: () => dispatch({ type: 'BATTLE_PLAYER_SKILL' }),
    battleTreeSkill: (skillId) => dispatch({ type: 'BATTLE_USE_TREE_SKILL', skillId }),
    battleDefend: () => dispatch({ type: 'BATTLE_DEFEND' }),
    battlePotion: () => dispatch({ type: 'BATTLE_USE_POTION' }),
    battleRun: () => dispatch({ type: 'BATTLE_RUN' }),
    toggleSkillMenu: () => dispatch({ type: 'TOGGLE_SKILL_MENU' }),
    toggleInspectMonster: () => dispatch({ type: 'TOGGLE_INSPECT_MONSTER' }),
    unlockSkill: (skillId) => dispatch({ type: 'UNLOCK_SKILL', skillId }),
    bossAccept: () => dispatch({ type: 'BOSS_ACCEPT' }),
    bossDecline: () => dispatch({ type: 'BOSS_DECLINE' }),
    monsterTurn: () => dispatch({ type: 'MONSTER_TURN' }),
    continueAfterBattle: () => dispatch({ type: 'CONTINUE_AFTER_BATTLE' }),
    applyStatChoices: (selectedStats) => dispatch({ type: 'APPLY_STAT_CHOICES', selectedStats }),
    restAtInn: () => dispatch({ type: 'REST_AT_INN' }),
    equipItem: (item, targetSlot) => dispatch({ type: 'EQUIP_ITEM', item, targetSlot }),
    unequipItem: (slot) => dispatch({ type: 'UNEQUIP_ITEM', slot }),
    useItem: (item) => dispatch({ type: 'USE_ITEM', item }),
    sellItem: (item) => dispatch({ type: 'SELL_ITEM', item }),
    reorderInventory: (fromIndex, toIndex) => dispatch({ type: 'REORDER_INVENTORY', fromIndex, toIndex }),
    buyItem: (item) => dispatch({ type: 'BUY_ITEM', item }),
    claimDailyReward: (rewards, label) => dispatch({ type: 'CLAIM_DAILY_REWARD', rewards, label }),
    claimTask: (taskId, taskType, chainId) => dispatch({ type: 'CLAIM_TASK', taskId, taskType, chainId }),
    pinQuest: (questId) => dispatch({ type: 'PIN_QUEST', questId }),
    unpinQuest: (questId) => dispatch({ type: 'UNPIN_QUEST', questId }),
    activateQuestLine: (lineKey) => dispatch({ type: 'ACTIVATE_QUEST_LINE', lineKey }),
    abandonQuestLine: (lineKey) => dispatch({ type: 'ABANDON_QUEST_LINE', lineKey }),
    applyTrade: (receivedItems, receivedGold, givenItems, givenGold) => dispatch({ type: 'APPLY_TRADE', receivedItems, receivedGold, givenItems, givenGold }),
    applyMarketTransaction: (transaction) => dispatch({ type: 'MARKET_TRANSACTION', transaction }),
    clearMessage: () => dispatch({ type: 'CLEAR_MESSAGE' }),
    loadSave: (saveData) => dispatch({ type: 'LOAD_SAVE', saveData }),
    // Base building actions
    baseBuild: (buildingId) => dispatch({ type: 'BASE_BUILD', buildingId }),
    baseAddFuel: (item) => dispatch({ type: 'BASE_ADD_FUEL', item }),
    baseAddFuelFromStorage: (materialId) => dispatch({ type: 'BASE_ADD_FUEL_FROM_STORAGE', materialId }),
    baseStoreMaterial: (item) => dispatch({ type: 'BASE_STORE_MATERIAL', item }),
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
  }), []);

  return { state, actions, playerAtk, playerDef };
}
