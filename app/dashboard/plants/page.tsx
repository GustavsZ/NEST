"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Trash2 } from "lucide-react";

interface Plant {
  id: string;
  name: string;
  timezone: string;
  created_at: string;
}

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu",
  "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney",
];

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [saving, setSaving] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: ws } = await supabase.from("workspaces").select("id").eq("user_id", user.id).maybeSingle();
    setWorkspaceId(ws?.id ?? null);
    const { data } = await supabase.from("plants").select("*").eq("user_id", user.id).order("created_at");
    setPlants(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("plants").insert({ workspace_id: workspaceId, user_id: user.id, name, timezone });
    setName("");
    setTimezone("UTC");
    setOpen(false);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("plants").delete().eq("id", id).eq("user_id", user.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium text-nest-primary">Plants</h1>
          <p className="text-sm text-nest-secondary mt-1">
            Each plant is a specific park, attraction, or location where Captomatic is installed.
          </p>
        </div>
        {!workspaceId && (
          <p className="text-xs text-nest-warning bg-[rgba(232,168,56,0.08)] border border-[rgba(232,168,56,0.2)] rounded-[8px] px-3 py-2">
            Set up your workspace first.
          </p>
        )}
        {workspaceId && (
          <>
            <Button onClick={() => setOpen(true)} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
              <Plus className="w-4 h-4 mr-1.5" /> Add plant
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-nest-surface border-[rgba(255,255,255,0.08)] rounded-[14px] max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-nest-primary text-base font-medium">Add a plant</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                    Plant name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Main Roller Coaster"
                    required
                    className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
                  />
                  <p className="text-xs text-nest-muted">The specific attraction or location name.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                    Timezone
                  </label>
                  <Select value={timezone} onValueChange={(v) => setTimezone(v ?? "UTC")}>
                    <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz} className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-10 text-sm font-medium"
                >
                  {saving ? "Adding..." : "Add plant"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          </>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-nest-muted">Loading...</p>
      ) : plants.length === 0 ? (
        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-nest-surface-2 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-nest-muted" />
            </div>
            <p className="text-sm font-medium text-nest-primary mb-1">No plants yet</p>
            <p className="text-xs text-nest-muted mb-4">Add your first attraction or location to get started.</p>
            {workspaceId && (
              <Button
                onClick={() => setOpen(true)}
                className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add your first plant
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {plants.map((plant) => (
            <Card key={plant.id} className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[12px]">
              <CardContent className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-nest-surface-2 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-nest-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nest-primary">{plant.name}</p>
                    <p className="text-xs text-nest-muted mt-0.5">{plant.timezone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(plant.id)}
                  className="text-nest-muted hover:text-nest-danger transition-colors duration-150 p-1.5 rounded-[6px] hover:bg-[rgba(224,82,82,0.08)]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
