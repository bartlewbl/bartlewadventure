import { BOUNTIES } from '../../data/goldSinks';

export default function BountyScreen({ player, activeBounties, completedBounties, stats, onAcceptBounty, onClaimBounty, onBack }) {
  const ab = activeBounties || [];
  const cb = completedBounties || [];

  return (
    <div className="screen screen-bounty">
      <div className="screen-header">
        <div className="screen-title">Bounty Board</div>
        <div className="screen-subtitle">Pay a fee to take on bounties for big rewards</div>
      </div>

      <div className="bounty-gold">Your Gold: {player.gold}g</div>

      <div className="bounty-list">
        {BOUNTIES.map(bounty => {
          const active = ab.find(b => b.bountyId === bounty.id);
          const completed = cb.includes(bounty.id);
          const levelLocked = player.level < bounty.minLevel;
          const canAfford = player.gold >= bounty.fee;

          let progress = 0;
          let canClaim = false;
          if (active) {
            progress = (stats.monstersKilled || 0) - active.baseline;
            canClaim = progress >= bounty.killTarget;
          }

          return (
            <div key={bounty.id} className={`bounty-card ${completed ? 'completed' : ''} ${levelLocked ? 'locked' : ''} ${canClaim ? 'ready' : ''}`}>
              <div className="bounty-card-header">
                <div className="bounty-name">{bounty.name}</div>
                <div className="bounty-badges">
                  {completed && <span className="bounty-badge done">Completed</span>}
                  {canClaim && <span className="bounty-badge claim">Ready!</span>}
                  {active && !canClaim && <span className="bounty-badge active">Active</span>}
                  {levelLocked && <span className="bounty-badge locked">Lv{bounty.minLevel}+</span>}
                </div>
              </div>
              <div className="bounty-desc">{bounty.desc}</div>
              <div className="bounty-details">
                <span className="bounty-detail">Fee: {bounty.fee}g</span>
                <span className="bounty-detail">Kill: {bounty.killTarget} monsters</span>
                <span className="bounty-detail bounty-reward">Reward: {bounty.goldReward}g + {bounty.expReward} XP</span>
              </div>

              {active && !canClaim && (
                <div className="bounty-progress">
                  <div className="bounty-progress-track">
                    <div className="bounty-progress-fill" style={{ width: `${Math.min(100, (progress / bounty.killTarget) * 100)}%` }} />
                  </div>
                  <span className="bounty-progress-text">{Math.min(progress, bounty.killTarget)} / {bounty.killTarget}</span>
                </div>
              )}

              {!completed && !active && !levelLocked && (
                <button
                  className="btn btn-primary bounty-accept-btn"
                  disabled={!canAfford}
                  onClick={() => onAcceptBounty(bounty.id)}
                >
                  {canAfford ? `Accept (${bounty.fee}g)` : `Need ${bounty.fee}g`}
                </button>
              )}

              {canClaim && (
                <button
                  className="btn btn-primary bounty-claim-btn"
                  onClick={() => onClaimBounty(bounty.id)}
                >
                  Claim Reward
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
