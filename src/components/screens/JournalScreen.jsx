import { useState } from 'react';
import { CHEST_LOOKUP } from '../../data/lootChests';
import {
  getActiveDailyTasks, getActiveWeeklyTasks, getActiveMonthlyTasks,
  TUTORIAL_QUESTS, STORY_MISSIONS, SIDE_QUEST_CHAINS,
  getCurrentTutorial, isTutorialComplete, getMissionsForChapter, getUnlockedChapter,
  getCurrentSideQuest, isSideChainComplete,
  isQuestLineActive, canActivateQuestLine, MAX_ACTIVE_QUEST_LINES,
  MISSION_CHAPTER_COUNT,
  getQuestProgress,
} from '../../data/tasks';

const TABS = ['Quests', 'Tutorial', 'Missions', 'Side Quests', 'Daily', 'Weekly', 'Monthly', 'Story'];

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

function RewardLabel({ reward }) {
  if (!reward) return null;
  const parts = [];
  if (reward.gold) parts.push(`+${reward.gold}g`);
  if (reward.chestId) {
    const ch = CHEST_LOOKUP[reward.chestId];
    if (ch) parts.push(ch.name);
  }
  if (parts.length === 0) return null;
  return <span className="journal-task-reward">{parts.join(' + ')}</span>;
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

function TaskCard({ task, progress, target, claimed, onClaim, taskType, pinnedQuests, onPin, onUnpin, showPin, chainId }) {
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
          <RewardLabel reward={task.reward} />
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
          onClick={() => onClaim(task.id, taskType, chainId)}
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

// Active Quest Lines overview tab
function QuestSlotsTab({ tasks, stats, playerLevel, onActivate, onAbandon }) {
  const [previewKey, setPreviewKey] = useState(null);
  const activeLines = tasks.activeQuestLines || [];
  const slotsUsed = activeLines.length;

  // Build info for each active line
  const lineInfos = activeLines.map(lineKey => {
    if (lineKey === 'tutorial') {
      const currentQ = getCurrentTutorial(tasks.tutorialClaimed || []);
      const done = isTutorialComplete(tasks.tutorialClaimed || []);
      return {
        key: lineKey,
        name: 'Tutorial',
        type: 'tutorial',
        currentQuest: currentQ,
        isComplete: done,
        progress: (tasks.tutorialClaimed || []).length,
        total: TUTORIAL_QUESTS.length,
      };
    }
    if (lineKey === 'mission') {
      const mClaimed = tasks.missionClaimed || [];
      const allDone = STORY_MISSIONS.every(m => mClaimed.includes(m.id));
      const unlockedCh = getUnlockedChapter(mClaimed);
      const chMissions = getMissionsForChapter(unlockedCh);
      const currentQ = chMissions.find(m => !mClaimed.includes(m.id)) || null;
      return {
        key: lineKey,
        name: `Story Missions - Ch.${unlockedCh}`,
        type: 'mission',
        currentQuest: currentQ,
        isComplete: allDone,
        progress: mClaimed.length,
        total: STORY_MISSIONS.length,
      };
    }
    if (lineKey.startsWith('side_')) {
      const chainId = lineKey.replace('side_', '');
      const chain = SIDE_QUEST_CHAINS.find(c => c.chainId === chainId);
      const currentQ = getCurrentSideQuest(chainId, tasks.sideQuestClaimed || []);
      const done = isSideChainComplete(chainId, tasks.sideQuestClaimed || []);
      const completed = chain ? chain.quests.filter(q => (tasks.sideQuestClaimed || []).includes(q.id)).length : 0;
      return {
        key: lineKey,
        name: chain?.chainName || chainId,
        type: 'sidequest',
        currentQuest: currentQ,
        isComplete: done,
        progress: completed,
        total: chain?.quests.length || 0,
      };
    }
    return null;
  }).filter(Boolean);

  // Available quest lines to activate
  const availableLines = [];
  if (!activeLines.includes('tutorial') && !isTutorialComplete(tasks.tutorialClaimed || [])) {
    availableLines.push({ key: 'tutorial', name: 'Tutorial', desc: 'Learn the basics', quests: TUTORIAL_QUESTS, claimed: tasks.tutorialClaimed || [] });
  }
  if (!activeLines.includes('mission') && isTutorialComplete(tasks.tutorialClaimed || [])
    && !STORY_MISSIONS.every(m => (tasks.missionClaimed || []).includes(m.id))) {
    availableLines.push({ key: 'mission', name: 'Story Missions', desc: 'Follow the main storyline', quests: STORY_MISSIONS, claimed: tasks.missionClaimed || [] });
  }
  for (const chain of SIDE_QUEST_CHAINS) {
    const lineKey = `side_${chain.chainId}`;
    if (!activeLines.includes(lineKey) && !isSideChainComplete(chain.chainId, tasks.sideQuestClaimed || [])) {
      const lvlReq = chain.levelReq || 1;
      const levelLocked = playerLevel < lvlReq;
      availableLines.push({ key: lineKey, name: chain.chainName, desc: chain.chainDescription, quests: chain.quests, claimed: tasks.sideQuestClaimed || [], levelReq: lvlReq, levelLocked });
    }
  }

  const canAdd = slotsUsed < MAX_ACTIVE_QUEST_LINES;

  return (
    <div className="journal-tasks-tab">
      <div className="journal-section-header">
        <div className="journal-section-title">Active Quest Lines</div>
        <div className="journal-section-progress">{slotsUsed}/{MAX_ACTIVE_QUEST_LINES} slots</div>
      </div>

      {lineInfos.length === 0 && (
        <div className="journal-empty">No active quest lines. Choose up to {MAX_ACTIVE_QUEST_LINES} below.</div>
      )}

      {lineInfos.map(info => {
        const prog = info.currentQuest ? getQuestProgress(stats, info.currentQuest.id, info.currentQuest.stat, tasks.questBaselines) : 0;
        const target = info.currentQuest?.target || 1;
        const pct = Math.min(100, Math.floor((prog / target) * 100));
        return (
          <div key={info.key} className={`quest-slot-card ${info.isComplete ? 'complete' : ''}`}>
            <div className="quest-slot-header">
              <span className="quest-slot-name">{info.name}</span>
              <span className="quest-slot-progress">{info.progress}/{info.total}</span>
            </div>
            {info.currentQuest && !info.isComplete && (
              <div className="quest-slot-current">
                <div className="quest-slot-current-name">Current: {info.currentQuest.name}</div>
                <div className="quest-slot-current-desc">{info.currentQuest.description}</div>
                <div className="journal-task-progress-row">
                  <div className="journal-task-bar">
                    <div className="journal-task-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="journal-task-count">
                    {formatNumber(Math.min(prog, target))}/{formatNumber(target)}
                  </span>
                </div>
              </div>
            )}
            {info.isComplete && (
              <div className="quest-slot-complete-label">Completed!</div>
            )}
            {!info.isComplete && (
              <button
                className="btn btn-sm quest-slot-abandon"
                onClick={() => onAbandon(info.key)}
              >
                Abandon
              </button>
            )}
          </div>
        );
      })}

      {availableLines.length > 0 && (
        <>
          <div className="journal-section-header" style={{ marginTop: '12px' }}>
            <div className="journal-section-title">Available Quest Lines</div>
          </div>
          <div className="quest-available-list">
            {availableLines.map(line => {
              const isExpanded = previewKey === line.key;
              const isLevelLocked = line.levelLocked;
              const canActivate = canAdd && !isLevelLocked;
              return (
                <div key={line.key} className={`quest-available-card-wrapper ${isLevelLocked ? 'level-locked' : ''}`}>
                  <div className="quest-available-card">
                    <div className="quest-available-info" onClick={() => setPreviewKey(isExpanded ? null : line.key)} style={{ cursor: 'pointer' }}>
                      <div className="quest-available-name">
                        <span className="quest-preview-toggle">{isExpanded ? '\u25BC' : '\u25B6'}</span>
                        {line.name}
                        <span className="quest-available-count">{line.quests.length} quests</span>
                        {line.levelReq > 1 && (
                          <span className={`quest-level-req ${isLevelLocked ? 'locked' : 'met'}`}>
                            Lv.{line.levelReq}
                          </span>
                        )}
                      </div>
                      <div className="quest-available-desc">{line.desc}</div>
                    </div>
                    <button
                      className={`btn btn-sm quest-available-activate ${!canActivate ? 'disabled' : ''}`}
                      onClick={() => canActivate && onActivate(line.key)}
                      disabled={!canActivate}
                    >
                      {isLevelLocked ? `Lv.${line.levelReq}` : canAdd ? 'Activate' : 'Full'}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="quest-preview-list">
                      {line.quests.map(q => {
                        const done = line.claimed.includes(q.id);
                        return (
                          <div key={q.id} className={`quest-preview-item ${done ? 'done' : ''}`}>
                            <span className="quest-preview-order">{q.order}.</span>
                            <span className="quest-preview-name">{q.name}</span>
                            <span className="quest-preview-desc">{q.description}</span>
                            <span className="quest-preview-reward"><RewardLabel reward={q.reward} /></span>
                            {done && <span className="quest-preview-check">{'\u2713'}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TutorialTab({ stats, tasks, onClaim, pinnedQuests, onPin, onUnpin }) {
  const tutClaimed = tasks.tutorialClaimed || [];
  const activeLines = tasks.activeQuestLines || [];
  const isActive = isQuestLineActive(activeLines, 'tutorial');
  const currentTut = getCurrentTutorial(tutClaimed);
  const allDone = isTutorialComplete(tutClaimed);

  const completedCount = tutClaimed.length;
  const totalCount = TUTORIAL_QUESTS.length;

  if (!isActive && !allDone) {
    return (
      <div className="journal-tasks-tab">
        <div className="journal-locked-banner">
          Activate the Tutorial quest line from the Quests tab to begin.
        </div>
      </div>
    );
  }

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

      {TUTORIAL_QUESTS.map((quest) => {
        const claimed = tutClaimed.includes(quest.id);
        const isCurrent = currentTut && currentTut.id === quest.id;
        const isLocked = !claimed && !isCurrent;

        if (isLocked) {
          return (
            <div key={quest.id} className="journal-task-card locked">
              <div className="journal-task-header">
                <span className="journal-task-name">Step {quest.order}: {quest.name}</span>
                <RewardLabel reward={quest.reward} />
              </div>
              <div className="journal-task-desc">{quest.description}</div>
              <div className="journal-task-locked-label">Complete previous steps to unlock</div>
            </div>
          );
        }

        const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
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
  const activeLines = tasks.activeQuestLines || [];
  const isActive = isQuestLineActive(activeLines, 'mission');
  const tutDone = isTutorialComplete(tasks.tutorialClaimed || []);
  const unlockedChapter = getUnlockedChapter(missionClaimed);
  const allMissionsDone = STORY_MISSIONS.every(m => missionClaimed.includes(m.id));

  if (!tutDone) {
    return (
      <div className="journal-tasks-tab">
        <div className="journal-locked-banner">
          Complete the Tutorial to unlock Story Missions.
        </div>
      </div>
    );
  }

  if (!isActive && !allMissionsDone) {
    return (
      <div className="journal-tasks-tab">
        <div className="journal-locked-banner">
          Activate the Story Missions quest line from the Quests tab to progress.
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
        const prevMission = mission.order > 1
          ? missions.find(m => m.order === mission.order - 1)
          : null;
        const prevDone = !prevMission || missionClaimed.includes(prevMission.id);
        const isLocked = !claimed && !prevDone;

        if (isLocked) {
          return (
            <div key={mission.id} className="journal-task-card locked">
              <div className="journal-task-header">
                <span className="journal-task-name">{mission.order}. {mission.name}</span>
                <RewardLabel reward={mission.reward} />
              </div>
              <div className="journal-task-desc">{mission.description}</div>
              {mission.regionHint && (
                <div className="journal-task-region">{mission.regionHint}</div>
              )}
              <div className="journal-task-locked-label">Complete previous missions to unlock</div>
            </div>
          );
        }

        const progress = getQuestProgress(stats, mission.id, mission.stat, tasks.questBaselines);
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

function SideQuestsTab({ stats, tasks, playerLevel, onClaim, pinnedQuests, onPin, onUnpin }) {
  const [selectedChain, setSelectedChain] = useState(null);
  const sideQuestClaimed = tasks.sideQuestClaimed || [];
  const activeLines = tasks.activeQuestLines || [];

  // Chain list view
  if (selectedChain === null) {
    return (
      <div className="journal-tasks-tab">
        <div className="journal-section-header">
          <div className="journal-section-title">Side Quest Chains</div>
        </div>
        <div className="journal-chapter-list">
          {SIDE_QUEST_CHAINS.map(chain => {
            const completed = chain.quests.filter(q => sideQuestClaimed.includes(q.id)).length;
            const total = chain.quests.length;
            const lineKey = `side_${chain.chainId}`;
            const isActive = activeLines.includes(lineKey);
            const isDone = completed === total;
            const lvlReq = chain.levelReq || 1;
            const isLevelLocked = playerLevel < lvlReq;

            return (
              <button
                key={chain.chainId}
                className={`journal-chapter-card ${isDone ? 'complete' : ''} ${isActive ? 'active-line' : ''} ${isLevelLocked ? 'level-locked' : ''}`}
                onClick={() => !isLevelLocked && setSelectedChain(chain.chainId)}
                disabled={isLevelLocked}
              >
                <div className="journal-chapter-number">
                  {isActive && <span className="quest-active-dot" />}
                  {chain.chainName}
                </div>
                <div className="journal-chapter-name">{chain.chainDescription}</div>
                <div className="journal-chapter-progress">
                  {isLevelLocked ? `Lv.${lvlReq}` : isDone ? '' : `${completed}/${total}`}
                </div>
                {isDone && <div className="journal-chapter-done-badge">Complete</div>}
                {isActive && !isDone && <div className="quest-active-badge">Active</div>}
                {isLevelLocked && <div className="quest-level-locked-badge">Lv.{lvlReq}</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Side quest chain detail
  const chain = SIDE_QUEST_CHAINS.find(c => c.chainId === selectedChain);
  if (!chain) {
    setSelectedChain(null);
    return null;
  }

  const lineKey = `side_${chain.chainId}`;
  const isActive = activeLines.includes(lineKey);
  const currentSQ = getCurrentSideQuest(chain.chainId, sideQuestClaimed);

  return (
    <div className="journal-tasks-tab">
      <div className="journal-section-header">
        <button className="btn btn-sm journal-chapter-back" onClick={() => setSelectedChain(null)}>
          Back
        </button>
        <div className="journal-section-title">{chain.chainName}</div>
        {isActive && <div className="quest-active-badge">Active</div>}
      </div>

      {!isActive && !isSideChainComplete(chain.chainId, sideQuestClaimed) && (
        <div className="journal-locked-banner">
          Activate this quest chain from the Quests tab to claim rewards.
        </div>
      )}

      {chain.quests.map(quest => {
        const claimed = sideQuestClaimed.includes(quest.id);
        const isCurrent = currentSQ && currentSQ.id === quest.id;
        const isLocked = !claimed && !isCurrent;

        if (isLocked) {
          return (
            <div key={quest.id} className="journal-task-card locked">
              <div className="journal-task-header">
                <span className="journal-task-name">{quest.order}. {quest.name}</span>
                <RewardLabel reward={quest.reward} />
              </div>
              <div className="journal-task-desc">{quest.description}</div>
              <div className="journal-task-locked-label">Complete previous quests to unlock</div>
            </div>
          );
        }

        const progress = getQuestProgress(stats, quest.id, quest.stat, tasks.questBaselines);
        return (
          <TaskCard
            key={quest.id}
            task={quest}
            progress={progress}
            target={quest.target}
            claimed={claimed}
            onClaim={(id, type) => onClaim(id, type, chain.chainId)}
            taskType="sidequest"
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
            showPin={!claimed && isActive}
            chainId={chain.chainId}
          />
        );
      })}
    </div>
  );
}

export default function JournalScreen({ stats, tasks, playerLevel, onClaim, onPin, onUnpin, onActivate, onAbandon, onBack }) {
  const [activeTab, setActiveTab] = useState('Quests');
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

  // Tutorial badge: count current tutorial if claimable and active
  const activeLines = tasks.activeQuestLines || [];
  const currentTut = getCurrentTutorial(tasks.tutorialClaimed || []);
  const tutBadge = isQuestLineActive(activeLines, 'tutorial') && currentTut && getQuestProgress(stats, currentTut.id, currentTut.stat, tasks.questBaselines) >= currentTut.target ? 1 : 0;

  // Mission badge: count all claimable missions in unlocked chapters (if active)
  const missionClaimed = tasks.missionClaimed || [];
  const tutDone = isTutorialComplete(tasks.tutorialClaimed || []);
  let missionBadge = 0;
  if (tutDone && isQuestLineActive(activeLines, 'mission')) {
    const unlockedCh = getUnlockedChapter(missionClaimed);
    for (let ch = 1; ch <= unlockedCh; ch++) {
      const chMissions = getMissionsForChapter(ch);
      for (const m of chMissions) {
        if (missionClaimed.includes(m.id)) continue;
        const prevM = m.order > 1 ? chMissions.find(x => x.order === m.order - 1) : null;
        if (prevM && !missionClaimed.includes(prevM.id)) continue;
        if (getQuestProgress(stats, m.id, m.stat, tasks.questBaselines) >= m.target) missionBadge++;
      }
    }
  }

  // Side quest badge
  let sideBadge = 0;
  for (const chain of SIDE_QUEST_CHAINS) {
    const lineKey = `side_${chain.chainId}`;
    if (!isQuestLineActive(activeLines, lineKey)) continue;
    const currentQ = getCurrentSideQuest(chain.chainId, tasks.sideQuestClaimed || []);
    if (currentQ && getQuestProgress(stats, currentQ.id, currentQ.stat, tasks.questBaselines) >= currentQ.target) sideBadge++;
  }

  // Quests tab badge = sum of quest line badges
  const questsBadge = tutBadge + missionBadge + sideBadge;

  const badges = {
    Quests: questsBadge,
    Tutorial: tutBadge,
    Missions: missionBadge,
    'Side Quests': sideBadge,
    Daily: countReady(dailyTasks, tasks.dailyProgress, tasks.dailyClaimed, false),
    Weekly: countReady(weeklyTasks, tasks.weeklyProgress, tasks.weeklyClaimed, false),
    Monthly: countReady(monthlyTasks, tasks.monthlyProgress, tasks.monthlyClaimed, false),
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
        {activeTab === 'Quests' && (
          <QuestSlotsTab
            tasks={tasks}
            stats={stats}
            playerLevel={playerLevel}
            onActivate={onActivate}
            onAbandon={onAbandon}
          />
        )}
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
        {activeTab === 'Side Quests' && (
          <SideQuestsTab
            stats={stats}
            tasks={tasks}
            playerLevel={playerLevel}
            onClaim={onClaim}
            pinnedQuests={pinnedQuests}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
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
