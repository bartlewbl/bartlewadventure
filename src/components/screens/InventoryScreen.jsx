import { useState, useMemo } from 'react';
import { REGIONS } from '../../data/gameData';

// Build a lookup from location id to location name
const LOCATION_NAME_MAP = {};
for (const region of REGIONS) {
  for (const loc of region.locations) {
    LOCATION_NAME_MAP[loc.id] = loc.name;
  }
}

const SLOT_NAMES = {
  weapon: 'Weapon', shield: 'Shield', helmet: 'Helmet',
  armor: 'Armor', gloves: 'Gloves', boots: 'Boots',
  belt: 'Belt', cape: 'Cape', amulet: 'Amulet', accessory: 'Ring 1', accessory2: 'Ring 2',
};

const INV_CATEGORIES = [
  { id: 'all', label: 'All', icon: '\u2606' },
  { id: 'weapons', label: 'Weapons', icon: '\u2694' },
  { id: 'shields', label: 'Shields', icon: '\u26E8' },
  { id: 'helmets', label: 'Helmets', icon: '\u2229' },
  { id: 'armor', label: 'Armor', icon: '\u26CA' },
  { id: 'gloves', label: 'Gloves', icon: '\u270B' },
  { id: 'boots', label: 'Boots', icon: '\u2319' },
  { id: 'belts', label: 'Belts', icon: '\u2261' },
  { id: 'capes', label: 'Capes', icon: '\u2767' },
  { id: 'amulets', label: 'Amulets', icon: '\u2740' },
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
  if (item.slot === 'gloves') return 'gloves';
  if (item.slot === 'belt') return 'belts';
  if (item.slot === 'cape') return 'capes';
  if (item.slot === 'amulet') return 'amulets';
  if (item.slot === 'accessory') return 'accessories';
  return 'misc';
}

function itemMetaTag(item) {
  if (!item) return '';
  const parts = [];
  if (item.rarity) parts.push(item.rarity);
  if (item.level) parts.push('Lv' + item.level);
  return parts.length ? `[${parts.join(' · ')}]` : '';
}

function itemStatLine(item) {
  if (!item) return '';
  if (item.slot) {
    const stats = [];
    if (item.atk) stats.push('ATK+' + item.atk);
    if (item.def) stats.push('DEF+' + item.def);
    return stats.length ? stats.join(' ') : 'No bonuses';
  }
  if (item.type === 'energy-drink') return `Energy +${item.energyAmount}`;
  return `Heal ${item.healAmount} HP`;
}

function getItemLocationText(itemName, discoveredItemLocations) {
  const locations = discoveredItemLocations?.[itemName];
  if (!locations || locations.length === 0) return null;
  const names = locations.map(id => LOCATION_NAME_MAP[id] || id);
  return `Found in: ${names.join(', ')}`;
}

