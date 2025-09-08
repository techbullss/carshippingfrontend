"use client"
import Image from "next/image";
import { FaCarSide, FaSearch, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import CarSearchHero from "./components/CarSearchHero";
import { CheckBadgeIcon, GlobeAltIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {  FaRegHeart, FaCar, FaGasPump, FaTachometerAlt } from 'react-icons/fa';
import EuropeanCarsHero from "./components/EuropeanCarsHero";
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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("https://carshipping.duckdns.org:8443/api/cars/latest");
        const data = await res.json();
        setLatestArrivals(data);
      } catch (error) {
        console.error("Error fetching latest arrivals:", error);
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
  return (
   <div>
   <section className="relative min-h-screen overflow-hidden flex items-center">
  {/* Background with gradient overlay */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/bc.jpg" 
      alt="Luxury car showroom"
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-indigo-900/90"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10 py-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left Column - Search & CTA */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ 
          opacity: 1, 
          x: 0,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 100,
            delay: 0.2
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-8"
      >
        {/* Headline */}
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover Your Dream <span className="text-blue-300">Premium Vehicle</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-md">
            Explore our curated collection of luxury vehicles and find the perfect match for your lifestyle.
          </p>
        </div>

        {/* Search Component */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <CarSearchHero />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-blue-200 text-sm">Premium Vehicles</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-blue-200 text-sm">Customer Satisfaction</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white">30+</div>
            <div className="text-blue-200 text-sm">Years Experience</div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Featured Vehicle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 100,
            delay: 0.4
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform transition-transform duration-700 hover:scale-[1.02]">
          {/* Featured Vehicle Badge */}
          <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Featured Vehicle
          </div>

          {/* Featured Vehicle Image */}
          <div className="relative h-72 md:h-96">
            <Image
              src="/benz.jpg"
              alt="Featured Luxury Vehicle"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Gradient overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>

          {/* Vehicle Details */}
          <div className="p-6 bg-gradient-to-b from-black/70 to-black/90 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
              <div>
                <h3 className="text-2xl font-bold">2023 Mercedes-Benz S-Class</h3>
                <p className="text-gray-300">Premium Luxury Sedan</p>
              </div>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold whitespace-nowrap">
                KES 12,500,000
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-blue-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="font-bold">5.0L</div>
                <div className="text-xs text-gray-300">Engine</div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-blue-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-bold">8,200 km</div>
                <div className="text-xs text-gray-300">Mileage</div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-blue-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div className="font-bold">Automatic</div>
                <div className="text-xs text-gray-300">Transmission</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
     <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              You name it, we have it!
            </span>
          </h2>
         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
  We deliver authentic European performance - every vehicle comes with complete service 
  history and meets strict TÜV-certified mechanical standards.
</p>
        </div>

        {/* Image Banner */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src="/cars.png" // Replace with your actual image path
              alt="Global car sourcing network"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-emerald-900/50 flex items-center justify-center">
              <div className="text-center p-6">
               <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
  Mercedes. BMW. Porsche. Jaguar.
</h3>
<p className="text-blue-100 text-lg max-w-2xl mx-auto">
  The definitive collection of Europe's most coveted automotive marques
</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Global Sourcing Card with UK Focus */}
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 group">
  <div className="p-6">
  
    {/* UK Brands Section */}
    <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-4 rounded-xl border border-blue-200/50">
      <div className="text-center mb-4">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-full border border-blue-500/30 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium text-sm">UK Manufacturing Excellence</span>
        </div>
      </div>
      
      {/* UK Brands Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Aston Martin', color: 'bg-green-500/10 text-green-700' },
          { name: 'Bentley', color: 'bg-red-500/10 text-red-700' },
          { name: 'Rolls-Royce', color: 'bg-gray-800/10 text-gray-800' },
          { name: 'Land Rover', color: 'bg-green-500/10 text-green-700' },
          { name: 'Jaguar', color: 'bg-blue-500/10 text-blue-700' },
          { name: 'McLaren', color: 'bg-orange-500/10 text-orange-700' },
          { name: 'Lotus', color: 'bg-yellow-500/10 text-yellow-700' },
          { name: 'Mini', color: 'bg-red-500/10 text-red-700' }
        ].map((brand) => (
          <div 
            key={brand.name} 
            className={`px-3 py-2 ${brand.color} rounded-lg text-xs font-medium text-center transition-all duration-200 hover:scale-105 hover:shadow-sm`}
          >
            {brand.name}
          </div>
        ))}
      </div>
      
      {/* Footer Note */}
      <p className="text-xs text-center text-gray-500 mt-3">
        Premium British automotive engineering
      </p>
    </div>
  </div>
</div>
          {/* Quality Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-6 mx-auto">
                <CheckBadgeIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Uncompromising Quality</h3>
              <p className="text-gray-600 text-center">
                Thorough inspections before shipment ensure you receive vehicles in the best possible condition.
              </p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Quality Guaranteed
                </span>
              </div>
            </div>
          </div>

          {/* Reliability Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-6 mx-auto">
                <ShieldCheckIcon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">30 Years of Trust</h3>
              <p className="text-gray-600 text-center">
                Our decades of excellence in the used car industry ensure reliability you can count on.
              </p>
              <div className="mt-6">
                <div className="flex justify-center items-center">
                  <div className="text-4xl font-bold text-amber-600 mr-2">30+</div>
                  <div className="text-gray-600">Years<br/>Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-6 mx-auto">
                <RocketLaunchIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Lightning Fast Delivery</h3>
              <p className="text-gray-600 text-center">
                Prompt worldwide shipment gets you behind the wheel of your dream car faster than you imagine.
              </p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-800 rounded-full">
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Fast Global Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
     <section className=" bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5 }}
          viewport={{ once: false }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-3">
            Fresh Stock
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              Latest Arrivals 🚘
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Just imported - find your perfect ride from our newest collection
          </p>
        </motion.div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArrivals.map((car) => (
            <motion.div
              key={car.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-20% 0px -20% 0px" }} // Triggers in both directions
              variants={{
                hidden: { opacity: 0, y: 50 },
               visible: { opacity: 1, y: 0 }
             }}
             transition={{ 
               duration: 3,
               ease: [0.16, 1, 0.3, 1]
             }}
             whileHover={{ scale: 1.02 }}
              className="text-center mb-12 md:mb-16"
            >
              {/* Image with favorite button */}
              <div className="relative">
                <img
                  src={car.imageUrls?.[0] || "/car-placeholder.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-64 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-red-100 transition-colors">
                  <FaRegHeart className="text-red-500 text-xl" />
                </button>
                {car.isNew && (
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Car Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-500 text-sm">{car.yearOfManufacture} • {car.mileage} km</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                    KES {car.priceKes}
                  </span>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 my-">
                  <div className="flex items-center text-gray-600">
                    <FaCar className="mr-2 text-blue-500" />
                    <span className="text-sm">{car.bodyType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaGasPump className="mr-2 text-blue-500" />
                    <span className="text-sm">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaTachometerAlt className="mr-2 text-blue-500" />
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                </div>

                {/* CTA Button */}
              
              </div>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
<section>
      <div className="border-t border-gray-200 my-12">
        <EuropeanCarsHero />
      </div>
</section>
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white px-4">
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              European Excellence 🌍
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover luxury and performance from Europe's finest automakers
          </p>
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
                
                <button className="flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Models <FaChevronRight className="ml-1 text-xs" />
                </button>
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
          className="mt-16 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't Find Your Preferred Brand?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We source vehicles directly from Europe. Contact us for special requests.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                <FaSearch className="mr-2" /> Request Specific Model
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300">
                Contact Our European Specialists
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
   </div>
  );
}
