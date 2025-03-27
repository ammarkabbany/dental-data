'use client';

import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import * as React from 'react';
import { useAuthSyncEffect } from '@/features/auth/hooks/auth-sync';
import { account } from '@/lib/appwrite/client';
import { getCurrent } from '@/features/auth/queries';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the Auth Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuthSyncEffect();
  const { signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

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
      await account.deleteSession("current");
      
      // Clear local storage items
      window.localStorage.removeItem('favoriteTemplates');
      window.localStorage.removeItem('recentTemplates');
      
      // Clear React Query cache
      queryClient.clear();
      
      // Sign out from Clerk
      await signOut();
      
      // Reset user state
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        isLoading: isLoading || userLoading,
        user,
        logOut: handleLogout,
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
