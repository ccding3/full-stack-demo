-- ============================================================
-- 操作日志表
-- ============================================================
create table if not exists public.audit_logs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references public.profiles(id) on delete set null,
  action      text        not null,
  resource    text        not null,
  resource_id text,
  details     jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- 索引
create index idx_audit_logs_user_id on public.audit_logs(user_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_audit_logs_resource on public.audit_logs(resource);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- RLS 策略
alter table public.audit_logs enable row level security;

-- 管理员可以查看所有日志
create policy "Admins can view all audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 用户可以查看自己的日志
create policy "Users can view own audit logs"
  on public.audit_logs for select
  using (auth.uid() = user_id);
