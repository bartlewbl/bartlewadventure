import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { getPlayerPassiveSkills, getPlayerActiveSkills, getTreeSkill } from '../../data/skillTrees';
import { getBattleMaxMana, getPlayerSpeed, PLAYER_CHANNEL_MANA_COST, getPlayerEvasion, getPlayerAccuracy, getPlayerResistance, getPlayerTenacity, getPlayerAggression, getPlayerLuck, getPlayerFortitude, getStanceModifiers, getComboProgress } from '../../engine/combat';
import { STANCES, UNIVERSAL_SKILLS } from '../../data/gameData';
import { SKILLS } from '../../data/gameData';
import { PET_MAX_BOND, PET_MAX_ENERGY } from '../../data/petData';
import useGameClock from '../../hooks/useGameClock';
import { ELEMENTS, getSkillElement, getWeatherSpellBuff, getWeatherSpellBuffList } from '../../engine/elements';

// Animation durations (must match GameCanvas.jsx)
const ANIM_MS = {
  'player-attack': 500,
  'player-defend': 400,
  'player-skill': 600,
  'player-heal': 450,
  'monster-attack': 500,
  'dodge': 450,
};

let floatIdCounter = 0;

export default function BattleScreen({
  battle, battleLog, player, pets,
  onAttack, onSkill, onDefend, onChannel, onPotion, onRun, onMonsterTurn,
  onTreeSkill, onToggleSkillMenu, onToggleInspect,
  onParry, onChangeStance, onUniversalSkill,
  setBattleAnim, animTick,
}) {
  const logRef = useRef(null);
  const pendingTurnRef = useRef(false);
  const battleRef = useRef(battle);
  const timeoutsRef = useRef([]);
  const prevLogLenRef = useRef(0);
  const [floatingTexts, setFloatingTexts] = useState([]);

  useEffect(() => { battleRef.current = battle; }, [battle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setBattleAnim(null);
    };
  }, [setBattleAnim]);

  // Safe timeout that auto-cleans
  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter(t => t !== id);
      fn();
    }, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Detect new log entries and create floating damage numbers
  useEffect(() => {
    if (battleLog.length > prevLogLenRef.current) {
      const newEntries = battleLog.slice(prevLogLenRef.current);
      const newFloats = [];

      for (const entry of newEntries) {
        const dmgMatch = entry.text.match(/(\d+)\s*damage/i);
        const healMatch = entry.text.match(/heal(?:ed|s)?\s*(\d+)/i) || entry.text.match(/restore(?:s)?\s*(\d+)/i);
        const drainMatch = entry.text.match(/drain(?:ed)?\s*(\d+)/i);
        const absorbMatch = entry.text.match(/absorb(?:s)?\s*(\d+)/i);

        if (dmgMatch) {
          const isPlayerDmg = entry.type === 'dmg-player';
          newFloats.push({
            id: ++floatIdCounter,
            text: dmgMatch[1],
            type: entry.type,
            x: isPlayerDmg ? 22 : 72,
            y: isPlayerDmg ? 35 : 28,
          });
        }
        if (healMatch) {
          newFloats.push({
            id: ++floatIdCounter,
            text: '+' + healMatch[1],
            type: 'heal',
            x: 22,
            y: 35,
          });
        }
        if (drainMatch) {
          newFloats.push({
            id: ++floatIdCounter,
            text: '+' + drainMatch[1],
            type: 'heal',
            x: 72,
            y: 28,
          });
        }
        if (absorbMatch) {
          newFloats.push({
            id: ++floatIdCounter,
            text: absorbMatch[1],
            type: 'absorb',
            x: 22,
            y: 35,
          });
        }
      }

      if (newFloats.length > 0) {
        setFloatingTexts(prev => [...prev, ...newFloats]);
        // Remove after animation
        const ids = newFloats.map(f => f.id);
        safeTimeout(() => {
          setFloatingTexts(prev => prev.filter(f => !ids.includes(f.id)));
        }, 1100);
      }
    }
    prevLogLenRef.current = battleLog.length;
  }, [battleLog, safeTimeout]);

  // Determine if monster dodged or was dodged after monster turn
  const getMonsterAnimType = useCallback(() => {
    // Check last few log entries for dodge
    const recent = battleLog.slice(-4);
    const dodged = recent.some(e =>
      e.text.toLowerCase().includes('dodg') ||
      e.text.toLowerCase().includes('evade') ||
      e.text.toLowerCase().includes('miss')
    );
    return dodged ? 'dodge' : 'monster-attack';
  }, [battleLog]);

  const handlePlayerAction = useCallback((actionFn, animType = 'player-attack') => {
    if (!battle?.isPlayerTurn || pendingTurnRef.current) return;
    pendingTurnRef.current = true;

    // Start player animation
    setBattleAnim({ type: animType, startTime: performance.now() });

    // Apply game action immediately
    actionFn();

    // After player animation, play monster response
    const playerDuration = ANIM_MS[animType] || 500;
    safeTimeout(() => {
      const currentBattle = battleRef.current;
      // Don't animate monster turn if battle already ended
      if (!currentBattle?.monster || currentBattle.monster.hp <= 0) {
        pendingTurnRef.current = false;
        setBattleAnim(null);
        return;
      }

      // Monster turn
      onMonsterTurn();

      // Determine and play monster animation
      safeTimeout(() => {
        const mAnimType = getMonsterAnimType();
        setBattleAnim({ type: mAnimType, startTime: performance.now() });

        // Clear animation after it plays
        const monsterDuration = ANIM_MS[mAnimType] || 500;
        safeTimeout(() => {
          setBattleAnim(null);
          pendingTurnRef.current = false;
        }, monsterDuration);
      }, 30);
    }, playerDuration + 50);
  }, [battle?.isPlayerTurn, onMonsterTurn, setBattleAnim, safeTimeout, getMonsterAnimType]);

  const handleRun = useCallback(() => {
    if (!battle?.isPlayerTurn || pendingTurnRef.current) return;
    onRun();
  }, [battle?.isPlayerTurn, onRun]);

  const handleDefend = useCallback(() => {
    if (!battle?.isPlayerTurn || pendingTurnRef.current) return;
    pendingTurnRef.current = true;

    // Shield animation
    setBattleAnim({ type: 'player-defend', startTime: performance.now() });
    onDefend();

    const playerDuration = ANIM_MS['player-defend'];
    safeTimeout(() => {
      const currentBattle = battleRef.current;
      if (!currentBattle?.monster || currentBattle.monster.hp <= 0) {
        pendingTurnRef.current = false;
        setBattleAnim(null);
        return;
      }

      onMonsterTurn();

      safeTimeout(() => {
        const mAnimType = getMonsterAnimType();
        setBattleAnim({ type: mAnimType, startTime: performance.now() });

        const monsterDuration = ANIM_MS[mAnimType] || 500;
        safeTimeout(() => {
          setBattleAnim(null);
          pendingTurnRef.current = false;
        }, monsterDuration);
      }, 30);
    }, playerDuration + 50);
  }, [battle?.isPlayerTurn, onDefend, onMonsterTurn, setBattleAnim, safeTimeout, getMonsterAnimType]);

  const handleTreeSkill = useCallback((skillId) => {
    if (!battle?.isPlayerTurn || pendingTurnRef.current) return;
    pendingTurnRef.current = true;

    // Magic skill animation
    setBattleAnim({ type: 'player-skill', startTime: performance.now() });
    onTreeSkill(skillId);

    const playerDuration = ANIM_MS['player-skill'];
    safeTimeout(() => {
      const currentBattle = battleRef.current;
      if (!currentBattle?.monster || currentBattle.monster.hp <= 0) {
        pendingTurnRef.current = false;
        setBattleAnim(null);
        return;
      }

      onMonsterTurn();

      safeTimeout(() => {
        const mAnimType = getMonsterAnimType();
        setBattleAnim({ type: mAnimType, startTime: performance.now() });

        const monsterDuration = ANIM_MS[mAnimType] || 500;
        safeTimeout(() => {
          setBattleAnim(null);
          pendingTurnRef.current = false;
        }, monsterDuration);
      }, 30);
    }, playerDuration + 50);
  }, [battle?.isPlayerTurn, onTreeSkill, onMonsterTurn, setBattleAnim, safeTimeout, getMonsterAnimType]);

  const handleClassSkill = useCallback(() => {
    handlePlayerAction(onSkill, 'player-skill');
  }, [handlePlayerAction, onSkill]);

  const handlePotion = useCallback(() => {
    handlePlayerAction(onPotion, 'player-heal');
  }, [handlePlayerAction, onPotion]);

  const handleChannel = useCallback(() => {
    handlePlayerAction(onChannel, 'player-skill');
  }, [handlePlayerAction, onChannel]);

  if (!battle?.monster) return null;
  const m = battle.monster;
  const mHpPct = (m.hp / m.maxHp) * 100;
  const pHpPct = (player.hp / player.maxHp) * 100;
  const disabled = !battle.isPlayerTurn || pendingTurnRef.current;
  const isBoss = !!m.isBoss;
  const showSkillMenu = battle.showSkillMenu;
  const showInspect = battle.showInspect;

  const passives = getPlayerPassiveSkills(player);
  const activeSkills = getPlayerActiveSkills(player);
  const treeActives = activeSkills.filter(s => !s.isClassSkill);

  const clock = useGameClock();
  const weatherBuffs = useMemo(() => getWeatherSpellBuffList(clock.weather.id), [clock.weather.id]);

  // Equipped pets
  const equippedPets = useMemo(() => {
    const equippedIds = pets?.equippedPets || [];
    const owned = pets?.ownedPets || [];
    return equippedIds.map(id => owned.find(p => p.instanceId === id)).filter(Boolean);
  }, [pets]);

  const ROLE_ICONS = { attacker: '\u2694', defender: '\u26E8', healer: '\u2661', buffer: '\u2606', hybrid: '\u269B' };

  const hasMonsterDebuffs = battle.monsterPoisonTurns > 0 || battle.monsterDoomTurns > 0 ||
    battle.monsterStunTurns > 0 || battle.monsterConfusionTurns > 0 || battle.armorShatterTurns > 0;
  const hasPlayerBuffsDebuffs = battle.poisonTurns > 0 || battle.atkDebuff > 0 || battle.defDebuff > 0 ||
    battle.dodgeNextTurn || battle.dodgeCharges > 0 || battle.avatarTurns > 0 || battle.defending ||
    battle.playerStunTurns > 0 || battle.playerConfusionTurns > 0 || battle.fortitudeUsed ||
    battle.parrying || battle.warShoutTurns > 0 || battle.elementalWardTurns > 0 ||
    battle.frenzyBonusTurns > 0 || battle.playerInvulnTurns > 0 || battle.guaranteedCrit ||
    battle.lastStandUsed || battle.limitBreakUsed;
  const hasAlerts = battle.monsterChanneling || battle.playerChannelBonusActive || battle.playerChanneling ||
    (battle.gimmick && isBoss);
  const comboProgress = battle.actionHistory?.length > 0 ? getComboProgress(battle.actionHistory) : [];

  return (
    <div className="screen screen-battle">
      {/* Floating damage numbers */}
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          className={`floating-damage floating-${ft.type}`}
          style={{ left: ft.x + '%', top: ft.y + '%' }}
        >
          {ft.text}
        </div>
      ))}

      {/* === TOP BAR: Turn indicator + Mana === */}
      <div className="battle-top-bar">
        <div className={`turn-indicator ${battle.isPlayerTurn && !pendingTurnRef.current ? 'your-turn' : 'enemy-turn'}`}>
          {battle.isPlayerTurn && !pendingTurnRef.current ? 'YOUR TURN' : 'ENEMY TURN'}
        </div>
        <div className="battle-mana-display">
          Mana: {player.mana}/{getBattleMaxMana(player)}
        </div>
      </div>

      {/* === COMBATANTS: Player vs Monster === */}
      <div className="battle-combatants">
        {/* Player side */}
        <div className="battle-combatant battle-player-side">
          <span className="combatant-name player-name-tag">{player.name} Lv.{player.level}</span>
          <div className="stat-bar">
            <span className="bar-label">HP</span>
            <div className="bar hp-bar">
              <div className="bar-fill" style={{ width: pHpPct + '%' }} />
            </div>
            <span className="bar-text">{player.hp}/{player.maxHp}</span>
          </div>
          {/* Pet companion under player */}
          {equippedPets.length > 0 && (() => {
            const pet = equippedPets[0];
            return (
              <div className="battle-pets">
                <div className={`battle-pet-tag active-pet ${pet.energy <= 0 ? 'exhausted' : ''} ${pet.bond < 30 ? 'low-bond' : ''}`}>
                  <span className="battle-pet-icon">{ROLE_ICONS[pet.role] || ''}</span>
                  <span className="battle-pet-name">{pet.name}</span>
                  <span className="battle-pet-stats">B:{pet.bond} E:{pet.energy}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* VS indicator */}
        <div className="battle-vs">VS</div>

        {/* Monster side */}
        <div className="battle-combatant battle-monster-side">
          <div className="monster-header">
            {isBoss && <span className="boss-badge">BOSS</span>}
            <span className={`combatant-name ${isBoss ? 'boss-name' : 'monster-name-tag'}`}>
              {m.name} (Lv.{m.level})
            </span>
          </div>
          {isBoss && m.title && <div className="boss-subtitle">{m.title}</div>}
          {battle.monsterElement && battle.monsterElement !== 'physical' && (
            <div className={`monster-element element-${battle.monsterElement}`}>
              {ELEMENTS[battle.monsterElement]?.icon} {ELEMENTS[battle.monsterElement]?.label}
            </div>
          )}
          <div className="stat-bar">
            <span className="bar-label">HP</span>
            <div className={`bar hp-bar monster ${isBoss ? 'boss-hp' : ''}`}>
              <div className="bar-fill" style={{ width: mHpPct + '%' }} />
            </div>
            <span className="bar-text">{m.hp}/{m.maxHp}</span>
          </div>
        </div>
      </div>

      {/* === STATUS PANEL: Debuffs on both sides === */}
      {(hasMonsterDebuffs || hasPlayerBuffsDebuffs) && (
        <div className="battle-status-row">
          <div className="battle-debuffs-monster">
            {battle.monsterPoisonTurns > 0 && (
              <span className="battle-debuff poison">Poison ({battle.monsterPoisonTurns})</span>
            )}
            {battle.monsterDoomTurns > 0 && (
              <span className="battle-debuff doom">Doom ({battle.monsterDoomTurns})</span>
            )}
            {battle.monsterStunTurns > 0 && (
              <span className="battle-debuff stun">Stunned ({battle.monsterStunTurns})</span>
            )}
            {battle.monsterConfusionTurns > 0 && (
              <span className="battle-debuff confusion">Confused ({battle.monsterConfusionTurns})</span>
            )}
            {battle.armorShatterTurns > 0 && (
              <span className="battle-debuff debuff">Armor Broken ({battle.armorShatterTurns})</span>
            )}
          </div>
          <div className="battle-debuffs-player">
            {battle.poisonTurns > 0 && (
              <span className="battle-debuff poison">Poisoned ({battle.poisonTurns})</span>
            )}
            {battle.atkDebuff > 0 && (
              <span className="battle-debuff debuff">ATK -{battle.atkDebuff}</span>
            )}
            {battle.defDebuff > 0 && (
              <span className="battle-debuff debuff">DEF -{battle.defDebuff}</span>
            )}
            {battle.dodgeNextTurn && (
              <span className="battle-debuff buff">Dodge Ready</span>
            )}
            {battle.dodgeCharges > 0 && (
              <span className="battle-debuff buff">Dodge x{battle.dodgeCharges}</span>
            )}
            {battle.avatarTurns > 0 && (
              <span className="battle-debuff buff">Avatar ({battle.avatarTurns})</span>
            )}
            {battle.defending && (
              <span className="battle-debuff buff">Defending</span>
            )}
            {battle.playerStunTurns > 0 && (
              <span className="battle-debuff stun">Stunned ({battle.playerStunTurns})</span>
            )}
            {battle.playerConfusionTurns > 0 && (
              <span className="battle-debuff confusion">Confused ({battle.playerConfusionTurns})</span>
            )}
            {battle.fortitudeUsed && (
              <span className="battle-debuff used">Grit Used</span>
            )}
            {battle.parrying && (
              <span className="battle-debuff buff">Parrying</span>
            )}
            {battle.warShoutTurns > 0 && (
              <span className="battle-debuff buff">War Shout ({battle.warShoutTurns})</span>
            )}
            {battle.elementalWardTurns > 0 && (
              <span className="battle-debuff buff">Elem Ward ({battle.elementalWardTurns})</span>
            )}
            {battle.frenzyBonusTurns > 0 && (
              <span className="battle-debuff buff">Frenzy ({battle.frenzyBonusTurns})</span>
            )}
            {battle.playerInvulnTurns > 0 && (
              <span className="battle-debuff buff">Invulnerable ({battle.playerInvulnTurns})</span>
            )}
            {battle.guaranteedCrit && (
              <span className="battle-debuff buff">Crit Ready!</span>
            )}
            {battle.lastStandUsed && (
              <span className="battle-debuff used">Last Stand Used</span>
            )}
            {battle.limitBreakUsed && (
              <span className="battle-debuff used">Limit Break Used</span>
            )}
          </div>
        </div>
      )}

      {/* === ALERTS: Channel warnings, gimmicks, enemy intent === */}
      {(hasAlerts || (battle.playerIsFaster && battle.monsterNextMove && battle.isPlayerTurn)) && (
        <div className="battle-alerts">
          {battle.monsterChanneling && (
            <div className="battle-channel-warning">
              <span className="channel-pulse">{m.name} is channeling!</span>
              <span className="channel-turns">{battle.monsterChannelTurns}t until unleash</span>
            </div>
          )}
          {battle.playerChannelBonusActive && (
            <div className="battle-channel-ready">
              Channeled! Next attack deals 2x damage
            </div>
          )}
          {battle.playerChanneling && (
            <div className="battle-channel-active">
              Channeling energy...
            </div>
          )}
          {battle.gimmick && isBoss && (
            <div className={`battle-gimmick ${battle.gimmickActive ? 'gimmick-active' : 'gimmick-pending'}`}>
              <span className="gimmick-icon">{battle.gimmickActive ? '!' : '?'}</span>
              <span className="gimmick-name">{battle.gimmick.name}</span>
              {!battle.gimmickActive && <span className="gimmick-hint">at {Math.round(battle.gimmick.triggerHpPct * 100)}% HP</span>}
              {battle.gimmickActive && <span className="gimmick-desc">{battle.gimmick.desc}</span>}
            </div>
          )}
          {battle.playerIsFaster && battle.monsterNextMove && battle.isPlayerTurn && (
            <div className="battle-enemy-intent">
              <span className="intent-label">Intent:</span>
              <span className={`intent-action intent-${battle.monsterNextMove.type}`}>
                {battle.monsterNextMove.name}
                {battle.monsterNextMove.type === 'channel' && ' (Charging!)'}
                {battle.monsterNextMove.type === 'unleash' && ' (UNLEASH!)'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* === COMBAT INFO: Speed, Stance, Momentum, Combos, Weather, Passives === */}
      <div className="battle-combat-info">
        {/* Speed comparison */}
        <div className="battle-speed-bar">
          <span className={`speed-tag ${battle.playerIsFaster ? 'speed-advantage' : ''}`}>
            SPD {battle.playerSpeed || '?'}
          </span>
          <span className="speed-vs">vs</span>
          <span className={`speed-tag ${!battle.playerIsFaster ? 'speed-advantage' : ''}`}>
            SPD {battle.monsterSpeed || '?'}
          </span>
          {battle.playerIsFaster && <span className="speed-bonus-label">First!</span>}
        </div>

        {/* Stance selector */}
        <div className="battle-stance-bar">
          {Object.entries(STANCES).map(([id, stance]) => (
            <button
              key={id}
              className={`stance-btn ${battle.stance === id ? 'stance-active' : ''}`}
              onClick={() => onChangeStance(id)}
              disabled={disabled || battle.stance === id}
              title={`${stance.name}: DMG ${Math.round(stance.dmgDealt * 100)}% / Taken ${Math.round(stance.dmgTaken * 100)}%`}
            >
              {stance.name}
            </button>
          ))}
        </div>

        {/* Momentum bar */}
        {battle.stanceMomentum > 0 && battle.stance !== 'balanced' && (
          <div className="battle-momentum-bar">
            <span className="momentum-label">Momentum:</span>
            <div className="momentum-fill-track">
              <div className="momentum-fill" style={{ width: `${Math.min(100, (battle.stanceMomentum / 0.3) * 100)}%` }} />
            </div>
            <span className="momentum-pct">+{Math.round(battle.stanceMomentum * 100)}%</span>
          </div>
        )}

        {/* Combo display */}
        {battle.activeCombo && (
          <div className="battle-combo-display">
            <span className="combo-label">COMBO:</span>
            <span className="combo-name">{battle.activeCombo.name}</span>
            {battle.comboStreak > 1 && <span className="combo-streak">x{battle.comboStreak}</span>}
          </div>
        )}
        {comboProgress.length > 0 && (
          <div className="battle-combo-progress">
            {comboProgress.map(cp => (
              <span key={cp.id} className="combo-progress-item" title={`Next: ${cp.nextAction}`}>
                {cp.name} ({cp.current}/{cp.total})
              </span>
            ))}
          </div>
        )}
        {battle.comboBleedTurns > 0 && (
          <div className="battle-combo-bleed">
            <span className="bleed-label">Bleeding ({battle.comboBleedTurns})</span>
          </div>
        )}

        {/* Weather buffs */}
        {weatherBuffs.length > 0 && (
          <div className="battle-weather-bar">
            <span className="battle-weather-icon">{clock.weather.icon}</span>
            {weatherBuffs.map((wb, i) => (
              <span key={i} className={`battle-weather-buff ${wb.positive ? 'buff' : 'debuff'}`}>
                {wb.element.icon} {wb.label}
              </span>
            ))}
          </div>
        )}

        {/* Passives */}
        {passives.length > 0 && (
          <div className="battle-passives">
            <span className="battle-passives-label">Passives:</span>
            {passives.map(p => (
              <span key={p.id} className="battle-passive-tag" title={p.desc}>
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* === BATTLE LOG === */}
      <div className="battle-log" ref={logRef}>
        {battleLog.map((entry, i) => (
          <div key={i} className={`log-${entry.type}`}>{entry.text}</div>
        ))}
      </div>

      {/* === ACTION BUTTONS === */}
      {showInspect ? (
        <div className="battle-actions battle-inspect-panel">
          <div className="inspect-stats">
            <div className="inspect-title">{m.name} {isBoss ? '(BOSS)' : ''}</div>
            <div className="inspect-row"><span className="inspect-label">Level:</span> <span className="inspect-value">{m.level}</span></div>
            <div className="inspect-row"><span className="inspect-label">HP:</span> <span className="inspect-value">{m.hp} / {m.maxHp}</span></div>
            <div className="inspect-row"><span className="inspect-label">ATK:</span> <span className="inspect-value">{m.atk}</span></div>
            <div className="inspect-row"><span className="inspect-label">DEF:</span> <span className="inspect-value">{m.def}</span></div>
            <div className="inspect-row"><span className="inspect-label">SPD:</span> <span className="inspect-value">{m.speed || '?'}</span></div>
            <div className="inspect-row"><span className="inspect-label">EVA/ACC:</span> <span className="inspect-value">{m.evasion || 0}/{m.accuracy || 0}</span></div>
            <div className="inspect-row"><span className="inspect-label">RES/TEN:</span> <span className="inspect-value">{m.resistance || 0}/{m.tenacity || 0}</span></div>
            <div className="inspect-row"><span className="inspect-label">AGR/LCK:</span> <span className="inspect-value">{m.aggression || 0}/{m.luck || 0}</span></div>
            <div className="inspect-row"><span className="inspect-label">GRT:</span> <span className="inspect-value">{m.fortitude || 0}</span></div>
            {battle.monsterElement && battle.monsterElement !== 'physical' && (
              <div className="inspect-row"><span className="inspect-label">Element:</span> <span className="inspect-value">{ELEMENTS[battle.monsterElement]?.icon} {ELEMENTS[battle.monsterElement]?.label}</span></div>
            )}
            {battle.monsterChanneling && (
              <div className="inspect-row"><span className="inspect-label">Status:</span> <span className="inspect-value status-channel">Channeling ({battle.monsterChannelTurns} turns)</span></div>
            )}
            {isBoss && battle.gimmick && (
              <div className="inspect-row"><span className="inspect-label">Gimmick:</span> <span className="inspect-value">{battle.gimmick.name} {battle.gimmickActive ? '(ACTIVE)' : `(at ${Math.round(battle.gimmick.triggerHpPct * 100)}% HP)`}</span></div>
            )}
            <div className="inspect-row"><span className="inspect-label">Skills:</span> <span className="inspect-value">{m.skills?.length > 0 ? m.skills.map(s => {
              const sk = SKILLS[s];
              return sk ? sk.name : s;
            }).join(', ') : 'None'}</span></div>
            {battle.monsterPoisonTurns > 0 && (
              <div className="inspect-row"><span className="inspect-label">Status:</span> <span className="inspect-value status-poison">Poisoned ({battle.monsterPoisonTurns})</span></div>
            )}
            {battle.monsterDoomTurns > 0 && (
              <div className="inspect-row"><span className="inspect-label">Status:</span> <span className="inspect-value status-doom">Doomed ({battle.monsterDoomTurns})</span></div>
            )}
            {battle.armorBreakTurns > 0 && (
              <div className="inspect-row"><span className="inspect-label">Status:</span> <span className="inspect-value status-debuff">Armor Broken ({battle.armorBreakTurns})</span></div>
            )}
          </div>
          <button className="btn btn-back btn-sm" onClick={onToggleInspect}>
            Back
          </button>
        </div>
      ) : showSkillMenu ? (
        <div className="battle-actions battle-skill-menu">
          {activeSkills.map(skill => {
            const elemId = getSkillElement(skill.isClassSkill ? null : skill.id, player.characterClass);
            const elem = ELEMENTS[elemId];
            const wb = getWeatherSpellBuff(clock.weather.id, elemId);
            const buffPct = wb !== 1.0 ? Math.round((wb - 1) * 100) : 0;
            return (
              <button
                key={skill.id}
                className={`btn btn-skill ${buffPct > 0 ? 'weather-boosted' : buffPct < 0 ? 'weather-weakened' : ''}`}
                disabled={disabled || player.mana < (skill.manaCost || 0)}
                onClick={() => {
                  if (skill.isClassSkill) {
                    handleClassSkill();
                  } else {
                    handleTreeSkill(skill.id);
                  }
                }}
                title={`${skill.desc}${buffPct ? ` [${buffPct > 0 ? '+' : ''}${buffPct}% weather]` : ''}`}
              >
                <span className="skill-btn-name">
                  {elem && elemId !== 'physical' && <span className="skill-element-icon">{elem.icon}</span>}
                  {skill.name}
                </span>
                <span className="skill-btn-meta">
                  <span className="skill-btn-cost">{skill.manaCost || 0}mp</span>
                  {buffPct !== 0 && (
                    <span className={`skill-weather-mod ${buffPct > 0 ? 'buff' : 'debuff'}`}>
                      {buffPct > 0 ? '+' : ''}{buffPct}%
                    </span>
                  )}
                </span>
              </button>
            );
          })}
          {/* Universal combat skills */}
          {player.unlockedUniversalSkills?.filter(id => id !== 'parry').map(skillId => {
            const uSkill = UNIVERSAL_SKILLS[skillId];
            if (!uSkill) return null;
            const cd = battle.universalCooldowns?.[skillId] || 0;
            const isOnceUsed = (skillId === 'last_stand' && battle.lastStandUsed) || (skillId === 'limit_break' && battle.limitBreakUsed);
            return (
              <button
                key={skillId}
                className={`btn btn-universal-skill ${cd > 0 ? 'on-cooldown' : ''} ${isOnceUsed ? 'used-once' : ''}`}
                disabled={disabled || player.mana < (uSkill.manaCost || 0) || cd > 0 || isOnceUsed}
                onClick={() => handlePlayerAction(() => onUniversalSkill(skillId), 'player-skill')}
                title={`${uSkill.name}${cd > 0 ? ` (CD: ${cd})` : ''}${isOnceUsed ? ' (Used)' : ''}`}
              >
                <span className="skill-btn-name">{uSkill.name}</span>
                <span className="skill-btn-meta">
                  <span className="skill-btn-cost">{uSkill.manaCost || 0}mp</span>
                  {cd > 0 && <span className="skill-cooldown-badge">CD:{cd}</span>}
                  {isOnceUsed && <span className="skill-cooldown-badge">Used</span>}
                </span>
              </button>
            );
          })}
          <button className="btn btn-back btn-sm" disabled={disabled} onClick={onToggleSkillMenu}>
            Back
          </button>
        </div>
      ) : (
        <div className="battle-actions">
          <button
            className="btn btn-battle-attack"
            disabled={disabled}
            onClick={() => handlePlayerAction(onAttack, 'player-attack')}
          >
            Attack
          </button>
          <button
            className="btn btn-battle-defend"
            disabled={disabled}
            onClick={handleDefend}
          >
            Defend
          </button>
          <button
            className="btn btn-skills-toggle"
            disabled={disabled}
            onClick={treeActives.length > 0 ? onToggleSkillMenu : handleClassSkill}
          >
            {treeActives.length > 0 ? 'Skills' : (activeSkills[0]?.name || 'Skill')}
          </button>
          <button
            className="btn btn-battle-channel"
            disabled={disabled || player.mana < PLAYER_CHANNEL_MANA_COST || battle.playerChanneling || battle.playerChannelBonusActive}
            onClick={handleChannel}
            title={`Channel energy for 2x damage on next attack (${PLAYER_CHANNEL_MANA_COST} mana)`}
          >
            {battle.playerChannelBonusActive ? 'Charged!' : 'Channel'}
          </button>
          {player.unlockedUniversalSkills?.includes('parry') && (
            <button
              className="btn btn-battle-parry"
              disabled={disabled || player.mana < (UNIVERSAL_SKILLS.parry?.manaCost || 5)}
              onClick={() => handlePlayerAction(onParry, 'player-defend')}
              title={`Parry: Block 80% damage and counter (${UNIVERSAL_SKILLS.parry?.manaCost || 5} mana)`}
            >
              Parry
            </button>
          )}
          <button
            className="btn btn-battle-inspect"
            disabled={disabled}
            onClick={onToggleInspect}
          >
            Inspect
          </button>
          <button
            className="btn btn-battle-heal"
            disabled={disabled}
            onClick={handlePotion}
          >
            Potion
          </button>
          <button className="btn btn-back" disabled={disabled || battle.noRun} onClick={handleRun}>
            {isBoss ? (battle.noRun ? 'Trapped!' : 'No Escape') : (battle.noRun ? 'Trapped!' : 'Run')}
          </button>
        </div>
      )}
    </div>
  );
}
