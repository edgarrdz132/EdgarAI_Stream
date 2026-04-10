import React, { useState, useRef, useEffect } from 'react'
import { Maximize2, ArrowLeft, Gamepad2, Search, Play, ChevronRight } from 'lucide-react'

const R2 = 'https://pub-45cf5931156d4ae4b601a245d802b1e1.r2.dev'

const CONSOLES = [
  { id: 'nes',  label: 'NES',              emoji: '🎮', color: '#ff2d55', core: 'nes'  },
  { id: 'snes', label: 'Super Nintendo',   emoji: '🕹️', color: '#bf5af2', core: 'snes' },
  { id: 'n64',  label: 'Nintendo 64',      emoji: '🎯', color: '#30d158', core: 'n64'  },
  { id: 'gb',   label: 'Game Boy',         emoji: '👾', color: '#32ade6', core: 'gb'   },
  { id: 'gba',  label: 'Game Boy Advance', emoji: '💛', color: '#ffd60a', core: 'gba'  },
]

const GAMES = {
  nes: [
    { name: 'Super Mario Bros',               rom: `${R2}/nes/Super Mario Bros. + Duck Hunt (U).nes`,                            cover: `${R2}/nes/Super Mario Bros. + Duck Hunt (U).cover.jpg` },
    { name: 'Super Mario Bros 2',             rom: `${R2}/nes/Super Mario Bros. 2.nes`,                                           cover: `${R2}/nes/Super Mario Bros. 2.cover.jpg` },
    { name: 'Super Mario Bros 3',             rom: `${R2}/nes/Super Mario Bros. 3 (E) [!].nes`,                                   cover: `${R2}/nes/Super Mario Bros. 3 (E) [!].cover.jpg` },
    { name: 'Contra',                         rom: `${R2}/nes/Contra (U).nes`,                                                    cover: `${R2}/nes/Contra (U).cover.jpg` },
    { name: 'Contra Force',                   rom: `${R2}/nes/Contra Force (U).nes`,                                              cover: `${R2}/nes/Contra Force (U).cover.jpg` },
    { name: 'Castlevania',                    rom: `${R2}/nes/Castlevania (U).nes`,                                               cover: `${R2}/nes/Castlevania (U).cover.jpg` },
    { name: "Castlevania II Simon's Quest",   rom: `${R2}/nes/Castlevania II - Simon s Quest (U).nes`,                           cover: `${R2}/nes/Castlevania II - Simon s Quest (U).cover.jpg` },
    { name: "Castlevania III Dracula's Curse",rom: `${R2}/nes/Castlevania III - Dracula s Curse (U).nes`,                        cover: `${R2}/nes/Castlevania III - Dracula s Curse (U).cover.jpg` },
    { name: 'Zelda',                          rom: `${R2}/nes/Legend of Zelda, The (GC).nes`,                                     cover: `${R2}/nes/Legend of Zelda, The (GC).cover.jpg` },
    { name: 'Zelda II Adventure of Link',     rom: `${R2}/nes/Zelda II - The Adventure of Link (U).nes`,                         cover: `${R2}/nes/Zelda II - The Adventure of Link (U).cover.jpg` },
    { name: 'Tetris',                         rom: `${R2}/nes/Tetris (U).nes`,                                                    cover: `${R2}/nes/Tetris (U).cover.jpg` },
    { name: 'Duck Tales',                     rom: `${R2}/nes/Duck Tales (U).nes`,                                                cover: `${R2}/nes/Duck Tales (U).cover.jpg` },
    { name: 'Duck Tales 2',                   rom: `${R2}/nes/Duck Tales 2 (U).nes`,                                              cover: `${R2}/nes/Duck Tales 2 (U).cover.jpg` },
    { name: 'Ninja Gaiden',                   rom: `${R2}/nes/Ninja Gaiden (U).nes`,                                              cover: `${R2}/nes/Ninja Gaiden (U).cover.jpg` },
    { name: 'Ninja Gaiden II',                rom: `${R2}/nes/Ninja Gaiden II - The Dark Sword of Chaos (U).nes`,                cover: `${R2}/nes/Ninja Gaiden II - The Dark Sword of Chaos (U).cover.jpg` },
    { name: 'Ninja Gaiden III',               rom: `${R2}/nes/Ninja Gaiden III - The Ancient Ship of Doom (U).nes`,              cover: `${R2}/nes/Ninja Gaiden III - The Ancient Ship of Doom (U).cover.jpg` },
    { name: 'Punch-Out',                      rom: `${R2}/nes/Punch-Out   (U).nes`,                                               cover: `${R2}/nes/Punch-Out   (U).cover.jpg` },
    { name: 'Battletoads',                    rom: `${R2}/nes/Battletoads (U).nes`,                                               cover: `${R2}/nes/Battletoads (U).cover.jpg` },
    { name: 'Battletoads & Double Dragon',    rom: `${R2}/nes/Battletoads & Double Dragon - The Ultimate Team (U).nes`,           cover: `${R2}/nes/Battletoads & Double Dragon - The Ultimate Team (U).cover.jpg` },
    { name: 'Double Dragon',                  rom: `${R2}/nes/Double Dragon (U).nes`,                                             cover: `${R2}/nes/Double Dragon (U).cover.jpg` },
    { name: 'Double Dragon III',              rom: `${R2}/nes/Double Dragon III - The Sacred Stones (U).nes`,                    cover: `${R2}/nes/Double Dragon III - The Sacred Stones (U).cover.jpg` },
    { name: 'TMNT',                           rom: `${R2}/nes/Teenage Mutant Ninja Turtles (U).nes`,                              cover: `${R2}/nes/Teenage Mutant Ninja Turtles (U).cover.jpg` },
    { name: 'TMNT II Arcade Game',            rom: `${R2}/nes/Teenage Mutant Ninja Turtles II - The Arcade Game (U).nes`,        cover: `${R2}/nes/Teenage Mutant Ninja Turtles II - The Arcade Game (U).cover.jpg` },
    { name: 'TMNT III Manhattan Project',     rom: `${R2}/nes/Teenage Mutant Ninja Turtles III - The Manhattan Project (U).nes`, cover: `${R2}/nes/Teenage Mutant Ninja Turtles III - The Manhattan Project (U).cover.jpg` },
    { name: 'TMNT Tournament Fighters',       rom: `${R2}/nes/Teenage Mutant Ninja Turtles - Tournament Fighters (U).nes`,       cover: `${R2}/nes/Teenage Mutant Ninja Turtles - Tournament Fighters (U).cover.jpg` },
    { name: "Chip 'n Dale Rescue Rangers",    rom: `${R2}/nes/Chip  n Dale Rescue Rangers (U).nes`,                              cover: `${R2}/nes/Chip  n Dale Rescue Rangers (U).cover.jpg` },
    { name: "Chip 'n Dale Rescue Rangers 2",  rom: `${R2}/nes/Chip  n Dale Rescue Rangers 2 (U).nes`,                            cover: `${R2}/nes/Chip  n Dale Rescue Rangers 2 (U).cover.jpg` },
    { name: 'Excitebike',                     rom: `${R2}/nes/Excitebike (E).nes`,                                                cover: `${R2}/nes/Excitebike (E).cover.jpg` },
    { name: 'Pac-Man',                        rom: `${R2}/nes/Pac-Man (U) (Namco).nes`,                                           cover: `${R2}/nes/Pac-Man (U) (Namco).cover.jpg` },
    { name: 'Bomberman',                      rom: `${R2}/nes/Bomberman (U).nes`,                                                 cover: `${R2}/nes/Bomberman (U).cover.jpg` },
    { name: 'Bomberman II',                   rom: `${R2}/nes/Bomberman II (U).nes`,                                              cover: `${R2}/nes/Bomberman II (U).cover.jpg` },
    { name: 'Donkey Kong Jr',                 rom: `${R2}/nes/Donkey Kong Jr. (U) (PRG1) [!].nes`,                               cover: `${R2}/nes/Donkey Kong Jr. (U) (PRG1) [!].cover.jpg` },
    { name: 'Mario Bros',                     rom: `${R2}/nes/Mario Bros. (E) [!].nes`,                                           cover: `${R2}/nes/Mario Bros. (E) [!].cover.jpg` },
    { name: 'Dr Mario',                       rom: `${R2}/nes/Dr. Mario (E) [!].nes`,                                             cover: `${R2}/nes/Dr. Mario (E) [!].cover.jpg` },
    { name: 'Gradius',                        rom: `${R2}/nes/Gradius (U).nes`,                                                   cover: `${R2}/nes/Gradius (U).cover.jpg` },
    { name: 'Life Force',                     rom: `${R2}/nes/Life Force (U).nes`,                                                cover: `${R2}/nes/Life Force (U).cover.jpg` },
  ],
  snes: [], n64: [], gb: [], gba: [],
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  .games-page * { box-sizing: border-box; }

  .games-page {
    min-height: 100vh;
    background: #050508;
    color: #fff;
    font-family: 'Share Tech Mono', monospace;
    padding: 1.5rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .games-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,45,85,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(48,209,88,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .games-page > * { position: relative; z-index: 1; }

  .console-tab {
    padding: 0.45rem 1.1rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: all 0.2s;
    border: 1px solid;
  }

  .game-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    text-align: left;
    width: 100%;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    color: #fff;
  }

  .game-row:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
    transform: translateX(3px);
  }

  .game-row.active {
    background: var(--c-alpha);
    border-color: var(--c);
  }

  .cover-panel {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #0d0d12;
  }

  .cover-panel img.cover-img {
    width: 100%;
    height: 100%;
    object-fit: contain; 
  }

  .cover-panel:hover img.cover-img {
    transform: scale(1.03);
  }

  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 50%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.5rem;
  }

  .play-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.6rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #fff;
    transition: all 0.2s;
    width: fit-content;
    margin-top: 0.75rem;
  }

  .play-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.2);
  }

  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 2;
  }

  .empty-screen {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 16px;
    background: #0d0d12;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .scrollbar-custom::-webkit-scrollbar { width: 3px; }
  .scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .num-badge {
    width: 26px;
    height: 26px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
  }
`

export default function GamesPage() {
  const [selectedConsole, setSelectedConsole] = useState(CONSOLES[0])
  const [selectedGame, setSelectedGame] = useState(null)
  const [hoveredGame, setHoveredGame] = useState(null)
  const [search, setSearch] = useState('')
  const [launched, setLaunched] = useState(false)
  const iframeRef = useRef(null)

  const c = selectedConsole.color
  const cAlpha = c + '22'

  const games = GAMES[selectedConsole.id] || []
  const filtered = games.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
  const previewGame = hoveredGame || selectedGame

  const emulatorSrc = selectedGame && launched
    ? `/EdgarAI_Stream/emulator.html?core=${selectedConsole.core}&rom=${encodeURIComponent(selectedGame.rom)}&name=${encodeURIComponent(selectedGame.name)}`
    : null

  function handleSelectGame(game) {
    setSelectedGame(game)
    setLaunched(false)
  }

  function handleFullscreen() {
    if (iframeRef.current) iframeRef.current.requestFullscreen()
  }

  const hasGames = GAMES[selectedConsole.id].length > 0

  return (
    <>
      <style>{styles}</style>
      <div className="games-page" style={{ '--c': c, '--c-alpha': cAlpha }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 3, height: 28, background: c, borderRadius: 2, boxShadow: `0 0 12px ${c}` }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 900, letterSpacing: 4, color: '#fff' }}>
              RETRO ARCADE
            </span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: '#333', letterSpacing: 2, marginTop: 2 }}>
              // EDGARAI STREAM
            </span>
          </div>
          <button onClick={() => window.history.back()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#444'}>
            <ArrowLeft size={13} /> VOLVER
          </button>
        </div>

        {/* Console tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {CONSOLES.map(con => {
            const isActive = selectedConsole.id === con.id
            return (
              <button key={con.id}
                className="console-tab"
                onClick={() => { setSelectedConsole(con); setSelectedGame(null); setLaunched(false); setSearch('') }}
                style={{
                  background: isActive ? con.color + '15' : 'transparent',
                  borderColor: isActive ? con.color : 'rgba(255,255,255,0.08)',
                  color: isActive ? con.color : '#555',
                  boxShadow: isActive ? `0 0 16px ${con.color}30` : 'none',
                }}>
                {con.emoji} {con.label}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${c}44, transparent)`, marginBottom: '1.5rem' }} />

        {!hasGames ? (
          /* Próximamente */
          <div className="empty-screen">
            <span style={{ fontSize: '3rem', filter: 'grayscale(0.5)' }}>{selectedConsole.emoji}</span>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, letterSpacing: 4, color: '#333' }}>PRÓXIMAMENTE</div>
            <div style={{ fontSize: '0.7rem', color: '#222', letterSpacing: 2 }}>CARGANDO ROMS...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* Game list */}
            <div>
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
                <Search size={12} color='#333' />
                <input placeholder='Buscar juego...' value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#aaa', fontSize: '0.78rem', width: '100%', fontFamily: 'Share Tech Mono, monospace' }} />
              </div>

              {/* Count */}
              <div style={{ fontSize: '0.62rem', color: '#333', letterSpacing: 2, marginBottom: '0.5rem', paddingLeft: 2 }}>
                {filtered.length} JUEGOS
              </div>

              {/* List */}
              <div className="scrollbar-custom" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {filtered.map((game, i) => {
                  const isActive = selectedGame?.name === game.name
                  return (
                    <button key={i}
                      className={`game-row ${isActive ? 'active' : ''}`}
                      style={{ '--c': c, '--c-alpha': cAlpha }}
                      onClick={() => handleSelectGame(game)}
                      onMouseEnter={() => setHoveredGame(game)}
                      onMouseLeave={() => setHoveredGame(null)}>
                      <div className="num-badge" style={{ background: isActive ? c + '30' : 'rgba(255,255,255,0.04)', color: isActive ? c : '#333' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: isActive ? '#fff' : '#888', fontWeight: isActive ? 600 : 400, letterSpacing: 0.5 }}>
                        {game.name}
                      </span>
                      {isActive && <ChevronRight size={12} color={c} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right panel */}
            <div>
              {launched && selectedGame ? (
                /* Emulator */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', fontWeight: 700, letterSpacing: 2, color: c }}>
                      {selectedGame.name}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setLaunched(false)}
                        style={{ padding: '0.35rem 0.8rem', borderRadius: 5, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#666', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'Share Tech Mono, monospace', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#666' }}>
                        ← SALIR
                      </button>
                      <button onClick={handleFullscreen}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.8rem', borderRadius: 5, background: 'transparent', border: `1px solid ${c}44`, color: c, fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'Share Tech Mono, monospace', transition: 'all 0.2s' }}>
                        <Maximize2 size={11} /> PANTALLA COMPLETA
                      </button>
                    </div>
                  </div>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${c}33`, boxShadow: `0 0 40px ${c}15`, aspectRatio: '16/9', position: 'relative' }}>
                    <iframe ref={iframeRef} src={emulatorSrc}
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      title={selectedGame.name} allow='fullscreen; gamepad' />
                    <div className="scanlines" />
                  </div>
                </div>
              ) : previewGame ? (
                /* Cover preview */
                <div>
                  <div className="cover-panel" style={{ width: '55%', margin: '0 auto', aspectRatio: '3/4', border: `1px solid ${c}22`, background: '#0d0d12' }}>
			 <img src={previewGame.cover} alt={previewGame.name}
				 style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
				onError={e => { e.target.style.display = 'none' }} />
				<div className="scanlines" />
			 <div className="cover-overlay">
                      <div style={{ fontSize: '0.62rem', color: c, letterSpacing: 3, fontFamily: 'Share Tech Mono, monospace', marginBottom: '0.25rem' }}>
                        {selectedConsole.label.toUpperCase()} · EMULATORJS
                      </div>
                      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 900, letterSpacing: 2, lineHeight: 1.1, color: '#fff', textShadow: `0 0 30px ${c}88` }}>
                        {previewGame.name}
                      </div>
                      {selectedGame?.name === previewGame.name && (
                        <button className="play-btn"
                          onClick={() => setLaunched(true)}
                          style={{ background: c, boxShadow: `0 4px 24px ${c}55` }}>
                          <Play size={13} fill="#fff" /> JUGAR AHORA
                        </button>
                      )}
                      {(!selectedGame || selectedGame.name !== previewGame.name) && (
                        <div style={{ fontSize: '0.65rem', color: '#444', letterSpacing: 1.5, marginTop: '0.5rem' }}>
                          CLICK PARA SELECCIONAR
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty */
                <div className="empty-screen" style={{ aspectRatio: '16/9' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, border: `1px solid rgba(255,255,255,0.06)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {selectedConsole.emoji}
                  </div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 3, color: '#222' }}>
                    SELECCIONA UN JUEGO
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#1a1a1a', letterSpacing: 2 }}>
                    PASA EL CURSOR PARA PREVISUALIZAR
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
