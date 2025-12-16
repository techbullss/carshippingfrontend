"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, Package, Clock, Eye, 
  Edit, Trash2, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, AlertCircle, 
  Loader2, TrendingUp, Truck, RefreshCw,
  MessageSquare, Download, BarChart3
} from "lucide-react";
import Link from "next/link";

// Types
interface Order {
  id: number;
  requestId: string;
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

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    delivered: 0,
    cancelled: 0
  });

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusMap: Record<string, string> = {
        "all": "",
        "pending": "PENDING",
        "sourcing": "SOURCING",
        "in_transit": "IN_TRANSIT",
        "delivered": "DELIVERED",
        "cancelled": "CANCELLED"
      };
      
      const status = statusMap[filter] || "";
      
      let url = `${API_BASE_URL}/my-requests?page=${page}&size=${pageSize}`;
      if (search) url += `&search=${search}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      
      // Calculate stats
      calculateStats(data.content);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate order statistics
  const calculateStats = (ordersList: Order[]) => {
    const stats = {
      total: ordersList.length,
      pending: 0,
      inProgress: 0,
      delivered: 0,
      cancelled: 0
    };
    
    ordersList.forEach(order => {
      switch (order.status.toLowerCase()) {
        case 'pending':
          stats.pending++;
          break;
        case 'sourcing':
        case 'in_transit':
          stats.inProgress++;
          break;
        case 'delivered':
          stats.delivered++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
    });
    
    setStats(stats);
  };

  // Cancel order
  const cancelOrder = async (orderId: number) => {
    try {
      setCancellingOrder(orderId);
      
      const response = await fetch(`${API_BASE_URL}/requests/${orderId}/status?status=CANCELLED`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to cancel order');
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELLED' }
          : order
      ));
      
      // Recalculate stats
      calculateStats(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELLED' }
          : order
      ));
      
      setShowCancelModal(false);
      setSelectedOrder(null);
      
      alert('Order cancelled successfully. Admin has been notified.');
      
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status color and text
  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Pending Review',
          icon: <Clock size={14} />
        };
      case 'sourcing':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Sourcing',
          icon: <Package size={14} />
        };
      case 'in_transit':
        return {
          color: 'bg-purple-100 text-purple-800',
          text: 'In Transit',
          icon: <Truck size={14} />
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Delivered',
          icon: <CheckCircle size={14} />
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Cancelled',
          icon: <XCircle size={14} />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: status,
          icon: <Package size={14} />
        };
    }
  };

  // Check if order can be edited/cancelled
  const canEditOrder = (order: Order) => {
    const status = order.status.toLowerCase();
    return status === 'pending' || status === 'sourcing';
  };

  // Initialize
  useEffect(() => {
    fetchUserOrders();
  }, [page, filter]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) {
        fetchUserOrders();
      } else {
        setPage(0);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600">Track and manage your shipping requests</p>
          </div>
          <Link
            href="/dashboard/request-item"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            <Package size={20} />
            New Order Request
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
            <span>{error}</span>
            <button 
              onClick={() => {
                setError(null);
                fetchUserOrders();
              }}
              className="ml-auto text-red-700 hover:text-red-900 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="text-blue-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Truck className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-800">{stats.delivered}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="text-red-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by item name, request ID, or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {["all", "pending", "sourcing", "in_transit", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                disabled={loading}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading && filter === status ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')
                )}
              </button>
            ))}
          </div>
          
          <button 
            onClick={fetchUserOrders}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget & Date
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const editable = canEditOrder(order);
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.requestId}</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-xs">{order.itemName}</div>
                          <div className="text-sm text-gray-600">{order.category}</div>
                          <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="font-medium">{order.originCountry}</span>
                            <span className="mx-2">→</span>
                            <span>{order.destination}</span>
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            Urgency: {order.urgency}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(order.budget || 0)}
                          </div>
                          <div className="text-gray-500">
                            Updated: {formatDate(order.updatedAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {editable && (
                            <Link
                              href={`/dashboard/edit-order/${order.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Order"
                            >
                              <Edit size={18} />
                            </Link>
                          )}
                          
                          {editable && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowCancelModal(true);
                              }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Cancel Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          
                          {order.status === 'DELIVERED' && (
                            <Link
                              href="/dashboard/add-review"
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title="Leave Review"
                            >
                              <MessageSquare size={18} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500 mb-6">
                        {search || filter !== 'all' 
                          ? "No orders match your search criteria." 
                          : "You haven't placed any orders yet."}
                      </p>
                      <Link
                        href="/dashboard/request-item"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        <Package size={20} />
                        Place Your First Order
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page * pageSize) + 1}</span> to{" "}
              <span className="font-medium">{Math.min((page + 1) * pageSize, totalElements)}</span> of{" "}
              <span className="font-medium">{totalElements}</span> orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(prev => prev - 1)}
                disabled={page === 0 || loading}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="px-3 py-1 text-sm">
                Page {page + 1} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages - 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <p className="text-gray-600">Request ID: {selectedOrder.requestId}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setShowCancelModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Item Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Item:</span> {selectedOrder.itemName}</p>
                      <p><span className="font-medium">Category:</span> {selectedOrder.category}</p>
                      <p><span className="font-medium">Quantity:</span> {selectedOrder.quantity}</p>
                      <p><span className="font-medium">Urgency:</span> {selectedOrder.urgency}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Budget & Timeline</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Budget:</span> {formatCurrency(selectedOrder.budget || 0)}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(selectedOrder.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">From:</span> {selectedOrder.originCountry}</p>
                      <p><span className="font-medium">To:</span> {selectedOrder.destination}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                          {getStatusInfo(selectedOrder.status).text}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedOrder.imageUrls && selectedOrder.imageUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Reference Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedOrder.imageUrls.map((url, index) => (
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
                {canEditOrder(selectedOrder) && (
                  <>
                    <Link
                      href={`/dashboard/edit-order/${selectedOrder.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit size={18} className="inline mr-2" />
                      Edit Order
                    </Link>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Cancel Order</h2>
                <p className="text-gray-600">Are you sure you want to cancel this order?</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">
                <strong>Request ID:</strong> {selectedOrder.requestId}<br />
                <strong>Item:</strong> {selectedOrder.itemName}<br />
                <strong>Note:</strong> Cancelling this order will notify the admin team immediately.
              </p>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrder(null);
                }}
                disabled={cancellingOrder !== null}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                No, Keep Order
              </button>
              <button
                onClick={() => cancelOrder(selectedOrder.id)}
                disabled={cancellingOrder !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {cancellingOrder === selectedOrder.id ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Yes, Cancel Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}