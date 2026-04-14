import { createClient } from "@/lib/supabase/server";
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";

export default async function AuditLogsPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*, user:profiles!audit_logs_user_id_fkey(username, email)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">操作日志</h1>
        <p className="text-muted-foreground text-sm mt-1">查看系统操作记录</p>
      </div>
      {error ? (
        <p className="text-destructive text-sm">加载失败：{error.message}</p>
      ) : (
        <AuditLogTable logs={logs ?? []} />
      )}
    </div>
  );
}
