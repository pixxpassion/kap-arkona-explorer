// src/components/ExplorerLogbook.jsx
//
// Zeigt 6 Wahrzeichen rund um Kap Arkona als Sammelraster. Gesperrte
// Einträge erscheinen als Wachssiegel, freigeschaltete zeigen eine
// Tuschezeichnung; ein Antippen öffnet den vollen Tagebucheintrag von
// Leuchtturmwärter Schilling (per SchillingDialogue, inkl.
// Schreibmaschinen-Effekt).
//
// "completedCount" kommt von GameContainer (dieselbe Zahl wie bei
// GoodieTracker) - der Logbuch-Fortschritt hängt damit am bestehenden,
// bereits in localStorage ("kapArkonaProgress") gespeicherten
// Stations-Fortschritt, statt einen zweiten, redundanten Speicher zu
// pflegen.

import { useState } from 'react';
import { InkBook, InkLock } from './icons/AntiqueIcons';
import { logbookEntries } from '../data/logbookEntries';
import LandmarkSketch from './LandmarkSketch';
import SchillingDialogue from './SchillingDialogue';
import { assetUrl } from '../utils/assetUrl';

export default function ExplorerLogbook({ completedCount = 0 }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedEntry = logbookEntries.find((e) => e.id === selectedId) || null;

  return (
    <div className="mj-logbook">
      <div className="mj-logbook-title">
        <InkBook size={19} />
        <span>Entdecker-Logbuch</span>
      </div>

      <div className="mj-logbook-grid">
        {logbookEntries.map((entry) => {
          const isUnlocked = completedCount >= entry.unlockAtCompleted;
          const isSelected = selectedId === entry.id;

          if (!isUnlocked) {
            return (
              <div key={entry.id} className="mj-logbook-card is-locked" aria-label="Noch versiegelt">
                <span className="mj-badge-wax"><InkLock size={20} /></span>
                <span className="mj-logbook-lock-label">
                  bei Etappe {entry.unlockAtCompleted} versiegelt
                </span>
              </div>
            );
          }

          return (
            <button
              key={entry.id}
              type="button"
              className={`mj-logbook-card is-unlocked ${isSelected ? 'ring-2 ring-brass' : ''}`}
              onClick={() => setSelectedId(isSelected ? null : entry.id)}
              aria-pressed={isSelected}
            >
              <LandmarkSketch id={entry.id} />
              <span className="mj-logbook-name">{entry.name}</span>
            </button>
          );
        })}
      </div>

      {selectedEntry && (
        <div className="mt-4">
          <LandmarkSketch
            id={selectedEntry.id}
            className="mx-auto mb-1"
            style={{ width: 100, height: 100 }}
          />
          <SchillingDialogue
            key={selectedEntry.id}
            text={selectedEntry.journal}
            audioSrc={selectedEntry.schillingAudio && assetUrl(selectedEntry.schillingAudio)}
            label={selectedEntry.name}
          />
        </div>
      )}
    </div>
  );
}
