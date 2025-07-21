import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const ResponsiveSheet = ({
  children,
  open,
  onOpenChange,
  className,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTitle></SheetTitle>
        <SheetContent
          className={`w-full sm:max-w-lg ${className} p-0 border-none overflow-y-auto no-scrollbar`}
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto no-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  className,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className={`w-full sm:max-w-lg ${className} p-0 border-none overflow-y-auto no-scrollbar max-h-[85vh]`}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto no-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface ResponsiveModalWithTriggerProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const ResponsiveModalWithTrigger = ({
  trigger,
  children,
  open,
  onOpenChange,
  className,
}: ResponsiveModalWithTriggerProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger}
        <DialogTitle></DialogTitle>
        <DialogContent
          className={`w-full sm:max-w-lg ${className} p-0 border-none overflow-y-auto no-scrollbar max-h-[85vh]`}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DrawerTitle></DrawerTitle>
      <DrawerContent>
        <div className="overflow-y-auto no-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
