"use client"

import Link from "next/link"
import { LogIn, ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { usePathname } from "next/navigation"

export default function AuthRequired() {
  const {handleLogin} = useAuth();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full from-sidebar/60 to-sidebar bg-gradient-to-br shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-950 p-3 rounded-full w-fit mb-4">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-slate-200">Authentication Required</CardTitle>
          <CardDescription className="text-muted-foreground">
            You need to be signed in to access this page
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This area of the application requires authentication. To continue, please sign in with your account or create a new one.
          </p>

          <div className="bg-red-950/50 border border-red-900 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-400 mb-1">Why do I need to sign in?</h3>
            <p className="text-xs text-red-300">
              Authentication helps us keep your data secure and provides you with a personalized experience. 
              It ensures that only authorized users can access sensitive information and features.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={() => handleLogin(pathname)}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white" 
            size="lg"
          >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
          </Button>

          <div className="pt-2 w-full">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}