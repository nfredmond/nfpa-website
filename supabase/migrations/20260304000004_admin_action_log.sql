create extension if not exists pgcrypto;

create table if not exists public.admin_action_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_email text not null,
  action text not null,
  target text,
  status text not null check (status in ('success', 'error', 'denied', 'started')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_admin_action_log_created_at
  on public.admin_action_log (created_at desc);

create index if not exists idx_admin_action_log_actor_email
  on public.admin_action_log (actor_email);

alter table public.admin_action_log enable row level security;

create policy "admin_action_log_self_read"
on public.admin_action_log
for select
using (lower(actor_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Service-role writes admin audit records from protected API routes.
