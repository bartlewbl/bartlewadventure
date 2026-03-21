import { REGIONS } from '../../data/gameData';
import { REGION_TICKETS } from '../../data/baseData';

export default function RegionsScreen({
  playerLevel,
  playerGold,
  playerInventory,
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
          const isArena = !!region.isArena;
          const isStarter = region.id === 'neon-district';
          const ticketDef = REGION_TICKETS[region.id];
          // Check if player has a ticket for this region
          const hasTicket = ticketDef ? (playerInventory || []).some(i => i.type === 'ticket' && i.ticketRegionId === region.id) : false;
          // Ticket needed when: not starter, not arena, not current region, and region requires a ticket
          const needsTicket = !isStarter && !isArena && !isCurrentRegion && !!ticketDef && !hasTicket;
          const locked = needsLevel || needsTicket;
          const locationCount = region.locations.length;
          const unlocked = region.locations.filter(l => playerLevel >= l.levelReq).length;
          return (
            <button
              key={region.id}
              className={`region-item ${locked ? 'locked' : ''} ${isCurrentRegion ? 'current' : ''} ${isArena ? 'arena-region' : ''}`}
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
                {!needsLevel && needsTicket && (
                  <div className="region-req">Requires: {ticketDef.name}</div>
                )}
                {!locked && (
                  <div className="region-progress">
                    {isArena
                      ? 'Free travel · PvP Dueling'
                      : (
                        <>
                          {unlocked}/{locationCount} locations
                          {isCurrentRegion
                            ? ' · You are here'
                            : (isStarter
                              ? ' · Free travel'
                              : (hasTicket ? ' · Ticket ready' : ' · Free travel')
                            )
                          }
                        </>
                      )
                    }
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
