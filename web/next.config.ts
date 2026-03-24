import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || 'http://ganado-backend:3000';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
