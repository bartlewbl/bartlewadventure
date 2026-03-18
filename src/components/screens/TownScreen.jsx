import { useMemo } from 'react';
import { CHARACTER_CLASSES, REGIONS } from '../../data/gameData';
import { getDailyFeaturedItems } from '../../engine/loot';
import DailyRewardPanel from '../DailyRewardPanel';
import useGameClock, { getEventWindow, getDaySeed } from '../../hooks/useGameClock';

const TOWN_EVENTS = [
  // Active events - rotate every 4 hours
  { title: 'Sewer Surge', desc: 'Slime activity spiking in Metro Underpass. Extra loot reported.', type: 'active', bonus: '+15% loot drops' },
  { title: 'Blacksmith Discount', desc: 'Aurora Armory running flash sale on shields.', type: 'active', bonus: '-15% shield prices' },
  { title: 'Bounty Board', desc: 'Rogue Vagrant bounties doubled this cycle.', type: 'active', bonus: '2x bounty gold' },
  { title: 'Neon Rush', desc: 'Street gangs are unusually active. More fights, more loot.', type: 'active', bonus: '+10% encounter rate' },
  { title: 'Merchant Caravan', desc: 'Traveling merchants have set up in the plaza with exotic goods.', type: 'active', bonus: 'Rare stock available' },
  { title: 'Energy Surge', desc: 'A power grid spike is boosting the local energy field.', type: 'active', bonus: '+2 energy regen' },
  { title: 'Potion Brew-Off', desc: 'Alchemists competing downtown — potions are cheap right now.', type: 'active', bonus: '-20% potion prices' },
  { title: 'Arena Hour', desc: 'The fighting pits are open. Tougher enemies, better rewards.', type: 'active', bonus: '+25% XP' },
  { title: 'Scavenger Hunt', desc: 'Hidden caches have been placed around the outskirts.', type: 'active', bonus: '+20% gold find' },
  { title: 'Weapon Expo', desc: 'Weaponsmiths are showing off their latest creations.', type: 'active', bonus: 'New weapons in shop' },
  { title: 'Night Market', desc: 'Underground vendors selling rare items after dark.', type: 'active', bonus: 'Rare items unlocked' },
  { title: 'Medic On Call', desc: 'A wandering healer is offering free treatments.', type: 'active', bonus: '-50% inn cost' },
  // Upcoming events - tease the next window
  { title: 'Neon Festival', desc: 'Street vendors gathering at Neon Mile this weekend.', type: 'upcoming' },
  { title: 'Supply Drop', desc: 'Cargo shipment expected at Ironworks Yard soon.', type: 'upcoming' },
  { title: 'Arena Trials', desc: 'Combat trials opening next cycle. Train up.', type: 'upcoming' },
  { title: 'Black Market', desc: 'Whispers of a secret market opening underground.', type: 'upcoming' },
  { title: 'Guild Rally', desc: 'Adventurers guild recruiting for a big expedition.', type: 'upcoming' },
  { title: 'Crystal Harvest', desc: 'Crystal caves are glowing brighter — mining window approaching.', type: 'upcoming' },
  { title: 'Beast Tide', desc: 'Monster activity increasing in outlying areas.', type: 'upcoming' },
  { title: 'Tech Salvage', desc: 'Decommissioned bots scheduled for scrapping. Parts for the taking.', type: 'upcoming' },
];

