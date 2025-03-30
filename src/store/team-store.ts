import { Team } from "@/types";
import { Models } from "appwrite";
import { create } from "zustand";

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  currentAppwriteTeam: Models.Team<Models.Preferences> | null;
  setCurrentAppwriteTeam: (
    team: Models.Team<Models.Preferences> | null
  ) => void;
  membership: Models.Membership | null;
  setMembership: (membership: Models.Membership | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  currentTeam: null,
  setCurrentTeam: (team) => set({ currentTeam: team }),
  currentAppwriteTeam: null,
  setCurrentAppwriteTeam: (team) => set({ currentAppwriteTeam: team }),
  membership: null,
  setMembership: (membership) => set({ membership }),
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
}));

export default useTeamStore;
