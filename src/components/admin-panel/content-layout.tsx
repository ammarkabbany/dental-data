import { Navbar } from "@/components/admin-panel/navbar";
import { MobileNotSupportedWarning } from "../layout/mobile-warning";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
}
