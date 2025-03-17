"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";
import { TEMPLATES_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { Template } from "@/types";
import { ID, Permission, Query, Role } from "node-appwrite";

export const CreateTemplate = async (
  teamId: Template["teamId"],
  data: Partial<Template>
): Promise<Template | null> => {
  const { databases } = await createAdminClient();

  const document = await databases.createDocument<Template>(
    DATABASE_ID,
    TEMPLATES_COLLECTION_ID,
    ID.unique(),
    {
      teamId,
      ...data,
    },
    [
      Permission.read(Role.team(teamId)),
      Permission.update(Role.team(teamId)),
      Permission.write(Role.team(teamId, "owner")),
      Permission.write(Role.team(teamId, "admin")),
    ]
  );

  return document;
};

export const UpdateTemplate = async (
  id: Template["$id"],
  teamId: Template["teamId"] | undefined,
  data: Partial<Template>
): Promise<Template | null> => {
  const { databases } = await createAdminClient();

  const updatedDocument = await databases.updateDocument<Template>(
    DATABASE_ID,
    TEMPLATES_COLLECTION_ID,
    id,
    {
      ...data,
      teamId,
    }
  );

  return updatedDocument;
};

export const DeleteTemplate = async (
  id: Template["$id"],
): Promise<void> => {
  const { databases } = await createAdminClient();

  await databases.deleteDocument(DATABASE_ID, TEMPLATES_COLLECTION_ID, id);
}

export const GetTemplates = async (): Promise<Template[]> => {
  const { databases } = await createSessionClient();

  const templates = await databases.listDocuments<Template>(
    DATABASE_ID,
    TEMPLATES_COLLECTION_ID,
    [
      Query.limit(9999),
      Query.orderDesc("$createdAt"),
      Query.select([
        "$id",
        "$createdAt",
        "$updatedAt",
        "name",
        "doctor",
        "material",
        "shade",
        "note",
        "teamId",
      ]),
    ]
  );

  return templates.documents;
};

export const GetTemplateById = async (id: Template["$id"]): Promise<Template> => {
  const { databases } = await createAdminClient();

  const material = await databases.getDocument<Template>(
    DATABASE_ID,
    TEMPLATES_COLLECTION_ID,
    id
  );

  return material;
};
