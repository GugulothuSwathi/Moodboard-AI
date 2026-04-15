// next.config.js
// Next.js configuration file
//
// WHY DO WE NEED THIS FOR IMAGES?
// Next.js has a built-in Image component (<Image />) that optimizes images.
// For security, it only loads images from domains you explicitly whitelist here.
// Unsplash images come from images.unsplash.com, so we allow it.

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Whitelist external image domains
    // Without this, next/image would refuse to load Unsplash photos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Experimental features (stable in Next.js 14)
  experimental: {
    // Server Actions — allows calling server functions directly from client components
    // We don't use them here, but good to know about
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
