"use server"

import { createAdminClient } from "@/lib/appwrite/appwrite"
import { DATABASE_ID, PLANS_COLLECTION_ID } from "@/lib/constants";
import { BillingPlan } from "@/types";
import { Query } from "node-appwrite";

export const getBillingPlan = async (planId: string) => {
  const {databases} = await createAdminClient();
  const plan = await databases.getDocument<BillingPlan>(
    DATABASE_ID,
    PLANS_COLLECTION_ID,
    planId,
    [Query.select([
      '$id',
      'name',
      'description',
      'price'
    ])]
  );
  return plan;
}