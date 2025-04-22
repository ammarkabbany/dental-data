"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";

export async function signUpWithGoogle() {
	const { account } = await createSessionClient();

	const heads = await headers();
	const origin = heads.get("origin")

	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Google,
		// `${origin}/auth/oauth?provider=google`,
		`${origin}/`,
		`${origin}/auth/register`,
	);

	return redirect(redirectUrl);
};
export async function signUpWithGithub() {
	const { account } = await createSessionClient();

	const heads = await headers();
	const origin = heads.get("origin")

	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${origin}/auth/oauth?provider=github`,
		`${origin}/auth/register`,
	);

	return redirect(redirectUrl);
};
