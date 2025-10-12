"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export interface Container {
  id: number;
  containerNumber: string;
  size: string;
  type: string;
  condition: string;
  location: string;
  status: string;
  price: number;
  imageUrls: string[];
}

export default function ContainerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        const res = await fetch(`https://carshipping.duckdns.org:8443/api/containers/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch container");
        const data: Container = await res.json();
        setContainer(data);
      } catch (error) {
        console.error("Error fetching container:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContainer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">
          Loading container details...
        </p>
      </div>
    );
  }

  if (!container) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Container not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const images = container.imageUrls || [];

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
          <h1 className="text-3xl font-bold">{container.containerNumber}</h1>
        </div>
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            container.status === "Available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {container.status}
        </span>
      </div>

      {/* 🔹 Slider Section */}
      {images.length > 0 && (
        <div className="relative w-full h-80 mb-8">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={container.containerNumber}
            className="w-full h-80 object-cover rounded-xl shadow-md transition-all duration-500"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
          />

          {/* Left Button */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            ‹
          </button>

          {/* Right Button */}
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImage ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Detail label="Size" value={container.size} />
        <Detail label="Type" value={container.type} />
        <Detail label="Condition" value={container.condition} />
        <Detail label="Location" value={container.location} />
        <Detail label="Price" value={`KES ${container.price.toLocaleString()}`} />
      </div>

      {/* Gallery */}
      {images.length > 1 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.slice(1).map((img, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-lg border"
              >
                <img
                  src={img}
                  alt={`container-img-${i}`}
                  className="w-full h-40 object-cover hover:scale-105 transition duration-300"
                />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// 🔹 Small reusable detail display component
interface DetailProps {
  label: string;
  value: string | number | undefined;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div>
      <h2 className="text-gray-500 mb-1">{label}</h2>
      <p className="text-lg font-medium">{value ?? "N/A"}</p>
    </div>
  );
}
