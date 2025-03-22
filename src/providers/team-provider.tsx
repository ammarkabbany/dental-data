'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { Team } from '@/types';
import { useUserTeams } from '@/features/auth/hooks/use-team';

type TeamContextType = {
  teams: Team[] | undefined;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  isLoading: boolean;
  userRole: string | null;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { 
    data: teamsData, 
    isLoading: isTeamsLoading,
    refetch: refetchTeams,
    error
  } = useUserTeams(user?.$id);
  
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Force refetch teams when user changes (especially on reload)
  useEffect(() => {
    if (user?.$id) {
      refetchTeams();
    }
  }, [user?.$id, refetchTeams]);

  // Handle teams data changes and restore current team from localStorage
  useEffect(() => {
    if (!user) {
      setCurrentTeam(null);
      setUserRole(null);
      localStorage.removeItem('currentTeamId');
      return;
    }
    
    if (!teamsData?.teams || teamsData.teams.length === 0) {
      console.log('No teams available for user', user.$id);
      setCurrentTeam(null);
      setUserRole(null);
      localStorage.removeItem('currentTeamId');
      return;
    }

    // Get stored team or use first available
    const storedTeamId = localStorage.getItem('currentTeamId');
    let teamToSet: Team | null = null;
    
    // Try to find the stored team ID in the available teams
    if (storedTeamId) {
      teamToSet = teamsData.teams.find(team => team.$id === storedTeamId) || null;
    }
    
    // If no stored team was found, use the first team
    if (!teamToSet && teamsData.teams.length > 0) {
      teamToSet = teamsData.teams[0];
      localStorage.setItem('currentTeamId', teamToSet.$id);
    }
    
    // Update current team state
    setCurrentTeam(teamToSet);
    
    // Set user role for the selected team
    if (teamToSet && teamsData.memberships) {
      const membership = teamsData.memberships.find(
        m => m.teamId === teamToSet?.$id && m.userId === user.$id
      );
      setUserRole(membership?.role || null);
    } else {
      setUserRole(null);
    }
    
  }, [user, teamsData]);

  // Handle team switching
  const handleSetCurrentTeam = (team: Team) => {
    setCurrentTeam(team);
    localStorage.setItem('currentTeamId', team.$id);
    
    if (teamsData?.memberships && user) {
      const role = teamsData.memberships.find(
        m => m.teamId === team.$id && m.userId === user.$id
      )?.role;
      setUserRole(role || null);
    }
  };

  // Debug logging
  useEffect(() => {
    if (error) {
      console.error('Error loading teams:', error);
    }
  }, [error]);

  const isLoading = isAuthLoading || isTeamsLoading;

  return (
    <TeamContext.Provider
      value={{
        teams: teamsData?.teams,
        currentTeam,
        setCurrentTeam: handleSetCurrentTeam,
        isLoading,
        userRole,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
