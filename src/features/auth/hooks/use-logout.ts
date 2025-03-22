"use client"
import { account } from "@/lib/appwrite/client";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation";


export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout');
      if (!response.ok) {
        throw new Error('Failed to log out')
      }
      await account.deleteSession('current')
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries({queryKey: ["current"]});
      queryClient.clear();
      window.location.reload();
      // router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }
  })
  return mutation;
}