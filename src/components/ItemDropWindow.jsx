import { getClassName, getClassColor, getClassShortName } from '../data/gameData';

const SLOT_LABELS = {
  weapon: 'Weapon',
  shield: 'Shield',
  helmet: 'Helmet',
  armor: 'Armor',
  boots: 'Boots',
  accessory: 'Ring',
  gloves: 'Gloves',
  belt: 'Belt',
  cape: 'Cape',
  amulet: 'Amulet',
};

const TYPE_ICONS = {
  weapon: '\u2694',
  shield: '\u26E8',
  helmet: '\u2229',
  armor: '\u26CA',
  boots: '\u2319',
  accessory: '\u25C7',
  gloves: '\u270B',
  belt: '\u2014',
  cape: '\u2600',
  amulet: '\u2740',
  potion: '\u2695',
  'energy-drink': '\u26A1',
  material: '\u2692',
  egg: '\uD83E\uDD5A',
};

const RARITY_COLORS = {
  Common: '#ccc',
  Uncommon: '#4fc3f7',
  Rare: '#ab47bc',
  Epic: '#ffa726',
  Legendary: '#ffd700',
};

function getRarityColor(item) {
  return item.rarityColor || RARITY_COLORS[item.rarity] || '#ccc';
}

function getRarityClass(item) {
  const rc = item.rarityClass || '';
  if (rc.startsWith('rarity-')) return rc;
  if (rc) return `rarity-${rc}`;
  return 'rarity-common';
}

function getTypeLabel(item) {
  if (item.type === 'potion') return 'Potion';
  if (item.type === 'energy-drink') return 'Energy Drink';
  if (item.type === 'material') return 'Material';
  if (item.type === 'egg') return 'Egg';
  if (item.type === 'seed') return 'Seed';
  if (item.type === 'crop') return 'Crop';
  return SLOT_LABELS[item.slot] || item.type || 'Item';
}

function getStatLine(item) {
  if (item.type === 'potion') return `Heal ${item.healAmount} HP`;
  if (item.type === 'energy-drink') return `Energy +${item.energyAmount}`;
  if (item.type === 'material' || item.type === 'egg' || item.type === 'seed' || item.type === 'crop') return item.description || null;
  const parts = [];
  if (item.atk) parts.push(`ATK +${item.atk}`);
  if (item.def) parts.push(`DEF +${item.def}`);
  return parts.join('  ') || null;
}

export default function ItemDropWindow({ item, label }) {
  if (!item) return null;

  const typeIcon = TYPE_ICONS[item.slot] || TYPE_ICONS[item.type] || '\u2726';
  const typeLabel = getTypeLabel(item);
  const statLine = getStatLine(item);

  return (
    <div className={`item-drop-window ${getRarityClass(item)}`}>
      <div className="item-drop-label">{label || 'Item Found!'}</div>
      <div className="item-drop-card">
        <div className="item-drop-icon" style={{ color: getRarityColor(item) }}>
          {typeIcon}
        </div>
        <div className="item-drop-info">
          <div className="item-drop-name" style={{ color: getRarityColor(item) }}>
            {item.name}
          </div>
          <div className="item-drop-meta">
            <span className="item-drop-type">{typeLabel}</span>
            <span className="item-drop-level">Lv.{item.level}</span>
          </div>
          <div className="item-drop-rarity" style={{ color: getRarityColor(item) }}>
            {item.rarity}
          </div>
          {statLine && <div className="item-drop-stats">{statLine}</div>}
          {item.passive && (
            <div className="item-drop-passive" style={{ color: '#8f8', fontSize: '0.8em', marginTop: '2px' }}>
              +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
            </div>
          )}
          {item.classes && (
            <div className="item-drop-class" style={{ color: item.classes.length === 1 ? getClassColor(item.classes[0]) : '#aaa', fontSize: '0.75em', marginTop: '2px' }}
              title={item.classes.map(c => getClassName(c)).join(', ')}>
              {item.classes.map(c => getClassShortName(c)).join('/')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
