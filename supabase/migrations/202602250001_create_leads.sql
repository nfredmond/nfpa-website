-- Nat Ford website lead capture table
-- Created: 2026-02-24

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  organization text not null,
  inquiry_type text not null,
  timeline text not null,
  description text not null,
  source_path text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'qualified', 'closed')),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_email on public.leads (email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Lock down defaults first
revoke all on public.leads from anon, authenticated;

-- Website form insert policy
drop policy if exists "allow_public_insert_leads" on public.leads;
create policy "allow_public_insert_leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Explicitly deny reads for public roles
drop policy if exists "deny_public_select_leads" on public.leads;
create policy "deny_public_select_leads"
  on public.leads
  for select
  to anon, authenticated
  using (false);

grant insert on public.leads to anon, authenticated;
