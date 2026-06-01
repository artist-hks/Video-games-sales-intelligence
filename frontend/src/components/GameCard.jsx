import React from 'react';
import { Trophy } from 'lucide-react';

const rankColors = {
  1: '#f59e0b',
  2: '#94a3b8',
  3: '#cd7f32',
};

export default function GameCard({ game, maxSales = 100 }) {
  const salesPercent = Math.min((game.global_sales / maxSales) * 100, 100);
  const rankColor = rankColors[game.rank] || '#475569';

  return (
    <div className="card" style={{ padding: '1.25rem', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        {/* Rank Badge */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `${rankColor}20`,
            border: `2px solid ${rankColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: '0.875rem',
            color: rankColor,
            flexShrink: 0,
          }}
        >
          {game.rank <= 3 ? <Trophy size={14} color={rankColor} /> : game.rank}
        </div>

        {/* Title + Platform */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: '#f1f5f9',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={game.name}
          >
            {game.name}
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <span className="pill pill-purple">{game.platform}</span>
            <span className="pill pill-cyan">{game.genre}</span>
          </div>
        </div>
      </div>

      {/* Sales Bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            marginBottom: '0.25rem',
          }}
        >
          <span style={{ color: '#94a3b8' }}>Global Sales</span>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              color: '#a78bfa',
              fontSize: '0.9375rem',
            }}
          >
            {game.global_sales.toFixed(2)}M
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: '#1e1e3a',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${salesPercent}%`,
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          color: '#94a3b8',
        }}
      >
        <div>Year: <span style={{ color: '#f1f5f9' }}>{game.year || 'N/A'}</span></div>
        <div>Publisher: <span style={{ color: '#f1f5f9' }}>{game.publisher || 'N/A'}</span></div>
        <div>NA: <span style={{ color: '#f1f5f9' }}>{game.na_sales}M</span></div>
        <div>EU: <span style={{ color: '#f1f5f9' }}>{game.eu_sales}M</span></div>
        <div>JP: <span style={{ color: '#f1f5f9' }}>{game.jp_sales}M</span></div>
        <div>Other: <span style={{ color: '#f1f5f9' }}>{game.other_sales}M</span></div>
      </div>
    </div>
  );
}
