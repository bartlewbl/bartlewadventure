import { useState, useRef, useEffect } from 'react';
import { TAVERN_NPCS } from '../../data/tavernData';
import { SPRITES, drawSprite } from '../../data/sprites';

function NpcSprite({ npcId, scale = 4 }) {
  const canvasRef = useRef(null);
  const spriteData = SPRITES.tavern?.[npcId];

  useEffect(() => {
    if (!canvasRef.current || !spriteData) return;
    const ctx = canvasRef.current.getContext('2d');
    const w = spriteData[0].length * scale;
    const h = spriteData.length * scale;
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    ctx.clearRect(0, 0, w, h);
    drawSprite(ctx, spriteData, 0, 0, scale);
  }, [spriteData, scale]);

  if (!spriteData) return null;
  return <canvas ref={canvasRef} className="tavern-npc-sprite" />;
}

export default function TavernScreen({ onBack }) {
  const [activeNpcId, setActiveNpcId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [lineIndex, setLineIndex] = useState(0);

  const activeNpc = TAVERN_NPCS.find(n => n.id === activeNpcId);
  const currentTopic = activeNpc?.topics.find(t => t.id === activeTopic);
  const currentLine = currentTopic?.lines[lineIndex] || null;

  const handleSelectNpc = (npcId) => {
    setActiveNpcId(npcId);
    setActiveTopic(null);
    setLineIndex(0);
  };

  const handleSelectTopic = (topicId) => {
    setActiveTopic(topicId);
    setLineIndex(0);
  };

  const handleNextLine = () => {
    if (currentTopic && lineIndex < currentTopic.lines.length - 1) {
      setLineIndex(i => i + 1);
    } else {
      setActiveTopic(null);
      setLineIndex(0);
    }
  };

  return (
    <div className="screen screen-tavern">
      <div className="tavern-header">
        <div className="tavern-title">The Dusty Flagon</div>
        <div className="tavern-subtitle">Talk to the locals, learn their stories</div>
      </div>

      {/* NPC selector row */}
      <div className="tavern-npc-list">
        {TAVERN_NPCS.map(npc => (
          <button
            key={npc.id}
            className={`tavern-npc-card ${activeNpcId === npc.id ? 'active' : ''}`}
            onClick={() => handleSelectNpc(npc.id)}
          >
            <NpcSprite npcId={npc.id} scale={3} />
            <span className="tavern-npc-name" style={{ color: npc.color }}>{npc.name}</span>
            <span className="tavern-npc-role">{npc.role}</span>
          </button>
        ))}
      </div>

      {/* Conversation area */}
      {activeNpc && (
        <div className="tavern-conversation">
          <div className="tavern-conv-header">
            <NpcSprite npcId={activeNpc.id} scale={5} />
            <div className="tavern-conv-info">
              <div className="tavern-conv-name" style={{ color: activeNpc.color }}>{activeNpc.name}</div>
              <div className="tavern-conv-role">{activeNpc.role}</div>
            </div>
          </div>

          <div className="tavern-dialogue-box">
            {!activeTopic && (
              <>
                <div className="tavern-dialogue-text">{activeNpc.greeting}</div>
                <div className="tavern-topic-list">
                  {activeNpc.topics.map(topic => (
                    <button
                      key={topic.id}
                      className="tavern-topic-btn"
                      onClick={() => handleSelectTopic(topic.id)}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeTopic && currentLine && (
              <>
                <div className="tavern-dialogue-text">{currentLine}</div>
                <div className="tavern-dialogue-nav">
                  <span className="tavern-dialogue-counter">
                    {lineIndex + 1} / {currentTopic.lines.length}
                  </span>
                  <button className="tavern-dialogue-next" onClick={handleNextLine}>
                    {lineIndex < currentTopic.lines.length - 1 ? 'Continue...' : 'Back to topics'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!activeNpc && (
        <div className="tavern-empty">
          <div className="tavern-empty-text">Choose someone to talk to...</div>
        </div>
      )}

      <button className="btn btn-back tavern-back-btn" onClick={onBack}>Leave Tavern</button>
    </div>
  );
}
