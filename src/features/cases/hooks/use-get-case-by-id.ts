import { useQuery } from "@tanstack/react-query"
import { GetCaseById } from "../actions"
import { databases } from "@/lib/appwrite/client"
import { CASES_COLLECTION_ID, DATABASE_ID } from "@/lib/constants"
import { Case } from "@/types"
import { Query } from "appwrite"

export const useGetCaseById = (id: string) => {
  return useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const _case = await databases.getDocument<Case>(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        id,
        [
          Query.select(
            [
              '$id',
              'patient',
              'date',
              'doctorId',
              'materialId',
              'due',
              'data',
              'note',
              'invoice',
              'userId',
              'teamId',
            ]
          )
        ]
      )
      return _case;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}