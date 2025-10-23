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
   
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-2">{children}</main>
    </div>
  );
}
