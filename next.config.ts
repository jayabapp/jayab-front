import type { NextConfig } from "next";

const CompressionPlugin = require("compression-webpack-plugin");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kian-dev-bucket.storage.iran.liara.space",
      },
      {
        protocol: "https",
        hostname: "kian-cdn1.s3.ir-thr-at1.arvanstorage.ir",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production" ? { properties: ["^data-test"] } : false,
  },
  eslint: {
    dirs: ["*"],
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer, webpack, buildId }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // React core (highest priority)
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-is)[\\/]/,
            name: "react-vendor",
            chunks: "all",
            priority: 60,
            enforce: true,
          },

          // Next.js (high priority)
          nextVendor: {
            test: /[\\/]node_modules[\\/](next|next-seo|next-translate|next-pwa)[\\/]/,
            name: "next-vendor",
            chunks: "all",
            priority: 55,
            enforce: true,
          },

          // React Query
          reactQueryVendor: {
            test: /[\\/]node_modules[\\/](@tanstack\/react-query|react-query)[\\/]/,
            name: "react-query-vendor",
            chunks: "all",
            priority: 52,
          },

          // Animation libraries
          animationVendor: {
            test: /[\\/]node_modules[\\/](framer-motion|lottie-react|embla-carousel|rc-slider)[\\/]/,
            name: "animation-vendor",
            chunks: "all",
            priority: 50,
          },

          // UI Components
          uiVendor: {
            test: /[\\/]node_modules[\\/](@headlessui\/react|@heroicons\/react|@phosphor-icons\/react|sonner|input-otp)[\\/]/,
            name: "ui-vendor",
            chunks: "all",
            priority: 48,
          },

          // Maps
          mapsVendor: {
            test: /[\\/]node_modules[\\/](@neshan-maps-platform\/mapbox-gl|maplibre-gl)[\\/]/,
            name: "maps-vendor",
            chunks: "all",
            priority: 45,
          },

          // State management
          stateVendor: {
            test: /[\\/]node_modules[\\/](zustand)[\\/]/,
            name: "state-vendor",
            chunks: "all",
            priority: 43,
          },

          // Utility libraries
          utilsVendor: {
            test: /[\\/]node_modules[\\/](lodash|axios|moment|moment-jalaali|yup|qs|classnames|clsx)[\\/]/,
            name: "utils-vendor",
            chunks: "all",
            priority: 40,
          },

          // Date/time pickers
          dateVendor: {
            test: /[\\/]node_modules[\\/](@moamfar\/react-time-date-picker|@number-flow\/react)[\\/]/,
            name: "date-vendor",
            chunks: "all",
            priority: 38,
          },

          // Device detection
          deviceVendor: {
            test: /[\\/]node_modules[\\/](react-device-detect|react-responsive|use-detect-keyboard-open)[\\/]/,
            name: "device-vendor",
            chunks: "all",
            priority: 35,
          },

          // UI interaction
          interactionVendor: {
            test: /[\\/]node_modules[\\/](react-easy-crop|react-zoom-pan-pinch|react-infinite-scroll-component)[\\/]/,
            name: "interaction-vendor",
            chunks: "all",
            priority: 33,
          },

          // Firebase
          firebaseVendor: {
            test: /[\\/]node_modules[\\/](firebase)[\\/]/,
            name: "firebase-vendor",
            chunks: "all",
            priority: 30,
          },

          // Sanitization/Parsing
          sanitizeVendor: {
            test: /[\\/]node_modules[\\/](sanitize-html|node-html-parser)[\\/]/,
            name: "sanitize-vendor",
            chunks: "all",
            priority: 28,
          },

          // Crypto
          cryptoVendor: {
            test: /[\\/]node_modules[\\/](crypto-js)[\\/]/,
            name: "crypto-vendor",
            chunks: "all",
            priority: 25,
          },

          // Default vendors (catch-all for other node_modules)
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },

          // Shared code between pages/components
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Enable module concatenation for ES modules
      config.optimization.concatenateModules = true;
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
      config.optimization.flagIncludedChunks = true;

      // Webpack 5: Use chunkIds and moduleIds instead of occurrenceOrder
      config.optimization.chunkIds = "deterministic";
      config.optimization.moduleIds = "deterministic";

      // Better code splitting
      config.optimization.runtimeChunk = {
        name: "runtime",
      };

      // Remove moment locales completely (reduce bundle size significantly)
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      );

      // Add Gzip compression (always enabled)
      config.plugins.push(
        new CompressionPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          test: /\.(js|css|html|svg|json|webp|avif)$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        })
      );

      // Add Brotli compression conditionally
      if (process.env.BROTLI_COMPRESS === "true") {
        config.plugins.push(
          new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg|json|webp|avif)$/,
            compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          })
        );
      }
    }

    return config;
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },

  compress: true,
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

module.exports = nextConfig;
