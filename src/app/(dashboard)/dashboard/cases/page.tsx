"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CasesDataTable } from "@/components/cases/data-table";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useGetCases } from "@/features/cases/hooks/use-get-cases";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";
import { usePermission } from "@/hooks/use-permissions";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function CasesPage() {
  const {data: membership} = useGetMembership();

  const canCreate = usePermission(membership?.roles[0] || null).checkPermission('cases', 'create');

  const { data: cases, isLoading: isCasesLoading } = useGetCases();

  if (isCasesLoading) return (
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
