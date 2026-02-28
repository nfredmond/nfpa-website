create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null,
  route text not null,
  requester_kind text not null check (requester_kind in ('guest','member')),
  user_id uuid null,
  visitor_id text null,
  ip text null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  status text not null default 'completed',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_usage_events_scope_route_created_idx
  on public.ai_usage_events (scope_key, route, created_at desc);

create index if not exists ai_usage_events_created_idx
  on public.ai_usage_events (created_at desc);

create index if not exists ai_usage_events_user_created_idx
  on public.ai_usage_events (user_id, created_at desc)
  where user_id is not null;

create or replace function public.set_ai_usage_events_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ai_usage_events_updated_at on public.ai_usage_events;
create trigger trg_ai_usage_events_updated_at
before update on public.ai_usage_events
for each row
execute function public.set_ai_usage_events_updated_at();

alter table public.ai_usage_events enable row level security;

-- Service-role only table (used by server routes). Deny anon/authenticated by default.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_usage_events'
      and policyname = 'deny_all_anon'
  ) then
    create policy deny_all_anon
      on public.ai_usage_events
      for all
      to anon
      using (false)
      with check (false);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_usage_events'
      and policyname = 'deny_all_authenticated'
  ) then
    create policy deny_all_authenticated
      on public.ai_usage_events
      for all
      to authenticated
      using (false)
      with check (false);
  end if;
end $$;
