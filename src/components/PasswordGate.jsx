// src/components/PasswordGate.jsx
//
// Einfache Zugangssperre NUR für die separate Test-Deployment-Build (siehe
// .env.testserver, VITE_ACCESS_PASSWORD). Im normalen "npm run build" für
// die echte Seite ist diese Variable leer, dann rendert diese Komponente
// direkt ihre Kinder ohne jede Abfrage.
//
// Wichtig: Das ist KEIN echter Schutz gegen technisch versierte Personen -
// das Passwort steckt im ausgelieferten JS-Bundle und lässt sich mit den
// Browser-Devtools auslesen. Zweck ist ausschließlich, dass der Testlink
// nicht von zufälligen Besucher:innen direkt gefunden/geöffnet wird.

import { useState } from 'react';

const ACCESS_KEY = 'kapArkonaTestAccess';
const TEST_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD || '';

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => !TEST_PASSWORD || localStorage.getItem(ACCESS_KEY) === 'true'
  );
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (!TEST_PASSWORD || unlocked) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === TEST_PASSWORD) {
      localStorage.setItem(ACCESS_KEY, 'true');
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="password-gate">
      <div className="password-gate-box">
        <h1>Kap Arkona Entdecker</h1>
        <p className="password-gate-hint">Test-Version - nicht öffentlich</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Zugangscode"
            autoFocus
          />
          <button type="submit">Weiter</button>
        </form>
        {error && <p className="password-gate-error">Falscher Zugangscode.</p>}
      </div>
    </div>
  );
}
