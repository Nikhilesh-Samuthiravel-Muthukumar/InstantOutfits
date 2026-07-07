-- Multiple taste profiles per user

create table if not exists public.taste_profiles (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null default 'My Style',
  answers     jsonb       not null default '{}',
  created_at  timestamptz not null default now()
);

alter table public.taste_profiles enable row level security;

create index if not exists taste_profiles_user_id_idx on public.taste_profiles(user_id);

create policy "taste_profiles_select_own"
  on public.taste_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "taste_profiles_insert_own"
  on public.taste_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "taste_profiles_update_own"
  on public.taste_profiles for update
  to authenticated
  using (auth.uid() = user_id);

create policy "taste_profiles_delete_own"
  on public.taste_profiles for delete
  to authenticated
  using (auth.uid() = user_id);
