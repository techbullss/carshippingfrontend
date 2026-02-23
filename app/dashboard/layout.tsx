"use client";

import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../Hookes/useCurrentUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/Login");
    }
  }, [user, loading, router]);

  //  Spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prevent flicker before redirect
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="h-full bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}