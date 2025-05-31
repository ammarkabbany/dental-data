"use client";
import { Menu } from "@/components/admin-panel/menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "../logo";
import { UserNav } from "./user-nav";
import { Separator } from "../ui/separator";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 w-68 h-full -translate-x-full border border-sidebar-border bg-sidebar lg:translate-x-0 transition-[width] ease-in-out duration-300",
        // !getOpenState() ? "w-[90px]" : "w-64",
        settings.disabled && "hidden"
      )}
    >
      {/* <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} /> */}
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-3 gap-y-4"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 justify-start",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="ghost"
          asChild
        >
          <Link href={"/"} className="flex items-center select-none mt-2">
            <Logo src="/old-fav.ico" className="size-18" w={72} h={72} />
            <span className="text-2xl font-bold tracking-wide -translate-x-2">DentaAuto</span>
          </Link>
        </Button>
        <Separator />
        <Menu isOpen={getOpenState()} />
        <div>
          <Separator className="my-2" />
          <UserNav side="top" />
        </div>
      </div>
      {/* <div className="h-10 w-full" />
      <div className="absolute left-0 bottom-0 px-2 z-10 w-full h-10">
        
      </div> */}
    </aside>
  );
}
