import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-nest-bg overflow-hidden">
      <Sidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
