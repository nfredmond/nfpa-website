# Nat Ford Website Open-Source Overhaul PRD

Date: 2026-04-24
Owner: Bartholomew Hale
Source directive: Nathaniel wants Nat Ford to move from closed-SaaS-first positioning to free/open-source software plus paid implementation, administration, customization, hosting, onboarding, and support.

## Executive decision

Nat Ford should publicly position itself as an **open-source planning and software implementation company**:

- Reusable software, public-interest tools, and documented primitives are free and open by default.
- Revenue comes from serious stewardship: custom forks, deployments, integrations, training, hosting/admin, enterprise identity/onboarding, data pipelines, security/QA, 24-hour response support, and planning consulting.
- Planning services and software development are equally first-class. Nat Ford can build and administer custom software for planning agencies and for companies in other sectors when the workflow is real and valuable.

## Why this is credible now

- AI agents make modular, documented components dramatically more useful than closed, monolithic apps.
- Open-source code lowers adoption friction and lets agencies, companies, developers, and agents inspect, fork, adapt, and improve the work.
- Public agencies already have policy precedent for reusable/open source code because it can reduce duplicative spending and increase transparency.
- The commercial moat shifts from license control to taste, domain expertise, operations, support, integrations, security discipline, and ability to ship custom versions quickly.

## Website goals

1. Replace subscription-first product language with open-source-first positioning.
2. Add a strong public manifesto: open software, open methods, reusable building blocks, forkability, and agent-friendly documentation.
3. Make project/repo links visible and useful.
4. Explain the paid offer without apology: setup, custom forks, hosting, onboarding, identity/access, support, data, and client-specific implementation.
5. Preserve planning credibility: RTPs, ATPs, VMT, grants, GIS, aerial, and local assistance remain real services.
6. Expand software credibility beyond planning: custom internal tools, workflow automation, dashboards, AI systems, GIS/data platforms, and operations software for any company.

## Research-backed messages

- GitHub Open Source Guide: open source allows anyone to use, study, modify, and distribute; it supports adoption, collaboration, remixing, transparency, and user control.
- Digital.gov / OMB Federal Source Code Policy: reusable and open source custom code can reduce duplicative acquisitions, save public money, and increase quality/transparency.
- Theo/t3-inspired working thesis: the next adoption wave favors high-quality primitives, modular systems, agent-friendly installation, forkability, and malleability over one polished but rigid app.

## Guardrails

Open-source by default does **not** mean publishing:

- client confidential data;
- credentials, tokens, secrets, or private infrastructure details;
- privileged internal operations;
- unreleased client deliverables without permission;
- security-sensitive deployment details that create unnecessary exposure.

Publish reusable code, schemas, templates, methods, docs, demo data, and public-interest tools. Protect people’s actual stuff.

## Recommended information architecture

- `/` — New open-source-first home page.
- `/open-source` — Manifesto and working model.
- `/products` — Reframed as open-source project catalog + implementation/support offers.
- `/openplan` — Reframed from prelaunch SaaS to open-source planning OS with paid managed deployments/custom forks.
- `/services` — Planning + software implementation services.
- `/projects` — Case work and public project history.
- `/contact` — Intake for planning, software build, OpenPlan deployment, and support.

## First implementation slice

- Add `src/data/open-source-projects.ts`.
- Add `/open-source` manifesto page.
- Update header/footer navigation.
- Rewrite home page hero and top product/service sections.
- Reframe `/products` away from Stripe/pricing-first toward free/open-source project catalog and implementation offers.
- Replace public subscription language on OpenPlan/grant-lab where obvious.

## Acceptance criteria

- Site clearly states Nat Ford builds free/open-source software and charges for implementation/support.
- Public repo links are visible for core projects.
- No homepage/product hero copy leads with SaaS subscriptions or closed product pricing.
- Planning services remain visible and credible.
- Software development for non-planning companies is explicitly offered.
- Lint and build pass.
- Production URL is smoke-tested after push.
