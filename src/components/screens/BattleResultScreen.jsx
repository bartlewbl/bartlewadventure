import ItemDropWindow from '../ItemDropWindow';

export default function BattleResultScreen({ result, onContinue }) {
  if (!result) return null;

  const isBoss = result.isBoss;

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
