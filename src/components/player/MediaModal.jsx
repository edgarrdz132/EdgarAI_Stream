import React, { useState, useEffect } from 'react'
import { IMG_ORI, IMG_W, EMBED_MOVIE, EMBED_TV, SOURCE_NAMES, tmdbAPI } from '@/services/tmdb'

export default function MediaModal({ item, onClose }) {
  const [srcIdx, setSrcIdx] = useState(0)
  const [lang, setLang] = useState('es')
  const [seasons, setSeasons] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [playing, setPlaying] = useState(false)

  const isTV = item?.type === 'tv' || !!item?.first_air_date
  const title = item?.title || item?.name || '—'
  const year = (item?.release_date || item?.first_air_date || '').slice(0, 4)
  const rating = (item?.vote_average || 0).toFixed(1)
  const backdrop = item?.backdrop_path ? IMG_ORI + item.backdrop_path : null
  const poster = item?.poster_path ? IMG_W + item.poster_path : null

  useEffect(() => {
    if (!item) return
    if (isTV && item.id) {
      tmdbAPI.getTVDetail(item.id).then(d => {
        if (!d?.seasons) return
        const s = d.seasons.filter(x => x.season_number > 0)
        setSeasons(s)
        if (s.length) loadEpisodes(item.id, s[0].season_number)
      })
    }
  }, [item])

  async function loadEpisodes(id, s) {
    const d = await tmdbAPI.getTVSeason(id, s)
    if (d?.episodes) setEpisodes(d.episodes)
  }

  function getEmbedUrl() {
    if (isTV) return EMBED_TV[srcIdx](item.id, season, episode, lang)
    return EMBED_MOVIE[srcIdx](item.id, lang)
  }

  if (!item) return null

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, width: 'min(960px, 97vw)', maxHeight: '92vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'scaleIn 0.25s ease'
      }}>
        {/* Video area */}
        <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: '#000', flexShrink: 0 }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            background: 'rgba(0,0,0,0.75)', border: 'none', color: '#fff',
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '0.9rem'
          }}>✕</button>

          {playing ? (
            <iframe src={getEmbedUrl()} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="autoplay; encrypted-media; fullscreen *; picture-in-picture"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }} onClick={() => setPlaying(true)}>
              {backdrop && <img src={backdrop} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 0.75rem', boxShadow: '0 0 30px rgba(229,9,20,0.5)' }}>▶</div>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace', letterSpacing: 2 }}>PRESIONA PARA REPRODUCIR</div>
              </div>
            </div>
          )}
        </div>

        {/* Info area */}
        <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.7rem', letterSpacing: 1, marginBottom: '0.3rem' }}>{title}</div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#888', flexWrap: 'wrap', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
            <span style={{ color: '#ffd700' }}>★{rating}</span>
            <span>{year}</span>
            <span>{isTV ? 'Serie / TV' : 'Película'}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1rem' }}>{item.overview || 'Sin descripción disponible.'}</p>

          {/* Season/Episode selector for TV */}
          {isTV && seasons.length > 0 && (
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#888', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: '0.3rem' }}>TEMPORADA</label>
                <select value={season} onChange={e => { setSeason(parseInt(e.target.value)); loadEpisodes(item.id, parseInt(e.target.value)); setPlaying(false) }}
                  style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '0.4rem 0.7rem', color: '#fff', fontSize: '0.92rem', cursor: 'pointer', minWidth: 130 }}>
                  {seasons.map(s => <option key={s.season_number} value={s.season_number}>Temporada {s.season_number} ({s.episode_count} ep.)</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#888', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: '0.3rem' }}>EPISODIO</label>
                <select value={episode} onChange={e => { setEpisode(parseInt(e.target.value)); setPlaying(false) }}
                  style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '0.4rem 0.7rem', color: '#fff', fontSize: '0.92rem', cursor: 'pointer', minWidth: 130 }}>
                  {episodes.map(e => <option key={e.episode_number} value={e.episode_number}>Ep. {e.episode_number} — {e.name || 'Episodio ' + e.episode_number}</option>)}
                </select>
              </div>
              <button onClick={() => setPlaying(true)} style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, padding: '0.4rem 1rem', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', fontSize: '0.85rem' }}>▶ VER</button>
            </div>
          )}

          {/* Source switcher */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#888', fontFamily: 'monospace', letterSpacing: 1, marginBottom: '0.4rem' }}>🔀 FUENTE</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {SOURCE_NAMES.map((name, i) => (
                <button key={i} onClick={() => { setSrcIdx(i); setPlaying(true) }} style={{
                  padding: '0.3rem 0.7rem', borderRadius: 3, fontSize: '0.72rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'monospace',
                  background: srcIdx === i ? 'rgba(229,9,20,0.3)' : 'transparent',
                  color: srcIdx === i ? '#fff' : '#888',
                  border: srcIdx === i ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
                }}>{name}</button>
              ))}
            </div>
          </div>

          {/* Subtitle selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 4 }}>
            <label style={{ fontSize: '0.7rem', color: '#00f5ff', fontFamily: 'monospace', letterSpacing: 1 }}>🔤 SUBTÍTULOS:</label>
            <select value={lang} onChange={e => { setLang(e.target.value); setPlaying(true) }}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '0.3rem 0.6rem', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
              <option value="fr">Francés</option>
              <option value="off">Sin subtítulos</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
            <button onClick={() => setPlaying(true)} style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase' }}>▶ REPRODUCIR</button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase' }}>✕ CERRAR</button>
          </div>
        </div>
      </div>
    </div>
  )
}
