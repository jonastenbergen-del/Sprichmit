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
  cardFull: null, // komplette learner_cards.card-Zeile (beide Richtungen)
  session: null,
};
let cardSaveChain = Promise.resolve(); // Save-Queue (seriell, keine Race Conditions)
let navDepth = 0; // wie viele App-Einträge in der Browser-History
let currentViewName = "home";
let backForwardGuard = false; // verhindert Endlos-Loop beim Abbrechen per Browser-Back

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

// An- / Registrierungs-Ansicht umschalten
function setAuthMode(mode) {
  const login = mode === "login";
  $("login-form").classList.toggle("hidden", !login);
  $("signup-form").classList.toggle("hidden", login);
  $("login-error").textContent = "";
  $("signup-error").textContent = "";
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
  // KEIN Auto-Registrieren mehr — klare Fehlermeldung
  if (/invalid login credentials/i.test(error.message)) {
    err.textContent = "❌ " + t("login.invalid");
  } else {
    err.textContent = "❌ " + t("login.error", { msg: error.message });
  }
}

async function doSignup() {
  const email = $("signup-email").value.trim();
  const password = $("signup-password").value;
  const err = $("signup-error");
  err.textContent = "";
  if (!email || password.length < 6) {
    err.textContent = "❗ " + t("login.shortpw");
    return;
  }
  const { error } = await sb.auth.signUp({ email, password });
  if (error) {
    if (/already registered|already been registered|already exists/i.test(error.message)) {
      err.textContent = "⚠️ " + t("login.exists");
    } else {
      err.textContent = "❌ " + t("login.error", { msg: error.message });
    }
    return;
  }
  err.textContent = "✅ " + t("login.signup.ok");
  // E-Mail-Bestätigung aus (Supabase-Standard ist an) -> direkt einloggen
  setAuthMode("login");
  $("login-email").value = email;
  $("login-password").value = password;
}

async function doForgot() {
  const email = $("login-email").value.trim();
  const err = $("login-error");
  err.textContent = "";
  if (!email) {
    err.textContent = "❗";
    return;
  }
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/?reset=1",
  });
  // Absichtlich immer "versendet" anzeigen, damit E-Mail-Adressen nicht
  // als Konten ausgeleckt werden (Supabase macht dasselbe).
  err.textContent = error
    ? "❌ " + t("login.error", { msg: error.message })
    : "📧 " + t("login.forgot.sent");
}

async function doLogout() {
  await flushCard(); // alle gespeicherten Fortschritte wirklich in die Cloud
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
  state.cardFull = (data && data.card) ? data.card : {};
  if (state.cardFull[feld]) {
    state.card = state.cardFull[feld];
  } else {
    state.card = leerCard();
    state.card.createdDay = todayStr();
    state.cardFull[feld] = state.card;
    saveCard();
  }
  state.card.words = state.card.words || {};
  state.card.lessons = state.card.lessons || {};
  updateStreakForToday();
}

