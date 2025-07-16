"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
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
  const fetchProfile = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setForm(data); // <- sets ALL fields (existing or blank)
    }
  };
  fetchProfile();
}, []);

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
      setMessage("Profile updated successfully!");
    } else {
      setMessage(data.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name || " "}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username || " "}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email (read-only)</label>
          <input
            type="email"
            value={form.email || " "}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone || " "}
            onChange={handleChange}
            className="w-full border p-2 rounded"
             maxLength={10} 
             minLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image || " "}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="text-green-600 text-sm">{message}</p>}
      </form>
    </main>
  );
}