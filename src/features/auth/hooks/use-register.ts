import { useMutation } from "@tanstack/react-query"
import { useRedirectUrl } from "./use-redirect-url";
import { account } from "@/lib/appwrite/client";
import { ID } from "appwrite";


export const useRegister = () => {
  const redirectUrl = useRedirectUrl();
  const mutation = useMutation({
    mutationFn: async (
      { data }: { data: { name: string; email: string; password: string } }
    ) => {
      await account.create(ID.unique(), data.email, data.password, data.name);
      const session = await account.createEmailPasswordSession(data.email, data.password);
      // const jwt = await account.createJWT();
      // Cookies.set(AUTH_COOKIE, jwt.jwt, {expires: 30})
      return session;
    },
    onSuccess: () => {
      window.location.replace(redirectUrl ?? '/');
    }
  })

  return mutation;
}
