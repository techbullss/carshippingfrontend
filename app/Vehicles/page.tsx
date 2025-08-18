"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaCar } from "react-icons/fa6";
import { FaGasPump, FaTachometerAlt } from "react-icons/fa";


type Car = {
  id: number;
  brand: string;
  model: string;
  yearOfManufacture: string;
  conditionType: string;
  bodyType: string;
  color: string;
  engineType: string;
  engineCapacityCc: string;
  fuelType: string;
  transmission: string;
  seats: string;
  doors: string;
  mileageKm: string;
  priceKes: string;
  description: string;
  location: string;
  highBreed: boolean;
  engineCapacityUnit: string;
  trimLevel: string;
  horsepower: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  driveType: string;
  infotainmentSystem: string;
  soundSystem: string;
  fuelEfficiency: string;
  warranty: string;
  serviceHistory: string;
  // Will be populated from checkboxes
  safetyFeatures: string;
  luxuryFeatures: string;
  exteriorFeatures: string;
  interiorFeatures: string;
  imageUrls: string[];
};


export default function VehicleListPage() {
  // Reusable SpecIcon component
const SpecIcon = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center space-x-2 text-gray-700">
    <span className="text-gray-400">{icon}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
    const [carData, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ type: string; value: string | number } | null>(null);
 const observer = useRef<IntersectionObserver | null>(null);

  const fetchCars = useCallback(async () => {
  if (loading || !hasMore) return; // Add check for hasMore here
  setLoading(true);

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", "12");
  params.append("sort", "priceKes,desc");

  if (filter) {
    params.append(filter.type, filter.value.toString());
  }

  try {
    const res = await fetch(`https://carshippingbackend.onrender.com/api/cars?${params.toString()}`);
    const data = await res.json();

    // Check if we got new data and filter out duplicates
    const newCars = data.content.filter(
      (newCar: Car) => !carData.some(existingCar => existingCar.id === newCar.id)
    );

    if (newCars.length > 0) {
      setCars(prev => {
      // Merge old + new
      const combined = page === 0 ? data.content : [...prev, ...data.content];

      // Deduplicate by id
      return Array.from(new Map(combined.map((car: { id: any; }) => [car.id, car])).values()) as Car[];
    });
    } else {
      setHasMore(false); // No new cars means we've reached the end
    }

    // Update hasMore based on the response
    setHasMore(page < data.totalPages - 1);
  } catch (error) {
    console.error("Error fetching cars:", error);
  } finally {
    setLoading(false);
  }
}, [page, filter, loading, hasMore, carData]);
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Reset data when filters change
  useEffect(() => {
    setCars([]);
    setPage(0);
    setHasMore(true);
  }, [filter]);

 const lastCarRef = useCallback(
  (node: HTMLDivElement) => {
    if (loading || !hasMore || carData.length === 0) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  },
  [loading, hasMore, carData.length]
);
  

  const FilterButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-full bg-white text-black hover:bg-gray-100 transition"
    >
      <span>{label}</span>
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <ChevronRight size={18} />
      </motion.div>
    </button>
  );

  return (
    <div className="">
      <div className="sticky top-0 bg-white z-50 py-4 shadow-md">
  <div className="flex flex-wrap gap-4">
    <FilterButton
      label="Model: Toyota"
      onClick={() => setFilter({ type: "model", value: "Toyota" })}
    />
    <FilterButton
      label="Engine: V8"
      onClick={() => setFilter({ type: "engine", value: "V8" })}
    />
    <FilterButton
      label="Price < 25k"
      onClick={() => setFilter({ type: "price", value: 25000 })}
    />
    <FilterButton
      label="Body: SUV"
      onClick={() => setFilter({ type: "bodyType", value: "SUV" })}
    />

    {/* Extra Buttons */}
    <button className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
      <Link href="/AddCarForm">Add New Car</Link>
    </button>
    <button className="px-6 py-3 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition">
      More Filters
    </button>
  </div>
</div>

{/* Vehicle Grid */}
<div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
  {carData.map((car) => (
    <div 
      key={car.id}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <Link href={`/Cardetails/${car.id}`} className="block">
        {/* Image with badge */}
       <div className="relative w-full h-full bg-gray-100 overflow-hidden group">
  {car.imageUrls?.[0] ? (
     <img
      src={car.imageUrls[0]}
      alt={`${car.brand} ${car.model}`}
      className="w-full h-full object-fit object-center transition-transform duration-500 group-hover:scale-105"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2
             l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6
             20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2
             0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )}

  <div className="absolute top-3 left-3 flex flex-col space-y-2">
    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
      NEW
    </span>
    {car.highBreed && (
      <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
        HYBRID
      </span>
    )}
  </div>
</div>

        {/* Vehicle Details */}
        <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-gray-500 text-sm">{car.yearOfManufacture} • {car.mileageKm} km</p>
                          </div>
                          
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
                        <div className="p-4">
                          <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                            KES {car.priceKes}
                          </span>

                        </div>
        
                       
                      
                      </div>
      </Link>

      {/* Admin Actions */}
      <div className="px-5 pb-4 flex justify-end space-x-3">
        <button 
          onClick={() => {/* handle edit */}}
          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button 
          onClick={() => {/* handle delete */}}
          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>


    </div>
  );
}
