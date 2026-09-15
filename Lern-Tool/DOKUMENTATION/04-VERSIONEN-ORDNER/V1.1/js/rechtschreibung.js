/* ============================================================
   MODUL: RECHTSCHREIBUNG
   4 Übungstypen + Schwachstellen-Tracking + Ergebnis
   ============================================================ */

const RE_TITEL = {
  luecken: '🔤 Lücken füllen',
  woerter: '⌨️ Wörter schreiben',
  fehler: '🔍 Fehler finden',
  gross: '🔠 Groß / Klein'
};

let reRunde = null; // aktuelle Runde

function startRechtschreibung(typ, nurSchwach) {
  let pool;
  if (nurSchwach) {
    // Nur die Schwachstellen-Aufgaben
    const schwachKeys = new Set(Speich.daten.reSchwachstellen.map(s => s.key));
    pool = [];
    Object.keys(RECHTSCHREIBUNG).forEach(k => {
      RECHTSCHREIBUNG[k].forEach((aufgabe, i) => {
        if (schwachKeys.has(k + ':' + i)) pool.push({ typ: k, aufgabe, key: k + ':' + i });
      });
    });
    if (pool.length === 0) { toast('Keine Schwachstellen mehr – super! 🎉'); return; }
  } else {
    pool = RECHTSCHREIBUNG[typ].map((aufgabe, i) => ({ typ, aufgabe, key: typ + ':' + i }));
  }

  // mischen
  pool.sort(() => Math.random() - 0.5);

  reRunde = {
    typ: nurSchwach ? null : typ,
    pool: pool.slice(0, 6),
    index: 0,
    fehler: 0,
    ergebnis: []
  };

  document.getElementById('uebungTitel').textContent =
    RE_TITEL[reRunde.typ] || '🎯 Schwachstellen-Training';
  zeigeAufgabe();
  zeigeView('view-uebung');
}

function zeigeAufgabe() {
  const item = reRunde.pool[reRunde.index];
  const container = document.getElementById('uebungInhalt');
  container.innerHTML = '';

  // Fortschritt
  const total = reRunde.pool.length;
  document.getElementById('uebungFortschrittBar').style.width =
    (reRunde.index / total * 100) + '%';
  document.getElementById('uebungFortschrittText').textContent =
    (reRunde.index + 1) + ' / ' + total;

  if (item.typ === 'luecken') renderLuecken(item, container);
  else if (item.typ === 'woerter') renderWoerter(item, container);
  else if (item.typ === 'fehler') renderFehler(item, container);
  else if (item.typ === 'gross') renderGross(item, container);
}

function antwortPruefen(richtig, erklartext, item) {
  reRunde.ergebnis.push({ ok: richtig, text: erklartext });
  if (!richtig) {
    reRunde.fehler++;
    markSchwachstelle(item.key);
  }
  const fb = document.createElement('div');
  fb.className = 'quiz-feedback ' + (richtig ? 'ok' : 'ko');
  fb.textContent = (richtig ? '✅ Richtig! ' : '❌ Leider nicht. ') + erklartext;
  fb.style.marginTop = '16px';
  const btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.textContent = reRunde.index < reRunde.pool.length - 1 ? 'Weiter →' : 'Ergebnis anzeigen';
  btn.addEventListener('click', () => {
    reRunde.index++;
    if (reRunde.index < reRunde.pool.length) zeigeAufgabe();
    else zeigeErgebnis();
  });
  const wrapper = document.createElement('div');
  wrapper.appendChild(fb);
  wrapper.appendChild(btn);
  document.getElementById('uebungInhalt').appendChild(wrapper);
}

/* ---------- Renderer ---------- */

