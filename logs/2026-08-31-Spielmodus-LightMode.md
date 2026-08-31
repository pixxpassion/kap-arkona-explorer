---
title: Spielmodus-System – Foto-Safari (Light) + Feinschliff
date: 2026-08-31
tags:
  - projekt/kap-arkona
  - devlog
  - feature
  - gamemode
status: live
---

# Kap Arkona Entdecker – Zwei Spielmodi (Session 31.08.2026)

Neuer wählbarer Modus **„Foto-Safari" (Light)** neben der **„Rätsel-Expedition"
(Historian)**, in drei Commits. Ausführliche Feature-Doku:
[[Kap-Arkona-Explorer-Release-LightMode]].

Alle auf `main`, CI + GitHub-Pages-Deploy je grün. **Tests 121 → 127.**

| Commit | Inhalt | Deploy |
|--------|--------|--------|
| `4cb30f4` | Schritt 1 – `gameMode.js` + Auswahl-Karten im Onboarding | #11 |
| `0ee8537` | Schritt 2 – Light-Spielablauf (LightStationView, ExplorerPinProgress) | #12 |
| `3270363` | Feinschliff – Onboarding-Goodies, GPS-Testmodus, „Explorer"→„Entdecker" | #13 |

---

## Schritt 1: Modus-Auswahl (`4cb30f4`)

- **`src/utils/gameMode.js`** (neu): `GAME_MODES` (`historian`/`light`),
  `getInitialGameMode()` (`?mode=`-Query → localStorage `kapArkonaGameMode`
  → Standard), `getGameMode()`, `setGameMode()`. node-sicher. **+6 Tests.**
- Auswahl **im `OnboardingModal`** (kein eigener Startscreen, Nutzer-
  Entscheidung): zwei `<button aria-pressed>`-Karten mit `Ink`-Icons,
  `sfx.playLatch()` beim Umschalten, `src/theme/game-mode.css` (nur Tokens).
- Abweichung von der Vorlage: kein `StartScreen.jsx`, kein `src/styles/`,
  keine Emojis, `sfx.playLatch()` aus `sfxSynthesizer` (`sfx.js` weg).

## Schritt 2: Light-Spielablauf (`0ee8537`)

Nutzer-Entscheidung (AskUserQuestion): **Option 1** – im Light-Modus
ersetzt die schlanke Anzeige `GoodieTracker` **und** `ExplorerLogbook`
vollständig; **keine** Chronisten-Urkunde.

- **`LightStationView.jsx`** (neu): kein Rätsel. GPS im Radius **oder**
  kein GPS-Signal → Foto per `<input type="file" capture="environment">`,
  lokale DataURL-Vorschau (nicht gespeichert). `sfx.playPaperRustle()`
  beim Foto, `sfx.playBell()` beim „Station verzeichnen" → nächste Station.
- **`ExplorerPinProgress.jsx`** (neu): die eine Belohnung – Entdeckernadel-
  Fortschrittsbalken (`role="progressbar"`), Abhol-Hinweis bei 15/15.
- **`src/theme/light-mode.css`** (neu, in `index.css`).
- **`GameContainer.jsx`** wertet `getGameMode()` → `isLight` aus:
  `needsScratch` nur Historian; `LightStationView` statt unlocked/locked;
  `GoodieTracker`+`ExplorerLogbook` → `ExplorerPinProgress` (Haupt + Finale);
  Urkunde-Auto-Open + Ankunfts-Glocke unterdrückt; `error-box` aus
  (LightStationView behandelt GPS-Ausfall selbst); eigenes Finale
  „Foto-Safari geschafft!".
- Historian-Zweig unverändert. Kein `LogbookModal.jsx` (existiert nicht) –
  Gating zentral in `GameContainer`.

## Feinschliff (`3270363`)

### 1. Keine Historian-Goodies mehr im Light-Onboarding
`OnboardingModal` jetzt modus-abhängig:
- Intro: „…machst an jeder ein Foto vom Zielort." statt „…löst ein Rätsel".
- Belohnungs-Sektion: **„Deine Belohnung"** (nur Entdecker-Wandernadel)
  statt **„Goodies unterwegs"** (5/10/15-Etappen). Historian unverändert.

### 2. GPS-Testmodus wieder aktiv
- Gegated auf **`import.meta.env.VITE_ACCESS_PASSWORD`** (Testserver-Build)
  statt eines eigenen `VITE_ENABLE_TEST_MODE`-Secrets → **keine CI-/
  `deploy.yml`-Änderung nötig**, greift beim nächsten Deploy.
- `GameContainer`: `TEST_MODE_AVAILABLE = DEV || Boolean(VITE_ACCESS_PASSWORD)`,
  `TEST_MODE_KEY = 'kapArkonaTestMode'`, State + Persist-Effekt,
  `|| testModeOn` in beiden GPS-Zweigen, Effekt-Deps `[currentStation,
  testModeOn]`. Schalter „Testmodus AN/AUS · GPS-Sperre umgangen/aktiv"
  (`InkLock`, Marken-Blau, `is-on`), nur sichtbar wenn
  `TEST_MODE_AVAILABLE && !DEV`.
- In der Live-Build (kein Passwort) fällt der Block beim Bundling weg.
- `.test-mode-badge` in `App.css` neu (Marken-Ebene, Tokens).

### 3. „Explorer" → „Entdecker"
`OnboardingModal`: „Der **Explorer** schickt dich…" → „Der **Entdecker**
schickt dich…" (einzige nutzer-sichtbare „Explorer"-Stelle;
`ExplorerLogbook.jsx` im README ist ein Dateiname).

### README
localStorage-Tabelle um `kapArkonaTestMode` + `kapArkonaGameMode`,
`VITE_ACCESS_PASSWORD`-Zeile um den Testmodus-Hinweis.

---

## Verifikation

- `npm run lint` sauber · `npm test` **127 grün** · `npm run build` grün.
- Testserver-`dist` am Mobile-Viewport:
  - Schritt 1/2: Modus-Karten toggeln + persistieren; Light-Station 1 ohne
    Rätsel/Scratch, Kamera-Button, `GoodieTracker`/Logbuch weg,
    `ExplorerPinProgress` „0 von 15"; Foto (Fake-PNG) → „verzeichnen" →
    Station 2, Balken `aria-valuenow` = 7; Light-Finale bei 15/15
    „Foto-Safari geschafft!", **kein** `CertificateModal`.
  - Feinschliff: Testmodus-Schalter nur auf der Passwort-Build sichtbar,
    schaltet + persistiert (`kapArkonaTestMode`); Light-Onboarding ohne
    „Bei 5, 10 und 15…"; „Der Entdecker schickt dich…"; Historian
    (Rätsel, Logbuch, error-box, volle Goodies) unverändert.

## Offen / nächste sinnvolle Schritte

- Light-Feinschliff vor Ort testen (echtes GPS + Kamera, `navigator.share`
  entfällt im Light-Modus, aber Foto-Capture prüfen).
- Entscheidung: Modus-Auswahl dauerhaft öffentlich, oder Foto-Safari
  vorerst nur per `?mode=light`?
- Karte + Leaflet per `React.lazy` code-splitten (First Paint).
