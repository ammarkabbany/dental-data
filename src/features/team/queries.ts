import { teams } from "@/lib/appwrite/client"
import { Query } from "appwrite";

export const getAppwriteTeam = async (teamId?: string) => {
  try {
    const teamList = await teams.list();
    return teamList.teams[0];
  } catch (error) {
    return null;
  }
}

export const getAppwriteMembership = async (teamId: string, userId: string) => {
  try {
    const membershipList = await teams.listMemberships(teamId, [
      Query.equal("userId", userId),
    ]);
    return membershipList.memberships[0];
  } catch (error) {
    console.log(error)
    return null;
  }
}