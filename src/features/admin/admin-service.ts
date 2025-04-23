"use server";

import { Models, Query } from "node-appwrite";
import {
  CASES_COLLECTION_ID,
  DATABASE_ID,
  DOCTORS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
  TEAM_MEMBERS_COLLECTION_ID,
  TEAMS_COLLECTION_ID,
} from "@/lib/constants";
import { createAdminClient } from "@/lib/appwrite/appwrite";
import { Case, Doctor, Material, Team, TeamMember } from "@/types";
import { getUserInfo } from "../auth/actions";

export async function getAdminStats() {
  const {databases, users, teams} = await createAdminClient();
  const cases = await databases.listDocuments(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    [Query.limit(1), Query.select(["$id"])]
  );
  const doctors = await databases.listDocuments(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    [Query.limit(1), Query.select(["$id"])]
  );

  const materials = await databases.listDocuments(
    DATABASE_ID,
    MATERIALS_COLLECTION_ID,
    [Query.limit(1), Query.select(["$id"])]
  );

  const userList = await users.list([Query.limit(1)]);
  const teamList = await teams.list([Query.limit(1)]);

  return {
    cases: cases.total,
    doctors: doctors.total,
    materials: materials.total,
    users: userList.total,
    teams: teamList.total,
  };
}

export async function getUsers() {
  const {databases, users} = await createAdminClient();
  const userList = await users.list([Query.limit(100)]);

  for (let user of userList.users) {
    const membership = await databases.listDocuments<TeamMember>(
      DATABASE_ID,
      TEAM_MEMBERS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );
    if (membership.documents.length > 0) {
      const teamMember = membership.documents[0];
      const team = await databases.getDocument<Team>(
        DATABASE_ID,
        TEAMS_COLLECTION_ID,
        teamMember.teamId,
        [Query.select(["$id", "name", "ownerId"])]
      );
      user.prefs.team = team;
      user.prefs.role = teamMember.role;
    }
  }

  return userList.users.map((u) => ({
    $id: u.$id,
    name: u.name,
    email: u.email,
    avatar: u.prefs.avatar as string | null,
    team: u.prefs.team || null,
    role: u.prefs.role || null,
  }));
}

export const getAllTeams = async () => {
  const {databases} = await createAdminClient();
  const teams = await databases.listDocuments<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    [Query.limit(100)]
  );
  return teams.documents;
};

export const getAllCases = async () => {
  const {databases, users} = await createAdminClient();
  const cases = await databases.listDocuments<Case>(
    DATABASE_ID,
    CASES_COLLECTION_ID,
    [
      Query.limit(9999),
      Query.orderDesc("date"),
      Query.select([
        "$id",
        "doctorId",
        "patient",
        "date",
        "userId",
        "teamId",
        "data",
        "materialId",
        "invoice",
        "due"
      ])
    ]
  );
  const doctorIds = [...new Set(cases.documents.map((c) => c.doctorId))];

  if (cases.documents.length > 0 && doctorIds) {
    const doctors = await databases.listDocuments<Doctor>(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      [
        Query.equal("$id", doctorIds),
        Query.limit(9999),
        Query.select(["$id", "name"]),
      ]
    );

    const doctorsMap = doctors.documents.reduce((acc, doctor) => {
      acc[doctor.$id] = doctor;
      return acc;
    }, {} as Record<string, Doctor>);

    cases.documents.forEach((c) => {
      const doctor = doctorsMap[c.doctorId];
      if (doctor) {
        c.doctor = doctor;
      }
    });
  }
  const materialIds = [...new Set(cases.documents.map((c) => c.materialId))];

  if (cases.documents.length > 0 && materialIds) {
    const materials = await databases.listDocuments<Material>(
      DATABASE_ID,
      MATERIALS_COLLECTION_ID,
      [
        Query.equal("$id", materialIds),
        Query.limit(9999),
        Query.select(["$id", "name"]),
      ]
    );

    const materialsMap = materials.documents.reduce((acc, material) => {
      acc[material.$id] = material;
      return acc;
    })

    cases.documents.forEach((c) => {
      const material = materialsMap[c.materialId];
      if (material) {
        c.material = material;
      }
    });
  }
  const userIds = [...new Set(cases.documents.map((c) => c.userId))];

  if (cases.documents.length > 0 && userIds) {
    const userList = await users.list([
      Query.equal("$id", userIds),
      Query.limit(100),
    ]);
    cases.documents.forEach((c) => {
      const user = userList.users.find((u) => u.$id === c.userId);
      if (user) {
        c.user = {
          id: user.$id,
          name: user.name,
          email: user.email,
          avatar: user.prefs.avatar,
        };
      }
    });
  }
  return cases.documents;
};
