import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { TeamSwitcher } from "../team-switcher";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="ghost" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col overflow-y-auto border-r border-[#1f1f3a] bg-dental-bg-card" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <SheetTitle asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                {/* <Image
                  src={"/ward-logo.png"}
                  width={56}
                  height={56}
                  alt="logo"
                  // layout="static"
                  className="size-[56px] object-cover"
                /> */}
                <h1
                  className={
                    "font-bold text-2xl whitespace-nowrap dark:text-[#e3bad1] transition-[transform,opacity,display] ease-in-out duration-300"
                  }
                >
                  DentaFlow
                </h1>
              </Link>
            </SheetTitle>
          </Button>
        </SheetHeader>
        <Menu isOpen />
        <div className="h-14 w-full" />
        <div className="absolute left-0 bottom-2 px-2 z-10 w-full h-10">
          {/* <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Team</h3> */}
          <TeamSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
