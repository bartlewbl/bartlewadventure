export default function EventResultScreen({ result, onContinue }) {
  if (!result) return null;

  const typeClass = result.type === 'great' ? 'result-great'
    : result.type === 'good' ? 'result-good'
    : result.type === 'bad' ? 'result-bad'
    : 'result-neutral';

  return (
    <div className="screen screen-event-result">
      <div className="event-result-title">{result.eventTitle}</div>
      <div className={`event-result-text ${typeClass}`}>{result.text}</div>
      <button className="btn btn-primary" onClick={onContinue}>Continue Exploring</button>
    </div>
  );
}
