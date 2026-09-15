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

/* ---------- TOAST (V1.1: Varianten) ---------- */
let toastTimer = null;
function toast(msg, variant) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden', 'tok', 'twarn', 'tbadge');
  if (variant) t.classList.add('t' + variant);
  clearTimeout(toastTimer);
  const dauer = variant === 'badge' ? 4200 : 2600;
  toastTimer = setTimeout(() => t.classList.add('hidden'), dauer);
}

/* ---------- PUNKTE & DISPLAY ---------- */
let vorherBadges = BADGES.map(b => b.id).filter(id => {
  const b = BADGES.find(x => x.id === id);
  return b.bedingung(Speich.daten);
});
let neuBadges = [];

function checkeNeueBadges() {
  const neu = [];
  BADGES.forEach(b => {
    if (b.bedingung(Speich.daten) && !vorherBadges.includes(b.id)) {
      neu.push(b.id);
      toast('🏅 Badge frei: ' + b.name + ' – ' + b.hint, 'badge');
    }
  });
  neuBadges = neu;
  vorherBadges = BADGES.map(b => b.id).filter(id => {
    const bb = BADGES.find(x => x.id === id);
    return bb.bedingung(Speich.daten);
  });
}

function punkteHolen(n) {
  Speich.daten.punkte += n;
  Speich.speichern();
  aktualisiereStatistik();
  checkeNeueBadges();
  if (n >= 20) toast('+' + n + ' Punkte! ⭐', 'ok');
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
    el.className = 'badge ' + (hat ? 'earned' : 'locked') +
      (hat && neuBadges.includes(b.id) ? ' just-earned' : '');
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
  checkeNeueBadges();
  aktualisiereStatistik();
  zeigeBadges();
  aktualisiereModulFortschritt();
  reChallengeBoxPruefen();
  zielPruefen();
}

/* ---------- V1.1: NÄCHSTES ZIEL (Startseite) ---------- */
function zielPruefen() {
  const box = document.getElementById('goalBox');
  const titel = document.getElementById('goalTitel');
  const text = document.getElementById('goalText');
  const bar = document.getElementById('goalBar');
  const d = Speich.daten;

  const Themen = THEMEN.length;
  const gemeistert = THEMEN.filter(t => d.themenDone[t.id]).length;

  let ziel = null; // { titel, text, erledigt, gesamt }

  if (gemeistert < Themen) {
    const fehler = Themen - gemeistert;
    ziel = {
      titel: '🏆 Alle Themen gemeistert',
      text: 'Meistere alle Gesprächs-Themen ohne Fehler – noch ' + fehler + (fehler === 1 ? ' Thema' : ' Themen') + ' offen.',
      erledigt: gemeistert, gesamt: Themen
    };
  } else if (!BADGES.find(b => b.id === 'rechte5').bedingung(d)) {
    const summe = Object.values(d.reFortschritt).reduce((a, b) => a + b, 0);
    ziel = {
      titel: '✍️ Rechtschreib-Ass werden',
      text: 'Löse insgesamt 5 Rechtschreib-Runden fehlerfrei – noch ' + (5 - summe) + ' offene.',
      erledigt: summe, gesamt: 5
    };
  } else if (!BADGES.find(b => b.id === 'punkte100').bedingung(d)) {
    ziel = {
      titel: '⭐ 100 Punkte erreichen',
      text: 'Sammle mit guten Antworten 100 Punkte – noch ' + (100 - d.punkte) + ' Punkte.',
      erledigt: d.punkte, gesamt: 100
    };
  } else {
    box.classList.add('hidden');
    return;
  }

  titel.textContent = '🎯 Dein nächstes Ziel: ' + ziel.titel;
  text.textContent = ziel.text;
  bar.style.width = Math.min(100, Math.round(ziel.erledigt / ziel.gesamt * 100)) + '%';
  box.classList.remove('hidden');
}

/* ---------- START ---------- */
Speich.daten = Speich.laden();
allesAktualisieren();
zeigeView('view-home');

