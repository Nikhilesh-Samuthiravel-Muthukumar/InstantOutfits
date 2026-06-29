-- User profiles: stores username and email for lookup.
-- Email is denormalized from auth.users to allow public username→email resolution for login.

create table if not exists public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  username   text        not null unique,
  email      text        not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create index if not exists profiles_username_idx on public.profiles (username);

-- Anyone can look up a username to resolve its email (needed for username-based login)
create policy "public username lookup"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- Only the owning user can update their own profile
create policy "update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.raw_user_meta_data->>'username' is not null then
    insert into public.profiles (id, username, email)
    values (
      new.id,
      new.raw_user_meta_data->>'username',
      new.email
    );
  end if;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
