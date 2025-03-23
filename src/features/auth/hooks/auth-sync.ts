import { account } from "@/lib/appwrite/client";
import { useEffect, useState } from "react";
import { CreateUser } from "../actions";
import { useAuth, useUser } from "@clerk/nextjs";

export function useAuthSyncEffect() {

  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // check if clerk user is signed in
    if (!isSignedIn || !user) {
      return;
    }
  
    async function syncUser() {
      try {
        // check if there is a appwrite session available
        const appwriteSession = await account.getSession('current');
        setUserId(appwriteSession.userId)
        // return if session was available
        console.log(appwriteSession)
        return;
      } catch (error) {
        console.log('session was not available')
      }
      // create a new user in appwrite if not available
      // or get a token if user already exists
      const appwrite = await CreateUser({
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.username ?? user?.fullName,
        avatar: user?.imageUrl
      })
      // create a new appwrite session if not available
      const session = await account.createSession(appwrite.userId, appwrite.secret)
      setUserId(session.userId);
      console.log(session)
    }
    void syncUser();

    return () => {
      setUserId(null);
    }
  }, [isSignedIn, user])

  return {
    isLoading: !isLoaded || (isSignedIn && userId === null),
    isAuthenticated: isSignedIn && userId !== null
  }
  
} 
