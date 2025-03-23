"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Assuming you're using Clerk
import { Team } from '@/types'; // Adjust the import based on your structure
import { useAuth } from './auth-provider';
import { getAppwriteTeam } from '@/features/team/queries';
import { Models } from 'appwrite';
import { getUserRole } from '@/features/auth/actions';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, TEAMS_COLLECTION_ID } from '@/lib/constants';

interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  appwriteTeam: Models.Team<Models.Preferences> | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useUser();
  
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [appwriteTeam, setAppwriteTeam] = useState<Models.Team<Models.Preferences> | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadCurrentTeam();
    }
    async function loadCurrentTeam() {
      if (!user) {
        setCurrentTeam(null);
        setUserRole(null)
        console.log('Not authorized')
        return;
      }
      setLoading(true);

      // const teams = await getUserTeams(user.id);
      const teamId = localStorage.getItem('currentTeamId');
      await getAppwriteTeam().then(async (team) => {
        if (team) {
          const teamDoc = await databases.getDocument<Team>(
            DATABASE_ID,
            TEAMS_COLLECTION_ID,
            team.$id
          )
          const role = await getUserRole(team.$id, user.id);
          setAppwriteTeam(team);
          setCurrentTeam(teamDoc);
          setUserRole(role);
        }
      })
      setLoading(false);
    }
  },[
    isLoading,
    isAuthenticated,
    user,
  ])

  return (
    <TeamContext.Provider value={{ currentTeam, setCurrentTeam, appwriteTeam, userRole, isLoading: loading, isAuthenticated }}>
      {/* <SimplePageLoader isLoading={loading} fullScreen /> */}
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
