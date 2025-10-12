"use client";

import { motion } from "framer-motion";
import {
  Car,
  Truck,
  Bike,
  Box,
  Handshake,
  UserPlus,
  CheckCircle,
  Upload,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Globe2,
} from "lucide-react";

export default function SellWithUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Sell With Us — Partner, List & Grow
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-3xl mx-auto">
            Turn your vehicles, containers, and bikes into profit by joining our
            trusted seller network. We connect you to serious buyers locally and
            internationally — while handling visibility, trust, and logistics.
          </p>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Handshake className="w-10 h-10 text-green-600" />,
                title: "Verified Buyer Network",
                desc: "Access thousands of serious and verified buyers in Kenya and Europe — from private clients to dealerships and logistics firms.",
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-green-600" />,
                title: "High Market Exposure",
                desc: "We promote your listings through our digital channels, marketplace listings, and verified partnerships to ensure faster sales.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
                title: "Secure & Transparent Deals",
                desc: "Every transaction is safeguarded by clear communication, verified documentation, and optional escrow services for peace of mind.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Sell */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            What You Can List With Us
          </h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              {
                icon: <Car className="w-10 h-10 text-green-600" />,
                title: "Vehicles",
                desc: "From sedans to SUVs — reach verified buyers seeking clean and ready-to-import vehicles.",
              },
              {
                icon: <Truck className="w-10 h-10 text-green-600" />,
                title: "Commercial Vehicles",
                desc: "List trucks, vans, and heavy machinery with ease and connect with serious logistics buyers.",
              },
              {
                icon: <Bike className="w-10 h-10 text-green-600" />,
                title: "Motorbikes",
                desc: "New or used motorbikes — showcase them to individuals and delivery companies across regions.",
              },
              {
                icon: <Box className="w-10 h-10 text-green-600" />,
                title: "Containers & Equipment",
                desc: "Sell or lease storage containers, office conversions, and related shipping equipment.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-left"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            How Selling With Us Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <UserPlus className="w-10 h-10 text-green-700" />,
                title: "1. Register as a Seller",
                desc: "Create your seller account, complete verification, and access your seller dashboard to manage listings.",
              },
              {
                icon: <Upload className="w-10 h-10 text-green-700" />,
                title: "2. Upload Listings",
                desc: "Add your vehicles, containers, or bikes with detailed descriptions, prices, and high-quality photos.",
              },
              {
                icon: <MessageSquare className="w-10 h-10 text-green-700" />,
                title: "3. Connect With Buyers",
                desc: "Receive inquiries, chat securely with buyers, and negotiate directly through our messaging platform.",
              },
              {
                icon: <CheckCircle className="w-10 h-10 text-green-700" />,
                title: "4. Finalize the Sale",
                desc: "Close your deal confidently with documentation and optional shipping or inspection support.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Seller Promise */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Our Seller Promise
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
                title: "Transparency in Every Transaction",
                desc: "We ensure honest pricing, verified buyer engagement, and open communication between sellers and clients.",
              },
              {
                icon: <Globe2 className="w-8 h-8 text-green-600" />,
                title: "Cross-Border Selling Made Easy",
                desc: "Whether you're in Kenya or Europe, we simplify international listing, payment, and logistics for a seamless experience.",
              },
              {
                icon: <Handshake className="w-8 h-8 text-green-600" />,
                title: "Partnership That Grows With You",
                desc: "Our mission is to help you scale — from an individual seller to a full dealership with continuous marketing support.",
              },
            ].map((promise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4">{promise.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {promise.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {promise.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a Verified Seller Today
          </h2>
          <p className="text-lg mb-8 font-light">
            Start listing your vehicles, containers, or bikes and reach serious
            buyers. Our onboarding process is simple, secure, and fully online.
          </p>
          <a
            href="/Signup"
            className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Join as Seller
          </a>
        </div>
      </section>
    </div>
  );
}
