"use client"
import Image from "next/image";
import { FaCarSide, FaSearch, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import CarSearchHero from "./components/CarSearchHero";
import { Car, Package, CreditCard, HandshakeIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {  FaRegHeart, FaCar, FaGasPump, FaTachometerAlt } from 'react-icons/fa';
import EuropeanCarsHero from "./components/EuropeanCarsHero";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Car = {
  isNew: any;
  yearOfManufacture: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  id: number;
  brand: string;
  model: string;
  imageUrls: string[];
  priceKes: number;
};
export default function Home() {
   const router = useRouter(); 
  const [latestArrivals, setLatestArrivals] = useState<Car[]>([]);

 const [loading, setLoading] = useState(true); 

   const [usingFallback, setUsingFallback] = useState(false);

  // Sample fallback vehicles
  const fallbackVehicles: Car[] = [
    {
      id: 1,
      brand: "Toyota",
      model: "Land Cruiser Prado",
      imageUrls: ["/benz.jpg"],
      priceKes: 4500000,
      yearOfManufacture: "2022",
      mileage: "15,000",
      fuelType: "Diesel",
      transmission: "Automatic",
      bodyType: "SUV",
      isNew: true
    },
    {
      id: 2,
      brand: "Mercedes-Benz",
      model: "C-Class",
      imageUrls: ["/bc.jpg"],
      priceKes: 3800000,
      yearOfManufacture: "2021",
      mileage: "22,500",
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Sedan",
      isNew: false
    },
    {
      id: 3,
      brand: "Subaru",
      model: "Outback",
      imageUrls: ["/best.png"],
      priceKes: 2800000,
      yearOfManufacture: "2020",
      mileage: "35,000",
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Estate",
      isNew: false
    }
  ];

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("https://api.f-carshipping.com/api/cars/latest",{
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data && data.length > 0) {
          setLatestArrivals(data);
          setUsingFallback(false);
        } else {
          // If API returns empty array, use fallback
          setLatestArrivals(fallbackVehicles);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching latest arrivals:", error);
        // Use fallback vehicles on error
        setLatestArrivals(fallbackVehicles);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatest();
  }, []);

  const europeanBrands = [
    { name: "BMW", logo: "/bmwlogo.png" },
    { name: "Mercedes-Benz", logo: "/merlogo.png" },
    { name: "Audi", logo: "/audilog.png" },
    { name: "Volkswagen", logo: "/volklogo.png" },
    { name: "Volvo", logo: "/volvologo.png" },
    { name: "Porsche", logo: "/porchelogo.png" },
  ];
  

  function handleCarClick(id: number): void {
    router.push(`/Cardetails/${id}`);
  }
   const [backgroundImage, setBackgroundImage] = useState('/used1.jpg'); // fallback
  const BACKEND_URL = 'https://api.f-carshipping.com/api'; // Your Spring Boot backend URL
  
  useEffect(() => {
    fetchCurrentImage();
  }, []);
  
  const fetchCurrentImage = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/images/current`,{
        method: 'GET',
        credentials: 'include',
      }

      );
      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setBackgroundImage(data.image.url);
        }
      }
    } catch (error) {
      console.error('Error fetching current image:', error);
      // Keep using fallback image
    }
  };
  return (
   <div>
  <section
      className="flex items-center min-h-[600px]"
      style={{
        backgroundImage: ` url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container px-2 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Search Component */}
          <div className="bg-white/10  w-full p-6 rounded-lg lg:col-span-2">
            <CarSearchHero />
          </div>
        </div>
      </div>
    </section>
<section className="relative bg-gradient-to-b from-blue-50 to-green-50 py-16">
  <div className="container mx-auto px-6 lg:px-12 relative">
    {/* FULL-WIDTH TITLE */}
    <div className="w-full text-center mb-10">
      <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        Drive Your Dream Vehicle 
      </h1>
      <div className="w-48 h-1 bg-gradient-to-r from-blue-400 to-green-500 mx-auto rounded-full"></div>
      <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
        Seamless vehicle import solutions with trusted expertise
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Text / Selling Column */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <p className="text-gray-800 max-w-lg leading-relaxed text-lg">
          We connect Kenyan car buyers to the best deals in the world—whether you are 
          purchasing a luxury ride, a family SUV, or a workhorse van.  
          From sourcing and inspection to shipping and final delivery in Kenya, 
          <strong className="text-blue-600"> we handle everything for you</strong> with speed, transparency, 
          and unbeatable pricing.
        </p>
<ul className="space-y-4 text-gray-800">
  <li className="flex items-start gap-3 group">
    <div className="bg-blue-100 p-2 rounded-full mt-1 group-hover:bg-blue-200 transition-colors duration-300">
      <Car className="w-5 h-5 text-blue-600" />
    </div>
    <span><strong className="text-green-700">Verified UK Listings</strong> – Browse a curated selection of quality vehicles ready for export.</span>
  </li>
  
  <li className="flex items-start gap-3 group">
    <div className="bg-green-100 p-2 rounded-full mt-1 group-hover:bg-green-200 transition-colors duration-300">
      <Package className="w-5 h-5 text-green-600" />
    </div>
    <span><strong className="text-green-700">End-to-End Shipping</strong> – From purchase to port clearance, we manage every step.</span>
  </li>
  
  <li className="flex items-start gap-3 group">
    <div className="bg-yellow-100 p-2 rounded-full mt-1 group-hover:bg-yellow-200 transition-colors duration-300">
      <CreditCard className="w-5 h-5 text-yellow-600" />
    </div>
    <span><strong className="text-green-700">Flexible Payment</strong> – Secure transactions with no hidden fees.</span>
  </li>
  
  <li className="flex items-start gap-3 group">
    <div className="bg-blue-100 p-2 rounded-full mt-1 group-hover:bg-blue-200 transition-colors duration-300">
      <HandshakeIcon className="w-5 h-5 text-blue-600" />
    </div>
    <span><strong className="text-green-700">Kenya-Focused Support</strong> – Local team assistance for customs and delivery.</span>
  </li>
</ul>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
         
          
         
        </div>
      </div>

      {/* Image / Hero Column */}
      <div className="relative">
        <div className="w-full h-80 md:h-[420px] rounded-2xl shadow-2xl bg-[url('/key.jpg')] bg-cover bg-center relative overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform duration-700">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-500 rounded-full opacity-20 animate-bounce"></div>
          
          <span className="absolute bottom-6 left-6 text-white text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 px-6 py-3 rounded-full shadow-lg">
            UK Cars • Bikes • Parts
          </span>
        </div>
        
        {/* Floating stats */}
        <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-xl p-4 border border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Vehicles Shipped</div>
          </div>
        </div>
      </div>
    </div>

    {/* Floating decorative elements */}
    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-16 h-16 bg-green-400 rounded-full opacity-10 animate-bounce delay-1000"></div>
  </div>
</section>

 <section className="bg-gradient-to-b from-gray-100 to-white  px-4">
  <div className=" ">
    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      className="text-center mb-4"
    >
    
      {usingFallback && (
        <div className=" bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md max-w-md mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Showing sample vehicles. <span className="font-medium">Our full inventory will be back shortly!</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>

    {/*  Spinner while loading */}
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    ) : (
      /* Cars Grid */
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestArrivals.map((car) => (
          <div
            key={car.id}
            
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl border-r-6 border-emerald-500 transition-all duration-300"
          >
            {/* Image with tags */}
            <div className="relative">
              <img
                src={car.imageUrls?.[0] || "/car-placeholder.jpg"}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-64 object-cover"
              />

              {/* Favorite button */}
              <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-red-100 transition-colors">
                <FaRegHeart className="text-red-500 text-xl" />
              </button>

              {/* NEW badge */}
              {car.isNew && (
                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  NEW
                </span>
              )}
            </div>

            {/*  Car Details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {car.yearOfManufacture} • {car.mileage} km
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm shadow-sm">
                  KES {car.priceKes.toLocaleString()}
                </span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaCar className="mr-2 text-blue-500" /> {car.bodyType}
                </div>
                <div className="flex items-center">
                  <FaGasPump className="mr-2 text-blue-500" /> {car.fuelType}
                </div>
                <div className="flex items-center">
                  <FaTachometerAlt className="mr-2 text-blue-500" /> {car.transmission}
                </div>
              </div>

              {/* CTA Buttons */}
              {!usingFallback && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 
                  <button
  onClick={() => handleCarClick(car.id)}
  className="flex-1 px-4 py-2 text-emerald-600 font-semibold 
             hover:text-emerald-700 transition-colors duration-300 
             relative group"
>
  View Details
  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 
                   w-0 h-0.5 bg-emerald-500 group-hover:w-12 
                   transition-all duration-300"></span>
</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Footer CTA */}
    {!loading && (
      <div className="text-center mt-14">
        <button
          onClick={() => window.location.href = "/Vehicles"}
          className="px-8 py-3  text-black border border-green-600  border-b-4 font-semibold rounded-full shadow-md 
                     hover:bg-yellow-700 hover:shadow-lg transition-all duration-300"
        >
          Browse All Vehicles
        </button>
      </div>
    )}
  </div>
</section>
<section>
      <div className="border-t border-gray-200 my-12">
        <EuropeanCarsHero />
      </div>
</section>
    <section className=" bg-gradient-to-b from-gray-50 to-white ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <FaCarSide className="mr-2" /> Premium Selection
          </span>
        
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {europeanBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="flex flex-col items-center bg-white p-6 rounded-2xl  hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="relative w-24 h-24 mb-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{brand.name}</h3>
                
                <Link
  href={{
    pathname: "/Vehicles",       // Your VehicleListPage route
    query: { brand: brand.name } // send model name
  }}
  className="flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
>
  View Models <FaChevronRight className="ml-1 text-xs" />
</Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
 <div className="w-full bg-gray-100 text-black py-2">

  <div className="w-full text-center">

    {/* Gold Accent Line */}
    <div className="flex justify-center mb-8">
      <div className="w-16 h-[2px] bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600"></div>
    </div>

    {/* Heading */}
    <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
      Best Vehicle Sourcing
    </h2>

    {/* Subheading */}
    <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed mb-10">
      When excellence is not on the lot, we source it worldwide.
      Our team locates, inspects, and delivers the exact vehicle you desire —
      discreetly, professionally, without compromise.
    </p>

    {/* Divider */}
    <div className="flex justify-center mb-12">
      <div className="w-24 h-px bg-gray-700"></div>
    </div>

    {/* Features */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-sm tracking-widest uppercase text-gray-400 mb-14">
      <span>Global Sourcing</span>
      <span>Comprehensive Inspection</span>
      <span>Door-to-Door Delivery</span>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-6">

      <button
        onClick={() => window.location.href = "/Vehicles"}
        className="px-12 py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-gray-200 transition duration-300"
      >
        Explore Inventory
      </button>

      <button
        onClick={() => window.location.href = "/ContactUs"}
        className="px-12 py-4 border border-gray-600 text-white text-sm tracking-widest uppercase hover:border-white hover:bg-white hover:text-black transition duration-300"
      >
        Request a Vehicle
      </button>

    </div>

    {/* Signature Line */}
    <div className="mt-16 text-xs tracking-[0.3em] text-gray-500 uppercase">
      Precision. Luxury. Delivered.
    </div>

  </div>

</div>
      </div>
    </section>
   </div>
  );
}
