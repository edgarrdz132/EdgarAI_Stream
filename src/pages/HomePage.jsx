import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { canalesAPI } from '@/services/supabase'
import { tmdbAPI, IMG_ORI, IMG_W } from '@/services/tmdb'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'
import ChannelCard from '@/components/cards/ChannelCard'

const EDGAR_IMG = 'https://jelxossqzywochqsszsq.supabase.co/storage/v1/object/public/assets/edgarai.jpg'

export default function HomePage() {
  const [hero, setHero] = useState(null)
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [selected, setSelected] = useState(null)

const { data: featured } = useQuery('featured', async () => {
  const { data } = await canalesAPI.getFeatured()
  return data || []
}, { staleTime: 10 * 60 * 1000 })

const { data: deportes } = useQuery('deportes', async () => {
  const { data } = await canalesAPI.getByCategory('deportes', 8)
  return { channels: data || [] }
}, { staleTime: 5 * 60 * 1000 })
  useEffect(() => {
    tmdbAPI.getTrending().then(d => {
      if (d?.results) {
        const item = d.results.find(m => m.backdrop_path)
        if (item) setHero(item)
        setMovies(d.results.filter(m => m.media_type === 'movie').slice(0, 12).map(m => ({ ...m, type: 'movie' })))
        setSeries(d.results.filter(m => m.media_type === 'tv').slice(0, 8).map(s => ({ ...s, type: 'tv' })))
      }
    })
  }, [])

  const heroTitle = hero?.title || hero?.name || 'EdgarAI Stream'
  const heroDesc = hero?.overview || 'Tu plataforma de streaming premium.'
  const heroBg = hero?.backdrop_path ? IMG_ORI + hero.backdrop_path : null

  return (
    <div style={{ minHeight: '100vh' }}>
      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      {/* Hero */}
      <div style={{ position: 'relative', height: '85vh', minHeight: 560, display: 'flex', alignItems: 'flex-end', padding: '0 2.5rem 4rem', overflow: 'hidden' }}>
        {/* Background image */}
        {heroBg && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />}
        {/* Gradients */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #05050a 0%, rgba(5,5,10,0.6) 40%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,10,0.95) 30%, transparent 65%)' }} />

        {/* Mascot */}
        <div style={{ position: 'absolute', right: '4%', bottom: 0, width: 280, zIndex: 2 }}>
          <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: '100%', display: 'block', maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, transparent 100%)', animation: 'fadeInUp 0.8s ease', borderRadius: 16 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: 520 }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: 3, color: '#e50914', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 18, height: 1, background: '#e50914', display: 'inline-block' }} />
            DESTACADO HOY
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 6.5vw, 5rem)', lineHeight: 0.9, letterSpacing: 2, marginBottom: '0.85rem' }}>
            <span style={{ display: 'block', color: '#fff' }}>{heroTitle.split(' ').slice(0, Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}</span>
            <span style={{ display: 'block', color: '#e50914', fontSize: '85%' }}>{heroTitle.split(' ').slice(Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}</span>
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
            {hero?.vote_average && <span style={{ color: '#ffd700', fontWeight: 700 }}>★{hero.vote_average.toFixed(1)}</span>}
            {(hero?.release_date || hero?.first_air_date) && <span>{(hero?.release_date || hero?.first_air_date).slice(0, 4)}</span>}
            <span style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: 3, padding: '1px 6px', fontSize: '0.68rem', color: '#e50914', fontFamily: 'monospace' }}>POPULAR</span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420, marginBottom: '1.5rem' }}>{heroDesc.slice(0, 180)}{heroDesc.length > 180 ? '...' : ''}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => hero && setSelected({ ...hero, type: hero.media_type || 'movie' })} style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(229,9,20,0.3)' }}>▶ REPRODUCIR</button>
            <button onClick={() => hero && setSelected({ ...hero, type: hero.media_type || 'movie' })} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase' }}>ℹ MÁS INFO</button>
          </div>
        </div>
      </div>

      {/* Películas populares */}
      {movies.length > 0 && (
        <div style={{ padding: '1.75rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
              Películas Populares
            </div>
            <Link to="/peliculas" style={{ fontSize: '0.7rem', color: '#e50914', fontFamily: 'monospace', letterSpacing: 1 }}>VER TODO →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {movies.map(m => <MediaCard key={m.id} item={m} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {/* Canales en vivo */}
      {featured?.length > 0 && (
        <div style={{ padding: '1.75rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
              Canales en Vivo
            </div>
            <Link to="/category/entretenimiento" style={{ fontSize: '0.7rem', color: '#e50914', fontFamily: 'monospace', letterSpacing: 1 }}>VER TODO →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {featured.slice(0, 8).map(ch => <ChannelCard key={ch.id} channel={ch} />)}
          </div>
        </div>
      )}

      {/* Series populares */}
      {series.length > 0 && (
        <div style={{ padding: '1.75rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
              Series Populares
            </div>
            <Link to="/series" style={{ fontSize: '0.7rem', color: '#e50914', fontFamily: 'monospace', letterSpacing: 1 }}>VER TODO →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {series.map(s => <MediaCard key={s.id} item={s} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {/* Deportes */}
      {deportes?.channels?.length > 0 && (
        <div style={{ padding: '1.75rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.35rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
              ⚽ Deportes en Vivo
            </div>
            <Link to="/category/deportes" style={{ fontSize: '0.7rem', color: '#e50914', fontFamily: 'monospace', letterSpacing: 1 }}>VER TODO →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {deportes.channels.slice(0, 8).map(ch => <ChannelCard key={ch.id} channel={ch} />)}
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.75rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: 2, color: '#e50914' }}>EdgarAI Stream</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#555' }}>// urbano · digital · anónimo · gratuito</div>
          </div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#555' }}>© {new Date().getFullYear()} EdgarAI Stream</div>
      </footer>
    </div>
  )
}
