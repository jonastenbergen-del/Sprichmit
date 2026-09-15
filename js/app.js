// ============================================================
// SPRICHMIT V4 — HAUPT-LOGIK (bidirektional DE <-> TR)
// ============================================================

let UI_LANG = "tr"; // wird in applyUiLang gesetzt (wird von t() in lang.js genutzt)

// ---------- SUPABASE ----------
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- RICHTUNG ----------
// lerntDe = true  -> Türke lernt Deutsch  -> UI: Türkisch, Daten: WORTER_DE
// lerntDe = false -> Deutscher lernt TR   -> UI: Deutsch,  Daten: WORTER_TR
let lerntDe = true;

const DATA = {
  get worte()     { return lerntDe ? WORTER_DE : WORTER_TR; },
  get worteMap()  { return lerntDe ? WORTER_DE_MAP : WORTER_TR_MAP; },
  get lektionen() { return lerntDe ? DE_LEKTIONEN : TR_LEKTIONEN; },
  get ziel()        { return (w) => (lerntDe ? w.de : w.tr); },
  get quelle()      { return (w) => (lerntDe ? w.tr : w.de); },
  get zielBeispiel() { return (w) => (lerntDe ? w.beispielDe : w.beispielTr); },
  get quelleBeispiel() { return (w) => (lerntDe ? w.beispielTr : w.beispielDe); },
  get ttsLang() { return lerntDe ? "de-DE" : "tr-TR"; },
  get uiLang()  { return lerntDe ? "tr" : "de"; },
  get target()  { return lerntDe ? "de" : "tr"; },
};

function applyUiLang() {
  UI_LANG = DATA.uiLang;
  document.documentElement.lang = UI_LANG;
}

// ---------- STATE ----------
const state = {
  user: null,
  profile: { name: "", mother_tongue: "tr", ui_color: "blau" },
  card: null,    // aktive Lernkarte (für die aktuelle Richtung)
  session: null,
};

function leerCard() {
  return {
    streak: 0,
    bestStreak: 0,
    lastActiveDay: "",
    xp: 0,
    createdDay: "",
    words: {},   // wortId -> { box: 0..5, last: "yyyy-mm-dd", lapses: n }
    lessons: {}, // lektionId -> { done: bool, sessions: n }
  };
}

// ---------- HELPERS ----------
const $ = (id) => document.getElementById(id);
const todayStr = () => new Date().toISOString().slice(0, 10);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const normalize = (s) => (s || "").toLocaleLowerCase("tr").replace(/\s+/g, "");

// ---------- TOAST ----------
let toastTimer = null;
function toast(msg, variant) {
  let tEl = $("toast");
  if (!tEl) {
    tEl = document.createElement("div");
    tEl.id = "toast";
    tEl.className = "toast";
    document.body.appendChild(tEl);
  }
  tEl.textContent = msg;
  tEl.classList.remove("hidden", "tok", "twarn");
  if (variant) tEl.classList.add("t" + variant);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => tEl.classList.add("hidden"), 2600);
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
    err.textContent = "❗";
    return;
  }
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (!error) {
    state.user = data.user;
    showApp();
    return;
  }
  if (/invalid login credentials/i.test(error.message)) {
    err.textContent = t("login.registering");
    const { error: sigErr } = await sb.auth.signUp({ email, password });
    err.textContent = sigErr
      ? t("login.error", { msg: sigErr.message })
      : "✅ " + t("login.registered");
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
    err.textContent = "❗";
    return;
  }
  const { error } = await sb.auth.signUp({ email, password });
  err.textContent = error ? error.message : "✅ " + t("login.registered");
}

async function doLogout() {
  await sb.auth.signOut();
  location.reload();
}

// ---------- PROFIL ----------
async function loadProfile() {
  const { data } = await sb.from("profiles").select("*").eq("user_id", state.user.id).maybeSingle();
  if (data) {
    state.profile = data;
    lerntDe = data.mother_tongue !== "de";
  } else {
    state.profile = { name: state.user.email.split("@")[0], mother_tongue: lerntDe ? "tr" : "de", ui_color: "blau" };
    await sb.from("profiles").upsert({ user_id: state.user.id, ...state.profile });
  }
  applyUiLang();
}

