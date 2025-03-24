import Logo from "../logo";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { UserNav } from "../admin-panel/user-nav";
import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-x-8">
          <Link href={"/"} className="flex items-center gap-2 select-none">
            <Logo src="/old-fav.ico" className="size-16 mt-1" />
            <span className="text-xl font-bold">DentaFlow</span>
          </Link>
          {children}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <UserNav />
              {/* <Button onClick={logOut} variant={"secondary"} size={"sm"}>
                  Sign out
                </Button>
                <div className="relative">

                  <button className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Image src={user?.imageUrl ?? ""} fill className="h-9 w-9 rounded-full object-cover" alt="User Avatar" />
                  </button>
                </div> */}
            </>
          ) : (
            <>
              <Button variant="ghost" className="transition" size="sm" asChild>
                <SignInButton />
              </Button>
              <Button className="transition" size="sm" asChild>
                <SignUpButton>Get Started</SignUpButton>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
