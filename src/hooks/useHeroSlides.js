import { useState, useEffect } from 'react'
import { tmdbAPI, IMG_ORI } from '@/services/tmdb'
import { getLiveChannels } from '@/services/famelack'

const RETRO_GAMES = [
  {
    title: 'Street Fighter II',
    system: 'SNES',
    description: 'El clásico de los juegos de pelea. Elige tu personaje y demuestra quién es el mejor luchador del mundo.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/5/58/Street_Fighter_II_box_art.jpg',
  },
  {
    title: 'Super Mario Bros',
    system: 'NES',
    description: 'El fontanero más famoso del mundo en su aventura clásica para rescatar a la princesa.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png',
  },
  {
    title: 'Metal Slug',
    system: 'Neo Geo',
    description: 'El run and gun más icónico de Neo Geo. Acción frenética y gráficos espectaculares.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/0/05/Metal_Slug_cover.png',
  },
  {
    title: 'The Legend of Zelda',
    system: 'NES',
    description: 'Explora Hyrule, resuelve acertijos y salva a la princesa Zelda en esta aventura legendaria.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/4/41/Legend_of_zelda_cover_%28with_cartridge%29_gold.png',
  },
  {
    title: 'Sonic the Hedgehog',
    system: 'SNES',
    description: 'El erizo más veloz del mundo en su aventura para derrotar al Doctor Eggman.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Sonic_the_Hedgehog_1_Genesis_box_art.jpg',
  },
  {
    title: 'King of Fighters 98',
    system: 'Neo Geo',
    description: 'El torneo de peleas más épico de Neo Geo. Forma tu equipo y demuestra tu dominio.',
    backdrop: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kof98_cover.jpg',
  },
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildSlide(type, item, backdrop, title, description, extra = {}) {
  return { type, backdrop, title, description, item, ...extra }
}

// Filtra títulos en caracteres latinos y con descripción válida
function isLatinTitle(str) {
  return /^[\x00-\x7F\u00C0-\u024F\s]+$/.test(str || '')
}

function isValidItem(item, nameField = 'name') {
  const name = item[nameField] || item.title || item.name || ''
  return (
    item.backdrop_path &&
    item.overview &&
    item.overview.length > 20 &&
    isLatinTitle(name)
  )
}

export function useHeroSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      const results = []

      try {
        // 1. SERIE
        const seriesData = await tmdbAPI.getPopularSeries()
        const seriesCandidates = (seriesData?.results || []).filter(s => isValidItem(s, 'name'))
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

        // 2. PELICULA
        const moviesData = await tmdbAPI.getPopularMovies()
        const moviesCandidates = (moviesData?.results || []).filter(m => isValidItem(m, 'title'))
        if (moviesCandidates.length > 0) {
          const item = pickRandom(moviesCandidates)
          results.push(buildSlide(
            'PELICULA',
            { ...item, type: 'movie' },
            IMG_ORI + item.backdrop_path,
            item.title || item.name,
            item.overview,
            { badge: 'ESTRENO', badgeColor: '#f5a623' }
          ))
        }

        // 3. ANIME
        const animeData = await tmdbAPI.getAnime()
        const animeCandidates = (animeData?.results || []).filter(a =>
          a.backdrop_path &&
          a.overview &&
          a.overview.length > 20
        )
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

        // 4. CARICATURA
        const cartoonData = await tmdbAPI.getCaricaturas()
        const cartoonCandidates = (cartoonData?.results || []).filter(c =>
          c.backdrop_path &&
          c.overview &&
          c.overview.length > 20 &&
          c.original_language !== 'ja' &&
          isLatinTitle(c.name || c.title || '')
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

        // 5. JUEGO RETRO
        const game = pickRandom(RETRO_GAMES)
        results.push(buildSlide(
          'JUEGO',
          game,
          game.backdrop,
          `${game.title} — ${game.system}`,
          game.description,
          { badge: game.system, badgeColor: '#f59e0b', isGame: true }
        ))

        // 6. CANAL EN VIVO
        try {
          const channels = await getLiveChannels('mx')
          const withLogo = (channels || []).filter(ch => ch.logo && ch.logo.trim() !== '')
          if (withLogo.length > 0) {
            const ch = pickRandom(withLogo)
            results.push(buildSlide(
              'CANAL',
              ch,
              ch.logo,
              ch.name,
              'Canal en vivo disponible ahora mismo en EdgarAI Stream.',
              { badge: 'EN VIVO', badgeColor: '#16a34a', isLive: true, logo: ch.logo }
            ))
          }
        } catch {
          // Si falla canales, se omite ese slide
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
