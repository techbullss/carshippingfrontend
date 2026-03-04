"use client";

import { useState } from "react";
import Image from "next/image";
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
      <section className="relative overflow-hidden text-black">
  <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-36 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    
    {/* Left: Text Content */}
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-start mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold tracking-widest uppercase">
          <Star className="w-3 h-3" />
          Seller Marketplace
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
      >
        Sell Smarter.<br />
        <span className="text-yellow-500">Reach Further.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-700 mb-8"
      >
        Join a growing digital marketplace connecting vehicle sellers with
        serious local and international buyers. Gain visibility, attract
        qualified inquiries, and position your inventory for a wider market.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <a
          href="/Signup"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
        >
          Start Selling Today
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-yellow-500 hover:border-yellow-400 text-yellow-500 hover:text-gray-900 font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          See How It Works
        </a>
      </motion.div>
    </div>

    {/* Right: Image */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex justify-center md:justify-end"
    >
      <Image
        src="/sellwithus.jpg" // replace with your image path
        alt="Vehicle Marketplace"
        width={500}
        height={400}
        className="rounded-3xl shadow-2xl object-cover"
      />
    </motion.div>
  </div>

  
</section>

      

      {/* ── BENEFITS ── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Why Choose Us</span>
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
                className="group relative p-8 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-6 transition-colors duration-300 text-slate-700">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
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
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block">The Process</span>
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
                className="group"
              >
                <div className="bg-slate-900 border border-slate-800 group-hover:border-slate-600 rounded-2xl p-7 text-center transition-all duration-300 group-hover:shadow-xl">
                  <div className="text-xs font-black text-slate-500 tracking-widest mb-4 uppercase">{step.step}</div>
                  <div className="w-11 h-11 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center mx-auto mb-5 text-slate-400 group-hover:text-white transition-colors duration-300">
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
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">FAQ</span>
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
                  open === i ? "border-slate-900 shadow-md" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      open === i ? "rotate-180 text-slate-900" : ""
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
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold tracking-widest uppercase mb-8">
              <Star className="w-3 h-3" />
              Early Access
            </span>

            <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Become an<br />
              <span className="text-slate-300">Early Seller</span>
            </h2>

            <p className="text-slate-400 mb-10 leading-relaxed">
              Join our marketplace during the soft launch phase and position your
              inventory for maximum visibility as the platform grows.
            </p>

            <a
              href="/Signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-slate-100 text-slate-900 font-black text-sm rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
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