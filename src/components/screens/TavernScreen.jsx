import { useState, useRef, useEffect } from 'react';
import { TAVERN_NPCS, TAVERN_QUESTS, TAVERN_SHOP_UNLOCKS, REP_LEVELS, getRepLevel, FACTIONS, FACTION_SKILLS, RIVALRY_QUESTS } from '../../data/tavernData';
import { SPRITES, drawSprite } from '../../data/sprites';

function NpcSprite({ npcId, scale = 4 }) {
  const canvasRef = useRef(null);
  const spriteData = SPRITES.tavern?.[npcId];

  useEffect(() => {
    if (!canvasRef.current || !spriteData) return;
    const ctx = canvasRef.current.getContext('2d');
    const w = spriteData[0].length * scale;
    const h = spriteData.length * scale;
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    ctx.clearRect(0, 0, w, h);
    drawSprite(ctx, spriteData, 0, 0, scale);
  }, [spriteData, scale]);

  if (!spriteData) return null;
  return <canvas ref={canvasRef} className="tavern-npc-sprite" />;
}

function RepBar({ rep, npcColor }) {
  const repInfo = getRepLevel(rep);
  const nextLevel = REP_LEVELS.find(r => r.min > rep);
  const prevMin = repInfo.min;
  const nextMin = nextLevel ? nextLevel.min : repInfo.min + 50;
  const progress = nextLevel ? ((rep - prevMin) / (nextMin - prevMin)) * 100 : 100;

  return (
    <div className="tavern-rep-bar">
      <div className="tavern-rep-label">
        <span style={{ color: npcColor }}>{repInfo.label}</span>
        <span className="tavern-rep-pts">{rep} rep</span>
      </div>
      <div className="tavern-rep-track">
        <div className="tavern-rep-fill" style={{ width: `${progress}%`, background: npcColor }} />
      </div>
      {nextLevel && (
        <div className="tavern-rep-next">Next: {nextLevel.label} at {nextLevel.min}</div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'talk', label: 'Talk' },
  { id: 'quests', label: 'Quests' },
  { id: 'faction', label: 'Faction' },
  { id: 'shop', label: 'Shop' },
];

export default function TavernScreen({ tavern, player, stats, onAcceptQuest, onTurnInQuest, onAcceptRivalryQuest, onTurnInRivalryQuest, onLearnFactionSkill, onBuyItem, onBack }) {
  const [activeNpcId, setActiveNpcId] = useState(null);
  const [activeTab, setActiveTab] = useState('talk');
  const [activeTopic, setActiveTopic] = useState(null);
  const [lineIndex, setLineIndex] = useState(0);

  const tav = tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
  const activeNpc = TAVERN_NPCS.find(n => n.id === activeNpcId);
  const npcRep = activeNpcId ? (tav.reputation[activeNpcId] || 0) : 0;
  const npcRepLevel = getRepLevel(npcRep).level;

  const handleSelectNpc = (npcId) => {
    setActiveNpcId(npcId);
    setActiveTab('talk');
    setActiveTopic(null);
    setLineIndex(0);
  };

  const handleSelectTopic = (topicId) => {
    setActiveTopic(topicId);
    setLineIndex(0);
  };

  const handleNextLine = () => {
    const topic = activeNpc?.topics.find(t => t.id === activeTopic);
    if (topic && lineIndex < topic.lines.length - 1) {
      setLineIndex(i => i + 1);
    } else {
      setActiveTopic(null);
      setLineIndex(0);
    }
  };

  // Get greeting based on reputation
  const getGreeting = (npc) => {
    if (!npc.greetingByRep) return npc.greeting;
    const rep = tav.reputation[npc.id] || 0;
    const repLvl = getRepLevel(rep).level;
    const thresholds = Object.keys(npc.greetingByRep).map(Number).sort((a, b) => b - a);
    for (const t of thresholds) {
      if (repLvl >= t) return npc.greetingByRep[t];
    }
    return npc.greeting;
  };

  // ---- QUESTS TAB ----
  const renderQuests = () => {
    const quests = TAVERN_QUESTS[activeNpcId] || [];
    // Find rivalry quests involving this NPC
    const npcRivalryQuests = RIVALRY_QUESTS.filter(rq => rq.involvedNpcs.includes(activeNpcId));

    return (
      <div className="tavern-quest-list">
        {quests.map(quest => {
          const isCompleted = tav.completedQuests.includes(quest.id);
          const accepted = tav.acceptedQuests.find(q => q.questId === quest.id);
          const isAccepted = !!accepted;
          const repLocked = npcRepLevel < quest.reqRep;
          const levelLocked = player.level < quest.reqLevel;
          const locked = repLocked || levelLocked;
          const hasRequiredItems = !quest.requiresItems || quest.requiresItems.every(
            itemName => player.inventory?.some(item => item.name === itemName)
          );

          let progress = 0;
          let statMet = false;
          let canTurnIn = false;
          if (isAccepted) {
            if (quest.stat === 'none' || quest.target === 0) {
              statMet = true;
              progress = quest.target;
            } else {
              progress = (stats[quest.stat] || 0) - accepted.baseline;
              statMet = progress >= quest.target;
            }
            canTurnIn = statMet && hasRequiredItems;
          }

          const isDeliveryQuest = !!quest.requiresItems;

          return (
            <div key={quest.id} className={`tavern-quest ${isCompleted ? 'completed' : ''} ${canTurnIn ? 'ready' : ''} ${locked ? 'locked' : ''} ${isDeliveryQuest ? 'delivery' : ''}`}>
              <div className="tavern-quest-header">
                <div className="tavern-quest-name">
                  {isDeliveryQuest && <span className="delivery-icon">&#128230;</span>}
                  {quest.name}
                </div>
                <div className="tavern-quest-badges">
                  {isCompleted && <span className="tavern-badge done">Done</span>}
                  {canTurnIn && <span className="tavern-badge turn-in">Ready!</span>}
                  {isAccepted && !canTurnIn && !isCompleted && <span className="tavern-badge active">Active</span>}
                  {locked && !isCompleted && <span className="tavern-badge locked">{repLocked ? `Rep ${quest.reqRep}` : `Lv${quest.reqLevel}`}</span>}
                </div>
              </div>
              <div className="tavern-quest-desc">{quest.desc}</div>
              {quest.lore && isAccepted && !isCompleted && (
                <div className="tavern-quest-lore">{quest.lore}</div>
              )}
              {isAccepted && !isCompleted && quest.stat !== 'none' && quest.target > 0 && (
                <div className="tavern-quest-progress">
                  <div className="tavern-quest-bar-track">
                    <div className="tavern-quest-bar-fill" style={{ width: `${Math.min(100, (progress / quest.target) * 100)}%` }} />
                  </div>
                  <span className="tavern-quest-bar-text">{Math.min(progress, quest.target)} / {quest.target}</span>
                </div>
              )}
              {isAccepted && !isCompleted && quest.requiresItems && (
                <div className="tavern-quest-items">
                  <div className="tavern-quest-items-label">Required Items:</div>
                  {quest.requiresItems.map(itemName => {
                    const has = player.inventory?.some(item => item.name === itemName);
                    return (
                      <div key={itemName} className={`tavern-quest-item-req ${has ? 'has-item' : 'missing-item'}`}>
                        <span className="tavern-quest-item-check">{has ? '\u2714' : '\u2718'}</span>
                        <span className="tavern-quest-item-name">{itemName}</span>
                        {quest.questDrops?.some(d => d.itemName === itemName) && !has && (
                          <span className="tavern-quest-item-hint">Drops from boss</span>
                        )}
                        {!quest.questDrops?.some(d => d.itemName === itemName) && !has && (
                          <span className="tavern-quest-item-hint">Find or buy this item</span>
                        )}
                        {quest.consumeItems && has && (
                          <span className="tavern-quest-item-consumed">Will be consumed</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="tavern-quest-reward">
                +{quest.repReward} rep | +{quest.goldReward}g
              </div>
              {!isCompleted && !isAccepted && !locked && (
                <button className="tavern-action-btn" onClick={() => onAcceptQuest(quest.id, activeNpcId)}>Accept Quest</button>
              )}
              {canTurnIn && (
                <button className="tavern-action-btn turn-in" onClick={() => onTurnInQuest(quest.id, activeNpcId)}>Turn In</button>
              )}
            </div>
          );
        })}

        {/* Rivalry Quests */}
        {npcRivalryQuests.length > 0 && (
          <>
            <div className="tavern-rivalry-header">Rivalry Quests</div>
            <div className="tavern-rivalry-subtitle">Choose a side. There is no going back.</div>
            {npcRivalryQuests.map(rq => {
              const chosenNpc = tav.completedRivalryQuests?.[rq.id];
              const isCompleted = !!chosenNpc;
              const wonThisNpc = chosenNpc === activeNpcId;
              const lostThisNpc = isCompleted && !wonThisNpc;
              const accepted = (tav.acceptedRivalryQuests || []).find(q => q.questId === rq.id);
              const isAccepted = !!accepted;
              const levelLocked = player.level < rq.reqLevel;
              const hasRep = rq.involvedNpcs.some(npcId => {
                const rep = tav.reputation[npcId] || 0;
                return getRepLevel(rep).level >= rq.reqRep;
              });
              const locked = levelLocked || !hasRep;

              let progress = 0;
              let canTurnIn = false;
              if (isAccepted) {
                progress = (stats[rq.stat] || 0) - accepted.baseline;
                canTurnIn = progress >= rq.target;
              }

              const rivalNpc = rq.involvedNpcs.find(id => id !== activeNpcId);
              const rivalName = TAVERN_NPCS.find(n => n.id === rivalNpc)?.name || rivalNpc;
              const activeNpcName = activeNpc.name;
              const reward = rq.rewards[activeNpcId];

              return (
                <div key={rq.id} className={`tavern-quest rivalry ${isCompleted ? (wonThisNpc ? 'completed' : 'betrayed') : ''} ${canTurnIn ? 'ready' : ''} ${locked && !isCompleted ? 'locked' : ''}`}>
                  <div className="tavern-quest-header">
                    <div className="tavern-quest-name">
                      <span className="rivalry-icon">&#9876;</span> {rq.name}
                    </div>
                    <div className="tavern-quest-badges">
                      {wonThisNpc && <span className="tavern-badge done">Sided with {activeNpcName}</span>}
                      {lostThisNpc && <span className="tavern-badge betrayed">Sided with {TAVERN_NPCS.find(n => n.id === chosenNpc)?.name}</span>}
                      {canTurnIn && <span className="tavern-badge turn-in">Choose a Side!</span>}
                      {isAccepted && !canTurnIn && !isCompleted && <span className="tavern-badge active">Active</span>}
                      {locked && !isCompleted && !isAccepted && <span className="tavern-badge locked">{levelLocked ? `Lv${rq.reqLevel}` : `Rep ${rq.reqRep}`}</span>}
                    </div>
                  </div>
                  <div className="tavern-quest-desc">{rq.desc}</div>
                  {rq.lore && <div className="tavern-rivalry-lore">{rq.lore}</div>}
                  {isAccepted && !isCompleted && (
                    <div className="tavern-quest-progress">
                      <div className="tavern-quest-bar-track">
                        <div className="tavern-quest-bar-fill rivalry-fill" style={{ width: `${Math.min(100, (progress / rq.target) * 100)}%` }} />
                      </div>
                      <span className="tavern-quest-bar-text">{Math.min(progress, rq.target)} / {rq.target}</span>
                    </div>
                  )}
                  {!isCompleted && reward && (
                    <div className="tavern-rivalry-rewards">
                      <div className="tavern-rivalry-reward-option">
                        <strong>{activeNpcName}:</strong> +{reward.repReward} rep, +{reward.goldReward}g
                        {Object.entries(reward.repPenalties).map(([npcId, delta]) => (
                          <span key={npcId} className="rivalry-penalty"> | {TAVERN_NPCS.find(n => n.id === npcId)?.name}: {delta} rep</span>
                        ))}
                      </div>
                      {rq.rewards[rivalNpc] && (
                        <div className="tavern-rivalry-reward-option rival">
                          <strong>{rivalName}:</strong> +{rq.rewards[rivalNpc].repReward} rep, +{rq.rewards[rivalNpc].goldReward}g
                          {Object.entries(rq.rewards[rivalNpc].repPenalties).map(([npcId, delta]) => (
                            <span key={npcId} className="rivalry-penalty"> | {TAVERN_NPCS.find(n => n.id === npcId)?.name}: {delta} rep</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {!isCompleted && !isAccepted && !locked && (
                    <button className="tavern-action-btn" onClick={() => onAcceptRivalryQuest(rq.id)}>Accept Rivalry Quest</button>
                  )}
                  {canTurnIn && (
                    <div className="tavern-rivalry-choice">
                      <div className="tavern-rivalry-warning">This choice is PERMANENT. Choose wisely.</div>
                      {rq.involvedNpcs.map(npcId => {
                        const choiceReward = rq.rewards[npcId];
                        const choiceName = TAVERN_NPCS.find(n => n.id === npcId)?.name || npcId;
                        return (
                          <button
                            key={npcId}
                            className={`tavern-action-btn rivalry-choice ${npcId === activeNpcId ? 'ally' : 'betray'}`}
                            onClick={() => onTurnInRivalryQuest(rq.id, npcId)}
                          >
                            {choiceReward.turnInText}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {lostThisNpc && (
                    <div className="tavern-rivalry-lost">You chose another side. This path is closed forever.</div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // ---- SHOP TAB ----
  const renderShop = () => {
    const unlocks = TAVERN_SHOP_UNLOCKS[activeNpcId] || [];
    const availableItems = [];
    for (const tier of unlocks) {
      const repLocked = npcRepLevel < tier.reqRep;
      for (const item of tier.items) {
        availableItems.push({ ...item, repLocked, reqRep: tier.reqRep });
      }
    }

    return (
      <div className="tavern-shop-list">
        {availableItems.map((item, i) => {
          const stockKey = activeNpcId + '_' + item.name;
          const bought = tav.shopPurchases[stockKey] || 0;
          const soldOut = item.type === 'gear' && bought >= 1; // gear is one-time
          const canAfford = player.gold >= item.buyPrice;

          return (
            <div key={i} className={`tavern-shop-item ${item.repLocked ? 'locked' : ''} ${soldOut ? 'sold-out' : ''}`}>
              <div className="tavern-shop-item-header">
                <span className={`tavern-shop-item-name rarity-${(item.rarity || 'common').toLowerCase()}`} style={{ color: item.rarity === 'Epic' ? '#ce93d8' : item.rarity === 'Rare' ? '#ffd700' : item.rarity === 'Uncommon' ? '#4fc3f7' : '#ccc' }}>
                  {item.name}
                </span>
                <span className="tavern-shop-item-price">{item.buyPrice}g</span>
              </div>
              <div className="tavern-shop-item-desc">{item.desc}</div>
              <div className="tavern-shop-item-stats">
                {item.atk > 0 && <span>ATK+{item.atk}</span>}
                {item.def > 0 && <span>DEF+{item.def}</span>}
                {item.healAmount > 0 && <span>Heal {item.healAmount}</span>}
                {item.slot && <span className="tavern-shop-item-slot">{item.slot}</span>}
                {item.level > 0 && <span>Lv{item.level}</span>}
              </div>
              {item.repLocked && (
                <div className="tavern-shop-locked">Requires {REP_LEVELS.find(r => r.level === item.reqRep)?.label} reputation</div>
              )}
              {!item.repLocked && !soldOut && (
                <button
                  className="tavern-action-btn"
                  disabled={!canAfford}
                  onClick={() => onBuyItem(item, activeNpcId)}
                >
                  {canAfford ? 'Buy' : 'Not enough gold'}
                </button>
              )}
              {soldOut && <span className="tavern-badge done">Purchased</span>}
            </div>
          );
        })}
      </div>
    );
  };

  // ---- FACTION TAB ----
  const renderFaction = () => {
    const faction = FACTIONS[activeNpcId];
    const factionSkills = FACTION_SKILLS[activeNpcId] || [];
    if (!faction) return <div className="tavern-empty-text">No faction info</div>;

    return (
      <div className="tavern-faction-panel">
        <div className="tavern-faction-header">
          <span className="tavern-faction-icon">{faction.icon}</span>
          <div className="tavern-faction-info">
            <div className="tavern-faction-name" style={{ color: faction.color }}>{faction.name}</div>
            <div className="tavern-faction-desc">{faction.desc}</div>
            <div className="tavern-faction-specialty">Specialty: {faction.specialty}</div>
          </div>
        </div>
        <div className="tavern-faction-skills-header">Combat Skills</div>
        <div className="tavern-faction-skill-list">
          {factionSkills.map(skill => {
            const isLearned = (tav.learnedFactionSkills || []).includes(skill.id);
            const repLocked = npcRepLevel < skill.reqRep;
            const reqLabel = REP_LEVELS.find(r => r.level === skill.reqRep)?.label || '';

            return (
              <div key={skill.id} className={`tavern-faction-skill ${isLearned ? 'learned' : ''} ${repLocked ? 'locked' : ''}`}>
                <div className="tavern-faction-skill-icon">{skill.icon}</div>
                <div className="tavern-faction-skill-info">
                  <div className="tavern-faction-skill-name">{skill.name}</div>
                  <div className="tavern-faction-skill-desc">{skill.desc}</div>
                  <div className="tavern-faction-skill-meta">
                    <span className="tavern-faction-skill-cost">{skill.manaCost} mana</span>
                    <span className="tavern-faction-skill-mult">{skill.multiplier}x dmg</span>
                  </div>
                  <div className="tavern-skill-req">Requires: {reqLabel} ({REP_LEVELS.find(r => r.level === skill.reqRep)?.min} rep)</div>
                </div>
                <div className="tavern-skill-action">
                  {isLearned && <span className="tavern-badge done">Learned</span>}
                  {!isLearned && !repLocked && (
                    <button className="tavern-action-btn faction" onClick={() => onLearnFactionSkill(skill.id, activeNpcId)}>Learn</button>
                  )}
                  {!isLearned && repLocked && <span className="tavern-badge locked">Locked</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---- TALK TAB ----
  const renderTalk = () => {
    const currentTopic = activeNpc?.topics.find(t => t.id === activeTopic);
    const currentLine = currentTopic?.lines[lineIndex] || null;

    return (
      <div className="tavern-dialogue-box">
        {!activeTopic && (
          <>
            <div className="tavern-dialogue-text">{getGreeting(activeNpc)}</div>
            <div className="tavern-topic-list">
              {activeNpc.topics.map(topic => (
                <button
                  key={topic.id}
                  className="tavern-topic-btn"
                  onClick={() => handleSelectTopic(topic.id)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </>
        )}
        {activeTopic && currentLine && (
          <>
            <div className="tavern-dialogue-text">{currentLine}</div>
            <div className="tavern-dialogue-nav">
              <span className="tavern-dialogue-counter">
                {lineIndex + 1} / {currentTopic.lines.length}
              </span>
              <button className="tavern-dialogue-next" onClick={handleNextLine}>
                {lineIndex < currentTopic.lines.length - 1 ? 'Continue...' : 'Back to topics'}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="screen screen-tavern">
      <div className="tavern-header">
        <div className="tavern-title">The Dusty Flagon</div>
        <div className="tavern-subtitle">Talk, trade, and build friendships</div>
      </div>

      {/* NPC selector row */}
      <div className="tavern-npc-list">
        {TAVERN_NPCS.map(npc => {
          const rep = tav.reputation[npc.id] || 0;
          const repInfo = getRepLevel(rep);
          return (
            <button
              key={npc.id}
              className={`tavern-npc-card ${activeNpcId === npc.id ? 'active' : ''}`}
              onClick={() => handleSelectNpc(npc.id)}
            >
              <NpcSprite npcId={npc.id} scale={3} />
              <span className="tavern-npc-name" style={{ color: npc.color }}>{npc.name}</span>
              <span className="tavern-npc-role">{npc.role}</span>
              {FACTIONS[npc.id] && <span className="tavern-npc-faction">{FACTIONS[npc.id].icon} {FACTIONS[npc.id].name}</span>}
              <span className="tavern-npc-rep" style={{ color: npc.color }}>{repInfo.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active NPC panel */}
      {activeNpc && (
        <div className="tavern-conversation">
          <div className="tavern-conv-header">
            <NpcSprite npcId={activeNpc.id} scale={5} />
            <div className="tavern-conv-info">
              <div className="tavern-conv-name" style={{ color: activeNpc.color }}>{activeNpc.name}</div>
              <div className="tavern-conv-role">{activeNpc.role}</div>
              <RepBar rep={npcRep} npcColor={activeNpc.color} />
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="tavern-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tavern-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setActiveTopic(null); setLineIndex(0); }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="tavern-tab-content">
            {activeTab === 'talk' && renderTalk()}
            {activeTab === 'quests' && renderQuests()}
            {activeTab === 'faction' && renderFaction()}
            {activeTab === 'shop' && renderShop()}
          </div>
        </div>
      )}

      {!activeNpc && (
        <div className="tavern-empty">
          <div className="tavern-empty-text">Choose someone to talk to...</div>
        </div>
      )}

      <button className="btn btn-back tavern-back-btn" onClick={onBack}>Leave Tavern</button>
    </div>
  );
}
