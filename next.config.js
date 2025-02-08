/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google auth avatars
      },
    ],
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  // Disable static image imports for dynamic OAuth provider images
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 