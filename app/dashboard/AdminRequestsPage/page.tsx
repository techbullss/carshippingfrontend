"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, Package, Clock, 
  CheckCircle, XCircle, Eye, MessageSquare,
  Download, MoreVertical, User, MapPin,
  DollarSign, Calendar, Loader2, AlertCircle,
  TrendingUp, Users, Truck, BarChart3,
  ChevronLeft, ChevronRight, ExternalLink
} from "lucide-react";

// Types
interface Request {
  description: string;
  id: number;
  requestId: string;
  clientName: string;
  clientEmail: string;
  itemName: string;
  category: string;
  originCountry: string;
  destination: string;
  budget: number;
  quantity: number;
  urgency: string;
  status: string;
  notes: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeShipments: number;
  deliveredRequests: number;
  averageRating: number;
  totalReviews: number;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function AdminRequestsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState({
    requests: true,
    stats: true
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  
  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/stats`,{
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      setError(null);
      
      const statusMap: Record<string, string> = {
        "all": "",
        "pending": "PENDING",
        "processing": "SOURCING",
        "completed": "DELIVERED",
        "cancelled": "CANCELLED"
      };
      
      const status = statusMap[filter] || "";
      
      let url = `${API_BASE_URL}/requests?page=${page}&size=${pageSize}`;
      if (status) url += `&status=${status}`;
      if (search) url += `&search=${search}`;
      
      const response = await fetch(url,{
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      
      const data = await response.json();
      setRequests(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Update request status
  const updateRequestStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/requests/${id}/status?status=${status}`, {
        method: 'PATCH',
       credentials: 'include',
       headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      // Refresh requests
      fetchRequests();
      fetchStats();
      
      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  // Export requests (CSV)
  const exportRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests?size=${totalElements}`,{
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch data for export');
      
      const data = await response.json();
      const csvContent = convertToCSV(data.content);
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `requests-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting requests:', err);
      alert('Failed to export requests');
    }
  };

  // Convert data to CSV
  const convertToCSV = (data: Request[]): string => {
    const headers = ['Request ID', 'Client', 'Email', 'Item', 'Category', 'Origin', 'Destination', 'Budget', 'Status', 'Created Date'];
    const rows = data.map(request => [
      request.requestId,
      request.clientName,
      request.clientEmail,
      request.itemName,
      request.category,
      request.originCountry,
      request.destination,
      `$${request.budget}`,
      request.status,
      new Date(request.createdAt).toLocaleDateString()
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format status display
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sourcing': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [page, filter]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) {
        fetchRequests();
      } else {
        setPage(0);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  // View request details
  const viewRequestDetails = (request: Request) => {
    setSelectedRequest(request);
  };

  // Close details modal
  const closeDetails = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Client Requests</h1>
        <p className="text-gray-600">Manage and track all item sourcing requests</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
          <span>{error}</span>
          <button 
            onClick={() => {
              setError(null);
              fetchRequests();
              fetchStats();
            }}
            className="ml-auto text-red-700 hover:text-red-900 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by client name, item name, or request ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading.requests}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                disabled={loading.requests}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading.requests ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading.requests && filter === status ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  status.charAt(0).toUpperCase() + status.slice(1)
                )}
              </button>
            ))}
          </div>
          
          <button 
            onClick={exportRequests}
            disabled={loading.requests || requests.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading.stats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </>
        ) : stats ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalRequests}</p>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
                </div>
                <Clock className="text-yellow-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Shipments</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeShipments}</p>
                </div>
                <Truck className="text-purple-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Delivered</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.deliveredRequests || 0}</p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading.requests ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.requestId}</div>
                      <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-8 h-8 rounded-full bg-gray-100 p-1 text-gray-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{request.clientName}</div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">{request.itemName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate max-w-xs">
                          {request.originCountry} → {request.destination}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign size={14} className="mr-1" />
                        {formatCurrency(request.budget || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {formatStatus(request.status)}
                        </span>
                        <select
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SOURCING">Sourcing</option>
                          <option value="IN_TRANSIT">In Transit</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewRequestDetails(request)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={`mailto:${request.clientEmail}`}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Email Client"
                        >
                          <MessageSquare size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                      <p className="text-gray-500">
                        {search ? "No requests match your search criteria." : "There are no requests at the moment."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {requests.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page * pageSize) + 1}</span> to{" "}
              <span className="font-medium">{Math.min((page + 1) * pageSize, totalElements)}</span> of{" "}
              <span className="font-medium">{totalElements}</span> requests
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(prev => prev - 1)}
                disabled={page === 0 || loading.requests}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm">
                Page {page + 1} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages - 1 || loading.requests}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
                  <p className="text-gray-600">Request ID: {selectedRequest.requestId}</p>
                </div>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Client Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedRequest.clientName}</p>
                      <p><span className="font-medium">Email:</span> {selectedRequest.clientEmail}</p>
                      <p><span className="font-medium">Urgency:</span> {selectedRequest.urgency}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Item Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Item:</span> {selectedRequest.itemName}</p>
                      <p><span className="font-medium">Category:</span> {selectedRequest.category}</p>
                      <p><span className="font-medium">Quantity:</span> {selectedRequest.quantity}</p>
                      <p><span className="font-medium">Budget:</span> {formatCurrency(selectedRequest.budget || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">From:</span> {selectedRequest.originCountry}</p>
                      <p><span className="font-medium">To:</span> {selectedRequest.destination}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {formatStatus(selectedRequest.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Timestamps</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Created:</span> {formatDate(selectedRequest.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDate(selectedRequest.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.description}</p>
              </div>
              
              {selectedRequest.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}
              
              {selectedRequest.imageUrls && selectedRequest.imageUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Reference Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRequest.imageUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={url}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedRequest.clientEmail}?subject=Regarding your request: ${selectedRequest.requestId}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Contact Client
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}