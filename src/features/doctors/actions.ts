"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { Doctor } from "@/types";
import { ID, Permission, Query, Role } from "node-appwrite";

export const CreateDoctor = async (
  teamId: string,
  data: Partial<Doctor>
): Promise<Doctor | null> => {
  const { databases } = await createAdminClient();

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

export const GetDoctors = async (): Promise<Doctor[]> => {
  const { databases } = await createSessionClient();

  const doctors = await databases.listDocuments<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    [Query.limit(9999)]
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
