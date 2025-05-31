"use client";

import Logo from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {user, isLoading} = useAuth();

  // if (isLoading) return <Loading />;

  // if (user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with children */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center">
        {/* Logo shown on mobile, centered at top */}
        {/* <div className="absolute top-2 left-1/2 -translate-x-1/2 hidden lg:block">
          <Link href={"/"} className="flex items-center">
            <Logo src="/old-fav.ico" />
            <h1 className="text-2xl font-bold">DentaAuto</h1>
          </Link>
        </div> */}
        {children}
      </div>

      {/* Right side with logo and quote */}
      <div className="hidden lg:flex w-1/2 flex-col bg-gradient-to-t dark:from-background/90 dark:to-accent/90 relative bg-[url('/dental-data.png')] bg-cover bg-center">
        {/* <div className="absolute top-8 left-8">
          <Link href={"/"} className="flex items-center">
            <Logo src="/old-fav.ico" />
            <h1 className="text-2xl font-bold">DentaAuto</h1>
          </Link>
        </div> */}
        <div className="flex items-end justify-center flex-1 p-8">
          <p className="italic">
            &quot;Streamlining dental practice management&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
