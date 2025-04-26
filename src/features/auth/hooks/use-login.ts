import { useMutation } from "@tanstack/react-query"
import { useRedirectUrl } from "./use-redirect-url";
import { account } from "@/lib/appwrite/client";

export const useLogin = () => {
  const redirectUrl = useRedirectUrl();
  const mutation = useMutation({
    mutationFn: async ({ data }: { data: { email: string, password: string } }) => {
      const session = await account.createEmailPasswordSession(data.email, data.password);
      const user = await account.get();
      if (!user.emailVerification) {
        await account.createEmailToken(user.$id, data.email);
        await account.deleteSession(session.$id);
        throw new Error('email-not-verified', { cause: user.$id });
      }

      return session;
    },
    onSuccess: () => {
      window.location.replace(redirectUrl ?? '/');
    }
  })

  return mutation;
}
