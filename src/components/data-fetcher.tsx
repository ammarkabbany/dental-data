import { usePrefetchCases } from "@/features/cases/hooks/use-get-cases";
import { usePrefetchDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { usePrefetchMaterials } from "@/features/materials/hooks/use-get-materials";
import { usePrefetchTemplates } from "@/features/templates/hooks/use-get-templates";
import { usePrefetchDashboardData } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/providers/auth-provider";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import useTeamStore from "@/store/team-store";
import { useEffect } from "react";

export default function DataFetcher() {
  const {isAuthenticated, isLoading: isUserLoading} = useAuth();
  const {currentAppwriteTeam: appwriteTeam} = useTeamStore();
  useDoctorsStore();
  useMaterialsStore();
  const prefetchDashboardData = usePrefetchDashboardData();
  const prefetchDoctors = usePrefetchDoctors();
  const prefetchMaterials = usePrefetchMaterials();
  const prefetchCases = usePrefetchCases();
  const prefetchTemplates = usePrefetchTemplates();

  useEffect(() => {
    // if (!isDoctorsLoading && doctors) {
    //   setDoctors(doctors);
    // }
    prefetchDashboardData();
    prefetchDoctors();
    prefetchMaterials();
    prefetchCases();
    prefetchTemplates();
  }, [
    isAuthenticated,
    isUserLoading,
    appwriteTeam,
  ]);

  return <></>
}
