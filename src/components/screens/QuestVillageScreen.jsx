import { useState, useEffect, useRef } from 'react';

export default function QuestVillageScreen({ village, villageQuests, stats, player, villagePurchases, onAcceptQuest, onTurnInQuest, onTraderBuy, onLeave }) {
  if (!village) return null;

  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('quests');
  const [buyFlash, setBuyFlash] = useState(null);
  const [talkingToTrader, setTalkingToTrader] = useState(null); // index of trader being talked to
  const [traderDialogueHistory, setTraderDialogueHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [traderDialogueHistory, isTyping]);

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

  const startTalkingTo = (idx) => {
    const trader = traders[idx];
    setTalkingToTrader(idx);
    setTraderDialogueHistory([{ type: 'trader', text: trader.greeting }]);
  };

  const stopTalking = () => {
    setTalkingToTrader(null);
    setTraderDialogueHistory([]);
    setIsTyping(false);
  };

  // Generate contextual dialogue options for village traders based on their deals
  const getVillageTraderDialogue = (trader) => {
    const options = [
      { text: "What do you sell?", response: `I've got ${trader.deals.length} items available. Take a look at my wares below!`, action: 'show-deals' },
      { text: "Tell me about yourself.", response: trader.greeting },
    ];
    // Check if they have healing deals
    if (trader.deals.some(d => d.type === 'full_heal' || d.type === 'full_mana' || d.type === 'full_heal_mana')) {
      options.push({ text: "I need healing.", response: "Of course! I have restoration items available. Check my wares — I'll fix you right up." });
    }
    // Check for eggs
    if (trader.deals.some(d => d.type === 'egg')) {
      options.push({ text: "Got any eggs?", response: "Indeed I do! A fine specimen — treat it well and it'll hatch into a loyal companion." });
    }
    // Check for materials
    if (trader.deals.some(d => d.type === 'material')) {
      options.push({ text: "I need crafting materials.", response: "You've come to the right place. I've got quality supplies — take a look at what's available." });
    }
    options.push({ text: "Thanks, goodbye.", response: "Safe travels! Come back anytime.", action: 'close' });
    return options;
  };

  const handleVillageTraderDialogue = (option) => {
    const newHistory = [...traderDialogueHistory, { type: 'player', text: option.text }];
    setTraderDialogueHistory(newHistory);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setTraderDialogueHistory(prev => [...prev, { type: 'trader', text: option.response }]);
      if (option.action === 'close') {
        setTimeout(() => stopTalking(), 800);
      }
    }, 400 + Math.random() * 300);
  };

  const currentTrader = talkingToTrader !== null ? traders[talkingToTrader] : null;

  return (
    <div className={`screen screen-quest-village ${entered ? 'village-entered' : ''}`}>
      {/* Village header */}
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
          <button className={`village-tab ${activeTab === 'quests' ? 'active' : ''}`} onClick={() => { setActiveTab('quests'); stopTalking(); }}>
            <span className="village-tab-icon">&#9876;</span> Quests ({village.quests.length})
          </button>
          <button className={`village-tab ${activeTab === 'traders' ? 'active' : ''}`} onClick={() => { setActiveTab('traders'); stopTalking(); }}>
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
                <div key={quest.id} className={`village-quest ${isCompleted ? 'completed' : ''} ${canTurnIn ? 'ready' : ''}`} style={{ animationDelay: `${idx * 0.08}s` }}>
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
                        <div className="village-quest-bar-fill" style={{ width: `${progressPct}%` }} />
                        <div className="village-quest-bar-label">{Math.min(progress, quest.target)}/{quest.target}</div>
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
                      <button className="btn btn-primary btn-sm village-accept-btn" onClick={() => onAcceptQuest(quest.id, village.id)}>Accept</button>
                    )}
                    {isAccepted && canTurnIn && (
                      <button className="btn btn-primary btn-sm village-btn-turn-in" onClick={() => onTurnInQuest(quest.id, village.id)}>Turn In</button>
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
          {talkingToTrader !== null && currentTrader ? (
            /* Dialogue mode for a village trader */
            <div className="village-trader-dialogue-view">
              <div className="village-trader-dialogue-header">
                <div className="village-trader-portrait"><div className="village-trader-portrait-inner" /></div>
                <div className="village-trader-dialogue-name">{currentTrader.name}</div>
                <button className="village-trader-close-btn" onClick={stopTalking}>&times;</button>
              </div>
              <div className="trader-chat-log village-trader-chat-log">
                {traderDialogueHistory.map((entry, i) => (
                  <div key={i} className={`trader-chat-bubble ${entry.type}`}>
                    {entry.type === 'trader' && <span className="chat-speaker" style={{ color: '#bb86fc' }}>{currentTrader.name.split(' ')[0]}:</span>}
                    {entry.type === 'player' && <span className="chat-speaker chat-speaker-you">You:</span>}
                    <span className="chat-text">{entry.text}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="trader-chat-bubble trader typing">
                    <span className="chat-speaker" style={{ color: '#bb86fc' }}>{currentTrader.name.split(' ')[0]}:</span>
                    <span className="chat-typing-dots"><span>.</span><span>.</span><span>.</span></span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {!isTyping && (
                <div className="trader-dialogue-options">
                  {getVillageTraderDialogue(currentTrader)
                    .filter(opt => !traderDialogueHistory.some(d => d.type === 'player' && d.text === opt.text))
                    .map((opt, i) => (
                      <button key={i} className="trader-dialogue-btn" onClick={() => handleVillageTraderDialogue(opt)}>
                        {opt.text}
                      </button>
                    ))
                  }
                </div>
              )}
              {/* Deals inline below dialogue */}
              <div className="village-trader-inline-deals">
                <div className="village-trader-deals">
                  {currentTrader.deals.map(deal => {
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
                            {deal.stock != null && <span className="village-trader-deal-stock">{soldOut ? ' — Sold out' : ` (${remaining} left)`}</span>}
                          </div>
                          <div className="village-trader-deal-cost">
                            <span className="trader-gold-icon">&#9679;</span>
                            {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                          </div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleTraderBuy(deal.id)} disabled={!canAfford || soldOut}>
                          {soldOut ? 'Sold out' : justBought ? 'Sold!' : canAfford ? 'Buy' : "Can't afford"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Trader list - click to talk */
            traders.map((trader, idx) => (
              <div key={idx} className="village-trader-card" style={{ animationDelay: `${idx * 0.12}s` }}>
                <div className="village-trader-header">
                  <div className="village-trader-portrait"><div className="village-trader-portrait-inner" /></div>
                  <div className="village-trader-info">
                    <div className="village-trader-name">{trader.name}</div>
                    <div className="village-trader-greeting">"{trader.greeting.length > 80 ? trader.greeting.slice(0, 80) + '...' : trader.greeting}"</div>
                  </div>
                </div>
                <div className="village-trader-card-actions">
                  <button className="btn btn-primary btn-sm village-trader-talk-btn" onClick={() => startTalkingTo(idx)}>
                    Talk
                  </button>
                </div>
              </div>
            ))
          )}
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
