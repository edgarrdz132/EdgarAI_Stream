import React from 'react'
import { IMG_W } from '@/services/tmdb'

export default function MediaCard({ item, onClick }) {
  const isTV = item.type === 'tv' || !!item.first_air_date
  const title = item.title || item.name || '—'
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const rating = (item.vote_average || 0).toFixed(1)
  const poster = item.poster_path ? IMG_W + item.poster_path : null

  return (
    <div onClick={() => onClick && onClick(item)} style={{
      position: 'relative', borderRadius: 8, overflow: 'hidden',
      background: '#111120', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)',
      transition: 'transform 0.25s, box-shadow 0.25s',
      animation: 'fadeInUp 0.4s ease both',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.8)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ width: '100%', aspectRatio: isTV ? '16/9' : '2/3', background: '#0a0a12', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {poster
          ? <img src={poster} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '3rem' }}>{isTV ? '📺' : '🎬'}</span>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,10,0.95), transparent 50%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff' }}>▶</div>
        </div>
        <span style={{ position: 'absolute', top: 6, left: 6, fontFamily: 'monospace', fontSize: '0.52rem', letterSpacing: 1, padding: '2px 5px', borderRadius: 3, background: '#e50914', color: '#fff' }}>HD</span>
      </div>
      <div style={{ padding: '0.6rem' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.18rem' }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#888', fontFamily: 'monospace' }}>
          <span>{year}</span>
          <span style={{ color: '#ffd700' }}>★{rating}</span>
        </div>
      </div>
    </div>
  )
}
