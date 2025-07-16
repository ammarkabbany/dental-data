"use server"
import { createAdminClient } from "@/lib/appwrite/appwrite"

export const listAllExecutions = async () => {
  const {functions} = await createAdminClient();
  const functionList = await functions.list();
  const allExecs = await Promise.all(functionList.functions.map(async (fn) => {
    return (await functions.listExecutions(fn.$id)).executions;
  }));
  return allExecs.flat().map(ex => ({
    ...ex,
    functionName: functionList.functions.find(f => f.$id === ex.functionId)?.name
  }));
}
