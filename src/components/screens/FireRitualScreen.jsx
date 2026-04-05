import { isFuelMaterial } from '../../data/fireRitualData';

export default function FireRitualScreen({ ritualSite, player, onLight, onDefend, onLeave }) {
  if (!ritualSite) return null;

  // Count available fuel items in inventory
  const fuelItems = player.inventory.filter(item =>
    item.isFuel || (item.type === 'material' && isFuelMaterial(item.materialId || item.id))
  );
  const fuelCount = fuelItems.reduce((sum, item) => sum + (item.stackCount || 1), 0);
  const hasEnoughFuel = fuelCount >= ritualSite.fuelCost;

  // Get fuel item names for display
  const fuelNames = [...new Set(fuelItems.map(i => i.name))].join(', ');

  // Quest context from ritual site
  const quest = ritualSite.activeQuest;
  const questRequiresDefense = ritualSite.questRequiresDefense;

  return (
    <div className="screen screen-explore">
      <div className="explore-location">{ritualSite.name}</div>
      <div className="explore-text">
        {ritualSite.description}
      </div>

      {/* Active quest banner */}
      {quest && (
        <div style={{ margin: '8px 0', padding: '8px 10px', background: 'rgba(100,180,255,0.12)', borderRadius: 6, border: '1px solid rgba(100,180,255,0.35)', fontSize: '0.9em' }}>
          <div style={{ fontWeight: 'bold', color: '#8cf', marginBottom: 2 }}>
            Quest: {quest.name}
          </div>
          <div style={{ opacity: 0.85 }}>{quest.description}</div>
          {questRequiresDefense && (
            <div style={{ color: '#f99', marginTop: 4, fontWeight: 'bold' }}>
              This quest requires you to defend the fire through the night!
            </div>
          )}
        </div>
      )}

      <div style={{ margin: '12px 0', padding: '10px', background: 'rgba(255,160,40,0.1)', borderRadius: 6, border: '1px solid rgba(255,160,40,0.3)' }}>
        <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#ffa028' }}>
          Fuel Required: {ritualSite.fuelCost} fuel item{ritualSite.fuelCost > 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
          You have: {fuelCount} fuel item{fuelCount !== 1 ? 's' : ''}
          {fuelNames ? ` (${fuelNames})` : ''}
        </div>
      </div>

      {ritualSite.canDefend && !questRequiresDefense && (
        <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(255,60,60,0.1)', borderRadius: 6, border: '1px solid rgba(255,60,60,0.3)', fontSize: '0.9em' }}>
          This site radiates ancient power. Lighting it may attract creatures of the night.
          You can defend the fire for greater rewards.
        </div>
      )}

      <div className="explore-actions">
        {/* If quest forces defense, only show defend button */}
        {hasEnoughFuel && questRequiresDefense && (
          <button
            className="btn btn-primary"
            onClick={onDefend}
            style={{ background: '#c43', borderColor: '#a22' }}
          >
            Light &amp; Defend Through Night
          </button>
        )}

        {/* Normal mode: light and optionally defend */}
        {hasEnoughFuel && !questRequiresDefense && (
          <button className="btn btn-primary" onClick={onLight}>
            Light the Fire
          </button>
        )}
        {hasEnoughFuel && ritualSite.canDefend && !questRequiresDefense && (
          <button
            className="btn btn-primary"
            onClick={onDefend}
            style={{ background: '#c43', borderColor: '#a22' }}
          >
            Light &amp; Defend Through Night
          </button>
        )}

        {!hasEnoughFuel && (
          <div style={{ color: '#f88', margin: '8px 0' }}>
            Not enough fuel. Find fuel materials like Scrap Wood, Charcoal, or Coal Chunks.
          </div>
        )}
        <button className="btn btn-back" onClick={onLeave}>Leave</button>
      </div>
    </div>
  );
}
