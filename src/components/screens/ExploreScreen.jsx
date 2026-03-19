import ItemDropWindow from '../ItemDropWindow';

export default function ExploreScreen({ location, text, foundItem, onContinue, onBack }) {
  return (
    <div className="screen screen-explore">
      <div className="explore-location">{location?.name}</div>
      <div className="explore-text">{text}</div>
      {foundItem && <ItemDropWindow item={foundItem} />}
      <div className="explore-actions">
        <button className="btn btn-primary" onClick={onContinue}>Continue</button>
        <button className="btn btn-back" onClick={onBack}>Leave Location</button>
      </div>
    </div>
  );
}
