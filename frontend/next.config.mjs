/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
