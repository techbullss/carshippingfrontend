"use client"
import Image from 'next/image';
import { useState } from 'react';

const VanComponent = () => {
  const [selectedVan, setSelectedVan] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  // Sample van data - replace with your actual data
  const vans = [
    {
      id: 1,
      name: "Toyota Hiace",
      year: 2022,
      price: 2850000,
      mileage: "45,000 km",
      fuelType: "Diesel",
      transmission: "Manual",
      engine: "2.8L Turbo Diesel",
      features: ["AC", "Power Steering", "Bluetooth", "Backup Camera", "Alloy Wheels"],
      description: "Well-maintained Toyota Hiace with low mileage. Perfect for passenger transport or goods delivery.",
      images: [
        "/van1-exterior.jpg",
        "/van1-interior.jpg",
        "/van1-engine.jpg",
        "/van1-dashboard.jpg"
      ]
    },
    {
      id: 2,
      name: "Nissan NV350",
      year: 2021,
      price: 2650000,
      mileage: "62,000 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      engine: "2.5L Petrol",
      features: ["AC", "Power Windows", "Touchscreen", "Cruise Control", "Spacious Interior"],
      description: "Reliable Nissan NV350 with automatic transmission. Great condition with regular service history.",
      images: [
        "/van2-exterior.jpg",
        "/van2-interior.jpg",
        "/van2-rear.jpg"
      ]
    }
  ];

  const van = vans[selectedVan];

  const formatPrice = (price:  number | bigint) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % van.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + van.images.length) % van.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Van Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Vans</h2>
        <div className="flex flex-wrap gap-2">
          {vans.map((van, index) => (
            <button
              key={van.id}
              onClick={() => {
                setSelectedVan(index);
                setCurrentImage(0);
              }}
              className={`px-4 py-2 rounded-lg ${
                selectedVan === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {van.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            {/* Replace with your actual image component */}
            <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Van Image {currentImage + 1}</span>
            </div>
            
            {/* Navigation arrows */}
            {van.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  ←
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  →
                </button>
              </>
            )}
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {van.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentImage === index ? 'bg-blue-600' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnail gallery */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {van.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`aspect-square bg-gray-300 rounded overflow-hidden ${
                  currentImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">Thumb {index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Van Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{van.name}</h1>
          <p className="text-2xl font-semibold text-blue-700 my-2">
            {formatPrice(van.price)}
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg my-4">
            <p className="text-gray-600">{van.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="flex flex-col">
              <span className="text-gray-500">Year</span>
              <span className="font-semibold">{van.year}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Mileage</span>
              <span className="font-semibold">{van.mileage}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Fuel Type</span>
              <span className="font-semibold">{van.fuelType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Transmission</span>
              <span className="font-semibold">{van.transmission}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Engine</span>
              <span className="font-semibold">{van.engine}</span>
            </div>
          </div>
          
          <div className="my-6">
            <h3 className="text-xl font-semibold mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {van.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex-1">
              Contact About This Van
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg flex-1">
              Check Shipping to Kenya
            </button>
          </div>
        </div>
      </div>
      
      {/* Shipping Information */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping to Kenya</h2>
        <p className="text-gray-600 mb-4">
          We specialize in shipping vehicles to Kenya with all necessary documentation and customs clearance handled.
          Our process includes:
        </p>
        <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
          <li>Vehicle inspection and documentation</li>
          <li>Shipping from origin port to Mombasa</li>
          <li>Customs clearance and duty payment</li>
          <li>Delivery to your preferred location in Kenya</li>
          <li>All taxes and duties included in final price</li>
          <li>Typically 4-6 weeks delivery time</li>
        </ul>
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg">
          Calculate Shipping Costs
        </button>
      </div>
    </div>
  );
};

export default VanComponent;