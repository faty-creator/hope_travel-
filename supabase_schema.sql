
-- Create the trips table
CREATE TABLE trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  destination TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  title JSONB NOT NULL,
  duration JSONB NOT NULL,
  description JSONB NOT NULL,
  program JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  departure TIMESTAMP WITH TIME ZONE,
  departure_location JSONB DEFAULT '{"fr": "", "en": "", "ar": ""}'::jsonb,
  arrival_location JSONB DEFAULT '{"fr": "", "en": "", "ar": ""}'::jsonb,
  map_embed TEXT,
  map_url TEXT,
  price_currency TEXT DEFAULT 'MAD',
  duration_value INTEGER
);

-- Toggle Row Level Security (RLS) on
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read trips
CREATE POLICY "Enable read access for all users" ON trips
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Enable insert for authenticated users only" ON trips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON trips
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON trips
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create Storage Bucket for Images
-- Note: You usually create buckets in the dashboard, but you can try this:
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-images', 'trip-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'trip-images' );

-- Allow authenticated upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'trip-images' AND auth.role() = 'authenticated' );
