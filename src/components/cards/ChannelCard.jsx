import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Wifi, WifiOff } from 'lucide-react'
import styles from './ChannelCard.module.css'

const CATEGORY_COLORS = {
  deportes:       '#22c55e',
  noticias:       '#3b82f6',
  peliculas:      '#f59e0b',
  series:         '#8b5cf6',
  infantil:       '#ec4899',
  entretenimiento:'#06b6d4',
}

export default function ChannelCard({ channel, index = 0 }) {
  const [hovered, setHovered]   = useState(false)
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()

  const accent = CATEGORY_COLORS[channel.categoria] || '#6c63ff'
  const isLive  = channel.estado === 'activo'

  const handleClick = () => {
    navigate(`/watch/${channel.id}`)
  }

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.04}s`, '--accent': accent }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Ver ${channel.nombre}`}
    >
      {/* Thumbnail */}
      <div className={styles.thumb}>
        {channel.thumbnail && !imgError ? (
          <img
            src={channel.thumbnail}
            alt={channel.nombre}
            className={styles.img}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={`${styles.placeholderLetter} display-title`}>
              {channel.nombre?.[0] || '?'}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
          <div className={styles.playCircle}>
            <Play size={20} fill="white" className={styles.playIcon} />
          </div>
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {isLive ? (
            <span className="badge badge-live">LIVE</span>
          ) : (
            <span className={`${styles.offlineBadge}`}>
              <WifiOff size={10} /> OFFLINE
            </span>
          )}
        </div>

        {/* Quality tag */}
        {channel.calidad && (
          <div className={styles.quality}>{channel.calidad}</div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.catDot} style={{ background: accent }} />
        <div className={styles.textWrap}>
          <h3 className={`${styles.name} truncate`}>{channel.nombre}</h3>
          <div className={styles.meta}>
            <span className={styles.category}>{channel.categoria}</span>
            {channel.idioma && (
              <>
                <span className={styles.dot}>·</span>
                <span className={styles.lang}>{channel.idioma?.toUpperCase()}</span>
              </>
            )}
            {channel.subtitulos_disponibles && (
              <>
                <span className={styles.dot}>·</span>
                <span className={styles.sub}>SUB</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
