/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
  basePath: '',
  reactStrictMode: true,
}

module.exports = nextConfig
