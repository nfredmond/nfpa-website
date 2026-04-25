type StripePaymentLinkEnvironment = Record<string, string | undefined>;

export type StripePaymentLinkEnvResolution = {
  envKey: string;
  envAliases: string[];
  configuredEnvKey: string | null;
  paymentLink: string | null;
};

const STRIPE_PAYMENT_LINK_ENV_ALIASES: Record<string, string[]> = {
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29: ["STRIPE_LINK_VIBE_CODING_PLANNERS_29"],
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39: ["STRIPE_LINK_VIBE_CODING_PLANNERS_39"],
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49: ["STRIPE_LINK_VIBE_CODING_PLANNERS_49"],
};

export function getStripePaymentLinkEnvNames(envKey: string): string[] {
  return [envKey, ...(STRIPE_PAYMENT_LINK_ENV_ALIASES[envKey] ?? [])];
}

export function resolveStripePaymentLinkEnv(
  envKey: string,
  env: StripePaymentLinkEnvironment = process.env,
): StripePaymentLinkEnvResolution {
  const envNames = getStripePaymentLinkEnvNames(envKey);

  for (const candidate of envNames) {
    const value = env[candidate]?.trim();
    if (value) {
      return {
        envKey,
        envAliases: envNames.slice(1),
        configuredEnvKey: candidate,
        paymentLink: value,
      };
    }
  }

  return {
    envKey,
    envAliases: envNames.slice(1),
    configuredEnvKey: null,
    paymentLink: null,
  };
}
