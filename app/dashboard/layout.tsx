"use client";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../Context/AuthContext";
import { useRouter, usePathname } from "next/navigation";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
  // Redirect if not logged in
  if (!isLoggedIn) {
    if (typeof window !== 'undefined') {
      router.push('/Login');
    }
    return null;
  }
  return (
   
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-2">{children}</main>
    </div>
  );
}
