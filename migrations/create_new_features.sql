-- Migration for Opportunities, Hackathons, Projects and Messages

-- 1. Create Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  link TEXT,
  deadline DATE,
  type TEXT CHECK (type IN ('student_opportunity', 'hackathon')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for opportunities
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view opportunities" ON opportunities
  FOR SELECT USING (true);

-- 2. Create Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  repo_url TEXT,
  live_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Create Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for messages table
-- Note: This requires the supabase_realtime publication to exist (default in Supabase)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
END $$;

-- Add some initial sample data for opportunities
INSERT INTO opportunities (title, company, description, link, deadline, type)
VALUES 
('Software Engineering Intern 2026', 'Google', 'Looking for passionate students to join our engineering team.', 'https://careers.google.com', '2026-08-01', 'student_opportunity'),
('Frontend Developer Intern', 'Meta', 'Join the Facebook or Instagram product teams.', 'https://meta.com/careers', '2026-07-15', 'student_opportunity'),
('DevSpace Global Hackathon', 'DevSpace', 'Build the future of engineering collaboration.', 'https://devspace.com/hackathon', '2026-06-30', 'hackathon'),
('AI Innovation Challenge', 'OpenAI', 'Build innovative tools using the OpenAI API.', 'https://openai.com/hackathon', '2026-09-10', 'hackathon');
