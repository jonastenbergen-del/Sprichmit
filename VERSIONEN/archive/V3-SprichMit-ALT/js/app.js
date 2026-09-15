// ============================================================
// Almanca Öğren — Haupt-Logik
// ============================================================

// ---------- SUPABASE ----------
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- STATE ----------
const state = {
  user: null,
  card: {
    streak: 0,
    bestStreak: 0,
    lastActiveDay: "",     // yyyy-mm-dd
    seen: [],              // vocab ids already seen
    box: {},               // vocab id -> box level (0..5)
    lapses: {},            // vocab id -> how many times back to box 0
    totalReviews: 0,
    totalCorrect: 0,
    writingDone: {},       // "yyyy-mm-dd_id" -> true
    phoneDone: {},         // "yyyy-mm-dd_id" -> true
    createdDay: "",
  },
  session: null, // { newItems:[], dueItems:[], index, mode }
};

// ---------- HELPERS ----------
const $ = (id) => document.getElementById(id);
const todayStr = () => new Date().toISOString().slice(0, 10);
const byId = (id) => VOCAB.find((v) => v.id === id);

// ---------- V1.1: TOAST ----------
let toastTimer = null;
function toast(msg, variant) {
  let t = $("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("hidden", "tok", "twarn");
  if (variant) t.classList.add("t" + variant);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2600);
}

