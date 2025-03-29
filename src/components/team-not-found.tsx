"use client"

import Link from "next/link"
import { Users, PlusCircle, LogIn, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeamNotFound() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full from-sidebar/60 to-sidebar bg-gradient-to-br shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-950 p-3 rounded-full w-fit mb-4">
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-slate-200">Team Required</CardTitle>
          <CardDescription className="text-muted-foreground">
            You need to be part of a team to access this page
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This area of the application is designed for team collaboration. To continue, you&apos;ll need to either create a
            new team or join an existing one.
          </p>

          <div className="bg-amber-950/50 border border-amber-900 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-400 mb-1">Why do I need a team?</h3>
            <p className="text-xs text-amber-300">
              Teams allow you to collaborate with others, share resources, and manage projects together. Most features
              in this application are designed around team-based workflows.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a New Team
          </Button>

          {/* <Button
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Join an Existing Team
          </Button> */}

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

