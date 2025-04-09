import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "static.finnhub.io",
        protocol: "https",
        pathname: "/logo/**",
      },
    ],
  },
};

export default nextConfig;
