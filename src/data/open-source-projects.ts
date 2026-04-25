export type OpenSourceProject = {
  name: string
  slug: string
  status: 'Active build' | 'Public alpha' | 'Production site' | 'Research lineage' | 'Utility'
  category: 'Planning OS' | 'Geospatial' | 'Aerial intelligence' | 'Modeling' | 'Operations' | 'Creative tools' | 'Public-interest utilities'
  summary: string
  repoUrl: string
  demoUrl?: string
  docsUrl?: string
  licenseNote: string
  paidSupport: string
  primitives: string[]
}

export function readinessLabel(status: OpenSourceProject['status']) {
  switch (status) {
    case 'Production site':
      return 'Production surface'
    case 'Public alpha':
      return 'Usable alpha'
    case 'Active build':
      return 'Active buildout'
    case 'Utility':
      return 'Specialized utility'
    case 'Research lineage':
      return 'Research / reference'
  }
}

export function readinessNote(status: OpenSourceProject['status']) {
  switch (status) {
    case 'Production site':
      return 'Live public surface; best used as a working reference or supported implementation pattern.'
    case 'Public alpha':
      return 'Installable or inspectable now, with scope and hardening still evolving.'
    case 'Active build':
      return 'Moving quickly; best for pilots, custom forks, and teams comfortable shaping the tool.'
    case 'Utility':
      return 'Narrow, practical tool; useful when the workflow matches the repo.'
    case 'Research lineage':
      return 'Reference code and product lineage; useful for audits, salvage, prototypes, and custom builds.'
  }
}

export function licenseLabel(project: OpenSourceProject) {
  if (project.licenseNote.includes('not yet declared')) {
    return 'License not yet declared'
  }

  return project.licenseNote.startsWith('Open-source project') ? 'Repo license governs reuse' : 'Verify repo license before reuse'
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
    demoUrl: 'https://openplan-natford.vercel.app',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
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
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
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
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
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
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
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
    demoUrl: 'https://ads-chatbot.vercel.app',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Custom analytics dashboards, campaign operations automation, CRM/reporting integrations, and support for non-planning companies.',
    primitives: ['Channel sync patterns', 'reporting automation', 'AI-assisted operations review', 'cross-platform workflow glue'],
  },
  {
    name: 'Podcast Processor',
    slug: 'podcast-processor',
    status: 'Utility',
    category: 'Creative tools',
    summary:
      'Linux desktop podcast episode processor for Welcome to Grass Valley: concat, NVENC MP4, transcription, and AI summaries.',
    repoUrl: 'https://github.com/nfredmond/podcast-processor-codex',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Custom media workflow automation, local desktop tools, transcription pipelines, and AI-assisted publishing systems.',
    primitives: ['Desktop workflow', 'media processing', 'Whisper transcription', 'AI summary pipeline'],
  },
  {
    name: 'Nat Ford Website',
    slug: 'nat-ford-website',
    status: 'Production site',
    category: 'Operations',
    summary:
      'The public Nat Ford website and lead-routing surface, including services, project catalog, contact intake, internal lead inbox, and commerce/admin infrastructure.',
    repoUrl: 'https://github.com/nfredmond/nat-ford-website',
    demoUrl: 'https://www.natfordplanning.com',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Custom websites, intake systems, internal operations dashboards, authenticated portals, lead routing, and deployment support.',
    primitives: ['Next.js marketing site', 'lead intake workflow', 'admin surfaces', 'content architecture', 'Vercel/Supabase deployment patterns'],
  },
  {
    name: 'DOT Dashboard',
    slug: 'dot-dashboard',
    status: 'Research lineage',
    category: 'Public-interest utilities',
    summary:
      'Transportation dashboard lineage for public-agency reporting, performance tracking, and operational visibility.',
    repoUrl: 'https://github.com/nfredmond/DOT-Dashboard',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Custom agency dashboards, KPI design, data cleanup, public reporting views, and hosted dashboard operations.',
    primitives: ['Agency dashboard patterns', 'transportation reporting', 'public-sector data display', 'performance metrics'],
  },
  {
    name: 'DOT Dashboard 2.0',
    slug: 'dot-dashboard-2',
    status: 'Research lineage',
    category: 'Public-interest utilities',
    summary:
      'Second-generation DOT dashboard exploration for agency-facing mobility, funding, and program-performance reporting.',
    repoUrl: 'https://github.com/nfredmond/DOT_Dashboard_2.0',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Dashboard modernization, public data portals, internal reporting systems, and decision-support interface design.',
    primitives: ['Dashboard architecture', 'program reporting', 'agency UX patterns', 'data visualization'],
  },
  {
    name: 'Drone Mapper',
    slug: 'drone-mapper',
    status: 'Research lineage',
    category: 'Aerial intelligence',
    summary:
      'Drone mapping and mission-planning lineage for processing aerial data into usable planning and site-analysis outputs.',
    repoUrl: 'https://github.com/nfredmond/drone-mapper',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Drone mapping workflow setup, mission planning tools, photogrammetry processing, and planning-ready deliverable packaging.',
    primitives: ['Drone mission workflow', 'mapping pipeline', 'aerial data processing', 'site-analysis outputs'],
  },
  {
    name: 'FreeChAMP',
    slug: 'freechamp',
    status: 'Research lineage',
    category: 'Modeling',
    summary:
      'Open transportation demand-modeling lineage and reference work for building more accessible modeling tools.',
    repoUrl: 'https://github.com/nfredmond/FreeChAMP',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Demand-model setup, scenario workflow modernization, rural data preparation, and model interpretation support.',
    primitives: ['Demand-model reference', 'scenario inputs', 'transportation analytics', 'modeling workflow patterns'],
  },
  {
    name: 'Demand Model Grok3',
    slug: 'demand-model-grok3',
    status: 'Research lineage',
    category: 'Modeling',
    summary:
      'AI-assisted transportation demand-modeling experiment exploring how agents can help scaffold modeling workflows and assumptions.',
    repoUrl: 'https://github.com/nfredmond/Demand_Model_grok3',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Modeling workflow prototyping, assumption documentation, scenario testing, and AI-assisted analysis package development.',
    primitives: ['AI-assisted modeling scaffold', 'scenario logic', 'model documentation', 'research prototype'],
  },
  {
    name: 'Demand Model o3-mini',
    slug: 'demand-model-o3-mini',
    status: 'Research lineage',
    category: 'Modeling',
    summary:
      'Demand-modeling experiment from the o3-mini lineage, useful as a reference for agent-assisted modeling workflows.',
    repoUrl: 'https://github.com/nfredmond/Demand_Model_o3-mini',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Research-to-production modeling support, code cleanup, reproducible notebooks, and local calibration workflows.',
    primitives: ['Modeling prototype', 'agent-assisted setup', 'workflow experiment', 'transportation analysis'],
  },
  {
    name: 'Demand Model 11.13.25',
    slug: 'demandmodel-111325',
    status: 'Research lineage',
    category: 'Modeling',
    summary:
      'Earlier demand-modeling research lane preserved as open lineage for future transportation modeling product work.',
    repoUrl: 'https://github.com/nfredmond/demandmodel_11.13.25',
    licenseNote: 'License not yet declared in GitHub metadata; reuse terms are being standardized. Contact Nat Ford before production reuse.',
    paidSupport:
      'Model audit, prototype salvage, scenario-package assembly, and migration into a supported modeling workflow.',
    primitives: ['Demand-model prototype', 'historical modeling lineage', 'scenario analysis', 'workflow salvage'],
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
