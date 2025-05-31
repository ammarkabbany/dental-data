"use client";

import * as React from "react";
import {
  ArrowRightToLine,
  Calculator,
  Calendar,
  CreditCard,
  FilePlus,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Modals, useModalStore } from "@/store/modal-store";
import { getGroupRoutes, RouteGroup } from "@/lib/menu-list";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function DashboardCommand() {
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const {logOut} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navigate = (href: string) => {
    if (pathname === href) return;
    router.push(href);
    closeModal(Modals.DASHBOARD_COMMAND_MODAL);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isModalOpen(Modals.DASHBOARD_COMMAND_MODAL)) {
          closeModal(Modals.DASHBOARD_COMMAND_MODAL);
        } else {
          openModal(Modals.DASHBOARD_COMMAND_MODAL);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog
        open={isModalOpen(Modals.DASHBOARD_COMMAND_MODAL)}
        onOpenChange={(open) => {
          if (!open) {
            closeModal(Modals.DASHBOARD_COMMAND_MODAL);
          } else {
            openModal(Modals.DASHBOARD_COMMAND_MODAL);
          }
        }}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            
            <CommandItem
              onSelect={logOut}
            >
              <LogOutIcon className="mr-1" />
              Logout
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          {Object.values(RouteGroup).map((group) => (
            <CommandGroup className="capitalize" key={group} heading={group}>
              {getGroupRoutes(group).map((route) => (
                <CommandItem
                  key={route.href}
                  onSelect={() => {
                    navigate(route.href);
                  }}
                >
                  {route.icon && <route.icon className="mr-1" />}
                  <span>{route.displayName}</span>
                  {/* {route.shortcut && (
                    <CommandShortcut>{route.shortcut}</CommandShortcut>
                  )} */}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
