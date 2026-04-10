"use client";

import { useState, useRef } from "react";
import {
  faGaugeHigh,
  faCarSide,
  faTruck,
  faBoxOpen,
  faMotorcycle,
  faUsers,
  faUserTie,
  faRightFromBracket,
  faTicketSimple,
  faCamera
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "../Hookes/useCurrentUser";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: faGaugeHigh, roles: ["ADMIN","SELLER"] },
  { name: "Cars", href: "/dashboard/Cars", icon: faCarSide, roles: ["ADMIN","SELLER"] },
  { name: "Commercial Vehicles", href: "/dashboard/HeavyCommercialVehicle", icon: faTruck, roles: ["ADMIN","SELLER"] },
  { name: "Motorcycles", href: "/dashboard/Motocycle", icon: faMotorcycle, roles: ["ADMIN","SELLER"] },
  { name: "Users", href: "/dashboard/Users", icon: faUsers, roles: ["ADMIN"] },
  { name: "Admin Orders MGM", href: "/dashboard/AdminRequestsPage", icon: faBoxOpen, roles: ["ADMIN"] },
  { name: "Admin Reviews Mngm", href: "/dashboard/AdminReviewsPage", icon: faBoxOpen, roles: ["ADMIN"] },
  { name: "Image Dashboard", href: "/dashboard/ImageDashboard", icon: faBoxOpen, roles: ["ADMIN"] },
  { name: "Profile", href: "/dashboard/UserProfile", icon: faUserTie, roles: ["ADMIN","SELLER","GUEST"] },
  { name: "Make Order", href: "/dashboard/RequestItemPage", icon: faTicketSimple, roles: ["SELLER","GUEST"] },
  { name: "User Orders", href: "/dashboard/UserOrdersPage", icon: faBoxOpen, roles: ["SELLER","GUEST"] },
  { name: "Logout", href: "/dashboard/Logout", icon: faRightFromBracket, roles: ["ADMIN","SELLER","GUEST"] }
];

export default function Sidebar() {
  const { user, loading, refetch } = useCurrentUser();
  const pathname = usePathname();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile picture upload
  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(`https://api.f-carshipping.com/api/users/profile-picture`, {
        method: "POST",
        credentials: "include",
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload profile picture");

      await response.json();
      // Refresh user data to get updated profile picture
      await refetch();
      
    } catch (err) {
      setError("Failed to upload profile picture");
      setTimeout(() => setError(""), 3000);
      console.error(err);
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) return <div className="p-4">Not logged in</div>;

  const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles || "GUEST"];

  const filteredNav = navItems.filter(item =>
    item.roles.some(role => userRoles.includes(role))
  );

  return (
    <aside className="w-56 bg-white shadow-lg h-screen flex flex-col overflow-y-auto">

      {/* Profile Section with Image Upload */}
      <div className="p-4 border-b flex flex-col items-center relative">
        {/* Profile Picture with Upload Button */}
        <div className="relative group mb-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
            )}
          </div>
          
          {/* Camera Button for Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change profile picture"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FontAwesomeIcon icon={faCamera} className="w-3 h-3" />
            )}
          </button>
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User Info */}
        <p className="text-sm font-medium text-gray-700 text-center">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-500 capitalize mt-0.5">
          {userRoles.includes("ADMIN") ? "Admin" : 
           userRoles.includes("SELLER") ? "Seller" : "Guest"}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-2 px-2 py-1 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="mt-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-600 text-center">Uploading...</p>
          </div>
        )}
      </div>

      <nav className="mt-4 flex-1 space-y-1">
        {filteredNav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-r-full transition-all duration-200",
                active
                  ? "bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-700"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}