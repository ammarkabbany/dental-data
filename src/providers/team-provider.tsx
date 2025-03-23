"use client"
import React, { createContext, useContext } from 'react';
import { Team } from '@/types'; // Adjust the import based on your structure
import { useAuth } from './auth-provider';
import { Models } from 'appwrite';
import { useTeamData } from '@/features/team/hooks/use-team';

interface TeamContextType {
  currentTeam: Team | null;
  // setCurrentTeam: (team: Team | null) => void;
  appwriteTeam: Models.Team<Models.Preferences> | null;
  userRole: string | null;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();
  
  const { data, isLoading: isTeamLoading } = useTeamData();
  const values: TeamContextType = {
    currentTeam: null,
    appwriteTeam: null,
    userRole: null,
    isLoading: isLoading || isTeamLoading,
  }
  if (data) {
    const {team: currentTeam, appwriteTeam, role: userRole} = data;
    values.currentTeam = currentTeam;
    values.appwriteTeam = appwriteTeam;
    values.userRole = userRole;
  }

  return (
    <TeamContext.Provider value={values}>
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook to use the Team context
export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
