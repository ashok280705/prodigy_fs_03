import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Hardcoded Admin check
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

        // ✅ Normal user check
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) return null;

        return {
          id: user._id,
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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      // If Google login, sync user to DB
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        let baseUsername = user.name?.split(" ").join("").toLowerCase() || "user";
        let username = baseUsername;

        let count = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}${count}`;
          count++;
        }

        await User.create({
          name: user.name,
          email: user.email,
          phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Generate a random phone number
          username,
          password: "",
        });
      }

      return true;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };