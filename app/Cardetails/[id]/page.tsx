"use client";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArrowRight, ChevronRight, Mail, Phone, MapPin, Star, Calendar, Building, Shield, CheckCircle } from 'lucide-react';
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
  role: string[];
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
  seller: string; // Seller's email
  features: string[]; // parsed from comma-separated string
  customSpecs: { key: string; value: string }[]; // parsed from JSON string
  imageUrls: string[];
};

export type Seller = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profilePicture?: string;
  rating?: number;
  totalListings?: number;
  memberSince?: string;
  companyName?: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  roles?: Set<string> | string[] | string;
  responseRate?: number;
  avgResponseTime?: string;
};

const VehicleDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(false);
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
  const [openReview, setOpenReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const preview =
    (vehicle?.description ?? "").length > 70
      ? vehicle?.description?.slice(0, 70) + "..."
      : vehicle?.description ?? "";

  // Helper function to check if user is admin
  const isAdmin = (seller: Seller | null): boolean => {
    if (!seller) return false;
    
    // If roles is a Set (from your backend)
    if (seller.roles instanceof Set) {
      return seller.roles.has("ADMIN");
    }
    
    // If roles is an array
    if (Array.isArray(seller.roles)) {
      return seller.roles.includes("ADMIN");
    }
    
    // If roles is a string
    if (typeof seller.roles === 'string') {
      return seller.roles === "ADMIN";
    }
    
    return false;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getLocation = (seller: Seller) => {
    if (seller.city && seller.country) {
      return `${seller.city}, ${seller.country}`;
    }
    if (seller.city) return seller.city;
    if (seller.country) return seller.country;
    if (seller.streetAddress) return seller.streetAddress;
    return "Location not specified";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://api.f-carshipping.com/api/auth/validate`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
       
        if (data) {
          setUser(data);
          const userEmail = data.email;
          const response2 = await fetch(`https://api.f-carshipping.com/api/users/email/${userEmail}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response2.ok) throw new Error('Failed to fetch user details');
          const userDetails = await response2.json();
          setUserDetails(userDetails);
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
        setError(null);
        
        // Fetch main vehicle details
        const response = await fetch(`https://api.f-carshipping.com/api/cars/${id}`, {
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
            owner: raw.owner || "", // Make sure owner field is included
          };
        };

        const normalizedVehicle = normalizeVehicle(data);
        setVehicle(normalizedVehicle);

        // Fetch seller info using owner email
        if (normalizedVehicle.seller) {
          await fetchSellerInfo(normalizedVehicle.seller);
        }

        // Fetch similar vehicles
        const similarResponse = await fetch(
          `https://api.f-carshipping.com/api/cars/similar?brand=${data.brand}&model=${data.model}&exclude=${id}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
          }
        );
        
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarVehicles(similarData);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const fetchSellerInfo = async (sellerEmail: string) => {
    try {
      setSellerLoading(true);
      
      // Fetch seller profile using email from admin endpoint
      const response = await fetch(
        `https://api.f-carshipping.com/api/admin/users/email/${encodeURIComponent(sellerEmail)}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );

      if (response.ok) {
        const sellerData = await response.json();
        
        // Transform to Seller type
        const normalizedSeller: Seller = {
          id: sellerData.id,
          firstName: sellerData.firstName || "",
          lastName: sellerData.lastName || "",
          email: sellerData.email,
          phone: sellerData.phone || "",
          streetAddress: sellerData.streetAddress,
          city: sellerData.city,
          state: sellerData.state,
          postalCode: sellerData.postalCode,
          country: sellerData.country,
          companyName: sellerData.companyName,
          isVerified: sellerData.emailVerified || sellerData.isVerified || false,
          emailVerified: sellerData.emailVerified || false,
          memberSince: sellerData.createdAt,
          roles: sellerData.roles || new Set(),
          // You might want to calculate these from separate endpoints
          rating: 4.8, // Default or fetch from reviews
          totalListings: 12, // Default or fetch from listings count
          responseRate: 95,
          avgResponseTime: "2 hours",
        };
        
        setSeller(normalizedSeller);
      } else {
        // If admin endpoint fails, create a basic seller object
        console.log("Using basic seller info from email");
        const basicSeller: Seller = {
          id: 0,
          firstName: sellerEmail.split('@')[0] || "Seller",
          lastName: "",
          email: sellerEmail,
          phone: "",
          isVerified: false,
          memberSince: new Date().toISOString(),
          rating: 4.5,
          totalListings: 1,
        };
        setSeller(basicSeller);
      }
    } catch (err) {
      console.error("Error fetching seller:", err);
      // Create minimal seller info
      const minimalSeller: Seller = {
        id: 0,
        firstName: "Private",
        lastName: "Seller",
        email: sellerEmail,
        phone: "Contact for details",
        isVerified: false,
        memberSince: new Date().toISOString(),
      };
      setSeller(minimalSeller);
    } finally {
      setSellerLoading(false);
    }
  };

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

          {/* Key Details */}
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

          {/* Disclaimer - Only show for non-admin sellers */}
          {seller && !isAdmin(seller) && (
            <div className="space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h3 className="font-semibold text-yellow-800 text-sm">⚠️ Disclaimer</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                The Vehicle information has been provided by the seller. It's always best to check details with them before you buy.
              </p>
            </div>
          )}

          {/* Seller Info Section */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {sellerLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ) : seller ? (
              <>
                {/* Seller Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-white shadow flex items-center justify-center">
                        {seller.profilePicture ? (
                          <img
                            src={seller.profilePicture}
                            alt={`${seller.firstName} ${seller.lastName}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold text-lg">
                            {seller.firstName?.charAt(0)}{seller.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {seller.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {seller.companyName || `${seller.firstName} ${seller.lastName}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {seller.rating && (
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="ml-1 text-xs font-medium">{seller.rating.toFixed(1)}</span>
                            {seller.totalListings && (
                              <span className="mx-2 text-gray-400">•</span>
                            )}
                          </div>
                        )}
                        {seller.totalListings && (
                          <span className="text-xs text-gray-600">
                            {seller.totalListings} listings
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {seller.isVerified && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <Shield className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Seller Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {seller.memberSince && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Since {formatDate(seller.memberSince)}</span>
                    </div>
                  )}
                  {seller.responseRate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{seller.responseRate}% response rate</span>
                    </div>
                  )}
                </div>

                {/* Seller Contact Info */}
                <div className="space-y-2">
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{seller.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 truncate">{seller.email}</span>
                  </div>
                  {(seller.city || seller.country || seller.streetAddress) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{getLocation(seller)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                 
                  <button
                    onClick={() => setOpenReview(true)}
                    className="px-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-xs transition duration-200"
                  >
                    Review
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-sm">Seller information not available</p>
                <p className="text-xs text-gray-500 mt-1">Contact support for assistance</p>
              </div>
            )}
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
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-50 transition"
            >
              Read more
            </button>
          )}

          {/* Fixed Description Drawer */}
          {isOpen && (
            <>
              {/* Overlay with proper styling */}
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
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
              <ArrowRight className="w-8 h-16 text-blue-700 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Fixed History/Safety Drawer */}
          {openDrawer && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay with proper styling */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setOpenDrawer(null)}
              ></div>

              {/* Drawer content */}
              <div className="relative w-96 bg-white h-full shadow-xl p-6 z-50 ml-auto">
                <button
                  onClick={() => setOpenDrawer(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
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

      {/* Fixed Specs Drawer */}
      {openSpec && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay with proper styling */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setOpenSpec(false)}
          ></div>

          {/* Drawer */}
          <div className="ml-auto w-full sm:w-[500px] h-screen bg-white shadow-xl p-6 flex flex-col z-50">
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

      {/* Review Modal */}
     {openReview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
      
      {/* Close Button */}
      <button
        onClick={() => setOpenReview(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">
        Leave a Review
      </h2>

      {/* Rating */}
      <div className="flex justify-center mb-4 space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Review Text */}
      <textarea
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Submit Button */}
      <button
        onClick={async () => {
          if (!reviewText || rating === 0) {
            alert("Please add a rating and a comment.");
            return;
          }

          if (!seller?.id) {
            alert("Seller information not available.");
            return;
          }

          try {
            const response = await fetch(
              "https://api.f-carshipping.com/api/reviews/save",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  
                },
               
                body: JSON.stringify({
                  vehicleId: vehicle.id,
                  sellerId: seller.id,
                  rating: rating,
                  comment: reviewText,
                  reviewerName: "Anonymous",
                }),
              }
            );

            if (response.ok) {
              alert("Review submitted successfully! Awaiting approval.");
              setOpenReview(false);
              setRating(0);
              setReviewText("");
            } else {
              const error = await response.text();
              alert(error || "Failed to submit review.");
            }
          } catch (error) {
            console.error("Review error:", error);
            alert("An error occurred while submitting your review.");
          }
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
      >
        Submit Review
      </button>

    </div>
  </div>
)}
    </div>
  );
};

export default VehicleDetails;