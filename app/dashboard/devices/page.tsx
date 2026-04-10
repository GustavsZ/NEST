"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Tv, Plus, Trash2, QrCode } from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

interface Plant { id: string; name: string; }

const statusStyles: Record<string, string> = {
  pending: "bg-[rgba(232,168,56,0.12)] text-nest-warning border-none rounded-full text-[10px]",
  connected: "bg-[rgba(61,186,126,0.12)] text-nest-success border-none rounded-full text-[10px]",
  offline: "bg-[rgba(224,82,82,0.12)] text-nest-danger border-none rounded-full text-[10px]",
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("camera");
  const [plantId, setPlantId] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: devs }, { data: plts }] = await Promise.all([
      supabase.from("devices").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("plants").select("id, name").eq("user_id", user.id).order("created_at"),
    ]);
    setDevices(devs ?? []);
    setPlants(plts ?? []);
    if (plts && plts.length > 0 && !plantId) setPlantId(plts[0].id);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!plantId) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("devices").insert({ plant_id: plantId, user_id: user.id, name, type });
    setName("");
    setOpen(false);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("devices").delete().eq("id", id).eq("user_id", user.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium text-nest-primary">Devices</h1>
          <p className="text-sm text-nest-secondary mt-1">
            Cameras capture guest photos and videos. Media controllers drive preview screens.
          </p>
        </div>
        {plants.length === 0 && !loading && (
          <p className="text-xs text-nest-warning bg-[rgba(232,168,56,0.08)] border border-[rgba(232,168,56,0.2)] rounded-[8px] px-3 py-2">
            Add a plant first.
          </p>
        )}
        {plants.length > 0 && (
          <>
            <Button onClick={() => setOpen(true)} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
              <Plus className="w-4 h-4 mr-1.5" /> Add device
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-nest-surface border-[rgba(255,255,255,0.08)] rounded-[14px] max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-nest-primary text-base font-medium">Add a device</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Device name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Entry Camera 1"
                    required
                    className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Type</label>
                  <Select value={type} onValueChange={(v) => setType(v ?? "camera")}>
                    <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                      <SelectItem value="camera" className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">Camera (capture)</SelectItem>
                      <SelectItem value="media_controller" className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">Media controller (preview screen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {plants.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Plant</label>
                    <Select value={plantId} onValueChange={(v) => setPlantId(v ?? "")}>
                      <SelectTrigger className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary rounded-[10px] h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                        {plants.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary text-sm">{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* QR placeholder */}
                <div className="rounded-[10px] bg-nest-surface-2 border border-[rgba(255,255,255,0.08)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-4 h-4 text-nest-muted" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Device pairing</span>
                  </div>
                  <p className="text-xs text-nest-secondary">
                    Install the Nest app on your Android device and scan the QR code to link it to this plant.
                  </p>
                  <div className="mt-3 h-24 rounded-[8px] bg-nest-bg border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <p className="text-xs text-nest-muted">QR pairing — coming soon</p>
                  </div>
                  {/* TODO: technical team — integrate real QR pairing token here */}
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-10 text-sm font-medium"
                >
                  {saving ? "Saving..." : "Save device"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          </>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-nest-muted">Loading...</p>
      ) : devices.length === 0 ? (
        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-nest-surface-2 flex items-center justify-center mb-4">
              <Camera className="w-5 h-5 text-nest-muted" />
            </div>
            <p className="text-sm font-medium text-nest-primary mb-1">No devices registered</p>
            <p className="text-xs text-nest-muted mb-4">Add your first camera or media controller.</p>
            {plants.length > 0 && (
              <Button onClick={() => setOpen(true)} className="bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-9 text-sm font-medium">
                <Plus className="w-4 h-4 mr-1.5" /> Add your first device
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-[14px] bg-nest-surface border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                {["Name", "Type", "Status", "Added", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-widest text-nest-muted font-medium h-9 px-5 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b border-[rgba(255,255,255,0.08)] last:border-0 hover:bg-nest-surface-2/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {device.type === "camera" ? (
                        <Camera className="w-3.5 h-3.5 text-nest-muted" />
                      ) : (
                        <Tv className="w-3.5 h-3.5 text-nest-muted" />
                      )}
                      <span className="text-sm text-nest-primary">{device.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-nest-secondary">
                    {device.type === "camera" ? "Camera" : "Media controller"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={statusStyles[device.status] ?? statusStyles.pending}>
                      {device.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-nest-muted">
                    {new Date(device.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(device.id)}
                      className="text-nest-muted hover:text-nest-danger transition-colors duration-150 p-1.5 rounded-[6px] hover:bg-[rgba(224,82,82,0.08)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
