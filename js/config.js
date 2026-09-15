// ============================================================
// SPRICHMIT V2.0 — KONFIGURATION
// ============================================================

// Supabase Projekt
const SUPABASE_URL = "https://werfoequoinjpqygbgpu.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_SB0I898cAoGKLxWLqheGHw_O3tIHrT6";

// E-Mail-Adressen, die das Dashboard sehen dürfen
const DASHBOARD_EMAILS = ["jonastenbergen@gmail.com"];

// Leitner-Boxen (Tage bis zur nächsten Wiederholung)
const BOX_INTERVALS = [0, 1, 2, 4, 7, 14];

// Lektionen
const WORDS_PER_LESSON = 50;   // Wörter pro Lektion (Top-1000)
const NEW_IN_SESSION = 5;      // neue Wörter pro Lektions-Runde
const REVIEW_IN_SESSION = 5;   // Wiederholungen pro Lektions-Runde