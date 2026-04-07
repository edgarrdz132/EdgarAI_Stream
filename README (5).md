# 🎬 StreamPlay Pro

Plataforma completa de streaming con películas reales (TMDB), canales en vivo (HLS) y soporte de listas M3U.

---

## 📁 Estructura del proyecto

```
streamplay/
├── index.html          ← Página principal (abre esto en el navegador)
├── css/
│   └── style.css       ← Todos los estilos
├── js/
│   ├── config.js       ← API keys y canales demo
│   ├── api.js          ← Integración con TMDB
│   ├── player.js       ← Reproductor Video.js + HLS
│   ├── m3u.js          ← Parser y generador de listas M3U
│   ├── pages.js        ← Renderizado de cada página
│   └── app.js          ← Inicialización y navegación
└── assets/             ← Imágenes y recursos locales (opcional)
```

---

## 🚀 Cómo usar

### 1. Abrir localmente
Simplemente abre `index.html` en tu navegador favorito.

> ⚠️ Para que la API de TMDB funcione correctamente, se recomienda usar un servidor local:
> ```bash
> # Con Python
> python -m http.server 8080
> # Luego abre: http://localhost:8080
> ```

### 2. Obtener tu API Key de TMDB (gratis)
1. Regístrate en https://www.themoviedb.org
2. Ve a Configuración → API → Solicitar API Key
3. Abre `js/config.js` y reemplaza:
   ```js
   TMDB_KEY: 'TU_API_KEY_AQUI'
   ```

---

## 📡 Agregar canales con listas M3U

### Fuentes gratuitas y legales:
| País | URL |
|------|-----|
| México | `https://iptv-org.github.io/iptv/countries/mx.m3u` |
| España | `https://iptv-org.github.io/iptv/countries/es.m3u` |
| Argentina | `https://iptv-org.github.io/iptv/countries/ar.m3u` |
| En español | `https://iptv-org.github.io/iptv/languages/spa.m3u` |

### Cómo cargar tu lista:
1. Ve a la sección **M3U** en el portal
2. Pega la URL de tu lista o el contenido M3U directamente
3. Los canales se cargarán agrupados por categoría

---

## 🌐 Publicar en internet (gratis)

### Opción 1 — Netlify (recomendado)
1. Ve a https://netlify.com
2. Arrastra la carpeta `streamplay/` al área de drop
3. ¡Listo! Te da una URL pública

### Opción 2 — GitHub Pages
1. Sube la carpeta a un repositorio en GitHub
2. Ve a Settings → Pages → Deploy from branch
3. Selecciona la rama `main` y carpeta `/root`

---

## 🛠️ Tecnologías usadas

- **TMDB API** — películas y series reales (gratis)
- **Video.js** — reproductor de video profesional
- **HLS.js** — soporte para streams M3U8 en tiempo real
- **IPTV-Org** — listas M3U de canales abiertos

---

## ✅ Compatibilidad de listas M3U

Tu lista generada funciona con:
- 📺 VLC Media Player
- 🎬 Kodi (con PVR IPTV Simple Client)
- 📡 TiviMate (Android TV)
- 🔥 IPTV Smarters (iOS/Android)
- ⚡ Este mismo portal StreamPlay Pro
