-- Create videos table for Christ Embassy Portugal VOD library
CREATE TABLE IF NOT EXISTS public.videos (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  url            TEXT NOT NULL,
  thumbnail_url  TEXT,
  duration       TEXT,
  category       TEXT DEFAULT 'Ensino',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to manage videos
CREATE POLICY "Admin can manage videos"
  ON public.videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to view all videos (public)
CREATE POLICY "Public can view videos"
  ON public.videos
  FOR SELECT
  TO anon
  USING (true);
