"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Camera,
  Settings,
  Layers,
  CreditCard,
  BarChart2,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/workspace", label: "Workspace", icon: Building2 },
  { href: "/dashboard/plants", label: "Plants", icon: MapPin },
  { href: "/dashboard/devices", label: "Devices", icon: Camera },
  { href: "/dashboard/configure", label: "Configure", icon: Settings },
  { href: "/dashboard/template", label: "Content Template", icon: Layers },
  { href: "/dashboard/sales", label: "Sales & Delivery", icon: CreditCard },
  { href: "/dashboard/usage", label: "Usage & Billing", icon: BarChart2 },
];

interface SidebarProps {
  userEmail: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col" style={{ background: "#111113", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-semibold tracking-tight text-nest-primary">nest</span>
          <div className="w-1.5 h-1.5 rounded-full bg-nest-accent mb-0.5" />
        </div>
        <p className="text-[10px] text-nest-muted mt-0.5 uppercase tracking-widest">
          Operator Platform
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm transition-all duration-150 ${
                active
                  ? "text-nest-primary"
                  : "text-nest-secondary hover:text-nest-primary"
              }`}
              style={active ? { boxShadow: "var(--shadow-neuro-in)", background: "#0e0e0f" } : {}}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? "text-nest-accent" : "text-nest-muted"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-[rgba(255,255,255,0.08)] pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150 text-left">
              <div className="w-7 h-7 rounded-full bg-nest-surface-2 border border-[rgba(255,255,255,0.14)] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-medium text-nest-secondary uppercase">
                  {userEmail.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-nest-primary truncate">{userEmail}</p>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[200px] bg-nest-surface border-[rgba(255,255,255,0.08)] rounded-[10px]"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-nest-secondary hover:text-nest-danger focus:text-nest-danger focus:bg-[rgba(224,82,82,0.08)] cursor-pointer text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
