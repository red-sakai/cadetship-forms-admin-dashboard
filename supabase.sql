-- here are all the supabase tables

create table public.registration_administrative_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  application_role text not null,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_administrative_department_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_registration_admin_department_email on public.registration_administrative_department using btree (email) TABLESPACE pg_default;

create index IF not exists idx_registration_admin_department_role on public.registration_administrative_department using btree (application_role) TABLESPACE pg_default;

create table public.registration_creatives_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  team text not null,
  application_role text not null,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_creatives_department_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_registration_creatives_department_email on public.registration_creatives_department using btree (email) TABLESPACE pg_default;

create index IF not exists idx_registration_creatives_department_team_role on public.registration_creatives_department using btree (team, application_role) TABLESPACE pg_default;

create table public.registration_executive_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  application_role text not null,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_executive_department_pkey primary key (id)
) TABLESPACE pg_default;

create table public.registration_marketing_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  team text not null,
  application_role text not null,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_marketing_department_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_registration_marketing_department_email on public.registration_marketing_department using btree (email) TABLESPACE pg_default;

create index IF not exists idx_registration_marketing_department_team_role on public.registration_marketing_department using btree (team, application_role) TABLESPACE pg_default;

create table public.registration_operations_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  committee text not null,
  application_role text not null,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_operations_department_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_registration_operations_department_email on public.registration_operations_department using btree (email) TABLESPACE pg_default;

create index IF not exists idx_registration_operations_department_committee_role on public.registration_operations_department using btree (committee, application_role) TABLESPACE pg_default;

create table public.registration_personal_info (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  facebook_link text not null,
  facebook_post_link text null,
  discord_username text not null,
  linkedin_link text null,
  pup_webmail text not null,
  phone text not null,
  course_year_section text not null,
  certificate_link text not null,
  college_campus text not null,
  membership_type text not null,
  facebook_shared_post text not null default ''::text,
  constraint registration_personal_info_pkey primary key (id),
  constraint registration_personal_info_course_year_section_chk check ((course_year_section ~* '^(BS|BA|AB)'::text)),
  constraint registration_personal_info_email_chk check (
    (
      email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::text
    )
  ),
  constraint registration_personal_info_facebook_link_chk check (
    (
      facebook_link ~* '^https?://([^/]+\.)?facebook\.com/'::text
    )
  ),
  constraint registration_personal_info_facebook_post_link_chk check (
    (
      (facebook_post_link is null)
      or (facebook_post_link = ''::text)
      or (
        facebook_post_link ~* '^https?://([^/]+\.)?facebook\.com/'::text
      )
    )
  ),
  constraint registration_personal_info_linkedin_link_chk check (
    (
      (linkedin_link is null)
      or (linkedin_link = ''::text)
      or (
        linkedin_link ~* '^https?://([^/]+\.)?linkedin\.com/'::text
      )
    )
  ),
  constraint registration_personal_info_phone_chk check ((phone ~ '^09[0-9]{9}$'::text)),
  constraint registration_personal_info_certificate_link_chk check (
    (
      certificate_link ~* '^https?://([^/]+\.)?drive\.google\.com/'::text
    )
  ),
  constraint registration_personal_info_pup_webmail_chk check (
    (
      lower(pup_webmail) ~~ '%@iskolarngbayan.pup.edu.ph'::text
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_registration_personal_info_created_at on public.registration_personal_info using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_registration_personal_info_membership_type on public.registration_personal_info using btree (membership_type) TABLESPACE pg_default;

create index IF not exists registration_personal_info_email_idx on public.registration_personal_info using btree (email, created_at desc) TABLESPACE pg_default;

create table public.registration_relations_department (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  team text not null default ''::text,
  application_role text not null default ''::text,
  question_answers jsonb not null default '{}'::jsonb,
  constraint registration_relations_department_pkey primary key (id)
) TABLESPACE pg_default;

create table public.registration_technology_lead_colead (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  technology_department text not null,
  applying_as text not null,
  expectation_answer text not null,
  certifications_answer text null,
  extra_answers jsonb not null default '{}'::jsonb,
  constraint registration_technology_lead_colead_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_reg_tech_lead_email on public.registration_technology_lead_colead using btree (email) TABLESPACE pg_default;

create index IF not exists idx_reg_tech_lead_dept_role on public.registration_technology_lead_colead using btree (technology_department, applying_as) TABLESPACE pg_default;

create table public.to_be_interviewed (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  email text not null,
  department text not null,
  team text null,
  role text null,
  status text not null default 'pending'::text,
  constraint to_be_interviewed_pkey primary key (id),
  constraint to_be_interviewed_status_check check (
    (
      status = any (
        array['pending'::text, 'passed'::text, 'failed'::text]
      )
    )
  )
) TABLESPACE pg_default;
