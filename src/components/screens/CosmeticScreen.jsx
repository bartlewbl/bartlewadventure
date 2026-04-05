import { useState } from 'react';
import { COSMETICS } from '../../data/goldSinks';

const CATEGORIES = [
  { id: 'titles', label: 'Titles', icon: '\u2606' },
  { id: 'nameColors', label: 'Name Colors', icon: '\u2668' },
  { id: 'frames', label: 'Portrait Frames', icon: '\u25A1' },
];

export default function CosmeticScreen({ player, cosmetics, onBuyCosmetic, onEquipCosmetic, onBack }) {
  const [category, setCategory] = useState('titles');
  const owned = cosmetics?.owned || [];
  const equipped = cosmetics?.equipped || {}; // { title, nameColor, frame }

  const items = COSMETICS[category] || [];

  return (
    <div className="screen screen-cosmetic">
      <div className="screen-header">
        <div className="screen-title">Cosmetic Shop</div>
        <div className="screen-subtitle">Personalize your hero</div>
      </div>

      <div className="cosmetic-gold">Your Gold: {player.gold}g</div>

      {/* Preview */}
      <div className="cosmetic-preview">
        <div
          className="cosmetic-preview-frame"
          style={{ border: equipped.frame ? COSMETICS.frames.find(f => f.id === equipped.frame)?.style || 'none' : 'solid 1px #555' }}
        >
          <div
            className="cosmetic-preview-name"
            style={{ color: equipped.nameColor ? COSMETICS.nameColors.find(c => c.id === equipped.nameColor)?.color || '#fff' : '#fff' }}
          >
            {player.name}
          </div>
          {equipped.title && (
            <div className="cosmetic-preview-title">
              {COSMETICS.titles.find(t => t.id === equipped.title)?.name || ''}
            </div>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="cosmetic-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cosmetic-tab ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className="cosmetic-tab-icon">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="cosmetic-item-list">
        {items.map(item => {
          const isOwned = owned.includes(item.id);
          const isEquipped = equipped[item.type] === item.id;
          const canAfford = player.gold >= item.cost;

          return (
            <div key={item.id} className={`cosmetic-item-card ${isEquipped ? 'equipped' : ''}`}>
              <div className="cosmetic-item-header">
                <span className="cosmetic-item-name">
                  {item.type === 'nameColor' && (
                    <span className="cosmetic-color-swatch" style={{ background: item.color }} />
                  )}
                  {item.name}
                </span>
                {!isOwned && <span className="cosmetic-item-price">{item.cost}g</span>}
              </div>
              {item.desc && <div className="cosmetic-item-desc">{item.desc}</div>}
              {item.type === 'frame' && (
                <div className="cosmetic-frame-preview" style={{ border: item.style }} />
              )}

              <div className="cosmetic-item-actions">
                {!isOwned && (
                  <button
                    className="btn btn-primary cosmetic-buy-btn"
                    disabled={!canAfford}
                    onClick={() => onBuyCosmetic(item.id)}
                  >
                    {canAfford ? 'Buy' : 'Need gold'}
                  </button>
                )}
                {isOwned && !isEquipped && (
                  <button
                    className="btn btn-secondary cosmetic-equip-btn"
                    onClick={() => onEquipCosmetic(item.id, item.type)}
                  >
                    Equip
                  </button>
                )}
                {isEquipped && (
                  <button
                    className="btn btn-secondary cosmetic-unequip-btn"
                    onClick={() => onEquipCosmetic(null, item.type)}
                  >
                    Unequip
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
