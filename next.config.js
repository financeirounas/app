const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  
  experimental: {
    turbopack: false,
  },

  
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = withPWA(nextConfig);
