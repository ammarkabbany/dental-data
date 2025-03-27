"use server";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import {
  AUTH_COOKIE,
  DATABASE_ID,
  DOCTORS_COLLECTION_ID,
  NEXT_URL,
  TEAM_MEMBERS_COLLECTION_ID,
} from "@/lib/constants";
import { cookies } from "next/headers";
import { TeamMember } from "@/types";
import { Query } from "node-appwrite";

export const getUserInfo = async (userId: string) => {
  if (!userId) return null;
  try {
    const { users } = await createAdminClient();
    const user = await users.get(userId);
    const avatar = user.prefs.avatar;
    return {
      id: user.$id,
      name: user.name,
      email: user.email,
      avatar,
    };
  } catch (error) {
    return null;
  }
};

interface CreateUserProps {
  userId?: string;
  name?: string | null;
  email?: string;
  avatar?: string;
}

export async function CreateUser({
  userId,
  name,
  email,
  avatar,
}: CreateUserProps) {
  if (!userId) {
    throw new Error("User Id must be provided");
  }
  const { users } = await createAdminClient();

  try {
    const user = await users.get(userId);
    if (user) {
      if (name && user.name !== name) {
        await users.updateName(userId, name);
      }
      await users.updatePrefs(userId, { avatar });
      const token = await users.createToken(userId);
      return token;
    }
  } catch (error) {
    console.log(error);
  }

  await users.create(userId, email, undefined, undefined, name ?? "");
  await users.updateEmailVerification(userId, true);
  await users.updatePrefs(userId, { avatar });

  const token = await users.createToken(userId);
  return token;
}

export const getSessionCookie = async () => {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(AUTH_COOKIE);
  return sessionSecret?.value;
};

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
    console.error("Error loading user role:", error);
    return null;
  }
};
