import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserForm } from "@/components/users/UserForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: user } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (!user) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">编辑用户</h1>
        <p className="text-muted-foreground text-sm mt-1">修改用户信息</p>
      </div>
      <UserForm user={user} mode="edit" />
    </div>
  );
}
