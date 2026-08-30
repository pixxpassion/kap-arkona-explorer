import { defineConfig } from 'vitest/config';

// Eigene, minimale Konfiguration statt vite.config.js - die Datenstruktur-Tests
// brauchen weder React-, Tailwind- noch PWA-Plugin.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
