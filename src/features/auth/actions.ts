"use server"

import { avatars } from "@/lib/appwrite/client";
import { createAdminClient } from "@/lib/appwrite/appwrite"
import { AUTH_COOKIE, DATABASE_ID, TEAM_MEMBERS_COLLECTION_ID } from "@/lib/constants";
import { cookies } from "next/headers";
import { getTeamMembers } from "@/lib/team-service";
import { TeamMember } from "@/types";
import { Query } from "node-appwrite";

export const getUserInfo = async (userId: string) => {
  if (!userId) return null;
  try {
    const {users} = await createAdminClient();
    const user = await users.get(userId);
    const avatar = avatars.getInitials(user.name);
    return {
      id: user.$id,
      name: user.name,
      email: user.email,
      avatar,
    }
  } catch (error) {
    return null;
  }
}

export const getUserJWT = async (userId: string) => {
  try {
    const { users } = await createAdminClient();
    return users.createJWT(userId);
  } catch (error) {
    console.error('Error fetching user JWT:', error);
    return null;
  }
}

export const getSessionCookie = async () => {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(AUTH_COOKIE);
  return sessionSecret?.value;
}

export const getUserRole = async (teamId: string, userId: string) => {
  try {
    const { databases } = await createAdminClient();
    const membership = await databases.listDocuments<TeamMember>(
      DATABASE_ID,
      TEAM_MEMBERS_COLLECTION_ID,
      [Query.equal("teamId", teamId), Query.equal("userId", userId)]
    );
    // const members = await getTeamMembers(teamId);
    // const userMember = members.find(member => member.userId === userId);
    // return userMember?.role || null;
    if (membership.documents.length === 0) return null; // User is not a member of the team
    return membership.documents[0].role;
  } catch (error) {
    console.error('Error loading user role:', error);
    return null;
  }
}