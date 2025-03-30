import Link from "next/link";
import { ChevronsRight, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Case } from "@/types";
import { RecentCaseRow } from "./recent-case-row";
import { usePermission } from "@/hooks/use-permissions";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";

interface RecentCasesProps {
  cases: Partial<Case>[];
}

export default function RecentCases({ cases }: RecentCasesProps) {
  const {data: membership} = useGetMembership();
  const canViewDue = usePermission(membership?.roles[0] || null).canViewDue()
  const canCreate = usePermission(membership?.roles[0] || null).checkPermission('cases', 'create')
  return (
    <div className="rounded-lg shadow-sm border bg-dental-bg-card/50">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>
          <Button
            variant="ghost"
            // endIcon={<ArrowRight size={16} />}
            size="sm"
            asChild
          >
            <Link href="/dashboard/cases">View All</Link>
          </Button>
        </div>
      </div>

      {cases.length == 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 p-3 rounded-full">
            <ChevronsRight className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-1">No cases yet</h3>
          <p className="mb-4 max-w-sm text-muted-foreground">
            Get started by creating your first case to track work.
          </p>
          {canCreate && <Link href="/dashboard/cases/new">
            <Button
              variant="outline"
              // startIcon={<Plus size={16} />}
              size="sm"
            >
              Create Case
            </Button>
          </Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Doctor
                </th>
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                {canViewDue && <th className=" text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6  text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cases.map((caseItem) => {
                // const user = getCaseUser(caseItem.userId);
                return <RecentCaseRow key={caseItem.$id} caseItem={caseItem} />;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
