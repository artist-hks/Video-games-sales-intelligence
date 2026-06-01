import React, { useState, useEffect, useCallback } from 'react';
import { History as HistoryIcon, Trash2, Download, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadHistory = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vgsi_history') || '[]');
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('vgsi_history', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem('vgsi_history');
    setShowConfirm(false);
  };

  const handleExportCSV = () => {
    if (!history.length) return;

    const headers = [
      'Timestamp',
      'Platform',
      'Genre',
      'Year',
      'NA Sales (M)',
      'EU Sales (M)',
      'JP Sales (M)',
      'Other Sales (M)',
      'Predicted Global Sales (M)',
      'Tier',
    ];

    const rows = history.map((h) => [
      new Date(h.timestamp).toLocaleString(),
      h.inputs.platform,
      h.inputs.genre,
      h.inputs.year,
      h.inputs.na_sales || 0,
      h.inputs.eu_sales || 0,
      h.inputs.jp_sales || 0,
      h.inputs.other_sales || 0,
      h.result.predicted_global_sales,
      h.result.confidence_label,
    ]);

    const csvContent =
      headers.join(',') + '\n' + rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vgsi_predictions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <HistoryIcon size={24} />
          <h1>Prediction History</h1>
        </div>
        {history.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
              <Download size={14} /> Export CSV
            </button>
            {showConfirm ? (
              <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: '#ef4444' }}>
                  <AlertTriangle size={14} style={{ verticalAlign: 'middle' }} /> Sure?
                </span>
                <button className="btn btn-danger-outline btn-sm" onClick={handleClearAll}>
                  Yes, Clear
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-danger-outline btn-sm" onClick={() => setShowConfirm(true)}>
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state" style={{ padding: '4rem 1.5rem' }}>
          <HistoryIcon size={48} style={{ color: '#475569' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500, marginTop: '1rem' }}>No predictions yet</p>
          <p style={{ color: '#475569' }}>
            Head to the Predict page to make your first prediction
          </p>
          <Link to="/predict" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go to Predict <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Game Config</th>
                <th>Regional Inputs (M)</th>
                <th>Predicted Sales</th>
                <th>Tier</th>
                <th>Date</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={h.id}>
                  <td style={{ color: '#475569', fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="pill pill-purple">{h.inputs.platform}</span>
                      <span className="pill pill-cyan">{h.inputs.genre}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{h.inputs.year}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      NA: {h.inputs.na_sales || 0} / EU: {h.inputs.eu_sales || 0} / JP:{' '}
                      {h.inputs.jp_sales || 0} / Other: {h.inputs.other_sales || 0}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: h.result.confidence_color,
                      }}
                    >
                      {h.result.predicted_global_sales.toFixed(2)}M
                    </span>
                  </td>
                  <td>
                    <span
                      className="pill"
                      style={{
                        background: `${h.result.confidence_color}20`,
                        color: h.result.confidence_color,
                      }}
                    >
                      {h.result.confidence_label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formatDate(h.timestamp)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(h.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#475569',
                        padding: '0.25rem',
                        borderRadius: 4,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
