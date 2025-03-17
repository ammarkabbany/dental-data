"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { CASES_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { Case } from "@/types";
import {
  ExecutionMethod,
  ID,
  Models,
  Permission,
  Query,
  Role,
} from "node-appwrite";

export const CreateCase = async (
  teamId: Case["teamId"],
  userId: Case["userId"],
  data: Partial<Case>
): Promise<Case | null> => {
  const { databases } = await createAdminClient();

  const document = await databases.createDocument<Case>(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    ID.unique(),
    {
      teamId,
      userId,
      ...data,
      teethData: JSON.stringify(data.teethData),
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

export const UpdateCase = async (
  id: Case["$id"],
  teamId: Case["teamId"] | undefined,
  data: Partial<Case>
): Promise<Case | null> => {
  const { databases } = await createAdminClient();

  const updatedDocument = await databases.updateDocument<Case>(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    id,
    {
      ...data,
      teamId,
      teethData: JSON.stringify(data.teethData),
    }
  );

  return updatedDocument;
};

export const DeleteCase = async (
  ids: Case["$id"][],
) => {
  const { functions } = await createAdminClient();

  return await functions.createExecution(
    process.env.NEXT_DOCUMENT_UPDATE_FUNCTION_ID!,
    JSON.stringify({ documents: ids }),
    false,
    "/deletedocuments",
    ExecutionMethod.POST,
    { databaseid: DATABASE_ID, collectionid: CASES_COLLECTION_ID }
  );
};

export const GetCases = async (): Promise<Case[]> => {
  const { databases } = await createSessionClient();

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

  return cases.documents;
};

export const GetCaseById = async (id: Case["$id"]): Promise<Case> => {
  const { databases } = await createAdminClient();

  const material = await databases.getDocument<Case>(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    id
  );

  return material;
};