async function doSaveCard() {
  const existing = state.cardFull || {};
  existing[cardFeld()] = state.card;
  const { error } = await sb.from("learner_cards").upsert({
    user_id: state.user.id,
    card: existing,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("saveCard upsert:", error);
}

// Speichert die Lernkarte (1 Request, seriell in einer Queue — mehrere Saves
// in kurzer Zeit werden hintereinander ausgeführt, nichts wird überschrieben)
function saveCard() {
  cardSaveChain = cardSaveChain.then(doSaveCard).catch((err) => console.error("saveCard:", err));
  return cardSaveChain;
}

// Alles wirklich gespeichert (z. B. vor Logout)
function flushCard() {
  return cardSaveChain;
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

// ---------- NAVIGATION ----------
// Die Browser-History ist die einzige Quelle der Wahrheit (funktioniert mit
// dem ⬅-Button in der Topbar UND mit dem Browser-/Handy-Back-Button).
// Home = Tiefe 0. Jede weitere Ansicht schiebt max. 1 History-Eintrag,
// Session hat immer ihren eigenen Eintrag (Back = Abbrechen mit Bestätigung).
function showView(name) {
  currentViewName = name;
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("view-" + name).classList.remove("hidden");
  updateBackBtn();
}

function renderForView(name) {
  if (name === "home") renderHome();
  if (name === "path") renderPath();
  if (name === "profile") renderProfile();
}

function setView(name) {
  if (name === "home") {
    // Home ist immer die Wurzel (Tiefe 0) — nie einen extra History-Eintrag
    navDepth = 0;
    history.replaceState({ view: "home", depth: 0 }, "");
    showView(name);
    renderForView(name);
    return;
  }
  const shouldPush = name === "session" || navDepth < 1;
  if (shouldPush) {
    navDepth++;
    history.pushState({ view: name, depth: navDepth }, "");
  } else {
    history.replaceState({ view: name, depth: navDepth }, "");
  }
  showView(name);
  renderForView(name);
}

// View wechseln OHNE neuen History-Eintrag
function setViewDirect(name) {
  history.replaceState({ view: name, depth: navDepth }, "");
  showView(name);
  renderForView(name);
}

function goBack() {
  const s = state.session;
  if (s) {
    if (s.index >= s.items.length) {
      // Lektion fertig (Result-Screen): einfach zurück
      state.session = null;
      renderAll();
      goBack();
      return;
    }
    // In einer laufenden Session: erst Lektion beenden (mit Bestätigung)
    abortSession();
    return;
  }
  if (navDepth > 0) {
    navDepth--;
    history.back();
  }
}

function updateBackBtn() {
  const btn = $("btn-back");
  const visible = !$("app").classList.contains("hidden") && (navDepth > 0 || !!state.session);
  btn.classList.toggle("hidden", !visible);
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
  $("login-title").textContent = t("login.title");
  $("signup-title").textContent = t("login.signup.title");
  $("btn-login").textContent = t("login.submit");
  $("btn-forgot").textContent = t("login.forgot");
  $("link-newuser").textContent = t("login.newuser");
  $("link-haveacc").textContent = t("login.haveacc");
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
// Wichtig: KOMPLETT per DOM-Methoden (textContent) gebaut — kein innerHTML,
// damit Titel mit "&" / Sonderzeichen nie kaputt oder leer gerendert werden.
function renderPath() {
  const list = $("lesson-list");
  list.innerHTML = "";
  try {
    DATA.lektionen.forEach((l) => {
      const done = isLessonDone(l.id);
      const unlocked = lessonUnlocked(l.id);
      const seenCount = lessonWords(l.id).filter((w) => state.card.words[w.id]).length;

      const row = document.createElement("div");
      row.className = "lesson-item" + (unlocked ? "" : " locked");

      // Linkes Emoji
      const emoji = document.createElement("div");
      emoji.className = "lesson-emoji";
      emoji.textContent = done ? "✅" : (l.emoji || "📚");

      // Mitte: Titel + "Lektion N"-Badge + Statuszeile
      const main = document.createElement("div");
      main.className = "lesson-main";

      const toprow = document.createElement("div");
      toprow.className = "lesson-toprow";

      const titel = document.createElement("div");
      titel.className = "lesson-titel";
      titel.textContent = l.titel;

      const num = document.createElement("span");
      num.className = "lesson-num";
      num.textContent = t("path.lesson") + " " + l.id;

      toprow.appendChild(titel);
      toprow.appendChild(num);

      const sub = document.createElement("div");
      sub.className = "lesson-sub";
      if (done) {
        sub.textContent = "✔ " + t("path.done");
      } else if (unlocked) {
        sub.textContent = seenCount + "/" + WORDS_PER_LESSON + " · " + t("path.start");
      } else {
        sub.textContent = "🔒 " + t("path.locked");
      }

      main.appendChild(toprow);
      main.appendChild(sub);
      row.appendChild(emoji);
      row.appendChild(main);

      if (unlocked) {
        row.onclick = () => startSession(l.id);
      }
      list.appendChild(row);
    });
  } catch (err) {
    // Sichtbarer Fehler statt still leere Liste
    const fehler = document.createElement("div");
    fehler.className = "error";
    fehler.textContent = "❌ " + (err && err.message ? err.message : "Fehler beim Laden der Lektionen");
    list.appendChild(fehler);
    if (typeof console !== "undefined") console.error("renderPath:", err);
  }
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
  $("btn-abort").textContent = t("session.abort");
  renderSessionItem();
}

// ---------- SESSION ABBRECHEN ----------
function abortSession() {
  backForwardGuard = false;
  const s = state.session;
  if (!s) return;
  const ok = window.confirm(t("session.abort.confirm"));
  if (!ok) return;
  const answered = s.results.length;
  state.session = null;
  setViewDirect("path");
  toast(t("session.abort.done", { n: answered }), "ok");
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
  const mode = it.fresh ? "learn" : (it.quizMode ? (Math.random() < 0.5 ? "de2tr" : "tr2de") : pickMode(v));
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

    // 3 Stufen für NEUE Wörter:
    //  - "Klar, kann ich!"  -> Box 1 (wird normal oft wiederholt)
    //  - "Gehört, aber noch Probleme" -> Box 1 (gleicher Verlauf)
    //  - "Neu für mich"     -> Box 0 + Wort kommt NOCHMAL in dieser Lektion dran (Multiple-Choice)
    const row = document.createElement("div");
    row.className = "answer-row col";
    const knowBtn = document.createElement("button");
    knowBtn.className = "btn btn-right";
    knowBtn.textContent = t("session.know");
    knowBtn.onclick = () => answerFresh(it, 1, false);
    const maybeBtn = document.createElement("button");
    maybeBtn.className = "btn btn-mid";
    maybeBtn.textContent = t("session.maybe");
    maybeBtn.onclick = () => answerFresh(it, 1, false);
    const neuBtn = document.createElement("button");
    neuBtn.className = "btn btn-wrong";
    neuBtn.textContent = t("session.neu");
    neuBtn.onclick = () => answerFresh(it, 0, true);
    row.appendChild(knowBtn);
    row.appendChild(maybeBtn);
    row.appendChild(neuBtn);
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

// Antwort auf ein NEUES Wort (3 Stufen) — eigenes Funktion, damit die Box
// logik gezielt ist: neue Wörter springen nie Boxen, "neu" wird sofort wiederholt
function answerFresh(it, box, requeue) {
  const s = state.session;
  const v = it.w;
  markActive();
  state.card.words[v.id] = { box: box, last: todayStr(), lapses: requeue ? 1 : 0 };
  if (requeue) {
    // Wort kommt am Ende dieser Lektion als Multiple-Choice nochmal dran
    s.items.push({ w: v, fresh: false, quizMode: true });
  }
  if (!requeue) {
    const xpGewinn = 5;
    state.card.xp = (state.card.xp || 0) + xpGewinn;
    s.correct++;
    toast(t("misc.xpt", { n: xpGewinn }), "ok");
  }
  s.results.push({ w: v, fresh: true, correct: !requeue, wrongPick: null, neu: requeue });
  saveCard();
  s.index++;
  renderSessionItem();
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
  $("btn-forgot").onclick = doForgot;
  $("link-newuser").onclick = () => setAuthMode("signup");
  $("link-haveacc").onclick = () => setAuthMode("login");
  $("btn-logout").onclick = () => setView("profile");
  $("p-logout").onclick = doLogout;
  $("btn-path").onclick = (ev) => {
    const onHome = !$("view-home").classList.contains("hidden");
    if (onHome) {
      startSession(nextLesson() && nextLesson().id);
    } else {
      setView("path");
    }
  };
  $("btn-back").onclick = goBack;
  $("btn-abort").onclick = abortSession;
  // Browser-/Handy-Back-Button = unsere App-Navigation
  window.addEventListener("popstate", (e) => {
    if ($("app").classList.contains("hidden")) return;
    if (state.session) {
      const st0 = e.state || {};
      if (state.session.index >= state.session.items.length) {
        // Lektion ist FERTIG (Result-Screen): Back = einfach zurück, kein Dialog
        const ziel = (st0.view && st0.view !== "session") ? st0.view : "home";
        navDepth = (ziel === "home") ? 0 : (typeof st0.depth === "number" ? st0.depth : 1);
        state.session = null;
        showView(ziel);
        renderForView(ziel);
        return;
      }
      // Session läuft noch: Back-Button wurde vor dem Session-Eintrag gedrückt —
      // per forward wieder auf den Session-Eintrag springen und dort abfragen.
      if (st0.view !== "session") {
        if (backForwardGuard) {
          backForwardGuard = false;
          abortSession(); // zweites Mal: jetzt wirklich fragen (kein Loop)
        } else {
          backForwardGuard = true;
          history.forward();
        }
        return;
      }
      abortSession();
      return;
    }
    const st = (history.state && history.state.view) ? history.state : (e.state || {});
    navDepth = typeof st.depth === "number" ? st.depth : 0;
    let name = st.view || "home";
    if (name === "session") name = "home"; // Session gibt es nicht mehr
    showView(name);
    renderForView(name);
  });
  $("dir-de").onclick = () => { lerntDe = true; applyUiLang(); markDirButtons(); };
  $("dir-tr").onclick = () => { lerntDe = false; applyUiLang(); markDirButtons(); };
  $("p-dir-de").onclick = () => setRichtung(true);
  $("p-dir-tr").onclick = () => setRichtung(false);
  // Sessionsänderungen mitverfolgen (Reset-Link, Logout in anderem Tab, Session abgelaufen)
  sb.auth.onAuthStateChange((_event, session) => {
    if (session) {
      state.user = session.user;
      showApp();
    } else {
      state.user = null;
      $("login-screen").classList.remove("hidden");
      $("app").classList.add("hidden");
      setAuthMode("login");
    }
  });
  initAuth();
});