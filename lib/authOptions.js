import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import dbConnect from "@/db/connect";
import User from "@/models/user";

const AUTH_INTENT_COOKIE = "auth_intent";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        async signIn({ user, account }) {
            if (!["github", "google"].includes(account.provider)) return false;
            if (!user.email) return false;

            const cookieStore = await cookies();
            const intent = cookieStore.get(AUTH_INTENT_COOKIE)?.value || "login";

            await dbConnect();
            const existing = await User.findOne({ email: user.email });

            if (intent === "signup") {
                if (existing) {
                    return "/login?error=exists";
                }
                await User.create({
                    email: user.email,
                    username: user.email.split("@")[0],
                    name: user.name,
                    profilepic: user.image,
                });
            } else {
                if (!existing) {
                    return "/signup?error=noaccount";
                }
            }

            cookieStore.delete(AUTH_INTENT_COOKIE);
            return true;
        },

        async session({ session }) {
            await dbConnect();
            const dbuser = await User.findOne({ email: session.user.email });
            if (dbuser) {
                session.user.username = dbuser.username;
            }
            return session;
        },
    },
};