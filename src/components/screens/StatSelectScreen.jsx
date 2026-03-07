import { useState } from 'react';

const STAT_INFO = {
  hp: { label: 'HP', key: 'hpGain', color: '#4caf50', desc: 'Max Health' },
  mana: { label: 'MP', key: 'manaGain', color: '#42a5f5', desc: 'Max Mana' },
  atk: { label: 'ATK', key: 'atkGain', color: '#ff5252', desc: 'Attack Power' },
  def: { label: 'DEF', key: 'defGain', color: '#ffa726', desc: 'Defense' },
  charisma: { label: 'CHA', key: 'charismaGain', color: '#ec407a', desc: 'Charisma' },
  wisdom: { label: 'WIS', key: 'wisdomGain', color: '#ab47bc', desc: 'Wisdom' },
  athletics: { label: 'ATH', key: 'athleticsGain', color: '#26c6da', desc: 'Athletics' },
};

const STAT_KEYS = Object.keys(STAT_INFO);

export default function StatSelectScreen({ pendingLevel, maxPicks, onConfirm }) {
  const [selected, setSelected] = useState([]);

  if (!pendingLevel) return null;

  const { level, offers } = pendingLevel;

  const toggleStat = (statId) => {
    if (selected.includes(statId)) {
      setSelected(selected.filter(s => s !== statId));
    } else if (selected.length < maxPicks) {
      setSelected([...selected, statId]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === maxPicks) {
      onConfirm(selected);
      setSelected([]);
    }
  };

  // Filter out stats with 0 gain
  const availableStats = STAT_KEYS.filter(id => offers[STAT_INFO[id].key] > 0);

  return (
    <div className="screen screen-stat-select">
      <div className="stat-select-title">LEVEL {level}</div>
      <div className="stat-select-subtitle">
        Choose {maxPicks} stat{maxPicks > 1 ? 's' : ''} to upgrade
      </div>

      <div className="stat-select-grid">
        {availableStats.map(id => {
          const info = STAT_INFO[id];
          const gain = offers[info.key];
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              className={`stat-select-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleStat(id)}
              style={{ '--stat-color': info.color }}
            >
              <div className="stat-select-label">{info.label}</div>
              <div className="stat-select-gain">+{gain}</div>
              <div className="stat-select-desc">{info.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="stat-select-count">
        {selected.length} / {maxPicks} selected
      </div>

      <button
        className="btn btn-primary"
        onClick={handleConfirm}
        disabled={selected.length !== maxPicks}
      >
        Confirm
      </button>
    </div>
  );
}
