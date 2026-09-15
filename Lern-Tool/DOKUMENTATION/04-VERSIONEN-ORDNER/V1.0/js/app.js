/* ============================================================
   LERNMEISTER – APP-LOGIK (Kern)
   Navigation, Speicherung, Punkte, Badges, Toast
   ============================================================ */

const STORAGE_KEY = 'lernmeister-fortschritt-v1';

/* ---------- SPEICHERUNG ---------- */
const Speich = {
  laden() {
    try {
      const roh = localStorage.getItem(STORAGE_KEY);
      if (roh) return JSON.parse(roh);
    } catch (e) { /* ignore */ }
    return this.leer();
  },
  leer() {
    return {
      punkte: 0,
      themenDone: {},      // { themenId: true }
      themenFehler: {},    // { themenId: anzahlFalsche }
      reFortschritt: {},   // { 'luecken': 3, 'woerter': 1, ... }
      reSchwachstellen: [] // [{ key, anzahl, letzte }]
    };
  },
  speichern() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.daten));
    } catch (e) { /* ignore */ }
  },
  daten: null // wird in app init gesetzt
};

/* ---------- BADGES ---------- */
const BADGES = [
  { id: 'starter',    name: '🌱 Starter',       bedingung: s => Object.keys(s.themenDone).length >= 1,  hint: '1 Thema gemeistert' },
  { id: 'gespraech1', name: '💬 Smalltalk-Meister', bedingung: s => (s.themenDone['n1-alltag'] && s.themenDone['n1-gutenacht']), hint: 'Alle Niveau-1-Themen' },
  { id: 'herz',       name: '💗 Herz bei der Sache', bedingung: s => (s.themenDone['n2-gefühle-benennen'] && s.themenDone['n2-trost']), hint: 'Alle Gefühle-Themen' },
  { id: 'froh',       name: '🤝 Friedensbringer', bedingung: s => (s.themenDone['n4-missverstaendnis'] && s.themenDone['n4-entschuldigung']), hint: 'Alle Konflikt-Themen' },
  { id: 'zukunft',    name: '🔮 Zukunftsplaner', bedingung: s => (s.themenDone['n5-zukunftsplaene'] && s.themenDone['n5-familie']), hint: 'Alle Zukunft-Themen' },
  { id: 'tuerke',     name: '🇹🇷 Türkisch-Anfänger', bedingung: s => !!s.themenDone['n6-tuerkisch'], hint: 'Türkisch-Modul gemeistert' },
  { id: 'alle',       name: '🏆 LernMeister',   bedingung: s => THEMEN.every(t => s.themenDone[t.id]), hint: 'ALLE Themen gemeistert' },
  { id: 'punkte100',  name: '⭐ Punktesammler', bedingung: s => s.punkte >= 100, hint: '100 Punkte erreicht' },
  { id: 'rechte5',    name: '✍️ Rechtschreib-Ass', bedingung: s => {
      const summe = Object.values(s.reFortschritt).reduce((a, b) => a + b, 0);
      return summe >= 5;
    }, hint: '5 Rechtschreib-Runden gelöst' }
];

/* ---------- NAVIGATION ---------- */
function resetFortschritt() {
  if (confirm('Wirklich ALLEN Fortschritt löschen? (Punkte, Themen, Badges)')) {
    Speich.daten = Speich.leer();
    Speich.speichern();
    allesAktualisieren();
    toast('Fortschritt zurückgesetzt');
  }
}

/* ---------- EVENT-LISTENER ---------- */
document.getElementById('btnHome').addEventListener('click', () => zeigeView('view-home'));
document.getElementById('btnReset').addEventListener('click', resetFortschritt);

// Modul-Karten auf Startseite
document.querySelectorAll('.module-card[data-view]').forEach(card => {
  card.addEventListener('click', () => {
    if (card.dataset.view === 'view-gespraech') zeigeThemenListe();
    zeigeView(card.dataset.view);
  });
});

// Zurück-Buttons
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === 'view-gespraech') zeigeThemenListe();
    if (btn.dataset.view) zeigeView(btn.dataset.view);
  });
});

// Rechtschreib-Übungstypen
document.querySelectorAll('.module-card[data-uebung]').forEach(card => {
  card.addEventListener('click', () => startRechtschreibung(card.dataset.uebung));
});

/* ---------- NAVIGATION ---------- */
function zeigeView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({ top: 0 });
}

/* ---------- TOAST ---------- */
let toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

/* ---------- PUNKTE & DISPLAY ---------- */
function punkteHolen(n) {
  Speich.daten.punkte += n;
  Speich.speichern();
  aktualisiereStatistik();
  if (n >= 20) toast('+' + n + ' Punkte! ⭐');
}

function aktualisiereStatistik() {
  document.getElementById('pointsDisplay').textContent = Speich.daten.punkte;
  document.getElementById('badgesDisplay').textContent = BADGES.filter(b => b.bedingung(Speich.daten)).length;
}

function zeigeBadges() {
  const list = document.getElementById('badgesList');
  list.innerHTML = '';
  BADGES.forEach(b => {
    const hat = b.bedingung(Speich.daten);
    const el = document.createElement('span');
    el.className = 'badge ' + (hat ? 'earned' : 'locked');
    el.textContent = b.name;
    el.title = b.hint + (hat ? '' : ' (noch nicht freigeschaltet)');
    list.appendChild(el);
  });
}

/* ---------- FORTSCHRITTSBALKEN ---------- */
function aktualisiereModulFortschritt() {
  const total = THEMEN.length;
  const done = THEMEN.filter(t => Speich.daten.themenDone[t.id]).length;
  document.getElementById('progGespraech').style.width = (total ? (done / total * 100) : 0) + '%';
  document.getElementById('progGespraechText').textContent = done + ' / ' + total + ' Themen gemeistert';

  const reKeys = Object.keys(RECHTSCHREIBUNG);
  const reGesamt = reKeys.reduce((a, k) => a + RECHTSCHREIBUNG[k].length, 0);
  const reDone = reKeys.reduce((a, k) => a + (Speich.daten.reFortschritt[k] || 0), 0);
  document.getElementById('progRechtschreibung').style.width = (reGesamt ? Math.min(reDone / reGesamt * 100, 100) : 0) + '%';
  document.getElementById('progRechtschreibungText').textContent = Math.min(reDone, reGesamt) + ' / ' + reGesamt + ' Übungen gelöst';
}

function allesAktualisieren() {
  aktualisiereStatistik();
  zeigeBadges();
  aktualisiereModulFortschritt();
  reChallengeBoxPruefen();
}

/* ---------- START ---------- */
Speich.daten = Speich.laden();
allesAktualisieren();
zeigeView('view-home');

