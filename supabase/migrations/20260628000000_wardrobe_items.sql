-- Wardrobe items: per-user clothing inventory with photos stored in Supabase Storage.
-- Photos live in the private 'wardrobe-photos' bucket; storage_path references the object key.

create table if not exists public.wardrobe_items (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null default '',
  category     text        not null,
  color        text        not null default '',
  tags         text[]      not null default '{}',
  notes        text        not null default '',
  storage_path text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint wardrobe_items_category_check
    check (category in ('tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'bags', 'other'))
);

-- Index on user_id for RLS lookup performance
create index if not exists wardrobe_items_user_id_idx
  on public.wardrobe_items (user_id);

-- updated_at trigger
create or replace function public.handle_wardrobe_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_wardrobe_items_updated_at
  before update on public.wardrobe_items
  for each row execute function public.handle_wardrobe_items_updated_at();

alter table public.wardrobe_items enable row level security;

create policy "select own wardrobe items"
  on public.wardrobe_items
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "insert own wardrobe items"
  on public.wardrobe_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "update own wardrobe items"
  on public.wardrobe_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own wardrobe items"
  on public.wardrobe_items
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Create the private bucket for wardrobe photos.
-- Files are stored at {user_id}/{item_id}.{ext} so RLS can scope by folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wardrobe-photos',
  'wardrobe-photos',
  false,
  10485760,  -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do nothing;

create policy "users can upload own wardrobe photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can view own wardrobe photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can delete own wardrobe photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
