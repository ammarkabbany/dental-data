"use server"

import { createAdminClient } from "@/lib/appwrite/appwrite";
import { DATABASE_ID, INSTAPAY_ORDERS_COLLECTION_ID, TRANSACTIONS_BUCKET_ID } from "@/lib/constants";
import { ID } from "node-appwrite";

export async function submitApplication({form}: {
  form: {
    userId: string;
    teamId: string;
    planId: string;
    amount: number;
    image: File;
  }
}): Promise<{
  success: boolean;
  message: string;
}> {
  const {databases, storage} = await createAdminClient();

  try {
    const image = await storage.createFile(
      TRANSACTIONS_BUCKET_ID,
      ID.unique(),
      form.image
    )

    await databases.createDocument(
      DATABASE_ID,
      INSTAPAY_ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        userId: form.userId,
        teamId: form.teamId,
        planId: form.planId,
        amount: form.amount,
        fileId: image.$id,
      }
    )
    return {
      success: true,
      message: "Application submitted successfully",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Something went wrong",
    }
  }
}