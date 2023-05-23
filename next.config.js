/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports');

const nextConfig = removeImports()({
  output: 'standalone',
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },

      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.trustless.computer',
      },
      {
        protocol: 'https',
        hostname: '**.trustless.market',
      },
    ],
  },
});

module.exports = nextConfig;
