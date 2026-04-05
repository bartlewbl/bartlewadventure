import { useState, useRef, useEffect } from 'react';
import { TAVERN_NPCS, TAVERN_QUESTS, TAVERN_SHOP_UNLOCKS, REP_LEVELS, getRepLevel, FACTIONS, FACTION_SKILLS, RIVALRY_QUESTS } from '../../data/tavernData';
import { SPRITES, drawSprite } from '../../data/sprites';
import { DICE_WAGERS, COIN_FLIP_WAGERS, WHEEL_WAGERS, WHEEL_SEGMENTS, rollDice, flipCoin, spinWheel, NPC_BOUNTIES, NPC_MERCENARIES, ENCHANTER_NPC, DEALER_NPC, ENCHANT_LEVELS, getEnchantCost, getEnchantSuccess, MAX_ENCHANT_LEVEL, getRespecCost } from '../../data/goldSinks';

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

const NPC_TABS = [
  { id: 'talk', label: 'Talk' },
  { id: 'quests', label: 'Quests' },
  { id: 'bounties', label: 'Bounties' },
  { id: 'faction', label: 'Faction' },
  { id: 'shop', label: 'Shop' },
];

const EMBER_TABS = [
  { id: 'talk', label: 'Talk' },
  { id: 'enchant', label: 'Enchant' },
];

const DEALER_TABS = [
  { id: 'talk', label: 'Talk' },
  { id: 'gamble', label: 'Gamble' },
];

const GAMBLING_GAMES = [
  { id: 'dice', label: 'Dice (Over/Under)' },
  { id: 'coin', label: 'Coin Flip' },
  { id: 'wheel', label: 'Wheel of Fortune' },
];

// Combined NPC list: original tavern NPCs + the enchanter + the dealer
const ALL_TAVERN_NPCS = [...TAVERN_NPCS, ENCHANTER_NPC, DEALER_NPC];

