import { useState, useEffect } from 'react';
import CharacterDock from './CharacterDock';
import useGameClock from '../hooks/useGameClock';
import { BUFF_POTION_TYPES } from '../data/baseData';

export default function SidePanel({
  collapsed,
  onToggle,
  screen,
  currentLocation,
  energy,
  energyMax,
  energyCost,
  exp,
  expToLevel,
  hp,
  maxHp,
  mana,
  maxMana,
  playerName,
  playerLevel,
  gold,
  onGoToTown,
  onExplore,
  onInventory,
  onShop,
  onMarket,
  onBase,
  onPets,
  onJournal,
  onRest,
  navLocked,
  onProfile,
  onSkills,
  canRest,
  activeBuffs,
  lastEnergyUpdate,
}) {
  const clock = useGameClock();
  const [, forceUpdate] = useState(0);

  // Re-render every second to update buff timers
  useEffect(() => {
    if (!activeBuffs || activeBuffs.length === 0) return;
    const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(interval);
  }, [activeBuffs]);

  const now = Date.now();
  const visibleBuffs = (activeBuffs || []).filter(b => {
    const bType = BUFF_POTION_TYPES[b.buffPotionId];
    return bType && (now - b.startTime < bType.duration);
  });

  const navItems = [
    {
      id: 'town',
      label: 'Town',
      description: 'Return to the main hub',
      onClick: onGoToTown,
      active: screen === 'town',
      disabled: navLocked,
    },
    {
      id: 'explore',
      label: 'Explore',
      description: 'Pick a destination',
      onClick: onExplore,
      active: screen === 'regions' || screen === 'locations' || screen === 'explore',
      disabled: navLocked,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Equip or use items',
      onClick: onInventory,
      active: screen === 'inventory',
      disabled: navLocked,
    },
    {
      id: 'shop',
      label: 'Shop',
      description: 'Buy gear and potions',
      onClick: onShop,
      active: screen === 'shop',
      disabled: navLocked,
    },
    {
      id: 'market',
      label: 'Market',
      description: 'Player trading hub',
      onClick: onMarket,
      active: screen === 'market',
      disabled: navLocked,
    },
    {
      id: 'base',
      label: 'Base',
      description: 'Build and manage your base',
      onClick: onBase,
      active: screen === 'base',
      disabled: navLocked,
    },
    {
      id: 'pets',
      label: 'Pets',
      description: 'Manage your pet companions',
      onClick: onPets,
      active: screen === 'pets',
      disabled: navLocked,
    },
    {
      id: 'journal',
      label: 'Journal',
      description: 'Stats and tasks',
      onClick: onJournal,
      active: screen === 'journal',
      disabled: navLocked,
    },
  ];

  return (
    <aside className={`side-panel ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="side-panel-toggle"
        type="button"
        aria-label="Toggle command board"
        onClick={onToggle}
      >
        {collapsed ? '>' : '<'}
      </button>

      <div className="side-panel-body">
        <div className="side-panel-content">
          <div className="side-panel-heading">
            <div className="side-panel-title">Command Board</div>
            <div className="side-panel-subtitle">Plan your next step</div>
          </div>

          <div className="side-panel-clock">
            <div className="side-clock-main">
              <span className="side-clock-icon">{clock.period.icon}</span>
              <span className="side-clock-time">{clock.time}</span>
            </div>
            <div className="side-clock-period">{clock.period.label}</div>
            <div className="side-clock-weather">
              <span className="side-weather-icon">{clock.weather.icon}</span>
              <span className="side-weather-label">{clock.weather.label}</span>
            </div>
            <div className="side-clock-reset">Daily reset: {clock.dailyResetIn}</div>
          </div>

          {visibleBuffs.length > 0 && (
            <div className="side-panel-buffs">
              <div className="side-panel-card-label">Active Buffs</div>
              {visibleBuffs.map(buff => {
                const bType = BUFF_POTION_TYPES[buff.buffPotionId];
                const remaining = Math.max(0, buff.duration - (now - buff.startTime));
                const mins = Math.floor(remaining / 60000);
                const secs = Math.floor((remaining % 60000) / 1000);
                const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                return (
                  <div key={buff.buffPotionId} className="side-buff-item">
                    <span className="side-buff-name">{bType.name}</span>
                    <span className="side-buff-timer">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          )}

          {currentLocation && (
            <div className="side-panel-card">
              <div className="side-panel-card-label">Current Route</div>
              <div className="side-panel-card-value">{currentLocation.name}</div>
            </div>
          )}

          <div className="side-menu-buttons">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`side-menu-button ${item.active ? 'active' : ''}`}
                type="button"
                disabled={item.disabled}
                onClick={item.onClick}
              >
                <span className="side-menu-label">{item.label}</span>
                <span className="side-menu-desc">{item.description}</span>
              </button>
            ))}
          </div>

          <div className="side-panel-divider" />
        </div>

        <div className="side-panel-footer">
          <CharacterDock
            playerName={playerName}
            playerLevel={playerLevel}
            energy={energy}
            energyMax={energyMax}
            energyCost={energyCost}
            exp={exp}
            expToLevel={expToLevel}
            hp={hp}
            maxHp={maxHp}
            mana={mana}
            maxMana={maxMana}
            gold={gold}
            onInventory={onInventory}
            onProfile={onProfile}
            onSkills={onSkills}
            navLocked={navLocked}
            onRest={onRest}
            canRest={canRest}
            lastEnergyUpdate={lastEnergyUpdate}
          />

          {navLocked && (
            <div className="side-panel-note">
              Finish the current encounter to access navigation.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
