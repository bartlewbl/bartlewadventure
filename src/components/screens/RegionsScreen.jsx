import { REGIONS } from '../../data/gameData';

export default function RegionsScreen({
  playerLevel,
  playerGold,
  currentRegionId,
  onSelect,
  onBack,
}) {
  return (
    <div className="screen screen-regions">
      <div className="screen-header">Choose Region</div>
      <div className="region-list">
        {REGIONS.map(region => {
          const isCurrentRegion = currentRegionId === region.id;
          const needsLevel = playerLevel < region.levelReq;
          const cost = region.travelCost || 0;
          // No cost if already in this region; first travel (no current region) is free
          const effectiveCost = isCurrentRegion ? 0 : (currentRegionId ? cost : 0);
          const needsGold = effectiveCost > 0 && playerGold < effectiveCost;
          const locked = needsLevel || needsGold;
          const locationCount = region.locations.length;
          const unlocked = region.locations.filter(l => playerLevel >= l.levelReq).length;
          return (
            <button
              key={region.id}
              className={`region-item ${locked ? 'locked' : ''} ${isCurrentRegion ? 'current' : ''}`}
              onClick={() => !locked && onSelect(region)}
              disabled={locked}
            >
              <div className="region-item-left">
                <div className="region-name">
                  {region.name}
                  {isCurrentRegion && <span className="region-current-badge"> (Current)</span>}
                </div>
                <div className="region-desc">{region.description}</div>
                {needsLevel && (
                  <div className="region-req">Lv.{region.levelReq}+ required</div>
                )}
                {!needsLevel && needsGold && (
                  <div className="region-req">Need {effectiveCost}g for ticket</div>
                )}
                {!locked && (
                  <div className="region-progress">
                    {unlocked}/{locationCount} locations
                    {isCurrentRegion ? ' · You are here' : (effectiveCost > 0 ? ` · Ticket: ${effectiveCost}g` : ' · Free travel')}
                  </div>
                )}
              </div>
              <div className="region-level">
                Lv.{region.levelReq}+
              </div>
            </button>
          );
        })}
      </div>
      <button className="btn btn-back" onClick={onBack}>
        {currentRegionId ? 'Back' : 'Back to Town'}
      </button>
    </div>
  );
}
