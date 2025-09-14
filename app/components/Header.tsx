"use client";
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Phone, Smartphone, Mail } from "lucide-react";
import Link from 'next/link';


export default function Header(){ 

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
              <nav>
               <ul className="flex space-x-4 p-4 bg-gray-100">
      <li>
        <Link 
          href="/" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/AboutUs" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          About Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/Services" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Services
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/Vehicles" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Vehicles
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/Motocycle" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Motorcycles
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/Container" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Containers
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/ContactUs" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
      <li>
        <Link 
          href="/Login" 
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          Login
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </li>
    </ul>
              </nav>
             <nav>
  <div className='relative bg-sky-500 text-white p-2 flex justify-between items-center'>
    {/* Left side content (if any) */}
    <span>Your Logo or Title</span>
    
    {/* Search bar at far right - larger and white */}
    <div className=" w-100 h-12"> {/* Increased width container */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-2 px-4 pr-10 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
</nav>

            </div>
        </div>
    );


}