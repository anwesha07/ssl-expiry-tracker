/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
