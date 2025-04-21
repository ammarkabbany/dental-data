import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuditLogEntry } from "@/types";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, AUDIT_LOGS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { getUserInfo } from "@/features/auth/actions";

export const useGetLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const logs = await databases.listDocuments<AuditLogEntry>(
        DATABASE_ID,
        AUDIT_LOGS_COLLECTION_ID,
        [
          Query.limit(100),
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
        ]
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

      return logs.documents;
    },
  });
};

export const usePrefetchLogs = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["logs"],
      queryFn: async () => {
        const logs = await databases.listDocuments<AuditLogEntry>(
          DATABASE_ID,
          AUDIT_LOGS_COLLECTION_ID,
          [
            Query.limit(100),
            Query.orderDesc("timestamp"),
            Query.select([
              "$id",
              "$createdAt",
              "timestamp",
              "teamId",
              "userId",
              "action",
              "resource",
              "resourceId",
            ])
          ]
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

        return logs.documents;
      },
    });
  };
};
