import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ['localhost', 'flagcdn.com','stainlessbackend-5.onrender.com','res.cloudinary.com']
  },
  compiler: {
    emotion: true,
  },
};

export default nextConfig;
