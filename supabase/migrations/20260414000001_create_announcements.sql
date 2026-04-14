-- ============================================================
-- 公告表
-- ============================================================
create table if not exists public.announcements (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  content     text        not null,
  type        text        not null default 'info'
                          check (type in ('info', 'warning', 'success', 'error')),
  is_active   boolean     not null default true,
  author_id   uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 自动维护 updated_at
create trigger on_announcements_updated
  before update on public.announcements
  for each row execute procedure public.handle_updated_at();

-- 索引
create index idx_announcements_is_active on public.announcements(is_active);
create index idx_announcements_created_at on public.announcements(created_at desc);

-- RLS 策略
alter table public.announcements enable row level security;

-- 所有人可以查看激活的公告
create policy "Anyone can view active announcements"
  on public.announcements for select
  using (is_active = true);

-- 管理员可以操作所有公告
create policy "Admins can do anything on announcements"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
