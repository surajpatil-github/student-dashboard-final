/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow build to succeed even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Optional: if ESLint would also fail your build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

