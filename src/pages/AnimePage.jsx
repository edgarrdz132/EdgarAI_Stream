import React, { useState, useEffect } from 'react'
import { tmdbAPI } from '@/services/tmdb'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'

const TABS = [
  { id: '', name: 'Todos' },
  { id: ',28', name: 'Acción' },
  { id: ',35', name: 'Comedia' },
  { id: ',18', name: 'Drama' },
  { id: ',12', name: 'Aventura' },
  { id: ',10759', name: 'Fantasía' },
]

export default function AnimePage() {
  const [sub, setSub] = useState('')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { load(sub, 1, true) }, [sub])

  async function load(s, p, reset) {
    setLoading(true)
    const d = await tmdbAPI.getAnime(s, p)
    if (d?.results) {
      const mapped = d.results.map(a => ({ ...a, type: 'tv' }))
      setItems(prev => reset ? mapped : [...prev, ...mapped])
      setHasMore(d.page < d.total_pages)
      setPage(p)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, marginBottom: '1.25rem' }}>🎌 Anime</div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{
            padding: '0.38rem 0.88rem', borderRadius: 3, fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.8px', cursor: 'pointer', textTransform: 'uppercase',
            background: sub === t.id ? '#e50914' : 'transparent',
            color: sub === t.id ? '#fff' : '#888',
            border: sub === t.id ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
          }}>{t.name}</button>
        ))}
      </div>

      {loading && items.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#888' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {items.map(a => <MediaCard key={a.id} item={a} onClick={setSelected} />)}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <button onClick={() => load(sub, page + 1, false)} style={{
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
