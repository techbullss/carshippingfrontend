"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  TrendingUp,
  ShieldCheck,
  UserPlus,
  Upload,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function SellWithUsPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* Intro */}
      <section className="py-28 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-6"
          >
            Sell With Us
          </motion.h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            We are a growing digital marketplace connecting Kenyan vehicle sellers 
            with local and international buyers. Our platform is designed to 
            increase your visibility, generate qualified inquiries, and support 
            structured transactions across domestic and export markets.
          </p>
        </div>
      </section>

      {/* Limited Seller Onboarding */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Limited Seller Onboarding – Soft Launch Phase
          </h2>
          <p className="text-slate-600 leading-relaxed">
            During our soft launch, we are onboarding a limited number of sellers 
            to ensure quality inventory and strong visibility per listing. 
            Early partners benefit from priority exposure, reduced competition, 
            and strategic positioning as the marketplace scales across Kenya 
            and export destinations.
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Why Join Our Marketplace
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe2 className="w-7 h-7" />,
                title: "Local & Export Market Reach",
                desc: "Connect with buyers across Kenya and international markets actively searching for vehicles and equipment.",
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                title: "High-Intent Buyer Traffic",
                desc: "Our structured listings and search system attract serious buyers, improving inquiry quality and conversion potential.",
              },
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                title: "Professional & Transparent Framework",
                desc: "We provide controlled communication and documentation workflows to support secure transactions.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-slate-200 rounded-xl p-10"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Built for Professional Dealers & Exporters
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our platform is developed by a team focused on structured digital commerce, 
            compliance awareness, and cross-border vehicle transactions. 
            We understand the documentation, inspection, and logistics requirements 
            involved in local and export sales, and we are building a marketplace 
            aligned with those standards.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-16">
            How Selling Works
          </h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              {
                icon: <UserPlus className="w-6 h-6" />,
                title: "Apply as Seller",
                desc: "Submit your application during our limited onboarding phase.",
              },
              {
                icon: <Upload className="w-6 h-6" />,
                title: "List Inventory",
                desc: "Upload full vehicle specifications, pricing, and images.",
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Receive Qualified Inquiries",
                desc: "Engage directly with local and export buyers.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Complete Transaction",
                desc: "Finalize deals through structured communication workflows.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-slate-200 p-8 rounded-xl"
              >
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller FAQ */}
      <section className="py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Seller Frequently Asked Questions
          </h2>

          <div className="space-y-10 text-slate-700">

            <div>
              <h3 className="font-semibold mb-2">
                What are the commission or listing fees?
              </h3>
              <p className="text-sm text-slate-600">
                During our soft launch phase, selected sellers may benefit from
                promotional listing structures. Commission or service terms are
                communicated transparently upon onboarding.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Are sellers verified?
              </h3>
              <p className="text-sm text-slate-600">
                Yes. We review seller applications to maintain quality inventory
                and build marketplace trust for both local and export buyers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Can I sell for export?
              </h3>
              <p className="text-sm text-slate-600">
                Yes. Our platform is designed to support cross-border vehicle
                transactions, including structured communication between sellers
                and international buyers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">
            Apply for Early Seller Access
          </h2>

          <p className="text-slate-600 mb-10 leading-relaxed">
            Join during our limited onboarding phase and position your inventory 
            strategically as we expand across Kenya and international markets.
          </p>

          <a
            href="/Signup"
            className="inline-block bg-slate-900 text-white px-10 py-4 rounded-lg font-medium hover:opacity-90 transition"
          >
            Apply as Seller
          </a>
        </div>
      </section>

    </div>
  );
}