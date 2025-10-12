"use client";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import React from 'react';
import { FaRegHeart } from 'react-icons/fa';

export type Motorcycle = {
  id: number;
  brand: string;
  model: string;
  type: string;
  engineCapacity: number;
  status: string;
  price: number;
  location: string;
  owner: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  features: string[];
  year: number;
};

const MotorcycleDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarMotorcycles, setSimilarMotorcycles] = useState<Motorcycle[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [openSpec, setOpenSpec] = useState(false);
  const [openFeat, setOpenFeat] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [openDrawer, setOpenDrawer] = useState<null | "history" | "safety">(null);


 const preview =
    (motorcycle?.description ?? "").length > 70
      ? motorcycle?.description?.slice(0, 70) + "..."
      : motorcycle?.description ?? "";
      
 useEffect(() => {
  if (!id) return;

  const fetchMotorcycleDetails = async () => {
    try {
      setLoading(true);

      // Fetch main motorcycle details
      const response = await fetch(`https://carshipping.duckdns.org:8443/api/motorcycles/${id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Motorcycle not found");
      }

      const data = await response.json();

      // Normalize data (in case some fields are missing)
      const normalizeMotorcycle = (raw: any): Motorcycle => ({
        id: raw.id,
        brand: raw.brand || "",
        model: raw.model || "",
        type: raw.type || "",
        engineCapacity: raw.engineCapacity || 0,
        status: raw.status || "",
        price: raw.price || 0,
        location: raw.location || "",
        owner: raw.owner || "",
        description: raw.description || "",
        imageUrls: raw.imageUrls || [],
        createdAt: raw.createdAt || "",
        updatedAt: raw.updatedAt || "",
        features: Array.isArray(raw.features) ? raw.features : [],
        year: raw.year || 0,
      });

      const normalizedMotorcycle = normalizeMotorcycle(data);
      setMotorcycle(normalizedMotorcycle);

      // Fetch similar motorcycles
      const similarResponse = await fetch(
        `https://carshipping.duckdns.org:8443/api/motorcycles/similar?brand=${data.brand}&type=${data.type}&exclude=${id}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );

      if (similarResponse.ok) {
        const similarData = await similarResponse.json();
        setSimilarMotorcycles(similarData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchMotorcycleDetails();
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

  if (!motorcycle) return (
    <div className="p-4 max-w-4xl mx-auto">
      No motorcycle found
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
        <a href="/vehicles" className="hover:text-blue-500">Back To Listing</a>
        <span className="mx-2" aria-hidden="true">→</span>
        <span className="text-gray-800">{motorcycle.model}</span>
      </nav>
      
      {/* Main Vehicle Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Gallery */}
        <div className="lg:w-2/3">
  <div className="relative">
    {/* Main Image with Navigation */}
    <div className="bg-gray-100 rounded-lg overflow-hidden relative">
      {motorcycle.imageUrls?.length > 0 ? (
        <>
          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-10">
            {`${currentImageIndex + 1}/${motorcycle.imageUrls.length}`}
          </div>
          
          {/* Main Image */}
          <img
            src={motorcycle.imageUrls[currentImageIndex]}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            className="w-full h-auto object-cover"
          />
          
          {/* Navigation Arrows */}
          {motorcycle.imageUrls.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === 0 ? motorcycle.imageUrls.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === motorcycle.imageUrls.length - 1 ? 0 : prev + 1))}
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
    {motorcycle.imageUrls?.length > 1 && (
      <div className="flex space-x-2 mt-3 overflow-x-auto py-2">
        {motorcycle.imageUrls.map((img, index) => (
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
<div className="lg:w-1/3 space-y-5 text-sm">
  {/* Title & Price */}
  <div>
    <h1 className="text-xl font-bold mb-1">
      {motorcycle.brand} {motorcycle.model}{" "}
      {motorcycle.type && (
        <span className="text-gray-600">{motorcycle.type}</span>
      )}
    </h1>
    <div className="flex items-center justify-between">
      <span className="text-lg font-bold text-blue-700">
        KSh {motorcycle.price.toLocaleString()}
      </span>
      {/* Like button */}
      <button className="p-2 rounded-full border hover:bg-gray-100 transition">
        <FaRegHeart className="text-red-500 text-lg" />
      </button>
    </div>
  </div>

  {/* Key Details (compact inline style) */}
  <div className="flex flex-wrap gap-2 text-gray-700">
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {motorcycle.status} km
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {motorcycle.year}
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {motorcycle.type}
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {motorcycle.engineCapacity} cc
  </span>
</div>

  <div className="space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
  <h3 className="font-semibold text-yellow-800 text-sm">⚠️ Disclaimer</h3>
  <p className="text-gray-700 text-sm leading-relaxed">
    The Vehicle information  has been provided by the seller. It's always best to check details with them before you buy.
  </p>
</div>
  {/* Dealer Info */}
  <div className="border-t border-gray-200 pt-4 space-y-3">
    <div className="flex items-center gap-3">
      <img
        src="/dealer-logo.png"
        alt="Dealer Logo"
        className="w-10 h-10 rounded-md object-cover border"
      />
      <div>
        <h3 className="font-semibold text-gray-900">AUTO SEVEN 7 LTD</h3>
        <p className="text-xs text-gray-500">Find out more</p>
      </div>
    </div>

    <div className="flex items-center text-yellow-500 text-xs">
      ⭐⭐⭐⭐⭐ <span className="ml-2 text-gray-700">4.9 out of 5</span>
    </div>
    <a href="#" className="text-blue-600 text-xs underline">
      View all reviews
    </a>

    <div className="space-y-1 text-xs text-gray-700">
      <p>(07482) 878952</p>
      <p>(01925) 916826</p>
    </div>

    {motorcycle.location && (
      <p className="text-gray-600 text-xs">📍 {motorcycle.location}</p>
    )}

    <div className="flex gap-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs">
        Visit website
      </button>
      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg text-xs">
        Message seller
      </button>
    </div>
  </div>
</div>


      </div>
     <div className="space-y-10">
     

      {/* Key details inline */}
      <div>
  <h3 className="text-xl font-bold text-gray-900 mb-4">
    Overview
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 text-gray-700">
    {/* Left column */}
    <div className="divide-y divide-gray-200 border-r pr-6 border-gray-200 border-dashed border-b sm:border-b-0 pb-6 sm:pb-0">
      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Mileage</span>
        <span>{motorcycle.owner ? `${motorcycle.owner} km` : "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Make</span>
        <span>{motorcycle.brand || "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Fuel type</span>
        <span>{motorcycle.type || "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Body type</span>
        <span>{motorcycle.type || "N/A"}</span>
      </div>
    </div>

    {/* Right column */}
    <div className="divide-y divide-gray-200">
      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Engine</span>
        <span>{motorcycle.engineCapacity ? `${motorcycle.engineCapacity} cc` : "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Gearbox</span>
        <span>{motorcycle.type || "N/A"}</span>
      </div>


      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Colour</span>
        <span>{motorcycle.type || "N/A"}</span>
      </div>
    </div>
  </div>
</div>
<hr />

<button 
className="px-6 py-2 border border-blue-700 text-blue-700 rounded-full font-medium hover:bg-blue-700 hover:text-white transition duration-200"
onClick={() => setOpenSpec(true)}>
   View Specs & Features 
   </button>

<hr />
 <div className="text-gray-800">
      {/* Preview */}
      <h2 className="text-lg font-semibold mb-2">Description</h2>
      <p className="mb-2">{preview}</p>
      {motorcycle?.description?.length > 20 && (
        <button
          onClick={() => setOpenSpec(true)}
          className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-50 transition"
        >
          Read more
        </button>
      )}

      {/* Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0  bg-opacity-40 z-40"
          ></div>

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 overflow-y-auto z-50 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Full Description</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <p className="whitespace-pre-line">{motorcycle?.description}</p>
          </div>
        </>
      )}
    </div>
      {/* Buttons to open drawers */}
     <div className="">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ownership & History */}
        <div
  onClick={() => setOpenDrawer("history")}
  className="group flex items-center justify-between border-b cursor-pointer hover:shadow-lg transition p-3"
>
  <div>
    <h2 className="text-xl font-bold text-blue-700">Ownership & History</h2>
    <p className="text-gray-600 pb-4">Basic history check: 5 checks passed</p>
  </div>

  {/* Straight arrow with hover animation */}
  <ArrowRight className="w-8 h-16 text-blue-700 transform transition-transform duration-300 group-hover:translate-x-1" />
</div>
        

        {/* Buying a car safely */}
       <div
  onClick={() => setOpenDrawer("safety")}
  className="flex items-center justify-between border-b cursor-pointer hover:shadow-lg transition p-3"
>
  <div>
    <h2 className="text-xl font-bold text-blue-700">Buying a car safely</h2>
    <p className="text-gray-600">
      Learn how to stay safe and protect your money with our handy guide
    </p>
  </div>

  {/* Arrow icon */}
    <ArrowRight className="w-8 h-16 text-blue-700 transform transition-transform duration-300 group-hover:translate-x-1" />
</div>
      </div>

      {/* Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setOpenDrawer(null)}
          ></div>

          {/* Drawer content */}
          <div className="relative w-96 bg-white h-full shadow-xl p-6">
            <button
              onClick={() => setOpenDrawer(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            {openDrawer === "history" && (
              <>
                <h2 className="text-xl font-bold mb-4">Ownership & History</h2>
                <p className="text-gray-700">
                   Basic history check completed.  
                  <br />• 5 checks passed successfully.  
                  <br />• No outstanding finance.  
                  <br />• No theft or write-off records.  
                </p>
              </>
            )}

            {openDrawer === "safety" && (
              <>
                <h2 className="text-xl font-bold mb-4">Buying a car safely</h2>
                <p className="text-gray-700">
                  🚗 Always meet sellers in safe, public places.  
                  <br />💳 Verify payment methods are secure.  
                  <br />📜 Check vehicle documents carefully.  
                  <br />🔍 Consider professional inspection.  
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>

      
      {/* Similar Vehicles */}
      
      {openSpec && (
  <div className="fixed inset-0 z-50 flex">
    {/* Overlay */}
    <div
      
      onClick={() => setOpenSpec(false)}
    />

    {/* Drawer */}
    <div className="ml-auto w-full sm:w-[500px] h-screen bg-white shadow-xl p-6 flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Vehicle Specifications & Features</h2>
        <p className="text-sm text-gray-500">
          Detailed technical information and included features
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-6 text-gray-700">
        {/* 🔹 Technical Specs */}
        <div>
          <h3 className="text-base font-semibold mb-2">Technical Specs</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div>
              <dt className="font-medium">Engine Type</dt>
              <dd>{motorcycle.type || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Displacement</dt>
              <dd>{motorcycle.engineCapacity ? `${motorcycle.engineCapacity} cc` : "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Condition</dt>
              <dd>{motorcycle.owner || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Body Type</dt>
              <dd>{motorcycle.type || "Not specified"}</dd>
            </div>
            <div>
              
            </div>
            <div>
              <dt className="font-medium">Transmission</dt>
              <dd>{motorcycle.type || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Location</dt>
              <dd>{motorcycle.location || "Not specified"}</dd>
            </div>
          </dl>
        </div>

        {/* 🔹 Features */}
        <div>
          <h3 className="text-base font-semibold mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {motorcycle.features?.length ? (
              motorcycle.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))
            ) : (
              <li className="text-gray-500 italic">Not specified</li>
            )}
          </ul>
        </div>

        {/* 🔹 Custom Specs */}
        <div>
          <h3 className="text-base font-semibold mb-2">Custom Specs</h3>
          <ul className="space-y-1 text-sm">
            {motorcycle.features?.length ? (
  <ul className="divide-y divide-gray-200">
    {motorcycle.features.map((feature, i) => (
      <li key={i} className="py-2 text-gray-700">
        • {feature}
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 italic">No features available</p>
)}
          </ul>
        </div>
      </div>

      {/* Close Button */}
      <div className="mt-4">
        <button
          onClick={() => setOpenSpec(false)}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MotorcycleDetails;