# Kap Arkona Entdecker

Interaktive GPS-Schnitzeljagd am Kap Arkona (Rügen) als installierbare PWA.
Besucher:innen laufen 15 Stationen rund um Kap Arkona, Vitt und Putgarten ab,
lösen an jeder Station ein kleines Rätsel und sammeln unterwegs Goodie-Etappen
(bei 5, 10 und 15 Stationen). Erzählt wird die Tour von „Leuchtturmwärter
Schilling" – eine fiktive Figur im Look eines Forscher-Logbuchs von ca. 1875.

Die App braucht **kein Backend**: der gesamte Spielstand liegt lokal im Browser
(`localStorage`), Standort und Kamerabild werden nur auf dem Gerät verarbeitet.
Sie ist offline-fähig (Service Worker), damit sie auch bei schwachem Empfang an
der Steilküste funktioniert.

## Tech-Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (CSS-first, `@theme` – kein `tailwind.config.js`) plus
  klassisches `App.css`
- **Leaflet / react-leaflet** für die eingebettete Karte (Kacheln von
  `map.kap-arkona.de`, dieselbe Quelle wie kap-arkona.de/wegweiser)
- **vite-plugin-pwa** (Workbox) für Installierbarkeit & Offline-Cache
- **@vitejs/plugin-basic-ssl** – lokaler Dev-Server läuft über HTTPS, weil
  GPS-/Kamera-APIs auf dem Handy sonst blockiert sind

## Voraussetzungen

- Node.js ≥ 20 (getestet mit v24)
- npm

## Setup

```bash
npm install
npm run dev
```

Der Dev-Server startet unter **`https://localhost:5173`** (self-signed
Zertifikat – im Browser einmalig bestätigen). Am Handy im selben WLAN:
`npm run dev -- --host` und die Network-URL öffnen.

Im Dev-Modus (`import.meta.env.DEV`) wird die GPS-Sperre übersprungen und die
App ist auch am Desktop nutzbar, damit man ohne Vor-Ort-Besuch entwickeln kann.

## Scripts

| Script | Zweck |
|--------|-------|
| `npm run dev` | Dev-Server mit HMR (HTTPS) |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | `dist/` lokal servieren (Prod-Verhalten prüfen) |
| `npm run lint` | ESLint über `**/*.{js,jsx}` |
| `npm run test` | Vitest (Datenstruktur-Tests, siehe `src/data/`) |

## Deploy: Testserver vs. Live

Das Verhalten wird über Vite-Env-Variablen gesteuert. Für den **Live-Build**
werden keine gesetzt.

### Live

```bash
npm run build
```

Kein Passwortschutz, kein Testmodus – die App prüft nur `isMobileDevice()` und
zeigt am Desktop die „Nur auf dem Smartphone"-Sperre. Deploy des `dist/`-Ordners
zum Hoster (medienmodernisierer.de). Läuft dank `import.meta.env.BASE_URL` /
`assetUrl()` auch in einem Unterverzeichnis.

### Mit Zugangssperre (intern, nicht öffentlich)

```bash
npm run build -- --mode testserver
```

Lokal über `.env.testserver.local` (per `*.local` in `.gitignore`, bleibt
lokal), im CI über ein Repo-Secret:

| Variable | Wirkung |
|----------|---------|
| `VITE_ACCESS_PASSWORD` | aktiviert das `PasswordGate` (einfache Zugangssperre, **kein echter Schutz** – Passwort steckt im Bundle) |

Ohne Vor-Ort-Besuch schaltet man eine Station über den **Foto-Nachweis**
frei (`PhotoProofCapture`), nicht über einen Testmodus.

Dieser Build wird von `.github/workflows/deploy.yml` bei jedem Code-Push
auf `main` (bzw. per *Run workflow*) nach **GitHub Pages** deployt:
<https://pixxpassion.github.io/kap-arkona-explorer/>. Voraussetzung ist
das Repo-Secret `VITE_ACCESS_PASSWORD` (Settings → Secrets and variables →
Actions) – fehlt es, bricht der Workflow im Schritt „Secret prüfen" ab,
damit keine ungeschützte Version online geht. Der Base-Pfad
`/kap-arkona-explorer/` wird nur im Workflow gesetzt; `vite.config.js`
bleibt bei `/`, damit der Live-Deploy zu medienmodernisierer.de unberührt
ist.

