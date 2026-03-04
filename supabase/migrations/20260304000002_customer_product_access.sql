create extension if not exists pgcrypto;

create table if not exists public.customer_product_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_id text not null,
  tier_id text not null,
  status text not null default 'active',
  source text not null default 'stripe_webhook',
  stripe_event_id text,
  checkout_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_customer_product_access_email_product
  on public.customer_product_access (email, product_id);

create index if not exists idx_customer_product_access_email
  on public.customer_product_access (email);

create index if not exists idx_customer_product_access_status
  on public.customer_product_access (status);

create or replace function public.set_customer_product_access_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_customer_product_access_updated_at on public.customer_product_access;
create trigger trg_customer_product_access_updated_at
before update on public.customer_product_access
for each row execute function public.set_customer_product_access_updated_at();

alter table public.customer_product_access enable row level security;

create policy "authenticated_read_own_product_access"
on public.customer_product_access
for select
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- Service role writes/updates access records through backend webhook routes.
