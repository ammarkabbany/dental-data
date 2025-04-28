import { useEffect } from "react"
import LoadingSpinner from "../ui/loading-spinner"

export default function RedirectToOnboarding() {
  useEffect(() => {
    window.location.href = "/onboarding"
  }, [])

  return (
    <main className="">
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    </main>
  )
}
