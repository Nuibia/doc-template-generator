/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['src', 'pages', 'components'],
    ignoreDuringBuilds: false,
  },
  webpack: config => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};

module.exports = withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
});
