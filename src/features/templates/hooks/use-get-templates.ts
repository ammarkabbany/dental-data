import { useQuery, useQueryClient } from "@tanstack/react-query"
import { GetTemplates } from "../actions";
import { databases } from "@/lib/appwrite/client";
import { Template } from "@/types";
import { DATABASE_ID, TEMPLATES_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";

export const useGetTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const templates = await databases.listDocuments<Template>(
        DATABASE_ID,
        TEMPLATES_COLLECTION_ID,
        [
          Query.limit(9999),
          Query.orderDesc("$createdAt"),
          Query.select([
            "$id",
            "$createdAt",
            "$updatedAt",
            "name",
            "doctor",
            "material",
            "shade",
            "note",
            "teamId",
          ]),
        ]
      );
    
      return templates.documents;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const usePrefetchTemplates = () => {
  const queryClient = useQueryClient();
  
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["templates"],
      queryFn: async () => {
        const templates = await databases.listDocuments<Template>(
          DATABASE_ID,
          TEMPLATES_COLLECTION_ID,
          [
            Query.limit(9999),
            Query.orderDesc("$createdAt"),
            Query.select([
              "$id",
              "$createdAt",
              "$updatedAt",
              "name",
              "doctor",
              "material",
              "shade",
              "note",
              "teamId",
            ]),
          ]
        );
      
        return templates.documents;
      },
    });
  };
};