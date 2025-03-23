import { TeamProvider } from "@/providers/team-provider";

export default function TeamLayout({children}: {children: React.ReactNode}) {

  return (
    <TeamProvider>
      {children}
    </TeamProvider>
  )
}