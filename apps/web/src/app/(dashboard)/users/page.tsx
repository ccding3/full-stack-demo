import { createClient } from "@/lib/supabase/server";
import { UserTable } from "@/components/users/UserTable";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-muted-foreground text-sm mt-1">管理系统中的所有用户</p>
      </div>
      {error ? (
        <p className="text-destructive text-sm">加载失败：{error.message}</p>
      ) : (
        <UserTable users={users ?? []} />
      )}
    </div>
  );
}
