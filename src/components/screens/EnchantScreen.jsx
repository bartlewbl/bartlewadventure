import { useState } from 'react';
import { ENCHANT_LEVELS, getEnchantCost, getEnchantSuccess, MAX_ENCHANT_LEVEL } from '../../data/goldSinks';

export default function EnchantScreen({ player, onEnchant, onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null); // { success, item, level }

  const equipment = player.inventory.filter(i => i.slot);
  const equippedItems = Object.entries(player.equipment || {})
    .filter(([, item]) => item)
    .map(([slot, item]) => ({ ...item, _equippedSlot: slot }));
  const allGear = [...equippedItems, ...equipment];

  const handleEnchant = () => {
    if (!selectedItem) return;
    const currentLevel = selectedItem.enchantLevel || 0;
    if (currentLevel >= MAX_ENCHANT_LEVEL) return;
    const cost = getEnchantCost(selectedItem, currentLevel);
    if (player.gold < cost) return;
    onEnchant(selectedItem, selectedItem._equippedSlot || null);
  };

  const getItemLabel = (item) => {
    const enchant = item.enchantLevel ? ` +${item.enchantLevel}` : '';
    return `${item.name}${enchant}`;
  };

  const selectedGear = selectedItem
    ? allGear.find(i => i.id === selectedItem.id) || selectedItem
    : null;
  const currentLevel = selectedGear?.enchantLevel || 0;
  const cost = selectedGear ? getEnchantCost(selectedGear, currentLevel) : 0;
  const successRate = selectedGear ? getEnchantSuccess(currentLevel) : 0;
  const maxed = currentLevel >= MAX_ENCHANT_LEVEL;
  const canAfford = player.gold >= cost;
  const nextTier = !maxed ? ENCHANT_LEVELS[currentLevel] : null;

  return (
    <div className="screen screen-enchant">
      <div className="screen-header">
        <div className="screen-title">Enchanting</div>
        <div className="screen-subtitle">Enhance your gear with gold</div>
      </div>

      <div className="enchant-gold">Your Gold: {player.gold}g</div>

      <div className="enchant-layout">
        {/* Item selector */}
        <div className="enchant-item-list">
          <div className="enchant-list-title">Select Equipment</div>
          {allGear.length === 0 && <div className="empty-text">No equipment to enchant</div>}
          {allGear.map(item => {
            const el = item.enchantLevel || 0;
            const isMaxed = el >= MAX_ENCHANT_LEVEL;
            return (
              <button
                key={item.id}
                className={`enchant-item-btn ${selectedItem?.id === item.id ? 'selected' : ''} ${isMaxed ? 'maxed' : ''}`}
                onClick={() => { setSelectedItem(item); setResult(null); }}
              >
                <span className={`enchant-item-name ${item.rarityClass || ''}`}>{getItemLabel(item)}</span>
                <span className="enchant-item-slot">{item._equippedSlot ? '(equipped)' : item.slot}</span>
                {item.atk > 0 && <span className="enchant-item-stat">ATK+{item.atk}</span>}
                {item.def > 0 && <span className="enchant-item-stat">DEF+{item.def}</span>}
                {isMaxed && <span className="enchant-maxed-badge">MAX</span>}
              </button>
            );
          })}
        </div>

        {/* Enchant panel */}
        <div className="enchant-panel">
          {!selectedGear && <div className="enchant-empty">Select an item to enchant</div>}
          {selectedGear && (
            <>
              <div className={`enchant-selected-name ${selectedGear.rarityClass || ''}`}>
                {getItemLabel(selectedGear)}
              </div>
              <div className="enchant-current-stats">
                {selectedGear.atk > 0 && <span>ATK +{selectedGear.atk}</span>}
                {selectedGear.def > 0 && <span>DEF +{selectedGear.def}</span>}
              </div>

              {maxed ? (
                <div className="enchant-maxed">This item is fully enchanted!</div>
              ) : (
                <>
                  <div className="enchant-preview">
                    <div className="enchant-preview-title">
                      Enchant to {ENCHANT_LEVELS[currentLevel].label}
                    </div>
                    <div className="enchant-preview-bonus">
                      +{nextTier.statBonus} to ATK/DEF
                    </div>
                    <div className="enchant-preview-rate">
                      Success Rate: {Math.round(successRate * 100)}%
                    </div>
                    <div className={`enchant-preview-cost ${canAfford ? '' : 'cant-afford'}`}>
                      Cost: {cost}g
                    </div>
                  </div>

                  <button
                    className="btn btn-primary enchant-btn"
                    disabled={!canAfford}
                    onClick={handleEnchant}
                  >
                    {canAfford ? `Enchant (${cost}g)` : `Need ${cost}g`}
                  </button>
                </>
              )}

              {/* Enchant level progress */}
              <div className="enchant-level-track">
                {ENCHANT_LEVELS.map((tier, i) => (
                  <div
                    key={i}
                    className={`enchant-level-pip ${i < currentLevel ? 'filled' : ''} ${i === currentLevel ? 'next' : ''}`}
                  >
                    {tier.label}
                  </div>
                ))}
              </div>
            </>
          )}

          {result && (
            <div className={`enchant-result ${result.success ? 'success' : 'failure'}`}>
              {result.success
                ? `Success! ${result.itemName} is now ${ENCHANT_LEVELS[result.level - 1]?.label || '+?'}`
                : `Failed! The enchantment fizzled. Your item is unchanged.`
              }
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
