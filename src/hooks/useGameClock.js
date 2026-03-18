import { useState, useEffect, useMemo } from 'react';

// Time periods for the game world
const TIME_PERIODS = [
  { id: 'dawn', label: 'Dawn', icon: '\u{1F305}', start: 5, end: 8 },
  { id: 'morning', label: 'Morning', icon: '\u2600', start: 8, end: 12 },
  { id: 'afternoon', label: 'Afternoon', icon: '\u{1F324}', start: 12, end: 17 },
  { id: 'evening', label: 'Evening', icon: '\u{1F307}', start: 17, end: 20 },
  { id: 'night', label: 'Night', icon: '\u{1F319}', start: 20, end: 24 },
  { id: 'midnight', label: 'Midnight', icon: '\u{1F30C}', start: 0, end: 5 },
];

const SHOP_REFRESH_HOURS = 10;

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

// Get the current 4-hour event window (0-3, 4-7, 8-11, 12-15, 16-19, 20-23)
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

// Shop refreshes every 10 hours from midnight (0:00, 10:00, 20:00, then 6:00 next day...)
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
    // Next refresh is after midnight
    next.setDate(next.getDate() + 1);
    next.setHours(nextCycleHour - 24, 0, 0, 0);
  } else {
    next.setHours(nextCycleHour, 0, 0, 0);
  }
  return next - now;
}

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

    return {
      now,
      time: formatTime(now),
      hour,
      period,
      daySeed,
      hourSeed,
      eventWindow,
      shopSeed,
      dailyResetIn: formatCountdown(getTimeUntilMidnight()),
      eventRefreshIn: formatCountdown(getTimeUntilNextWindow()),
      shopRefreshIn: formatCountdown(getTimeUntilShopRefresh()),
    };
  }, [now]);
}

export { TIME_PERIODS, getTimePeriod, getDaySeed, getHourSeed, getEventWindow, getShopSeed, SHOP_REFRESH_HOURS, formatCountdown, formatTime };
