import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tmdbAPI, IMG_ORI } from '@/services/tmdb'
import { getLiveChannels } from '@/services/famelack'
import MediaCard from '@/components/cards/MediaCard'
import MediaModal from '@/components/player/MediaModal'
import ChannelCard from '@/components/cards/ChannelCard'
import { useHeroSlides } from '@/hooks/useHeroSlides'

const EDGAR_IMG = 'https://jelxossqzywochqsszsq.supabase.co/storage/v1/object/public/assets/edgarai.jpg'

// ─── Países ───────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'mx', flag: '🇲🇽', name: 'México' },
  { code: 'us', flag: '🇺🇸', name: 'USA' },
  { code: 'es', flag: '🇪🇸', name: 'España' },
  { code: 'ar', flag: '🇦🇷', name: 'Argentina' },
  { code: 'co', flag: '🇨🇴', name: 'Colombia' },
  { code: 'cl', flag: '🇨🇱', name: 'Chile' },
  { code: 've', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'pe', flag: '🇵🇪', name: 'Perú' },
]

// ─── Categorías con palabras clave ────────────────────────────────────────────
const CATEGORIES = [
  { id: 'todos',           label: '📺 Todos',          keywords: [] },
  { id: 'noticias',        label: '📰 Noticias',        keywords: ['noticias','news','cnn','foro tv','adn','milenio','imagen','excelsior','mvs','ntv','n+','telediario','c5n','france 24','bbc','dw','al jazeera','euronews','rtve','24 horas','tele13'] },
  { id: 'deportes',        label: '⚽ Deportes',        keywords: ['espn','fox sports','tudn','deport','sport','claro sport','futbol','fútbol','marca','nfl','nba','ufc','golf','tennis','wrestling','tyc sport','directv sport'] },
  { id: 'caricaturas',     label: '🐭 Caricaturas',     keywords: ['cartoon','disney','nick','infantil','niños','baby','toon','boomerang','discovery kids','paka','clan','xd','junior'] },
  { id: 'peliculas',       label: '🎬 Películas',       keywords: ['cine','movie','film','cinépolis','telecine','hbo','tnt','tbs','paramount','universal','warner','golden','space'] },
  { id: 'entretenimiento', label: '🎭 Entretenimiento', keywords: ['telenovela','azteca','televisa','las estrellas','gala','cuatro','antena 3','mega','chilevisión','caracol','rcn','venevisión','latina','america tv'] },
  { id: 'musica',          label: '🎵 Música',          keywords: ['music','música','mtv','vh1','ritmo','beat','vevo','los40','hit'] },
]

function categorizeChannel(name) {
  const n = name.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.id === 'todos') continue
    if (cat.keywords.some(kw => n.includes(kw))) return cat.id
  }
  return 'entretenimiento'
}

