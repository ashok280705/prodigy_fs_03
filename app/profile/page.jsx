"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      }
    };
    fetchProfile();
  }, [status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Profile updated successfully!");
    } else {
      setMessage(data.error || "❌ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          👤 My Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email (read-only)
            </label>
            <input
              type="email"
              value={form.email || ""}
              readOnly
              className="w-full border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              maxLength={10}
              minLength={10}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="10-digit number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Profile Image URL
            </label>
            <input
              type="text"
              name="image"
              value={form.image || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="https://..."
            />
          </div>

          {form.image && (
            <div className="flex justify-center">
              <img
                src={form.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow-md border border-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-blue-600 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p className="text-center text-green-600 font-medium">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}