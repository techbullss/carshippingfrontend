"use client";

import { useEffect, useState } from "react";
import { CommercialVehicle } from "@/app/CommercialVehicle";
import AddCommercialVehicleForm from "@/app/components/AddCommercialVehicleForm";
import { useCurrentUser } from "@/app/Hookes/useCurrentUser";
import Reject_Modal from "@/app/components/Reject_Modal";

export default function CommercialVehicleList() {
  const [vehicles, setVehicles] = useState<CommercialVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [seller, setSeller] = useState("");
  const [filterType, setFilterType] = useState("");
  
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<CommercialVehicle | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<CommercialVehicle | null>(null);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const { user } = useCurrentUser();
  const email = user?.email || '';
  const role = user?.roles?.[0] || '';

  const openRejectModal = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setSelectedVehicleId(null);
    setShowRejectModal(false);
  };

  const handleRejectWrapper = async (vehicleId: number, reason: string) => {
    setRejecting(vehicleId);
    try {
      const res = await fetch(`https://api.f-carshipping.com/api/vehicles/reject/${vehicleId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) throw new Error("Failed to reject vehicle");
      
      const updated = await res.json();
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: "REJECTED" } : v))
      );
      alert("Vehicle rejected and seller notified!");
    } catch (err) {
      console.error(err);
      alert("Error rejecting vehicle");
    } finally {
      setRejecting(null);
      closeRejectModal();
    }
  };

  const approveVehicle = async (vehicleId: number) => {
    setApproving(vehicleId);
    try {
      const res = await fetch(`https://api.f-carshipping.com/api/vehicles/approve/${vehicleId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to approve vehicle");
      
      const updated = await res.json();
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: "APPROVED" } : v))
      );
    } catch (err) {
      console.error(err);
      alert("Error approving vehicle");
    } finally {
      setApproving(null);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search ? { search } : {}),
        ...(brand ? { brand } : {}),
        ...(seller ? { seller } : {}),
        ...(filterType ? { type: filterType } : {}),
      });

      const res = await fetch(`https://api.f-carshipping.com/api/vehicles/dashboard?${params}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      console.log('Vehicles API response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Vehicles API error:', {
          status: res.status,
          error: errorText
        });
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setVehicles(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching vehicles:', err);
      
      if (err.message === 'SESSION_EXPIRED') {
        setError('Your session has expired. Please log in again.');
      } else if (err.message === 'ACCESS_DENIED') {
        setError('You do not have permission to access this resource.');
      } else {
        setError(err.message || "Failed to load vehicles");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email && role) {
      fetchVehicles();
    }
  }, [email, role, page, size, search, brand, seller, filterType]);

  const deleteVehicle = async (id: number) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await fetch(`https://api.f-carshipping.com/api/vehicles/${id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      fetchVehicles();
    } catch {
      alert("Failed to delete vehicle");
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditVehicle(null);
    fetchVehicles();
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditVehicle(null);
  };

  const vehicleTypes = ["Truck", "Bus", "Van", "Trailer", "Camper Van", "Other"];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Commercial Vehicle Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Filters - Matching Cars Grid */}
      <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border shadow-sm">
        <input
          type="text"
          placeholder="Global search..."
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
          value={filterType}
          onChange={(e) => {
            setPage(0);
            setFilterType(e.target.value);
          }}
          className="border p-2 rounded w-full sm:w-48"
        >
          <option value="">All Types</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
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
      {loading && <p>Loading vehicles…</p>}

      {/* Cards Grid - Matching Cars Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={vehicle.imageUrls?.[0] || "/placeholder-car.jpg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-48 w-full object-cover"
              />
              
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-gray-500 text-sm">
                  {vehicle.type || "Type N/A"} • {vehicle.yearOfManufacture || "Year N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  {vehicle.location || "Location N/A"}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  KES {vehicle.priceKes?.toLocaleString() ?? "-"}
                </p>

                {/* Vehicle Status Section */}
                <div className="mt-3 flex gap-2">
                  {role === "ADMIN" && vehicle.status !== "APPROVED" && vehicle.status !== "REJECTED" ? (
                    <>
                      <button
                        onClick={() => approveVehicle(vehicle.id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          approving === vehicle.id ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={approving === vehicle.id}
                      >
                        {approving === vehicle.id ? "Approving..." : "Approve"}
                      </button>

                      <button
                        onClick={() => openRejectModal(vehicle.id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          rejecting === vehicle.id ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={rejecting === vehicle.id}
                      >
                        {rejecting === vehicle.id ? "Rejecting..." : "Reject"}
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        vehicle.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {vehicle.status || "PENDING"}
                    </span>
                  )}
                </div>

                {/* Actions (Edit/Delete/Details) */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setEditVehicle(vehicle);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDetailVehicle(vehicle)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No vehicles found.
            </p>
          )}
        </div>
      )}

      {/* Pagination - Matching Cars Grid */}
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

      {/* Add/Edit Modal - Matching Cars Grid */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {editVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AddCommercialVehicleForm
                onSuccess={handleSave}
                vehicleToEdit={editVehicle ?? undefined}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer - Matching Cars Grid */}
      {detailVehicle && (
        <div className="fixed inset-0 flex justify-end z-50 pointer-events-none">
          <div className="bg-white w-full sm:w-96 h-full p-6 shadow-xl overflow-y-auto pointer-events-auto">
            <button
              onClick={() => setDetailVehicle(null)}
              className="mb-4 p-2 hover:bg-gray-100 rounded"
            >
              Close
            </button>

            <img
              src={detailVehicle.imageUrls?.[0] || "/placeholder-car.jpg"}
              alt={`${detailVehicle.brand} ${detailVehicle.model}`}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <h3 className="text-2xl font-bold mb-2">
              {detailVehicle.brand} {detailVehicle.model}
            </h3>
            <p className="text-gray-600 mb-1">
              Year: {detailVehicle.yearOfManufacture || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              Seller: {detailVehicle.seller || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              Type: {detailVehicle.type || "N/A"}
            </p>
            <p className="text-gray-800 font-semibold mt-2">
              Price: KES {detailVehicle.priceKes?.toLocaleString() ?? "-"}
            </p>

            <p className="mt-4 text-gray-500">
              {detailVehicle.description || "No description provided."}
            </p>

            {/* Commercial-specific details */}
            <div className="mt-4 text-gray-600 space-y-1">
              <p>Condition: {detailVehicle.conditionType || "N/A"}</p>
              <p>Body Type: {detailVehicle.bodyType || "N/A"}</p>
              <p>Color: {detailVehicle.color || "N/A"}</p>
              <p>Engine: {detailVehicle.engineType || "N/A"} {detailVehicle.engineCapacityCc || ""} CC</p>
              <p>Fuel Type: {detailVehicle.fuelType || "N/A"}</p>
              <p>Transmission: {detailVehicle.transmission || "N/A"}</p>
              <p>Seats: {detailVehicle.seats || "N/A"}</p>
              <p>Doors: {detailVehicle.doors || "N/A"}</p>
              <p>Mileage: {detailVehicle.mileageKm || "N/A"} km</p>
              <p>Payload Capacity: {detailVehicle.payloadCapacityKg || "N/A"} kg</p>
              <p>Cargo Volume: {detailVehicle.cargoVolumeM3 || "N/A"} m³</p>
              <p>Sleeper Capacity: {detailVehicle.sleeperCapacity || "N/A"}</p>
              <p>Camper Features: {detailVehicle.camperFeatures || "N/A"}</p>
              <p>Location: {detailVehicle.location || "N/A"}</p>
              <p>Owner Type: {detailVehicle.ownerType || "N/A"}</p>
            </div>

            {/* Features */}
            {detailVehicle.features && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Features:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {detailVehicle.features.split(",").map((feature, idx) => (
                    <li key={idx}>{feature.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Custom Specifications */}
            {detailVehicle.customSpecs && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Specifications:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {(() => {
                    try {
                      const specs = JSON.parse(detailVehicle.customSpecs) as
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
                      return <li>{detailVehicle.customSpecs}</li>;
                    }
                    return null;
                  })()}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <Reject_Modal
        vehicleId={selectedVehicleId}
        show={showRejectModal}
        onClose={closeRejectModal}
        onReject={handleRejectWrapper}
      />
    </div>
  );
}