// src/components/GameContainer.jsx
import { useState, useEffect, useRef } from 'react';
import { stations, goodieMilestones } from '../data/stations';
import { STAMP_TYPES } from '../data/stamps';
import { calculateDistance } from '../utils/geoUtils';
import { isAnswerCorrect } from '../utils/textUtils';
import { InkLock, InkMapPin, InkFoldedMap, InkChest, InkBurst, InkSeal } from './icons/AntiqueIcons';
import GoodieTracker from './GoodieTracker';
import StationMap from './StationMap';
import DirectionCompass from './DirectionCompass';
import SchillingDialogue from './SchillingDialogue';
import ExplorerLogbook from './ExplorerLogbook';
import PhotoProofCapture from './PhotoProofCapture';
import ScratchReveal from './puzzles/ScratchReveal';
import CertificateModal from './CertificateModal';
import LightStationView from './LightStationView';
import ExplorerPinProgress from './ExplorerPinProgress';
import { StampStamp } from './logbook/StampStamp';
import { sfx } from '../utils/sfxSynthesizer';
import { GAME_MODES } from '../utils/gameMode';
import { assetUrl } from '../utils/assetUrl';
// Hinweis: CompassView (großer Messing-Kompass) ist bewusst NICHT mehr
// eingebunden - die Komponente + compass-view.css bleiben im Repo, werden
// aber nicht mehr auf dem Hauptscreen gerendert. Der kleine Wegweiser
// (DirectionCompass in der Distanz-Box) bleibt.

// GPS-Testmodus: nur in der passwortgeschützten Testserver-Build (bzw. im
// Dev-Server) verfügbar - erlaubt Tester:innen, alle Stationen ohne
// Vor-Ort-Besuch durchzuklicken (v.a. für den Foto-Safari-Modus). In der
// öffentlichen Live-Build ist VITE_ACCESS_PASSWORD leer, der ganze Block
// fällt beim Bundling weg.
const TEST_MODE_AVAILABLE =
  import.meta.env.DEV || Boolean(import.meta.env.VITE_ACCESS_PASSWORD);
const TEST_MODE_KEY = 'kapArkonaTestMode';

