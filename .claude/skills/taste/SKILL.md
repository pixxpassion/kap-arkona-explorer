---
name: taste
description: >
  Design- und UI-Richtlinien für den Kap Arkona Entdecker. Definiert die zwei
  visuellen Ebenen (echte kap-arkona.de-Marke für die App-Hülle, 1875er
  Maritim-Logbuch für die Spielerzählung), die Farb-Tokens, Schriften, den
  tintenstrich-Icon-Stil, Texturen, Bewegung und Schillings Sprechweise.
  Vor jeder UI-/CSS-/Icon-Änderung lesen und den Entwurf dagegen prüfen.
---

# Taste — Kap Arkona Entdecker

Dieses Dokument ist der verbindliche Maßstab für alles Sichtbare in der App.
Neue oder geänderte UI wird **gegen diese Regeln geprüft**, bevor sie eincheckt.

## Grundsatz: zwei getrennte visuelle Ebenen

| Ebene | Wo | Look | Zweck |
|-------|----|----|-------|
| **Marken-Hülle** | `<header>` (App.jsx), `DesktopNotice`, `PasswordGate` | Echte CI von kap-arkona.de/wegweiser | Wiedererkennung als offizielles Angebot |
| **Spielerzählung** | Alles in `<main>` — `GameContainer` und alle Kind-Komponenten, Modals | 1875er Forscher-Logbuch (Preußischblaue Tinte, Messing, Siegelwachs, Pergament) | Immersion in Schillings Welt |

**Regel:** Die beiden Ebenen werden nie vermischt. Marken-Blau/-Gold gehören
nur in die Hülle, Pergament/Tinte/Messing nur in die Erzählung. Wenn ein neues
Element an der Grenze sitzt, im Zweifel der Erzählungs-Ebene zuordnen und im
Code kurz kommentieren, warum.

## Farb-Tokens

Farben werden **immer über CSS-Variablen** referenziert, nie als roher Hex-Wert
in Komponenten oder neuen Regeln. Kanonische Quelle ist
`src/theme/maritime-journal.css` (`@theme`); `src/App.css :root` spiegelt
dieselben Werte für Nicht-Tailwind-CSS.

### Spielerzählung (1875)
| Rolle | Token | Wert |
|-------|-------|------|
| Haupttext / Linien | `--color-ink` / `--primary-blue` | `#003153` |
| Text aufgehellt | `--color-ink-soft` / `--secondary-blue` | `#1d4e73` |
| Akzent Messing | `--color-brass` / `--accent-gold` | `#c5a059` |
| Messing hell | `--color-brass-light` | `#e0c27e` |
| Messing dunkel (Rahmen/Kante) | `--color-brass-dark` / `--accent-gold-dark` | `#8a6b33` |
| Siegelwachs (destruktiv/wichtig) | `--color-wax` / `--error-red` | `#8b1e1e` |
| Wachs hell / dunkel | `--color-wax-light` / `--color-wax-dark` | `#b33636` / `#5c1212` |
| Pergament (Flächen, hell→dunkel) | `--color-parchment-50…400` | `#faf3e0 · #f3e6c8 · #e8d5a8 · #d9be82 · #b8985f` |
| Creme (Text auf dunklem Grund) | `--color-cream` / `--text-light` | `#fbf3df` |
| Erfolg | `--success-green` | `#2f7a4f` |

### Marken-Hülle
| Rolle | Token | Wert |
|-------|-------|------|
| Marken-Blau | `--brand-blue` | `#0a3366` |
| Marken-Blau hell | `--brand-blue-light` | `#1a5fa8` |
| Marken-Gold | `--brand-gold` | `#f0c040` |

## Schriften

- **Playfair Display** (`--font-header`) — alle Überschriften, Button-Labels,
  Kursiv-Auszeichnungen, Kompass-Himmelsrichtungen. Serif, elegant.
- **Courier Prime** (`--font-log`) — Schillings Depeschen-/Logbuchtext und der
  Schreibmaschinen-Effekt. Monospace.
- **System-Sans** (`--font-ui`: Helvetica/Arial) — **nur** in der Marken-Hülle
  (Header-`h1`, DesktopNotice, PasswordGate).
- Schriften werden **lokal** aus `src/assets/fonts/*.woff2` geladen
  (`src/theme/fonts.css`), auf Latein/Deutsch subgesettet. **Nie** Google Fonts
  oder ein anderes CDN — DSGVO (LG München I, 20.01.2022).

