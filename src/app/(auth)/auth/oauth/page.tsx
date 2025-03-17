"use client"
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OAuthCallbackPage() {
  const params = useSearchParams();
  const userId = params.get("userId") as string;
  const secret = params.get("secret") as string;
  const provider = params.get("provider") as string;
  const [loading, setLoading] = useState(true)

  // Validate and store the OAuth callback data in your application
  useEffect(() => {
    async function validateOAuthCallback() {
      const response = await fetch(
        `/api/oauth?userId=${userId}&secret=${secret}&provider=${provider}`
      );
      if (response.ok) {
        window.location.replace('/dashboard');
      } else {
        console.error("Failed to validate OAuth callback:", response.statusText);
        window.location.replace('/auth/login');
      }
    }
    if (userId && secret) validateOAuthCallback();
    setLoading(false)
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
