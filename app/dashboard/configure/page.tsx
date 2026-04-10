"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Camera } from "lucide-react";

interface Device { id: string; name: string; content_type: string; video_length_seconds: number; }

const VIDEO_LENGTHS = [5, 10, 15, 30];

export default function ConfigurePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [contentType, setContentType] = useState<"photo" | "video">("photo");
  const [videoLength, setVideoLength] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: devs } = await supabase
        .from("devices")
        .select("id, name, content_type, video_length_seconds")
        .eq("user_id", user.id)
        .eq("type", "camera");
      setDevices(devs ?? []);
      if (devs && devs.length > 0) {
        const first = devs[0];
        setDeviceId(first.id);
        setContentType((first.content_type as "photo" | "video") ?? "photo");
        setVideoLength(first.video_length_seconds ?? 10);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleDeviceChange(id: string) {
    setDeviceId(id);
    const dev = devices.find((d) => d.id === id);
    if (dev) {
      setContentType((dev.content_type as "photo" | "video") ?? "photo");
      setVideoLength(dev.video_length_seconds ?? 10);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!deviceId) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("devices")
      .update({ content_type: contentType, video_length_seconds: videoLength })
      .eq("id", deviceId)
      .eq("user_id", user.id);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <p className="text-sm text-nest-muted">Loading...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-nest-primary">Configure</h1>
        <p className="text-sm text-nest-secondary mt-1">Set up how your cameras capture guest moments.</p>
      </div>

      {devices.length === 0 ? (
        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Camera className="w-8 h-8 text-nest-muted mb-3" />
            <p className="text-sm text-nest-primary font-medium mb-1">No cameras found</p>
            <p className="text-xs text-nest-muted">Add a camera device before configuring.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardHeader className="px-6 pt-5 pb-2">
            <h2 className="text-sm font-medium text-nest-primary">Camera settings</h2>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSave} className="space-y-5">
              {devices.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Camera</label>
                  <Select value={deviceId} onValueChange={(val) => handleDeviceChange(val ?? "")}>
                    <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                      {devices.map((d) => (
                        <SelectItem key={d.id} value={d.id} className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">What are you capturing?</label>
                <p className="text-xs text-nest-muted">You can change this later.</p>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {(["photo", "video"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContentType(type)}
                      className={`p-4 rounded-[10px] border text-left transition-all duration-150 ${
                        contentType === type
                          ? "border-nest-accent bg-[rgba(221,92,40,0.08)]"
                          : "border-[rgba(255,255,255,0.08)] bg-nest-surface-2 hover:border-[rgba(255,255,255,0.14)]"
                      }`}
                    >
                      <p className={`text-sm font-medium ${contentType === type ? "text-nest-accent" : "text-nest-primary"}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </p>
                      <p className="text-xs text-nest-muted mt-0.5">
                        {type === "photo" ? "Single captured image" : "Short video clip"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {contentType === "video" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Clip length</label>
                  <div className="grid grid-cols-4 gap-2">
                    {VIDEO_LENGTHS.map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setVideoLength(len)}
                        className={`py-2 rounded-[8px] text-sm border transition-all duration-150 ${
                          videoLength === len
                            ? "border-nest-accent bg-[rgba(221,92,40,0.08)] text-nest-accent"
                            : "border-[rgba(255,255,255,0.08)] bg-nest-surface-2 text-nest-secondary hover:border-[rgba(255,255,255,0.14)]"
                        }`}
                      >
                        {len}s
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <Button type="submit" disabled={saving} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
                  {saving ? "Saving..." : "Save settings"}
                </Button>
                {saved && <span className="flex items-center gap-1.5 text-sm text-nest-success"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
        <CardContent className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-nest-surface-2 flex items-center justify-center shrink-0 mt-0.5">
              <Camera className="w-4 h-4 text-nest-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-nest-primary">Test shot</p>
              <p className="text-xs text-nest-secondary mt-1">
                Once your device is physically connected and running the Nest app, trigger a test capture here to verify everything is working.
              </p>
              <p className="text-[10px] text-nest-muted mt-2 italic">
                {/* TODO: technical team — connect to real device capture polling */}
                Live test capture coming soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
