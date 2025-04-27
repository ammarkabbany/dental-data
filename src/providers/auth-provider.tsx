'use client';

import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as React from 'react';
import { useAuthSyncEffect } from '@/features/auth/hooks/auth-sync';
import { account } from '@/lib/appwrite/client';
import { getCurrent } from '@/features/auth/queries';
import { useQueryClient } from '@tanstack/react-query';
import { NEXT_URL } from '@/lib/constants';
import { User } from '@/types';
import { redirect, RedirectType } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  logOut: () => Promise<void>;
  handleLogin: (uri?: string) => void;
  refreshUser: () => Promise<void>;
}

// Create the Auth Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthSyncEffect();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleLogin = (uri: string = "/") => {
    redirect(`${NEXT_URL}/login?redirect=${encodeURIComponent(uri)}`);
  }

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refreshUser();
    } else if (!isAuthenticated) {
      setUser(null);
    }
  }, [isAuthenticated, isLoading]);

  // Refresh user data function
  const refreshUser = async () => {
    try {
      setUserLoading(true);
      const currentUser = await getCurrent();
      setUser(currentUser);
      setIsAdmin(currentUser?.labels.includes('admin') ?? false);
      queryClient.setQueryData(['current'], currentUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear Appwrite session
      try {
        await account.deleteSession("current");
      } catch (error) {
        console.error('Error deleting session:', error);
        return;
      }
      // Clear local storage items
      window.localStorage.removeItem('favoriteTemplates');
      window.localStorage.removeItem('recentTemplates');

      // Reset user state
      setUser(null);
      setIsAdmin(false);
      setUserLoading(false);
      // Clear React Query cache
      queryClient.clear();

      window.location.replace(`${NEXT_URL}/login`)
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        isLoading: isLoading || userLoading,
        user,
        isAdmin,
        logOut: handleLogout,
        handleLogin,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