// ---------- V1.1: NÄCHSTES ZIEL (Ana Sayfa) ----------
function renderGoal() {
  const box = $("goal-box");
  const seen = state.card.seen.length;
  const total = VOCAB.length;

  let ziel = null; // { titel, text, erledigt, gesamt }

  if (seen < 18) {
    ziel = {
      titel: "🌱 İlk 18 kelime",
      text: `1. haftayı bitir — ${18 - seen} kelime kaldı!`,
      erledigt: seen, gesamt: 18,
    };
  } else if (seen < 36) {
    ziel = {
      titel: "💪 36 kelime (3. hafta)",
      text: `2. hafta tamam! Şimdi 3. hafta — ${36 - seen} kelime kaldı.`,
      erledigt: seen, gesamt: 36,
    };
  } else if (seen < 50) {
    ziel = {
      titel: "🌟 50 kelime",
      text: `${50 - seen} kelime kaldı — çok yaklaşıyorsun!`,
      erledigt: seen, gesamt: 50,
    };
  } else if (seen < total) {
    ziel = {
      titel: "🏆 Tüm kelimeler (" + total + ")",
      text: `${total - seen} kelime kaldı — son düzlük!`,
      erledigt: seen, gesamt: total,
    };
  } else {
    box.classList.add("hidden");
    return;
  }

  $("goal-titel").textContent = "🎯 " + ziel.titel;
  $("goal-text").textContent = ziel.text;
  $("goal-fill").style.width = Math.min(100, Math.round((ziel.erledigt / ziel.gesamt) * 100)) + "%";
  box.classList.remove("hidden");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- AUTH ----------
async function initAuth() {
  const { data } = await sb.auth.getSession();
  if (data.session) {
    state.user = data.session.user;
    showApp();
  } else {
    $("login-screen").classList.remove("hidden");
    $("app").classList.add("hidden");
  }
}

async function doLogin() {
  const email = $("login-email").value.trim();
  const password = $("login-password").value;
  const err = $("login-error");
  err.textContent = "";

  if (!email || !password) {
    err.textContent = "Lütfen e-posta ve parolayı gir.";
    return;
  }

  // 1) versuchen zu loggen
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (!error) {
    state.user = data.user;
    showApp();
    return;
  }

  // 2) Konto existiert noch nicht -> direkt registrieren
  if (/invalid login credentials/i.test(error.message)) {
    err.textContent = "Konto yok, şimdi kaydediliyor... (Kayıt sonrası tekrar giriş yap, e-postanı onayla!)";
    const { error: sigErr } = await sb.auth.signUp({ email, password });
    if (sigErr) {
      err.textContent = "Kayıt hatası: " + sigErr.message;
    } else {
      err.textContent =
        "✅ Kayıt tamam! E-postanı kontrol et ve onayla, sonra tekrar giriş yap.";
    }
    return;
  }

  err.textContent = error.message;
}

async function doSignup() {
  const email = $("login-email").value.trim();
  const password = $("login-password").value;
  const err = $("login-error");
  err.textContent = "";

  if (!email || password.length < 6) {
    err.textContent = "E-posta ve en az 6 haneli bir parola gir.";
    return;
  }
  const { error } = await sb.auth.signUp({ email, password });
  if (error) {
    err.textContent = error.message;
  } else {
    err.textContent =
      "✅ Kayıt tamam! Şimdi e-postandaki onay bağlantısına tıkla ve tekrar giriş yap.";
  }
}

async function doLogout() {
  await sb.auth.signOut();
  location.reload();
}

// ---------- PROGRESS LOADING / SAVING (cloud) ----------
async function loadCard() {
  const { data } = await supabase
    .from("learner_cards")
    .select("card")
    .eq("user_id", state.user.id)
    .maybeSingle();

  if (data && data.card) {
    state.card = data.card;
  } else {
    state.card.createdDay = todayStr();
    await saveCard();
  }
  updateStreakForToday();
}

async function saveCard() {
  await sb.from("learner_cards").upsert({
    user_id: state.user.id,
    card: state.card,
    updated_at: new Date().toISOString(),
  });
}

// ---------- STREAK ----------
function updateStreakForToday() {
  const today = todayStr();
  if (state.card.lastActiveDay === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.card.lastActiveDay === yesterday) {
    state.card.streak += 1;
  } else if (state.card.lastActiveDay && state.card.lastActiveDay !== yesterday) {
    // streak bozuldu
    state.card.streak = 1;
  } else {
    state.card.streak = 1; // ilk gün
  }
  state.card.bestStreak = Math.max(state.card.streak, state.card.bestStreak || 0);
  state.card.lastActiveDay = today;
  saveCard();
}

function markActive() {
  if (state.card.lastActiveDay !== todayStr()) updateStreakForToday();
}

// ---------- APP SHOW / NAVIGATION ----------
function showApp() {
  $("login-screen").classList.add("hidden");
  $("app").classList.remove("hidden");
  loadCard().then(() => {
    renderHome();
    setView("home");
  });
}

function setView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("view-" + name).classList.remove("hidden");
  document.querySelectorAll(".bottomnav button").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === name);
  });

  if (name === "home") renderHome();
  if (name === "new") startNewWords();
  if (name === "rev") {
    if (state.session) renderRevItem();
    else startSession();
  }
  if (name === "write") renderWriting();
  if (name === "phone") renderPhone();
  if (name === "prog") renderProgress();
}

// ---------- HOME ----------
function newItemsForToday() {
  const seen = new Set(state.card.seen);
  const unseen = VOCAB.filter((v) => !seen.has(v.id));
  return unseen.sort((a, b) => a.week - b.week).slice(0, NEW_PER_DAY);
}

function dueItemsForToday() {
  const today = todayStr();
  const due = [];
  for (const v of VOCAB) {
    if (!state.card.seen.includes(v.id)) continue;
    const level = state.card.box[v.id] ?? 0;
    const last = (state.card.lastReview || {})[v.id];
    const interval = BOX_INTERVALS[level];
    if (!last) {
      if (interval === 0) due.push(v);
      continue;
    }
    const daysDiff = Math.floor((new Date(today) - new Date(last)) / 86400000);
    if (daysDiff >= interval) due.push(v);
  }
  return shuffle(due).slice(0, DUE_SESSION_MAX);
}

