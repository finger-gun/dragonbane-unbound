create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  roles text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create or replace function public.touch_user_roles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_roles_updated_at on public.user_roles;
create trigger user_roles_updated_at
before update on public.user_roles
for each row execute procedure public.touch_user_roles_updated_at();
