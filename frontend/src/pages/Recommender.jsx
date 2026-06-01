import React, { useEffect, useState } from 'react';
import { Star, Search, Ghost } from 'lucide-react';
import api from '../api';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Recommender() {
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platform, setPlatform] = useState('');
  const [genre, setGenre] = useState('All');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [pRes, gRes] = await Promise.all([
          api.get('/platforms'),
          api.get('/genres'),
        ]);
        setPlatforms(pRes.data);
        setGenres(gRes.data);
        if (pRes.data.length) setPlatform(pRes.data[0]);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOptions();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const params = { platform, limit: 20 };
      if (genre && genre !== 'All') params.genre = genre;
      const res = await api.get('/recommend', { params });
      setGames(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const maxSales = games.length ? Math.max(...games.map((g) => g.global_sales)) : 1;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <Star size={24} />
          <h1>Recommender</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form
          onSubmit={handleSearch}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <div style={{ flex: 1, minWidth: 150 }}>
            <label className="label">Platform</label>
            <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label className="label">Genre (optional)</label>
            <select className="select" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="All">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ height: 40 }}>
            {loading ? <LoadingSpinner size="sm" color="white" /> : <><Search size={16} /> Find Games</>}
          </button>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="error-card" style={{ marginBottom: '1rem' }}>
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>Retry</button>
        </div>
      )}

      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 12 }} />
          ))}
        </div>
      )}

      {!loading && searched && games.length === 0 && (
        <div className="empty-state">
          <Ghost size={48} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>No games found for this platform</p>
          <p>Try selecting a different platform or genre</p>
        </div>
      )}

      {!loading && games.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {games.map((game) => (
            <GameCard key={`${game.rank}-${game.name}`} game={game} maxSales={maxSales} />
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="empty-state">
          <Search size={48} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Select a platform and hit "Find Games"</p>
          <p>Discover the top-selling games for any platform</p>
        </div>
      )}
    </div>
  );
}
