"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Delete } from '@mui/icons-material';

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaCar, FaRegHeart } from "react-icons/fa6";
import { FaGasPump, FaTachometerAlt } from "react-icons/fa";
import router from "next/router";


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

  function handleCarClick(id: number): void {
    router.push(`/Cardetails/${id}`);
  }

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
<div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carData.map((car) => (
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
              onClick={() => handleCarClick(car.id)}
            >
              {/* Image with favorite button */}
              <Link href={`/Cardetails/${car.id}`} className="relative block cursor-pointer">
                <div className="relative">
                  <img
                    src={car.imageUrls?.[0] || "/car-placeholder.jpg"}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-64 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-red-100 transition-colors">
                  <FaRegHeart className="text-red-500 text-xl" />
                </button>
                {car.conditionType && (
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {car.conditionType}
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
                    <p className="text-gray-500 text-sm">{car.yearOfManufacture} • {car.mileageKm} km</p>
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
                <div className="flex items-center space-x-2">
      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
        <Edit fontSize="small" />
      </button>
      <button className="p-2 text-red-500 hover:bg-red-50 rounded-full">
        <Delete fontSize="small" />
      </button>
    </div>
              
              </div>
              </Link>
            </motion.div>
          ))}
        </div>


    </div>
  );
}
