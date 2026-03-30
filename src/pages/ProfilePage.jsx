import React from 'react'
import { User, Mail, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: '0.06em', marginBottom: 32 }}>
        MI PERFIL
      </h1>

      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-visible)',
        borderRadius: 16, padding: 32, marginBottom: 20
      }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hot))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={32} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.email?.split('@')[0]}</h2>
            <span style={{
              display: 'inline-block', padding: '2px 10px',
              background: user?.role === 'admin' ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)',
              color: user?.role === 'admin' ? 'var(--accent-glow)' : 'var(--text-muted)',
              borderRadius: 100, fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em'
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', borderRadius: 10 }}>
            <Mail size={16} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Correo</p>
              <p style={{ fontSize: 15, color: 'var(--text-primary)' }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', borderRadius: 10 }}>
            <Shield size={16} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Rol</p>
              <p style={{ fontSize: 15, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 24px', background: 'rgba(255,56,96,0.1)',
          border: '1px solid rgba(255,56,96,0.25)', color: 'var(--accent-hot)',
          borderRadius: 10, fontWeight: 600, fontSize: 14,
          transition: 'background 0.2s'
        }}
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </div>
  )
}
