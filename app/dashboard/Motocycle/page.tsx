"use client";
import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import MotorcycleCard from "@/app/components/MotorcycleCard";
import AddMotorcycleForm from "@/app/components/AddMotorcycleForm";
import { useCurrentUser } from "@/app/Hookes/useCurrentUser";

export default function MotorcyclePage() {
  const { user: currentUser } = useCurrentUser();
  const email = currentUser?.email || '';
  const role = currentUser?.roles?.[0] || '';
  
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
  
  // Filter states
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [year, setYear] = useState("");
  
  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(false);

  // Determine if user is authenticated
  const isAuthenticated = !!email;
  const isAdmin = role === "ADMIN";
  const isSeller = role === "SELLER";

  // Determine endpoint based on authentication and view mode
  const getEndpoint = () => {
    if (isAuthenticated && isDashboardView) {
      return "/api/motorcycles/dashboard";
    }
    return "/api/motorcycles/public";
  };

  // Determine page size based on endpoint
  const getPageSize = () => {
    return getEndpoint().includes("dashboard") ? 20 : 9;
  };

  // Build query parameters based on endpoint
  const buildQueryParams = (pageNum: number) => {
    const params: string[] = [];
    const endpoint = getEndpoint();
    
    // Basic pagination
    params.push(`page=${pageNum}`);
    params.push(`size=${getPageSize()}`);
    
    // Common filters for all endpoints
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (filterType) params.push(`type=${encodeURIComponent(filterType)}`);
    
    if (endpoint.includes("dashboard")) {
      // Dashboard specific filters
      if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
      if (selectedBrand) params.push(`brand=${encodeURIComponent(selectedBrand)}`);
    } else {
      // Public endpoint filters (only approved vehicles)
      if (selectedBrand) params.push(`brand=${encodeURIComponent(selectedBrand)}`);
      if (priceRange) params.push(`priceRange=${encodeURIComponent(priceRange)}`);
      if (year) params.push(`year=${encodeURIComponent(year)}`);
    }
    
    return params.length ? `?${params.join("&")}` : "";
  };

  // Fetch with pagination
  const fetchList = async (pageNum = 0) => {
    setLoading(true);
    try {
      const endpoint = getEndpoint();
      const q = buildQueryParams(pageNum);
      
      const res = await fetch(`https://api.f-carshipping.com${endpoint}${q}`, { 
        credentials: 'include', 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          
        } 
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Handle paginated response
      if (data.content !== undefined) {
        setMotorcycles(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setMotorcycles(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
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

  // Auto-switch to dashboard view if user is authenticated and looking at status filter
  useEffect(() => {
    if (isAuthenticated && filterStatus) {
      setIsDashboardView(true);
    }
  }, [filterStatus, isAuthenticated]);

  // Fetch data when filters or authentication changes
  useEffect(() => {
    fetchList(0);
  }, [search, filterType, filterStatus, selectedBrand, priceRange, year, isDashboardView, isAuthenticated]);

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
        credentials: 'include',
      
      });
      fetchList(page);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete motorcycle");
    }
  };

  const handleApprove = async (m: any) => {
    if (!confirm("Approve this motorcycle?")) return;
    try {
      await fetch(`https://api.f-carshipping.com/api/motorcycles/${m.id}/approve`, { 
        method: "PUT", 
        credentials: 'include',
      
      });
      fetchList(page);
    } catch (error) {
      console.error("Approve error:", error);
      alert("Failed to approve motorcycle");
    }
  };

  const handleReject = async (m: any) => {
    if (!confirm("Reject this motorcycle?")) return;
    try {
      await fetch(`https://api.f-carshipping.com/api/motorcycles/${m.id}/reject`, { 
        method: "PUT", 
        credentials: 'include',
        
      });
      fetchList(page);
    } catch (error) {
      console.error("Reject error:", error);
      alert("Failed to reject motorcycle");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterStatus("");
    setSelectedBrand("");
    setPriceRange("");
    setYear("");
    setPage(0);
    setShowAdvancedFilters(false);
    
    // Reset to public view if not authenticated
    if (!isAuthenticated) {
      setIsDashboardView(false);
    }
  };

  const toggleViewMode = () => {
    setIsDashboardView(!isDashboardView);
    setPage(0);
    // Reset status filter when switching to public view
    if (!isDashboardView) {
      setFilterStatus("");
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Motorcycles</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">
              {isDashboardView ? "Dashboard View" : "Public View"} • 
              Showing {isDashboardView ? "All Statuses" : "Approved Only"}
            </span>
            {isAuthenticated && (
              <button
                onClick={toggleViewMode}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                Switch to {isDashboardView ? "Public" : "Dashboard"} View
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <input
            placeholder="Search brand or model..."
            className="border p-2 rounded-md w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          {/* Type Filter */}
          <select className="border p-2 rounded-md" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All types</option>
            <option>Sport</option>
            <option>Cruiser</option>
            <option>Dirt</option>
            <option>Touring</option>
            <option>Standard</option>
          </select>
          
          {/* Status Filter (only in dashboard view) */}
          {isDashboardView && (
            <select className="border p-2 rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All status</option>
              <option>APPROVED</option>
              <option>PENDING</option>
              <option>REJECTED</option>
            </select>
          )}
          
          {/* Add Button (only for authenticated sellers/admins) */}
          {(isSeller || isAdmin) && (
            <button 
              onClick={() => { setEditing(null); setFormOpen(true); }} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
          
          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Advanced Filter Section */}
      {showAdvancedFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              placeholder="Brand"
              className="border p-2 rounded-md"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            />
            
            {!isDashboardView && (
              <>
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
              </>
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-3">
              <button 
                onClick={handleResetFilters} 
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Reset All Filters
              </button>
              <button 
                onClick={() => setShowAdvancedFilters(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Hide Filters
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {motorcycles.length} of {totalElements} motorcycles
              {isDashboardView ? " (Dashboard)" : " (Public)"}
            </div>
          </div>
        </div>
      )}

      {/* User Role Indicator */}
      {isAuthenticated && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                Logged in as: <span className="font-semibold">{email}</span>
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {role}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Viewing: <span className="font-medium">{isDashboardView ? "All Listings" : "Approved Listings Only"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-20">Loading motorcycles...</div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No motorcycles found. {isDashboardView ? "Try changing status filters." : "Try adjusting your search."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {motorcycles.map((m) => (
              <MotorcycleCard
                key={m.id}
                m={m}
                onEdit={(isSeller || isAdmin) ? ((x) => { setEditing(x); setFormOpen(true); }) : undefined}
                onDelete={(isSeller || isAdmin) ? ((x) => handleDelete(x)) : undefined}
                onDetails={(x) => { setSelected(x); setDrawerOpen(true); }}
                onApprove={isAdmin ? ((x) => handleApprove(x)) : undefined}
                onReject={isAdmin ? ((x) => handleReject(x)) : undefined}
                showAdminControls={isAdmin && isDashboardView}
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
                Page {page + 1} of {totalPages} ({getPageSize()} per page)
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawer Details */}
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
              {/* Price and Status */}
              <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold text-blue-600">KES {selected.price?.toLocaleString()}</div>
                {isAuthenticated && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selected.status === "APPROVED" ? "bg-green-100 text-green-800" : 
                    selected.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {selected.status}
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Location</div>
                  <div className="font-medium">{selected.location || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Engine Capacity</div>
                  <div className="font-medium">{selected.engineCapacity} cc</div>
                </div>
                {isAuthenticated && (
                  <>
                    <div>
                      <div className="text-gray-500">Owner</div>
                      <div className="font-medium">{selected.owner || "—"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Created</div>
                      <div className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Features */}
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

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selected.description || "No description provided."}</p>
              </div>

              {/* Images */}
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

              {/* Admin Actions */}
              {isAdmin && selected.status !== "APPROVED" && (
                <div className="flex gap-3 pt-4 border-t">
                  {selected.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => { handleApprove(selected); setDrawerOpen(false); }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => { handleReject(selected); setDrawerOpen(false); }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selected.status === "REJECTED" && (
                    <button 
                      onClick={() => { handleApprove(selected); setDrawerOpen(false); }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isSeller || isAdmin) && (
        <AddMotorcycleForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={() => { 
            setFormOpen(false); 
            setEditing(null);
            fetchList(page);
          }}
          motorcycleToEdit={editing}
          currentUserEmail={email}
        />
      )}
    </div>
  );
}