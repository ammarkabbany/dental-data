"use client"
import { account } from "@/lib/appwrite/client";
import { AUTH_COOKIE } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export default function OAuthCallbackPage() {
  const [loading, setLoading] = useState(true)

  // Validate and store the OAuth callback data in your application
  useEffect(() => {
    async function validateOAuthCallback() {
      const jwt = await account.createJWT();
      Cookies.set(AUTH_COOKIE, jwt.jwt, {expires: 30})
    }
    validateOAuthCallback().then(() => {
      setLoading(false)
      window.location.replace('/dashboard'); // Redirect to your dashboard page after successful login
    });
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      {/* Spinner with Text */}
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{loading ? "Loading..." : "Redirecting..."}</p>
      </div>
    </div>
  );
}
