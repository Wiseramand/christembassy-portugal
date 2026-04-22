-- Create donations table for Christ Embassy Portugal
CREATE TABLE IF NOT EXISTS public.donations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT,
  email       TEXT,
  amount      NUMERIC(10, 2) NOT NULL,
  currency    TEXT DEFAULT 'EUR',
  status      TEXT DEFAULT 'completed',
  method      TEXT DEFAULT 'stripe',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to read all donations
CREATE POLICY "Admin can view donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert (from Stripe webhook)
CREATE POLICY "Service role can insert donations"
  ON public.donations
  FOR INSERT
  TO service_role
  WITH CHECK (true);
