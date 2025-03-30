import { useQuery, useQueryClient } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite/client";
import {
  CASES_COLLECTION_ID,
  DATABASE_ID,
  DOCTORS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
} from "@/lib/constants";
import { Query } from "appwrite";
import { Case, Doctor, Material } from "@/types";

export const useGetCases = () => {
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { documents: doctors } = await databases.listDocuments<Doctor>(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        [Query.limit(9999), Query.select(["$id", "name"])]
      );
      const { documents: materials } = await databases.listDocuments<Material>(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.limit(9999), Query.select(["$id", "name"])]
      );
      const cases = await databases.listDocuments<Case>(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        [
          Query.limit(500),
          Query.orderDesc("date"),
          Query.select([
            "$id",
            "$createdAt",
            "$updatedAt",
            "date",
            "patient",
            "doctorId",
            "materialId",
            "due",
            "shade",
            "note",
            "invoice",
            "data",
            "teamId",
            "userId",
          ]),
        ]
      );
      return cases.documents.map((c) => {
        return {
          ...c,
          doctor: doctors.find((d) => d.$id === c.doctorId) as Doctor,
          material: materials.find((m) => m.$id === c.materialId) as Material,
        };
      });
    },
  });
};

export const usePrefetchCases = () => {
  const queryClient = useQueryClient();

  return async () => {
    const { documents: doctors } = await databases.listDocuments<Doctor>(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      [Query.limit(9999), Query.select(["$id", "name"])]
    );
    const { documents: materials } = await databases.listDocuments<Material>(
      DATABASE_ID,
      MATERIALS_COLLECTION_ID,
      [Query.limit(9999), Query.select(["$id", "name"])]
    );
    await queryClient.prefetchQuery({
      queryKey: ["cases"],
      queryFn: async () => {
        const cases = await databases.listDocuments<Case>(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          [
            Query.limit(500),
            Query.orderDesc("date"),
            Query.select([
              "$id",
              "$createdAt",
              "$updatedAt",
              "date",
              "patient",
              "doctorId",
              "materialId",
              "due",
              "shade",
              "note",
              "invoice",
              "data",
              "teamId",
              "userId",
            ]),
          ]
        );
        return cases.documents.map((c) => {
          return {
            ...c,
            doctor: doctors.find((d) => d.$id === c.doctorId),
            material: materials.find((m) => m.$id === c.materialId),
          };
        });
      },
    });
  };
};
