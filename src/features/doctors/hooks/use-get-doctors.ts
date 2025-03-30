import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Doctor } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const doctors = await databases.listDocuments<Doctor>(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        [Query.limit(9999)]
      );
      
      return doctors.documents;
    },
  });
};

export const usePrefetchDoctors = () => {
  const queryClient = useQueryClient();
  
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["doctors"],
      queryFn: async () => {
        const doctors = await databases.listDocuments<Doctor>(
          DATABASE_ID,
          DOCTORS_COLLECTION_ID,
          [Query.limit(9999)]
        );
        
        return doctors.documents;
      },
    });
  };
};
