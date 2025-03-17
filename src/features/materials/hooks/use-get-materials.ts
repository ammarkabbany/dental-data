import { useQuery } from "@tanstack/react-query"
import { GetMaterials } from "../actions";
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
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}