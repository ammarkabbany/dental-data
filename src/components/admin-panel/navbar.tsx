import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky border-b top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-4">
          {/* <ModeToggle /> */}
          {/* <div>
            <HugeiconsIcon className="size-5" icon={Notification03Icon} />
          </div> */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
