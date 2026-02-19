import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import DBConnection from "./utils/config/db";
import UserModel from "./utils/models/User";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
    ...authConfig,
    providers: [
        CredentialProvider({
            name: "credentials",
            async authorize(credentials) {
                await DBConnection();
                const user = await UserModel.findOne({ email: credentials?.email });
                if (!user) return null;
                if (credentials?.password !== user.password) return null;
                return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };

            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET_KEY,
        })






    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const { email, name, image } = user;
                    await DBConnection();
                    let existingUser = await UserModel.findOne({ email });

                    if (!existingUser) {
                        // Create new user
                        await UserModel.create({
                            username: name,
                            email: email,
                            password: "google_login_" + Math.random().toString(36).substring(7), // Dummy password
                            role: "user",
                            image: image
                        });
                        console.log("New Google user created");
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating Google user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // 1. If it's the initial sign-in (Credentials or Google)
            if (user) {
                token.id = user.id; // Google 'sub' or DB _id
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;

                // Sync with DB to get ROLE
                await DBConnection();
                const dbUser = await UserModel.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString(); // Ensure we use DB ID
                    token.userId = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                }
            } else if (!token.role) {
                // 2. Fallback: If token exists but has no role (e.g. session persistence issue)
                try {
                    await DBConnection();
                    const dbUser = await UserModel.findOne({ email: token.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.username = dbUser.username;
                    }
                } catch (err) {
                    console.error("Error fetching role in JWT fallback:", err);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.userId || token.id;
                session.user.role = token.role;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        }
    }

});