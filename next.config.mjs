// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production
  productionBrowserSourceMaps: true,

  // Webpack configuration for handling fonts and other assets
  webpack: (config, { isServer }) => {
    // Add rule for font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash][ext]'
      }
    });

    // Optional: Configure source maps
    if (!isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },

  // Image configuration (if you're using images)
  images: {
    domains: [], // Add any image domains you need
    remotePatterns: [
      // Add any remote patterns for images if needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/**',
      // },
    ],
  },

  // Enable experimental features if needed
  experimental: {
    // Add experimental features here if needed
    // serverActions: true,
    // typedRoutes: true,
  },

  // Customize dist directory if needed
  // distDir: 'build',

  // Add redirects if needed
  async redirects() {
    return [];
  },

  // Add rewrites if needed
  async rewrites() {
    return [];
  },

  // Add headers if needed
  async headers() {
    return [];
  },
};

export default nextConfig;