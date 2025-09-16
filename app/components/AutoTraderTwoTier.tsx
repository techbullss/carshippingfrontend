"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
export default function AutoTraderSingleNav() {
  const pathname = usePathname();

  // Menu data
  const menus = {
    Cars: [
      { href: "/Vehicles", label: "Used Cars" },
      { href: "/cars/new", label: "New Cars" },
      { href: "/cars/reviews", label: "Reviews" },
      { href: "/cars/finance", label: "Finance" },
    ],
    Vans: [
      { href: "/vans/used", label: "Used Vans" },
      { href: "/vans/new", label: "New Vans" },
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
  } as const;

  type MainKey = keyof typeof menus;
  const [activeMain, setActiveMain] = useState<MainKey>("Cars"); // default
  const mainLinks = Object.keys(menus) as MainKey[];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col px-4">

        {/*  TOP ROW – main categories */}
        <div className="flex  space-x-6 text-xs font-medium text-gray-600 py-1">
          {mainLinks.map((key) => (
            <button
              key={key}
              onClick={() => setActiveMain(key)}
              className={`pb-0.5 border-b-2 transition-colors duration-200 ${
                activeMain === key
                  ? "border-green-600 text-blue-700 font-semibold"
                  : "border-transparent hover:text-blue-700 hover:border-green-400"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* 🔵 BOTTOM ROW – logo + sub menu */}
        <div className="flex  pb-2 items-center ">
          {/* Logo */}
          <Link href="/" className="flex items-center px-10 space-x-2">
  <Image
    src="/logs.png"   
    alt="FcarShipping Logo"
    width={120}                     // adjust size
    height={40}
    priority
  />
</Link>

          {/* Sub menu */}
          <div className="flex flex-wrap  px-6 gap-x-6 text-sm md:text-base font-bold text-gray-700">
            {menus[activeMain].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`pb-0 border-b-2 transition-colors duration-200 ${
                  pathname === href
                    ? "border-blue-600 text-blue-700 font-semibold"
                    : "border-transparent hover:text-blue-700 hover:border-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </nav>
  );
}
