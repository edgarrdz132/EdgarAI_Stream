const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8'
const TMDB_BASE = 'https://api.themoviedb.org/3'
export const IMG_W = 'https://image.tmdb.org/t/p/w500'
export const IMG_ORI = 'https://image.tmdb.org/t/p/original'
export const IMG_W92 = 'https://image.tmdb.org/t/p/w92'

async function tmdb(path, params) {
  params = params || ''
  const r = await fetch(TMDB_BASE + path + '?api_key=' + TMDB_KEY + '&language=es-MX' + params)
  if (!r.ok) return null
  return r.json()
}

export const tmdbAPI = {
  getPopularMovies: (page=1) => tmdb('/movie/popular', `&page=${page}`),
  getPopularSeries: (page=1) => tmdb('/tv/popular', `&page=${page}`),
  getMoviesByGenre: (genre, page=1) => tmdb('/discover/movie', `&with_genres=${genre}&page=${page}&sort_by=popularity.desc`),
  getSeriesByGenre: (genre, page=1) => tmdb('/discover/tv', `&with_genres=${genre}&page=${page}&sort_by=popularity.desc`),
  getAnime: (sub='', page=1) => tmdb('/discover/tv', `&with_genres=16${sub}&with_original_language=ja&page=${page}`),
  getCaricaturas: (lang='', page=1) => tmdb('/discover/tv', `&with_genres=16${lang}&page=${page}&sort_by=popularity.desc`),
  getTelenovelas: (country='MX', page=1) => tmdb('/discover/tv', `&with_genres=10766&with_origin_country=${country}&page=${page}`),
  searchMovies: (q) => tmdb('/search/movie', `&query=${encodeURIComponent(q)}`),
  searchSeries: (q) => tmdb('/search/tv', `&query=${encodeURIComponent(q)}`),
  getTVDetail: (id) => tmdb(`/tv/${id}`),
  getTVSeason: (id, s) => tmdb(`/tv/${id}/season/${s}`),
  getMovieDetail: (id) => tmdb(`/movie/${id}`),
  getTrending: () => tmdb('/trending/all/week'),
}

export const EMBED_MOVIE = [
  (id, lang='es') => `https://vidsrc.to/embed/movie/${id}?ds_lang=${lang}`,
  (id, lang='es') => `https://vidsrc.xyz/embed/movie?tmdb=${id}&ds_lang=${lang}`,
  (id, lang='es') => `https://vidsrc.cc/v2/embed/movie/${id}?ds_lang=${lang}`,
  (id, lang='es') => `https://multiembed.mov/?video_id=${id}&tmdb=1&ds_lang=${lang}`,
  (id, lang='es') => `https://player.videasy.net/movie/${id}?lang=${lang}`,
]

export const EMBED_TV = [
  (id, s, e, lang='es') => `https://vidsrc.to/embed/tv/${id}/${s}/${e}?ds_lang=${lang}`,
  (id, s, e, lang='es') => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}&ds_lang=${lang}`,
  (id, s, e, lang='es') => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?ds_lang=${lang}`,
  (id, s, e, lang='es') => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}&ds_lang=${lang}`,
  (id, s, e, lang='es') => `https://player.videasy.net/tv/${id}/${s}/${e}?lang=${lang}`,
]

export const SOURCE_NAMES = ['VidSrc.to', 'VidSrc XYZ', 'VidSrc CC', 'MultiEmbed', 'Videasy']
