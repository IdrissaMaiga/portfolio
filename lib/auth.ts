import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "maigadrisking@gmail.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await db.user.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
        update: {
          name: user.name,
          image: user.image,
        },
      });
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });
        if (dbUser) token.userId = dbUser.id;
      }
      token.isOwner = (token.email ?? user?.email) === OWNER_EMAIL;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.userId) {
          (session.user as { id?: string }).id = token.userId as string;
        }
        (session.user as { isOwner?: boolean }).isOwner = token.isOwner as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
