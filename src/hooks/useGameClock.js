import { useState, useEffect, useMemo } from 'react';

// ---- TIME PERIODS ----
const TIME_PERIODS = [
  { id: 'dawn',      label: 'Dawn',      icon: '\u{1F305}', start: 5,  end: 8  },
  { id: 'morning',   label: 'Morning',   icon: '\u2600',    start: 8,  end: 12 },
  { id: 'afternoon', label: 'Afternoon', icon: '\u{1F324}', start: 12, end: 17 },
  { id: 'evening',   label: 'Evening',   icon: '\u{1F307}', start: 17, end: 20 },
  { id: 'night',     label: 'Night',     icon: '\u{1F319}', start: 20, end: 24 },
  { id: 'midnight',  label: 'Midnight',  icon: '\u{1F30C}', start: 0,  end: 5  },
];

// Gameplay effects per time period
const TIME_EFFECTS = {
  dawn:      { xpMult: 1.10, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, eventChanceMult: 1.00, label: '+10% XP (early bird bonus)' },
  morning:   { xpMult: 1.00, goldMult: 1.10, lootMult: 1.00, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, eventChanceMult: 1.00, label: '+10% gold find' },
  afternoon: { xpMult: 1.00, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, eventChanceMult: 1.00, label: 'Standard conditions' },
  evening:   { xpMult: 1.00, goldMult: 1.00, lootMult: 1.15, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, eventChanceMult: 1.00, label: '+15% loot quality' },
  night:     { xpMult: 1.00, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.20, defMult: 1.00, atkMult: 1.10, eventChanceMult: 1.00, label: '+20% encounters, +10% ATK' },
  midnight:  { xpMult: 1.25, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.00, defMult: 0.90, atkMult: 1.00, eventChanceMult: 2.00, label: '+25% XP, -10% DEF, 2x events' },
};

// ---- WEATHER SYSTEM ----
// Weather changes every 3 hours, seeded by day + window
const WEATHER_TYPES = [
  { id: 'clear',     label: 'Clear',     icon: '\u2728', weight: 30 },
  { id: 'cloudy',    label: 'Cloudy',    icon: '\u2601', weight: 20 },
  { id: 'rain',      label: 'Rain',      icon: '\u{1F327}', weight: 15 },
  { id: 'storm',     label: 'Storm',     icon: '\u26A1', weight: 8  },
  { id: 'fog',       label: 'Fog',       icon: '\u{1F32B}', weight: 12 },
  { id: 'wind',      label: 'Windy',     icon: '\u{1F4A8}', weight: 10 },
  { id: 'heatwave',  label: 'Heatwave',  icon: '\u{1F525}', weight: 5  },
];

// Gameplay effects per weather condition
// Fog: hard to find enemies, easy to stumble into events
// Rain: fewer fights, coins wash up, slippery (less ATK)
// Storm: dangerous, creatures flushed out, rewarding
// Heatwave: draining, creatures desperate, deals available
// Wind: swift travel, energy efficient
const WEATHER_EFFECTS = {
  clear:    { xpMult: 1.00, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, shopDiscount: 0, energyRegenMult: 1.00, eventChanceMult: 1.00, label: 'No modifiers' },
  cloudy:   { xpMult: 1.00, goldMult: 1.05, lootMult: 1.00, encounterMult: 0.95, defMult: 1.00, atkMult: 1.00, shopDiscount: 0, energyRegenMult: 1.00, eventChanceMult: 1.10, label: 'Overcast skies, slightly fewer monsters' },
  rain:     { xpMult: 1.00, goldMult: 1.10, lootMult: 1.00, encounterMult: 0.75, defMult: 1.00, atkMult: 0.95, shopDiscount: 0.05, energyRegenMult: 1.00, eventChanceMult: 1.30, label: 'Monsters hiding from rain, coins wash up' },
  storm:    { xpMult: 1.25, goldMult: 1.00, lootMult: 1.20, encounterMult: 1.30, defMult: 0.90, atkMult: 1.00, shopDiscount: 0, energyRegenMult: 0.80, eventChanceMult: 1.50, label: 'Dangerous! Creatures flushed out, better rewards' },
  fog:      { xpMult: 1.10, goldMult: 1.00, lootMult: 1.10, encounterMult: 0.60, defMult: 1.00, atkMult: 1.00, shopDiscount: 0, energyRegenMult: 1.00, eventChanceMult: 2.50, label: 'Hard to find enemies, easy to stumble into events' },
  wind:     { xpMult: 1.05, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.00, defMult: 1.00, atkMult: 1.00, shopDiscount: 0, energyRegenMult: 1.20, eventChanceMult: 1.00, label: 'Swift winds, faster energy recovery' },
  heatwave: { xpMult: 1.00, goldMult: 1.00, lootMult: 1.00, encounterMult: 1.15, defMult: 1.00, atkMult: 1.10, shopDiscount: 0.10, energyRegenMult: 0.80, eventChanceMult: 1.00, label: 'Brutal heat drains energy, desperate creatures attack' },
};

const WEATHER_WINDOW_HOURS = 3;

const SHOP_REFRESH_HOURS = 10;

