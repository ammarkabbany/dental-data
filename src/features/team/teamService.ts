"use server";
import { createAdminClient } from "@/lib/appwrite/appwrite";
import {
  DATABASE_ID,
  TEAM_MEMBERS_COLLECTION_ID,
  TEAMS_COLLECTION_ID,
} from "@/lib/constants";
import { Team, TeamMember } from "@/types";
import { ID, Permission, Query, Role } from "node-appwrite";

// getById: async (id: string): Promise<Team | undefined> => {
//   return undefined;
// }
const getUserTeams = async (userId: string): Promise<Team[]> => {
  const { databases } = await createAdminClient();
  const memberships = await databases.listDocuments(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.select(["$id", "teamId", "userId", "role"]),
    ],
  );
  const teamIds = memberships.documents.map((m) => m.teamId);
  const teams = await databases.listDocuments<Team>(DATABASE_ID, "teams", [
    Query.contains("$id", teamIds),
    Query.select([
      "$id",
      "name",
      "ownerId",
      "planId",
      "casesUsed",
      "maxCases",
      "planExpiresAt",
      "customPermissions",
    ]),
  ]);
  return teams.documents;
};

async function getTeamMembership(teamId: string, userId: string) {
  const { databases } = await createAdminClient();
  const members = await databases.listDocuments<TeamMember>(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    [Query.equal("teamId", teamId), Query.equal("userId", userId)],
  );

  return members.documents.length > 0 ? members.documents[0] : null;
}

async function addTeamMember(teamId: string, userId: string, role: string) {
  const { databases } = await createAdminClient();
  return await databases.createDocument<TeamMember>(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    ID.unique(),
    {
      userId,
      teamId,
      role,
    },
  );
}

async function createTeam(name: string, userId: string) {
  const { databases } = await createAdminClient();
  const id = ID.unique();
  const team = await databases.createDocument<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    id,
    {
      name,
      ownerId: userId,
      maxCases: 500,
      planExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    [Permission.read(Role.team(id)), Permission.write(Role.team(id, "owner"))],
  );

  // Add creator as team owner
  await addTeamMember(team.$id, userId, "owner");

  return team;
}

async function updateTeam(teamId: string, updates: Partial<Team>) {
  const { databases } = await createAdminClient();
  const team = await databases.updateDocument<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    teamId,
    updates
  );
  return team;
}
async function updateTeamSettings(
  teamId: string,
  updates: { name?: string; currency?: string },
) {
  const { databases, teams } = await createAdminClient();
  const appwriteTeam = await teams.get(teamId);

  if (updates.name) {
    await databases.updateDocument<Team>(
      DATABASE_ID,
      TEAMS_COLLECTION_ID,
      teamId,
      {
        name: updates.name,
      },
    );
    await teams.updateName(teamId, updates.name);
  }
  if (updates.currency) {
    await teams.updatePrefs(teamId, {
      ...appwriteTeam.prefs,
      currency: updates.currency,
    });
  }
}

async function getTeamById(
  teamId: string,
  queries: string[] = [],
): Promise<Team> {
  const { databases } = await createAdminClient();
  const team = await databases.getDocument<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    teamId,
    queries,
  );
  return team;
}

export {
  getUserTeams,
  getTeamMembership,
  addTeamMember,
  createTeam,
  updateTeam,
  updateTeamSettings,
  getTeamById,
};
