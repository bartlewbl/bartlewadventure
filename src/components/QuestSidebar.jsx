import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
} from '../data/tasks';

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

export default function QuestSidebar({ pinnedQuests, stats, tasks }) {
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
    <div className="quest-sidebar">
      <div className="quest-sidebar-title">Quests</div>
      {activeQuests.map(quest => {
        const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
        const pct = Math.min(100, Math.floor((progress / quest.target) * 100));
        const complete = progress >= quest.target;
        return (
          <div key={quest.id} className={`quest-sidebar-item ${complete ? 'complete' : ''}`}>
            <div className="quest-sidebar-name">{quest.name}</div>
            <div className="quest-sidebar-desc">{quest.description}</div>
            <div className="quest-sidebar-progress">
              <div className="quest-sidebar-bar">
                <div className="quest-sidebar-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="quest-sidebar-count">
                {formatNumber(Math.min(progress, quest.target))}/{formatNumber(quest.target)}
                {complete && ' \u2713'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