// ---- UTILITY ----
function seededRng(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getTimePeriod(hour) {
  for (const period of TIME_PERIODS) {
    if (period.start <= period.end) {
      if (hour >= period.start && hour < period.end) return period;
    } else {
      if (hour >= period.start || hour < period.end) return period;
    }
  }
  return TIME_PERIODS[0];
}

function getTimeUntilMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow - now;
}

function formatCountdown(ms) {
  if (ms <= 0) return '0h 00m 00s';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getDaySeed(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function getHourSeed(date) {
  return getDaySeed(date) * 100 + date.getHours();
}

// 4-hour event window
function getEventWindow(date) {
  return Math.floor(date.getHours() / 4);
}

function getTimeUntilNextWindow() {
  const now = new Date();
  const currentWindow = getEventWindow(now);
  const nextWindowHour = (currentWindow + 1) * 4;
  const next = new Date(now);
  if (nextWindowHour >= 24) {
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  } else {
    next.setHours(nextWindowHour, 0, 0, 0);
  }
  return next - now;
}

// ---- SHOP REFRESH (10 hours) ----
function getShopCycleIndex(date) {
  const hoursSinceMidnight = date.getHours() + date.getMinutes() / 60;
  return Math.floor(hoursSinceMidnight / SHOP_REFRESH_HOURS);
}

function getShopSeed(date) {
  return getDaySeed(date) * 10 + getShopCycleIndex(date);
}

function getTimeUntilShopRefresh() {
  const now = new Date();
  const currentCycle = getShopCycleIndex(now);
  const nextCycleHour = (currentCycle + 1) * SHOP_REFRESH_HOURS;
  const next = new Date(now);
  if (nextCycleHour >= 24) {
    next.setDate(next.getDate() + 1);
    next.setHours(nextCycleHour - 24, 0, 0, 0);
  } else {
    next.setHours(nextCycleHour, 0, 0, 0);
  }
  return next - now;
}

// ---- WEATHER (3-hour windows) ----
function getWeatherWindow(date) {
  return Math.floor(date.getHours() / WEATHER_WINDOW_HOURS);
}

function getWeather(date) {
  const seed = getDaySeed(date) * 100 + getWeatherWindow(date);
  const rng = seededRng(seed);
  const totalWeight = WEATHER_TYPES.reduce((sum, w) => sum + w.weight, 0);
  let roll = rng() * totalWeight;
  for (const w of WEATHER_TYPES) {
    roll -= w.weight;
    if (roll <= 0) return w;
  }
  return WEATHER_TYPES[0];
}

function getNextWeather(date) {
  const currentWindow = getWeatherWindow(date);
  const nextWindowHour = (currentWindow + 1) * WEATHER_WINDOW_HOURS;
  const nextDate = new Date(date);
  if (nextWindowHour >= 24) {
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(nextWindowHour - 24, 0, 0, 0);
  } else {
    nextDate.setHours(nextWindowHour, 0, 0, 0);
  }
  return { weather: getWeather(nextDate), changeIn: nextDate - date };
}

// Combine time + weather effects into a single multiplier set
function getCombinedEffects(periodId, weatherId) {
  const time = TIME_EFFECTS[periodId] || TIME_EFFECTS.afternoon;
  const weather = WEATHER_EFFECTS[weatherId] || WEATHER_EFFECTS.clear;
  return {
    xpMult: time.xpMult * weather.xpMult,
    goldMult: time.goldMult * weather.goldMult,
    lootMult: time.lootMult * weather.lootMult,
    encounterMult: time.encounterMult * weather.encounterMult,
    defMult: time.defMult * weather.defMult,
    atkMult: time.atkMult * weather.atkMult,
    shopDiscount: weather.shopDiscount || 0,
    energyRegenMult: weather.energyRegenMult || 1.0,
    eventChanceMult: time.eventChanceMult * weather.eventChanceMult,
  };
}

// ---- HOOK ----
export default function useGameClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const hour = now.getHours();
    const period = getTimePeriod(hour);
    const daySeed = getDaySeed(now);
    const hourSeed = getHourSeed(now);
    const eventWindow = getEventWindow(now);
    const shopSeed = getShopSeed(now);
    const weather = getWeather(now);
    const weatherEffects = WEATHER_EFFECTS[weather.id];
    const timeEffects = TIME_EFFECTS[period.id];
    const combined = getCombinedEffects(period.id, weather.id);
    const next = getNextWeather(now);

    return {
      now,
      time: formatTime(now),
      hour,
      period,
      daySeed,
      hourSeed,
      eventWindow,
      shopSeed,
      weather,
      weatherEffects,
      timeEffects,
      effects: combined,
      nextWeather: next.weather,
      weatherChangeIn: formatCountdown(next.changeIn),
      dailyResetIn: formatCountdown(getTimeUntilMidnight()),
      eventRefreshIn: formatCountdown(getTimeUntilNextWindow()),
      shopRefreshIn: formatCountdown(getTimeUntilShopRefresh()),
    };
  }, [now]);
}

export {
  TIME_PERIODS, TIME_EFFECTS,
  WEATHER_TYPES, WEATHER_EFFECTS,
  getTimePeriod, getDaySeed, getHourSeed,
  getEventWindow, getShopSeed, getWeather, getWeatherWindow, getNextWeather,
  getCombinedEffects,
  SHOP_REFRESH_HOURS, WEATHER_WINDOW_HOURS,
  formatCountdown, formatTime,
};
