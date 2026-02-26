import { NextRequest, NextResponse } from "next/server";
import { findTierById } from "@/lib/commerce/offers";

function resolveStripePaymentLink(envName: string): string | null {
  const value = process.env[envName];
  if (!value?.trim()) {
    return null;
  }

  return value.trim();
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

  return NextResponse.redirect(paymentLink, { status: 302 });
}
