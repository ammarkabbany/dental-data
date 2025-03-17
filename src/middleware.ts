// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, NEXT_URL } from "./lib/constants";

const ProtectedRoutes = ['/dashboard']

export async function middleware(req: NextRequest) {
  // Use Next.js's built-in cookies helper (available in middleware)
  const cookieStore = req.cookies;

  const pathname = req.nextUrl.pathname;

  const isProtected = ProtectedRoutes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (pathname.startsWith('/auth') && cookieStore.has(AUTH_COOKIE)) {
    return NextResponse.redirect(`${NEXT_URL}/`)
  }

  if (!cookieStore.has(AUTH_COOKIE) && isProtected) {
    return NextResponse.redirect(`${NEXT_URL}/auth/login?redirect=${encodeURIComponent(pathname)}`)
  }

  const session = cookieStore.get(AUTH_COOKIE)?.value
  if (!session && isProtected) return NextResponse.redirect(`${NEXT_URL}/auth/login?redirect=${encodeURIComponent(pathname)}`)

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
