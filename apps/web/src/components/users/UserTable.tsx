"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createRawClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteDialog } from "./DeleteDialog";
import type { Profile } from "@/types/supabase";
import { formatDateTime } from "@full-stack-demo/utils";

const PAGE_SIZE = 10;

interface UserTableProps {
  users: Profile[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.username ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? u.is_active : !u.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // 筛选条件变化时重置到第一页
  function handleSearch(v: string) { setSearch(v); setPage(1); }
  function handleRole(v: string) { setRoleFilter(v as typeof roleFilter); setPage(1); }
  function handleStatus(v: string) { setStatusFilter(v as typeof statusFilter); setPage(1); }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createRawClient();
    const { error } = await supabase.from("profiles").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("删除失败：" + error.message);
    } else {
      toast.success("用户已删除");
      router.refresh();
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="搜索用户名或邮箱..."
          className="flex-1"
        />
        <div className="flex gap-2">
          <Select value={roleFilter} onChange={(e) => handleRole(e.target.value)} className="w-32">
            <option value="all">全部角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => handleStatus(e.target.value)} className="w-32">
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">禁用</option>
          </Select>
          <Button asChild size="sm">
            <Link href="/users/new">
              <Plus className="h-4 w-4 mr-1" />
              新建
            </Link>
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="暂无用户"
                    description={search || roleFilter !== "all" || statusFilter !== "all" ? "没有符合筛选条件的用户" : "还没有任何用户数据"}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username ?? "—"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "管理员" : "普通用户"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "success" : "destructive"}>
                      {user.is_active ? "正常" : "禁用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/users/${user.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        userName={deleteTarget?.username ?? deleteTarget?.email ?? ""}
      />
    </>
  );
}
