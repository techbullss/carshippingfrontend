import { FaCar, FaGlobe, FaShieldAlt, FaShippingFast, FaHandshake, FaStar } from "react-icons/fa";
import Image from "next/image";

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Section (Replaced EuropeanCarsHero) */}
        <div className="relative bg-gradient-to-r from-blue-700 via-emerald-600 to-blue-800 text-white rounded-3xl shadow-xl overflow-hidden mb-20">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="/cars.png"
              alt="Luxury European Cars"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Bringing <span className="text-amber-300">Europe’s Finest Cars</span> to Kenya
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Discover premium <strong>German engineering</strong>, <strong>British luxury</strong>,  
              and <strong>Italian performance</strong> — all delivered with world-class service  
              and hassle-free import solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-8 py-4 rounded-xl font-bold shadow-md text-blue-900 bg-amber-400 hover:bg-amber-300 transition">
                Explore Our Collection
              </button>
              <button className="px-8 py-4 rounded-xl font-bold shadow-md border-2 border-white text-white bg-transparent hover:bg-white/10 transition">
                Start Your Import
              </button>
            </div>
          </div>
        </div>

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
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">
            Trusted Names, <span className="text-blue-600">Timeless Quality</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Mercedes-Benz", logo: "/mercedes.png" },
              { name: "BMW", logo: "/bmwlogo.png" },
              { name: "Audi", logo: "/audilogo.png" },
              { name: "Volkswagen", logo: "/vw.png" },
              { name: "Porsche", logo: "/porsche.png" },
              { name: "Jaguar", logo: "/jaguar.png" },
              { name: "Land Rover", logo: "/landrover.png" },
              { name: "Volvo", logo: "/volvo.png" },
            ].map((brand) => (
              <div
                key={brand.name}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                </div>
                <h3 className="font-semibold">{brand.name}</h3>
              </div>
            ))}
          </div>
        </div>

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
