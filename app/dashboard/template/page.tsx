"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Upload, ImageIcon } from "lucide-react";

export default function TemplatePage() {
  const [plantId, setPlantId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState("none");
  const [cropMode, setCropMode] = useState("fit");
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: plant } = await supabase.from("plants").select("id").eq("user_id", user.id).limit(1).maybeSingle();
      if (!plant) return;
      setPlantId(plant.id);
      const { data: tmpl } = await supabase.from("content_templates").select("*").eq("plant_id", plant.id).maybeSingle();
      if (tmpl) {
        setTemplateId(tmpl.id);
        setLogoPreview(tmpl.logo_url);
        setFrameStyle(tmpl.frame_style);
        setCropMode(tmpl.crop_mode);
        setTrimEnabled(tmpl.trim_enabled);
      }
    }
    load();
  }, []);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!plantId) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = { plant_id: plantId, user_id: user.id, logo_url: logoPreview, frame_style: frameStyle, crop_mode: cropMode, trim_enabled: trimEnabled, updated_at: new Date().toISOString() };
    if (templateId) {
      await supabase.from("content_templates").update(payload).eq("id", templateId);
    } else {
      const { data } = await supabase.from("content_templates").insert(payload).select().single();
      if (data) setTemplateId(data.id);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const frameStyles: Record<string, string> = {
    none: "No frame",
    classic: "Classic",
    modern: "Modern",
    minimal: "Minimal",
  };

  const cropModes: Record<string, string> = {
    fit: "Fit — full image visible",
    fill: "Fill — no black bars",
    square: "Square — 1:1 crop",
  };

  return (
    <div className="grid grid-cols-[1fr_280px] gap-6 items-start">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium text-nest-primary">Content Template</h1>
          <p className="text-sm text-nest-secondary mt-1">Control how captured photos and videos look when delivered to guests.</p>
        </div>

        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardHeader className="px-6 pt-5 pb-2">
            <h2 className="text-sm font-medium text-nest-primary">Template settings</h2>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSave} className="space-y-5">
              {/* Logo */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Your logo</label>
                <p className="text-xs text-nest-muted">Appears on guest receipts and the purchase page.</p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 h-24 rounded-[10px] border border-dashed border-[rgba(255,255,255,0.14)] bg-nest-surface-2 flex items-center justify-center gap-3 cursor-pointer hover:border-[rgba(255,255,255,0.25)] transition-colors"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="max-h-16 max-w-[160px] object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 text-nest-muted">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload logo</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </div>

              {/* Frame */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Frame style</label>
                <Select value={frameStyle} onValueChange={(v) => setFrameStyle(v ?? "none")}>
                  <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                    {Object.entries(frameStyles).map(([val, label]) => (
                      <SelectItem key={val} value={val} className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Crop mode</label>
                <Select value={cropMode} onValueChange={(v) => setCropMode(v ?? "fit")}>
                  <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                    {Object.entries(cropModes).map(([val, label]) => (
                      <SelectItem key={val} value={val} className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trim */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm text-nest-primary">Trim video</p>
                  <p className="text-xs text-nest-muted mt-0.5">Remove leading and trailing silence from clips.</p>
                </div>
                <Switch checked={trimEnabled} onCheckedChange={setTrimEnabled} className="data-[state=checked]:bg-nest-accent" />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button type="submit" disabled={saving || !plantId} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
                  {saving ? "Saving..." : "Save template"}
                </Button>
                {saved && <span className="flex items-center gap-1.5 text-sm text-nest-success"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live preview */}
      <div className="sticky top-8">
        <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-3">Preview</p>
        <div
          className="rounded-[20px] border border-[rgba(255,255,255,0.14)] bg-nest-surface overflow-hidden"
          style={{ aspectRatio: "9/16", maxHeight: "480px" }}
        >
          {/* Phone frame mock */}
          <div
            className={`w-full h-full flex flex-col items-center justify-center relative ${
              frameStyle === "classic" ? "border-4 border-nest-muted/30" :
              frameStyle === "modern" ? "border-2 border-nest-accent/40" :
              frameStyle === "minimal" ? "border border-[rgba(255,255,255,0.06)]" : ""
            }`}
            style={{
              objectFit: cropMode === "fill" ? "cover" : cropMode === "square" ? undefined : "contain",
            }}
          >
            {/* Mock photo */}
            <div className={`bg-nest-surface-2 flex items-center justify-center ${cropMode === "square" ? "aspect-square w-full" : "w-full h-full"}`}>
              <ImageIcon className="w-12 h-12 text-nest-muted/30" />
            </div>
            {/* Logo overlay */}
            {logoPreview && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <img src={logoPreview} alt="Logo" className="max-h-10 max-w-[120px] object-contain opacity-90" />
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] text-nest-muted text-center mt-2">Guest view preview</p>
      </div>
    </div>
  );
}
