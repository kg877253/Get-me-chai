import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import dbConnect from "@/db/connect";
import User from "@/models/user";

const AUTH_INTENT_COOKIE = "auth_intent";
const VALID_ROLES = ["user", "creator"];

// Agar base username already liya hua hai to random suffix laga do
async function getUniqueUsername(base) {
    let candidate = base;
    let attempt = 0;

    while (await User.findOne({ username: candidate })) {
        attempt++;
        const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random
        candidate = `${base}${suffix}`;
        if (attempt > 10) {
            // extreme edge case, timestamp se guaranteed unique
            candidate = `${base}${Date.now()}`;
            break;
        }
    }
    return candidate;
}

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
            const rawRole = cookieStore.get("role")?.value;
            const role = VALID_ROLES.includes(rawRole) ? rawRole : "user";

            await dbConnect();
            const existing = await User.findOne({ email: user.email });

            if (intent === "signup") {
                if (existing) {
                    return "/login?error=exists";
                }
                const baseUsername = user.email.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "");
                const username = await getUniqueUsername(baseUsername || "user");

                await User.create({
                    email: user.email,
                    username,
                    name: user.name,
                    profilepic: user.image,
                    role,
                });
            } else {
                if (!existing) {
                    return "/signup?error=noaccount";
                }
            }
            cookieStore.delete(AUTH_INTENT_COOKIE);
            cookieStore.delete("role");
            return true;
        },

        async session({ session }) {
            await dbConnect();
            const dbuser = await User.findOne({ email: session.user.email });
            if (dbuser) {
                session.user.username = dbuser.username;
                session.user.role = dbuser.role;
            }
            return session;
        },
    },
};