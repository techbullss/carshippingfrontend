"use client";
import React, { useState } from 'react';
import Head from 'next/head';

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'motorcycles' | 'containers' | 'auxiliary'>('vehicles');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = {
    vehicles: {
      title: "UK Vehicles for Export",
      description: "We source quality vehicles from across the UK, handle all export formalities, and ship directly to Kenya.",
      features: [
        "Thoroughly inspected and serviced before shipping",
        "All paperwork handled including export certification",
        "Competitive pricing with no hidden costs",
        "Right-hand drive vehicles compliant with Kenyan regulations",
        "Full ownership transfer documentation"
      ],
      types: ["Family Sedans", "SUVs & 4x4s", "Vans & Pickups", "Luxury Vehicles", "Commercial Trucks"]
    },
    motorcycles: {
      title: "UK Motorcycles for Export",
      description: "Premium motorcycles sourced from the UK, ready for shipping to Kenyan buyers.",
      features: [
        "Comprehensive mechanical inspection before purchase",
        "Professional crating for safe ocean transport",
        "All export documentation prepared for you",
        "Competitive UK market prices",
        "Wide selection of makes and models"
      ],
      types: ["Adventure Touring", "Sport Bikes", "Cruisers", "Scooters", "Vintage Motorcycles"]
    },
    containers: {
      title: "Container Sales & Shipping",
      description: "We source and ship quality 20ft and 40ft containers from the UK to Kenya.",
      features: [
        "New and used containers available",
        "Wind and watertight certification",
        "Modification services available (doors, windows, ventilation)",
        "Both standard and high cube containers",
        "Direct shipping to Mombasa port"
      ],
      types: ["20ft Standard", "40ft Standard", "40ft High Cube", "Refrigerated", "Open Top"]
    },
    auxiliary: {
  title: "Vehicle & Motorcycle Spare Parts",
  description:
    "High-quality spare parts and auxiliary services to support the import of vehicles and motorbikes from the UK to Kenya.",
  features: [
    "Wide selection of genuine and aftermarket parts",
    "Customs clearance assistance",
    "Local transportation arrangements",
    "Insurance options for your shipment",
    "Pre-shipment inspections",
    "Post-arrival support"
  ],
  types: [
    "Vehicle Spare Parts",
    "Motorcycle Spare Parts",
    "Customs Clearance",
    "Local Delivery",
    "Insurance",
    "Inspections",
    "Consultation"
  ]
}

  };

  const processSteps = [
    {
      step: 1,
      title: "Browse Inventory",
      description: "Explore our current selection of available vehicles, motorcycles, and containers in the UK."
    },
    {
      step: 2,
      title: "Select & Reserve",
      description: "Choose your item and place a reservation deposit to secure it while we prepare shipping."
    },
    {
      step: 3,
      title: "Purchase & Documentation",
      description: "We complete the UK purchase and handle all export documentation on your behalf."
    },
    {
      step: 4,
      title: "Shipping Preparation",
      description: "Your item is professionally prepared for ocean freight with comprehensive insurance."
    },
    {
      step: 5,
      title: "Customs & Delivery",
      description: "We manage Kenyan customs clearance and arrange delivery to your specified location."
    }
  ];

  const requirements = [
    "Copy of National ID or Passport",
    "Copy of KRA PIN certificate",
    "Import declaration form (we assist with this)",
    "Duty payment (we provide exact calculations in advance)",
    "Insurance cover note (included in our service)"
  ];

  return (
    <>
     
     

      {/* Services Section */}
      <section className="py-2 bg-gray-50">
        <div className="container mx-auto px-2">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Sourcing Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We find quality products in the UK market and handle the complete export process to Kenya</p>
          </div>

          {/* Service Tabs */}
          <div className="">
            <div className="flex flex-wrap justify-center mb-8 gap-2">
              {Object.keys(services).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'vehicles' | 'motorcycles' | 'containers' | 'auxiliary')}
                  className={`px-6 py-3 font-medium rounded-lg transition-colors ${activeTab === key ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}`}
                >
                  {services[key as keyof typeof services].title}
                </button>
              ))}
            </div>

            {/* Service Content */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{services[activeTab].title}</h3>
              <p className="text-gray-600 mb-6">{services[activeTab].description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Our Full Service Includes</h4>
                  <ul className="space-y-3">
                    {services[activeTab].features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Categories Available</h4>
                  <div className="flex flex-wrap gap-2">
                    {services[activeTab].types.map((type, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Pricing Structure</h4>
                    <p className="text-sm text-blue-700">
                      All prices include: UK purchase price, mechanical inspection, export documentation, ocean freight, insurance, Kenyan customs clearance, and delivery within Kenya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Sourcing Service Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We make importing from the UK simple and hassle-free</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-1/2 transform -translate-x-1/2 h-1 w-4/5 bg-blue-200"></div>
              
              {processSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-xl font-bold text-blue-800">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-blue-800 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Sourcing Service?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { title: "UK Market Expertise", desc: "We know the UK market and find the best deals" },
              { title: "Quality Assurance", desc: "All items thoroughly inspected before purchase" },
              { title: "No Hidden Costs", desc: "Complete pricing with no surprise fees" },
              { title: "End-to-End Service", desc: "We handle everything from purchase to delivery" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg text-center backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Import Requirements for Kenya</h2>
              <p className="text-gray-600 mb-6">We handle most of the paperwork, but you'll need to provide:</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{requirement}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Compliance Information</h3>
                <p className="text-blue-700">
                  We ensure all vehicles comply with KEBS regulations and are right-hand drive. 
                  Vehicles older than 8 years require special import permits which we can assist with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Purchase from the UK?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Browse our current UK inventory or request a specific vehicle</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-blue-100 transition-colors shadow-lg"
            >
              View Available Inventory
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors shadow-lg"
            >
              Request Specific Vehicle
            </button>
          </div>
        </div>
      </section>

      {/* Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Us About Inventory</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="vehicle">Vehicle</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="container">Container</option>
                  <option value="specific">Specific Model Request</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Let us know what you're looking for..."></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesPage;