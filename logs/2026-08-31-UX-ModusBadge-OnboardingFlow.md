---
title: UX – Modus-Badge im Header, Onboarding-Flow, Kompass ausgeblendet
date: 2026-08-31
tags:
  - projekt/kap-arkona
  - devlog
  - ux
status: live
---

# Kap Arkona Entdecker – UX-Optimierungen (Session 31.08.2026, Teil 2)

Nach dem Light-Modus (siehe [[2026-08-31-Spielmodus-LightMode]]) drei
UX-Anpassungen in zwei Commits. Beide auf `main`, **Tests 127 grün**,
`lint`/`build` sauber.

| Commit | Inhalt | Deploy |
|--------|--------|--------|
| `f52afbb` | Modus-Badge im Header, `gameMode`-State in App.jsx, Kompass raus | CI #34 / Pages #14 |
| `684832f` | Onboarding-Reihenfolge: Modus → Start → Begleiter | CI #35 / Pages #15 |

---

## 1. Modus-Badge im Header statt „i" (`f52afbb`)

Das „i"-Symbol oben links (`.header-info-btn` mit `InfoIcon`) ist ersetzt
durch ein **Messing-Badge**, das den aktiven Spielmodus anzeigt und beim
Antippen weiterhin das `OnboardingModal` öffnet:

- Historian → `[InkScrollAlert]` **Rätsel-Tour**
- Light → `[InkCamera]` **Foto-Safari**

- Keine Emojis (`Ink`-Strich-Icons statt 📜/📷/⚙️), Farben nur über
  `@theme`-Tokens (Messing-Verlauf wie `.mj-btn-brass`).
- `App.css`: `.header-info-btn` → `.header-mode-badge`.
- Bewusst Messing (Erzählungs-Ebene) im blauen Marken-Header, weil das
  Badge einen Spielbegriff zeigt – im Code kommentiert (taste-Regel
  „an der Grenze → Erzählung").
- `InfoIcon` bleibt in `UiIcons.jsx` (als ungenutzt vermerkt).

## 2. `gameMode`-State nach App.jsx angehoben (`f52afbb`)

Damit **Header-Badge und Spielansicht sofort** auf einen Moduswechsel im
Onboarding reagieren (vorher hätte das Badge erst nach Reload gestimmt):

- **`App.jsx`**: `const [gameMode, setGameModeState] = useState(getInitialGameMode)`
  + `changeMode(next)` (State + `setGameMode()`-Persist). `getInitialGameMode`
  respektiert weiter den `?mode=`-Query.
- **`GameContainer.jsx`**: neuer `gameMode`-Prop, ersetzt das
  `getGameMode()` im Render. `isLight = gameMode === GAME_MODES.LIGHT`.
- **`OnboardingModal.jsx`**: Props `mode` / `onSelectMode` statt eigenem
  `useState` – `selectMode` ruft `onSelectMode(next)` + `sfx.playLatch()`.
- Verifiziert: Foto-Safari im offenen Modal wählen → Badge wechselt
  **sofort**, GameContainer schaltet live auf `LightStationView` +
  `ExplorerPinProgress`; beidseitig sauber.

## 3. Historischer Kompass aus dem Hauptscreen (`f52afbb`)

Der große Messing-Kompass (`CompassView`, „Historischen Kompass ausklappen")
wird **nicht mehr gerendert**:

- `GameContainer.jsx`: Import, `showCompass`-State und die
  `<section className="expedition-instrument-section">` (Toggle + Drawer)
  entfernt. `InkCompass`-Import raus (war nur dort).
- **`CompassView.jsx` + `compass-view.css` bleiben im Repo** (Kommentar im
  Import-Block von GameContainer).
- Der kleine Tuschestrich-Wegweiser (`DirectionCompass` in der Distanz-Box)
  bleibt unverändert.

## 4. Onboarding-Reihenfolge (`684832f`)

Neuer Fluss im `OnboardingModal`: **Modus wählen → Spiel starten →
Zusatzinfo**.

| # | vorher | nachher |
|---|--------|---------|
| 1 | Begrüßung | Begrüßung |
| 2 | Modus-Karten | Modus-Karten |
| 3 | So findest du… / GPS / Goodies | **Start-Button** (`Expedition starten` / `Foto-Safari starten`, modusabhängig) |
| 4 | Wegweiser-Box | **Wegweiser-Box** (direkt unter dem Button) |
| 5 | Rechtshinweis | So findest du… / GPS / Goodies |
| 6 | **Start-Button** („Los geht's!") | Rechtshinweis |
| 7 | Cache-Hinweis | Cache-Hinweis |

- Start-Button-Label jetzt modusabhängig (vorher fix „Los geht's!").
- Verifiziert (DOM-Reihenfolge Historian + Light, Button-Label je Modus,
  Wegweiser-Box als direkter Nachbar des Buttons).

---

## Nebenbefund

`preview_start` (Browser-Tool) legt ein `.claude/launch.json` an
(generische `npm run dev`-Config, Port 5173) – **nicht committet**, liegt
untracked. Entscheidung offen, ob es ins Repo soll.

## Offen / nächste sinnvolle Schritte

- Light-Feinschliff vor Ort (echtes GPS/Kamera).
- Entscheidung: Modus-Auswahl dauerhaft öffentlich, oder Foto-Safari
  vorerst nur per `?mode=light`.
- `compass-view.css` enthält jetzt tote Regeln (`.expedition-instrument-
  section`, `.brass-toggle-btn`) – bei endgültigem Verzicht auf den
  Drawer entfernen.
- Karte + Leaflet per `React.lazy` code-splitten.
