-- Create challenge_submissions table to track user attempts and completions
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  submitted_date DATE NOT NULL,
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  is_solved BOOLEAN DEFAULT FALSE,
  last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_challenge_date UNIQUE(user_id, challenge_id, submitted_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_id ON challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_submitted_date ON challenge_submissions(submitted_date);

-- Add RLS policies
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own submissions
CREATE POLICY "Users can view own submissions" ON challenge_submissions
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can only insert their own submissions
CREATE POLICY "Users can insert own submissions" ON challenge_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own submissions
CREATE POLICY "Users can update own submissions" ON challenge_submissions
  FOR UPDATE USING (user_id = auth.uid());

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_challenge_submissions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp on record update
CREATE TRIGGER challenge_submissions_update_timestamp
  BEFORE UPDATE ON challenge_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_submissions_timestamp();
