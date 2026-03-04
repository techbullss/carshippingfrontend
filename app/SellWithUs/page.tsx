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
  ChevronDown
} from "lucide-react";

export default function SellWithUsPage() {

  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "What are the commission or listing fees?",
      a: "During our soft launch phase, selected sellers benefit from early access listing opportunities. Commission or service structures are communicated transparently during onboarding."
    },
    {
      q: "Are sellers verified?",
      a: "Yes. Seller verification helps maintain marketplace quality and ensures buyers interact with legitimate inventory providers."
    },
    {
      q: "Can I sell to international buyers?",
      a: "Yes. Our marketplace is designed to support cross-border vehicle sales and connect sellers with export buyers."
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* HERO */}
      <section className="relative py-32 border-b border-slate-200">

        <div className="max-w-6xl mx-auto px-6">

          <div className="flex justify-center mb-6">
            <span className="text-sm tracking-widest uppercase text-slate-500">
              Seller Marketplace
            </span>
          </div>

          <h1 className="text-center text-5xl md:text-6xl font-semibold tracking-tight mb-8">
            Sell With Us
          </h1>

          <p className="text-center max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed mb-10">
            Join a growing digital marketplace connecting Kenyan vehicle sellers
            with serious local and international buyers. Gain visibility,
            attract qualified inquiries, and position your inventory for a
            wider market reach.
          </p>

          {/* TOP CTA */}
          <div className="flex justify-center">
            <a
              href="/Signup"
              className="px-10 py-4 rounded-xl bg-slate-900 text-white font-medium shadow-lg hover:shadow-xl transition"
            >
              Sell With Us
            </a>
          </div>

        </div>
      </section>


      {/* LIMITED ONBOARDING */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold mb-6">
            Limited Seller Onboarding
          </h2>

          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto">
            During our soft launch phase, we are onboarding a limited number of
            sellers to maintain high inventory quality and strong listing
            visibility. Early sellers benefit from priority exposure and reduced
            competition as the marketplace expands.
          </p>

        </div>

      </section>


      {/* BENEFITS */}
      <section className="py-28">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center mb-20">
            Why Sellers Join Our Platform
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                icon: <Globe2 className="w-7 h-7" />,
                title: "Expanded Market Reach",
                desc: "Reach buyers searching locally and internationally for vehicles, equipment, and commercial inventory."
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                title: "High Intent Buyers",
                desc: "Our structured search system attracts serious buyers actively looking for specific inventory."
              },
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                title: "Professional Transactions",
                desc: "Secure communication channels help create transparent and structured deal processes."
              }
            ].map((item, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
              >

                <div className="mb-5">{item.icon}</div>

                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="py-28 bg-slate-50 border-y border-slate-200">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center mb-20">
            How Selling Works
          </h2>

          <div className="grid md:grid-cols-4 gap-10">

            {[
              { icon: <UserPlus className="w-6 h-6" />, title: "Create Account" },
              { icon: <Upload className="w-6 h-6" />, title: "List Inventory" },
              { icon: <MessageSquare className="w-6 h-6" />, title: "Receive Inquiries" },
              { icon: <CheckCircle className="w-6 h-6" />, title: "Complete Sale" }
            ].map((step, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm"
              >

                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>

                <h3 className="font-semibold">
                  {step.title}
                </h3>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* PREMIUM FAQ */}
      <section className="py-28">

        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center mb-16">
            Seller FAQ
          </h2>

          <div className="space-y-4">

            {faqs.map((faq, i) => (

              <div
                key={i}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >

                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >

                  <span className="font-medium">
                    {faq.q}
                  </span>

                  <ChevronDown
                    className={`transition ${open === i ? "rotate-180" : ""}`}
                  />

                </button>

                {open === i && (

                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="py-28 border-t border-slate-200 text-center">

        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-4xl font-semibold mb-6">
            Become an Early Seller
          </h2>

          <p className="text-slate-600 mb-10">
            Join our marketplace during the soft launch phase and position your
            inventory for maximum visibility as the platform grows.
          </p>

          <a
            href="/Signup"
            className="px-12 py-5 rounded-xl bg-slate-900 text-white font-medium shadow-lg hover:shadow-xl transition"
          >
            Start Selling
          </a>

        </div>

      </section>

    </div>
  );
}