async function setRichtung(neuLerntDe) {
  if (neuLerntDe === lerntDe) return;
  lerntDe = neuLerntDe;
  state.profile.mother_tongue = lerntDe ? "tr" : "de";
  await sb.from("profiles").update({ mother_tongue: state.profile.mother_tongue }).eq("user_id", state.user.id);
  applyUiLang();
  TTS.init(DATA.ttsLang);
  await loadCard();
  state.session = null;
  renderAll();
  setView("path");
  toast(t("profile.dirsaved"), "ok");
}

// ---------- CARD LOAD/SAVE (pro Richtung, in learner_cards.cards_de / cards_tr) ----------
function cardFeld() { return "cards_" + (lerntDe ? "de" : "tr"); }

async function loadCard() {
  const { data } = await sb.from("learner_cards").select("card").eq("user_id", state.user.id).maybeSingle();
  const feld = cardFeld();
  if (data && data.card && data.card[feld]) {
    state.card = data.card[feld];
  } else {
    state.card = leerCard();
    if (!data || !data.card) state.card.createdDay = todayStr();
    await saveCard();
  }
  state.card.words = state.card.words || {};
  state.card.lessons = state.card.lessons || {};
  updateStreakForToday();
}

async function saveCard() {
  let existing = {};
  const { data } = await sb.from("learner_cards").select("card").eq("user_id", state.user.id).maybeSingle();
  if (data && data.card) existing = data.card;
  existing[cardFeld()] = state.card;
  await sb.from("learner_cards").upsert({
    user_id: state.user.id,
    card: existing,
    updated_at: new Date().toISOString(),
  });
}

// ---------- STREAK ----------
function updateStreakForToday() {
  const today = todayStr();
  if (state.card.lastActiveDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.card.lastActiveDay === yesterday) state.card.streak += 1;
  else state.card.streak = 1;
  state.card.bestStreak = Math.max(state.card.streak, state.card.bestStreak || 0);
  state.card.lastActiveDay = today;
  saveCard();
}

function markActive() {
  if (state.card.lastActiveDay !== todayStr()) updateStreakForToday();
}

// ---------- LEKTIONS-LOGIK ----------
function lessonWords(lessonId) {
  return DATA.worte.filter((w) => w.lektion === lessonId);
}

function isLessonDone(lessonId) {
  const l = state.card.lessons[lessonId];
  if (l && l.done) return true;
  const seen = new Set(Object.keys(state.card.words).map(Number));
  return lessonWords(lessonId).every((w) => seen.has(w.id));
}

function nextLesson() {
  for (const l of DATA.lektionen) {
    if (!isLessonDone(l.id)) return l;
  }
  return null;
}

function lessonUnlocked(lessonId) {
  if (lessonId === 1) return true;
  return isLessonDone(lessonId - 1);
}

function newWordsForSession() {
  const l = nextLesson();
  if (!l) return [];
  const seen = new Set(Object.keys(state.card.words).map(Number));
  return lessonWords(l.id).filter((w) => !seen.has(w.id)).slice(0, NEW_IN_SESSION);
}

function dueWordsForSession() {
  const today = todayStr();
  const due = [];
  for (const w of DATA.worte) {
    const entry = state.card.words[w.id];
    if (!entry) continue;
    const interval = BOX_INTERVALS[entry.box ?? 0];
    if (!entry.last) {
      if (interval === 0) due.push(w);
      continue;
    }
    const daysDiff = Math.floor((new Date(today) - new Date(entry.last)) / 86400000);
    if (daysDiff >= interval) due.push(w);
  }
  return shuffle(due).slice(0, REVIEW_IN_SESSION);
}

function allSeenCount() {
  return Object.keys(state.card.words).length;
}

// ---------- APP SHOW / NAVIGATION ----------
async function showApp() {
  $("login-screen").classList.add("hidden");
  $("app").classList.remove("hidden");
  await loadProfile();
  TTS.init(DATA.ttsLang);
  await loadCard();
  renderAll();
  setView("home");
}

function setView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("view-" + name).classList.remove("hidden");
  if (name === "home") renderHome();
  if (name === "path") renderPath();
  if (name === "profile") renderProfile();
}

