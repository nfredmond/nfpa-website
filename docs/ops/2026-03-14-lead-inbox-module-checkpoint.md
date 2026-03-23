# Lead Inbox / Lightweight CRM Module Checkpoint

_Date: 2026-03-14_
_Project: `nat-ford-website`_
_Status: **Stable checkpoint — safe to switch modules**

## Executive Read

The protected `/lead-inbox` module has crossed the line from "basic admin page" into a usable lightweight CRM surface for OpenPlan intake.

It is **not complete**, but it is now:
- operationally useful,
- structurally coherent,
- backed by production data fields,
- and safe to pause without losing the thread.

Recommendation: **allow module switching now**, but do it with an explicit return queue rather than open-ended future polish.

## What Is Done

### Intake routing + segmentation
- Dedicated OpenPlan contact routes:
  - `/contact/openplan-updates`
  - `/contact/openplan-fit`
- Enriched lead metadata for routing:
  - `topic`
  - `intent`
  - `product`
  - `tier`
  - `routing_hint`
- Lead inbox lane filtering for:
  - `openplan-pilot-updates`
  - `openplan-fit-conversation`
  - `openplan-general`

### Lead inbox operator features
- Status filters and lane chips
- Per-lane summary strip
- Saved views for high-value queues
- Saved-view match counts
- Fast `First contact sent` action
- Owner quick-assign buttons
- CRM notes editing
- `last_contact_on` date field
- `next_step_on` date field
- Filter-aware CSV export
- Follow-up radar:
  - overdue
  - due today
  - next 7 days
  - no next step
- Per-card visual urgency treatment for next-step status

### Data / schema support
- CRM/spam fields already in place
- Follow-up date migration added and applied:
  - `20260314152000_add_lead_followup_dates.sql`

## Why This Is a Good Stopping Point

This module now has the minimum viable characteristics of a reliable operational system:
1. **capture** — leads enter with meaningful routing context,
2. **triage** — operators can slice queues quickly,
3. **assign** — ownership can be set fast,
4. **advance** — first-contact and status movement are easy,
5. **track** — dated next steps are now visible,
6. **review** — exports and summary surfaces exist.

That means we are no longer dependent on finishing every polish item before moving elsewhere.

## What Is NOT Done Yet

These are worthwhile follow-on items, but none are blockers for module switching.

### Priority A — best next return items
1. **Lead activity timeline**
   - append notable events (status changes, owner changes, first contact, notes saves)
   - gives auditability and better handoff context
2. **Overdue queue quick view**
   - one-click saved view for overdue / due today
   - fastest way to operationalize the new radar
3. **Owner-filter / owner dashboard view**
   - "show only Nathaniel / Bartholomew / Elena"
   - useful once assignment starts being used regularly

### Priority B — strong polish items
4. Inline next-step presets (tomorrow / +3 days / next week)
5. Better success-state UX after saves
6. Bulk actions for simple queue cleanup
7. Stronger contact templates / mailto presets by lane

### Priority C — true expansion items
8. Proposal scope triage integration
9. Client/project conversion flow from lead to active engagement
10. Timeline notes / attachments / document linking

## Return Trigger

Return to this module when **any one** of the following becomes true:

1. Nathaniel says the inbox is being used actively and needs the next layer.
2. Leads begin accumulating with unclear follow-up ownership or history.
3. A second module depends on stronger intake-to-proposal handoff.
4. There are at least **3 repeated moments** of "I wish the inbox did X" in real usage.

## Recommended Return Order

When we come back, do the next pass in this order:

1. **Lead activity timeline**
2. **Overdue / due-today saved views**
3. **Owner filter / owner summary**
4. **Proposal handoff integration**

## Rule For Avoiding Narrow Vision

Do **not** keep polishing this module just because improvements are easy to imagine.

Only continue iterating here when at least one of these is true:
- it unlocks another module,
- it removes real operating friction,
- it reduces risk of dropped leads,
- or Nathaniel explicitly wants deeper CRM behavior.

Otherwise, switch to the next module.

## Recommended Next Module Candidates

Given current state, the best next module candidates are:
1. **Proposal Scope Triage Tool**
2. **OpenPlan Pilot Onboarding module**
3. **Lead activity timeline** (if staying adjacent)
4. **Client portal task/status module**

## Current Recommendation

**Yes — safe to switch modules now.**

This module is in a strong enough state that future work here should be deliberate, not reflexive.
