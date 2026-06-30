// src/components/GameContainer.jsx
import { useState, useEffect } from 'react';
import { stations } from '../data/stations';
import { calculateDistance } from '../utils/geoUtils';
import { Scanner } from '@yudiel/react-qr-scanner'; 

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

  const currentStation = stations[currentStationIndex];

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

        if (dist <= currentStation.radius) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false); 
        }
      },
      (error) => {
        setErrorMsg('Bitte erlaube den GPS-Zugriff in deinem Browser.');
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
    const correctAnswer = currentStation.riddle.answer.toLowerCase().trim();
    const providedAnswer = userAnswer.toLowerCase().trim();

    if (providedAnswer === correctAnswer) {
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

  // NEU: Funktion um die native Karten-App zu öffnen
  const openNavigation = () => {
    const { latitude, longitude } = currentStation.target;
    // Dieser Link funktioniert universell auf Android und iOS und öffnet die jeweilige Karten-App
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };

  // --- 5. FINALE ANSICHT ---
  if (currentStationIndex >= stations.length) {
    return (
      <div className="game-container finale">
        <h2>🎉 Glückwunsch, Entdecker!</h2>
        <p>Du hast alle Orte gefunden, alle Rätsel gelöst und das Finale gemeistert!</p>
        <p>Hol dir jetzt deine physische <strong>Explorer Wandernadel</strong> ab.</p>
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

      <p className="station-description">{currentStation.description}</p>

      {errorMsg && <div className="error-box">{errorMsg}</div>}

      <div className="distance-box">
        {distance !== null ? (
          <>
            <p>Entfernung zum Ziel: <strong className="distance-value">{distance} Meter</strong></p>
            {/* NEU: Der Karten-Navigations-Button */}
            <button className="btn-map" onClick={openNavigation}>
              🗺️ Spot auf Karte anzeigen
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
          <p>🔒 <strong>Aufgabe gesperrt.</strong> Finde den Zielort!</p>
          
          <div className="qr-fallback-section">
            <button className="btn-scan" onClick={() => setIsScanning(!isScanning)}>
              {isScanning ? "Scanner abbrechen" : "SummitLynx QR-Code scannen"}
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

      <div className="game-footer">
        <button className="btn-reset-subtle" onClick={resetGame}>Tour neu starten</button>
      </div>
    </div>
  );
}