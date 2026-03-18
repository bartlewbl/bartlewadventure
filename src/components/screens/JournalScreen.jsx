import { useState } from 'react';
import {
  getActiveDailyTasks, getActiveWeeklyTasks, getActiveMonthlyTasks,
  STORY_TASKS, TUTORIAL_QUESTS, STORY_MISSIONS,
  getCurrentTutorial, isTutorialComplete, getMissionsForChapter, getUnlockedChapter,
  MISSION_CHAPTER_COUNT,
} from '../../data/tasks';

const TABS = ['Tutorial', 'Missions', 'Daily', 'Weekly', 'Monthly', 'Story', 'Stats'];

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function StatRow({ label, value }) {
  return (
    <div className="journal-stat-row">
      <span className="journal-stat-label">{label}</span>
      <span className="journal-stat-value">{formatNumber(value)}</span>
    </div>
  );
}

function PinButton({ questId, pinnedQuests, onPin, onUnpin }) {
  const isPinned = (pinnedQuests || []).includes(questId);
  return (
    <button
      className={`journal-pin-btn ${isPinned ? 'pinned' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        isPinned ? onUnpin(questId) : onPin(questId);
      }}
      title={isPinned ? 'Unpin from locations' : 'Pin to locations (max 3)'}
    >
      {isPinned ? '\u2605' : '\u2606'}
    </button>
  );
}

function TaskCard({ task, progress, target, claimed, onClaim, taskType, pinnedQuests, onPin, onUnpin, showPin }) {
  const pct = Math.min(100, Math.floor((progress / target) * 100));
  const complete = progress >= target;
  const canClaim = complete && !claimed;

  return (
    <div className={`journal-task-card ${complete ? 'complete' : ''} ${claimed ? 'claimed' : ''}`}>
      <div className="journal-task-header">
        <span className="journal-task-name">{task.name}</span>
        <div className="journal-task-header-right">
          {showPin && !claimed && (
            <PinButton
              questId={task.id}
              pinnedQuests={pinnedQuests}
              onPin={onPin}
              onUnpin={onUnpin}
            />
          )}
          {task.reward.gold && (
            <span className="journal-task-reward">+{task.reward.gold}g</span>
          )}
        </div>
      </div>
      <div className="journal-task-desc">{task.description}</div>
      {task.hint && (
        <div className="journal-task-hint">{task.hint}</div>
      )}
      {task.regionHint && (
        <div className="journal-task-region">{task.regionHint}</div>
      )}
      <div className="journal-task-progress-row">
        <div className="journal-task-bar">
          <div
            className="journal-task-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="journal-task-count">
          {formatNumber(Math.min(progress, target))}/{formatNumber(target)}
        </span>
      </div>
      {canClaim && (
        <button
          className="btn btn-sm journal-task-claim"
          onClick={() => onClaim(task.id, taskType)}
        >
          Claim
        </button>
      )}
      {claimed && (
        <div className="journal-task-claimed-label">Claimed</div>
      )}
    </div>
  );
}

function StatsTab({ stats }) {
  const statGroups = [
    {
      title: 'Combat',
      items: [
        { label: 'Monsters Killed', value: stats.monstersKilled },
        { label: 'Bosses Killed', value: stats.bossesKilled },
        { label: 'Battles Won', value: stats.battlesWon },
        { label: 'Battles Lost', value: stats.battlesLost },
        { label: 'Battles Fled', value: stats.battlesRun },
        { label: 'Damage Dealt', value: stats.damageDealt },
        { label: 'Damage Taken', value: stats.damageTaken },
        { label: 'Highest Hit', value: stats.highestDamage },
        { label: 'Total Healing', value: stats.totalHealing },
      ],
    },
    {
      title: 'Economy',
      items: [
        { label: 'Gold Earned', value: stats.goldEarned },
        { label: 'Gold Spent', value: stats.goldSpent },
        { label: 'Items Looted', value: stats.itemsLooted },
        { label: 'Items Sold', value: stats.itemsSold },
      ],
    },
    {
      title: 'Progression',
      items: [
        { label: 'Levels Gained', value: stats.levelsGained },
        { label: 'Skills Unlocked', value: stats.skillsUnlocked },
        { label: 'Explorations', value: stats.explorationsCompleted },
        { label: 'Potions Used', value: stats.potionsUsed },
      ],
    },
  ];

  return (
    <div className="journal-stats-tab">
      {statGroups.map(group => (
        <div key={group.title} className="journal-stat-group">
          <div className="journal-stat-group-title">{group.title}</div>
          {group.items.map(item => (
            <StatRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TasksTab({ tasks, taskDefs, progressMap, claimedList, stats, taskType, onClaim, pinnedQuests, onPin, onUnpin }) {
  const isStory = taskType === 'story' || taskType === 'tutorial' || taskType === 'mission';

  return (
    <div className="journal-tasks-tab">
      {taskDefs.length === 0 && (
        <div className="journal-empty">No tasks available.</div>
      )}
      {taskDefs.map(task => {
        const progress = isStory
          ? (stats[task.stat] || 0)
          : (progressMap[task.id] || 0);
        const claimed = claimedList.includes(task.id);
        return (
          <TaskCard
            key={task.id}
            task={task}
            progress={progress}
            target={task.target}
            claimed={claimed}
            onClaim={onClaim}
            taskType={taskType}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
            showPin={taskType === 'tutorial' || taskType === 'mission' || taskType === 'story' || taskType === 'daily' || taskType === 'weekly'}
          />
        );
      })}
    </div>
  );
}

function TutorialTab({ stats, tasks, onClaim, pinnedQuests, onPin, onUnpin }) {
  const tutClaimed = tasks.tutorialClaimed || [];
  const currentTut = getCurrentTutorial(tutClaimed);
  const allDone = isTutorialComplete(tutClaimed);

  const completedCount = tutClaimed.length;
  const totalCount = TUTORIAL_QUESTS.length;

  return (
    <div className="journal-tasks-tab">
      <div className="journal-section-header">
        <div className="journal-section-title">Tutorial Progress</div>
        <div className="journal-section-progress">{completedCount}/{totalCount} complete</div>
      </div>

      {allDone && (
        <div className="journal-complete-banner">
          Tutorial Complete! Story Missions are now available.
        </div>
      )}

      {TUTORIAL_QUESTS.map((quest, idx) => {
        const claimed = tutClaimed.includes(quest.id);
        const isCurrent = currentTut && currentTut.id === quest.id;
        const isLocked = !claimed && !isCurrent;

        if (isLocked) {
          return (
            <div key={quest.id} className="journal-task-card locked">
              <div className="journal-task-header">
                <span className="journal-task-name">Step {quest.order}: ???</span>
              </div>
              <div className="journal-task-desc">Complete previous steps to unlock.</div>
            </div>
          );
        }

        const progress = stats[quest.stat] || 0;
        return (
          <TaskCard
            key={quest.id}
            task={quest}
            progress={progress}
            target={quest.target}
            claimed={claimed}
            onClaim={onClaim}
            taskType="tutorial"
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
            showPin={!claimed}
          />
        );
      })}
    </div>
  );
}

function MissionsTab({ stats, tasks, onClaim, pinnedQuests, onPin, onUnpin }) {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const missionClaimed = tasks.missionClaimed || [];
  const tutDone = isTutorialComplete(tasks.tutorialClaimed || []);
  const unlockedChapter = getUnlockedChapter(missionClaimed);

  if (!tutDone) {
    return (
      <div className="journal-tasks-tab">
        <div className="journal-locked-banner">
          Complete the Tutorial to unlock Story Missions.
        </div>
      </div>
    );
  }

  // Chapter list view
  if (selectedChapter === null) {
    const chapters = [];
    for (let ch = 1; ch <= MISSION_CHAPTER_COUNT; ch++) {
      const missions = getMissionsForChapter(ch);
      const completed = missions.filter(m => missionClaimed.includes(m.id)).length;
      const total = missions.length;
      const isLocked = ch > unlockedChapter;
      const chapterName = missions[0]?.chapterName || `Chapter ${ch}`;
      chapters.push({ ch, chapterName, completed, total, isLocked });
    }

    return (
      <div className="journal-tasks-tab">
        <div className="journal-section-header">
          <div className="journal-section-title">Story Missions</div>
        </div>
        <div className="journal-chapter-list">
          {chapters.map(({ ch, chapterName, completed, total, isLocked }) => (
            <button
              key={ch}
              className={`journal-chapter-card ${isLocked ? 'locked' : ''} ${completed === total ? 'complete' : ''}`}
              onClick={() => !isLocked && setSelectedChapter(ch)}
              disabled={isLocked}
            >
              <div className="journal-chapter-number">Chapter {ch}</div>
              <div className="journal-chapter-name">{chapterName}</div>
              <div className="journal-chapter-progress">
                {isLocked ? 'Locked' : `${completed}/${total}`}
              </div>
              {completed === total && <div className="journal-chapter-done-badge">Complete</div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Mission detail view for a chapter
  const missions = getMissionsForChapter(selectedChapter);
  const chapterName = missions[0]?.chapterName || `Chapter ${selectedChapter}`;

  return (
    <div className="journal-tasks-tab">
      <div className="journal-section-header">
        <button className="btn btn-sm journal-chapter-back" onClick={() => setSelectedChapter(null)}>
          Back
        </button>
        <div className="journal-section-title">Ch.{selectedChapter}: {chapterName}</div>
      </div>

      {missions.map(mission => {
        const claimed = missionClaimed.includes(mission.id);
        // Check if this mission is accessible (previous in order must be claimed)
        const prevMission = mission.order > 1
          ? missions.find(m => m.order === mission.order - 1)
          : null;
        const prevDone = !prevMission || missionClaimed.includes(prevMission.id);
        const isLocked = !claimed && !prevDone;

        if (isLocked) {
          return (
            <div key={mission.id} className="journal-task-card locked">
              <div className="journal-task-header">
                <span className="journal-task-name">{mission.order}. ???</span>
              </div>
              <div className="journal-task-desc">Complete previous missions to unlock.</div>
            </div>
          );
        }

        const progress = stats[mission.stat] || 0;
        return (
          <TaskCard
            key={mission.id}
            task={mission}
            progress={progress}
            target={mission.target}
            claimed={claimed}
            onClaim={onClaim}
            taskType="mission"
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
            showPin={!claimed}
          />
        );
      })}
    </div>
  );
}

export default function JournalScreen({ stats, tasks, onClaim, onPin, onUnpin, onBack }) {
  const [activeTab, setActiveTab] = useState('Tutorial');
  const now = Date.now();

  const dailyTasks = getActiveDailyTasks(now);
  const weeklyTasks = getActiveWeeklyTasks(now);
  const monthlyTasks = getActiveMonthlyTasks(now);
  const pinnedQuests = tasks.pinnedQuests || [];

  // Count unclaimed completions for badge
  const countReady = (defs, progressMap, claimedList, isStory) => {
    return defs.filter(t => {
      const prog = isStory ? (stats[t.stat] || 0) : (progressMap[t.id] || 0);
      return prog >= t.target && !claimedList.includes(t.id);
    }).length;
  };

  // Tutorial badge: count current tutorial if claimable
  const currentTut = getCurrentTutorial(tasks.tutorialClaimed || []);
  const tutBadge = currentTut && (stats[currentTut.stat] || 0) >= currentTut.target ? 1 : 0;

  // Mission badge: count all claimable missions in unlocked chapters
  const missionClaimed = tasks.missionClaimed || [];
  const tutDone = isTutorialComplete(tasks.tutorialClaimed || []);
  let missionBadge = 0;
  if (tutDone) {
    const unlockedCh = getUnlockedChapter(missionClaimed);
    for (let ch = 1; ch <= unlockedCh; ch++) {
      const chMissions = getMissionsForChapter(ch);
      for (const m of chMissions) {
        if (missionClaimed.includes(m.id)) continue;
        const prevM = m.order > 1 ? chMissions.find(x => x.order === m.order - 1) : null;
        if (prevM && !missionClaimed.includes(prevM.id)) continue;
        if ((stats[m.stat] || 0) >= m.target) missionBadge++;
      }
    }
  }

  const badges = {
    Tutorial: tutBadge,
    Missions: missionBadge,
    Daily: countReady(dailyTasks, tasks.dailyProgress, tasks.dailyClaimed, false),
    Weekly: countReady(weeklyTasks, tasks.weeklyProgress, tasks.weeklyClaimed, false),
    Monthly: countReady(monthlyTasks, tasks.monthlyProgress, tasks.monthlyClaimed, false),
    Story: countReady(STORY_TASKS, {}, tasks.storyClaimed, true),
  };

  return (
    <div className="screen screen-journal">
      <div className="screen-header">Journal</div>

      <div className="journal-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`journal-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {badges[tab] > 0 && (
              <span className="journal-tab-badge">{badges[tab]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="journal-content">
        {activeTab === 'Tutorial' && (
          <TutorialTab
            stats={stats}
            tasks={tasks}
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
        {activeTab === 'Missions' && (
          <MissionsTab
            stats={stats}
            tasks={tasks}
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
        {activeTab === 'Stats' && <StatsTab stats={stats} />}
        {activeTab === 'Daily' && (
          <TasksTab
            tasks={tasks}
            taskDefs={dailyTasks}
            progressMap={tasks.dailyProgress}
            claimedList={tasks.dailyClaimed}
            stats={stats}
            taskType="daily"
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
        {activeTab === 'Weekly' && (
          <TasksTab
            tasks={tasks}
            taskDefs={weeklyTasks}
            progressMap={tasks.weeklyProgress}
            claimedList={tasks.weeklyClaimed}
            stats={stats}
            taskType="weekly"
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
        {activeTab === 'Monthly' && (
          <TasksTab
            tasks={tasks}
            taskDefs={monthlyTasks}
            progressMap={tasks.monthlyProgress}
            claimedList={tasks.monthlyClaimed}
            stats={stats}
            taskType="monthly"
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
        {activeTab === 'Story' && (
          <TasksTab
            tasks={tasks}
            taskDefs={STORY_TASKS}
            progressMap={{}}
            claimedList={tasks.storyClaimed}
            stats={stats}
            taskType="story"
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
      </div>

      {pinnedQuests.length > 0 && (
        <div className="journal-pinned-summary">
          Pinned: {pinnedQuests.length}/3
        </div>
      )}

      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
