import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "static.finnhub.io",
        protocol: "https",
        pathname: "/logo/**",
      },
      {
        hostname: "static2.finnhub.io",
        protocol: "https",
        pathname: "/file/publicdatany/finnhubimage/stock_logo/**",
      },
    ],
  },
};

export default nextConfig;