function renderHome() {
  const newItems = newItemsForToday();
  const dueItems = dueItemsForToday();
  const seen = state.card.seen.length;

  $("stat-new").textContent = newItems.length;
  $("stat-due").textContent = dueItems.length;
  $("stat-known").textContent = seen;
  $("streak-count").textContent = state.card.streak;

  const levels = Object.values(state.card.box);
  $("stat-box").textContent = levels.length ? Math.max(...levels) + 1 : "-";

  const total = newItems.length + dueItems.length;
  const startBtn = $("btn-start");
  if (total === 0) {
    startBtn.textContent = "🎉 Bugün hepsi tamam! Yarın görüşürüz";
    startBtn.disabled = true;
    startBtn.style.opacity = 0.6;
  } else {
    startBtn.disabled = false;
    startBtn.style.opacity = 1;
    startBtn.textContent = `▶ Öğrenmeye Başla (${total})`;
  }

  const cel = $("celebrate-box");
  if (seen > 0 && seen % 10 === 0) {
    cel.textContent = milestoneFor(seen);
    cel.classList.remove("hidden");
  } else {
    cel.classList.add("hidden");
  }

  renderGoal();
}

function milestoneFor(seen) {
  if (seen >= 68) return "🏆 Muhteşem! Tüm kelimeler görüldü — sen harikasın!";
  if (seen >= 50) return "🌟 50 kelime! Bu çok büyük bir adım!";
  if (seen >= 36) return "💪 36 kelime! 3. haftaya geldin!";
  if (seen >= 18) return "🎉 18 kelime! Harika gidiyorsun!";
  if (seen >= 5) return "🌱 İlk 5 kelime! Başlangıç harika!";
  return "";
}

// ---------- START SESSION ----------
function startSession() {
  const newItems = newItemsForToday();
  const dueItems = dueItemsForToday();
  state.session = {
    items: [...dueItems, ...newItems],
    index: 0,
    correct: 0,
  };
  setView("rev");
  renderRevItem();
}

// ---------- YENİ KELİMELER (Flashcards) ----------
let newQueue = [];
let newIndex = 0;

function startNewWords() {
  newQueue = newItemsForToday();
  newIndex = 0;
  if (newQueue.length === 0) {
    setView("home");
    return;
  }
  setView("new");
  renderNewCard();
}

function renderNewCard() {
  const v = newQueue[newIndex];
  $("new-de").textContent = v.de;
  $("new-phon").textContent = "(" + v.phon + ")";
  $("new-tr").textContent = v.tr;
  $("new-tr").classList.add("hidden");
  $("new-hint").classList.remove("hidden");
  $("progress-fill").style.width =
    Math.round((newIndex / newQueue.length) * 100) + "%";
  speak(v.de);
  $("new-card").onclick = () => {
    $("new-tr").classList.remove("hidden");
    $("new-hint").classList.add("hidden");
  };
}

function answerNew(know) {
  const v = newQueue[newIndex];
  markActive();
  if (!state.card.seen.includes(v.id)) state.card.seen.push(v.id);
  state.card.box[v.id] = know ? 1 : 0;
  state.card.lastReview = state.card.lastReview || {};
  state.card.lastReview[v.id] = todayStr();
  saveCard();

  newIndex++;
  if (newIndex < newQueue.length) {
    renderNewCard();
  } else {
    setView("home");
    const cel = $("celebrate-box");
    cel.textContent = `🎉 Tebrikler! ${newQueue.length} yeni kelime öğrendin!`;
    cel.classList.remove("hidden");
    toast(`🏅 Yeni kelime sayısı: ${state.card.seen.length} 🌟`, "ok");
    renderHome();
  }
}

// ---------- TEKRAR (Wiederholung, 4 Übungsarten) ----------
function div(cls, text) {
  const d = document.createElement("div");
  d.className = cls;
  d.textContent = text;
  return d;
}

