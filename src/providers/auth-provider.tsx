'use client';

import { createContext, useContext } from 'react';
import { User } from '@/types';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useCurrent } from '@/features/auth/hooks/use-current';

type AuthContextType = {
  user: User | null | undefined;
  isLoading: boolean;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {data: user, isLoading} = useCurrent();

  const {mutate} = useLogout();

  const logOut = () => {
    mutate();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logOut }}>
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
