import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    current: true,
    features: { captures: "500 / mo", devices: "1", branding: false },
  },
  {
    name: "Pro",
    price: "$49 / mo",
    current: false,
    features: { captures: "5,000 / mo", devices: "5", branding: true },
  },
  {
    name: "Enterprise",
    price: "Custom",
    current: false,
    features: { captures: "Unlimited", devices: "Unlimited", branding: true },
  },
];

export default function UsagePage() {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-nest-primary">Usage &amp; Billing</h1>
        <p className="text-sm text-nest-secondary mt-1">Track your system usage and manage your plan.</p>
      </div>

      {/* Usage */}
      <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
        <CardHeader className="px-6 pt-5 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-nest-primary">Usage</h2>
            <span className="text-xs text-nest-muted">{currentMonth}</span>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Captures this month", value: "0" },
              { label: "Storage used", value: "0 MB" },
            ].map((stat) => (
              <div key={stat.label} className="bg-nest-surface-2 rounded-[10px] p-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-1.5">{stat.label}</p>
                <p className="text-[26px] font-light tracking-tight text-nest-primary leading-none">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-nest-secondary">Captures</span>
              <span className="text-xs text-nest-muted">0 / 500</span>
            </div>
            <Progress value={0} className="h-1.5 bg-nest-surface-2 [&>div]:bg-nest-accent" />
            <p className="text-xs text-nest-muted">Starter Plan limit</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
        <CardHeader className="px-6 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-nest-primary">Current plan</h2>
            <Badge className="bg-[rgba(221,92,40,0.12)] text-nest-accent border-none rounded-full text-[10px] font-medium px-2.5">
              Starter — Free
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-[rgba(255,255,255,0.08)]">
              <div className="p-3 col-span-1" />
              {PLANS.map((plan) => (
                <div key={plan.name} className={`p-3 text-center ${plan.current ? "bg-[rgba(221,92,40,0.06)]" : ""}`}>
                  <p className="text-xs font-medium text-nest-primary">{plan.name}</p>
                  <p className="text-[11px] text-nest-muted mt-0.5">{plan.price}</p>
                  {plan.current && (
                    <Badge className="mt-1 bg-[rgba(221,92,40,0.12)] text-nest-accent border-none rounded-full text-[9px] px-1.5">Current</Badge>
                  )}
                </div>
              ))}
            </div>
            {/* Feature rows */}
            {[
              { label: "Captures / mo", key: "captures" as const },
              { label: "Devices", key: "devices" as const },
              { label: "Custom branding", key: "branding" as const },
            ].map((feat) => (
              <div key={feat.label} className="grid grid-cols-4 border-b border-[rgba(255,255,255,0.08)] last:border-0">
                <div className="p-3 text-xs text-nest-secondary">{feat.label}</div>
                {PLANS.map((plan) => (
                  <div key={plan.name} className={`p-3 text-center ${plan.current ? "bg-[rgba(221,92,40,0.04)]" : ""}`}>
                    {typeof plan.features[feat.key] === "boolean" ? (
                      plan.features[feat.key] ? (
                        <Check className="w-3.5 h-3.5 text-nest-success mx-auto" />
                      ) : (
                        <span className="text-nest-muted text-xs">—</span>
                      )
                    ) : (
                      <span className="text-xs text-nest-secondary">{plan.features[feat.key] as string}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            {/* TODO: connect to Captomatic's Stripe subscription checkout link */}
            <Button
              className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium"
              onClick={() => {}}
            >
              Upgrade to Pro
            </Button>
            <p className="text-xs text-nest-muted">Billing managed securely via Stripe.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