function renderAll() {
  $("streak-count").textContent = state.card ? state.card.streak : 0;
  $("streak-unit").textContent = t("home.streak");
  $("home-hello").textContent = t("home.hello", { name: state.profile.name || "🙂" });
  $("home-learning").textContent = "📖 " + t("home.learning");
  $("label-newtoday").textContent = t("home.newtoday");
  $("label-duetoday").textContent = t("home.duetoday");
  $("label-known").textContent = t("profile.stats.words");
  $("label-xp").textContent = t("profile.stats.xp");
  $("path-h2").textContent = t("path.title");
  $("path-sub").textContent = t("path.sub");
  $("home-tip").textContent = t("home.tip");
  $("goal-titel").textContent = t("home.goal.title");
  $("profile-h2").textContent = t("profile.title");
  $("profile-direction-label").textContent = t("profile.direction");
  $("p-streak-l").textContent = t("profile.stats.streak");
  $("p-known-l").textContent = t("profile.stats.words");
  $("p-lessons-l").textContent = t("profile.stats.lessons");
  $("p-xp-l").textContent = t("profile.stats.xp");
  $("p-logout").textContent = t("profile.out");
  $("login-sub").textContent = t("login.sub");
  $("login-choose").textContent = t("login.choose");
  $("btn-login").textContent = t("login.submit");
  markDirButtons();
}

function markDirButtons() {
  const pairs = [["dir-de", lerntDe], ["dir-tr", !lerntDe], ["p-dir-de", lerntDe], ["p-dir-tr", !lerntDe]];
  pairs.forEach(([id, on]) => {
    $(id).classList.toggle("btn-primary", !!on);
    $(id).classList.toggle("btn-ghost", !on);
  });
}

// ---------- HOME ----------
function renderGoal() {
  const box = $("goal-box");
  const openLessons = DATA.lektionen.filter((l) => !isLessonDone(l.id)).length;
  if (openLessons > 0) {
    $("goal-text").textContent = t("misc.goal.lessons.t", { n: openLessons });
    $("goal-fill").style.width = Math.min(100, Math.round(((20 - openLessons) / 20) * 100)) + "%";
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
  }
}

