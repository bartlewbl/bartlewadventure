import { useState, useEffect } from 'react';

export default function ExtraordinaryTraderScreen({ trader, playerGold, onBuy, onLeave }) {
  const [entered, setEntered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [purchasedId, setPurchasedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Generate sparkle particles around the trader
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => {
        const now = Date.now();
        const filtered = prev.filter(s => now - s.born < 1800);
        if (filtered.length < 6) {
          filtered.push({
            id: now + Math.random(),
            born: now,
            x: 30 + Math.random() * 40,
            y: 10 + Math.random() * 30,
            char: ['*', '+', '.'][Math.floor(Math.random() * 3)],
          });
        }
        return filtered;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (!trader) return null;

  const handleBuy = (dealId) => {
    setPurchasedId(dealId);
    onBuy(dealId);
    setTimeout(() => setPurchasedId(null), 600);
  };

  // Get a theme color based on trader name
  const getTraderTheme = () => {
    const name = trader.name.toLowerCase();
    if (name.includes('shadow') || name.includes('nyx')) return { primary: '#9040e0', secondary: '#6a20b0', glow: 'rgba(144, 64, 224, 0.4)' };
    if (name.includes('smith') || name.includes('grizzle')) return { primary: '#ff8c00', secondary: '#cc6600', glow: 'rgba(255, 140, 0, 0.4)' };
    if (name.includes('witch') || name.includes('luna') || name.includes('energy')) return { primary: '#4fc3f7', secondary: '#0288d1', glow: 'rgba(79, 195, 247, 0.4)' };
    if (name.includes('bone') || name.includes('collector')) return { primary: '#b0bec5', secondary: '#78909c', glow: 'rgba(176, 190, 197, 0.4)' };
    if (name.includes('flora') || name.includes('egg')) return { primary: '#66bb6a', secondary: '#388e3c', glow: 'rgba(102, 187, 106, 0.4)' };
    if (name.includes('krag') || name.includes('material')) return { primary: '#a1887f', secondary: '#795548', glow: 'rgba(161, 136, 127, 0.4)' };
    if (name.includes('void') || name.includes('whisper')) return { primary: '#7c4dff', secondary: '#651fff', glow: 'rgba(124, 77, 255, 0.4)' };
    if (name.includes('patch') || name.includes('scavenger')) return { primary: '#8d6e63', secondary: '#5d4037', glow: 'rgba(141, 110, 99, 0.4)' };
    if (name.includes('ember') || name.includes('fire')) return { primary: '#ff5722', secondary: '#d84315', glow: 'rgba(255, 87, 34, 0.4)' };
    if (name.includes('murk') || name.includes('captain') || name.includes('deep')) return { primary: '#26c6da', secondary: '#00838f', glow: 'rgba(38, 198, 218, 0.4)' };
    return { primary: '#ce93d8', secondary: '#9c27b0', glow: 'rgba(206, 147, 216, 0.4)' };
  };

  const theme = getTraderTheme();

  return (
    <div className={`screen screen-extraordinary-trader ${entered ? 'trader-entered' : ''}`}>
      {/* Ambient sparkles */}
      <div className="trader-sparkle-container">
        {sparkles.map(s => (
          <span
            key={s.id}
            className="trader-sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              color: theme.primary,
              animationDelay: `${(s.born % 500) / 1000}s`,
            }}
          >{s.char}</span>
        ))}
      </div>

      {/* Trader portrait area */}
      <div className="trader-portrait-frame" style={{ borderColor: theme.primary, boxShadow: `0 0 20px ${theme.glow}` }}>
        <div className="trader-portrait-icon" style={{ color: theme.primary }}>
          <div className="trader-portrait-figure">
            <div className="trader-cloak" style={{ background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` }} />
            <div className="trader-eyes" />
          </div>
        </div>
        <div className="trader-aura" style={{ background: `radial-gradient(ellipse, ${theme.glow}, transparent 70%)` }} />
      </div>

      <div className="trader-header">
        <div className="trader-name" style={{ color: theme.primary, textShadow: `0 0 12px ${theme.glow}` }}>
          {trader.name}
        </div>
        <div className="trader-title-tag">Travelling Merchant</div>
      </div>

      <div className="trader-greeting-box" style={{ borderLeftColor: theme.primary }}>
        <div className="trader-greeting">{trader.greeting}</div>
      </div>

      <div className="trader-deals-section">
        <div className="trader-deals-title">
          <span className="trader-deals-icon">&#9830;</span> Available Wares <span className="trader-deals-icon">&#9830;</span>
        </div>
        <div className="trader-deal-list">
          {trader.deals.map((deal, idx) => {
            const canAfford = playerGold >= deal.cost;
            const justBought = purchasedId === deal.id;
            return (
              <div
                key={deal.id}
                className={`trader-deal ${!canAfford ? 'too-expensive' : ''} ${justBought ? 'deal-purchased' : ''}`}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  borderColor: canAfford ? `${theme.primary}44` : undefined,
                }}
              >
                <div className="trader-deal-number" style={{ color: theme.primary }}>{idx + 1}</div>
                <div className="trader-deal-info">
                  <div className="trader-deal-desc">{deal.description}</div>
                  <div className="trader-deal-cost">
                    <span className="trader-gold-icon">&#9679;</span>
                    {deal.cost > 0 ? `${deal.cost}g` : 'Free'}
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm trader-buy-btn"
                  onClick={() => handleBuy(deal.id)}
                  disabled={!canAfford}
                  style={canAfford ? { background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})` } : undefined}
                >
                  {justBought ? 'Sold!' : canAfford ? 'Buy' : 'Can\'t afford'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="trader-footer">
        <div className="trader-gold-display">
          <span className="trader-gold-icon">&#9679;</span> {playerGold}g
        </div>
        <button className="btn btn-back trader-leave-btn" onClick={onLeave}>
          Leave Trader
        </button>
      </div>
    </div>
  );
}
