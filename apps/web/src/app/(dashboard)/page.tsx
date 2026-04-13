import { Users, UserCheck, Activity, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/charts/StatCard";
import { UserTrendChart } from "@/components/charts/UserTrendChart";
import { OnlineUsersChart } from "@/components/charts/OnlineUsersChart";
import type { DashboardStats, RegistrationTrend } from "@/types/supabase";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 获取统计数据（视图返回单行）
  const { data: statsRows } = await supabase
    .from("dashboard_stats")
    .select("*")
    .returns<DashboardStats[]>();
  const stats = statsRows?.[0] ?? null;

  // 获取注册趋势
  const { data: trend } = await supabase
    .from("registration_trend")
    .select("*")
    .returns<RegistrationTrend[]>();

  // 获取角色分布
  const { count: adminCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "user");

  const roleData = [
    { role: "管理员", count: adminCount ?? 0 },
    { role: "普通用户", count: userCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground text-sm mt-1">系统概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总用户数"
          value={Number(stats?.total_users ?? 0)}
          description="所有注册用户"
          icon={Users}
        />
        <StatCard
          title="活跃用户"
          value={Number(stats?.active_users ?? 0)}
          description="状态正常的用户"
          icon={UserCheck}
        />
        <StatCard
          title="当前在线"
          value={Number(stats?.online_users ?? 0)}
          description="15 分钟内活跃"
          icon={Activity}
        />
        <StatCard
          title="本月新增"
          value={Number(stats?.new_users_30d ?? 0)}
          description="近 30 天注册"
          icon={TrendingUp}
        />
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserTrendChart data={trend ?? []} />
        <OnlineUsersChart data={roleData} />
      </div>
    </div>
  );
}
