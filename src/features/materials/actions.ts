"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";
import { DATABASE_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { Material } from "@/types";
import { ID, Permission, Query, Role } from "node-appwrite";
import { getTeamById } from "../team/teamService";
import { isBefore } from "date-fns";

export const CreateMaterial = async (
  teamId: string,
  data: Partial<Material>
): Promise<Material | null> => {
  const { databases } = await createAdminClient();

  // pick the team first to check for limits
  const team = await getTeamById(teamId, [
    Query.select(["planExpiresAt"]),
  ]);

  if (isBefore(new Date(team.planExpiresAt || 0), new Date())) {
    throw new Error('Your plan expired. Renew to add new materials.')
  }

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
      Permission.write(Role.team(teamId, 'owner')),
      Permission.write(Role.team(teamId, 'admin'))
    ]
  );

  return material;
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
