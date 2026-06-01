import React, { useEffect, useState, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const CHART_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a78bfa', '#67e8f9', '#6ee7b7', '#fbbf24', '#f472b6', '#818cf8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#141428', border: '1px solid #1e1e3a', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#a78bfa', fontSize: 14, fontWeight: 600, margin: 0 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const tabs = ['Platforms', 'Genres', 'Publishers', 'Yearly Trend'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Platforms');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'global_sales', dir: 'desc' });

  const fetchData = useCallback(async (tab) => {
    if (data[tab]) return;
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (tab) {
        case 'Platforms':
          res = await api.get('/analytics/platform-sales');
          break;
        case 'Genres':
          res = await api.get('/analytics/genre-sales');
          break;
        case 'Publishers':
          res = await api.get('/analytics/top-publishers');
          break;
        case 'Yearly Trend':
          res = await api.get('/analytics/yearly-trend');
          break;
      }
      setData((d) => ({ ...d, [tab]: res.data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    );
  };

  const sortedData = (arr) => {
    if (!arr) return [];
    return [...arr].sort((a, b) => {
      const av = a[sortConfig.key];
      const bv = b[sortConfig.key];
      if (typeof av === 'number') return sortConfig.dir === 'asc' ? av - bv : bv - av;
      return sortConfig.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  };

  const sortIndicator = (key) =>
    sortConfig.key === key ? (sortConfig.dir === 'asc' ? ' ↑' : ' ↓') : '';

  const renderPlatforms = () => {
    const items = data['Platforms'] || [];
    return (
      <>
        <div className="card card-accent-purple" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Top 15 Platforms by Global Sales</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={items} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="platform" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={40} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.1)' }} />
              <Bar dataKey="global_sales" name="Global Sales (M)" fill="#7c3aed" radius={[0, 4, 4, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('platform')}>Platform{sortIndicator('platform')}</th>
                <th onClick={() => handleSort('global_sales')}>Total Sales (M){sortIndicator('global_sales')}</th>
                <th onClick={() => handleSort('game_count')}>Game Count{sortIndicator('game_count')}</th>
                <th>Avg Sales (M)</th>
              </tr>
            </thead>
            <tbody>
              {sortedData(items).map((row) => (
                <tr key={row.platform}>
                  <td><span className="pill pill-purple">{row.platform}</span></td>
                  <td style={{ fontWeight: 600, color: '#a78bfa' }}>{row.global_sales.toLocaleString()}</td>
                  <td>{row.game_count}</td>
                  <td>{(row.global_sales / (row.game_count || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderGenres = () => {
    const items = data['Genres'] || [];
    return (
      <>
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="card card-accent-purple">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Genre Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={items}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="global_sales"
                  nameKey="genre"
                  paddingAngle={2}
                  animationDuration={800}
                >
                  {items.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.7rem' }}
                  formatter={(v) => <span style={{ color: '#94a3b8' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card card-accent-purple">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Avg Sales per Genre</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={items} margin={{ top: 0, right: 10, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis dataKey="genre" tick={{ fill: '#94a3b8', fontSize: 10, angle: -45, textAnchor: 'end' }} interval={0} axisLine={false} tickLine={false} height={60} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.1)' }} />
                <Bar dataKey="avg_sales" name="Avg Sales (M)" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Genre Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {items.map((g, i) => (
            <div key={g.genre} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{g.genre}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                <div>Total: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{g.global_sales.toLocaleString()}M</span></div>
                <div>Games: <span style={{ color: '#f1f5f9' }}>{g.game_count}</span></div>
                <div>Avg: <span style={{ color: '#f1f5f9' }}>{g.avg_sales.toFixed(2)}M</span></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderPublishers = () => {
    const items = data['Publishers'] || [];
    return (
      <>
        <div className="card card-accent-purple" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Top 20 Publishers by Global Sales</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={items} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="publisher" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.1)' }} />
              <Bar dataKey="global_sales" name="Global Sales (M)" fill="#10b981" radius={[0, 4, 4, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('publisher')}>Publisher{sortIndicator('publisher')}</th>
                <th onClick={() => handleSort('global_sales')}>Total Sales (M){sortIndicator('global_sales')}</th>
                <th onClick={() => handleSort('game_count')}>Game Count{sortIndicator('game_count')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedData(items).map((row) => (
                <tr key={row.publisher}>
                  <td style={{ fontWeight: 500 }}>{row.publisher}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>{row.global_sales.toLocaleString()}</td>
                  <td>{row.game_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderYearly = () => {
    const items = data['Yearly Trend'] || [];
    const peakYear = items.reduce(
      (max, item) => (item.global_sales > max.global_sales ? item : max),
      { global_sales: 0, year: 0 }
    );

    return (
      <div className="card card-accent-purple">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Yearly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={items} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="yearlyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed', strokeWidth: 1 }} />
            {peakYear.year > 0 && (
              <ReferenceLine
                x={peakYear.year}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `Peak: ${peakYear.year}`,
                  fill: '#f59e0b',
                  fontSize: 12,
                  position: 'top',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="global_sales"
              name="Global Sales (M)"
              stroke="#a78bfa"
              fill="url(#yearlyGrad)"
              strokeWidth={2}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="error-card">
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={() => { setData(d => { const nd = {...d}; delete nd[activeTab]; return nd; }); fetchData(activeTab); }}>
            Retry
          </button>
        </div>
      );
    }
    switch (activeTab) {
      case 'Platforms': return renderPlatforms();
      case 'Genres': return renderGenres();
      case 'Publishers': return renderPublishers();
      case 'Yearly Trend': return renderYearly();
      default: return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <BarChart3 size={24} />
          <h1>Analytics</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
