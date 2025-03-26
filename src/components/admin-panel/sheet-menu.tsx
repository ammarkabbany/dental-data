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
import Logo from "../logo";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="ghost" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col overflow-y-auto border border-sidebar-border bg-sidebar" side="left">
        <SheetHeader>
          <Button
            className="flex justify-start items-center pb-2 pt-1"
            variant="ghost"
            asChild
          >
            <SheetTitle asChild>
            <Link href={"/"} className="flex items-center select-none">
              <Logo src="/old-fav.ico" className="size-16 mt-1" />
              <span className="text-xl font-bold">Dental Data</span>
            </Link>
            </SheetTitle>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
