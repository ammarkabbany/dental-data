import { createSessionClient } from "@/lib/appwrite/appwrite";
import { AUTH_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  const authCookie = cookieStore.get(AUTH_COOKIE);

  if (!authCookie) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    const { account } = await createSessionClient();
    
    account.client.setSession(authCookie.value);
    const user = await account.get();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
}
