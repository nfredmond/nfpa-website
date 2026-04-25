export type OpenSourceProject = {
  name: string
  slug: string
  status: 'Active build' | 'Public alpha' | 'Release track' | 'Commercial guide'
  category: 'Planning OS' | 'Geospatial' | 'Aerial intelligence' | 'Modeling' | 'Operations' | 'Training product'
  summary: string
  repoUrl?: string
  demoUrl?: string
  docsUrl?: string
  licenseSpdx: string
  licenseNote: string
  contributionPath?: string
  paidSupport: string
  primitives: string[]
}

export function readinessLabel(status: OpenSourceProject['status']) {
  switch (status) {
    case 'Public alpha':
      return 'Usable alpha'
    case 'Active build':
      return 'Active buildout'
    case 'Release track':
      return 'Release track'
    case 'Commercial guide':
      return 'Commercial guide'
  }
}

export function readinessNote(status: OpenSourceProject['status']) {
  switch (status) {
    case 'Public alpha':
      return 'Installable or inspectable now, with scope and hardening still evolving.'
    case 'Active build':
      return 'Moving quickly; best for pilots, custom forks, and teams comfortable shaping the tool.'
    case 'Release track':
      return 'Useful product lane with source/package release details handled deliberately rather than dumped onto the web before it is ready.'
    case 'Commercial guide':
      return 'Paid educational product; built from Nat Ford planning practice rather than a public code repository.'
  }
}

export function licenseLabel(project: OpenSourceProject) {
  return project.licenseSpdx
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: 'OpenPlan',
    slug: 'openplan',
    status: 'Active build',
    category: 'Planning OS',
    summary:
      'Free, open-source AI-powered transportation planning intelligence for agencies, consultants, and public-interest planning teams.',
    repoUrl: 'https://github.com/nfredmond/openplan',
    licenseSpdx: 'Apache-2.0',
    demoUrl: 'https://openplan-natford.vercel.app',
    licenseNote: 'Source code is licensed under Apache-2.0 unless the repository marks a specific file or asset otherwise; see LICENSE-NOTICE for exclusions.',
    paidSupport:
      'Managed deployment, custom forks, enterprise SSO, role design, and staff onboarding, GIS/data setup, agency-specific templates, and priority support.',
    primitives: ['Planning workspace', 'project and program records', 'GIS/data context', 'grant/report workflows', 'AI-assisted drafting with review gates'],
  },
  {
    name: 'OpenGeo',
    slug: 'opengeo',
    status: 'Public alpha',
    category: 'Geospatial',
    summary:
      'AI-native drone-to-insight geospatial platform built with Next.js, Supabase, PostGIS, MapLibre, and AI SDK patterns.',
    repoUrl: 'https://github.com/nfredmond/OpenGeo',
    licenseSpdx: 'AGPL-3.0-only',
    licenseNote: 'Source code is licensed under AGPL-3.0-only unless the repository marks a specific file or asset otherwise.',
    paidSupport:
      'Custom geospatial deployments, PostGIS setup, map workflows, hosted administration, data migration, and internal tool integration.',
    primitives: ['Map workspace', 'PostGIS-backed data model', 'AI-assisted geospatial workflow', 'MapLibre interface'],
  },
  {
    name: 'Aerial Intel Platform',
    slug: 'aerial-intel-platform',
    status: 'Active build',
    category: 'Aerial intelligence',
    summary:
      'Open aerial data processing and planning-intelligence platform using an ODM-composed architecture for drone workflows.',
    repoUrl: 'https://github.com/nfredmond/aerial-intel-platform',
    licenseSpdx: 'Apache-2.0',
    licenseNote: 'Source code is licensed under Apache-2.0 unless the repository marks a specific file or asset otherwise; see LICENSE-NOTICE for exclusions.',
    paidSupport:
      'Drone program setup, mission processing workflows, hosted operations, QA packets, map deliverables, and staff onboarding.',
    primitives: ['Mission intake', 'ODM processing hooks', 'dataset extraction', 'QA workflow', 'planning-ready outputs'],
  },
  {
    name: 'ClawModeler',
    slug: 'clawmodeler',
    status: 'Active build',
    category: 'Modeling',
    summary:
      'AI-orchestrated, local-first transportation scenario modeling for small and rural agencies. Python engine plus Tauri desktop UI.',
    repoUrl: 'https://github.com/nfredmond/clawmodeler',
    licenseSpdx: 'Apache-2.0',
    licenseNote: 'Source code is licensed under Apache-2.0 unless the repository marks a specific file or asset otherwise; see LICENSE-NOTICE for exclusions.',
    paidSupport:
      'Model setup, local data preparation, scenario calibration, rural agency training, support, and custom modeling extensions.',
    primitives: ['Scenario modeling engine', 'desktop interface', 'local-first workflows', 'transportation analytics'],
  },
  {
    name: 'Marketing & Planning Analytics Software',
    slug: 'ads-chatbot',
    status: 'Public alpha',
    category: 'Operations',
    summary:
      'Ad and operations automation lineage for Google, Meta, and LinkedIn workflows, adaptable to planning and business reporting.',
    repoUrl: 'https://github.com/nfredmond/ads_chatbot',
    licenseSpdx: 'Apache-2.0',
    demoUrl: 'https://ads-chatbot.vercel.app',
    licenseNote: 'Source code is licensed under Apache-2.0 unless the repository marks a specific file or asset otherwise; see LICENSE-NOTICE for exclusions.',
    paidSupport:
      'Custom analytics dashboards, campaign operations automation, CRM/reporting integrations, and support for non-planning companies.',
    primitives: ['Channel sync patterns', 'reporting automation', 'AI-assisted operations review', 'cross-platform workflow glue'],
  },
  {
    name: 'ClawChat',
    slug: 'clawchat',
    status: 'Release track',
    category: 'Operations',
    summary:
      'Hybrid multi-agent operating system backbone for planning-company operations: control plane, councils, workflow templates, simulation, and MCP/A2A integration patterns.',
    licenseSpdx: 'Source release pending',
    licenseNote: 'ClawChat is currently a release-track Nat Ford system. Public source and redistribution terms will be published only after the release boundary is approved.',
    contributionPath: 'Private release track / contact Nat Ford',
    paidSupport:
      'Multi-agent operations design, workflow automation, internal QA councils, AI governance, and practical agent operating systems for planning teams.',
    primitives: ['Agent control plane', 'bounded expert councils', 'workflow templates', 'simulation lanes', 'MCP/A2A integration'],
  },
  {
    name: 'AI-Assisted Planning Workflows',
    slug: 'planner-ai-workflow-guide-v2',
    status: 'Commercial guide',
    category: 'Training product',
    summary:
      'Premium practical guide and template bundle for planner-led AI workflows across ATP/RTP content, grant criteria, GIS summaries, outreach synthesis, board materials, and QA.',
    licenseSpdx: 'Commercial guide',
    licenseNote: 'Commercial educational product; release package is distributed as a paid PDF/HTML/template bundle, not as a public code repository.',
    contributionPath: 'Buyer feedback / implementation workshops',
    paidSupport:
      'Team workshops, template rollout, AI-use policy setup, QA checklists, pilot workflow selection, and implementation support for planning firms and agencies.',
    primitives: ['PDF guide', 'template bundle', 'pilot examples', 'QA checklists', 'disclosure language'],
  },
]

