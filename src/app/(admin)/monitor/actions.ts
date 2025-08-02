"use server"
import { createAdminClient } from "@/lib/appwrite/appwrite"
import { Query } from "node-appwrite";

export const listAllExecutions = async () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const {functions} = await createAdminClient();
  const functionList = await functions.list();
  const allExecs = await Promise.all(functionList.functions.map(async (fn) => {
    return (await functions.listExecutions(fn.$id, [
      Query.limit(50),
      Query.orderDesc("$createdAt"),
      Query.greaterThan('$createdAt', weekAgo.toISOString())
    ])).executions;
  }));
  return allExecs.flat().map(ex => ({
    ...ex,
    functionName: functionList.functions.find(f => f.$id === ex.functionId)?.name
  }));
}
