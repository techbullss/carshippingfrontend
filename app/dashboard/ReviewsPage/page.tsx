"use client";

import { useState, useEffect } from "react";
import { 
  Star, MessageSquare, Calendar, 
  Loader2, AlertCircle, CheckCircle, Lock
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// Types
interface TokenValidationResponse {
  valid: boolean;
  clientName?: string;
  itemName?: string;
  clientEmail?: string;
  orderId?: number;
  message?: string;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState({
    validating: true,
    submitting: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    clientName: string;
    clientEmail: string;
    itemName: string;
    orderId: number;
  } | null>(null);
  
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      const orderId = searchParams.get('orderId');
      const token = searchParams.get('token');
      
      // If no token/orderId, redirect to 404 or home
      if (!orderId || !token) {
        router.push('/404');
        return;
      }

      try {
        setLoading(prev => ({ ...prev, validating: true }));
        
        // Validate token with backend
        const response = await fetch(
          `${API_BASE_URL}/reviews/validate?orderId=${orderId}&token=${token}`,
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        );

        if (!response.ok) {
          throw new Error('Invalid or expired review link');
        }

        const data: TokenValidationResponse = await response.json();
        
        if (data.valid && data.clientName && data.clientEmail && data.itemName) {
          setOrderDetails({
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            itemName: data.itemName,
            orderId: data.orderId || parseInt(orderId)
          });
        } else {
          throw new Error(data.message || 'Invalid review link');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError(err instanceof Error ? err.message : 'This review link is invalid or has expired');
      } finally {
        setLoading(prev => ({ ...prev, validating: false }));
      }
    };

    validateToken();
  }, [searchParams, router]);

  // Submit review
  const submitReview = async () => {
    // Validate
    if (!review.comment.trim()) {
      setError("Please write your review");
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
          orderId: orderDetails?.orderId,
          rating: review.rating,
          comment: review.comment,
          clientName: orderDetails?.clientName,
          itemName: orderDetails?.itemName,
          token: searchParams.get('token')
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setSuccess(true);
      
      // Redirect to thank you page after 3 seconds
      setTimeout(() => {
        router.push('/thank-you');
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Loading state
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

  // Error state (invalid/expired link)
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Invalid Review Link</h1>
          <p className="text-gray-600 mb-6">
            {error || "This review link is invalid or has expired."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please request a new review link or contact support if you believe this is an error.
          </p>
          <button
            onClick={() => router.push('https://f-carshipping.com')}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h1>
          <p className="text-gray-600 mb-2">Your review has been submitted successfully.</p>
          <p className="text-sm text-gray-500">Redirecting you in a few seconds...</p>
        </div>
      </div>
    );
  }

  // Review form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Share Your Experience</h1>
          <p className="text-gray-600">We value your feedback and appreciate you taking the time to review your order.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Order Summary Banner */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <p className="text-white text-sm opacity-90">You're reviewing:</p>
            <p className="text-white font-semibold text-lg">{orderDetails.itemName}</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Success/Error Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Customer Info (Read-only) */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Your Name</p>
                  <p className="font-medium text-gray-800">{orderDetails.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{orderDetails.clientEmail}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Your email is verified from your order</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({...review, rating: star})}
                    disabled={loading.submitting}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={40}
                      className={star <= review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 hover:text-gray-400"
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {review.rating === 5 && "Excellent - Loved it!"}
                {review.rating === 4 && "Good - Very satisfied"}
                {review.rating === 3 && "Average - It was okay"}
                {review.rating === 2 && "Poor - Not satisfied"}
                {review.rating === 1 && "Terrible - Very disappointed"}
              </p>
            </div>

            {/* Review Comment */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Tell us about your experience... What did you like? How was the delivery? Would you recommend us?"
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
                disabled={loading.submitting}
                maxLength={1000}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {review.comment.length}/1000 characters
                </p>
                {!review.comment.trim() && (
                  <p className="text-xs text-red-500">Required</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={submitReview}
              disabled={loading.submitting || !review.comment.trim()}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading.submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting Review...
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Submit Review
                </>
              )}
            </button>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Your review will be posted publicly to help other customers make informed decisions.
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@f-carshipping.com" className="text-green-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}