function renderHome() {
  const newItems = newWordsForSession();
  const dueItems = dueWordsForSession();
  const seen = allSeenCount();

  $("stat-new").textContent = newItems.length;
  $("stat-due").textContent = dueItems.length;
  $("stat-known").textContent = seen;
  $("stat-xp").textContent = state.card.xp || 0;

  const total = newItems.length + dueItems.length;
  const startBtn = $("btn-path");
  if (total === 0) {
    $("path-btn-label").textContent = t("home.startnone");
    startBtn.disabled = true;
    startBtn.style.opacity = 0.6;
  } else {
    startBtn.disabled = false;
    startBtn.style.opacity = 1;
    $("path-btn-label").textContent = t("home.start") + " (" + total + ")";
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
  if (seen >= 1000) return t("misc.milestoneAll");
  const ms = LANG[UI_LANG].misc.milestones;
  if (seen >= 75) return ms[3];
  if (seen >= 50) return ms[2];
  if (seen >= 25) return ms[1];
  if (seen >= 10) return ms[0];
  return "";
}

// ---------- PFAAD (20 Lektionen) ----------
function renderPath() {
  const list = $("lesson-list");
  list.innerHTML = "";
  DATA.lektionen.forEach((l) => {
    const done = isLessonDone(l.id);
    const unlocked = lessonUnlocked(l.id);
    const seenCount = lessonWords(l.id).filter((w) => state.card.words[w.id]).length;
    const row = document.createElement("div");
    row.className = "task-item" + (unlocked ? "" : " locked");
    row.style.opacity = unlocked ? "1" : "0.45";

    const emoji = document.createElement("div");
    emoji.className = "task-de";
    emoji.style.fontSize = "26px";
    emoji.style.width = "38px";
    emoji.style.textAlign = "center";
    emoji.textContent = done ? "✅" : l.emoji;

    const main = document.createElement("div");
    main.className = "task-main";
    main.innerHTML =
      '<div class="task-de">' + l.emoji + " " + l.id + " — " + l.titel + "</div>" +
      '<div class="task-tr">' +
      (done ? "✔ " + t("path.done") : unlocked ? seenCount + "/" + WORDS_PER_LESSON + " · " + t("path.start") : "🔒 " + t("path.locked")) +
      "</div>";

    if (unlocked) {
      row.onclick = () => startSession(l.id);
      row.style.cursor = "pointer";
    }
    list.appendChild(row);
  });
}

// ---------- SESSION ----------
function startSession(lessonId) {
  const l = lessonId || (nextLesson() && nextLesson().id) || 1;
  const fresh = newWordsForSession();
  const due = dueWordsForSession();
  const items = [
    ...due.map((w) => ({ w, fresh: false })),
    ...fresh.map((w) => ({ w, fresh: true })),
  ];
  if (items.length === 0) {
    toast(t("home.startnone"), "ok");
    return;
  }
  state.session = {
    lessonId: l,
    items: items,
    index: 0,
    correct: 0,
    results: [],
  };
  setView("session");
  renderSessionItem();
}

function sessionProgress() {
  const s = state.session;
  $("progress-fill").style.width = Math.round((s.index / s.items.length) * 100) + "%";
}

function renderSessionItem() {
  const s = state.session;
  sessionProgress();
  if (s.index >= s.items.length) {
    finishSession();
    return;
  }
  const it = s.items[s.index];
  const v = it.w;
  const mode = it.fresh ? "learn" : pickMode(v);
  const content = $("session-content");
  const instr = $("session-instruction");
  content.innerHTML = "";

  if (mode === "learn") {
    // Neue Karte: Zielwort groß + Aussprache + Beispiel, dann flippen
    instr.textContent = t("session.hint");
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML =
      '<button class="speak-btn" id="s-speak">🔊</button>' +
      '<div class="flashcard-de">' + DATA.ziel(v) + "</div>" +
      '<div class="flashcard-phon">(' + v.aussprache + ")</div>" +
      '<div class="flashcard-hint">' + t("session.example") + ": " + DATA.quelleBeispiel(v) + "</div>" +
      '<div class="flashcard-tr hidden" id="s-flip"></div>';
    content.appendChild(card);

    const row = document.createElement("div");
    row.className = "answer-row";
    const knowBtn = document.createElement("button");
    knowBtn.className = "btn btn-right";
    knowBtn.textContent = t("session.knownbtn");
    knowBtn.onclick = () => answerItem(true, it);
    const zorBtn = document.createElement("button");
    zorBtn.className = "btn btn-wrong";
    zorBtn.textContent = t("session.zorbtn");
    zorBtn.onclick = () => answerItem(false, it);
    row.appendChild(zorBtn);
    row.appendChild(knowBtn);
    content.appendChild(row);

    TTS.speak(DATA.ziel(v));
    card.onclick = () => {
      const flip = $("s-flip");
      if (flip.classList.contains("hidden")) {
        flip.textContent = DATA.quelle(v) + " — " + DATA.zielBeispiel(v);
        flip.classList.remove("hidden");
        TTS.speak(DATA.zielBeispiel(v));
      }
    };
    $("s-speak").onclick = (e) => {
      e.stopPropagation();
      TTS.slow(DATA.ziel(v));
    };
  } else {
    renderExercise(mode, v, content, instr);
  }
}

function pickMode(v) {
  const r = Math.random();
  if (r < 0.3) return "de2tr";
  if (r < 0.6) return "tr2de";
  if (r < 0.8) return "listen";
  return "write";
}

function div(cls, text) {
  const d = document.createElement("div");
  d.className = cls;
  if (text) d.textContent = text;
  return d;
}

function distractors(v, n) {
  const sameLesson = DATA.worte.filter((d) => d.id !== v.id && d.lektion === v.lektion);
  const rest = DATA.worte.filter((d) => d.id !== v.id && d.lektion !== v.lektion);
  return [...shuffle(sameLesson), ...shuffle(rest)].slice(0, n);
}

function renderExercise(mode, v, content, instr) {
  const Z = DATA.ziel;
  const Q = DATA.quelle;
  const it = state.session.items[state.session.index];
  const mkOpt = (arr) => {
    const opts = div("rev-options");
    shuffle(arr).forEach((d) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = Z(d);
      b.onclick = () => answerItem(d.id === v.id, it, d);
      opts.appendChild(b);
    });
    return opts;
  };
  if (mode === "de2tr") {
    instr.textContent = t("session.choose");
    const q = div("rev-question", Z(v) + "  🔊");
    q.style.cursor = "pointer";
    q.onclick = () => TTS.speak(Z(v));
    content.appendChild(q);
    content.appendChild(mkOpt([v, ...distractors(v, 3)]));
  } else if (mode === "tr2de") {
    instr.textContent = t("session.choose");
    const q = div("rev-question", Q(v) + "  🔊");
    q.style.cursor = "pointer";
    q.onclick = () => TTS.speak(Z(v));
    content.appendChild(q);
    content.appendChild(mkOpt([v, ...distractors(v, 3)]));
  } else if (mode === "listen") {
    instr.textContent = t("session.listen");
    const q = document.createElement("div");
    q.className = "rev-question";
    const btn = document.createElement("button");
    btn.className = "speak-btn";
    btn.style.position = "static";
    btn.textContent = "🔊";
    btn.onclick = () => TTS.speak(Z(v));
    q.appendChild(btn);
    content.appendChild(q);
    content.appendChild(mkOpt([v, ...distractors(v, 3)]));
    setTimeout(() => TTS.speak(Z(v)), 300);
  } else {
    // write: Zielwort anhören + Aussprache-Hinweis, dann schreiben
    instr.textContent = t("session.write", { word: "🔊" });
    const hint = div("rev-question", "(" + v.aussprache + ")");
    hint.style.fontSize = "22px";
    hint.style.fontStyle = "italic";
    hint.style.cursor = "pointer";
    hint.onclick = () => TTS.slow(Z(v));
    const input = document.createElement("input");
    input.className = "rev-input";
    input.placeholder = "…";
    input.autocapitalize = "off";
    input.autocomplete = "off";
    const check = document.createElement("button");
    check.className = "btn btn-primary";
    check.style.marginTop = "10px";
    check.textContent = t("session.check");
    const box = div("", "");
    box.style.marginTop = "8px";
    content.appendChild(hint);
    content.appendChild(input);
    content.appendChild(check);
    content.appendChild(box);
    setTimeout(() => TTS.speak(Z(v)), 300);
    const doWriteCheck = () => {
      const ok = normalize(input.value) === normalize(Z(v));
      box.textContent = ok ? t("session.correct") : t("session.wrong", { ans: Z(v) });
      box.style.color = ok ? "var(--green)" : "var(--red)";
      box.style.fontWeight = "700";
      if (!ok) {
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
      }
      TTS.speak(Z(v));
      setTimeout(() => answerItem(ok, it, null), 1600);
    };
    input.onkeydown = (e) => { if (e.key === "Enter") doWriteCheck(); };
    check.onclick = doWriteCheck;
  }
}

