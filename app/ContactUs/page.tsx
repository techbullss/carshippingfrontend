"use client";

import React from "react";
import Head from "next/head";
import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const openDirections = () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=210+Estuary+House+196+Ballards+Road+Dagenham+RM10+9AB+UK",
      "_blank"
    );
  };

  return (
    <>
      <Head>
        <title>Contact Us | FCarShipping</title>
        <meta
          name="description"
          content="Contact FCarShipping for vehicle shipping from the UK to Kenya."
        />
      </Head>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 border border-red-200 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-blue-200 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-100 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-1 mb-8">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span className="w-16 h-[1px] bg-blue-300 mx-2"></span>
              <span className="text-xs tracking-[0.3em] text-green-600/70 uppercase font-light">London Office</span>
              <span className="w-16 h-[1px] bg-blue-300 mx-2"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-light mb-8 tracking-tight text-gray-900"
          >
            Contact
            <span className="text-red-500 block mt-2">FCarShipping</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Our UK office supports vehicle sourcing and export shipping to Kenya.
            Reach out and our team will guide you through the process.
          </motion.p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20">

            {/* CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-light text-gray-900 tracking-tight">
                  Get in Touch
                </h2>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-[2px] bg-gradient-to-r from-red-400 via-blue-400 to-green-400"
                ></motion.div>
              </div>

              <div className="space-y-10">

                {/* ADDRESS */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="group flex gap-5 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Office Address
                    </h3>
                    <p className="text-gray-900 font-medium text-lg leading-relaxed">
                      210 Estuary House, 196 Ballards Road
                    </p>
                    <p className="text-gray-600 text-lg">
                      Dagenham, RM10 9AB
                    </p>
                    <p className="text-gray-600 text-lg">
                      United Kingdom
                    </p>

                    <motion.button
                      onClick={openDirections}
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm mt-4 group"
                    >
                      Get Directions
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </motion.div>

                {/* PHONE */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group flex gap-5 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all duration-300">
                    <Phone className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Phone
                    </h3>
                    <motion.a
                      href="tel:+447398145581"
                      whileHover={{ scale: 1.02 }}
                      className="text-gray-900 font-medium text-lg hover:text-blue-600 transition-colors inline-block"
                    >
                      +44 7398 145581
                    </motion.a>
                  </div>
                </motion.div>

                {/* EMAIL */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group flex gap-5 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-all duration-300">
                    <Mail className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Email
                    </h3>
                    <motion.a
                      href="mailto:info@f-carshipping.com"
                      whileHover={{ scale: 1.02 }}
                      className="text-gray-900 font-medium text-lg hover:text-green-600 transition-colors inline-block"
                    >
                      info@f-carshipping.com
                    </motion.a>
                  </div>
                </motion.div>

                {/* HOURS */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="group flex gap-5"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-blue-50 flex items-center justify-center group-hover:from-red-100 group-hover:to-blue-100 transition-all duration-300">
                    <Clock className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Office Hours
                    </h3>
                    <div className="space-y-1">
                      <motion.p 
                        whileHover={{ x: 3 }}
                        className="text-gray-900"
                      >
                        <span className="font-medium">Monday – Friday:</span>{" "}
                        <span className="text-gray-600">8:00 AM – 6:00 PM</span>
                      </motion.p>
                      <motion.p 
                        whileHover={{ x: 3 }}
                        className="text-gray-900"
                      >
                        <span className="font-medium">Saturday:</span>{" "}
                        <span className="text-gray-600">9:00 AM – 2:00 PM</span>
                      </motion.p>
                      <motion.p 
                        whileHover={{ x: 3 }}
                        className="text-gray-900"
                      >
                        <span className="font-medium">Sunday:</span>{" "}
                        <span className="text-gray-400">Closed</span>
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* QUICK RESPONSE BADGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-gradient-to-r from-red-50 via-blue-50 to-green-50 p-4 rounded-2xl border border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-100 to-green-100 flex items-center justify-center">
                  <Send className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quick response guaranteed</p>
                  <p className="text-xs text-gray-500">We reply within 24 hours</p>
                </div>
              </motion.div>
            </motion.div>

            {/* MAP */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative corners with animation */}
              <motion.div 
                initial={{ opacity: 0, x: -20, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-red-300"
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-green-300"
              ></motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full min-h-[500px]"
              >
                <iframe
                  src="https://www.google.com/maps?q=210+Estuary+House+196+Ballards+Road+Dagenham+RM10+9AB+UK&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "500px" }}
                  loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-lg shadow-lg border border-blue-200"
                >
                  <p className="text-sm font-medium text-gray-900">📍 Visit our office</p>
                  <p className="text-xs text-gray-500">By appointment only</p>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;