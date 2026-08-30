// src/components/logbook/StampStamp.jsx
//
// Ein einzelner Logbuch-Stempel: rechteckig mit doppelter Randlinie,
// Symbol oben, Titel/Untertitel darunter (Versalien), leicht schief
// "aufgedrückt". Beim Erscheinen läuft die Andruck-Animation stampImpact
// (groß -> sitzt, siehe logbook-aging.css). Für Meilenstein-Stempel gibt
// es im Aufschlag-Moment optional einen kurzen haptischen Impuls
// (navigator.vibrate).
//
// Props:
//   type    — Eintrag aus STAMP_TYPES (stamps.js)
//   compact — nur Symbol (kleiner Entwertungsstempel für eine Sammelkarte)
//   haptic  — bei true einen kurzen Vibrationsimpuls im Andruck-Moment
//             auslösen (nur wenn das Gerät vibrate kann, bereits eine
//             Nutzer-Geste stattfand und keine reduzierte Bewegung
//             eingestellt ist). Für die Meilenstein-Stempel gedacht, nicht
//             für die vielen kleinen Kartenstempel.
//   seed    — Rotations-Seed; Default type.id. Für mehrere gleichartige
//             Stempel (z. B. "Station erreicht" je Karte) etwas Eindeutiges
//             übergeben, damit sie nicht alle gleich schief sitzen.
//   delay   — Verzögerung der Andruck-Animation in ms (gestaffeltes
//             Erscheinen mehrerer Stempel)
//   className / style — zusätzliche Positionierung von außen

import { useEffect, useRef } from 'react';
import { getStampRotation } from '../../data/stamps';
import { hasGestured } from '../../utils/audioUnlock';
import StampIcon from './StampIcons';

const PRESS_DURATION = 350; // muss zu @keyframes stampImpact in logbook-aging.css passen

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function StampStamp({
  type,
  compact = false,
  haptic = false,
  seed,
  delay = 0,
  className = '',
  style,
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return undefined;
    firedRef.current = true;

    if (!haptic) return undefined;
    if (prefersReducedMotion()) return undefined;
    // Ohne vorherige Nutzer-Geste blockieren Browser vibrate() und loggen
    // einen Fehler - dieselbe Gate wie bei Audio/Sprachausgabe.
    if (!hasGestured()) return undefined;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return undefined;

    // Impuls in den "Aufschlag" legen (kurz bevor der Stempel sitzt).
    // Kurzes "Tock-Tock" statt langem Brummen.
    const impactAt = delay + PRESS_DURATION * 0.5;
    const timer = setTimeout(() => {
      try {
        navigator.vibrate([12, 8, 22]);
      } catch {
        /* vibrate von der Plattform blockiert - ignorieren */
      }
    }, impactAt);

    return () => clearTimeout(timer);
  }, [haptic, delay]);

  if (!type) return null;

  const angle = getStampRotation(seed ?? type.id);

  return (
    <span
      className={`stamp-container stamp-animating ${compact ? 'stamp-container--compact' : ''} ${className}`.trim()}
      data-stamp={type.id}
      aria-hidden="true"
      style={{
        '--stamp-angle': `${angle}deg`,
        '--stamp-color': type.color,
        '--stamp-delay': `${delay}ms`,
        ...style,
      }}
    >
      <StampIcon name={type.icon} className="stamp-icon" />
      {!compact && (
        <>
          <span className="stamp-title">{type.title}</span>
          <span className="stamp-sub">{type.subtitle}</span>
        </>
      )}
    </span>
  );
}
