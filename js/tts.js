// ============================================================
// SPRICHMIT V2.0 — TEXT-TO-SPEECH (Web Speech API)
// ============================================================

const TTS = {
  voice: null,
  lang: "tr-TR",          // wird bei init gesetzt
  rate: 0.85,

  init(lang) {
    this.lang = lang || this.lang;
    const pick = () => {
      const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      const want = this.lang.split("-")[0];
      this.voice =
        voices.find(v => v.lang === this.lang) ||
        voices.find(v => v.lang.startsWith(want)) ||
        null;
    };
    pick();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pick;
    }
  },

  speak(text, opts) {
    if (!text || !window.speechSynthesis) return;
    opts = opts || {};
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.voice) u.voice = this.voice;
    u.lang = this.lang;
    u.rate = opts.rate || this.rate;
    window.speechSynthesis.speak(u);
  },

  slow(text) { this.speak(text, { rate: 0.55 }); }
};