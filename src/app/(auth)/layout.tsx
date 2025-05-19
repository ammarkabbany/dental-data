"use client"

import Logo from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  // const {user, isLoading} = useAuth();

  // if (isLoading) return <Loading />;

  // if (user) redirect('/dashboard');

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-b">
      <Link href={"/"} className="flex items-center">
        <Logo src="/old-fav.ico" />
        <h1 className="text-2xl font-bold">DentaAuto</h1>
      </Link>
      {children}
    </div>
  )
}
