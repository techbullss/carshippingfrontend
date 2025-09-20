"use client";
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Phone, Smartphone, Mail, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AutoTraderTwoTier from './AutoTraderTwoTier';

interface SubmenuItem {
  href: string;
  label: string;
}

interface MenuItem {
  href: string;
  label: string;
  submenu?: SubmenuItem[];
}

export default function Header(){ 
   const [open, setOpen] = useState(false);
   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
const pathname = usePathname();  // e.g. "/AboutUs"
const segments = pathname
  .split("/")
  .filter(Boolean)
  const links: MenuItem[] = [
  
   
    
    { 
      href: "/Vehicles", 
      label: "Vehicles",
      submenu: [
        { href: "/Vehicles/Cars", label: " Fresh Import" },
        { href: "/Vehicles/SUVs", label: "Locally Available" },
        
      ]
    },
    
    { href: "/Motocycle", label: "Bikes",
      submenu: [
        { href: "/Motocycle/Used", label: "Imports" },
        { href: "/Motocycle/New", label: "Locally Available" },]
     },
    { href: "/Container", label: "Containers", 
      submenu: [
        { href: "/Container/New", label: "New Containers" },
        { href: "/Container/Old", label: "Old Containers" },
        { href: "/Container/20ft", label: "20ft Containers" },
        { href: "/Container/40ft", label: "40ft Containers" },
      ] },
    
    { href: "/auxiliary-shipping", label: "Auxiliary shipping" },
    { href: "/ContactUs", label: "Sell With Us" },
     { 
      href: "/AboutUs", 
      label: "About Us",
     
    },
    { href: "/Login", label: "Login" },
    { href: "/ContactUs", label: "Signup" },
  ];

  const handleSubmenuToggle = (index: number) => {
    if (openSubmenu === index) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(index);
    }
  };

    return (
        <div className="flex-col bg-gradient-to-b from-white to-blue-50 shadow-lg w-full">
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 w-full p-1 items-center">
    {/* Left Column - Logo and Social Media */}
    <div className="flex flex-col items-center md:items-start">
    <div className='mb-2'>
        <Image className="rounded-lg shadow-md" src="/log8.png" alt="Logo" width={250} height={70} />
    </div>
    
    {/* Fancy Text Option 1: Animated gradient text */}
    <div className="my-1 text-center md:text-left">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-500 bg-clip-text text-transparent animate-gradient">
            Premium European Vehicles
        </span>
    </div>
    
    {/* Fancy Text Option 2: With decorative elements */}
    <div className="my-1 flex items-center justify-center md:justify-start">
        <div className="w-4 h-0.5 bg-blue-600 mr-2"></div>
        <span className="text-sm font-semibold text-green-700 italic">
            Excellence in Automotive Shipping
        </span>
        <div className="w-4 h-0.5 bg-blue-600 ml-2"></div>
    </div>
    
    {/* Fancy Text Option 3: Badge style */}
    
    
    {/* Fancy Text Option 4: Animated typing effect */}
    <div className="my-1">
        <div className="text-sm font-mono text-green-700 border-r-2 border-green-600 pr-1 inline-block animate-typing">
            Your Trusted Auto Partner
        </div>
    </div>
    
    <div className="flex items-center gap-4 text-2xl">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
            <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors">
            <FaXTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition-colors">
            <FaInstagram />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 transition-colors">
            <FaYoutube />
        </a>
    </div>
</div>
    
    {/* Middle Column - Image (wider column) */}
    <div className="w-full h-48 md:h-50 relative rounded-xl overflow-hidden shadow-lg">
        <Image
            src="/mwas.jpeg"
            alt="Header image"
            fill
            className="object-cover"
        />
    </div>
    
    {/* Right Column - Contact Info */}
    <div className="w-full">
        <div className="bg-gradient-to-br from-blue-100 to-green-50 px-4 py-2 rounded-xl shadow-md space-y-3 border border-blue-200">
            {/* Telephone */}
            <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-full">
                    <Phone className="text-white" size={16} />
                </div>
                <span className="text-gray-800 font-medium">01495 320540</span>
            </div>

            {/* Mobile */}
            <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                    <Smartphone className="text-white" size={16} />
                </div>
                <span className="text-gray-800 font-medium">07513 898320</span>
            </div>

            {/* Email */}
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

            {/* Slogan */}
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
            
            {/* Navigation Menu */}
            <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md">
    <div className="  px-2">
        <div className="flex justify-between items-center">
            {/* Logo on the left */}
            <Link href="/" className="flex items-center ">
                <div className="text-2xl font-bold">
                    <span className="text-white font-italic">FCar</span>
                    <span className="text-yellow-300">Shipping</span>
                </div>
            </Link>
            
            {/* Mobile menu button on the right */}
            <div className="md:hidden">
                <button
                    onClick={() => setOpen(!open)}
                    className="p-3 rounded-md text-white focus:outline-none hover:bg-blue-700 transition-colors"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            
            {/* Desktop Menu - pushed to the right */}
            <div className="hidden md:flex items-center  flex-1 justify-end">
                {links.map((link, index) => (
                    <div key={index} className="relative group">
                        <div 
                            className="flex items-center py-4 px-2 hover:bg-blue-500 cursor-pointer transition-colors rounded-t-lg"
                            onClick={() => link.submenu && handleSubmenuToggle(index)}
                        >
                            <Link href={link.href} className="px-1 font-medium text-sm md:text-md ">
                                {link.label}
                            </Link>
                            {link.submenu && (
                                <ChevronDown size={16} className="ml-1 group-hover:rotate-180 transition-transform" />
                            )}
                        </div>
                        
                        {/* Desktop Submenu */}
                        {link.submenu && (
                            <div className="absolute left-0 mt-0 w-48 bg-white text-blue-800 shadow-lg rounded-b-md rounded-r-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 border border-blue-200">
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
                
                {/* CTA Button */}
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
        
        {/* Mobile Menu */}
        {open && (
            <div className="md:hidden bg-blue-700 rounded-b-lg shadow-lg">
                {links.map((link, index) => (
                    <div key={index}>
                        <div 
                            className="flex justify-between items-center py-3 px-4 hover:bg-blue-600 cursor-pointer transition-colors"
                            onClick={() => link.submenu && handleSubmenuToggle(index)}
                        >
                            <Link href={link.href} className="flex-grow font-medium">
                                {link.label}
                            </Link>
                            {link.submenu && (
                                <ChevronDown 
                                    size={16} 
                                    className={`transform transition-transform ${openSubmenu === index ? 'rotate-180' : ''}`}
                                />
                            )}
                        </div>
                        
                        {/* Mobile Submenu */}
                        {link.submenu && openSubmenu === index && (
                            <div className="bg-blue-600 pl-6">
                                {link.submenu.map((subItem, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        href={subItem.href}
                                        className="block py-2 px-4 hover:bg-blue-500 transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {/* Mobile CTA Button */}
                <div className="p-4 border-t border-blue-500">
                    <Link 
                        href="/ContactUs" 
                        className="block text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full shadow-md transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        )}
    </div>
</nav>
            
          
        </div>
    );
}