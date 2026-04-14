"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { AuditLog } from "@/types/supabase";
import { formatDateTime } from "@full-stack-demo/utils";

interface AuditLogWithUser extends AuditLog {
  user: { username: string | null; email: string } | null;
}

interface AuditLogTableProps {
  logs: AuditLogWithUser[];
}

const PAGE_SIZE = 20;

const actionVariants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  create: "success",
  update: "default",
  delete: "destructive",
  login: "secondary",
  logout: "secondary",
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        l.resource.toLowerCase().includes(q) ||
        (l.user?.email ?? "").toLowerCase().includes(q) ||
        (l.user?.username ?? "").toLowerCase().includes(q)
    );
  }, [logs, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleSearch(v: string) { setSearch(v); setPage(1); }

  return (
    <>
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="搜索操作、资源或用户..."
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>操作</TableHead>
              <TableHead>资源</TableHead>
              <TableHead>操作人</TableHead>
              <TableHead>IP 地址</TableHead>
              <TableHead>时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState title="暂无日志" description="没有符合条件的操作记录" />
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={actionVariants[log.action] ?? "secondary"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{log.resource}</span>
                    {log.resource_id && (
                      <span className="text-muted-foreground text-xs ml-1">#{log.resource_id.slice(0, 8)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.user?.username ?? log.user?.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ip_address ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(log.created_at)}
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
    </>
  );
}
