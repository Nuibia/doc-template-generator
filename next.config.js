/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
};

module.exports = withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
});
