"use client"
import { ExecutionLogs } from "@/components/admin/monitoring/ExecutionLogs";
import { useGetAdminExecutions } from "./use-get-executions";
import { Models } from "node-appwrite";

export default function Page() {
  const {data: executions} = useGetAdminExecutions();

  return (
    <div>
      <ExecutionLogs logs={executions as (Models.Execution & { functionName: string })[]} />
    </div>
  )
}
