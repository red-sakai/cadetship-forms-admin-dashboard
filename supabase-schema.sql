-- ============================================
-- CNCP Registration Tables
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Personal Information (saved only when department form is submitted)
CREATE TABLE IF NOT EXISTS registration_personal_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  facebook_link TEXT,
  facebook_shared_post TEXT,
  discord_username TEXT,
  linkedin_link TEXT,
  pup_webmail TEXT,
  phone TEXT,
  course_year_section TEXT,
  certificate_link TEXT,
  college_campus TEXT,
  membership_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Technology Department
CREATE TABLE IF NOT EXISTS registration_technology_cadet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  track TEXT,
  question_1 TEXT,
  question_2 TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relations Department
CREATE TABLE IF NOT EXISTS registration_relations_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team TEXT,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Marketing Department
CREATE TABLE IF NOT EXISTS registration_marketing_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team TEXT,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Operations Department
CREATE TABLE IF NOT EXISTS registration_operations_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  committee TEXT,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Creatives Department
CREATE TABLE IF NOT EXISTS registration_creatives_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team TEXT,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Administrative Department
CREATE TABLE IF NOT EXISTS registration_administrative_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Executive Department
CREATE TABLE IF NOT EXISTS registration_executive_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Finance Department
CREATE TABLE IF NOT EXISTS registration_finance_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  application_role TEXT,
  question_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interview Tracking
CREATE TABLE IF NOT EXISTS to_be_interviewed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  team TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE registration_personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_technology_cadet ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_relations_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_marketing_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_operations_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_creatives_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_administrative_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_executive_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_finance_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE to_be_interviewed ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT and SELECT on all tables
-- (registration forms use the anon/public Supabase key)

-- registration_personal_info
CREATE POLICY "Allow anonymous insert on registration_personal_info"
  ON registration_personal_info FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_personal_info"
  ON registration_personal_info FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous update on registration_personal_info"
  ON registration_personal_info FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- registration_technology_cadet
CREATE POLICY "Allow anonymous insert on registration_technology_cadet"
  ON registration_technology_cadet FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_technology_cadet"
  ON registration_technology_cadet FOR SELECT
  TO anon
  USING (true);

-- registration_relations_department
CREATE POLICY "Allow anonymous insert on registration_relations_department"
  ON registration_relations_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_relations_department"
  ON registration_relations_department FOR SELECT
  TO anon
  USING (true);

-- registration_marketing_department
CREATE POLICY "Allow anonymous insert on registration_marketing_department"
  ON registration_marketing_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_marketing_department"
  ON registration_marketing_department FOR SELECT
  TO anon
  USING (true);

-- registration_operations_department
CREATE POLICY "Allow anonymous insert on registration_operations_department"
  ON registration_operations_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_operations_department"
  ON registration_operations_department FOR SELECT
  TO anon
  USING (true);

-- registration_creatives_department
CREATE POLICY "Allow anonymous insert on registration_creatives_department"
  ON registration_creatives_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_creatives_department"
  ON registration_creatives_department FOR SELECT
  TO anon
  USING (true);

-- registration_administrative_department
CREATE POLICY "Allow anonymous insert on registration_administrative_department"
  ON registration_administrative_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_administrative_department"
  ON registration_administrative_department FOR SELECT
  TO anon
  USING (true);

-- registration_executive_department
CREATE POLICY "Allow anonymous insert on registration_executive_department"
  ON registration_executive_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_executive_department"
  ON registration_executive_department FOR SELECT
  TO anon
  USING (true);

-- registration_finance_department
CREATE POLICY "Allow anonymous insert on registration_finance_department"
  ON registration_finance_department FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on registration_finance_department"
  ON registration_finance_department FOR SELECT
  TO anon
  USING (true);

-- to_be_interviewed
CREATE POLICY "Allow anonymous insert on to_be_interviewed"
  ON to_be_interviewed FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on to_be_interviewed"
  ON to_be_interviewed FOR SELECT
  TO anon
  USING (true);
