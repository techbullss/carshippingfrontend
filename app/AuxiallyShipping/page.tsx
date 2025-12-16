"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plane, Package, ShoppingBag, Globe2, Users, 
  Star, ChevronRight, Plus, Filter, Search, 
  MessageSquare, Truck, CheckCircle, Clock, Shield
} from "lucide-react";

// Mock data - replace with API calls
const mockProducts = [
  {
    id: 1,
    name: "Designer Handbag",
    client: "Sarah M.",
    origin: "Italy",
    destination: "Nairobi, Kenya",
    status: "In Transit",
    progress: 75,
    date: "2024-01-15",
    rating: 4.8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    name: "Electronics Bundle",
    client: "John D.",
    origin: "Germany",
    destination: "Mombasa, Kenya",
    status: "Sourcing",
    progress: 40,
    date: "2024-01-18",
    rating: 4.9,
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    name: "Medical Equipment",
    client: "Health Clinic Ltd",
    origin: "UK",
    destination: "Kampala, Uganda",
    status: "Delivered",
    progress: 100,
    date: "2024-01-10",
    rating: 5.0,
    image: "/api/placeholder/300/200",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Michael K.",
    role: "Business Owner",
    comment: "Excellent service! They sourced rare automotive parts from Germany and delivered on time. Highly recommended!",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Grace W.",
    role: "Individual Client",
    comment: "Helped me ship gifts from London to my family in Nairobi. Professional and reliable.",
    rating: 4,
    date: "1 month ago",
  },
];

export default function AuxiliaryShippingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = mockProducts.filter(product => {
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.client.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeTab === "all") return true;
    return product.status.toLowerCase().includes(activeTab.toLowerCase());
  });

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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Active Shipments</span>
                  <span className="text-2xl font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Items Sourced</span>
                  <span className="text-2xl font-bold">156+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Client Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="text-2xl font-bold">4.9</span>
                  </div>
                </div>
              </div>
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
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {["all", "sourcing", "in transit", "delivered"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
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
                      <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 text-sm">Requested by {product.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "Delivered" ? "bg-green-100 text-green-800" :
                      product.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {product.status}
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
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${product.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Route Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Globe2 size={14} />
                      <span>{product.origin}</span>
                    </div>
                    <ChevronRight size={16} />
                    <div className="flex items-center gap-1">
                      <Package size={14} />
                      <span>{product.destination}</span>
                    </div>
                  </div>
                  
                  {/* Rating and Action */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
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
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{testimonial.date}</span>
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
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