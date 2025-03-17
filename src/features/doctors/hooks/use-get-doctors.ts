import { useQuery } from "@tanstack/react-query";
import { GetDoctors } from "../actions";
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
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
