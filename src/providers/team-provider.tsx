'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getTeamMembers, getUserTeams } from '@/lib/team-service';
import { Team } from '@/types';
import SimplePageLoader from '@/components/page-loader';
import { useUser } from '@clerk/nextjs';

type TeamContextType = {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  isLoading: boolean;
  userRole: string | null;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSignedIn) {
      setTeams([]);
      setCurrentTeam(null);
      setIsLoading(false);
      return;
    }

    const loadTeams = async () => {
      setIsLoading(true);
      try {
        const userTeams = await getUserTeams(user.id);
        setTeams(userTeams);
        
        // Get stored team or use first available
        const storedTeamId = localStorage.getItem('currentTeamId');
        if (storedTeamId && userTeams.some(team => team.$id === storedTeamId)) {
          const team = userTeams.find(t => t.$id === storedTeamId) || null;
          setCurrentTeam(team);
          if (team) {
            await loadUserRole(team.$id);
          }
        } else if (userTeams.length > 0) {
          setCurrentTeam(userTeams[0]);
          await loadUserRole(userTeams[0].$id);
          localStorage.setItem('currentTeamId', userTeams[0].$id);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) loadTeams();
  }, [user, isSignedIn, isLoaded]);

  const loadUserRole = async (teamId: string) => {
    if (!user) return;
    
    try {
      const members = await getTeamMembers(teamId);
      const userMember = members.find(member => member.userId === user.id);
      setUserRole(userMember?.role || null);
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
        teams,
        currentTeam,
        setCurrentTeam: handleSetCurrentTeam,
        isLoading,
        userRole,
      }}
    >
      <SimplePageLoader isLoading={isLoading} fullScreen />
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