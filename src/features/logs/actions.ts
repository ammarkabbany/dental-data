"use server"

import { createAdminClient } from "@/lib/appwrite/appwrite";
import { AUDIT_LOGS_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { AuditLogEntry } from "@/types";
import { ID, Permission, Role } from "node-appwrite";

export const LogAuditEvent = async (
  data: Partial<AuditLogEntry> & {
    userId: string;
    teamId?: string;
  }
): Promise<void> => {
  const { databases } = await createAdminClient();
  const { teamId, userId, ...rest } = data;

  const permissions = []
  if (teamId) {
    permissions.push(Permission.read(Role.team(teamId, 'owner')));
    permissions.push(Permission.read(Role.team(teamId, 'admin')));
  } else {
    permissions.push(Permission.read(Role.user(userId)));
  }
  await databases.createDocument<AuditLogEntry>(
    DATABASE_ID,
    AUDIT_LOGS_COLLECTION_ID,
    ID.unique(),
    {
      ...rest,
      changes: JSON.stringify(rest.changes || {}),
      userId,
      teamId: teamId || null,
    },
    permissions
  );
};