function EmberSplash() {
  return (
    <div className="ember-splash">
      <svg viewBox="0 0 120 140" className="ember-splash-svg">
        {/* Hair - flowing fire-red */}
        <ellipse cx="60" cy="38" rx="32" ry="34" fill="#8b2500" />
        <ellipse cx="60" cy="36" rx="30" ry="32" fill="#a83200" />
        <path d="M30 40 Q28 20 38 10 Q48 2 60 4 Q72 2 82 10 Q92 20 90 40" fill="#c44000" />
        <path d="M32 45 Q26 55 28 70 Q30 60 35 50Z" fill="#a83200" />
        <path d="M88 45 Q94 55 92 70 Q90 60 85 50Z" fill="#a83200" />
        {/* Flowing hair strands */}
        <path d="M34 38 Q30 50 26 65" stroke="#ff6030" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M86 38 Q90 50 94 65" stroke="#ff6030" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M28 55 Q24 68 27 80" stroke="#c44000" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M92 55 Q96 68 93 80" stroke="#c44000" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* Face */}
        <ellipse cx="60" cy="44" rx="22" ry="24" fill="#f4c29a" />
        <ellipse cx="60" cy="46" rx="20" ry="22" fill="#f0b888" />

        {/* Eyes - glowing amber */}
        <ellipse cx="50" cy="42" rx="5" ry="3.5" fill="#1a1a2e" />
        <ellipse cx="70" cy="42" rx="5" ry="3.5" fill="#1a1a2e" />
        <ellipse cx="50" cy="42" rx="3" ry="2.5" fill="#ff7043" />
        <ellipse cx="70" cy="42" rx="3" ry="2.5" fill="#ff7043" />
        <circle cx="50" cy="41" r="1.2" fill="#ffd700" />
        <circle cx="70" cy="41" r="1.2" fill="#ffd700" />
        {/* Eye glow */}
        <circle cx="50" cy="42" r="5" fill="none" stroke="#ff7043" strokeWidth="0.5" opacity="0.3" />
        <circle cx="70" cy="42" r="5" fill="none" stroke="#ff7043" strokeWidth="0.5" opacity="0.3" />

        {/* Eyebrows */}
        <path d="M44 37 Q50 35 56 37" stroke="#8b2500" strokeWidth="1.5" fill="none" />
        <path d="M64 37 Q70 35 76 37" stroke="#8b2500" strokeWidth="1.5" fill="none" />

        {/* Nose & mouth */}
        <path d="M58 48 Q60 50 62 48" stroke="#d4956a" strokeWidth="1" fill="none" />
        <path d="M52 55 Q60 59 68 55" stroke="#c47060" strokeWidth="1.5" fill="none" />
        <path d="M55 55 Q60 57 65 55" fill="#cc6655" opacity="0.4" />

        {/* Neck */}
        <rect x="52" y="64" width="16" height="10" fill="#f0b888" rx="2" />

        {/* Robes/clothing */}
        <path d="M36 74 Q40 68 52 68 L68 68 Q80 68 84 74 L90 100 L30 100Z" fill="#2a1a3e" />
        <path d="M40 74 Q48 70 60 70 Q72 70 80 74 L84 95 L36 95Z" fill="#3a1a50" />
        {/* Robe collar */}
        <path d="M48 68 Q52 74 60 75 Q68 74 72 68" stroke="#ff7043" strokeWidth="1.5" fill="none" />
        {/* Robe trim/embroidery */}
        <path d="M44 80 L60 85 L76 80" stroke="#ffd700" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M46 86 L60 90 L74 86" stroke="#ffd700" strokeWidth="0.6" fill="none" opacity="0.4" />

        {/* Enchanting glow effects */}
        <circle cx="42" cy="82" r="3" fill="#ff7043" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="78" cy="82" r="3" fill="#ff7043" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2.3s" repeatCount="indefinite" />
        </circle>

        {/* Hands holding magic */}
        <ellipse cx="38" cy="88" rx="5" ry="4" fill="#f0b888" />
        <ellipse cx="82" cy="88" rx="5" ry="4" fill="#f0b888" />

        {/* Magic orb between hands */}
        <circle cx="60" cy="100" r="8" fill="#ff7043" opacity="0.2">
          <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="100" r="5" fill="#ffd700" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="100" r="2" fill="#fff" opacity="0.5" />

        {/* Sparkle particles */}
        <circle cx="50" cy="96" r="0.8" fill="#ffd700" opacity="0.6">
          <animate attributeName="cy" values="96;92;96" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="94" r="0.8" fill="#ffd700" opacity="0.6">
          <animate attributeName="cy" values="94;90;94" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="90" r="0.6" fill="#fff" opacity="0.4">
          <animate attributeName="cy" values="90;85;90" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export default function TavernScreen({ tavern, player, stats, bounties, mercenary, onAcceptQuest, onTurnInQuest, onAcceptRivalryQuest, onTurnInRivalryQuest, onLearnFactionSkill, onBuyItem, onGamble, onAcceptBounty, onClaimBounty, onHireMercenary, onEnchantItem, onRespecStats, onBack }) {
  const [activeNpcId, setActiveNpcId] = useState(null);
  const [activeTab, setActiveTab] = useState('talk');
  const [activeTopic, setActiveTopic] = useState(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [gamblingGame, setGamblingGame] = useState('dice');
  const [diceWager, setDiceWager] = useState(DICE_WAGERS[0]);
  const [diceBet, setDiceBet] = useState('over');
  const [coinWager, setCoinWager] = useState(COIN_FLIP_WAGERS[0]);
  const [coinBet, setCoinBet] = useState('heads');
  const [wheelWager, setWheelWager] = useState(WHEEL_WAGERS[0]);
  const [gamblingResult, setGamblingResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [enchantSelected, setEnchantSelected] = useState(null);
  const [respecConfirm, setRespecConfirm] = useState(false);

  const tav = tavern || { reputation: {}, acceptedQuests: [], completedQuests: [], learnedFactionSkills: [], shopPurchases: {} };
  const activeNpc = ALL_TAVERN_NPCS.find(n => n.id === activeNpcId);
  const isEmber = activeNpcId === 'ember';
  const isDealer = activeNpcId === 'dealer';
  const isRegularNpc = activeNpc && !isEmber && !isDealer;
  const activeTabs = isEmber ? EMBER_TABS : isDealer ? DEALER_TABS : NPC_TABS;
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
                {item.passive && (
                  <span style={{ color: '#8f8' }}>
                    +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
                  </span>
                )}
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
    const classFactionSkills = FACTION_SKILLS[activeNpcId] || {};
    const factionSkills = classFactionSkills[player.characterClass] || [];
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
        <div className="tavern-faction-skills-header">Combat Skills — {player.characterClass?.charAt(0).toUpperCase() + player.characterClass?.slice(1)}</div>
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

  // ---- BOUNTIES TAB (per NPC) ----
  const renderBounties = () => {
    const npcBounties = NPC_BOUNTIES[activeNpcId] || [];
    const ab = bounties?.active || [];
    const cb = bounties?.completed || [];

    if (npcBounties.length === 0) return <div className="tavern-empty-text">No bounties available from this contact.</div>;

    return (
      <div className="tavern-bounty-list">
        {npcBounties.map(bounty => {
          const active = ab.find(b => b.bountyId === bounty.id);
          const completed = cb.includes(bounty.id);
          const repLocked = npcRepLevel < bounty.reqRep;
          const levelLocked = player.level < bounty.reqLevel;
          const locked = repLocked || levelLocked;
          const canAfford = player.gold >= bounty.fee;

          let progress = 0;
          let canClaim = false;
          if (active) {
            progress = (stats.monstersKilled || 0) - active.baseline;
            canClaim = progress >= bounty.killTarget;
          }

          return (
            <div key={bounty.id} className={`bounty-card ${completed ? 'completed' : ''} ${locked ? 'locked' : ''} ${canClaim ? 'ready' : ''}`}>
              <div className="bounty-card-header">
                <div className="bounty-name">{bounty.name}</div>
                <div className="bounty-badges">
                  {completed && <span className="bounty-badge done">Done</span>}
                  {canClaim && <span className="bounty-badge claim">Ready!</span>}
                  {active && !canClaim && <span className="bounty-badge active">Active</span>}
                  {locked && !completed && <span className="bounty-badge locked">{repLocked ? `Rep ${bounty.reqRep}` : `Lv${bounty.reqLevel}`}</span>}
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
              {!completed && !active && !locked && (
                <button className="tavern-action-btn" disabled={!canAfford} onClick={() => onAcceptBounty(bounty.id)}>
                  {canAfford ? `Accept (${bounty.fee}g)` : `Need ${bounty.fee}g`}
                </button>
              )}
              {canClaim && (
                <button className="tavern-action-btn turn-in" onClick={() => onClaimBounty(bounty.id)}>Claim Reward</button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ---- MERCENARIES (in faction tab, after faction skills) ----
  const renderMercenaries = () => {
    const npcMercs = NPC_MERCENARIES[activeNpcId] || [];
    if (npcMercs.length === 0) return null;

    return (
      <div className="tavern-merc-section">
        <div className="tavern-merc-header">Mercenaries for Hire</div>
        {mercenary && (
          <div className="tavern-merc-active">
            Active: <strong>{mercenary.name}</strong> — {mercenary.battlesRemaining} battle{mercenary.battlesRemaining !== 1 ? 's' : ''} left
            {mercenary.atkBonus > 0 && <span className="merc-stat"> ATK+{mercenary.atkBonus}</span>}
            {mercenary.defBonus > 0 && <span className="merc-stat"> DEF+{mercenary.defBonus}</span>}
          </div>
        )}
        {npcMercs.map(m => {
          const repLocked = npcRepLevel < m.reqRep;
          const canAfford = player.gold >= m.cost;
          const isActive = mercenary?.mercId === m.id;
          return (
            <div key={m.id} className={`tavern-merc-card ${repLocked ? 'locked' : ''}`}>
              <div className="tavern-merc-card-header">
                <span className={`tavern-merc-name rarity-text-${m.rarity.toLowerCase()}`}>{m.name}</span>
                <span className="tavern-merc-cost">{m.cost}g</span>
              </div>
              <div className="tavern-merc-desc">{m.desc}</div>
              <div className="tavern-merc-stats">
                {m.atkBonus > 0 && <span>ATK+{m.atkBonus}</span>}
                {m.defBonus > 0 && <span>DEF+{m.defBonus}</span>}
                <span>{m.duration} battles</span>
              </div>
              {repLocked && <div className="tavern-shop-locked">Requires {REP_LEVELS.find(r => r.level === m.reqRep)?.label} reputation</div>}
              {!repLocked && !isActive && (
                <button className="tavern-action-btn" disabled={!canAfford || !!mercenary} onClick={() => onHireMercenary(m.id)}>
                  {mercenary ? 'Already hired' : canAfford ? 'Hire' : 'Need gold'}
                </button>
              )}
              {isActive && <span className="tavern-badge done">Active</span>}
            </div>
          );
        })}
      </div>
    );
  };

  // ---- ENCHANT TAB (Ember only) ----
  const renderEnchant = () => {
    const equipment = player.inventory.filter(i => i.slot);
    const equippedItems = Object.entries(player.equipment || {})
      .filter(([, item]) => item)
      .map(([slot, item]) => ({ ...item, _equippedSlot: slot }));
    const allGear = [...equippedItems, ...equipment];

    const selected = enchantSelected ? allGear.find(i => i.id === enchantSelected.id) || enchantSelected : null;
    const currentLevel = selected?.enchantLevel || 0;
    const cost = selected ? getEnchantCost(selected, currentLevel) : 0;
    const successRate = selected ? getEnchantSuccess(currentLevel) : 0;
    const maxed = currentLevel >= MAX_ENCHANT_LEVEL;
    const canAfford = player.gold >= cost;

    const getItemLabel = (item) => {
      const enchant = item.enchantLevel ? ` +${item.enchantLevel}` : '';
      return `${item.name}${enchant}`;
    };

    const getRarityColor = (item) => {
      const cls = item.rarityClass || '';
      if (cls.includes('legendary')) return '#ff6b6b';
      if (cls.includes('epic')) return '#ce93d8';
      if (cls.includes('rare')) return '#ffd700';
      if (cls.includes('uncommon')) return '#4fc3f7';
      return '#ccc';
    };

    return (
      <div className="tavern-enchant-v2">
        {/* Ember splash art header */}
        <div className="enchant-header-splash">
          <EmberSplash />
          <div className="enchant-header-info">
            <div className="enchant-header-name">Ember Ashveil</div>
            <div className="enchant-header-title">Enchantress</div>
            <div className="enchant-header-gold">
              <span className="enchant-gold-icon">&#9733;</span> {player.gold}g
            </div>
          </div>
        </div>

        <div className="enchant-v2-layout">
          {/* Left: Equipment list */}
          <div className="enchant-v2-item-list">
            <div className="enchant-v2-list-header">Equipment</div>
            {allGear.length === 0 && <div className="enchant-v2-empty-text">No equipment to enchant</div>}
            {allGear.map(item => {
              const el = item.enchantLevel || 0;
              const isMaxed = el >= MAX_ENCHANT_LEVEL;
              const rarityColor = getRarityColor(item);
              return (
                <button key={item.id}
                  className={`enchant-v2-item ${enchantSelected?.id === item.id ? 'selected' : ''} ${isMaxed ? 'maxed' : ''}`}
                  onClick={() => setEnchantSelected(item)}
                  style={{ '--rarity-color': rarityColor }}>
                  <div className="enchant-v2-item-top">
                    <span className={`enchant-v2-item-name ${item.rarityClass || ''}`}>{getItemLabel(item)}</span>
                    {isMaxed && <span className="enchant-v2-max-badge">MAX</span>}
                  </div>
                  <div className="enchant-v2-item-bottom">
                    <span className="enchant-v2-item-slot">{item._equippedSlot ? 'Equipped' : item.slot}</span>
                    <span className="enchant-v2-item-stats">
                      {item.atk > 0 && <span className="enchant-v2-stat atk">ATK {item.atk}</span>}
                      {item.def > 0 && <span className="enchant-v2-stat def">DEF {item.def}</span>}
                      {item.passive && (
                        <span style={{ color: '#8f8' }}>
                          +{item.passive.value}{item.passive.format === 'pct' ? '%' : ''} {item.passive.label}
                        </span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Enchant panel */}
          <div className="enchant-v2-panel">
            {!selected && (
              <div className="enchant-v2-placeholder">
                <div className="enchant-v2-placeholder-icon">&#10024;</div>
                <div className="enchant-v2-placeholder-text">Select an item to enchant</div>
              </div>
            )}
            {selected && (
              <>
                <div className="enchant-v2-selected-header">
                  <div className={`enchant-v2-selected-name ${selected.rarityClass || ''}`}>{getItemLabel(selected)}</div>
                  <div className="enchant-v2-selected-stats">
                    {selected.atk > 0 && <span className="enchant-v2-stat atk">ATK +{selected.atk}</span>}
                    {selected.def > 0 && <span className="enchant-v2-stat def">DEF +{selected.def}</span>}
                  </div>
                </div>

                {/* Level track */}
                <div className="enchant-v2-level-track">
                  {ENCHANT_LEVELS.map((tier, i) => (
                    <div key={i} className={`enchant-v2-pip ${i < currentLevel ? 'filled' : ''} ${i === currentLevel && !maxed ? 'next' : ''}`}>
                      <div className="enchant-v2-pip-dot" />
                      <div className="enchant-v2-pip-label">{tier.label}</div>
                    </div>
                  ))}
                </div>

                {maxed ? (
                  <div className="enchant-v2-maxed">
                    <div className="enchant-v2-maxed-icon">&#128142;</div>
                    <div className="enchant-v2-maxed-text">Fully Enchanted</div>
                    <div className="enchant-v2-maxed-sub">This item has reached its maximum potential</div>
                  </div>
                ) : (
                  <div className="enchant-v2-action-area">
                    <div className="enchant-v2-preview">
                      <div className="enchant-v2-preview-row">
                        <span className="enchant-v2-preview-label">Target</span>
                        <span className="enchant-v2-preview-value">{ENCHANT_LEVELS[currentLevel].label}</span>
                      </div>
                      <div className="enchant-v2-preview-row">
                        <span className="enchant-v2-preview-label">Bonus</span>
                        <span className="enchant-v2-preview-value bonus">+{ENCHANT_LEVELS[currentLevel].statBonus} ATK/DEF</span>
                      </div>
                      <div className="enchant-v2-preview-row">
                        <span className="enchant-v2-preview-label">Success</span>
                        <span className="enchant-v2-preview-value">
                          <span className="enchant-v2-rate-bar">
                            <span className="enchant-v2-rate-fill" style={{ width: `${Math.round(successRate * 100)}%` }} />
                          </span>
                          <span className={`enchant-v2-rate-text ${successRate < 0.4 ? 'low' : successRate < 0.7 ? 'mid' : 'high'}`}>
                            {Math.round(successRate * 100)}%
                          </span>
                        </span>
                      </div>
                      <div className="enchant-v2-preview-row">
                        <span className="enchant-v2-preview-label">Cost</span>
                        <span className={`enchant-v2-preview-value ${canAfford ? 'gold' : 'cant-afford'}`}>{cost}g</span>
                      </div>
                    </div>
                    <button className="enchant-v2-btn" disabled={!canAfford}
                      onClick={() => onEnchantItem(selected, selected._equippedSlot || null)}>
                      <span className="enchant-v2-btn-icon">&#10024;</span>
                      {canAfford ? `Enchant (${cost}g)` : `Need ${cost}g`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---- RESPEC (Grog bartender special option in Talk tab) ----
  const renderRespec = () => {
    if (activeNpcId !== 'bartender') return null;
    const cost = getRespecCost(player.level);
    const canAfford = player.gold >= cost;

    return (
      <div className="tavern-respec-section">
        <div className="tavern-respec-title">Stat Respec Service</div>
        <div className="tavern-respec-desc">
          &quot;I know a mystic who owes me a favor. For <strong>{cost}g</strong>, I can get your stats reset to your class defaults.
          You'll get to redistribute all your level-up picks from scratch.&quot;
        </div>
        {!respecConfirm ? (
          <button className="tavern-action-btn" disabled={!canAfford || player.level <= 1} onClick={() => setRespecConfirm(true)}>
            {player.level <= 1 ? 'Nothing to reset' : canAfford ? `Respec Stats (${cost}g)` : `Need ${cost}g`}
          </button>
        ) : (
          <div className="respec-confirm">
            <div className="respec-confirm-text">This will cost {cost}g and reset ALL your stats. Are you sure?</div>
            <div className="respec-confirm-buttons">
              <button className="tavern-action-btn turn-in" onClick={() => { onRespecStats(); setRespecConfirm(false); }}>Confirm Respec</button>
              <button className="tavern-action-btn" onClick={() => setRespecConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---- GAMBLING HALL ----
  const [rollingDice, setRollingDice] = useState(null); // transient dice animation faces

  const handleDiceRoll = () => {
    if (isRolling || player.gold < diceWager) return;
    setIsRolling(true);
    setGamblingResult(null);
    // Animate dice faces rapidly before reveal
    let ticks = 0;
    const interval = setInterval(() => {
      setRollingDice({ d1: Math.floor(Math.random() * 6) + 1, d2: Math.floor(Math.random() * 6) + 1 });
      ticks++;
      if (ticks >= 8) {
        clearInterval(interval);
        const result = rollDice();
        const won = (diceBet === 'over' && result.total > 7) || (diceBet === 'under' && result.total < 7);
        const payout = won ? diceWager * 2 : 0;
        setRollingDice(null);
        setGamblingResult({ type: 'dice', ...result, won, payout, wager: diceWager });
        onGamble(diceWager, payout);
        setIsRolling(false);
      }
    }, 80);
  };

  const handleCoinFlip = () => {
    if (isRolling || player.gold < coinWager) return;
    setIsRolling(true);
    setGamblingResult(null);
    setTimeout(() => {
      const result = flipCoin();
      const won = result === coinBet;
      const payout = won ? coinWager * 2 : 0;
      setGamblingResult({ type: 'coin', result, won, payout, wager: coinWager });
      onGamble(coinWager, payout);
      setIsRolling(false);
    }, 900);
  };

  const handleWheelSpin = () => {
    if (isRolling || player.gold < wheelWager) return;
    setIsRolling(true);
    setGamblingResult(null);
    setTimeout(() => {
      const segment = spinWheel();
      const payout = wheelWager * segment.mult;
      setGamblingResult({ type: 'wheel', segment, payout, wager: wheelWager, won: segment.mult > 1 });
      onGamble(wheelWager, payout);
      setIsRolling(false);
    }, 1200);
  };

  const renderGambling = () => {
    const DICE_FACES = ['', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];

    return (
      <div className="tavern-gambling">
        <div className="gambling-header">
          <div className="gambling-title">
            <span className="gambling-title-icon">&#127922;</span>
            The Back Room
          </div>
          <div className="gambling-gold"><span className="gambling-gold-icon">&#9733;</span> {player.gold}g</div>
        </div>

        {/* Game selector */}
        <div className="gambling-game-tabs">
          {GAMBLING_GAMES.map(g => (
            <button
              key={g.id}
              className={`gambling-game-tab ${gamblingGame === g.id ? 'active' : ''}`}
              onClick={() => { setGamblingGame(g.id); setGamblingResult(null); }}
            >
              <span className="gambling-tab-icon">
                {g.id === 'dice' ? '\u{1F3B2}' : g.id === 'coin' ? '\u{1FA99}' : '\u{1F3A1}'}
              </span>
              {g.label}
            </button>
          ))}
        </div>

        {/* Dice Game */}
        {gamblingGame === 'dice' && (
          <div className="gambling-dice">
            <div className="gambling-desc">Roll 2 dice. Bet if the total is over or under 7. Exactly 7 = house wins.</div>
            <div className="gambling-controls">
              <div className="gambling-section-label">Wager</div>
              <div className="gambling-wager-row">
                {DICE_WAGERS.map(w => (
                  <button key={w} className={`gambling-wager-btn ${diceWager === w ? 'active' : ''}`} onClick={() => setDiceWager(w)} disabled={player.gold < w}>{w}g</button>
                ))}
              </div>
              <div className="gambling-section-label">Your Call</div>
              <div className="gambling-bet-row">
                <button className={`gambling-bet-btn-v2 ${diceBet === 'over' ? 'active over' : ''}`} onClick={() => setDiceBet('over')}>
                  <span className="bet-arrow">&#9650;</span> Over 7
                </button>
                <button className={`gambling-bet-btn-v2 ${diceBet === 'under' ? 'active under' : ''}`} onClick={() => setDiceBet('under')}>
                  <span className="bet-arrow">&#9660;</span> Under 7
                </button>
              </div>
              <div className="gambling-payout-row">
                <span className="gambling-payout-label">Payout</span>
                <span className="gambling-payout-value">{diceWager * 2}g (2x)</span>
              </div>
              <button className="gambling-action-btn" disabled={isRolling || player.gold < diceWager} onClick={handleDiceRoll}>
                {isRolling ? (
                  <span className="gambling-rolling">
                    <span className="gambling-rolling-dice">&#127922;</span> Rolling...
                  </span>
                ) : `Roll Dice (${diceWager}g)`}
              </button>
            </div>
            {/* Rolling dice animation */}
            {rollingDice && (
              <div className="gambling-rolling-area">
                <div className="gambling-rolling-dice-display">
                  <span className="gambling-die-rolling">{DICE_FACES[rollingDice.d1]}</span>
                  <span className="gambling-die-rolling">{DICE_FACES[rollingDice.d2]}</span>
                </div>
              </div>
            )}
            {gamblingResult?.type === 'dice' && (
              <div className={`gambling-result-v2 ${gamblingResult.won ? 'win' : 'lose'}`}>
                <div className="gambling-result-visual">
                  <span className="gambling-die-face">{DICE_FACES[gamblingResult.d1]}</span>
                  <span className="gambling-die-plus">+</span>
                  <span className="gambling-die-face">{DICE_FACES[gamblingResult.d2]}</span>
                  <span className="gambling-die-equals">=</span>
                  <span className="gambling-die-total">{gamblingResult.total}</span>
                </div>
                <div className="gambling-result-text-v2">
                  {gamblingResult.won ? (
                    <span className="gambling-win-text">&#10024; You won {gamblingResult.payout}g! &#10024;</span>
                  ) : gamblingResult.total === 7 ? (
                    <span className="gambling-lose-text">Exactly 7 &mdash; House wins!</span>
                  ) : (
                    <span className="gambling-lose-text">You lost {gamblingResult.wager}g</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coin Flip */}
        {gamblingGame === 'coin' && (
          <div className="gambling-coin">
            <div className="gambling-desc">Call heads or tails. Win pays 2x your wager.</div>
            <div className="gambling-controls">
              <div className="gambling-section-label">Wager</div>
              <div className="gambling-wager-row">
                {COIN_FLIP_WAGERS.map(w => (
                  <button key={w} className={`gambling-wager-btn ${coinWager === w ? 'active' : ''}`} onClick={() => setCoinWager(w)} disabled={player.gold < w}>{w}g</button>
                ))}
              </div>
              <div className="gambling-section-label">Your Call</div>
              <div className="gambling-bet-row">
                <button className={`gambling-bet-btn-v2 ${coinBet === 'heads' ? 'active heads' : ''}`} onClick={() => setCoinBet('heads')}>
                  <span className="coin-icon">&#9737;</span> Heads
                </button>
                <button className={`gambling-bet-btn-v2 ${coinBet === 'tails' ? 'active tails' : ''}`} onClick={() => setCoinBet('tails')}>
                  <span className="coin-icon">&#9738;</span> Tails
                </button>
              </div>
              <div className="gambling-payout-row">
                <span className="gambling-payout-label">Payout</span>
                <span className="gambling-payout-value">{coinWager * 2}g (2x)</span>
              </div>
              <button className="gambling-action-btn" disabled={isRolling || player.gold < coinWager} onClick={handleCoinFlip}>
                {isRolling ? (
                  <span className="gambling-rolling">
                    <span className="gambling-rolling-coin">&#129689;</span> Flipping...
                  </span>
                ) : `Flip Coin (${coinWager}g)`}
              </button>
            </div>
            {/* Coin spin animation */}
            {isRolling && gamblingGame === 'coin' && (
              <div className="gambling-coin-spinning-area">
                <div className="gambling-coin-spinner">
                  <div className="gambling-coin-spin-face">&#9733;</div>
                </div>
              </div>
            )}
            {gamblingResult?.type === 'coin' && (
              <div className={`gambling-result-v2 ${gamblingResult.won ? 'win' : 'lose'}`}>
                <div className="gambling-result-visual">
                  <div className="gambling-coin-display landed">
                    {gamblingResult.result === 'heads' ? '\u2609' : '\u260A'}
                  </div>
                  <div className="gambling-coin-label">{gamblingResult.result === 'heads' ? 'HEADS' : 'TAILS'}</div>
                </div>
                <div className="gambling-result-text-v2">
                  {gamblingResult.won ? (
                    <span className="gambling-win-text">&#10024; You won {gamblingResult.payout}g! &#10024;</span>
                  ) : (
                    <span className="gambling-lose-text">You lost {gamblingResult.wager}g</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wheel of Fortune */}
        {gamblingGame === 'wheel' && (
          <div className="gambling-wheel">
            <div className="gambling-desc">Spin the wheel! Land on a multiplier to win big.</div>
            {/* SVG Wheel */}
            <div className="gambling-wheel-visual">
              <svg viewBox="0 0 200 200" className={`gambling-wheel-svg ${isRolling ? 'spinning' : ''}`}>
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const total = WHEEL_SEGMENTS.length;
                  const angle = (360 / total);
                  const startAngle = i * angle - 90;
                  const endAngle = startAngle + angle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 100 + 85 * Math.cos(startRad);
                  const y1 = 100 + 85 * Math.sin(startRad);
                  const x2 = 100 + 85 * Math.cos(endRad);
                  const y2 = 100 + 85 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  const midRad = ((startAngle + angle / 2) * Math.PI) / 180;
                  const tx = 100 + 58 * Math.cos(midRad);
                  const ty = 100 + 58 * Math.sin(midRad);
                  const isHit = gamblingResult?.type === 'wheel' && gamblingResult.segment.label === seg.label && !isRolling;
                  return (
                    <g key={i}>
                      <path
                        d={`M100,100 L${x1},${y1} A85,85 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={isHit ? seg.color : `${seg.color}44`}
                        stroke={isHit ? '#fff' : '#333'}
                        strokeWidth={isHit ? 2 : 0.5}
                        opacity={isHit ? 1 : 0.7}
                      />
                      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                        fill="#fff" fontSize="11" fontFamily="'Press Start 2P', monospace"
                        style={{ textShadow: '0 1px 3px #000' }}>
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
                {/* Center */}
                <circle cx="100" cy="100" r="18" fill="#1a1a2e" stroke="#ffd700" strokeWidth="2" />
                <text x="100" y="103" textAnchor="middle" dominantBaseline="middle"
                  fill="#ffd700" fontSize="7" fontFamily="'Press Start 2P', monospace">
                  {isRolling ? '...' : 'SPIN'}
                </text>
              </svg>
              {/* Pointer */}
              <div className="gambling-wheel-pointer">&#9660;</div>
            </div>
            {/* Segment legend */}
            <div className="gambling-wheel-display">
              {WHEEL_SEGMENTS.map((seg, i) => (
                <div key={i}
                  className={`gambling-wheel-segment ${gamblingResult?.type === 'wheel' && gamblingResult.segment.label === seg.label && !isRolling ? 'hit' : ''}`}
                  style={{ '--seg-color': seg.color }}>
                  <span className="wheel-seg-mult">{seg.label}</span>
                  <span className="wheel-seg-chance">{seg.weight}%</span>
                </div>
              ))}
            </div>
            <div className="gambling-controls">
              <div className="gambling-section-label">Wager</div>
              <div className="gambling-wager-row">
                {WHEEL_WAGERS.map(w => (
                  <button key={w} className={`gambling-wager-btn ${wheelWager === w ? 'active' : ''}`} onClick={() => setWheelWager(w)} disabled={player.gold < w}>{w}g</button>
                ))}
              </div>
              <button className="gambling-action-btn wheel-btn" disabled={isRolling || player.gold < wheelWager} onClick={handleWheelSpin}>
                {isRolling ? (
                  <span className="gambling-rolling">
                    <span className="gambling-rolling-wheel">&#127905;</span> Spinning...
                  </span>
                ) : `Spin Wheel (${wheelWager}g)`}
              </button>
            </div>
            {gamblingResult?.type === 'wheel' && (
              <div className={`gambling-result-v2 ${gamblingResult.won ? 'win' : gamblingResult.segment.mult === 1 ? 'push' : 'lose'}`}>
                <div className="gambling-result-visual">
                  <div className="gambling-wheel-result-mult" style={{ color: gamblingResult.segment.color }}>
                    {gamblingResult.segment.label}
                  </div>
                </div>
                <div className="gambling-result-text-v2">
                  {gamblingResult.segment.mult === 0 ? (
                    <span className="gambling-lose-text">Bust! You lost {gamblingResult.wager}g!</span>
                  ) : gamblingResult.segment.mult === 1 ? (
                    <span className="gambling-push-text">Push! Got your {gamblingResult.wager}g back.</span>
                  ) : (
                    <span className="gambling-win-text">&#10024; You won {gamblingResult.payout}g! ({gamblingResult.segment.label}) &#10024;</span>
                  )}
                </div>
              </div>
            )}
          </div>
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
        {ALL_TAVERN_NPCS.map(npc => {
          const rep = tav.reputation[npc.id] || 0;
          const repInfo = getRepLevel(rep);
          const isEnchanter = npc.id === 'ember';
          const isGambler = npc.id === 'dealer';
          const isSpecialNpc = isEnchanter || isGambler;
          return (
            <button
              key={npc.id}
              className={`tavern-npc-card ${activeNpcId === npc.id ? 'active' : ''}`}
              onClick={() => handleSelectNpc(npc.id)}
            >
              {!isSpecialNpc && <NpcSprite npcId={npc.id} scale={3} />}
              {isEnchanter && (
                <svg viewBox="0 0 32 32" className="tavern-npc-ember-mini">
                  <circle cx="16" cy="12" r="8" fill="#c44000" />
                  <circle cx="16" cy="13" r="6" fill="#f0b888" />
                  <circle cx="13" cy="12" r="1" fill="#ff7043" />
                  <circle cx="19" cy="12" r="1" fill="#ff7043" />
                  <path d="M14 15 Q16 17 18 15" stroke="#c47060" strokeWidth="0.8" fill="none" />
                  <path d="M10 20 Q13 18 16 18 Q19 18 22 20 L24 28 L8 28Z" fill="#3a1a50" />
                  <circle cx="16" cy="26" r="2" fill="#ffd700" opacity="0.4">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}
              {isGambler && (
                <svg viewBox="0 0 32 32" className="tavern-npc-dealer-mini">
                  <circle cx="16" cy="11" r="7" fill="#2a2a3e" />
                  <circle cx="16" cy="13" r="6" fill="#d4a574" />
                  <circle cx="13" cy="12" r="1" fill="#1a1a2e" />
                  <circle cx="19" cy="12" r="1" fill="#1a1a2e" />
                  <path d="M14 15 Q16 16 18 15" stroke="#a0806a" strokeWidth="0.8" fill="none" />
                  <rect x="10" y="6" width="12" height="5" rx="2" fill="#1a1a2e" />
                  <rect x="11" y="10" width="10" height="1" fill="#ffd700" />
                  <path d="M10 20 Q13 18 16 18 Q19 18 22 20 L24 28 L8 28Z" fill="#1a2a1a" />
                  <circle cx="14" cy="24" r="1.5" fill="#ffd700" opacity="0.5">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="18" cy="22" r="1" fill="#ff6b6b" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}
              <span className="tavern-npc-name" style={{ color: npc.color }}>{npc.name}</span>
              <span className="tavern-npc-role">{npc.role}</span>
              {!isSpecialNpc && FACTIONS[npc.id] && <span className="tavern-npc-faction">{FACTIONS[npc.id].icon} {FACTIONS[npc.id].name}</span>}
              {!isSpecialNpc && <span className="tavern-npc-rep" style={{ color: npc.color }}>{repInfo.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Active NPC panel */}
      {activeNpc && (
        <div className="tavern-conversation">
          <div className={`tavern-conv-header ${isEmber ? 'ember-conv-header' : ''}`}>
            {isEmber ? <EmberSplash /> : <NpcSprite npcId={activeNpc.id} scale={5} />}
            <div className="tavern-conv-info">
              <div className="tavern-conv-name" style={{ color: activeNpc.color }}>{activeNpc.name}</div>
              <div className="tavern-conv-role">{activeNpc.role}</div>
              <RepBar rep={npcRep} npcColor={activeNpc.color} />
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="tavern-tabs">
            {activeTabs.map(tab => (
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
            {activeTab === 'talk' && isRegularNpc && activeNpcId === 'bartender' && renderRespec()}
            {activeTab === 'quests' && isRegularNpc && renderQuests()}
            {activeTab === 'bounties' && isRegularNpc && renderBounties()}
            {activeTab === 'faction' && isRegularNpc && renderFaction()}
            {activeTab === 'faction' && isRegularNpc && renderMercenaries()}
            {activeTab === 'shop' && isRegularNpc && renderShop()}
            {activeTab === 'enchant' && isEmber && renderEnchant()}
            {activeTab === 'gamble' && isDealer && renderGambling()}
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
