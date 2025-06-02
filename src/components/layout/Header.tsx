import Logo from "../logo";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { UserNav } from "../admin-panel/user-nav";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Header({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, handleLogin } = useAuth();
  const handleSignUp = () => {
    redirect("/sign-up");
  }
  return (
    <header className="border-b border-border dark:border-neutral-800 sticky top-0 z-50 w-full bg-background/95 dark:bg-neutral-900/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/75 dark:supports-[backdrop-filter]:bg-neutral-900/75">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-x-8">
          <Link href={"/"} className="flex items-center gap-2 select-none">
            <Logo src="/old-fav.ico" className="size-8 mt-1" h={32} w={32} /> {/* Adjusted size for typical header */}
            <span className="text-2xl font-bold tracking-tight text-foreground dark:text-gray-50">DentaAuto</span> {/* Adjusted tracking, ensured color */}
          </Link>
          {children}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserNav includeDetails={false} />
          ) : (
            <>
              <Button onClick={() => handleLogin()} variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground dark:text-gray-300 dark:hover:text-white transition-colors">
                Sign In
              </Button>
              <Button onClick={handleSignUp} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 transition-colors">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
