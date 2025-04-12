import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Material } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { useMaterialsStore } from "@/store/material-store";

export const useGetMaterials = () => {
  const {setMaterials} = useMaterialsStore();
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const materials = await databases.listDocuments<Material>(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.limit(9999)]
      );
      setMaterials(materials.documents);
      
      return materials.documents;
    },
  });
};

export const usePrefetchMaterials = () => {
  const queryClient = useQueryClient();
  const {setMaterials} = useMaterialsStore();
  
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ['materials'],
      queryFn: async () => {
        const materials = await databases.listDocuments<Material>(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [Query.limit(9999)]
        );
        setMaterials(materials.documents);
        
        return materials.documents;
      },
    });
  };
};