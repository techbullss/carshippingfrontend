"use client";
import { ArrowRight, Mail, Phone, MapPin, Star, Calendar, Building, Shield, CheckCircle } from 'lucide-react';
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
  owner: string; // This is the seller's email
  description: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  features: string[];
  year: number;
};

export type Seller = {
  id: number;
  firstName: string;
  lastName: string;
  role:string;
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
  responseRate?: number;
  avgResponseTime?: string;
  emailVerified?: boolean;
};

const MotorcycleDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(false);
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
        setError(null);

        // Fetch main motorcycle details
        const response = await fetch(`https://api.f-carshipping.com/api/motorcycles/${id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Motorcycle not found");
        }

        const data = await response.json();

        // Normalize data
        const normalizeMotorcycle = (raw: any): Motorcycle => ({
          id: raw.id,
          brand: raw.brand || "",
          model: raw.model || "",
          type: raw.type || "",
          engineCapacity: raw.engineCapacity || 0,
          status: raw.status || "",
          price: raw.price || 0,
          location: raw.location || "",
          owner: raw.owner || "", // This should contain seller email
          description: raw.description || "",
          imageUrls: raw.imageUrls || [],
          createdAt: raw.createdAt || "",
          updatedAt: raw.updatedAt || "",
          features: Array.isArray(raw.features) ? raw.features : [],
          year: raw.year || 0,
        });

        const normalizedMotorcycle = normalizeMotorcycle(data);
        setMotorcycle(normalizedMotorcycle);

        // Fetch seller info using the owner email
        if (normalizedMotorcycle.owner) {
          await fetchSellerInfo(normalizedMotorcycle.owner);
        }

        // Fetch similar motorcycles
        const similarResponse = await fetch(
          `https://api.f-carshipping.com/api/motorcycles/similar?brand=${data.brand}&type=${data.type}&exclude=${id}`,
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

  const fetchSellerInfo = async (sellerEmail: string) => {
    try {
      setSellerLoading(true);
      
      // Fetch seller profile using email from admin endpoint
      // Note: You might need to adjust authentication/authorization
      const response = await fetch(
        `https://api.f-carshipping.com/api/admin/users/${encodeURIComponent(sellerEmail)}`,
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
          role:sellerData.role,
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
          isVerified: sellerData.emailVerified || false,
          emailVerified: sellerData.emailVerified || false,
          memberSince: sellerData.createdAt,
          // You might want to calculate these from separate endpoints
          rating: 4.8, // Default or fetch from reviews
          totalListings: 12, // Default or fetch from listings count
          responseRate: 95,
          avgResponseTime: "2 hours",
        };
        
        setSeller(normalizedSeller);
      } else {
        // If admin endpoint fails or is not accessible, create a basic seller object
        console.log("Using basic seller info from email");
        const basicSeller: Seller = {
          id: 0,
          firstName: sellerEmail.split('@')[0] || "Seller",
          lastName: "",
          role:"",
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
        role:"",
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
    return "Location not specified";
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

  if (!motorcycle) return (
    <div className="p-4 max-w-4xl mx-auto">
      No motorcycle found
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p2 rounded-full hover:bg-opacity-70 transition"
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

          {/* Key Details */}
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
          { seller?.role!="ADMIN" &&(
            
                  <div className="space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="font-semibold text-yellow-800 text-sm">⚠️ Disclaimer</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Vehicle information has been provided by the seller. It's always best to check details with them before you buy.
            </p>
          </div>
            
          )


          }

      

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
                  {(seller.city || seller.country) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{getLocation(seller)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
              
              </>
            ) : (
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-sm">Seller information loading...</p>
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

      {/* Specs Drawer */}
      {openSpec && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setOpenSpec(false)}
          ></div>

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