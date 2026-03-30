import React from 'react'
import { useQuery } from 'react-query'
import { Tv, Wifi, WifiOff, Activity, RefreshCw, Play } from 'lucide-react'
import { logsAPI, channelsAPI } from '@/services/api'
import toast from 'react-hot-toast'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { data: stats, refetch: refetchStats } = useQuery(
    'adminStats',
    () => logsAPI.getStats().then(r => r.data),
    { refetchInterval: 30000 }
  )

  const { data: channels } = useQuery(
    'allChannels',
    () => channelsAPI.getAll({ limit: 100 }).then(r => r.data)
  )

  const active   = channels?.channels?.filter(c => c.estado === 'activo').length || 0
  const inactive = channels?.channels?.filter(c => c.estado === 'inactivo').length || 0
  const total    = (channels?.total) || 0

  const handleValidateAll = async () => {
    try {
      toast.loading('Validando todos los streams...', { id: 'validate' })
      await channelsAPI.validateAll()
      toast.success('Validación completada', { id: 'validate' })
      refetchStats()
    } catch {
      toast.error('Error en validación', { id: 'validate' })
    }
  }

  const STATS = [
    { label: 'Total Canales', value: total,    icon: Tv,      color: 'var(--accent-primary)' },
    { label: 'Activos',       value: active,   icon: Wifi,    color: '#22c55e' },
    { label: 'Inactivos',     value: inactive, icon: WifiOff, color: 'var(--accent-hot)' },
    { label: 'Uptime',        value: active && total ? `${Math.round(active/total*100)}%` : '–', icon: Activity, color: 'var(--accent-gold)' },
  ]

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.title} display-title`}>DASHBOARD</h1>
          <p className={styles.subtitle}>Resumen del sistema en tiempo real</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.validateBtn} onClick={handleValidateAll}>
            <RefreshCw size={16} />
            Revalidar Streams
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Recent channels table */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Canales Recientes</h2>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Nombre</span>
            <span>Categoría</span>
            <span>Idioma</span>
            <span>Estado</span>
            <span>Última verificación</span>
            <span></span>
          </div>
          {channels?.channels?.slice(0, 10).map(ch => (
            <ChannelRow key={ch.id} channel={ch} />
          ))}
          {!channels && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52, margin: '4px 0', borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, index }) {
  return (
    <div className={styles.statCard} style={{ '--card-color': color, animationDelay: `${index * 0.1}s` }}>
      <div className={styles.statIcon}>
        <Icon size={22} />
      </div>
      <div>
        <p className={styles.statValue}>{value ?? '–'}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  )
}

function ChannelRow({ channel }) {
  const { id, nombre, categoria, idioma, estado, ultima_verificacion } = channel

  const handleValidate = async () => {
    try {
      await channelsAPI.validate(id)
      toast.success(`Stream "${nombre}" validado`)
    } catch {
      toast.error('Error al validar stream')
    }
  }

  return (
    <div className={styles.tableRow}>
      <span className={styles.chName}>{nombre}</span>
      <span className={styles.chMeta}>{categoria}</span>
      <span className={styles.chMeta}>{idioma?.toUpperCase() || '–'}</span>
      <span>
        <span className={`${styles.statusBadge} ${estado === 'activo' ? styles.statusActive : styles.statusInactive}`}>
          {estado}
        </span>
      </span>
      <span className={styles.chMeta}>
        {ultima_verificacion ? new Date(ultima_verificacion).toLocaleString('es-MX') : '–'}
      </span>
      <span>
        <button className={styles.rowBtn} onClick={handleValidate} title="Validar">
          <RefreshCw size={14} />
        </button>
      </span>
    </div>
  )
}
