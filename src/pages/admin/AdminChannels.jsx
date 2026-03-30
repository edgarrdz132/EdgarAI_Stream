import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Edit2, Trash2, RefreshCw, X, Save } from 'lucide-react'
import { channelsAPI } from '@/services/api'
import toast from 'react-hot-toast'

export default function AdminChannels() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | 'create' | channel object

  const { data, isLoading } = useQuery(
    'adminChannels',
    () => channelsAPI.getAll({ limit: 100 }).then(r => r.data)
  )

  const deleteMutation = useMutation(
    (id) => channelsAPI.delete(id),
    {
      onSuccess: () => { toast.success('Canal eliminado'); qc.invalidateQueries('adminChannels') },
      onError: () => toast.error('Error al eliminar'),
    }
  )

  const channels = data?.channels || []

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '0.06em' }}>CANALES</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{channels.length} canales registrados</p>
        </div>
        <button
          onClick={() => setModal('create')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'var(--accent-primary)',
            color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14,
            transition: 'background 0.2s'
          }}
        >
          <Plus size={16} /> Nuevo Canal
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
          padding: '12px 20px', background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)'
        }}>
          <span>Nombre</span><span>Categoría</span><span>Idioma</span><span>Estado</span><span>Acciones</span>
        </div>

        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52, margin: '4px 12px', borderRadius: 8 }} />
          ))
        ) : channels.map(ch => (
          <div
            key={ch.id}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              padding: '14px 20px', alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 0.15s'
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{ch.nombre}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{ch.categoria}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ch.idioma?.toUpperCase() || '–'}</span>
            <span>
              <span style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: ch.estado === 'activo' ? 'rgba(34,197,94,0.12)' : 'rgba(255,56,96,0.1)',
                color: ch.estado === 'activo' ? '#22c55e' : 'var(--accent-hot)'
              }}>
                {ch.estado}
              </span>
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setModal(ch)}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--text-muted)', transition: 'all 0.15s' }}
                title="Editar"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => channelsAPI.validate(ch.id).then(() => toast.success('Validado')).catch(() => toast.error('Error'))}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--text-muted)', transition: 'all 0.15s' }}
                title="Validar"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`¿Eliminar "${ch.nombre}"?`)) deleteMutation.mutate(ch.id)
                }}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--accent-hot)', transition: 'all 0.15s' }}
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <ChannelModal
          channel={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { qc.invalidateQueries('adminChannels'); setModal(null) }}
        />
      )}
    </div>
  )
}

function ChannelModal({ channel, onClose, onSaved }) {
  const isEdit = !!channel
  const [form, setForm] = useState({
    nombre: channel?.nombre || '',
    categoria: channel?.categoria || 'entretenimiento',
    idioma: channel?.idioma || 'es',
    url_stream: channel?.url_stream || '',
    subtitulos_disponibles: channel?.subtitulos_disponibles || false,
    estado: channel?.estado || 'activo',
  })
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.url_stream) { toast.error('Nombre y URL son requeridos'); return }
    setSaving(true)
    try {
      isEdit ? await channelsAPI.update(channel.id, form) : await channelsAPI.create(form)
      toast.success(isEdit ? 'Canal actualizado' : 'Canal creado')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg-surface)', border: '1px solid var(--border-visible)',
    borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none'
  }
  const labelStyle = { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', letterSpacing: '0.04em' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-visible)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 480,
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.06em' }}>
            {isEdit ? 'EDITAR CANAL' : 'NUEVO CANAL'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
        </div>

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.nombre} onChange={set('nombre')} placeholder="Canal de Noticias" required />
          </div>
          <div>
            <label style={labelStyle}>URL Stream (m3u8) *</label>
            <input style={inputStyle} value={form.url_stream} onChange={set('url_stream')} placeholder="https://..." required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={form.categoria} onChange={set('categoria')}>
                {['deportes','noticias','peliculas','series','infantil','entretenimiento'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Idioma</label>
              <select style={inputStyle} value={form.idioma} onChange={set('idioma')}>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
                <option value="fr">Francés</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select style={inputStyle} value={form.estado} onChange={set('estado')}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.subtitulos_disponibles} onChange={set('subtitulos_disponibles')} />
            Subtítulos en español disponibles
          </label>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', border: '1px solid var(--border-visible)',
              borderRadius: 10, color: 'var(--text-secondary)', fontSize: 14
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', background: 'var(--accent-primary)',
              color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14,
              opacity: saving ? 0.7 : 1
            }}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
