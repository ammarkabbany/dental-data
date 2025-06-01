import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Case } from "@/types"; // Make sure this path is correct
import { databases } from "@/lib/appwrite/client"; // Make sure this path is correct
import { DATABASE_ID, CASES_COLLECTION_ID } from "@/lib/constants"; // Make sure these constants are defined
import { Query } from "appwrite";
import useTeamStore from "@/store/team-store"; // For teamId

// Define filter types for case queries
export interface CaseServerFilters {
  patient?: string;
  doctorId?: string;
  materialId?: string;
  dateFrom?: string;
  dateTo?: string;
  invoiceStatus?: boolean; // true for invoiced, false for not invoiced, undefined for all
  search?: string; // Generic search term for patient name, notes, etc.
}

// Define sorting types
export interface CaseSort {
  sortColumn: string; // e.g., 'patient', 'date', 'due'
  sortDirection: 'ASC' | 'DESC';
}

export const useGetCasesServerRendered = (
  pageIndex = 0,
  pageSize = 10,
  filters: CaseServerFilters = {},
  sort?: CaseSort
) => {
  const { activeTeam } = useTeamStore();
  const teamId = activeTeam?.$id;

  return useQuery({
    queryKey: ["cases", teamId, pageIndex, pageSize, filters, sort],
    queryFn: async () => {
      if (!teamId) {
        // Or return an empty result: return { documents: [], total: 0 };
        // Depending on how you want to handle cases where teamId is not available
        // For now, let's return an empty result to avoid throwing an error that might break UI
        // if the component using this hook doesn't handle the error state well for this specific case.
        console.warn("Active team ID is not available for fetching cases.");
        return { documents: [], total: 0 };
      }

      const offset = pageIndex * pageSize;
      const queryParams: string[] = [
        Query.equal("teamId", teamId), // Always filter by active team
        Query.limit(pageSize),
        Query.offset(offset),
      ];

      // Add filter conditions
      if (filters.patient) {
        // Using Query.search for partial matches. If exact match is needed, use Query.equal.
        queryParams.push(Query.search("patient", filters.patient));
      }
      if (filters.doctorId) {
        queryParams.push(Query.equal("doctorId", filters.doctorId));
      }
      if (filters.materialId) {
        queryParams.push(Query.equal("materialId", filters.materialId));
      }
      if (filters.dateFrom) {
        queryParams.push(Query.greaterThanEqual("date", filters.dateFrom));
      }
      if (filters.dateTo) {
        queryParams.push(Query.lessThanEqual("date", filters.dateTo));
      }
      if (typeof filters.invoiceStatus === 'boolean') {
        // Assuming 'invoice' is the field name in Appwrite for invoice status
        queryParams.push(Query.equal("invoice", filters.invoiceStatus));
      }

      if (filters.search) {
        // This will find documents where 'patient' contains the search term.
        // To search multiple fields with OR logic, add more Query.search lines.
        // e.g., queryParams.push(Query.search("note", filters.search));
        // For AND logic across different fields with text search, Appwrite's direct support is limited.
        // You might need full-text search features or more complex query structures.
        queryParams.push(Query.search("patient", filters.search));
      }

      // Add sorting
      if (sort && sort.sortColumn) {
        if (sort.sortDirection === 'DESC') {
          queryParams.push(Query.orderDesc(sort.sortColumn));
        } else {
          queryParams.push(Query.orderAsc(sort.sortColumn));
        }
      } else {
        // Default sort order if none provided
        queryParams.push(Query.orderDesc("$createdAt"));
      }

      // Consider adding Query.select for optimization if not all fields are needed.
      // Example: queryParams.push(Query.select(["$id", "patient", "date", "doctorId", "materialId", "shade", "due", "invoiceStatus", "note", "$createdAt"]));


      const casesResponse = await databases.listDocuments<Case>(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        queryParams
      );

      return {
        documents: casesResponse.documents,
        total: casesResponse.total,
      };
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 1, // 1 minute
    // keepPreviousData: true, // Consider for smoother pagination
  });
};

export const usePrefetchCasesServerRendered = () => {
  const queryClient = useQueryClient();
  const { activeTeam } = useTeamStore();
  const teamId = activeTeam?.$id;

  return async (
    pageIndex = 0,
    pageSize = 10,
    filters: CaseServerFilters = {},
    sort?: CaseSort
  ) => {
    if (!teamId) return;

    await queryClient.prefetchQuery({
      queryKey: ["cases", teamId, pageIndex, pageSize, filters, sort],
      queryFn: async () => {
        const offset = pageIndex * pageSize;
        const queryParams: string[] = [
          Query.equal("teamId", teamId),
          Query.limit(pageSize),
          Query.offset(offset),
        ];

        if (filters.patient) queryParams.push(Query.search("patient", filters.patient));
        if (filters.doctorId) queryParams.push(Query.equal("doctorId", filters.doctorId));
        if (filters.materialId) queryParams.push(Query.equal("materialId", filters.materialId));
        if (filters.dateFrom) queryParams.push(Query.greaterThanEqual("date", filters.dateFrom));
        if (filters.dateTo) queryParams.push(Query.lessThanEqual("date", filters.dateTo));
        if (typeof filters.invoiceStatus === 'boolean') queryParams.push(Query.equal("invoice", filters.invoiceStatus));
        if (filters.search) queryParams.push(Query.search("patient", filters.search));

        if (sort && sort.sortColumn) {
          if (sort.sortDirection === 'DESC') queryParams.push(Query.orderDesc(sort.sortColumn));
          else queryParams.push(Query.orderAsc(sort.sortColumn));
        } else {
          queryParams.push(Query.orderDesc("$createdAt"));
        }

        // Consider Query.select here as well for consistency if used in the main hook.

        const casesResponse = await databases.listDocuments<Case>(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          queryParams
        );
        return {
          documents: casesResponse.documents,
          total: casesResponse.total,
        };
      },
    });
  };
};
