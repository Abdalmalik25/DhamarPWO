-- Create satisfaction_submissions table
CREATE TABLE IF NOT EXISTS satisfaction_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  service_type TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_satisfaction_service ON satisfaction_submissions(service_type);
CREATE INDEX IF NOT EXISTS idx_satisfaction_date ON satisfaction_submissions(submitted_at DESC);

-- RLS policies
ALTER TABLE satisfaction_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit satisfaction)
CREATE POLICY "Allow public insert" ON satisfaction_submissions
  FOR INSERT WITH CHECK (true);

-- Allow public read (anyone can view - adjust as needed)
CREATE POLICY "Allow public read" ON satisfaction_submissions
  FOR SELECT USING (true);

-- Allow admin update/delete (adjust based on your auth setup)
CREATE POLICY "Allow admin update" ON satisfaction_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON satisfaction_submissions
  FOR DELETE USING (auth.role() = 'authenticated');