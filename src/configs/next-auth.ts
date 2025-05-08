import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter email",
                },
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Enter username",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!(credentials?.email || credentials?.username) || !credentials?.password)
                    return null;

                try {
                    const user = await prisma.user.findFirst({
                        where: credentials.username
                            ? { username: credentials.username }
                            : { email: credentials.email },
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            password: true,
                        },
                    });

                    console.log("Authorize: user =", user);

                    if (!user || !user.password) return null;

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) return null;

                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
            }
            return token
        },
        session({ session, token }) {
            // Ensure session.user exists before assigning
            session.user = session.user || {};
            session.user.id = token.id as string | null;
            session.user.username = token.username as string | null;
            session.user.email = token.email as string | null;
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};