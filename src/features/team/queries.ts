import { teams } from "@/lib/appwrite/client"

export const getAppwriteTeam = async (teamId: string) => {
  try {
    const team = await teams.get(teamId);
    return team;
  } catch (error) {
    console.log(error)
  }
}