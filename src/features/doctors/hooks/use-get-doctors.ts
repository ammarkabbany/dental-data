import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Doctor } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { useDoctorsStore } from "@/store/doctors-store";

export const useGetDoctors = () => {
  const {setDoctors} = useDoctorsStore();
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const doctors = await databases.listDocuments<Doctor>(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        [Query.limit(9999)]
      );
      setDoctors(doctors.documents);
      
      return doctors.documents;
    },
  });
};

export const usePrefetchDoctors = () => {
  const queryClient = useQueryClient();
  const {setDoctors} = useDoctorsStore();
  
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["doctors"],
      queryFn: async () => {
        const doctors = await databases.listDocuments<Doctor>(
          DATABASE_ID,
          DOCTORS_COLLECTION_ID,
          [Query.limit(9999)]
        );
        setDoctors(doctors.documents);
        
        return doctors.documents;
      },
    });
  };
};
