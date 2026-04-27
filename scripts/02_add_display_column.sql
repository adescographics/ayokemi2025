-- Add display column to photos table if it doesn't exist
ALTER TABLE photos ADD COLUMN IF NOT EXISTS display BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_display ON photos(display);

-- Update existing approved photos to be displayed
UPDATE photos SET display = true WHERE approved = true;
