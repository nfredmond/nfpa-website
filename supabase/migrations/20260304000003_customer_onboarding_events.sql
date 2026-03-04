create extension if not exists pgcrypto;

create table if not exists public.customer_onboarding_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text,
  customer_email text not null,
  product_id text not null,
  tier_id text not null,
  event_type text not null,
  delivery_channel text not null default 'email',
  status text not null default 'queued',
  provider_message_id text,
  provider_error text,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (stripe_event_id)
);

create index if not exists idx_customer_onboarding_events_customer
  on public.customer_onboarding_events (customer_email);

create index if not exists idx_customer_onboarding_events_status
  on public.customer_onboarding_events (status);

create or replace function public.set_customer_onboarding_events_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_customer_onboarding_events_updated_at on public.customer_onboarding_events;
create trigger trg_customer_onboarding_events_updated_at
before update on public.customer_onboarding_events
for each row execute function public.set_customer_onboarding_events_updated_at();

alter table public.customer_onboarding_events enable row level security;

create policy "allowlist_self_read_onboarding_events"
on public.customer_onboarding_events
for select
using (lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Service-role writes onboarding event state from webhook automation.
