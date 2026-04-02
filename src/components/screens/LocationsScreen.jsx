import { useState } from 'react';
import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
} from '../../data/tasks';
import { MONSTERS, BOSSES, SPECIAL_LOCATIONS } from '../../data/gameData';
import { MATERIAL_DROP_CONFIG, BUILDING_MATERIALS } from '../../data/baseData';
import { ARENA_TIERS, getMinWager } from '../../engine/arena';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function findQuestById(id, playerLevel) {
  const allQuests = [
    ...TUTORIAL_QUESTS,
    ...STORY_MISSIONS,
    ...STORY_TASKS,
    ...getActiveDailyTasks(Date.now(), playerLevel || 1),
    ...getActiveWeeklyTasks(Date.now(), playerLevel || 1),
    ...SIDE_QUEST_CHAINS.flatMap(c => c.quests),
  ];
  return allQuests.find(q => q.id === id) || null;
}

function isQuestClaimed(id, tasks) {
  return (tasks.tutorialClaimed || []).includes(id)
    || (tasks.missionClaimed || []).includes(id)
    || (tasks.storyClaimed || []).includes(id)
    || (tasks.dailyClaimed || []).includes(id)
    || (tasks.weeklyClaimed || []).includes(id)
    || (tasks.sideQuestClaimed || []).includes(id);
}

