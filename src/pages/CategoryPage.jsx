import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { channelsAPI } from '@/services/api'
import ChannelCard from '@/components/cards/ChannelCard'

const CATEGORY_LABELS = {
  deportes:'Deportes en Vivo', noticias:'Noticias', peliculas:'Películas',
  series:'Series', infantil:'Infantil', entretenimiento:'Entretenimiento',
}

export default function CategoryPage() {
  const { slug } = useParams()
  const label = CATEGORY_LABELS[slug] || slug

  const { data, isLoading } = useQuery(
    ['category', slug],
    () => channelsAPI.getByCategory(slug, { limit: 50 }).then(r => r.data)
  )

  const channels = data?.channels || []

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>
          Categoría
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
          {label.toUpperCase()}
        </h1>
        {!isLoading && (
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            {channels.length} canales disponibles
          </p>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {channels.map((ch, i) => <ChannelCard key={ch.id} channel={ch} index={i} />)}
        </div>
      )}
    </div>
  )
}
