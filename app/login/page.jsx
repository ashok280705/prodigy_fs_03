"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/Prodigy-store");
    }
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/Prodigy-store");
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left: Login form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-orange-500 mb-2">
            Prodigy-store
          </h2>
          <p className="text-gray-500 mb-1">Welcome back !!!</p>
          <h1 className="text-3xl font-bold mb-6">Sign in</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition-colors"
            >
              SIGN IN →
            </button>
          </form>

          <div className="my-6 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center border border-gray-300 p-3 rounded-full hover:bg-gray-50 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M533.5 278.4c0-17.4-1.4-34-4-50.3H272v95.2h147.3c-6.3 34-25 62.7-53.4 82v68h86.2c50.5-46.6 79.4-115.3 79.4-194.9z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c72.7 0 133.7-24 178.3-65.1l-86.2-68c-24 16.1-54.6 25.7-92 25.7-70.7 0-130.7-47.6-152.2-111.5H32.8v69.9C77.3 486 168.8 544.3 272 544.3z"
                fill="#34A853"
              />
              <path
                d="M119.8 325.4c-10.8-32-10.8-66.7 0-98.7V157H32.8c-38.4 76.8-38.4 167.5 0 244.3l87-69.9z"
                fill="#FBBC05"
              />
              <path
                d="M272 107.7c39.5 0 75 13.6 103.1 40.3l77.2-77.2C405.7 25.4 344.7 0 272 0 168.8 0 77.3 58.3 32.8 157l87 69.9c21.5-63.9 81.5-111.5 152.2-111.5z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex flex-1 bg-orange-50 items-center justify-center">
        <div className="max-w-md text-center">
          <img
            src="shop.png"
            alt="Shopping Illustration"
            className="w-100 mx-auto animate-bounce"
          />
          <p className="text-orange-400 mt-4 font-medium">
            Shop smarter with us!
          </p>
        </div>
      </div>
    </main>
  );
}