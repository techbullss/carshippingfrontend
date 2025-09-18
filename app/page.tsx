"use client"
import Image from "next/image";
import { FaCarSide, FaSearch, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import CarSearchHero from "./components/CarSearchHero";
import { CheckBadgeIcon, GlobeAltIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {  FaRegHeart, FaCar, FaGasPump, FaTachometerAlt } from 'react-icons/fa';
import EuropeanCarsHero from "./components/EuropeanCarsHero";
import Link from "next/link";
import router from "next/router";
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
        const res = await fetch("https://carshipping.duckdns.org:8443/api/cars/latest");
        
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
  return (
   <div>
  <section
  className=" flex items-center 
             bg-[url('/used1.jpg')] bg-cover bg-center bg-no-repeat"
>
  <div className="container px-2 w-full h-full ">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
      {/* Search Component */}
      <div className="bg-white/10 w-full p-6 rounded-lg  lg:col-span-2">
        <CarSearchHero />
      </div>
    </div>
  </div>
</section>
<section className="relative bg-gradient-to-b from-blue-50 to-green-50 py-16">
  <div className="container mx-auto px-6 lg:px-12 relative">
    {/* FULL-WIDTH TITLE */}
    <div className="w-full text-center mb-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
        Drive Your Dream Car from <span className="text-blue-600">UK to Kenya</span>
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto rounded-full"></div>
      <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
        Seamless vehicle import solutions with trusted expertise
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Text / Selling Column */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <p className="text-gray-800 max-w-lg leading-relaxed text-lg">
          We connect Kenyan car buyers to the best deals in the UK—whether you are 
          purchasing a luxury ride, a family SUV, or a workhorse van.  
          From sourcing and inspection to shipping and final delivery in Kenya, 
          <strong className="text-blue-600"> we handle everything for you</strong> with speed, transparency, 
          and unbeatable pricing.
        </p>

        <ul className="space-y-4 text-gray-800">
          <li className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <span className="text-blue-600 font-bold">🚗</span>
            </div>
            <span><strong className="text-green-700">Verified UK Listings</strong> – Browse a curated selection of quality vehicles ready for export.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full mt-1">
              <span className="text-green-600 font-bold">📦</span>
            </div>
            <span><strong className="text-green-700">End-to-End Shipping</strong> – From purchase to port clearance, we manage every step.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-full mt-1">
              <span className="text-yellow-600 font-bold">💳</span>
            </div>
            <span><strong className="text-green-700">Flexible Payment</strong> – Secure transactions with no hidden fees.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <span className="text-blue-600 font-bold">🤝</span>
            </div>
            <span><strong className="text-green-700">Kenya-Focused Support</strong> – Local team assistance for customs and delivery.</span>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => window.location.href = "/Vehicles"}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
          >
            Browse Vehicles
          </button>
          
          <button
            onClick={() => window.location.href = "/ContactUs"}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-green-700 transition-all duration-300 border border-blue-300"
          >
            Get Free Quote
          </button>
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

 <section className="bg-gradient-to-b from-gray-50 to-white py-4 px-4">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <span className="inline-block bg-blue-100 text-white text-sm font-semibold px-5 py-1.5 rounded-full mb-2 shadow-sm border-b-2 bg-emerald-500 border-yellow-500">
        🚘 Fresh Stock
      </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {latestArrivals.map((car) => (
          <motion.div
            key={car.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
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
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg 
                               hover:bg-emerald-600 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          </motion.div>
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
    <section className=" bg-gradient-to-b from-gray-50 to-white px-4">
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: false}}
          className="mt-8 mb-8 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't Find Your Preferred Brand?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We source vehicles directly from Europe. Contact us for special requests.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
               onClick={() => window.location.href = "/Vehicles"}>
                <FaSearch className="mr-2" /> View what we have in Model
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300"
               onClick={() => window.location.href = "/ContactUs"}>
                Contact Us for more inquiries.
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
   </div>
  );
}
