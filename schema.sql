-- ============================================================
-- SPRICHMIT V2.0 — SUPABASE-SCHEMA
-- IM SUPABASE-EDITOR AUSFÜHREN (einfach alles markieren + Run)
-- ============================================================

-- 1) PROFILES: Name, Muttersprache, UI-Farbe
create table if not exists public.profiles (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  name           text not null default '',
  mother_tongue  text not null default 'tr',   -- 'tr' oder 'de'
  ui_color       text not null default 'blau', -- blau | lila | orange | gruen
  created_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- jeder liest/schreibt NUR sein eigenes Profil
create policy "own profile full access"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- alle angemeldeten dürfen ALLE Profile lesen (Dashboard)
create policy "authenticated can read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- 2) LERN-FORTSCHRITT: die TABELLE existiert bereits (learner_cards)
--    card (jsonb) enthält: xp, streak, lessons, words, grammar, re, reSchwach
--    Die RLS-Policies gibt es bereits — nichts zu tun.

-- 3) FERTIG. Danach neu auf Netlify deployen.