function renderRevItem() {
  const s = state.session;
  $("rev-progress-fill").style.width =
    Math.round((s.index / s.items.length) * 100) + "%";

  if (s.index >= s.items.length) {
    finishSession();
    return;
  }

  const v = s.items[s.index];
  const mode = pickMode(v);
  const content = $("rev-content");
  const instr = $("rev-instruction");

  if (mode === "de2tr") {
    instr.textContent = "Bu Almanca kelimenin Türkçesi hangisi?";
    content.innerHTML = "";
    const q = div("rev-question", v.de);
    const opts = div("rev-options");
    shuffle([v, ...distractors(v, 3)]).forEach((d) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = d.tr;
      b.onclick = () => answerRev(d.id === v.id, b);
      opts.appendChild(b);
    });
    content.appendChild(q);
    content.appendChild(opts);
    setTimeout(() => speak(v.de), 200);
  } else if (mode === "tr2de") {
    instr.textContent = "Bu Türkçe kelimenin Almancası hangisi?";
    content.innerHTML = "";
    const q = div("rev-question", v.tr);
    const opts = div("rev-options");
    shuffle([v, ...distractors(v, 3)]).forEach((d) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = d.de;
      b.onclick = () => answerRev(d.id === v.id, b);
      opts.appendChild(b);
    });
    content.appendChild(q);
    content.appendChild(opts);
  } else if (mode === "listen") {
    instr.textContent = "Dinle → hangisini duyuyorsun?";
    content.innerHTML = "";
    const q = document.createElement("div");
    q.className = "rev-question";
    const btn = document.createElement("button");
    btn.className = "speak-btn";
    btn.style.position = "static";
    btn.textContent = "🔊";
    btn.onclick = () => speak(v.de);
    q.appendChild(btn);
    const opts = div("rev-options");
    shuffle([v, ...distractors(v, 3)]).forEach((d) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = d.de;
      b.onclick = () => answerRev(d.id === v.id, b);
      opts.appendChild(b);
    });
    content.appendChild(q);
    content.appendChild(opts);
    setTimeout(() => speak(v.de), 300);
  } else {
    instr.textContent = "Dinle ve Almanca kelimeyi yaz. (İpucu: telaffuzuna bak)";
    content.innerHTML = "";
    const hint = div("rev-question", v.phon);
    hint.style.fontSize = "22px";
    hint.style.fontStyle = "italic";
    hint.style.color = "var(--muted)";
    const input = document.createElement("input");
    input.className = "rev-input";
    input.placeholder = "Buraya yaz...";
    input.autocapitalize = "off";
    input.autocomplete = "off";
    input.value = "";
    const check = document.createElement("button");
    check.className = "btn btn-primary";
    check.textContent = "Kontrol Et";
    const box = document.createElement("div");
    box.style.marginTop = "8px";
    content.appendChild(hint);
    content.appendChild(input);
    content.appendChild(check);
    content.appendChild(box);
    setTimeout(() => speak(v.de), 300);
    const doWriteCheck = () => {
      const ok = normalize(input.value) === normalize(v.de);
      box.textContent = ok ? "✅ Doğru!" : "❌ Doğrusu: " + v.de;
      box.style.color = ok ? "var(--green)" : "var(--red)";
      box.style.fontWeight = "700";
      if (!ok) {
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
      }
      speak(v.de);
      setTimeout(() => answerRev(ok, null), 1600);
    };
    input.onkeydown = (e) => { if (e.key === "Enter") doWriteCheck(); };
    check.onclick = doWriteCheck;
    setTimeout(() => input.focus(), 100);
  }
}

function pickMode(v) {
  const level = state.card.box[v.id] ?? 0;
  const r = Math.random();
  if (v.type === "sentence") return r < 0.5 ? "de2tr" : "tr2de";
  if (level <= 1 && r < 0.4) return "write";
  if (r < 0.4) return "de2tr";
  if (r < 0.7) return "tr2de";
  return "listen";
}

