import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLiveChannels } from '@/services/famelack'
import { Play } from 'lucide-react'

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

const CATEGORIES = [
  { id: 'noticias',        label: '📰 Noticias',        keywords: ['noticias','news','cnn','foro tv','adn','milenio','imagen','excelsior','mvs','ntv','n+','telediario','c5n','france 24','bbc','dw','al jazeera','euronews','rtve','24 horas','tele13'] },
  { id: 'deportes',        label: '⚽ Deportes',        keywords: ['espn','fox sports','tudn','deport','sport','claro sport','futbol','marca','nfl','nba','ufc','golf','tennis','wrestling','tyc sport','directv sport'] },
  { id: 'peliculas',       label: '🎬 Películas',       keywords: ['cine','movie','film','cinépolis','telecine','hbo','tnt','tbs','paramount','universal','warner','golden','space'] },
  { id: 'caricaturas',     label: '🐭 Caricaturas',     keywords: ['cartoon','disney','nick','infantil','niños','baby','toon','boomerang','discovery kids','paka','clan','xd','junior'] },
  { id: 'musica',          label: '🎵 Música',          keywords: ['music','música','mtv','vh1','ritmo','beat','vevo','los40','hit'] },
  { id: 'entretenimiento', label: '🎭 Entretenimiento', keywords: [] },
]

const COUNTRY_FLAGS = {
  mx: '🇲🇽', us: '🇺🇸', es: '🇪🇸', ar: '🇦🇷',
  co: '🇨🇴', cl: '🇨🇱', ve: '🇻🇪', pe: '🇵🇪',
}

function categorizeChannel(name) {
  const n = name.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.length && cat.keywords.some(kw => n.includes(kw))) return cat.id
  }
  return 'entretenimiento'
}

function ChannelRow({ ch, countryCode, navigate }) {
  const [hovered, setHovered] = useState(false)
  const flag = COUNTRY_FLAGS[countryCode] || '📺'
  const initial = ch.name?.[0]?.toUpperCase() || '?'

  const handleClick = () => {
    if (ch.stream_urls?.[0]) {
      navigate('/watch/' + ch.nanoid + '?stream=' + encodeURIComponent(ch.stream_urls[0]) + '&nombre=' + encodeURIComponent(ch.name))
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.6rem 1rem',
        borderRadius: 8,
        background: hovered ? 'rgba(229,9,20,0.08)' : 'rgba(255,255,255,0.02)',
        border: '1px solid ' + (hovered ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.05)'),
        cursor: 'pointer',
        transition: 'all 0.15s',
        minWidth: 0,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 8, flexShrink: 0,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', fontFamily: 'Bebas Neue, sans-serif',
        color: '#e50914', fontWeight: 700,
      }}>
        {initial}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ch.name}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#666', marginTop: 2 }}>
          {flag} · EN VIVO
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)',
        borderRadius: 100, padding: '2px 8px', fontSize: 10, color: '#e50914',
        fontFamily: 'monospace', letterSpacing: 1, flexShrink: 0,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e50914', display: 'inline-block' }} />
        LIVE
      </div>

      {hovered && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Play size={14} fill="white" color="white" />
        </div>
      )}
    </div>
  )
}

export default function EnVivoPage() {
  const [country, setCountry] = useState('mx')
  const [allChannels, setAllChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [featured, setFeatured] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setAllChannels([])
    setFeatured(null)
    getLiveChannels(country)
      .then(chs => {
        setAllChannels(chs)
        if (chs.length > 0) setFeatured(chs[0])
      })
      .catch(() => setAllChannels([]))
      .finally(() => setLoading(false))
  }, [country])

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    channels: allChannels.filter(ch => categorizeChannel(ch.name) === cat.id)
  })).filter(cat => cat.channels.length > 0)

  const countryObj = COUNTRIES.find(c => c.code === country)

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 2.5rem', maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ width: 4, height: 28, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
          📡 EN VIVO
        </div>
        {!loading && (
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#555' }}>
            {allChannels.length} canales · {countryObj?.flag} {countryObj?.name}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {COUNTRIES.map(c => (
          <button key={c.code} onClick={() => setCountry(c.code)} style={{
            background: country === c.code ? '#e50914' : 'rgba(255,255,255,0.06)',
            color: country === c.code ? '#fff' : 'rgba(255,255,255,0.55)',
            border: '1px solid ' + (country === c.code ? '#e50914' : 'rgba(255,255,255,0.1)'),
            borderRadius: 20, padding: '0.32rem 0.85rem', fontSize: '0.78rem',
            fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: 0.5,
          }}>
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {featured && !loading && (
        <div
          onClick={() => featured.stream_urls?.[0] && navigate('/watch/' + featured.nanoid + '?stream=' + encodeURIComponent(featured.stream_urls[0]) + '&nombre=' + encodeURIComponent(featured.name))}
          style={{
            display: 'flex', alignItems: 'center', gap: '1.5rem',
            background: 'linear-gradient(135deg, rgba(229,9,20,0.12), rgba(229,9,20,0.04))',
            border: '1px solid rgba(229,9,20,0.25)', borderRadius: 12,
            padding: '1.25rem 1.5rem', marginBottom: '2rem', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 12, background: 'rgba(229,9,20,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontFamily: 'Bebas Neue, sans-serif', color: '#e50914', flexShrink: 0,
          }}>
            {featured.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#e50914', letterSpacing: 2, marginBottom: 4 }}>
              ● DESTACADO AHORA
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 2, color: '#fff' }}>
              {featured.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 2 }}>
              {countryObj?.flag} {countryObj?.name} · Transmisión en vivo
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#e50914', color: '#fff', borderRadius: 6,
            padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700,
            letterSpacing: 1, flexShrink: 0,
          }}>
            <Play size={14} fill="white" /> VER AHORA
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[1,2,3].map(i => (
            <div key={i}>
              <div className="skeleton" style={{ width: 120, height: 20, borderRadius: 4, marginBottom: '0.75rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[1,2,3,4].map(j => (
                  <div key={j} className="skeleton" style={{ width: '100%', height: 68, borderRadius: 8 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {byCategory.map(cat => (
            <div key={cat.id}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.75rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
                  {cat.label}
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444' }}>
                  {cat.channels.length} canales
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {cat.channels.slice(0, 8).map(ch => (
                  <ChannelRow key={ch.nanoid} ch={ch} countryCode={country} navigate={navigate} />
                ))}
                {cat.channels.length > 8 && (
                  <div style={{ textAlign: 'center', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#444' }}>
                    +{cat.channels.length - 8} canales más
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
