-- Past outfits: AI-generated outfit recommendations saved by the user.
-- item_ids references wardrobe_items.id values selected by the model.

create table if not exists public.past_outfits (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  item_ids     uuid[]      not null default '{}',
  rationale    text        not null default '',
  occasion     text        not null default '',
  fit_score    integer     not null check (fit_score between 1 and 10),
  styling_tips text        not null default '',
  color_story  text        not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists past_outfits_user_id_idx
  on public.past_outfits (user_id);

alter table public.past_outfits enable row level security;

create policy "select own past outfits"
  on public.past_outfits
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "insert own past outfits"
  on public.past_outfits
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "delete own past outfits"
  on public.past_outfits
  for delete
  to authenticated
  using (auth.uid() = user_id);
