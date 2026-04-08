import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { canalesAPI } from '@/services/supabase'
import { tmdbAPI } from '@/services/tmdb'
import ChannelCard from '@/components/cards/ChannelCard'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [channels, setChannels] = useState([])
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    Promise.all([
      canalesAPI.search(q),
      tmdbAPI.searchMovies(q),
      tmdbAPI.searchSeries(q),
    ]).then(([ch, mv, sv]) => {
      setChannels(ch.data || [])
      setMovies((mv?.results || []).map(m => ({ ...m, type: 'movie' })))
      setSeries((sv?.results || []).map(s => ({ ...s, type: 'tv' })))
      setLoading(false)
    })
  }, [q])

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, marginBottom: '1.5rem' }}>
        🔍 Resultados para: <span style={{ color: '#e50914' }}>{q}</span>
      </h1>

      {loading && <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Buscando...</div>}

      {channels.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
            📡 Canales ({channels.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {channels.map((ch, i) => <ChannelCard key={ch.id} channel={ch} index={i} />)}
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
            🎬 Películas ({movies.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {movies.map(m => <MediaCard key={m.id} item={m} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {series.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
            📺 Series ({series.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {series.map(s => <MediaCard key={s.id} item={s} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {!loading && !channels.length && !movies.length && !series.length && q && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>Sin resultados para "{q}"</p>
        </div>
      )}
    </div>
  )
}
