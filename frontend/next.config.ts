import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*"
      },
      {
        protocol: "https",
        hostname: "colorful-bubble-220200a5c3.strapiapp.com"
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb" // Increase from default 1mb to 5mb for image uploads
    }
  }
};

export default nextConfig;
