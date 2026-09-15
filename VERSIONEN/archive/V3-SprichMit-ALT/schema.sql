-- ============================================================
-- SUPABASE SCHEMA — einmalig im SQL-Editor ausführen
-- ============================================================

create table if not exists public.learner_cards (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null default '',
  card       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_cards enable row level security;

-- 1) Jeder hat vollen Zugriff auf SEINEN Fortschritt
create policy "own card full access"
  on public.learner_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2) Angemeldete Nutzer dürfen ALLE Karten LESEN (für das Dashboard)
--    Achtung: das gilt für JEDE angemeldete Person in diesem Projekt.
--    Für euch (nur 2 Konten) ist das in Ordnung.
create policy "authenticated can read all cards"
  on public.learner_cards for select
  using (auth.role() = 'authenticated');