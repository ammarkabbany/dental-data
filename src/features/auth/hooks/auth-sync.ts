import { account } from "@/lib/appwrite/client";
import { AppwriteException } from "appwrite";
import { useEffect, useState } from "react";

export function useAuthSyncEffect() {

  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | AppwriteException | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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
    //   if (!isSignedIn || !user) {
    //     setLoading(false);
    //     return;
    //   }
    // 
    async function syncUser() {
      setLoading(true);
      try {
        await account.getSession('current');
        setIsSignedIn(true);
        // if (appwriteUser.prefs.avatar !== user?.imageUrl) {
        //   await account.updatePrefs({
        //     ...appwriteUser.prefs,
        //     avatar: user?.imageUrl,
        //   })
        // }
        // if (user && user.fullName && appwriteUser.name !== user.fullName) {
        //   await account.updateName(user.fullName);
        // }
        setLoading(false);
        return;
      } catch (error) {
        setError(error as any);
        setIsSignedIn(false);
        return;
      } finally {
        setLoading(false);
      }
    }
    void syncUser();

    return () => {
      setError(null);
    }
  }, []);

  return {
    isLoading: Loading,
    isAuthenticated: !Loading && isSignedIn,
    error
  }
}