function distractors(v, n) {
  const sameWeek = VOCAB.filter((d) => d.id !== v.id && d.week === v.week);
  const rest = VOCAB.filter((d) => d.id !== v.id && d.week !== v.week);
  return [...shuffle(sameWeek), ...shuffle(rest)].slice(0, n);
}

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9äöü ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function answerRev(correct, btn) {
  const s = state.session;
  const v = s.items[s.index];
  markActive();
  state.card.totalReviews = (state.card.totalReviews || 0) + 1;
  if (correct) {
    state.card.totalCorrect = (state.card.totalCorrect || 0) + 1;
    s.correct++;
    if (btn) btn.classList.add("correct");
    state.card.box[v.id] = Math.min(5, (state.card.box[v.id] ?? 0) + 1);
  } else {
    if (btn) btn.classList.add("wrong");
    state.card.box[v.id] = 0;
    state.card.lapses = state.card.lapses || {};
    state.card.lapses[v.id] = (state.card.lapses[v.id] || 0) + 1;
  }
  state.card.lastReview = state.card.lastReview || {};
  state.card.lastReview[v.id] = todayStr();
  saveCard();

  document.querySelectorAll("#rev-content .opt-btn").forEach((b) => (b.disabled = true));
  if (!correct) {
    document.querySelectorAll("#rev-content .opt-btn").forEach((b) => {
      if (b.textContent === v.tr || b.textContent === v.de) b.classList.add("correct");
    });
  }
  s.index++;
  setTimeout(renderRevItem, correct ? 700 : 1500);
}

function finishSession() {
  const s = state.session;
  const pct = Math.round((s.correct / s.items.length) * 100);
  setView("home");
  const cel = $("celebrate-box");
  cel.textContent =
    pct >= 80
      ? `🏆 Harika! ${s.correct}/${s.items.length} doğru! Sen süpersin!`
      : pct >= 50
      ? `💪 İyi iş! ${s.correct}/${s.items.length} doğru — devam!`
      : `🌱 ${s.correct}/${s.items.length} doğru. Az çalış çok tekrar, başaracaksın!`;
  cel.classList.remove("hidden");
  if (pct >= 80) toast("🏅 Mükemmel tur! " + pct + "% doğru 🎉", "ok");
  renderHome();
}

// ---------- YAZMA (Schreiben auf Papier) ----------
function currentWritingWords() {
  const seenWords = VOCAB.filter((v) => state.card.seen.includes(v.id) && v.type === "word");
  const week = Math.min(4, Math.floor((state.card.seen.length - 1) / 18) + 1);
  const inWeek = seenWords.filter((v) => v.week === week);
  const rest = seenWords.filter((v) => v.week !== week);
  return shuffle([...inWeek, ...rest]).slice(0, WRITING_PER_WEEK);
}

function renderWriting() {
  const words = currentWritingWords();
  const list = $("writing-list");
  list.innerHTML = "";
  const today = todayStr();
  words.forEach((v) => {
    const key = today + "_" + v.id;
    const done = !!state.card.writingDone[key];
    const item = document.createElement("div");
    item.className = "task-item";

    const check = document.createElement("button");
    check.className = "task-check" + (done ? " done" : "");
    check.textContent = "✓";
    check.onclick = () => {
      if (state.card.writingDone[key]) delete state.card.writingDone[key];
      else {
        state.card.writingDone[key] = true;
        markActive();
      }
      saveCard();
      renderWriting();
    };

    const main = document.createElement("div");
    main.className = "task-main";
    main.innerHTML = `<div class="task-de">${v.de}</div><div class="task-tr">${v.tr} · 5 kez yaz</div>`;

    const sp = document.createElement("button");
    sp.className = "mini-speak";
    sp.textContent = "🔊";
    sp.onclick = () => speak(v.de, 0.8);

    item.appendChild(check);
    item.appendChild(main);
    item.appendChild(sp);
    list.appendChild(item);
  });
}