export default function InventoryScreen({
  player, playerAtk, playerDef, discoveredItemLocations, onEquip, onUnequip, onUse, onSell, onReorder, onBack,
}) {
  const [category, setCategory] = useState('all');
  const [dragInfo, setDragInfo] = useState(null);
  const [hoverState, setHoverState] = useState(null);
  const [slotHover, setSlotHover] = useState(null);

  const filteredInventory = useMemo(() => {
    if (category === 'all') return player.inventory;
    return player.inventory.filter(item => getItemCategory(item) === category);
  }, [player.inventory, category]);

  const dragIndex = dragInfo?.source === 'inventory' ? dragInfo.index : null;
  const getDraggedItem = () => {
    if (dragIndex == null) return null;
    return player.inventory[dragIndex] || null;
  };

  const clearDragState = () => {
    setDragInfo(null);
    setHoverState(null);
    setSlotHover(null);
  };

  const handleDragStart = (index) => (event) => {
    const item = player.inventory[index];
    if (!item) return;
    setDragInfo({ source: 'inventory', index, itemId: item.id });
    setHoverState(null);
    setSlotHover(null);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOverItem = (index) => (event) => {
    if (dragIndex === null) return;
    event.preventDefault();
    if (index === dragIndex) {
      setHoverState(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = (event.clientY - rect.top) > rect.height / 2;
    setHoverState({ index, position: isAfter ? 'after' : 'before' });
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnItem = (index) => (event) => {
    if (dragIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = (event.clientY - rect.top) > rect.height / 2;
    const insertIndex = isAfter ? index + 1 : index;
    onReorder?.(dragIndex, insertIndex);
    clearDragState();
  };

  const handleDragEnd = () => {
    clearDragState();
  };

  const handleListDragOver = (event) => {
    if (dragIndex === null) return;
    if (event.target !== event.currentTarget) return;
    if (player.inventory.length === 0) return;
    event.preventDefault();
    setHoverState({ index: player.inventory.length - 1, position: 'after' });
    event.dataTransfer.dropEffect = 'move';
  };

  const handleListDrop = (event) => {
    if (dragIndex === null) return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    event.stopPropagation();
    onReorder?.(dragIndex, player.inventory.length);
    clearDragState();
  };

  const handleListDragLeave = (event) => {
    if (event.target !== event.currentTarget) return;
    setHoverState(null);
  };

  const handleSlotDragOver = (slot) => (event) => {
    if (dragIndex === null) return;
    const item = getDraggedItem();
    if (!item) return;
    event.preventDefault();
    const valid = item.slot === slot || (item.slot === 'accessory' && slot === 'accessory2');
    event.dataTransfer.dropEffect = valid ? 'move' : 'none';
    setSlotHover({ slot, valid });
    setHoverState(null);
  };

  const handleSlotDrop = (slot) => (event) => {
    if (dragIndex === null) return;
    const item = getDraggedItem();
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
    const validSlot = item.slot === slot || (item.slot === 'accessory' && slot === 'accessory2');
    if (!validSlot) {
      setSlotHover({ slot, valid: false });
      return;
    }
    onEquip(item, slot);
    clearDragState();
  };

  const handleSlotDragLeave = (slot) => () => {
    if (slotHover?.slot !== slot) return;
    setSlotHover(null);
  };

  return (
    <div className="screen screen-inventory">
      <div className="screen-header">Inventory</div>

      <div className="inv-content">
        <div className="section-title">Equipment</div>
        <div className="equipment-grid">
          {Object.entries(SLOT_NAMES).map(([slot, label]) => {
            const item = player.equipment[slot];
            const slotState = slotHover?.slot === slot
              ? (slotHover.valid ? 'equip-slot-drop-valid' : 'equip-slot-drop-invalid')
              : '';
            return (
              <div
                key={slot}
                className={`equip-slot ${slotState}`}
                onDragOver={handleSlotDragOver(slot)}
                onDrop={handleSlotDrop(slot)}
                onDragLeave={handleSlotDragLeave(slot)}
              >
                <div className="equip-label">{label}</div>
                <div className={`equip-item ${item ? item.rarityClass : ''}`}>
                  {item ? `${item.name}${item.level ? ' (Lv' + item.level + ')' : ''}` : '-- Empty --'}
                </div>
                {item && (
                  <>
                    <div className="equip-stats">
                      {item.level ? `Lv${item.level} · ` : ''}
                      {itemStatLine(item)}
                    </div>
                    {getItemLocationText(item.name, discoveredItemLocations) && (
                      <div className="equip-location">{getItemLocationText(item.name, discoveredItemLocations)}</div>
                    )}
                    <button className="btn btn-sm" onClick={() => onUnequip(slot)}>Unequip</button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="section-title">Items ({player.inventory.length}/{player.maxInventory})</div>
        <div className="inv-categories">
          {INV_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`inv-cat-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <span className="inv-cat-icon">{cat.icon}</span>
              <span className="inv-cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
        <div
          className="inventory-list"
          onDragOver={handleListDragOver}
          onDrop={handleListDrop}
          onDragLeave={handleListDragLeave}
        >
          {player.inventory.length === 0 && (
            <div className="empty-text">No items</div>
          )}
          {player.inventory.length > 0 && filteredInventory.length === 0 && (
            <div className="empty-text">No items in this category</div>
          )}
          {filteredInventory.map((item) => {
            const index = player.inventory.indexOf(item);
            const isDragging = dragIndex === index;
            const isHoverBefore = hoverState && hoverState.index === index && hoverState.position === 'before';
            const isHoverAfter = hoverState && hoverState.index === index && hoverState.position === 'after';
            const itemClass = [
              'inv-item',
              isDragging ? 'dragging' : '',
              isHoverBefore ? 'drag-over-before' : '',
              isHoverAfter ? 'drag-over-after' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={item.id}
                className={itemClass}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOverItem(index)}
                onDrop={handleDropOnItem(index)}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="inv-item-info"
                  title={[
                    `${item.name} ${itemMetaTag(item)}`,
                    itemStatLine(item),
                    getItemLocationText(item.name, discoveredItemLocations),
                  ].filter(Boolean).join('\n')}
                >
                  <span className={`inv-item-name ${item.rarityClass}`}>
                    {item.name} {itemMetaTag(item)}
                  </span>
                  <span className="inv-item-stats">
                    {itemStatLine(item)}
                  </span>
                  {getItemLocationText(item.name, discoveredItemLocations) && (
                    <span className="inv-item-location">
                      {getItemLocationText(item.name, discoveredItemLocations)}
                    </span>
                  )}
                </div>
                <div className="inv-item-actions">
                  {item.slot ? (
                    <button className="btn btn-sm" onClick={() => onEquip(item)}>Equip</button>
                  ) : (
                    <button className="btn btn-sm" onClick={() => onUse(item)}>Use</button>
                  )}
                  <button className="btn btn-sm btn-back" onClick={() => onSell(item)}>
                    {item.sellPrice}g
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="player-stats-summary">
          ATK: {playerAtk} | DEF: {playerDef} | Max HP: {player.maxHp}
        </div>
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
