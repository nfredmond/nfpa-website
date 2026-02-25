-- Add CRM + spam control columns for website leads
-- Created: 2026-02-24

alter table public.leads
  add column if not exists owner_name text,
  add column if not exists notes text,
  add column if not exists ip_address text;

create index if not exists idx_leads_ip_address_created_at
  on public.leads (ip_address, created_at desc);

create index if not exists idx_leads_inquiry_type
  on public.leads (inquiry_type);

create index if not exists idx_leads_owner_name
  on public.leads (owner_name);
