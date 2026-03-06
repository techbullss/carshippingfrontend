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

  { name: "Reviews", href: "/dashboard/ReviewsPage", icon: faBoxOpen, roles: ["ADMIN","SELLER","GUEST"] },

  { name: "Logout", href: "/dashboard/Logout", icon: faRightFromBracket, roles: ["ADMIN","SELLER","GUEST"] }
];

export default function Sidebar() {

  const { user, loading } = useCurrentUser();
  const pathname = usePathname();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) return <div className="p-4">Not logged in</div>;

  const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles || "GUEST"];

  const filteredNav = navItems.filter(item =>
    item.roles.some(role => userRoles.includes(role))
  );

  return (
    <aside className="w-56 bg-white shadow-lg h-screen flex flex-col overflow-y-auto">

      <div className="p-4 border-b">
        <p className="text-xl font-bold text-indigo-600 tracking-tight">
          F-carshipping
        </p>
      </div>

      <div className="px-4 py-3 text-sm text-gray-600 border-b">
        Welcome, {user.firstName} {user.lastName}
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