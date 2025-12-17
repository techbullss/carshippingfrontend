"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import MotorcycleCard from "@/app/components/MotorcycleCard";
import AddMotorcycleForm from "@/app/components/AddMotorcycleForm";

export default function MotorcyclePage() {
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [year, setYear] = useState("");

  // Fetch with pagination
  const fetchList = async (pageNum = 0) => {
    setLoading(true);
    try {
      const params: string[] = [];
      params.push(`page=${pageNum}`);
      params.push(`size=9`);
      
      // Add filters
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (filterType) params.push(`type=${encodeURIComponent(filterType)}`);
      if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
      
      // Add optional filters for /filter endpoint
      if (selectedBrand) params.push(`brand=${encodeURIComponent(selectedBrand)}`);
      if (selectedModel) params.push(`model=${encodeURIComponent(selectedModel)}`);
      if (priceRange) params.push(`priceRange=${encodeURIComponent(priceRange)}`);
      if (year) params.push(`year=${encodeURIComponent(year)}`);
      
      // Determine which endpoint to use
      let endpoint = "/api/motorcycles";
      // If using advanced filters, use the /filter endpoint
      if (selectedBrand || selectedModel || priceRange || year) {
        endpoint = "/api/motorcycles/filter";
      }
      
      const q = params.length ? `?${params.join("&")}` : "";
      const res = await fetch(`https://api.f-carshipping.com${endpoint}${q}`, { 
        credentials: 'include', 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' } 
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Handle both response formats:
      // 1. Paginated response (Spring Page): has content, totalPages, totalElements
      // 2. Direct array: no pagination metadata
      if (data.content !== undefined) {
        // This is a paginated response
        setMotorcycles(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        // This is a direct array response (no pagination)
        setMotorcycles(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        // Fallback: try to extract array from response
        console.warn("Unexpected response format:", data);
        setMotorcycles([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      
      setPage(pageNum);
    } catch (e) {
      console.error("Fetch error:", e);
      setMotorcycles([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(0); // Reset to page 0 when filters change
  }, [search, filterType, filterStatus, selectedBrand, selectedModel, priceRange, year]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchList(newPage);
    }
  };

  const handleDelete = async (m: any) => {
    if (!confirm("Delete this motorcycle?")) return;
    try {
      await fetch(`https://api.f-carshipping.com/api/motorcycles/${m.id}`, { 
        method: "DELETE", 
        credentials: 'include' 
      });
      // Refresh current page
      fetchList(page);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete motorcycle");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterStatus("");
    setSelectedBrand("");
    setSelectedModel("");
    setPriceRange("");
    setYear("");
    setPage(0);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Motorcycles</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            placeholder="Search brand or model..."
            className="border p-2 rounded-md w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border p-2 rounded-md" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All types</option>
            <option>Sport</option>
            <option>Cruiser</option>
            <option>Dirt</option>
            <option>Touring</option>
            <option>Standard</option>
          </select>
          <select className="border p-2 rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All status</option>
            <option>APPROVED</option>
            <option>PENDING</option>
            <option>REJECTED</option>
          </select>

          <button onClick={() => { setEditing(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Advanced Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            placeholder="Brand"
            className="border p-2 rounded-md"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          />
          <input
            placeholder="Model"
            className="border p-2 rounded-md"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          />
          <input
            placeholder="Price Range (e.g., 100000-500000)"
            className="border p-2 rounded-md"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          />
          <input
            placeholder="Year"
            className="border p-2 rounded-md"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-3">
          <button 
            onClick={handleResetFilters} 
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Reset Filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {motorcycles.length} of {totalElements} motorcycles
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20">Loading motorcycles...</div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No motorcycles found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {motorcycles.map((m) => (
              <MotorcycleCard
                key={m.id}
                m={m}
                onEdit={(x) => { setEditing(x); setFormOpen(true); }}
                onDelete={(x) => handleDelete(x)}
                onDetails={(x) => { setSelected(x); setDrawerOpen(true); }}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className={`px-4 py-2 rounded-md ${page === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (page < 3) {
                    pageNum = i;
                  } else if (page > totalPages - 4) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-md ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className={`px-4 py-2 rounded-md ${page >= totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                Next
              </button>
              
              <div className="text-sm text-gray-600 ml-4">
                Page {page + 1} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawer details */}
      {drawerOpen && selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full sm:w-[420px] md:w-[520px] lg:w-[640px] bg-white shadow-2xl h-full overflow-y-auto"
          >
            <div className="sticky top-0 z-20 bg-white border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selected.brand} {selected.model}</h2>
                <div className="text-sm text-gray-500">
                  {selected.type} • {selected.engineCapacity} cc • {selected.year}
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-2xl font-semibold text-blue-600">KES {selected.price?.toLocaleString()}</div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className={`font-medium ${
                    selected.status === "APPROVED" ? "text-green-600" : 
                    selected.status === "PENDING" ? "text-yellow-600" : 
                    "text-red-600"
                  }`}>
                    {selected.status}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Location</div>
                  <div className="font-medium">{selected.location || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Owner</div>
                  <div className="font-medium">{selected.owner || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              {selected.features && selected.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.features.map((feature: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selected.description || "No description provided."}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Images</h3>
                {selected.imageUrls?.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selected.imageUrls.map((img: string, idx: number) => (
                      <div key={idx} className="relative overflow-hidden rounded-lg border">
                        <img 
                          src={img} 
                          alt={`${selected.brand}-${idx}`} 
                          className="w-full h-40 object-cover transform hover:scale-105 transition duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No images available.</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <AddMotorcycleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => { 
          setFormOpen(false); 
          fetchList(page); // Refresh current page after success
        }}
        motorcycleToEdit={editing}
      />
    </div>
  );
}