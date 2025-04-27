import { useMutation } from "@tanstack/react-query"
import { useRedirectUrl } from "./use-redirect-url";
import { account } from "@/lib/appwrite/client";

export const useVerifyOtp = () => {
  const redirectUrl = useRedirectUrl();
  const mutation = useMutation({
    mutationFn: async ({ data }: { data: { userId: string, secret: string } }) => {
      const session = await account.createSession(data.userId, data.secret);
      return session;
    },
    onSuccess: () => {
      setTimeout(() => {
        window.location.replace(redirectUrl ?? '/');
      }, 2000)
    }
  })

  return mutation;
}
