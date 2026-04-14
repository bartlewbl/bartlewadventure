import { findCompanionNpc } from '../../data/companionData';

export default function CompanionZoneScreen({ companionRun, player, onAdvance, onAbandon }) {
  if (!companionRun) return null;
  const npc = findCompanionNpc(companionRun.npcId);
  if (!npc) return null;

  const nextStageIndex = companionRun.stage; // stages done so far; next to enter = stage+1
  const isStart = companionRun.stage === 0;
  const isFinalNext = companionRun.stage + 1 >= companionRun.totalStages;
  const stageName = npc.location.stageNames?.[nextStageIndex] || `Stage ${nextStageIndex + 1}`;

  const hpPct = companionRun.mode === 'escort'
    ? Math.max(0, Math.floor((companionRun.companionHp / companionRun.companionMaxHp) * 100))
    : 100;
  const hpColor = hpPct > 60 ? '#4ade80' : hpPct > 30 ? '#fbbf24' : '#f87171';

  return (
    <div className="screen screen-explore">
      <div className="explore-location" style={{ color: npc.color }}>
        {npc.location.name}
      </div>
      <div className="explore-text">
        {isStart
          ? npc.location.description
          : `You regroup briefly. The path deeper in winds further into ${npc.location.name.toLowerCase()}.`}
      </div>

      {/* Stage progress */}
      <div style={{
        margin: '8px 0', padding: '8px 10px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${npc.color}55`,
        borderRadius: 4, maxWidth: 520, fontSize: '9px', lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 'bold', color: npc.color, marginBottom: 4 }}>
          {npc.quest.name}
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          {Array.from({ length: companionRun.totalStages }).map((_, i) => {
            const cleared = i < companionRun.stage;
            const current = i === nextStageIndex;
            return (
              <div key={i} style={{
                flex: 1,
                height: 8,
                background: cleared ? npc.color : current ? `${npc.color}55` : 'rgba(255,255,255,0.08)',
                border: `1px solid ${npc.color}66`,
                borderRadius: 2,
              }} />
            );
          })}
        </div>
        <div style={{ opacity: 0.8 }}>
          Progress: {companionRun.stage}/{companionRun.totalStages} cleared
          {' '}&middot;{' '}
          {isFinalNext ? <span style={{ color: '#ffd700' }}>Final stage next: {stageName}</span>
            : <span>Next: {stageName}</span>}
        </div>
      </div>

      {/* Companion status */}
      <div style={{
        margin: '4px 0', padding: '8px 10px',
        background: `${npc.color}10`,
        border: `1px solid ${npc.color}55`,
        borderRadius: 4, maxWidth: 520, fontSize: '9px', lineHeight: 1.6,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 'bold', color: npc.color }}>{npc.name}</span>
          <span style={{ opacity: 0.7 }}>
            {npc.mode === 'escort' ? 'Escort — vulnerable' : 'Helper — fighting beside you'}
          </span>
        </div>
        {npc.mode === 'escort' ? (
          <>
            <div style={{ position: 'relative', height: 10, background: 'rgba(0,0,0,0.4)', border: `1px solid ${npc.color}55`, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${hpPct}%`, background: hpColor, transition: 'width 200ms linear',
              }} />
            </div>
            <div style={{ marginTop: 2, opacity: 0.85 }}>
              HP: {companionRun.companionHp}/{companionRun.companionMaxHp}
              {' '}<span style={{ opacity: 0.6 }}>(takes damage each stage based on hits you let through)</span>
            </div>
          </>
        ) : (
          <div style={{ opacity: 0.85 }}>
            Will patch your wounds between stages (+{Math.round(0.18 * 100)}% max HP) and takes a cut of the final haul.
          </div>
        )}
      </div>

      {/* Player HP summary */}
      <div style={{
        margin: '4px 0', padding: '6px 10px',
        background: 'rgba(0,0,0,0.25)', borderRadius: 4, maxWidth: 520, fontSize: '9px',
      }}>
        You: {player.hp}/{player.maxHp} HP, {player.mana}/{player.maxMana} MP
      </div>

      <div className="explore-actions">
        <button
          className="btn btn-primary"
          onClick={onAdvance}
          style={{ background: isFinalNext ? '#ffb300' : npc.color, borderColor: isFinalNext ? '#ffb300' : npc.color }}
        >
          {isStart ? `Begin — ${stageName}` : isFinalNext ? `Push to the Final Stage` : `Advance to ${stageName}`}
        </button>
        <button className="btn btn-back" onClick={onAbandon}>
          Abandon Expedition
        </button>
      </div>
    </div>
  );
}
