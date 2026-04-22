-- Create events table for Christ Embassy Portugal
CREATE TABLE IF NOT EXISTS public.events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  date        TIMESTAMPTZ NOT NULL,
  location    TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to manage events
CREATE POLICY "Admin can completely manage events"
  ON public.events
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to view all events (for the public site)
CREATE POLICY "Public can view events"
  ON public.events
  FOR SELECT
  TO anon
  USING (true);
