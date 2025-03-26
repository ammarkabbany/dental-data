import { createAdminClient } from "@/lib/appwrite/appwrite";
import { AUTH_COOKIE, NEXT_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = await req.json();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { users } = await createAdminClient();
    const cookieStore = await cookies();
    const jwt = await users.createJWT(userId, sessionId, 60);
    
    const expiresAt = Date.now() + (60 * 1000);

    cookieStore.set(AUTH_COOKIE, jwt.jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60,
    });

    return NextResponse.json(jwt, { status: 200 });
  } catch (error) {
    console.error("Error creating JWT:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof AppwriteException ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}