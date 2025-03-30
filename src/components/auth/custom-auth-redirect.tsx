import { useAuth } from "@/providers/auth-provider"
import { usePathname } from "next/navigation";

export default function RedirectToAuth() {
  const {handleLogin} = useAuth();
  const pathname = usePathname();

  handleLogin(pathname);

  return <></>
}