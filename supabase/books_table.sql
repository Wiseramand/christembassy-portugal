-- Create books table for Christ Embassy Portugal library
CREATE TABLE IF NOT EXISTS public.books (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  author       TEXT DEFAULT 'Pastor Chris Oyakhilome',
  description  TEXT,
  image_url    TEXT,
  pdf_url      TEXT NOT NULL,
  category     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to manage books
CREATE POLICY "Admin can manage books"
  ON public.books
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to view all books (public)
CREATE POLICY "Public can view books"
  ON public.books
  FOR SELECT
  TO anon
  USING (true);
