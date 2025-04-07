"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function NotFound({href = "/", className = ""}) {

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="text-center">
        <h1 className={`text-9xl font-extrabold tracking-widest`}>
          404
        </h1>
        <p className="text-2xl font-semibold text-muted-foreground mt-4 mb-8">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! It seems you got lost. Let&apos;s get you back to safety.
        </p>
        <Button variant={"default"} size={"lg"} asChild>
          <Link
            href={href}
            className="inline-flex items-center px-6 py-3 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

