import React, { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, Settings, Subtitles, RefreshCw, Wifi, WifiOff, Loader
} from 'lucide-react'
import styles from './VideoPlayer.module.css'

export default function VideoPlayer({ streamUrl, fallbackUrls = [], channelName = '', onError }) {
  const videoRef    = useRef(null)
  const hlsRef      = useRef(null)
  const containerRef= useRef(null)
  const hideTimerRef= useRef(null)

  const [state, setState] = useState({
    playing:     false,
    muted:       false,
    volume:      1,
    fullscreen:  false,
    showControls:true,
    buffering:   true,
    error:       null,
    quality:     'auto',
    qualities:   [],
    currentTime: 0,
    duration:    0,
    subtitles:   false,
    networkStatus:'connecting', // connecting | live | offline
  })

  const update = (patch) => setState(s => ({ ...s, ...patch }))

  /* ---- HLS Setup ---- */
  const initPlayer = useCallback((url) => {
    const video = videoRef.current
    if (!video || !url) return

    // Destroy previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    update({ error: null, buffering: true, networkStatus: 'connecting' })

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        levelLoadingRetryDelay: 1000,
        manifestLoadingRetryDelay: 1000,
        fragLoadingRetryDelay: 1000,
      })

      hls.loadSource(url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels.map((l, i) => ({
          id: i,
          label: l.height ? `${l.height}p` : `Nivel ${i + 1}`,
          bitrate: l.bitrate,
        }))
        update({ qualities: levels, networkStatus: 'live' })
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        update({ buffering: false, networkStatus: 'live' })
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              update({ networkStatus: 'offline' })
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              update({ error: 'Stream no disponible. Intentando reconectar...' })
              setTimeout(() => initPlayer(url), 5000)
          }
        }
      })

      hlsRef.current = hls

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      video.src = url
      video.play().catch(() => {})
    } else {
      update({ error: 'Tu navegador no soporta HLS.' })
    }
  }, [])

  useEffect(() => {
    if (streamUrl) initPlayer(streamUrl)
    return () => {
      hlsRef.current?.destroy()
    }
  }, [streamUrl, initPlayer])

  /* ---- Video events ---- */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlers = {
      play:     () => update({ playing: true }),
      pause:    () => update({ playing: false }),
      waiting:  () => update({ buffering: true }),
      playing:  () => update({ buffering: false }),
      timeupdate: () => update({ currentTime: video.currentTime, duration: video.duration || 0 }),
      volumechange: () => update({ volume: video.volume, muted: video.muted }),
    }

    Object.entries(handlers).forEach(([e, fn]) => video.addEventListener(e, fn))
    return () => Object.entries(handlers).forEach(([e, fn]) => video.removeEventListener(e, fn))
  }, [])

  /* ---- Controls auto-hide ---- */
  const showControls = () => {
    update({ showControls: true })
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => update({ showControls: false }), 3500)
  }

  /* ---- Fullscreen ---- */
  useEffect(() => {
    const onChange = () => update({ fullscreen: !!document.fullscreenElement })
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  /* ---- Control handlers ---- */
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play() : v.pause()
  }

  const setVolume = (vol) => {
    const v = videoRef.current
    if (!v) return
    v.volume = vol
    v.muted = vol === 0
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
  }

  const setQuality = (level) => {
    if (!hlsRef.current) return
    hlsRef.current.currentLevel = level
    update({ quality: level === -1 ? 'auto' : level })
  }

  const retry = () => initPlayer(streamUrl)

  const formatTime = (t) => {
    if (!isFinite(t)) return 'LIVE'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const { playing, muted, volume, fullscreen, showControls: ctrlVisible, buffering, error, qualities, networkStatus, subtitles } = state

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${fullscreen ? styles.fullscreenMode : ''}`}
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        onClick={togglePlay}
      />

      {/* Buffering spinner */}
      {buffering && !error && (
        <div className={styles.spinner}>
          <div className={styles.spinnerRing} />
          <span className={styles.spinnerLabel}>
            {networkStatus === 'connecting' ? 'Conectando...' : 'Cargando...'}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorState}>
          <WifiOff size={48} className={styles.errorIcon} />
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={retry}>
            <RefreshCw size={16} /> Reintentar
          </button>
          {fallbackUrls.length > 0 && (
            <button className={styles.fallbackBtn} onClick={() => initPlayer(fallbackUrls[0])}>
              Usar stream alternativo
            </button>
          )}
        </div>
      )}

      {/* Controls overlay */}
      <div className={`${styles.controls} ${ctrlVisible ? styles.controlsVisible : ''}`}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.channelInfo}>
            <div className={`${styles.statusDot} ${styles[`status-${networkStatus}`]}`} />
            <span className={styles.channelName}>{channelName}</span>
            <span className={styles.liveTag}>EN VIVO</span>
          </div>
        </div>

        {/* Center play */}
        <div className={styles.centerPlay} onClick={togglePlay}>
          {playing
            ? <Pause size={32} fill="white" />
            : <Play size={32} fill="white" />
          }
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          {/* Left controls */}
          <div className={styles.controlsLeft}>
            <button className={styles.ctrlBtn} onClick={togglePlay} aria-label="Play/Pause">
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume */}
            <div className={styles.volumeGroup}>
              <button className={styles.ctrlBtn} onClick={toggleMute} aria-label="Mute">
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0} max={1} step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
                aria-label="Volumen"
              />
            </div>

            {/* Network status */}
            <div className={`${styles.netStatus} ${styles[`net-${networkStatus}`]}`}>
              {networkStatus === 'live'
                ? <Wifi size={14} />
                : networkStatus === 'offline'
                ? <WifiOff size={14} />
                : <Loader size={14} className={styles.spin} />
              }
              <span>{networkStatus === 'live' ? 'En vivo' : networkStatus === 'offline' ? 'Sin señal' : 'Conectando'}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className={styles.controlsRight}>
            {/* Quality */}
            {qualities.length > 0 && (
              <div className={styles.qualityMenu}>
                <button className={styles.ctrlBtn} title="Calidad">
                  <Settings size={18} />
                </button>
                <div className={styles.qualityDropdown}>
                  <button
                    className={`${styles.qualityOption} ${state.quality === 'auto' ? styles.qualityActive : ''}`}
                    onClick={() => setQuality(-1)}
                  >
                    Auto
                  </button>
                  {qualities.map((q) => (
                    <button
                      key={q.id}
                      className={`${styles.qualityOption} ${state.quality === q.id ? styles.qualityActive : ''}`}
                      onClick={() => setQuality(q.id)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subtitles */}
            <button
              className={`${styles.ctrlBtn} ${subtitles ? styles.ctrlBtnActive : ''}`}
              onClick={() => update({ subtitles: !subtitles })}
              aria-label="Subtítulos"
              title="Subtítulos"
            >
              <Subtitles size={18} />
            </button>

            {/* Fullscreen */}
            <button className={styles.ctrlBtn} onClick={toggleFullscreen} aria-label="Pantalla completa">
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
