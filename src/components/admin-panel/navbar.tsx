import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { MobileNotSupportedWarning } from "../layout/mobile-warning";
import { useIsMobile } from "@/hooks/use-mobile";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Modals, useModalStore } from "@/store/modal-store";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const isMobile = useIsMobile();
  const {openModal} = useModalStore();
  return (
    <header className="sticky border-b top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-4">
          {/* <Button onClick={() => openModal(Modals.DASHBOARD_COMMAND_MODAL)} className="text-muted-foreground hidden lg:inline-flex lg:w-[250px] justify-between" size={"sm"} variant={"secondary"}>
            <span className="inline-flex items-center gap-2"><Search className="size-4 mx-0" />Search</span>
            <p className="text-muted-foreground text-xs space-x-1 hidden lg:inline">
            <kbd className="bg-background pointer-events-none inline-flex h-6 items-center gap-1 rounded border px-1.5 font-mono text-[12px] font-medium opacity-100 select-none">
              <span className="text-xs">Ctrl</span>
            </kbd>
            <kbd className="bg-background pointer-events-none inline-flex h-6 items-center gap-1 rounded border px-1.5 font-mono text-[12px] font-medium opacity-100 select-none">
              <span className="text-xs">K</span>
            </kbd>
          </p>
          </Button> */}
          {/* <ModeToggle /> */}
          <Button variant={"destructive"} className="" size={"icon"} disabled>
            <HugeiconsIcon className="size-5" icon={Notification03Icon} />
          </Button>
        </div>
      </div>
      {isMobile && <MobileNotSupportedWarning />}
    </header>
  );
}
