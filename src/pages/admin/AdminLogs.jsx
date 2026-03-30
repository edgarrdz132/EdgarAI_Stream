import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { logsAPI } from '@/services/api'
import { AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react'

const TYPE_META = {
  error:      { icon: AlertCircle, color: 'var(--accent-hot)',  bg: 'rgba(255,56,96,0.08)' },
  success:    { icon: CheckCircle, color: '#22c55e',             bg: 'rgba(34,197,94,0.08)' },
  info:       { icon: Info,        color: 'var(--accent-glow)', bg: 'rgba(108,99,255,0.08)' },
  validation: { icon: RefreshCw,   color: '#f59e0b',             bg: 'rgba(245,158,11,0.08)' },
}

export default function AdminLogs() {
  const [filter, setFilter] = useState('all')

  const { data, isLoading, refetch } = useQuery(
    ['logs', filter],
    () => logsAPI.getAll({ type: filter === 'all' ? undefined : filter, limit: 100 }).then(r => r.data),
    { refetchInterval: 30000 }
  )

  const logs = data?.logs || []

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '0.06em' }}>LOGS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Actividad y errores del sistema</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'error', 'success', 'info', 'validation'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: filter === f ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                color: filter === f ? 'white' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                transition: 'all 0.15s', textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-muted)' }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />
          ))
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <Info size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No hay logs disponibles</p>
          </div>
        ) : logs.map(log => {
          const meta = TYPE_META[log.tipo] || TYPE_META.info
          const Icon = meta.icon
          return (
            <div
              key={log.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 18px', background: meta.bg,
                border: `1px solid ${meta.color}22`,
                borderRadius: 12, transition: 'opacity 0.2s'
              }}
            >
              <Icon size={16} style={{ color: meta.color, flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>{log.mensaje}</p>
                {log.detalle && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{log.detalle}</p>
                )}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {log.created_at ? new Date(log.created_at).toLocaleString('es-MX') : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
