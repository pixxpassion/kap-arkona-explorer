// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Aktiviert HTTPS für den lokalen Server (wichtig für Handy-Tests)
    VitePWA({
      registerType: 'autoUpdate', // Aktualisiert die App automatisch auf dem Handy bei Code-Änderungen
      includeAssets: ['favicon.svg', 'apple-touch-icon.png.png'],
      manifest: {
        name: 'Kap Arkona Explorer',
        short_name: 'Arkona Explorer',
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