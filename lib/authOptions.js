import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/db/connect";
import User from "@/models/user";

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

    callbacks: {
        async signIn({ user, account }) {
            if (!["github", "google"].includes(account.provider)) return false;
            if (!user.email) return false;

            await dbConnect();
            const currentuser = await User.findOne({ email: user.email });

            if (!currentuser) {
                const newuser = await User.create({
                    email: user.email,
                    username: user.email.split("@")[0],
                    name: user.name,
                    profilepic: user.image,
                });
                user.name = newuser.username;
            }
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