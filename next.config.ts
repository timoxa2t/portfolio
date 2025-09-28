import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  compress: true,
  output: "standalone",

  // Optimize build for low memory systems
  experimental: {
    workerThreads: false,
  },

  // Minimize webpack configuration for memory efficiency
  webpack: (config) => {
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: "all",
        maxSize: 244 * 1024, // 244KB chunks
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
        },
      },
    };

    // Limit parallel processing
    config.parallelism = 1;

    return config;
  },

  // Image optimization - reduced for memory efficiency
  images: {
    formats: ["image/webp"], // Only WebP to reduce processing
    deviceSizes: [640, 750, 1080, 1200], // Fewer sizes
    imageSizes: [16, 32, 64, 128, 256], // Fewer sizes
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
