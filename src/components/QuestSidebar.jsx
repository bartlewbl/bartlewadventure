import {
  TUTORIAL_QUESTS, STORY_MISSIONS, STORY_TASKS, SIDE_QUEST_CHAINS,
  getActiveDailyTasks, getActiveWeeklyTasks,
  getQuestProgress,
  getCompoundQuestProgress,
  isCompoundQuestComplete,
  getCurrentTutorial,
  getCurrentSideQuest,
  getMissionsForChapter,
  getUnlockedChapter,
} from '../data/tasks';

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
    ...getActiveDailyTasks(Date.now(), playerLevel),
    ...getActiveWeeklyTasks(Date.now(), playerLevel),
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

// Determine taskType and chainId for a quest so we can call claimTask correctly
function getClaimInfo(quest, playerLevel) {
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
  // Daily/weekly/story tasks
  const dailyIds = getActiveDailyTasks(Date.now(), playerLevel).map(q => q.id);
  if (dailyIds.includes(quest.id)) return { taskType: 'daily' };
  const weeklyIds = getActiveWeeklyTasks(Date.now(), playerLevel).map(q => q.id);
  if (weeklyIds.includes(quest.id)) return { taskType: 'weekly' };
  if (STORY_TASKS.some(q => q.id === quest.id)) return { taskType: 'story' };
  return null;
}

// Get all current quests from active quest lines (auto-tracked)
function getActiveLineQuests(tasks) {
  const activeLines = tasks.activeQuestLines || [];
  const quests = [];

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

// Render a simple quest (single stat/target)
function renderSimpleQuest(quest, stats, tasks, onClaim, playerLevel) {
  const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
  const pct = Math.min(100, Math.floor((progress / quest.target) * 100));
  const complete = progress >= quest.target;
  const claimInfo = complete ? getClaimInfo(quest, playerLevel) : null;
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
}

// Get progress data for a compound quest from the correct progress bucket
function getCompoundProgressData(quest, tasks, playerLevel) {
  const dailyIds = getActiveDailyTasks(Date.now(), playerLevel).map(q => q.id);
  if (dailyIds.includes(quest.id)) return tasks.dailyProgress;
  const weeklyIds = getActiveWeeklyTasks(Date.now(), playerLevel).map(q => q.id);
  if (weeklyIds.includes(quest.id)) return tasks.weeklyProgress;
  return {};
}

// Render a compound quest (multiple subquests)
function renderCompoundQuest(quest, stats, tasks, onClaim, playerLevel) {
  const progressData = getCompoundProgressData(quest, tasks, playerLevel);
  const { completed, total, subquests } = getCompoundQuestProgress(quest, progressData);
  const allDone = completed === total;
  const overallPct = Math.floor((completed / total) * 100);
  const claimInfo = allDone ? getClaimInfo(quest, playerLevel) : null;
  return (
    <div key={quest.id} className={`quest-sidebar-item ${allDone ? 'complete' : ''}`}>
      <div className="quest-sidebar-name">{quest.name}</div>
      <div className="quest-sidebar-desc">{quest.description}</div>
      <div className="quest-sidebar-progress">
        <div className="quest-sidebar-bar">
          <div className="quest-sidebar-bar-fill" style={{ width: `${overallPct}%` }} />
        </div>
        <div className="quest-sidebar-count">
          {completed}/{total} objectives
          {allDone && ' \u2713'}
        </div>
      </div>
      <div className="quest-sidebar-subquests">
        {subquests.map((sq, idx) => {
          const sqPct = Math.min(100, Math.floor((sq.progress / sq.target) * 100));
          return (
            <div key={idx} className={`quest-sidebar-sub ${sq.complete ? 'sub-complete' : ''}`}>
              <div className="quest-sidebar-sub-name">
                {sq.complete ? '\u2713' : '\u25CB'} {sq.name || sq.description || `Objective ${idx + 1}`}
              </div>
              <div className="quest-sidebar-sub-bar">
                <div className="quest-sidebar-sub-fill" style={{ width: `${sqPct}%` }} />
              </div>
              <div className="quest-sidebar-sub-count">
                {formatNumber(sq.progress)}/{formatNumber(sq.target)}
              </div>
            </div>
          );
        })}
      </div>
      {allDone && claimInfo && onClaim && (
        <button
          className="btn quest-sidebar-claim"
          onClick={() => onClaim(quest.id, claimInfo.taskType, claimInfo.chainId)}
        >
          Claim Reward
        </button>
      )}
    </div>
  );
}

export default function QuestSidebar({ pinnedQuests, stats, tasks, onClaim, playerLevel }) {
  const lvl = playerLevel || 1;
  // Gather quests from active quest lines (always shown)
  const lineQuests = getActiveLineQuests(tasks);
  const lineQuestIds = new Set(lineQuests.map(q => q.id));

  // Gather pinned quests that aren't already from an active quest line
  const pinnedOnly = (pinnedQuests || [])
    .filter(id => !lineQuestIds.has(id))
    .map(id => {
      const quest = findQuestById(id, lvl);
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
        if (quest.compound && quest.subquests) {
          return renderCompoundQuest(quest, stats, tasks, onClaim, lvl);
        }
        return renderSimpleQuest(quest, stats, tasks, onClaim, lvl);
      })}
    </div>
  );
}
