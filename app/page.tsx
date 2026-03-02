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
<section className="bg-white py-4">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-gray-900">
        Trusted Vehicle Dealership
      </h1>
      <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
      <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
        We supply quality cars, commercial vehicles, and motorcycles —
        available locally and through direct international import.
      </p>
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

      {/* Left Image */}
     <div className="w-full h-[520px] flex items-center justify-center">
  <img
    src="/merced.jpg"
    alt="Mercedes"
    className="max-h-full max-w-full object-contain"
  />
</div>

      {/* Right Content */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Our Vehicle Categories
        </h2>

        <div className="space-y-6">

          <div>
            <h3 className="font-semibold text-gray-900">Passenger Vehicles</h3>
            <p className="text-gray-600 text-sm">
              Sedans, SUVs, and family vehicles ready for immediate purchase or import.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Commercial Vehicles</h3>
            <p className="text-gray-600 text-sm">
              Pickups, vans, trucks, and fleet solutions for business and logistics.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Motorcycles</h3>
            <p className="text-gray-600 text-sm">
              Reliable local stock and international imports.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Direct Imports</h3>
            <p className="text-gray-600 text-sm">
              We manage sourcing, inspection, shipping, and clearance from start to finish.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
        

          <button
            onClick={() => window.location.href = "/ContactUs"}
            className="px-8 py-3 border border-green-600 text-green-600 text-sm font-semibold uppercase tracking-wide hover:bg-green-700 hover:text-white transition"
          >
            Contact Sales
          </button>
        </div>

      </div>

    </div>

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
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={car.imageUrls?.[0] || "/car-placeholder.jpg"}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-56 object-cover"
        />

        {/* Favorite */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition">
          <FaRegHeart className="text-gray-600 text-sm" />
        </button>

        {/* New Badge */}
        {car.isNew && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Title + Price */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              {car.yearOfManufacture} • {car.mileage} km
            </p>
          </div>

          <span className="text-sm font-semibold text-gray-900">
            KES {car.priceKes.toLocaleString()}
          </span>
        </div>

        {/* Features */}
        <div className="flex justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FaCar className="text-gray-400" />
            {car.bodyType}
          </div>
          <div className="flex items-center gap-1">
            <FaGasPump className="text-gray-400" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <FaTachometerAlt className="text-gray-400" />
            {car.transmission}
          </div>
        </div>

        {/* Button */}
        {!usingFallback && (
          <button
            onClick={() => handleCarClick(car.id)}
            className="w-full mt-3 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            View Details
          </button>
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
{/**<section>
      <div className="border-t border-gray-200 my-12">
        <EuropeanCarsHero />
      </div>
</section>*/}
    <section className=" bg-gradient-to-b from-gray-50 py-8 to-white ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
      { /**  <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <FaCarSide className="mr-2" /> Premium Selection
          </span>
        
        </motion.div> */}

        {/* Brands Grid */}
       {/**  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
        </div> */}

        {/* CTA Section */}
<div className="relative w-full text-white py-24 overflow-hidden">

  {/* Background Video */}
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    src="/241574_medium.mp4"
    autoPlay
    loop
    muted
    playsInline
  />

  {/* Dark Overlay for readability */}
  <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10 w-full text-center ">

    {/* Gold Accent Line */}
    <div className="flex justify-center mb-8">
      <div className="w-16 h-[2px] bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600"></div>
    </div>

    {/* Heading */}
    <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
      How we  Source
    </h2>

    {/* Subheading */}
    <p className="max-w-3xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed mb-10">
      When excellence is not on the lot, we source it worldwide.
      Our team locates, inspects, and delivers the exact vehicle you desire —
      discreetly, professionally, without compromise.
    </p>

    {/* Divider */}
    <div className="flex justify-center mb-12">
      <div className="w-24 h-px bg-white"></div>
    </div>

    {/* Features */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-sm tracking-widest uppercase text-gray-200 mb-14">
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
        className="px-12 py-4 border border-white text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition duration-300"
      >
        Request a Vehicle
      </button>

    </div>

    {/* Signature Line */}
    <div className="mt-16 text-xs tracking-[0.3em] uppercase text-gray-300">
      Precision. Luxury. Delivered.
    </div>

  </div>
</div>
      </div>
    </section>
   </div>
  );
}
