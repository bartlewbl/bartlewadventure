import { useState } from 'react';
import { getRespecCost } from '../../data/goldSinks';

const STAT_LABELS = {
  maxHp: 'HP', maxMana: 'Mana', baseAtk: 'ATK', baseDef: 'DEF',
  charisma: 'CHA', wisdom: 'WIS', athletics: 'ATH', speed: 'SPD',
  evasion: 'EVA', accuracy: 'ACC', resistance: 'RES', tenacity: 'TEN',
  aggression: 'AGR', luck: 'LCK', fortitude: 'GRT',
};

export default function RespecScreen({ player, baseStats, onRespec, onBack }) {
  const [confirm, setConfirm] = useState(false);
  const cost = getRespecCost(player.level);
  const canAfford = player.gold >= cost;

  const statKeys = Object.keys(STAT_LABELS);
  const hasChanges = statKeys.some(k => (player[k] || 0) !== (baseStats[k] || 0));

  return (
    <div className="screen screen-respec">
      <div className="screen-header">
        <div className="screen-title">Stat Respec</div>
        <div className="screen-subtitle">Reset your stats to class defaults and re-level</div>
      </div>

      <div className="respec-cost-panel">
        <div className="respec-cost-label">Respec Cost</div>
        <div className={`respec-cost-value ${canAfford ? '' : 'cant-afford'}`}>{cost}g</div>
        <div className="respec-cost-note">Cost scales with level ({player.level})</div>
      </div>

      <div className="respec-stats-comparison">
        <div className="respec-stats-header">
          <span className="respec-col-stat">Stat</span>
          <span className="respec-col-current">Current</span>
          <span className="respec-col-after">After Respec</span>
        </div>
        {statKeys.map(key => {
          const current = player[key] || 0;
          const base = baseStats[key] || 0;
          const diff = current - base;
          return (
            <div key={key} className={`respec-stat-row ${diff !== 0 ? 'changed' : ''}`}>
              <span className="respec-col-stat">{STAT_LABELS[key]}</span>
              <span className="respec-col-current">{current}</span>
              <span className="respec-col-after">
                {base}
                {diff > 0 && <span className="respec-diff negative"> (-{diff})</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="respec-info">
        <p>Resetting your stats will return them to your class base values.</p>
        <p>You will receive {player.level - 1} pending level-up{player.level > 2 ? 's' : ''} to redistribute your stat points.</p>
        <p>Your skills, equipment, and inventory are unaffected.</p>
      </div>

      {!hasChanges && (
        <div className="respec-no-changes">Your stats are already at base values.</div>
      )}

      {!confirm ? (
        <button
          className="btn btn-primary respec-btn"
          disabled={!canAfford || !hasChanges}
          onClick={() => setConfirm(true)}
        >
          {!canAfford ? `Need ${cost}g` : 'Respec Stats'}
        </button>
      ) : (
        <div className="respec-confirm">
          <div className="respec-confirm-text">Are you sure? This will cost {cost}g and reset all stats.</div>
          <div className="respec-confirm-buttons">
            <button className="btn btn-danger" onClick={() => { onRespec(); setConfirm(false); }}>
              Confirm Respec
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
