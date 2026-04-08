import React, { useState, useEffect } from 'react'
import { getLiveChannels } from '@/services/famelack'
import ChannelCard from '@/components/cards/ChannelCard'

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

// ─── Categorías ───────────────────────────────────────────────────────────────
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

export default function EnVivoPage() {
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
    <div style={{ minHeight: '100vh', padding: '2rem 2.5rem' }}>

      {/* Título */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ width: 4, height: 28, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
          📡 EN VIVO
        </div>
        {!loading && (
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#555' }}>
            {filtered.length} canales
          </span>
        )}
      </div>

      {/* Selector de país */}
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

      {/* Tabs de categoría */}
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

      {/* Grid de canales */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          Sin canales para esta selección.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {filtered.map(ch => (
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
