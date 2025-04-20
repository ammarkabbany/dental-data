"use client"

import Logo from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  // const {user, isLoading} = useAuth();

  // if (isLoading) return <Loading />;

  // if (user) redirect('/dashboard');

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-background">
      <Link href={"/"} className="absolute top-0 sm:left-0 flex items-center">
        <Logo src="/old-fav.ico" />
        <h1 className="text-2xl font-bold">Dental Data</h1>
      </Link>
      {children}
    </div>
  )
}
