import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Info, Volume2, VolumeX } from 'lucide-react'
import styles from './HeroBanner.module.css'

const PLACEHOLDER = {
  id: 'demo',
  nombre: 'Bienvenido a EdgarAI Stream',
  descripcion: 'Tu plataforma de streaming premium con canales en vivo, películas y series. Contenido en español y subtítulos disponibles.',
  categoria: 'featured',
  thumbnail: null,
  estado: 'activo',
}

export default function HeroBanner({ channel = PLACEHOLDER }) {
  const [muted, setMuted] = useState(true)
  const navigate = useNavigate()

  const ch = channel || PLACEHOLDER

  const heroStyle = ch.thumbnail
    ? { backgroundImage: `url(${ch.thumbnail})` }
    : {}

  return (
    <div className={styles.hero} style={heroStyle}>
      {/* Gradient overlays */}
      <div className={styles.gradientBottom} />
      <div className={styles.gradientLeft} />
      <div className={styles.gradientTop} />

      {/* Noise texture */}
      <div className={styles.noise} />

      {/* Decorative elements */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className="badge badge-live">EN VIVO</span>
          <span className={styles.category}>{ch.categoria?.toUpperCase()}</span>
        </div>

        <h1 className={`${styles.title} display-title`}>
          {ch.nombre}
        </h1>

        <p className={styles.description}>
          {ch.descripcion || 'Disfruta del mejor contenido en español con la calidad de streaming que mereces.'}
        </p>

        <div className={styles.actions}>
          <button
            className={styles.playBtn}
            onClick={() => navigate(`/watch/${ch.id}`)}
          >
            <Play size={20} fill="currentColor" />
            <span>Reproducir</span>
          </button>

          <button
            className={styles.infoBtn}
            onClick={() => navigate(`/watch/${ch.id}`)}
          >
            <Info size={18} />
            <span>Más info</span>
          </button>

          <button
            className={styles.muteBtn}
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Channel stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>HD</span>
            <span className={styles.statLabel}>Calidad</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>ES</span>
            <span className={styles.statLabel}>Idioma</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>SUB</span>
            <span className={styles.statLabel}>Subtítulos</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>Desplaza para explorar</span>
      </div>
    </div>
  )
}
