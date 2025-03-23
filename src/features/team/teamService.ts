"use server"
import { createAdminClient } from "@/lib/appwrite/appwrite";
import { DATABASE_ID, TEAM_MEMBERS_COLLECTION_ID, TEAMS_COLLECTION_ID } from "@/lib/constants";
import { Team, TeamMember } from "@/types";
import { ID, Query } from "node-appwrite";


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
    ]
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
}

async function getTeamMembership(teamId: string, userId: string) {
  const { databases } = await createAdminClient();
  const members = await databases.listDocuments<TeamMember>(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    [Query.equal("teamId", teamId), Query.equal("userId", userId)]
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
    }
  );
}

async function createTeam(name: string, userId: string) {
  const { databases } = await createAdminClient();
  const initialTeam = await databases.createDocument<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    ID.unique(),
    {
      name,
      userId,
    }
  );

  // Add creator as team owner
  const member = await addTeamMember(initialTeam.$id, userId, "owner");
  const team = await databases.updateDocument<Team>(
    DATABASE_ID,
    TEAMS_COLLECTION_ID,
    initialTeam.$id,
    {
      members: [member],
    }
  );

  return team;
}

export {
  getUserTeams,
  getTeamMembership,
}
