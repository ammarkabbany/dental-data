import { useAuth } from "@/providers/auth-provider"
import { usePathname } from "next/navigation";
import { useEffect } from "react"

export default function RedirectToAuth() {
  const {handleLogin} = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    handleLogin(pathname);
  }, [handleLogin, pathname])

  return <></>
}