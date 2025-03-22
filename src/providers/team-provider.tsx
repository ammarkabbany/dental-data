'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { getTeamMembers, getUserTeams } from '@/lib/team-service';
import { Team } from '@/types';
import SimplePageLoader from '@/components/page-loader';
import { useUserTeams } from '@/features/auth/hooks/use-team';
import { getUserRole } from '@/features/auth/actions';
import { useQuery } from '@tanstack/react-query';
import { useTeamRole } from '@/features/auth/hooks/use-team-role';

type TeamContextType = {
  teams: Team[] | undefined;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  isLoading: boolean;
  userRole: string | null;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const {data: teamsData} = useUserTeams(user?.$id);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // setTeams([]);
      setCurrentTeam(null);
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    const loadTeams = async () => {
      setIsLoading(true);
      try {
        if (!teamsData || !teamsData.teams) {
          setCurrentTeam(null);
          setUserRole(null);
          localStorage.removeItem('currentTeamId');
          setIsLoading(false);
          return;
        }
        // Get stored team or use first available
        const storedTeamId = localStorage.getItem('currentTeamId');
        if (storedTeamId && teamsData.teams.some(team => team.$id === storedTeamId)) {
          const team = teamsData.teams.find(t => t.$id === storedTeamId) || null;
          setCurrentTeam(team);
          if (team) {
            await loadUserRole(team.$id);
          }
        } else if (teamsData.teams.length > 0) {
          setCurrentTeam(teamsData.teams[0]);
          await loadUserRole(teamsData.teams[0].$id);
          localStorage.setItem('currentTeamId', teamsData.teams[0].$id);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, [user, teamsData]);

  const loadUserRole = async (teamId: string) => {
    if (!user) return;
    
    try {
      const role = teamsData?.memberships.find(m => m.teamId === teamId && m.userId === user.$id)?.role;
      setUserRole(role || null);
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole(null);
    }
  };

  const handleSetCurrentTeam = (team: Team) => {
    setCurrentTeam(team);
    localStorage.setItem('currentTeamId', team.$id);
    loadUserRole(team.$id);
  };

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
      {/* <SimplePageLoader isLoading={isLoading} fullScreen /> */}
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
