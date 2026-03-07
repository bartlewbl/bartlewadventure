import { useMemo, useState } from 'react';
import { getShopItems, getShopEnergyDrinks } from '../../engine/loot';

const SLOT_LABELS = {
  weapon: 'Weapon',
  shield: 'Shield',
  helmet: 'Helmet',
  armor: 'Armor',
  boots: 'Boots',
  accessory: 'Ring',
};

const SHOP_CATEGORIES = [
  { id: 'all', label: 'All', icon: '\u2606' },
  { id: 'weapons', label: 'Weapons', icon: '\u2694' },
  { id: 'shields', label: 'Shields', icon: '\u26E8' },
  { id: 'helmets', label: 'Helmets', icon: '\u2229' },
  { id: 'armor', label: 'Armor', icon: '\u26CA' },
  { id: 'boots', label: 'Boots', icon: '\u2319' },
  { id: 'accessories', label: 'Rings', icon: '\u25C7' },
  { id: 'potions', label: 'Potions', icon: '\u2661' },
  { id: 'energy-drinks', label: 'Energy', icon: '\u26A1' },
];

function getItemCategory(item) {
  if (item.type === 'potion') return 'potions';
  if (item.type === 'energy-drink') return 'energy-drinks';
  if (item.slot === 'weapon') return 'weapons';
  if (item.slot === 'shield') return 'shields';
  if (item.slot === 'helmet') return 'helmets';
  if (item.slot === 'armor') return 'armor';
  if (item.slot === 'boots') return 'boots';
  if (item.slot === 'accessory') return 'accessories';
  return 'misc';
}

const statLine = (item) => {
  if (!item) return '';
  if (item.slot) {
    const stats = [];
    if (item.atk) stats.push('ATK+' + item.atk);
    if (item.def) stats.push('DEF+' + item.def);
    return stats.length ? stats.join('  ') : 'No bonuses';
  }
  if (item.type === 'energy-drink') return `Energy +${item.energyAmount}`;
  return `Heal ${item.healAmount} HP`;
};

const typeLabel = (item) => {
  if (!item) return '';
  if (item.type === 'potion') return 'Potion';
  if (item.type === 'energy-drink') return 'Energy Drink';
  return SLOT_LABELS[item.slot] || item.type;
};

export default function ShopScreen({ player, onBuy, onSell, onBack }) {
  const [tab, setTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const stock = useMemo(() => [...getShopItems(player.level), ...getShopEnergyDrinks(player.level)], [player.level]);

  const filteredStock = useMemo(() => {
    if (category === 'all') return stock;
    return stock.filter(item => getItemCategory(item) === category);
  }, [stock, category]);

  const filteredInventory = useMemo(() => {
    if (category === 'all') return player.inventory;
    return player.inventory.filter(item => getItemCategory(item) === category);
  }, [player.inventory, category]);

  return (
    <div className="screen screen-shop">
      <div className="shop-header">
        <div className="shop-title">Neon Market</div>
        <div className="shop-wallet">
          <span className="shop-wallet-gold">{player.gold}g</span>
          <span className="shop-wallet-inv">{player.inventory.length}/{player.maxInventory} items</span>
        </div>
      </div>

      <div className="shop-tabs">
        <button
          className={`shop-tab ${tab === 'buy' ? 'active' : ''}`}
          onClick={() => setTab('buy')}
        >
          Buy
        </button>
        <button
          className={`shop-tab ${tab === 'sell' ? 'active' : ''}`}
          onClick={() => setTab('sell')}
        >
          Sell
        </button>
      </div>

      <div className="shop-categories">
        {SHOP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`shop-cat-btn ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className="shop-cat-icon">{cat.icon}</span>
            <span className="shop-cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="shop-content">
        {tab === 'buy' && (
          <div className="shop-list">
            {filteredStock.length === 0 && (
              <div className="shop-empty">
                <div className="shop-empty-text">No items in this category</div>
              </div>
            )}
            {filteredStock.map(item => {
              const canAfford = player.gold >= item.buyPrice;
              const invFull = player.inventory.length >= player.maxInventory;
              return (
                <div
                  key={item.id}
                  className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}
                >
                  <div className="shop-card-left">
                    <div className="shop-card-type">{typeLabel(item)}</div>
                    <div className={`shop-card-name ${item.rarityClass || ''}`}>
                      {item.name}
                    </div>
                    <div className="shop-card-meta">
                      <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>
                        {item.rarity}
                      </span>
                      <span className="shop-card-stats">{statLine(item)}</span>
                    </div>
                  </div>
                  <button
                    className="shop-buy-btn"
                    onClick={() => onBuy(item)}
                    disabled={!canAfford || invFull}
                    title={invFull ? 'Inventory full' : !canAfford ? 'Not enough gold' : ''}
                  >
                    <span className="shop-btn-price">{item.buyPrice}g</span>
                    <span className="shop-btn-label">Buy</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'sell' && (
          <div className="shop-list">
            {player.inventory.length === 0 && (
              <div className="shop-empty">
                <div className="shop-empty-text">Your bag is empty</div>
                <div className="shop-empty-hint">Loot items from exploring to sell here</div>
              </div>
            )}
            {player.inventory.length > 0 && filteredInventory.length === 0 && (
              <div className="shop-empty">
                <div className="shop-empty-text">No items in this category</div>
              </div>
            )}
            {filteredInventory.map(item => (
              <div
                key={item.id}
                className={`shop-card ${item.rarityClass || ''}`}
              >
                <div className="shop-card-left">
                  <div className="shop-card-type">{typeLabel(item)}</div>
                  <div className={`shop-card-name ${item.rarityClass || ''}`}>
                    {item.name}
                  </div>
                  <div className="shop-card-meta">
                    <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>
                      {item.rarity}
                    </span>
                    <span className="shop-card-stats">{statLine(item)}</span>
                  </div>
                </div>
                <button
                  className="shop-sell-btn"
                  onClick={() => onSell(item)}
                >
                  <span className="shop-btn-price">+{item.sellPrice}g</span>
                  <span className="shop-btn-label">Sell</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shop-footer">
        <button className="btn btn-back" onClick={onBack}>Back to Town</button>
      </div>
    </div>
  );
}
