"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  TrendingUp,
  Shield,
  Zap,
  Calendar,
  MapPin,
  Fuel,
  Eye
} from "lucide-react";

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
  features?: string[];
}

const MotorcycleListing = () => {
  const router = useRouter();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    priceRange: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const motorcycleTypes = [
    { value: "", label: "All Types", icon: "⚡" },
    { value: "Adventure", label: "Adventure", icon: "🏔️" },
    { value: "Sport", label: "Sport", icon: "🏍️" },
    { value: "Cruiser", label: "Cruiser", icon: "🛥️" },
    { value: "Naked", label: "Naked", icon: "💪" },
    { value: "Classic", label: "Classic", icon: "👑" },
    { value: "Scooter", label: "Scooter", icon: "🛵" },
    { value: "Touring", label: "Touring", icon: "🧳" },
    { value: "Off-Road", label: "Off-Road", icon: "🏜️" },
  ];
  
  const motorcycleBrands = [
    { value: "", label: "All Brands", icon: "🏁" },
    { value: "Triumph", label: "Triumph", icon: "🇬🇧" },
    { value: "BMW", label: "BMW", icon: "🇩🇪" },
    { value: "Royal Enfield", label: "Royal Enfield", icon: "🇮🇳" },
    { value: "Ducati", label: "Ducati", icon: "🇮🇹" },
    { value: "Kawasaki", label: "Kawasaki", icon: "🇯🇵" },
    { value: "Yamaha", label: "Yamaha", icon: "🇯🇵" },
    { value: "Honda", label: "Honda", icon: "🇯🇵" },
    { value: "Suzuki", label: "Suzuki", icon: "🇯🇵" },
    { value: "KTM", label: "KTM", icon: "🇦🇹" },
    { value: "Bajaj", label: "Bajaj", icon: "🇮🇳" },
    { value: "TVS", label: "TVS", icon: "🇮🇳" },
    { value: "Hero", label: "Hero", icon: "🇮🇳" },
  ];

  const priceRanges = [
    { value: "", label: "All Prices", description: "Any price" },
    { value: "0-300000", label: "KES 0-300K", description: "Budget friendly" },
    { value: "300000-600000", label: "KES 300K-600K", description: "Mid-range" },
    { value: "600000-1000000", label: "KES 600K-1M", description: "Premium" },
    { value: "1000000-9999999", label: "KES 1M+", description: "Luxury" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: "🆕" },
    { value: "price-low", label: "Price: Low to High", icon: "⬆️" },
    { value: "price-high", label: "Price: High to Low", icon: "⬇️" },
    { value: "year-new", label: "Year: Newest", icon: "📅" },
    { value: "year-old", label: "Year: Oldest", icon: "📜" },
  ];

  const fetchMotorcycles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();

      // Add filters
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.type) params.append("type", filters.type);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.year) params.append("year", filters.year);
      if (searchQuery) params.append("search", searchQuery);

      // Add sorting
      if (sortBy === "newest") {
        params.append("sort", "createdAt,desc");
      } else if (sortBy === "price-low") {
        params.append("sort", "price,asc");
      } else if (sortBy === "price-high") {
        params.append("sort", "price,desc");
      } else if (sortBy === "year-new") {
        params.append("sort", "year,desc");
      } else if (sortBy === "year-old") {
        params.append("sort", "year,asc");
      }

      params.append("page", page.toString());
      params.append("size", "12");

      const endpoint = "/api/motorcycles/public";
      const url = `https://api.f-carshipping.com${endpoint}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.content !== undefined) {
        setMotorcycles(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setMotorcycles(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setMotorcycles([]);
        setTotalPages(0);
        setTotalElements(0);
      }

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Unable to load motorcycles");
      setMotorcycles([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, searchQuery, sortBy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMotorcycles();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchMotorcycles]);

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
    setSearchQuery("");
    setSortBy("newest");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
      PENDING: "bg-amber-100 text-amber-800 border-amber-200",
      REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Premium Marketplace
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Perfect Ride
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Explore our curated collection of premium motorcycles. 
              Find adventure, performance, and style in every listing.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search motorcycles by brand, model, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold">{totalElements}</span> Total Listings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold">{motorcycles.filter(m => m.status === 'APPROVED').length}</span> Verified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold">{motorcycles.filter(m => m.year >= new Date().getFullYear() - 2).length}</span> New Models
              </span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 animate-slideDown">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Refine Your Search</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {motorcycleBrands.map((brand) => (
                    <option key={brand.value} value={brand.value}>
                      {brand.icon} {brand.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {motorcycleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                {filters.priceRange && (
                  <p className="mt-2 text-xs text-gray-500">
                    {priceRanges.find(r => r.value === filters.priceRange)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(
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
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-20">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading premium motorcycles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-4 text-rose-100">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={fetchMotorcycles}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : motorcycles.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Motorcycles
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing <span className="font-semibold">{motorcycles.length}</span> of{" "}
                  <span className="font-semibold">{totalElements}</span> results
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
              </div>
            </div>

            {/* Motorcycle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {motorcycles.map((bike) => (
                <div
                  key={bike.id}
                  onClick={() => router.push(`/MotorcycleDetails/${bike.id}`)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {bike.imageUrls && bike.imageUrls.length > 0 ? (
                      <>
                        <img
                          src={bike.imageUrls[0]}
                          alt={`${bike.brand} ${bike.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-400">Image Coming Soon</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(bike.status)}`}>
                        {bike.status}
                      </span>
                    </div>
                    
                    {/* Quick View Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-xl text-white text-sm">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {bike.type}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 ${getStatusBadge(bike.status)} rounded-full`}>
                            {bike.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {bike.brand} {bike.model}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-700">
                          {formatPrice(bike.price)}
                        </div>
                        <div className="text-xs text-gray-500">Negotiable</div>
                      </div>
                    </div>
                    
                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Fuel className="w-4 h-4" />
                        <span className="text-sm">{bike.engineCapacity}cc</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{bike.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm truncate">{bike.location || "N/A"}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Listed {new Date(bike.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Features Preview */}
                    {bike.features && bike.features.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {bike.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                          {bike.features.length > 3 && (
                            <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                              +{bike.features.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Description Preview */}
                    {bike.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {bike.description}
                      </p>
                    )}
                    
                    {/* Action Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group-hover:shadow-lg">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mb-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages} • {totalElements} total motorcycles
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage(p => Math.max(p - 1, 0))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        page === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i;
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNumber)}
                            className={`w-12 h-12 rounded-xl font-medium transition-all ${
                              page === pageNumber
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md"
                            }`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        page + 1 >= totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-200">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Motorcycles Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We couldn't find any motorcycles matching your criteria. 
              Try adjusting your filters or check back later for new listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Adjust Filters
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!loading && motorcycles.length > 0 && (
          <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Can't Find Your Dream Bike?
              </h3>
              <p className="text-gray-600 mb-6">
                Set up a custom alert and we'll notify you when a matching motorcycle 
                becomes available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors">
                  Create Alert
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 font-medium transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MotorcycleListing;