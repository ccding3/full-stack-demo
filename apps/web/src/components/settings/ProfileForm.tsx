"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient, createRawClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Profile } from "@/types/supabase";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [username, setUsername] = useState(profile.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createRawClient();
    const { error } = await supabase
      .from("profiles")
      .update({ username: username || null, avatar_url: avatarUrl || null })
      .eq("id", profile.id);
    if (error) {
      toast.error("保存失败：" + error.message);
    } else {
      toast.success("个人资料已更新");
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>更新你的用户名和头像</CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>邮箱</Label>
            <Input value={profile.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              placeholder="输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">头像 URL</Label>
            <Input
              id="avatarUrl"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="头像预览"
                className="h-16 w-16 rounded-full object-cover border mt-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : "保存资料"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
