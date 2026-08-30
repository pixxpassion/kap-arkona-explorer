---
title: Kap Arkona Explorer 1875 - Live Release & Doku
date: 2026-08-30
tags:
  - projekt/kap-arkona
  - pwa
  - release
  - marketing
  - devlog
status: live
url: https://pixxpassion.github.io/kap-arkona-explorer/
---

# 🌊 Kap Arkona Explorer 1875 – Live Release

> **Testserver (passwortgeschützt):** [pixxpassion.github.io/kap-arkona-explorer/](https://pixxpassion.github.io/kap-arkona-explorer/)
> **Öffentliche Live-Fassung:** Deploy zu medienmodernisierer.de (ohne Passwort, `vite build` ohne `--mode testserver`)
> **Status:** Deploy #7 erfolgreich ✅ | 117 Vitest-Tests grün 🟢 | CI grün

> [!warning] Vor jeder Veröffentlichung prüfen
> Die **GitHub-Pages-URL** oben zeigt die **passwortgeschützte Testfassung** („Test-Version – nicht öffentlich"). Für Blog- und Social-Media-Beiträge, die sich an Gäste richten, muss die **öffentliche Live-URL** eingesetzt werden – nicht der Pages-Link. In den Vorlagen unten ist die URL als `LIVE-URL-EINSETZEN` markiert.

---

## 📌 Übersicht & Technische Highlights

- **Haptisch-akustische Immersion:** Prozedurale Web-Audio-API-Effekte (Schloss-Einrasten, Schiffsglocke, Taschenuhr-Ticken) mit synchronem Haptik-Feedback (`navigator.vibrate`) und automatischem Sound-Ducking (−70 %) während der Sprachausgabe von Leuchtturmwärter Schilling.
- **Historischer Kompass:** Analoge Messing-Instrumenten-Optik mit Live-Sensorik (`DeviceOrientation`), Peil-Funktion und historischen Längenmaßen in preußischen Ruten (1 Rute ≈ 3,76 m).
- **Vor-Ort-Rätselmechanik:** Interaktives Freikratzen historischer Inschriften via HTML5-Canvas mitsamt barrierefreiem Motorik-Fallback; tolerante Antwortprüfung (Levenshtein), exakt bei Zahlen.
- **Atmosphärisches Logbuch:** Dynamisch vergilbendes digitales Papier mit gestufter Alterung, sechs Wahrzeichen-Sammelkarten und Meilenstein-Stempeln (5 / 10 / 15 Stationen).
- **Offline-First:** Precache auf ~1,0 MB reduziert (Sprachaufnahmen erst beim ersten Abspielen im Laufzeit-Cache) – flüssiges Entdecken ohne Mobilfunknetz am Steilufer.

---

## 📝 Textvorlage: Dev-Log (intern, Obsidian)

```markdown
---
title: Release Kap Arkona Explorer 1875
date: 2026-08-30
tags:
  - projekt/kap-arkona
  - devlog
  - release
status: live
---

# Release: Kap Arkona Explorer 1875

**Deploy:** GitHub Pages #7 ✅ · CI grün · 117 Vitest-Tests grün
**Commit:** `<hash>` auf `main`

## Was ist drin
- Audio-Synthesizer (`sfxSynthesizer.js`): Messingschloss / Taschenuhr / Schiffsglocke,
  je Effekt eigene `render*Audio()`-Methode, synchrone Haptik, Sprach-Ducking −70 %.
- Historischer Messing-Kompass (`CompassView`) + Kompassnadel, Peilung in preußischen Ruten.
- Freikratz-Rätsel (`ScratchReveal`) an Station 1, Motorik-Fallback.
- Logbuch-Stempel- & Alterungssystem, Station-erreicht-Stempel je Sammelkarte.
- GPS-Testmodus entfernt – Freischaltung vor Ort per GPS-Radius oder Foto-Nachweis.
- PWA-Precache ~5,7 MB → ~1,0 MB (Audio per `runtimeCaching`).

## Verifikation
- `npm run lint` sauber
- `npm test` → 117 grün
- `npm run build` grün
- Live geprüft: <https://pixxpassion.github.io/kap-arkona-explorer/> (PasswordGate + Base-Pfad)

## Offen
- Karte/Leaflet per `React.lazy` code-splitten
- Wunsch-Stimme der Sprachausgabe nur per Namensheuristik
```

---

## 📰 Textvorlage: Blog / Website

```markdown
# Kap Arkona Explorer 1875: PWA-Historien-Simulation geht live

Mit dem neusten Release verbindet der **Kap Arkona Explorer** moderne
Progressive-Web-App-Technologie mit einer stimmigen 1875er-Historien-Simulation
direkt vor Ort auf Rügen. Leuchtturmwärter Schilling begleitet die Tour über
15 Stationen rund um Kap Arkona, Vitt und Putgarten.

### Highlights für Entdecker & Entwickler

* **Audio & Haptik:** Mechanisches Schloss-Rasten und Schiffsglocken ohne
  Ladezeiten – prozedural im Browser erzeugt, synchron mit spürbaren Schwingungen.
* **Messing-Kompass:** Richtungsweisung zur nächsten Station in echten
  preußischen Ruten, mit Live-Sensorik des Smartphones.
* **Rätsel-Canvas:** Verwitterte historische Inschriften vor Ort mit dem
  Finger freikratzen – mit barrierefreiem Alternativweg.
* **Digitales Logbuch:** Sammelkarten der Wahrzeichen und Poststempel auf
  Papier, das mit dem Fortschritt sichtbar altert.
* **Offline bereit:** Einmal laden, am empfangsschwachen Steilufer ganz ohne
  Netz weiterspielen. Keine App-Store-Installation nötig.

Direkt im Smartphone-Browser ausprobieren:
**LIVE-URL-EINSETZEN**

Technisch: React 19, Vite 8, Tailwind v4, Workbox-PWA. Kein Backend – Spielstand,
Standort und Kamerabild bleiben auf dem Gerät. 117 automatische Tests, CI-Pipeline,
DSGVO-konform (Schriften lokal, kein Tracking).
```

---

## 📱 Textvorlage: Social Media

### Facebook / Instagram (lang, gästeorientiert)

```
🏛️ Neu am Kap Arkona: Gehe auf Zeitreise ins Jahr 1875! 🌊

Entdecke die Leuchttürme und historischen Stätten am Kap Arkona auf völlig
neue Weise. Mit dem digitalen „Kap Arkona Explorer" begleitet dich
Leuchtturmwärter Schilling interaktiv über dein Smartphone!

Das erwartet dich:
🧭 Historischer Messing-Kompass & Entfernungen in preußischen Ruten
🧩 Interaktive Rätsel vor Ort (Inschriften freikratzen, Geheimnisse lüften)
📜 Dein persönliches digitales Logbuch mit Sammler-Stempeln
🔊 Originalgetreue Geräuschkulisse & Sprachausgabe

Einfach den Link im Smartphone-Browser öffnen – ganz ohne
App-Store-Installation und voll offline-fähig vor Ort:

👉 LIVE-URL-EINSETZEN
```

### LinkedIn / Fachpublikum (Tech-Fokus)

```
Kap Arkona Explorer 1875 ist live. 🟢

Eine Progressive Web App als GPS-Schnitzeljagd über 15 Stationen am Kap Arkona –
gebaut mit React 19, Vite 8, Tailwind v4 und Workbox.

Was mir daran Spaß gemacht hat:
• Prozedurale Web-Audio-API-Effekte (Schloss, Schiffsglocke) statt Sounddateien
  – synchron gekoppelt mit navigator.vibrate, plus Sound-Ducking während der
  Sprachausgabe.
• DeviceOrientation-Kompass mit Peilung in preußischen Ruten.
• Freikratz-Rätsel auf HTML5-Canvas, mit barrierefreiem Fallback.
• Offline-First: Precache von ~5,7 MB auf ~1,0 MB gedrückt (Audio per
  Runtime-Cache), 117 Tests, CI-Pipeline, kein Backend.

Ausprobieren (am Smartphone): LIVE-URL-EINSETZEN
```

### Mastodon / X (kurz)

```
🌊 Kap Arkona Explorer 1875 ist live: GPS-Schnitzeljagd als Offline-PWA,
15 Stationen, Messing-Kompass in preußischen Ruten, Freikratz-Rätsel,
prozedurale Klänge + Haptik. Kein App-Store, kein Backend.

👉 LIVE-URL-EINSETZEN
```

---

## 🔗 Verweise

- Ausführliches Dev-Log: [[2026-08-30-Bestandsaufnahme]]
- Design-Richtlinien: `.claude/skills/taste/SKILL.md`
- Projekt-README: `README.md` (Abschnitt „Deploy: Testserver vs. Live")
- Cockpit-Status: `C:\projekte\MASTER-STATUS.md`, Zeile 5
