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
      const user = await account.create(ID.unique(), data.email, data.password, data.name);
      await account.createEmailToken(user.$id, data.email);
      return { userId: user.$id };
      // const session = await account.createEmailPasswordSession(data.email, data.password);
    },
    // onSuccess: () => {
    //   window.location.replace(redirectUrl ?? '/');
    // }
  })

  return mutation;
}
