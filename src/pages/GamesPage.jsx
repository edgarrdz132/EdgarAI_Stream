import React, { useState, useRef } from 'react'
import { Maximize2, ArrowLeft, Gamepad2, Search } from 'lucide-react'

const R2 = 'https://pub-45cf5931156d4ae4b601a245d802b1e1.r2.dev'

const CONSOLES = [
  { id: 'nes',  label: 'NES',             emoji: '🎮', color: '#e50914', core: 'nes',  frame: 'nes' },
  { id: 'snes', label: 'Super Nintendo',  emoji: '🕹️', color: '#7c3aed', core: 'snes', frame: 'snes' },
  { id: 'n64',  label: 'Nintendo 64',     emoji: '🎯', color: '#059669', core: 'n64',  frame: 'n64' },
  { id: 'gb',   label: 'Game Boy',        emoji: '👾', color: '#16a34a', core: 'gb',   frame: 'gb' },
  { id: 'gba',  label: 'Game Boy Advance',emoji: '💛', color: '#d97706', core: 'gba',  frame: 'gba' },
]

const FRAMES = {
  nes:  { bg: '#0a0000', border: '#e50914', glow: '#e5091455', label: '● NES ●' },
  snes: { bg: '#0a0010', border: '#7c3aed', glow: '#7c3aed55', label: '● SUPER NINTENDO ●' },
  n64:  { bg: '#000a05', border: '#059669', glow: '#05966955', label: '● NINTENDO 64 ●' },
  gb:   { bg: '#000a02', border: '#16a34a', glow: '#16a34a55', label: '● GAME BOY ●' },
  gba:  { bg: '#0a0800', border: '#d97706', glow: '#d9770655', label: '● GAME BOY ADVANCE ●' },
}

const GAMES = {
  nes: [
    { name: 'Super Mario Bros', rom: `${R2}/nes/Super Mario Bros. + Duck Hunt (U).nes` },
    { name: 'Super Mario Bros 2', rom: `${R2}/nes/Super Mario Bros. 2.nes` },
    { name: 'Super Mario Bros 3', rom: `${R2}/nes/Super Mario Bros. 3 (E) [!].nes` },
    { name: 'Contra', rom: `${R2}/nes/Contra (U).nes` },
    { name: 'Contra Force', rom: `${R2}/nes/Contra Force (U).nes` },
    { name: 'Castlevania', rom: `${R2}/nes/Castlevania (U).nes` },
    { name: "Castlevania II Simon's Quest", rom: `${R2}/nes/Castlevania II - Simon s Quest (U).nes` },
    { name: "Castlevania III Dracula's Curse", rom: `${R2}/nes/Castlevania III - Dracula s Curse (U).nes` },
    { name: 'Zelda', rom: `${R2}/nes/Legend of Zelda, The (GC).nes` },
    { name: 'Zelda II Adventure of Link', rom: `${R2}/nes/Zelda II - The Adventure of Link (U).nes` },
    { name: 'Tetris', rom: `${R2}/nes/Tetris (U).nes` },
    { name: 'Duck Tales', rom: `${R2}/nes/Duck Tales (U).nes` },
    { name: 'Duck Tales 2', rom: `${R2}/nes/Duck Tales 2 (U).nes` },
    { name: 'Ninja Gaiden', rom: `${R2}/nes/Ninja Gaiden (U).nes` },
    { name: 'Ninja Gaiden II', rom: `${R2}/nes/Ninja Gaiden II - The Dark Sword of Chaos (U).nes` },
    { name: 'Ninja Gaiden III', rom: `${R2}/nes/Ninja Gaiden III - The Ancient Ship of Doom (U).nes` },
    { name: 'Punch-Out', rom: `${R2}/nes/Punch-Out   (U).nes` },
    { name: 'Battletoads', rom: `${R2}/nes/Battletoads (U).nes` },
    { name: 'Battletoads & Double Dragon', rom: `${R2}/nes/Battletoads & Double Dragon - The Ultimate Team (U).nes` },
    { name: 'Double Dragon', rom: `${R2}/nes/Double Dragon (U).nes` },
    { name: 'Double Dragon III', rom: `${R2}/nes/Double Dragon III - The Sacred Stones (U).nes` },
    { name: 'TMNT', rom: `${R2}/nes/Teenage Mutant Ninja Turtles (U).nes` },
    { name: 'TMNT II Arcade Game', rom: `${R2}/nes/Teenage Mutant Ninja Turtles II - The Arcade Game (U).nes` },
    { name: 'TMNT III Manhattan Project', rom: `${R2}/nes/Teenage Mutant Ninja Turtles III - The Manhattan Project (U).nes` },
    { name: 'TMNT Tournament Fighters', rom: `${R2}/nes/Teenage Mutant Ninja Turtles - Tournament Fighters (U).nes` },
    { name: "Chip 'n Dale Rescue Rangers", rom: `${R2}/nes/Chip  n Dale Rescue Rangers (U).nes` },
    { name: "Chip 'n Dale Rescue Rangers 2", rom: `${R2}/nes/Chip  n Dale Rescue Rangers 2 (U).nes` },
    { name: 'Excitebike', rom: `${R2}/nes/Excitebike (E).nes` },
    { name: 'Pac-Man', rom: `${R2}/nes/Pac-Man (U) (Namco).nes` },
    { name: 'Bomberman', rom: `${R2}/nes/Bomberman (U).nes` },
    { name: 'Bomberman II', rom: `${R2}/nes/Bomberman II (U).nes` },
    { name: 'Donkey Kong Jr', rom: `${R2}/nes/Donkey Kong Jr. (U) (PRG1) [!].nes` },
    { name: 'Mario Bros', rom: `${R2}/nes/Mario Bros. (E) [!].nes` },
    { name: 'Dr Mario', rom: `${R2}/nes/Dr. Mario (E) [!].nes` },
  ],
  snes: [],
  n64: [],
  gb: [],
  gba: [],
}

