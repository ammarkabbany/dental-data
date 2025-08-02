"use client"
import { ExecutionLogs } from "@/components/admin/monitoring/ExecutionLogs";
import { useGetAdminExecutions } from "./use-get-executions";
import { Models } from "node-appwrite";
import { useState, useEffect } from "react";

export default function Page() {
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('executionLogsStatusFilter') || 'all';
    }
    return 'all';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('executionLogsStatusFilter', statusFilter);
    }
  }, [statusFilter]);

  const {data: executions} = useGetAdminExecutions(statusFilter);

  return (
    <div>
      <ExecutionLogs logs={executions as (Models.Execution & { functionName: string })[]} setStatusFilter={setStatusFilter} statusFilter={statusFilter} />
    </div>
  )
}