function seededShuffle(arr, seed) {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = Math.floor(((s - 1) / 2147483646) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRotatingEvents(now) {
  const daySeed = getDaySeed(now);
  const window = getEventWindow(now);
  const combinedSeed = daySeed * 10 + window;

  const active = TOWN_EVENTS.filter(e => e.type === 'active');
  const upcoming = TOWN_EVENTS.filter(e => e.type === 'upcoming');

  const shuffledActive = seededShuffle(active, combinedSeed);
  const shuffledUpcoming = seededShuffle(upcoming, combinedSeed + 999);

  return {
    current: shuffledActive.slice(0, 3),
    planned: shuffledUpcoming.slice(0, 2),
  };
}

const statLine = (item) => {
  if (!item) return '';
  const stats = [];
  if (item.atk) stats.push('ATK+' + item.atk);
  if (item.def) stats.push('DEF+' + item.def);
  return stats.length ? stats.join(' ') : 'No bonuses';
};

// Format a multiplier as a +/-% label
function fmtMult(val, label) {
  if (val === 1) return null;
  const pct = Math.round((val - 1) * 100);
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}% ${label}`;
}

function getActiveEffectLabels(effects, shopDiscount) {
  const labels = [];
  const xp = fmtMult(effects.xpMult, 'XP');
  const gold = fmtMult(effects.goldMult, 'Gold');
  const loot = fmtMult(effects.lootMult, 'Loot');
  const enc = fmtMult(effects.encounterMult, 'Encounters');
  const atk = fmtMult(effects.atkMult, 'ATK');
  const def = fmtMult(effects.defMult, 'DEF');
  const evtC = fmtMult(effects.eventChanceMult, 'Events');
  const eRegen = fmtMult(effects.energyRegenMult, 'Energy Regen');
  if (xp) labels.push(xp);
  if (gold) labels.push(gold);
  if (loot) labels.push(loot);
  if (enc) labels.push(enc);
  if (atk) labels.push(atk);
  if (def) labels.push(def);
  if (evtC) labels.push(evtC);
  if (eRegen) labels.push(eRegen);
  if (shopDiscount > 0) labels.push(`-${Math.round(shopDiscount * 100)}% Shop Prices`);
  return labels;
}

export default function TownScreen({ player, energy, energyCost, onRest, onEnterLocation, onBuy, canRest, onClaimDailyReward, onGoToBase }) {
  const equipment = player?.equipment || {};
  const atkBonus = Object.values(equipment).reduce((sum, item) => sum + (item?.atk || 0), 0);
  const defBonus = Object.values(equipment).reduce((sum, item) => sum + (item?.def || 0), 0);

  const exp = player?.exp ?? 0;
  const expToLevel = player?.expToLevel ?? 1;
  const expPercent = Math.min(100, (exp / expToLevel) * 100);
  const expRemaining = Math.max(0, expToLevel - exp);

  const clock = useGameClock();
  const events = useMemo(() => getRotatingEvents(clock.now), [clock.eventWindow, clock.daySeed]);

  const latestLocation = useMemo(() => {
    const allLocations = REGIONS.flatMap(r => r.locations);
    const unlocked = allLocations.filter(loc => (player?.level ?? 1) >= loc.levelReq);
    return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
  }, [player?.level]);

  const canTravel = latestLocation && (energy ?? 0) >= (energyCost ?? 10);

  const featuredItems = useMemo(() => getDailyFeaturedItems(player?.level ?? 1, clock.shopSeed), [player?.level, clock.shopSeed]);

  const equippedSlots = Object.entries(equipment).filter(([, item]) => item);
  const emptySlots = Object.entries(equipment).filter(([, item]) => !item);

  const hpPercent = player?.maxHp ? Math.min(100, (player.hp / player.maxHp) * 100) : 100;
  const needsHealing = player?.hp < player?.maxHp;

  const effectLabels = useMemo(
    () => getActiveEffectLabels(clock.effects, clock.effects.shopDiscount),
    [clock.effects]
  );

  return (
    <div className="screen screen-town">
      <div className="town-layout">
        {/* Real-Time Clock & Weather Bar */}
        <section className="town-clock-bar">
          <div className="town-clock-left">
            <div className="town-clock-time">
              <span className="town-clock-icon">{clock.period.icon}</span>
              <span className="town-clock-digits">{clock.time}</span>
            </div>
            <div className="town-clock-period">{clock.period.label}</div>
          </div>
          <div className="town-weather-display">
            <span className="town-weather-icon">{clock.weather.icon}</span>
            <div className="town-weather-info">
              <div className="town-weather-label">{clock.weather.label}</div>
              <div className="town-weather-next">
                Next: {clock.nextWeather.icon} {clock.nextWeather.label} in {clock.weatherChangeIn}
              </div>
            </div>
          </div>
          <div className="town-clock-timers">
            <div className="town-clock-timer">
              <span className="town-timer-label">Daily Reset</span>
              <span className="town-timer-value">{clock.dailyResetIn}</span>
            </div>
            <div className="town-clock-timer">
              <span className="town-timer-label">Event Refresh</span>
              <span className="town-timer-value">{clock.eventRefreshIn}</span>
            </div>
          </div>
        </section>

        {/* Active Effects Panel */}
        {effectLabels.length > 0 && (
          <section className="town-effects-bar">
            <span className="town-effects-title">Active Modifiers</span>
            <div className="town-effects-list">
              {effectLabels.map((lbl, i) => (
                <span key={i} className={`town-effect-tag ${lbl.startsWith('-') ? 'negative' : 'positive'}`}>
                  {lbl}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Character Info Card */}
        <section className="town-hero-card">
          <div className="town-hero-header">
            <div className="town-hero-identity">
              <div className="town-hero-title">{player?.name || 'Hero'}</div>
              <div className="town-hero-subtitle">Level {player?.level ?? 1} Adventurer</div>
            </div>
            <div className="town-hero-level-badge">
              <span className="level-number">{player?.level ?? 1}</span>
            </div>
          </div>

          <div className="town-hero-stats">
            <div className="town-stat">
              <div className="town-stat-label">HP</div>
              <div className="town-stat-value">{player?.hp ?? 0}/{player?.maxHp ?? 0}</div>
              <div className="town-stat-bar">
                <div className="town-stat-bar-fill town-stat-bar-hp" style={{ width: `${hpPercent}%` }} />
              </div>
            </div>
            <div className="town-stat">
              <div className="town-stat-label">ATK</div>
              <div className="town-stat-value">{player?.baseAtk ?? 0}{atkBonus ? ` (+${atkBonus})` : ''}</div>
            </div>
            <div className="town-stat">
              <div className="town-stat-label">DEF</div>
              <div className="town-stat-value">{player?.baseDef ?? 0}{defBonus ? ` (+${defBonus})` : ''}</div>
            </div>
            <div className="town-stat">
              <div className="town-stat-label">Gold</div>
              <div className="town-stat-value town-gold-value">{player?.gold ?? 0}g</div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="town-xp-section">
            <div className="town-xp-header">
              <span className="town-xp-label">EXP to Level {(player?.level ?? 1) + 1}</span>
              <span className="town-xp-numbers">{exp} / {expToLevel} ({expRemaining} remaining)</span>
            </div>
            <div className="town-bar-track">
              <div className="town-bar-fill" style={{ width: `${expPercent}%` }} />
            </div>
          </div>

          {/* Equipped Gear Summary */}
          {equippedSlots.length > 0 && (
            <div className="town-gear-summary">
              <div className="town-gear-label">Equipped</div>
              <div className="town-gear-list">
                {equippedSlots.map(([slot, item]) => (
                  <span key={slot} className={`town-gear-tag ${item.rarityClass || ''}`}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {emptySlots.length > 0 && (
            <div className="town-gear-empty">
              {emptySlots.length} empty slot{emptySlots.length !== 1 ? 's' : ''}
            </div>
          )}
        </section>

        {/* Quick Actions - Travel & Heal */}
        <section className="town-panel town-actions-panel">
          <div className="town-panel-title">Quick Actions</div>

          {/* Auto-start to latest location */}
          {latestLocation && (
            <button
              className="town-quick-action town-quick-travel"
              onClick={() => onEnterLocation(latestLocation)}
              disabled={!canTravel}
            >
              <div className="town-quick-icon">&#9758;</div>
              <div className="town-quick-info">
                <div className="town-quick-label">Explore {latestLocation.name}</div>
                <div className="town-quick-desc">
                  {canTravel
                    ? `Lv.${latestLocation.levelReq}+ \u00b7 -${energyCost ?? 10} energy`
                    : 'Not enough energy'}
                </div>
              </div>
            </button>
          )}

          {/* Healing option */}
          <button
            className={`town-quick-action town-quick-heal ${needsHealing ? '' : 'full-hp'}`}
            onClick={onRest}
            disabled={!canRest || !needsHealing}
          >
            <div className="town-quick-icon heal-icon">+</div>
            <div className="town-quick-info">
              <div className="town-quick-label">
                {needsHealing ? 'Rest at Inn' : 'HP Full'}
              </div>
              <div className="town-quick-desc">
                {needsHealing
                  ? `Restore HP & Mana \u00b7 10g`
                  : 'No healing needed'}
              </div>
            </div>
          </button>

          {/* Base access */}
          <button
            className="town-quick-action town-quick-base"
            onClick={onGoToBase}
          >
            <div className="town-quick-icon base-icon">&#9961;</div>
            <div className="town-quick-info">
              <div className="town-quick-label">My Base</div>
              <div className="town-quick-desc">Build, craft, and manage your base</div>
            </div>
          </button>
        </section>

        {/* Daily Login Rewards */}
        <DailyRewardPanel onClaimReward={onClaimDailyReward} />

        {/* Events Board */}
        <section className="town-panel town-events-panel">
          <div className="town-panel-title">
            Events Board
            <span className="town-events-refresh-timer">Refreshes in {clock.eventRefreshIn}</span>
          </div>
          <div className="town-events-list">
            {events.current.map((ev, i) => (
              <div key={`current-${i}`} className="town-event">
                <span className="town-event-badge active">Active</span>
                <div className="town-event-title">{ev.title}</div>
                <div className="town-event-desc">{ev.desc}</div>
                {ev.bonus && <div className="town-event-bonus">{ev.bonus}</div>}
              </div>
            ))}
            {events.planned.map((ev, i) => (
              <div key={`planned-${i}`} className="town-event">
                <span className="town-event-badge upcoming">Soon</span>
                <div className="town-event-title">{ev.title}</div>
                <div className="town-event-desc">{ev.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Extraordinary Shop Items */}
        <section className="town-panel town-shop-panel">
          <div className="town-panel-title">
            Today&apos;s Featured Gear
            <span className="town-shop-refresh-timer">Refreshes in {clock.shopRefreshIn}</span>
          </div>
          <div className="town-panel-subtitle-text">Extraordinary items - refreshes daily</div>
          <div className="town-featured-list">
            {featuredItems.map(item => (
              <div key={item.id} className="town-featured-item">
                <div className="town-featured-info">
                  <span className={`town-featured-name ${item.rarityClass || ''}`}>
                    {item.name}
                  </span>
                  <span className="town-featured-meta">
                    {item.rarity} &middot; Lv{item.level} &middot; {statLine(item)}
                  </span>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() => onBuy(item)}
                  disabled={(player?.gold ?? 0) < item.buyPrice}
                >
                  {item.buyPrice}g
                </button>
              </div>
            ))}
            {featuredItems.length === 0 && (
              <div className="empty-text">No featured gear today</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
