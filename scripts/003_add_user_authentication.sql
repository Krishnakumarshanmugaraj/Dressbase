-- Add user_id column to dress_entries table
ALTER TABLE dress_entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_dress_entries_user_id ON dress_entries(user_id);

-- Enable Row Level Security
ALTER TABLE dress_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dress_entries
CREATE POLICY "Users can view their own dress entries"
  ON dress_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dress entries"
  ON dress_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dress entries"
  ON dress_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dress entries"
  ON dress_entries FOR DELETE
  USING (auth.uid() = user_id);
