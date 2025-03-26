'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import * as React from 'react';
import { useAuthSyncEffect } from '@/features/auth/hooks/auth-sync';
import { account } from '@/lib/appwrite/client';

// type AuthContextType = {
//   user: User | null | undefined;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   logOut: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
//   const {data: user, isLoading} = useCurrent();

//   const {mutate, isSuccess} = useLogout();

//   const logOut = () => {
//     mutate();
//     setIsAuthenticated(false);
//   }

//   React.useEffect(() => {
//     setIsAuthenticated(!!user);
//   }, [isLoading, user, setIsAuthenticated, isSuccess])

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logOut: () => void;
}

// Create the Auth Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {isAuthenticated, isLoading, error} = useAuthSyncEffect();
  const {signOut} = useClerkAuth();

  const handleLogout = async () => {
    await account.deleteSession("current");
    // temporarily remove all local storage items
    window.localStorage.removeItem('favoriteTemplates')
    window.localStorage.removeItem('recentTemplates')
    await signOut();
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, isLoading, logOut: handleLogout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
