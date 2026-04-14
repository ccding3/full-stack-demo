"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient, createRawClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Announcement } from "@/types/supabase";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
}

export function AnnouncementDialog({ open, onOpenChange, announcement }: AnnouncementDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success" | "error">("info");

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setType(announcement.type);
    } else {
      setTitle("");
      setContent("");
      setType("info");
    }
  }, [announcement, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("标题和内容不能为空");
      return;
    }

    setLoading(true);
    const supabase = createRawClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("未登录");
      setLoading(false);
      return;
    }

    const payload = { title, content, type };

    let error: { message: string } | null = null;
    if (announcement) {
      const result = await supabase.from("announcements").update(payload).eq("id", announcement.id);
      error = result.error;
    } else {
      const result = await supabase.from("announcements").insert({ ...payload, author_id: user.id });
      error = result.error;
    }

    if (error) {
      toast.error("操作失败：" + error.message);
    } else {
      toast.success(announcement ? "公告已更新" : "公告已创建");
      onOpenChange(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{announcement ? "编辑公告" : "新建公告"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                placeholder="输入公告标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">类型</Label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
                <option value="info">通知</option>
                <option value="warning">警告</option>
                <option value="success">成功</option>
                <option value="error">错误</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                placeholder="输入公告内容"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
