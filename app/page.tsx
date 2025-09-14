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
  <section
  className=" flex items-center 
             bg-[url('/cars.jpg')] bg-cover bg-center bg-no-repeat"
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
