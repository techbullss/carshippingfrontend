"use client";

import React from "react";
import Head from "next/head";

const ContactPage = () => {

  const openDirections = () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=2010+Estuary+House+196+Ballards+Road+Dagenham+RM10+9AB+UK",
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
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            Contact <span className="text-amber-400">FCarShipping</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our UK office supports vehicle sourcing and export shipping to Kenya.
            Reach out and our team will guide you through the process.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          {/* CONTACT INFO */}
          <div className="space-y-8">

            <h2 className="text-3xl font-light text-gray-900">
              Get In Touch
            </h2>

            <div className="space-y-6">

              {/* ADDRESS */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Office Address
                  </h3>

                  <p className="text-gray-600">
                    2010 Estuary House, 196 Ballards Road
                  </p>

                  <p className="text-gray-600">
                    Dagenham, RM10 9AB
                  </p>

                  <p className="text-gray-600">
                    United Kingdom
                  </p>

                  <button
                    onClick={openDirections}
                    className="text-amber-500 font-medium text-sm mt-2 hover:underline"
                  >
                    Get Directions
                  </button>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Phone
                  </h3>

                  <a
                    href="tel:+447398145581"
                    className="text-gray-600 hover:text-amber-500"
                  >
                    +44 7398 145581
                  </a>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  ✉️
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Email
                  </h3>

                  <a
                    href="mailto:info@f-carshipping.com"
                    className="text-gray-600 hover:text-amber-500"
                  >
                    info@f-carshipping.com
                  </a>
                </div>
              </div>

              {/* HOURS */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  ⏰
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Office Hours
                  </h3>

                  <p className="text-gray-600">
                    Monday – Friday: 8:00 AM – 6:00 PM
                  </p>

                  <p className="text-gray-600">
                    Saturday: 9:00 AM – 2:00 PM
                  </p>

                  <p className="text-gray-600">
                    Sunday: Closed
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* MAP */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">

            <iframe
              src="https://www.google.com/maps?q=2010+Estuary+House+196+Ballards+Road+Dagenham+RM10+9AB+UK&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-400 py-20">
        <div className="max-w-3xl mx-auto text-center px-6">

          <h3 className="text-3xl font-light text-black mb-4">
            Ready to ship your vehicle?
          </h3>

          <p className="text-black/80 mb-6">
            Our team can help you source, inspect, and ship vehicles from the UK
            directly to Kenya with full documentation.
          </p>

          <a
            href="mailto:info@f-carshipping.com"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Contact Our Team
          </a>

        </div>
      </section>
    </>
  );
};

export default ContactPage;