import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import DBConnection from "./utils/config/db";
import UserModel from "./utils/models/User";
import { authConfig } from "./auth.config";

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
        })
    ],
});