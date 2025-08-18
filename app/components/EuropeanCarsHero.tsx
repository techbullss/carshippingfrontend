'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';

export default function EuropeanCarsHero() {
  const carImages = [
    { src: "/cars.png", alt: "Mercedes-Benz luxury vehicles in our showroom" },
    { src: "/bb.png", alt: "Latest BMW models available in Kenya" },
    { src: "/benz.jpg", alt: "Premium Audi vehicles for Kenyan roads" },
    { src: "/bmw.gif", alt: "UK-imported Range Rover in Nairobi" },
  ];

  return (
    <div className="relative h-[80vh] min-h-[600px]  overflow-hidden">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        className="w-full h-full"
      >
        {carImages.map((car, index) => (
          <SwiperSlide key={index}>
            <div className="absolute inset-0">
              <Image
                src={car.src}
                alt={car.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-emerald-900/50"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="max-w-7xl px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-white text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-lg"
          >
            Since 2015 • Trusted Importer
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-emerald-300">
              European Auto Kenya
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md"
          >
            Your trusted partner for premium <strong className="text-white">German, British, and Italian</strong> vehicles in Kenya –  
            offering <strong className="text-white">new, used, and import services</strong> with unmatched reliability.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-white text-blue-800 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl">
              Browse Inventory
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition">
              Import Inquiry
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};