import { redirect } from "next/navigation"

export default function RedirectToOnboarding() {
  return (
    redirect('/onboarding')
  )
}