import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Doctor } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { useDoctorsStore } from "@/store/doctors-store";
import { ListDoctors } from "../actions";
import { useTeam } from "@/providers/team-provider";
import { usePermission } from "@/hooks/use-permissions";

export const useGetDoctors = () => {
  const { setDoctors } = useDoctorsStore();
  const { userRole } = useTeam();
  const hasFinancialPerm = usePermission(userRole).canViewDue();
  const selectQuery = ["$id", "$createdAt", "teamId", "name", "totalCases"];
  if (hasFinancialPerm) {
    selectQuery.push("due");
  }
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const doctors = await databases.listDocuments<Doctor>(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        [Query.limit(9999), Query.select(selectQuery), Query.orderDesc("totalCases")]
      );
      setDoctors(doctors.documents);

      return doctors.documents;
    },
  });
};

export const useGetTableDoctors = () => {
  const { currentTeam } = useTeam();
  return useQuery({
    queryKey: ["table_doctors"],
    queryFn: async () => {
      if (!currentTeam) return [];
      const doctors = await ListDoctors(currentTeam.$id);
      return doctors;
    },
  });
};

export const usePrefetchDoctors = () => {
  const queryClient = useQueryClient();
  const { setDoctors } = useDoctorsStore();
  const { userRole } = useTeam();
  const hasFinancialPerm = usePermission(userRole).canViewDue();
  const selectQuery = ["$id", "$createdAt", "teamId", "name", "totalCases"];
  if (hasFinancialPerm) {
    selectQuery.push("due");
  }

  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["doctors"],
      queryFn: async () => {
        const doctors = await databases.listDocuments<Doctor>(
          DATABASE_ID,
          DOCTORS_COLLECTION_ID,
          [Query.limit(9999), Query.select(selectQuery), Query.orderDesc("totalCases")]
        );
        setDoctors(doctors.documents);

        return doctors.documents;
      },
    });
  };
};
