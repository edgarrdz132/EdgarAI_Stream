/**
 * famelack.js
 * -----------
 * Servicio para obtener canales de TV en vivo desde el
 * repositorio público de Famelack (licencia MIT).
 *
 * Uso en cualquier componente o página:
 *   import { getChannelsByCountry, getAllCountries } from '../services/famelack';
 */

const BASE_URL =
  "https://raw.githubusercontent.com/famelack/famelack-data/main/tv/raw";

// ─── Caché en memoria para no repetir fetches ───────────────────────────────
const cache = {};

async function fetchJSON(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Famelack fetch error: ${res.status} ${url}`);
  const data = await res.json();
  cache[url] = data;
  return data;
}

// ─── API pública ─────────────────────────────────────────────────────────────

/**
 * Devuelve todos los países disponibles.
 * @returns {Promise<Array<{ code, name, capital, timeZone, hasChannels }>>}
 */
export async function getAllCountries() {
  const metadata = await fetchJSON(`${BASE_URL}/countries_metadata.json`);
  return Object.entries(metadata).map(([code, info]) => ({
    code: code.toLowerCase(),
    name: info.country,
    capital: info.capital,
    timeZone: info.timeZone,
    hasChannels: info.hasChannels,
  }));
}

/**
 * Devuelve los canales de un país.
 * @param {string} countryCode  Código ISO en minúsculas, ej: "mx", "us", "jp"
 * @returns {Promise<Array>}
 *
 * Cada canal tiene:
 *   { nanoid, name, country, languages, isGeoBlocked,
 *     stream_urls, youtube_urls }
 */
export async function getChannelsByCountry(countryCode) {
  const code = countryCode.toLowerCase();
  return fetchJSON(`${BASE_URL}/countries/${code}.json`);
}

/**
 * Devuelve solo los canales que tienen stream HLS (m3u8).
 * Útil para filtrar los que solo tienen YouTube.
 * @param {string} countryCode
 * @returns {Promise<Array>}
 */
export async function getLiveChannels(countryCode) {
  const channels = await getChannelsByCountry(countryCode);
  return channels.filter((ch) => ch.stream_urls && ch.stream_urls.length > 0);
}

/**
 * Busca canales por nombre (búsqueda local, no requiere backend).
 * @param {string} countryCode
 * @param {string} query  Texto a buscar
 * @returns {Promise<Array>}
 */
export async function searchChannels(countryCode, query) {
  const channels = await getChannelsByCountry(countryCode);
  const q = query.toLowerCase();
  return channels.filter((ch) => ch.name.toLowerCase().includes(q));
}
