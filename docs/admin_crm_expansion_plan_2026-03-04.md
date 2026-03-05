# Admin CRM + Project Status Expansion Plan (2026-03-04)

## Goal
Expand `/admin` from operational controls into a lightweight internal CRM surface, starting with project-status visibility and evolving toward lead/client/deal lifecycle management.

## Design Principles
1. **Safe increments**: ship value without breaking auth or requiring immediate DB migrations.
2. **Server-side authority**: admin-only data should be resolved in server components/routes.
3. **Composable domains**: Projects, Leads, Accounts, Deals, Tasks should evolve independently but link via IDs.
4. **Auditability**: preserve admin action logging and traceability as CRM actions are added.

---

## Phased Roadmap

### Phase 0 (Now) — Project Status MVP
- Add `Projects` tab in `/admin`.
- Read status feed from local server-side JSON (`src/data/admin-project-status.json`).
- Render status cards with:
  - project
  - status
  - last update
  - owner
  - repo path/link
  - next milestone
- Keep existing auth + allowlist + MFA gate unchanged.

### Phase 1 — Managed Project Updates
- Move project feed from static JSON to secure admin API endpoint.
- Add edit/update form in admin (guarded + audited).
- Add status history timeline (who changed what, when).
- Optional Slack digest push for daily project pulse.

### Phase 2 — Core CRM Foundations
- Introduce initial tables (Supabase):
  - `crm_accounts`
  - `crm_contacts`
  - `crm_opportunities`
  - `crm_activities`
  - `crm_tasks`
- Link opportunities/tasks to projects where relevant.
- Add pipeline and owner views in admin tabs.

### Phase 3 — Workflow + Forecasting
- Automations: follow-up reminders, stale-opportunity nudges, next-action queues.
- Forecast cards (weighted pipeline, close-date windows).
- Activity rollups by account/project for executive overview.

---

## Data Model: MVP and Target

## MVP Feed (No migration)
```json
{
  "generatedAt": "ISO timestamp",
  "projects": [
    {
      "project": "OpenPlan",
      "status": "In Progress",
      "lastUpdate": "ISO timestamp",
      "owner": "Name",
      "repoPath": "/local/or/monorepo/path",
      "repoUrl": "https://...",
      "nextMilestone": "Next concrete deliverable"
    }
  ]
}
```

## Target CRM Entities (Phase 2+)
- **Account**: organization/client profile.
- **Contact**: person tied to account.
- **Opportunity**: deal/engagement with stage, value, probability.
- **Project**: delivery workstream tied to account/opportunity.
- **Activity**: notes/calls/emails/meetings.
- **Task**: dated owner action item.

Key relationships:
- Account 1→N Contacts
- Account 1→N Opportunities
- Opportunity 1→N Projects (or 1→1 for simple engagements)
- Project 1→N Activities/Tasks

---

## Immediate MVP Scope (Implemented)
- Added `Projects` tab to admin navigation.
- Added server-side JSON feed for core initiatives:
  - OpenPlan
  - DroneOps
  - SRF Diary
  - Website
- Added project cards with status treatment and milestone focus.

## Out of Scope (for this increment)
- Write/edit workflows in admin.
- Database schema changes.
- Multi-user ownership rules.
- CRM reporting widgets beyond project status cards.

---

## Recommended Next Steps
1. Add `/api/admin/projects` read endpoint (still JSON-backed) for interface stability.
2. Add guarded update endpoint + form; write changes to JSON in controlled environment or to a lightweight table.
3. Introduce `crm_accounts` + `crm_opportunities` schema and connect to project records.
4. Extend admin tabs: `Leads`, `Accounts`, `Pipeline`, `Tasks`.
5. Expand audit log types to include CRM CRUD actions.
