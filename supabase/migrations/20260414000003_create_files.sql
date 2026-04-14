-- ============================================================
-- 文件管理表
-- ============================================================
create table if not exists public.files (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  size        bigint      not null,
  mime_type   text        not null,
  storage_path text       not null,
  uploader_id uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- 索引
create index idx_files_uploader_id on public.files(uploader_id);
create index idx_files_created_at on public.files(created_at desc);

-- RLS 策略
alter table public.files enable row level security;

-- 用户可以查看自己上传的文件
create policy "Users can view own files"
  on public.files for select
  using (auth.uid() = uploader_id);

-- 用户可以上传文件
create policy "Users can insert own files"
  on public.files for insert
  with check (auth.uid() = uploader_id);

-- 用户可以删除自己的文件
create policy "Users can delete own files"
  on public.files for delete
  using (auth.uid() = uploader_id);

-- 管理员可以操作所有文件
create policy "Admins can do anything on files"
  on public.files for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
