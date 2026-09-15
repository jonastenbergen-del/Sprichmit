// ============================================================
// TTS — deutsche Wörter/Sätze vorlesen (Web Speech API)
// ============================================================
let deVoice = null;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  deVoice =
    voices.find((v) => v.lang === "de-DE" && /female|feminine|Petra|Anna/i.test(v.name)) ||
    voices.find((v) => v.lang === "de-DE") ||
    voices.find((v) => v.lang && v.lang.startsWith("de")) ||
    null;
}

if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Spricht deutschen Text vor.
 * @param {string} text
 * @param {number} [rate]  Sprechtempo, 1 = normal, 0.6 = langsam
 */
function speak(text, rate = 1) {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis wird nicht unterstützt");
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = rate;
  u.pitch = 1;
  if (deVoice) u.voice = deVoice;
  speechSynthesis.speak(u);
}

function speakSlow(text) {
  speak(text, 0.55);
}
