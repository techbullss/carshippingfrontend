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

const PRICE_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0-500000", label: "Under KSh 500,000" },
  { value: "500000-1000000", label: "KSh 500,000 - 1M" },
  { value: "1000000-3000000", label: "KSh 1M - 3M" },
  { value: "3000000-5000000", label: "KSh 3M - 5M" },
  { value: "5000000-10000000", label: "KSh 5M - 10M" },
  { value: "10000000", label: "Over KSh 10M" },
];

const CONDITION_TYPES = [
  { value: "", label: "All Conditions" },
  { value: "new", label: "Brand New" },
  { value: "used", label: "Used" },
];

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

const FUEL_TYPES = [
  { value: "", label: "Any Fuel Type" },
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Electric", label: "Electric" },
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
    priceRange: "",
    conditionType: "",
    bodyType: "",
    transmission: "",
    fuelType: "",
  });

  // Fetch makes from API
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch('/api/makes');
        const data = await response.json();
        setMakes(data);
      } catch (error) {
        console.error("Error fetching makes:", error);
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    if (!filters.make) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const response = await fetch(`/api/models?make=${filters.make}`);
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error("Error fetching models:", error);
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
      ...(name === 'make' ? { model: "" } : {}) // Reset model when make changes
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (filters.make) params.append('make', filters.make);
    if (filters.model) params.append('model', filters.model);
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.conditionType) params.append('conditionType', filters.conditionType);
    if (filters.bodyType) params.append('bodyType', filters.bodyType);
    if (filters.transmission) params.append('transmission', filters.transmission);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);

    router.push(`/vehicles?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      make: "",
      model: "",
      priceRange: "",
      conditionType: "",
      bodyType: "",
      transmission: "",
      fuelType: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Find Your Perfect Vehicle</h1>
          <p className="text-sm text-gray-600 mt-1">Search our inventory of premium European vehicles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Condition Type */}
          <div>
            <label htmlFor="conditionType" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <div className="relative">
              <select
                id="conditionType"
                name="conditionType"
                value={filters.conditionType}
                onChange={(e) => handleFilterChange('conditionType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CONDITION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Make Selector */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <div className="relative">
              {loadingMakes ? (
                <div className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-100 animate-pulse">
                  Loading makes...
                </div>
              ) : (
                <select
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>

          {/* Model Selector */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <div className="relative">
              {filters.make && loadingModels ? (
                <div className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-100 animate-pulse">
                  Loading models...
                </div>
              ) : (
                <select
                  id="model"
                  name="model"
                  value={filters.model}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  disabled={!filters.make}
                  className={`w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !filters.make ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                  }`}
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
          </div>

          {/* Body Type */}
          <div>
            <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
              Body Type
            </label>
            <div className="relative">
              <select
                id="bodyType"
                name="bodyType"
                value={filters.bodyType}
                onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BODY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="relative">
              <select
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transmission Type */}
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <div className="relative">
              <select
                id="transmission"
                name="transmission"
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TRANSMISSION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <div className="relative">
              <select
                id="fuelType"
                name="fuelType"
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {FUEL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Search Vehicles
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}