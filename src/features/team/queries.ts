import { teams } from "@/lib/appwrite/client"

export const getAppwriteTeam = async (teamId?: string) => {
  try {
    const teamList = await teams.list();
    return teamList.teams[0];
  } catch (error) {
    console.log(error)
  }
}