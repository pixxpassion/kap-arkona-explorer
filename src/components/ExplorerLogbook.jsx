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

import { useRef, useState } from 'react';
import { InkBook, InkLock } from './icons/AntiqueIcons';
import { logbookEntries } from '../data/logbookEntries';
import { MILESTONE_STAMPS, STAMP_TYPES } from '../data/stamps';
import LandmarkSketch from './LandmarkSketch';
import SchillingDialogue from './SchillingDialogue';
import { StampStamp } from './logbook/StampStamp';
import { assetUrl } from '../utils/assetUrl';
import { sfx } from '../utils/sfxSynthesizer';

const MIN_SWIPE_PX = 50;

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

  // Nur freigeschaltete Einträge sind "Seiten" im Logbuch, durch die sich
  // blättern lässt.
  const unlockedEntries = logbookEntries.filter((e) => completedCount >= e.unlockAtCompleted);

  const openEntry = (id) => {
    const opening = selectedId !== id;
    setSelectedId(opening ? id : null);
    if (opening) sfx.playPaperRustle(); // aufgeschlagen = Seite umgeblättert
  };

  // Horizontales Wischen auf dem offenen Tagebuch-Eintrag blättert zur
  // vorherigen/nächsten freigeschalteten Seite (Touch-Erweiterung; über das
  // Kartenraster bleibt jeder Eintrag auch ohne Touch erreichbar).
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const flipPage = (dir) => {
    const idx = unlockedEntries.findIndex((e) => e.id === selectedId);
    const nextIdx = idx + dir;
    if (idx === -1 || nextIdx < 0 || nextIdx >= unlockedEntries.length) return;
    sfx.playPaperRustle();
    setSelectedId(unlockedEntries[nextIdx].id);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e) => {
    touchDeltaX.current = e.targetTouches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const delta = touchDeltaX.current;
    touchStartX.current = 0;
    touchDeltaX.current = 0;
    if (Math.abs(delta) < MIN_SWIPE_PX) return;
    // nach links wischen (delta < 0) = vorwärts blättern
    flipPage(delta < 0 ? 1 : -1);
  };

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
              onClick={() => openEntry(entry.id)}
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
        <div
          className="mj-logbook-journal mt-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
          {unlockedEntries.length > 1 && (
            <p className="mj-logbook-flip-hint">
              &larr; wische, um im Logbuch zu bl&auml;ttern &rarr;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
