-- Run this whole file once in your Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- SITE CONTENT (a single row holding all editable text/bio content)
-- ---------------------------------------------------------------------
create table if not exists site_content (
  id int primary key default 1,
  hero_name text not null default 'DAKIR',
  hero_role text not null default 'AI Automation Engineer & Data Scientist',
  hero_tagline text not null default 'I design end-to-end automated pipelines that turn ideas, data, and media into finished content — built on n8n, LLMs, and AI video generation.',
  hero_photo_url text,
  about_text text not null default 'I''m an AI automation engineer based in Morocco, focused on building content and data pipelines with n8n, LLMs, and AI video generation tools like Kling AI and WAN 2.2.
I came to this work through a background in water treatment science, then taught myself Python, data science, and machine learning, earning an IBM Data Science Professional Certificate along the way.
I also work as a primary school teacher, and I''m currently building out a freelance AI automation practice, taking on projects around workflow automation, content pipelines, and applied data science.',
  about_photo_url text,
  skills jsonb not null default '[
    {"category": "Automation & n8n", "items": ["n8n Workflow Orchestration", "LLM Integration", "Facebook Graph API", "TikTok & YouTube API Automation"]},
    {"category": "AI Video & Content", "items": ["Kling AI", "WAN 2.2", "Runway", "Pika", "Hailuo", "ElevenLabs TTS"]},
    {"category": "Data Science & ML", "items": ["Python", "IBM Data Science Professional Certificate", "scikit-learn", "Data Pipelines"]}
  ]'::jsonb,
  resume_url text,
  contact_email text,
  contact_socials jsonb not null default '{"github": "https://github.com/GitSamad88"}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

insert into site_content (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  video_url text,
  tags jsonb not null default '[]',
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into projects (title, description, tags, sort_order)
select * from (values
  (
    'Automated Children''s Story Video Pipeline',
    'An end-to-end n8n pipeline that generates a story script, converts it to speech, renders AI video scenes with consistent characters, assembles the final cut, and auto-publishes to TikTok and YouTube Shorts.',
    '["n8n", "LLM Integration", "ElevenLabs TTS", "AI Video Generation", "Social Publishing"]'::jsonb,
    0
  ),
  (
    'Kling AI Image-to-Video Automation',
    'A production-ready pipeline integrating Kling AI''s JWT-authenticated API with a two-stage Gemini prompt architecture, generating coordinated image and video prompts for consistent AI-driven scenes.',
    '["Kling AI", "Gemini 2.5", "n8n", "Python", "API Integration"]'::jsonb,
    1
  )
) as seed(title, description, tags, sort_order)
where not exists (select 1 from projects);

-- ---------------------------------------------------------------------
-- THEME SETTINGS (a single row)
-- ---------------------------------------------------------------------
create table if not exists theme_settings (
  id int primary key default 1,
  color_bg text not null default '#12141f',
  color_surface text not null default '#1b1e2e',
  color_primary text not null default '#e8a33d',
  color_secondary text not null default '#4fb0a5',
  color_text text not null default '#edeef3',
  color_muted text not null default '#8b90a6',
  font_display text not null default 'space-grotesk',
  font_body text not null default 'inter',
  updated_at timestamptz not null default now(),
  constraint theme_settings_singleton check (id = 1)
);

insert into theme_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public visitors (using the anon key) can only READ.
-- Writes only happen server-side via the service role key (used by
-- the admin API routes after password login), which bypasses RLS.
-- ---------------------------------------------------------------------
alter table site_content enable row level security;
alter table projects enable row level security;
alter table theme_settings enable row level security;

create policy "Public can read site_content" on site_content
  for select using (true);

create policy "Public can read projects" on projects
  for select using (true);

create policy "Public can read theme_settings" on theme_settings
  for select using (true);

-- ---------------------------------------------------------------------
-- STORAGE BUCKET for images/videos uploaded from the admin panel
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');
