import ItemDropWindow from '../ItemDropWindow';

export default function BattleResultScreen({ result, onContinue }) {
  if (!result) return null;

  const isBoss = result.isBoss;
  const isArena = result.isArena;

  // Arena result rendering
  if (isArena) {
    return (
      <div className="screen screen-result">
        <div className={`result-title ${result.victory ? 'victory' : 'defeat'} arena-result`}>
          {result.victory ? 'ARENA VICTORY!' : 'ARENA DEFEAT...'}
        </div>

        <div className="result-rewards">
          {result.victory ? (
            <>
              <div className="arena-opponent-info">
                Defeated {result.opponentName} ({result.opponentClass})
              </div>
              {result.arenaType === 'normal' && (
                <div>+{result.goldGain} Gold (doubled your {result.wager}g wager!)</div>
              )}
              {result.arenaType === 'gauntlet' && (
                <>
                  <div className="gauntlet-win-info">
                    Win Streak: {result.gauntletWins}!
                  </div>
                  <div>Current Pot: {result.gauntletPot}g</div>
                  <div className="gauntlet-hint">Continue to double or cash out!</div>
                </>
              )}
              {result.arenaType === 'highstakes' && (
                <>
                  <div>+{result.goldGain} Gold</div>
                  <div className="highstakes-win-info">
                    Wager: {result.wager}g + Bonus: {result.bonusGold}g
                  </div>
                </>
              )}
              {result.droppedItem && (
                <ItemDropWindow item={result.droppedItem} label="Arena Reward!" />
              )}
            </>
          ) : (
            <>
              <div className="arena-opponent-info">
                Lost to {result.opponentName} ({result.opponentClass})
              </div>
              <div>Lost {result.goldLost}g wager</div>
              {result.gauntletLoss > 0 && (
                <div>Gauntlet pot lost: {result.gauntletLoss}g</div>
              )}
            </>
          )}
        </div>

        <button className="btn btn-primary" onClick={onContinue}>
          {result.victory && result.arenaType === 'gauntlet' ? 'Continue Gauntlet' : 'Back to Arena'}
        </button>
      </div>
    );
  }

  return (
    <div className="screen screen-result">
      <div className={`result-title ${result.victory ? 'victory' : 'defeat'} ${isBoss ? 'boss-result' : ''}`}>
        {result.victory
          ? (isBoss ? 'BOSS DEFEATED!' : 'VICTORY!')
          : 'DEFEATED...'}
      </div>

      <div className="result-rewards">
        {result.victory ? (
          <>
            {isBoss && <div className="boss-victory-text">You conquered {result.bossName}!</div>}
            <div>+{result.expGain} EXP{result.innBonus ? ` (Inn +${Math.round(result.innBonus * 100)}%)` : ''}</div>
            <div>+{result.goldGain} Gold</div>
            {result.droppedItem && (
              <ItemDropWindow item={result.droppedItem} label="Loot Drop!" />
            )}
            {result.materialDrop && (
              <ItemDropWindow item={result.materialDrop} label="Material Found!" />
            )}
            {result.bossMaterials && result.bossMaterials.map((mat, i) => (
              <ItemDropWindow key={mat.id || i} item={mat} label={i === 0 ? 'Boss Materials!' : ''} />
            ))}
            {result.eggDrop && (
              <ItemDropWindow item={result.eggDrop} label="Rare Find!" />
            )}
            {result.ticketDrop && (
              <ItemDropWindow item={result.ticketDrop} label="Region Ticket Found!" />
            )}
            {!result.droppedItem && result.lostItemName && (
              <div className="rarity-common">
                Pack full: {result.lostItemName} slipped away.
              </div>
            )}
          </>
        ) : (
          <>
            <div>Lost {result.goldLost} gold...</div>
            <div>{isBoss ? 'The boss was too powerful...' : 'You barely escaped with your life.'}</div>
            {result.lostDeliveryItems && result.lostDeliveryItems.length > 0 && (
              <div className="rarity-common" style={{ marginTop: 6 }}>
                Quest items lost: {result.lostDeliveryItems.join(', ')}
              </div>
            )}
          </>
        )}
      </div>

      {result.levelUps?.length > 0 && (
        <div className="result-levelup">
          LEVEL UP! Lv.{result.newLevel}
          <div>Choose your stat upgrades!</div>
        </div>
      )}

      <button className="btn btn-primary" onClick={onContinue}>
        {result.defeated ? 'Return to Town' : 'Continue'}
      </button>
    </div>
  );
}
