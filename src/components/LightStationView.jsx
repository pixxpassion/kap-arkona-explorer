// src/components/LightStationView.jsx
//
// Stations-Ansicht im Light-Modus ("Foto-Safari"): kein Rätsel. Sobald man
// im GPS-Radius ist (oder GPS nicht verfügbar ist), macht man ein Foto vom
// Zielort und verzeichnet die Station. Das Foto wird nur lokal als DataURL
// angezeigt - nicht gespeichert, nicht übertragen (wie bei
// PhotoProofCapture, siehe LegalModal.jsx).
//
// Props:
//   station         — aktuelle Station (stations.js)
//   inRange         — GPS meldet Distanz <= station.radius
//   gpsUnavailable  — kein GPS-Signal / Zugriff verweigert
//   onComplete()    — Station verzeichnet, weiter zur nächsten

import { useState } from 'react';
import { sfx } from '../utils/sfxSynthesizer';
import { InkCamera, InkCheck, InkCompass } from './icons/AntiqueIcons';

export default function LightStationView({ station, inRange, gpsUnavailable, onComplete }) {
  const [photo, setPhoto] = useState(null);

  const canCapture = inRange || gpsUnavailable;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // dieselbe Datei später erneut wählbar machen
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      sfx.playPaperRustle();
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    sfx.playBell();
    onComplete();
  };

  if (!canCapture) {
    return (
      <div className="light-station light-station--locked" role="status">
        <InkCompass size={26} />
        <p>
          Geh weiter Richtung Ziel. Ab <strong>{station.radius} Metern</strong> Entfernung
          schaltet sich das Foto frei.
        </p>
      </div>
    );
  }

  return (
    <div className="light-station">
      {!photo ? (
        <>
          <p className="light-station-hint">
            {gpsUnavailable ? (
              'Kein GPS-Signal - mach trotzdem ein Foto vom Zielort als Nachweis.'
            ) : (
              <>Zielort erreicht! Mach ein Foto von <strong>{station.title}</strong>.</>
            )}
          </p>
          <label className="light-camera-btn">
            <InkCamera size={18} />
            <span>Foto aufnehmen</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
            />
          </label>
        </>
      ) : (
        <>
          <img
            src={photo}
            alt={`Dein Foto von ${station.title}`}
            className="light-photo-preview"
          />
          <div className="light-station-actions">
            <button type="button" className="btn-scan" onClick={handleConfirm}>
              <InkCheck size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }} />
              Station verzeichnen
            </button>
            <button type="button" className="btn-reset-subtle" onClick={() => setPhoto(null)}>
              Neues Foto
            </button>
          </div>
        </>
      )}
    </div>
  );
}
