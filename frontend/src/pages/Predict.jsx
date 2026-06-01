import React, { useEffect, useState } from 'react';
import { Cpu, Gamepad2, Save } from 'lucide-react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Predict() {
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    platform: '',
    genre: '',
    year: 2020,
    na_sales: '',
    eu_sales: '',
    jp_sales: '',
    other_sales: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [pRes, gRes] = await Promise.all([
          api.get('/platforms'),
          api.get('/genres'),
        ]);
        setPlatforms(pRes.data);
        setGenres(gRes.data);
        if (pRes.data.length) setForm((f) => ({ ...f, platform: pRes.data[0] }));
        if (gRes.data.length) setForm((f) => ({ ...f, genre: gRes.data[0] }));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const payload = {
        platform: form.platform,
        genre: form.genre,
        year: parseInt(form.year),
        na_sales: parseFloat(form.na_sales) || 0,
        eu_sales: parseFloat(form.eu_sales) || 0,
        jp_sales: parseFloat(form.jp_sales) || 0,
        other_sales: parseFloat(form.other_sales) || 0,
      };
      const res = await api.post('/predict', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('vgsi_history') || '[]');
    history.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputs: { ...form },
      result: { ...result },
    });
    localStorage.setItem('vgsi_history', JSON.stringify(history));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const salesInputs = [
    { na_sales: form.na_sales },
    { eu_sales: form.eu_sales },
    { jp_sales: form.jp_sales },
    { other_sales: form.other_sales },
  ];
  const maxSale = Math.max(
    parseFloat(form.na_sales) || 0,
    parseFloat(form.eu_sales) || 0,
    parseFloat(form.jp_sales) || 0,
    parseFloat(form.other_sales) || 0,
    0.01
  );

  const regionBars = [
    { label: 'NA', value: parseFloat(form.na_sales) || 0, color: '#7c3aed' },
    { label: 'EU', value: parseFloat(form.eu_sales) || 0, color: '#06b6d4' },
    { label: 'JP', value: parseFloat(form.jp_sales) || 0, color: '#10b981' },
    { label: 'Other', value: parseFloat(form.other_sales) || 0, color: '#f59e0b' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <Cpu size={24} />
          <h1>Predict Sales</h1>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="predict-grid"
      >
        {/* Left: Form */}
        <div className="card card-accent-purple">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="label">Platform</label>
                <select
                  className="select"
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Genre</label>
                <select
                  className="select"
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Release Year</label>
              <input
                className="input"
                type="number"
                name="year"
                min={1980}
                max={2024}
                value={form.year}
                onChange={handleChange}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="label">North America (M)</label>
                <input
                  className="input"
                  type="number"
                  name="na_sales"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 1.20"
                  value={form.na_sales}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Europe (M)</label>
                <input
                  className="input"
                  type="number"
                  name="eu_sales"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 0.80"
                  value={form.eu_sales}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Japan (M)</label>
                <input
                  className="input"
                  type="number"
                  name="jp_sales"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 0.30"
                  value={form.jp_sales}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Other Regions (M)</label>
                <input
                  className="input"
                  type="number"
                  name="other_sales"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 0.20"
                  value={form.other_sales}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              type="submit"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Predict Global Sales'}
            </button>

            <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.75rem', textAlign: 'center' }}>
              Enter regional sales to predict total global performance
            </p>
          </form>
        </div>

        {/* Right: Result */}
        <div>
          {error && (
            <div className="error-card" style={{ marginBottom: '1rem' }}>
              <p>{error}</p>
              <button className="btn btn-primary btn-sm" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {!result && !error && (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: '#475569',
              }}
            >
              <Gamepad2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem' }}>Run a prediction to see results</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.375rem' }}>
                Fill in the form on the left and click predict
              </p>
            </div>
          )}

          {result && (
            <div
              className="card slide-up glow-pulse"
              style={{
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.2)',
              }}
            >
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Predicted Global Sales
              </p>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: result.confidence_color,
                  lineHeight: 1.1,
                }}
              >
                {result.predicted_global_sales.toFixed(2)}M
              </div>

              {/* Tier Badge */}
              <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 1rem',
                    borderRadius: 9999,
                    background: `${result.confidence_color}20`,
                    color: result.confidence_color,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: '0.05em',
                  }}
                >
                  {result.confidence_label}
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                {result.tier_description}
              </p>

              {/* Regional Breakdown Bars */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem', textAlign: 'left' }}>
                  Regional Input Breakdown
                </p>
                {regionBars.map((r) => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ width: 40, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>
                      {r.label}
                    </span>
                    <div style={{ flex: 1, height: 8, background: '#1e1e3a', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(r.value / maxSale) * 100}%`,
                          background: r.color,
                          borderRadius: 4,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    <span style={{ width: 50, fontSize: '0.75rem', color: '#f1f5f9', textAlign: 'left' }}>
                      {r.value.toFixed(2)}M
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`btn ${saved ? 'btn-primary' : 'btn-outline'} btn-full`}
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? (
                  <>Saved!</>
                ) : (
                  <>
                    <Save size={16} /> Save to History
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .predict-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
