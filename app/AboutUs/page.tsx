"use client";

import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="bg-white text-gray-900">

      

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <h2 className="text-3xl font-light">Our Purpose</h2>

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

      {/* What Makes Us Different */}
      <div className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-16"
          >
            <h2 className="text-3xl font-light text-center">
              Why Clients Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-16 text-center">
              <div>
                <h3 className="text-xl font-medium mb-4">
                  Authenticity
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every vehicle is sourced directly from certified European dealerships,
                  ensuring genuine history, verified mileage, and uncompromised quality.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">
                  Transparency
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Clear pricing. Full documentation. No hidden surprises.
                  We believe trust is built through honesty.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">
                  End-to-End Care
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  From sourcing and inspection to shipping and customs clearance,
                  we manage every step with professionalism and attention to detail.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Process */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          <h2 className="text-3xl font-light text-center">
            A Simple, Refined Process
          </h2>

          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl font-light mb-4">01</p>
              <p className="text-gray-600">Select your preferred vehicle</p>
            </div>

            <div>
              <p className="text-4xl font-light mb-4">02</p>
              <p className="text-gray-600">We inspect and verify every detail</p>
            </div>

            <div>
              <p className="text-4xl font-light mb-4">03</p>
              <p className="text-gray-600">Shipping and customs handled professionally</p>
            </div>

            <div>
              <p className="text-4xl font-light mb-4">04</p>
              <p className="text-gray-600">Delivery, ready for Kenyan roads</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Closing Statement */}
      <div className="bg-black text-white py-24">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-light mb-6">
            Excellence is not an option.
            <br />
            It is our standard.
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