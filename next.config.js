/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require("path");
const removeImports = require('next-remove-imports');

const nextConfig = removeImports()({
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
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
        hostname: '**.newbitcoindex.com',
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "@/styles/_variables.scss";
    @import "@/styles/_mixins.scss";
    @import "@/styles/_variables.scss";
  `,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
});

module.exports = nextConfig;
