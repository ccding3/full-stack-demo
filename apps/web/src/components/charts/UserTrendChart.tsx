"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendData {
  date: string | null;
  count: number | null;
}

interface UserTrendChartProps {
  data: TrendData[];
}

export function UserTrendChart({ data }: UserTrendChartProps) {
  const chartData = data.map((d) => ({
    date: d.date ? new Date(d.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }) : "",
    注册人数: d.count ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">近 30 天注册趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="注册人数"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
