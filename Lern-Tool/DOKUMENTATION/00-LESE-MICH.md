# 💙 LernMeister – Lies mich zuerst!

Willkommen! Das ist deine persönliche Lern-App für Gespräche mit Dilara.

## 🚀 So startest du die App

1. **`index.html` doppelklicken** → öffnet sich in deinem Browser (Chrome/Edge)
2. Fertig! Kein Installieren, kein Internet, kein Programm nötig.
3. Dein Fortschritt wird **automatisch im Browser gespeichert** (localStorage).

> ⚠️ Wichtig: Immer die GLEICHE `index.html` aus GLEICHEM Ordner öffnen,
> sonst startet der Fortschritt neu (der Speicher ist an den Ordner gebunden).

## 📁 Was liegt wo?

| Datei/Ordner | Was ist das? |
|---|---|
| `index.html` | Die App – hier startest du |
| `css/style.css` | Design & Farben |
| `js/app.js` | Kern-Logik (Punkte, Badges, Speicherung) |
| `js/gespraech.js` | Logik des Gesprächs-Moduls |
| `js/rechtschreibung.js` | Logik des Rechtschreib-Moduls |
| `js/daten/gespraech-daten.js` | **ALLE Gesprächsthemen** (hier neue Themen eintragen!) |
| `js/daten/rechtschreibung-daten.js` | **ALLE Rechtschreib-Übungen** |
| `DOKUMENTATION/` | Diese Doku, Versionen, Anforderungen |

## 📚 Die beiden Module

### 💬 Gespräche
11 Themen in 6 Niveaus (einfach → anspruchsvoll):
1. **Alltag & Smalltalk** – Über den Tag reden, Gute-Nacht-Ritual
2. **Gefühle** – Gefühle benennen, Trost spenden
3. **Beziehung** – Wertschätzung zeigen, Vertrauen & Ehrlichkeit
4. **Konflikte** – Missverständnisse klären, Richtig entschuldigen
5. **Zukunft** – Über die Zukunft sprechen, Ihre Familie respektieren
6. **Türkisch-Grundlagen** – Wichtige Sätze mit Aussprache

Jedes Thema: Erklärung + „So gerne" + „Eher nicht so" + Quiz.
Alle Quiz-Fragen ohne Fehler = Thema gemeistert ✅ + Punkte.

### ✍️ Rechtschreibung
4 Übungstypen: Lücken füllen · Wörter schreiben · Fehler finden · Groß/Klein.
Fehler werden gemerkt → nach 2+ Schwachstellen erscheint die
**🎯 Schwachstellen-Box** für gezieltes Training.

## 🏅 Punkte & Badges

- Quiz-Frage richtig: +15 Punkte
- Rechtschreib-Frage richtig: +10 Punkte (alle richtig: +10 Bonus)
- Badges: z. B. „💬 Smalltalk-Meister", „🤝 Friedensbringer", „🏆 LernMeister" (alle Themen)

## ❓ Häufige Fragen

**Mein Fortschritt ist weg!**
→ Anderer Browser / anderer Ordner? localStorage ist an Browser + Ordner gebunden.

**Neue Themen eintragen?**
→ Lies `03-ANLEITUNG-THEMEN-ERWEITERN.md` (geht einfach!)

**Was wurde in welcher Version geändert?**
→ Siehe `02-VERSIONEN.md`. Alte Versionen liegen in `04-VERSIONEN-ORDNER/`.

**Was sind die offenen Wünsche?**
→ Siehe `01-ANFORDERUNGEN.md`
