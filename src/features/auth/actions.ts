"use server"

import { avatars } from "@/lib/appwrite/client";
import { createAdminClient } from "@/lib/appwrite/appwrite"
import { AUTH_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";

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