"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Plus, X } from "lucide-react";
import AddContainerForm from "@/app/components/AddContainerForm";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function ContainersListing() {
    const router = useRouter();
  const [containers, setContainers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(6); // items per page
  const [totalPages, setTotalPages] = useState(0);

  const fetchContainers = async () => {
    let query = `https://api.f-carshipping.com/api/containers?page=${page}&size=${size}`;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (filterType) params.push(`type=${encodeURIComponent(filterType)}`);
    if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
    if (params.length > 0) query += `&${params.join("&")}`;

    const res = await fetch(query, { credentials: 'include' });
    const data = await res.json();

    setContainers(Array.isArray(data.content) ? data.content : []);
    setTotalPages(data.totalPages || 0);
  };

  useEffect(() => {
    fetchContainers();
  }, [search, filterType, filterStatus, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this container?")) return;
    await fetch(`https://api.f-carshipping.com/api/containers/${id}`, {
      method: "DELETE",
    });
    fetchContainers();
  };

  return (
    <div className="p-6 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
       

        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          <Input
            placeholder="Search container number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-56"
          />

          <select
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Dry">Dry</option>
            <option value="Reefer">Reefer</option>
          </select>

          <select
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>

        </div>
      </div>

      {/* Grid of Cards */}
      {containers.length === 0 ? (
        <div className="text-center text-gray-500 py-16 border rounded-xl shadow-sm">
          No containers found. Try adjusting filters or add a new one.
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {containers.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/ContainerDetails/${c.id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                {/* Container Image */}
                {c.imageUrls && c.imageUrls.length > 0 ? (
                  <img
                    src={c.imageUrls[0]}
                    alt={`Container ${c.containerNumber}`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}

                {/* Container Info */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2 flex gap-2  border-b border-gray-200 justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    📦 {c.containerNumber}
                  </h3>
                  <p className="text-gray-600">
                    {c.size} • {c.type}
                  </p>
                    </div>
                   <div className=" flex  justify-between gap-1">
                  <p className="text-green-600 font-bold">
                    KES {c.price.toLocaleString()}
                  </p>
                  <p className="text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        c.status === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </p>
                  </div>

                
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              Prev
            </Button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <Button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Right Drawer */}


{drawerOpen && selected && (
  <div className="fixed inset-0 z-50 flex justify-end">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setDrawerOpen(false)}
    ></div>

    {/* Drawer */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px] bg-white shadow-2xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{selected.containerNumber}</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto">
        {/* Price */}
        <p className="text-xl font-semibold text-blue-600 mb-6">
          KES {selected.price?.toLocaleString()}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-8">
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{selected.size}</p>
          </div>

          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{selected.type}</p>
          </div>

          <div>
            <p className="text-gray-500">Condition</p>
            <p className="font-medium">{selected.condition}</p>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">{selected.location}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{selected.status}</p>
          </div>
        </div>

        {/* Images */}
        <h3 className="text-lg font-semibold mb-3">Images</h3>
        <div className="grid grid-cols-2 gap-3">
          {selected.imageUrls?.map((img: string, idx: number) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg border group"
            >
              <img
                src={img}
                alt={`container-${idx}`}
                className="w-full h-40 object-cover transform group-hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
)}




      <AddContainerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchContainers}
        containerToEdit={editing}
      />
    </div>
  );
}
