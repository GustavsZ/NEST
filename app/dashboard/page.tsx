import { createClient } from "@/lib/supabase/server";
import { OnboardingChecklist, OnboardingStep } from "@/components/onboarding-checklist";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: workspace },
    { data: plants },
    { data: devicesData },
    { data: template },
    { data: salesConfig },
  ] = await Promise.all([
    supabase.from("workspaces").select("id").eq("user_id", user.id).maybeSingle(),
    supabase.from("plants").select("id").eq("user_id", user.id).limit(1),
    supabase.from("devices").select("id, name, status, type").eq("user_id", user.id),
    supabase.from("content_templates").select("id").eq("user_id", user.id).maybeSingle(),
    supabase.from("sales_config").select("id, stripe_key_last4").eq("user_id", user.id).maybeSingle(),
  ]);

  const devices = devicesData ?? [];

  const steps: OnboardingStep[] = [
    {
      id: "account",
      label: "Account created",
      description: "You're in.",
      href: "/dashboard",
      done: true,
    },
    {
      id: "workspace",
      label: "Create workspace",
      description: "Name your company account.",
      href: "/dashboard/workspace",
      done: !!workspace,
    },
    {
      id: "plant",
      label: "Add a plant",
      description: "Add the park, attraction, or location you're setting up.",
      href: "/dashboard/plants",
      done: !!(plants && plants.length > 0),
    },
    {
      id: "device",
      label: "Connect device",
      description: "Register a camera or media controller.",
      href: "/dashboard/devices",
      done: devices.length > 0,
    },
    {
      id: "template",
      label: "Set template",
      description: "Configure how your captures look.",
      href: "/dashboard/template",
      done: !!template,
    },
    {
      id: "sales",
      label: "Sales setup",
      description: "Connect Stripe and configure your preview displays.",
      href: "/dashboard/sales",
      done: !!(salesConfig?.stripe_key_last4),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-medium text-nest-primary">Dashboard</h1>
        <p className="text-sm text-nest-secondary mt-1">{user.email}</p>
      </div>

      {/* Onboarding checklist */}
      <OnboardingChecklist steps={steps} userEmail={user.email ?? ""} />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Captures", value: "0" },
          { label: "Guest Purchases", value: "0" },
          { label: "Revenue", value: "$0.00" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] p-5"
            style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-2">
              {stat.label}
            </p>
            <p className="text-[28px] font-light tracking-tight text-nest-primary leading-none">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + status monitor + media table (client) */}
      <DashboardClient devices={devices} />
    </div>
  );
}
