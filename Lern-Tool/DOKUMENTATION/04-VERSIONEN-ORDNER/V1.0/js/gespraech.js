/* ============================================================
   MODUL: GESPRÄCHE
   Themenliste + Themenseite + Quiz
   ============================================================ */

function zeigeThemenListe() {
  const container = document.getElementById('themenList');
  container.innerHTML = '';

  const niveaus = [...new Set(THEMEN.map(t => t.niveau))].sort((a, b) => a - b);
  niveaus.forEach(nv => {
    const gruppe = THEMEN.filter(t => t.niveau === nv);
    const div = document.createElement('div');
    div.className = 'niveau-group';

    const label = document.createElement('span');
    label.className = 'niveau-label';
    label.textContent = 'Niveau ' + nv + ' – ' + gruppe[0].niveauName;
    div.appendChild(label);

    gruppe.forEach(thema => {
      const btn = document.createElement('button');
      btn.className = 'themen-item' + (Speich.daten.themenDone[thema.id] ? ' done' : '');
      const links = document.createElement('div');
      links.innerHTML = '<div class="themen-titel"></div><div class="themen-desc"></div>';
      links.querySelector('.themen-titel').textContent = thema.titel;
      links.querySelector('.themen-desc').textContent = thema.beschreibung;
      const check = document.createElement('span');
      check.className = 'themen-check';
      check.textContent = Speich.daten.themenDone[thema.id] ? '✅' : '';
      btn.appendChild(links);
      btn.appendChild(check);
      btn.addEventListener('click', () => zeigeThema(thema.id));
      div.appendChild(btn);
    });
    container.appendChild(div);
  });
}

function zeigeThema(id) {
  const thema = THEMEN.find(t => t.id === id);
  if (!thema) return;

  document.getElementById('themaTitel').textContent =
    'N' + thema.niveau + ' · ' + thema.titel;

  const inhalt = document.getElementById('themaInhalt');
  inhalt.innerHTML = '';

  // Inhaltsteile
  thema.inhalt.forEach(teil => {
    const box = document.createElement('div');
    if (teil.typ === 'info') {
      box.className = 'info-box';
      let html = '<h2>' + teil.titel + '</h2><p>' + teil.text + '</p>';
      if (teil.tipps && teil.tipps.length) {
        html += '<ul>' + teil.tipps.map(t => '<li>' + t + '</li>').join('') + '</ul>';
      }
      box.innerHTML = html;
    } else if (teil.typ === 'ja') {
      box.className = 'info-box say-yes';
      box.innerHTML = '<h2>✅ ' + teil.titel + '</h2><ul>' +
        teil.beispiele.map(b => '<li>' + b + '</li>').join('') + '</ul>';
    } else if (teil.typ === 'nein') {
      box.className = 'info-box say-no';
      box.innerHTML = '<h2>❌ ' + teil.titel + '</h2><ul>' +
        teil.beispiele.map(b => '<li>' + b + '</li>').join('') + '</ul>';
    } else if (teil.typ === 'tuerkisch') {
      box.className = 'info-box tuerkisch-box';
      box.innerHTML = '<h2>🇹🇷 Türkisch</h2>' + teil.saetze.map(s =>
        '<div class="tuerkisch-satz">' + s.tur + '</div>' +
        '<div class="aussprache">[' + s.aussprache + ']</div>' +
        '<div>' + s.de + '</div><hr style="border-color:var(--border);margin:10px 0">'
      ).join('');
    }
    inhalt.appendChild(box);
  });

  // Quiz
  if (thema.quiz && thema.quiz.length) {
    const quizBox = document.createElement('div');
    quizBox.className = 'quiz-box';
    quizBox.innerHTML = '<h2>🎯 Quiz zu diesem Thema</h2>' +
      '<p class="quiz-hint">Lies das Thema oben, dann teste dich. Alle richtig = Thema gemeistert + ' +
      (thema.quiz.length * 15) + ' Punkte!</p>';
    let fehler = 0;
    thema.quiz.forEach((frage, i) => {
      const qDiv = document.createElement('div');
      qDiv.style.marginTop = '18px';
      qDiv.innerHTML = '<div class="quiz-frage">' + (i + 1) + '. ' + frage.frage + '</div>';

      frage.optionen.forEach((opt, j) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'quiz-option';
        optBtn.textContent = opt;
        optBtn.addEventListener('click', () => {
          if (qDiv.dataset.antwortet === '1') return;
          qDiv.dataset.antwortet = '1';
          const alleBtns = qDiv.querySelectorAll('.quiz-option');
          alleBtns.forEach(b => b.disabled = true);

          const fb = document.createElement('div');
          if (j === frage.richtig) {
            optBtn.classList.add('correct');
            fb.className = 'quiz-feedback ok';
            fb.textContent = '✅ Richtig! ' + frage.erklaerung;
            punkteHolen(15);
          } else {
            optBtn.classList.add('wrong');
            alleBtns[frage.richtig].classList.add('correct');
            fb.className = 'quiz-feedback ko';
            fb.textContent = '❌ Leider nicht. ' + frage.erklaerung;
            fehler++;
            Speich.daten.themenFehler[thema.id] = (Speich.daten.themenFehler[thema.id] || 0) + 1;
            Speich.speichern();
          }
          qDiv.appendChild(fb);
          alleQuizPruefen(quizBox, fehler, thema);
        });
        qDiv.appendChild(optBtn);
      });
      quizBox.appendChild(qDiv);
    });
    inhalt.appendChild(quizBox);
  }

  zeigeView('view-thema');
}

// Prüft ob alle Quiz-Fragen beantwortet wurden
function alleQuizPruefen(quizBox, fehler, thema) {
  const fragen = quizBox.querySelectorAll('.quiz-frage');
  const beantwortet = quizBox.querySelectorAll('[data-antwortet]').length;
  if (beantwortet === fragen.length && !quizBox.dataset.fertig) {
    quizBox.dataset.fertig = '1';
    const endDiv = document.createElement('div');
    endDiv.className = 'quiz-feedback ' + (fehler === 0 ? 'ok' : 'ko');
    endDiv.style.marginTop = '20px';
    if (fehler === 0) {
      if (!Speich.daten.themenDone[thema.id]) {
        Speich.daten.themenDone[thema.id] = true;
        Speich.speichern();
        endDiv.textContent = '🏅 Thema gemeistert! Alle Fragen richtig beantwortet.';
        toast('🏅 „' + thema.titel + '" gemeistert!');
      } else {
        endDiv.textContent = '🏅 Alle richtig! (Thema war bereits gemeistert – Bonus: +5 Punkte)';
        punkteHolen(5);
      }
    } else {
      endDiv.textContent = 'Du hast ' + fehler + ' Fehler gemacht. Lies das Thema nochmal und komm später zurück – der ✅ kommt erst bei 0 Fehlern.';
    }
    quizBox.appendChild(endDiv);
    allesAktualisieren();
  }
}
