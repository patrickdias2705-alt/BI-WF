/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que funcione em mobile
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  // Configurações para mobile
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig






