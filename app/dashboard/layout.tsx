"use client";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../Context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "../Hookes/useCurrentUser";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    
    const router = useRouter();
  // Redirect if not logged in
  const { user, loading } = useCurrentUser();
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Not logged in</div>;
  return (
   
    <div className="flex h-screen bg-gray-100 overflow-hidden">
  {/* Sidebar - fixed height, no scroll */}
  <div className=" h-full  left-0 top-0 bg-white shadow-md">
    <Sidebar />
  </div>

  {/* Main content - scrollable */}
  <main className="flex-1  overflow-y-auto p-4">
    {children}
  </main>
</div>
  );
}
