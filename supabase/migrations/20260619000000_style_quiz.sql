-- Style quiz responses: one style profile per user.
-- Flexible JSONB answers column lets us add/change questions without further migrations.

create table if not exists public.style_quiz_responses (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null unique references auth.users(id) on delete cascade,
  answers       jsonb       not null default '{}',
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.style_quiz_responses enable row level security;

-- Index on user_id for RLS lookup performance
create index if not exists style_quiz_responses_user_id_idx
  on public.style_quiz_responses (user_id);

create policy "select own quiz response"
  on public.style_quiz_responses
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "insert own quiz response"
  on public.style_quiz_responses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "update own quiz response"
  on public.style_quiz_responses
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
