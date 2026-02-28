import { NextResponse } from 'next/server'
import { offerCatalog } from '@/lib/commerce/offers'

export const runtime = 'nodejs'

export async function GET() {
  const tiers = offerCatalog.flatMap((product) =>
    product.tiers.map((tier) => {
      const raw = process.env[tier.stripePaymentLinkEnv]
      const configured = Boolean(raw && raw.trim())

      return {
        productId: product.id,
        productName: product.name,
        tierId: tier.id,
        tierName: tier.name,
        envKey: tier.stripePaymentLinkEnv,
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
