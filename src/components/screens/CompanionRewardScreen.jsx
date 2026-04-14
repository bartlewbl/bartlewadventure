import { findCompanionNpc } from '../../data/companionData';

export default function CompanionRewardScreen({ companionReward, onContinue }) {
  if (!companionReward) return null;
  const npc = findCompanionNpc(companionReward.npcId);
  const color = npc?.color || '#ffd700';

  return (
    <div className="screen screen-explore">
      <div className="explore-location" style={{ color }}>
        Expedition Complete!
      </div>

      <div style={{
        margin: '8px 0', padding: '12px 14px',
        background: `${color}18`,
        border: `2px solid ${color}`,
        borderRadius: 6, maxWidth: 520, fontSize: '10px', lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 'bold', color, marginBottom: 6 }}>
          {companionReward.npcName}
        </div>
        <div style={{ marginBottom: 10, fontStyle: 'italic' }}>
          "{companionReward.completeLine}"
        </div>
        <div style={{ borderTop: `1px solid ${color}55`, paddingTop: 8 }}>
          <div style={{ color: '#ffd700', marginBottom: 4 }}>
            +{companionReward.gold} gold
          </div>
          {companionReward.item && (
            <div>
              Received: <span style={{ color: companionReward.item.rarityColor || '#fff' }}>
                {companionReward.item.name}
              </span>
              {companionReward.item.level ? <span style={{ opacity: 0.6 }}> (Lv {companionReward.item.level})</span> : null}
            </div>
          )}
          <div style={{ opacity: 0.7, fontSize: '9px', marginTop: 6 }}>
            (Plus a +50% gold/exp bonus on the final battle loot.)
          </div>
        </div>
      </div>

      <div className="explore-actions">
        <button className="btn btn-primary" onClick={onContinue}>
          Return to Town
        </button>
      </div>
    </div>
  );
}
