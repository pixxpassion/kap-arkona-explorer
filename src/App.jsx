import { useState } from 'react';
import { Info } from 'lucide-react';
import GameContainer from './components/GameContainer';
import OnboardingModal from './components/OnboardingModal';
import LegalModal from './components/LegalModal';
import DesktopNotice from './components/DesktopNotice';
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
    return <DesktopNotice />;
  }

  return (
    <div className="app-layout">
      <header>
        <img src={assetUrl('leuchtturmwaerter-lantern.png')} alt="" className="header-bg" aria-hidden="true" />

        <div className="header-left">
          <button
            className="header-info-btn"
            onClick={() => setShowOnboarding(true)}
            aria-label="Wie funktioniert's?"
          >
            <Info size={20} />
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
          <div className="header-subtitle" aria-label="Explorer">
            {'EXPLORER'.split('').map((letter, i) => (
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
          className="footer-link"
          href="https://kap-arkona.de/wegweiser"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zur Kap Arkona Wegweiser-Karte
        </a>
        <button className="footer-link" onClick={() => setShowLegal(true)}>
          Impressum &amp; Datenschutz
        </button>
      </footer>

      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}
      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </div>
  );
}

export default App;
