"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { AUTH_COOKIE, DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { generateShortUniqueId } from "@/lib/utils";
import { Doctor } from "@/types";
import { cookies } from "next/headers";
import { ID, Permission, Query, Role } from "node-appwrite";
import { getTeamById } from "../team/teamService";
import { isBefore } from "date-fns";

export const CreateDoctor = async (
  teamId: string,
  data: Partial<Doctor>
): Promise<Doctor | null> => {
  const { databases } = await createAdminClient();

  // pick the team first to check for limits
  const team = await getTeamById(teamId, [
    Query.select(["planExpiresAt"]),
  ]);

  if (isBefore(new Date(team.planExpiresAt || 0), new Date())) {
    throw new Error('Your plan expired. Renew to add new doctors.')
  }

  const doctor = await databases.createDocument<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
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

  return doctor;
};

export const UpdateDoctor = async (
  id: Doctor["$id"],
  data: Partial<Doctor>
) => {
  const { databases } = await createAdminClient();

  const updatedDocument = await databases.updateDocument<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    id,
    {
      ...data,
    }
  );

  return updatedDocument;
};

export const UpdateDoctorDue = async (
  id: Doctor["$id"],
  due: number
) => {
  const doctor = await GetDoctorById(id, [
    Query.select([
      'due',
    ]),
  ]);
  const payload = {
    due: Math.max(0, doctor.due + due),
  };
  const updatedDoctor = await UpdateDoctor(id, payload);
  return updatedDoctor;
}

export const GetDoctors = async (queries: string[] = [Query.limit(9999)]): Promise<Doctor[]> => {
  const c = await cookies();
  const jwt = c.get(AUTH_COOKIE);
  const { databases } = await createSessionClient();
  databases.client.setJWT(jwt?.value || "");
  
  const doctors = await databases.listDocuments<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    queries
  );

  return doctors.documents;
};

export const GetDoctorById = async (id: string, queries: string[] = []): Promise<Doctor> => {
  const { databases } = await createAdminClient();

  const doctor = await databases.getDocument<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    id,
    queries
  );

  return doctor;
};
