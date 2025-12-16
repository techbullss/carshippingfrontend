"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Star, ThumbsUp, MessageSquare, Calendar, 
  Loader2, AlertCircle, TrendingUp, Filter,
  Search, ChevronLeft, ChevronRight, User, Package,
  Shield, CheckCircle, X, Edit, Trash2, Eye, EyeOff,
  RefreshCw, MoreVertical, AlertTriangle, CheckCircle2,
  Ban, Reply, BarChart3, Download, Mail, Phone, Globe
} from "lucide-react";
import { format } from "date-fns";

// Types
interface Review {
  id: number;
  clientName: string;
  clientEmail?: string;
  rating: number;
  comment: string;
  itemName: string;
  helpfulCount: number;
  createdAt: string;
  approved?: boolean;
  flagged?: boolean;
  replies?: ReviewReply[];
}

interface ReviewReply {
  id: number;
  adminName: string;
  reply: string;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  flaggedReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

interface ReviewFilters {
  status: 'all' | 'approved' | 'pending' | 'flagged';
  rating: number | 'all';
  search: string;
  dateFrom: string;
  dateTo: string;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState({
    reviews: true,
    stats: true,
    actions: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  
  // Filter states
  const [filters, setFilters] = useState<ReviewFilters>({
    status: 'all',
    rating: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Selected reviews for bulk actions
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Modal states
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Search debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch reviews with filters
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, reviews: true }));
      setError(null);
      
      let url = `${API_BASE_URL}/reviews?page=${page}&size=${pageSize}`;
      
      // Add filters
      const params = new URLSearchParams();
      
      if (filters.status !== 'all') {
        if (filters.status === 'approved') params.append('approved', 'true');
        if (filters.status === 'pending') params.append('approved', 'false');
        if (filters.status === 'flagged') params.append('flagged', 'true');
      }
      
      if (filters.search) {
        url = `${API_BASE_URL}/reviews/search?query=${encodeURIComponent(filters.search)}&page=${page}&size=${pageSize}`;
      } else {
        if (params.toString()) {
          url += `&${params.toString()}`;
        }
      }
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.content);
      setTotalPages(data.totalPages);
      setSelectedReviews([]);
      setSelectAll(false);
      
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  }, [page, filters]);

  // Fetch review statistics
  const fetchReviewStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/reviews/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to fetch review statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setPage(0);
      fetchReviews();
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  // Apply filters
  const applyFilters = () => {
    setPage(0);
    fetchReviews();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      rating: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
    setPage(0);
    fetchReviews();
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(review => review.id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle single review selection
  const toggleReviewSelection = (reviewId: number) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Bulk actions
  const performBulkAction = async (action: 'approve' | 'reject' | 'delete' | 'flag') => {
    if (selectedReviews.length === 0) return;
    
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const promises = selectedReviews.map(reviewId => {
        switch (action) {
          case 'approve':
            return fetch(`${API_BASE_URL}/reviews/${reviewId}/moderate?approve=true`, {
              method: 'PATCH',
              credentials: 'include',
            });
          case 'reject':
            return fetch(`${API_BASE_URL}/reviews/${reviewId}/moderate?approve=false`, {
              method: 'PATCH',
              credentials: 'include',
            });
          case 'flag':
            return fetch(`${API_BASE_URL}/reviews/${reviewId}/flag`, {
              method: 'POST',
              credentials: 'include',
            });
          case 'delete':
            return fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
              method: 'DELETE',
              credentials: 'include',
            });
        }
      });
      
      await Promise.all(promises);
      
      setSuccess(`${selectedReviews.length} reviews ${action}ed successfully`);
      fetchReviews();
      fetchReviewStats();
      
    } catch (err) {
      setError(`Failed to perform ${action} action`);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Moderate single review
  const moderateReview = async (reviewId: number, approve: boolean) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/moderate?approve=${approve}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to moderate review');
      
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, approved: approve }
            : review
        )
      );
      
      setSuccess(`Review ${approve ? 'approved' : 'rejected'} successfully`);
      fetchReviewStats();
      
    } catch (err) {
      setError('Failed to moderate review');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Submit reply to review
  const submitReply = async (reviewId: number) => {
    if (!replyText.trim()) return;
    
    try {
      setIsSubmittingReply(true);
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ reply: replyText })
      });
      
      if (!response.ok) throw new Error('Failed to submit reply');
      
      const savedReply = await response.json();
      
      // Update local state
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? {
                ...review,
                replies: [
                  ...(review.replies || []),
                  savedReply
                ]
              }
            : review
        )
      );
      
      if (selectedReview?.id === reviewId) {
        setSelectedReview(prev =>
          prev ? {
            ...prev,
            replies: [
              ...(prev.replies || []),
              savedReply
            ]
          } : null
        );
      }
      
      setReplyText("");
      setReplyModalOpen(false);
      setSuccess('Reply posted successfully');
      
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete review
  const deleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete review');
      
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
      setSuccess('Review deleted successfully');
      fetchReviewStats();
      
    } catch (err) {
      setError('Failed to delete review');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Export reviews to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Client Name', 'Client Email', 'Rating', 'Item', 'Comment', 'Created At', 'Status'];
    const csvContent = [
      headers.join(','),
      ...reviews.map(review => [
        review.id,
        `"${review.clientName.replace(/"/g, '""')}"`,
        `"${review.clientEmail || ''}"`,
        review.rating,
        `"${review.itemName.replace(/"/g, '""')}"`,
        `"${review.comment.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        new Date(review.createdAt).toISOString(),
        review.approved ? 'Approved' : review.flagged ? 'Flagged' : 'Pending'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Initialize
  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [page]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading.reviews && !loading.actions) {
        fetchReviews();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loading.reviews, loading.actions]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
        <p className="text-gray-600">Manage and moderate customer reviews</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900 font-medium"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <CheckCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
          <span>{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-700 hover:text-green-900 font-medium"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading.stats ? (
                  <span className="inline-block h-8 bg-gray-200 rounded w-16 animate-pulse"></span>
                ) : (
                  stats?.totalReviews || 0
                )}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {loading.stats ? (
                  <span className="inline-block h-8 bg-gray-200 rounded w-16 animate-pulse"></span>
                ) : (
                  stats?.approvedReviews || 0
                )}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {loading.stats ? (
                  <span className="inline-block h-8 bg-gray-200 rounded w-16 animate-pulse"></span>
                ) : (
                  stats?.pendingReviews || 0
                )}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <Eye className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-red-600">
                {loading.stats ? (
                  <span className="inline-block h-8 bg-gray-200 rounded w-16 animate-pulse"></span>
                ) : (
                  stats?.flaggedReviews || 0
                )}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow mb-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters & Search</h2>
          <div className="flex gap-3">
            <button
              onClick={applyFilters}
              disabled={loading.reviews}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Filter size={16} />
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              disabled={loading.reviews}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reset
            </button>
            <button
              onClick={exportToCSV}
              disabled={reviews.length === 0 || loading.reviews}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={loading.reviews}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={loading.reviews}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              disabled={loading.reviews}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              disabled={loading.reviews}
            />
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              disabled={loading.reviews}
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle2 className="text-blue-600" size={20} />
            </div>
            <span className="font-medium text-blue-800">
              {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => performBulkAction('approve')}
              disabled={loading.actions}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button
              onClick={() => performBulkAction('reject')}
              disabled={loading.actions}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Ban size={16} />
              Reject
            </button>
            <button
              onClick={() => performBulkAction('flag')}
              disabled={loading.actions}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Flag
            </button>
            <button
              onClick={() => performBulkAction('delete')}
              disabled={loading.actions}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={() => setSelectedReviews([])}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Review</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Rating</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading.reviews ? (
                // Skeleton Loaders
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-4"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-8"></div>
                        <div className="h-8 bg-gray-200 rounded w-8"></div>
                        <div className="h-8 bg-gray-200 rounded w-8"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => toggleReviewSelection(review.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="text-green-600" size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail size={12} className="mr-1" />
                              <span>{review.clientEmail}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <Package size={12} className="inline mr-1" />
                          {review.itemName}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            size={16}
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{review.rating}.0</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        review.approved
                          ? 'bg-green-100 text-green-800'
                          : review.flagged
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {review.approved ? 'Approved' : review.flagged ? 'Flagged' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {!review.approved && (
                          <button
                            onClick={() => moderateReview(review.id, true)}
                            disabled={loading.actions}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {!review.flagged && (
                          <button
                            onClick={() => moderateReview(review.id, false)}
                            disabled={loading.actions}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setReplyModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Reply"
                        >
                          <Reply size={18} />
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          disabled={loading.actions}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => prev - 1)}
              disabled={page === 0 || loading.reviews}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                const pageNum = page < 3 ? index : page - 2 + index;
                if (pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm ${
                      page === pageNum
                        ? "bg-green-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= totalPages - 1 || loading.reviews}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Reply to Review</h3>
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Review Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedReview.clientName}</h4>
                    <p className="text-sm text-gray-600">{selectedReview.itemName}</p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={16}
                      className={i < selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
              
              {/* Existing Replies */}
              {selectedReview.replies && selectedReview.replies.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Previous Replies</h4>
                  <div className="space-y-3">
                    {selectedReview.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={12} />
                          </div>
                          <span className="font-medium text-blue-700">{reply.adminName}</span>
                          <span className="text-sm text-blue-600">• {formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{reply.reply}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reply Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  placeholder="Type your reply here..."
                  disabled={isSubmittingReply}
                />
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setReplyModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReply(selectedReview.id)}
                    disabled={isSubmittingReply || !replyText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmittingReply ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Reply size={16} />
                        Post Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}