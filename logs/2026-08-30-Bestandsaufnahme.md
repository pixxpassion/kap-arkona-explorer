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

## Session-Abschluss 2026-08-30

Alle Sofort- und Infrastruktur-Maßnahmen umgesetzt, committet und gepusht
(`7411e36..ddaf538`), CI grün. Working Tree clean.

### Fokus für die nächste Session (mit Nutzer abgestimmt, priorisiert)

Thema: **funktionale Optimierung & Performance**

1. **Audio-Precache umstellen** – die 21 `public/audio/*.mp3` aus dem
   `workbox.globPatterns`-Precache herausnehmen und in `runtimeCaching`
   (`CacheFirst`, eigener Cache-Name, Ablauf wie bei den Kartentiles)
   überführen. Ziel: Erstinstall am Kap deutlich unter 5,75 MB.
   Datei: `vite.config.js`.
2. **Web-Speech absichern** – `speechSynthesis.getVoices()` ist beim ersten
   Aufruf oft leer; `voiceschanged`-Event in `src/utils/speech.js` einbauen,
   damit die deutsche Stimme ab Station 1 verlässlich gewählt wird.
3. **Modal-A11y** – `src/components/Modal.jsx` auf das native `<dialog>`
   umstellen (Fokus-Trap, Escape, Screenreader). Betrifft Onboarding- und
   Impressum-Modal; Styles in `App.css` (`.modal-*`) entsprechend anpassen.

### Danach (nicht abgestimmt, aus der Finding-Liste)

- README-Deploy-Abschnitt um den `gh-pages`-Testserver ergänzen.
- Karte + Leaflet per `React.lazy` / `Suspense` code-splitten.
- Perspektivisch: TypeScript für `src/data/*` (mit `Station`-Interface).
