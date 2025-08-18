import { FaCar, FaShieldAlt, FaGlobe, FaShippingFast, FaHandshake } from 'react-icons/fa';
import Image from 'next/image';
import EuropeanCarsHero from '../components/EuropeanCarsHero';

const AboutUs = () => {
  return (
    <section className=" bg-gradient-to-b from-gray-200 mb-4 to-white">
      <div className="max-w-7xl mx-auto ">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <EuropeanCarsHero />
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FaCar className="text-blue-600 mr-3" /> Our Mission
            </h2>
            <p className="text-gray-700">
              To deliver <strong>authentic European automotive excellence</strong> to Kenya by providing  
              meticulously inspected vehicles from Germany, UK, Italy, and beyond – ensuring  
              performance, luxury, and value for every customer.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FaGlobe className="text-emerald-600 mr-3" /> Why Choose Us?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <FaShieldAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <span><strong>30-Point Certification:</strong> Every vehicle meets strict mechanical & cosmetic standards.</span>
              </li>
              <li className="flex items-start">
                <FaShippingFast className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <span><strong>Direct Imports:</strong> We handle shipping, customs, and paperwork for hassle-free delivery.</span>
              </li>
              <li className="flex items-start">
                <FaHandshake className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <span><strong>Kenya-Based Support:</strong> Local after-sales service & maintenance partnerships.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Featured Brands */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            We Specialize in <span className="text-blue-600">Europe's Finest</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Mercedes-Benz", country: "Germany", logo: "/mercedes.png" },
              { name: "BMW", country: "Germany", logo: "/bmwlogo.png" },
              { name: "Audi", country: "Germany", logo: "/audilogo.png" },
              { name: "Volkswagen", country: "Germany", logo: "/vw.png" },
              { name: "Porsche", country: "Germany", logo: "/porsche.png" },
              { name: "Jaguar", country: "UK", logo: "/jaguar.png" },
              { name: "Land Rover", country: "UK", logo: "/landrover.png" },
              { name: "Volvo", country: "Sweden", logo: "/volvo.png" },
            ].map((brand) => (
              <div key={brand.name} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col items-center">
                <div className="relative w-20 h-20 mb-3">
                  <Image 
                    src={brand.logo} 
                    alt={brand.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.country}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Import Process */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Seamless <span className="text-amber-300">Import to Kenya</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Vehicle Selection", desc: "We source from trusted European dealers & auctions" },
              { step: "2", title: "Inspection & Certification", desc: "Full mechanical & cosmetic evaluation" },
              { step: "3", title: "Shipping & Customs", desc: "Door-to-door delivery handled by our team" },
              { step: "4", title: "Kenya Registration", desc: "We assist with NTSA paperwork & compliance" },
            ].map((item) => (
              <div key={item.step} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-amber-400 text-blue-900 font-bold rounded-full flex items-center justify-center text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready for Your European Vehicle?
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you want a <strong>luxury sedan in Nairobi</strong> or need help importing a <strong>performance SUV from Germany</strong>, we make it effortless.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition shadow-lg">
              Browse Available Stock
            </button>
            <button className="bg-white border-2 border-blue-600 text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition">
              Request Import Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;