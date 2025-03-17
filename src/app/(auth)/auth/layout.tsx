"use client"

export default function AuthLayout({children}: {children: React.ReactNode}) {

  // const {user, isLoading} = useAuth();

  // if (isLoading) return <Loading />;

  // if (user) redirect('/dashboard');

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-background">
      {children}
    </div>
  )
}