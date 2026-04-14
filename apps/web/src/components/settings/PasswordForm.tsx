"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.error("两次密码不一致");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("密码至少 6 位");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("修改失败：" + error.message);
    } else {
      toast.success("密码已修改");
      setNewPassword("");
      setConfirm("");
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>修改密码</CardTitle>
        <CardDescription>更新你的登录密码</CardDescription>
      </CardHeader>
      <form onSubmit={handleChangePassword}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="至少 6 位"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">确认新密码</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="再次输入新密码"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : "保存密码"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
