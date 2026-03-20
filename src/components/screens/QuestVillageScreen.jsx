import { QUEST_VILLAGES } from '../../data/gameData';

export default function QuestVillageScreen({ village, villageQuests, stats, player, onAcceptQuest, onTurnInQuest, onTraderBuy, onLeave }) {
  if (!village) return null;

  const accepted = villageQuests?.acceptedQuests || [];
  const completed = villageQuests?.completedQuests || [];
  const discovered = villageQuests?.discoveredVillages || [];
  const isNewDiscovery = discovered.filter(id => id === village.id).length <= 1
    && !accepted.some(q => village.quests.some(vq => vq.id === q.questId));

  const traders = village.traders || (village.trader ? [village.trader] : []);

  return (
    <div className="screen screen-quest-village">
      <div className="village-header">
        <div className="village-name">{village.name}</div>
        {isNewDiscovery && <div className="village-discovery-badge">New Discovery!</div>}
      </div>
      <div className="village-description">{village.description}</div>

      <div className="village-quests-title">Available Quests</div>
      <div className="village-quest-list">
        {village.quests.map(quest => {
          const isCompleted = completed.includes(quest.id);
          const acceptedEntry = accepted.find(q => q.questId === quest.id);
          const isAccepted = !!acceptedEntry;

          let progress = 0;
          let canTurnIn = false;
          const hasItemReqs = quest.itemRequirements && quest.itemRequirements.length > 0;
          // Check which required items the player has
          const itemReqStatus = hasItemReqs
            ? quest.itemRequirements.map(req => ({
                ...req,
                fulfilled: player.inventory.some(item => item.name === req.itemName && item.foundLocation === req.locationId),
              }))
            : [];
          const allItemsFulfilled = !hasItemReqs || itemReqStatus.every(r => r.fulfilled);
          if (isAccepted) {
            progress = (stats[quest.stat] || 0) - acceptedEntry.baseline;
            const statMet = quest.target <= 0 || progress >= quest.target;
            canTurnIn = statMet && allItemsFulfilled;
          }

          return (
            <div key={quest.id} className={`village-quest ${isCompleted ? 'completed' : ''} ${canTurnIn ? 'ready' : ''}`}>
              <div className="village-quest-header">
                <div className="village-quest-name">{quest.name}</div>
                {isCompleted && <span className="village-quest-badge done">Done</span>}
                {canTurnIn && <span className="village-quest-badge turn-in">Ready!</span>}
                {isAccepted && !canTurnIn && <span className="village-quest-badge active">Active</span>}
              </div>
              <div className="village-quest-desc">{quest.description}</div>

              {isAccepted && !isCompleted && quest.target > 0 && (
                <div className="village-quest-progress">
                  <div className="village-quest-bar-track">
                    <div
                      className="village-quest-bar-fill"
                      style={{ width: `${Math.min(100, (progress / quest.target) * 100)}%` }}
                    />
                  </div>
                  <div className="village-quest-count">
                    {Math.min(progress, quest.target)}/{quest.target}
                  </div>
                </div>
              )}

              {hasItemReqs && (
                <div className="village-quest-items">
                  <div className="village-quest-items-title">Required Items:</div>
                  {itemReqStatus.map((req, i) => (
                    <div key={i} className={`village-quest-item-req ${req.fulfilled ? 'fulfilled' : 'missing'}`}>
                      <span className="village-quest-item-check">{req.fulfilled ? '[x]' : '[ ]'}</span>
                      <span className="village-quest-item-name">{req.itemName}</span>
                      <span className="village-quest-item-loc">from {req.locationName}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="village-quest-reward">
                Reward: {quest.reward.gold}g + {quest.reward.item} gear
              </div>

              {!isAccepted && !isCompleted && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onAcceptQuest(quest.id, village.id)}
                >
                  Accept Quest
                </button>
              )}
              {isAccepted && canTurnIn && (
                <button
                  className="btn btn-primary btn-sm village-btn-turn-in"
                  onClick={() => onTurnInQuest(quest.id, village.id)}
                >
                  Turn In Quest
                </button>
              )}
            </div>
          );
        })}
      </div>

      {traders.length > 0 && (
        <div className="village-traders-section">
          <div className="village-trader-title">Village Traders</div>
          {traders.map((trader, idx) => (
            <div key={idx} className="village-trader-section">
              <div className="village-trader-name">{trader.name}</div>
              <div className="village-trader-greeting">{trader.greeting}</div>
              <div className="village-trader-deals">
                {trader.deals.map(deal => {
                  const canAfford = player.gold >= deal.cost;
                  return (
                    <div key={deal.id} className={`village-trader-deal ${!canAfford ? 'too-expensive' : ''}`}>
                      <div className="village-trader-deal-info">
                        <div className="village-trader-deal-desc">{deal.description}</div>
                        <div className="village-trader-deal-cost">
                          {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onTraderBuy(deal.id)}
                        disabled={!canAfford}
                      >
                        {canAfford ? 'Buy' : "Can't afford"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="village-trader-gold">Your gold: {player.gold}g</div>
        </div>
      )}

      <button className="btn btn-back" onClick={onLeave}>Leave Village</button>
    </div>
  );
}
