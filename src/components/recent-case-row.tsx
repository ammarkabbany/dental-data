import { Case } from "@/types";
import { UserAvatar } from "./user-avatar";
import { formatCurrency } from "@/lib/format-utils";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";

export const RecentCaseRow = ({ caseItem }: { caseItem: Partial<Case> }) => {
  // const { data: user } = useGetUserInfo(caseItem.userId || "");
  const {userRole, currentAppwriteTeam: appwriteTeam} = useTeamStore();
  const canViewDue = usePermission(userRole).canViewDue()
  const {getDoctorById} = useDoctorsStore();
  return (
    <tr key={caseItem.$id} className="hover:bg-current/5">
      <td className="px-6 py-3 whitespace-nowrap">
        <div className="font-medium">{caseItem.patient}</div>
      </td>
      <td className="px-6 py-3 whitespace-nowrap">
        {getDoctorById(caseItem.doctorId || "")?.name || "N/A"}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(caseItem.dueDate).toLocaleDateString()}
                  </td> */}
      <td className="whitespace-nowrap py-3 px-6 md:px-0 flex items-center gap-x-2">
        <UserAvatar className="bg-white" image={caseItem.user?.avatar || "?"} name={caseItem.user?.name || ""} />
        {caseItem.user?.name}
      </td>
      {canViewDue && <td className="py-4 whitespace-nowrap">
        {formatCurrency(caseItem.due || 0, appwriteTeam?.prefs.currency)}
      </td>}
      <td className="px-6 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            caseItem.invoice
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {caseItem.invoice ? "PAID" : "UNPAID"}
        </span>
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cases/${caseItem.$id}`}>View</Link>
                    </Button>
                  </td> */}
    </tr>
  );
};
