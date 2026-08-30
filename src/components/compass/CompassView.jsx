// src/components/compass/CompassView.jsx
//
// Historische Kompass-Ansicht im Messing-Look (c. 1875): großes Gehäuse,
// gravierte Windrose, rot/creme Peil-Nadel zum Ziel. Ergänzt den kleinen
// Tuschestrich-Wegweiser in DirectionCompass.jsx - gleiche Sensor-Logik,
// aber als ausführliche, eigenständige Ansicht (z. B. eigener Tab/Panel).
//
// Wenn das Gerät Ausrichtungssensoren erlaubt, dreht sich die ganze Rose
// mit der Blickrichtung mit; die Nadel zeigt dann wie bei einer echten
// Peilung immer aufs Ziel. Ohne Sensor bleibt die Rose fest nach Norden,
// die Nadel zeigt die reine Peilung ab Nord.
//
// Props:
//   userLocation  — { latitude, longitude } | null
//   target        — { latitude, longitude } | null
//   showDistance  — Entfernung in preußischen Ruten einblenden (Default true)

import { useEffect, useState } from 'react';
import {
  calculateBearing,
  calculateDistance,
  bearingToCompassLabel,
  formatRuten,
  orientationNeedsPermission,
  requestOrientationPermission,
  watchDeviceHeading,
} from '../../utils/compass';

export default function CompassView({ userLocation, target, showDistance = true }) {
  const [heading, setHeading] = useState(null);
  const [permissionNeeded, setPermissionNeeded] = useState(orientationNeedsPermission);

  useEffect(() => {
    if (permissionNeeded) return undefined;
    return watchDeviceHeading(setHeading);
  }, [permissionNeeded]);

  const grantPermission = async () => {
    const result = await requestOrientationPermission();
    if (result === 'granted') setPermissionNeeded(false);
  };

  const hasFix = Boolean(userLocation && target);
  const bearing = hasFix
    ? calculateBearing(
        userLocation.latitude, userLocation.longitude,
        target.latitude, target.longitude,
      )
    : 0;
  const distanceM = hasFix
    ? calculateDistance(
        userLocation.latitude, userLocation.longitude,
        target.latitude, target.longitude,
      )
    : null;

  const live = heading != null;
  const roseRotation = live ? -heading : 0;

  return (
    <div className={`compass-view ${hasFix ? '' : 'is-idle'}`}>
      <BrassCompass roseRotation={roseRotation} needleRotation={bearing} live={live} />

      {hasFix && (
        <div className="compass-view-readout">
          <span className="compass-view-label">{bearingToCompassLabel(bearing)}</span>
          <span className="compass-view-bearing">{Math.round(bearing)}°</span>
          {showDistance && distanceM != null && (
            <span className="compass-view-distance">{formatRuten(distanceM)}</span>
          )}
        </div>
      )}

      {permissionNeeded && (
        <button type="button" className="compass-view-permission" onClick={grantPermission}>
          Kompass kalibrieren
        </button>
      )}
    </div>
  );
}

function BrassCompass({ roseRotation, needleRotation, live }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <svg viewBox="0 0 200 200" className="compass-view-svg" role="img" aria-label="Kompass zum Ziel">
      <defs>
        <radialGradient id="cv-face" cx="38%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#f4e3b8" />
          <stop offset="45%" stopColor="#d8b877" />
          <stop offset="80%" stopColor="#a67c37" />
          <stop offset="100%" stopColor="#6d4f20" />
        </radialGradient>
        <linearGradient id="cv-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e9c4" />
          <stop offset="35%" stopColor="#c9a24f" />
          <stop offset="65%" stopColor="#8a6b33" />
          <stop offset="100%" stopColor="#e6d09a" />
        </linearGradient>
      </defs>

      {/* Messing-Gehäuse */}
      <circle cx="100" cy="100" r="97" fill="url(#cv-ring)" stroke="#4a3416" strokeWidth="2" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#4a3416" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="82" fill="url(#cv-face)" stroke="#5c421c" strokeWidth="1.5" />

      {/* Drehende Windrose */}
      <g
        style={{
          transform: `rotate(${roseRotation}deg)`,
          transformOrigin: '100px 100px',
          transition: live ? 'transform 0.2s linear' : 'none',
        }}
      >
        {ticks.map((i) => {
          const major = i % 9 === 0;
          const mid = i % 3 === 0;
          const len = major ? 12 : mid ? 8 : 4;
          return (
            <line
              key={i}
              x1="100" y1="22" x2="100" y2={22 + len}
              stroke="#5c421c"
              strokeWidth={major ? 1.6 : 0.8}
              transform={`rotate(${i * 5} 100 100)`}
            />
          );
        })}

        {/* Windrosen-Stern */}
        <path d="M100 30 L110 96 L100 108 L90 96 Z" fill="#f3e6c8" stroke="#5c421c" strokeWidth="1" />
        <path d="M100 170 L90 104 L100 92 L110 104 Z" fill="#8a6b33" stroke="#5c421c" strokeWidth="1" />
        <path d="M30 100 L96 90 L108 100 L96 110 Z" fill="#c9a24f" stroke="#5c421c" strokeWidth="1" />
        <path d="M170 100 L104 110 L92 100 L104 90 Z" fill="#c9a24f" stroke="#5c421c" strokeWidth="1" />

        <text x="100" y="18" className="compass-view-tick compass-view-tick-n">N</text>
        <text x="185" y="105" className="compass-view-tick">O</text>
        <text x="100" y="192" className="compass-view-tick">S</text>
        <text x="15" y="105" className="compass-view-tick">W</text>
      </g>

      {/* Peil-Nadel zum Ziel */}
      <g
        style={{
          transform: `rotate(${needleRotation}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <path d="M100 28 L107 100 L100 116 L93 100 Z" fill="#b02a1e" stroke="#4a1109" strokeWidth="1" />
        <path d="M100 172 L93 100 L100 84 L107 100 Z" fill="#f3e6c8" stroke="#5c421c" strokeWidth="1" />
      </g>

      {/* Achskappe */}
      <circle cx="100" cy="100" r="7" fill="url(#cv-ring)" stroke="#5c421c" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="2.5" fill="#4a1109" />

      {/* Glasreflex */}
      <ellipse cx="76" cy="72" rx="34" ry="20" fill="#ffffff" opacity="0.12" />
    </svg>
  );
}
