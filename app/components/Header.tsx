"use client";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Phone, Smartphone, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AutoTraderTwoTier from "./AutoTraderTwoTier";

interface SubmenuItem {
  href: string;
  label: string;
}

interface MenuItem {
  href: string;
  label: string;
  submenu?: SubmenuItem[];
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  const links: MenuItem[] = [
    {
      href: "/",
      label: "Cars",
      submenu: [
        { label: "All", href: "/Vehicles" },
        { label: "Fresh Import", href: "/Vehicles?location=import" },
        { label: "Locally Available", href: "/Vehicles?location=local" },
      ],
    },
    {
      href: "/CommercialVehicles",
      label: "Commercial Vehicles",
      submenu: [
        { href: "/CommercialVehicles", label: "All" },
        { href: "/CommercialVehicles?location=local", label: "Local" },
        { href: "/CommercialVehicles?location=import", label: "Imported" },
      ],
    },
    {
      href: "/Motocycle",
      label: "Bikes",
      submenu: [
        { href: "/Motocycle", label: "All" },
        { href: "/Motocycle?location=import", label: "Imports" },
        { href: "/Motocycle?location=local", label: "Locally Available" },
      ],
    },
    { href: "/AuxiallyShipping", label: "Auxiliary shipping" },
    { href: "/SellWithUs", label: "Sell With Us" },
    { href: "/AboutUs", label: "About Us" },
  ];

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(
          "https://api.f-carshipping.com/api/auth/validate",
          {
            method: "GET",
            credentials: "include",
          }
        );
        setIsLoggedIn(res.ok);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuthStatus();
  }, []);

 return (
  <header className="w-full bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
    <nav className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-14">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
  
  {/* Logo Icon (3 stacked shapes) */}
  <div className="relative w-14 h-14">
    <Image
      src="/log.png"
      alt="FCarShipping Logo"
      fill
      className="object-contain"
      priority
    />
  </div>

  {/* Logo Text */}
  

</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center gap-1 cursor-pointer">
                <Link
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>

                {link.submenu && (
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:text-black transition-transform group-hover:rotate-180"
                  />
                )}
              </div>

              {link.submenu && (
                <div className="absolute left-0 mt-4 w-56 bg-white border border-black/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {link.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block px-5 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm text-gray-700 hover:text-black transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/Login"
              className="text-sm text-gray-700 hover:text-black transition"
            >
              Login
            </Link>
          )}

          {/* Clean CTA */}
          <Link
            href="/ContactUs"
            className="ml-2 px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-black"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </nav>

    {/* Mobile Menu */}
    {open && (
      <div className="md:hidden border-t border-black/5 bg-white">
        <div className="px-6 py-6 space-y-4">
          {links.map((link, index) => (
            <div key={index}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  link.submenu
                    ? handleSubmenuToggle(index)
                    : setOpen(false)
                }
              >
                <Link
                  href={link.href}
                  className="text-base text-gray-800"
                >
                  {link.label}
                </Link>

                {link.submenu && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      openSubmenu === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {link.submenu && openSubmenu === index && (
                <div className="mt-2 pl-4 space-y-2">
                  {link.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block text-sm text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-black/5">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="block py-2 text-gray-800"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/Login"
                className="block py-2 text-gray-800"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}

            <Link
              href="/ContactUs"
              className="block mt-4 bg-black text-white py-3 rounded-full text-center text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    )}
  </header>
);
}