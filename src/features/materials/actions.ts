"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { DATABASE_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { Material } from "@/types";
import { AppwriteException, ID, Permission, Query, Role } from "node-appwrite";
import { getTeamById } from "../team/teamService";
import { isBefore } from "date-fns";
import { LogAuditEvent } from "../logs/actions";

export const CreateMaterial = async (
  userId: string,
  teamId: string,
  data: Partial<Material>
): Promise<{
  success: boolean;
  message: string;
}> => {
  const { databases } = await createAdminClient();

  // pick the team first to check for limits
  const team = await getTeamById(teamId, [Query.select(["planExpiresAt"])]);

  if (isBefore(new Date(team.planExpiresAt || 0), new Date())) {
    throw new Error("Your plan expired. Renew to add new materials.");
  }

  try {
    const material = await databases.createDocument<Material>(
      DATABASE_ID,
      MATERIALS_COLLECTION_ID,
      ID.unique(),
      {
        teamId,
        ...data,
      },
      [
        Permission.read(Role.team(teamId)),
        Permission.write(Role.team(teamId, "owner")),
        Permission.write(Role.team(teamId, "admin")),
      ]
    );
  
    await LogAuditEvent({
      userId: userId,
      teamId: teamId,
      action: "CREATE",
      resource: "MATERIAL",
      resourceId: material.$id,
      changes: {
        after: material,
        before: undefined,
      },
      timestamp: new Date().toISOString(),
    });
    return {
      success: true,
      message: "Material created successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};

export const GetMaterials = async (): Promise<Material[]> => {
  const { databases } = await createSessionClient();

  const materials = await databases.listDocuments<Material>(
    DATABASE_ID,
    MATERIALS_COLLECTION_ID,
    [Query.limit(9999)]
  );

  return materials.documents;
};

export const GetMaterialById = async (id: string): Promise<Material> => {
  const { databases } = await createAdminClient();

  const material = await databases.getDocument<Material>(
    DATABASE_ID,
    MATERIALS_COLLECTION_ID,
    id
  );

  return material;
};
