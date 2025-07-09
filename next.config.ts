import type { NextConfig } from "next";
const { withSentryConfig } = require("@sentry/nextjs");
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
  },
  eslint: {
    dirs: ["*"],
  },
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

module.exports = withSentryConfig(nextConfig, {
  org: "nine-fh",
  project: "javascript-nextjs",
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  // widenClientFileUpload: true,
  tunnelRoute: true,
  // authToken: process.env.SENTRY_AUTH_TOKEN,
  automaticVercelMonitors: true,
});
// export default nextConfig;
