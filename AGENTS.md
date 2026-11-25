# Projekt-Richtlinien & Obsidian-Gedächtnis: kap-arkona-explorer

## 🧠 Obsidian-Integration
- Dieses Projektverzeichnis ist gleichzeitig der exklusive Obsidian-Vault für dieses Projekt.
- Regionale Dokumentation, POIs und Konzepte liegen in: `docs/`
- Entwicklungs-Protokolle (Dev-Logs) werden hier abgelegt: `logs/`

## ⚙️ Entwicklungs-Befehle
- **Abhängigkeiten installieren:** `npm install`
- **Projekt lokal starten:** `npm run dev`
- **Build für Produktion:** `npm run build`
- **Vorschau des Produktions-Builds:** `npm run preview`
- **Linting:** `npm run lint`

## 📜 Verhaltensregeln für Claude (Session-Ritual)
1. **Kontext-Respekt:** Halte dich strikt an die Ordnerstruktur. Verändere niemals Dateien im versteckten Ordner `.obsidian/`.
2. **Dokumentations-Pflicht:** Wenn ein Feature fertiggestellt oder ein Bug behoben wurde, frage den Nutzer, ob du ein kurzes Dev-Log im Obsidian-Vault (`logs/`) erstellen sollst.
3. **Master-Status-Vorbereitung:** Erstelle am Ende jeder Session unaufgefordert eine prägnante, einzeilige Status-Zusammenfassung im Markdown-Tabellenformat für das globale Cockpit unter `C:\projekte\MASTER-STATUS.md`.
4. **Formatierung:** Schreibe alle Notizen für Obsidian in sauberem Markdown.
