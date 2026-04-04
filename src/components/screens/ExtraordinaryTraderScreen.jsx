import { useState, useEffect, useRef } from 'react';

export default function ExtraordinaryTraderScreen({ trader, playerGold, villageQuests, stats, onBuy, onLeave, onAcceptQuest, onTurnInQuest }) {
  const [entered, setEntered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [purchasedId, setPurchasedId] = useState(null);
  const [view, setView] = useState('dialogue'); // 'dialogue' | 'shop' | 'profile'
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory, isTyping]);

  // Sparkle particles
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => {
        const now = Date.now();
        const filtered = prev.filter(s => now - s.born < 1800);
        if (filtered.length < 5) {
          filtered.push({
            id: now + Math.random(),
            born: now,
            x: 30 + Math.random() * 40,
            y: 10 + Math.random() * 30,
            char: ['*', '+', '.'][Math.floor(Math.random() * 3)],
          });
        }
        return filtered;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Add greeting on mount
  useEffect(() => {
    if (trader) {
      setDialogueHistory([{ type: 'trader', text: trader.greeting }]);
    }
  }, [trader?.id]);

  if (!trader) return null;

  const handleDialogueChoice = (option) => {
    const newHistory = [
      ...dialogueHistory,
      { type: 'player', text: option.text },
    ];
    setDialogueHistory(newHistory);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const entries = [{ type: 'trader', text: option.response }];

      // If the dialogue leads to a quest, show the quest offer
      if (option.quest) {
        const questDef = trader.quests?.find(q => q.id === option.quest);
        if (questDef) {
          const accepted = (villageQuests?.acceptedQuests || []);
          const completed = (villageQuests?.completedQuests || []);
          const isAccepted = accepted.some(q => q.questId === questDef.id);
          const isCompleted = completed.includes(questDef.id);

          if (isCompleted) {
            entries.push({ type: 'trader', text: "You've already done this for me. I won't forget it." });
          } else if (isAccepted) {
            // Check if ready to turn in
            const acceptedEntry = accepted.find(q => q.questId === questDef.id);
            const progress = (stats[questDef.stat] || 0) - acceptedEntry.baseline;
            if (progress >= questDef.target) {
              entries.push({ type: 'quest-complete', quest: questDef, traderId: trader.id });
            } else {
              entries.push({ type: 'trader', text: `You're working on it — ${Math.min(progress, questDef.target)}/${questDef.target}. Keep going.` });
            }
          } else {
            entries.push({ type: 'quest-offer', quest: questDef, traderId: trader.id });
          }
        }
      }

      setDialogueHistory(prev => [...prev, ...entries]);
    }, 600 + Math.random() * 400);
  };

  const handleBuy = (dealId) => {
    setPurchasedId(dealId);
    onBuy(dealId);
    setTimeout(() => setPurchasedId(null), 600);
  };

  const handleAcceptQuest = (questId, traderId) => {
    onAcceptQuest(questId, traderId);
    const questDef = trader.quests?.find(q => q.id === questId);
    setDialogueHistory(prev => [
      ...prev,
      { type: 'system', text: `Quest accepted: ${questDef?.name}` },
      { type: 'trader', text: questDef?.giverLine || "Good. Don't disappoint me." },
    ]);
  };

  const handleTurnInQuest = (questId, traderId) => {
    const questDef = trader.quests?.find(q => q.id === questId);
    onTurnInQuest(questId, traderId);
    setDialogueHistory(prev => [
      ...prev,
      { type: 'system', text: `Quest complete! +${questDef?.reward.gold}g` },
      { type: 'trader', text: questDef?.completeLine || "Well done. Here's your reward." },
    ]);
  };

  // Get available dialogue options (exclude ones with quests already in history for this conversation)
  const getAvailableDialogue = () => {
    if (!trader.dialogue) return [];
    const usedTexts = new Set(dialogueHistory.filter(d => d.type === 'player').map(d => d.text));
    return trader.dialogue.filter(d => !usedTexts.has(d.text));
  };

  const theme = getTraderTheme(trader);
  const availableDialogue = getAvailableDialogue();

  return (
    <div className={`screen screen-extraordinary-trader ${entered ? 'trader-entered' : ''}`}>
      {/* Sparkles */}
      <div className="trader-sparkle-container">
        {sparkles.map(s => (
          <span key={s.id} className="trader-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, color: theme.primary }}>{s.char}</span>
        ))}
      </div>

      {/* Trader identity bar */}
      <div className="trader-identity">
        <div className="trader-portrait-frame" style={{ borderColor: theme.primary, boxShadow: `0 0 16px ${theme.glow}` }}>
          <div className="trader-portrait-figure">
            <div className="trader-cloak" style={{ background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` }} />
            <div className="trader-eyes" />
          </div>
          <div className="trader-aura" style={{ background: `radial-gradient(ellipse, ${theme.glow}, transparent 70%)` }} />
        </div>
        <div className="trader-identity-text">
          <div className="trader-name" style={{ color: theme.primary, textShadow: `0 0 10px ${theme.glow}` }}>
            {trader.name}
          </div>
          <div className="trader-title-tag">{trader.title || 'Travelling Merchant'}</div>
        </div>
      </div>

      {/* View tabs */}
      <div className="trader-view-tabs">
        <button className={`trader-view-tab ${view === 'dialogue' ? 'active' : ''}`} onClick={() => setView('dialogue')} style={view === 'dialogue' ? { borderColor: theme.primary, color: theme.primary } : undefined}>
          Talk
        </button>
        <button className={`trader-view-tab ${view === 'shop' ? 'active' : ''}`} onClick={() => setView('shop')} style={view === 'shop' ? { borderColor: theme.primary, color: theme.primary } : undefined}>
          Shop
        </button>
        <button className={`trader-view-tab ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')} style={view === 'profile' ? { borderColor: theme.primary, color: theme.primary } : undefined}>
          Profile
        </button>
      </div>

      {/* DIALOGUE VIEW */}
      {view === 'dialogue' && (
        <div className="trader-dialogue-view">
          <div className="trader-chat-log">
            {dialogueHistory.map((entry, i) => (
              <div key={i} className={`trader-chat-bubble ${entry.type}`} style={entry.type === 'trader' ? { borderColor: `${theme.primary}44` } : undefined}>
                {entry.type === 'trader' && <span className="chat-speaker" style={{ color: theme.primary }}>{trader.name.split(' ')[0]}:</span>}
                {entry.type === 'player' && <span className="chat-speaker chat-speaker-you">You:</span>}
                {entry.type === 'system' && <span className="chat-speaker chat-speaker-system">!</span>}

                {(entry.type === 'trader' || entry.type === 'player' || entry.type === 'system') && (
                  <span className="chat-text">{entry.text}</span>
                )}

                {entry.type === 'quest-offer' && (
                  <div className="trader-quest-offer">
                    <div className="trader-quest-offer-header">Quest Offered</div>
                    <div className="trader-quest-offer-name">{entry.quest.name}</div>
                    <div className="trader-quest-offer-desc">{entry.quest.description}</div>
                    <div className="trader-quest-offer-reward">
                      Reward: <span className="trader-quest-gold">{entry.quest.reward.gold}g</span> + {entry.quest.reward.item} gear
                    </div>
                    {!(villageQuests?.acceptedQuests || []).some(q => q.questId === entry.quest.id) && !(villageQuests?.completedQuests || []).includes(entry.quest.id) && (
                      <button className="btn btn-primary btn-sm trader-accept-quest-btn" onClick={() => handleAcceptQuest(entry.quest.id, entry.traderId)}>
                        Accept Quest
                      </button>
                    )}
                  </div>
                )}

                {entry.type === 'quest-complete' && (
                  <div className="trader-quest-offer trader-quest-complete">
                    <div className="trader-quest-offer-header">Quest Ready!</div>
                    <div className="trader-quest-offer-name">{entry.quest.name}</div>
                    <div className="trader-quest-offer-reward">
                      Reward: <span className="trader-quest-gold">{entry.quest.reward.gold}g</span> + {entry.quest.reward.item} gear
                    </div>
                    {(villageQuests?.acceptedQuests || []).some(q => q.questId === entry.quest.id) && (
                      <button className="btn btn-primary btn-sm village-btn-turn-in" onClick={() => handleTurnInQuest(entry.quest.id, entry.traderId)}>
                        Turn In Quest
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="trader-chat-bubble trader typing">
                <span className="chat-speaker" style={{ color: theme.primary }}>{trader.name.split(' ')[0]}:</span>
                <span className="chat-typing-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Dialogue options */}
          {!isTyping && availableDialogue.length > 0 && (
            <div className="trader-dialogue-options">
              {availableDialogue.map((opt, i) => (
                <button key={i} className="trader-dialogue-btn" onClick={() => handleDialogueChoice(opt)} style={{ borderColor: `${theme.primary}33` }}>
                  {opt.text}
                </button>
              ))}
            </div>
          )}
          {!isTyping && availableDialogue.length === 0 && dialogueHistory.length > 1 && (
            <div className="trader-dialogue-exhausted">
              <span style={{ color: '#888' }}>No more dialogue options.</span>
              <button className="trader-dialogue-btn" onClick={() => setView('shop')} style={{ borderColor: `${theme.primary}33` }}>
                Browse wares
              </button>
            </div>
          )}
        </div>
      )}

      {/* SHOP VIEW */}
      {view === 'shop' && (
        <div className="trader-shop-view">
          <div className="trader-deals-title">
            <span className="trader-deals-icon">&#9830;</span> Available Wares <span className="trader-deals-icon">&#9830;</span>
          </div>
          <div className="trader-deal-list">
            {trader.deals.map((deal, idx) => {
              const canAfford = playerGold >= deal.cost;
              const justBought = purchasedId === deal.id;
              return (
                <div key={deal.id} className={`trader-deal ${!canAfford ? 'too-expensive' : ''} ${justBought ? 'deal-purchased' : ''}`} style={{ animationDelay: `${idx * 0.08}s`, borderColor: canAfford ? `${theme.primary}44` : undefined }}>
                  <div className="trader-deal-number" style={{ color: theme.primary }}>{idx + 1}</div>
                  <div className="trader-deal-info">
                    <div className="trader-deal-desc">{deal.description}</div>
                    <div className="trader-deal-cost">
                      <span className="trader-gold-icon">&#9679;</span>
                      {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm trader-buy-btn" onClick={() => handleBuy(deal.id)} disabled={!canAfford} style={canAfford ? { background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})` } : undefined}>
                    {justBought ? 'Sold!' : canAfford ? 'Buy' : "Can't afford"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROFILE VIEW */}
      {view === 'profile' && (
        <div className="trader-profile-view">
          <div className="trader-profile-card" style={{ borderColor: `${theme.primary}44` }}>
            <div className="trader-profile-portrait-lg" style={{ borderColor: theme.primary, boxShadow: `0 0 20px ${theme.glow}` }}>
              <div className="trader-portrait-figure trader-portrait-lg-figure">
                <div className="trader-cloak" style={{ background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` }} />
                <div className="trader-eyes" />
              </div>
            </div>
            <div className="trader-profile-name" style={{ color: theme.primary }}>{trader.name}</div>
            <div className="trader-profile-title">{trader.title || 'Travelling Merchant'}</div>
            <div className="trader-profile-divider" style={{ background: `linear-gradient(to right, transparent, ${theme.primary}44, transparent)` }} />
            <div className="trader-profile-section">
              <div className="trader-profile-label">Personality</div>
              <div className="trader-profile-value" style={{ color: theme.primary }}>{trader.personality ? trader.personality.charAt(0).toUpperCase() + trader.personality.slice(1) : 'Unknown'}</div>
            </div>
            <div className="trader-profile-section">
              <div className="trader-profile-label">Deals Available</div>
              <div className="trader-profile-value">{trader.deals.length} items</div>
            </div>
            {trader.quests && trader.quests.length > 0 && (
              <div className="trader-profile-section">
                <div className="trader-profile-label">Quests</div>
                {trader.quests.map(q => {
                  const isCompleted = (villageQuests?.completedQuests || []).includes(q.id);
                  const isAccepted = (villageQuests?.acceptedQuests || []).some(a => a.questId === q.id);
                  return (
                    <div key={q.id} className="trader-profile-quest-row">
                      <span className="trader-profile-quest-status">
                        {isCompleted ? '\u2714' : isAccepted ? '\u25B6' : '\u25CB'}
                      </span>
                      <span className={`trader-profile-quest-name ${isCompleted ? 'done' : ''}`}>{q.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="trader-footer">
        <div className="trader-gold-display">
          <span className="trader-gold-icon">&#9679;</span> {playerGold}g
        </div>
        <button className="btn btn-back trader-leave-btn" onClick={onLeave}>Leave</button>
      </div>
    </div>
  );
}

function getTraderTheme(trader) {
  const name = trader.name.toLowerCase();
  if (name.includes('shadow') || name.includes('nyx')) return { primary: '#9040e0', secondary: '#6a20b0', glow: 'rgba(144, 64, 224, 0.4)' };
  if (name.includes('smith') || name.includes('grizzle')) return { primary: '#ff8c00', secondary: '#cc6600', glow: 'rgba(255, 140, 0, 0.4)' };
  if (name.includes('witch') || name.includes('luna') || name.includes('energy')) return { primary: '#4fc3f7', secondary: '#0288d1', glow: 'rgba(79, 195, 247, 0.4)' };
  if (name.includes('bone') || name.includes('collector')) return { primary: '#b0bec5', secondary: '#78909c', glow: 'rgba(176, 190, 197, 0.4)' };
  if (name.includes('flora') || name.includes('egg')) return { primary: '#66bb6a', secondary: '#388e3c', glow: 'rgba(102, 187, 106, 0.4)' };
  if (name.includes('krag') || name.includes('material')) return { primary: '#a1887f', secondary: '#795548', glow: 'rgba(161, 136, 127, 0.4)' };
  if (name.includes('void') || name.includes('whisper')) return { primary: '#7c4dff', secondary: '#651fff', glow: 'rgba(124, 77, 255, 0.4)' };
  if (name.includes('patch') || name.includes('scavenger')) return { primary: '#8d6e63', secondary: '#5d4037', glow: 'rgba(141, 110, 99, 0.4)' };
  if (name.includes('ember') || name.includes('fire')) return { primary: '#ff5722', secondary: '#d84315', glow: 'rgba(255, 87, 34, 0.4)' };
  if (name.includes('murk') || name.includes('captain') || name.includes('deep')) return { primary: '#26c6da', secondary: '#00838f', glow: 'rgba(38, 198, 218, 0.4)' };
  return { primary: '#ce93d8', secondary: '#9c27b0', glow: 'rgba(206, 147, 216, 0.4)' };
}
