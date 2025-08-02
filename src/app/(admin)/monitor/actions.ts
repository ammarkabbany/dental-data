"use server"
import { createAdminClient } from "@/lib/appwrite/appwrite"
import { Query } from "node-appwrite";

export const listAllExecutions = async (status?: string) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const {functions} = await createAdminClient();
  const functionList = await functions.list();
  const allExecs = await Promise.all(functionList.functions.map(async (fn) => {
    const queries = [
      Query.greaterThan('$createdAt', weekAgo.toISOString())
    ];
    if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }
    return (await functions.listExecutions(fn.$id, queries)).executions;
  }));
  return allExecs.flat().map(ex => ({
    ...ex,
    functionName: functionList.functions.find(f => f.$id === ex.functionId)?.name
  }));
}
