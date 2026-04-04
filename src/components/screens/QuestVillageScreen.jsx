import { useState, useEffect } from 'react';

export default function QuestVillageScreen({ village, villageQuests, stats, player, villagePurchases, onAcceptQuest, onTurnInQuest, onTraderBuy, onLeave }) {
  if (!village) return null;

  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('quests');
  const [buyFlash, setBuyFlash] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const accepted = villageQuests?.acceptedQuests || [];
  const completed = villageQuests?.completedQuests || [];
  const discovered = villageQuests?.discoveredVillages || [];
  const isNewDiscovery = discovered.filter(id => id === village.id).length <= 1
    && !accepted.some(q => village.quests.some(vq => vq.id === q.questId));

  const traders = village.traders || (village.trader ? [village.trader] : []);
  const completedCount = village.quests.filter(q => completed.includes(q.id)).length;

  const handleTraderBuy = (dealId) => {
    setBuyFlash(dealId);
    onTraderBuy(dealId);
    setTimeout(() => setBuyFlash(null), 500);
  };

  return (
    <div className={`screen screen-quest-village ${entered ? 'village-entered' : ''}`}>
      {/* Village header with ambient particles */}
      <div className="village-header-section">
        {isNewDiscovery && (
          <div className="village-discovery-banner">
            <span className="village-discovery-star">&#9733;</span>
            New Village Discovered!
            <span className="village-discovery-star">&#9733;</span>
          </div>
        )}
        <div className="village-name-plate">
          <div className="village-name">{village.name}</div>
          <div className="village-progress-tag">
            {completedCount}/{village.quests.length} quests complete
          </div>
        </div>
        <div className="village-description">{village.description}</div>
      </div>

      {/* Tab navigation */}
      {traders.length > 0 && (
        <div className="village-tabs">
          <button
            className={`village-tab ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            <span className="village-tab-icon">&#9876;</span> Quests ({village.quests.length})
          </button>
          <button
            className={`village-tab ${activeTab === 'traders' ? 'active' : ''}`}
            onClick={() => setActiveTab('traders')}
          >
            <span className="village-tab-icon">&#9830;</span> Traders ({traders.length})
          </button>
        </div>
      )}

      {/* Quests panel */}
      {activeTab === 'quests' && (
        <div className="village-quests-panel">
          <div className="village-quest-list">
            {village.quests.map((quest, idx) => {
              const isCompleted = completed.includes(quest.id);
              const acceptedEntry = accepted.find(q => q.questId === quest.id);
              const isAccepted = !!acceptedEntry;

              let progress = 0;
              let canTurnIn = false;
              const hasItemReqs = quest.itemRequirements && quest.itemRequirements.length > 0;
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

              const progressPct = quest.target > 0 ? Math.min(100, (progress / quest.target) * 100) : 0;

              return (
                <div
                  key={quest.id}
                  className={`village-quest ${isCompleted ? 'completed' : ''} ${canTurnIn ? 'ready' : ''}`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="village-quest-header">
                    <div className="village-quest-name-row">
                      <span className="village-quest-icon">
                        {isCompleted ? '\u2714' : canTurnIn ? '!' : isAccepted ? '\u25B6' : '\u25CB'}
                      </span>
                      <div className="village-quest-name">{quest.name}</div>
                    </div>
                    {isCompleted && <span className="village-quest-badge done">Complete</span>}
                    {canTurnIn && <span className="village-quest-badge turn-in">Turn In!</span>}
                    {isAccepted && !canTurnIn && !isCompleted && <span className="village-quest-badge active">Active</span>}
                  </div>

                  <div className="village-quest-desc">{quest.description}</div>

                  {isAccepted && !isCompleted && quest.target > 0 && (
                    <div className="village-quest-progress">
                      <div className="village-quest-bar-track">
                        <div
                          className="village-quest-bar-fill"
                          style={{ width: `${progressPct}%` }}
                        />
                        <div className="village-quest-bar-label">
                          {Math.min(progress, quest.target)}/{quest.target}
                        </div>
                      </div>
                    </div>
                  )}

                  {hasItemReqs && (
                    <div className="village-quest-items">
                      <div className="village-quest-items-title">Required Items:</div>
                      {itemReqStatus.map((req, i) => (
                        <div key={i} className={`village-quest-item-req ${req.fulfilled ? 'fulfilled' : 'missing'}`}>
                          <span className="village-quest-item-check">{req.fulfilled ? '\u2714' : '\u2716'}</span>
                          <span className="village-quest-item-name">{req.itemName}</span>
                          <span className="village-quest-item-loc">from {req.locationName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="village-quest-footer">
                    <div className="village-quest-reward">
                      <span className="village-reward-gold">&#9679; {quest.reward.gold}g</span>
                      <span className="village-reward-item">+ {quest.reward.item} gear</span>
                    </div>

                    {!isAccepted && !isCompleted && (
                      <button
                        className="btn btn-primary btn-sm village-accept-btn"
                        onClick={() => onAcceptQuest(quest.id, village.id)}
                      >
                        Accept
                      </button>
                    )}
                    {isAccepted && canTurnIn && (
                      <button
                        className="btn btn-primary btn-sm village-btn-turn-in"
                        onClick={() => onTurnInQuest(quest.id, village.id)}
                      >
                        Turn In
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Traders panel */}
      {activeTab === 'traders' && traders.length > 0 && (
        <div className="village-traders-panel">
          {traders.map((trader, idx) => (
            <div key={idx} className="village-trader-card" style={{ animationDelay: `${idx * 0.12}s` }}>
              <div className="village-trader-header">
                <div className="village-trader-portrait">
                  <div className="village-trader-portrait-inner" />
                </div>
                <div className="village-trader-info">
                  <div className="village-trader-name">{trader.name}</div>
                  <div className="village-trader-greeting">"{trader.greeting}"</div>
                </div>
              </div>
              <div className="village-trader-deals">
                {trader.deals.map(deal => {
                  const canAfford = player.gold >= deal.cost;
                  const purchased = (villagePurchases || {})[deal.id] || 0;
                  const soldOut = deal.stock != null && purchased >= deal.stock;
                  const remaining = deal.stock != null ? deal.stock - purchased : null;
                  const justBought = buyFlash === deal.id;
                  return (
                    <div key={deal.id} className={`village-trader-deal ${!canAfford ? 'too-expensive' : ''} ${soldOut ? 'sold-out' : ''} ${justBought ? 'deal-purchased' : ''}`}>
                      <div className="village-trader-deal-info">
                        <div className="village-trader-deal-desc">
                          {deal.description}
                          {deal.stock != null && (
                            <span className="village-trader-deal-stock">
                              {soldOut ? ' — Sold out' : ` (${remaining} left)`}
                            </span>
                          )}
                        </div>
                        <div className="village-trader-deal-cost">
                          <span className="trader-gold-icon">&#9679;</span>
                          {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTraderBuy(deal.id)}
                        disabled={!canAfford || soldOut}
                      >
                        {soldOut ? 'Sold out' : justBought ? 'Sold!' : canAfford ? 'Buy' : "Can't afford"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="village-footer">
        <div className="village-trader-gold">
          <span className="trader-gold-icon">&#9679;</span> {player.gold}g
        </div>
        <button className="btn btn-back" onClick={onLeave}>Leave Village</button>
      </div>
    </div>
  );
}
