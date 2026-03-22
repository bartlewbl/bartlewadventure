import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS, CLASS_STORY_QUESTS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
  getCurrentTutorial,
  getCurrentSideQuest,
  getCurrentClassQuest,
  getMissionsForChapter,
  getUnlockedChapter,
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
    ...Object.values(CLASS_STORY_QUESTS).flatMap(c => c.quests),
  ];
  return allQuests.find(q => q.id === id) || null;
}

function isQuestClaimed(id, tasks) {
  return (tasks.tutorialClaimed || []).includes(id)
    || (tasks.missionClaimed || []).includes(id)
    || (tasks.storyClaimed || []).includes(id)
    || (tasks.dailyClaimed || []).includes(id)
    || (tasks.weeklyClaimed || []).includes(id)
    || (tasks.sideQuestClaimed || []).includes(id)
    || (tasks.classQuestClaimed || []).includes(id);
}

// Determine taskType and chainId for a quest so we can call claimTask correctly
function getClaimInfo(quest) {
  if (TUTORIAL_QUESTS.some(q => q.id === quest.id)) {
    return { taskType: 'tutorial' };
  }
  if (STORY_MISSIONS.some(q => q.id === quest.id)) {
    return { taskType: 'mission' };
  }
  for (const chain of SIDE_QUEST_CHAINS) {
    if (chain.quests.some(q => q.id === quest.id)) {
      return { taskType: 'sidequest', chainId: chain.chainId };
    }
  }
  // Class story quests
  for (const classData of Object.values(CLASS_STORY_QUESTS)) {
    if (classData.quests.some(q => q.id === quest.id)) {
      return { taskType: 'class_story' };
    }
  }
  // Daily/weekly/story tasks
  const dailyIds = getActiveDailyTasks().map(q => q.id);
  if (dailyIds.includes(quest.id)) return { taskType: 'daily' };
  const weeklyIds = getActiveWeeklyTasks().map(q => q.id);
  if (weeklyIds.includes(quest.id)) return { taskType: 'weekly' };
  if (STORY_TASKS.some(q => q.id === quest.id)) return { taskType: 'story' };
  return null;
}

// Get all current quests from active quest lines (auto-tracked)
function getActiveLineQuests(tasks, characterClass) {
  const activeLines = tasks.activeQuestLines || [];
  const quests = [];

  // Class story quest is always active
  if (characterClass && CLASS_STORY_QUESTS[characterClass]) {
    const q = getCurrentClassQuest(characterClass, tasks.classQuestClaimed || []);
    if (q) quests.push(q);
  }

  for (const lineKey of activeLines) {
    if (lineKey === 'tutorial') {
      const q = getCurrentTutorial(tasks.tutorialClaimed);
      if (q) quests.push(q);
    } else if (lineKey === 'mission') {
      const ch = getUnlockedChapter(tasks.missionClaimed || []);
      const chMissions = getMissionsForChapter(ch);
      const q = chMissions.find(m => !(tasks.missionClaimed || []).includes(m.id));
      if (q) quests.push(q);
    } else if (lineKey.startsWith('side_')) {
      const chainId = lineKey.replace('side_', '');
      const q = getCurrentSideQuest(chainId, tasks.sideQuestClaimed);
      if (q) quests.push(q);
    }
  }

  return quests;
}

export default function QuestSidebar({ pinnedQuests, stats, tasks, characterClass, onClaim }) {
  // Gather quests from active quest lines (always shown)
  const lineQuests = getActiveLineQuests(tasks, characterClass);
  const lineQuestIds = new Set(lineQuests.map(q => q.id));

  // Gather pinned quests that aren't already from an active quest line
  const pinnedOnly = (pinnedQuests || [])
    .filter(id => !lineQuestIds.has(id))
    .map(id => {
      const quest = findQuestById(id);
      if (!quest || isQuestClaimed(id, tasks)) return null;
      return quest;
    })
    .filter(Boolean);

  const allQuests = [...lineQuests, ...pinnedOnly];
  if (allQuests.length === 0) return null;

  return (
    <div className="quest-sidebar">
      <div className="quest-sidebar-title">Quests</div>
      {allQuests.map(quest => {
        const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
        const pct = Math.min(100, Math.floor((progress / quest.target) * 100));
        const complete = progress >= quest.target;
        const claimInfo = complete ? getClaimInfo(quest) : null;
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
            {complete && claimInfo && onClaim && (
              <button
                className="btn quest-sidebar-claim"
                onClick={() => onClaim(quest.id, claimInfo.taskType, claimInfo.chainId)}
              >
                Claim Reward
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
