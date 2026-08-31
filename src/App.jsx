import { useState } from 'react';
import { InkScrollAlert, InkCamera } from './components/icons/AntiqueIcons';
import GameContainer from './components/GameContainer';
import OnboardingModal from './components/OnboardingModal';
import LegalModal from './components/LegalModal';
import DesktopNotice from './components/DesktopNotice';
import PasswordGate from './components/PasswordGate';
import { isMobileDevice } from './utils/deviceUtils';
import { GAME_MODES, getInitialGameMode, setGameMode } from './utils/gameMode';
import { assetUrl } from './utils/assetUrl';
import './App.css'; // Hier kommt später unser maritimes Styling rein

// Nur auf dem Handy nutzbar (GPS/Kamera vor Ort) - im Dev-Server bleibt
// die App auch am Desktop sichtbar, damit weiter entwickelt werden kann.
const isAllowedDevice = isMobileDevice() || import.meta.env.DEV;

function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('kapArkonaOnboardingSeen')
  );
  const [showLegal, setShowLegal] = useState(false);
  // Spielmodus zentral hier halten, damit das Modus-Badge im Header und
  // GameContainer sofort auf eine Umstellung im OnboardingModal reagieren.
  const [gameMode, setGameModeState] = useState(getInitialGameMode);

  const changeMode = (next) => {
    setGameModeState(next);
    setGameMode(next); // in localStorage sichern (gameMode.js)
  };

  const isLightMode = gameMode === GAME_MODES.LIGHT;

  const closeOnboarding = () => {
    localStorage.setItem('kapArkonaOnboardingSeen', 'true');
    setShowOnboarding(false);
  };

  if (!isAllowedDevice) {
    return (
      <PasswordGate>
        <DesktopNotice />
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <div className="app-layout">
        <header>
        <img src={assetUrl('leuchtturmwaerter-lantern.webp')} alt="" className="header-bg" aria-hidden="true" />

        <div className="header-left">
          {/* Messing-Badge statt "i": zeigt den aktiven Spielmodus (ein
              Erzählungs-Begriff, daher Messing trotz Marken-Header) und
              öffnet beim Antippen die Anleitung inkl. Moduswechsel. */}
          <button
            type="button"
            className="header-mode-badge"
            onClick={() => setShowOnboarding(true)}
            aria-label={
              `Spielmodus: ${isLightMode ? 'Foto-Safari' : 'Rätsel-Expedition'}`
              + ' – antippen für Anleitung und Moduswechsel'
            }
          >
            {isLightMode ? <InkCamera size={14} /> : <InkScrollAlert size={14} />}
            <span>{isLightMode ? 'Foto-Safari' : 'Rätsel-Tour'}</span>
          </button>
          <a
            href="https://kap-arkona.de"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zu kap-arkona.de"
          >
            <img src={assetUrl('icon-192.png.png')} alt="Kap Arkona" className="header-logo" />
          </a>
        </div>

        <div className="header-title">
          <h1>Kap Arkona</h1>
          <div className="header-subtitle" aria-label="Entdecker">
            {'ENTDECKER'.split('').map((letter, i) => (
              <span key={i}>{letter}</span>
            ))}
          </div>
        </div>
      </header>
      <main>
        <GameContainer gameMode={gameMode} />
      </main>
      <footer className="app-footer">
        <a
          className="footer-link footer-link-primary"
          href="https://kap-arkona.de/wegweiser"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zum Kap Arkona Wegweiser
        </a>
        <button className="footer-link" onClick={() => setShowLegal(true)}>
          Impressum &amp; Datenschutz
        </button>
      </footer>

      {showOnboarding && (
        <OnboardingModal
          mode={gameMode}
          onSelectMode={changeMode}
          onClose={closeOnboarding}
        />
      )}
      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </div>
    </PasswordGate>
  );
}

export default App;
