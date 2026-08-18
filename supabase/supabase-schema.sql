-- ============================================================
-- GYMORA V3 — Supabase schema + Row Level Security
-- Run this ONCE in Supabase Dashboard > SQL Editor.
-- Browser code must use only the Project URL + Publishable Key.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default 'GYMORA Athlete',
  language text not null default 'ar' check (language in ('ar','en')),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak integer not null default 0 check (streak >= 0),
  completed_workouts integer not null default 0 check (completed_workouts >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_states (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_not_self check (requester_id <> addressee_id),
  constraint friendships_unique_direction unique (requester_id, addressee_id)
);

create table if not exists public.online_challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  opponent_id uuid not null references public.profiles(id) on delete cascade,
  challenge_type text not null check (challenge_type in ('sessions','xp','streak')),
  target integer not null check (target > 0),
  creator_baseline jsonb not null default '{}'::jsonb,
  opponent_baseline jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled')),
  winner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  updated_at timestamptz not null default now(),
  constraint online_challenge_not_self check (creator_id <> opponent_id)
);

create index if not exists profiles_xp_idx on public.profiles (xp desc);
create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
create index if not exists online_challenges_creator_idx on public.online_challenges (creator_id);
create index if not exists online_challenges_opponent_idx on public.online_challenges (opponent_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists friendships_set_updated_at on public.friendships;
create trigger friendships_set_updated_at before update on public.friendships
for each row execute procedure public.set_updated_at();

drop trigger if exists online_challenges_set_updated_at on public.online_challenges;
create trigger online_challenges_set_updated_at before update on public.online_challenges
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
begin
  base_username := lower(regexp_replace(split_part(coalesce(new.email, 'athlete'), '@', 1), '[^a-zA-Z0-9_]+', '', 'g'));
  if base_username = '' then base_username := 'athlete'; end if;

  insert into public.profiles (id, username, display_name, language)
  values (
    new.id,
    base_username || '_' || substr(replace(new.id::text, '-', ''), 1, 6),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'GYMORA Athlete'), '@', 1), 'GYMORA Athlete'),
    'ar'
  )
  on conflict (id) do nothing;

  insert into public.user_states (user_id, state)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_states enable row level security;
alter table public.friendships enable row level security;
alter table public.online_challenges enable row level security;

drop policy if exists profiles_read_authenticated on public.profiles;
create policy profiles_read_authenticated
on public.profiles for select
to authenticated
using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists user_states_select_own on public.user_states;
create policy user_states_select_own
on public.user_states for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_states_insert_own on public.user_states;
create policy user_states_insert_own
on public.user_states for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_states_update_own on public.user_states;
create policy user_states_update_own
on public.user_states for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists user_states_delete_own on public.user_states;
create policy user_states_delete_own
on public.user_states for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists friendships_read_participants on public.friendships;
create policy friendships_read_participants
on public.friendships for select
to authenticated
using ((select auth.uid()) in (requester_id, addressee_id));

drop policy if exists friendships_create_request on public.friendships;
create policy friendships_create_request
on public.friendships for insert
to authenticated
with check ((select auth.uid()) = requester_id and requester_id <> addressee_id);

drop policy if exists friendships_update_participants on public.friendships;
create policy friendships_update_participants
on public.friendships for update
to authenticated
using ((select auth.uid()) in (requester_id, addressee_id))
with check ((select auth.uid()) in (requester_id, addressee_id));

drop policy if exists friendships_delete_participants on public.friendships;
create policy friendships_delete_participants
on public.friendships for delete
to authenticated
using ((select auth.uid()) in (requester_id, addressee_id));

drop policy if exists online_challenges_read_participants on public.online_challenges;
create policy online_challenges_read_participants
on public.online_challenges for select
to authenticated
using ((select auth.uid()) in (creator_id, opponent_id));

drop policy if exists online_challenges_create_creator on public.online_challenges;
create policy online_challenges_create_creator
on public.online_challenges for insert
to authenticated
with check ((select auth.uid()) = creator_id and creator_id <> opponent_id);

drop policy if exists online_challenges_update_participants on public.online_challenges;
create policy online_challenges_update_participants
on public.online_challenges for update
to authenticated
using ((select auth.uid()) in (creator_id, opponent_id))
with check ((select auth.uid()) in (creator_id, opponent_id));

drop policy if exists online_challenges_delete_participants on public.online_challenges;
create policy online_challenges_delete_participants
on public.online_challenges for delete
to authenticated
using ((select auth.uid()) in (creator_id, opponent_id));

revoke all on table public.profiles, public.user_states, public.friendships, public.online_challenges from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_states to authenticated;
grant select, insert, update, delete on public.friendships to authenticated;
grant select, insert, update, delete on public.online_challenges to authenticated;
