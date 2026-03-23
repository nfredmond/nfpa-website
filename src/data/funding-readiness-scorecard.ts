export type FundingReadinessQuestion = {
  id: string
  domain: string
  prompt: string
  note: string
}

export type FundingReadinessBand = {
  name: string
  min: number
  max: number
  rangeLabel: string
  summary: string
  guidance: string
}

export const fundingReadinessQuestions: FundingReadinessQuestion[] = [
  {
    id: 'plan-freshness',
    domain: 'Plan freshness',
    prompt: 'Do you have a current adopted plan, corridor study, capital program, or board-recognized planning document that clearly supports this project?',
    note: 'Current planning support helps show continuity, policy fit, and implementation intent.',
  },
  {
    id: 'project-definition',
    domain: 'Project definition clarity',
    prompt: 'Is the project scope clearly defined enough to explain location, purpose, limits, and the phase you are asking funding to support?',
    note: 'Funders want a crisp project story, not a moving target.',
  },
  {
    id: 'cost-estimate',
    domain: 'Cost estimate basis',
    prompt: 'Do you have a documented cost estimate basis that is appropriate for this phase and recent enough to defend?',
    note: 'Even early-stage applications benefit from transparent cost logic and assumptions.',
  },
  {
    id: 'match-readiness',
    domain: 'Match readiness',
    prompt: 'Have you identified likely match requirements, constraints, and the realistic source of any local share?',
    note: 'A strong application can still stall if match strategy is vague or unrealistic.',
  },
  {
    id: 'outreach-evidence',
    domain: 'Outreach evidence',
    prompt: 'Do you have recent outreach, stakeholder input, or community need evidence that supports the project narrative?',
    note: 'Useful outreach evidence strengthens need, equity, safety, and implementation credibility.',
  },
  {
    id: 'data-mapping',
    domain: 'Data and mapping readiness',
    prompt: 'Are the core maps, location data, crash/safety data, demand context, or other supporting evidence organized and usable?',
    note: 'Clean data reduces last-minute scrambling and improves technical defensibility.',
  },
  {
    id: 'board-readiness',
    domain: 'Board or leadership readiness',
    prompt: 'Do you know what board action, tribal approval, executive signoff, or internal authorization will be needed to submit on time?',
    note: 'Submission windows are often lost in governance bottlenecks rather than narrative weakness.',
  },
  {
    id: 'narrative-materials',
    domain: 'Narrative support materials',
    prompt: 'Can you already point to the core benefits, target users, implementation story, and why-now case in plain language?',
    note: 'A clear narrative backbone makes technical evidence easier to package and defend.',
  },
  {
    id: 'delivery-capacity',
    domain: 'Delivery capacity',
    prompt: 'If funding lands, do you have a realistic path for consultant support, internal staffing, procurement, or delivery sequencing?',
    note: 'Funders often look for signals that a project can move after award, not sit idle.',
  },
  {
    id: 'package-discipline',
    domain: 'Package discipline',
    prompt: 'Are supporting attachments, schedules, GIS figures, partner letters, and submission responsibilities organized well enough for a clean package assembly process?',
    note: 'Readiness is often won or lost in the final assembly layer.',
  },
]

export const fundingReadinessBands: FundingReadinessBand[] = [
  {
    name: 'Needs Foundation Work',
    min: 0,
    max: 9,
    rangeLabel: '0–9 points',
    summary: 'Key building blocks are missing or too early to support a strong funding push.',
    guidance:
      'Focus first on project definition, evidence, approvals, and the basic narrative package before chasing a live application window.',
  },
  {
    name: 'Almost Ready',
    min: 10,
    max: 15,
    rangeLabel: '10–15 points',
    summary: 'You likely have a viable concept, but several gaps still create avoidable risk.',
    guidance:
      'Close the highest-leverage gaps now so the application story, technical support, and internal approvals are aligned before submission.',
  },
  {
    name: 'Ready to Pursue',
    min: 16,
    max: 20,
    rangeLabel: '16–20 points',
    summary: 'Your package appears materially positioned for a focused funding push.',
    guidance:
      'Use the remaining time to tighten program fit, submission discipline, and any final evidence needed for a clean, defensible package.',
  },
]

export const fundingReadinessScoringLabels = [
  {
    value: 0,
    label: 'Not in place',
    description: 'Missing, outdated, or too unclear to rely on',
  },
  {
    value: 1,
    label: 'Partial',
    description: 'Some work exists, but it still needs cleanup or confirmation',
  },
  {
    value: 2,
    label: 'Ready',
    description: 'Documented, current, and usable for a near-term funding push',
  },
]

export const fundingReadinessCommonGaps = [
  'A project concept exists, but scope limits and phase are still fuzzy.',
  'Costs are based on rough memory rather than a current documented basis.',
  'Good outreach happened, but it is not organized into usable evidence.',
  'GIS figures and supporting data exist across multiple folders with no clean assembly path.',
  'Leadership support is assumed, but required action timing is still unclear.',
]
