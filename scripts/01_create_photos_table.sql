-- Create photos table for guest photo uploads
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  uploader_name TEXT DEFAULT 'Anonymous Guest',
  uploader_email TEXT DEFAULT 'guest@wedding.com',
  event TEXT DEFAULT 'General',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_approved ON photos(approved);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert photos (guest uploads)
CREATE POLICY "Allow guest uploads" ON photos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to view approved photos
CREATE POLICY "Allow viewing approved photos" ON photos
  FOR SELECT
  TO public
  USING (approved = true);

-- Allow admin to view and update all photos (requires JWT token with admin role)
CREATE POLICY "Allow admin access" ON photos
  FOR ALL
  TO authenticated
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
