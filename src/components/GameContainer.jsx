// src/components/GameContainer.jsx
import { useState, useEffect, useRef } from 'react';
import { stations, goodieMilestones } from '../data/stations';
import { STAMP_TYPES } from '../data/stamps';
import { calculateDistance } from '../utils/geoUtils';
import { isAnswerCorrect } from '../utils/textUtils';
import { InkLock, InkMapPin, InkFoldedMap, InkChest, InkBurst, InkCompass } from './icons/AntiqueIcons';
import GoodieTracker from './GoodieTracker';
import StationMap from './StationMap';
import DirectionCompass from './DirectionCompass';
import SchillingDialogue from './SchillingDialogue';
import ExplorerLogbook from './ExplorerLogbook';
import PhotoProofCapture from './PhotoProofCapture';
import ScratchReveal from './puzzles/ScratchReveal';
import CompassView from './compass/CompassView';
import { StampStamp } from './logbook/StampStamp';
import { playLatch, playBell } from '../utils/sfx';
import { assetUrl } from '../utils/assetUrl';

export default function GameContainer() {
  // --- 1. STATE-VERWALTUNG ---
  const [currentStationIndex, setCurrentStationIndex] = useState(() => {
    const savedIndex = localStorage.getItem('kapArkonaProgress');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  }); 
  
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  // Lazy-Initializer statt setState im Effekt: "unterstützt dieser Browser
  // GPS" ändert sich zur Laufzeit nicht, muss also nicht in der
  // GPS-Überwachung (Punkt 3 unten) synchron gesetzt werden.
  const [errorMsg, setErrorMsg] = useState(() =>
    navigator.geolocation ? '' : 'GPS wird von deinem Browser nicht unterstützt.'
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  // Nur für Stationen mit type: 'scratch_reveal' - erst wenn die verwitterte
  // Inschrift freigekratzt ist, erscheint die Rätselfrage.
  const [inscriptionRevealed, setInscriptionRevealed] = useState(false);
  // Die Karte ist standardmäßig eingeklappt (Kompassnadel reicht meist zur
  // groben Orientierung) und öffnet sich nur auf Antippen des Kartensymbols
  // - hält den Bildschirm aufgeräumter als eine dauerhaft eingebettete Karte.
  const [showMap, setShowMap] = useState(false);
  // Der große Messing-Kompass (CompassView) ist standardmäßig eingeklappt
  // und wird per Button ausgefahren - der kleine Wegweiser in der
  // Distanz-Box reicht für die grobe Orientierung.
  const [showCompass, setShowCompass] = useState(false);
  const mapRef = useRef(null);
  // Merkt sich, ob die aktuelle Station per Foto-Nachweis freigeschaltet
  // wurde (statt per GPS) - die weiterhin im Hintergrund laufende
  // GPS-Überwachung (Punkt 3) würde eine solche manuelle Freischaltung
  // sonst beim nächsten Standort-Update wieder zurücksetzen, sobald sie
  // "zu weit weg" meldet (genau der Fall, für den der Foto-Nachweis ja
  // gedacht ist). Wird bei Stations-Wechsel automatisch zurückgesetzt, da
  // die GPS-Überwachung dann für die neue Station neu aufgesetzt wird.
  const manuallyUnlockedRef = useRef(false);

  const currentStation = stations[currentStationIndex];
  const needsScratch = currentStation?.type === 'scratch_reveal';
  // Die gerade erfolgreich gelöste Station zählt schon als abgeschlossen,
  // auch bevor auf "Zur nächsten Station" geklickt wurde - sonst taucht ein
  // frisch freigeschaltetes Goodie erst nach dem Weiterklicken in der
  // Übersicht auf, obwohl die Erfolgsmeldung es schon ankündigt.
  const completedCount = Math.min(
    currentStationIndex + (showSuccess ? 1 : 0),
    stations.length
  );

  // --- 2. FORTSCHRITT SPEICHERN ---
  useEffect(() => {
    localStorage.setItem('kapArkonaProgress', currentStationIndex);
  }, [currentStationIndex]);

  // --- 3. GPS ÜBERWACHUNG ---
  useEffect(() => {
    if (!currentStation || !navigator.geolocation) return;
    manuallyUnlockedRef.current = false;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        const dist = calculateDistance(
          latitude, longitude,
          currentStation.target.latitude, currentStation.target.longitude
        );

        setDistance(Math.round(dist));

        // import.meta.env.DEV ist nur im "npm run dev" true - im Production-Build
        // (npm run build) entfernt Vite diesen Zweig automatisch wieder. Ohne
        // Vor-Ort-Besuch schaltet man eine Station stattdessen über den
        // Foto-Nachweis frei (siehe "locked-content" weiter unten).
        if (dist <= currentStation.radius || import.meta.env.DEV) {
          setIsUnlocked(true);
        } else if (!manuallyUnlockedRef.current) {
          setIsUnlocked(false);
        }
      },
      () => {
        setErrorMsg('Bitte erlaube den GPS-Zugriff in deinem Browser.');
        if (import.meta.env.DEV) setIsUnlocked(true);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentStation]);

  // --- 4. HILFS-FUNKTIONEN ---
  const handlePhotoCaptured = () => {
    manuallyUnlockedRef.current = true;
    setIsUnlocked(true);
    setIsCapturingPhoto(false);
    setErrorMsg('');
  };

  const handleAnswerSubmit = () => {
    if (isAnswerCorrect(userAnswer, currentStation.riddle.answer)) {
      setShowSuccess(true);
      setFeedbackMsg('');

      // Mechanisches Schloss-Rasten für die gelöste Station; bei einem
      // Goodie-Meilenstein (Station 5/10/15) zusätzlich die Schiffsglocke,
      // leicht versetzt nach dem Riegel.
      playLatch();
      if ([5, 10, 15].includes(currentStation.id)) {
        setTimeout(playBell, 350);
      }
    } else {
      setFeedbackMsg('Das ist leider nicht ganz richtig. Versuch es noch einmal!');
    }
  };

  const goToNextStation = () => {
    manuallyUnlockedRef.current = false;
    setShowSuccess(false);
    setUserAnswer('');
    setFeedbackMsg('');
    setIsUnlocked(false);
    setInscriptionRevealed(false);
    setCurrentStationIndex(prev => prev + 1);
    // Ohne das hier bleibt die Scroll-Position unten stehen (wo der
    // "Zur nächsten Station"-Button war), während oben schon die neue
    // Station mit Schillings getippten Text erscheint - man hört das
    // Tippen, sieht es aber nicht.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetGame = () => {
    if (window.confirm("Möchtest du das Spiel wirklich komplett von vorn beginnen?")) {
      manuallyUnlockedRef.current = false;
      localStorage.removeItem('kapArkonaProgress');
      setCurrentStationIndex(0);
      setIsUnlocked(false);
      setShowSuccess(false);
      setUserAnswer('');
      setFeedbackMsg('');
      setInscriptionRevealed(false);
    }
  };

  // Scrollt zur frisch eingeblendeten Karte, sobald sie per Kartensymbol
  // geöffnet wird - sie steht erst ab diesem Zeitpunkt im Layout.
  useEffect(() => {
    if (showMap) mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [showMap]);

  // --- 5. FINALE ANSICHT ---
  if (currentStationIndex >= stations.length) {
    return (
      <div className="game-container finale">
        <h2 className="finale-title"><InkBurst size={26} /> Glückwunsch, Entdecker!</h2>
        <p>Du hast alle 15 Stationen gefunden, alle Rätsel gelöst und das Finale gemeistert!</p>
        <p>Hol dir jetzt deine physische <strong>Entdecker-Wandernadel</strong> und deine Goodies ab - in der <strong>Tourist-Info am Großparkplatz</strong> oder in der <strong>Tourist-Info & Shop bei den Türmen</strong>.</p>
        <GoodieTracker completedCount={completedCount} />
        <ExplorerLogbook completedCount={completedCount} />
        <button className="btn-reset" onClick={resetGame}>Spiel für neuen Durchlauf zurücksetzen</button>
      </div>
    );
  }

  // --- 6. HAUPT-ANSICHT ---
  return (
    <div className="game-container">
      <div className="station-header">
        <span className="station-badge">Station {currentStation.id} von {stations.length}</span>
        <h2>{currentStation.title}</h2>
      </div>

      <SchillingDialogue
        text={currentStation.schillingText}
        audioSrc={currentStation.schillingAudio && assetUrl(currentStation.schillingAudio)}
        className="mb-4"
        key={currentStation.id}
      />

      <p className="station-description">{currentStation.description}</p>

      {errorMsg && <div className="error-box">{errorMsg}</div>}

      {import.meta.env.DEV && (
        <div className="dev-badge">🛠 DEV-MODUS: GPS-Sperre übersprungen</div>
      )}

      <div className="distance-box">
        {distance !== null ? (
          <div className="distance-box-main">
            <DirectionCompass userLocation={userLocation} target={currentStation.target} />
            <div className="distance-box-text">
              <p>Entfernung zum Ziel: <strong className="distance-value">{distance} Meter</strong></p>
              <button
                className="btn-map-toggle"
                onClick={() => setShowMap((prev) => !prev)}
                aria-expanded={showMap}
              >
                <InkFoldedMap size={16} /> {showMap ? 'Karte ausblenden' : 'Karte anzeigen'}
              </button>
            </div>
          </div>
        ) : (
          <p>Suche GPS-Signal...</p>
        )}
      </div>

      {showMap && (
        <div ref={mapRef}>
          <StationMap
            target={currentStation.target}
            title={currentStation.title}
            userLocation={userLocation}
          />
        </div>
      )}

      <section className="expedition-instrument-section" aria-label="Orientierung">
        <button
          type="button"
          className={`brass-toggle-btn ${showCompass ? 'is-active' : ''}`}
          onClick={() => setShowCompass((prev) => !prev)}
          aria-expanded={showCompass}
          aria-controls="compass-drawer"
        >
          <span className="brass-toggle-icon" aria-hidden="true"><InkCompass size={16} /></span>
          <span>{showCompass ? 'Kompass einklappen' : 'Historischen Kompass ausklappen'}</span>
        </button>

        {showCompass && (
          <div id="compass-drawer" className="compass-drawer-content">
            <CompassView userLocation={userLocation} target={currentStation.target} />
          </div>
        )}
      </section>

      {isUnlocked ? (
        <div className="unlocked-content animate-unlock">
          <h3><InkMapPin size={20} /> Ziel erreicht!</h3>

          {needsScratch && !inscriptionRevealed ? (
            <ScratchReveal
              revealText={currentStation.scratch.revealText}
              threshold={currentStation.scratch.threshold}
              prompt={currentStation.scratch.prompt}
              onReveal={() => setInscriptionRevealed(true)}
            />
          ) : (
          <>
          {needsScratch && (
            <div className="scratch-inscription scratch-inscription--plate">
              <span>{currentStation.scratch.revealText}</span>
            </div>
          )}
          <p className="riddle-question">{currentStation.riddle.question}</p>

          {showSuccess ? (
            <div className="success-section">
              <div className="station-stamp">
                <StampStamp
                  stamp={STAMP_TYPES.STATION_COMPLETED}
                  seed={`station-${currentStation.id}`}
                  isNew
                />
              </div>
              <p className="success-message"><InkBurst size={18} /> {currentStation.riddle.successMessage}</p>
              {goodieMilestones[currentStation.id] && (
                <div className="goodie-banner">
                  <p><InkChest size={22} /> {goodieMilestones[currentStation.id]} Du findest es
                  ab sofort weiter unten in deiner Goodie-Übersicht.</p>
                </div>
              )}
              <button className="btn-next" onClick={goToNextStation}>
                Zur nächsten Station
              </button>
            </div>
          ) : (
            <div className="riddle-form">
              <input 
                type="text" 
                placeholder="Deine Lösung..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              />
              <button className="btn-submit" onClick={handleAnswerSubmit}>
                Lösung prüfen
              </button>
              {feedbackMsg && <p className="error-text">{feedbackMsg}</p>}
            </div>
          )}
          </>
          )}
        </div>
      ) : (
        <div className="locked-content">
          <p className="locked-title"><InkLock size={18} /> <strong>Aufgabe gesperrt.</strong> Finde den Zielort!</p>
          
          <div className="qr-fallback-section">
            <p className="qr-hint">
              Falls sich dein Standort nicht aktualisieren lässt, mach stattdessen
              ein Foto vom Zielort als Nachweis, dass du hier bist.
            </p>
            <button className="btn-scan" onClick={() => setIsCapturingPhoto(!isCapturingPhoto)}>
              {isCapturingPhoto ? "Kamera schließen" : "Foto aufnehmen"}
            </button>
            {isCapturingPhoto && (
              <PhotoProofCapture
                onCapture={handlePhotoCaptured}
                onCancel={() => setIsCapturingPhoto(false)}
              />
            )}
          </div>
        </div>
      )}

      <GoodieTracker completedCount={completedCount} />
      <ExplorerLogbook completedCount={completedCount} />

      <div className="game-footer">
        <button className="btn-reset-subtle" onClick={resetGame}>Tour neu starten</button>
      </div>
    </div>
  );
}