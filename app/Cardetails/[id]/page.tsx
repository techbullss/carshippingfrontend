"use client";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import React from 'react';
import { FaRegHeart } from 'react-icons/fa';
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  password: string;
  preferredCommunication: string[];
  newsletter: boolean;
  shippingFrequency: string;
  vehicleType: string;
  estimatedShippingDate: string;
  sourceCountry: string;
  destinationCountry: string;
}
export interface User {
  id: number;
  email: string;
  name: string;
  role: string [];
}
export type Vehicle = {
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
  ownerType: string;
  features: string[]; // parsed from comma-separated string
  customSpecs: { key: string; value: string }[]; // parsed from JSON string
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
  const [openSpec, setOpenSpec] = useState(false);
  const [openFeat, setOpenFeat] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [openDrawer, setOpenDrawer] = useState<null | "history" | "safety">(null);
const [user, setUser] = useState<User | null>(null);
const [userDetails, setUserDetails] = useState<SignupRequest | null>(null);
 const preview =
    (vehicle?.description ?? "").length > 70
      ? vehicle?.description?.slice(0, 70) + "..."
      : vehicle?.description ?? "";
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch(`https://carshipping.duckdns.org:8443/api/auth/validate`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
             
            });
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
           
            if (data) {
               setUser(data);
               const usertemail = data.email;
               const response2 = await fetch(`https://carshipping.duckdns.org:8443/api/users/email/${usertemail}`, {
                 credentials: 'include',
                 headers: {
                   'Content-Type': 'application/json',
                 },
               });
               if (!response2.ok) throw new Error('Failed to fetch user details');
               const userDetails = await response2.json();
               
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
        fetchUser();
      }, []);
      useEffect(() => {
    if (!id) return;

    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch main vehicle details
        const response = await fetch(`https://carshipping.duckdns.org:8443/api/cars/${id}`, {
          
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Vehicle not found');
        }

        const data = await response.json();
        const normalizeVehicle = (raw: any): Vehicle => {
  return {
    ...raw,
    features: raw.features
      ? raw.features.split(",").map((f: string) => f.trim())
      : [],
    customSpecs: raw.customSpecs
      ? JSON.parse(raw.customSpecs)
      : [],
  };
};

const normalizedVehicle = normalizeVehicle(data);
setVehicle(normalizedVehicle);
        

        // Fetch similar vehicles (uncomment when ready)
        
        const similarResponse = await fetch(
          `https://carshipping.duckdns.org:8443/api/cars/similar?brand=${data.brand}&model=${data.model}&exclude=${id}`, {
         credentials: 'include',
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
        <a href="/Vehicles" className="hover:text-blue-500 text-md">Back To Listing</a>
        <span className="mx-2" aria-hidden="true">→</span>
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
<div className="lg:w-1/3 space-y-5 text-sm">
  {/* Title & Price */}
  <div>
    <h1 className="text-xl font-bold mb-1">
      {vehicle.brand} {vehicle.model}{" "}
      {vehicle.bodyType && (
        <span className="text-gray-600">{vehicle.bodyType}</span>
      )}
    </h1>
    <div className="flex items-center justify-between">
      <span className="text-lg font-bold text-blue-700">
        KSh {vehicle.priceKes.toLocaleString()}
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
    {vehicle.mileageKm} km
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {vehicle.yearOfManufacture}
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {vehicle.fuelType}
  </span>
  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
    {vehicle.transmission}
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

    {vehicle.location && (
      <p className="text-gray-600 text-xs">📍 {vehicle.location}</p>
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
        <span>{vehicle.mileageKm ? `${vehicle.mileageKm} km` : "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Make</span>
        <span>{vehicle.brand || "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Fuel type</span>
        <span>{vehicle.fuelType || "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Body type</span>
        <span>{vehicle.bodyType || "N/A"}</span>
      </div>
    </div>

    {/* Right column */}
    <div className="divide-y divide-gray-200">
      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Engine</span>
        <span>{vehicle.engineCapacityCc ? `${vehicle.engineCapacityCc} cc` : "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Gearbox</span>
        <span>{vehicle.transmission || "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Doors</span>
        <span>{vehicle.doors ? `${vehicle.doors} doors` : "N/A"}</span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-medium">Colour</span>
        <span>{vehicle.color || "N/A"}</span>
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
      {vehicle?.description?.length > 20 && (
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
            <p className="whitespace-pre-line">{vehicle?.description}</p>
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
                  ✅ Basic history check completed.  
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
              <dd>{vehicle.engineType || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Displacement</dt>
              <dd>{vehicle.engineCapacityCc ? `${vehicle.engineCapacityCc} cc` : "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Condition</dt>
              <dd>{vehicle.conditionType || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Body Type</dt>
              <dd>{vehicle.bodyType || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Seats</dt>
              <dd>{vehicle.seats || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Transmission</dt>
              <dd>{vehicle.transmission || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium">Location</dt>
              <dd>{vehicle.location || "Not specified"}</dd>
            </div>
          </dl>
        </div>

        {/* 🔹 Features */}
        <div>
          <h3 className="text-base font-semibold mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {vehicle.features?.length ? (
              vehicle.features.map((feature, i) => (
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
            {vehicle.customSpecs?.length ? (
              vehicle.customSpecs.map((spec, i) => (
                <li key={i} className="flex justify-between border-b border-gray-200 py-1">
                  <span className="font-medium">{spec.key}</span>
                  <span>{spec.value}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic">No custom specifications available</p>
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

export default VehicleDetails;