import { account, storage } from "@/lib/appwrite/client";
import { AVATARS_BUCKET_ID } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import { useMutation } from "@tanstack/react-query";
import { ID } from "node-appwrite";
import { toastAPI } from "@/lib/ToastAPI";

export const useUpdateUserInfo = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      updates,
    }: {
      updates: { name: string; image?: string | File };
    }) => {
      let uploadedImageUrl: string | undefined;
      try {
        if (updates.image instanceof File) {
          // Upload new image
          const file = await storage.createFile(
            AVATARS_BUCKET_ID,
            ID.unique(),
            updates.image
          );
          
          // Get preview URL using Appwrite's helper
          const preview = storage.getFilePreview(AVATARS_BUCKET_ID, file.$id);
          uploadedImageUrl = preview
        } else {
          uploadedImageUrl = updates.image
        }
        await account.updatePrefs({ 
          ...user?.prefs,
          avatar: uploadedImageUrl || undefined
        });

        await account.updateName(updates.name);
      } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toastAPI.success("Account updated");
    },
    onError: (error: Error) => {
      toastAPI.error(`Error updating account: ${error.message}`);
    },
  });
};
