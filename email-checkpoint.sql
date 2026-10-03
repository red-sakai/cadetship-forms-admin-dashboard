-- ============================================
-- Email checkpoint ("emails sent up to here")
--
-- How to use:
--   1. Open your Supabase project -> SQL Editor
--   2. Paste this entire file and press Run
--   3. Restart/refresh the dashboard
--
-- Safe to run more than once (idempotent).
-- ============================================

create table if not exists public.email_checkpoint (
  id integer primary key default 1,
  email text not null,
  first_name text,
  last_name text,
  -- registration created_at of the marked person; acts as the cutoff
  created_at timestamptz not null,
  marked_at timestamptz not null default now(),
  constraint email_checkpoint_single_row check (id = 1)
);

alter table public.email_checkpoint enable row level security;

-- The dashboard signs in with the anon (publishable) key,
-- so anon needs full access to this single marker row.

drop policy if exists "Allow anonymous select on email_checkpoint"
  on public.email_checkpoint;
create policy "Allow anonymous select on email_checkpoint"
  on public.email_checkpoint for select
  to anon
  using (true);

drop policy if exists "Allow anonymous insert on email_checkpoint"
  on public.email_checkpoint;
create policy "Allow anonymous insert on email_checkpoint"
  on public.email_checkpoint for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous update on email_checkpoint"
  on public.email_checkpoint;
create policy "Allow anonymous update on email_checkpoint"
  on public.email_checkpoint for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow anonymous delete on email_checkpoint"
  on public.email_checkpoint;
create policy "Allow anonymous delete on email_checkpoint"
  on public.email_checkpoint for delete
  to anon
  using (true);
