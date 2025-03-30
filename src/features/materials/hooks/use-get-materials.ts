import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Material } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";

export const useGetMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const materials = await databases.listDocuments<Material>(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.limit(9999)]
      );
      
      return materials.documents;
    },
  });
};

export const usePrefetchMaterials = () => {
  const queryClient = useQueryClient();
  
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ['materials'],
      queryFn: async () => {
        const materials = await databases.listDocuments<Material>(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [Query.limit(9999)]
        );
        
        return materials.documents;
      },
    });
  };
};