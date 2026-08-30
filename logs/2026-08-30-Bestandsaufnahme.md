# Dev-Log: Bestandsaufnahme kap-arkona-explorer

**Datum:** 2026-08-30
**Branch:** main (clean, bis auf untracked `.obsidian/`)
**Letzter Commit:** `7411e36` – „WIP-Zwischenstand: Icon-System-Umbau, neue Komponenten …"

---

## Auftrag

CLAUDE.md + `taste`-Skill lesen, aktuellen Code-Stand prüfen, Bestandsaufnahme
und erste Modernisierungsvorschläge liefern.

## Durchgeführte Prüfungen

- Vollständiger Durchgang durch `src/` (Komponenten, Utils, Hooks, Daten, Theme),
  `vite.config.js`, `package.json`, `index.html`, `eslint.config.js`.
- `npm run lint` → **sauber**, keine Findings.
- `npm run build` → **erfolgreich** (Vite 8.1.2, 1,4 s). Bundle: `index.js`
  399,48 kB (gzip 123,36 kB), `index.css` 56,30 kB (gzip 15,76 kB).
- PWA-Precache: **48 Einträge / 5 753 KiB** (dominiert von 21 MP3-Dateien).
- Installierte Kernversionen: React 19.2.7, react-dom 19.2.7, Vite 8.1.2,
  @tailwindcss/vite 4.3.3, leaflet 1.9.4, react-leaflet 5.0.0, lucide-react 1.23.0.
- Node v24.18.0, npm 11.16.0.

## Projektcharakter

Mobile-first PWA (React 19 + Vite 8, Tailwind v4 + eigenes CSS). GPS-Schnitzeljagd
mit 15 Stationen am Kap Arkona, Erzählfigur „Leuchtturmwärter Schilling", Rätsel
je Station, Goodie-Meilensteine bei 5/10/15, Entdecker-Logbuch mit 6 Wahrzeichen.
Kein Backend – kompletter Zustand in `localStorage`
(`kapArkonaProgress`, `kapArkonaOnboardingSeen`, `kapArkonaGoodiesRedeemed`,
`kapArkonaSchillingSound`, `kapArkonaTestAccess`, `kapArkonaTestMode`).
Vollständig offline-fähig.

## Solide Substanz

- Klare Komponentenstruktur, durchgängig deutsch und ausführlich kommentiert
  (v. a. Browser-Autoplay-/Geste-Themen in `audioUnlock.js`, `SchillingDialogue.jsx`).
- DSGVO-bewusst: lokale Schriften statt Google-CDN (`theme/fonts.css`), eigene
  Kartenkacheln (`map.kap-arkona.de`), Standort/Kamera nur lokal, keine Cookies.
- Durchdachte Fallbacks: Foto-Nachweis statt GPS, Kompassnadel statt Karte,
  Web-Speech statt vertonter MP3.
- Lint sauber, Build erfolgreich.
- Eigene handgezeichnete SVG-Icon-Bibliothek (`AntiqueIcons.jsx`) passend zum
  1875er-Look.

## Findings

### Aufräumen / Altlasten
1. **`src/index.css` ist Fremd-Boilerplate** aus einem anderen Template:
   Lila-Akzent `#aa3bff`, Selektoren `#social` / `.counter`,
   `#root { width: 1126px }`. Widerspricht `App.css`
   (`.app-layout { max-width: 600px }`), wird trotzdem global geladen.
2. **`README.md` ist noch das Vite-Standardtemplate** – kein Projektbezug.
3. **Doppelte Theme-Definition:** `App.css :root` und
   `theme/maritime-journal.css @theme` definieren dieselben Farben zweimal
   (Preußischblau, Messing, Wachsrot …). Drift-Falle; Kommentar sagt selbst
   „dieselben Werte".
4. **Veraltete Kommentare:** `maritime-journal.css:12` („Google Fonts werden in
   index.html geladen") und `AntiqueIcons.jsx:11` („siehe CLAUDE.md-Kontext")
   stimmen nicht mehr (Fonts sind lokal; CLAUDE.md hat keinen CI-Kontext).
5. **Ungenutzte Assets:** `src/assets/hero.png`, `react.svg`, `vite.svg`,
   `public/icons.svg` – nirgends referenziert.
6. **`lucide-react` als komplette Abhängigkeit für nur 2 Icons**
   (`Info`, `Smartphone`), obwohl eigene Icon-Bibliothek vorhanden.
7. **Doppelte Dateiendungen** `icon-192.png.png`, `apple-touch-icon.png.png`
   ziehen sich durch `vite.config.js`, `index.html` und mehrere Komponenten.
8. **`docs/` und `logs/` waren leer** (nur `.gitkeep`) – Vault-Anspruch aus
   CLAUDE.md unerfüllt (dieser Log-Eintrag ist der erste Inhalt in `logs/`).

### Funktionale Risiken
9. **PWA-Precache 5,75 MB** – 21 MP3-Dateien werden beim Erstinstall komplett
   geladen. An der Steilküste mit „schwankendem Empfang" (Kommentar
   `vite.config.js:28`) der ungünstigste Moment.
10. **`speech.js`: `getVoices()` ohne `voiceschanged`-Listener** – auf vielen
    Browsern beim ersten Aufruf leer, Stimmenwahl der ersten Station schlägt
    dann stumm fehl. Bekannter Web-Speech-Bug.
11. **Modals ohne A11y** (`Modal.jsx`): kein `role="dialog"`, kein `aria-modal`,
    kein Esc-Handler, kein Focus-Trap/-Return. Betrifft Onboarding + Impressum.
12. **`isMobileDevice()`:** Touch-Laptops gelten als „mobil" und umgehen die
    Desktop-Sperre; reiner Desktop wird bei DevTools-Touch-Emulation ebenfalls
    durchgelassen.
13. **Goodie-Einlösung ist reine Ehrensache:** „Personal bestätigt" in
    `GoodieTracker.jsx` setzt nur einen `localStorage`-Wert, den das Gerät selbst
    kontrolliert. Echter Missbrauchsschutz bräuchte serverseitige Tokens/QR.

### Fehlende Infrastruktur
14. **Keine Tests, keine CI** (`.github/` fehlt). Kein Schutz für GPS-/Audio-/
    Rätsel-Logik; `unlockAtCompleted` in `logbookEntries.js` muss manuell mit
    `stations.js` synchron gehalten werden (Kommentar warnt selbst davor).
