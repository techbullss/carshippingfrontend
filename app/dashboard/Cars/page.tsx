"use client";

import { useEffect, useState } from "react";
import { Car } from "@/app/car";
import { useRouter } from "next/navigation";
import AddCarForm from "@/app/components/AddCarForm";
import { useCurrentUser } from "@/app/Hookes/useCurrentUser";
import RejectModal from "@/app/components/RejectModal";

export default function CarsPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const email = user?.email || '';
  const role = user?.roles?.[0] || '';
  
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

  // FIRST: Authentication check useEffect
  useEffect(() => {
    if (!user) {
      router.push('/Login');
      return;
    }

    if (role === "GUEST") {
      router.push('/dashboard/requestItemPage');
      return;
    }

    if (role !== "ADMIN" && role !== "SELLER") {
      router.push('/');
      return;
    }
  }, [user, role, router]);

  // SECOND: Data fetching useEffect (only runs if authorized)
  useEffect(() => {
    if (user && (role === "ADMIN" || role === "SELLER")) {
      fetchCars();
    }
  }, [user, role, page, size, search, brand, seller]);

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

      const updated = await res.json();
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
      await fetch(`https://api.f-carshipping.com/api/cars/${id}`, { method: "DELETE", credentials: 'include' });
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

  // THIRD: Conditional rendering based on user state
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

  // FOURTH: Main render for authorized users
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
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={car.imageUrls?.[0] || "/placeholder-car.jpg"}
                alt={`${car.brand} ${car.model}`}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold">
                  {car.brand} {car.model}
                </h2>
                <p className="text-gray-500 text-sm">
                  {car.yearOfManufacture || "Year N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  ref: {car.refNo || "Ref No N/A"}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  KES {car.priceKes?.toLocaleString() ?? "-"}
                </p>

                <p className="text-lg font-bold text-green-600 mt-2">
                  {car.refLink ? (
                    <a
                      href={car.refLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600"
                    >
                      Listed on otherSite
                    </a>
                  ) : (
                    "-"
                  )}
                </p>

                {/* Vehicle Status Section */}
                <div className="mt-3 flex gap-2">
                  {role === "ADMIN" && car.status !== "APPROVED" && car.status !== "REJECTED" ? (
                    <>
                      <button
                        onClick={() => approveCar(car.id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          approving === car.id ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={approving === car.id}
                      >
                        {approving === car.id ? "Approving..." : "Approve"}
                      </button>

                      <button
                        onClick={() => openRejectModal(car.id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          rejecting === car.id ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={rejecting === car.id}
                      >
                        {rejecting === car.id ? "Rejecting..." : "Reject"}
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        car.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : car.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {car.status}
                    </span>
                  )}
                </div>

                {/* Actions (Edit/Delete/Details) */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setEditCar(car);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCar(car.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDetailCar(car)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cars.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No cars found.
            </p>
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
        <div className="fixed inset-0 flex justify-end z-50 pointer-events-none">
          <div className="bg-white w-full sm:w-96 h-full p-6 shadow-xl overflow-y-auto pointer-events-auto">
            <button
              onClick={() => setDetailCar(null)}
              className="mb-4 p-2 hover:bg-gray-100 rounded"
            >
              Close
            </button>

            <img
              src={detailCar.imageUrls?.[0] || "/placeholder-car.jpg"}
              alt={`${detailCar.brand} ${detailCar.model}`}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <h3 className="text-2xl font-bold mb-2">
              {detailCar.brand} {detailCar.model}
            </h3>
            <p className="text-gray-600 mb-1">
              Year: {detailCar.yearOfManufacture || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              Seller: {detailCar.seller || "N/A"}
            </p>
            <p className="text-gray-800 font-semibold mt-2">
              Price: KES {detailCar.priceKes?.toLocaleString() ?? "-"}
            </p>

            <p className="mt-4 text-gray-500">
              {detailCar.description || "No description provided."}
            </p>

            {detailCar.features && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Features:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {detailCar.features.split(",").map((feature, idx) => (
                    <li key={idx}>{feature.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailCar.customSpecs && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Specifications:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {(() => {
                    try {
                      const specs = JSON.parse(detailCar.customSpecs) as
                        | { key: string; value: string }[]
                        | Record<string, any>;

                      if (Array.isArray(specs)) {
                        return specs.map((spec, idx) => (
                          <li key={idx}>{spec.key}: {spec.value}</li>
                        ));
                      } else if (specs && typeof specs === "object") {
                        return Object.entries(specs).map(([key, value], idx) => (
                          <li key={idx}>{key}: {String(value)}</li>
                        ));
                      }
                    } catch {
                      return <li>{detailCar.customSpecs}</li>;
                    }
                    return null;
                  })()}
                </ul>
              </div>
            )}

            <div className="mt-4 text-gray-600 space-y-1">
              <p>Condition: {detailCar.conditionType || "N/A"}</p>
              <p>Body Type: {detailCar.bodyType || "N/A"}</p>
              <p>Color: {detailCar.color || "N/A"}</p>
              <p>Engine: {detailCar.engineType || "N/A"} {detailCar.engineCapacityCc || ""} CC</p>
              <p>Fuel Type: {detailCar.fuelType || "N/A"}</p>
              <p>Transmission: {detailCar.transmission || "N/A"}</p>
              <p>Seats: {detailCar.seats || "N/A"}</p>
              <p>Doors: {detailCar.doors || "N/A"}</p>
              <p>Mileage: {detailCar.mileageKm || "N/A"} km</p>
              <p>Location: {detailCar.location || "N/A"}</p>
              <p>Owner Type: {detailCar.ownerType || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        carId={selectedCarId}
        show={showRejectModal}
        onClose={closeRejectModal}
        onReject={handleRejectWrapper}
      />
    </div>
  );
}