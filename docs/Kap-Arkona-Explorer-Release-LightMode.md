---
title: Explorer Light – Foto-Safari-Spielmodus
date: 2026-08-31
tags:
  - projekt/kap-arkona
  - devlog
  - feature
  - gamemode
status: live
url: https://pixxpassion.github.io/kap-arkona-explorer/
---

# Kap Arkona Entdecker – Zwei Spielmodi

Neuer, wählbarer Spielmodus **„Foto-Safari" (Light)** neben der bisherigen
**„Rätsel-Expedition" (Historian)**. In zwei Schritten umgesetzt (`4cb30f4`,
`0ee8537`), beide auf `main`, CI + GitHub-Pages-Deploy je grün.

- **CI #30 grün** · **Deploy to GitHub Pages #12 live**
- **127 Vitest-Tests grün** (121 → +6 für `gameMode.js`)
- `npm run lint` sauber · `npm run build` grün

---

## Schritt 1: Modus-Auswahl + Speichern (`4cb30f4`)

### `src/utils/gameMode.js` (neu)
- `GAME_MODES = { HISTORIAN: 'historian', LIGHT: 'light' }`
- `getInitialGameMode()` – Reihenfolge: `?mode=`-Query → localStorage
  (`kapArkonaGameMode`) → Standard (`historian`). Der Query-Parameter
  gewinnt pro Aufruf (praktisch für Test-Links).
- `getGameMode()` – nur die gemerkte Wahl (für die Gameplay-Auswertung).
- `setGameMode(mode)` – validiert, schreibt in localStorage.
- node-sicher (Guards + try/catch für `window` / `localStorage`).
- **+6 Vitest-Tests** (`gameMode.test.js`).

### Auswahl-UI: im `OnboardingModal` (nicht als eigener Startscreen)
- Abschnitt „Wähle deinen Weg" mit zwei `<button aria-pressed>`-Karten:
  **Rätsel-Expedition** (`InkScrollAlert`) und **Foto-Safari** (`InkCamera`).
- Beim Umschalten: `sfx.playLatch()` + `setGameMode()`.
- Aktive Karte: Messing-Rahmen, `InkCheck`-Badge.
- `src/theme/game-mode.css` (in `index.css`) – nur `@theme`-Tokens,
  keine Emojis, kein roher Hex.

### Abweichungen von der Vorlage
- Kein `src/components/StartScreen.jsx`, kein `src/styles/`.
- Emojis → `Ink`-Strich-Icons (taste-Regel).
- `import { playLatch } from '../utils/sfx'` → `sfx.playLatch()` aus
  `sfxSynthesizer` (`sfx.js` existiert nicht mehr).
- Klickbares `<div>` → `<button>`.

---

## Schritt 2: Light-Spielablauf (`0ee8537`)

Entscheidung mit Nutzer (AskUserQuestion): **Option 1** – im Light-Modus
ersetzt die schlanke Belohnungs-Anzeige `GoodieTracker` **und**
`ExplorerLogbook` **vollständig**; **keine** Chronisten-Urkunde am Finale.

### `src/components/LightStationView.jsx` (neu)
- Kein Rätsel, kein ScratchReveal.
- GPS außerhalb des Radius **und** GPS verfügbar → „Geh weiter Richtung
  Ziel"-Sperre (`InkCompass`).
- Im Radius **oder** kein GPS-Signal (`gpsUnavailable`) → Foto per
  `<input type="file" accept="image/*" capture="environment">`.
- Foto lokal als **DataURL** vorgeschaut – nicht gespeichert, nicht
  übertragen (wie `PhotoProofCapture`, siehe `LegalModal`).
  `sfx.playPaperRustle()` beim Foto.
- „Station verzeichnen" → `sfx.playBell()` → `onComplete()` (= nächste
  Station). „Neues Foto" verwirft die Vorschau.
- `<label>` als Schaltfläche, Datei-Input visually-hidden aber
  fokussierbar (`:focus-within`-Outline).

### `src/components/ExplorerPinProgress.jsx` (neu)
- Die **eine** Belohnung im Light-Modus: „Offizielle Entdeckernadel".
- Fortschrittsbalken (`role="progressbar"`, `aria-valuenow` = Prozent),
  Badge `InkMapPin` → `InkCheck` bei 15/15.
- Bei 15/15: `is-complete` (grün) + Abhol-Hinweis (Tourist-Info am
  Großparkplatz / bei den Türmen).

### `src/theme/light-mode.css` (neu, in `index.css`)

### `GameContainer.jsx` – `getGameMode()` → `isLight`
| | Historian | Light |
|---|---|---|
| `needsScratch` | station.type === 'scratch_reveal' | immer `false` |
| Stations-Interaktion | Rätsel-Form / Foto-Fallback / ScratchReveal | `LightStationView` |
| Belohnungs-Anzeige (Haupt + Finale) | `GoodieTracker` + `ExplorerLogbook` | `ExplorerPinProgress` |
| Chronisten-Urkunde | Auto-Open nach Finale | unterdrückt (`&& !isLight`) |
| Ankunfts-Glocke (`arrivedRef`) | ✓ | unterdrückt (Rustle + Bell reichen) |
| `error-box` bei GPS-Fehler | ✓ | aus (LightStationView zeigt „kein GPS") |
| Finale | „Glückwunsch, Entdecker!" + Urkunde-Button | „Foto-Safari geschafft!" + `ExplorerPinProgress` |

- `LightStationView.inRange` = das bestehende `isUnlocked` (reiner
  GPS/DEV-Zustand), `onComplete` = `goToNextStation`.
- Historian-Zweig **unverändert**.

### `OnboardingModal.jsx`
- „in Vorbereitung"-Hinweis auf der Light-Karte entfernt.

### Abweichungen von der Vorlage
- Kein `HistorianStationView` / `LightStationView`-Split des bestehenden
  Inline-Blocks – Historian-JSX bleibt inline, `LightStationView` ist ein
  Geschwister-Zweig.
- **Kein `LogbookModal.jsx`** (existiert nicht) – die Modus-Gate sitzt
  zentral in `GameContainer`, das `ExplorerLogbook` im Light-Modus
  einfach nicht rendert.
- `./InkIcons` → `./icons/AntiqueIcons`; `station.name` → `station.title`;
  `handleCompleteStation(id, {photo})` → `goToNextStation` (Foto nicht
  persistiert); `<div onClick>` → semantische Elemente; `src/styles/` →
  `src/theme/`.

### Verifikation (dist am Mobile-Viewport)
- Light-Station 1: kein Rätsel, kein Scratch, LightStationView + Kamera-
  Button, `GoodieTracker`/`ExplorerLogbook` weg, `ExplorerPinProgress`
  „0 von 15".
- Foto (Fake-PNG) → Vorschau → „verzeichnen" → Station 2,
  `kapArkonaProgress` = 1, Balken `aria-valuenow` = 7.
- Light-Finale bei Fortschritt 15: „Foto-Safari geschafft!",
  `pin-progress.is-complete`, **kein** `CertificateModal`, kein
  `GoodieTracker`/Logbuch.
- Zurück auf `historian`: Rätsel/Logbuch/error-box wieder da.

---

## Offen / nächste sinnvolle Schritte

- Feinschliff Light-Texte/Übergänge vor Ort testen (echtes GPS + Kamera).
- Entscheidung: Modus-Auswahl dauerhaft öffentlich, oder Foto-Safari
  vorerst nur per `?mode=light` sichtbar?
- Karte + Leaflet per `React.lazy` code-splitten.
