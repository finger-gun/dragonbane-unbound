create table if not exists public.encounters (
  id uuid primary key,
  user_id uuid not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists encounters_user_id_idx on public.encounters (user_id);
