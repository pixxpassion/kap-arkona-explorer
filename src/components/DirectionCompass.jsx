// src/components/DirectionCompass.jsx
//
// Kompassnadel/Wegweiser statt einer immer sichtbaren Karte: zeigt die
// Peilung (Kurs) zur aktuellen Station an. Wenn das Gerät Ausrichtungs-
// sensoren erlaubt (Kompass/Magnetometer), dreht sich die ganze Rose mit
// der tatsächlichen Blickrichtung des Handys mit - die Nadel zeigt dann
// wie bei einer echten Peilung direkt auf das Ziel, egal wohin man sich
// dreht. Ohne Sensor-Zugriff (Desktop, verweigerte iOS-Berechtigung, o.ä.)
// bleibt die Rose fest nach Norden ausgerichtet und die Nadel zeigt die
// reine Peilung ab Norden - wie ein klassischer Kompass, weiterhin nützlich.
//
// iOS 13+ verlangt eine explizite Nutzer-Geste für den Sensor-Zugriff
// (DeviceOrientationEvent.requestPermission) - dafür erscheint bei Bedarf
// ein kleiner Freischalt-Button.

import { useEffect, useState } from 'react';
import {
  watchDeviceHeading,
  orientationNeedsPermission,
  requestOrientationPermission,
} from '../utils/compass';
import { calculateBearing, bearingToCompassLabel } from '../utils/geoUtils';

export default function DirectionCompass({ userLocation, target }) {
  const [heading, setHeading] = useState(null);
  const [permissionNeeded, setPermissionNeeded] = useState(orientationNeedsPermission);

  useEffect(() => {
    // iOS: der Sensor-Listener lohnt erst nach erteilter Freigabe (bis
    // dahin steht der "Kompass aktivieren"-Button). watchDeviceHeading
    // kapselt die deviceorientation(absolute)-Listener + die
    // webkitCompassHeading/alpha-Umrechnung (siehe src/utils/compass.js).
    if (permissionNeeded) return undefined;
    return watchDeviceHeading(setHeading);
  }, [permissionNeeded]);

  const requestPermission = async () => {
    const result = await requestOrientationPermission();
    if (result === 'granted') setPermissionNeeded(false);
  };

  if (!userLocation) {
    return (
      <div className="compass-widget compass-widget-idle">
        <InkCompassFace rotation={0} />
      </div>
    );
  }

  const bearing = calculateBearing(
    userLocation.latitude, userLocation.longitude,
    target.latitude, target.longitude
  );
  // Ohne Geräte-Peilung bleibt die Rose fest (0°) und die Nadel zeigt die
  // Peilung direkt; mit Geräte-Peilung dreht sich die ganze Rose gegen die
  // Blickrichtung, sodass die Nadel selbst weiterhin exakt Richtung Ziel
  // zeigt.
  const faceRotation = heading != null ? -heading : 0;

  return (
    <div className="compass-widget">
      <InkCompassFace rotation={faceRotation} needleRotation={bearing} />
      <span className="compass-label">{bearingToCompassLabel(bearing)}</span>
      {permissionNeeded && (
        <button type="button" className="compass-permission-btn" onClick={requestPermission}>
          Kompass aktivieren
        </button>
      )}
    </div>
  );
}

// Kompass-Rose im Tuschestrich-Stil: äußerer/innerer Ring drehen sich mit
// der Geräte-Peilung (falls verfügbar), die Nadel zusätzlich mit der
// Ziel-Peilung - beide per CSS-Transform, kein Neuzeichnen bei jedem Tick.
function InkCompassFace({ rotation = 0, needleRotation = 0 }) {
  return (
    <svg viewBox="0 0 100 100" className="compass-face-svg" aria-hidden="true">
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }}>
        <circle cx="50" cy="50" r="45" className="compass-ring-outer" />
        <circle cx="50" cy="50" r="36" className="compass-ring-inner" />
        <text x="50" y="14" className="compass-tick compass-tick-n">N</text>
        <text x="90" y="54" className="compass-tick">O</text>
        <text x="50" y="94" className="compass-tick">S</text>
        <text x="10" y="54" className="compass-tick">W</text>
      </g>
      <g style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '50px 50px' }}>
        <path d="M50 14 L58 50 L50 60 L42 50 Z" className="compass-needle-north" />
        <path d="M50 86 L42 50 L50 60 L58 50 Z" className="compass-needle-south" />
      </g>
      <circle cx="50" cy="50" r="4" className="compass-pivot" />
    </svg>
  );
}
