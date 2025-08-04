"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import {
  AUDIT_LOGS_COLLECTION_ID,
  CASE_INVOICES_COLLECTION_ID,
  CASES_COLLECTION_ID,
  DATABASE_ID,
  DOCTORS_COLLECTION_ID,
  DOCTORS_FUNCTION_ID,
  TEAMS_COLLECTION_ID,
} from "@/lib/constants";
import { Case, CaseInvoice, ToothCollection } from "@/types";
import {
  AppwriteException,
  ExecutionMethod,
  ID,
  Models,
  Permission,
  Query,
  Role,
} from "node-appwrite";
import { getTeamById, updateTeam } from "../team/teamService";
import { LogAuditEvent } from "../logs/actions";
import { isBefore } from "date-fns";

export const CreateCase = async (
  teamId: Case["teamId"],
  userId: Case["userId"],
  data: any
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const { databases } = await createAdminClient();

  // pick the team first to check for limits
  const team = await getTeamById(teamId, [
    Query.select(["casesUsed", "maxCases", "planExpiresAt"]),
  ]);

  if (isBefore(new Date(team?.planExpiresAt || 0), new Date())) {
    return {
      success: false,
      message: "Your plan expired. Renew to add new cases.",
    };
  }
  if (team.casesUsed >= team.maxCases) {
    return {
      success: false,
      message:
        "Case limit reached! Please upgrade your plan to add more cases.",
    };
  }

  try {
    const document = await databases.createDocument<Case>(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      ID.unique(),
      {
        teamId,
        userId,
        ...data,
        patient: data.patient || "-",
        shade: data.shade || "-",
        data: JSON.stringify(data.data) as unknown as ToothCollection,
      },
      [
        Permission.read(Role.team(teamId)),
        Permission.update(Role.team(teamId)),
        Permission.write(Role.team(teamId, "owner")),
        Permission.write(Role.team(teamId, "admin")),
      ]
    );
    if (team) {
      try {
        await databases.incrementDocumentAttribute(
          DATABASE_ID,
          TEAMS_COLLECTION_ID,
          teamId,
          "casesUsed",
          1
        );
      } catch (error) {
        console.error("Error incrementing casesUsed:", error);
      }
    }

    try {
      await databases.incrementDocumentAttribute(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        document.doctorId,
        "totalCases",
        1
      );
      await databases.incrementDocumentAttribute(
        DATABASE_ID,
        DOCTORS_COLLECTION_ID,
        document.doctorId,
        "due",
        document.due || 0
      );
    } catch (error) {
      console.error("Error incrementing totalCases:", error);
    }

    await LogAuditEvent({
      userId: document.userId,
      teamId: document.teamId,
      action: "CREATE",
      resource: "CASE",
      resourceId: document.$id,
      changes: {
        after: document,
        before: undefined,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "An unknown error occurred.",
    };
  }

  return {
    success: true,
    message: "Case created successfully.",
  };
};

export const UpdateCase = async (
  id: Case["$id"],
  teamId: Case["teamId"] | undefined,
  data: any,
  oldCase: Case
): Promise<Case | null> => {
  const { databases, functions } = await createAdminClient();

  const updatedDocument = await databases.updateDocument<Case>(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    id,
    {
      ...data,
      patient: data.patient || "-",
      shade: data.shade || "-",
      teamId,
      data: JSON.stringify(data.data),
      due: Math.max(0, data.due || 0),
    }
  );

  if (updatedDocument.due > oldCase.due) {
    await databases.incrementDocumentAttribute(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      updatedDocument.doctorId,
      "due",
      updatedDocument.due - oldCase.due
    );
  } else if (updatedDocument.due < oldCase.due) {
    await databases.decrementDocumentAttribute(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      updatedDocument.doctorId,
      "due",
      oldCase.due - updatedDocument.due,
      0
    );
    // await functions.createExecution(
    //   DOCTORS_FUNCTION_ID,
    //   JSON.stringify({
    //     caseId: updatedDocument.$id,
    //     doctorId: updatedDocument.doctorId,
    //     oldDue: oldCase.due || 0,
    //     newDue: updatedDocument.due || 0,
    //   }),
    //   true,
    //   "/update",
    //   ExecutionMethod.POST
    // );
  }

  await LogAuditEvent({
    userId: updatedDocument.userId,
    teamId: teamId,
    action: "UPDATE",
    resource: "CASE",
    resourceId: updatedDocument.$id,
    changes: {
      after: updatedDocument,
      before: oldCase,
    },
    timestamp: new Date().toISOString(),
  });

  return updatedDocument;
};

export const DeleteCase = async (
  ids: Case["$id"][],
  teamId: Case["teamId"]
) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid input: 'ids' must be a non-empty array.");
  }

  if (!teamId) {
    throw new Error("Invalid input: 'teamId' is required.");
  }

  const { databases, functions } = await createAdminClient();

  try {
    const response = await databases.deleteDocuments<Case>(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      [Query.equal("teamId", teamId), Query.equal("$id", ids)]
    );
    await functions.createExecution(
      DOCTORS_FUNCTION_ID,
      JSON.stringify({
        changes: response.documents.map((c) => ({
          caseId: c.$id,
          doctorId: c.doctorId,
          amount: c.due || 0,
        })),
      }),
      true,
      "/delete",
      ExecutionMethod.POST
    );

    const permissions: string[] = [];
    if (teamId) {
      permissions.push(Permission.read(Role.team(teamId, "owner")));
      permissions.push(Permission.read(Role.team(teamId, "admin")));
    }

    try {
      await databases.createDocuments(
        DATABASE_ID,
        AUDIT_LOGS_COLLECTION_ID,
        response.documents.map((document) => ({
          userId: document.userId,
          teamId: document.teamId,
          action: "DELETE",
          resource: "CASE",
          resourceId: document.$id,
          changes: JSON.stringify({
            before: document,
            after: {},
          }),
          timestamp: new Date().toISOString(),
          $permissions: permissions,
        }))
      );
    } catch (error) {
      console.error("Couldn't Audit Log.", error);
    }
  } catch (error) {
    console.error("Error deleting cases:", error);
  }

  // await LogAuditEvent({
  //   userId: "system",
  //   teamId: teamId,
  //   action: "DELETE",
  //   resource: "CASE",
  //   resourceId: 'MULTIPLE CASES',
  //   changes: {
  //     before: response,
  //     after: {},
  //   },
  //   timestamp: new Date().toISOString(),
  // })

  // const handleCaseDeletion = async (documentId: string) => {
  //   try {
  //     const document = await GetCaseById(documentId);
  //     if (!document) {
  //       console.warn(`Case with ID ${documentId} not found.`);
  //       return;
  //     }

  //     // Delete the document
  //     await databases.deleteDocument(DATABASE_ID, CASES_COLLECTION_ID, documentId);

  //     // Log the deletion
  //     await LogAuditEvent({
  //       userId: document.userId,
  //       teamId: document.teamId,
  //       action: "DELETE",
  //       resource: "CASE",
  //       resourceId: document.$id,
  //       changes: {
  //         before: document,
  //         after: {},
  //       },
  //       timestamp: new Date().toISOString(),
  //     });
  //   } catch (error) {
  //     console.error(`Failed to delete case with ID ${documentId}:`, error);
  //   }
  // };

  // await Promise.allSettled(ids.map((id) => handleCaseDeletion(id)));
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
        "data",
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

export const CreateCaseInvoice = async (
  userId: string,
  teamId: string,
  data: Partial<CaseInvoice>
): Promise<{
  success: boolean;
  message: string;
}> => {
  const { databases } = await createAdminClient();

  try {
    await databases.createDocument<CaseInvoice>(
      DATABASE_ID,
      CASE_INVOICES_COLLECTION_ID,
      ID.unique(),
      {
        teamId,
        userId,
        cases: data.cases?.map((c) => c.$id),
        ...data,
      } as Omit<CaseInvoice, keyof Models.Document>,
      [
        // Permission.read(Role.team(teamId)),
        Permission.write(Role.team(teamId, "owner")),
        Permission.read(Role.team(teamId, "owner")),
        Permission.read(Role.team(teamId, "admin")),
        Permission.write(Role.team(teamId, "admin")),
      ]
    );

    return {
      success: true,
      message: "Case invoice created successfully",
    };
  } catch (error) {
    console.error("Error creating case invoice:", error);
    return {
      success: false,
      message: "An error occurred while creating the case invoice",
    };
  }
};
