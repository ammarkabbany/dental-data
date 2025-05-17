"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { CASES_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { Case } from "@/types";
import { ID, Permission, Query, Role } from "node-appwrite";
import {
  GetDoctorById,
  UpdateDoctor,
  UpdateDoctorDue,
} from "../doctors/actions";
import { getTeamById, updateTeam } from "../team/teamService";
import { LogAuditEvent } from "../logs/actions";
import { isBefore } from "date-fns";

export const CreateCase = async (
  teamId: Case["teamId"],
  userId: Case["userId"],
  data: Partial<Case>
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
      message: 'Your plan expired. Renew to add new cases.',
    };
  }
  if (team.casesUsed >= team.maxCases) {
    return {
      success: false,
      message: "Case limit reached! Please upgrade your plan to add more cases.",
    };
  }

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
      data: JSON.stringify(data.data),
    },
    [
      Permission.read(Role.team(teamId)),
      Permission.update(Role.team(teamId)),
      Permission.write(Role.team(teamId, "owner")),
      Permission.write(Role.team(teamId, "admin")),
    ]
  );
  // update doctor
  // const doctor = await GetDoctorById(document.doctorId, [
  //   Query.select(["$id", "due", "totalCases"]),
  // ]);
  // if (doctor) {
  //   const due = document.due;
  //   await UpdateDoctor(doctor.$id, {
  //     due: Math.max(0, doctor.due + due),
  //     totalCases: Math.max(0, doctor.totalCases + 1),
  //   });
  // }
  // update team
  if (team) {
    await updateTeam(document.teamId, {
      casesUsed: Math.max(0, (team.casesUsed || 0) + 1),
    });
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

  return {
    success: true,
    message: "Case created successfully.",
  };
};

export const UpdateCase = async (
  id: Case["$id"],
  teamId: Case["teamId"] | undefined,
  data: Partial<Case>,
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

  // update doctor
  // const doctorId = updatedDocument.doctorId;
  // const newDue = updatedDocument.due || 0;
  // const oldDue = oldCase.due || 0;

  // let result: number = 0;
  // if (newDue < oldDue) {
  //   // Decreased due (removed tooth or demoted material)
  //   result = -(oldDue - newDue);
  // } else if (newDue > oldDue) {
  //   // Increased due (added tooth or promoted material)
  //   result = newDue - oldDue;
  // }
  // if (doctorId) {
  //   await UpdateDoctorDue(doctorId, result);
  // }

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

  const { databases } = await createAdminClient();

  const handleCaseDeletion = async (documentId: string) => {
    try {
      const document = await GetCaseById(documentId);
      if (!document) {
        console.warn(`Case with ID ${documentId} not found.`);
        return;
      }

      // Delete the document
      await databases.deleteDocument(DATABASE_ID, CASES_COLLECTION_ID, documentId);

      // Log the deletion
      await LogAuditEvent({
        userId: document.userId,
        teamId: document.teamId,
        action: "DELETE",
        resource: "CASE",
        resourceId: document.$id,
        changes: {
          before: document,
          after: {},
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to delete case with ID ${documentId}:`, error);
    }
  };

  // Process all deletions in parallel
  await Promise.allSettled(ids.map((id) => handleCaseDeletion(id)));
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
