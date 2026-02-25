import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Compass,
  Database,
  FileText,
  Handshake,
  Map,
  MapPin,
  Plane,
  Radar,
  Sparkles,
} from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import JsonLd from '@/components/features/json-ld'
import organizationData from '@/data/organization.json'
import servicesData from '@/data/services.json'
import projectsData from '@/data/projects.json'

const services = [
  {
    name: 'Urban & Transportation Planning',
    description: 'RTPs, ATPs, VMT analysis, and implementation strategy tailored for Northern California agencies.',
    icon: MapPin,
    href: '/services/planning',
  },
  {
    name: 'GIS & Spatial Analysis',
    description: 'PostGIS-backed analysis, map automation, and scenario intelligence for policy and capital decisions.',
    icon: Database,
    href: '/services/gis',
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description: 'Orthomosaics, terrain models, and site intelligence from FAA-licensed drone workflows.',
    icon: Plane,
    href: '/services/aerial',
  },
  {
    name: 'Funding & Grant Services',
    description: 'Program fit, narrative strategy, and grant package execution that improves funding competitiveness.',
    icon: FileText,
    href: '/services/grants',
  },
  {
    name: 'AI-Enabled Documentation',
    description: 'Faster report assembly with methods-first disclosure, citation QA, and human approval gates.',
    icon: Sparkles,
    href: '/services/ai',
  },
]

const products = [
  {
    name: 'OpenPlan',
    icon: Map,
    description: 'Corridor analysis + equity/safety diagnostics + grant-ready report generation in one operational flow.',
    href: '/products#openplan',
  },
  {
    name: 'Ads Automation',
    icon: Bot,
    description: 'A client-proven automation system evolving into a multi-industry SaaS operations platform.',
    href: '/products#ads-automation',
  },
]

const trustedBy = [
  'Sierra County',
  'Del Norte County',
  'Tehama County',
  'Plumas County',
  'El Dorado County Transportation Commission',
]

