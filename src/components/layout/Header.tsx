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
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-x-8">
          <Link href={"/"} className="flex items-center gap-2 select-none">
            <Logo src="/old-fav.ico" className="size-18 mt-1" h={72} w={72} />
            <span className="text-2xl font-bold tracking-wide -translate-x-2">DentaAuto</span>
          </Link>
          {children}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserNav includeDetails={false} />
          ) : (
            <>
              <Button onClick={() => handleLogin()} variant="ghost" className="transition" size="sm">
                Sign In
              </Button>
              <Button onClick={handleSignUp} className="transition" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
