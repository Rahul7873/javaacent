import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/basic',
        destination: '/basic-practice',
        permanent: false,
      },
      {
        source: '/basic-problems',
        destination: '/basic-practice',
        permanent: false,
      },
      {
        source: '/basic-problem',
        destination: '/basic-practice',
        permanent: false,
      },
      {
        source: '/practice',
        destination: '/basic-practice',
        permanent: false,
      },
      {
        source: '/exercises',
        destination: '/basic-practice',
        permanent: false,
      },
      {
        source: '/basic-practice/:slug',
        destination: '/problems/:slug',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
