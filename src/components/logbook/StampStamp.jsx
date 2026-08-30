// src/components/logbook/StampStamp.jsx
//
// Ein einzelner Logbuch-Stempel im Stil einer kaiserlichen Poststation:
// runder Doppelring, Symbol oben, Titel/Untertitel darunter, leicht schief
// "aufgedrückt". Beim Erscheinen läuft eine kurze Andruck-Animation
// (groß -> Überschwung -> sitzt); im Moment des Aufschlags gibt es einen
// kurzen haptischen Impuls (navigator.vibrate), sofern das Gerät das
// unterstützt und die Person keine reduzierte Bewegung eingestellt hat.
//
// Props:
//   type    — Eintrag aus STAMP_TYPES (stamps.js)
//   size    — 'sm' | 'md' | 'lg'  (Default 'md')
//   compact — nur Ring + Symbol (Entwertungs-/Poststempel ohne Text),
//             z. B. als kleiner Vermerk auf einer Sammelkarte
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

const PRESS_DURATION = 420; // muss zu @keyframes mj-stamp-press in logbook-aging.css passen

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function StampStamp({
  type,
  size = 'md',
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

    // Impuls genau auf den "Aufschlag" legen: kurz bevor der Stempel nach
    // dem Überschwung sitzt. Kurzes "Tock-Tock" statt langem Brummen.
    const impactAt = delay + PRESS_DURATION * 0.45;
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

  const rotation = getStampRotation(seed ?? type.id);

  return (
    <span
      className={`mj-stamp mj-stamp--${size} ${compact ? 'mj-stamp--compact' : ''} ${className}`}
      data-stamp={type.id}
      aria-hidden="true"
      style={{
        '--stamp-rotation': `${rotation}deg`,
        '--stamp-color': type.color,
        '--stamp-delay': `${delay}ms`,
        ...style,
      }}
    >
      <span className="mj-stamp-ring" />
      <span className="mj-stamp-inner">
        <StampIcon name={type.icon} className="mj-stamp-icon" />
        {!compact && (
          <>
            <span className="mj-stamp-title">{type.title}</span>
            <span className="mj-stamp-sub">{type.subtitle}</span>
          </>
        )}
      </span>
    </span>
  );
}
