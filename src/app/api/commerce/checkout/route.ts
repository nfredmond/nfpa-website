import { NextRequest, NextResponse } from "next/server";
import { findTierById } from "@/lib/commerce/offers";

const OPENPLAN_PRELAUNCH_END = process.env.OPENPLAN_PRELAUNCH_END ?? "2026-04-01T00:00:00-07:00";
const OPENPLAN_PRELAUNCH_PROMO_CODE = process.env.OPENPLAN_PRELAUNCH_PROMO_CODE ?? "OPENPLAN15";

function resolveStripePaymentLink(envName: string): string | null {
  const value = process.env[envName];
  if (!value?.trim()) {
    return null;
  }

  return value.trim();
}

function maybeApplyOpenPlanPrelaunchPromo(paymentLink: string, tierId: string, productId: string): string {
  if (productId !== "openplan") {
    return paymentLink;
  }

  const cutoff = new Date(OPENPLAN_PRELAUNCH_END);
  const now = new Date();
  if (Number.isNaN(cutoff.getTime()) || now >= cutoff) {
    return paymentLink;
  }

  const promoCode = OPENPLAN_PRELAUNCH_PROMO_CODE.trim();
  if (!promoCode) {
    return paymentLink;
  }

  try {
    const checkoutUrl = new URL(paymentLink);
    checkoutUrl.searchParams.set("prefilled_promo_code", promoCode);
    checkoutUrl.searchParams.set("client_reference_id", `${tierId}-prelaunch`);
    return checkoutUrl.toString();
  } catch {
    return paymentLink;
  }
}

export async function GET(request: NextRequest) {
  const tierId = request.nextUrl.searchParams.get("tier");

  if (!tierId) {
    return NextResponse.json({ error: "Missing tier query parameter" }, { status: 400 });
  }

  const tier = findTierById(tierId);
  if (!tier) {
    return NextResponse.json({ error: "Unknown tier" }, { status: 404 });
  }

  const paymentLink = resolveStripePaymentLink(tier.stripePaymentLinkEnv);

  if (!paymentLink) {
    const fallback = new URL("/contact", request.nextUrl.origin);
    fallback.searchParams.set("intent", "subscription");
    fallback.searchParams.set("product", tier.product.id);
    fallback.searchParams.set("tier", tier.id);

    return NextResponse.redirect(fallback, { status: 302 });
  }

  const checkoutLink = maybeApplyOpenPlanPrelaunchPromo(paymentLink, tier.id, tier.product.id);

  return NextResponse.redirect(checkoutLink, { status: 302 });
}
