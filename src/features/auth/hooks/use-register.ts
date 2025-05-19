import { useMutation } from "@tanstack/react-query"
import { useRedirectUrl } from "./use-redirect-url";
import { account } from "@/lib/appwrite/client";
import { AppwriteException, ID } from "appwrite";


export const useRegister = () => {
  const redirectUrl = useRedirectUrl();
  const mutation = useMutation({
    mutationFn: async (
      { data }: { data: { name: string; email: string; password: string } }
    ) => {
      try {
        const user = await account.create(ID.unique(), data.email, data.password, data.name);
        await account.createEmailToken(user.$id, data.email);
        return { userId: user.$id };
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.code === 409) {
            throw new Error("A user with the same email already exists.");
          }
        }
        return Promise.reject(error);
      }
      // const session = await account.createEmailPasswordSession(data.email, data.password);
    },
    // onSuccess: () => {
    //   window.location.replace(redirectUrl ?? '/');
    // }
  })

  return mutation;
}
