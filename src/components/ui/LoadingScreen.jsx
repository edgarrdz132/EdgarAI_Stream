import React from 'react'
import { Tv } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-void)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, zIndex: 9999
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          border: '2px solid rgba(108,99,255,0.15)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <Tv size={24} strokeWidth={1.5} style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--accent-primary)'
        }} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.16em', color: 'var(--text-dim)' }}>
        EDGARAI STREAM
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
