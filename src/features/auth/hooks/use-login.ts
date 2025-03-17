import { useMutation } from "@tanstack/react-query"
import { useRedirectUrl } from "./use-redirect-url";
import { account } from "@/lib/appwrite/client";
import Cookies from 'js-cookie';
import { AUTH_COOKIE } from "@/lib/constants";

export const useLogin = () => {
  const redirectUrl = useRedirectUrl();
  const mutation = useMutation({
    mutationFn: async ({ data }: {data: {email: string, password: string}}) => {
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // const result = await response.json();
      // if (!response.ok) {
      //   throw new Error(result.message);
      // }
      const session = await account.createEmailPasswordSession(data.email, data.password);
      const jwt = await account.createJWT();
      console.log(jwt);
      Cookies.set(AUTH_COOKIE, jwt.jwt, {expires: 30})
      return session;
    },
    onSuccess: () => {
      window.location.replace(redirectUrl ?? '/dashboard');
    }
  })

  return mutation;
}