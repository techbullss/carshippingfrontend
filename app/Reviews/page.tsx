"use client";

import { useState, useEffect } from "react";
import { 
  Star, ThumbsUp, MessageSquare, Calendar, 
  Loader2, AlertCircle, TrendingUp,
  ChevronLeft, ChevronRight, User, Package,
  Shield, CheckCircle
} from "lucide-react";

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
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    [key: number]: {
      count: number;
      percentage: number;
    }
  };
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState({
    reviews: true,
    stats: true,
    submitting: false
  });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  
  const [newReview, setNewReview] = useState({
    clientName: "",
    clientEmail: "",
    itemName: "",
    rating: 5,
    comment: "",
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(prev => ({ ...prev, reviews: true }));
      setError(null);
      
      const url = `${API_BASE_URL}/reviews/public?page=${page}&size=${pageSize}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  };

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
      // Don't set error for stats - it's not critical
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Submit new review
  const submitReview = async () => {
    // Validate form
    if (!newReview.clientName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!newReview.itemName.trim()) {
      setError("Please enter the item name");
      return;
    }
    if (!newReview.comment.trim()) {
      setError("Please write your review");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newReview.clientEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(prev => ({ ...prev, submitting: true }));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const savedReview = await response.json();
      
      // Add to local state immediately
      setReviews(prev => [savedReview, ...prev]);
      
      // Reset form
      setNewReview({
        clientName: "",
        clientEmail: "",
        itemName: "",
        rating: 5,
        comment: "",
      });
      
      // Refresh stats
      fetchReviewStats();
      
      // Show success message
      alert('Review submitted successfully! Thank you for your feedback.');
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Mark review as helpful
  const markAsHelpful = async (reviewId: number) => {
    try {
      // Update local state first for instant feedback
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ));

      // Optional: Send API request to update helpful count
      // const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
      
    } catch (err) {
      console.error('Error marking as helpful:', err);
      // Revert local state on error
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount - 1 }
          : review
      ));
    }
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

  // Auto-refresh stats when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      fetchReviewStats();
    }
  }, [reviews.length]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ratings & Reviews</h1>
        <p className="text-gray-600">See what clients are saying about our service</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Rating Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                {loading.stats ? (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-gray-300" size={24} />
                    ))}
                  </div>
                ) : (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={i < Math.floor(stats?.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                        size={24} 
                      />
                    ))}
                    <span className="text-3xl font-bold ml-3">
                      {stats?.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600">
                {loading.stats ? (
                  <span className="inline-block h-4 bg-gray-200 rounded w-32 animate-pulse"></span>
                ) : (
                  `Based on ${stats?.totalReviews || 0} reviews`
                )}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="mr-2 text-green-500" size={16} />
              <span>Real customer reviews</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              <span>Posted instantly</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const breakdown = stats?.ratingBreakdown?.[stars];
              const percentage = breakdown?.percentage || 0;
              
              return (
                <div key={stars} className="flex items-center">
                  <div className="flex items-center w-20">
                    <span className="text-sm text-gray-600 w-12">{stars} star{stars !== 1 ? 's' : ''}</span>
                    <Star className="fill-yellow-400 text-yellow-400 ml-2" size={16} />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      {loading.stats ? (
                        <div className="h-full bg-gray-300 rounded-full animate-pulse" style={{ width: '100%' }} />
                      ) : (
                        <div 
                          className="h-full bg-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-16 text-right">
                    {loading.stats ? (
                      <span className="inline-block h-4 bg-gray-200 rounded w-8 animate-pulse"></span>
                    ) : (
                      `${breakdown?.count || 0} (${percentage.toFixed(0)}%)`
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Share Your Experience</h2>
        <p className="text-gray-600 mb-6">Your review will be posted immediately for others to see.</p>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                value={newReview.clientName}
                onChange={(e) => setNewReview({...newReview, clientName: e.target.value})}
                disabled={loading.submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your.email@example.com"
                value={newReview.clientEmail}
                onChange={(e) => setNewReview({...newReview, clientEmail: e.target.value})}
                disabled={loading.submitting}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="What item did you receive?"
              value={newReview.itemName}
              onChange={(e) => setNewReview({...newReview, itemName: e.target.value})}
              disabled={loading.submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({...newReview, rating: star})}
                  disabled={loading.submitting}
                  className="hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  <Star 
                    size={36}
                    className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {newReview.rating === 5 && "Excellent - Loved it!"}
              {newReview.rating === 4 && "Good - Very satisfied"}
              {newReview.rating === 3 && "Average - It was okay"}
              {newReview.rating === 2 && "Poor - Not satisfied"}
              {newReview.rating === 1 && "Terrible - Very disappointed"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell others about your experience... What did you like? What could be improved?"
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              disabled={loading.submitting}
            />
            <p className="text-sm text-gray-500 mt-2">
              Be honest and specific about your experience. Your review helps others make better decisions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              onClick={submitReview}
              disabled={loading.submitting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading.submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Posting Review...
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Post Review Now
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500">
              Your review will appear immediately on this page
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
          <p className="text-gray-600">
            {loading.reviews ? (
              <span className="inline-block h-4 bg-gray-200 rounded w-32 animate-pulse"></span>
            ) : (
              `${stats?.totalReviews || 0} total ${stats?.totalReviews === 1 ? 'review' : 'reviews'}`
            )}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading.reviews ? (
          // Skeleton Loaders
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 rounded mr-1"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{review.clientName}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package size={12} className="mr-1" />
                        <span>{review.itemName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(review.createdAt)}
                </span>
                <button 
                  onClick={() => markAsHelpful(review.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
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
    </div>
  );
}