export default function GameContainer({ gameMode }) {
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
  const [testModeOn, setTestModeOn] = useState(
    () => TEST_MODE_AVAILABLE && localStorage.getItem(TEST_MODE_KEY) === 'true'
  );

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
  // Chronisten-Urkunde: öffnet sich nach dem Finale einmal automatisch
  // (certificateShownRef verhindert erneutes Aufpoppen bei jedem Re-Render)
  // und lässt sich über die Finale-Schaltfläche wieder aufrufen.
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateShownRef = useRef(false);
  const mapRef = useRef(null);
  // Damit die Ankunfts-Glocke pro Station nur einmal läutet (GPS kann am
  // Radius-Rand kurz hin- und herspringen). Wird bei Stations-Wechsel
  // zurückgesetzt.
  const arrivedRef = useRef(false);
  // Merkt sich, ob die aktuelle Station per Foto-Nachweis freigeschaltet
  // wurde (statt per GPS) - die weiterhin im Hintergrund laufende
  // GPS-Überwachung (Punkt 3) würde eine solche manuelle Freischaltung
  // sonst beim nächsten Standort-Update wieder zurücksetzen, sobald sie
  // "zu weit weg" meldet (genau der Fall, für den der Foto-Nachweis ja
  // gedacht ist). Wird bei Stations-Wechsel automatisch zurückgesetzt, da
  // die GPS-Überwachung dann für die neue Station neu aufgesetzt wird.
  const manuallyUnlockedRef = useRef(false);

  // Spielmodus (von App.jsx durchgereicht, Quelle: gameMode.js). Im
  // Light-Modus ("Foto-Safari") entfallen Rätsel/ScratchReveal,
  // Goodie-Etappen, Logbuch-Sammlung und die Chronisten-Urkunde -
  // stattdessen LightStationView + ExplorerPinProgress.
  const isLight = gameMode === GAME_MODES.LIGHT;

  const currentStation = stations[currentStationIndex];
  const needsScratch = !isLight && currentStation?.type === 'scratch_reveal';
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

  useEffect(() => {
    if (!TEST_MODE_AVAILABLE) return;
    try { localStorage.setItem(TEST_MODE_KEY, String(testModeOn)); } catch { /* ignore */ }
  }, [testModeOn]);

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
        // (npm run build) entfernt Vite diesen Zweig automatisch wieder.
        // testModeOn kommt nur in der Testserver-/Dev-Build zum Tragen (per
        // Testmodus-Schalter umschaltbar), damit Tester:innen ohne Vor-Ort-
        // Besuch alle Stationen durchklicken können. Ohne all das schaltet
        // man eine Station über den Foto-Nachweis frei ("locked-content").
        if (dist <= currentStation.radius || import.meta.env.DEV || testModeOn) {
          setIsUnlocked(true);
        } else if (!manuallyUnlockedRef.current) {
          setIsUnlocked(false);
        }
      },
      () => {
        setErrorMsg('Bitte erlaube den GPS-Zugriff in deinem Browser.');
        if (import.meta.env.DEV || testModeOn) setIsUnlocked(true);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentStation, testModeOn]);

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
      sfx.playLatch();
      if ([5, 10, 15].includes(currentStation.id)) {
        setTimeout(() => sfx.playBell(), 350);
      }
    } else {
      setFeedbackMsg('Das ist leider nicht ganz richtig. Versuch es noch einmal!');
    }
  };

  const goToNextStation = () => {
    manuallyUnlockedRef.current = false;
    arrivedRef.current = false;
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
      arrivedRef.current = false;
      certificateShownRef.current = false;
      localStorage.removeItem('kapArkonaProgress');
      setCurrentStationIndex(0);
      setIsUnlocked(false);
      setShowSuccess(false);
      setUserAnswer('');
      setFeedbackMsg('');
      setInscriptionRevealed(false);
      setShowCertificate(false);
    }
  };

  // Scrollt zur frisch eingeblendeten Karte, sobald sie per Kartensymbol
  // geöffnet wird - sie steht erst ab diesem Zeitpunkt im Layout.
  useEffect(() => {
    if (showMap) mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [showMap]);

  // Schiffsglocke, sobald die Station betreten (GPS-Radius) bzw. per
  // Foto-Nachweis freigeschaltet wird - einmal pro Station (arrivedRef).
  useEffect(() => {
    // Im Light-Modus punktieren playPaperRustle (Foto) + playBell
    // (Verzeichnen) den Ablauf - eine zusätzliche Ankunfts-Glocke wäre zu viel.
    if (isUnlocked && !arrivedRef.current && !isLight) {
      arrivedRef.current = true;
      sfx.playBell();
    }
  }, [isUnlocked, isLight]);

  // Nach dem Finale die Chronisten-Urkunde einmal automatisch öffnen. Der
  // Übergang ins Finale erfolgt per Button-Klick ("Zur nächsten Station" an
  // Station 15), also liegt für Glocke + Vibration im Modal eine frische
  // Nutzer-Geste vor.
  useEffect(() => {
    if (currentStationIndex >= stations.length && !certificateShownRef.current && !isLight) {
      certificateShownRef.current = true;
      setShowCertificate(true);
    }
  }, [currentStationIndex, isLight]);

  // --- 5. FINALE ANSICHT ---
  if (currentStationIndex >= stations.length) {
    if (isLight) {
      return (
        <div className="game-container finale">
          <h2 className="finale-title"><InkBurst size={26} /> Foto-Safari geschafft!</h2>
          <p>Du hast alle {stations.length} Stationen am Kap Arkona besucht und fotografiert.</p>
          <ExplorerPinProgress completedCount={completedCount} />
          <button className="btn-reset" onClick={resetGame}>Foto-Safari neu starten</button>
        </div>
      );
    }
    return (
      <div className="game-container finale">
        <h2 className="finale-title"><InkBurst size={26} /> Glückwunsch, Entdecker!</h2>
        <p>Du hast alle 15 Stationen gefunden, alle Rätsel gelöst und das Finale gemeistert!</p>
        <p>Hol dir jetzt deine physische <strong>Entdecker-Wandernadel</strong> und deine Goodies ab - in der <strong>Tourist-Info am Großparkplatz</strong> oder in der <strong>Tourist-Info & Shop bei den Türmen</strong>.</p>
        <button className="btn-scan btn-certificate" onClick={() => setShowCertificate(true)}>
          <InkSeal size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }} />
          Deine Chronisten-Urkunde ansehen
        </button>
        <GoodieTracker completedCount={completedCount} />
        <ExplorerLogbook completedCount={completedCount} />
        <button className="btn-reset" onClick={resetGame}>Spiel für neuen Durchlauf zurücksetzen</button>
        {showCertificate && (
          <CertificateModal
            completedCount={completedCount}
            onClose={() => setShowCertificate(false)}
          />
        )}
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

      {!isLight && errorMsg && <div className="error-box">{errorMsg}</div>}

      {import.meta.env.DEV && (
        <div className="dev-badge">🛠 DEV-MODUS: GPS-Sperre übersprungen</div>
      )}

      {TEST_MODE_AVAILABLE && !import.meta.env.DEV && (
        <button
          type="button"
          className={`test-mode-badge ${testModeOn ? 'is-on' : ''}`}
          onClick={() => setTestModeOn((prev) => !prev)}
          aria-pressed={testModeOn}
        >
          <InkLock size={14} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
          Testmodus {testModeOn ? 'AN' : 'AUS'} · GPS-Sperre {testModeOn ? 'umgangen' : 'aktiv'}
        </button>
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

      {isLight ? (
        <LightStationView
          station={currentStation}
          inRange={isUnlocked}
          gpsUnavailable={Boolean(errorMsg)}
          onComplete={goToNextStation}
        />
      ) : isUnlocked ? (
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

      {isLight ? (
        <ExplorerPinProgress completedCount={completedCount} />
      ) : (
        <>
          <GoodieTracker completedCount={completedCount} />
          <ExplorerLogbook completedCount={completedCount} />
        </>
      )}

      <div className="game-footer">
        <button className="btn-reset-subtle" onClick={resetGame}>
          {isLight ? 'Foto-Safari neu starten' : 'Tour neu starten'}
        </button>
      </div>
    </div>
  );
}