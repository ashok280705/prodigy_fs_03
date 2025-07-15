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

    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      // Build base username from name
      let baseUsername = user.name?.split(" ").join("").toLowerCase() || "user";
      let username = baseUsername;

      // Check for collisions
      let count = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${count}`;
        count++;
      }

      await User.create({
        name: user.name,
        email: user.email,
        username,
        phone: "",         // placeholder
        password: "",      // placeholder
      });
    }

    return true;
  },
},
}; // ✅ CLOSE THIS OBJECT PROPERLY!

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };