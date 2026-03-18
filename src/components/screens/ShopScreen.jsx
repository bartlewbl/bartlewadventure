import { useMemo, useState } from 'react';
import { getShopItems, getShopEnergyDrinks, getArmourerStock, getDailyFeaturedItems } from '../../engine/loot';
import { getPetShopStock, getPetItemShop, getPetRarityClass, PET_MAX_SLOTS } from '../../data/petData';
import useGameClock from '../../hooks/useGameClock';

const SLOT_LABELS = {
  weapon: 'Weapon',
  shield: 'Shield',
  helmet: 'Helmet',
  armor: 'Armor',
  boots: 'Boots',
  accessory: 'Ring',
};

const SHOPS = [
  { id: 'armourer', label: 'Armourer', icon: '\u2694', desc: 'Weapons & armor' },
  { id: 'brewer', label: 'Brewer', icon: '\u2697', desc: 'Potions & energy' },
  { id: 'petshop', label: 'Pet Shop', icon: '\u{1F43E}', desc: 'Buy pets & pet items' },
  { id: 'featured', label: 'Featured', icon: '\u2605', desc: 'Daily deals' },
];

const ARMOUR_CATEGORIES = [
  { id: 'all', label: 'All', icon: '\u2606' },
  { id: 'weapons', label: 'Weapons', icon: '\u2694' },
  { id: 'shields', label: 'Shields', icon: '\u26E8' },
  { id: 'helmets', label: 'Helmets', icon: '\u2229' },
  { id: 'armor', label: 'Armor', icon: '\u26CA' },
  { id: 'boots', label: 'Boots', icon: '\u2319' },
  { id: 'accessories', label: 'Rings', icon: '\u25C7' },
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

const ROLE_ICONS = {
  attacker: '\u2694',
  defender: '\u26E8',
  healer: '\u2661',
  buffer: '\u2606',
  hybrid: '\u269B',
};

export default function ShopScreen({ player, pets, onBuy, onSell, onBuyPet, onBuyPetItem, onBack }) {
  const [activeShop, setActiveShop] = useState('armourer');
  const [tab, setTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const clock = useGameClock();

  // Armourer stock — refreshes every 10 hours
  const armourerStock = useMemo(() => getArmourerStock(player.level, clock.shopSeed), [player.level, clock.shopSeed]);
  // Brewer stock
  const brewerStock = useMemo(() => [...getShopItems(player.level), ...getShopEnergyDrinks(player.level)], [player.level]);
  // Pet shop stock
  const petStock = useMemo(() => getPetShopStock(player.level), [player.level]);
  const petItemStock = useMemo(() => getPetItemShop(player.level), [player.level]);
  // Featured — refreshes every 10 hours
  const featuredStock = useMemo(() => getDailyFeaturedItems(player.level, clock.shopSeed), [player.level, clock.shopSeed]);

  const ownedPetIds = new Set((pets?.ownedPets || []).map(p => p.id));

  // Filtered armourer
  const filteredArmour = useMemo(() => {
    if (category === 'all') return armourerStock;
    return armourerStock.filter(item => getItemCategory(item) === category);
  }, [armourerStock, category]);

  // Filter inventory for sell
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
        <div className="shop-refresh-bar">
          <span className="shop-clock">{clock.period.icon} {clock.time} {clock.weather.icon} {clock.weather.label}</span>
          <span className="shop-refresh-timer">Stock refreshes in {clock.shopRefreshIn}</span>
        </div>
        {clock.effects.shopDiscount > 0 && (
          <div className="shop-weather-discount">
            {clock.weather.icon} Weather Bonus: -{Math.round(clock.effects.shopDiscount * 100)}% off all purchases!
          </div>
        )}
      </div>

      {/* Shop selector tabs */}
      <div className="shop-selector">
        {SHOPS.map(shop => (
          <button
            key={shop.id}
            className={`shop-selector-btn ${activeShop === shop.id ? 'active' : ''}`}
            onClick={() => { setActiveShop(shop.id); setCategory('all'); setTab('buy'); }}
            title={shop.desc}
          >
            <span className="shop-selector-icon">{shop.icon}</span>
            <span className="shop-selector-label">{shop.label}</span>
          </button>
        ))}
      </div>

      {/* ===== ARMOURER ===== */}
      {activeShop === 'armourer' && (
        <>
          <div className="shop-tabs">
            <button className={`shop-tab ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>Buy</button>
            <button className={`shop-tab ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>Sell</button>
          </div>

          <div className="shop-categories">
            {ARMOUR_CATEGORIES.map(cat => (
              <button key={cat.id} className={`shop-cat-btn ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>
                <span className="shop-cat-icon">{cat.icon}</span>
                <span className="shop-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="shop-content">
            {tab === 'buy' && (
              <div className="shop-list">
                {filteredArmour.length === 0 && <div className="shop-empty"><div className="shop-empty-text">No items available</div></div>}
                {filteredArmour.map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = player.inventory.length >= player.maxInventory;
                  return (
                    <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">{typeLabel(item)}</div>
                        <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                          <span className="shop-card-stats">{statLine(item)}</span>
                        </div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => onBuy(item)} disabled={!canAfford || invFull}
                        title={invFull ? 'Inventory full' : !canAfford ? 'Not enough gold' : ''}>
                        <span className="shop-btn-price">{item.buyPrice}g</span>
                        <span className="shop-btn-label">Buy</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'sell' && renderSellList(filteredInventory, player, onSell)}
          </div>
        </>
      )}

      {/* ===== BREWER ===== */}
      {activeShop === 'brewer' && (
        <>
          <div className="shop-tabs">
            <button className={`shop-tab ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>Buy</button>
            <button className={`shop-tab ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>Sell</button>
          </div>

          <div className="shop-content">
            {tab === 'buy' && (
              <div className="shop-list">
                {brewerStock.map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = player.inventory.length >= player.maxInventory;
                  return (
                    <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">{typeLabel(item)}</div>
                        <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                          <span className="shop-card-stats">{statLine(item)}</span>
                        </div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => onBuy(item)} disabled={!canAfford || invFull}
                        title={invFull ? 'Inventory full' : !canAfford ? 'Not enough gold' : ''}>
                        <span className="shop-btn-price">{item.buyPrice}g</span>
                        <span className="shop-btn-label">Buy</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'sell' && renderSellList(player.inventory, player, onSell)}
          </div>
        </>
      )}

      {/* ===== PET SHOP ===== */}
      {activeShop === 'petshop' && (
        <>
          <div className="shop-tabs">
            <button className={`shop-tab ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>Pets</button>
            <button className={`shop-tab ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>Pet Items</button>
          </div>

          <div className="shop-content">
            {tab === 'buy' && (
              <div className="shop-list">
                {petStock.length === 0 && <div className="shop-empty"><div className="shop-empty-text">No pets available at your level</div></div>}
                {petStock.map(pet => {
                  const owned = ownedPetIds.has(pet.id);
                  const canAfford = player.gold >= pet.buyPrice;
                  return (
                    <div key={pet.id} className={`shop-card pet-card ${getPetRarityClass(pet.rarity)} ${owned ? 'owned' : ''} ${!canAfford && !owned ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">
                          <span className="pet-role-icon">{ROLE_ICONS[pet.role] || ''}</span> {pet.role.charAt(0).toUpperCase() + pet.role.slice(1)}
                        </div>
                        <div className={`shop-card-name ${getPetRarityClass(pet.rarity)}`}>{pet.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${getPetRarityClass(pet.rarity)}`}>{pet.rarity}</span>
                          <span className="shop-card-stats">ATK:{pet.baseAtk} DEF:{pet.baseDef} HP:{pet.baseHp}</span>
                        </div>
                        <div className="pet-ability-line">{pet.ability.name}: {pet.ability.desc}</div>
                      </div>
                      <button
                        className="shop-buy-btn"
                        onClick={() => onBuyPet(pet.id)}
                        disabled={owned || !canAfford}
                        title={owned ? 'Already owned' : !canAfford ? 'Not enough gold' : ''}
                      >
                        <span className="shop-btn-price">{owned ? 'Owned' : pet.buyPrice + 'g'}</span>
                        <span className="shop-btn-label">{owned ? '\u2713' : 'Buy'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'items' && (
              <div className="shop-list">
                {petItemStock.map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = player.inventory.length >= player.maxInventory;
                  return (
                    <div key={item.id} className={`shop-card ${item.rarity?.toLowerCase() || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">{item.type === 'pet-snack' ? 'Pet Snack' : 'Pet Energy'}</div>
                        <div className={`shop-card-name ${item.rarity?.toLowerCase() || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarity?.toLowerCase() || ''}`}>{item.rarity}</span>
                          <span className="shop-card-stats">
                            {item.type === 'pet-snack' ? `Bond +${item.bondRestore}` : `Energy +${item.energyRestore}`}
                          </span>
                        </div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => onBuyPetItem(item)} disabled={!canAfford || invFull}
                        title={invFull ? 'Inventory full' : !canAfford ? 'Not enough gold' : ''}>
                        <span className="shop-btn-price">{item.buyPrice}g</span>
                        <span className="shop-btn-label">Buy</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== FEATURED ===== */}
      {activeShop === 'featured' && (
        <div className="shop-content">
          <div className="shop-featured-banner">Daily Featured Deals <span className="shop-featured-timer">Refreshes in {clock.shopRefreshIn}</span></div>
          <div className="shop-list">
            {featuredStock.length === 0 && <div className="shop-empty"><div className="shop-empty-text">No featured items today</div></div>}
            {featuredStock.map(item => {
              const canAfford = player.gold >= item.buyPrice;
              const invFull = player.inventory.length >= player.maxInventory;
              return (
                <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                  <div className="shop-card-left">
                    <div className="shop-card-type">{typeLabel(item)}</div>
                    <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                    <div className="shop-card-meta">
                      <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                      <span className="shop-card-stats">{statLine(item)}</span>
                    </div>
                  </div>
                  <button className="shop-buy-btn" onClick={() => onBuy(item)} disabled={!canAfford || invFull}>
                    <span className="shop-btn-price">{item.buyPrice}g</span>
                    <span className="shop-btn-label">Buy</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="shop-footer">
        <button className="btn btn-back" onClick={onBack}>Back to Town</button>
      </div>
    </div>
  );
}

function renderSellList(items, player, onSell) {
  return (
    <div className="shop-list">
      {player.inventory.length === 0 && (
        <div className="shop-empty">
          <div className="shop-empty-text">Your bag is empty</div>
          <div className="shop-empty-hint">Loot items from exploring to sell here</div>
        </div>
      )}
      {items.length === 0 && player.inventory.length > 0 && (
        <div className="shop-empty"><div className="shop-empty-text">No items in this category</div></div>
      )}
      {items.map(item => (
        <div key={item.id} className={`shop-card ${item.rarityClass || ''}`}>
          <div className="shop-card-left">
            <div className="shop-card-type">{typeLabel(item)}</div>
            <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
            <div className="shop-card-meta">
              <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
              <span className="shop-card-stats">{statLine(item)}</span>
            </div>
          </div>
          <button className="shop-sell-btn" onClick={() => onSell(item)}>
            <span className="shop-btn-price">+{item.sellPrice}g</span>
            <span className="shop-btn-label">Sell</span>
          </button>
        </div>
      ))}
    </div>
  );
}
