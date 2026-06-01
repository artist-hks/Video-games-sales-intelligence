import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  DollarSign,
  Monitor,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import api from '../api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CHART_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a78bfa', '#67e8f9', '#6ee7b7'];
const PIE_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#141428',
        border: '1px solid #1e1e3a',
        borderRadius: 8,
        padding: '10px 14px',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            color: p.color || '#a78bfa',
            fontSize: 14,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [regional, setRegional] = useState(null);
  const [platforms, setPlatforms] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [ovRes, regRes, platRes, yearRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/regional-breakdown'),
          api.get('/analytics/platform-sales'),
          api.get('/analytics/yearly-trend'),
        ]);
        setOverview(ovRes.data);
        setRegional(regRes.data);
        setPlatforms(platRes.data);
        setYearly(yearRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card">
        <p>Failed to load dashboard data: {error}</p>
        <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const regionalData = regional
    ? [
        { name: 'North America', value: regional.NA },
        { name: 'Europe', value: regional.EU },
        { name: 'Japan', value: regional.JP },
        { name: 'Other', value: regional.Other },
      ]
    : [];

  const topPlatforms = (platforms || []).slice(0, 10);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <LayoutDashboard size={24} />
          <h1>Dashboard</h1>
        </div>
        <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{today}</span>
      </div>

      {/* Stats Grid */}
      {overview && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard
            icon={Gamepad2}
            label="Total Games"
            value={overview.total_games}
            color="#7c3aed"
          />
          <StatCard
            icon={DollarSign}
            label="Global Sales"
            value={overview.total_global_sales}
            color="#06b6d4"
            suffix="M"
          />
          <StatCard
            icon={Monitor}
            label="Top Platform"
            value={overview.top_platform}
            color="#10b981"
          />
          <StatCard
            icon={Layers}
            label="Top Genre"
            value={overview.top_genre}
            color="#f59e0b"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Regional Pie Chart */}
        <div className="card card-accent-purple">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Sales by Region</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={regionalData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-out"
              >
                {regionalData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }}
                formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Platforms Bar */}
        <div className="card card-accent-purple">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Top 10 Platforms</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topPlatforms}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="platform"
                type="category"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.1)' }} />
              <Bar
                dataKey="global_sales"
                name="Global Sales (M)"
                fill="#7c3aed"
                radius={[0, 4, 4, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yearly Trend */}
      <div className="card card-accent-purple">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Sales Trend by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={yearly || []} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="global_sales"
              name="Global Sales (M)"
              stroke="#a78bfa"
              fill="url(#gradPurple)"
              strokeWidth={2}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
