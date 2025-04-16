import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // https://assets.parqet.com/logos/symbol/AAPL
      {
        hostname: 'assets.parqet.com',
        protocol: 'https',
        pathname: '/logos/symbol/**',
      },
    ],
  },

  redirects: async () => [
    {
      source: '/',
      destination: '/AAPL',
      permanent: true,
    },
  ],
};

export default nextConfig;
