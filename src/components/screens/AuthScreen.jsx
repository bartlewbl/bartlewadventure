import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: '⚔️', label: 'Battle Monsters' },
  { icon: '🗺️', label: 'Explore Regions' },
  { icon: '🏰', label: 'Build Your Base' },
  { icon: '🐾', label: 'Collect Pets' },
  { icon: '📜', label: 'Complete Quests' },
  { icon: '💰', label: 'Trade & Craft' },
];

export default function AuthScreen({ onLogin, onRegister, error, loading }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [titleGlow, setTitleGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTitleGlow(g => !g), 2000);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (isRegister) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-landing">
        {/* Decorative top border */}
        <div className="auth-border-top" />

        {/* Hero section */}
        <div className="auth-hero">
          <div className="auth-logo-frame">
            <div className="auth-logo-sword left">⚔</div>
            <h1 className={`auth-title ${titleGlow ? 'glow' : ''}`}>
              PIXEL GRIND
            </h1>
            <div className="auth-logo-sword right">⚔</div>
          </div>
          <p className="auth-tagline">Monster Hunter RPG</p>
          <div className="auth-pixel-divider">
            <span className="auth-diamond" />
            <span className="auth-line" />
            <span className="auth-diamond" />
          </div>
        </div>

        {/* Feature badges */}
        <div className="auth-features">
          {FEATURES.map(f => (
            <div className="auth-feature-badge" key={f.label}>
              <span className="auth-feature-icon">{f.icon}</span>
              <span className="auth-feature-label">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Login card */}
        <div className="auth-card">
          <h2 className="auth-card-title">
            {isRegister ? '~ Create Account ~' : '~ Welcome Back ~'}
          </h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="auth-input"
                maxLength={20}
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <span className="auth-loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                isRegister ? '» Register «' : '» Login «'
              )}
            </button>
          </form>

          <button
            className="auth-toggle-btn"
            onClick={() => { setIsRegister(!isRegister); }}
          >
            {isRegister ? 'Have an account? Login' : 'New player? Register'}
          </button>
        </div>

        {/* Version tag */}
        <div className="auth-version">v1.0 — A Bartlew Adventure</div>

        {/* Decorative bottom border */}
        <div className="auth-border-bottom" />
      </div>
    </div>
  );
}
