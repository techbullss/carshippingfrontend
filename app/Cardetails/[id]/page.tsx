"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import React from 'react';

type Vehicle = {
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

const VehicleDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (!id) return;

    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch main vehicle details
        const response = await fetch(`http://localhost:8080/api/cars/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Vehicle not found');
        }

        const data = await response.json();
        setVehicle(data);

        // Fetch similar vehicles (uncomment when ready)
        
        const similarResponse = await fetch(
          `http://localhost:8080/api/cars/similar?brand=${data.brand}&model=${data.model}&exclude=${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
        );
        const similarData = await similarResponse.json();
        setSimilarVehicles(similarData);
        
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 max-w-4xl mx-auto text-red-500 bg-red-50 rounded-lg">
      Error: {error}
    </div>
  );
  
  if (!vehicle) return (
    <div className="p-4 max-w-4xl mx-auto">
      No vehicle found
    </div>
  );
type SpecItemProps = {
  icon: React.ReactNode;
  title: string;
  value?: string;
};

const SpecItem = ({ icon, title, value }: SpecItemProps) => (
  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <span className="text-2xl mr-3" aria-hidden="true">{icon}</span>
    <div>
      <h4 className="font-medium text-gray-600 text-sm">{title}</h4>
      <p className="text-gray-800 font-semibold">{value || "Not specified"}</p>
    </div>
  </div>
);
type HighlightItemProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const HighlightItem = ({ icon, title, text }: HighlightItemProps) => (
  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
    <span className="text-2xl mr-3" aria-hidden="true">{icon}</span>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  </div>
);

type QuickSpecItemProps = {
  icon: React.ReactNode;
  value?: string;
  label: string;
};

