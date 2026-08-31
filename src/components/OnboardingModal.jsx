// src/components/OnboardingModal.jsx
import {
  InkMapPin, InkCamera, InkChest, InkScrollAlert, InkLoop, InkCompass, InkFoldedMap, InkCheck,
} from './icons/AntiqueIcons';
import Modal from './Modal';
import { clearAppCache } from '../utils/cacheUtils';
import { assetUrl } from '../utils/assetUrl';
import { GAME_MODES } from '../utils/gameMode';
import { sfx } from '../utils/sfxSynthesizer';

// mode + onSelectMode kommen von App.jsx (dort zentral gehalten, damit das
// Header-Badge sofort mitzieht).
export default function OnboardingModal({ onClose, mode, onSelectMode }) {
  const selectMode = (next) => {
    if (next === mode) return;
    onSelectMode(next);
    sfx.playLatch(); // mechanisches Einrasten beim Modus-Wechsel
  };

  return (
    <Modal
      title={
        <>
          <InkCompass size={20} style={{ verticalAlign: '-4px', marginRight: '6px' }} />
          Kap Arkona Entdecker
        </>
      }
      onClose={onClose}
      closeLabel="Erklärung schließen"
      bodyBg={assetUrl('leuchtturmwaerter-lantern.webp')}
    >
      <img
        src={assetUrl('schilling-wordmark-schwarz.png')}
        alt="Leuchtturmwärter Schilling"
        className="schilling-wordmark"
      />

      <p>
        Willkommen an Bord! Auf dieser Tour erkundest du <strong>15 Stationen</strong> rund
        um das Kap Arkona
        {mode === GAME_MODES.LIGHT
          ? ' und machst an jeder ein Foto vom Zielort.'
          : ' und löst an jeder Station ein kleines Rätsel.'}
      </p>

      <div className="mode-select">
        <h3><InkCompass size={18} style={{ verticalAlign: '-3px' }} /> Wähle deinen Weg</h3>
        <div className="mode-select-grid">
          <button
            type="button"
            className={`mode-card ${mode === GAME_MODES.HISTORIAN ? 'is-active' : ''}`}
            onClick={() => selectMode(GAME_MODES.HISTORIAN)}
            aria-pressed={mode === GAME_MODES.HISTORIAN}
          >
            <span className="mode-card-head">
              <InkScrollAlert size={20} />
              <span className="mode-card-title">Rätsel-Expedition</span>
              {mode === GAME_MODES.HISTORIAN && (
                <span className="mode-card-check" aria-hidden="true"><InkCheck size={13} /></span>
              )}
            </span>
            <span className="mode-card-tagline">für Tüftler &amp; Geschichtsfreunde</span>
            <span className="mode-card-desc">
              Rätsel &amp; Freikratz-Inschriften · alle Goodie-Etappen · Dialoge mit
              Leuchtturmwärter Schilling
            </span>
          </button>

          <button
            type="button"
            className={`mode-card ${mode === GAME_MODES.LIGHT ? 'is-active' : ''}`}
            onClick={() => selectMode(GAME_MODES.LIGHT)}
            aria-pressed={mode === GAME_MODES.LIGHT}
          >
            <span className="mode-card-head">
              <InkCamera size={20} />
              <span className="mode-card-title">Foto-Safari</span>
              {mode === GAME_MODES.LIGHT && (
                <span className="mode-card-check" aria-hidden="true"><InkCheck size={13} /></span>
              )}
            </span>
            <span className="mode-card-tagline">entspannt &amp; schnell vor Ort</span>
            <span className="mode-card-desc">
              GPS-Freischaltung · Foto an jeder Station · zum Abschluss die
              Entdecker-Wandernadel
            </span>
          </button>
        </div>
        <span className="mode-select-note">
          Umstellen kannst du jederzeit hier – auch mitten in der Tour.
        </span>
      </div>

      <h3><InkMapPin size={18} style={{ verticalAlign: '-3px' }} /> So findest du eine Station</h3>
      <p>
        Deine Entfernung zum Ziel wird per GPS angezeigt. Sobald du nah genug dran bist,
        schaltet sich die Station automatisch frei.
      </p>

      <h3><InkCamera size={18} style={{ verticalAlign: '-3px' }} /> Kein GPS-Signal?</h3>
      <p>
        Kein Problem: Mach stattdessen einfach ein Foto vom Zielort als Nachweis, dass du hier bist.
      </p>

      {mode === GAME_MODES.LIGHT ? (
        <>
          <h3><InkChest size={18} style={{ verticalAlign: '-3px' }} /> Deine Belohnung</h3>
          <p>
            Am Ende aller 15 Stationen wartet die physische
            {' '}<strong>Entdecker-Wandernadel</strong> auf dich. Zeig deinen Foto-Fortschritt
            dem Personal in der Tourist-Info am Großparkplatz oder in der Tourist-Info
            &amp; Shop bei den Türmen.
          </p>
        </>
      ) : (
        <>
          <h3><InkChest size={18} style={{ verticalAlign: '-3px' }} /> Goodies unterwegs</h3>
          <p>
            Bei 5, 10 und 15 gelösten Stationen wartet jeweils ein Goodie auf dich. Zeig deinen
            Fortschritt einfach dem Personal in der Tourist-Info am Großparkplatz oder in der
            Tourist-Info &amp; Shop bei den Türmen - dort wird die Einlösung direkt auf deinem
            Handy bestätigt. Am Ende aller 15 Stationen gibt es zusätzlich die physische
            Entdecker-Wandernadel.
          </p>
        </>
      )}

      <div className="wegweiser-box">
        <h3><InkFoldedMap size={18} style={{ verticalAlign: '-3px' }} /> Dein Begleiter: der Wegweiser</h3>
        <p>
          Der Entdecker schickt dich auf eine spielerische Entdeckungstour durchs Kap Arkona,
          Vitt und Putgarten. Für alles rund um deinen Aufenthalt gibt es den <strong>Kap Arkona
          Wegweiser</strong>: Karte mit allen wichtigen Orten, Wegzeiten zwischen den drei Orten,
          Antworten auf häufige Fragen und ein Chatbot für alles Weitere - schnell zur Hand,
          direkt auf deinem Handy.
        </p>
        <a
          href="https://kap-arkona.de/wegweiser"
          target="_blank"
          rel="noopener noreferrer"
          className="wegweiser-link"
        >
          <InkFoldedMap size={16} /> Zum Wegweiser
        </a>
      </div>

      <div className="modal-disclaimer">
        <InkScrollAlert size={16} style={{ verticalAlign: '-3px', marginRight: '4px' }} />
        Hinweis: Dies ist ein Unterhaltungsspiel. Aus der Teilnahme, dem Erreichen von
        Etappen oder Goodies entsteht kein Rechtsanspruch auf Sachleistungen oder
        sonstige Vergünstigungen.
      </div>

      <button className="btn-next" onClick={onClose}>Los geht's!</button>

      <div className="cache-clear-hint">
        <p>Seite verhält sich merkwürdig oder zeigt eine alte Version?</p>
        <button className="btn-reset-subtle" onClick={clearAppCache}>
          <InkLoop size={14} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
          App-Cache leeren & neu laden
        </button>
      </div>
    </Modal>
  );
}
