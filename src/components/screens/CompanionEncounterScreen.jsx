import { useState, useEffect } from 'react';

export default function CompanionEncounterScreen({ npc, playerLevel, onAccept, onDecline }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!npc) return null;

  const q = npc.quest;
  const loc = npc.location;
  const canAccept = playerLevel >= (npc.minLevel || 1);
  const modeLabel = npc.mode === 'escort' ? 'Escort Mission' : 'Expedition';
  const modeDesc = npc.mode === 'escort'
    ? 'You must protect this companion. If they fall, the mission fails.'
    : 'This companion fights alongside you, stitches you up between stages, and shares the final haul.';

  return (
    <div className={`screen screen-explore ${entered ? 'tnpc-entered' : ''}`}>
      <div className="explore-location" style={{ color: npc.color }}>
        {npc.name} — {npc.title}
      </div>

      <div style={{
        margin: '8px 0', padding: '8px 10px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${npc.color}44`,
        borderRadius: 4, maxWidth: 520, fontSize: '10px', lineHeight: 1.6,
      }}>
        <div style={{ marginBottom: 6 }}>{npc.greeting}</div>
        {npc.lore && <div style={{ opacity: 0.7, fontSize: '9px' }}>{npc.lore}</div>}
      </div>

      <div style={{
        margin: '4px 0', padding: '8px 10px',
        background: `${npc.color}14`,
        border: `1px solid ${npc.color}66`,
        borderRadius: 4, maxWidth: 520, fontSize: '9px', lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 'bold', color: npc.color, marginBottom: 2 }}>
          {modeLabel}: {q.name}
        </div>
        <div style={{ marginBottom: 4 }}>{q.description}</div>
        <div style={{ opacity: 0.85, marginBottom: 4 }}>
          <span style={{ fontWeight: 'bold' }}>Destination:</span> {loc.name}
          <span style={{ opacity: 0.6 }}> — {loc.stages} stage{loc.stages !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ opacity: 0.7, fontStyle: 'italic', marginBottom: 4 }}>{loc.description}</div>
        <div style={{ opacity: 0.8, marginBottom: 4 }}>{modeDesc}</div>
        <div style={{ color: '#ffd700' }}>
          Reward: {q.rewardGold}g + {q.rewardItem} gear
          {' '}<span style={{ opacity: 0.6 }}>(plus normal battle loot and a +50% gold/exp on the final stage)</span>
        </div>
        {npc.mode === 'escort' && (
          <div style={{ marginTop: 6, color: '#f99' }}>
            Companion HP: {npc.companion.maxHp}
          </div>
        )}
      </div>

      <div className="explore-actions">
        <button
          className="btn btn-primary"
          onClick={onAccept}
          disabled={!canAccept}
          style={{ background: canAccept ? npc.color : undefined, borderColor: canAccept ? npc.color : undefined }}
        >
          {canAccept ? `Set Out for ${loc.name}` : `Requires level ${npc.minLevel}`}
        </button>
        <button className="btn btn-back" onClick={onDecline}>Decline</button>
      </div>
    </div>
  );
}
