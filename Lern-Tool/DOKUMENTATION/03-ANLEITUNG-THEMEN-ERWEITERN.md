# 🔧 Anleitung: Neue Themen & Übungen eintragen

So kannst du **selbst** neue Lerninhalte hinzufügen – ohne Programmierkenntnisse,
du musst nur kopieren & texten.

> ⚠️ **WICHTIG – 2 GOLDENE REGELN**
> 1. **NIE normale Anführungszeichen** `"` in Texten verwenden!
>    Immer die deutschen `„..."` (so wie in den vorhandenen Einträgen).
>    Sonst bricht die App.
> 2. Nach Änderungen: `index.html` neu im Browser öffnen (Strg+R / neu laden).

---

## 1️⃣ Neues Gesprächs-THEMA hinzufügen

Datei: `js/daten/gespraech-daten.js`

1. Datei in einem Texteditor öffnen (VS Code, Notepad...)
2. Einen **ganzen vorhandenen Thema-Block** kopieren – z. B. den von
   `id: 'n1-gutenacht'` (das `{` bis zum passenden `},`)
3. Den Block irgendwo in der Liste (vor dem letzten `];`) einfügen
4. Anpassen:

```js
{
  id: 'n1-mein-neues-thema',      // 🔑 EIGENTLICH, z. B. 'n4-weiter-sprechen'
  niveau: 4,                      // 1-6 (wird in die richtige Gruppe einsortiert)
  niveauName: 'Konflikte',        // muss zum Niveau passen (siehe andere Einträge)
  titel: 'Mein neues Thema',      // Überschrift
  beschreibung: 'Kurze Zeile für die Themenliste.',
  inhalt: [
    // 💡 Teile im gleichen Muster weiterverwenden:
    // typ: 'info'     → Erklärung + tipps-Liste
    // typ: 'ja'       → „So gerne"-Beispiele
    // typ: 'nein'     → „Eher nicht so"-Beispiele
    // typ: 'tuerkisch'→ Sätze mit Aussprache
  ],
  quiz: [
    // 1-3 Fragen, Muster:
    {
      frage: 'Fragestellung?',
      optionen: ['Antwort A', 'Antwort B', 'Antwort C'],
      richtig: 1,                  // 🔢 INDEX: 0=erste, 1= zweite, 2= dritte Option!
      erklaerung: 'Warum ist das die richtige Antwort?'
    }
  ]
},
```

5. **Komma nicht vergessen** nach dem `}` (außer es ist der allerletzte Eintrag)
6. Speichern → Browser neu laden → Thema steht in der Liste ✅

**Fertig testen:** Klicke das Thema an – wenn der Titel + Inhalt + Quiz
erscheinen, ist alles gut.

### Neue Niveaus?
Einfach `niveau: 7` etc. verwenden – die Gruppe wird automatisch angelegt
(die erste Zeile `niveauName` bestimmt den Gruppennamen).

---

## 2️⃣ Neue RECHTSCHREIB-ÜBUNG hinzufügen

Datei: `js/daten/rechtschreibung-daten.js`

Hier gibt es **4 Bereiche** (`luecken`, `woerter`, `fehler`, `gross`) –
neue Übungen einfach in den richtigen Array kopieren:

### Lücke (Typ: Lücken füllen)
```js
{
  satz: 'Das ist ____, was du gesagt hast.',   // 🔹 genau EINE "____"
  luecken: ['dass'],                           // die richtige(n) Antwort(en)
  hinweis: 'Kurzer Tipp, wenn jemand danebengreift'
}
```

### Wort (Typ: Wörter schreiben)
```js
{
  wort: 'Enttäuschung',                         // Lösung (wird nach Fehler gezeigt)
  hinweis: 'Wenn etwas nicht so wird wie erhofft',
  erlaubt: ['enttaeuschung', 'enttäuschung']    // 🔹 ALLE erlaubten Schreibweisen,
}                                               //    KLEIN geschrieben!
```

### Fehler (Typ: Fehler finden)
```js
{
  woerter: ['Ich', 'habe', 'dich', 'vermissen', 'möchte.'],
  falschIndex: 3,        // 🔢 welches Wort (0=erstes) den Fehler HAT
  richtig: 'vermisse',   // wie es richtig heißen würde
  erklaerung: 'Kurze Erklärung'
}
```

### Groß/Klein
```js
{
  satz: 'Am ____ Morgen denke ich an dich.',   // EINE "____"
  antwort: 'morgen',
  groess: false,         // 🔹 true = groß, false = klein
  erklaerung: 'Warum'
}
```

---

## 3️⃣ Danach: Versionierung

Wenn du die Änderungen als **neue Version** willst:

1. Ordner kopieren: `Lern-Tool` → `DOKUMENTATION/04-VERSIONEN-ORDNER/V1.1/`
   (komplett inkl. css/js, aber OHNE den Versions-Ordner selbst)
2. In `02-VERSIONEN.md` oben einen neuen Eintrag schreiben:
   ```md
   ## V1.1 – TT.MM.JJJJ
   - Neue Themen: ...
   - Neue Übungen: ...
   ```
3. In `01-ANFORDERUNGEN.md` den Wunsch abhaken (🚧 → ✅)

---

## 🆘 Etwas kaputt? (Schnell-Check)

1. Browser öffnen → **Entwicklerwerkzeuge** (F12) → Reiter „Console"
2. App neu laden → Wenn dort ein **roter Fehler** steht, zeigt die Zeilennummer
   in der Datendatei direkt den Fehler (meist: fehlendes Komma oder ein `"`
   im Text)
3. Alt-Stand herholen: `04-VERSIONEN-ORDNER/V1.0/` → Dateien zurückkopieren
