import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuditLogEntry } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, AUDIT_LOGS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { getUserInfo } from "@/features/auth/actions";

// Define filter types for better type safety
export interface LogFilters {
  action?: string;
  resource?: string;
  userId?: string;
  search?: string;
}

export const useGetLogs = (
  pageIndex = 0, 
  pageSize = 10, 
  filters: LogFilters = {}
) => {
  return useQuery({
    queryKey: ["logs", pageIndex, pageSize, filters],
    queryFn: async () => {
      const offset = pageIndex * pageSize;
      
      // Start with basic query parameters
      const queryParams = [
        Query.limit(pageSize),
        Query.offset(offset),
        Query.orderDesc("timestamp"),
        Query.select([
          "$id",
          "timestamp",
          "$createdAt",
          "teamId",
          "userId",
          "action",
          "resource",
          "resourceId",
        ])
      ];
      
      // Add filter conditions if provided
      if (filters.action) {
        queryParams.push(Query.equal("action", filters.action));
      }
      
      if (filters.resource) {
        queryParams.push(Query.equal("resource", filters.resource));
      }
      
      if (filters.userId) {
        queryParams.push(Query.equal("userId", filters.userId));
      }
      
      if (filters.search) {
        // Add text search if available in Appwrite
        // If not available, you might need to fetch more data and filter client-side
        queryParams.push(Query.search("resourceId", filters.search));
      }

      const logs = await databases.listDocuments<AuditLogEntry>(
        DATABASE_ID,
        AUDIT_LOGS_COLLECTION_ID,
        queryParams
      );

      const userIds = [...new Set(logs.documents.map((row) => row.userId))];

      const userInfos = await Promise.all(
        userIds.map((userId) => getUserInfo(userId))
      );
      const userInfoMap = userInfos.reduce(
        (acc, info, index) => {
          acc[userIds[index]] = info;
          return acc;
        },
        {} as Record<string, (typeof userInfos)[number]>
      );

      logs.documents = logs.documents.map((log) => ({
        ...log,
        user: userInfoMap[log.userId] || null,
      }));

      return {
        documents: logs.documents,
        total: logs.total,
      };
    },
  });
};

export const usePrefetchLogs = () => {
  const queryClient = useQueryClient();

  return async (pageIndex = 0, pageSize = 10, filters: LogFilters = {}) => {
    await queryClient.prefetchQuery({
      queryKey: ["logs", pageIndex, pageSize, filters],
      queryFn: async () => {
        const offset = pageIndex * pageSize;
        
        // Start with basic query parameters
        const queryParams = [
          Query.limit(pageSize),
          Query.offset(offset),
          Query.orderDesc("timestamp"),
          Query.select([
            "$id",
            "timestamp",
            "$createdAt",
            "teamId",
            "userId",
            "action",
            "resource",
            "resourceId",
          ])
        ];
        
        // Add filter conditions if provided
        if (filters.action) {
          queryParams.push(Query.equal("action", filters.action));
        }
        
        if (filters.resource) {
          queryParams.push(Query.equal("resource", filters.resource));
        }
        
        if (filters.userId) {
          queryParams.push(Query.equal("userId", filters.userId));
        }
        
        if (filters.search) {
          queryParams.push(Query.search("resourceId", filters.search));
        }

        const logs = await databases.listDocuments<AuditLogEntry>(
          DATABASE_ID,
          AUDIT_LOGS_COLLECTION_ID,
          queryParams
        );

        const userIds = [...new Set(logs.documents.map((row) => row.userId))];

        const userInfos = await Promise.all(
          userIds.map((userId) => getUserInfo(userId))
        );
        const userInfoMap = userInfos.reduce(
          (acc, info, index) => {
            acc[userIds[index]] = info;
            return acc;
          },
          {} as Record<string, (typeof userInfos)[number]>
        );

        logs.documents = logs.documents.map((log) => ({
          ...log,
          user: userInfoMap[log.userId] || null,
        }));

        return {
          documents: logs.documents,
          total: logs.total,
        };
      },
    });
  };
};
