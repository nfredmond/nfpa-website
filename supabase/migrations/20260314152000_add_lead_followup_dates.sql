-- Add follow-up date fields for protected lead inbox operations
-- Created: 2026-03-14

alter table public.leads
  add column if not exists last_contact_on date,
  add column if not exists next_step_on date;

create index if not exists idx_leads_last_contact_on
  on public.leads (last_contact_on);

create index if not exists idx_leads_next_step_on
  on public.leads (next_step_on);
