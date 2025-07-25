"use client";

import {
  BarChart3,
  FileText,
  PieChart,
  Users,
  LayoutDashboard,
  Layers,
  ShieldUser,
  Logs,
  ClipboardListIcon,
  Monitor,
  FileDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { usePermission } from "@/hooks/use-permissions";
import { useRef } from "react";
import { TeamSwitcher } from "../team-switcher";
import { useAuth } from "@/providers/auth-provider";
import useTeamStore from "@/store/team-store";
import { CubeIcon } from "@radix-ui/react-icons";
import { PremiumUpgradeCard } from "../premium-upgrade-card";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { membership, currentTeam } = useTeamStore();
  const { isAuthenticated, isAdmin } = useAuth();
  const menuList = getMenuList(pathname);
  const isActive = (href: string) => pathname.endsWith(href);
  const navigate = (href: string) => {
    if (pathname === href || !isAuthenticated) return;
    router.push(href);
  };
  const permission = usePermission(membership?.roles[0] || null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full overflow-y-auto flex flex-col gap-y-8">
      <ScrollArea
        ref={sidebarRef}
        className="[&>div>div[style]]:!block relative"
      >
        <div className="space-y-1">
          <TeamSwitcher />
          <h3 className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dashboard
          </h3>
          <NavItem
            icon={LayoutDashboard}
            label="Overview"
            active={isActive("dashboard")}
            onClick={() => navigate("/dashboard")}
          />
          {isAuthenticated && (
            <>
              {isAdmin && (
                <NavItem
                  icon={ShieldUser}
                  label="Admin"
                  active={isActive("admin")}
                  onClick={() => navigate("/admin")}
                />
              )}
              <NavItem
                isNew
                icon={BarChart3}
                label="Analytics"
                hasAccess={currentTeam?.planId !== "free"}
                active={isActive("analytics")}
                onClick={() => navigate("/dashboard/analytics")}
              />

              {/* <Separator className="my-3" /> */}

              {/* <h3 className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lab Management</h3> */}
              <NavItem
                icon={FileText}
                label="Cases"
                active={isActive("cases")}
                onClick={() => navigate("/dashboard/cases")}
              />
              {permission.checkPermission("export", "has") && (
                <NavItem
                  icon={FileDown}
                  label="Case Invoices"
                  hasAccess={currentTeam?.planId !== "free"}
                  active={isActive("case-invoices")}
                  onClick={() => navigate("/dashboard/case-invoices")}
                />
              )}
              {permission.checkPermission("doctors", "read") && (
                <NavItem
                  icon={Users}
                  label="Doctors"
                  active={isActive("doctors")}
                  onClick={() => navigate("/dashboard/doctors")}
                />
              )}
              {permission.checkPermission("materials", "create") && (
                <NavItem
                  icon={CubeIcon}
                  label="Materials"
                  active={isActive("materials")}
                  onClick={() => navigate("/dashboard/materials")}
                />
              )}

              {/* <Separator className="my-3" /> */}

              <h3 className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Utilities
              </h3>
              <NavItem
                icon={Layers}
                label="Templates"
                active={isActive("templates")}
                onClick={() => navigate("/dashboard/templates")}
              />
              {isAdmin && (
                <>
                  <NavItem
                    icon={ClipboardListIcon}
                    label="Logs"
                    active={isActive("logs")}
                    onClick={() => navigate("/dashboard/logs")}
                  />
                  <NavItem
                    icon={Monitor}
                    label="Monitor"
                    active={isActive("monitor")}
                    onClick={() => navigate("/monitor")}
                  />
                </>
              )}

              {permission.canViewDue() && (
                <>
                  <NavItem icon={PieChart} label="Reports" disabled />
                  <NavItem disabled icon={BarChart3} label="Financial" />
                </>
              )}

              {/* <Separator className="my-3" /> */}
              {/* <h3 className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">other</h3>

        <NavItem
          icon={Settings}
          label="Settings"
        /> */}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  comingSoon = false,
  isNew = false,
  badge,
  badgeVariant = "default",
  variant = "default",
  onClick,
  hasAccess = true,
}: {
  icon: any;
  label: string;
  active?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  isNew?: boolean;
  badge?: string;
  badgeVariant?: "default" | "warning" | "destructive";
  variant?: "default" | "danger";
  onClick?: () => void;
  hasAccess?: boolean;
}) {
  return (
    <button
      onClick={disabled || comingSoon || !hasAccess ? undefined : onClick}
      disabled={disabled || comingSoon || !hasAccess}
      aria-disabled={disabled || comingSoon || !hasAccess}
      title={comingSoon ? "Coming Soon" : undefined}
      className={cn(
        "group group/menu-button h-9 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        disabled || comingSoon || !hasAccess
          ? "cursor-not-allowed opacity-50 text-muted-foreground"
          : active
            ? "bg-gradient-to-r from-primary/20 to-primary/5"
            : variant === "danger"
              ? "text-red-400 hover:bg-gray-800"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "size-5",
            disabled || comingSoon || !hasAccess
              ? "text-muted-foreground/75"
              : active
                ? "text-white"
                : variant === "danger"
                  ? "text-red-400"
                  : "text-muted-foreground/75 group-hover:text-gray-300"
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
      ) :
      !hasAccess ? (
        <Badge
          variant="default"
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-700 text-gray-300"
        >
          Upgrade
        </Badge>
      ) :
      isNew ? (
        <Badge
          variant="default"
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded-sm"
        >
          New
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
