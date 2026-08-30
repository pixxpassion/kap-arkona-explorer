// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(), // Aktiviert HTTPS für den lokalen Server (wichtig für Handy-Tests)
    VitePWA({
      registerType: 'autoUpdate', // Aktualisiert die App automatisch auf dem Handy bei Code-Änderungen
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png.png',
        'schilling-wordmark-schwarz.png',
        'schilling-wordmark-weiss.png',
        'schilling-fernglas.webp',
        'leuchtturmwaerter-lantern.webp'
      ],
      workbox: {
        // App-Code, Bild-Assets und die lokalen Schriften werden beim
        // Erstinstall vollständig heruntergeladen und offline vorgehalten.
        // Die vertonten Schilling-Dialoge (public/audio/*.mp3, ~5,5 MB)
        // sind bewusst NICHT mehr hier drin - sie würden den Erstinstall
        // genau an der empfangsschwachen Steilküste unnötig aufblähen.
        // Stattdessen werden sie unten per runtimeCaching beim ersten
        // Abspielen gecacht und sind ab dann ebenfalls offline verfügbar.
        // (Die kurzen Tippgeräusche entstehen weiterhin rein per Web Audio
        // API zur Laufzeit, dafür gibt es keine Datei zum Vorcachen.)
        globPatterns: ['**/*.{js,css,html,ico,svg,png,webp,woff2}'],
        runtimeCaching: [
          {
            // Vertonte Schilling-Dialoge (public/audio/*.mp3): beim ersten
            // Abspielen einer Station in den Cache, danach offline verfügbar
            // - auch wenn der Empfang später abbricht. rangeRequests, weil
            // <audio>/new Audio() (v.a. Safari) die Dateien per Range-Request
            // holt und CacheFirst sonst nichts ausliefern könnte.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && /\/audio\/[^/]+\.mp3$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'kap-arkona-audio',
              rangeRequests: true,
              expiration: {
                maxEntries: 40, // 15 Stations- + 6 Logbuch-Aufnahmen, mit Reserve
                maxAgeSeconds: 60 * 60 * 24 * 90 // 90 Tage
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Historische Kartenkacheln von map.kap-arkona.de: einmal
            // angesehene Kartenausschnitte bleiben offline verfügbar,
            // auch wenn der Empfang später abbricht.
            urlPattern: ({ url }) => url.hostname === 'map.kap-arkona.de',
            handler: 'CacheFirst',
            options: {
              cacheName: 'kap-arkona-map-tiles',
              expiration: {
                maxEntries: 3000,
                maxAgeSeconds: 60 * 60 * 24 * 90 // 90 Tage
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
          // Playfair Display / Courier Prime laufen jetzt lokal mit (siehe
          // src/theme/fonts.css, DSGVO-Grund) und landen dadurch automatisch
          // im normalen Precache oben (globPatterns enthält .woff2) - keine
          // eigene Google-Fonts-Regel mehr nötig.
        ]
      },
      manifest: {
        name: 'Kap Arkona Entdecker',
        short_name: 'Arkona Entdecker',
        description: 'Die interaktive GPS-Schnitzeljagd am Kap Arkona',
        theme_color: '#0a3366', // Unser maritimes Dunkelblau
        background_color: '#F4F7F6',
        display: 'standalone', // Versteckt die Adresszeile des Browsers
        icons: [
          {
            src: 'icon-192.png.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});