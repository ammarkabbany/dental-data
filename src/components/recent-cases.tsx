import Link from "next/link";
import { ChevronsRight, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Case } from "@/types";
import { RecentCaseRow } from "./recent-case-row";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";

interface RecentCasesProps {
  cases: Partial<Case>[];
}

export default function RecentCases({ cases }: RecentCasesProps) {
  const { userRole } = useTeamStore();
  const canViewDue = usePermission(userRole).canViewDue()
  const canCreate = usePermission(userRole).checkPermission('cases', 'create')
  
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl">
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Track your latest cases and their status</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="group hover:bg-primary/10 transition-colors duration-200"
            asChild
          >
            <Link href="/dashboard/cases" className="flex items-center gap-2">
              View All
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Button>
        </div>
      </div>

      {cases.length == 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 p-4 rounded-full bg-primary/10 animate-pulse">
            <ChevronsRight className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">No cases yet</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Get started by creating your first case to track your dental work and patient progress.
          </p>
          {canCreate && (
            <Link href="/dashboard/cases/new">
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                Create Your First Case
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Doctor
                </th>
                <th className="py-4 px-6 md:px-0 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  User
                </th>
                {canViewDue && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Amount
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cases.map((caseItem) => (
                <RecentCaseRow 
                  key={caseItem.$id} 
                  caseItem={caseItem}
                  className="hover:bg-secondary/20 transition-colors duration-100"
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
