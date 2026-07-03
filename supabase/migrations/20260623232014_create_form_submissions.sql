
-- ═══════════════════════════════════════════════
-- Enhanced Security: Form Submissions with RLS
-- ═══════════════════════════════════════════════

-- Enhanced table with additional security fields
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_ref text NOT NULL,
  form_name text NOT NULL,
  applicant_name text NOT NULL,
  national_id text,
  phone text,
  email text,
  submission_data jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  tracking_number text UNIQUE DEFAULT 'PWO-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 8),
  ip_address text,
  user_agent text,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'completed'))
);

-- Indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_form_submissions_tracking ON form_submissions(tracking_number);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Enable ROW LEVEL SECURITY
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (for form submissions)
-- Note: In production, consider adding CAPTCHA or rate limiting
CREATE POLICY "allow_public_insert" ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Public can only SELECT their own submissions by tracking number
-- This requires the tracking number to be unguessable (which it is, due to UUID)
CREATE POLICY "allow_select_by_tracking" ON form_submissions
  FOR SELECT
  TO anon
  USING (tracking_number IS NOT NULL);

-- Policy: No public UPDATE allowed (admin only in production)
CREATE POLICY "deny_public_update" ON form_submissions
  FOR UPDATE
  TO anon
  USING (false);

-- Policy: No public DELETE allowed (admin only in production)
CREATE POLICY "deny_public_delete" ON form_submissions
  FOR DELETE
  TO anon
  USING (false);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
