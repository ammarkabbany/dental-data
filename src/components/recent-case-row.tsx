import { Case } from "@/types";
import { UserAvatar } from "./user-avatar";
import { formatCurrency } from "@/lib/format-utils";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { cn } from "@/lib/utils";

interface RecentCaseRowProps {
  caseItem: Partial<Case>;
  className?: string;
}

export const RecentCaseRow = ({ caseItem, className }: RecentCaseRowProps) => {
  const { userRole, currentAppwriteTeam: appwriteTeam } = useTeamStore();
  const canViewDue = usePermission(userRole).canViewDue();
  const { getDoctorById } = useDoctorsStore();

  const statusStyles = {
    paid: "bg-chart-2/10 text-chart-2 ring-1 ring-chart-2/20",
    unpaid: "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
  };

  return (
    <tr key={caseItem.$id} className={cn("transition-colors duration-100", className)}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-card-foreground hover:text-primary transition-colors">
          {caseItem.patient}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
        {getDoctorById(caseItem.doctorId || "")?.name || "N/A"}
      </td>
      <td className="whitespace-nowrap py-4 px-6 md:px-0">
        <div className="flex items-center gap-x-3">
          <UserAvatar 
            className="ring-2 ring-offset-2 ring-offset-background ring-primary/10" 
            image={caseItem.user?.avatar || "?"} 
            name={caseItem.user?.name || ""} 
          />
          <span className="text-sm text-muted-foreground">
            {caseItem.user?.name}
          </span>
        </div>
      </td>
      {canViewDue && (
        <td className="py-4 px-6 whitespace-nowrap">
          <span className="text-sm font-medium text-card-foreground">
            {formatCurrency(caseItem.due || 0, appwriteTeam?.prefs.currency)}
          </span>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
            caseItem.invoice ? statusStyles.paid : statusStyles.unpaid
          )}
        >
          {caseItem.invoice ? "PAID" : "UNPAID"}
        </span>
      </td>
    </tr>
  );
};