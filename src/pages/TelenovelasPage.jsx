import React, { useState, useEffect } from 'react'
import { tmdbAPI } from '@/services/tmdb'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'

const COUNTRIES = [
  { id: 'MX', name: '🇲🇽 México' },
  { id: 'CO', name: '🇨🇴 Colombia' },
  { id: 'AR', name: '🇦🇷 Argentina' },
  { id: 'VE', name: '🇻🇪 Venezuela' },
  { id: 'BR', name: '🇧🇷 Brasil' },
  { id: 'CL', name: '🇨🇱 Chile' },
  { id: 'PE', name: '🇵🇪 Perú' },
]

export default function TelenovelasPage() {
  const [country, setCountry] = useState('MX')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { load(country, 1, true) }, [country])

  async function load(c, p, reset) {
    setLoading(true)
    let d = await tmdbAPI.getTelenovelas(c, p)
    if (!d?.results?.length) {
      d = await tmdbAPI.getSeriesByGenre(18, p)
    }
    if (d?.results) {
      const mapped = d.results.map(s => ({ ...s, type: 'tv' }))
      setItems(prev => reset ? mapped : [...prev, ...mapped])
      setHasMore(d.page < d.total_pages)
      setPage(p)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, marginBottom: '1.25rem' }}>💃 Telenovelas</div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {COUNTRIES.map(c => (
          <button key={c.id} onClick={() => setCountry(c.id)} style={{
            padding: '0.38rem 0.88rem', borderRadius: 3, fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.8px', cursor: 'pointer', textTransform: 'uppercase',
            background: country === c.id ? '#e50914' : 'transparent',
            color: country === c.id ? '#fff' : '#888',
            border: country === c.id ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
          }}>{c.name}</button>
        ))}
      </div>

      {loading && items.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#888' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {items.map(s => <MediaCard key={s.id} item={s} onClick={setSelected} />)}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <button onClick={() => load(country, page + 1, false)} style={{
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
