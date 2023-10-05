/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require('path');
const removeImports = require('next-remove-imports');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const nextConfig = removeImports()({
  output: 'standalone',
  reactStrictMode: false,
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
        protocol: 'https',
        hostname: '**',
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
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    if (isServer) {
      return config;
    }

    var isProduction = config.mode === 'production';
    if (!isProduction) {
      return config;
    }

    config.optimization.splitChunks.minSize = 10000; // 10kb
    config.optimization.splitChunks.maxSize = 250000; // 250kb
    config.optimization.splitChunks.maxAsyncRequests = 8;
    config.optimization.splitChunks.maxInitialRequests = 8;
    config.optimization.splitChunks.filename =
      'static/chunks/[name].[contenthash].js';

    // check duplicate
    config.plugins.push(new DuplicatePackageCheckerPlugin());

    config.resolve.alias['@babel/runtime'] = path.resolve(
      __dirname,
      'node_modules',
      '@babel/runtime',
    );
    config.resolve.alias['@emotion/hash'] = path.resolve(
      __dirname,
      'node_modules',
      '@emotion/hash',
    );
    config.resolve.alias['@emotion/unitless'] = path.resolve(
      __dirname,
      'node_modules',
      '@emotion/unitless',
    );
    config.resolve.alias['@ethersproject/providers'] = path.resolve(
      __dirname,
      'node_modules',
      '@ethersproject/providers',
    );
    config.resolve.alias['@noble/hashes'] = path.resolve(
      __dirname,
      'node_modules',
      '@noble/hashes',
    );
    config.resolve.alias['aes-js'] = path.resolve(
      __dirname,
      'node_modules',
      'aes-js',
    );
    config.resolve.alias['axios'] = path.resolve(__dirname, 'node_modules', 'axios');
    config.resolve.alias['bech32'] = path.resolve(
      __dirname,
      'node_modules',
      'bech32',
    );
    config.resolve.alias['buffer'] = path.resolve(
      __dirname,
      'node_modules',
      'buffer',
    );
    config.resolve.alias['cookie'] = path.resolve(
      __dirname,
      'node_modules',
      'cookie',
    );
    config.resolve.alias['deepmerge'] = path.resolve(
      __dirname,
      'node_modules',
      'deepmerge',
    );
    config.resolve.alias['ethers'] = path.resolve(
      __dirname,
      'node_modules',
      'ethers',
    );
    config.resolve.alias['inherits'] = path.resolve(
      __dirname,
      'node_modules',
      'inherits',
    );
    config.resolve.alias['react-fast-compare'] = path.resolve(
      __dirname,
      'node_modules',
      'react-fast-compare',
    );
    config.resolve.alias['react-is'] = path.resolve(
      __dirname,
      'node_modules',
      'react-is',
    );
    config.resolve.alias['readable-stream'] = path.resolve(
      __dirname,
      'node_modules',
      'readable-stream',
    );
    config.resolve.alias['safe-buffer'] = path.resolve(
      __dirname,
      'node_modules',
      'safe-buffer',
    );
    config.resolve.alias['string_decoder'] = path.resolve(
      __dirname,
      'node_modules',
      'string_decoder',
    );
    config.resolve.alias['stylis'] = path.resolve(
      __dirname,
      'node_modules',
      'stylis',
    );
    config.resolve.alias['uncontrollable'] = path.resolve(
      __dirname,
      'node_modules',
      'uncontrollable',
    );
    config.resolve.alias['util'] = path.resolve(__dirname, 'node_modules', 'util');
    config.resolve.alias['uuid'] = path.resolve(__dirname, 'node_modules', 'uuid');
    config.resolve.alias['styled-components'] = path.resolve(
      __dirname,
      'node_modules',
      'styled-components',
    );

    // Important: return the modified config
    return config;
  },
});

module.exports = withBundleAnalyzer(nextConfig);
