'use client';

import { createContext, useContext } from 'react';
import { User } from '@/types';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useCurrent } from '@/features/auth/hooks/use-current';
import * as React from 'react';

type AuthContextType = {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
  const {data: user, isLoading} = useCurrent();

  const {mutate, isSuccess} = useLogout();

  const logOut = () => {
    mutate();
    setIsAuthenticated(false);
  }

  React.useEffect(() => {
    setIsAuthenticated(!!user);
  }, [isLoading, user, setIsAuthenticated, isSuccess])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
