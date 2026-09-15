# 📦 Versionen & Changelog

Jede veröffentlichte Version wird hier dokumentiert UND komplett in
`04-VERSIONEN-ORDNER/` gesichert.

**Regel:** Nach jeder Änderung/Version →
1. Komplett-Stand in `04-VERSIONEN-ORDNER/Vx.y/` kopieren
2. Eintrag hier oben (neueste zuerst) ergänzen

---

## V1.1 – 11.09.2026 (UI-Feinschliff) 🎨

### Neu / Verbessert
- **Gradient-Design**: Blau→Violett-Verlauf bei Titeln, Primär-Buttons und Fortschrittsbalken
- **Emoji-Favicon** 💙 in der Browser-Tab-Leiste (offline, kein Bild nötig)
- **Gestaffelte Einblendung**: Themen-Liste erscheint jetzt kartenweise (45 ms Versatz)
- **Feedback-Animationen**: ❌ falsche Antwort → Shake, ✅ richtig → grüner Pulse (beide Module)
- **Badge-Freischaltung**: goldener Toast mit Badge-Name + Pop-Animation auf der Badgeliste
- **Toast-Varianten**: grün (Erfolg), gold (Badge) statt immer derselbe graue Toast
- **🎯 „Nächstes Ziel"-Box** auf der Startseite: zeigt immer das nächste erreichbare Badge mit Mini-Fortschrittsbalken (Themen → Rechtschreib-Ass → 100 Punkte)
- **Tastatur-Navigation**: sichtbare Focus-Ringe (Tab durch die App)
- **`prefers-reduced-motion`**: alle Animationen werden respektiert, wenn das im System aktiviert ist

### Bugfixes
- Ergebnis-Card: Buttons wurden nach dem `innerHTML`-Setzen gelöscht (doppelte Anzeige)
- Typo: „Die fehligen" → „Die Fehlerigen"

### Technische Anmerkungen
- Keine Datenänderung, kein Speicher-Formatwechsel (alter Fortschritt bleibt erhalten!)
- localStorage-Schlüssel unverändert: `lernmeister-fortschritt-v1`

---

## V1.0 – 11.09.2026 (Erstversion) 🎉

### Neu
- Komplettes Grundgerüst: `index.html` + Dark-Mode-UI (responsive, Kontraste, 44px-Klickflächen)
- **Modul 💬 Gespräche**: 10 Themen in 6 Niveaus
  - N1: Über den Tag reden, Gute-Nacht-Ritual
  - N2: Gefühle benennen, Trost spenden
  - N3: Wertschätzung zeigen, Vertrauen & Ehrlichkeit
  - N4: Missverständnisse klären, Richtig entschuldigen
  - N5: Über die Zukunft sprechen, Ihre Familie respektieren
  - N6: Türkisch-Grundlagen (12 Sätze mit Aussprache)
- Jedes Thema: Erklärung + „So gerne" ✅ + „Eher nicht so" ❌ + Quiz
- **Modul ✍️ Rechtschreibung**: 4 Übungstypen
  - Lücken füllen (5), Wörter schreiben (8), Fehler finden (5), Groß/Klein (6)
  - Schwachstellen-Tracking + 🎯 Schwachstellen-Training
- Punkte-System (Quiz +15, Rechtschreib +10, Bonus +10)
- 9 Badges (z. B. 🏆 LernMeister bei allen Themen)
- Fortschrittsspeicherung via localStorage (automatisch)
- Fortschrittsbalken pro Modul, Reset-Button mit Bestätigung
- Doku-Paket: LESE-MICH, ANFORDERUNGEN, VERSIONEN, ERWEITERN-Anleitung
- Versions-Ordner mit V1.0-Backup

### Technische Anmerkungen
- Reines HTML/CSS/JS, keine Abhängigkeiten, 100 % offline
- Daten in `js/daten/*.js` (kein JSON, weil Browser lokale JSON-Dateien
  per file:// nicht laden dürfen)
- Texte in den Datendateien: NIE normale `"`-Anführungszeichen verwenden,
  immer deutsche „…" (sonst bricht die JS-Syntax!)
