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

  // Use backend cookie to validate login status
 
  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  //  Logout through backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("https://api.f-carshipping.com/api/auth/validate", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuthStatus();
  }, []);

 

 

  return (
    <div className="flex-col bg-gradient-to-b from-white to-blue-50 shadow-lg w-full">
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
