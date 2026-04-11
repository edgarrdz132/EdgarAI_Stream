import { useState, useEffect } from 'react'
import { tmdbAPI, IMG_ORI } from '@/services/tmdb'
import { getLiveChannels } from '@/services/famelack'

const SLIDE_TYPES = [
  { type: 'SERIE',      badge: 'SERIE',      color: '#e50914' },
  { type: 'PELÍCULA',   badge: 'ESTRENO',     color: '#f5a623' },
  { type: 'ANIME',      badge: 'ANIME',       color: '#7c3aed' },
  { type: 'CARICATURA', badge: 'CARICATURA',  color: '#0ea5e9' },
  { type: 'CANAL',      badge: 'EN VIVO',     color: '#16a34a' },
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildSlide(type, item, backdrop, title, description, extra = {}) {
  return { type, backdrop, title, description, item, ...extra }
}

export function useHeroSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      const results = []

      try {
        // 1. SERIE — popular TV
        const seriesData = await tmdbAPI.getPopularSeries()
        const seriesCandidates = (seriesData?.results || []).filter(s => s.backdrop_path)
        if (seriesCandidates.length > 0) {
          const item = pickRandom(seriesCandidates)
          results.push(buildSlide(
            'SERIE',
            { ...item, type: 'tv' },
            IMG_ORI + item.backdrop_path,
            item.name || item.title,
            item.overview,
            { badge: 'SERIE', badgeColor: '#e50914' }
          ))
        }

        // 2. PELÍCULA — popular movies
        const moviesData = await tmdbAPI.getPopularMovies()
        const moviesCandidates = (moviesData?.results || []).filter(m => m.backdrop_path)
        if (moviesCandidates.length > 0) {
          const item = pickRandom(moviesCandidates)
          results.push(buildSlide(
            'PELÍCULA',
            { ...item, type: 'movie' },
            IMG_ORI + item.backdrop_path,
            item.title || item.name,
            item.overview,
            { badge: 'ESTRENO', badgeColor: '#f5a623' }
          ))
        }

        // 3. ANIME — genre 16 + japanese
        const animeData = await tmdbAPI.getAnime()
        const animeCandidates = (animeData?.results || []).filter(a => a.backdrop_path)
        if (animeCandidates.length > 0) {
          const item = pickRandom(animeCandidates)
          results.push(buildSlide(
            'ANIME',
            { ...item, type: 'tv' },
            IMG_ORI + item.backdrop_path,
            item.name || item.title,
            item.overview,
            { badge: 'ANIME', badgeColor: '#7c3aed' }
          ))
        }

        // 4. CARICATURA — genre 16 animated
        const cartoonData = await tmdbAPI.getCaricaturas()
        // Excluir anime japonés del resultado de caricaturas
        const cartoonCandidates = (cartoonData?.results || []).filter(
          c => c.backdrop_path && c.original_language !== 'ja'
        )
        if (cartoonCandidates.length > 0) {
          const item = pickRandom(cartoonCandidates)
          results.push(buildSlide(
            'CARICATURA',
            { ...item, type: 'tv' },
            IMG_ORI + item.backdrop_path,
            item.name || item.title,
            item.overview,
            { badge: 'CARICATURA', badgeColor: '#0ea5e9' }
          ))
        }

        // 5. CANAL EN VIVO — famelack, solo si tiene logo
        try {
          const channels = await getLiveChannels('mx')
          const withLogo = (channels || []).filter(ch => ch.logo && ch.logo.trim() !== '')
          if (withLogo.length > 0) {
            const ch = pickRandom(withLogo)
            results.push(buildSlide(
              'CANAL',
              ch,
              ch.logo, // usamos el logo como "imagen" del canal
              ch.name,
              `Canal en vivo disponible ahora mismo en EdgarAI Stream.`,
              { badge: 'EN VIVO', badgeColor: '#16a34a', isLive: true, logo: ch.logo }
            ))
          }
        } catch {
          // Si falla canales, simplemente no se agrega ese slide
        }

      } catch (err) {
        console.error('useHeroSlides error:', err)
      }

      setSlides(results)
      setLoading(false)
    }

    fetchSlides()
  }, [])

  return { slides, loading }
}
