// SearchPage.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Search } from 'lucide-react'
import { channelsAPI } from '@/services/api'
import ChannelCard from '@/components/cards/ChannelCard'

export default function SearchPage() {
  const [params]  = useSearchParams()
  const q = params.get('q') || ''
  const [inputVal, setInputVal] = useState(q)

  const { data, isLoading, isFetching } = useQuery(
    ['search', q],
    () => channelsAPI.search(q).then(r => r.data),
    { enabled: q.length > 1 }
  )

  const channels = data?.channels || []

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '0.06em', marginBottom: 8 }}>
        BUSCAR
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36 }}>
        {q ? `Resultados para "${q}"` : 'Escribe algo para buscar'}
      </p>

      {isLoading || isFetching ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12 }} />
          ))}
        </div>
      ) : channels.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {channels.map((ch, i) => <ChannelCard key={ch.id} channel={ch} index={i} />)}
        </div>
      ) : q ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No encontramos resultados para "{q}"</p>
        </div>
      ) : null}
    </div>
  )
}
