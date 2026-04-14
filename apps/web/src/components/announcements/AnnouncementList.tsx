"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AnnouncementDialog } from "./AnnouncementDialog";
import { DeleteDialog } from "@/components/users/DeleteDialog";
import type { Announcement } from "@/types/supabase";
import { formatDateTime } from "@full-stack-demo/utils";

interface AnnouncementWithAuthor extends Announcement {
  author: { username: string | null; email: string } | null;
}

interface AnnouncementListProps {
  announcements: AnnouncementWithAuthor[];
}

const typeLabels = {
  info: { label: "通知", variant: "default" as const },
  warning: { label: "警告", variant: "secondary" as const },
  success: { label: "成功", variant: "success" as const },
  error: { label: "错误", variant: "destructive" as const },
};

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function handleEdit(item: Announcement) {
    setEditTarget(item);
    setDialogOpen(true);
  }

  async function handleToggleActive(item: Announcement) {
    const supabase = createClient();
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    if (error) {
      toast.error("操作失败：" + error.message);
    } else {
      toast.success(item.is_active ? "已禁用" : "已启用");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("删除失败：" + error.message);
    } else {
      toast.success("公告已删除");
      router.refresh();
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          新建公告
        </Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          title="暂无公告"
          description="还没有发布任何公告"
          action={
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-1" />
              创建第一条公告
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant={typeLabels[item.type].variant}>
                        {typeLabels[item.type].label}
                      </Badge>
                      <Badge variant={item.is_active ? "success" : "secondary"}>
                        {item.is_active ? "已发布" : "已禁用"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      发布者：{item.author?.username ?? item.author?.email ?? "未知"} · {formatDateTime(item.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(item)}
                      title={item.is_active ? "禁用" : "启用"}
                    >
                      {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={editTarget}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        userName={deleteTarget?.title ?? ""}
      />
    </>
  );
}
