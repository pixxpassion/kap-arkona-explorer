// src/components/ExplorerPinProgress.jsx
//
// Schlanke Belohnungs-Anzeige für den Light-Modus ("Foto-Safari"): ein
// einziges Ziel - die offizielle Entdeckernadel - mit Fortschrittsbalken
// und Abhol-Hinweis, sobald alle Stationen fotografiert sind. Ersetzt im
// Light-Modus GoodieTracker + ExplorerLogbook komplett.
//
// Ist der Rundgang komplett (completedCount === totalStations), lässt sich
// die Nadel "vor Ort einlösen": ein Bestätigungsschritt (vom Personal zu
// entwerten), danach ein fester Zeitstempel-Badge. Der Status liegt in
// localStorage (kapArkonaPinRedeemed) und bleibt - analog zu den
// Goodie-Etappen - auch über "Foto-Safari neu starten" erhalten (die
// physische Nadel ist ja ausgegeben).

import { useState } from 'react';
import { InkCheck, InkMapPin, InkSeal } from './icons/AntiqueIcons';
import { sfx } from '../utils/sfxSynthesizer';

const PIN_KEY = 'kapArkonaPinRedeemed';

function loadRedeemed() {
  try {
    return localStorage.getItem(PIN_KEY) || null;
  } catch {
    return null;
  }
}

export default function ExplorerPinProgress({ completedCount = 0, totalStations = 15 }) {
  const done = Math.min(Math.max(completedCount, 0), totalStations);
  const isComplete = done >= totalStations;
  const percent = Math.round((done / totalStations) * 100);

  const [redeemedAt, setRedeemedAt] = useState(loadRedeemed);
  const [confirming, setConfirming] = useState(false);

  const confirmRedeem = () => {
    const stamp = new Date().toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    try {
      localStorage.setItem(PIN_KEY, stamp);
    } catch {
      /* Speicher nicht verfügbar - Badge zeigt trotzdem die Bestätigung */
    }
    setRedeemedAt(stamp);
    setConfirming(false);
    sfx.playBell();
  };

  return (
    <div className={`pin-progress ${isComplete ? 'is-complete' : ''} ${redeemedAt ? 'is-redeemed' : ''}`}>
      <div className="pin-progress-head">
        <span className="pin-progress-badge" aria-hidden="true">
          {isComplete ? <InkCheck size={22} /> : <InkMapPin size={22} />}
        </span>
        <div className="pin-progress-text">
          <h3>Offizielle Entdeckernadel</h3>
          {redeemedAt ? (
            <p>Deine Anstecknadel ist abgeholt – viel Freude damit!</p>
          ) : isComplete ? (
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

      {isComplete && (
        <div className="pin-redeem">
          {redeemedAt ? (
            <span className="pin-redeemed-tag">
              <InkCheck size={14} /> Eingel&ouml;st am {redeemedAt}
            </span>
          ) : confirming ? (
            <div className="pin-redeem-confirm">
              <p>
                <InkSeal size={16} style={{ verticalAlign: '-3px', marginRight: '4px' }} />
                Vom Personal entwerten lassen? Danach gilt die Nadel als ausgegeben und die
                Best&auml;tigung bleibt auf diesem Ger&auml;t gespeichert.
              </p>
              <div className="pin-redeem-actions">
                <button type="button" className="btn-submit" onClick={confirmRedeem}>
                  Einl&ouml;sung best&auml;tigen
                </button>
                <button
                  type="button"
                  className="btn-reset-subtle"
                  onClick={() => setConfirming(false)}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn-scan" onClick={() => setConfirming(true)}>
              <InkSeal size={16} style={{ verticalAlign: '-3px', marginRight: '6px' }} />
              Pin vor Ort einl&ouml;sen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
