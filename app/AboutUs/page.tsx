"use client";

import { motion } from "framer-motion";

export default function AboutUs() {
return (
  <section className="bg-white text-gray-900 overflow-hidden">

    {/* Our Purpose */}
    <div className="max-w-4xl mx-auto px-6 py-28 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="space-y-10"
      >
        <div className="w-16 h-1 bg-yellow-500 mb-6"></div>

        <h2 className="text-4xl md:text-5xl font-light tracking-tight">
          Our <span className="text-yellow-500 font-medium">Purpose</span>
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed">
          We founded this company with one clear mission — to redefine how vehicles are imported into Kenya.
          For too long, the process has felt uncertain and complicated. We exist to simplify it.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Every vehicle we source is carefully inspected, verified, and managed with precision.
          From Europe to Mombasa, we oversee every detail so you can focus on what truly matters —
          driving a car you trust.
        </p>
      </motion.div>
    </div>

    {/* Why Choose Us */}
    <div className="bg-gray-50 border-y border-yellow-100">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-20"
        >
          <div className="text-center">
            <h2 className="text-4xl font-light tracking-tight">
              Why Clients <span className="text-yellow-500 font-medium">Choose Us</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              {
                title: "Authenticity",
                text: "Every vehicle is sourced directly from certified European dealerships, ensuring genuine history, verified mileage, and uncompromised quality."
              },
              {
                title: "Transparency",
                text: "Clear pricing. Full documentation. No hidden surprises. We believe trust is built through honesty."
              },
              {
                title: "End-to-End Care",
                text: "From sourcing and inspection to shipping and customs clearance, we manage every step with professionalism and attention to detail."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="space-y-4 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-lg group-hover:scale-110 transition">
                  0{i + 1}
                </div>

                <h3 className="text-xl font-medium">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

    {/* Process */}
    <div className="max-w-6xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-20"
      >
        <div className="text-center">
          <h2 className="text-4xl font-light tracking-tight">
            A Simple, <span className="text-yellow-500 font-medium">Refined</span> Process
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 text-center">
          {[
            "Select your preferred vehicle",
            "We inspect and verify every detail",
            "Shipping and customs handled professionally",
            "Delivery, ready for Kenyan roads"
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-5xl font-light text-yellow-500">
                0{i + 1}
              </p>
              <p className="text-gray-600">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Closing Statement */}
    <div className="bg-black text-white py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_yellow,_transparent_60%)]"></div>

      <div className="relative max-w-3xl mx-auto text-center px-6">
        <h3 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
          Excellence is not an option.
          <br />
          <span className="text-yellow-500 font-medium">
            It is our standard.
          </span>
        </h3>

        <p className="text-gray-300 text-lg leading-relaxed">
          When you choose us, you choose reliability, discretion, and
          a partner committed to delivering more than just a vehicle —
          but a complete experience.
        </p>
      </div>
    </div>

  </section>
);
}