export const implementationOffers = [
  {
    name: 'Managed open-source deployment',
    summary: 'We install, host, configure, monitor, and administer an open-source tool so your team can use it without becoming the maintainer.',
    examples: ['Vercel/Supabase deployment', 'domain and environment setup', 'backups and monitoring', 'release management'],
  },
  {
    name: 'Custom fork / agency edition',
    summary: 'We fork the base project and adapt the workflows, data model, branding, permissions, and reporting outputs to your actual work.',
    examples: ['custom modules', 'local data schemas', 'agency report templates', 'merge-forward maintenance'],
  },
  {
    name: 'Enterprise onboarding and identity',
    summary: 'We wire up the unglamorous but essential parts: roles, access, SSO-style onboarding, staff training, and governance.',
    examples: ['enterprise SSO and onboarding', 'role design', 'workspace provisioning', 'admin documentation'],
  },
  {
    name: '24-hour response support and operations',
    summary: 'For teams that need confidence, we provide an operator lane for urgent fixes, QA, uptime checks, and release triage.',
    examples: ['24-hour response target for priority issues', 'bug triage', 'security patch support', 'monthly improvement review'],
  },
]

export const implementationPackages = [
  {
    name: 'Open-source fit audit',
    bestFor: 'Teams that want to know whether one of these repos can solve a real workflow before committing to a build.',
    deliverable: 'A short recommendation memo: self-host, supported deployment, custom fork, or no-build/avoid.',
    includes: ['repo/readiness review', 'workflow fit interview', 'risk and data gap list', 'recommended next scope'],
  },
  {
    name: 'Managed deployment sprint',
    bestFor: 'Agencies or companies that want a working hosted tool without becoming DevOps maintainers.',
    deliverable: 'Configured deployment, environment setup, admin notes, smoke test, and handoff checklist.',
    includes: ['Vercel/Supabase or equivalent setup', 'domain/env configuration', 'basic monitoring', 'staff handoff'],
  },
  {
    name: 'Custom fork / internal edition',
    bestFor: 'Teams whose workflow is too specific for generic software but too important for spreadsheets.',
    deliverable: 'A supported fork with local data model, permissions, branding, workflows, and reporting outputs.',
    includes: ['fork strategy', 'custom modules', 'data migration', 'merge-forward maintenance plan'],
  },
  {
    name: 'Operator support lane',
    bestFor: 'Teams running open-source tools in public, production, or deadline-sensitive environments.',
    deliverable: 'Ongoing support lane for triage, upgrades, release notes, QA checks, and monthly improvement review.',
    includes: ['24-hour response target for priority issues', 'bug triage', 'security/update review', 'monthly operations memo'],
  },
]