function renderLuecken(item, container) {
  const a = item.aufgabe;
  const karte = document.createElement('div');
  karte.innerHTML = '<div class="uebung-aufgabe"></div>' +
    '<p class="uebung-hint">💡 ' + a.hinweis + '</p>' +
    '<div class="uebung-antworten"></div>';
  karte.querySelector('.uebung-aufgabe').innerHTML =
    a.satz.split('____').join('<span class="luecke">?</span>');

  const antwDiv = karte.querySelector('.uebung-antworten');
  const richtig = a.luecken;
  const ablenker = ['der', 'ist', 'das', 'soll', 'weiß', 'weil', 'du', 'ich'];
  const alle = [...richtig, ...ablenker.filter(x => !richtig.includes(x))];
  alle.sort(() => Math.random() - 0.5);
  const auswahl = [];
  alle.forEach(w => {
    const b = document.createElement('button');
    b.className = 'uebung-antwort';
    b.textContent = w;
    b.addEventListener('click', () => {
      if (b.disabled) return;
      b.disabled = true;
      if (richtig.includes(w)) {
        b.classList.add('correct');
        auswahl.push(w);
        if (auswahl.length === richtig.length) {
          antwortPruefen(true, 'Alle Lücken richtig!', item);
        } else {
          toast('Weiter so! (' + auswahl.length + '/' + richtig.length + ')');
        }
      } else {
        b.classList.add('wrong', 'shake');
        Array.from(antwDiv.children).forEach(x => x.disabled = true);
        antwortPruefen(false, 'Richtige Wörter waren: „' + richtig.join('", "') + '".', item);
      }
    });
    antwDiv.appendChild(b);
  });
  container.appendChild(karte);
}

function renderWoerter(item, container) {
  const a = item.aufgabe;
  const karte = document.createElement('div');
  karte.innerHTML = '<div class="uebung-aufgabe">Schreibe das Wort richtig:</div>' +
    '<p class="uebung-hint">💡 ' + a.hinweis + '</p>' +
    '<input class="uebung-input" type="text" autocomplete="off" placeholder="Hier tippen..." />' +
    '<button class="btn-primary">Prüfen</button>';
  const input = karte.querySelector('input');
  const btn = karte.querySelector('button');
  const pruefen = () => {
    const wert = input.value.trim().toLowerCase();
    if (!wert) return;
    const ok = a.erlaubt.some(e => e.toLowerCase() === wert);
    input.disabled = true;
    btn.disabled = true;
    if (ok) {
      antwortPruefen(true, 'Perfekt geschrieben: „' + a.wort + '".', item);
    } else {
      antwortPruefen(false, 'Richtig geschrieben: „' + a.wort + '".', item);
    }
  };
  btn.addEventListener('click', pruefen);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') pruefen(); });
  input.focus();
  container.appendChild(karte);
}

function renderFehler(item, container) {
  const a = item.aufgabe;
  const karte = document.createElement('div');
  karte.innerHTML = '<div class="uebung-aufgabe"></div>' +
    '<p class="uebung-hint">💡 Genau EIN Wort ist falsch. Klicke darauf!</p>';
  const aufgabe = karte.querySelector('.uebung-aufgabe');
  a.woerter.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'wort-marked';
    span.textContent = w;
    span.addEventListener('click', () => {
      if (karte.dataset.geloescht) return;
      if (i === a.falschIndex) {
        karte.dataset.geloescht = '1';
        span.classList.add('selected');
        antwortPruefen(true, 'Richtig! „' + w + '" müsste „' + a.richtig + '" heißen. ' + a.erklaerung, item);
      } else {
        karte.dataset.geloescht = '1';
        span.classList.add('wrong', 'shake');
        aufgabe.children[a.falschIndex].classList.add('selected');
        antwortPruefen(false, 'Leider nicht – das falsche Wort war „' + a.woerter[a.falschIndex] + '" → „' + a.richtig + '". ' + a.erklaerung, item);
      }
    });
    aufgabe.appendChild(span);
    aufgabe.appendChild(document.createTextNode(' '));
  });
  container.appendChild(karte);
}

function renderGross(item, container) {
  const a = item.aufgabe;
  const karte = document.createElement('div');
  karte.innerHTML = '<div class="uebung-aufgabe"></div>' +
    '<p class="uebung-hint">💡 Groß oder klein geschrieben?</p>' +
    '<div class="uebung-antworten"></div>';
  karte.querySelector('.uebung-aufgabe').innerHTML =
    a.satz.split('____').join('<span class="luecke">?</span>');

  const antwDiv = karte.querySelector('.uebung-antworten');
  ['Groß', 'Klein'].forEach(opt => {
    const b = document.createElement('button');
    b.className = 'uebung-antwort';
    b.textContent = opt + 'geschrieben';
    b.addEventListener('click', () => {
      if (b.disabled) return;
      const istGross = opt === 'Groß';
      Array.from(antwDiv.children).forEach(x => x.disabled = true);
      if (istGross === a.groess) {
        b.classList.add('correct');
        antwortPruefen(true, a.erklaerung, item);
      } else {
        b.classList.add('wrong', 'shake');
        antwortPruefen(false, a.erklaerung, item);
      }
    });
    antwDiv.appendChild(b);
  });
  container.appendChild(karte);
}

