# 🇩🇪🇹🇷 Almanca Öğren — Deutsch-Lern-App für Dilara

Kleine Web-App fürs Handy: Vokabeln lernen, wiederholen (Leitner), schreiben (Papier),
Aussprache am Telefon üben. UI komplett auf Türkisch.

## 🚀 Einmaliges Setup (Jonas, ~10 Min)

### 1. Supabase-Datenbank einrichten
1. [supabase.com](https://supabase.com) → Projekt **„Deutsch lerne"** öffnen
2. Links **SQL Editor** → **New query**
3. Inhalt von **`schema.sql`** (dieser Ordner) kopieren & **Run** klicken
4. (Falls vorher schon executed: keine Sorge, `if not exists` ist drin)

### 2. E-Mail-Login aktivieren (falls noch nicht)
1. Links **Authentication → Sign In / Up → Providers**
2. **Email** muss auf **Enabled** stehen
3. Optional: bei **Auth → URL Configuration** die spätere App-URL eintragen
   (für den Mail-Confirm-Link)

### 3. E-Mail-Adresse eintragen
In **`js/config.js`** deine E-Mail in `DASHBOARD_EMAILS` eintragen:
```js
const DASHBOARD_EMAILS = ["deine.email@gmail.com"];
```

### 4. Netlify deployen (kostenlos)
1. [netlify.com](https://netlify.com) → Sign up with Google
2. **Add new site → Deploy manually** → diesen Ordner als ZIP hochladen
   (oder: Ordner per Drag & Drop in den Netlify-Browser)
3. Du bekommst eine URL wie `https://almanca-ogren.netlify.app`
4. In Supabase → **Auth → URL Configuration → Site URL** diese URL eintragen

### 5. Konten anlegen
1. Dilara öffnet den Link → gibt **ihre E-Mail** + Passwort ein
   (z. B. `DilaraDeutsch` / `J0nasD1laraDeutsch` — **nach dem ersten Login ändern!**)
2. Beim ersten Mal: sie wird automatisch registriert → **E-Mail-Link in ihrem
   Postfach antippen (Bestätigung)** → dann Login
3. Du: Login auf `dashboard.html` (URL: `…/dashboard.html`) mit deiner E-Mail

## 📱 Nutzung (Dilara)
- Jeden Tag: **„Başla"** drücken → ~10 Minuten lernen
- **✍️ Yaz**: Wörter 5× auf Papier schreiben, abhaken, Foto an Jonas
- **📞 Telefon**: schwierige Wörter langsam anhören (🐢), dann anrufen & sagen
- **🔥 Serie** nicht kaputt lassen!

## 📈 Dein Dashboard
`https://…/dashboard.html` — siehst für JEDE registrierte Person:
Streak, Wörterzahl, Treffquote, **schwierigste Wörter** (→ Telefon-Checkliste).

## 📚 Neue Wörter ergänzen
In `js/vocab.js` weiter an die Liste (id aufsteigend, Woche 5, 6, …):
```js
{ id: 69, de: "Geld", phon: "gýlt", tr: "para", type: "word", week: 5 },
```
Dann neu auf Netlify deployen (Ordner wieder hochladen).

## 🔒 Sicherheit
- Nur der `anon`/`sb_publishable`-Key liegt im Code (öffentlicher Schlüssel, ok)
- **Service-Rolle-Key** (`sb_secret_…`) nie hierher kopieren — im Supabase-Dashboard
  bei API Keys auf **Regenerate** klicken, wenn er im Chat stand
- RLS: Fortschritt ist pro Nutzer geschützt; Lesezugriff auf alle Karten haben nur
  angemeldete Nutzer dieses Projekts (für euren 2-Personen-Fall ok)

## 🗂 Dateien
| Datei | Was |
|---|---|
| `index.html` | Lern-App (Login + 6 Tabs) |
| `dashboard.html` | Jonas' Fortschritts-Übersicht |
| `js/config.js` | **Keys + E-Mails + Lerneinstellungen** |
| `js/vocab.js` | Vokabeln (DE + Aussprache + TR) |
| `js/app.js` | Logik (Auth, Leitner, Streak, Übungen) |
| `js/tts.js` | Deutsch-Vorlesen (Web Speech API) |
| `schema.sql` | Supabase-Tabelle + Zugriffsregeln |
| `manifest.json` / `icon.svg` | „App"-Aussehen auf dem Home-Screen |