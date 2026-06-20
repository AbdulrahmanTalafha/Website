import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Wait for generateMetadata (CMS fetch) before sending HTML so <title> and meta tags
  // appear in view-source and for all crawlers, not only after JS hydration.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },
      { protocol: 'http', hostname: 'localhost', port: '8000' },
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
