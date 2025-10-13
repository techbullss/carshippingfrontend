"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaCar, FaRegHeart, FaGasPump, FaTachometerAlt, FaFilter } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  imageUrls: string[];
};

export default function VehicleListClient() {
  const [carData, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  // Reset everything when filters change
  useEffect(() => {
    setCars([]);
    setPage(0);
    setHasMore(true);
    setFiltersApplied(true);
  }, [filters]);

  function updateQuery(key: string, value: string | number) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ---- Fetch Cars ----
  useEffect(() => {
    let cancelled = false;
    
    const fetchCars = async () => {
  if (loading || (!hasMore && page > 0)) return;

  setLoading(true);
  setError(false);

  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", "12");
    params.append("sort", "priceKes,desc");

    // ✅ use correct backend parameter names
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.model) params.append("model", filters.model);
    if (filters.transmission) params.append("transmission", filters.transmission);
    if (filters.conditionType) params.append("conditionType", filters.conditionType);
    if (filters.bodyType) params.append("bodyType", filters.bodyType);
    if (filters.fuelType) params.append("fuelType", filters.fuelType);
    if (filters.location) params.append("location", filters.location);
    if (filters.ownerType) params.append("ownerType", filters.ownerType);

    // ✅ numeric filters (use _gte and _lte)
    if (filters.minPrice) params.append("price_gte", filters.minPrice);
    if (filters.maxPrice) params.append("price_lte", filters.maxPrice);
    if (filters.minYear) params.append("year_gte", filters.minYear);
    if (filters.maxYear) params.append("year_lte", filters.maxYear);
    if (filters.minMileage) params.append("mileage_gte", filters.minMileage);
    if (filters.maxMileage) params.append("mileage_lte", filters.maxMileage);
    if (filters.minEngineCc) params.append("engine_cc_gte", filters.minEngineCc);
    if (filters.maxEngineCc) params.append("engine_cc_lte", filters.maxEngineCc);

    //  keyword search (used by backend)
    if (filters.search) params.append("search", filters.search);

    console.log("Fetching with params:", params.toString());

    const res = await fetch(`https://carshipping.duckdns.org:8443/api/cars?${params.toString()}`, {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    if (cancelled) return;

    const newCars = data.content ?? [];

    if (page === 0) {
      setCars(newCars);

      // Extract unique filter values
      const extractUnique = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter((v): v is string => Boolean(v))));

setBrands(extractUnique(newCars.map((v: { brand: any; }) => v.brand)));
setModels(extractUnique(newCars.map((v: { model: any; }) => v.model)));
setBodyTypes(extractUnique(newCars.map((v: { bodyType: any; }) => v.bodyType)));
setFuelTypes(extractUnique(newCars.map((v: { fuelType: any; }) => v.fuelType)));
    } else {
      setCars((prev) => [...prev, ...newCars]);
    }

    setHasMore(page < data.totalPages - 1);
    setFiltersApplied(false);
  } catch (e) {
    console.error("Fetch error:", e);
    if (!cancelled) setError(true);
  } finally {
    if (!cancelled) setLoading(false);
  }
};


    fetchCars();
    return () => {
      cancelled = true;
    };
  }, [page, filters]);

  const lastCarRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore || carData.length === 0) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, carData.length]
  );

  function handleCarClick(id: number): void {
    router.push(`/Cardetails/${id}`);
  }

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div>
      {/* ======= FILTER BAR ======= */}
      <div className="sticky top-0 bg-white z-5  shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition whitespace-nowrap"
            >
              Clear All
            </button>
          )}

          {/* Brand Filter Buttons */}
          <div className="flex overflow-x-auto gap-2 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 flex-1">
            <button
              onClick={() => updateQuery("brand", "")}
              className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition 
                ${!filters.brand
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              All Brands
            </button>

            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => updateQuery("brand", brand)}
                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition 
                  ${filters.brand === brand
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* More Filters Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 whitespace-nowrap"
          >
            <FaFilter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* ======= ADVANCED FILTERS MODAL ======= */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Advanced Filters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <select
                    value={filters.model ?? ""}
                    onChange={(e) => updateQuery("model", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">All Models</option>
                    {models.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    value={filters.transmission ?? ""}
                    onChange={(e) => updateQuery("transmission", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">Any Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={filters.conditionType ?? ""}
                    onChange={(e) => updateQuery("conditionType", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">Any Condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Foreign Used">Foreign Used</option>
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <select
                    value={filters.bodyType ?? ""}
                    onChange={(e) => updateQuery("bodyType", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">Any Body Type</option>
                    {bodyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={filters.fuelType ?? ""}
                    onChange={(e) => updateQuery("fuelType", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">Any Fuel Type</option>
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
  <select
    value={filters.year_gte ?? ""} 
    onChange={(e) => updateQuery("year_gte", e.target.value)} 
    className="w-full border p-2 rounded-md text-sm"
  >
    <option value="">Any Year</option>
    {yearOptions.map((year) => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
</div>

                {/* Price Range */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (KES)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice ?? ""}
                      onChange={(e) => updateQuery("minPrice", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice ?? ""}
                      onChange={(e) => updateQuery("maxPrice", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                  </div>
                </div>

                {/* Mileage Range */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage Range (km)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Mileage"
                      value={filters.minMileage ?? ""}
                      onChange={(e) => updateQuery("minMileage", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="Max Mileage"
                      value={filters.maxMileage ?? ""}
                      onChange={(e) => updateQuery("maxMileage", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50"
                  >
                    Clear All Filters
                  </button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state when filters are being applied */}
      {filtersApplied && loading && (
        <div className="p-4 text-center text-blue-600">
          Applying filters...
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {key}: {value}
                <button
                  onClick={() => updateQuery(key, "")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ======= CONTENT ======= */}
      {error ? (
        <div className="p-8 text-center text-red-500">
          ⚠️ Failed to load cars. Please try again later.
        </div>
      ) : !loading && carData.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No cars available for the selected filters.
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="block mx-auto mt-2 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters to see all cars
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {carData.map((car, index) => (
            <motion.div
              key={car.id}
              ref={index === carData.length - 1 ? lastCarRef : null}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCarClick(car.id)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Link href={`/Cardetails/${car.id}`} className="block">
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

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {car.yearOfManufacture} • {car.mileageKm} km
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap">
                      KES {car.priceKes}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaCar className="mr-2 text-blue-500" />
                      {car.bodyType}
                    </div>
                    <div className="flex items-center">
                      <FaGasPump className="mr-2 text-blue-500" />
                      {car.fuelType}
                    </div>
                    <div className="flex items-center">
                      <FaTachometerAlt className="mr-2 text-blue-500" />
                      {car.transmission}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loader */}
      {loading && !filtersApplied && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}