"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Edit, Delete } from '@mui/icons-material';
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaCar, FaRegHeart } from "react-icons/fa6";
import { FaGasPump, FaTachometerAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

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
  safetyFeatures: string;
  luxuryFeatures: string;
  exteriorFeatures: string;
  interiorFeatures: string;
  imageUrls: string[];
};

export default function VehicleListClient() {
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
  const [error, setError] = useState(false);               // <-- added
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(key: string, value: string | number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(value));
    router.push(`/Vehicles?${params.toString()}`);
  }

  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

useEffect(() => {
  let cancelled = false;
  const fetchCars = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", "12");
      params.append("sort", "priceKes,desc");
      Object.entries(filters).forEach(([k, v]) => params.append(k, v as string));

      const res = await fetch(
        `https://carshipping.duckdns.org:8443/api/cars?${params.toString()}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      if (cancelled) return;

      setCars(prev => {
        const combined = page === 0 ? data.content : [...prev, ...data.content];
        return Array.from(
          new Map(combined.map((c: Car) => [c.id, c])).values()
        ) as Car[];
      });
      setHasMore(page < data.totalPages - 1);
    } catch (e) {
      console.error("Fetch error:", e);
      if (!cancelled) {
        setError(true);
      }
    } finally {
      if (!cancelled) setLoading(false); 
    }
  };

  fetchCars();
  return () => { cancelled = true; };
}, [page, filters]);
  useEffect(() => {
    setCars([]);
    setPage(0);
    setHasMore(true);
  }, [filters]);

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
    <div>
      <div className="sticky top-0 bg-white z-50 py-4 shadow-md">
        <div className="flex flex-wrap gap-4">
          <FilterButton label="Model: Toyota" onClick={() => updateQuery("model", "Toyota")} />
          <FilterButton label="Engine: V8" onClick={() => updateQuery("engine", "V8")} />
          <FilterButton label="Price < 25k" onClick={() => updateQuery("price", 25000)} />
          <FilterButton label="Body: SUV" onClick={() => updateQuery("bodyType", "SUV")} />

          <button className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            <Link href="/AddCarForm">Add New Car</Link>
          </button>
          <button className="px-6 py-3 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition">
            More Filters
          </button>
        </div>
      </div>

      {/* ---- Empty or error state ---- */}
    {error ? (
  <div className="p-8 text-center text-red-500">
    ⚠️ Failed to load cars. Please try again later.
  </div>
) : (!loading && carData.length === 0) && (
  <div className="p-8 text-center text-gray-500">
    No cars available for the selected filters.
  </div>
)}

      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {carData.map((car, index) => (
          <motion.div
            key={car.id}
            ref={index === carData.length - 1 ? lastCarRef : null}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            className="text-center mb-12 md:mb-16"
            onClick={() => handleCarClick(car.id)}
          >
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

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {car.yearOfManufacture} • {car.mileageKm} km
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                    KES {car.priceKes}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
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

      {/* ---- Spinner ---- */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
