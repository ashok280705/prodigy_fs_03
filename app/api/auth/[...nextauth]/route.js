// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (
          credentials.email === "Admin@prodigystore.com" &&
          credentials.password === "Wtmg2135@"
        ) {
          return {
            id: "admin-id",
            name: "Admin",
            email: credentials.email,
          };
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      await connectDB();

      // When logging in:
      if (user) {
        if (user.id?.length === 24) {
          token.id = user.id;
        } else {
          // Google login fallback
          const dbUser = await User.findOne({ email: user.email });
          token.id = dbUser?._id?.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },

    async signIn({ user }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        let baseUsername =
          user.name?.split(" ").join("").toLowerCase() || "user";
        let username = baseUsername;
        let count = 1;

        while (await User.findOne({ username })) {
          username = `${baseUsername}${count++}`;
        }

        await User.create({
          name: user.name,
          email: user.email,
          username,
          phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
          password: "",
        });
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };