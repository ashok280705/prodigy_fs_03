"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold text-white">
        <Link href="/">🥬 Prodigy Store</Link>
      </div>

      <div className="flex items-center gap-6 relative">
        <Link
          href="/Prodigy-store"
          className="text-white hover:text-yellow-100 font-medium transition-colors"
        >
          Home
        </Link>

        <Link
          href="/cart"
          className="text-white hover:text-yellow-100 font-medium transition-colors"
        >
          Cart
        </Link>

        <Link
          href="/order"
          className="text-white hover:text-yellow-100 font-medium transition-colors"
        >
          Orders
        </Link>

        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur transition"
            >
              <lord-icon
                src="https://cdn.lordicon.com/shcfcebj.json"
                trigger="hover"
                stroke="bold"
                state="hover-jump"
                colors="primary:#ffffff,secondary:#ffffff"
                style={{ width: "40px", height: "40px" }}
              ></lord-icon>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-green-50 transition"
                  onClick={() => setOpen(false)}
                >
                  👤 Profile
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-3 hover:bg-green-50 transition"
                  onClick={() => setOpen(false)}
                >
                  📞 Contact Us
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-green-50 transition text-red-500"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-white text-green-600 px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}