/* ---------- ERGEBNIS ---------- */

function zeigeErgebnis() {
  const total = reRunde.pool.length;
  const richtig = total - reRunde.fehler;

  // Fortschritt speichern
  if (reRunde.typ) {
    Speich.daten.reFortschritt[reRunde.typ] =
      (Speich.daten.reFortschritt[reRunde.typ] || 0) + 1;
  }
  // Punkte
  const punkte = richtig * 10 + (reRunde.fehler === 0 ? 10 : 0);
  Speich.speichern();

  document.getElementById('ergebnisTitel').textContent =
    reRunde.typ ? RE_TITEL[reRunde.typ] : '🎯 Schwachstellen-Training';

  const inhalt = document.getElementById('ergebnisInhalt');
  inhalt.innerHTML = '';

  const karte = document.createElement('div');
  karte.className = 'ergebnis-karte';

  const emoji = reRunde.fehler === 0 ? '🎉' : (richtig >= total / 2 ? '💪' : '📚');
  let html = '<div class="ergebnis-emoji">' + emoji + '</div>' +
    '<div class="ergebnis-punktzahl">' + richtig + ' / ' + total + '</div>' +
    '<div class="ergebnis-text">' +
    (reRunde.fehler === 0
      ? 'Perfekt! Alle richtig – +10 Bonuspunkte!'
      : 'Weiter so! Die Fehlerigen sind unten erklärt.') +
    ' (' + punkte + ' Punkte)' +
    '</div><ul class="ergebnis-liste">';

  reRunde.ergebnis.forEach(e => {
    html += '<li class="' + (e.ok ? 'ok' : 'ko') + '">' +
      (e.ok ? '✅ ' : '❌ ') + e.text + '</li>';
  });
  html += '</ul>';

  const btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.gap = '12px';
  btns.style.justifyContent = 'center';
  btns.style.flexWrap = 'wrap';
  const wieder = document.createElement('button');
  wieder.className = 'btn-primary';
  wieder.textContent = '🔁 Nochmal üben';
  const zurueck = document.createElement('button');
  zurueck.className = 'btn-back';
  zurueck.style.background = 'var(--bg-3)';
  zurueck.textContent = '← Zurück';
  if (reRunde.typ) {
    wieder.addEventListener('click', () => startRechtschreibung(reRunde.typ, false));
    zurueck.addEventListener('click', () => {
      reChallengeBoxPruefen();
      zeigeView('view-rechtschreibung');
    });
  } else {
    wieder.addEventListener('click', () => startRechtschreibung(null, true));
    zurueck.addEventListener('click', () => {
      reChallengeBoxPruefen();
      zeigeView('view-rechtschreibung');
    });
  }
  btns.appendChild(wieder);
  btns.appendChild(zurueck);
  karte.innerHTML = html;
  karte.appendChild(btns);
  inhalt.appendChild(karte);

  punkteHolen(punkte);
  allesAktualisieren();
  zeigeView('view-ergebnis');
}

/* ---------- SCHWACHSTELLEN ---------- */

function markSchwachstelle(key) {
  const list = Speich.daten.reSchwachstellen;
  const gefunden = list.find(s => s.key === key);
  if (gefunden) {
    gefunden.anzahl++;
    gefunden.lezte = Date.now();
  } else {
    list.push({ key, anzahl: 1, letzte: Date.now() });
  }
  // max. 12 Schwachstellen behalten
  if (list.length > 12) list.shift();
  Speich.speichern();
}

function reChallengeBoxPruefen() {
  const box = document.getElementById('reChallengeBox');
  if (!box) return;
  const anzahl = Speich.daten.reSchwachstellen.length;
  if (anzahl >= 2) {
    box.hidden = false;
    box.querySelector('p').textContent =
      'Du hast ' + anzahl + ' Themen, die du öfter falsch machst – übe sie gezielt!';
  } else {
    box.hidden = true;
  }
}

/* ---------- EVENT-FÜR-ERGEBNIS-ZURÜCK ---------- */
document.getElementById('btnErgebnisZuruck').addEventListener('click', () => {
  reChallengeBoxPruefen();
  zeigeView(reRunde && reRunde.typ ? 'view-rechtschreibung' : 'view-rechtschreibung');
});

document.getElementById('btnReChallenge').addEventListener('click', () => {
  startRechtschreibung(null, true);
});