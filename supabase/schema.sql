-- Nest Platform — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New query

-- Workspaces (company account)
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  legal_name text,
  created_at timestamptz default now()
);
alter table workspaces enable row level security;
create policy "Users manage own workspaces" on workspaces
  for all using (auth.uid() = user_id);

-- Plants (park / attraction / location)
create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  timezone text default 'UTC',
  created_at timestamptz default now()
);
alter table plants enable row level security;
create policy "Users manage own plants" on plants
  for all using (auth.uid() = user_id);

-- Devices (cameras or media controllers)
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text default 'camera',
  status text default 'pending',
  content_type text default 'photo',
  video_length_seconds int default 10,
  created_at timestamptz default now()
);
alter table devices enable row level security;
create policy "Users manage own devices" on devices
  for all using (auth.uid() = user_id);

-- Content templates (per plant)
create table if not exists content_templates (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  logo_url text,
  frame_style text default 'none',
  crop_mode text default 'fit',
  trim_enabled boolean default false,
  updated_at timestamptz default now()
);
alter table content_templates enable row level security;
create policy "Users manage own templates" on content_templates
  for all using (auth.uid() = user_id);

-- Sales & delivery config (per plant)
create table if not exists sales_config (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_key_last4 text,
  display_mode text default 'single',
  updated_at timestamptz default now()
);
alter table sales_config enable row level security;
create policy "Users manage own sales config" on sales_config
  for all using (auth.uid() = user_id);