function answerItem(correct, it, wrongPick) {
  const s = state.session;
  const v = it.w;
  markActive();
  const entry = state.card.words[v.id] || { box: 0, last: "", lapses: 0 };
  if (correct) {
    entry.box = Math.min(5, (entry.box ?? 0) + 1);
    s.correct++;
  } else {
    entry.box = 0;
    entry.lapses = (entry.lapses || 0) + 1;
  }
  entry.last = todayStr();
  state.card.words[v.id] = entry;
  const xpGewinn = correct ? (it.fresh ? 5 : 2) : 0;
  if (xpGewinn) {
    state.card.xp = (state.card.xp || 0) + xpGewinn;
    toast(t("misc.xpt", { n: xpGewinn }), "ok");
  }
  s.results.push({ w: v, fresh: it.fresh, correct, wrongPick: wrongPick && !correct ? wrongPick : null });
  saveCard();
  s.index++;
  if (s.index < s.items.length) renderSessionItem();
  else finishSession();
}

function finishSession() {
  const s = state.session;
  const l = state.card.lessons[s.lessonId] || { done: false, sessions: 0 };
  l.sessions = (l.sessions || 0) + 1;
  if (isLessonDone(s.lessonId)) l.done = true;
  state.card.lessons[s.lessonId] = l;

  const freshCount = s.results.filter((r) => r.fresh).length;
  const wrong = s.results.filter((r) => !r.correct);
  const perfect = wrong.length === 0 && s.items.length > 0;
  const xpTotal = s.results.filter((r) => r.correct).length * 2 + freshCount * 5 + (perfect ? 10 : 0);
  state.card.xp = (state.card.xp || 0) + (perfect ? 10 : 0);
  saveCard();

  const rc = $("result-content");
  rc.innerHTML = "";
  const h = document.createElement("h2");
  h.textContent = t("result.title");
  rc.appendChild(h);

  const stats = document.createElement("div");
  stats.className = "cards-grid";
  stats.innerHTML =
    '<div class="stat-card"><div class="stat-num">' + freshCount + '</div><div class="stat-label">' + t("result.words") + "</div></div>" +
    '<div class="stat-card"><div class="stat-num">' + s.correct + "/" + s.items.length + '</div><div class="stat-label">' + t("result.correct") + "</div></div>" +
    '<div class="stat-card"><div class="stat-num">+' + xpTotal + '</div><div class="stat-label">' + t("result.xp") + (perfect ? " · " + t("result.xpbonus") : "") + "</div></div>";
  rc.appendChild(stats);

  if (l.done) {
    const next = DATA.lektionen.find((x) => x.id === s.lessonId + 1);
    if (next) {
      rc.appendChild(div("tip-box", "🔓 " + next.emoji + " " + next.id + " — " + next.titel + " " + t("path.start")));
    } else {
      rc.appendChild(div("tip-box", t("misc.milestoneAll")));
    }
  }

  if (wrong.length > 0) {
    const p = document.createElement("p");
    p.className = "instruction";
    p.textContent = t("res.good");
    rc.appendChild(p);
    wrong.slice(0, 5).forEach((r) => {
      const row = div("task-item", "");
      row.style.marginBottom = "6px";
      row.innerHTML =
        '<div class="task-main"><div class="task-de">' + DATA.ziel(r.w) + "</div>" +
        '<div class="task-tr">' + (r.wrongPick ? "❌ " + DATA.ziel(r.wrongPick) + " → " : "") + DATA.quelle(r.w) + " · " + DATA.zielBeispiel(r.w) + "</div></div>";
      rc.appendChild(row);
    });
  } else if (perfect) {
    rc.appendChild(div("tip-box", t("res.perfect")));
  }

  const back = document.createElement("button");
  back.className = "btn btn-primary btn-big";
  back.style.width = "100%";
  back.style.marginTop = "14px";
  back.textContent = t("result.back");
  back.onclick = () => {
    state.session = null;
    renderAll();
    setView("path");
  };
  rc.appendChild(back);
  setView("result");
}

