import { MERCENARIES } from '../../data/goldSinks';

export default function MercenaryScreen({ player, activeMercenary, onHire, onBack }) {
  const merc = activeMercenary;

  return (
    <div className="screen screen-mercenary">
      <div className="screen-header">
        <div className="screen-title">Mercenary Guild</div>
        <div className="screen-subtitle">Hire fighters to aid you in battle</div>
      </div>

      <div className="merc-gold">Your Gold: {player.gold}g</div>

      {/* Active mercenary display */}
      {merc && (
        <div className="merc-active-panel">
          <div className="merc-active-title">Active Mercenary</div>
          <div className={`merc-active-card rarity-${(merc.rarity || 'common').toLowerCase()}`}>
            <div className="merc-active-name">{merc.name}</div>
            <div className="merc-active-stats">
              {merc.atkBonus > 0 && <span className="merc-stat">ATK+{merc.atkBonus}</span>}
              {merc.defBonus > 0 && <span className="merc-stat">DEF+{merc.defBonus}</span>}
            </div>
            <div className="merc-active-remaining">
              {merc.battlesRemaining} battle{merc.battlesRemaining !== 1 ? 's' : ''} remaining
            </div>
          </div>
        </div>
      )}

      <div className="merc-list">
        {MERCENARIES.map(m => {
          const levelLocked = player.level < m.minLevel;
          const canAfford = player.gold >= m.cost;
          const isActive = merc?.mercId === m.id;

          return (
            <div key={m.id} className={`merc-card ${levelLocked ? 'locked' : ''} rarity-${(m.rarity || 'common').toLowerCase()}`}>
              <div className="merc-card-header">
                <div className="merc-name">{m.name}</div>
                <span className={`merc-rarity rarity-text-${m.rarity.toLowerCase()}`}>{m.rarity}</span>
              </div>
              <div className="merc-desc">{m.desc}</div>
              <div className="merc-details">
                {m.atkBonus > 0 && <span className="merc-detail">ATK+{m.atkBonus}</span>}
                {m.defBonus > 0 && <span className="merc-detail">DEF+{m.defBonus}</span>}
                <span className="merc-detail">{m.duration} battles</span>
              </div>
              <div className="merc-cost">{m.cost}g</div>

              {levelLocked && <div className="merc-locked-text">Requires Level {m.minLevel}</div>}

              {!levelLocked && !isActive && (
                <button
                  className="btn btn-primary merc-hire-btn"
                  disabled={!canAfford || !!merc}
                  onClick={() => onHire(m.id)}
                >
                  {merc ? 'Already hired' : canAfford ? `Hire (${m.cost}g)` : `Need ${m.cost}g`}
                </button>
              )}

              {isActive && <span className="merc-badge active">Active</span>}
            </div>
          );
        })}
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
