// src/components/ExplorerPinProgress.jsx
//
// Schlanke Belohnungs-Anzeige für den Light-Modus ("Foto-Safari"): ein
// einziges Ziel - die offizielle Entdeckernadel - mit Fortschrittsbalken
// und Abhol-Hinweis, sobald alle Stationen fotografiert sind. Ersetzt im
// Light-Modus GoodieTracker + ExplorerLogbook komplett.

import { InkCheck, InkMapPin } from './icons/AntiqueIcons';

export default function ExplorerPinProgress({ completedCount = 0, totalStations = 15 }) {
  const done = Math.min(Math.max(completedCount, 0), totalStations);
  const isComplete = done >= totalStations;
  const percent = Math.round((done / totalStations) * 100);

  return (
    <div className={`pin-progress ${isComplete ? 'is-complete' : ''}`}>
      <div className="pin-progress-head">
        <span className="pin-progress-badge" aria-hidden="true">
          {isComplete ? <InkCheck size={22} /> : <InkMapPin size={22} />}
        </span>
        <div className="pin-progress-text">
          <h3>Offizielle Entdeckernadel</h3>
          {isComplete ? (
            <p>
              Alle {totalStations} Stationen fotografiert! Zeig diese Seite in der
              Tourist-Info am Gro&szlig;parkplatz oder in der Tourist-Info &amp; Shop bei den
              T&uuml;rmen vor, um deine Anstecknadel abzuholen.
            </p>
          ) : (
            <p>{done} von {totalStations} Stationen fotografiert</p>
          )}
        </div>
      </div>

      <div
        className="pin-progress-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Fortschritt zur Entdeckernadel"
      >
        <div className="pin-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
