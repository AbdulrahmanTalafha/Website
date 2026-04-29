import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
