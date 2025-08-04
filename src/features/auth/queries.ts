import { account, avatars } from "@/lib/appwrite/client";
import { User } from "@/types";

export const getCurrent = async () => {
  try {
    const user = await account.get();
    const prefAvatar = user.prefs.avatar;
    const avatar = avatars.getInitials(user.name, 50, 50, "7c68fe");
    return {
      ...user,
      avatar: prefAvatar ?? avatar,
    };
  } catch (error) {
    return null;
  }
}

// export const logoutUser = async () => {
//   const cookieStore = await cookies();
//   const { account } = await createSessionClient();
//   await account.deleteSession('current');
//   cookieStore.delete(AUTH_COOKIE);
// }

// export const authorizeClerk = async () => {
//   const cookieStore = await cookies();
//   const user = await currentUser();

//   const {account} = await createSessionClient();
//   const cookie = cookieStore.get(AUTH_COOKIE);

//   if (cookie) {
//     account.client.setSession(cookie.value);
//     return await account.get();
//   }

//   const generateRandomPassword = () => {
//     const length = 32;
//     const charset =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < length; i++) {
//       result += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
//     return result;
//   }

//   if (!user) {
//     return null;
//   }

//   const email = user.primaryEmailAddress!.emailAddress;

//   try {
//     const { account, users } = await createAdminClient();
//     const hasUser = (await users.list([Query.equal('$id', user.id)])).total > 0;

//     if (hasUser) {
//       const session = await users.createSession(user.id);
//       cookieStore.set(AUTH_COOKIE, session.secret, {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 7,
//       });
//       return await getCurrent();
//     } else {
//       const newUser = await account.create(user.id, email, generateRandomPassword(), user.username || undefined);
//       const session = await users.createSession(newUser.$id);
//       cookieStore.set(AUTH_COOKIE, session.secret, {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 7,
//       });
//       return await getCurrent();
//     }

//   } catch (error) {
//     const errorJson =
//       error instanceof AppwriteException
//         ? { message: error.message }
//         : { message: "Internal Server Error" };
//     return null
//   }
// }
