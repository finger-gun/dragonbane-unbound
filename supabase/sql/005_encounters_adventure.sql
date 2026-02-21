alter table if exists public.encounters
  add column if not exists adventure_id uuid;

create index if not exists encounters_adventure_id_idx on public.encounters (adventure_id);
