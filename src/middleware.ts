import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { AUTH_COOKIE, DATABASE_ID, NEXT_URL, TEAM_MEMBERS_COLLECTION_ID } from './lib/constants'
import { NextResponse } from 'next/server'
import { createAdminClient } from './lib/appwrite/appwrite'
import { Query } from 'node-appwrite'
import { TeamMember } from './types'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/team(.*)', '/account(.*)'])
const isTeamProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/team(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn()
  }
  
  if (isTeamProtectedRoute(req) && userId) {
    const {databases} = await createAdminClient();
    const memberships = await databases.listDocuments<TeamMember>(
      DATABASE_ID,
      TEAM_MEMBERS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.select(['$id'])
      ]
    )
    if (memberships.documents.length === 0) {
      return NextResponse.redirect(`${NEXT_URL}/create-team?redirect=${encodeURIComponent(req.url)}`)
    } else {
      return NextResponse.next()
    }
  }
})
// import { AUTH_COOKIE, NEXT_URL } from "./lib/constants";
// import { createSessionClient } from "./lib/appwrite/appwrite";

// const ProtectedRoutes = ['/dashboard']

// export async function middleware(req: NextRequest) {
//   // Use Next.js's built-in cookies helper (available in middleware)
//   const cookieStore = req.cookies;

//   const pathname = req.nextUrl.pathname;

//   const isProtected = ProtectedRoutes.some((prefix) =>
//     pathname.startsWith(prefix)
//   );

//   if (pathname.startsWith('/auth') && cookieStore.has(AUTH_COOKIE)) {
//     return NextResponse.redirect(`${NEXT_URL}/`)
//   }

//   if (!cookieStore.has(AUTH_COOKIE) && isProtected) {
//     return NextResponse.redirect(`${NEXT_URL}/auth/login?redirect=${encodeURIComponent(pathname)}`)
//   }

//   const session = cookieStore.get(AUTH_COOKIE)?.value
//   if (!session && isProtected) return NextResponse.redirect(`${NEXT_URL}/auth/login?redirect=${encodeURIComponent(pathname)}`)

//   return NextResponse.next();
// }

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
