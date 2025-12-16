"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plane, Package, ShoppingBag, Globe2, Users, 
  Star, ChevronRight, Plus, Filter, Search, 
  MessageSquare, Truck, CheckCircle, Clock, Shield,
  TrendingUp, Loader2
} from "lucide-react";

// Types
interface Product {
  id: number;
  requestId: string;
  itemName: string;
  clientName: string;
  originCountry: string;
  destination: string;
  status: string;
  progress: number; // We'll calculate this based on status
  imageUrls: string[];
  budget: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  itemName: string;
  createdAt: string;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeShipments: number;
  averageRating: number;
  totalReviews: number;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary"; // Update with your actual backend URL

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

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/stats`);
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

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      const productsWithProgress = data.content.map((product: Product) => ({
        ...product,
        progress: calculateProgress(product.status)
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
      const response = await fetch(`${API_BASE_URL}/reviews/public?page=0&size=6`);
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

  // Filter products locally (as backup or for additional filtering)
  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      return product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Handle tab change
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-600 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold mb-6"
              >
                Your Trusted Shipping & Sourcing Partner
              </motion.h1>
              <p className="text-lg md:text-xl font-light mb-8">
                From Europe to East Africa and back – we handle purchasing, logistics, and delivery. 
                See what others are shipping and join our satisfied clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/dashboard/request-item"
                  className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Request New Item
                </a>
                <a
                  href="#products"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"
                >
                  View Active Shipments
                </a>
              </div>
            </div>
            
            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:w-1/3 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-6">Our Impact</h3>
              {loading.stats ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
                      <div className="h-8 bg-white/20 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Active Shipments</span>
                    <span className="text-2xl font-bold">{stats.activeShipments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Items Sourced</span>
                    <span className="text-2xl font-bold">{stats.totalRequests}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Client Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="fill-yellow-400 text-yellow-400" size={20} />
                      <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-white/80">
                  Failed to load statistics
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Active Products/Shipments Section */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Active Shipments & Requests
              </h2>
              <p className="text-gray-600">
                Real-time tracking of items we're currently sourcing and shipping for clients
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items or clients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading.products}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {["all", "sourcing", "in transit", "delivered"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    disabled={loading.products}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${loading.products ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading.products && activeTab === tab ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      tab.charAt(0).toUpperCase() + tab.slice(1)
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading.products ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">⚠️ {error}</div>
              <button
                onClick={() => {
                  setError(null);
                  fetchProducts();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{product.itemName}</h3>
                        <p className="text-gray-600 text-sm">Requested by {product.clientName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        product.status === "IN_TRANSIT" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {formatStatus(product.status)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{product.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${product.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Route Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Globe2 size={14} />
                        <span>{product.originCountry}</span>
                      </div>
                      <ChevronRight size={16} />
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span>{product.destination}</span>
                      </div>
                    </div>
                    
                    {/* Budget and Date */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>${product.budget?.toLocaleString() || "N/A"}</span>
                      </div>
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        ID: {product.requestId}
                      </div>
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No shipments found
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "No shipments match your search criteria"
                  : "There are no active shipments at the moment"}
              </p>
            </div>
          )}

          {/* CTA for New Request */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center border border-green-200">
            <div className="max-w-2xl mx-auto">
              <ShoppingBag className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Need Something Shipped or Sourced?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our clients who trust us with their shipping needs from Europe to East Africa
              </p>
              <a
                href="/dashboard/request-item"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-lg"
              >
                <Plus size={20} />
                Submit Your Item Request
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Ratings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read reviews from clients who have used our shipping and sourcing services
            </p>
          </div>
          
          {loading.reviews ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">{review.clientName}</h4>
                      <p className="text-gray-600 text-sm">{review.itemName}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(review.createdAt)}</span>
                    <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                      <MessageSquare size={14} />
                      Reply
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
            </div>
          )}
          
          {/* Add Review CTA */}
          <div className="text-center mt-12">
            <a
              href="/dashboard/add-review"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-full font-semibold transition"
            >
              <MessageSquare size={20} />
              Leave Your Review
            </a>
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Service
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Payments",
                desc: "Escrow payment system until delivery confirmation"
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Real-time Tracking",
                desc: "Live updates from sourcing to delivery"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Quality Verification",
                desc: "We verify items before purchase & shipping"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "48hr Response",
                desc: "Quick quotes and process initiation"
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Shipping Journey Today
          </h2>
          <p className="text-lg mb-8 font-light">
            Get a free quote for your item. No commitment until you approve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/request-item"
              className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Request Item Now
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Speak to Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}