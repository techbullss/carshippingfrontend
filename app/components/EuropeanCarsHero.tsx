'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';

export default function EuropeanCarsHero() {
  const carImages = [
    { src: "/cars.png", alt: "Luxury Mercedes-Benz vehicles at our Nairobi showroom" },
    { src: "/bb.png", alt: "Brand-new BMW models ready for import" },
    { src: "/benz.jpg", alt: "Exclusive Audi lineup available for Kenyan drivers" },
    { src: "/bmw.gif", alt: "Range Rover sport edition imported from the UK" },
  ];

  return (
    <div className="relative h-[85vh] min-h-[620px] overflow-hidden">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={1200}
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
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="max-w-6xl px-4 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-sm font-semibold px-5 py-2 rounded-full mb-6 shadow-lg"
          >
            Premium Imports • Kenya’s #1 Since 2015
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl"
          >
            Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Europe’s Finest</span> in Kenya
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-lg"
          >
            Experience <strong className="text-white">luxury, performance, and trust</strong> with our handpicked selection  
            of <strong className="text-white">German, British, and Italian vehicles</strong> — imported and delivered to your doorstep.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:opacity-90 transition"
              onClick={() => window.location.href = "/Vehicles"}>
              Explore Our Stock
            </button>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
