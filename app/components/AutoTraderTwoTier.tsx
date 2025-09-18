"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AutoTraderSingleNav() {
  // ✅ Data structure
  const menus = {
    Vehicles: [
      { href: "/Vehicles", label: "Import" },
      { href: "/cars/new", label: "Local" },
      { href: "/cars/reviews", label: "Reviews" },
      { href: "/cars/finance", label: "Finance" },
    ],
    Bikes: [
      { href: "/bikes/used", label: "Used Bikes" },
      { href: "/bikes/new", label: "New Bikes" },
    ],
    Containers: [
      { href: "/containers/quotee", label: "New Containers" },
      { href: "/containers/renews", label: "Old Containers" },
      { href: "/containers/renewk", label: "20ft Containers" },
      { href: "/containers/renewg", label: "40ft Containers" },
    ],
    SellWithUs: [{ href: "/Login", label: "Sell With Us" }],
    ContactUs: [{ href: "/Contactus", label: "Contact Us" }],
  } as const;

  type MainKey = keyof typeof menus;
  const mainLinks = Object.keys(menus) as MainKey[];

  // ✅ track which dropdown is open
  const [openKey, setOpenKey] = useState<MainKey | null>(null);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-evenly">
        {/* 🔹 Logo */}
        <Link href="/" className="flex items-center space-x-2 py-3">
          <Image src="/logs.png" alt="Logo" width={120} height={40} />
        </Link>

        {/* 🔹 Main Menu */}
        <ul className="flex space-x-6 text-sm font-semibold">
          {mainLinks.map((key) => (
            <li
              key={key}
              className="relative group"
              onMouseEnter={() => setOpenKey(key)}
              onMouseLeave={() => setOpenKey(null)}
            >
              <button
                className="flex items-center space-x-1 px-3 py-2 rounded-md
                           text-blue-700 hover:text-green-700 hover:bg-yellow-100
                           transition-colors decolration-2 decoration-green-600"
              >
                <span>{key}</span>
                
              </button>

              {/* Dropdown submenu */}
              {openKey === key && (
                <div
                  className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white 
                             border border-gray-200 z-50"
                >
                  {menus[key].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-sm text-blue-700
                                 hover:bg-green-50 hover:text-green-700
                                 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
