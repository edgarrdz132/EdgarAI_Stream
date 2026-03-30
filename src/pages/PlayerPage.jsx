import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { channelsAPI } from '@/services/api'
import VideoPlayer from '@/components/player/VideoPlayer'
import ChannelCard from '@/components/cards/ChannelCard'
import styles from './PlayerPage.module.css'

export default function PlayerPage() {
  const { channelId } = useParams()
  const navigate = useNavigate()

  const { data: channel, isLoading, error } = useQuery(
    ['channel', channelId],
    () => channelsAPI.getById(channelId).then(r => r.data),
    { retry: 2 }
  )

  const { data: streamData } = useQuery(
    ['stream', channelId],
    () => channelsAPI.getStreamUrl(channelId).then(r => r.data),
    { enabled: !!channel, retry: 1 }
  )

  const { data: related } = useQuery(
    ['related', channel?.categoria],
    () => channelsAPI.getByCategory(channel?.categoria, { limit: 8 }).then(r => r.data),
    { enabled: !!channel?.categoria }
  )

  if (isLoading) return <PlayerSkeleton />

  if (error) return (
    <div className={styles.errorPage}>
      <AlertCircle size={64} className={styles.errorIcon} />
      <h2>Canal no encontrado</h2>
      <p>No pudimos encontrar el canal solicitado.</p>
      <button onClick={() => navigate('/')} className={styles.backBtn}>
        Volver al inicio
      </button>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Back nav */}
      <div className={styles.topNav}>
        <button className={styles.backLink} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>
        <div className={styles.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to={`/category/${channel?.categoria}`}>{channel?.categoria}</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{channel?.nombre}</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Main player column */}
        <div className={styles.mainCol}>
          {/* Player */}
          <div className={styles.playerWrap}>
            <VideoPlayer
              streamUrl={streamData?.url || channel?.url_stream}
              fallbackUrls={streamData?.fallbacks || []}
              channelName={channel?.nombre}
            />
          </div>

          {/* Channel info */}
          <div className={styles.channelInfo}>
            <div className={styles.infoHeader}>
              <div>
                <h1 className={`${styles.channelName} display-title`}>{channel?.nombre}</h1>
                <div className={styles.metaRow}>
                  {channel?.estado === 'activo'
                    ? <span className="badge badge-live">EN VIVO</span>
                    : <span className="badge" style={{background:'rgba(255,255,255,0.08)', color:'var(--text-muted)'}}>OFFLINE</span>
                  }
                  <span className={styles.metaItem}>{channel?.categoria}</span>
                  {channel?.idioma && (
                    <span className={styles.metaItem}>{channel.idioma.toUpperCase()}</span>
                  )}
                  {channel?.subtitulos_disponibles && (
                    <span className={`${styles.metaItem} ${styles.subTag}`}>Subtítulos ES</span>
                  )}
                </div>
              </div>

              <div className={styles.qualityBadge}>
                <span>HD</span>
                <small>CALIDAD</small>
              </div>
            </div>

            {channel?.descripcion && (
              <p className={styles.description}>{channel.descripcion}</p>
            )}

            {/* Last verified */}
            {channel?.ultima_verificacion && (
              <p className={styles.verified}>
                Verificado: {new Date(channel.ultima_verificacion).toLocaleString('es-MX')}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - related */}
        {related?.channels?.length > 0 && (
          <aside className={styles.sidebar}>
            <h2 className={`${styles.sidebarTitle} display-title`}>Canales relacionados</h2>
            <div className={styles.relatedList}>
              {related.channels
                .filter(c => c.id !== channelId)
                .slice(0, 6)
                .map((ch, i) => (
                  <ChannelCard key={ch.id} channel={ch} index={i} />
                ))
              }
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function PlayerSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.topNav}>
        <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
      </div>
      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16 }} />
          <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="skeleton" style={{ width: 260, height: 32, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: 180, height: 20, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
