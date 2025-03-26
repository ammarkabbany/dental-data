import { account } from "@/lib/appwrite/client";
import { useEffect, useState } from "react";
import { CreateUser } from "../actions";
import { useAuth, useUser } from "@clerk/nextjs";

export function useAuthSyncEffect() {

  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [userId, setUserId] = useState<string | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // const refreshToken = async () => {
  //   try {
  //     const response = await fetch(`/api/auth/jwt`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId, sessionId }),
  //     });
  
  //     const data = await response.json();
  
  //     if (!response.ok) {
  //       throw new Error(data.error || 'Failed to get JWT');
  //     }
      
  //     // console.log("token refreshed", data)
  //   } catch (error) {
  //     console.error('Token refresh error:', error);
  //   }
  // };
  // // Add token refresh logic
  // useEffect(() => {
  //   if (!userId || !sessionId) return;

  //   // Initial token refresh
  //   refreshToken();

  //   // Refresh token every 45 seconds (before 60-second expiration)
  //   const refreshInterval = setInterval(refreshToken, 45 * 1000);

  //   return () => clearInterval(refreshInterval);
  // }, [userId, sessionId]);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }
  
    async function syncUser() {
      setLoading(true);
      try {
        const appwriteSession = await account.getSession('current');
        setUserId(appwriteSession.userId);
        setSessionId(appwriteSession.$id);
        setLoading(false);
        return;
      } catch (error) {        
        try {
          const appwrite = await CreateUser({
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.username ?? user?.fullName,
            avatar: user?.imageUrl
          });
          
          const session = await account.createSession(appwrite.userId, appwrite.secret);
          setUserId(session.userId);
          setSessionId(session.$id);
          // setUserId(user?.id)
        } catch (createError) {
          setError(createError as Error);
          console.error('User creation error:', createError);
        }
      } finally {
        setLoading(false);
      }
    }
    void syncUser();

    return () => {
      setUserId(null);
      setSessionId(null);
      setError(null);
    }
  }, [isSignedIn, user]);

  return {
    isLoading: !isLoaded || Loading,
    isAuthenticated: (isSignedIn && userId !== null) || false,
    error
  }
}