function PinnedQuestTracker({ pinnedQuests, stats, tasks, playerLevel }) {
  if (!pinnedQuests || pinnedQuests.length === 0) return null;

  const activeQuests = pinnedQuests
    .map(id => {
      const quest = findQuestById(id, playerLevel);
      if (!quest || isQuestClaimed(id, tasks)) return null;
      return quest;
    })
    .filter(Boolean);

  if (activeQuests.length === 0) return null;

  return (
    <div className="pinned-quest-tracker">
      <div className="pinned-quest-header">Tracked Quests</div>
      {activeQuests.map(quest => {
        const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
        const pct = Math.min(100, Math.floor((progress / quest.target) * 100));
        const complete = progress >= quest.target;
        return (
          <div key={quest.id} className={`pinned-quest-item ${complete ? 'complete' : ''}`}>
            <div className="pinned-quest-name">{quest.name}</div>
            <div className="pinned-quest-bar">
              <div className="pinned-quest-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="pinned-quest-count">
              {formatNumber(Math.min(progress, quest.target))}/{formatNumber(quest.target)}
              {complete && ' \u2713'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const RARITY_COLORS = {
  Common: '#aaa',
  Uncommon: '#4fc3f7',
  Rare: '#ffd740',
  Epic: '#ce93d8',
  Legendary: '#ff8a65',
};

function LocationSpawnInfo({ location, regionId }) {
  const monsterNames = location.monsters.map(id => {
    const m = MONSTERS[id];
    return m ? m.name : id;
  });

  const boss = location.boss && BOSSES[location.boss];

  const materialConfig = MATERIAL_DROP_CONFIG[regionId];
  const materials = materialConfig
    ? materialConfig.materials.map(m => {
        const mat = BUILDING_MATERIALS[m.id];
        return mat ? { name: mat.name, rarity: mat.rarity } : null;
      }).filter(Boolean)
    : [];

  return (
    <div className="location-spawn-info">
      <div className="spawn-section">
        <div className="spawn-label">Enemies</div>
        <div className="spawn-tags">
          {monsterNames.map((name, i) => (
            <span key={i} className="spawn-tag enemy-tag">{name}</span>
          ))}
        </div>
      </div>
      {boss && (
        <div className="spawn-section">
          <div className="spawn-label">Boss</div>
          <div className="spawn-tags">
            <span className="spawn-tag boss-tag">{boss.name}{boss.title ? ` — ${boss.title}` : ''}</span>
          </div>
        </div>
      )}
      {materials.length > 0 && (
        <div className="spawn-section">
          <div className="spawn-label">Materials ({Math.round(materialConfig.dropRate * 100)}% drop)</div>
          <div className="spawn-tags">
            {materials.map((mat, i) => (
              <span
                key={i}
                className="spawn-tag material-tag"
                style={{ color: RARITY_COLORS[mat.rarity] || '#aaa' }}
              >
                {mat.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationList({ locations, playerLevel, availableEnergy, requiredEnergy, expandedId, setExpandedId, onSelect, regionId }) {
  return (
    <div className="location-list">
      {locations.map(loc => {
        const needsLevel = playerLevel < loc.levelReq;
        const needsEnergy = availableEnergy < requiredEnergy;
        const locked = needsLevel || needsEnergy;
        const expanded = expandedId === loc.id;
        return (
          <div key={loc.id} className="location-entry">
            <button
              className={`location-item ${locked ? 'locked' : ''} ${loc.special ? 'special' : ''}`}
              onClick={() => !locked && onSelect(loc)}
              disabled={locked}
            >
              <div className="location-item-left">
                <div className="location-name">
                  {loc.special && <span className="special-location-icon">*</span>}
                  {loc.name}
                  <span
                    className={`location-info-btn ${expanded ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setExpandedId(expanded ? null : loc.id);
                    }}
                    title="View spawn info"
                  >?</span>
                </div>
                <div className="location-desc">{loc.description}</div>
                {loc.special && loc.levelRange && (
                  <div className="location-special-info">
                    Random encounters Lv.{Math.max(1, loc.levelReq + loc.levelRange[0])}-{loc.levelReq + loc.levelRange[1]} · Rare loot x{loc.rareLootBonus}
                  </div>
                )}
                {(needsLevel || needsEnergy) && (
                  <div className="location-req">
                    {needsLevel ? `Lv.${loc.levelReq}+ required` : `Need ${requiredEnergy} energy`}
                  </div>
                )}
              </div>
              <div className="location-level">
                Lv.{loc.levelReq}+
              </div>
            </button>
            {expanded && (
              <LocationSpawnInfo location={loc} regionId={regionId} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ArenaPanel({ player, arenaState, onStartDuel, onGauntletContinue, onGauntletCashout }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [wager, setWager] = useState('');
  const minWager = getMinWager(player.level);

  const handleStartDuel = (tier) => {
    if (tier.id === 'highstakes') {
      if (player.gold < minWager) return;
      onStartDuel(tier.id, player.gold);
      return;
    }
    const wagerAmount = parseInt(wager, 10);
    if (isNaN(wagerAmount) || wagerAmount < minWager || wagerAmount > player.gold) return;
    onStartDuel(tier.id, wagerAmount);
  };

  // Gauntlet continue / cashout screen
  if (arenaState?.gauntletActive) {
    const currentWinnings = arenaState.gauntletWager;
    const wins = arenaState.gauntletWins;
    return (
      <div className="arena-inline">
        <div className="arena-gauntlet-status">
          <div className="gauntlet-streak">Win Streak: {wins}</div>
          <div className="gauntlet-pot">Current Pot: {currentWinnings}g</div>
          <div className="gauntlet-info">Continue to double your pot, or cash out now!</div>
        </div>
        <div className="arena-gauntlet-actions">
          <button className="btn btn-primary" onClick={onGauntletContinue}>
            Fight Next Opponent (Pot: {currentWinnings * 2}g)
          </button>
          <button className="btn btn-secondary" onClick={onGauntletCashout}>
            Cash Out ({currentWinnings}g)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-inline">
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
                <div className="arena-tier-level">Lv.{tier.levelReq}+</div>
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
                        {wager && parseInt(wager, 10) >= minWager ? ` — Win ${parseInt(wager, 10) * 2}g` : ''}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LocationsScreen({
  playerLevel,
  energy,
  energyMax,
  energyCost,
  locations,
  regionName,
  regionId,
  isArenaRegion,
  onSelect,
  onBack,
  pinnedQuests,
  stats,
  tasks,
  player,
  onRest,
  onArenaStartDuel,
  onArenaGauntletContinue,
  onArenaGauntletCashout,
  onArenaLeave,
  arenaState,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('normal');
  const requiredEnergy = energyCost ?? 0;
  const availableEnergy = energy ?? requiredEnergy;
  const maxEnergy = energyMax ?? Math.max(availableEnergy, requiredEnergy, 1);

  // Arena region: render arena content instead of normal locations
  if (isArenaRegion) {
    return (
      <div className="screen screen-locations">
        <div className="screen-header">The Arena</div>
        <ArenaPanel
          player={player}
          arenaState={arenaState}
          onStartDuel={onArenaStartDuel}
          onGauntletContinue={onArenaGauntletContinue}
          onGauntletCashout={onArenaGauntletCashout}
        />
        <button className="btn btn-back" onClick={onArenaLeave}>Leave Arena</button>
      </div>
    );
  }

  const specialLocations = SPECIAL_LOCATIONS[regionId] || [];
  const hasSpecial = specialLocations.length > 0;

  return (
    <div className="screen screen-locations">
      <div className="screen-header">{regionName || 'Choose Location'}</div>
      <div className="location-energy-info">
        Energy {availableEnergy}/{maxEnergy} · -{requiredEnergy} per expedition
      </div>

      {pinnedQuests && stats && tasks && (
        <PinnedQuestTracker pinnedQuests={pinnedQuests} stats={stats} tasks={tasks} playerLevel={playerLevel} />
      )}

      {hasSpecial && (
        <div className="location-subtabs">
          <button
            className={`location-subtab ${activeTab === 'normal' ? 'active' : ''}`}
            onClick={() => setActiveTab('normal')}
          >
            Normal
          </button>
          <button
            className={`location-subtab ${activeTab === 'special' ? 'active' : ''}`}
            onClick={() => setActiveTab('special')}
          >
            Special
          </button>
        </div>
      )}

      {activeTab === 'normal' && (
        <LocationList
          locations={locations}
          playerLevel={playerLevel}
          availableEnergy={availableEnergy}
          requiredEnergy={requiredEnergy}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          onSelect={onSelect}
          regionId={regionId}
        />
      )}

      {activeTab === 'special' && (
        <>
          <div className="special-locations-header">
            Dangerous zones with random-level encounters and rarer drops
          </div>
          <LocationList
            locations={specialLocations}
            playerLevel={playerLevel}
            availableEnergy={availableEnergy}
            requiredEnergy={requiredEnergy}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onSelect={onSelect}
            regionId={regionId}
          />
        </>
      )}

      <button className="btn btn-back" onClick={onBack}>Change Region</button>
    </div>
  );
}
