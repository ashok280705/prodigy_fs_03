"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/register" || pathname === "/admin-login";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && (
        <header className="bg-white shadow top-0 z-50 sticky">
          <Navbar />
        </header>
      )}

      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>

      {!hideLayout && (
        <footer className="bg-white shadow mt-8">
          <Footer />
        </footer>
      )}
    </div>
  );
}