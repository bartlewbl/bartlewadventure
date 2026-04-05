import { useState } from 'react';
import { CHEST_LOOKUP } from '../../data/lootChests';

const RARITY_COLORS = {
  Common: '#ccc',
  Uncommon: '#4fc3f7',
  Rare: '#ab47bc',
  Epic: '#ffa726',
  Legendary: '#ffd700',
};

function itemStatLine(item) {
  if (!item) return '';
  if (item.slot) {
    const stats = [];
    if (item.atk) stats.push('ATK+' + item.atk);
    if (item.def) stats.push('DEF+' + item.def);
    return stats.length ? stats.join(' ') : '';
  }
  if (item.type === 'energy-drink') return `Energy +${item.energyAmount}`;
  if (item.type === 'potion') return `Heal ${item.healAmount} HP`;
  if (item.type === 'material') return `Material x${item.stackQuantity || 1}`;
  return '';
}

export default function ChestOpeningScreen({ pendingChest, chestResult, onOpen, onClose }) {
  const [opened, setOpened] = useState(false);

  // Show results after opening
  if (chestResult) {
    const rarityColor = RARITY_COLORS[chestResult.chestRarity] || '#ccc';
    return (
      <div className="screen screen-chest">
        <div className="chest-result-header" style={{ color: rarityColor }}>
          {chestResult.chestName} Opened!
        </div>

        {chestResult.gold > 0 && (
          <div className="chest-gold-reward">+{chestResult.gold}g</div>
        )}

        <div className="chest-items-title">Items Found:</div>
        <div className="chest-items-list">
          {chestResult.items.length === 0 && (
            <div className="chest-empty-text">Inventory was full - no items could be added!</div>
          )}
          {chestResult.items.map((item, i) => (
            <div key={item.id || i} className={`chest-item-card ${item.rarityClass || ('rarity-' + (item.rarity || 'common').toLowerCase())}`}>
              <div className="chest-item-name" style={{ color: RARITY_COLORS[item.rarity] || '#ccc' }}>
                {item.name}
              </div>
              <div className="chest-item-meta">
                <span className={`shop-rarity-badge ${item.rarityClass || ('rarity-' + (item.rarity || 'common').toLowerCase())}`}>
                  {item.rarity}
                </span>
                {item.level && <span className="chest-item-level">Lv{item.level}</span>}
                <span className="chest-item-stats">{itemStatLine(item)}</span>
                {item.passive && (
                  <span className="chest-item-passive" style={{ color: '#8f8', fontSize: '0.8em' }}>
                    +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {chestResult.overflowCount > 0 && (
          <div className="chest-overflow-warning">
            {chestResult.overflowCount} item(s) lost - inventory was full!
          </div>
        )}

        <button className="btn btn-primary chest-continue-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    );
  }

  // Show chest ready to open
  const chestDef = pendingChest ? CHEST_LOOKUP[pendingChest.chestId] : null;
  if (!chestDef) return null;

  const rarityColor = RARITY_COLORS[chestDef.rarity] || '#ccc';

  return (
    <div className="screen screen-chest">
      <div className="chest-presentation">
        <div className="chest-icon-large" style={{ color: rarityColor }}>
          {'\u{1F4E6}'}
        </div>
        <div className="chest-name" style={{ color: rarityColor }}>
          {chestDef.name}
        </div>
        <div className={`shop-rarity-badge rarity-${chestDef.rarity.toLowerCase()}`}>
          {chestDef.rarity}
        </div>
        <div className="chest-desc">{chestDef.desc}</div>
        <div className="chest-info">
          Contains {chestDef.itemCount.min}-{chestDef.itemCount.max} items + {chestDef.goldBonus.min}-{chestDef.goldBonus.max}g
        </div>
      </div>

      <button
        className={`btn btn-primary chest-open-btn ${opened ? 'opening' : ''}`}
        onClick={() => { setOpened(true); onOpen(); }}
        disabled={opened}
      >
        {opened ? 'Opening...' : 'Open Chest'}
      </button>

      <button className="btn btn-back chest-back-btn" onClick={onClose}>
        Keep for Later
      </button>
    </div>
  );
}
