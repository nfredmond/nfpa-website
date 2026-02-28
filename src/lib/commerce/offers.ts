export type OfferTier = {
  id: string;
  name: string;
  monthlyUsd: number;
  summary: string;
  features: string[];
  stripePaymentLinkEnv: string;
};

export type OfferProduct = {
  id: string;
  name: string;
  description: string;
  tiers: OfferTier[];
  priceSuffix?: string;
  checkoutCtaLabel?: string;
};

export const offerCatalog: OfferProduct[] = [
  {
    id: "openplan",
    name: "OpenPlan SaaS",
    description: "Corridor analysis, funding-ready reporting, and operational planning intelligence.",
    tiers: [
      {
        id: "openplan-starter",
        name: "Starter",
        monthlyUsd: 249,
        summary: "Best for a single agency team validating monthly workflow improvements.",
        features: [
          "1 workspace",
          "Up to 100 corridor runs/month",
          "Grant-ready reporting templates",
          "Email support (2 business days)",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_OPENPLAN_STARTER",
      },
      {
        id: "openplan-professional",
        name: "Professional",
        monthlyUsd: 799,
        summary: "Best for active planning teams running production analysis every week.",
        features: [
          "Up to 5 workspaces",
          "Up to 500 corridor runs/month",
          "Priority support + onboarding office hours",
          "Advanced KPI and methods exports",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_OPENPLAN_PROFESSIONAL",
      },
      {
        id: "openplan-agency",
        name: "Agency",
        monthlyUsd: 1999,
        summary: "Best for consultants and multi-agency programs needing scale and governance.",
        features: [
          "Up to 20 workspaces",
          "Up to 2,000 corridor runs/month",
          "Team training + implementation review",
          "Dedicated success cadence",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_OPENPLAN_AGENCY",
      },
    ],
  },
  {
    id: "ads-automation",
    name: "Marketing & Planning Analytics Software",
    description: "Cross-channel campaign operations, reporting hygiene, and AI-assisted ad workflow acceleration.",
    tiers: [
      {
        id: "ads-essentials",
        name: "Essentials",
        monthlyUsd: 149,
        summary: "For small teams that need dependable campaign reporting and sync hygiene.",
        features: [
          "1 ad account group",
          "Daily sync + anomaly checks",
          "Weekly executive summary",
          "Email support",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_ADS_ESSENTIALS",
      },
      {
        id: "ads-growth",
        name: "Growth",
        monthlyUsd: 349,
        summary: "For growing organizations that need faster optimization cycles.",
        features: [
          "Up to 5 account groups",
          "Cross-channel pacing and budget alerts",
          "Custom reporting views",
          "Priority support",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_ADS_GROWTH",
      },
      {
        id: "ads-scale",
        name: "Scale",
        monthlyUsd: 799,
        summary: "For high-volume teams needing operational reliability and strategic review.",
        features: [
          "Up to 15 account groups",
          "Automation rule tuning",
          "Monthly strategy review",
          "Fast-response support",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_ADS_SCALE",
      },
    ],
  },
  {
    id: "drone-ops",
    name: "DroneOps Intelligence",
    description: "Field capture + map-ready processing workflow support for infrastructure and planning inspections.",
    tiers: [
      {
        id: "drone-starter",
        name: "Starter",
        monthlyUsd: 99,
        summary: "For solo pilots testing a repeatable digital deliverable stack.",
        features: [
          "Up to 5 missions/month",
          "Basic QA checklist workflow",
          "Standard export package",
          "Email support",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_DRONE_STARTER",
      },
      {
        id: "drone-professional",
        name: "Professional",
        monthlyUsd: 299,
        summary: "For active field programs requiring faster turnarounds and tighter QA.",
        features: [
          "Up to 20 missions/month",
          "Advanced QA + issue tagging",
          "Map integration handoff package",
          "Priority support",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_DRONE_PROFESSIONAL",
      },
      {
        id: "drone-enterprise",
        name: "Enterprise",
        monthlyUsd: 899,
        summary: "For municipal, utility, and multi-site operators requiring operational rigor.",
        features: [
          "Up to 75 missions/month",
          "Team governance and SOP support",
          "Custom handoff templates",
          "Dedicated coordination lane",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_DRONE_ENTERPRISE",
      },
    ],
  },
  {
    id: "vibe-coding-for-planners",
    name: "Vibe Coding for Planners (PDF Guide)",
    description: "Practical AI workflow guide for planners who need faster drafting, cleaner QA, and defensible deliverables.",
    priceSuffix: "one-time",
    checkoutCtaLabel: "Subscribe",
    tiers: [
      {
        id: "vibe-coding-planners-starter",
        name: "Starter",
        monthlyUsd: 29,
        summary: "Core playbook for solo planners implementing a clean vibe-coding workflow.",
        features: [
          "Full PDF guide",
          "Prompt structure templates",
          "Daily planning sprint checklist",
          "Immediate digital access",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_VIBE_CODING_PLANNERS_29",
      },
      {
        id: "vibe-coding-planners-practitioner",
        name: "Practitioner",
        monthlyUsd: 39,
        summary: "Adds quality controls for planners shipping client-facing technical deliverables.",
        features: [
          "Everything in Starter",
          "QA and review rubric",
          "Scope-to-deliverable prompt pack",
          "Revision loop playbook",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_VIBE_CODING_PLANNERS_39",
      },
      {
        id: "vibe-coding-planners-team",
        name: "Team",
        monthlyUsd: 49,
        summary: "Best for teams standardizing methods and handoffs across multiple planners.",
        features: [
          "Everything in Practitioner",
          "Team handoff workflow template",
          "Manager review checklist",
          "Launch planning worksheet",
        ],
        stripePaymentLinkEnv: "STRIPE_LINK_VIBE_CODING_PLANNERS_49",
      },
    ],
  },
];

export function findTierById(tierId: string): (OfferTier & { product: OfferProduct }) | null {
  for (const product of offerCatalog) {
    for (const tier of product.tiers) {
      if (tier.id === tierId) {
        return { ...tier, product };
      }
    }
  }

  return null;
}
