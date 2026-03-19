import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
} from '../../data/tasks';

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

export default function LocationsScreen({
  playerLevel,
  energy,
  energyMax,
  energyCost,
  locations,
  regionName,
  onSelect,
  onBack,
  pinnedQuests,
  stats,
  tasks,
}) {
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
          return (
            <button
              key={loc.id}
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
          );
        })}
      </div>
      <button className="btn btn-back" onClick={onBack}>Back to Regions</button>
    </div>
  );
}
