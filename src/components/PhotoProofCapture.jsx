// src/components/PhotoProofCapture.jsx
//
// Ersetzt den früheren QR-Code-Scan als Alternative zur GPS-Freischaltung,
// falls sich der Standort nicht aktualisieren lässt: öffnet die Kamera mit
// einem antiken Sucher-Rahmen-Overlay, ein Antippen des Auslösers gilt als
// Vor-Ort-Nachweis. Gleiche Vertrauensstufe wie vorher der QR-Code - eine
// echte inhaltliche Prüfung ("zeigt das Foto wirklich diese Station?")
// wäre nur mit einem kostenpflichtigen Cloud-Bilderkennungsdienst möglich,
// was dem Offline-Anspruch der App widerspräche. Das Foto selbst wird nur
// kurz zur Bestätigung angezeigt, nicht gespeichert oder übertragen (siehe
// LegalModal.jsx, Abschnitt "Kamera").
//
// Props:
//   onCapture() — wird nach dem Auslösen (mit kurzer Bestätigungsanzeige) aufgerufen
//   onCancel()  — Kamera schließen ohne Foto

import { useEffect, useRef, useState } from 'react';
import { InkCamera } from './icons/AntiqueIcons';

export default function PhotoProofCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  // Lazy-Initializer statt setState im Effekt: "unterstützt dieser Browser
  // Kamerazugriff" ändert sich zur Laufzeit nicht (wie schon bei
  // GameContainer.jsx für die GPS-Unterstützung gehandhabt).
  const [error, setError] = useState(() =>
    navigator.mediaDevices?.getUserMedia ? '' : 'Dein Browser unterstützt keinen Kamerazugriff.'
  );
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) return undefined;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(() => setError('Bitte erlaube den Kamerazugriff in deinem Browser.'));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapshot(canvas.toDataURL('image/jpeg', 0.8));

    streamRef.current?.getTracks().forEach((track) => track.stop());

    // Kurze Bestätigung zeigen, bevor die Aufgabe freigeschaltet wird.
    setTimeout(() => onCapture(), 700);
  };

  return (
    <div className="photo-capture-wrapper">
      {error ? (
        <div className="photo-capture-error">
          <p>{error}</p>
          <button type="button" className="btn-reset-subtle" onClick={onCancel}>
            Schließen
          </button>
        </div>
      ) : snapshot ? (
        <div className="photo-capture-confirm">
          <img src={snapshot} alt="" className="photo-capture-snapshot" />
          <p><InkCamera size={18} /> Schöner Schnappschuss!</p>
        </div>
      ) : (
        <>
          <div className="photo-capture-viewfinder">
            <video ref={videoRef} playsInline muted className="photo-capture-video" />
            <svg className="photo-capture-frame" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="#C5A059" strokeWidth="3" strokeLinecap="round">
                <path d="M14 50 V14 H50" />
                <path d="M250 14 H286 V50" />
                <path d="M286 250 V286 H250" />
                <path d="M50 286 H14 V250" />
              </g>
            </svg>
          </div>
          <div className="photo-capture-actions">
            <button type="button" className="btn-scan" onClick={handleCapture}>
              <InkCamera size={18} /> Foto aufnehmen
            </button>
            <button type="button" className="btn-reset-subtle" onClick={onCancel}>
              Abbrechen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
