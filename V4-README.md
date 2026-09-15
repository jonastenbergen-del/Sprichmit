# SprichMit V4 — Status & Hinweise

Stand: 15.09.2026 — alle Code-/Daten-Aufgaben abgeschlossen, finaler Smoke-Test bestanden.

## ✅ Fertig (V4)

| Bereich | Status |
|---|---|
| `index.html` | PWA-ready (manifest, icon, viewport, CDN supabase-js) |
| `js/app.js` | Flashcards, Wiederholung (mcq/write), Aufgaben, Fortschritt, Supabase-Auth + `learner_cards` |
| `js/data/words_de.js` | 20 Lektionen × 50 = 1000 Wörter (Türke lernt Deutsch) |
| `js/data/words_tr.js` | 20 Lektionen × 50 = 1000 Wörter (Deutscher lernt Türkisch) |
| Datenqualität | keine Dup-IDs, keine echten Dup-Basiswörter, alle 5 Felder pro Wort (`wort, aussprache, übersetzung, beispielDe, beispielTr`) |
| `css/style.css` | alle Klassen vorhanden (inkl. `locked`, `session`, `shake`/`fade-in`-Animationen) |
| `node --check` | alle 6 JS-Dateien ohne Syntaxfehler |
| VM-Smoke-Test | alle Dateien laden fehlerfrei, `WORTER_DE/TR` = 1000, 20 Lektionen |
| Asset-Check | alle 9 Referenzen aus `index.html` existieren |
| `VERSIONEN/` | V3 archiviert: `VERSIONEN/archive/V3-SprichMit-ALT` |

### Duplikat-Bereinigung (durchgeführt)
Ersetzte echte Duplikate (identisches Wort + identischer Beispielsatz):

| Datei | Position | Alt (Dup) | Neu |
|---|---|---|---|
| DE + TR | L20 #997 | `das Anliegen` / `İş / talep` (2) | `sich bewerben` / `Başvurmak` |
| DE + TR | L20 #998 | `die Nachricht (3)` / `Haber (3)` | `die Besprechung` / `Toplantı` |
| DE + TR | L20 #1006 | `der Anruf` (2×) | `die Rückmeldung` / `Geri bildirim` |
| DE + TR | L20 #1007 | `die Sprachnachricht` (2×) | `das Formular` / `Form` |
| DE | L15 #717 | `vertrauen (2)` | `sich beschweren` |
| DE | L15 #740 | `die Aufgabe (2)` | `loben` |
| TR | L7 #328 | `Kanepe` (2×) | `Temizlik` |
| TR | L15 #751 | `Kader (2)` | `Nesil` |
| TR | L15 #753 | `Şu an (zaman)` | `Bir an` |

Kontext-Varianten mit `(2)/(3)` (anderer Beispielsatz, z. B. `die Butter (2) → Tereyağı (eritme)`) sind **absichtlich** und wurden belassen.

## ⚠️ NUR DU kannst das:

### 1. Supabase-Deployment prüfen (einmalig)
`schema.sql` im Projekt enthält `profiles` (mit `mother_tongue`) und `learner_cards` (mit `card jsonb`).
Im **Supabase Dashboard → SQL Editor** ausführen (falls noch nicht deployed):

```sql
-- Kopiere den Inhalt von schema.sql und führe ihn aus.
-- Danach prüfen:
select count(*) from profiles limit 1;
select count(*) from learner_cards limit 1;
```

Achte darauf, dass in `js/config.js` deine echten `SUPABASE_URL` und `SUPABASE_ANON_KEY` stehen.

### 2. Browser-Test
1. `index.html` im Browser öffnen (am besten über einen lokalen Server: `npx serve` oder VS Code Live-Server — reine Datei-Eröffnung kann TTS/CORS einschränken)
2. Registrieren → Mutterzunge wählen
3. **Richtung 1:** Türke lernt Deutsch (UI Türkisch) — Lektion 1 durchklicken, Karten, 🔊 TTS (Browser-Voice `de-DE`), Wiederholung, Aufgaben
4. **Richtung 2:** Deutscher lernt Türkisch (UI Deutsch) — selbes
5. Fortschritt nach Logout/Login prüfen (Supabase `learner_cards`)

TTS-Hinweis: Browser braucht installierte System-Voices (`de-DE`, `tr-TR`). Unter Windows Standard vorhanden; auf Linux ggf. `espeak`/`flite`-Voices nachinstallieren.

## Struktur

```
Sprache/
├── index.html          # V4-Einstieg (PWA)
├── manifest.json       # PWA-Manifest
├── icon.svg / favicon.svg
├── css/style.css       # V4-Styles (mobil-first)
├── js/
│   ├── config.js       # SUPABASE_URL / ANON_KEY
│   ├── lang.js         # UI-Texte DE/TR
│   ├── tts.js          # Web-Speech-Wrapper
│   ├── app.js          # Logik (Lernen, Wiederholung, Aufgaben, Auth)
│   └── data/
│       ├── words_de.js # 1000 Wörter (→Deutsch)
│       └── words_tr.js # 1000 Wörter (→Türkisch)
├── schema.sql          # Supabase-Schema (profiles, learner_cards)
└── VERSIONEN/
    ├── V1.0, V1.1      # Altversionen (unverändert)
    └── archive/
        └── V3-SprichMit-ALT   # V3-Archiv
```
