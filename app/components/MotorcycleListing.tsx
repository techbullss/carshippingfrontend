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
}

const MotorcycleListing = () => {
    const router = useRouter();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filters, setFilters] = useState({
    make: "",
    type: "",
    priceRange: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
  
  const motorcycleMakes = [
    "Triumph",
    "BMW",
    "Royal Enfield",
    "Ducati",
    "Kawasaki",
    "Yamaha",
    "Honda",
    "Suzuki",
    "KTM",
  ];

  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "low", label: "Under KES 600,000" },
    { value: "medium", label: "KES 600,000 - 1,000,000" },
    { value: "high", label: "Over KES 1,000,000" },
  ];

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.make) params.append("make", filters.make);
      if (filters.type) params.append("type", filters.type);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.year) params.append("year", filters.year);

      params.append("page", page.toString());
      params.append("size", "9");

      const res = await fetch(
        `https://carshipping.duckdns.org:8443/api/motorcycles/filter?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch motorcycles");
      const data = await res.json();

      setMotorcycles(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching motorcycles:", err);
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
      make: "",
      type: "",
      priceRange: "",
      year: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="container mx-auto px-4 max-w-7xl">
      

        {/* Filters Section */}
        <div className=" p-2 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 ">
            <div>
              
              <p className="text-sm text-gray-600">
                {motorcycles.length} motorcycles found
              </p>
            </div>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 w-fit"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <select
                value={filters.make}
                onChange={(e) => handleFilterChange("make", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Manufacturers</option>
                {motorcycleMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
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
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
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
                  className=" hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-gray-300"
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
                          <div className="w-8 h-8 mx-auto  text-gray-300">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm">No Image Available</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bike.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bike.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <div className="justify-content-fit items-center"><div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {bike.brand} {bike.model}
                        </h3>
                        </div>
                        <div>
                             <p className="text-gray-600 items-center  text-sm mt-1">
                          {bike.type} • {bike.engineCapacity}cc
                        </p>
                        </div>
                       
                      </div>
                      <div className="text-right">
                        <div className="text-green-700 font-bold text-lg">
                          {bike.price
                            ? `KES ${bike.price.toLocaleString()}`
                            : "Price on Request"}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Added {new Date(bike.createdAt).toLocaleDateString()}
                      </span>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or search criteria to find more results.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MotorcycleListing;