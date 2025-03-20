import { AUTH_COOKIE, NEXT_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const cookieStore = req.cookies;

  const session = cookieStore.get(AUTH_COOKIE)
  if (!session) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  // Clear Appwrite session
  // const { account } = await createSessionClient();
  (await cookies()).delete(AUTH_COOKIE);
  // await account.deleteSession('current');

  return NextResponse.redirect(new URL(`${NEXT_URL}/auth/login`, req.url))
}