15. **Bundle 399 kB JS** (123 kB gzip), großteils Leaflet/react-leaflet für eine
    Karte, die per Default eingeklappt ist → Kandidat für Code-Splitting.
16. Letzter Commit ist ein breit gefasster „WIP-Zwischenstand".

## Modernisierungsvorschläge (priorisiert)

### Sofort, geringes Risiko
- `index.css` auf Reset + `#root`-Flexbox eindampfen oder in `App.css`
  konsolidieren.
- README mit echtem Inhalt (Zweck, Setup, Scripts, Deploy Testserver vs. Live,
  Architektur, localStorage-Keys).
- Veraltete Kommentare korrigieren; ungenutzte Assets + `lucide-react` entfernen.
- Farb-Tokens an genau einer Stelle definieren (`maritime-journal.css @theme`),
  `App.css` nur noch `var(--color-…)`.
- `taste/SKILL.md` angelegt (erledigt in dieser Session).

### Mittel
- Vitest + Testing Library: `isAnswerCorrect`, `calculateDistance`/
  `calculateBearing`, Fortschrittslogik `GameContainer`.
- Datenvalidierungs-Test für `stations.js` / `logbookEntries.js`
  (eindeutige IDs, plausible Koordinaten, nicht-leere Antworten,
  `unlockAtCompleted` ≤ 15).
- GitHub Actions: `npm ci && npm run lint && npm run build` (+ Tests) bei Push/PR.
- Audio aus dem Precache → `runtimeCaching` (CacheFirst) oder On-demand-Vorladen.
- `speechSynthesis` mit `voiceschanged`-Event absichern.
- Karte + Leaflet per `React.lazy`/`Suspense` code-splitten.
- Modal-A11y über natives `<dialog>`-Element.