export default function GamesPage() {
  const [selectedConsole, setSelectedConsole] = useState(CONSOLES[0])
  const [selectedGame, setSelectedGame] = useState(null)
  const [search, setSearch] = useState('')
  const iframeRef = useRef(null)

  const frame = FRAMES[selectedConsole.frame]
  const games = GAMES[selectedConsole.id] || []
  const filtered = games.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  const emulatorSrc = selectedGame && selectedConsole
    ? `/EdgarAI_Stream/emulator.html?core=${selectedConsole.core}&rom=${encodeURIComponent(selectedGame.rom)}&name=${encodeURIComponent(selectedGame.name)}`
    : null

  function handleFullscreen() {
    if (iframeRef.current) iframeRef.current.requestFullscreen()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '1.5rem', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Gamepad2 size={22} color='#e50914' />
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: 4 }}>JUEGOS RETRO</span>
        </div>
        <button onClick={() => window.history.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} /> volver
        </button>
      </div>

      {/* Consoles */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CONSOLES.map(c => (
          <button key={c.id} onClick={() => { setSelectedConsole(c); setSelectedGame(null); setSearch('') }}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.8rem',
              background: selectedConsole.id === c.id ? c.color + '22' : 'rgba(255,255,255,0.04)',
              border: '1px solid ' + (selectedConsole.id === c.id ? c.color : 'rgba(255,255,255,0.08)'),
              color: selectedConsole.id === c.id ? c.color : '#888',
            }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {GAMES[selectedConsole.id].length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: '1rem' }}>
          <span style={{ fontSize: '4rem' }}>{selectedConsole.emoji}</span>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 3, color: selectedConsole.color }}>
            {selectedConsole.label}
          </div>
          <div style={{ color: '#555', fontSize: '0.8rem' }}>Próximamente — subiendo ROMs</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
          {/* Game list */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
              <Search size={13} color='#555' />
              <input placeholder='Buscar juego...' value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', fontFamily: 'monospace' }} />
            </div>
            <div style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: 4 }}>
              {filtered.map((game, i) => {
                const isSelected = selectedGame && selectedGame.name === game.name
                return (
                  <button key={i} onClick={() => setSelectedGame(game)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.8rem', borderRadius: 6, textAlign: 'left', width: '100%',
                      background: isSelected ? selectedConsole.color + '22' : 'rgba(255,255,255,0.02)',
                      border: '1px solid ' + (isSelected ? selectedConsole.color : 'rgba(255,255,255,0.05)'),
                      color: '#fff', cursor: 'pointer',
                    }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: selectedConsole.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: selectedConsole.color, fontWeight: 700,
                    }}>{i + 1}</div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{game.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Emulator */}
          <div>
            {selectedGame ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: 2, color: selectedConsole.color }}>
                    {selectedGame.name}
                  </div>
                  <button onClick={handleFullscreen}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace' }}>
                    <Maximize2 size={13} /> Pantalla completa
                  </button>
                </div>
                <div style={{ borderRadius: 16, overflow: 'hidden', background: frame.bg, border: '3px solid ' + frame.border, boxShadow: '0 0 40px ' + frame.glow + ', inset 0 0 20px rgba(0,0,0,0.5)', padding: '12px 12px 20px' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.65rem', letterSpacing: 4, color: frame.border, textAlign: 'center', marginBottom: 8, opacity: 0.8 }}>
                    {frame.label}
                  </div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <iframe ref={iframeRef} src={emulatorSrc}
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      title={selectedGame.name} allow='fullscreen; gamepad' />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 10 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: frame.border, opacity: 0.6 }} />)}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: frame.bg, border: '2px solid ' + frame.border, borderRadius: 16, gap: '1rem', boxShadow: '0 0 30px ' + frame.glow }}>
                <span style={{ fontSize: '4rem' }}>{selectedConsole.emoji}</span>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 3, color: selectedConsole.color }}>
                  {selectedConsole.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#555' }}>
                  Selecciona un juego de la lista
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
