import { createAdminClient } from "@/lib/appwrite/appwrite";
import { AUTH_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const cookieStore = await cookies();

  if (!email || !password) {
    return NextResponse.json("Invalid request payload", { status: 400 });
  }

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookieStore.set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    const errorJson = error instanceof AppwriteException ? {message: error.message} : {message: "Internal Server Error"};
    return NextResponse.json(errorJson, {status: 500});
  }
}
