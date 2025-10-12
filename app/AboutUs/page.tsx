"use client";

import { FaCar, FaGlobe, FaShieldAlt, FaShippingFast, FaHandshake } from "react-icons/fa";
import { CheckBadgeIcon, RocketLaunchIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 via-emerald-700 to-green-700 text-white py-24">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Redefining Vehicle Imports in Kenya
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-3xl mx-auto">
            Authentic European vehicles, transparent import processes, and unmatched reliability — bringing luxury and performance closer to Kenyan roads.
          </p>
        </div>
      </div>

      {/* Purpose & Difference */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-10 shadow-md border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <FaCar className="text-green-600 mr-3" /> Our Purpose
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To transform how Kenyans import vehicles by offering <strong>authentic European quality</strong>,
            full transparency, and professional after-sales care — making each purchase seamless, secure, and satisfying.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-10 shadow-md border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <FaGlobe className="text-blue-600 mr-3" /> Why Choose Us
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <FaShieldAlt className="text-green-500 mt-1 mr-3" />
              <span><strong>Certified Imports:</strong> Every car undergoes over 30 safety and performance checks.</span>
            </li>
            <li className="flex items-start">
              <FaShippingFast className="text-green-500 mt-1 mr-3" />
              <span><strong>End-to-End Logistics:</strong> We manage everything — from sourcing to customs clearance.</span>
            </li>
            <li className="flex items-start">
              <FaHandshake className="text-green-500 mt-1 mr-3" />
              <span><strong>Dedicated Local Support:</strong> Reliable post-sale service through our Kenyan partners.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Brands & Quality Section */}
      <div className="bg-gradient-to-b from-gray-100 via-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              European Excellence, Delivered
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            We work directly with leading manufacturers and certified dealerships across Europe — ensuring you get genuine, top-condition vehicles every time.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Quality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-10 shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <CheckBadgeIcon className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unmatched Quality</h3>
              <p className="text-gray-600">
                Every vehicle passes a detailed inspection before shipment — guaranteeing performance and safety.
              </p>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl p-10 shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <ShieldCheckIcon className="w-12 h-12 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Expertise</h3>
              <p className="text-gray-600">
                Over 30 years of experience importing and managing European vehicles — your trust is our legacy.
              </p>
            </motion.div>

            {/* Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl p-10 shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <RocketLaunchIcon className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast, Global Delivery</h3>
              <p className="text-gray-600">
                From Europe to Kenya — our logistics ensure safe, timely, and trackable delivery of every vehicle.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Import Process */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">
          Simple. Transparent. <span className="text-green-600">Step by Step.</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Choose", desc: "Pick your dream car from Europe’s finest." },
            { step: "2", title: "Verify", desc: "We handle full inspection & certification." },
            { step: "3", title: "Ship", desc: "Logistics, insurance, and customs — done." },
            { step: "4", title: "Drive", desc: "We deliver your car ready for Kenyan roads." },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-md rounded-2xl p-8 border border-gray-100"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700 text-white text-center py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your European Import Journey Today
          </h3>
          <p className="text-lg mb-8 font-light">
            From luxury sedans to rugged SUVs — we make your dream car a reality with unmatched quality, trust, and speed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-8 py-4 rounded-xl font-semibold bg-white text-green-700 hover:bg-gray-100 shadow-lg transition">
              View Cars
            </button>
            <button className="px-8 py-4 rounded-xl font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-700 transition">
              Request Import Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
