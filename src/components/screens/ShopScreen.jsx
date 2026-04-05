import { useMemo, useState } from 'react';
import { getShopItems, getArmourerStock, getDailyFeaturedItems } from '../../engine/loot';
import { getPetShopStock, getPetItemShop, getPetRarityClass, PET_MAX_SLOTS } from '../../data/petData';
import { getGroceryStock } from '../../data/baseData';
import { getTradingMarketStock } from '../../data/lootChests';
import { BUILDING_MATERIALS } from '../../data/baseData';
import { getClassName, getClassColor, getClassShortName, canClassEquip } from '../../data/gameData';
import { getStackKey } from '../../hooks/useGameState';
import useGameClock from '../../hooks/useGameClock';
import { TAVERN_SHOP_UNLOCKS, TAVERN_NPCS, REP_LEVELS, getRepLevel } from '../../data/tavernData';
import { COSMETICS } from '../../data/goldSinks';

const SLOT_LABELS = {
  weapon: 'Weapon',
  shield: 'Shield',
  helmet: 'Helmet',
  armor: 'Armor',
  boots: 'Boots',
  accessory: 'Ring',
  gloves: 'Gloves',
  amulet: 'Amulet',
  belt: 'Belt',
  cape: 'Cape',
};

const SHOPS = [
  { id: 'armourer', label: 'Armourer', icon: '\u2694', desc: 'Weapons & armor' },
  { id: 'brewer', label: 'Brewer', icon: '\u2697', desc: 'Potions & energy' },
  { id: 'grocery', label: 'Grocery', icon: '\uD83D\uDED2', desc: 'Food for incubator' },
  { id: 'petshop', label: 'Pet Shop', icon: '\u{1F43E}', desc: 'Buy pets & pet items' },
  { id: 'featured', label: 'Featured', icon: '\u2605', desc: 'Daily deals' },
  { id: 'trading', label: 'Trading', icon: '\u2692', desc: 'Trade materials for loot chests' },
  { id: 'tavern', label: 'Tavern', icon: '\uD83C\uDF7A', desc: 'NPC exclusive items' },
  { id: 'cosmetics', label: 'Cosmetics', icon: '\u2728', desc: 'Titles, colors & frames' },
];

const ARMOUR_CATEGORIES = [
  { id: 'all', label: 'All', icon: '\u2606' },
  { id: 'weapons', label: 'Weapons', icon: '\u2694' },
  { id: 'shields', label: 'Shields', icon: '\u26E8' },
  { id: 'helmets', label: 'Helmets', icon: '\u2229' },
  { id: 'armor', label: 'Armor', icon: '\u26CA' },
  { id: 'gloves', label: 'Gloves', icon: '\u270B' },
  { id: 'boots', label: 'Boots', icon: '\u2319' },
  { id: 'belts', label: 'Belts', icon: '\u2261' },
  { id: 'capes', label: 'Capes', icon: '\u2767' },
  { id: 'amulets', label: 'Amulets', icon: '\u2662' },
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
  if (item.slot === 'gloves') return 'gloves';
  if (item.slot === 'belt') return 'belts';
  if (item.slot === 'cape') return 'capes';
  if (item.slot === 'amulet') return 'amulets';
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
  if (item.type === 'incubator-food') return `Incubator +${item.fuelMinutes} min`;
  return `Heal ${item.healAmount} HP`;
};

const typeLabel = (item) => {
  if (!item) return '';
  if (item.type === 'potion') return 'Potion';
  if (item.type === 'energy-drink') return 'Energy Drink';
  if (item.type === 'incubator-food') return 'Incubator Food';
  return SLOT_LABELS[item.slot] || item.type;
};

const ROLE_ICONS = {
  attacker: '\u2694',
  defender: '\u26E8',
  healer: '\u2661',
  buffer: '\u2606',
  hybrid: '\u269B',
};

function isInvFullForItem(player, shopItem) {
  if (player.inventory.length < player.maxInventory) return false;
  // If full, check if this item can stack with an existing item
  const key = getStackKey(shopItem);
  if (key && player.inventory.some(i => getStackKey(i) === key)) return false;
  return true;
}

