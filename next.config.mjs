/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/:category/:location/:slug',
        destination: '/[category]/[location]/[singleSlug]',
        has: [
          {
            type: 'header',
            key: 'x-custom-header',
          },
        ],
      },
    ]
  },
};

export default nextConfig;