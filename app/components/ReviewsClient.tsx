"use client";

import { useState, useEffect } from "react";
import { 
  Star, ThumbsUp, MessageSquare, Calendar, 
  Loader2, AlertCircle, TrendingUp,
  ChevronLeft, ChevronRight, User, Package,
  Shield, CheckCircle, Lock, ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";

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

interface TokenValidationResponse {
  valid: boolean;
  clientName?: string;
  clientEmail?: string;
  itemName?: string;
  orderId?: number;
  message?: string;
}

interface ReviewsClientProps {
  token?: string;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function ReviewsClient({ token: propToken }: ReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState({
    reviews: true,
    stats: true,
    submitting: false,
    validating: true
  });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const router = useRouter();
  const [newReview, setNewReview] = useState({
    clientName: "",
    clientEmail: "",
    itemName: "",
    rating: 5,
    comment: "",
  });

  // Extract token from URL or use prop
  useEffect(() => {
    if (propToken) {
      setToken(propToken);
    } else {
      // For backward compatibility with old links
      const path = window.location.pathname;
      const tokenFromUrl = path.split('/Reviews/')[1];
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
      } else {
        // No token found, redirect to home
        router.push('/');
      }
    }
  }, [propToken, router]);

  // Validate token when available
  useEffect(() => {
    if (!token) return;
    
    const validateAccess = async () => {
      try {
        setLoading(prev => ({ ...prev, validating: true }));

        const response = await fetch(
          `${API_BASE_URL}/reviews/validate?token=${token}`,
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        );

        if (!response.ok) {
          throw new Error('Invalid or expired review link');
        }

        const data: TokenValidationResponse = await response.json();
        
        if (data.valid) {
          setIsValidAccess(true);
          setOrderId(data.orderId || null);
          
          // Auto-populate form from response
          setNewReview({
            clientName: data.clientName || "",
            clientEmail: data.clientEmail || "",
            itemName: data.itemName || "",
            rating: 5,
            comment: "",
          });
          setAutoFilled(true);
          
          // Fetch public reviews
          fetchReviews();
          fetchReviewStats();
        } else {
          setError(data.message || 'Invalid review link');
        }
      } catch (err) {
        console.error('Validation error:', err);
        setError('This review link is invalid or has expired. Please request a new review link.');
      } finally {
        setLoading(prev => ({ ...prev, validating: false }));
      }
    };

    validateAccess();
  }, [token]);

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
      const response = await fetch(`${API_BASE_URL}/reviews/from-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: newReview.clientName,
          clientEmail: newReview.clientEmail,
          itemName: newReview.itemName,
          rating: newReview.rating,
          comment: newReview.comment,
          token: token // Send token for validation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const savedReview = await response.json();
      
      // Add to local state immediately
      setReviews(prev => [savedReview, ...prev]);
      
      // Mark as submitted
      setReviewSubmitted(true);
      
      // Reset form but keep auto-filled fields
      setNewReview(prev => ({
        ...prev,
        comment: "",
        rating: 5
      }));
      
      // Refresh stats
      fetchReviewStats();
      
      // Scroll to thank you message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
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
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ));

      await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include',
      });
      
    } catch (err) {
      console.error('Error marking as helpful:', err);
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

  // Show loading while validating
  if (loading.validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validating your review link...</p>
        </div>
      </div>
    );
  }

  // Show error if not valid
  if (!isValidAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Invalid Review Link</h1>
          <p className="text-gray-600 mb-4">
            {error || "This review link is invalid or has expired."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you received an email asking for a review, please click the link in that email. 
            Each link can only be used once.
          </p>
          <button
            onClick={() => window.location.href = 'https://f-carshipping.com'}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show success message after review submission
  if (reviewSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Thank You! 🎉</h1>
          <p className="text-gray-600 mb-4">
            Your review has been submitted successfully!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your feedback helps us improve our service and helps other customers make informed decisions.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = 'https://f-carshipping.com'}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => {
                setReviewSubmitted(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h1>
          <p className="text-gray-600">See what others are saying about our service</p>
        </div>

        {/* Auto-filled notification */}
        {autoFilled && !reviewSubmitted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
            <span>Your information has been pre-filled from your order. Thank you for taking the time to share your experience!</span>
          </div>
        )}

        {/* Error Alert */}
        {error && !reviewSubmitted && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900 font-medium"
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
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="mr-2 text-green-500" size={16} />
                <span>Verified orders only</span>
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-2 border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="Enter your full name"
                  value={newReview.clientName}
                  onChange={(e) => setNewReview({...newReview, clientName: e.target.value})}
                  disabled={loading.submitting}
                />
                {autoFilled && (
                  <p className="text-xs text-gray-500 mt-1">✓ Auto-filled from your order</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="your.email@example.com"
                  value={newReview.clientEmail}
                  onChange={(e) => setNewReview({...newReview, clientEmail: e.target.value})}
                  disabled={loading.submitting}
                />
                {autoFilled && (
                  <p className="text-xs text-gray-500 mt-1">✓ Auto-filled from your order</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item You Purchased *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                placeholder="What item did you receive?"
                value={newReview.itemName}
                onChange={(e) => setNewReview({...newReview, itemName: e.target.value})}
                disabled={loading.submitting}
              />
              {autoFilled && (
                <p className="text-xs text-gray-500 mt-1">✓ Auto-filled from your order</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    disabled={loading.submitting}
                    className="hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    <Star 
                      size={40}
                      className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {newReview.rating === 5 && "🌟 Excellent - I loved it!"}
                {newReview.rating === 4 && "😊 Good - Very satisfied"}
                {newReview.rating === 3 && "👍 Average - It was okay"}
                {newReview.rating === 2 && "😕 Poor - Not satisfied"}
                {newReview.rating === 1 && "😞 Terrible - Very disappointed"}
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
                Be honest and specific. Your review helps others make better decisions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button 
                onClick={submitReview}
                disabled={loading.submitting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
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
                `${stats?.totalReviews || 0} ${stats?.totalReviews === 1 ? 'review' : 'reviews'} shared by our community`
              )}
            </p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {loading.reviews ? (
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
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
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
                  <div className="flex items-center mt-2 md:mt-0">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={18}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(review.createdAt)}
                  </span>
                  <button 
                    onClick={() => markAsHelpful(review.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors hover:bg-gray-50 px-2 py-1 rounded"
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
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index;
                  } else if (page < 3) {
                    pageNum = index;
                  } else if (page > totalPages - 3) {
                    pageNum = totalPages - 5 + index;
                  } else {
                    pageNum = page - 2 + index;
                  }
                  
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm transition ${
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
    </div>
  );
}