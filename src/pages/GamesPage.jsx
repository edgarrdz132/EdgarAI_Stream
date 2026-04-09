import React, { useState, useRef } from 'react'
import { Maximize2, ExternalLink, ArrowLeft, Gamepad2 } from 'lucide-react'

const CONSOLES = [
  { id: 'nes',       label: 'NES',            emoji: '🎮', color: '#e50914', url: 'https://gam.onl/nes/' },
  { id: 'snes',      label: 'Super Nintendo',  emoji: '🕹️', color: '#7c3aed', url: 'https://gam.onl/snes/' },
  { id: 'n64',       label: 'Nintendo 64',     emoji: '🎯', color: '#059669', url: 'https://gam.onl/n64/' },
  { id: 'gba',       label: 'Game Boy Advance', emoji: '👾', color: '#d97706', url: 'https://gam.onl/gba/' },
  { id: 'ps1',       label: 'PlayStation 1',   emoji: '💿', color: '#2563eb', url: 'https://gam.onl/ps1/' },
  { id: 'genesis',   label: 'Sega Genesis',    emoji: '⚡', color: '#0891b2', url: 'https://gam.onl/genesis/' },
  { id: 'arcade',    label: 'Arcade',          emoji: '🕹️', color: '#dc2626', url: 'https://gam.onl/arcade/' },
  { id: 'neogeo',    label: 'Neo Geo',         emoji: '🔴', color: '#b45309', url: 'https://gam.onl/neogeo/' },
  { id: 'atari',     label: 'Atari 2600',      emoji: '📺', color: '#6366f1', url: 'https://gam.onl/atari2600/' },
  { id: 'gamecube',  label: 'GameCube',        emoji: '🎲', color: '#7c3aed', url: 'https://gam.onl/gamecube/' },
]

export default function GamesPage() {
  const [selectedConsole, setSelectedConsole] = useState(null)
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const iframeRef = useRef(null)

  const handleConsoleSelect = (console) => {
    setSelectedConsole(console)
    setIframeBlocked(false)
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen()
      }
    }
  }

  const handleIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument
      if (!doc) setIframeBlocked(true)
    } catch {
      setIframeBlocked(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 2.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Gamepad2 size={28} color='#e50914' />
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3 }}>
          <span style={{ width: 4, height: 28, borderRadius: 2, background: '#e50914', display: 'inline-block', marginRight: '0.6rem', verticalAlign: 'middle' }} />
          JUEGOS RETRO
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedConsole ? '280px 1fr' : '1fr', gap: '1.5rem' }}>

        {/* Consoles panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#555', letterSpacing: 2, marginBottom: '0.5rem' }}>
            SELECCIONA CONSOLA
          </div>
          {CONSOLES.map(c => (
            <button
              key={c.id}
              onClick={() => handleConsoleSelect(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 8,
                background: selectedConsole?.id === c.id ? `${c.color}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedConsole?.id === c.id ? c.color : 'rgba(255,255,255,0.06)'}`,
                color: selectedConsole?.id === c.id ? '#fff' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{c.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.label}</div>
                <div style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'monospace' }}>
                  {selectedConsole?.id === c.id ? '● ACTIVO' : 'CLICK PARA JUGAR'}
                </div>
              </div>
              {selectedConsole?.id === c.id && (
                <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: c.color }} />
              )}
            </button>
          ))}
        </div>

        {/* Game area */}
        {selectedConsole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedConsole(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                  <ArrowLeft size={14} /> Volver
                </button>
                <span style={{ color: '#333' }}>·</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: 2, color: selectedConsole.color }}>
                  {selectedConsole.emoji} {selectedConsole.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleFullscreen}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.8rem', borderRadius: 6,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'monospace',
                  }}
                >
                  <Maximize2 size={13} /> Pantalla completa
                </button>
                
                  href={selectedConsole.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.8rem', borderRadius: 6,
                    background: '#e50914', border: 'none',
                    color: '#fff', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'monospace',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={13} /> Abrir en nueva pestaña
                </a>
              </div>
            </div>

            {/* iframe o mensaje de bloqueo */}
            <div style={{
              position: 'relative', borderRadius: 12, overflow: 'hidden',
              background: '#000', border: '1px solid rgba(255,255,255,0.06)',
              aspectRatio: '16/9',
            }}>
              {iframeBlocked ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: '1rem', padding: '2rem',
                }}>
                  <span style={{ fontSize: '3rem' }}>{selectedConsole.emoji}</span>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 2 }}>
                    {selectedConsole.label}
                  </div>
                  <p style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center' }}>
                    Este sitio no permite ser embebido.<br />Ábrelo en una nueva pestaña para jugar.
                  </p>
                  
                    href={selectedConsole.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: '#e50914', color: '#fff', borderRadius: 6,
                      padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.9rem',
                      letterSpacing: 1, textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={16} /> JUGAR AHORA
                  </a>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={selectedConsole.url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title={selectedConsole.label}
                  allow="fullscreen"
                  onLoad={handleIframeLoad}
                  onError={() => setIframeBlocked(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selectedConsole && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 400, color: 'rgba(255,255,255,0.15)', gap: '1rem',
          }}>
            <Gamepad2 size={64} />
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 3 }}>
              SELECCIONA UNA CONSOLA
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              Elige una consola del panel izquierdo para empezar
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
