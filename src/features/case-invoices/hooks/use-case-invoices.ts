import { useQuery } from '@tanstack/react-query';
import { CASE_INVOICES_COLLECTION_ID } from '@/lib/constants';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import { CaseInvoice } from '@/types';
import { useTeam } from '@/providers/team-provider';

export function useCaseInvoices(pageIndex = 0, pageSize = 5) {
  const { currentTeam } = useTeam();
  return useQuery({
    queryKey: ['caseInvoices', pageIndex, pageSize],
    queryFn: async () => {
      if (!currentTeam) {
        throw new Error("No team found");
      }
      if (currentTeam.planId === "free") {
        return null;
      }
      const response = await databases.listDocuments<CaseInvoice>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        CASE_INVOICES_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(pageSize),
          Query.offset(pageIndex * pageSize),
        ]
      );
      return response;
    },
  });
}