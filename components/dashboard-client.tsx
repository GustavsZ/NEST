"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Camera, ShoppingBag, Search, Filter, Wifi, WifiOff, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Device {
  id: string;
  name: string;
  status: string;
  type: string;
}

interface Props {
  devices: Device[];
}

// Last 6 months labels
function getLast6Months() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ month: months[d.getMonth()], revenue: 0 });
  }
  return result;
}

const chartData = getLast6Months();

// Placeholder media rows
const PLACEHOLDER_MEDIA = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: "—",
  date: "—",
  status: "pending" as const,
  type: "photo",
}));

const statusStyles: Record<string, string> = {
  pending: "bg-[rgba(232,168,56,0.12)] text-nest-warning border-none rounded-full text-[10px]",
  delivered: "bg-[rgba(61,186,126,0.12)] text-nest-success border-none rounded-full text-[10px]",
  purchased: "bg-[rgba(61,186,126,0.12)] text-nest-success border-none rounded-full text-[10px]",
};

function getSystemStatus(devices: Device[]) {
  if (devices.length === 0) return { color: "#555560", label: "No devices added", pulse: false };
  if (devices.every((d) => d.status === "connected")) return { color: "#3dba7e", label: "All systems operational", pulse: true };
  if (devices.some((d) => d.status === "offline")) return { color: "#e05252", label: "Device offline", pulse: false };
  return { color: "#e8a838", label: "Device pending connection", pulse: false };
}

const deviceStatusIcon = (status: string) => {
  if (status === "connected") return <Wifi className="w-3 h-3 text-nest-success" />;
  if (status === "offline") return <WifiOff className="w-3 h-3 text-nest-danger" />;
  return <Clock className="w-3 h-3 text-nest-warning" />;
};

export function DashboardClient({ devices }: Props) {
  const [mediaTab, setMediaTab] = useState<"captured" | "purchased">("captured");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const systemStatus = getSystemStatus(devices);

  const filteredMedia = PLACEHOLDER_MEDIA.filter((m) => {
    const matchSearch = m.name === "—" || m.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Revenue chart */}
      <div
        className="rounded-[16px] p-6"
        style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-1">Revenue</p>
            <p className="text-[28px] font-light tracking-tight text-nest-primary leading-none">$0.00</p>
          </div>
          <span className="text-xs text-nest-muted">Last 6 months</span>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -32, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dd5c28" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#dd5c28" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#555560", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555560", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e1e21", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#f0f0f0" }}
                cursor={{ stroke: "rgba(221,92,40,0.2)", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#dd5c28" strokeWidth={1.5} fill="url(#revenueGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System status monitor */}
      <div
        className="rounded-[16px] p-6"
        style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
      >
        <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-4">System Status</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: systemStatus.color }}
            />
            {systemStatus.pulse && (
              <div
                className="absolute w-3 h-3 rounded-full animate-ping opacity-40"
                style={{ background: systemStatus.color }}
              />
            )}
          </div>
          <span className="text-sm text-nest-primary">{systemStatus.label}</span>
        </div>

        {devices.length === 0 ? (
          <p className="text-xs text-nest-muted">No devices registered. Add a device to start monitoring.</p>
        ) : (
          <div className="space-y-2">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between px-3 py-2 rounded-[8px]"
                style={{ boxShadow: "var(--shadow-neuro-in)", background: "#111113" }}
              >
                <div className="flex items-center gap-2">
                  {deviceStatusIcon(device.status)}
                  <span className="text-xs text-nest-secondary">{device.name}</span>
                  <span className="text-[10px] text-nest-muted">({device.type === "camera" ? "Camera" : "Media controller"})</span>
                </div>
                <Badge
                  className={
                    device.status === "connected"
                      ? "bg-[rgba(61,186,126,0.12)] text-nest-success border-none rounded-full text-[10px]"
                      : device.status === "offline"
                      ? "bg-[rgba(224,82,82,0.12)] text-nest-danger border-none rounded-full text-[10px]"
                      : "bg-[rgba(232,168,56,0.12)] text-nest-warning border-none rounded-full text-[10px]"
                  }
                >
                  {device.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media table */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
      >
        {/* Tab header */}
        <div className="flex items-center gap-0 border-b border-[rgba(255,255,255,0.06)] px-4 pt-4">
          {(["captured", "purchased"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMediaTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors duration-150 -mb-px ${
                mediaTab === tab
                  ? "border-nest-accent text-nest-primary"
                  : "border-transparent text-nest-muted hover:text-nest-secondary"
              }`}
            >
              {tab === "captured" ? <Camera className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nest-muted pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8 text-xs bg-[#111113] border-none text-nest-primary placeholder:text-nest-muted focus-visible:ring-0 rounded-[8px]"
              style={{ boxShadow: "var(--shadow-neuro-in)" }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-nest-muted" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="h-8 text-xs bg-[#111113] border-none text-nest-secondary rounded-[8px] w-[110px] focus:ring-0" style={{ boxShadow: "var(--shadow-neuro-in)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-nest-surface border-[rgba(255,255,255,0.08)]">
                <SelectItem value="all" className="text-xs text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary">All statuses</SelectItem>
                <SelectItem value="pending" className="text-xs text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary">Pending</SelectItem>
                <SelectItem value="delivered" className="text-xs text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary">Delivered</SelectItem>
                <SelectItem value="purchased" className="text-xs text-nest-secondary focus:bg-nest-surface-2 focus:text-nest-primary">Purchased</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.04)]">
              {["", "Name", "Date", "Status", ""].map((h, i) => (
                <th key={i} className="text-left text-[10px] uppercase tracking-widest text-nest-muted font-medium h-8 px-4 first:pl-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMedia.map((item) => (
              <tr key={item.id} className="border-b border-[rgba(255,255,255,0.03)] last:border-0 hover:bg-[rgba(255,255,255,0.015)] transition-colors">
                <td className="px-4 py-3 w-10">
                  <div
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center"
                    style={{ boxShadow: "var(--shadow-neuro-in)", background: "#111113" }}
                  >
                    <Camera className="w-3.5 h-3.5 text-nest-muted/40" />
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-nest-muted">—</td>
                <td className="px-4 py-3 text-xs text-nest-muted">—</td>
                <td className="px-4 py-3">
                  <Badge className={statusStyles[item.status] ?? statusStyles.pending}>{item.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[10px] text-nest-muted/40">No data</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMedia.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-nest-muted">No media found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
