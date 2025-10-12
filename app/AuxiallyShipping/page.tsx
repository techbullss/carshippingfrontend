"use client";

import { motion } from "framer-motion";
import { Plane, Package, ShoppingBag, Globe2, Users } from "lucide-react";

export default function AuxiliaryShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-500 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Auxiliary Shipping & Sourcing Services
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-3xl mx-auto">
            Whether you’re in Kenya buying from Europe or in Europe shipping from Kenya — 
            we make it simple, secure, and seamless. Let us handle purchasing, packaging, and logistics for you.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            How We Help You
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <ShoppingBag className="w-10 h-10 text-green-600" />,
                title: "Buying on Your Behalf",
                desc: "We help you source and purchase products from trusted European stores or sellers, ensuring quality and authenticity before shipment.",
              },
              {
                icon: <Package className="w-10 h-10 text-green-600" />,
                title: "Personal & Business Shipping",
                desc: "Whether it’s personal items, household goods, or business inventory, we handle packaging, documentation, and customs clearance for you.",
              },
              {
                icon: <Users className="w-10 h-10 text-green-600" />,
                title: "Facilitating Relative Shipments",
                desc: "Have a relative in Europe or Kenya who wants to send items like gifts or local products? We bridge the logistics and make it easy.",
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

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Our Simple Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Request Service", desc: "Tell us what you want to buy or ship and from where." },
              { step: "2", title: "We Connect or Purchase", desc: "We either connect you with the seller or purchase on your behalf." },
              { step: "3", title: "Packaging & Shipping", desc: "We handle collection, packaging, and customs clearance." },
              { step: "4", title: "Delivery or Pickup", desc: "We deliver directly to your preferred address or drop-off station in Kenya or Europe." },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-xl shadow p-6 border-t-4 border-green-500"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {p.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship or Buy with Confidence?
          </h2>
          <p className="text-lg mb-8 font-light">
            Reach out to us today to start your shipping or sourcing request. 
            Our logistics experts are available to guide you every step of the way.
          </p>
          <a
            href="/ContactUs"
            className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Contact Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
