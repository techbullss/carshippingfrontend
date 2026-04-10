"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Car } from "@/app/car";
import { useRouter } from "next/navigation";
import AddCarForm from "@/app/components/AddCarForm";
import { useCurrentUser } from "@/app/Hookes/useCurrentUser";
import RejectModal from "@/app/components/RejectModal";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function CarsPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [seller, setSeller] = useState("");
  const [approving, setApproving] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Sold form states
  const [soldFormOpen, setSoldFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [buyerInfo, setBuyerInfo] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhoneNumber: ''
  });
  const [submittingSold, setSubmittingSold] = useState(false);

  const email = user?.email || '';
  const role = user?.roles?.[0] || '';

  // Handle authentication and authorization in a single useEffect
  useEffect(() => {
    // Wait for user loading to complete
    if (userLoading) {
      console.log('Still loading user...');
      return;
    }

    // No user found - redirect to login
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/Login');
      return;
    }

    // Guest user - redirect to request items page
    if (role === "GUEST") {
      console.log('Guest user detected, redirecting to request items page');
      router.push('/dashboard/RequestItemPage');
      return;
    }

    // Check if user has valid role (ADMIN or SELLER)
    if (role === "ADMIN" || role === "SELLER") {
      console.log('User authorized with role:', role);
      setIsAuthorized(true);
      fetchCars();
    } else {
      console.log('Invalid role detected:', role);
      router.push('/');
    }
  }, [user, userLoading, role, page, size, search, brand, seller]);

  const openRejectModal = (carId: number) => {
    setSelectedCarId(carId);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setSelectedCarId(null);
    setShowRejectModal(false);
  };

  const handleRejectWrapper = async (carId: number, reason: string) => {
    setRejecting(carId);
    try {
      const res = await fetch(`https://api.f-carshipping.com/api/cars/reject/${carId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject car");

      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, status: "REJECTED" } : c))
      );
      alert("Car rejected and seller notified!");
    } catch (err) {
      console.error(err);
      alert("Error rejecting car");
    } finally {
      setRejecting(null);
      closeRejectModal();
    }
  };

  const approveCar = async (carId: number) => {
    setApproving(carId);
    try {
      const res = await fetch(`https://api.f-carshipping.com/api/cars/approve/${carId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to approve car");
      const updated = await res.json();

      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, status: "APPROVED" } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Error approving car");
    } finally {
      setApproving(null);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search ? { search } : {}),
        ...(brand ? { brand } : {}),
        ...(seller ? { seller } : {}),
      });

      const res = await fetch(`https://api.f-carshipping.com/api/cars/dashboard?${params}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      console.log('Cars API response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Cars API error details:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText
        });
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setCars(data.content || []);
      setTotalPages(data.totalPages || 0);

    } catch (err: any) {
      console.error('Error fetching cars:', err);

      if (err.message === 'SESSION_EXPIRED') {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => router.push('/Login'), 2000);
      } else if (err.message === 'ACCESS_DENIED') {
        setError('You do not have permission to access this resource.');
      } else {
        setError(err.message || "Failed to load cars");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: number) => {
    if (!confirm("Delete this car?")) return;
    try {
      await fetch(`https://api.f-carshipping.com/api/cars/${id}`, { 
        method: "DELETE", 
        credentials: 'include' 
      });
      fetchCars();
    } catch {
      alert("Failed to delete car");
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditCar(null);
    fetchCars();
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditCar(null);
  };

  const openSoldForm = (car: Car) => {
    setSelectedCar(car);
    setBuyerInfo({
      buyerName: '',
      buyerEmail: '',
      buyerPhoneNumber: ''
    });
    setSoldFormOpen(true);
  };

  const handleSoldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;
    
    // Validate form
    if (!buyerInfo.buyerName.trim()) {
      alert("Please enter buyer's name");
      return;
    }
    if (!buyerInfo.buyerEmail.trim()) {
      alert("Please enter buyer's email");
      return;
    }
    if (!buyerInfo.buyerPhoneNumber.trim()) {
      alert("Please enter buyer's phone number");
      return;
    }
    
    setSubmittingSold(true);
    try {
      const response = await fetch(`https://api.f-carshipping.com/api/cars/${selectedCar.id}/sold`, { 
        method: "PUT", 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerName: buyerInfo.buyerName,
          buyerEmail: buyerInfo.buyerEmail,
          buyerPhoneNumber: buyerInfo.buyerPhoneNumber,
          soldBy: email,
          soldDate: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark as sold');
      }
      
      setSoldFormOpen(false);
      setSelectedCar(null);
      setBuyerInfo({ buyerName: '', buyerEmail: '', buyerPhoneNumber: '' });
      fetchCars();
      alert("Car marked as sold successfully! A review request has been sent to the buyer.");
    } catch (error) {
      console.error("Mark as sold error:", error);
      alert("Failed to mark car as sold: " + (error as Error).message);
    } finally {
      setSubmittingSold(false);
    }
  };

  // Show loading while user data is being fetched
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user fetch failed
  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{userError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no user (should be handled by redirect, but just in case)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Guest user - show redirect message
  if (role === "GUEST") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to request items page...</p>
        </div>
      </div>
    );
  }

  // Check if user is authorized to view this page
  if (role !== "ADMIN" && role !== "SELLER") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            This area is only available for sellers and administrators.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authorized yet (still checking)
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  const isAdmin = role === "ADMIN";
  const isSeller = role === "SELLER";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Car Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          + Add Car
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border shadow-sm">
        <input
          type="text"
          placeholder="Search by brand or model..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded w-full sm:w-64"
        />
        <input
          type="text"
          placeholder="Filter by brand"
          value={brand}
          onChange={(e) => {
            setPage(0);
            setBrand(e.target.value);
          }}
          className="border p-2 rounded w-full sm:w-48"
        />
        <input
          type="text"
          placeholder="Filter by seller"
          value={seller}
          onChange={(e) => {
            setPage(0);
            setSeller(e.target.value);
          }}
          className="border p-2 rounded w-full sm:w-48"
        />
        <select
          value={size}
          onChange={(e) => {
            setPage(0);
            setSize(Number(e.target.value));
          }}
          className="border p-2 rounded"
        >
          {[6, 12, 24].map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading cars…</p>}

      {/* Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {cars.map((car, index) => (
    <motion.div
      key={car.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-gray-200"
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={car.imageUrls?.[0] || "/placeholder-car.jpg"}
          alt={`${car.brand} ${car.model}`}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-sm ${
            car.status === "APPROVED"
              ? "bg-green-500/90 text-white"
              : car.status === "REJECTED"
              ? "bg-red-500/90 text-white"
              : car.status === "SOLD"
              ? "bg-gray-700/90 text-white"
              : "bg-yellow-500/90 text-white"
          }`}>
            {car.status === "APPROVED" && "✓ Approved"}
            {car.status === "REJECTED" && "✗ Rejected"}
            {car.status === "SOLD" && "Sold"}
            {car.status !== "APPROVED" && car.status !== "REJECTED" && car.status !== "SOLD" && "Pending"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Basic Info */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
            {car.brand} {car.model}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {car.yearOfManufacture || "Year N/A"}
            </span>
            {car.refNo && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  {car.refNo}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-emerald-600">
            KES {car.priceKes?.toLocaleString() ?? "-"}
          </div>
          {car.refLink && (
            <a
              href={car.refLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on marketplace
            </a>
          )}
        </div>

        {/* Admin Actions Section */}
        {isAdmin && car.status !== "APPROVED" && car.status !== "REJECTED" && car.status !== "SOLD" && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex gap-2">
              <button
                onClick={() => approveCar(car.id)}
                disabled={approving === car.id}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                {approving === car.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Approving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </>
                )}
              </button>
              <button
                onClick={() => openRejectModal(car.id)}
                disabled={rejecting === car.id}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                {rejecting === car.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {(isSeller || isAdmin) && car.status === "APPROVED" && (
              <button
                onClick={() => openSoldForm(car)}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Sold
              </button>
            )}
            
            <button
              onClick={() => {
                setEditCar(car);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            
            <button
              onClick={() => deleteCar(car.id)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
            
            <button
              onClick={() => setDetailCar(car)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  ))}

  {cars.length === 0 && (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No cars found</h3>
      <p className="text-gray-500">Try adjusting your filters or add a new car</p>
    </div>
  )}
</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {editCar ? "Edit Car" : "Add New Car"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AddCarForm
                onSuccess={handleSave}
                carToEdit={editCar ?? undefined}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer */}
    {detailCar && (
  <div className="fixed inset-0 z-50 flex justify-end">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setDetailCar(null)}
    />
    
    {/* Drawer Panel */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="relative w-full sm:w-[480px] lg:w-[560px] h-full bg-white shadow-2xl overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Vehicle Details</h2>
        <button
          onClick={() => setDetailCar(null)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image Gallery */}
        <div className="relative">
          <img
            src={detailCar.imageUrls?.[0] || "/placeholder-car.jpg"}
            alt={`${detailCar.brand} ${detailCar.model}`}
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-lg ${
              detailCar.status === "APPROVED"
                ? "bg-green-500 text-white"
                : detailCar.status === "REJECTED"
                ? "bg-red-500 text-white"
                : detailCar.status === "SOLD"
                ? "bg-gray-700 text-white"
                : "bg-yellow-500 text-white"
            }`}>
              {detailCar.status === "APPROVED" && "✓ Approved"}
              {detailCar.status === "REJECTED" && "✗ Rejected"}
              {detailCar.status === "SOLD" && "Sold"}
              {detailCar.status !== "APPROVED" && detailCar.status !== "REJECTED" && detailCar.status !== "SOLD" && "Pending"}
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {detailCar.brand} {detailCar.model}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {detailCar.yearOfManufacture || "Year N/A"}
            </span>
            {detailCar.refNo && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Ref: {detailCar.refNo}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price Card */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-700 font-medium mb-1">Price</p>
          <p className="text-3xl font-bold text-emerald-700">
            KES {detailCar.priceKes?.toLocaleString() ?? "-"}
          </p>
          {detailCar.refLink && (
            <a
              href={detailCar.refLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on marketplace
            </a>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Seller</p>
            <p className="text-sm font-medium text-gray-900">{detailCar.seller || "N/A"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Posted</p>
            <p className="text-sm font-medium text-gray-900">
              {detailCar.createdAt ? new Date(detailCar.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
          {detailCar.location && (
            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900">{detailCar.location}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {detailCar.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Description
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {detailCar.description}
            </p>
          </div>
        )}

        {/* Features */}
                   {detailCar.features && (
  <div>
    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
      Features
    </h4>
    <div className="flex flex-wrap gap-2">
      {(() => {
        // Safely convert features to array
        let featuresList: string[] = [];
        
        if (Array.isArray(detailCar.features)) {
          featuresList = detailCar.features;
        } else if (typeof detailCar.features === 'string') {
          // Split by comma and clean up each feature
          featuresList = detailCar.features
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0);
        }
        
        return featuresList.map((feature, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
          >
            {feature}
          </span>
        ));
      })()}
    </div>
  </div>
)}

        {/* Additional Images */}
        {detailCar.imageUrls && detailCar.imageUrls.length > 1 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Additional Images ({detailCar.imageUrls.length - 1})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {detailCar.imageUrls.slice(1, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${detailCar.brand} ${detailCar.model} - ${idx + 2}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          {(isSeller || isAdmin) && detailCar.status === "APPROVED" && (
            <button
              onClick={() => { openSoldForm(detailCar); setDetailCar(null); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark as Sold
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setEditCar(detailCar); setShowForm(true); setDetailCar(null); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            
            <button
              onClick={() => { deleteCar(detailCar.id); setDetailCar(null); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}

      {/* Reject Modal */}
      <RejectModal
        carId={selectedCarId}
        show={showRejectModal}
        onClose={closeRejectModal}
        onReject={handleRejectWrapper}
      />

      {/* Sold Form Modal */}
      {soldFormOpen && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSoldFormOpen(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Mark as Sold</h2>
              <button
                onClick={() => setSoldFormOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Car Details:</p>
              <p className="font-semibold">{selectedCar.brand} {selectedCar.model}</p>
              <p className="text-sm text-gray-500">KES {selectedCar.priceKes?.toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleSoldSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer's Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={buyerInfo.buyerName}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerName: e.target.value })}
                  placeholder="Enter buyer's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer's Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={buyerInfo.buyerEmail}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerEmail: e.target.value })}
                  placeholder="buyer@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer's Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={buyerInfo.buyerPhoneNumber}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerPhoneNumber: e.target.value })}
                  placeholder="+254 700 000 000"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSoldFormOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSold}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingSold ? "Processing..." : "Confirm Sale"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}