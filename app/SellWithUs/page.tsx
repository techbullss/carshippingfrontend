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
    <div className="bg-slate-950 text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-emerald-900 via-slate-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Sell With Us — Partner, List & Grow
          </motion.h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Turn your vehicles, containers, and bikes into profit by joining our
            trusted seller network. We connect you to serious buyers locally and
            internationally — while handling visibility, trust, and logistics.
          </p>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16">
            Why Partner With Us
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Handshake className="w-10 h-10 text-emerald-400" />,
                title: "Verified Buyer Network",
                desc: "Access thousands of serious and verified buyers across Kenya and Europe.",
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-emerald-400" />,
                title: "High Market Exposure",
                desc: "Strategic promotion ensures your listings reach serious, qualified buyers.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
                title: "Secure Transactions",
                desc: "Clear documentation, protected communication, and optional escrow services.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-xl hover:shadow-emerald-500/10 transition"
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Sell */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16">
            What You Can List
          </h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              { icon: <Car className="w-8 h-8 text-emerald-400" />, title: "Vehicles" },
              { icon: <Truck className="w-8 h-8 text-emerald-400" />, title: "Commercial Vehicles" },
              { icon: <Bike className="w-8 h-8 text-emerald-400" />, title: "Motorbikes" },
              { icon: <Box className="w-8 h-8 text-emerald-400" />, title: "Containers & Equipment" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl hover:border-emerald-500/40 transition"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-medium">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              { icon: <UserPlus className="w-8 h-8 text-emerald-400" />, title: "Register" },
              { icon: <Upload className="w-8 h-8 text-emerald-400" />, title: "Upload Listings" },
              { icon: <MessageSquare className="w-8 h-8 text-emerald-400" />, title: "Connect" },
              { icon: <CheckCircle className="w-8 h-8 text-emerald-400" />, title: "Close the Deal" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="font-medium">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-28 bg-gradient-to-r from-emerald-800 to-emerald-600 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Become a Verified Seller Today
          </h2>

          <p className="text-lg text-emerald-100 mb-10">
            Start listing your inventory and connect with serious buyers.
          </p>

          <a
            href="/Signup"
            className="inline-block bg-white text-emerald-800 px-10 py-4 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Join as Seller
          </a>
        </div>
      </section>
    </div>
  );
}