export default function RandomEventScreen({ event, onChoose, onBack }) {
  if (!event) return null;

  return (
    <div className="screen screen-random-event">
      <div className="event-title">{event.title}</div>
      <div className="event-description">{event.description}</div>
      <div className="event-choices">
        {event.choices.map((choice, i) => (
          <button key={i} className="btn btn-primary" onClick={() => onChoose(i)}>
            {choice.label}
          </button>
        ))}
      </div>
      <button className="btn btn-back" onClick={onBack}>Flee (Return to Town)</button>
    </div>
  );
}
