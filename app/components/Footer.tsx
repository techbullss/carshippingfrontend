"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Sell With Us", path: "/SellWithUs" },
    { name: "About Us", path: "/AboutUs" },
    { name: "Contact Us", path: "/ContactUs" },
    { name: "Login", path: "/Login" },
  ];

  const socials = [
    {
      label: "Facebook",
      icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
      label: "X / Twitter",
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    },
    {
      label: "Instagram",
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />,
    },
    {
      label: "TikTok",
      icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.88-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
    },
  ];

  return (
    <footer ref={footerRef} className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Fabulous red gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, red 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Col 1 – Brand */}
        <div
          className={`flex flex-col gap-5 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Image
            src="/log12.png"
            alt="F-CarShipping Logo"
            width={180}
            height={58}
            className="object-contain"
            priority
          />
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted partner in nationwide vehicle transportation. Safe, reliable,
            and professional service every time.
          </p>

          {/* Social icons - Red touch */}
          <div className="flex items-center gap-3 pt-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 – Quick Links */}
        <div
          className={`transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-500 rounded-full" />
            Quick Links
          </h4>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Business Hours */}
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-500 rounded-full" />
            Business Hours
          </h4>
          <ul className="space-y-4 text-sm">
            {[
              { day: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
              { day: "Saturday", time: "10:00 AM – 4:00 PM" },
              { day: "Sunday", time: "Closed" },
            ].map((h) => (
              <li key={h.day} className="flex justify-between border-b border-gray-800 pb-3 group hover:border-red-500/30 transition-colors">
                <span className="text-gray-400">{h.day}</span>
                <span
                  className={`font-medium ${
                    h.time === "Closed" ? "text-gray-500" : "text-red-400"
                  }`}
                >
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 – Contact */}
        <div
          className={`transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-500 rounded-full" />
            Get In Touch
          </h4>
          <ul className="space-y-5 text-sm">
            {/* Address */}
            <li className="flex gap-3 items-start group">
              <svg className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                210 Estuary House, 196 Ballards Road,<br />
                Dagenham, RM10 9AB, UK
              </span>
            </li>

            {/* Phone */}
            <li className="flex gap-3 items-center group">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+447398145581" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                +44 7398 145581
              </a>
            </li>

            {/* Email */}
            <li className="flex gap-3 items-center group">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@f-carshipping.com" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                info@f-carshipping.com
              </a>
            </li>
          </ul>

          {/* Fabulous CTA button */}
          <div className="mt-6">
            <a
              href="/ContactUs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
            >
              Get in touch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Divider with red accent ── */}
      <div className="relative border-t border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          © {new Date().getFullYear()} F-CarShipping Ltd. All rights reserved.
        </span>

        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((p, i) => (
            <a 
              key={p} 
              href="#" 
              className="hover:text-red-400 transition-colors duration-200 relative group"
            >
              {p}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <span className="text-gray-600 flex items-center gap-1">
          Est. UK 
          <span className="w-1 h-1 bg-red-500 rounded-full mx-1" />
          Nationwide Service
        </span>
      </div>

      {/* Fabulous bottom red glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
    </footer>
  );
}