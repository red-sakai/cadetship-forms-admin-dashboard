-- ============================================
-- Emailed applicants list
-- (replaces the old email_checkpoint table)
--
-- How to use:
--   1. Open your Supabase project -> SQL Editor
--   2. Paste this entire file and press Run
--   3. Refresh the dashboard
--
-- Safe to run more than once (idempotent).
-- ============================================

-- Remove the old single-checkpoint table (policies go with it)
drop table if exists public.email_checkpoint cascade;

create table if not exists public.emailed_applicants (
  email text primary key,
  marked_at timestamptz not null default now()
);

alter table public.emailed_applicants enable row level security;

-- The dashboard signs in with the anon (publishable) key,
-- so anon needs full access to this marker list.

drop policy if exists "Allow anonymous select on emailed_applicants"
  on public.emailed_applicants;
create policy "Allow anonymous select on emailed_applicants"
  on public.emailed_applicants for select
  to anon
  using (true);

drop policy if exists "Allow anonymous insert on emailed_applicants"
  on public.emailed_applicants;
create policy "Allow anonymous insert on emailed_applicants"
  on public.emailed_applicants for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous update on emailed_applicants"
  on public.emailed_applicants;
create policy "Allow anonymous update on emailed_applicants"
  on public.emailed_applicants for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow anonymous delete on emailed_applicants"
  on public.emailed_applicants;
create policy "Allow anonymous delete on emailed_applicants"
  on public.emailed_applicants for delete
  to anon
  using (true);
