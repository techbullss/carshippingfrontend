"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, Package, ShoppingBag, Globe2, Users, 
  Star, ChevronRight, Plus, Filter, Search, 
  MessageSquare, Truck, CheckCircle, Clock, Shield,
  TrendingUp, Loader2, X, Image as ImageIcon, MapPin,
  Calendar, DollarSign, User, Phone, Mail, ArrowRight,
  Heart, Share2, Eye, ThumbsUp, ShoppingCart
} from "lucide-react";
import Image from "next/image";

// Types
interface Product {
  id: number;
  requestId: string;
  itemName: string;
  clientName: string;
  originCountry: string;
  destination: string;
  status: string;
  progress: number;
  imageUrls: string[];
  budget: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  weight?: number;
  dimensions?: string;
  estimatedDelivery?: string;
  category?: string;
}

interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  itemName: string;
  createdAt: string;
  replies?: ReviewReply[];
}

interface ReviewReply {
  id: number;
  adminName: string;
  reply: string;
  createdAt: string;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeShipments: number;
  averageRating: number;
  totalReviews: number;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function AuxiliaryShippingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState({
    products: true,
    reviews: true,
    stats: true
  });
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Review reply states
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Calculate progress based on status
  const calculateProgress = (status: string): number => {
    switch (status.toLowerCase()) {
      case "pending": return 10;
      case "sourcing": return 40;
      case "in_transit": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "in_transit": return "bg-gradient-to-r from-blue-500 to-cyan-600";
      case "sourcing": return "bg-gradient-to-r from-amber-500 to-orange-600";
      default: return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
  };

  // Get status icon
const getStatusIcon = (status: string, size: number = 16) => {
  switch (status.toLowerCase()) {
    case "delivered": return <CheckCircle size={size} />;
    case "in_transit": return <Truck size={size} />;
    case "sourcing": return <ShoppingBag size={size} />;
    default: return <Clock size={size} />;
  }
};

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/stats`, {
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

  // Fetch active shipments/requests
  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const statusMap: Record<string, string> = {
        "all": "",
        "sourcing": "SOURCING",
        "in transit": "IN_TRANSIT",
        "delivered": "DELIVERED"
      };

      const status = statusMap[activeTab] || "";
      const search = searchQuery || "";
      
      let url = `${API_BASE_URL}/requests?page=0&size=10`;
      if (status) url += `&status=${status}`;
      if (search) url += `&search=${search}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      const productsWithProgress = data.content.map((product: Product) => ({
        ...product,
        progress: calculateProgress(product.status),
        imageUrls: product.imageUrls || [
          "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
      }));
      setProducts(productsWithProgress);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load active shipments');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(prev => ({ ...prev, reviews: true }));
      const response = await fetch(`${API_BASE_URL}/reviews/public?page=0&size=6`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.content);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
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
      
      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                replies: [
                  ...(review.replies || []),
                  {
                    id: Date.now(),
                    adminName: "Admin",
                    reply: replyText,
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : review
        )
      );
      
      setReplyText("");
      setReplyingToReview(null);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchReviews();
  }, []);

  // Refetch products when filter changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab, searchQuery]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProducts();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProducts();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  // Open product modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedImageIndex(0);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Global Shipping &<br />
                <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Sourcing Made Easy
                </span>
              </motion.h1>
              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Seamlessly connect Europe to East Africa. From product sourcing to doorstep delivery, 
                we handle everything with transparency and care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/dashboard/request-item"
                  className="group bg-white text-green-700 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                  Request New Item
                </motion.a>
                <motion.a
                  href="#products"
                  className="bg-transparent backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Track Shipments →
                </motion.a>
              </div>
            </div>
            
