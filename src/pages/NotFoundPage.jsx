// NotFoundPage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Tv } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40
    }}>
      <Tv size={80} style={{ color: 'var(--accent-primary)', opacity: 0.3 }} strokeWidth={1} />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 120, letterSpacing: '0.04em', color: 'var(--text-dim)', lineHeight: 1 }}>
          404
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Página no encontrada
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          La señal se perdió. Vuelve al inicio.
        </p>
      </div>
      <Link to="/" style={{
        padding: '12px 32px', background: 'var(--accent-primary)', color: 'white',
        borderRadius: 10, fontWeight: 700, fontSize: 15,
        transition: 'background 0.2s'
      }}>
        Ir al inicio
      </Link>
    </div>
  )
}
