/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    // Add rule for font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash].[ext]'
      }
    });

    return config;
  },
  
  // Optional: Additional configuration for source maps
  sourceMaps: {
    production: {
      // Optionally control source map generation
      devtool: 'source-map'
    }
  }
};

export default nextConfig;