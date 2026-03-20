import { useState, useEffect } from 'react';
import { ENERGY_MAX, ENERGY_REGEN_PERCENT, ENERGY_REGEN_INTERVAL_MS, HP_REGEN_PERCENT, MANA_REGEN_PERCENT, HP_MANA_REGEN_INTERVAL_MS } from '../hooks/useGameState';
import { getHealCost } from '../engine/combat';

export default function CharacterDock({
  playerName,
  playerLevel,
  energy,
  energyMax,
  exp,
  expToLevel,
  hp,
  maxHp,
  mana,
  maxMana,
  gold,
  onInventory,
  onProfile,
  onSkills,
  navLocked,
  onRest,
  canRest,
  lastEnergyUpdate,
  lastHpManaRegenUpdate,
  onUsePotion,
  hasPotions,
  needsHpHealing,
}) {
  const safeMax = energyMax ?? Math.max(energy ?? 0, 1);
  const currentEnergy = Math.max(0, Math.min(energy ?? safeMax, safeMax));
  const energyPct = (currentEnergy / safeMax) * 100;

  const safeExpToLevel = expToLevel ?? 1;
  const currentExp = Math.max(0, Math.min(exp ?? 0, safeExpToLevel));
  const expPct = (currentExp / safeExpToLevel) * 100;

  const heroName = playerName || 'Hero';
  const heroLevel = playerLevel ?? 1;
  const currentHp = Math.max(0, hp ?? 0);
  const safeMaxHp = Math.max(1, maxHp ?? 1);
  const hpPct = (currentHp / safeMaxHp) * 100;
  const currentMana = Math.max(0, mana ?? 0);
  const safeMaxMana = Math.max(1, maxMana ?? 1);
  const manaPct = (currentMana / safeMaxMana) * 100;
  const goldValue = gold ?? 0;

  const [energyHovered, setEnergyHovered] = useState(false);
  const [hpHovered, setHpHovered] = useState(false);
  const [manaHovered, setManaHovered] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!energyHovered && !hpHovered && !manaHovered) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [energyHovered, hpHovered, manaHovered]);

  const gainPerTick = Math.max(1, Math.round(ENERGY_MAX * ENERGY_REGEN_PERCENT));
  const isFull = currentEnergy >= safeMax;

  let energyTooltip;
  if (isFull) {
    energyTooltip = 'Energy is full';
  } else if (lastEnergyUpdate == null) {
    energyTooltip = `+${gainPerTick} every 15 min`;
  } else {
    const nextTick = lastEnergyUpdate + ENERGY_REGEN_INTERVAL_MS;
    const remaining = Math.max(0, nextTick - now);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    energyTooltip = `+${gainPerTick} in ${timeStr}`;
  }

  const hpRegenPerTick = Math.max(1, Math.floor(safeMaxHp * HP_REGEN_PERCENT));
  const hpIsFull = currentHp >= safeMaxHp;
  let hpTooltip;
  if (hpIsFull) {
    hpTooltip = 'HP is full';
  } else if (lastHpManaRegenUpdate == null) {
    hpTooltip = `+${hpRegenPerTick} every 2 min`;
  } else {
    const nextHpTick = lastHpManaRegenUpdate + HP_MANA_REGEN_INTERVAL_MS;
    const hpRemaining = Math.max(0, nextHpTick - now);
    const hpMins = Math.floor(hpRemaining / 60000);
    const hpSecs = Math.floor((hpRemaining % 60000) / 1000);
    const hpTimeStr = hpMins > 0 ? `${hpMins}m ${hpSecs}s` : `${hpSecs}s`;
    hpTooltip = `+${hpRegenPerTick} in ${hpTimeStr}`;
  }

  const manaRegenPerTick = Math.max(1, Math.floor(safeMaxMana * MANA_REGEN_PERCENT));
  const manaIsFull = currentMana >= safeMaxMana;
  let manaTooltip;
  if (manaIsFull) {
    manaTooltip = 'Mana is full';
  } else if (lastHpManaRegenUpdate == null) {
    manaTooltip = `+${manaRegenPerTick} every 2 min`;
  } else {
    const nextManaTick = lastHpManaRegenUpdate + HP_MANA_REGEN_INTERVAL_MS;
    const manaRemaining = Math.max(0, nextManaTick - now);
    const manaMins = Math.floor(manaRemaining / 60000);
    const manaSecs = Math.floor((manaRemaining % 60000) / 1000);
    const manaTimeStr = manaMins > 0 ? `${manaMins}m ${manaSecs}s` : `${manaSecs}s`;
    manaTooltip = `+${manaRegenPerTick} in ${manaTimeStr}`;
  }

  return (
    <div className="character-dock">
      {/* Hero identity row */}
      <div className="dock-identity">
        <div className="dock-avatar">
          <span className="dock-avatar-icon">⚔</span>
          <div className="dock-level-badge">{heroLevel}</div>
        </div>
        <div className="dock-identity-info">
          <div className="dock-hero-name">{heroName}</div>
          <div className="dock-gold-row">
            <span className="dock-gold-icon">●</span>
            <span className="dock-gold-value">{goldValue.toLocaleString()}</span>
          </div>
        </div>
        <button
          className="dock-potion-button"
          type="button"
          disabled={navLocked || !hasPotions || !needsHpHealing}
          onClick={onUsePotion}
          aria-label="Use Potion"
          title={!hasPotions ? 'No potions' : !needsHpHealing ? 'HP is full' : 'Use a potion'}
        >
          <span className="dock-potion-icon">♥</span>
        </button>
        <button
          className="dock-rest-button"
          type="button"
          disabled={!canRest}
          onClick={onRest}
          aria-label="Rest at Inn"
          title={`Rest at Inn (-${getHealCost({ hp, maxHp, mana, maxMana })}g)`}
        >
          <span className="dock-rest-icon">✚</span>
        </button>
      </div>

      {/* Stat bars */}
      <div className="dock-bars">
        <div
          className="dock-bar-row"
          onMouseEnter={() => setHpHovered(true)}
          onMouseLeave={() => setHpHovered(false)}
        >
          <span className="dock-bar-label dock-bar-hp">HP</span>
          <div className="dock-bar-track">
            <div className="dock-bar-fill dock-bar-fill-hp" style={{ width: `${hpPct}%` }} />
          </div>
          <span className="dock-bar-nums">{currentHp}/{safeMaxHp}</span>
          {hpHovered && (
            <div className="dock-bar-tooltip">{hpTooltip}</div>
          )}
        </div>

        <div
          className="dock-bar-row"
          onMouseEnter={() => setManaHovered(true)}
          onMouseLeave={() => setManaHovered(false)}
        >
          <span className="dock-bar-label dock-bar-mana">MP</span>
          <div className="dock-bar-track">
            <div className="dock-bar-fill dock-bar-fill-mana" style={{ width: `${manaPct}%` }} />
          </div>
          <span className="dock-bar-nums">{currentMana}/{safeMaxMana}</span>
          {manaHovered && (
            <div className="dock-bar-tooltip">{manaTooltip}</div>
          )}
        </div>

        <div
          className="dock-bar-row dock-bar-energy-row"
          onMouseEnter={() => setEnergyHovered(true)}
          onMouseLeave={() => setEnergyHovered(false)}
        >
          <span className="dock-bar-label dock-bar-energy">EN</span>
          <div className="dock-bar-track">
            <div className="dock-bar-fill dock-bar-fill-energy" style={{ width: `${energyPct}%` }} />
          </div>
          <span className="dock-bar-nums">{currentEnergy}/{safeMax}</span>
          {energyHovered && (
            <div className="dock-bar-tooltip">{energyTooltip}</div>
          )}
        </div>
      </div>

      {/* XP bar */}
      <div className="dock-xp">
        <div className="dock-xp-track">
          <div className="dock-xp-fill" style={{ width: `${expPct}%` }} />
        </div>
        <span className="dock-xp-text">XP {currentExp}/{safeExpToLevel}</span>
      </div>

      {/* Quick actions */}
      <div className="dock-quick-actions">
        <button
          className="dock-quick-btn"
          type="button"
          disabled={navLocked}
          onClick={onInventory}
        >
          <span className="dock-quick-icon">▦</span>
          <span className="dock-quick-label">Items</span>
        </button>
        <button
          className="dock-quick-btn"
          type="button"
          disabled={navLocked}
          onClick={onProfile}
        >
          <span className="dock-quick-icon">◈</span>
          <span className="dock-quick-label">Profile</span>
        </button>
        <button
          className="dock-quick-btn"
          type="button"
          disabled={navLocked}
          onClick={onSkills}
        >
          <span className="dock-quick-icon">★</span>
          <span className="dock-quick-label">Skills</span>
        </button>
      </div>
    </div>
  );
}
