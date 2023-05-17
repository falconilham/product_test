/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['dummyjson.com', 'i.dummyjson.com'],
  },
}

module.exports = nextConfig
