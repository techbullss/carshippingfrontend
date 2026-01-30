"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Filter, Heart, Zap, MapPin, Calendar, Fuel } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  type: string;
  engineCapacity: number;
  price: number;
  location: string;
  owner: string;
  status: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
  year: number;
  features?: string[];
};

export default function MotorcycleListing() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
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
    setMotorcycles([]);
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

  // Generate year options (last 25 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - i);

  // Fetch Motorcycles
  useEffect(() => {
    let cancelled = false;
    
    const fetchMotorcycles = async () => {
      if (loading || (!hasMore && page > 0)) return;

      setLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", "12");

        // Add sorting
        if (filters.sort === "price-low") {
          params.append("sort", "price,asc");
        } else if (filters.sort === "price-high") {
          params.append("sort", "price,desc");
        } else if (filters.sort === "year-new") {
          params.append("sort", "year,desc");
        } else if (filters.sort === "year-old") {
          params.append("sort", "year,asc");
        } else {
          params.append("sort", "createdAt,desc"); // default
        }

        // Add filters
        if (filters.brand) params.append("brand", filters.brand);
        if (filters.type) params.append("type", filters.type);
        if (filters.location) params.append("location", filters.location);
        if (filters.year) params.append("year", filters.year);
        if (filters.search) params.append("search", filters.search);

        // Price range filter
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

        // Engine capacity range
        if (filters.minEngine) params.append("minEngineCapacity", filters.minEngine);
        if (filters.maxEngine) params.append("maxEngineCapacity", filters.maxEngine);

        console.log("Fetching with params:", params.toString());

        const res = await fetch(`https://api.f-carshipping.com/api/motorcycles/public?${params.toString()}`, {
          credentials: "include",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        if (cancelled) return;

        const newMotorcycles = data.content ?? [];

        if (page === 0) {
          setMotorcycles(newMotorcycles);

          // Extract unique filter values
          const extractUnique = (arr: (string | undefined | null)[]) =>
            Array.from(new Set(arr.filter((v): v is string => Boolean(v))));

          setBrands(extractUnique(newMotorcycles.map((v: { brand: any; }) => v.brand)));
          setTypes(extractUnique(newMotorcycles.map((v: { type: any; }) => v.type)));
        } else {
          setMotorcycles((prev) => [...prev, ...newMotorcycles]);
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

    fetchMotorcycles();
    return () => {
      cancelled = true;
    };
  }, [page, filters]);

  const lastMotorcycleRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore || motorcycles.length === 0) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, motorcycles.length]
  );

  function handleMotorcycleClick(id: string): void {
    router.push(`/MotorcycleDetails/${id}`);
  }

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return 'bg-emerald-500 text-white';
    if (status === 'PENDING') return 'bg-amber-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ======= FILTER BAR ======= */}
      <div className="sticky top-0 bg-white z-50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
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
            <Filter className="w-4 h-4" />
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
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type ?? ""}
                    onChange={(e) => updateQuery("type", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={filters.year ?? ""}
                    onChange={(e) => updateQuery("year", e.target.value)}
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

                {/* Engine Capacity Range */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Capacity (cc)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Engine"
                      value={filters.minEngine ?? ""}
                      onChange={(e) => updateQuery("minEngine", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="Max Engine"
                      value={filters.maxEngine ?? ""}
                      onChange={(e) => updateQuery("maxEngine", e.target.value)}
                      className="border p-2 rounded-md text-sm w-1/2"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location ?? ""}
                    onChange={(e) => updateQuery("location", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  />
                </div>

                {/* Sorting */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sort ?? ""}
                    onChange={(e) => updateQuery("sort", e.target.value)}
                    className="w-full border p-2 rounded-md text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-new">Year: Newest</option>
                    <option value="year-old">Year: Oldest</option>
                  </select>
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
          ⚠️ Failed to load motorcycles. Please try again later.
        </div>
      ) : !loading && motorcycles.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No motorcycles available for the selected filters.
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="block mx-auto mt-2 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters to see all motorcycles
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {motorcycles.map((motorcycle, index) => (
            <motion.div
              key={motorcycle.id}
              ref={index === motorcycles.length - 1 ? lastMotorcycleRef : null}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleMotorcycleClick(motorcycle.id)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={motorcycle.imageUrls?.[0] || "/motorcycle-placeholder.jpg"}
                  alt={`${motorcycle.brand} ${motorcycle.model}`}
                  className="w-full h-64 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-red-100 transition-colors">
                  <Heart className="text-red-500 w-5 h-5" />
                </button>
                {motorcycle.status && (
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(motorcycle.status)}`}>
                    {motorcycle.status}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {motorcycle.brand} {motorcycle.model}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {motorcycle.year} • {motorcycle.engineCapacity} cc
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    {formatPrice(motorcycle.price)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Zap className="mr-2 text-blue-500 w-4 h-4" />
                    {motorcycle.type}
                  </div>
                  <div className="flex items-center">
                    <Fuel className="mr-2 text-blue-500 w-4 h-4" />
                    {motorcycle.engineCapacity} cc
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-blue-500 w-4 h-4" />
                    {motorcycle.year}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-blue-500 w-4 h-4" />
                    {motorcycle.location || "N/A"}
                  </div>
                </div>

                {/* Features Preview */}
                {motorcycle.features && motorcycle.features.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {motorcycle.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {motorcycle.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          +{motorcycle.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <span>Listed {new Date(motorcycle.createdAt).toLocaleDateString()}</span>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
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

      {/* Load More Button (Alternative to infinite scroll) */}
      {hasMore && !loading && motorcycles.length > 0 && (
        <div className="text-center py-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Motorcycles
          </button>
        </div>
      )}
    </div>
  );
}