// ---------- PROFIL ----------
function renderProfile() {
  $("p-streak").textContent = state.card.streak;
  $("p-known").textContent = allSeenCount();
  $("p-lessons").textContent =
    DATA.lektionen.filter((l) => isLessonDone(l.id)).length + "/" + DATA.lektionen.length;
  $("p-xp").textContent = state.card.xp || 0;
  markDirButtons();

  const boxList = $("box-list");
  boxList.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const count = Object.values(state.card.words).filter((b) => (b.box ?? 0) === i).length;
    const row = document.createElement("div");
    row.className = "box-row";
    row.innerHTML =
      '<span class="box-name">K' + (i + 1) + " (" + BOX_INTERVALS[i] + "T)</span><span class=\"box-count\">" + count + "</span>";
    boxList.appendChild(row);
  }

  const mb = $("milestone-box");
  const seen = allSeenCount();
  if (seen > 0 && seen % 10 === 0) {
    mb.textContent = milestoneFor(seen);
    mb.classList.remove("hidden");
  } else {
    mb.classList.add("hidden");
  }
}

// ---------- EVENTS + START ----------
document.addEventListener("DOMContentLoaded", () => {
  $("btn-login").onclick = doLogin;
  $("btn-signup").onclick = doSignup;
  $("btn-back-login").onclick = () => { $("login-error").textContent = ""; };
  $("btn-logout").onclick = () => setView("profile");
  $("p-logout").onclick = doLogout;
  $("btn-path").onclick = () => setView("path");
  $("dir-de").onclick = () => { lerntDe = true; applyUiLang(); markDirButtons(); };
  $("dir-tr").onclick = () => { lerntDe = false; applyUiLang(); markDirButtons(); };
  $("p-dir-de").onclick = () => setRichtung(true);
  $("p-dir-tr").onclick = () => setRichtung(false);
  initAuth();
});