### Größer / strategisch
- TypeScript einführen, mindestens `stations.js` → `.ts` mit `Station`-Interface.
- Error Boundary + schlankes Fehler-Logging für GPS-/Kamera-Pfade.
- Serverseitige Goodie-Bestätigung erwägen.
- `.png.png`-Dateien einmalig sauber umbenennen (mit allen Referenzen).
- Icon-Strategie konsistent dokumentieren (Bruch „Marken-Hülle vs. Erzählung").

## Nebenbefund

`.claude/skills/taste/` existierte als **leeres Verzeichnis** ohne `SKILL.md`.
In dieser Session neu erstellt: `.claude/skills/taste/SKILL.md` mit den Design-/
UI-Guidelines für den 1875er-Look (zwei visuelle Ebenen, Farb-Tokens, Schriften,
Strich-Icon-Stil, Textur, Bewegung, Schillings Ton, Prüf-Checkliste).

## Umgesetzte Sofort-Maßnahmen (gleiche Session)

### Schritt 1 – Theme-Tokens konsolidiert
- `src/theme/maritime-journal.css` ist jetzt die **einzige Quelle** der Farb-/
  Schrift-Tokens. `--color-success: #2f7a4f` im `@theme` ergänzt; veralteter
  „Google Fonts in index.html"-Kommentar korrigiert.
- `src/App.css :root` definiert **keine Farbwerte** mehr, nur noch Alias-Verweise
  (`--primary-blue: var(--color-ink)` usw.). `--font-header` / `--font-log`
  entfernt (kommen global aus dem `@theme`). Ungenutztes `--blue-light` (0
  Referenzen) entfernt. Marken-Hüllen-Tokens (`--brand-*`, `--font-ui`) bleiben
  bewusst als rohe Werte in App.css.
- Ladereihenfolge geprüft: `@theme`-`:root` (Byte 2899 im Build-CSS) steht vor
  den App.css-Aliassen (Byte 37923) → Auflösung korrekt.

### Schritt 2 – `src/index.css` entrümpelt
- Komplette Fremd-Boilerplate raus: `:root`-Tokens (`--accent: #aa3bff` etc.),
  `@media (prefers-color-scheme: dark)`-Block, `#social`-Selektor,
  `#root { width: 1126px; border-inline: … }`.
- Behalten/neu: die zwei `@import` (fonts, maritime-journal), `:root { font-size:
  16px }` (entspricht dem bisherigen effektiven Mobile-Wert, hält alle
  rem-Berechnungen stabil), schlankes `#root`-Grundgerüst (Flex-Spalte,
  `min-height: 100svh`, `text-align: center`).
- Nebeneffekt: Desktop-Sperre rendert jetzt korrekt vollflächig statt in einer
  1126-px-Box.

### Schritt 3 – Ungenutzte Assets & `lucide-react` entfernt
- Gelöscht: `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`,
  `public/icons.svg` (letzteres wurde trotz fehlender Referenz ins PWA-Precache
  gepackt).
- `lucide-react` als Abhängigkeit entfernt (`package.json` + Lockfile +
  `node_modules`). Die zwei genutzten Icons (`Info`, `Smartphone`) durch
  `src/components/icons/UiIcons.jsx` (`InfoIcon`, `SmartphoneIcon`, schlichte
  Strich-SVGs für die Marken-Hülle) ersetzt.

### Verifikation
- `npm run lint` → sauber. `npm run build` → grün.
- Bundle: CSS 56,30 → **54,82 kB**, JS 399,48 → **398,54 kB**, Precache 48 → **47
  Einträge**.
- Visuell im Browser geprüft (Onboarding-Modal, Stationsansicht Station 1,
  Desktop-Sperre): Farben, Schriften und Layout unverändert bzw. verbessert.
  Hinweis: Der Dev-Server nutzt `@vitejs/plugin-basic-ssl` (selbstsigniertes
  HTTPS), das der In-App-Browser nicht akzeptiert – geprüft wurde daher der
  `dist/`-Build über einen einfachen lokalen HTTP-Server.
- **Noch nicht committet** – Review durch Nutzer ausstehend.

## Commits (main, gepusht: `7411e36..b81c1fd`)

| Commit | Inhalt |
|--------|--------|
| `c736d61` | refactor: Theme-Tokens konsolidiert, index.css bereinigt, ungenutzte Assets & `lucide-react` entfernt (+ `taste`-Skill + dieses Dev-Log) |
| `43a0069` | docs: README mit echtem Projektinhalt |
| `c4f280c` | test: Vitest + Datenstruktur-Tests (`src/data/data.test.js`, 100 Checks) |
| `3acbc39` | docs: Dev-Log fortgeschrieben |
| `680910f` | chore(deps): `npm audit fix` → 0 vulnerabilities |
| `b81c1fd` | ci: GitHub-Actions-Workflow (lint, test, build) |

## Umgesetzt: README + erste Tests

- **README.md** komplett neu: Zweck, Tech-Stack, Setup, Scripts, Deploy
  (Live vs. Testserver via `.env.testserver.local`), Architektur-Überblick
  inkl. localStorage-Keys, Verweis auf `taste`-Skill.
- **Vitest** eingeführt (`vitest.config.js`, node-Env, ohne React/PWA-Plugins;
  Scripts `test` / `test:watch`). `src/data/data.test.js` prüft:
  Stationen (15, lückenlose IDs, Texte, Koordinaten-Bounding-Box, Radius,
  Rätsel-Vollständigkeit, Audiodateien vorhanden), `goodieMilestones` (5/10/15),
  `logbookEntries` (6, IDs = LandmarkSketch-Keys, `unlockAtCompleted` → echte
  Station, Audiodateien). → 100 Tests grün.

## Umgesetzt: Security & CI

- **`npm audit fix`** (ohne `--force`): 5 Pakete aktualisiert (nur
  `package-lock.json`, transitive Dev-Deps brace-expansion/fast-uri/nanoid/
  postcss). Danach `npm audit` → **0 vulnerabilities**. Lint/Test/Build grün.
- **`.github/workflows/ci.yml`**: bei jedem Push und PR läuft auf Node 22
  `npm ci` → `npm run lint` → `npm test` → `npm run build`.
  Erster Lauf auf `main`: **grün**
  (run 33319976979).

## Zwischenstand 2026-08-30 (Infrastruktur)

Alle Sofort- und Infrastruktur-Maßnahmen umgesetzt, committet und gepusht
(`7411e36..ddaf538`), CI grün. Working Tree clean.

## Umgesetzt: Performance & A11y (Fortsetzung 2026-08-30)

Die drei mit dem Nutzer abgestimmten Fokus-Punkte wurden noch in derselben
Session umgesetzt.

### 1. Audio aus dem PWA-Precache → `runtimeCaching` (`vite.config.js`)

- `mp3` aus `workbox.globPatterns` entfernt → `['**/*.{js,css,html,ico,svg,png,webp,woff2}']`.
- Neue `runtimeCaching`-Regel **vor** der Kartenkachel-Regel:
  `urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/audio\/[^/]+\.mp3$/.test(url.pathname)`,
  `handler: 'CacheFirst'`, `cacheName: 'kap-arkona-audio'`, **`rangeRequests: true`**
  (Safari/`<audio>` holt per Range-Request – ohne das könnte `CacheFirst` nichts
  ausliefern), `expiration: { maxEntries: 40, maxAgeSeconds: 90 Tage }`,
  `cacheableResponse: { statuses: [0, 200] }`.
- `sameOrigin` + Pathname-Regex statt fester URL → greift auch unter `BASE_URL`
  (Unterverzeichnis).
- **Wirkung:** PWA-Precache **47 Einträge / 5.746 KiB → 26 / 1.006 KiB**. Audio
  wird beim ersten Abspielen einer Station gecacht und ist ab dann offline
  verfügbar. `sw.js` enthält die neue `registerRoute(... CacheFirst
  "kap-arkona-audio" ... RangeRequestsPlugin)`.
- Commit `0dce52c`.

### 2. Web-Speech-Stimmenauswahl abgesichert (`src/utils/speech.js`)

- Problem: `speechSynthesis.getVoices()` ist in Chrome/Edge und vielen
  Mobilbrowsern beim ersten Aufruf leer → erste Station wurde mit einer
  Default-Stimme (oft nicht Deutsch) vorgelesen.
- Zentraler `cachedVoices`-Cache, aktualisiert über einen modulweiten
  `speechSynthesis.addEventListener('voiceschanged', refreshVoices)` +
  `refreshVoices()` beim Import.
- `speakText()`: ist die Liste noch leer, wird die Ausgabe **aufgeschoben** –
  einmalig auf `voiceschanged` warten (plus 1 s Timeout-Fallback), dann mit der
  dann verfügbaren deutschen Stimme starten. `utterance.lang = 'de-DE'` bleibt
  als zusätzliche Absicherung.
- `speakGeneration`-Zähler: `stopSpeech()` und jedes neue `speakText()` erhöhen
  ihn; eine wartende, aufgeschobene Ausgabe erkennt daran, dass sie überholt
  wurde (Stationswechsel, Ton aus, Unmount) und startet nicht mehr – verhindert
  „Geist-Sprache" nach dem Weiterklicken.
- `unlockSpeech()` stößt zusätzlich `refreshVoices()` an (erste Nutzer-Geste).
- Öffentliche Signaturen unverändert; `SchillingDialogue.jsx` unberührt.
- Commit `ed10f96`.

### 3. Modal auf natives `<dialog>` umgestellt (`Modal.jsx`, `App.css`)

- `Modal.jsx` nutzt `<dialog>` + `showModal()` im `useEffect` (Cleanup
  `dialog.close()`). Der Browser übernimmt:
  Fokus wandert beim Öffnen in den Dialog und bleibt gefangen, kehrt beim
  Schließen zum auslösenden Element zurück; Escape schließt; Hintergrund inert;
  implizit `role="dialog"` + `aria-modal="true"`.
- Titel über `aria-labelledby` + `useId()` mit `<h2>` verknüpft.
- Das native `close`-Event (`onClose`) ist die einzige Schließ-Quelle:
  X-Button und Backdrop-Klick rufen `dialog.close()`, Escape löst es direkt aus.
  Backdrop-Klick via `onClick`-Guard `e.target === e.currentTarget`
  (Inhalts-Klicks schließen nicht).
- `App.css`: `.modal-overlay` entfernt (wurde nur hier genutzt), Backdrop jetzt
  `.modal-box::backdrop`; `.modal-box` als `<dialog>` im Top-Layer als
  Bottom-Sheet positioniert (`inset: 0; margin: auto auto 0`, UA-`border`/
  `padding` resettet). **Optik unverändert**, `slideUp`-Animation + sticky
  Header bleiben.
- Verifiziert (dist im Browser, Onboarding- **und** Impressum-Modal):
  `:modal` aktiv, Fokus im Dialog, Fokus-Rückgabe an den Info-Button,
  Backdrop-Klick schließt, Inhalts-Klick nicht, X-Button schließt, Titel korrekt
  verknüpft.
- Commit `c46a2ef`.

### Verifikation (alle drei)

`npm run lint` · `npm test` (100) · `npm run build` – grün.
Browser-Prüfung erneut über den `dist/`-Build via lokalem HTTP-Server
(Dev-Server-HTTPS mit `basic-ssl` wird vom In-App-Browser nicht akzeptiert).

## Umgesetzt: Logbuch-Stempel & Alterungssystem (Fortsetzung 2026-08-30)

Neues Feature nach Nutzer-Vorgabe (in drei Iterationen entwickelt).

### Dateien
- `src/data/stamps.js` – `STAMP_TYPES` (STATION_COMPLETED + Meilensteine
  5/10/15: `id`, `title`, `subtitle`, `color`, `icon`), `MILESTONE_STAMPS`
  (5/10/15 → Typ), `getStampRotation(seed)` – deterministischer Winkel
  −6…+6° (Bereich ggü. dem Entwurf korrigiert: JS-`%` bei negativem Hash
  hätte −17…+5 geliefert).
- `src/components/logbook/StampStamp.jsx` – benannter Export
  `{ stamp, isNew }`. Nur der **frisch erreichte** Meilenstein (`isNew`)
  läuft mit der `stampImpact`-Animation ein und gibt im Aufschlag einen
  kurzen Vibrationsimpuls (`navigator.vibrate([25,30,45])`); bereits
  vorhandene Stempel erscheinen still. Rein typografisch (Untertitel +
  Titel in Versalien), kein Symbol.
- `src/theme/logbook-aging.css` (import in `index.css`) – zwei
  Alterungsstufen + Stempel-Optik.
- `src/components/ExplorerLogbook.jsx` – `data-aging-level`,
  Meilenstein-Stempel in `.stamp-slot`-Wrappern über dem Logbuch.
- `src/data/data.test.js` – +7 Checks für `stamps.js` (Typen vollständig,
  IDs eindeutig, `MILESTONE_STAMPS` = 5/10/15, Rotation deterministisch
  −6…+6). → **107 Tests**.

### Alterung (`data-aging-level` an `.mj-logbook`, aus `completedCount`)
| Level | Stationen | Effekt |
|---|---|---|
| 0 | 0–4 | unverändert |
| 1 | 5–9 | Farbverschiebung `#f2ebd9`→`#e3d3ac` + `inset 0 0 25px rgba(110,80,40,.15)` |
| 2 | 10–15 | `#ebdcb9`→`#d8c197` + `inset 0 0 45px rgba(90,60,20,.25)` |

`transition: background/box-shadow 0.5s`. Pergament-Gradient von
`maritime-journal.css` bleibt darunter erhalten.

### Stempel-Optik
Rechteckig, `border: 3px double currentColor`, `mix-blend-mode: multiply`,
`mask-image: radial-gradient(circle, black 60%, transparent 100%)` (weiche
Kanten). `@keyframes stampImpact` (0.35 s, `cubic-bezier(.175,.885,.32,1.275)`):
`scale(2.8)` → `scale(1)`. Farbe je Typ: Wachsrot `#a13d2d`
(`--color-wax-red`, neu im `@theme`), Messing, Tinte.

### Abgleich mit dem Bestand (Vorgaben nutzten nicht existierende Namen)
- `src/styles/logbook-aging.css` → `src/theme/logbook-aging.css`
  (Projekt hat `src/theme/`, kein `src/styles/`).
- `.logbook-paper` → `.mj-logbook` (echter Container).
- `LogbookView.jsx` → `ExplorerLogbook.jsx`.
- `import React` entfernt (`no-unused-vars` bei automatischem JSX-Runtime).
- `navigator.vibrate` mit `hasGestured()`-Gate versehen (sonst
  Konsolenfehler beim Kaltstart mit sichtbarem Logbuch – gleiche Gate wie
  Audio/Sprachausgabe).

### Barrierefreiheit / Motion
`.stamp-layer` ist `aria-hidden` (die Etappen-Info sagt der GoodieTracker
schon an). `@media (prefers-reduced-motion: reduce)` → `stampFade` statt
`stampImpact`, keine Aging-Transition, kein Vibrationsimpuls.

### Verifikation
`lint` · `test` **107** · `build` grün (CSS 54,85 → 56,47 kB, JS
399,13 → 400,73 kB, Precache unverändert 26). DOM/Styles im `dist`-Build
bei `data-aging-level` 0/1/2 geprüft (Position, Farbe → Theme-Token, Winkel,
`isNew`-Animation nur beim gerade erreichten Stempel), keine
`vibrate`-/React-Konsolenfehler. Screenshot-Capture der Browser-Pane war
in dieser Session unzuverlässig – die rechteckige Stempel-Optik selbst
wurde in `2bfd8e1` visuell bestätigt.

### Commits
| Commit | Inhalt |
|--------|--------|
| `4c39746` | erste Fassung (runder Poststempel, 4 Alterungsstufen) |
| `2bfd8e1` | Umstellung auf die vorgegebene `logbook-aging.css` (rechteckig, 2 Stufen) |
| `954ea7a` | `StampStamp` auf `{ stamp, isNew }`-API, `StampIcons.jsx` entfernt |

## Umgesetzt: ScratchReveal-Rätsel (Fortsetzung 2026-08-30)

„Verwitterte Inschrift freikratzen" als neuer Rätseltyp. Commit `b4583ca`.

### `src/components/puzzles/ScratchReveal.jsx`
- Über der eingemeißelten Inschrift (reiner Text) liegt eine
  Verwitterungsschicht auf einem `<canvas>` – Moos-/Flechten-Textur wird
  beim Mount zur Laufzeit gemalt (Grundfläche + ~70 halbtransparente
  Kreise), **keine Bilddatei**.
- Wegkratzen per **Pointer Events** (`onPointerDown/Move/Up/Leave/Cancel`)
  → deckt Touch **und** Maus ab; `setPointerCapture`, `touch-action: none`
  (CSS) verhindert Seiten-Scroll beim Kratzen. Radierung über
  `globalCompositeOperation = 'destination-out'` (Linie zwischen den
  Punkten + Kreis → lückenlos).
- Fortschritt: `getImageData` in `requestAnimationFrame` (gedrosselt),
  jeder 8. Pixel, Anteil vollständig transparenter Pixel. `progress` =
  `min(frac / threshold, 1)`. Bei `frac >= threshold` → `doReveal()`.
- `doReveal()` (Schwelle **oder** Fallback-Button): `revealedRef` als
  Einmal-Sperre, `is-cleared`-Klasse blendet den Canvas per CSS aus,
  `onReveal()`-Callback.
- **Haptik** (`navigator.vibrate`): `6` ms Tick beim Kratzen (max. alle
  180 ms), `[35,45,70]` beim Freilegen. Beides aus bei
  `prefers-reduced-motion`. Kein `hasGestured()`-Gate nötig – jeder
  `vibrate`-Aufruf folgt direkt auf eine echte Geste (Kratzen bzw.
  Button-Tap), anders als bei den Logbuch-Stempeln.
- **Motorik-Fallback**: Button „Nicht lesbar? Inschrift direkt freilegen".
- Fortschrittsbalken mit `role="progressbar"` + `aria-valuenow`; die
  Inschrift ist `aria-hidden`, solange sie verdeckt ist.
- StrictMode-sicher: `canvas.width` setzen (setzt Transform zurück) und
  `ctx.scale(dpr)` im selben Effekt-Durchlauf; `dpr` auf max. 2 begrenzt.

### `src/theme/scratch-reveal.css` (import in `index.css`)
`.scratch-puzzle-container` (Flex-Spalte), `.scratch-stage` (5:2,
`aspect-ratio`, Messingrahmen + Doppellinie, `overflow: hidden`),
`.scratch-inscription` (Playfair, `letter-spacing`, `text-shadow`-Relief =
eingemeißelt), `.scratch-canvas` (`touch-action: none`, `is-cleared` →
`opacity 0`), `.scratch-progress` + `-bar` (`scaleX`-Transform).
`.scratch-inscription--plate` = statische Tafel nach dem Lösen.
`@media (prefers-reduced-motion: reduce)` schaltet die Transitions ab.

### `src/data/stations.js` + `GameContainer.jsx`
- Station 1 (Schinkelturm) bekommt `type: 'scratch_reveal'` und
  `scratch: { revealText: 'ANNO · 1827', threshold: 0.55, prompt: … }`.
  Datenmodell abwärtskompatibel (nur zwei neue optionale Felder) – die
  bestehenden `data.test.js`-Checks bleiben grün.
- `GameContainer`: `needsScratch = currentStation?.type === 'scratch_reveal'`,
  neuer State `inscriptionRevealed`. Im `isUnlocked`-Block: solange
  `needsScratch && !inscriptionRevealed` → nur `<ScratchReveal>`; danach
  die Inschrift als `.scratch-inscription--plate` **über** der
  Rätselfrage, dann der normale Frage-/Eingabe-Flow. `inscriptionRevealed`
  wird in `goToNextStation` und `resetGame` zurückgesetzt (Reset im
  Handler statt im Effekt – Projekt-Konvention).
- `data.test.js`: +2 Checks (mind. eine `scratch_reveal`-Station, Konfig
  gültig: `revealText`/`prompt` nicht leer, `threshold` in (0, 1]). → **109
  Tests**.

### Verifikation
`lint` · `test` **109** · `build` grün (CSS 56,47 → 58,78 kB, JS
400,73 → 404,49 kB, Precache unverändert 26). End-to-end im
**Testserver-`dist`** (`npm run build -- --mode testserver`, Testmodus-Button)
im Browser geprüft: Kratzen → 55 %-Schwelle → Reveal → Tafel + Rätselfrage
→ Antwort „1827" → Erfolg → Station 2 ohne Scratch; Fallback-Button ebenso.
Die im Test sichtbaren `vibrate`-Konsolenfehler stammen von synthetischen
Events (kein User-Activation-Flag), nicht vom Code.

### Offen
`revealText: 'ANNO · 1827'` zeigt die Rätselantwort direkt – die
Texteingabe wird zur Formsache (wie bei den anderen „vor Ort ablesen"-
Rätseln). Bei Bedarf auf eine andere Station verschieben oder als Hinweis
statt Klartext formulieren.

## Vorbereitet: Kompass-Ansicht & Audio-SFX-Fundament (Fortsetzung 2026-08-30)

Groundwork-Commit `d379b8d` – die Module sind **nirgends importiert**
(tree-shaken, JS-Bundle unverändert), nur `compass-view.css` (~1,2 kB)
wird über `index.css` schon mitgeliefert.

### `src/utils/compass.js`
- Baut auf `geoUtils.js` auf und **re-exportiert** `calculateBearing` /
  `calculateDistance` / `bearingToCompassLabel` – keine Mathe-Duplikation.
- Preußische (rheinländische) Rute: `METER_PER_RUTE = 3.7662`,
  `metersToRuten()`, `formatRuten()` (Seekarten-Ton: „keine volle Rute" /
  „X.X Ruten" / „X Ruten"). Rein dekorativ, die App zeigt daneben Meter.
- DeviceOrientation als wiederverwendbare Funktionen (bisher inline in
  `DirectionCompass.jsx`): `orientationSupported()`,
  `orientationNeedsPermission()` (iOS 13+), `requestOrientationPermission()`
  (async, gibt `'granted'`/`'denied'`), `watchDeviceHeading(onHeading)` →
  Abmeldefunktion; `webkitCompassHeading ?? (360 - alpha) % 360`.

### `src/components/compass/CompassView.jsx` + `src/theme/compass-view.css`
- Großer Messing-Kompass im 1875er-Look, komplett SVG:
  `radialGradient`/`linearGradient` fürs Messing-Gehäuse, gravierte
  72-Strich-Teilung (Haupt-/Mittel-/Nebenstriche), Windrosen-Stern,
  rot/creme Peil-Nadel, Achskappe, dezenter Glasreflex.
- Props `userLocation` / `target` / `showDistance`. Bei erlaubtem Sensor
  dreht die ganze Rose gegen die Blickrichtung (`transform: rotate(-heading)`,
  `transition 0.2s linear`), die Nadel zeigt weiter aufs Ziel
  (`rotate(bearing)`, `transition 0.3s ease-out`). Ohne Sensor: Rose fest
  nach Nord, Nadel = reine Peilung.
- Ablesung (Playfair): Himmelsrichtung + Grad + Ruten. „Kompass
  kalibrieren"-Button, wenn iOS die Freigabe verlangt.
- **Ergänzt** `DirectionCompass.jsx` (kleiner Tuschestrich-Wegweiser in der
  Distanz-Box), ersetzt ihn nicht.
- CSS: nur Layout, Ablesungstext, Button (Messingfläche mit Verlauf) und
  die `.compass-view-tick`-Beschriftung; das Metall kommt aus den
  SVG-Gradienten.

### `src/utils/sfx.js`
- Kurze haptisch-akustische UI-Effekte, rein Web Audio API (parallel zu
  `typewriterSound.js`, eigener lazy AudioContext, `unlockSfx()` für die
  erste Geste).
- `playLatch()` – „Schloss rastet ein": zwei hochpassgefilterte
  Square-Klick-Transienten (320→128 Hz / 220→88 Hz) + tiefer
  Sinus-Riegel-Thunk (140→70 Hz).
- `playBell()` – „Schiffsglocke": vier Sinus-Partiale relativ zu C5
  (Ratios 1 / 2.76 / 5.4 / 1.19), harter Anschlag (5 ms), exponentieller
  Ausklang bis 1,8 s.
- Haptik via `navigator.vibrate` (`[12,20,28]` bzw. `[30,40,60]`), aus bei
  `prefers-reduced-motion`. Respektiert den Ton-Schalter
  `kapArkonaSchillingSound` (`!== 'false'`).

### Tests
- `compass.test.js`: Rute-Umrechnung + Formatierung + Re-Export-Durchgriff
  (Ost-Peilung ≈ 90°, Label „O").
- `sfx.test.js`: Smoke – Exporte vorhanden, laufen im node-Env (kein
  AudioContext) ohne Fehler still durch.
- → **114 Tests** (2 → 3 Testdateien).

### Verifikation
`lint` · `test` 114 · `build` grün (CSS 58,78 → 60,01 kB durch
`compass-view.css`; JS **unverändert** 404,49 kB – die neuen Module sind
noch nicht eingebunden). `CompassView` temporär in `GameContainer`
gemountet und im Testserver-`dist` geprüft: Messing-Kompass rendert,
72 Striche, Nadel auf `rotate(255.88deg)`, Ablesung „256° · 97 Ruten"
korrekt – danach zurückgebaut.

### Zum Einbinden — alle erledigt
- ~~`CompassView` mounten~~ → `c039829`.
- ~~`unlockSfx()` + `playLatch()`/`playBell()` verdrahten~~ → `171590c`.
- ~~`DirectionCompass.jsx` auf `compass.js`-Helfer umstellen~~ → `eba2270`.

## Umgesetzt: CompassView als ausklappbares Instrument (Fortsetzung 2026-08-30)

Commit `c039829` – `CompassView` ist jetzt in `GameContainer.jsx`
eingebunden (nach Nutzer-Vorlage).

- **State + Button**: neuer `showCompass`-State; Button `.brass-toggle-btn`
  (`aria-expanded`, `aria-controls="compass-drawer"`) in der Haupt-Ansicht
  **zwischen** dem Karten-Block (`{showMap && …}`) und dem Rätselblock
  (`{isUnlocked ? …}`), in einer `<section aria-label="Orientierung">`.
- **Props**: `<CompassView userLocation={userLocation} target={currentStation.target} />`.
  Ohne GPS-Fix (`userLocation === null`, z. B. Testmodus ohne Standort)
  rendert `CompassView` gedimmt (`is-idle`), Nadel auf 0°, ohne
  Grad-/Ruten-Ablesung – der Fix-Fall („256° · 97 Ruten", Nadelrotation)
  wurde beim Vorbereiten schon verifiziert.
- **`compass-view.css`** ergänzt: `.expedition-instrument-section`,
  `.brass-toggle-btn` (Messing-Verlauf `#d4af37`→`#aa820a`, `is-active`-
  Zustand dunkler + Creme-Text, `width: auto` gegen die globale
  `button { width: 100% }`-Regel), `.brass-toggle-icon` (`color: inherit`
  für das `currentColor`-Icon), `.compass-drawer-content` (gestrichelter
  `--color-brass`-Rahmen, `compassSlideDown` 0.3 s), `prefers-reduced-motion`
  schaltet die Animation + Button-Transition ab.

### Abgleich mit der Vorlage
| Vorlage | Real |
|---|---|
| `src/components/game/GameContainer.jsx` | `src/components/GameContainer.jsx` |
| `import { CompassView }` (named) | Default-Export → `import CompassView` |
| `STATIONS`, `currentStation.lat` / `.lng` | `stations`, `currentStation.target.{latitude,longitude}` → `currentStation.target` direkt durchgereicht |
| `import React, { useState }` | nur `useState` (schon vorhanden; `React` → `no-unused-vars`) |
| `🧭`-Emoji | `<InkCompass size={16} />` (AntiqueIcons) – `taste`-Standard; auf Emoji umstellbar, falls gewünscht |

### Verifikation
`lint` · `test` **114** · `build` grün. JS **404,5 → 409,7 kB**
(`CompassView` + `compass.js` jetzt im Bundle), CSS 60,0 → 61,3 kB.
Im Testserver-`dist` geprüft: Button klappt aus/ein, `aria-expanded`
und `.is-active` wechseln, das Icon ist das `InkCompass`-SVG,
`CompassView` rendert im `#compass-drawer` (ohne Fix: `is-idle`), keine
Konsolenfehler.

## Umgesetzt: SFX-Kopplung + DirectionCompass-Refactor (Fortsetzung 2026-08-30)

### `171590c` – Schloss/Glocke an die Erfolgsmomente

- **`src/utils/audioUnlock.js`**: `unlockSfx()` in den bestehenden
  `unlock`-Handler ergänzt (erste `click`/`keydown`-Geste, dieselbe Stelle
  wie Speech-/Audio-Unlock). Die `click`/`keydown`-Wahl (statt
  `pointerdown` wie im Snippet) bleibt – dort bewusst so kommentiert
  (User-Activation-Spec).
- **`GameContainer.jsx` `handleAnswerSubmit`**: bei richtiger Antwort →
  `playLatch()`; bei `[5, 10, 15].includes(currentStation.id)` zusätzlich
  `setTimeout(playBell, 350)`. Meilenstein-Check über `currentStation.id`
  statt eines `completedCount`-Arguments (Stationen haben lückenlose IDs
  1–15, deckt sich mit `goodieMilestones`). Kein eigener
  `pointerdown`-`useEffect` in GameContainer – `installAudioUnlock()` aus
  `main.jsx` deckt die erste Geste schon global ab.
- Kein `hasGestured()`-Gate: `playLatch`/`playBell` laufen nur aus
  `handleAnswerSubmit` (echter Tap) bzw. dem 350-ms-Timer danach –
  innerhalb der transienten User-Activation.
- Verifiziert im Testserver-`dist` per Oszillator-Zählung: erste Geste →
  2 AudioContexts; Station 5 lösen → +3 Osc (Latch), nach 350 ms +4 Osc
  (Bell); Station 6 → nur +3 (keine Glocke); `kapArkonaSchillingSound =
  'false'` → 0 Osc.
- JS 409,7 → 411,8 kB (`sfx.js` jetzt im Bundle).

### `eba2270` – DirectionCompass nutzt `compass.js`

- Inline-Kopie der `deviceorientation`-Listener + iOS-Permission-Logik in
  `DirectionCompass.jsx` ersetzt durch `watchDeviceHeading` /
  `orientationNeedsPermission` / `requestOrientationPermission` – dieselbe
  Logik, jetzt mit `CompassView` geteilt. **−16 Zeilen.**
- Lokales `needsIOSPermission()` raus → `orientationNeedsPermission` (weiter
  als Lazy-Initializer); `handleOrientation` + `add/removeEventListener`
  raus → `watchDeviceHeading(setHeading)` (Effekt-Guard „erst nach Freigabe"
  bleibt); `requestPermission` → `await requestOrientationPermission()`,
  Prüfung `result === 'granted'` (Snippet nutzte `if (granted)` – bei
  `'granted'` **und** `'denied'` truthy).
- Render-Logik + `InkCompassFace`-SVG unverändert.
- `lint` sauber, `test` 114/114 (inkl. `compass.test.js`), Build grün,
  JS 411,8 → 411,3 kB.

## Umgesetzt: GitHub-Pages-Deploy-Workflow (Fortsetzung 2026-08-30)

`.github/workflows/deploy.yml` (`ff677ef`) – automatisiertes Pages-Deployment
des **passwortgeschützten Testserver-Builds** unter
`https://pixxpassion.github.io/kap-arkona-explorer/`.
Entscheidung mit Nutzer: Testserver-Build (nicht die ungeschützte
Live-Fassung – Live bleibt medienmodernisierer.de), Pages automatisch
aktivieren.

- **Trigger**: push auf `main` (mit `paths-ignore` für `logs/**`, `**/*.md`,
  `ci.yml` – Doku-Commits lösen kein Redeploy aus) + `workflow_dispatch`.
- **Build-Step**: `npm run build -- --mode testserver --base=/kap-arkona-explorer/`,
  `VITE_ACCESS_PASSWORD` + `VITE_ENABLE_TEST_MODE` aus Repo-Secrets als
  `env`. `--base` wird nur hier gesetzt, `vite.config.js` bleibt bei `/`
  (medienmodernisierer.de-Deploy unberührt).
- **„Secrets prüfen"-Step** bricht mit `::error::` ab, wenn die Secrets
  fehlen bzw. `VITE_ENABLE_TEST_MODE != 'true'` – so kann keine
  ungeschützte Version online gehen.
- `actions/configure-pages@v5` mit `enablement: true` → schaltet Pages
  beim ersten erfolgreichen Lauf von „deploy from branch" (alter, stale
  `gh-pages`-Branch) auf „GitHub Actions" um.
- Standard-Pattern: `build`-Job (checkout → secrets → node 22 → `npm ci`
  → build → configure-pages → `upload-pages-artifact@v3`) + `deploy`-Job
  (`actions/deploy-pages@v4`, environment `github-pages`),
  `concurrency: pages` / `cancel-in-progress: false`.

### Lokal verifiziert (Build-Kommando 1:1)
`MSYS_NO_PATHCONV=1 VITE_ACCESS_PASSWORD=… VITE_ENABLE_TEST_MODE=true
npm run build -- --mode testserver --base=/kap-arkona-explorer/`:
- `index.html`: alle Assets unter `/kap-arkona-explorer/`; `manifest`
  `scope`/`start_url` = `/kap-arkona-explorer/`; `registerSW.js` am
  Subpfad – deckt sich mit dem alten `gh-pages`-Stand.
- Passwort `leuchtturm1875` genau 1× im JS-Bundle → `PasswordGate` aktiv;
  `kapArkonaTestMode`-Code enthalten → Testmodus-Button aktiv.

### CI-Lauf `ff677ef`
- **CI**: grün (Workflow-Datei bricht die bestehende CI nicht).
- **Deploy to GitHub Pages**: `failure` **wie vorgesehen** – Step „Secrets
  prüfen" schlägt fehl (Secrets noch nicht angelegt), Build/Configure/
  Upload/Deploy alle `skipped`. Kein Build, kein Deploy, nichts online.

### Inbetriebnahme (2026-08-30, erledigt)
- Nutzer hat die Repo-Secrets `VITE_ACCESS_PASSWORD` + `VITE_ENABLE_TEST_MODE`
  angelegt.
- Erste Läufe schlugen im `deploy`-Job fehl: „Branch main is not allowed to
  deploy to github-pages due to environment protection rules" – Pages stand
  noch auf **„Deploy from a branch" (`gh-pages`)**, das `github-pages`-
  Environment ließ nur `gh-pages` zu.
- Fix (via Claude in Chrome, mit Nutzer-Konto): Settings → Pages →
  **Source = „GitHub Actions"**. Damit hat GitHub `main` automatisch zu den
  erlaubten Deployment-Branches des `github-pages`-Environments hinzugefügt
  (jetzt `gh-pages` + `main`).
- `db2030b`: `actions/checkout` + `actions/setup-node` auf `@v5` (Node-20-
  Deprecation-Warnung). `configure-pages@v5` / `upload-pages-artifact@v3` /
  `deploy-pages@v4` bleiben – dort gibt es noch keine Node-24-Fassung, die
  Warnung ist harmlos.
- Re-run des `deploy`-Jobs (Attempt 2) → **success**. Live verifiziert:
  <https://pixxpassion.github.io/kap-arkona-explorer/> zeigt das
  `PasswordGate` („Test-Version – nicht öffentlich", Zugangscode-Feld) –
  d. h. `VITE_ACCESS_PASSWORD` ist im Bundle, Base-Pfad korrekt (React
  rendert, Assets laden).

### Aufräumen (erledigt)
- **Stale `gh-pages`-Branch gelöscht** – `git push origin --delete gh-pages`
  (nach expliziter Nutzer-Freigabe) + lokaler Branch weg. Nur noch `main`.
  Optional bleibt: die `gh-pages`-Regel im `github-pages`-Environment
  entfernen (harmlos – matcht nur nichts mehr).
- README-Deploy-Abschnitt um Pages-URL + Secrets ergänzt (`README.md`).

## Umgesetzt: "Station erreicht"-Stempel + iOS-Safari-Fix (Fortsetzung 2026-08-30)

### `cf6f262` – Stempel beim Lösen einer Station
`STAMP_TYPES.STATION_COMPLETED` war seit der `{ stamp, isNew }`-API-
Umstellung tote Daten – beim Lösen gab es keinen Stempel („geht aber
nicht", Nutzer). Jetzt: im `success-section`-Block von `GameContainer`
`<StampStamp stamp={STAMP_TYPES.STATION_COMPLETED} seed={`station-<id>`}
isNew />` – mit `stampImpact`-Animation + Haptik, konsistent zu den
Meilenstein-Stempeln.
- `StampStamp`: optionaler `seed`-Prop (Default `stamp.id`); GameContainer
  gibt `station-<id>` → 15 leicht unterschiedliche Neigungswinkel statt
  15× derselbe. Bestehende Aufrufe (`ExplorerLogbook`) unverändert.
- `logbook-aging.css`: `.station-stamp` (zentrierter Wrapper).

### `2471c2d` – Stempel waren auf dem Gerät unsichtbar
Ursache-1 (vom Nutzer erkannt): `cf6f262` war noch **nicht gepusht/deployt**
→ die getestete Pages-Seite hatte den Stempel gar nicht.
Ursache-2 (vorsorglich behoben): `.stamp-container` nutzte
`mix-blend-mode: multiply` **+** `mask-image` **+** `transform` **+**
`animation` – diese Kombination rendert auf iOS-Safari teils komplett
nicht (Stempel unsichtbar, auch die Meilenstein-Stempel). Beides entfernt,
nur noch `opacity: 0.92` für den verblassten Eindruck; `white-space:
nowrap` gegen Umbruch. Rand + Text jetzt überall sichtbar.

Push `85fb8eb..2471c2d` → CI grün, **Deploy-Workflow grün** (Attempt 1,
`main` ist jetzt erlaubter Branch). **Live verifiziert** auf
<https://pixxpassion.github.io/kap-arkona-explorer/>: Station gelöst →
Stempel „KAP ARKONA 1875 / STATION ERREICHT" erscheint sichtbar auf der
Erfolgskarte, deployedes CSS ohne `mix-blend-mode`, `opacity 0.92`.

## Umgesetzt: Karten-Stempel, Testmodus raus, Impressum-Link (`40ebd4d`)

Drei Wünsche des Nutzers in einem Rutsch.

### 1. Stempel je gesammeltem Wahrzeichen
- `StampStamp` bekam einen **`compact`-Modus** (`.stamp-container--compact`:
  nur `stamp.title`, `.stamp-compact-label` 0.44 rem, kleiner Rand/Padding).
- `ExplorerLogbook`: jede freigeschaltete Sammelkarte trägt jetzt einen
  Eck-Stempel `<StampStamp stamp={STATION_COMPLETED} seed={`landmark-<id>`}
  compact />` – `position: absolute; right/bottom: 4px`.
- Die Meilenstein-Stempel (5/10/15) kollidierten dadurch mit den
  Karten-Stempeln → verkleinert (`.stamp-layer .stamp-container` padding
  + `.stamp-subtitle` 0.52 rem / `.stamp-title` 0.78 rem) und die
  `.stamp-slot`-Positionen neu gelegt (slot-1 oben rechts, slot-2
  Zeilenlücke links, slot-3 unten **links** – weg von den Karten-Stempeln
  unten rechts).
- Inline-`fontSize` in `StampStamp` → Klassen `.stamp-subtitle` /
  `.stamp-title` (damit `.stamp-layer` sie überschreiben kann).

### 2. GPS-Testmodus entfernt
`import.meta.env.VITE_ENABLE_TEST_MODE` wird nirgends mehr gelesen:
- `GameContainer.jsx`: `TEST_MODE_AVAILABLE`, `TEST_MODE_KEY`, State
  `testModeOn` + Persist-Effekt, `|| testModeOn` in der GPS-Überwachung,
  der `.test-mode-badge`-Button – alles raus. Ohne Vor-Ort-Besuch schaltet
  man eine Station jetzt über den **Foto-Nachweis** frei.
- `App.css`: `.test-mode-badge` / `.is-on` gelöscht.
- `deploy.yml`: `VITE_ENABLE_TEST_MODE` aus dem Secret-Check (jetzt „Secret
  prüfen", nur noch `VITE_ACCESS_PASSWORD`) und der Build-`env`.
- `README.md` + `.env.testserver.local`: Erwähnungen entfernt.
- **Für den Nutzer:** das GitHub-Repo-Secret `VITE_ENABLE_TEST_MODE` kann
  weg (bleibt sonst ungenutzt liegen – harmlos). `PasswordGate`
  (`VITE_ACCESS_PASSWORD`) bleibt.

### 3. Footer-Link „Impressum & Datenschutz"
`App.css` `.footer-link`: `color: #999` → `var(--secondary-blue)` (`#1d4e73`),
`0.8` → `0.85 rem`. Auf dem Pergament war das Grau zu blass.

### Verifikation
`lint` · `test` 114 · `build` grün (JS leicht kleiner – Testmodus-Code
raus). Push `91987a8..40ebd4d` → **CI grün, Pages-Deploy grün** (nur noch
`VITE_ACCESS_PASSWORD` nötig). **Live verifiziert** auf
<https://pixxpassion.github.io/kap-arkona-explorer/>: Eck-Stempel „STATION
ERREICHT" auf allen 6 freigeschalteten Karten (unten rechts), 2
Meilenstein-Stempel ohne Überlagerung, kein Testmodus-Button,
Impressum-Link `rgb(29,78,115)` (klar lesbar).

## Offen / nächste sinnvolle Schritte

- Karte + Leaflet per `React.lazy` / `Suspense` code-splitten (First Paint).
- `speechSynthesis`: männliche Stimme wird nur per Namensheuristik erkannt –
  optional konfigurierbare Wunschstimme.
- Perspektivisch: TypeScript für `src/data/*` (mit `Station`-Interface).
- Dev-Server-HTTPS: `basic-ssl` erschwert automatisierte Browser-Checks –
  ggf. Umgebungsvariable zum Abschalten fürs lokale Testen.
