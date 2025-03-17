import { useGetCases } from "@/features/cases/hooks/use-get-cases";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { useGetMaterials } from "@/features/materials/hooks/use-get-materials";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { useEffect } from "react";

export default function DataFetcher() {
  const { data: doctors, isLoading: isDoctorsLoading } = useGetDoctors();
  const { data: materials, isLoading: isMaterialsLoading } = useGetMaterials();
  const { data: cases, isLoading: isCasesLoading } = useGetCases();
  
  const { setDoctors } = useDoctorsStore();
  const { setMaterials } = useMaterialsStore();

  useEffect(() => {
    if (!isDoctorsLoading && doctors) {
      setDoctors(doctors);
    }
    if (!isMaterialsLoading && materials) {
      setMaterials(materials);
    }
  }, [
    isDoctorsLoading,
    doctors,
    setDoctors,
    materials,
    isMaterialsLoading,
    setMaterials,
  ]);

  return {
    isLoading: isDoctorsLoading || isMaterialsLoading,
    doctors,
    materials,
  }
}