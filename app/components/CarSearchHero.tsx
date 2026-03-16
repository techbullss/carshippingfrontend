// components/CarSearchHero.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Make {
  id: string;
  name: string;
  count: number;
}

interface Model {
  id: string;
  name: string;
  makeId: string;
}

const BODY_TYPES = [
  { value: "", label: "All Body Types" },
  { value: "SUV", label: "SUV" },
  { value: "Sedan", label: "Sedan" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Coupe", label: "Coupe" },
  { value: "Convertible", label: "Convertible" },
  { value: "Wagon", label: "Wagon" },
  { value: "Pickup", label: "Pickup" },
  { value: "Van", label: "Van" },
];

const TRANSMISSION_TYPES = [
  { value: "", label: "Any Transmission" },
  { value: "Automatic", label: "Automatic" },
  { value: "Manual", label: "Manual" },
  { value: "Semi-Automatic", label: "Semi-Automatic" },
];

export default function CarSearchHero() {
  const router = useRouter();
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    bodyType: "",
    transmission: "",
  });

 // Fetch makes
useEffect(() => {
  const fetchMakes = async () => {
    try {
      const res = await fetch("https://api.f-carshipping.com/api/cars/makes");
      const data = await res.json();
      setMakes(data);
      setLoadingMakes(false);
    } catch (err) {
      console.error("Error fetching makes", err);
      setLoadingMakes(false);
    }
  };
  fetchMakes();
}, []);

// Fetch models when make changes
useEffect(() => {
  if (!filters.make) return;
  setLoadingModels(true);
  const fetchModels = async () => {
    try {
      // Extract just the make name without any additional text in parentheses
      const cleanMake = filters.make.split(' (')[0];
      const res = await fetch(`https://api.f-carshipping.com/api/cars/models?make=${encodeURIComponent(cleanMake)}`);
      const data = await res.json();
      setModels(data);
    } catch (err) {
      console.error("Error fetching models", err);
    } finally {
      setLoadingModels(false);
    }
  };
  fetchModels();
}, [filters.make]);

  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === "make" ? { model: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.make) params.append("brand", filters.make.split(' (')[0]);
    if (filters.model) params.append("model", filters.model);
    if (filters.bodyType) params.append("bodyType", filters.bodyType);
    if (filters.transmission) params.append("transmission", filters.transmission);
    router.push(`/Vehicles?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      make: "",
      model: "",
      bodyType: "",
      transmission: "",
    });
  };

return (
  <div className="w-full max-w-3xl">
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md border border-black/5 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
    >
      {/* Header with gradient underline */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
          Find your next vehicle
        </h1>
        <p className="text-gray-500 mt-3 text-base">
          Refined selection. Thoughtfully curated. Effortlessly searchable.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-400 via-blue-400 to-green-400 mt-4 rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Make - Red accent */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Make <span className="text-red-500 ml-1">●</span>
          </label>
          {loadingMakes ? (
            <div className="w-full rounded-2xl px-4 py-3 bg-gray-100 animate-pulse text-gray-400 text-sm">
              Loading makes…
            </div>
          ) : (
            <select
              value={filters.make}
              onChange={(e) => handleFilterChange("make", e.target.value)}
              className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-300 transition-all duration-200"
            >
              <option value="">Any Make</option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name} ({make.count})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Model - Blue accent */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Model <span className="text-blue-500 ml-1">●</span>
          </label>
          {filters.make && loadingModels ? (
            <div className="w-full rounded-2xl px-4 py-3 bg-gray-100 animate-pulse text-gray-400 text-sm">
              Loading models…
            </div>
          ) : (
            <select
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
              disabled={!filters.make}
              className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Any Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Body Type - Green accent */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Body Type <span className="text-green-500 ml-1">●</span>
          </label>
          <select
            value={filters.bodyType}
            onChange={(e) => handleFilterChange("bodyType", e.target.value)}
            className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-300 transition-all duration-200"
          >
            {BODY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission - Multi-color accent */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Transmission <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 ml-1">◆</span>
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleFilterChange("transmission", e.target.value)}
            className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-300 transition-all duration-200"
          >
            {TRANSMISSION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-12">
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 group"
        >
          <span className="w-1 h-1 rounded-full bg-red-400 group-hover:scale-150 transition-transform"></span>
          <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:scale-150 transition-transform"></span>
          <span className="w-1 h-1 rounded-full bg-green-400 group-hover:scale-150 transition-transform"></span>
          <span className="ml-2">Reset</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 via-blue-600 to-green-600 text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          Search Vehicles
        </button>
      </div>

      {/* Optional: Small color indicators for active filters */}
      {(filters.make || filters.model || filters.bodyType || filters.transmission) && (
        <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
          <span className="text-xs">Active filters:</span>
          {filters.make && <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full">Make</span>}
          {filters.model && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Model</span>}
          {filters.bodyType && <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">Body</span>}
          {filters.transmission && <span className="px-2 py-1 bg-gradient-to-r from-red-50 to-blue-50 text-gray-600 rounded-full">Transmission</span>}
        </div>
      )}
    </form>
  </div>
);
}