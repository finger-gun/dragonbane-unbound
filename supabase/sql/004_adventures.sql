create table if not exists public.adventures (
  id uuid primary key,
  created_by uuid not null,
  name text not null,
  join_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists adventures_created_by_idx on public.adventures (created_by);

create table if not exists public.adventure_members (
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  user_id uuid not null,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (adventure_id, user_id)
);

create index if not exists adventure_members_user_id_idx on public.adventure_members (user_id);
create index if not exists adventure_members_adventure_id_idx on public.adventure_members (adventure_id);

create table if not exists public.adventure_characters (
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  owner_user_id uuid not null,
  status text not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (adventure_id, character_id)
);

create index if not exists adventure_characters_owner_user_id_idx on public.adventure_characters (owner_user_id);
create index if not exists adventure_characters_adventure_id_idx on public.adventure_characters (adventure_id);
