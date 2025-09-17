"use client";
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Phone, Smartphone, Mail } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AutoTraderTwoTier from './AutoTraderTwoTier';

export default function Header(){ 
   const [open, setOpen] = useState(false);
const pathname = usePathname();  // e.g. "/AboutUs"
const segments = pathname
  .split("/")
  .filter(Boolean)
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
        <div className="flex-col bg-white h-100px w-full">
            <div className=" flex flex-row  p-2 w-full  ">
                <div className="flex flex-col h-full  ">
                    <div className='p-2'>
                      <Image className=" " src="/log8.png" alt="Logo"  objectFit='cover' width={250} height={70} />
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
    src="/header.jpeg"
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
              <AutoTraderTwoTier />
            </div>
        </div>
    );


}