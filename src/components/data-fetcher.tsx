import { useGetCases } from "@/features/cases/hooks/use-get-cases";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { useGetMaterials } from "@/features/materials/hooks/use-get-materials";
import { useGetTemplates } from "@/features/templates/hooks/use-get-templates";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { useTemplatesStore } from "@/store/templates-store";
import { useEffect } from "react";

export default function DataFetcher() {
  const { data: doctors, isLoading: isDoctorsLoading } = useGetDoctors();
  const { data: materials, isLoading: isMaterialsLoading } = useGetMaterials();
  const {data: templates, isLoading: isTemplatesLoading} = useGetTemplates();
  const {} = useGetCases();
  
  const { setDoctors } = useDoctorsStore();
  const { setMaterials } = useMaterialsStore();
  const { setTemplates } = useTemplatesStore();

  useEffect(() => {
    if (!isDoctorsLoading && doctors) {
      setDoctors(doctors);
    }
    if (!isMaterialsLoading && materials) {
      setMaterials(materials);
    }
    if (!isTemplatesLoading && templates) {
      setTemplates(templates);
    }
  }, [
    isDoctorsLoading,
    doctors,
    setDoctors,
    materials,
    isMaterialsLoading,
    setMaterials,
    isTemplatesLoading,
    setTemplates,
  ]);

  return {
    isLoading: isDoctorsLoading || isMaterialsLoading,
    doctors,
    materials,
  }
}