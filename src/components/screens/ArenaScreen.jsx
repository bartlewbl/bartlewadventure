import { useState } from 'react';
import { ARENA_TIERS, getMinWager } from '../../engine/arena';

export default function ArenaScreen({
  player,
  arenaState,
  onStartDuel,
  onGauntletContinue,
  onGauntletCashout,
  onBack,
}) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [wager, setWager] = useState('');

  const minWager = getMinWager(player.level);

  const handleStartDuel = (tier) => {
    if (tier.id === 'highstakes') {
      // High stakes: bet all gold
      if (player.gold < minWager) return;
      onStartDuel(tier.id, player.gold);
      return;
    }

    const wagerAmount = parseInt(wager, 10);
    if (isNaN(wagerAmount) || wagerAmount < minWager || wagerAmount > player.gold) return;
    onStartDuel(tier.id, wagerAmount);
  };

  // Show gauntlet continue screen
  if (arenaState?.gauntletActive) {
    const currentWinnings = arenaState.gauntletWager;
    const wins = arenaState.gauntletWins;
    return (
      <div className="screen screen-arena">
        <div className="screen-header">The Gauntlet</div>
        <div className="arena-gauntlet-status">
          <div className="gauntlet-streak">Win Streak: {wins}</div>
          <div className="gauntlet-pot">Current Pot: {currentWinnings}g</div>
          <div className="gauntlet-info">
            Continue to double your pot, or cash out now!
          </div>
        </div>
        <div className="arena-gauntlet-actions">
          <button
            className="btn btn-primary"
            onClick={onGauntletContinue}
          >
            Fight Next Opponent (Pot: {currentWinnings * 2}g)
          </button>
          <button
            className="btn btn-secondary"
            onClick={onGauntletCashout}
          >
            Cash Out ({currentWinnings}g)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen-arena">
      <div className="screen-header">Arena</div>
      <div className="arena-info">
        Test your strength against rival fighters. Wager gold and prove your worth.
      </div>
      <div className="arena-gold-info">
        Your Gold: {player.gold}g · Min Wager: {minWager}g
      </div>

      <div className="arena-tier-list">
        {ARENA_TIERS.map(tier => {
          const locked = player.level < tier.levelReq;
          const isSelected = selectedTier?.id === tier.id;
          const isHighStakes = tier.id === 'highstakes';
          const cantAfford = player.gold < minWager;

          return (
            <div key={tier.id} className="arena-tier-entry">
              <button
                className={`arena-tier-item ${locked ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${isHighStakes ? 'highstakes' : ''}`}
                onClick={() => !locked && setSelectedTier(isSelected ? null : tier)}
                disabled={locked}
              >
                <div className="arena-tier-left">
                  <div className="arena-tier-name">{tier.name}</div>
                  <div className="arena-tier-desc">{tier.description}</div>
                  {locked && (
                    <div className="arena-tier-req">Lv.{tier.levelReq}+ required</div>
                  )}
                </div>
                <div className="arena-tier-level">
                  Lv.{tier.levelReq}+
                </div>
              </button>

              {isSelected && !locked && (
                <div className="arena-wager-panel">
                  {isHighStakes ? (
                    <div className="arena-highstakes-info">
                      <div className="highstakes-warning">
                        You must wager ALL your gold: {player.gold}g
                      </div>
                      <div className="highstakes-detail">
                        Opponents are significantly stronger. Win to receive 2.5x your wager!
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStartDuel(tier)}
                        disabled={cantAfford}
                      >
                        {cantAfford ? `Need ${minWager}g minimum` : `Wager ${player.gold}g — Enter the Pit`}
                      </button>
                    </div>
                  ) : (
                    <div className="arena-wager-form">
                      <div className="wager-input-row">
                        <label>Wager (min {minWager}g):</label>
                        <input
                          type="number"
                          className="wager-input"
                          value={wager}
                          onChange={e => setWager(e.target.value)}
                          min={minWager}
                          max={player.gold}
                          placeholder={String(minWager)}
                        />
                      </div>
                      <div className="wager-quick-btns">
                        <button className="btn btn-sm" onClick={() => setWager(String(minWager))}>Min</button>
                        <button className="btn btn-sm" onClick={() => setWager(String(Math.floor(player.gold / 2)))}>Half</button>
                        <button className="btn btn-sm" onClick={() => setWager(String(player.gold))}>All</button>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleStartDuel(tier)}
                        disabled={cantAfford || !wager || parseInt(wager, 10) < minWager || parseInt(wager, 10) > player.gold}
                      >
                        {tier.id === 'gauntlet' ? 'Enter the Gauntlet' : 'Fight!'}
                        {wager && parseInt(wager, 10) >= minWager
                          ? ` — Win ${parseInt(wager, 10) * 2}g`
                          : ''}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
