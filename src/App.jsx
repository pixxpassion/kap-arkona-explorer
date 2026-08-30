import { useState } from 'react';
import { InfoIcon } from './components/icons/UiIcons';
import GameContainer from './components/GameContainer';
import OnboardingModal from './components/OnboardingModal';
import LegalModal from './components/LegalModal';
import DesktopNotice from './components/DesktopNotice';
import PasswordGate from './components/PasswordGate';
import { isMobileDevice } from './utils/deviceUtils';
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
          <button
            className="header-info-btn"
            onClick={() => setShowOnboarding(true)}
            aria-label="Wie funktioniert's?"
          >
            <InfoIcon size={20} />
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
        <GameContainer />
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

      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}
      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </div>
    </PasswordGate>
  );
}

export default App;
