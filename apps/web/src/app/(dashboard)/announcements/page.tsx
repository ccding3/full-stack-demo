import { createClient } from "@/lib/supabase/server";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*, author:profiles!announcements_author_id_fkey(username, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">公告管理</h1>
        <p className="text-muted-foreground text-sm mt-1">发布和管理系统公告</p>
      </div>
      {error ? (
        <p className="text-destructive text-sm">加载失败：{error.message}</p>
      ) : (
        <AnnouncementList announcements={announcements ?? []} />
      )}
    </div>
  );
}
