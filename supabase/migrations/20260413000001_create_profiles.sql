-- ============================================================
-- 1. profiles 表（扩展 auth.users，使用同一 id）
-- ============================================================
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  username    text,
  avatar_url  text,
  role        text        not null default 'user'
                          check (role in ('admin', 'user')),
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 自动维护 updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 2. 新用户注册后自动写入 profiles（trigger on auth.users）
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 3. user_sessions 表（记录在线状态，用于 Dashboard 图表）
-- ============================================================
create table if not exists public.user_sessions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  signed_in_at  timestamptz not null default now(),
  signed_out_at timestamptz,
  ip_address    inet,
  user_agent    text
);

-- ============================================================
-- 4. Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.user_sessions enable row level security;

-- profiles: 用户只能读写自己的记录
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- admin 可以操作所有 profiles
create policy "Admins can do anything on profiles"
  on public.profiles for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- user_sessions: 用户只能读自己的 session
create policy "Users can view own sessions"
  on public.user_sessions for select
  using (auth.uid() = user_id);

create policy "Admins can view all sessions"
  on public.user_sessions for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- 5. Dashboard 统计视图
-- ============================================================
create or replace view public.dashboard_stats as
select
  (select count(*) from public.profiles)                                   as total_users,
  (select count(*) from public.profiles where is_active = true)            as active_users,
  (select count(*) from public.user_sessions
   where signed_out_at is null
   and signed_in_at > now() - interval '15 minutes')                       as online_users,
  (select count(*) from public.profiles
   where created_at > now() - interval '30 days')                          as new_users_30d;

-- ============================================================
-- 6. 注册趋势视图（过去 30 天，按天聚合）
-- ============================================================
create or replace view public.registration_trend as
select
  date_trunc('day', created_at)::date as date,
  count(*)                            as count
from public.profiles
where created_at >= now() - interval '30 days'
group by 1
order by 1;
