"use client";

import { CommercialVehicle } from "@/app/CommercialVehicle";
import AddCommercialVehicleForm from "@/app/components/AddCommercialVehicleForm";
import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Info,
  MapPin,
  Truck,
  X,
} from "lucide-react";

export default function CommercialVehicleList() {
  const [vehicles, setVehicles] = useState<CommercialVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<CommercialVehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0); // Spring Boot is 0-based
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<CommercialVehicle | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      let query = `https://carshipping.duckdns.org:8443/api/vehicles?page=${page}&size=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (filterType) query += `&type=${encodeURIComponent(filterType)}`;

      const res = await fetch(query, { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setVehicles(data.content || data);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, search, filterType]);

  const handleDelete = async (vehicle: CommercialVehicle) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`https://carshipping.duckdns.org:8443/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err: any) {
      alert(err.message || "Failed to delete vehicle.");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVehicle(null);
    fetchVehicles();
  };

  const vehicleTypes = ["Truck", "Bus", "Van", "Trailer", "Camper Van", "Other"];

  return (
    <div className="p-4">
      {/* Vehicle Form */}
      {showForm && (
        <AddCommercialVehicleForm
          vehicleToEdit={editingVehicle}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {!showForm && (
        <>
          {/* Search + Filter + Add */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <input
              type="text"
              placeholder="Search by brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full md:w-1/3"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded w-full md:w-1/4"
            >
              <option value="">Filter by Type</option>
              {vehicleTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              + Add Vehicle
            </button>
          </div>

          {/* Vehicle Cards */}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : vehicles.length === 0 ? (
            <div>No vehicles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  {/* Vehicle Image */}
                  {v.imageUrls && v.imageUrls.length > 0 ? (
                    <img
                      src={v.imageUrls[0]}
                      alt={`${v.brand} ${v.model}`}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Vehicle Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-gray-600">Type: {v.type}</p>
                    <p className="text-gray-800 font-bold">KES {v.priceKes}</p>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {v.location}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setEditingVehicle(v);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                      <button
                        onClick={() => setSelectedVehicle(v)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Info className="w-4 h-4" /> Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Drawer for Vehicle Details */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full sm:w-2/3 lg:w-1/3 bg-white h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedVehicle.brand} {selectedVehicle.model}
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            {selectedVehicle.imageUrls && selectedVehicle.imageUrls.length > 0 && (
              <img
                src={selectedVehicle.imageUrls[0]}
                alt="Vehicle"
                className="h-64 w-full object-cover"
              />
            )}

            {/* Details */}
            <div className="p-4 space-y-2 overflow-y-auto">
              <p><strong>Brand:</strong> {selectedVehicle.brand}</p>
              <p><strong>Model:</strong> {selectedVehicle.model}</p>
              <p><strong>Type:</strong> {selectedVehicle.type}</p>
              <p><strong>Price:</strong> KES {selectedVehicle.priceKes}</p>
              <p><strong>Location:</strong> {selectedVehicle.location}</p>
              <p><strong>Description:</strong> {selectedVehicle.description || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
