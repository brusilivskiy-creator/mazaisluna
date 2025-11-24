import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: false,
    formats: ["image/avif", "image/webp"], // Використовуємо сучасні формати для швидшого завантаження
  },
  // Improve error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Оптимізація для швидшого завантаження
  compress: true, // Включити gzip компресію
  poweredByHeader: false, // Прибрати заголовок X-Powered-By
  // Оптимізація зображень
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