// ---------- TELEFON (Anruf-Übung) ----------
function phoneWords() {
  const seenWords = VOCAB.filter((v) => state.card.seen.includes(v.id));
  const scored = seenWords.map((v) => ({
    v,
    score: (state.card.lapses?.[v.id] || 0) * 3 + (5 - (state.card.box[v.id] ?? 0)),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, PHONE_PER_DAY).map((x) => x.v);
}

function renderPhone() {
  const words = phoneWords();
  const list = $("phone-list");
  list.innerHTML = "";
  if (words.length === 0) {
    list.innerHTML = '<p class="tip-box">Henüz telefon kelimesi yok — önce biraz kelime öğren! 📚</p>';
    return;
  }
  const today = todayStr();
  words.forEach((v) => {
    const key = today + "_" + v.id;
    const done = !!state.card.phoneDone[key];
    const item = document.createElement("div");
    item.className = "task-item";

    const check = document.createElement("button");
    check.className = "task-check" + (done ? " done" : "");
    check.textContent = "✓";
    check.onclick = () => {
      if (state.card.phoneDone[key]) delete state.card.phoneDone[key];
      else {
        state.card.phoneDone[key] = true;
        markActive();
      }
      saveCard();
      renderPhone();
    };

    const main = document.createElement("div");
    main.className = "task-main";
    main.innerHTML = `<div class="task-de">${v.de}</div><div class="task-tr">${v.tr}</div>`;

    const sp = document.createElement("button");
    sp.className = "mini-speak";
    sp.textContent = "🐢";
    sp.onclick = () => speakSlow(v.de);

    item.appendChild(check);
    item.appendChild(main);
    item.appendChild(sp);
    list.appendChild(item);
  });
}

// ---------- İLERLEME (Fortschritt) ----------
function renderProgress() {
  $("p-streak").textContent = state.card.streak;
  $("p-known").textContent = state.card.seen.length;
  $("p-done").textContent = state.card.totalReviews || 0;
  $("p-write").textContent = Object.keys(state.card.writingDone || {}).length;

  const boxList = $("box-list");
  boxList.innerHTML = "";
  const boxNames = [
    "Kutu 1 (her gün)",
    "Kutu 2 (1 günde bir)",
    "Kutu 3 (2 günde bir)",
    "Kutu 4 (4 günde bir)",
    "Kutu 5 (7 günde bir)",
    "Kutu 6 (14 günde bir)",
  ];
  for (let i = 0; i < 6; i++) {
    const count = Object.values(state.card.box).filter((b) => b === i).length;
    const row = document.createElement("div");
    row.className = "box-row";
    row.innerHTML = `<span class="box-name">${boxNames[i]}</span><span class="box-count">${count}</span>`;
    boxList.appendChild(row);
  }

  const mb = $("milestone-box");
  if (state.card.seen.length > 0 && state.card.seen.length % 10 === 0) {
    mb.textContent = milestoneFor(state.card.seen.length);
    mb.classList.remove("hidden");
  } else {
    mb.classList.add("hidden");
  }
}

// ---------- EVENT LISTENERS + START ----------
document.addEventListener("DOMContentLoaded", () => {
  $("btn-login").onclick = doLogin;
  $("btn-signup").onclick = doSignup;
  $("btn-back-login").onclick = () => {
    $("login-error").textContent = "";
  };
  $("btn-logout").onclick = doLogout;
  $("btn-start").onclick = startSession;
  $("new-speak").onclick = (e) => {
    e.stopPropagation();
    const v = newQueue[newIndex];
    if (v) speak(v.de);
  };
  $("new-known").onclick = () => answerNew(true);
  $("new-miss").onclick = () => answerNew(false);

  document.querySelectorAll(".bottomnav button").forEach((b) => {
    b.onclick = () => setView(b.dataset.view);
  });

  initAuth();
});
