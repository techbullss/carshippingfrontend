import { FaCar, FaGlobe, FaShieldAlt, FaShippingFast, FaHandshake, FaStar } from "react-icons/fa";
import Image from "next/image";
import { CheckBadgeIcon, RocketLaunchIcon, ShieldCheckIcon } from "@heroicons/react/16/solid";

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

       

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="p-8 bg-gradient-to-tr from-blue-50 to-white shadow-xl rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
              <FaCar className="text-blue-600 mr-3" /> Our Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To redefine car ownership in Kenya by delivering <strong>authentic European vehicles</strong>  
              that combine style, safety, and innovation — making luxury and reliability more accessible.
            </p>
          </div>

          <div className="p-8 bg-gradient-to-tr from-emerald-50 to-white shadow-xl rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
              <FaGlobe className="text-emerald-600 mr-3" /> Why We’re Different
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <FaShieldAlt className="text-blue-500 mt-1 mr-3" />
                <span><strong>Rigorous Certification:</strong> Every car passes 30+ safety & performance checks.</span>
              </li>
              <li className="flex items-start">
                <FaShippingFast className="text-blue-500 mt-1 mr-3" />
                <span><strong>Seamless Import:</strong> From sourcing to customs, we handle everything.</span>
              </li>
              <li className="flex items-start">
                <FaHandshake className="text-blue-500 mt-1 mr-3" />
                <span><strong>Local Support:</strong> After-sales care through trusted Kenyan partners.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Brands */}
         <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              You name it, we have it!
            </span>
          </h2>
         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
  We deliver authentic European performance - every vehicle comes with complete service 
  history and meets strict TÜV-certified mechanical standards.
</p>
        </div>

        {/* Image Banner */}
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Global Sourcing Card with UK Focus */}
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 group">
  <div className="p-6">
  
    {/* UK Brands Section */}
    <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-4 rounded-xl border border-blue-200/50">
      <div className="text-center mb-4">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-full border border-blue-500/30 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium text-sm">UK Manufacturing Excellence</span>
        </div>
      </div>
      
      {/* UK Brands Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Aston Martin', color: 'bg-green-500/10 text-green-700' },
          { name: 'Bentley', color: 'bg-red-500/10 text-red-700' },
          { name: 'Rolls-Royce', color: 'bg-gray-800/10 text-gray-800' },
          { name: 'Land Rover', color: 'bg-green-500/10 text-green-700' },
          { name: 'Jaguar', color: 'bg-blue-500/10 text-blue-700' },
          { name: 'McLaren', color: 'bg-orange-500/10 text-orange-700' },
          { name: 'Lotus', color: 'bg-yellow-500/10 text-yellow-700' },
          { name: 'Mini', color: 'bg-red-500/10 text-red-700' }
        ].map((brand) => (
          <div 
            key={brand.name} 
            className={`px-3 py-2 ${brand.color} rounded-lg text-xs font-medium text-center transition-all duration-200 hover:scale-105 hover:shadow-sm`}
          >
            {brand.name}
          </div>
        ))}
      </div>
      
      {/* Footer Note */}
      <p className="text-xs text-center text-gray-500 mt-3">
        Premium British automotive engineering
      </p>
    </div>
  </div>
</div>
          {/* Quality Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-6 mx-auto">
                <CheckBadgeIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Uncompromising Quality</h3>
              <p className="text-gray-600 text-center">
                Thorough inspections before shipment ensure you receive vehicles in the best possible condition.
              </p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Quality Guaranteed
                </span>
              </div>
            </div>
          </div>

          {/* Reliability Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-6 mx-auto">
                <ShieldCheckIcon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">30 Years of Trust</h3>
              <p className="text-gray-600 text-center">
                Our decades of excellence in the used car industry ensure reliability you can count on.
              </p>
              <div className="mt-6">
                <div className="flex justify-center items-center">
                  <div className="text-4xl font-bold text-amber-600 mr-2">30+</div>
                  <div className="text-gray-600">Years<br/>Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-6 mx-auto">
                <RocketLaunchIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Lightning Fast Delivery</h3>
              <p className="text-gray-600 text-center">
                Prompt worldwide shipment gets you behind the wheel of your dream car faster than you imagine.
              </p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-800 rounded-full">
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Fast Global Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>

        {/* Import Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            Simple, Transparent, <span className="text-amber-500">Step by Step</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose", desc: "Pick your dream car from Europe’s best brands." },
              { step: "2", title: "Verify", desc: "Full inspection & certification for peace of mind." },
              { step: "3", title: "Ship", desc: "We manage shipping, insurance & customs." },
              { step: "4", title: "Drive", desc: "Get your car registered and ready for Kenyan roads." },
            ].map((item) => (
              <div key={item.step} className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Journey With Confidence
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Whether it’s a <strong>luxury sedan</strong> for Nairobi streets or a <strong>rugged SUV</strong>  
            for Kenyan adventures — we make your European import seamless and reliable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-8 py-4 rounded-xl font-bold shadow-md text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-90 transition">
              View Available Cars
            </button>
            <button className="px-8 py-4 rounded-xl font-bold shadow-md border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition">
              Request Import Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
