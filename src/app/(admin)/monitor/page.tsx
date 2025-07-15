"use client"
import { ExecutionLogs } from "@/components/admin/monitoring/ExecutionLogs";
import { useGetAdminExecutions } from "./use-get-executions";

export default function Page() {
  const {data: executions} = useGetAdminExecutions();

  return (
    <div>
      <ExecutionLogs logs={executions || []} />
    </div>
  )
}
