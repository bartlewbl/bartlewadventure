import { useState, useEffect, useRef } from 'react';
import { SPRITES, drawSprite } from '../../data/sprites';

export default function TravellingNpcScreen({
  npc, playerGold, playerLevel, villageQuests, stats,
  travellingPurchases = {},
  onBuy, onLeave, onAcceptQuest, onTurnInQuest, onAttack,
}) {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState('dialogue'); // dialogue | shop | quests | profile
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [purchasedId, setPurchasedId] = useState(null);
  const [attackConfirm, setAttackConfirm] = useState(false);
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory, isTyping]);

  // Draw NPC sprite on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !npc) return;
    const ctx = canvas.getContext('2d');
    const spriteData = SPRITES.travellingNpcs?.[npc.spriteKey];
    if (!spriteData) return;
    const scale = 4;
    canvas.width = spriteData[0].length * scale;
    canvas.height = spriteData.length * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSprite(ctx, spriteData, 0, 0, scale);
  }, [npc]);

  // Add greeting on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (npc) {
      setDialogueHistory([{ type: 'npc', text: npc.greeting }]);
    }
  }, [npc]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!npc) return null;

  const theme = getNpcTheme(npc);
  const accepted = villageQuests?.acceptedQuests || [];
  const completed = villageQuests?.completedQuests || [];

  const handleDialogueChoice = (option) => {
    const newHistory = [
      ...dialogueHistory,
      { type: 'player', text: option.text },
    ];
    setDialogueHistory(newHistory);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const entries = [{ type: 'npc', text: option.response }];

      if (option.quest) {
        const questDef = npc.quests?.find(q => q.id === option.quest);
        if (questDef) {
          const isAccepted = accepted.some(q => q.questId === questDef.id);
          const isCompleted = completed.includes(questDef.id);

          if (isCompleted) {
            entries.push({ type: 'npc', text: "You've already completed this task. I won't forget what you did." });
          } else if (isAccepted) {
            const acceptedEntry = accepted.find(q => q.questId === questDef.id);
            const progress = (stats[questDef.stat] || 0) - acceptedEntry.baseline;
            if (progress >= questDef.target) {
              entries.push({ type: 'quest-complete', quest: questDef, npcId: npc.id });
            } else {
              entries.push({ type: 'npc', text: `Still working on it — ${Math.min(progress, questDef.target)}/${questDef.target}. Keep at it.` });
            }
          } else {
            entries.push({ type: 'quest-offer', quest: questDef, npcId: npc.id });
          }
        }
      }

      if (option.fight) {
        entries.push({ type: 'fight-option' });
      }

      setDialogueHistory(prev => [...prev, ...entries]);
    }, 800);
  };

  const handleBuy = (dealId) => {
    setPurchasedId(dealId);
    onBuy(dealId);
    setTimeout(() => setPurchasedId(null), 600);
  };

  const handleAcceptQuest = (questId, npcId) => {
    onAcceptQuest(questId, npcId);
    const questDef = npc.quests?.find(q => q.id === questId);
    setDialogueHistory(prev => [
      ...prev,
      { type: 'system', text: `Quest accepted: ${questDef?.name}` },
      { type: 'npc', text: questDef?.giverLine || "Good. Don't let me down." },
    ]);
  };

  const handleTurnInQuest = (questId, npcId) => {
    const questDef = npc.quests?.find(q => q.id === questId);
    onTurnInQuest(questId, npcId);
    setDialogueHistory(prev => [
      ...prev,
      { type: 'system', text: `Quest complete! +${questDef?.reward.gold}g` },
      { type: 'npc', text: questDef?.completeLine || "Well done. Here's your reward." },
    ]);
  };

  const handleAttack = () => {
    if (!attackConfirm) {
      setAttackConfirm(true);
      return;
    }
    onAttack(npc.id);
  };

  const getAvailableDialogue = () => {
    if (!npc.dialogue) return [];
    const usedTexts = new Set(dialogueHistory.filter(d => d.type === 'player').map(d => d.text));
    return npc.dialogue.filter(d => !usedTexts.has(d.text));
  };

  const availableDialogue = getAvailableDialogue();
  const canFight = npc.boss && playerLevel >= (npc.minLevel || 1);

  return (
    <div className={`screen screen-travelling-npc ${entered ? 'tnpc-entered' : ''}`}>
      {/* NPC Identity */}
      <div className="tnpc-identity">
        <div className="tnpc-portrait-frame" style={{ borderColor: theme.primary, boxShadow: `0 0 16px ${theme.glow}` }}>
          <canvas ref={canvasRef} className="tnpc-portrait-canvas" />
        </div>
        <div className="tnpc-identity-text">
          <div className="tnpc-name" style={{ color: theme.primary, textShadow: `0 0 10px ${theme.glow}` }}>
            {npc.name}
          </div>
          <div className="tnpc-title-tag">{npc.title}</div>
        </div>
      </div>

      {/* View tabs */}
      <div className="tnpc-view-tabs">
        {['dialogue', 'quests', 'shop', 'profile'].map(tab => (
          <button
            key={tab}
            className={`tnpc-view-tab ${view === tab ? 'active' : ''}`}
            onClick={() => setView(tab)}
            style={view === tab ? { borderColor: theme.primary, color: theme.primary } : undefined}
          >
            {tab === 'dialogue' ? 'Talk' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* DIALOGUE VIEW */}
      {view === 'dialogue' && (
        <div className="tnpc-dialogue-view">
          <div className="tnpc-chat-log">
            {dialogueHistory.map((entry, i) => (
              <div key={i} className={`tnpc-chat-bubble ${entry.type}`} style={entry.type === 'npc' ? { borderColor: `${theme.primary}44` } : undefined}>
                {entry.type === 'npc' && <span className="chat-speaker" style={{ color: theme.primary }}>{npc.name.split(' ')[0]}:</span>}
                {entry.type === 'player' && <span className="chat-speaker chat-speaker-you">You:</span>}
                {entry.type === 'system' && <span className="chat-speaker chat-speaker-system">!</span>}

                {(entry.type === 'npc' || entry.type === 'player' || entry.type === 'system') && (
                  <span className="chat-text">{entry.text}</span>
                )}

                {entry.type === 'quest-offer' && (
                  <div className="tnpc-quest-offer">
                    <div className="tnpc-quest-offer-header">Quest Offered</div>
                    <div className="tnpc-quest-offer-name">{entry.quest.name}</div>
                    <div className="tnpc-quest-offer-desc">{entry.quest.description}</div>
                    <div className="tnpc-quest-offer-reward">
                      Reward: <span className="tnpc-quest-gold">{entry.quest.reward.gold}g</span> + {entry.quest.reward.item} gear
                    </div>
                    {!accepted.some(q => q.questId === entry.quest.id) && !completed.includes(entry.quest.id) && (
                      <button className="btn btn-primary btn-sm tnpc-accept-quest-btn" onClick={() => handleAcceptQuest(entry.quest.id, entry.npcId)}>
                        Accept Quest
                      </button>
                    )}
                  </div>
                )}

                {entry.type === 'quest-complete' && (
                  <div className="tnpc-quest-offer tnpc-quest-complete">
                    <div className="tnpc-quest-offer-header">Quest Ready!</div>
                    <div className="tnpc-quest-offer-name">{entry.quest.name}</div>
                    <div className="tnpc-quest-offer-reward">
                      Reward: <span className="tnpc-quest-gold">{entry.quest.reward.gold}g</span> + {entry.quest.reward.item} gear
                    </div>
                    {accepted.some(q => q.questId === entry.quest.id) && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleTurnInQuest(entry.quest.id, entry.npcId)}>
                        Turn In Quest
                      </button>
                    )}
                  </div>
                )}

                {entry.type === 'fight-option' && canFight && (
                  <div className="tnpc-fight-option">
                    <div className="tnpc-fight-warning">This will start a boss battle!</div>
                    <div className="tnpc-fight-info">
                      {npc.boss.title} — a powerful opponent. You cannot flee once battle begins.
                    </div>
                    {!attackConfirm ? (
                      <button className="btn btn-danger btn-sm" onClick={handleAttack}>
                        Draw Weapon
                      </button>
                    ) : (
                      <div className="tnpc-fight-confirm">
                        <div className="tnpc-fight-confirm-text">Are you sure? This NPC will become hostile!</div>
                        <button className="btn btn-danger btn-sm" onClick={handleAttack}>
                          Confirm Attack
                        </button>
                        <button className="btn btn-back btn-sm" onClick={() => setAttackConfirm(false)} style={{ marginLeft: 8 }}>
                          Stand Down
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {entry.type === 'fight-option' && !canFight && (
                  <div className="tnpc-fight-option">
                    <div className="tnpc-fight-locked">
                      Requires level {npc.minLevel} to challenge this NPC.
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="tnpc-chat-bubble npc typing">
                <span className="chat-speaker" style={{ color: theme.primary }}>{npc.name.split(' ')[0]}:</span>
                <span className="chat-typing-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {!isTyping && availableDialogue.length > 0 && (
            <div className="tnpc-dialogue-options">
              {availableDialogue.map((opt, i) => (
                <button key={i} className="tnpc-dialogue-btn" onClick={() => handleDialogueChoice(opt)} style={{ borderColor: `${theme.primary}33` }}>
                  {opt.text}
                </button>
              ))}
            </div>
          )}
          {!isTyping && availableDialogue.length === 0 && dialogueHistory.length > 1 && (
            <div className="tnpc-dialogue-exhausted">
              <span style={{ color: '#888' }}>No more dialogue options.</span>
              <div className="tnpc-dialogue-exhausted-btns">
                <button className="tnpc-dialogue-btn" onClick={() => setView('quests')} style={{ borderColor: `${theme.primary}33` }}>
                  View Quests
                </button>
                <button className="tnpc-dialogue-btn" onClick={() => setView('shop')} style={{ borderColor: `${theme.primary}33` }}>
                  Browse Wares
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUESTS VIEW */}
      {view === 'quests' && (
        <div className="tnpc-quests-view">
          <div className="tnpc-section-title" style={{ color: theme.primary }}>Available Quests</div>
          {(!npc.quests || npc.quests.length === 0) && (
            <div className="tnpc-empty">No quests available.</div>
          )}
          {npc.quests?.map(quest => {
            const isAccepted = accepted.some(q => q.questId === quest.id);
            const isCompleted = completed.includes(quest.id);
            const acceptedEntry = accepted.find(q => q.questId === quest.id);
            const progress = isAccepted ? Math.min((stats[quest.stat] || 0) - acceptedEntry.baseline, quest.target) : 0;
            const canTurnIn = isAccepted && progress >= quest.target;

            return (
              <div key={quest.id} className={`tnpc-quest-card ${isCompleted ? 'completed' : ''}`} style={{ borderColor: `${theme.primary}44` }}>
                <div className="tnpc-quest-card-header">
                  <span className="tnpc-quest-card-status">
                    {isCompleted ? '\u2714' : isAccepted ? '\u25B6' : '\u25CB'}
                  </span>
                  <span className="tnpc-quest-card-name" style={{ color: isCompleted ? '#888' : theme.primary }}>
                    {quest.name}
                  </span>
                </div>
                <div className="tnpc-quest-card-desc">{quest.description}</div>
                <div className="tnpc-quest-card-reward">
                  Reward: <span className="tnpc-quest-gold">{quest.reward.gold}g</span> + {quest.reward.item} gear
                </div>

                {isAccepted && !isCompleted && (
                  <div className="tnpc-quest-progress">
                    <div className="tnpc-quest-progress-bar">
                      <div
                        className="tnpc-quest-progress-fill"
                        style={{ width: `${(progress / quest.target) * 100}%`, background: theme.primary }}
                      />
                    </div>
                    <span className="tnpc-quest-progress-text">{progress}/{quest.target}</span>
                  </div>
                )}

                {!isAccepted && !isCompleted && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleAcceptQuest(quest.id, npc.id)}>
                    Accept
                  </button>
                )}
                {canTurnIn && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleTurnInQuest(quest.id, npc.id)}>
                    Turn In
                  </button>
                )}
                {isCompleted && (
                  <div className="tnpc-quest-done-label">Completed</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SHOP VIEW */}
      {view === 'shop' && (
        <div className="tnpc-shop-view">
          <div className="tnpc-section-title" style={{ color: theme.primary }}>Wares</div>
          <div className="tnpc-deal-list">
            {npc.deals.map((deal, idx) => {
              const canAfford = playerGold >= deal.cost;
              const justBought = purchasedId === deal.id;
              const purchased = travellingPurchases[deal.id] || 0;
              const soldOut = deal.stock != null && purchased >= deal.stock;
              const remaining = deal.stock != null ? deal.stock - purchased : null;
              const canBuy = canAfford && !soldOut;
              return (
                <div key={deal.id} className={`tnpc-deal ${!canBuy ? 'too-expensive' : ''} ${justBought ? 'deal-purchased' : ''}`} style={{ borderColor: canBuy ? `${theme.primary}44` : undefined }}>
                  <div className="tnpc-deal-number" style={{ color: theme.primary }}>{idx + 1}</div>
                  <div className="tnpc-deal-info">
                    <div className="tnpc-deal-desc">{deal.description}</div>
                    <div className="tnpc-deal-cost">
                      <span className="tnpc-gold-icon">{'\u25CF'}</span>
                      {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                      {remaining != null && <span style={{ marginLeft: 8, opacity: 0.7, fontSize: '0.85em' }}>Stock: {remaining}</span>}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm tnpc-buy-btn"
                    onClick={() => handleBuy(deal.id)}
                    disabled={!canBuy}
                    style={canBuy ? { background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})` } : undefined}
                  >
                    {soldOut ? 'Sold out' : justBought ? 'Sold!' : canAfford ? 'Buy' : "Can't afford"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROFILE VIEW */}
      {view === 'profile' && (
        <div className="tnpc-profile-view">
          <div className="tnpc-profile-card" style={{ borderColor: `${theme.primary}44` }}>
            <div className="tnpc-profile-portrait-lg" style={{ borderColor: theme.primary, boxShadow: `0 0 20px ${theme.glow}` }}>
              <canvas ref={el => {
                if (!el || !npc) return;
                const ctx = el.getContext('2d');
                const spriteData = SPRITES.travellingNpcs?.[npc.spriteKey];
                if (!spriteData) return;
                const scale = 5;
                el.width = spriteData[0].length * scale;
                el.height = spriteData.length * scale;
                ctx.clearRect(0, 0, el.width, el.height);
                drawSprite(ctx, spriteData, 0, 0, scale);
              }} className="tnpc-profile-canvas" />
            </div>
            <div className="tnpc-profile-name" style={{ color: theme.primary }}>{npc.name}</div>
            <div className="tnpc-profile-title">{npc.title}</div>
            <div className="tnpc-profile-divider" style={{ background: `linear-gradient(to right, transparent, ${theme.primary}44, transparent)` }} />

            <div className="tnpc-profile-section">
              <div className="tnpc-profile-label">Personality</div>
              <div className="tnpc-profile-value" style={{ color: theme.primary }}>
                {npc.personality ? npc.personality.charAt(0).toUpperCase() + npc.personality.slice(1) : 'Unknown'}
              </div>
            </div>

            <div className="tnpc-profile-section">
              <div className="tnpc-profile-label">Lore</div>
              <div className="tnpc-profile-lore">{npc.lore}</div>
            </div>

            {npc.boss && (
              <div className="tnpc-profile-section">
                <div className="tnpc-profile-label">Combat Strength</div>
                <div className="tnpc-profile-value" style={{ color: '#e74c3c' }}>
                  {npc.boss.title} — Boss-tier opponent
                </div>
                <div className="tnpc-profile-combat-note">
                  {playerLevel >= (npc.minLevel || 1)
                    ? 'You can challenge this NPC through dialogue.'
                    : `Requires level ${npc.minLevel} to challenge.`}
                </div>
              </div>
            )}

            {npc.quests && npc.quests.length > 0 && (
              <div className="tnpc-profile-section">
                <div className="tnpc-profile-label">Quests</div>
                {npc.quests.map(q => {
                  const done = completed.includes(q.id);
                  const active = accepted.some(a => a.questId === q.id);
                  return (
                    <div key={q.id} className="tnpc-profile-quest-row">
                      <span className="tnpc-profile-quest-status">
                        {done ? '\u2714' : active ? '\u25B6' : '\u25CB'}
                      </span>
                      <span className={`tnpc-profile-quest-name ${done ? 'done' : ''}`}>{q.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="tnpc-footer">
        <div className="tnpc-gold-display">
          <span className="tnpc-gold-icon">{'\u25CF'}</span> {playerGold}g
        </div>
        <button className="btn btn-back tnpc-leave-btn" onClick={onLeave}>Leave</button>
      </div>
    </div>
  );
}

function getNpcTheme(npc) {
  const themes = {
    'tnpc-rook': { primary: '#7b8d9e', secondary: '#5a6a7a', glow: 'rgba(123, 141, 158, 0.4)' },
    'tnpc-sable': { primary: '#9b59b6', secondary: '#7a4d8a', glow: 'rgba(155, 89, 182, 0.4)' },
    'tnpc-marshal': { primary: '#e67e22', secondary: '#cc6600', glow: 'rgba(230, 126, 34, 0.4)' },
    'tnpc-zara': { primary: '#4fc3f7', secondary: '#0288d1', glow: 'rgba(79, 195, 247, 0.4)' },
    'tnpc-vex': { primary: '#8d6e63', secondary: '#5d4037', glow: 'rgba(141, 110, 99, 0.4)' },
    'tnpc-ember': { primary: '#ff5722', secondary: '#d84315', glow: 'rgba(255, 87, 34, 0.4)' },
  };
  return themes[npc.id] || { primary: npc.color || '#ce93d8', secondary: '#9c27b0', glow: 'rgba(206, 147, 216, 0.4)' };
}
