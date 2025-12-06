-- Enable Row Level Security (RLS) is recommended, but for simplicity in this prototype 
-- we will start with public access or basic authenticated access.
-- Ideally, you should enable RLS and use Supabase Auth.

-- 1. Profiles Table (replaces userStore)
create table profiles (
  id uuid references auth.users not null primary key,
  name text,
  gender text,
  dob date,
  weight_kg numeric,
  height_cm numeric,
  feed_target_ml numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Feeds Table (replaces feedStore)
create table feeds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('milk', 'solid')),
  subtype text, -- 'formula', 'breast_milk', or food name
  amount_ml numeric,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

alter table feeds enable row level security;
create policy "Users can view own feeds" on feeds for select using (auth.uid() = user_id);
create policy "Users can insert own feeds" on feeds for insert with check (auth.uid() = user_id);
create policy "Users can update own feeds" on feeds for update using (auth.uid() = user_id);
create policy "Users can delete own feeds" on feeds for delete using (auth.uid() = user_id);

-- 3. Poop Logs Table (replaces poopStore)
create table poop_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('poop', 'pee', 'both')),
  consistency text,
  color text,
  image_url text, -- optional, if we upload images to Storage later
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

alter table poop_logs enable row level security;
create policy "Users can view own logs" on poop_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on poop_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs" on poop_logs for update using (auth.uid() = user_id);

-- 4. Stats History Table (replaces statsStore)
create table stats_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  weight_kg numeric,
  height_cm numeric,
  recorded_at timestamptz default now()
);

alter table stats_history enable row level security;
create policy "Users can view own stats" on stats_history for select using (auth.uid() = user_id);
create policy "Users can insert own stats" on stats_history for insert with check (auth.uid() = user_id);

-- 5. Analysis History Table (replaces analysisStore)
create table analysis_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  image_base64 text, -- Storing base64 directly is OK for small scale, but Storage Bucket is better long term
  result_json jsonb,
  timestamp timestamptz default now()
);

alter table analysis_history enable row level security;
create policy "Users can view own analysis" on analysis_history for select using (auth.uid() = user_id);
create policy "Users can insert own analysis" on analysis_history for insert with check (auth.uid() = user_id);
