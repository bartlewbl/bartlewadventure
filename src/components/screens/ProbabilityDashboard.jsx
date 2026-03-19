import { useState, useEffect, useCallback } from 'react';
import { getProbabilityConfig, bulkUpdateProbabilityConfig, resetProbabilityConfig } from '../../api';
import { replaceAll } from '../../data/probabilityStore';

export default function ProbabilityDashboard({ onBack }) {
  const [configs, setConfigs] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProbabilityConfig();
      setConfigs(data.configs || []);
      setEditedValues({});
    } catch (err) {
      setMessage({ text: 'Failed to load config', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const categories = [...new Set(configs.map(c => c.category))];

  const filteredConfigs = configs.filter(c => {
    if (activeCategory && c.category !== activeCategory) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  const grouped = {};
  for (const c of filteredConfigs) {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  }

  const handleChange = (key, val) => {
    setEditedValues(prev => ({ ...prev, [key]: val }));
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  const handleSave = async () => {
    const updates = Object.entries(editedValues)
      .map(([key, val]) => ({ key, value: parseFloat(val) }))
      .filter(u => !isNaN(u.value));
    if (updates.length === 0) return;
    setSaving(true);
    try {
      const data = await bulkUpdateProbabilityConfig(updates);
      setConfigs(data.configs || []);
      replaceAll(data.configs || []);
      setEditedValues({});
      setMessage({ text: `Saved ${updates.length} change${updates.length > 1 ? 's' : ''}!`, type: 'success' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ text: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset ALL probability values to defaults?')) return;
    setSaving(true);
    try {
      const data = await resetProbabilityConfig();
      setConfigs(data.configs || []);
      replaceAll(data.configs || []);
      setEditedValues({});
      setMessage({ text: 'Reset to defaults!', type: 'success' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ text: 'Failed to reset', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const formatDisplay = (value) => {
    if (value >= 1 && Number.isInteger(value)) return String(value);
    if (value < 0.01 && value > 0) return (value * 100).toFixed(2) + '%';
    if (value <= 1 && value > 0) return (value * 100).toFixed(1) + '%';
    return String(value);
  };

  return (
    <div className="screen prob-dashboard">
      <div className="prob-header">
        <button className="btn btn-back" onClick={onBack}>Back</button>
        <h2 className="prob-title">Probability Dashboard</h2>
        <div className="prob-header-actions">
          <button className="btn btn-reset" onClick={handleReset} disabled={saving}>Reset Defaults</button>
          <button className="btn btn-save" onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? 'Saving...' : `Save${hasChanges ? ` (${Object.keys(editedValues).length})` : ''}`}
          </button>
        </div>
      </div>

      {message && (
        <div className={`prob-message prob-message-${message.type}`}>{message.text}</div>
      )}

      <div className="prob-controls">
        <input
          type="text"
          className="prob-search"
          placeholder="Search configs..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <div className="prob-categories">
          <button
            className={`prob-cat-btn ${!activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`prob-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="prob-loading">Loading configuration...</div>
      ) : (
        <div className="prob-grid">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="prob-category">
              <h3 className="prob-cat-title">{category}</h3>
              <div className="prob-items">
                {items.map(item => {
                  const currentValue = editedValues[item.key] !== undefined
                    ? editedValues[item.key]
                    : item.value;
                  const isEdited = editedValues[item.key] !== undefined;
                  return (
                    <div key={item.key} className={`prob-item ${isEdited ? 'prob-item-edited' : ''}`}>
                      <div className="prob-item-header">
                        <span className="prob-item-label">{item.label}</span>
                        <span className="prob-item-display">{formatDisplay(parseFloat(currentValue))}</span>
                      </div>
                      <div className="prob-item-desc">{item.description}</div>
                      <div className="prob-item-input">
                        <input
                          type="number"
                          step="any"
                          value={currentValue}
                          onChange={e => handleChange(item.key, e.target.value)}
                          className="prob-input"
                        />
                        <span className="prob-item-key">{item.key}</span>
                        {isEdited && (
                          <button
                            className="prob-undo"
                            onClick={() => setEditedValues(prev => {
                              const next = { ...prev };
                              delete next[item.key];
                              return next;
                            })}
                          >Undo</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
