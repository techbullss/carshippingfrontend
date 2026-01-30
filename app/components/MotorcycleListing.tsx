"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Motorcycle {
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
}

const MotorcycleListing = () => {
  const router = useRouter();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filters, setFilters] = useState({
    brand: "", // Changed from "make" to "brand"
    type: "",
    priceRange: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string>("");

  const motorcycleTypes = [
    "Adventure",
    "Sport",
    "Cruiser",
    "Naked",
    "Classic",
    "Scooter",
    "Touring",
    "Off-Road",
  ];
  
  const motorcycleBrands = [ // Changed from makes to brands
    "Triumph",
    "BMW",
    "Royal Enfield",
    "Ducati",
    "Kawasaki",
    "Yamaha",
    "Honda",
    "Suzuki",
    "KTM",
    "Bajaj",
    "TVS",
    "Hero",
  ];

  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "0-300000", label: "Under KES 300,000" },
    { value: "300000-600000", label: "KES 300,000 - 600,000" },
    { value: "600000-1000000", label: "KES 600,000 - 1,000,000" },
    { value: "1000000-9999999", label: "Over KES 1,000,000" },
  ];

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();

      // Use correct parameter names matching backend
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.type) params.append("type", filters.type);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.year) params.append("year", filters.year);

      params.append("page", page.toString());
      params.append("size", "9");

      // Use the PUBLIC endpoint instead of /filter
      const endpoint = "/api/motorcycles/public";
      const url = `https://api.f-carshipping.com${endpoint}?${params.toString()}`;
      
      console.log("Fetching from:", url); // Debug log

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("API Response:", data); // Debug log

      // Handle response format
      if (data.content !== undefined) {
        // Spring Page response
        setMotorcycles(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        // Direct array response
        setMotorcycles(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        console.warn("Unexpected response format:", data);
        setMotorcycles([]);
        setTotalPages(0);
        setTotalElements(0);
      }

    } catch (err: any) {
      console.error("Error fetching motorcycles:", err);
      setError(err.message || "Failed to load motorcycles");
      setMotorcycles([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, [filters, page]);

  const handleFilterChange = (key: string, value: string) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilters({
      brand: "",
      type: "",
      priceRange: "",
      year: "",
    });
  };

  // Test function to check backend data
  const testEndpoints = async () => {
    console.log("Testing endpoints...");
    
    const endpoints = [
      "/api/motorcycles/public",
      "/api/motorcycles",
      "/api/motorcycles/filter"
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`https://api.f-carshipping.com${endpoint}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        console.log(`${endpoint}:`, data);
      } catch (err) {
        console.error(`${endpoint} error:`, err);
      }
    }
  };

  // Get motorcycle count text
  const getCountText = () => {
    if (loading) return "Loading...";
    if (error) return "Error loading data";
    if (motorcycles.length === 0) return "No motorcycles found";
    return `${motorcycles.length} of ${totalElements} motorcycles found`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Debug Button (remove in production) */}
        <button
          onClick={testEndpoints}
          className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200"
        >
          Test Backend Endpoints
        </button>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="p-2 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Motorcycles For Sale</h1>
              <p className="text-sm text-gray-600">
                {getCountText()}
              </p>
            </div>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 w-fit"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Brands</option>
                {motorcycleBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motorcycle Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Types</option>
                {motorcycleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Years</option>
                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(
                  (year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Motorcycle Grid */}
        {!loading && motorcycles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {motorcycles.map((bike) => (
                <div
                  key={bike.id}
                  onClick={() => router.push(`/MotorcycleDetails/${bike.id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-gray-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    {bike.imageUrls && bike.imageUrls.length > 0 ? (
                      <img
                        src={bike.imageUrls[0]}
                        alt={`${bike.brand} ${bike.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-2 text-gray-300">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm">No Image</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bike.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : bike.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bike.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {bike.brand} {bike.model}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {bike.type} • {bike.engineCapacity}cc
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-700 font-bold text-lg">
                          KES {bike.price?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{bike.year}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {bike.location || "Location not specified"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(bike.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div className="text-sm text-gray-600">
                  Showing page {page + 1} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      page === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i;
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      page + 1 >= totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No motorcycles found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                {error || "Try adjusting your filters or search criteria to find more results."}
              </p>
              <button
                onClick={testEndpoints}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Test API Connection
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MotorcycleListing;