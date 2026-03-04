"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
    { name: "Sell With Us", path: "/sell" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Login", path: "/login" },
  ];

  const socials = [
    {
      label: "Facebook", color: "#1877f2",
      icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
      label: "X", color: "#fff",
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    },
    {
      label: "Instagram", color: "#e4405f",
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />,
    },
    {
      label: "TikTok", color: "#69c9d0",
      icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.88-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
    },
  ];

  return (
    <>
      <footer className="footer-root" ref={footerRef}>
        <div className="footer-noise" />
        <div className="footer-grid-bg" />
        <div className="footer-diagonal" />

        <div className="footer-inner">
          {/* Brand Row */}
          <div className={`brand-row ${visible ? "visible" : ""}`}>
            <div className="brand-logo-wrap mx-auto mb-6">
              <Image
                src="/lod.png"
                alt="F-CarShipping Logo"
                width={300}  // bigger than header
                height={100} 
                className="object-contain"
                priority
              />
            </div>
            <div className="brand-divider" />
            <div className="brand-tagline">
              <span>Nationwide</span> Vehicle Transportation<br />
              Safe · Reliable · Professional
            </div>
            <div className="brand-cta">
              <button className="btn-primary">Get a Quote</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>

          {/* Columns */}
          <div className="columns-row">
            {/* Navigation */}
            <div className={`col ${visible ? "visible" : ""}`}>
              <div className="col-heading">Navigation</div>
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="nav-link"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.name}
                </a>
              ))}

              <div className="social-row">
                {socials.map((s) => (
                  <button
                    key={s.label}
                    className="social-btn"
                    aria-label={`Follow us on ${s.label}`}
                    title={s.label}
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      {s.icon}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className={`col ${visible ? "visible" : ""}`}>
              <div className="col-heading">Business Hours</div>
              {[
                { day: "Monday — Friday", time: "9:00 AM – 6:00 PM", open: true },
                { day: "Saturday", time: "10:00 AM – 4:00 PM", open: true },
                { day: "Sunday", time: "Closed", open: false },
              ].map((h) => (
                <div key={h.day} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--dark-border)", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-body)", fontWeight: 400 }}>{h.day}</span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "12px", fontWeight: 600, letterSpacing: "1px",
                    color: h.open ? "var(--gold)" : "var(--text-muted)",
                    textTransform: "uppercase"
                  }}>{h.time}</span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className={`col ${visible ? "visible" : ""}`}>
              <div className="col-heading">Get In Touch</div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Registered Office</div>
                  <div className="contact-value">2010 Estuary House, 196 Ballards Road<br />Dagenham, RM10 9AB, UK</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value" style={{ color: "var(--gold-light)", fontWeight: 500 }}>+44 7398 145581</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value" style={{ color: "var(--gold-light)" }}>info@f-carshipping.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bottom-bar">
            <span>© {new Date().getFullYear()} F-CarShipping Ltd. All rights reserved.</span>
            <div className="bottom-links">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(p => (
                <a key={p} href="#" className="bottom-link">{p}</a>
              ))}
            </div>
            <span className="bottom-badge">Est. UK · Nationwide Service</span>
          </div>
        </div>
      </footer>
    </>
  );
}