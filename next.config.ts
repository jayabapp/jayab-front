import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kian-dev-bucket.storage.iran.liara.space",
      },
      {
        protocol: "https",
        hostname: "kian-cdn1.s3.ir-thr-at1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "hot.ir-central1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "jayab-s3.hot.ir-central1.arvanstorage.ir",
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
  productionBrowserSourceMaps: false,

  experimental: {
    optimizeCss: true,
  },

  compress: true,

  async headers() {
    return [
      {
        // Everything under public/assets (icons, images, lotties). These
        // filenames are NOT content-hashed — a designer can overwrite
        // `logo.svg` in place — so `immutable` would strand clients on the old
        // file for a year. 30 days of hard caching plus a week of
        // stale-while-revalidate gets the PageSpeed win while still letting a
        // replaced asset propagate. Switch to `immutable, max-age=31536000`
        // only once these filenames carry a content hash.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Favicons and PWA icons at the root of public/. Same reasoning.
        source: "/:file(favicon.ico|favicon.svg|favicon-96x96.png|apple-touch-icon.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // A service worker must stay revalidated or clients pin an old build.
        source: "/firebase-messaging-sw.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/llms.txt",
        destination: "/api/llms",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

export default nextConfig;
