import { useQuery } from "@tanstack/react-query"
import { databases } from "@/lib/appwrite/client";
import { CASES_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { Case } from "@/types";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";

export const useGetCases = () => {
  const {getDoctorById} = useDoctorsStore();
  const {getMaterialById} = useMaterialsStore();
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const cases = await databases.listDocuments<Case>(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          [
            Query.limit(9999),
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
              "teethData",
              "teamId",
              "userId",
            ]),
          ]
        );
      
        const finalCases = 
          cases.documents.map(doc => {
            const material = getMaterialById(doc.materialId);
            const doctor = getDoctorById(doc.doctorId);
            return {...doc, material, doctor }
          })
        return finalCases;
    },
    // refetchInterval: 60000, // refetch every minute
  })
}