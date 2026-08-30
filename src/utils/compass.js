// src/utils/compass.js
//
// Kompass-Domäne: baut auf geoUtils.js auf (dort liegt die sphärische
// Mathematik - hier nicht duplizieren) und ergänzt zwei Dinge:
//   1. period-genaue Distanz-Einheit "preußische Rute" für die
//      historische Kompass-Ansicht (die App zeigt daneben weiter Meter),
//   2. das DeviceOrientation-Berechtigungs- und Sensor-Handling als
//      wiederverwendbare Funktionen (bisher inline in DirectionCompass.jsx).

import { calculateBearing, calculateDistance, bearingToCompassLabel } from './geoUtils';

export { calculateBearing, calculateDistance, bearingToCompassLabel };

// 1 preußische (rheinländische) Rute = 12 Fuß = 3,7662 m.
// Am Kap Arkona (Pommern) die 1875 gebräuchliche Maßeinheit.
export const METER_PER_RUTE = 3.7662;

export function metersToRuten(meters) {
  return meters / METER_PER_RUTE;
}

// Distanz-Text im Ton einer alten Seekarte. Rein dekorativ.
export function formatRuten(meters) {
  if (!Number.isFinite(meters) || meters < 0) return '';
  const ruten = metersToRuten(meters);
  if (ruten < 1) return 'keine volle Rute';
  if (ruten < 20) return `${ruten.toFixed(1)} Ruten`;
  return `${Math.round(ruten)} Ruten`;
}

// --- DeviceOrientation / Kompass-Sensor ---

export function orientationSupported() {
  return typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
}

// iOS 13+ verlangt eine explizite Nutzer-Geste (DeviceOrientationEvent.requestPermission).
export function orientationNeedsPermission() {
  return (
    orientationSupported() &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  );
}

export async function requestOrientationPermission() {
  if (!orientationNeedsPermission()) return 'granted'; // andere Browser: kein Gate
  try {
    return await DeviceOrientationEvent.requestPermission();
  } catch {
    return 'denied';
  }
}

// Ruft `onHeading` mit der Kompass-Peilung des Geräts auf (0-360°, 0 = Norden).
// Gibt eine Abmeldefunktion zurück. Ohne Sensor bzw. ohne erteilte Freigabe
// wird nie aufgerufen.
//
// "webkitCompassHeading" (iOS) ist bereits die echte Peilung. Beim Standard-
// DeviceOrientationEvent (Android) läuft "alpha" gegenläufig - "360 - alpha"
// ist die in der Praxis übliche Näherung (Kalibrierung variiert je Gerät).
export function watchDeviceHeading(onHeading) {
  if (!orientationSupported()) return () => {};

  const handle = (event) => {
    const heading =
      event.webkitCompassHeading ??
      (event.alpha != null ? (360 - event.alpha) % 360 : null);
    if (heading != null) onHeading(heading);
  };

  window.addEventListener('deviceorientationabsolute', handle);
  window.addEventListener('deviceorientation', handle);
  return () => {
    window.removeEventListener('deviceorientationabsolute', handle);
    window.removeEventListener('deviceorientation', handle);
  };
}
