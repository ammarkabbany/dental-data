"use server"

import { createAdminClient } from "@/lib/appwrite/appwrite"
import { ANALYTICS_FUNCTION_ID } from "@/lib/constants";

export const TriggerAnalyticsFunction = async (teamId: string) => {
  const {functions} = await createAdminClient();

  const response = await functions.createExecution(
    ANALYTICS_FUNCTION_ID,
    undefined,
    false,
    `/?teamId=${teamId}`
  );
  return response.status as 'waiting' | 'processing' | 'completed' | 'failed';
}