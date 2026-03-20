export default function ExtraordinaryTraderScreen({ trader, playerGold, onBuy, onLeave }) {
  if (!trader) return null;

  return (
    <div className="screen screen-extraordinary-trader">
      <div className="trader-header">
        <div className="trader-name">{trader.name}</div>
      </div>
      <div className="trader-greeting">{trader.greeting}</div>

      <div className="trader-deals-title">Deals</div>
      <div className="trader-deal-list">
        {trader.deals.map(deal => {
          const canAfford = playerGold >= deal.cost;
          return (
            <div key={deal.id} className={`trader-deal ${!canAfford ? 'too-expensive' : ''}`}>
              <div className="trader-deal-info">
                <div className="trader-deal-desc">{deal.description}</div>
                <div className="trader-deal-cost">
                  {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onBuy(deal.id)}
                disabled={!canAfford}
              >
                {canAfford ? 'Buy' : 'Can\'t afford'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="trader-gold-display">Your gold: {playerGold}g</div>
      <button className="btn btn-back" onClick={onLeave}>Leave Trader</button>
    </div>
  );
}
