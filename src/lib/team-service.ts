"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite/appwrite";
import {
  DATABASE_ID,
  TEAM_MEMBERS_COLLECTION_ID,
  TEAMS_COLLECTION_ID,
} from "./constants";
import { Team, TeamMember } from "@/types";

// Create a new team
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

// Get teams for a user
async function getUserTeams(userId: string) {
  // First get team memberships for the user
  const { databases } = await createAdminClient();
  const teamMembers = await databases.listDocuments<TeamMember>(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );

  // If no memberships, return empty array
  if (teamMembers.documents.length === 0) {
    return [];
  }

  // Extract team IDs
  const teamIds = teamMembers.documents.map((member) => member.teamId);

  // Fetch teams by ID
  const teams = [];
  for (const teamId of teamIds) {
    try {
      const team = await databases.getDocument<Team>(
        DATABASE_ID,
        TEAMS_COLLECTION_ID,
        teamId
      );
      teams.push({
        ...team,
        total: teamMembers.total,
        members: teamMembers.documents
      });
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
    }
  }

  return teams;
}

// Add a member to a team
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

// Get team members
async function getTeamMembers(teamId: string) {
  const { databases } = await createAdminClient();
  const members = await databases.listDocuments(
    DATABASE_ID,
    TEAM_MEMBERS_COLLECTION_ID,
    [Query.equal("teamId", teamId)]
  );

  return members.documents;
}

// Update member role
async function updateMemberRole(teamMemberId: string, role: string) {
  // return await databases.updateDocument(
  //   databaseId,
  //   teamMembersCollectionId,
  //   teamMemberId,
  //   {
  //     role,
  //     updatedAt: new Date().toISOString(),
  //   }
  // );
}

// Remove team member
async function removeTeamMember(teamMemberId: string) {
  // return await databases.deleteDocument(
  //   databaseId,
  //   teamMembersCollectionId,
  //   teamMemberId
  // );
}

export {
  createTeam,
  getUserTeams,
  addTeamMember,
  getTeamMembers,
  updateMemberRole,
  removeTeamMember,
};