## Architektur-Kurzüberblick

```
src/
  App.jsx                  App-Hülle: Device-Check, PasswordGate, Onboarding, Impressum
  main.jsx                 React-Mount, Audio-Unlock, Service-Worker-Reload
  components/
    GameContainer.jsx      Herzstück: Stationsfortschritt (localStorage),
                           GPS-watchPosition, Distanz/Freischaltung, Rätselprüfung,
                           Foto-Nachweis-Fallback, Finale
    SchillingDialogue.jsx  Depeschen-Notiz mit Schreibmaschinen-Effekt + Audio/Vorlesen
    DirectionCompass.jsx   Kompassnadel/Peilung zur Station (Geräte-Ausrichtung optional)
    StationMap.jsx         Leaflet-Karte mit Ziel- und Standortmarker
    GoodieTracker.jsx      Etappen-Goodies + Einlösung durch Personal vor Ort
    ExplorerLogbook.jsx    6 Wahrzeichen als Sammelraster mit Tagebucheinträgen
    LandmarkSketch.jsx     Tuschestrich-SVG-Skizzen der Logbuch-Wahrzeichen
    Modal.jsx / OnboardingModal.jsx / LegalModal.jsx / DesktopNotice.jsx / PasswordGate.jsx
    icons/AntiqueIcons.jsx Strich-Icons für die 1875er-Erzählung
    icons/UiIcons.jsx      Strich-Icons für die Marken-Hülle (Header, Desktop-Sperre)
  data/
    stations.js            15 Stationen (Koordinaten, Radius, Rätsel) + goodieMilestones
    logbookEntries.js      6 Logbuch-Wahrzeichen; unlockAtCompleted koppelt an Stations-IDs
  hooks/useTypewriter.js   zeichenweise Textausgabe
  theme/
    maritime-journal.css   EINZIGE Quelle der Farb-/Schrift-Tokens (@theme, Tailwind v4)
    fonts.css              lokal eingebundene Schriften (Playfair Display, Courier Prime)
  utils/
    geoUtils.js            Haversine-Distanz, Peilung, Himmelsrichtung
    textUtils.js           tolerante Antwortprüfung (Normalisierung + Levenshtein)
    audioUnlock.js         zentrale „erste Nutzer-Geste"-Verwaltung (Autoplay-Regeln)
    speech.js              Vorlesen per Web Speech API (Fallback ohne MP3)
    typewriterSound.js     Meeresrauschen per Web Audio API (keine Datei nötig)
    cacheUtils.js          Service-Worker/Cache leeren
    deviceUtils.js         isMobileDevice()
    assetUrl.js            BASE_URL-fester Pfad zu public/-Assets
```

### Zustand (localStorage, keine Cookies, kein Backend)

| Key | Inhalt |
|-----|--------|
| `kapArkonaProgress` | Index der aktuellen Station |
| `kapArkonaOnboardingSeen` | Onboarding-Modal schon gesehen |
| `kapArkonaGoodiesRedeemed` | eingelöste Goodie-Etappen (mit Datum) |
| `kapArkonaSchillingSound` | Ton/Vorlesen an oder aus |
| `kapArkonaTestAccess` | PasswordGate freigeschaltet (nur Build mit `VITE_ACCESS_PASSWORD`) |

### Design

Verbindliche Design-/UI-Richtlinien für den 1875er-Look:
[`.claude/skills/taste/SKILL.md`](.claude/skills/taste/SKILL.md). Farben und
Schriften kommen ausschließlich als CSS-Variablen aus
`src/theme/maritime-journal.css`.

## Obsidian-Vault

Dieses Verzeichnis ist zugleich der Projekt-Vault (siehe `CLAUDE.md`):
Regionaldoku und Konzepte unter `docs/`, Entwicklungs-Protokolle unter `logs/`.
Der versteckte Ordner `.obsidian/` wird nicht versioniert und nicht angefasst.

## Datenschutz

- Schriften lokal (kein Google-Fonts-CDN)
- Standort wird nur im Browser zur Distanzberechnung genutzt, nicht übertragen
- Kamerabild (Foto-Nachweis) wird nur lokal angezeigt, nicht gespeichert
- keine Cookies, kein Tracking
