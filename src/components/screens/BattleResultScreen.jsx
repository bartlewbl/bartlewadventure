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
          ? result.isWaveDefense
            ? (result.waveDefenseComplete ? 'FIRE DEFENDED!' : `WAVE ${result.waveNumber} CLEAR!`)
            : (isBoss ? 'BOSS DEFEATED!' : 'VICTORY!')
          : result.isWaveDefense ? 'THE FIRE IS EXTINGUISHED...' : 'DEFEATED...'}
      </div>

      {result.isWaveDefense && result.victory && (
        <div style={{ textAlign: 'center', padding: '6px 10px', margin: '4px 0', background: 'rgba(255,100,30,0.12)', borderRadius: 6, border: '1px solid rgba(255,100,30,0.3)', color: '#ffa040', fontSize: '0.9em' }}>
          {result.waveDefenseComplete
            ? `All ${result.totalWaves} waves defeated! The flame burns eternal.`
            : `Wave ${result.waveNumber} of ${result.totalWaves} complete. Prepare for the next assault...`}
        </div>
      )}

      <div className="result-rewards">
        {result.victory ? (
          <>
            {isBoss && <div className="boss-victory-text">You conquered {result.bossName}!</div>}
            <div>+{result.expGain} EXP{result.innBonus ? ` (Inn +${Math.round(result.innBonus * 100)}%)` : ''}{result.waveDefenseComplete ? ` (${result.waveTier} defense bonus!)` : ''}</div>
            <div>+{result.goldGain} Gold{result.waveDefenseComplete ? ' (defense bonus!)' : ''}</div>
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
            {result.tavernQuestDrops && result.tavernQuestDrops.map((item, i) => (
              <div key={item.id || i} className="battle-result-quest-drop">
                <div className="battle-result-quest-drop-label">Quest Item Found!</div>
                <div className="battle-result-quest-drop-name" style={{ color: '#ffd700' }}>{item.name}</div>
                <div className="battle-result-quest-drop-desc">{item.desc}</div>
              </div>
            ))}
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
        {result.defeated
          ? 'Return to Town'
          : result.isWaveDefense && !result.waveDefenseComplete
            ? 'Face Next Wave'
            : 'Continue'}
      </button>
    </div>
  );
}
