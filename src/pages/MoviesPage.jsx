import React, { useState, useEffect } from 'react'
import { tmdbAPI } from '@/services/tmdb'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'

const GENRES = [
  { id: 0, name: 'Populares' },
  { id: 28, name: 'Acción' },
  { id: 35, name: 'Comedia' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Terror' },
  { id: 16, name: 'Animación' },
  { id: 53, name: 'Suspenso' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' },
  { id: 12, name: 'Aventura' },
  { id: 99, name: 'Documental' },
]

export default function MoviesPage() {
  const [genre, setGenre] = useState(0)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { load(genre, 1, true) }, [genre])

  async function load(g, p, reset) {
    setLoading(true)
    const d = g ? await tmdbAPI.getMoviesByGenre(g, p) : await tmdbAPI.getPopularMovies(p)
    if (d?.results) {
      const mapped = d.results.map(m => ({ ...m, type: 'movie' }))
      setItems(prev => reset ? mapped : [...prev, ...mapped])
      setHasMore(d.page < d.total_pages)
      setPage(p)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, marginBottom: '1.25rem' }}>🎬 Películas</div>

      {/* Genre tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {GENRES.map(g => (
          <button key={g.id} onClick={() => setGenre(g.id)} style={{
            padding: '0.38rem 0.88rem', borderRadius: 3, fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.8px', cursor: 'pointer', textTransform: 'uppercase',
            background: genre === g.id ? '#e50914' : 'transparent',
            color: genre === g.id ? '#fff' : '#888',
            border: genre === g.id ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
          }}>{g.name}</button>
        ))}
      </div>

      {/* Grid */}
      {loading && items.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#888' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {items.map(m => <MediaCard key={m.id} item={m} onClick={setSelected} />)}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <button onClick={() => load(genre, page + 1, false)} style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
              }}>⬇ Cargar más</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
