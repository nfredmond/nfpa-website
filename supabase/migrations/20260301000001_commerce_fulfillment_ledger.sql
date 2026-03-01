CREATE TABLE IF NOT EXISTS commerce_fulfillment_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  stripe_event_type TEXT NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  customer_email TEXT,
  product_id TEXT,
  tier_id TEXT,
  status TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'stripe_webhook',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commerce_fulfillment_tier_status
  ON commerce_fulfillment_ledger(tier_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_commerce_fulfillment_email_created
  ON commerce_fulfillment_ledger(customer_email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_commerce_fulfillment_checkout_session
  ON commerce_fulfillment_ledger(stripe_checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_commerce_fulfillment_subscription
  ON commerce_fulfillment_ledger(stripe_subscription_id);

CREATE OR REPLACE FUNCTION set_commerce_fulfillment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_commerce_fulfillment_updated_at ON commerce_fulfillment_ledger;
CREATE TRIGGER trg_set_commerce_fulfillment_updated_at
BEFORE UPDATE ON commerce_fulfillment_ledger
FOR EACH ROW
EXECUTE FUNCTION set_commerce_fulfillment_updated_at();

ALTER TABLE commerce_fulfillment_ledger ENABLE ROW LEVEL SECURITY;

-- Public reads are disabled; service-role writes/reads from backend only.
CREATE POLICY "commerce_fulfillment_no_public_access"
  ON commerce_fulfillment_ledger
  FOR ALL
  USING (false)
  WITH CHECK (false);