const QuickSpecItem = ({ icon, value, label }: QuickSpecItemProps) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <div className="flex justify-center mb-1">
      {typeof icon === 'string' ? (
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      ) : (
        React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 text-gray-800" })
          : null
      )}
    </div>
    <p className="font-bold text-gray-800 text-lg">{value}</p>
    <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
  </div>
);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-blue-500">Home</a>
        <span className="mx-2">/</span>
        <a href="/vehicles" className="hover:text-blue-500">Vehicles</a>
        <span className="mx-2">/</span>
        <a href={`/vehicles?make=${vehicle.brand}`} className="hover:text-blue-500">{vehicle.brand}</a>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{vehicle.model}</span>
      </nav>
      
      {/* Main Vehicle Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Gallery */}
        <div className="lg:w-2/3">
  <div className="relative">
    {/* Main Image with Navigation */}
    <div className="bg-gray-100 rounded-lg overflow-hidden relative">
      {vehicle.imageUrls?.length > 0 ? (
        <>
          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-10">
            {`${currentImageIndex + 1}/${vehicle.imageUrls.length}`}
          </div>
          
          {/* Main Image */}
          <img 
            src={vehicle.imageUrls[currentImageIndex]} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-auto object-cover"
          />
          
          {/* Navigation Arrows */}
          {vehicle.imageUrls.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === 0 ? vehicle.imageUrls.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === vehicle.imageUrls.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <span>No image available</span>
        </div>
      )}
    </div>

    {/* Thumbnail Gallery */}
    {vehicle.imageUrls?.length > 1 && (
      <div className="flex space-x-2 mt-3 overflow-x-auto py-2">
        {vehicle.imageUrls.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
</div>
        
        {/* Vehicle Info */}
        <div className="lg:w-1/3">
          <h1 className="text-3xl font-bold mb-2">
            {vehicle.brand} {vehicle.model} {vehicle.trimLevel && <span className="text-gray-600">{vehicle.trimLevel}</span>}
          </h1>
          
          <div className="text-2xl font-bold text-blue-600 mb-6">
            KSh {vehicle.priceKes}
          </div>
          
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Year</div>
              <div className="font-medium">{vehicle.yearOfManufacture}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Mileage</div>
              <div className="font-medium">{vehicle.mileageKm} km</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Fuel</div>
              <div className="font-medium">{vehicle.fuelType}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Transmission</div>
              <div className="font-medium">{vehicle.transmission}</div>
            </div>
          </div>
          
          {/* Dealer Info */}
          {vehicle.location && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <p className="text-gray-600">{vehicle.location}</p>
            </div>
          )}
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
            Contact Seller
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('specification')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specification' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Specification
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'features' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            History
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mb-12">
       {activeTab === 'overview' && (
  <div className="space-y-6">
    {/* Main Description Card */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Vehicle Overview
      </h2>
      <div className="prose prose-sm max-w-none text-gray-700">
        {vehicle.description ? (
          <p className="whitespace-pre-line">{vehicle.description}</p>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2">No description available for this vehicle</p>
          </div>
        )}
      </div>
    </div>

    {/* Key Highlights */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Key Highlights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HighlightItem 
          icon="🏆" 
          title="Premium Package" 
          text={vehicle.trimLevel || "High-spec trim"} 
        />
        <HighlightItem 
          icon="🛡️" 
          title="Warranty" 
          text={vehicle.warranty || "Manufacturer warranty included"} 
        />
        <HighlightItem 
          icon="📜" 
          title="Service History" 
          text={vehicle.serviceHistory || "Full service history"} 
        />
        <HighlightItem 
          icon="🔑" 
          title="Ownership" 
          text={vehicle.conditionType === "New" ? "Brand new" : "Well-maintained used"} 
        />
      </div>
    </div>

    {/* Quick Specs */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        At a Glance
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickSpecItem 
          icon="📅" 
          value={vehicle.yearOfManufacture || "N/A"} 
          label="Year" 
        />
        <QuickSpecItem 
          icon="🛣️" 
          value={vehicle.mileageKm ? `${vehicle.mileageKm.toLocaleString()} km` : "N/A"} 
          label="Mileage" 
        />
        <QuickSpecItem 
          icon="⛽" 
          value={vehicle.fuelType || "N/A"} 
          label="Fuel Type" 
        />
       <QuickSpecItem 
  icon={
    <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="12" rx="1" /> {/* Car body */}
      <rect x="5" y="8" width="6" height="8" rx="0.5" /> {/* Front door */}
      <rect x="13" y="8" width="6" height="8" rx="0.5" /> {/* Rear door */}
      <circle cx="7.5" cy="12" r="0.5" fill="currentColor" /> {/* Front handle */}
      <circle cx="15.5" cy="12" r="0.5" fill="currentColor" /> {/* Rear handle */}
    </svg>
  }
  value={vehicle.doors ? `${vehicle.doors} doors` : "N/A"} 
  label="Doors" 
/>
      </div>
    </div>
  </div>
)}
       {activeTab === 'specification' && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Technical Specifications</h2>
    
    {/* Engine & Performance Section */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Engine & Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpecItem 
          icon="⚙️" 
          title="Engine Type" 
          value={vehicle.engineType || "Not specified"} 
        />
        <SpecItem 
          icon="📏" 
          title="Displacement" 
          value={vehicle.engineCapacityCc ? `${vehicle.engineCapacityCc} cc` : "Not specified"} 
        />
        <SpecItem 
          icon="🐎" 
          title="Horsepower" 
          value={vehicle.horsepower ? `${vehicle.horsepower} HP` : "Not specified"} 
        />
        <SpecItem 
          icon="🌀" 
          title="Torque" 
          value={vehicle.torque ? `${vehicle.torque} Nm` : "Not specified"} 
        />
        <SpecItem 
          icon="⏱️" 
          title="0-100 km/h" 
          value={vehicle.acceleration ? `${vehicle.acceleration} sec` : "Not specified"} 
        />
        <SpecItem 
          icon="🚀" 
          title="Top Speed" 
          value={vehicle.topSpeed ? `${vehicle.topSpeed} km/h` : "Not specified"} 
        />
      </div>
    </div>

    {/* Dimensions & Body */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
        Dimensions & Body
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpecItem 
          icon="🚗" 
          title="Body Type" 
          value={vehicle.bodyType || "Not specified"} 
        />
        <SpecItem 
          icon="🎨" 
          title="Exterior Color" 
          value={vehicle.color || "Not specified"} 
        />
        <SpecItem 
          icon="💺" 
          title="Seating Capacity" 
          value={vehicle.seats ? `${vehicle.seats} seats` : "Not specified"} 
        />
        <SpecItem 
          icon="🚪" 
          title="Doors" 
          value={vehicle.doors ? `${vehicle.doors} doors` : "Not specified"} 
        />
        <SpecItem 
          icon="🛞" 
          title="Drive Type" 
          value={vehicle.driveType || "Not specified"} 
        />
        <SpecItem 
          icon="⛽" 
          title="Fuel Type" 
          value={vehicle.fuelType || "Not specified"} 
        />
      </div>
    </div>

    {/* Transmission & Efficiency */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Transmission & Efficiency
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpecItem 
          icon="🔧" 
          title="Transmission" 
          value={vehicle.transmission || "Not specified"} 
        />
        <SpecItem 
          icon="📊" 
          title="Fuel Efficiency" 
          value={vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency} L/100km` : "Not specified"} 
        />
        <SpecItem 
          icon="🔋" 
          title="Hybrid/Electric" 
          value={vehicle.highBreed ? "Yes" : "No"} 
        />
      </div>
    </div>

    {/* Additional Specifications */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Additional Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpecItem 
          icon="📅" 
          title="Manufacture Year" 
          value={vehicle.yearOfManufacture || "Not specified"} 
        />
        <SpecItem 
          icon="🛣️" 
          title="Mileage" 
          value={vehicle.mileageKm ? `${vehicle.mileageKm} km` : "Not specified"} 
        />
        <SpecItem 
          icon="🏷️" 
          title="Trim Level" 
          value={vehicle.trimLevel || "Not specified"} 
        />
        <SpecItem 
          icon="🛡️" 
          title="Warranty" 
          value={vehicle.warranty || "Not specified"} 
        />
        <SpecItem 
          icon="🔍" 
          title="Service History" 
          value={vehicle.serviceHistory || "Not specified"} 
        />
        <SpecItem 
          icon="📍" 
          title="Location" 
          value={vehicle.location || "Not specified"} 
        />
      </div>
    </div>
  </div>
)}
        
        {activeTab === 'features' && (
  <div className="space-y-6">
    {/* Safety Features */}
    {vehicle.safetyFeatures && (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Safety Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {vehicle.safetyFeatures.split(',').map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2 text-gray-700">{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Luxury Features */}
    {vehicle.luxuryFeatures && (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Luxury Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {vehicle.luxuryFeatures.split(',').map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2 text-gray-700">{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Exterior Features */}
    {vehicle.exteriorFeatures && (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10" />
          </svg>
          Exterior Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {vehicle.exteriorFeatures.split(',').map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2 text-gray-700">{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Interior Features */}
    {vehicle.interiorFeatures && (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Interior Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {vehicle.interiorFeatures.split(',').map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2 text-gray-700">{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Display message if no features available */}
    {!vehicle.safetyFeatures && !vehicle.luxuryFeatures && !vehicle.exteriorFeatures && !vehicle.interiorFeatures && (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-2">No feature information available for this vehicle</p>
      </div>
    )}
  </div>
)}
        
        {activeTab === 'history' && (
          <div>History content goes here</div>
        )}
      </div>
      
      {/* Similar Vehicles */}
      {similarVehicles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarVehicles.map(similar => (
              <a 
                key={similar.id} 
                href={`/vehicles/${similar.id}`}
                className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  {similar.imageUrls?.[0] ? (
                    <img 
                      src={similar.imageUrls[0]} 
                      alt={similar.brand} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors duration-200">
                    {similar.brand} {similar.model}
                  </h3>
                  <div className="text-blue-600 font-bold mt-1">
                    KSh {similar.priceKes}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {similar.yearOfManufacture} • {similar.mileageKm} km
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;