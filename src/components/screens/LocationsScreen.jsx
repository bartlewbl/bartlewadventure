import { useState } from 'react';
import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
} from '../../data/tasks';
import { MONSTERS, BOSSES } from '../../data/gameData';
import { MATERIAL_DROP_CONFIG, BUILDING_MATERIALS } from '../../data/baseData';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function findQuestById(id) {
  const allQuests = [
    ...TUTORIAL_QUESTS,
    ...STORY_MISSIONS,
    ...STORY_TASKS,
    ...getActiveDailyTasks(),
    ...getActiveWeeklyTasks(),
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

function PinnedQuestTracker({ pinnedQuests, stats, tasks }) {
  if (!pinnedQuests || pinnedQuests.length === 0) return null;

  const activeQuests = pinnedQuests
    .map(id => {
      const quest = findQuestById(id);
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

export default function LocationsScreen({
  playerLevel,
  energy,
  energyMax,
  energyCost,
  locations,
  regionName,
  regionId,
  onSelect,
  onBack,
  pinnedQuests,
  stats,
  tasks,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const requiredEnergy = energyCost ?? 0;
  const availableEnergy = energy ?? requiredEnergy;
  const maxEnergy = energyMax ?? Math.max(availableEnergy, requiredEnergy, 1);
  return (
    <div className="screen screen-locations">
      <div className="screen-header">{regionName || 'Choose Location'}</div>
      <div className="location-energy-info">
        Energy {availableEnergy}/{maxEnergy} · -{requiredEnergy} per expedition
      </div>

      {pinnedQuests && stats && tasks && (
        <PinnedQuestTracker pinnedQuests={pinnedQuests} stats={stats} tasks={tasks} />
      )}

      <div className="location-list">
        {locations.map(loc => {
          const needsLevel = playerLevel < loc.levelReq;
          const needsEnergy = availableEnergy < requiredEnergy;
          const locked = needsLevel || needsEnergy;
          const expanded = expandedId === loc.id;
          return (
            <div key={loc.id} className="location-entry">
              <button
                className={`location-item ${locked ? 'locked' : ''}`}
                onClick={() => !locked && onSelect(loc)}
                disabled={locked}
              >
                <div className="location-item-left">
                  <div className="location-name">{loc.name}</div>
                  <div className="location-desc">{loc.description}</div>
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
              <button
                className={`location-info-btn ${expanded ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expanded ? null : loc.id);
                }}
                title="View spawn info"
              >
                ?
              </button>
              {expanded && (
                <LocationSpawnInfo location={loc} regionId={regionId} />
              )}
            </div>
          );
        })}
      </div>
      <button className="btn btn-back" onClick={onBack}>Back to Regions</button>
    </div>
  );
}
