import { useState } from 'react';

export default function MobileNav({
  screen,
  onGoToTown,
  onExplore,
  onInventory,
  onShop,
  onMarket,
  onBase,
  onPets,
  onJournal,
  onProfile,
  onSkills,
  navLocked,
  player,
  energy,
  energyMax,
  canRest,
  onRest,
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const hp = player?.hp ?? 0;
  const maxHp = player?.maxHp ?? 1;
  const mana = player?.mana ?? 0;
  const maxMana = player?.maxMana ?? 1;
  const gold = player?.gold ?? 0;
  const level = player?.level ?? 1;
  const currentEnergy = Math.max(0, Math.min(energy ?? 0, energyMax ?? 1));

  const mainTabs = [
    { id: 'town', label: 'Town', icon: '🏠', onClick: onGoToTown, match: ['town'] },
    { id: 'explore', label: 'Explore', icon: '⚔', onClick: onExplore, match: ['regions', 'locations', 'explore'] },
    { id: 'inventory', label: 'Items', icon: '▦', onClick: onInventory, match: ['inventory'] },
    { id: 'journal', label: 'Quests', icon: '📖', onClick: onJournal, match: ['journal'] },
    { id: 'more', label: 'More', icon: '⋯', onClick: () => setMoreOpen(v => !v), match: [] },
  ];

  const moreTabs = [
    { id: 'shop', label: 'Shop', icon: '🛒', onClick: onShop },
    { id: 'market', label: 'Market', icon: '📊', onClick: onMarket },
    { id: 'base', label: 'Base', icon: '🏗', onClick: onBase },
    { id: 'pets', label: 'Pets', icon: '🐾', onClick: onPets },
    { id: 'profile', label: 'Profile', icon: '◈', onClick: onProfile },
    { id: 'skills', label: 'Skills', icon: '★', onClick: onSkills },
  ];

  const isMoreActive = moreTabs.some(t => t.id === screen || screen === t.id);

  return (
    <>
      {/* Top stats bar */}
      <div className="mobile-stats-bar">
        <div className="mobile-stats-left">
          <span className="mobile-stat-level">Lv{level}</span>
          <span className="mobile-stat-gold">● {gold.toLocaleString()}</span>
        </div>
        <div className="mobile-stats-bars">
          <div className="mobile-bar">
            <span className="mobile-bar-label">HP</span>
            <div className="mobile-bar-track">
              <div className="mobile-bar-fill mobile-bar-hp" style={{ width: `${(hp / maxHp) * 100}%` }} />
            </div>
            <span className="mobile-bar-num">{hp}/{maxHp}</span>
          </div>
          <div className="mobile-bar">
            <span className="mobile-bar-label">MP</span>
            <div className="mobile-bar-track">
              <div className="mobile-bar-fill mobile-bar-mp" style={{ width: `${(mana / maxMana) * 100}%` }} />
            </div>
            <span className="mobile-bar-num">{mana}/{maxMana}</span>
          </div>
          <div className="mobile-bar">
            <span className="mobile-bar-label">EN</span>
            <div className="mobile-bar-track">
              <div className="mobile-bar-fill mobile-bar-en" style={{ width: `${(currentEnergy / (energyMax || 1)) * 100}%` }} />
            </div>
            <span className="mobile-bar-num">{currentEnergy}/{energyMax}</span>
          </div>
        </div>
        {canRest && (
          <button className="mobile-rest-btn" type="button" onClick={onRest} title="Rest at Inn">✚</button>
        )}
      </div>

      {/* More menu overlay */}
      {moreOpen && (
        <div className="mobile-more-overlay" onClick={() => setMoreOpen(false)}>
          <div className="mobile-more-menu" onClick={e => e.stopPropagation()}>
            {moreTabs.map(tab => (
              <button
                key={tab.id}
                className={`mobile-more-item ${screen === tab.id ? 'active' : ''}`}
                type="button"
                disabled={navLocked}
                onClick={() => { tab.onClick(); setMoreOpen(false); }}
              >
                <span className="mobile-more-icon">{tab.icon}</span>
                <span className="mobile-more-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="mobile-tab-bar">
        {mainTabs.map(tab => {
          const active = tab.id === 'more'
            ? (moreOpen || isMoreActive)
            : tab.match.includes(screen);
          return (
            <button
              key={tab.id}
              className={`mobile-tab ${active ? 'active' : ''}`}
              type="button"
              disabled={tab.id !== 'more' && navLocked}
              onClick={tab.onClick}
            >
              <span className="mobile-tab-icon">{tab.icon}</span>
              <span className="mobile-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
