-- ============================================================
-- 允许所有已登录用户创建公告
-- ============================================================

-- 允许已登录用户插入公告（必须是自己作为作者）
create policy "Authenticated users can insert announcements"
  on public.announcements for insert
  with check (auth.uid() is not null and auth.uid() = author_id);

-- 允许已登录用户查看所有启用的公告
create policy "Authenticated users can view active announcements"
  on public.announcements for select
  using (auth.uid() is not null and is_active = true);

-- 允许作者编辑自己的公告
create policy "Authors can update their own announcements"
  on public.announcements for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- 允许作者删除自己的公告
create policy "Authors can delete their own announcements"
  on public.announcements for delete
  using (auth.uid() = author_id);
