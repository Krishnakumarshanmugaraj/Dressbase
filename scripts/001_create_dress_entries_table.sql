-- Create dress_entries table to store dress records
CREATE TABLE IF NOT EXISTS dress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  color VARCHAR(100) NOT NULL,
  detected_color VARCHAR(100),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster timeline queries
CREATE INDEX IF NOT EXISTS idx_dress_entries_date ON dress_entries(date DESC);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_dress_entries_created_at ON dress_entries(created_at DESC);
