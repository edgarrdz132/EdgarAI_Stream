import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { canalesAPI } from '@/services/supabase'
import VideoPlayer from '@/components/player/VideoPlayer'

export default function PlayerPage() {
  const { channelId } = useParams()
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    canalesAPI.getById(channelId).then(({ data, error }) => {
      if (error || !data) setError(true)
      else setChannel(data)
      setLoading(false)
    })
  }, [channelId])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#888' }}>
      Cargando...
    </div>
  )

  if (error || !channel) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
      <AlertCircle size={64} style={{ color: '#e50914' }} />
      <h2>Canal no encontrado</h2>
      <button onClick={() => navigate('/')} style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, padding: '0.65rem 1.5rem', cursor: 'pointer', fontWeight: 700 }}>
        Volver al inicio
      </button>
    </div>
  )

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
          <Link to="/" style={{ color: '#888' }}>Inicio</Link>
          <span>/</span>
          <Link to={`/category/${channel.categoria}`} style={{ color: '#888' }}>{channel.categoria}</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>{channel.nombre}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div>
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000' }}>
            <VideoPlayer
              streamUrl={`http://localhost:5000/api/proxy/stream?cid=${channel.id}`}
              channelName={channel.nombre}
            />
          </div>

          <div style={{ padding: '1.5rem 0' }}>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 2, marginBottom: '0.5rem' }}>{channel.nombre}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {channel.estado === 'activo'
                ? <span style={{ background: 'rgba(255,56,96,0.2)', color: '#ff3860', border: '1px solid rgba(255,56,96,0.4)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>● EN VIVO</span>
                : <span style={{ background: 'rgba(255,255,255,0.08)', color: '#888', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>OFFLINE</span>
              }
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{channel.categoria}</span>
              {channel.idioma && <span style={{ color: '#888', fontSize: '0.85rem' }}>{channel.idioma.toUpperCase()}</span>}
              {channel.subtitulos_disponibles && <span style={{ color: '#00f5ff', fontSize: '0.85rem' }}>SUB</span>}
              {channel.calidad && <span style={{ color: '#ffd700', fontSize: '0.85rem' }}>{channel.calidad}</span>}
            </div>
            {channel.descripcion && <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{channel.descripcion}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
