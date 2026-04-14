import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { PasswordForm } from "@/components/settings/PasswordForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .single();

  if (!profile) {
    return <p className="text-destructive">无法加载用户信息</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-muted-foreground text-sm mt-1">账号与系统设置</p>
      </div>

      <div className="space-y-6">
        <ProfileForm profile={profile} />
        <PasswordForm />
      </div>
    </div>
  );
}
