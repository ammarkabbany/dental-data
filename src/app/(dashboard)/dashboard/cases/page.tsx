"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CasesDataTable } from "@/components/cases/data-table";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useGetCases } from "@/features/cases/hooks/use-get-cases";
import { useGetMaterialById } from "@/features/materials/hooks/use-get-material-by-id";
import { usePermission } from "@/hooks/use-permissions";
import { useTeam } from "@/providers/team-provider";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function CasesPage() {
  const { userRole, isLoading: isTeamLoading } = useTeam();

  const canCreate = usePermission(userRole).checkPermission('cases', 'create');

  // const teamId = currentTeam?.$id;

  // if (isLoading) return (
  //   <ContentLayout title="Cases">
  //     <div className="h-full min-h-[80vh] flex items-center justify-center">
  //       <LoadingSpinner />
  //     </div>
  //   </ContentLayout>
  // );

  const { data: cases, isLoading: isCasesLoading } = useGetCases();

  // if (!currentTeam && !isTeamLoading) return (
  //   <ContentLayout title="Cases">
  //     <div className="text-center">
  //       <p className="text-red-500">No team selected. select a team or create one here</p>
  //       <Button className="transition" asChild>
  //         <Link href="/teams/create">
  //           Create a team
  //         </Link>
//       </Button>
  //     </div>
  //   </ContentLayout>
  // );

  if (isTeamLoading || isCasesLoading) return (
    <ContentLayout title="Cases">
      <div className="h-full min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </ContentLayout>
  );

  return (
    <>
      <ContentLayout title="Cases">
        <div className="flex justify-between items-center">
          <p>
            Manage your cases
          </p>
          {canCreate &&
          <Button className="transition" asChild>
            <Link href="/dashboard/cases/new">
              <HugeiconsIcon icon={Add01Icon} /> Add Case
            </Link>
          </Button>}
        </div>
        <CasesDataTable data={cases || []} />
      </ContentLayout>
    </>
  )
}
