---
title: Chronisten-Urkunde, Logbuch-Gesten & Stimm-Sperre
date: 2026-08-30
tags:
  - projekt/kap-arkona
  - devlog
  - feature
status: live
---

# Kap Arkona Entdecker – Urkunde, Logbuch-Gesten, Stimm-Sperre

Zweite Feature-Runde am 30.08.2026 (nach der Modernisierungs-Session,
Dev-Log [[2026-08-30-Bestandsaufnahme]]). Alle Commits auf `main`, jeweils
CI + GitHub-Pages-Deploy grün, Tests von 117 → **121**.

## Chronisten-Urkunde (`605f134`)

Neue Komponente `src/components/CertificateModal.jsx` – nutzt das
bestehende native-`<dialog>`-`Modal`.

- Zeichnet nach allen 15 Stationen ein „Königlich Preußisches Patent"
  von 1875 komplett lokal auf ein 1200×1600-`<canvas>`: Pergament mit
  Alters-/Lichtflecken + Vignette, Messing-Doppelrahmen mit Eck-Ornamenten,
  Zierlinie, unregelmäßiges rotes **Wachssiegel** („KAP ARKONA / 1875"
  + zwei Sterne, geprägter Innenring), Unterschrift Schillings.
- **Namenseingabe** (`maxLength 32`, `autoComplete="off"`) – nur zur
  Laufzeit auf den Canvas gezeichnet, nie gespeichert/übertragen. Ohne
  Eintrag: „ein wackerer Entdecker". `fitFont()` verkleinert lange Namen
  (und den Titel) automatisch.
- Farben aus den `@theme`-Tokens via `getComputedStyle` (Canvas kann kein
  `var()`), Schrift Playfair Display / Courier Prime – vor dem Zeichnen
  via `document.fonts.load` abgewartet, sonst „springt" der Text.
- **Teilen:** `navigator.share()` mit `File`; Fallback auf
  PNG-Blob-Download (Object-URL). `AbortError` beim Abbrechen löst *keinen*
  Download aus. `busy`-State während `toBlob`.
- Beim Öffnen `sfx.playBell()` + festliches Vibrationsmuster
  `[100, 50, 100, 50, 200]` via `triggerHaptic` (Ref-Guard gegen
  StrictMode-Doppelläuten).
- Neue Theme-Datei `src/theme/certificate.css` (in `index.css`).
- `GameContainer.jsx`: öffnet die Urkunde nach dem Finale **einmal
  automatisch** (`certificateShownRef`) + Finale-Button zum erneuten
  Aufrufen; `resetGame` setzt beides zurück.
- Abweichung von der Nutzer-Vorlage: `import { playBell } from '../utils/sfx'`
  gibt es nicht mehr → `sfx.playBell()` aus `sfxSynthesizer`; kein
  bespoke `.certificate-modal-overlay`, sondern das a11y-feste `Modal`;
  Emojis (📜/🏛️) durch `Ink`-Icons ersetzt (taste-Regel).
- Verifiziert im `dist` am Mobile-Viewport: Auto-Open am Finale, Canvas
  rendert das komplette Patent inkl. Siegel, Live-Personalisierung,
  Download-Fallback greift, Button-State erholt sich.

## Logbuch: Wisch-Geste + Pergament-Knistern (`eb8268f`)

- `sfxSynthesizer.js`: neue Methode `playPaperRustle()` (+
  `renderPaperRustleAudio`) – abklingendes Rauschen durch einen von
  1200 → 600 Hz fallenden Bandpass (`Q 2`), `gain 0.18 → 0.001` über
  0,12 s, über `duckingNode`; `triggerHaptic(8)` vor dem Ton-Gate. Folgt
  dem `render*Audio()`-Muster. +1 Assertion in `sfxSynthesizer.test.js`.
- `ExplorerLogbook.jsx`: der offene Tagebuch-Eintrag reagiert auf
  horizontales Wischen (`onTouchStart/Move/End`, Schwelle **50 px**) und
  blättert zur vorherigen / nächsten **freigeschalteten** Seite; nach
  links = vorwärts. `playPaperRustle()` beim Blättern **und** beim
  Aufschlagen einer Karte. `openEntry` ohne Seiteneffekt im
  State-Updater (StrictMode-sauber).
- `logbook-aging.css`: `.mj-logbook-journal { touch-action: pan-y }`
  (vertikales Scrollen bleibt), `.mj-logbook-flip-hint` nur auf
  Touch-Geräten (`@media (hover: hover) and (pointer: fine)` blendet ihn
  am Desktop aus – dort führt das Kartenraster zu jedem Eintrag).
- Es gibt **kein** `LogbookModal.jsx` und keine
  `stations/stamps/stats`-Reiter – die Vorlage wurde auf die reale,
  inline gerenderte `ExplorerLogbook`-Komponente mit ihren 6
  Wahrzeichen-Seiten übertragen.
- Verifiziert im `dist` per synthetischen `TouchEvent`s: Wisch nach
  links/rechts blättert, Wisch < 50 px löst nichts aus (0 Audio-Knoten),
  `touch-action` + Hinweis-Sichtbarkeit korrekt.

## Stimm-Sperre + Meilenstein-Stempel 10 (`71d2ca0`)

### Nur eine Schilling-Stimme gleichzeitig
- Neu `src/utils/voicePlayback.js`: geteilte Sperre
  (`acquireVoice` / `releaseVoice` / `isVoiceBusy`), Halter = Instanz-Token.
- `SchillingDialogue.jsx` belegt die Sperre beim Start der vertonten
  Ausgabe (MP3 **oder** Web-Speech via `speakText(text, onEnd)`). Läuft
  anderswo schon eine Stimme (Stationstext, während ein Logbuch-Eintrag
  geöffnet wird), bleibt die zweite Notiz **still** – nur der
  Schreibmaschinen-Effekt läuft. `handleSkip` stoppt nur die *eigene*
  Ausgabe (`holdsVoiceRef`), damit eine stumme Notiz die fremde nicht
  abwürgt. +4 Vitest-Tests → **121**.
- Verifiziert im `dist`: nach der Geste spielt `schilling-station-12.mp3`;
  öffnet man dabei einen Logbuch-Eintrag → kein zweites Audio, Typewriter
  läuft; nach Ende der Stationsstimme spielt der Eintrag beim erneuten
  Öffnen normal.

### Meilenstein-Stempel „10 Stationen"
- `stamps.js` `MEILE_10`: Untertitel `HALBINSEL-ERKUNDET` →
  **`KAP ARKONA ERKUNDET`**.
- Farbe hellgold (`--color-brass` `#c5a059`) → dunkles Messing
  (`--color-brass-dark` `#8a6b33`). Die `opacity` war schon bei **allen**
  Stempeln `0.92` – das helle Gold verschwand nur auf dem bei
  aging-level 2 vergilbten Pergament. Jetzt so kontrastreich wie die
  anderen (Wachsrot `#a13d2d` / Tinte), weiterhin als „Messing"-Meilenstein
  erkennbar. Im Screenshot bestätigt.

## Offen / nächste sinnvolle Schritte

- `navigator.share`-Sheet + Vibrationsmuster (Urkunde, Logbuch, Glocke)
  nur auf echtem Gerät final prüfbar.
- Karte + Leaflet per `React.lazy` / `Suspense` code-splitten.
- Blockierte zweite Stimme startet **nicht** nach, wenn die Sperre frei
  wird (bewusst „blockieren" statt „nachholen") – bei Bedarf per
  Subscriber nachrüstbar.
- Perspektivisch TypeScript für `src/data/*`.
