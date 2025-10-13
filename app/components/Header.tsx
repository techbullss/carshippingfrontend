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
  const [loading, setLoading] = useState(true);
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
        { href: "/CommercialVehicles/Trucks", label: "Trucks" },
        { href: "/CommercialVehicles/Vans", label: "Vans" },
      ],
    },
    {
      href: "/Motocycle",
      label: "Bikes",
      submenu: [
        { href: "/Motocycle/Used", label: "Imports" },
        { href: "/Motocycle/New", label: "Locally Available" },
      ],
    },
    
    { href: "/AuxiallyShipping", label: "Auxiliary shipping" },
    { href: "/SellWithUs", label: "Sell With Us" },
    { href: "/AboutUs", label: "About Us" },
  ];

  // ✅ Use backend cookie to validate login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://carshipping.duckdns.org:8443/api/auth/validate", {
          method: "GET",
          credentials: "include", // send cookie with request
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // ✅ Logout through backend
  const handleLogout = async () => {
    try {
      await fetch("https://carshipping.duckdns.org:8443/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 text-gray-800 p-4 text-center">
        Checking session...
      </div>
    );
  }

  return (
    <div className="flex-col bg-gradient-to-b from-white to-blue-50 shadow-lg w-full">
      {/* ✅ Show top section only on homepage */}
      {pathname === "/" && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 w-full p-1 items-center">
          {/* Left Column - Logo and Social Media */}
          <div className="flex flex-col justify-between md:justify-between">
            <div className="mb-20">
              <Image
                className="rounded-lg shadow-md"
                src="/log8.png"
                alt="Logo"
                width={250}
                height={70}
              />
            </div>

            <div className="flex items-center gap-4 text-2xl mt-0">
              <a
                href="https://facebook.com"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                className="text-black hover:text-gray-700 transition-colors"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                className="text-pink-500 hover:text-pink-700 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Middle Column - Image */}
          <div className="w-full h-48 md:h-50 relative rounded-xl overflow-hidden shadow-lg">
            <Image src="/mwas.jpeg" alt="Header image" fill className="object-cover" />
          </div>

          {/* Right Column - Contact Info */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-blue-100 to-green-50 px-4 py-2 rounded-xl shadow-md space-y-3 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Phone className="text-white" size={16} />
                </div>
                <span className="text-gray-800 font-medium">01495 320540</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <Smartphone className="text-white" size={16} />
                </div>
                <span className="text-gray-800 font-medium">07513 898320</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <Mail className="text-white" size={16} />
                </div>
                <a
                  href="mailto:info@shipcars.co.uk"
                  className="text-gray-800 font-medium hover:text-blue-600 transition-colors"
                >
                  info@shipcars.co.uk
                </a>
              </div>

              <div className="pt-3 border-t border-blue-200">
                <p className="text-gray-800 font-semibold text-sm">
                  Any Vehicle Any Port Anywhere
                </p>
                <p className="text-blue-600 font-bold text-sm">
                  Ship With Confidence Every Time
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation (Always visible) */}
      <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md">
        <div className="px-2">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-white font-italic">FCar</span>
                <span className="text-yellow-300">Shipping</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center flex-1 justify-end">
              {links.map((link, index) => (
                <div key={index} className="relative group">
                  <div
                    className="flex items-center py-4 px-2 hover:bg-blue-500 cursor-pointer transition-colors rounded-t-lg"
                    onClick={() => link.submenu && handleSubmenuToggle(index)}
                  >
                    <Link href={link.href} className="px-1 font-medium text-sm md:text-md">
                      {link.label}
                    </Link>
                    {link.submenu && (
                      <ChevronDown
                        size={16}
                        className="ml-1 group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </div>

                  {link.submenu && (
                    <div className="absolute left-0 mt-0 w-48 bg-white text-blue-800 shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 border border-blue-200">
                      {link.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="block px-4 py-3 hover:bg-blue-100 transition-colors border-b border-blue-50 last:border-b-0"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* ✅ Dynamic Auth Links */}
              {isLoggedIn && (
                <Link href="/dashboard" className="ml-4 font-semibold hover:underline">
                  Dashboard
                </Link>
              )}

              {!isLoggedIn && (
                <Link href="/Login" className="ml-4 hover:underline">
                  Login
                </Link>
              )}

              <div className="ml-4">
                <Link
                  href="/ContactUs"
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full shadow-md transition-colors transform hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
