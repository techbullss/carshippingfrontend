"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Filter, Calendar } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      client: "Sarah Johnson",
      item: "Designer Handbag",
      rating: 5,
      comment: "Excellent service! The item arrived in perfect condition.",
      date: "2024-01-15",
      helpful: 12,
    },
    // Add more reviews
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    itemId: "",
  });

  const submitReview = () => {
    // Handle review submission
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ratings & Reviews</h1>
        <p className="text-gray-600">See what clients are saying about our service</p>
      </div>

      {/* Overall Rating */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-yellow-400 text-yellow-400" size={24} />
              ))}
              <span className="text-3xl font-bold ml-3">4.9</span>
            </div>
            <p className="text-gray-600">Based on 156 reviews</p>
          </div>
          
          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center">
                <span className="w-12 text-sm">{stars} stars</span>
                <div className="w-48 h-2 bg-gray-200 rounded-full mx-2">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '80%' }} />
                </div>
                <span className="text-sm text-gray-600">80%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Share Your Experience</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({...newReview, rating: star})}
                >
                  <Star 
                    size={32}
                    className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block mb-2">Your Review</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Tell others about your experience..."
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            />
          </div>
          
          <button 
            onClick={submitReview}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold">{review.client}</h3>
                <p className="text-gray-600 text-sm">{review.item}</p>
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
            <p className="text-gray-700 mb-3">{review.comment}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{review.date}</span>
              <button className="flex items-center gap-1">
                <ThumbsUp size={16} />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}