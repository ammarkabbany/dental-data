import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";
import { AUTH_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") as string;
  const secret = request.nextUrl.searchParams.get("secret") as string;
  const provider = request.nextUrl.searchParams.get("provider") as string;
  const cookieStore = await cookies();

  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    try {
      const { account } = await createSessionClient();
      account.client.setSession(session.secret);
      // const identities = await account.listIdentities()
      // if (identities.total > 0) {
      //   const identity = identities.identities.find(identity => identity.provider === provider);
      //   if (identity) {
      //   if (identity?.provider === "google") {
      //     const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      //       headers: {
      //         Authorization: `Bearer ${identity.providerAccessToken}`,
      //       },
      //     })
      //     const { picture } = await response.json();
      //     if (picture) {
      //       account.updatePrefs({...account.getPrefs(), avatar: picture })
      //     }
      //   } else if (identity.provider === "github") {
      //     const response = await fetch('https://api.github.com/user', {
      //       headers: {
      //         Authorization: `Bearer ${identity.providerAccessToken}`,
      //       },
      //     })
      //     const { avatar_url } = await response.json();
      //     if (avatar_url) {
      //       account.updatePrefs({...account.getPrefs(), avatar: avatar_url })
      //     }
      //   }
      // }
      // } 
    } catch (error) {
      console.error("Error fetching user identities:", error);
    }


    cookieStore.set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    });

    return NextResponse.json(session.secret, {status: 200})
  } catch (error) {
    const errorJson =
      error instanceof AppwriteException
        ? { message: error.message }
        : { message: "Internal Server Error" };
    return NextResponse.json(errorJson, { status: 500 });
  }
}
