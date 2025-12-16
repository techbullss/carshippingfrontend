"use client";

import {
  faGaugeHigh,
  faCarSide,
  faTruck,
  faBoxOpen,
  faMotorcycle,
  faUsers,
  faUserTie,
  faRightFromBracket,
  faTicketSimple
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "../Hookes/useCurrentUser";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: faGaugeHigh },
  { name: "Cars", href: "/dashboard/Cars", icon: faCarSide },
  { name: "Commercial Vehicles", href: "/dashboard/HeavyCommercialVehicle", icon: faTruck },
  { name: "Motorcycles", href: "/dashboard/Motocycle", icon: faMotorcycle },
  { name: "Users", href: "/dashboard/Users", icon: faUsers },
  { name: "Profile", href: "/dashboard/UserProfile", icon: faUserTie },
  { name: "Admin Requests", href: "/dashboard/AdminRequestsPage", icon: faBoxOpen },
   { name: "Image Dashboard", href: "/dashboard/ImageDashboard", icon: faBoxOpen }, //
  { name: "Logout", href: "/dashboard/Logout", icon: faRightFromBracket },
  { name: "Request Item", href: "/dashboard/RequestItemPage", icon: faTicketSimple },
  { name: "Reviews", href: "/dashboard/ReviewsPage", icon: faBoxOpen }
];

export default function Sidebar() {
  const { user, loading } = useCurrentUser();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white shadow-lg h-screen flex flex-col overflow-y-auto">
      <div className="p-4 border-b">
        <p className="text-xl font-bold text-indigo-600 tracking-tight">F-carshipping</p>
      </div>
      <div>
      Welcome, {user.firstName} {user.lastName}
    </div>

      <nav className="mt-6 flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2 py-3 text-sm font-medium rounded-r-full transition-all duration-200",
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
