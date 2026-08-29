import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installAudioUnlock } from './utils/audioUnlock'

installAudioUnlock();

// Der Service Worker aktiviert eine neue Version bereits im Hintergrund
// (skipWaiting/clientsClaim in vite.config.js), das reicht aber allein
// nicht: ohne diesen Reload würde die schon offene Seite weiter die alten,
// im Speicher geladenen Assets zeigen, bis man von Hand neu lädt - genau
// das Problem, das "registerType: autoUpdate" eigentlich vermeiden soll.
if ('serviceWorker' in navigator) {
  let hasReloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return;
    hasReloaded = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
