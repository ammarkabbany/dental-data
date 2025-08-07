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
    <header className="w-full lg:container lg:mx-auto lg:rounded-xl border-2 border-border dark:border-neutral-800/25 sticky lg:top-2 z-50 bg-background/95 dark:bg-neutral-800/35 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/75 dark:supports-[backdrop-filter]:bg-black-800/85">
      <div className="flex lg:container h-18 items-center justify-between mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-x-8">
          <Link href={"/"} className="flex items-center gap-2 select-none">
            <Logo src="/old-fav.ico" className="size-15" />
            <span className="text-2xl font-bold tracking-tight text-foreground dark:text-gray-50 hidden sm:inline-block">DentaAuto</span>
          </Link>
        </div>
        {children}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserNav side="bottom" includeDetails={true} />
          ) : (
            <>
              <Button onClick={() => handleLogin()} size="lg" className="text-muted-foreground hover:text-accent-foreground dark:text-gray-300 dark:hover:text-white transition-colors to-neutral-700/75 via-neutral-700/55 from-neutral-600/25 hover:from-neutral-600/35 hover:to-neutral-700/65 bg-gradient-to-t border border-neutral-600/75 py-5">
                Sign In
              </Button>
              <Button onClick={handleSignUp} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 transition-colors">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
