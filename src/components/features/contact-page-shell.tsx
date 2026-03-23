import { Clock, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { ContactIntakeForm } from '@/components/features/contact-intake-form'

type ContactPageShellProps = {
  title: string
  subtitle: string
  initialIntent?: string
  initialTopic?: string
  initialProduct?: string
  initialTier?: string
}

export function ContactPageShell({
  title,
  subtitle,
  initialIntent = '',
  initialTopic = '',
  initialProduct = '',
  initialTier = '',
}: ContactPageShellProps) {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Contact</span>
            <h1 className="section-title mt-5 text-5xl leading-[0.96] text-white md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg text-white/82">{subtitle}</p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_0.42fr]">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <ContactIntakeForm
                  initialIntent={initialIntent}
                  initialTopic={initialTopic}
                  initialProduct={initialProduct}
                  initialTier={initialTier}
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)]">Contact Information</h3>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <MapPin className="mt-0.5 h-4 w-4 text-[color:var(--pine)]" />
                    <span>Sierra Foothills · Near Grass Valley, California</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Mail className="mt-0.5 h-4 w-4 text-[color:var(--pine)]" />
                    <a href="mailto:nathaniel@natfordplanning.com" className="font-semibold text-[color:var(--pine)] hover:underline">
                      nathaniel@natfordplanning.com
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Phone className="mt-0.5 h-4 w-4 text-[color:var(--pine)]" />
                    <div>
                      <a href="tel:+15302648801" className="font-semibold text-[color:var(--pine)] hover:underline">
                        (530) 264-8801
                      </a>
                      <p className="text-xs text-[color:var(--foreground)]/62">Google Voice intake line</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Linkedin className="mt-0.5 h-4 w-4 text-[color:var(--pine)]" />
                    <a href="https://linkedin.com/in/nfredmond" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--pine)] hover:underline">
                      linkedin.com/in/nfredmond
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-[color:var(--ink)]">Response Expectations</h3>
                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Clock className="mt-0.5 h-4 w-4 text-[color:var(--pine)]" />
                    <span>Typical response: 1–2 business days. For urgent matters, email directly.</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[color:var(--line)] bg-[color:var(--fog)]/75 text-[color:var(--ink)] dark:border-white/15 dark:bg-[#101c27] dark:text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)] dark:text-white">Discovery First</h3>
                  <p className="mt-2 text-sm text-[color:var(--foreground)]/78 dark:text-white/78">
                    Every new engagement begins with a scoped intake so recommendations remain realistic, fair, and executable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
