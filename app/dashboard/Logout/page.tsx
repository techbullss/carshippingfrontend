"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await fetch("https://api.f-carshipping.com/api/auth/logout", {
          method: "POST",
          credentials: "include", // send cookies
        });

        if (!res.ok) throw new Error("Logout failed");

        toast.success("Logged out successfully");
        window.location.href = '/Login'; // redirect to login
      } catch (err) {
        console.error(err);
        toast.error("Failed to logout. Please try again.");
        setLoading(false);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          <p className="text-gray-700 font-medium">Logging you out...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 mb-4">You are already logged out.</p>
          <button
            onClick={() => router.push("/Login")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
