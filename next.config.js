/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de CORS para desenvolvimento
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "192.168.18.187:3000"
      ]
    }
  },

  // Configurações de otimização
  compress: true,
  productionBrowserSourceMaps: false,

  // Configurações de imagens
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    minimumCacheTTL: 60,
  },

  // Configurações de logging
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  // Configurações de redirecionamento para Supabase
  // async rewrites() {
  //   return [
  //     {
  //       source: '/rest/v1/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/:path*`,
  //     },
  //     {
  //       source: '/auth/v1/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/:path*`,
  //     },
  //   ]
  // },

  // Configurações de segurança
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  }
}

module.exports = nextConfig
