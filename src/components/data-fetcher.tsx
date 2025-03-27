import { usePrefetchCases } from "@/features/cases/hooks/use-get-cases";
import { usePrefetchDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { usePrefetchMaterials } from "@/features/materials/hooks/use-get-materials";
import { useGetTemplates } from "@/features/templates/hooks/use-get-templates";
import { usePrefetchDashboardData } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/providers/auth-provider";
import { useTeam } from "@/providers/team-provider";
import { useTemplatesStore } from "@/store/templates-store";
import { useEffect } from "react";

export default function DataFetcher() {
  const {isLoading, currentTeam} = useTeam();
  const prefetchDashboardData = usePrefetchDashboardData();
  const prefetchDoctors = usePrefetchDoctors();
  const prefetchMaterials = usePrefetchMaterials();
  const prefetchCases = usePrefetchCases();
  // const { data: materials, isLoading: isMaterialsLoading } = useGetMaterials();
  const { data: templates, isLoading: isTemplatesLoading } = useGetTemplates();
  const { setTemplates } = useTemplatesStore();

  useEffect(() => {
    // if (!isDoctorsLoading && doctors) {
    //   setDoctors(doctors);
    // }
    prefetchDashboardData();
    prefetchDoctors();
    prefetchMaterials();
    prefetchCases();
    // if (!isMaterialsLoading && materials) {
    //   setMaterials(materials);
    // }
    if (!isTemplatesLoading && templates) {
      setTemplates(templates);
    }
  }, [
    // isDoctorsLoading,
    // doctors,
    // setDoctors,
    // materials,
    // isMaterialsLoading,
    // setMaterials,
    isLoading,
    currentTeam,
    isTemplatesLoading,
    setTemplates,
  ]);

  return <></>
}
