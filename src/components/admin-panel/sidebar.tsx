"use client";
import { Menu } from "@/components/admin-panel/menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "../logo";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 w-64 h-screen -translate-x-full border border-sidebar-border bg-sidebar lg:translate-x-0 transition-[width] ease-in-out duration-300",
        // !getOpenState() ? "w-[90px]" : "w-64",
        settings.disabled && "hidden"
      )}
    >
      {/* <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} /> */}
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-3 gap-y-8"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 justify-start",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="ghost"
          asChild
        >
          {/* <Link href="/dashboard" className="flex items-center justify-start">
            {/* <Image
              src={"/old-fav.ico"}
              width={86}
              height={86}
              alt="logo"
              // layout="static"
              className="size-[86px] object-cover"
            />
            <h1
              className={cn(
                "font-bold text-2xl whitespace-nowrap dark:text-[#e3bad1] transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              DentaFlow
            </h1>
          </Link> */}
          <Link href={"/"} className="flex items-center select-none">
            <Logo src="/old-fav.ico" className="size-16 mt-1" />
            <span className="text-xl font-bold">Dental Data</span>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
      {/* <div className="h-10 w-full" />
      <div className="absolute left-0 bottom-0 px-2 z-10 w-full h-10">
        
      </div> */}
    </aside>
  );
}