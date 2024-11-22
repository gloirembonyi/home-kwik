// server.js
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Load HTTPS certificate and key
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

const port = process.env.PORT || 3000;

// Next.js configuration
const nextConfig = {
  experimental: {
    optimizeFonts: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
  // Add headers for font preloading
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: [
              '</fonts/GeistVF.woff>; rel=preload; as=font; crossorigin; type=font/woff',
              '</fonts/GeistMonoVF.woff>; rel=preload; as=font; crossorigin; type=font/woff',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

const app = next({ 
  dev: process.env.NODE_ENV !== 'production',
  conf: nextConfig // Add the configuration here
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    // Add CORS headers for font loading
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Handle preflight requests for font loading
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on https://localhost:${port}`);
  });
});

// Add proper error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});