export default function ShopScreen({ player, pets, base, shopPurchases, tavern, cosmetics, onBuy, onSell, onSellUnequippable, onBuyPet, onBuyPetItem, onTradeForChest, onTavernBuy, onBuyCosmetic, onEquipCosmetic, onBack }) {
  const [activeShop, setActiveShop] = useState('armourer');
  const [tab, setTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const clock = useGameClock();

  // Helper to get remaining stock for an item
  const getRemaining = (item) => {
    if (item.stock == null) return Infinity;
    const key = item.shopStockKey || item.name + '_' + item.level;
    return Math.max(0, item.stock - (shopPurchases[key] || 0));
  };

  const handleBuy = (item) => onBuy(item, clock.shopSeed);

  // Armourer stock — refreshes every 10 hours
  const armourerStock = useMemo(() => getArmourerStock(player.level, clock.shopSeed, player.characterClass), [player.level, clock.shopSeed, player.characterClass]);
  // Brewer stock
  const brewerStock = useMemo(() => getShopItems(player.level), [player.level]);
  // Pet shop stock
  const petStock = useMemo(() => getPetShopStock(player.level), [player.level]);
  const petItemStock = useMemo(() => getPetItemShop(player.level), [player.level]);
  // Grocery stock
  const groceryStock = useMemo(() => getGroceryStock(player.level), [player.level]);
  // Trading market stock
  const tradingStock = useMemo(() => getTradingMarketStock(player.level), [player.level]);
  // Featured — refreshes every 10 hours
  const featuredStock = useMemo(() => getDailyFeaturedItems(player.level, clock.shopSeed, player.characterClass), [player.level, clock.shopSeed, player.characterClass]);

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

  // Unequippable equipment in inventory (class-locked or level-locked)
  const unequippableItems = useMemo(() => {
    return player.inventory.filter(item => {
      if (!item.slot) return false;
      const levelLocked = item.level && item.level > player.level;
      const classLocked = !canClassEquip(item, player.characterClass);
      return levelLocked || classLocked;
    });
  }, [player.inventory, player.level, player.characterClass]);

  const unequippableGold = useMemo(() => {
    return unequippableItems.reduce((sum, item) => sum + (item.sellPrice || 0) * (item.stackCount || 1), 0);
  }, [unequippableItems]);

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
                {filteredArmour.filter(item => getRemaining(item) > 0).map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = isInvFullForItem(player, item);
                  const remaining = getRemaining(item);
                  return (
                    <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">{typeLabel(item)}</div>
                        <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                          {item.level && <span className="shop-card-level">Lv{item.level}</span>}
                          <span className="shop-card-stats">{statLine(item)}</span>
                          {item.passive && (
                            <span className="shop-card-passive" style={{ color: '#8f8' }}>
                              +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
                            </span>
                          )}
                          {item.classes && (
                            <span className="shop-card-class" style={{ color: item.classes.length === 1 ? getClassColor(item.classes[0]) : '#aaa', fontSize: '0.75em' }}
                              title={item.classes.map(c => getClassName(c)).join(', ')}>
                              {item.classes.map(c => getClassShortName(c)).join('/')}
                            </span>
                          )}
                          {remaining < Infinity && <span className="shop-card-stock">Stock: {remaining}</span>}
                        </div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => handleBuy(item)} disabled={!canAfford || invFull}
                        title={invFull ? 'Inventory full' : !canAfford ? 'Not enough gold' : ''}>
                        <span className="shop-btn-price">{item.buyPrice}g</span>
                        <span className="shop-btn-label">Buy</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'sell' && (
              <>
                {unequippableItems.length > 0 && (
                  <div className="shop-sell-unequippable">
                    <button className="shop-sell-unequippable-btn" onClick={onSellUnequippable}>
                      Sell All Unequippable ({unequippableItems.length}) — +{unequippableGold}g
                    </button>
                  </div>
                )}
                {renderSellList(filteredInventory, player, onSell)}
              </>
            )}
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
                {brewerStock.filter(item => getRemaining(item) > 0).map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = isInvFullForItem(player, item);
                  const remaining = getRemaining(item);
                  return (
                    <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">{typeLabel(item)}</div>
                        <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                          {item.level && <span className="shop-card-level">Lv{item.level}</span>}
                          <span className="shop-card-stats">{statLine(item)}</span>
                          {remaining < Infinity && <span className="shop-card-stock">Stock: {remaining}</span>}
                        </div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => handleBuy(item)} disabled={!canAfford || invFull}
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

      {/* ===== GROCERY ===== */}
      {activeShop === 'grocery' && (
        <>
          <div className="shop-tabs">
            <button className={`shop-tab ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>Buy</button>
            <button className={`shop-tab ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>Sell</button>
          </div>

          <div className="shop-content">
            {tab === 'buy' && (
              <div className="shop-list">
                <div className="shop-featured-banner">Incubator Food - keeps your eggs warm and growing!</div>
                {groceryStock.filter(item => getRemaining(item) > 0).map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = isInvFullForItem(player, item);
                  const remaining = getRemaining(item);
                  return (
                    <div key={item.id} className={`shop-card ${item.rarity?.toLowerCase() || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">Incubator Food</div>
                        <div className={`shop-card-name ${item.rarity?.toLowerCase() || ''}`}>{item.name}</div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge ${item.rarity?.toLowerCase() || ''}`}>{item.rarity}</span>
                          <span className="shop-card-stats">+{item.fuelMinutes} min incubation</span>
                          {remaining < Infinity && <span className="shop-card-stock">Stock: {remaining}</span>}
                        </div>
                        <div className="pet-ability-line">{item.description}</div>
                      </div>
                      <button className="shop-buy-btn" onClick={() => handleBuy(item)} disabled={!canAfford || invFull}
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
                {petItemStock.filter(item => getRemaining(item) > 0).map(item => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = isInvFullForItem(player, item);
                  const remaining = getRemaining(item);
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
                          {remaining < Infinity && <span className="shop-card-stock">Stock: {remaining}</span>}
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
            {featuredStock.filter(item => getRemaining(item) > 0).map(item => {
              const canAfford = player.gold >= item.buyPrice;
              const invFull = isInvFullForItem(player, item);
              const remaining = getRemaining(item);
              return (
                <div key={item.id} className={`shop-card ${item.rarityClass || ''} ${!canAfford ? 'unaffordable' : ''}`}>
                  <div className="shop-card-left">
                    <div className="shop-card-type">{typeLabel(item)}</div>
                    <div className={`shop-card-name ${item.rarityClass || ''}`}>{item.name}</div>
                    <div className="shop-card-meta">
                      <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
                      {item.level && <span className="shop-card-level">Lv{item.level}</span>}
                      <span className="shop-card-stats">{statLine(item)}</span>
                      {item.classes && (
                        <span className="shop-card-class" style={{ color: item.classes.length === 1 ? getClassColor(item.classes[0]) : '#aaa', fontSize: '0.75em' }}
                          title={item.classes.map(c => getClassName(c)).join(', ')}>
                          {item.classes.map(c => getClassShortName(c)).join('/')}
                        </span>
                      )}
                      {remaining < Infinity && <span className="shop-card-stock">Stock: {remaining}</span>}
                    </div>
                  </div>
                  <button className="shop-buy-btn" onClick={() => handleBuy(item)} disabled={!canAfford || invFull}>
                    <span className="shop-btn-price">{item.buyPrice}g</span>
                    <span className="shop-btn-label">Buy</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== TRADING MARKET ===== */}
      {activeShop === 'trading' && (
        <div className="shop-content">
          <div className="shop-featured-banner">Trade Materials for Powerful Loot Chests</div>
          <div className="shop-list">
            {tradingStock.length === 0 && (
              <div className="shop-empty"><div className="shop-empty-text">No chests available at your level yet</div></div>
            )}
            {tradingStock.map(chest => {
              const baseMats = base?.materials || {};
              const canAfford = Object.entries(chest.materialCost).every(
                ([matId, qty]) => (baseMats[matId] || 0) >= qty
              );
              const invFull = player.inventory.length >= player.maxInventory;
              return (
                <div key={chest.id} className={`shop-card rarity-${chest.rarity.toLowerCase()} ${!canAfford ? 'unaffordable' : ''}`}>
                  <div className="shop-card-left">
                    <div className="shop-card-type">Forged Chest</div>
                    <div className={`shop-card-name rarity-${chest.rarity.toLowerCase()}`}>{chest.name}</div>
                    <div className="shop-card-meta">
                      <span className={`shop-rarity-badge rarity-${chest.rarity.toLowerCase()}`}>{chest.rarity}</span>
                      <span className="shop-card-stats">
                        {chest.itemCount.min}-{chest.itemCount.max} items + {chest.goldBonus.min}-{chest.goldBonus.max}g
                      </span>
                    </div>
                    <div className="shop-card-desc">{chest.desc}</div>
                    <div className="trading-cost-list">
                      {Object.entries(chest.materialCost).map(([matId, qty]) => {
                        const matDef = BUILDING_MATERIALS[matId];
                        const have = baseMats[matId] || 0;
                        const enough = have >= qty;
                        return (
                          <span key={matId} className={`trading-cost-item ${enough ? 'has-enough' : 'not-enough'}`}>
                            {matDef?.name || matId} {have}/{qty}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    className="shop-buy-btn"
                    onClick={() => onTradeForChest(chest.id)}
                    disabled={!canAfford || invFull}
                    title={invFull ? 'Inventory full' : !canAfford ? 'Not enough materials' : ''}
                  >
                    <span className="shop-btn-price">Forge</span>
                    <span className="shop-btn-label">{'\u2692'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeShop === 'tavern' && (
        <div className="shop-content">
          <div className="shop-featured-banner">Tavern Exclusive Items</div>
          <div className="shop-featured-banner" style={{ fontSize: '7px', color: '#8e8eb2', marginTop: '-6px' }}>
            Build reputation with tavern NPCs to unlock rare goods
          </div>
          <div className="shop-list">
            {Object.entries(TAVERN_SHOP_UNLOCKS).map(([npcId, tiers]) => {
              const npc = TAVERN_NPCS.find(n => n.id === npcId);
              const rep = tavern?.reputation?.[npcId] || 0;
              const repLvl = getRepLevel(rep).level;
              return tiers.map((tier, ti) => {
                const repLocked = repLvl < tier.reqRep;
                const reqLabel = REP_LEVELS.find(r => r.level === tier.reqRep)?.label || '';
                return tier.items.map((item, ii) => {
                  const canAfford = player.gold >= item.buyPrice;
                  const invFull = isInvFullForItem(player, item);
                  const stockKey = npcId + '_' + item.name;
                  const bought = tavern?.shopPurchases?.[stockKey] || 0;
                  const soldOut = item.type === 'gear' && bought >= 1;
                  return (
                    <div key={`${npcId}-${ti}-${ii}`} className={`shop-card ${repLocked ? 'unaffordable' : ''} ${soldOut ? 'unaffordable' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-type">
                          <span style={{ color: npc?.color || '#ccc' }}>{npc?.name || npcId}</span>
                        </div>
                        <div className="shop-card-name" style={{ color: item.rarity === 'Epic' ? '#ce93d8' : item.rarity === 'Rare' ? '#ffd700' : item.rarity === 'Uncommon' ? '#4fc3f7' : '#ccc' }}>
                          {item.name}
                        </div>
                        <div className="shop-card-meta">
                          <span className={`shop-rarity-badge rarity-${(item.rarity || 'common').toLowerCase()}`}>{item.rarity}</span>
                          {item.level > 0 && <span className="shop-card-level">Lv{item.level}</span>}
                          <span className="shop-card-stats">
                            {item.atk > 0 ? `ATK+${item.atk}  ` : ''}
                            {item.def > 0 ? `DEF+${item.def}  ` : ''}
                            {item.healAmount > 0 ? `Heal ${item.healAmount}  ` : ''}
                            {item.slot ? item.slot : ''}
                          </span>
                          {item.passive && (
                            <span className="shop-card-passive" style={{ color: '#8f8' }}>
                              +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
                            </span>
                          )}
                        </div>
                        <div className="shop-card-desc" style={{ fontSize: '7px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
                        {repLocked && (
                          <div style={{ fontSize: '6px', color: '#f88', marginTop: '3px', fontFamily: "'Press Start 2P', monospace" }}>
                            Requires {reqLabel} rep with {npc?.name || npcId}
                          </div>
                        )}
                      </div>
                      <button
                        className="shop-buy-btn"
                        onClick={() => onTavernBuy(item, npcId)}
                        disabled={repLocked || !canAfford || invFull || soldOut}
                        title={repLocked ? 'Locked' : soldOut ? 'Sold out' : !canAfford ? 'Not enough gold' : invFull ? 'Inventory full' : ''}
                      >
                        <span className="shop-btn-price">{item.buyPrice}g</span>
                        <span className="shop-btn-label">{soldOut ? 'Sold' : repLocked ? 'Locked' : 'Buy'}</span>
                      </button>
                    </div>
                  );
                });
              });
            })}
          </div>
        </div>
      )}

      {activeShop === 'cosmetics' && (
        <div className="shop-content">
          <div className="shop-featured-banner">Cosmetic Shop</div>
          <div className="shop-featured-banner" style={{ fontSize: '7px', color: '#8e8eb2', marginTop: '-6px' }}>
            Titles, name colors, and portrait frames
          </div>
          {/* Cosmetic preview */}
          <div className="cosmetic-preview">
            <div className="cosmetic-preview-frame"
              style={{ border: cosmetics?.equipped?.frame ? COSMETICS.frames.find(f => f.id === cosmetics.equipped.frame)?.style || 'none' : 'solid 1px #555' }}>
              <div className="cosmetic-preview-name"
                style={{ color: cosmetics?.equipped?.nameColor ? COSMETICS.nameColors.find(c => c.id === cosmetics.equipped.nameColor)?.color || '#fff' : '#fff' }}>
                {player.name}
              </div>
              {cosmetics?.equipped?.title && (
                <div className="cosmetic-preview-title">{COSMETICS.titles.find(t => t.id === cosmetics.equipped.title)?.name || ''}</div>
              )}
            </div>
          </div>
          <div className="shop-list">
            {['titles', 'nameColors', 'frames'].map(category => (
              <div key={category}>
                <div className="shop-featured-banner" style={{ fontSize: '8px', marginTop: '4px' }}>
                  {category === 'titles' ? 'Titles' : category === 'nameColors' ? 'Name Colors' : 'Portrait Frames'}
                </div>
                {(COSMETICS[category] || []).map(item => {
                  const owned = cosmetics?.owned || [];
                  const equipped = cosmetics?.equipped || {};
                  const isOwned = owned.includes(item.id);
                  const isEquipped = equipped[item.type] === item.id;
                  const canAfford = player.gold >= item.cost;
                  return (
                    <div key={item.id} className={`shop-card ${isEquipped ? 'equipped-cosmetic' : ''}`}>
                      <div className="shop-card-left">
                        <div className="shop-card-name" style={{ color: item.color || '#fff' }}>
                          {item.type === 'nameColor' && <span className="cosmetic-color-swatch" style={{ background: item.color }} />}
                          {item.name}
                        </div>
                        {item.desc && <div className="shop-card-meta"><span className="shop-card-stats">{item.desc}</span></div>}
                        {item.type === 'frame' && <div className="cosmetic-frame-preview" style={{ border: item.style }} />}
                      </div>
                      {!isOwned && (
                        <button className="shop-buy-btn" disabled={!canAfford} onClick={() => onBuyCosmetic(item.id)}>
                          <span className="shop-btn-price">{item.cost}g</span>
                          <span className="shop-btn-label">{canAfford ? 'Buy' : 'Need gold'}</span>
                        </button>
                      )}
                      {isOwned && !isEquipped && (
                        <button className="shop-buy-btn" onClick={() => onEquipCosmetic(item.id, item.type)}>
                          <span className="shop-btn-label">Equip</span>
                        </button>
                      )}
                      {isEquipped && (
                        <button className="shop-buy-btn" onClick={() => onEquipCosmetic(null, item.type)} style={{ opacity: 0.6 }}>
                          <span className="shop-btn-label">Unequip</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
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
            <div className={`shop-card-name ${item.rarityClass || ''}`}>
              {item.name}
              {(item.stackCount || 1) > 1 && <span className="inv-stack-badge">x{item.stackCount}</span>}
            </div>
            <div className="shop-card-meta">
              <span className={`shop-rarity-badge ${item.rarityClass || ''}`}>{item.rarity}</span>
              {item.level && <span className="shop-card-level">Lv{item.level}</span>}
              <span className="shop-card-stats">{statLine(item)}</span>
            </div>
          </div>
          <button className="shop-sell-btn" onClick={() => onSell(item)}>
            <span className="shop-btn-price">+{item.sellPrice}g</span>
            <span className="shop-btn-label">Sell 1</span>
          </button>
        </div>
      ))}
    </div>
  );
}
