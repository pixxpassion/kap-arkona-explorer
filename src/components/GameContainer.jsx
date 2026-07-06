// src/components/GameContainer.jsx
import { useState, useEffect, useRef } from 'react';
import { stations, goodieMilestones } from '../data/stations';
import { calculateDistance } from '../utils/geoUtils';
import { isAnswerCorrect } from '../utils/textUtils';
import { assetUrl } from '../utils/assetUrl';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Lock, MapPin, Gift, PartyPopper } from 'lucide-react';
import GoodieTracker from './GoodieTracker';
import StationMap from './StationMap';

export default function GameContainer() {
  // --- 1. STATE-VERWALTUNG ---
  const [currentStationIndex, setCurrentStationIndex] = useState(() => {
    const savedIndex = localStorage.getItem('kapArkonaProgress');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  }); 
  
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [highlightMap, setHighlightMap] = useState(false);
  const mapRef = useRef(null);

  const currentStation = stations[currentStationIndex];
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
    if (!currentStation) return; 

    if (!navigator.geolocation) {
      setErrorMsg('GPS wird von deinem Browser nicht unterstützt.');
      return;
    }

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
        if (dist <= currentStation.radius || import.meta.env.DEV) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      },
      (error) => {
        setErrorMsg('Bitte erlaube den GPS-Zugriff in deinem Browser.');
        if (import.meta.env.DEV) setIsUnlocked(true);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentStation]);

  // --- 4. HILFS-FUNKTIONEN ---
  const handleQrScan = (result) => {
    if (result) {
      if (result[0].rawValue === currentStation.qrFallback) {
        setIsUnlocked(true);
        setIsScanning(false);
        setErrorMsg('');
      } else {
        setErrorMsg('Das scheint der falsche QR-Code zu sein. Bist du an der richtigen Station?');
      }
    }
  };

  const handleAnswerSubmit = () => {
    if (isAnswerCorrect(userAnswer, currentStation.riddle.answer)) {
      setShowSuccess(true);
      setFeedbackMsg('');
    } else {
      setFeedbackMsg('Das ist leider nicht ganz richtig. Versuch es noch einmal!');
    }
  };

  const goToNextStation = () => {
    setShowSuccess(false);
    setUserAnswer('');
    setFeedbackMsg('');
    setIsUnlocked(false);
    setCurrentStationIndex(prev => prev + 1);
  };

  const resetGame = () => {
    if (window.confirm("Möchtest du das Spiel wirklich komplett von vorn beginnen?")) {
      localStorage.removeItem('kapArkonaProgress');
      setCurrentStationIndex(0);
      setIsUnlocked(false);
      setShowSuccess(false);
      setUserAnswer('');
      setFeedbackMsg('');
    }
  };

  // Scrollt zur eingebetteten lokalen Karte (map.kap-arkona.de) statt zu
  // einer externen Karten-App zu verlinken.
  const showSpotOnMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightMap(true);
    setTimeout(() => setHighlightMap(false), 1500);
  };

  // --- 5. FINALE ANSICHT ---
  if (currentStationIndex >= stations.length) {
    return (
      <div className="game-container finale">
        <h2 className="finale-title"><PartyPopper size={28} /> Glückwunsch, Entdecker!</h2>
        <p>Du hast alle 15 Stationen gefunden, alle Rätsel gelöst und das Finale gemeistert!</p>
        <p>Hol dir jetzt deine physische <strong>Explorer Wandernadel</strong> und deine Goodies ab - in der <strong>Tourist-Info am Großparkplatz</strong> oder in der <strong>Tourist-Info & Shop bei den Türmen</strong>.</p>
        <GoodieTracker completedCount={completedCount} />
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

      {currentStation.schillingText && (
        <div className="schilling-companion">
          <img
            src={assetUrl('leuchtturmwaerter-lantern.png')}
            alt="Leuchtturmwärter Schilling"
            className="schilling-avatar"
          />
          <div className="schilling-bubble">
            <p>{currentStation.schillingText}</p>
          </div>
        </div>
      )}

      <p className="station-description">{currentStation.description}</p>

      {errorMsg && <div className="error-box">{errorMsg}</div>}

      {import.meta.env.DEV && (
        <div className="dev-badge">🛠 DEV-MODUS: GPS-Sperre übersprungen</div>
      )}

      <div ref={mapRef} className={highlightMap ? 'map-highlight' : ''}>
        <StationMap
          target={currentStation.target}
          title={currentStation.title}
          userLocation={userLocation}
        />
      </div>

      <div className="distance-box">
        {distance !== null ? (
          <>
            <p>Entfernung zum Ziel: <strong className="distance-value">{distance} Meter</strong></p>
            {/* NEU: Der Karten-Navigations-Button */}
            <button className="btn-map" onClick={showSpotOnMap}>
              <MapPin size={18} /> Spot auf Karte anzeigen
            </button>
          </>
        ) : (
          <p>Suche GPS-Signal...</p>
        )}
      </div>

      {isUnlocked ? (
        <div className="unlocked-content animate-unlock">
          <h3>📍 Ziel erreicht!</h3>
          <p className="riddle-question">{currentStation.riddle.question}</p>
          
          {showSuccess ? (
            <div className="success-section">
              <p className="success-message">🎉 {currentStation.riddle.successMessage}</p>
              {goodieMilestones[currentStation.id] && (
                <div className="goodie-banner">
                  <p><Gift size={22} /> {goodieMilestones[currentStation.id]} Du findest es
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
        </div>
      ) : (
        <div className="locked-content">
          <p className="locked-title"><Lock size={18} /> <strong>Aufgabe gesperrt.</strong> Finde den Zielort!</p>
          
          <div className="qr-fallback-section">
            <p className="qr-hint">
              Falls sich dein Standort nicht aktualisieren lässt, scanne stattdessen
              den QR-Code, der direkt am Ort angebracht ist.
            </p>
            <button className="btn-scan" onClick={() => setIsScanning(!isScanning)}>
              {isScanning ? "Scanner abbrechen" : "QR-Code scannen"}
            </button>
            {isScanning && (
              <div className="scanner-wrapper">
                <div style={{fontSize: '0.8rem', padding: '10px', background: '#FFF3CD', color: '#856404', textAlign: 'center'}}>
                  <strong>Test-Info:</strong> Erwartet den QR-Inhalt:<br/>
                  <code style={{wordBreak: 'break-all'}}>{currentStation.qrFallback}</code>
                </div>
                <Scanner onScan={handleQrScan} onError={(error) => console.log(error)} />
              </div>
            )}
          </div>
        </div>
      )}

      <GoodieTracker completedCount={completedCount} />

      <div className="game-footer">
        <button className="btn-reset-subtle" onClick={resetGame}>Tour neu starten</button>
      </div>
    </div>
  );
}