## Icons & Skizzen

- Innerhalb der Erzählung: **nur Strich, kein Fill.** `stroke="currentColor"`,
  `fill="none"`, `strokeLinecap`/`strokeLinejoin: "round"`, `strokeWidth` ~1.4–2.4.
  Wirkt wie Kupferstich/Radierung, nicht wie Flat-Icon. Quelle:
  `src/components/icons/AntiqueIcons.jsx`, Landmarken:
  `src/components/LandmarkSketch.jsx`.
- Neuer Icon-Bedarf in der Erzählung → **neues `Ink…`-Icon** in `AntiqueIcons.jsx`
  ergänzen, kein fremdes Icon-Set importieren.
- `lucide-react` gilt als Altlast (nur `Info`, `Smartphone` in der Hülle) und
  soll entfernt werden — nicht für neue Stellen verwenden.
- Dekorative SVG/`img` bekommen `aria-hidden="true"`; Icon-only-Buttons ein
  `aria-label`.

## Textur & Ornament

Alles **ohne Bilddateien**, damit es offline an der Steilküste funktioniert:

- **Pergament** = gestapelte `radial-gradient`-Flecken + feine Körnung über
  `feTurbulence`-SVG-Daten-URI (siehe `.app-layout`, `.mj-card`,
  `.mj-dispatch-note`).
- **Messing-Kante** = Doppellinie aus `border` + nach innen versetztem
  `outline` (`outline-offset` −4 bis −9 px).
- **Siegelwachs** = radialer Verlauf + unregelmäßiger `border-radius`
  (`42% 58% 51% 49% / …`).
- **Depeschen-Notiz** leicht gekippt (`transform: rotate(-1.1deg)`) mit
  Messing-„Pinnnadel" (`.mj-dispatch-pin`).
- Vignette/Alterung dezent, nie so stark, dass Text an Kontrast verliert.

## Bewegung

- Kurz und ruhig: `popIn`, `slideUp`, `mj-card-reveal` — 0,15–0,5 s, `ease-out`
  bzw. sanfter Overshoot.
- Schreibmaschine: 32 ms/Zeichen (`useTypewriter` Default), immer mit
  „antippen zum Überspringen".
- Kein Dauer-Loop, kein Parallax, kein Auto-Karussell.

## Schillings Stimme (Text-Ton)

- Alter Leuchtturmwärter, ~1875. Anrede „mein Freund", „Fremder", „Moin".
- Verwittert, seemännische Bilder („die See nimmt sich, was ihr gebührt").
- Zahlen im Fließtext **ausgeschrieben** („Einhundertelf Stufen", nicht „111") —
  außer in der Rätsel-Lösung selbst.
- Faktentreu: historische Jahreszahlen/Angaben müssen stimmen.
- Ruhig und einladend, nie albern, nie modern-flapsig.

## Harte Rahmenbedingungen

- **Offline zuerst:** keine externen Requests zur Laufzeit (Fonts lokal,
  Textur per CSS/SVG, Karten-Tiles nur `map.kap-arkona.de` mit Runtime-Cache).
- **Mobile zuerst:** einspaltiges Flex-Layout, `max-width: 600px`
  (`.app-layout`). Keine Desktop-only-Interaktionen (Hover darf nichts
  Wesentliches verstecken).
- **DSGVO:** kein Google Fonts/Analytics/CDN; Standort & Kamerabild nur lokal.
- **A11y-Basis:** sichtbarer Fokus, `aria-label` an Icon-Buttons, dekoratives
  `aria-hidden`, ausreichender Textkontrast auf Pergament.

## Prüf-Checkliste für Änderungen

1. Richtige Ebene? (Marke vs. Erzählung nicht vermischt)
2. Farben nur über `var(--…)`, keine neuen Hex-Werte?
3. Schrift: Playfair für Titel, Courier für Logbuchtext, Sans nur in der Hülle?
4. Neue Icons als `Ink…`-Strich-Icon, kein Fremd-Set?
5. Textur/Ornament ohne Bilddatei, offline-fest?
6. Bewegung kurz, `ease-out`, überspringbar?
7. Schilling-Text im richtigen Ton, Zahlen ausgeschrieben, Fakten geprüft?
8. Mobile 320–430 px geprüft, Fokus & `aria-label` vorhanden?
