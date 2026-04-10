"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function WorkspacePage() {
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setName(data.name);
        setLegalName(data.legal_name ?? "");
        setWorkspaceId(data.id);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = { user_id: user.id, name, legal_name: legalName || null };

    const { error } = workspaceId
      ? await supabase.from("workspaces").update(payload).eq("id", workspaceId).eq("user_id", user.id)
      : await supabase.from("workspaces").insert(payload).select().single();

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-nest-primary">Workspace</h1>
        <p className="text-sm text-nest-secondary mt-1">
          Your company account. This name appears on guest-facing screens and receipts.
        </p>
      </div>

      <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
        <CardHeader className="px-6 pt-5 pb-2">
          <h2 className="text-sm font-medium text-nest-primary">Company details</h2>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                Venue or park name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Busch Gardens Tampa Bay"
                required
                className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
              />
              <p className="text-xs text-nest-muted">Used on guest receipts and purchase pages.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                Legal entity name
                <span className="normal-case ml-1 text-nest-muted/60">(optional)</span>
              </label>
              <Input
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. BGT Attractions LLC"
                className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
              />
            </div>

            {error && <p className="text-nest-danger text-sm">{error}</p>}

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium"
              >
                {loading ? "Saving..." : "Save workspace"}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-nest-success">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
