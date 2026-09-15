// ============================================================
// KONFIGURATION — hier einmal anpassen
// ============================================================

// Supabase Projekt "Deutsch lerne"
const SUPABASE_URL = "https://werfoequoinjpqygbgpu.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_SB0I898cAoGKLxWLqheGHw_O3tIHrT6";

// E-Mail-Adressen, die das Dashboard sehen dürfen (Jonas).
const DASHBOARD_EMAILS = ["jonastenbergen@gmail.com"];

// Lern-Einstellungen
const NEW_PER_DAY = 5;      // max. neue Wörter pro Tag
const DUE_SESSION_MAX = 20; // max. Wiederholungen pro Sitzung
const BOX_INTERVALS = [0, 1, 2, 4, 7, 14]; // Leitner-Boxen in Tagen
const WRITING_PER_WEEK = 5; // Schreib-Aufgaben auf Papier pro Woche
const PHONE_PER_DAY = 5;    // Wörter für die Telefon-Übung
