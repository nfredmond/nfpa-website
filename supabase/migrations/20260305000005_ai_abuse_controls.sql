create table if not exists public.ai_abuse_controls (
  id uuid primary key default gen_random_uuid(),
  route text null check (route in ('planner-chat', 'grant-lab')),
  user_id uuid null,
  visitor_id text null,
  ip text null,
  reason text null,
  active boolean not null default true,
  created_by_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_abuse_controls_scope_present check (user_id is not null or visitor_id is not null or ip is not null)
);

create index if not exists ai_abuse_controls_active_route_created_idx
  on public.ai_abuse_controls (active, route, created_at desc);

create index if not exists ai_abuse_controls_user_active_route_idx
  on public.ai_abuse_controls (user_id, active, route)
  where user_id is not null;

create index if not exists ai_abuse_controls_visitor_active_route_idx
  on public.ai_abuse_controls (visitor_id, active, route)
  where visitor_id is not null;

create index if not exists ai_abuse_controls_ip_active_route_idx
  on public.ai_abuse_controls (ip, active, route)
  where ip is not null;

create or replace function public.set_ai_abuse_controls_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ai_abuse_controls_updated_at on public.ai_abuse_controls;
create trigger trg_ai_abuse_controls_updated_at
before update on public.ai_abuse_controls
for each row
execute function public.set_ai_abuse_controls_updated_at();

alter table public.ai_abuse_controls enable row level security;

-- Service-role only table (used by protected server routes). Deny anon/authenticated.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_abuse_controls'
      and policyname = 'deny_all_anon'
  ) then
    create policy deny_all_anon
      on public.ai_abuse_controls
      for all
      to anon
      using (false)
      with check (false);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_abuse_controls'
      and policyname = 'deny_all_authenticated'
  ) then
    create policy deny_all_authenticated
      on public.ai_abuse_controls
      for all
      to authenticated
      using (false)
      with check (false);
  end if;
end $$;
