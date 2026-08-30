// src/components/logbook/StampStamp.jsx
//
// Ein Logbuch-Stempel: rechteckig mit doppelter Randlinie, Untertitel +
// Titel in Versalien, leicht schief (getStampRotation). Der frisch
// erhaltene Stempel (isNew) wird mit der stampImpact-Animation
// "aufgedrückt" und gibt im selben Moment einen kurzen haptischen Impuls;
// bereits vorhandene Stempel erscheinen still.
//
// Styles: src/theme/logbook-aging.css (.stamp-container / .stamp-animating).

import { useEffect } from 'react';
import { getStampRotation } from '../../data/stamps';
import { hasGestured } from '../../utils/audioUnlock';

export function StampStamp({ stamp, isNew = false }) {
  const angle = getStampRotation(stamp.id);

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
      className={`stamp-container ${isNew ? 'stamp-animating' : ''}`}
      style={{
        color: stamp.color,
        '--stamp-angle': `${angle}deg`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <span style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{stamp.subtitle}</span>
      <span style={{ fontSize: '0.95rem', margin: '2px 0' }}>{stamp.title}</span>
    </div>
  );
}
