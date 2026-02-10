-- Supabase Schema for Francesco's Dashboard
-- Run this in the Supabase SQL Editor

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL DEFAULT 'zoe',
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline DATE,
  tags TEXT[] DEFAULT '{}',
  subtasks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Agent statuses table
CREATE TABLE IF NOT EXISTS agent_statuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('active', 'working', 'idle', 'offline')),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  current_task TEXT,
  model TEXT,
  token_usage INTEGER DEFAULT 0,
  session_key TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  model TEXT,
  level TEXT DEFAULT 'info' CHECK (level IN ('info', 'success', 'warning', 'error')),
  duration TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for the dashboard)
CREATE POLICY "Allow public read access on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on tasks" ON tasks FOR DELETE USING (true);

CREATE POLICY "Allow public read access on agent_statuses" ON agent_statuses FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on agent_statuses" ON agent_statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on agent_statuses" ON agent_statuses FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on activity_logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Insert default agent statuses
INSERT INTO agent_statuses (id, name, status) VALUES
  ('zoe', 'Zoe', 'active'),
  ('sam', 'Sam', 'working'),
  ('leo', 'Leo', 'idle'),
  ('mika', 'Mika', 'offline'),
  ('rex', 'Rex', 'offline'),
  ('victor', 'Victor', 'idle'),
  ('dante', 'Dante', 'offline')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_statuses;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
