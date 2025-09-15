"use client";
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Phone, Smartphone, Mail } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';

import { Menu, X } from "lucide-react";

export default function Header(){ 
   const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/AboutUs", label: "About Us" },
    { href: "/Services", label: "Services" },
    { href: "/Vehicles", label: "Vehicles" },
    { href: "/Motocycle", label: "Motorcycles" },
    { href: "/Container", label: "Containers" },
    { href: "/ContactUs", label: "Contact" },
    { href: "/Login", label: "Login" },
  ];


    return (
        <div className="flex-col h-100px w-full">
            <div className=" flex flex-row  p-2 w-full  ">
                <div className="flex flex-col h-full  ">
                    <div className='p-2'>
                      <Image className=" " src="/logo.png" alt="Logo"  objectFit='cover' width={180} height={120} />
                   </div>
                    <div className=" text-[14px]  p-4">
                        Deeares of the best Eropeans vehicles
                        </div>
                         <div className="flex items-center p-4 gap-4 text-2xl">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ">
        <FaFacebook />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
        <FaXTwitter />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
        <FaInstagram />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
        <FaYoutube />
      </a>
    </div>

                </div>
               <div className="w-[590px] h-[190px] relative pt-2">
  <Image
    src="/er.png"
    alt="Logo"
    fill
    className="object-cover"
  />
</div>
<div>
<div className="bg-white px-4 max-w-lg space-y-4">
      {/* Telephone */}
      <div className="flex items-center space-x-3">
        <Phone className="text-blue-600" size={20} />
        <span className="text-gray-700 font-medium">Tel: 01495 320540</span>
      </div>

      {/* Mobile */}
      <div className="flex items-center space-x-3">
        <Smartphone className="text-blue-600" size={20} />
        <span className="text-gray-700 font-medium">Mob: 07513 898320</span>
      </div>

      {/* Email */}
      <div className="flex items-center space-x-3">
        <Mail className="text-blue-600" size={20} />
        <a
          href="mailto:info@shipcars.co.uk"
          className="text-gray-700 font-medium hover:text-blue-600"
        >
          info@shipcars.co.uk
        </a>
      </div>

      {/* Slogan */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-gray-800 font-semibold">
          Any Vehicle Any Port Anywhere
        </p>
        <p className="text-blue-600 font-bold">
          Ship Your Vehicle With Confidence Every Time
        </p>
      </div>
    </div>
</div>


            </div>
            <div className='flex flex-col'>
      <nav className="bg-gradient-to-r from-red-600 via-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-2">
  {/* Icon Badge */}
  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-blue-600 shadow-md">
    <span className="text-yellow-300 text-2xl">🚘</span>
  </div>

  {/* Brand Name */}
  <span className="text-2xl md:text-3xl   bg-clip-text  animate-gradient">
  <span className="drop-shadow-sm">Car</span>
  <span className="ml-1 italic">Sales</span>
</span>
</div>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8">
            {links.map(({ href, label }) => (
              <li key={href} className="relative group">
                <Link
                  href={href}
                  className="text-yellow-200 font-medium hover:text-white transition-colors duration-300"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-yellow-200 hover:text-white transition-colors"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-red-600 via-blue-600 to-yellow-500 border-t border-yellow-300">
          <ul className="flex flex-col space-y-3 p-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-yellow-100 hover:text-white font-medium transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
             <nav>
  <div className='hidden md:flex  bg-sky-500 text-white p-2 flex justify-between items-center'>
    {/* Left side content (if any) */}
    <span>Your Logo or Title</span>
    
   
  </div>
</nav>

            </div>
        </div>
    );


}