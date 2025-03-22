"use client";

import { BarChart3, FileText, HelpCircle, PieChart, Settings, Users, LayoutDashboard, Layers } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { usePermission } from "@/hooks/use-permissions";
import { useTeam } from "@/providers/team-provider";
import { useEffect, useRef, useState } from "react";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole } = useTeam();
  const menuList = getMenuList(pathname);
  const isActive = (href: string) => pathname.endsWith(href)
  const navigate = (href: string) => {
    if (pathname === href) return;
    router.push(href);
  };
  const permission = usePermission(userRole);

  const sidebarRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollArea ref={sidebarRef} className="[&>div>div[style]]:!block overflow-y-auto">
      <div className="space-y-1 px-3">
        <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Dashboard</h3>
        <NavItem
          icon={LayoutDashboard}
          label="Overview"
          active={isActive('dashboard')}
          onClick={() => navigate('/dashboard')}
        />
        <NavItem comingSoon icon={BarChart3} label="Analytics" />

        <Separator className="my-3 bg-gray-800" />

        <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Lab Management</h3>
        <NavItem
          icon={FileText}
          label="Cases"
          active={isActive('cases')}
          onClick={() => navigate('/dashboard/cases')}
        />
        <NavItem
          icon={Users}
          label="Doctors"
        // active={activeTab === "doctors"}
        // onClick={() => setActiveTab("doctors")}
        />

        <Separator className="my-3 bg-gray-800" />

        <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Utilities</h3>
        <NavItem
          icon={Layers}
          label="Templates"
          active={isActive('templates')}
          onClick={() => navigate('/dashboard/templates')}
        />

        {permission.canViewDue() && <><Separator className="my-3 bg-gray-800" />

          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Reports</h3>
          <NavItem
            icon={PieChart}
            label="Reports"
            disabled
          />
          <NavItem disabled icon={BarChart3} label="Financial" /></>}

        <Separator className="my-3 bg-gray-800" />

        <NavItem
          icon={Settings}
          label="Settings"
        // active={activeTab === "settings"}
        // onClick={() => setActiveTab("settings")}
        />
      </div>
    </ScrollArea>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  comingSoon = false,
  badge,
  badgeVariant = "default",
  variant = "default",
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  badge?: string;
  badgeVariant?: "default" | "warning" | "destructive";
  variant?: "default" | "danger";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={disabled || comingSoon ? undefined : onClick}
      disabled={disabled || comingSoon}
      aria-disabled={disabled || comingSoon}
      title={comingSoon ? "Coming Soon" : undefined}
      className={cn(
        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        disabled || comingSoon
          ? "cursor-not-allowed opacity-50 text-muted-foreground"
          : active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : variant === "danger"
              ? "text-red-400 hover:bg-gray-800"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4 w-4",
            disabled || comingSoon
              ? "text-gray-600"
              : active
                ? "text-white"
                : variant === "danger"
                  ? "text-red-400"
                  : "text-gray-500 group-hover:text-gray-300"
          )}
        />
        <span>{label}</span>
      </div>
      {comingSoon ? (
        <Badge
          variant="default"
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-700 text-gray-300"
        >
          Coming Soon
        </Badge>
      ) : (
        badge &&
        (disabled ? (
          <Badge
            variant={badgeVariant}
            className={cn(
              "ml-auto text-[10px]",
              badgeVariant === "default" && "bg-blue-600 text-white",
              badgeVariant === "warning" && "bg-amber-500 text-white",
              badgeVariant === "destructive" && "bg-red-500 text-white"
            )}
          >
            {badge}
          </Badge>
        ) : (
          <Badge
            variant={badgeVariant}
            className={cn(
              "ml-auto text-[10px]",
              badgeVariant === "default" && "bg-blue-600 text-white",
              badgeVariant === "warning" && "bg-amber-500 text-white",
              badgeVariant === "destructive" && "bg-red-500 text-white"
            )}
          >
            {badge}
          </Badge>
        ))
      )}
    </button>
  );
}
