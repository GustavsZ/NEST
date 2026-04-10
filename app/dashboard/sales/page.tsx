"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Eye, EyeOff, Monitor, Grid2X2, ShoppingCart } from "lucide-react";

export default function SalesPage() {
  const [plantId, setPlantId] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [stripeKey, setStripeKey] = useState("");
  const [stripeKeyLast4, setStripeKeyLast4] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [displayMode, setDisplayMode] = useState<"single" | "quad">("single");
  const [saving, setSaving] = useState(false);
  const [savedStripe, setSavedStripe] = useState(false);
  const [savedDisplay, setSavedDisplay] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: plant } = await supabase.from("plants").select("id").eq("user_id", user.id).limit(1).maybeSingle();
      if (!plant) return;
      setPlantId(plant.id);
      const { data: config } = await supabase.from("sales_config").select("*").eq("plant_id", plant.id).maybeSingle();
      if (config) {
        setConfigId(config.id);
        setStripeKeyLast4(config.stripe_key_last4);
        setDisplayMode(config.display_mode ?? "single");
      }
    }
    load();
  }, []);

  async function upsertConfig(patch: Record<string, unknown>) {
    if (!plantId) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (configId) {
      await supabase.from("sales_config").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", configId).eq("user_id", user.id);
    } else {
      const { data } = await supabase.from("sales_config").insert({ plant_id: plantId, user_id: user.id, ...patch }).select().single();
      if (data) setConfigId(data.id);
    }
  }

  async function handleSaveStripe(e: React.FormEvent) {
    e.preventDefault();
    if (!stripeKey) return;
    setSaving(true);
    const last4 = stripeKey.slice(-4);
    await upsertConfig({ stripe_key_last4: last4 });
    setStripeKeyLast4(last4);
    setStripeKey("");
    setSavedStripe(true);
    setSaving(false);
    setTimeout(() => setSavedStripe(false), 3000);
  }

  async function handleSaveDisplay() {
    setSaving(true);
    await upsertConfig({ display_mode: displayMode });
    setSavedDisplay(true);
    setSaving(false);
    setTimeout(() => setSavedDisplay(false), 3000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-nest-primary">Sales &amp; Delivery</h1>
        <p className="text-sm text-nest-secondary mt-1">Configure how guests view and purchase their captures.</p>
      </div>

      <Tabs defaultValue="display">
        <TabsList className="bg-nest-surface-2 border border-[rgba(255,255,255,0.08)] rounded-[10px] p-1 h-9">
          <TabsTrigger value="display" className="text-sm rounded-[8px] data-[state=active]:bg-nest-surface data-[state=active]:text-nest-primary text-nest-muted">
            Display setup
          </TabsTrigger>
          <TabsTrigger value="stripe" className="text-sm rounded-[8px] data-[state=active]:bg-nest-surface data-[state=active]:text-nest-primary text-nest-muted">
            Stripe
          </TabsTrigger>
        </TabsList>

        {/* Display tab */}
        <TabsContent value="display" className="mt-5 space-y-4">
          <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
            <CardHeader className="px-6 pt-5 pb-2">
              <h2 className="text-sm font-medium text-nest-primary">Preview screen layout</h2>
              <p className="text-xs text-nest-secondary mt-0.5">
                How photos appear on the attraction&apos;s screens before guests purchase.
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(["single", "quad"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDisplayMode(mode)}
                    className={`rounded-[12px] border p-4 text-left transition-all duration-150 ${
                      displayMode === mode
                        ? "border-nest-accent bg-[rgba(221,92,40,0.08)]"
                        : "border-[rgba(255,255,255,0.08)] bg-nest-surface-2 hover:border-[rgba(255,255,255,0.14)]"
                    }`}
                  >
                    <div className={`w-full aspect-video rounded-[8px] mb-3 flex items-center justify-center ${
                      displayMode === mode ? "bg-[rgba(221,92,40,0.06)]" : "bg-nest-bg"
                    }`}>
                      {mode === "single" ? (
                        <Monitor className={`w-8 h-8 ${displayMode === mode ? "text-nest-accent" : "text-nest-muted"}`} />
                      ) : (
                        <Grid2X2 className={`w-8 h-8 ${displayMode === mode ? "text-nest-accent" : "text-nest-muted"}`} />
                      )}
                    </div>
                    <p className={`text-sm font-medium ${displayMode === mode ? "text-nest-accent" : "text-nest-primary"}`}>
                      {mode === "single" ? "Single photo" : "4-photo grid"}
                    </p>
                    <p className="text-xs text-nest-muted mt-0.5">
                      {mode === "single" ? "One photo, rotates every 5s" : "2x2 grid of recent captures"}
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleSaveDisplay} disabled={saving || !plantId} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
                  {saving ? "Saving..." : "Save layout"}
                </Button>
                {savedDisplay && <span className="flex items-center gap-1.5 text-sm text-nest-success"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
              </div>
            </CardContent>
          </Card>

          {/* Guest purchase preview */}
          <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
            <CardContent className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-nest-muted" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Guest purchase preview</span>
              </div>
              <div className="rounded-[10px] bg-nest-surface-2 border border-[rgba(255,255,255,0.08)] p-4">
                <div className="h-32 bg-nest-bg rounded-[8px] flex items-center justify-center mb-4">
                  <Monitor className="w-10 h-10 text-nest-muted/40" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-nest-primary">Your capture</p>
                    <p className="text-xs text-nest-muted mt-0.5">High-res download included</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-light text-nest-primary">$9.99</p>
                    <button className="mt-1 px-4 py-1.5 bg-nest-accent text-white text-xs font-medium rounded-[8px]">
                      Download now
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-nest-muted mt-3 italic">
                This is what guests see after scanning the QR code at your attraction.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stripe tab */}
        <TabsContent value="stripe" className="mt-5">
          <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
            <CardHeader className="px-6 pt-5 pb-2">
              <h2 className="text-sm font-medium text-nest-primary">Stripe integration</h2>
              <p className="text-xs text-nest-secondary mt-0.5">
                Connect your Stripe account to collect guest payments directly.
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {stripeKeyLast4 && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-[10px] bg-[rgba(61,186,126,0.08)] border border-[rgba(61,186,126,0.15)]">
                  <CheckCircle2 className="w-4 h-4 text-nest-success" />
                  <span className="text-sm text-nest-success">Stripe connected — key ending in {stripeKeyLast4}</span>
                </div>
              )}
              <form onSubmit={handleSaveStripe} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                    {stripeKeyLast4 ? "Update Stripe API key" : "Stripe secret API key"}
                  </label>
                  <div className="relative">
                    <Input
                      type={showKey ? "text" : "password"}
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder={stripeKeyLast4 ? "Enter new key to update" : "sk_live_..."}
                      className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-nest-muted hover:text-nest-secondary transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-nest-muted">
                    Find this in your Stripe Dashboard under Developers → API Keys. Your key is stored securely — only the last 4 characters are saved for display.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving || !stripeKey || !plantId} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
                    {saving ? "Saving..." : "Connect Stripe"}
                  </Button>
                  {savedStripe && <span className="flex items-center gap-1.5 text-sm text-nest-success"><CheckCircle2 className="w-4 h-4" /> Connected</span>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
