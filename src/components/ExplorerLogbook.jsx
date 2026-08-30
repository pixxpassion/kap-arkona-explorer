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
//
// Stempel & Alterung (src/data/stamps.js, src/theme/logbook-aging.css):
//   - data-aging-level 0..2 vergilbt das Logbuch mit steigendem Fortschritt
//     (0-4 / 5-9 / 10-15 Stationen).
//   - Jede freigeschaltete Sammelkarte trägt einen kleinen Eck-Stempel
//     "Station erreicht" (compact).
//   - Bei 5/10/15 Stationen wird zusätzlich je ein Meilenstein-Stempel über
//     das Logbuch "gedrückt" (stamp-layer). Der frisch erreichte Stempel
//     (isNew) läuft mit Andruck-Animation + Haptik ein.
// Die Stempel sind rein dekorativ (die stamp-layer ist aria-hidden) - die
// Etappen-Info wird bereits vom GoodieTracker und den Erfolgsmeldungen
// angesagt.

import { useState } from 'react';
import { InkBook, InkLock } from './icons/AntiqueIcons';
import { logbookEntries } from '../data/logbookEntries';
import { MILESTONE_STAMPS, STAMP_TYPES } from '../data/stamps';
import LandmarkSketch from './LandmarkSketch';
import SchillingDialogue from './SchillingDialogue';
import { StampStamp } from './logbook/StampStamp';
import { assetUrl } from '../utils/assetUrl';

function agingLevelFor(completedCount) {
  if (completedCount >= 10) return 2;
  if (completedCount >= 5) return 1;
  return 0;
}

export default function ExplorerLogbook({ completedCount = 0 }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedEntry = logbookEntries.find((e) => e.id === selectedId) || null;

  const agingLevel = agingLevelFor(completedCount);
  const reachedMilestones = MILESTONE_STAMPS.filter((m) => completedCount >= m.atCompleted);

  return (
    <div className="mj-logbook" data-aging-level={agingLevel}>
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
              <StampStamp stamp={STAMP_TYPES.STATION_COMPLETED} seed={`landmark-${entry.id}`} compact />
            </button>
          );
        })}
      </div>

      {reachedMilestones.length > 0 && (
        <div className="stamp-layer" aria-hidden="true">
          {reachedMilestones.map((milestone, i) => (
            <div key={milestone.type.id} className={`stamp-slot stamp-slot-${i + 1}`}>
              <StampStamp
                stamp={milestone.type}
                /* Nur der gerade erreichte Meilenstein (completedCount genau
                   auf der Schwelle) läuft animiert + haptisch ein. */
                isNew={milestone.atCompleted === completedCount}
              />
            </div>
          ))}
        </div>
      )}

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
