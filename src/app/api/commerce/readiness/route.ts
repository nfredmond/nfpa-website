import { NextResponse } from 'next/server'
import { offerCatalog } from '@/lib/commerce/offers'
import { resolveStripePaymentLinkEnv } from '@/lib/commerce/stripe-payment-links'

export const runtime = 'nodejs'

export async function GET() {
  const tiers = offerCatalog.flatMap((product) =>
    product.tiers.map((tier) => {
      const paymentLink = resolveStripePaymentLinkEnv(tier.stripePaymentLinkEnv)
      const configured = Boolean(paymentLink.paymentLink)

      return {
        productId: product.id,
        productName: product.name,
        tierId: tier.id,
        tierName: tier.name,
        envKey: paymentLink.envKey,
        envAliases: paymentLink.envAliases,
        configuredEnvKey: paymentLink.configuredEnvKey,
        configured,
      }
    })
  )

  const configuredCount = tiers.filter((tier) => tier.configured).length
  const missingCount = tiers.length - configuredCount

  return NextResponse.json({
    ok: true,
    summary: {
      totalTiers: tiers.length,
      configuredTiers: configuredCount,
      missingTiers: missingCount,
      readyForDirectStripeCheckout: missingCount === 0,
    },
    tiers,
    generatedAt: new Date().toISOString(),
  })
}
