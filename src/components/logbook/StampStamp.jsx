// src/components/logbook/StampStamp.jsx
//
// Ein Logbuch-Stempel: rechteckig mit doppelter Randlinie, Untertitel +
// Titel in Versalien, leicht schief (getStampRotation). Der frisch
// erhaltene Stempel (isNew) wird mit der stampImpact-Animation
// "aufgedrückt" und gibt im selben Moment einen kurzen haptischen Impuls;
// bereits vorhandene Stempel erscheinen still.
//
// seed: Rotations-Seed (Default stamp.id). Für mehrere gleichartige
// Stempel - z. B. "Station erreicht" auf jedem Erfolgs-Screen - etwas
// Eindeutiges übergeben, damit sie nicht alle exakt gleich schief sitzen.
//
// compact: kleiner Eck-Stempel (nur der Titel, winzige Schrift) - für die
// Sammelkarten im Logbuch.
//
// Styles: src/theme/logbook-aging.css (.stamp-container / .stamp-animating).

import { useEffect } from 'react';
import { getStampRotation } from '../../data/stamps';
import { hasGestured } from '../../utils/audioUnlock';

export function StampStamp({ stamp, isNew = false, seed, compact = false }) {
  const angle = getStampRotation(seed ?? stamp.id);

  useEffect(() => {
    if (!isNew) return;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    // Ohne vorherige Nutzer-Geste blockiert der Browser vibrate() und loggt
    // einen Fehler (dieselbe Gate wie bei Audio/Sprachausgabe, siehe
    // audioUnlock.js). Beim Erreichen eines Meilensteins vor Ort hat immer
    // schon eine Geste stattgefunden - nur beim Kaltstart mit sichtbarem
    // Logbuch greift die Sperre.
    if (!hasGestured()) return;
    // Haptisches Feedback beim Aufstempeln
    navigator.vibrate([25, 30, 45]);
  }, [isNew]);

  return (
    <div
      className={`stamp-container ${compact ? 'stamp-container--compact' : ''} ${isNew ? 'stamp-animating' : ''}`}
      style={{
        color: stamp.color,
        '--stamp-angle': `${angle}deg`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {compact ? (
        <span className="stamp-compact-label">{stamp.title}</span>
      ) : (
        <>
          <span className="stamp-subtitle">{stamp.subtitle}</span>
          <span className="stamp-title">{stamp.title}</span>
        </>
      )}
    </div>
  );
}
