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

create or replace function public.handle_new_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, roles)
  values (new.id, '{}')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_roles();