            {/* Enhanced Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:w-2/5 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">Real-time Dashboard</h3>
              </div>
              
              {loading.stats ? (
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-white/20 rounded-full w-32 animate-pulse"></div>
                      <div className="h-10 bg-white/20 rounded-xl w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-8">
                  {[
                    { label: "Active Shipments", value: stats.activeShipments, icon: Truck, color: "text-cyan-300" },
                    { label: "Total Requests", value: stats.totalRequests, icon: Package, color: "text-emerald-300" },
                    { label: "Pending", value: stats.pendingRequests, icon: Clock, color: "text-amber-300" },
                    { label: "Avg Rating", value: stats.averageRating.toFixed(1), icon: Star, color: "text-yellow-300" }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl bg-white/10 ${stat.color}`}>
                            <Icon size={20} />
                          </div>
                          <span className="text-white/80 font-medium">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                          {stat.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  Failed to load statistics
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Active Products/Shipments Section */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Live Shipment Tracking
              </h2>
              <p className="text-gray-600 text-lg">
                Real-time updates on items we're currently handling for our clients
              </p>
            </div>
            
            {/* Enhanced Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items, clients, or destinations..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading.products}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["all", "sourcing", "in transit", "delivered"].map((tab) => {
                  const isActive = activeTab === tab;
                  const Icon = tab === "sourcing" ? ShoppingBag : 
                              tab === "in transit" ? Truck : 
                              tab === "delivered" ? CheckCircle : Package;
                  return (
                    <motion.button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      disabled={loading.products}
                      className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
                        isActive
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      } ${loading.products ? "opacity-50 cursor-not-allowed" : ""}`}
                      whileHover={!loading.products ? { scale: 1.05 } : {}}
                      whileTap={!loading.products ? { scale: 0.95 } : {}}
                    >
                      <Icon size={16} />
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading.products ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 mb-6 text-lg">⚠️ {error}</div>
              <button
                onClick={() => {
                  setError(null);
                  fetchProducts();
                }}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                Retry Loading
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product) => {
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={product.itemName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${getStatusColor(product.status)}`}>
                          {formatStatus(product.status)}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white">
                          {getStatusIcon(product.status, 16)}
                          <span className="text-sm font-medium">Progress: {product.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/30 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getStatusColor(product.status)}`}
                            style={{ width: `${product.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                            {product.itemName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <User size={14} className="text-gray-400" />
                            <span className="text-gray-600 text-sm">Requested by {product.clientName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-700">
                            ${product.budget?.toLocaleString() || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">Budget</div>
                        </div>
                      </div>
                      
                      {/* Route Info */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{product.originCountry}</div>
                          <div className="text-xs text-gray-500">Origin</div>
                        </div>
                        <div className="relative">
                          <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                          <Plane className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-green-600" size={16} />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{product.destination}</div>
                          <div className="text-xs text-gray-500">Destination</div>
                        </div>
                      </div>
                      
                      {/* Quick Info */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-gray-600">{formatDate(product.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ImageIcon size={14} className="text-gray-400" />
                          <span className="text-gray-600">{product.imageUrls?.length || 2} images</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 font-mono">
                          ID: {product.requestId}
                        </div>
                        <motion.button
                          onClick={() => openProductModal(product)}
                          className="group/btn bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={16} />
                          View Details
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-medium text-gray-700 mb-3">
                No shipments found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {searchQuery 
                  ? "We couldn't find any shipments matching your search. Try different keywords."
                  : "There are no active shipments at the moment. Check back soon!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Enhanced CTA for New Request */}
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-10 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Need Something From Europe?
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether it's electronics, fashion, or specialty items, we'll source and ship it securely to your doorstep in East Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/dashboard/request-item"
                  className="group bg-white text-green-700 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                  Request Item Now
                </motion.a>
                <motion.a
                  href="#reviews"
                  className="bg-transparent backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See Success Stories
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials & Ratings */}
      <section id="reviews" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="font-semibold">{stats?.averageRating.toFixed(1)} Average Rating</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Read what our clients say about their shipping experience with us
            </p>
          </div>
          
          {loading.reviews ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 animate-pulse">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{review.clientName}</h4>
                        <p className="text-gray-600 text-sm">{review.itemName}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={`ml-1 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg italic">"{review.comment}"</p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ThumbsUp size={16} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Replies Section */}
                  <div className="space-y-4">
                    {review.replies?.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-green-700">{reply.adminName}</span>
                          <span className="text-gray-500 text-sm">• {formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 ml-10">{reply.reply}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Reply Form */}
                  {replyingToReview === review.id ? (
                    <div className="mt-6">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                        rows={3}
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setReplyingToReview(null);
                            setReplyText("");
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitReply(review.id)}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                        >
                          {isSubmittingReply ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MessageSquare size={16} />
                          )}
                          Post Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingToReview(review.id)}
                      className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={18} />
                      Reply to this review
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-medium text-gray-700 mb-3">No reviews yet</h3>
              <p className="text-gray-500 mb-8">Be the first to share your experience!</p>
            </div>
          )}
          
          {/* Enhanced Add Review CTA */}
          <div className="text-center mt-16">
            <motion.a
              href="/dashboard/add-review"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare size={22} />
              Share Your Experience
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Enhanced Features/Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why We're The <span className="text-green-600">Preferred Choice</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                We combine technology with personalized service to deliver an unmatched shipping experience.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "End-to-End Security",
                    desc: "Insurance coverage for all shipments and secure payment processing"
                  },
                  {
                    icon: Truck,
                    title: "Real-time GPS Tracking",
                    desc: "Live location updates from pickup to final delivery"
                  },
                  {
                    icon: CheckCircle,
                    title: "Quality Assurance",
                    desc: "Physical verification of items before shipping"
                  },
                  {
                    icon: Clock,
                    title: "24/7 Support",
                    desc: "Round-the-clock customer service and tracking assistance"
                  }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Stats Visualization */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "98%", label: "On-time Delivery", color: "from-green-500 to-emerald-600" },
                { value: "4.8/5", label: "Customer Rating", color: "from-amber-500 to-orange-600" },
                { value: "24h", label: "Avg Response Time", color: "from-blue-500 to-cyan-600" },
                { value: "50+", label: "Countries Served", color: "from-purple-500 to-pink-600" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-lg"
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.itemName}</h3>
                  <p className="text-gray-600">Request ID: {selectedProduct.requestId}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-8">
                  {/* Image Gallery */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="h-64 rounded-2xl overflow-hidden mb-4">
                        <img
                          src={selectedProduct.imageUrls?.[selectedImageIndex] || "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                          alt={selectedProduct.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedProduct.imageUrls?.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${
                              selectedImageIndex === index ? "border-green-500" : "border-gray-200"
                            }`}
                          >
                            <img
                              src={url}
                              alt={`${selectedProduct.itemName} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div>
                      <h4 className="text-xl font-bold mb-6">Order Details</h4>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Client</div>
                            <div className="font-semibold">{selectedProduct.clientName}</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProduct.status)} text-white`}>
                                {getStatusIcon(selectedProduct.status, 12)}
                                {formatStatus(selectedProduct.status)}
                              </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="font-bold text-lg">{selectedProduct.originCountry}</div>
                              <div className="text-sm text-gray-600">Origin</div>
                            </div>
                            <Plane className="text-green-600" size={24} />
                            <div className="text-center">
                              <div className="font-bold text-lg">{selectedProduct.destination}</div>
                              <div className="text-sm text-gray-600">Destination</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Budget</div>
                            <div className="text-2xl font-bold text-green-600">
                              ${selectedProduct.budget?.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Request Date</div>
                            <div className="font-semibold">{formatDate(selectedProduct.createdAt)}</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Shipping Progress</span>
                            <span className="font-bold">{selectedProduct.progress}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStatusColor(selectedProduct.status)}`}
                              style={{ width: `${selectedProduct.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Sourcing</span>
                            <span>Processing</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-xl font-bold mb-4">Additional Information</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">Estimated Delivery</div>
                        <div className="font-semibold">
                          {selectedProduct.estimatedDelivery || "Calculating..."}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">Category</div>
                        <div className="font-semibold">
                          {selectedProduct.category || "General Goods"}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                        <div className="font-semibold">
                          {formatDate(selectedProduct.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                >
                  Close
                </button>
                <a
                  href={`/dashboard/track/${selectedProduct.requestId}`}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                >
                  <Truck size={18} />
                  Track Shipment
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}