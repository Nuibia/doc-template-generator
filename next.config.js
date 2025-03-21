/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
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