// ─── Sección EN VIVO ──────────────────────────────────────────────────────────
function LiveSection() {
  const [country, setCountry] = useState('mx')
  const [category, setCategory] = useState('todos')
  const [allChannels, setAllChannels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setAllChannels([])
    getLiveChannels(country)
      .then(chs => setAllChannels(chs))
      .catch(() => setAllChannels([]))
      .finally(() => setLoading(false))
  }, [country])

  const filtered = category === 'todos'
    ? allChannels
    : allChannels.filter(ch => categorizeChannel(ch.name) === category)

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 3, height: 22, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
          📡 EN VIVO
        </div>
        {!loading && (
          <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#555' }}>
            {filtered.length} canales
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {COUNTRIES.map(c => (
          <button
            key={c.code}
            onClick={() => { setCountry(c.code); setCategory('todos') }}
            style={{
              background: country === c.code ? '#e50914' : 'rgba(255,255,255,0.06)',
              color: country === c.code ? '#fff' : 'rgba(255,255,255,0.55)',
              border: `1px solid ${country === c.code ? '#e50914' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 20,
              padding: '0.32rem 0.85rem',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.15s',
              letterSpacing: 0.5,
            }}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              background: category === cat.id ? 'rgba(229,9,20,0.15)' : 'transparent',
              color: category === cat.id ? '#e50914' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${category === cat.id ? 'rgba(229,9,20,0.4)' : 'transparent'}`,
              borderRadius: 6,
              padding: '0.28rem 0.7rem',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.15s',
              letterSpacing: 0.5,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
          Sin canales para esta selección.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {filtered.slice(0, 12).map(ch => (
            <ChannelCard
              key={ch.nanoid}
              channel={{
                id: ch.nanoid,
                nombre: ch.name,
                estado: 'activo',
                stream_url: ch.stream_urls?.[0],
                thumbnail: null,
                categoria: categorizeChannel(ch.name),
                idioma: ch.languages?.[0] || 'es',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [selected, setSelected] = useState(null)

  // Hero carousel
  const { slides } = useHeroSlides()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  // Películas y series para las secciones de abajo
  useEffect(() => {
    tmdbAPI.getTrending().then(d => {
      if (d?.results) {
        setMovies(d.results.filter(m => m.media_type === 'movie').slice(0, 12).map(m => ({ ...m, type: 'movie' })))
        setSeries(d.results.filter(m => m.media_type === 'tv').slice(0, 8).map(s => ({ ...s, type: 'tv' })))
      }
    })
  }, [])

  // Auto-avance del carousel cada 6 segundos
  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
        setFadeIn(true)
      }, 500)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides])

  const slide = slides[currentSlide]
  const isLive = slide?.isLive

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}

      {/* ── Hero Carousel ── */}
      <div style={{ position: 'relative', height: '85vh', minHeight: 560, display: 'flex', alignItems: 'flex-end', padding: '0 2.5rem 4rem', overflow: 'hidden' }}>

        {/* Fondo */}
        {isLive && slide?.logo ? (
          <>
            <div style={{ position: 'absolute', inset: 0, background: '#05050a' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={slide.logo}
                alt={slide.title}
                style={{ maxWidth: '40%', maxHeight: '50%', objectFit: 'contain', opacity: 0.12, filter: 'blur(3px)' }}
              />
            </div>
          </>
        ) : slide?.backdrop ? (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'brightness(0.28)',
            transition: 'opacity 0.5s ease',
          }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#05050a' }} />
        )}

        {/* Gradientes */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #05050a 0%, rgba(5,5,10,0.6) 40%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,10,0.95) 30%, transparent 65%)' }} />

        {/* Mascota EdgarAI */}
        <div style={{ position: 'absolute', right: '4%', bottom: 0, width: 280, zIndex: 2 }}>
          <img
            src={EDGAR_IMG}
            alt="EdgarAI"
            style={{
              width: '100%',
              display: 'block',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, transparent 100%)',
              borderRadius: 16,
            }}
            onError={e => e.target.style.display = 'none'}
          />
        </div>

        {/* Contenido animado */}
        <div
          key={currentSlide}
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: 520,
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {/* Badge categoría */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            letterSpacing: 3,
            color: slide?.badgeColor || '#e50914',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ width: 18, height: 1, background: slide?.badgeColor || '#e50914', display: 'inline-block' }} />
            {slide?.badge || 'DESTACADO HOY'}
          </div>

          {/* Título */}
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 6.5vw, 5rem)', lineHeight: 0.9, letterSpacing: 2, marginBottom: '0.85rem' }}>
            {(() => {
              const t = slide?.title || 'EdgarAI Stream'
              const words = t.split(' ')
              const half = Math.ceil(words.length / 2)
              return (
                <>
                  <span style={{ display: 'block', color: '#fff' }}>{words.slice(0, half).join(' ')}</span>
                  <span style={{ display: 'block', color: slide?.badgeColor || '#e50914', fontSize: '85%' }}>{words.slice(half).join(' ')}</span>
                </>
              )
            })()}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
            {slide?.item?.vote_average > 0 && (
              <span style={{ color: '#ffd700', fontWeight: 700 }}>★{slide.item.vote_average.toFixed(1)}</span>
            )}
            {(slide?.item?.release_date || slide?.item?.first_air_date) && (
              <span>{(slide.item.release_date || slide.item.first_air_date).slice(0, 4)}</span>
            )}
            {slide?.badge && (
              <span style={{
                background: `${slide.badgeColor}22`,
                border: `1px solid ${slide.badgeColor}55`,
                borderRadius: 3,
                padding: '1px 6px',
                fontSize: '0.68rem',
                color: slide.badgeColor,
                fontFamily: 'monospace',
              }}>
                {slide.badge}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420, marginBottom: '1.5rem' }}>
            {(slide?.description || 'Tu plataforma de streaming premium.').slice(0, 180)}
            {(slide?.description || '').length > 180 ? '...' : ''}
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isLive ? (
              <button
                onClick={() => navigate('/en-vivo')}
                style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(22,163,74,0.3)' }}
              >
                📡 VER EN VIVO
              </button>
            ) : (
              <>
                <button
                  onClick={() => slide?.item && setSelected({ ...slide.item, type: slide.item.type || slide.item.media_type || 'movie' })}
                  style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(229,9,20,0.3)' }}
                >
                  ▶ REPRODUCIR
                </button>
                <button
                  onClick={() => slide?.item && setSelected({ ...slide.item, type: slide.item.type || slide.item.media_type || 'movie' })}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase' }}
                >
                  ℹ MÁS INFO
                </button>
              </>
            )}
          </div>

          {/* Dots navegación */}
          {slides.length > 1 && (
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.5rem' }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFadeIn(false)
                    setTimeout(() => { setCurrentSlide(i); setFadeIn(true) }, 300)
                  }}
                  style={{
                    width: i === currentSlide ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === currentSlide ? (slide?.badgeColor || '#e50914') : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── EN VIVO ── */}
      <LiveSection />

      {/* ── Películas populares ── */}
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

      {/* ── Series populares ── */}
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

      {/* ── Footer ── */}
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