const process = [
  {
    title: 'Frame the real decision',
    desc: 'We clarify what decision must be made, which constraints are binding, and what success actually looks like.',
    icon: Compass,
  },
  {
    title: 'Build an auditable method',
    desc: 'Assumptions, data lineage, and limitations are explicit so technical stakeholders can verify and trust the work.',
    icon: Radar,
  },
  {
    title: 'Translate to fundable action',
    desc: 'We package recommendations into implementation-ready scopes, grant narratives, and board-usable materials.',
    icon: FileText,
  },
  {
    title: 'Stay in execution mode',
    desc: 'Consulting and software are aligned so projects move from strategy to delivery without losing continuity.',
    icon: Handshake,
  },
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={servicesData} />
      <JsonLd data={projectsData} />

      <Section spacing="xl" className="hero-mesh text-white">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <span className="pill">Northern California · Planning + Software</span>
              <h1 className="section-title mt-5 text-5xl sm:text-6xl lg:text-7xl leading-[0.96]">
                Sleek planning intelligence built for agencies that need to move.
              </h1>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85">
                Nat Ford combines transportation planning expertise with production-grade tools so agencies, tribes, and
                consultancies can move from analysis to funded implementation with less friction.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--copper)] px-6 py-3 text-[0.98rem] font-semibold text-[#1f2428] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Schedule Strategy Call
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-[0.98rem] font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Products
                </Link>
              </div>
            </div>

            <div className="soft-card rounded-3xl p-5 sm:p-6 bg-white/95 text-[color:var(--ink)] float-slow">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold tracking-wide text-[0.8rem] uppercase text-[color:var(--pine)]">
                  Delivery Signal Panel
                </p>
                <span className="text-xs font-semibold text-[color:var(--pine)]">Live Working Style</span>
              </div>

              <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-[color:var(--line)]">
                <Image
                  src="/images/site/hero-corridor.jpg"
                  alt="Aerial corridor view in Northern California foothills"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2f]/65 via-[#0f1f2f]/15 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#12301f]">
                  Corridor-ready analysis
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="signal-tile rounded-2xl p-3.5">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--foreground)]/55">Focus region</p>
                  <p className="mt-1 font-semibold">Rural Northern CA</p>
                </div>
                <div className="signal-tile rounded-2xl p-3.5">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--foreground)]/55">Operating model</p>
                  <p className="mt-1 font-semibold">Consulting + SaaS</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--sand)]/40 p-4">
                <p className="text-xs uppercase tracking-wide text-[color:var(--foreground)]/55">Promise</p>
                <p className="mt-1 text-sm leading-relaxed">
                  No hype. No hidden assumptions. No burden-shifting recommendations. Every deliverable is built to be
                  client-safe, review-ready, and implementation-aware.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/80">
        <Container>
          <p className="text-center text-[0.76rem] uppercase tracking-[0.18em] text-[color:var(--foreground)]/55">
            Agencies served by Nathaniel in prior roles
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[color:var(--foreground)]/75">
            {trustedBy.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl">
            <p className="pill mb-4">Consulting Services</p>
            <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Technical depth without the consultant fog.</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/80">
              Modular support across planning, GIS, funding, and production documentation — structured for real public
              workflows, not slide decks.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className="group rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--pine)]/60 hover:shadow-xl"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)] group-hover:bg-[color:var(--pine)] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{service.name}</h3>
                  <p className="mt-2 text-[0.98rem] text-[color:var(--foreground)]/75">{service.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[color:var(--pine)]">
                    Learn more <ArrowRight className="ml-1.5 h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
            <div>
              <p className="pill mb-4">Product Layer</p>
              <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Software that compounds consulting impact.</h2>
              <p className="mt-4 text-lg text-[color:var(--foreground)]/80">
                We are not building software for software's sake. Each product shortens cycle time, hardens quality,
                and makes results easier to explain and defend.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center rounded-full border border-[color:var(--line)] px-5 py-2.5 font-semibold text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)] transition"
              >
                View Product Details
              </Link>
            </div>

            <div className="grid gap-4">
              {products.map((product) => {
                const Icon = product.icon
                return (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="soft-card rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{product.name}</h3>
                        <p className="mt-2 text-[0.98rem] text-[color:var(--foreground)]/78">{product.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl">
            <p className="pill mb-4">How We Work</p>
            <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Intuitive process. Serious technical standards.</h2>
          </div>

          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-5">
            {process.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]/50">
                      Step {idx + 1}
                    </span>
                    <Icon className="h-5 w-5 text-[color:var(--pine)]" />
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-[0.98rem] text-[color:var(--foreground)]/75">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--sand)]/45 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-4xl">
            <p className="pill mb-4">Ethics & AI Disclosure</p>
            <h2 className="section-title text-4xl text-[color:var(--ink)]">The covenant behind every deliverable.</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82">
              AI is used to accelerate drafting, data cleaning, and formatting. Final analysis and conclusions remain
              human-reviewed and accountable. Assumptions are disclosed, uncertainty is labeled, and key claims are
              citation-supported or flagged for verification.
            </p>
            <Link
              href="/ethics"
              className="mt-6 inline-flex items-center font-semibold text-[color:var(--pine)] hover:text-[color:var(--pine-deep)] transition"
            >
              Read full ethics policy <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#101c27] text-white">
        <Container>
          <div className="rounded-3xl border border-white/15 bg-white/[0.03] px-6 py-10 md:px-10 md:py-12 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Next Step</p>
            <h2 className="section-title mt-3 text-4xl md:text-5xl text-white">Tell us what decision you need to make.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              We’ll propose a scoped plan that is technically defensible, schedule-aware, and aligned with your budget.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--copper)] px-6 py-3 text-[0.98rem] font-semibold text-[#1f2428] transition hover:-translate-y-0.5"
              >
                Start the Conversation
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-[0.98rem] font-semibold text-white transition hover:bg-white/8"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
