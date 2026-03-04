"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  TrendingUp,
  ShieldCheck,
  UserPlus,
  Upload,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Star,
} from "lucide-react";

export default function SellWithUsPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "What are the commission or listing fees?",
      a: "During our soft launch phase, selected sellers benefit from early access listing opportunities. Commission or service structures are communicated transparently during onboarding.",
    },
    {
      q: "Are sellers verified?",
      a: "Yes. Seller verification helps maintain marketplace quality and ensures buyers interact with legitimate inventory providers.",
    },
    {
      q: "Can I sell to international buyers?",
      a: "Yes. Our marketplace is designed to support cross-border vehicle sales and connect sellers with export buyers.",
    },
  ];

  const benefits = [
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Expanded Market Reach",
      desc: "Reach buyers searching locally and internationally for vehicles, equipment, and commercial inventory.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "High Intent Buyers",
      desc: "Our structured search system attracts serious buyers actively looking for specific inventory.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Professional Transactions",
      desc: "Secure communication channels help create transparent and structured deal processes.",
    },
  ];

  const steps = [
    { icon: <UserPlus className="w-5 h-5" />, step: "01", title: "Create Account", desc: "Register and complete your seller profile in minutes." },
    { icon: <Upload className="w-5 h-5" />, step: "02", title: "List Inventory", desc: "Upload vehicle details, photos, and pricing with ease." },
    { icon: <MessageSquare className="w-5 h-5" />, step: "03", title: "Receive Inquiries", desc: "Qualified buyers contact you directly through the platform." },
    { icon: <CheckCircle className="w-5 h-5" />, step: "04", title: "Complete Sale", desc: "Close deals with confidence using our structured process." },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-yellow-500 opacity-5 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-semibold tracking-widest uppercase">
              <Star className="w-3 h-3 fill-yellow-400" />
              Seller Marketplace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-center text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
          >
            Sell Smarter.<br />
            <span className="text-yellow-400">Reach Further.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-12"
          >
            Join a growing digital marketplace connecting vehicle sellers with
            serious local and international buyers. Gain visibility, attract
            qualified inquiries, and position your inventory for a wider market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href="/Signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/30 hover:-translate-y-0.5"
            >
              Start Selling Today
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-20 grid grid-cols-3 gap-px bg-slate-800 rounded-2xl overflow-hidden border border-slate-800"
          >
            {[
              { value: "500+", label: "Active Listings" },
              { value: "12K+", label: "Monthly Buyers" },
              { value: "40+", label: "Export Countries" },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 px-8 py-7 text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIMITED ONBOARDING BANNER ── */}
      <section className="bg-yellow-500">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse flex-shrink-0" />
            <p className="text-slate-900 text-sm font-semibold">
              <span className="font-black">Limited Onboarding Open</span> — We are accepting a select number of sellers during our soft launch phase.
            </p>
          </div>
          <a
            href="/Signup"
            className="flex-shrink-0 text-xs font-black uppercase tracking-widest text-slate-900 underline underline-offset-2 hover:no-underline transition"
          >
            Apply Now →
          </a>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3 block">Why Choose Us</span>
            <h2 className="text-4xl font-bold tracking-tight">Why Sellers Join Our Platform</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-yellow-50 group-hover:text-yellow-600 flex items-center justify-center mb-6 transition-colors duration-300 text-slate-700">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 bg-slate-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3 block">The Process</span>
            <h2 className="text-4xl font-bold tracking-tight">How Selling Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-slate-800 z-0" style={{ width: "calc(100% - 64px)", left: "calc(50% + 32px)" }} />
                )}

                <div className="relative z-10 bg-slate-900 border border-slate-800 group-hover:border-yellow-500/50 rounded-2xl p-7 text-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-yellow-500/5">
                  <div className="text-xs font-black text-yellow-500 tracking-widest mb-4 uppercase">{step.step}</div>
                  <div className="w-11 h-11 rounded-full bg-slate-800 group-hover:bg-yellow-500/10 flex items-center justify-center mx-auto mb-5 text-slate-400 group-hover:text-yellow-400 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3 block">FAQ</span>
            <h2 className="text-4xl font-bold tracking-tight">Seller Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                  open === i ? "border-yellow-400 shadow-md shadow-yellow-50" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      open === i ? "rotate-180 text-yellow-500" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={open === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-yellow-500 opacity-5 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-8">
              <Star className="w-3 h-3 fill-yellow-400" />
              Early Access
            </span>

            <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Become an<br />
              <span className="text-yellow-400">Early Seller</span>
            </h2>

            <p className="text-slate-400 mb-10 leading-relaxed">
              Join our marketplace during the soft launch phase and position your
              inventory for maximum visibility as the platform grows.
            </p>

            <a
              href="/Signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-sm rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Selling
              <ArrowRight className="w-4 h-4" />
            </a>

            <p className="mt-6 text-xs text-slate-600">
              No credit card required · Free to apply · Limited spots available
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}