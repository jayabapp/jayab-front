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
    // WebP only. Every source in this app is already stored as WebP (the backend
    // re-encodes on upload), so emitting AVIF as well doubled the number of
    // on-disk cache entries per (url, width, quality) triple for a payload that
    // is only marginally smaller. One format, one entry.
    formats: ["image/webp"],

    // Sources are capped at upload time by `resizeWidth`: 1024 for property /
    // content / chat images, 512 for profiles, 256 for categories, 2048-2880 for
    // banners. `optimizeImage` resizes with `withoutEnlargement: true`, so Next
    // never upscales -- any requested width above the source width returns the
    // source-sized image under a *separate* cache key. With the old ladder,
    // w=1080, w=1200, w=1920, w=2048 and w=3840 all produced byte-identical
    // output for a 1024px source: five cache entries for one payload.
    //
    // 1024 is here because it is the exact source ceiling for property and
    // content images, which is the bulk of the corpus -- it gives them one
    // canonical top variant instead of several interchangeable ones.
    //
    // 1200 and 1920 exist only for the banner sources, which really are wider
    // than 1024. Dropping 1200 was tried and reverted: it left a 1024-1920 gap,
    // and a DPR3 phone asking for a ~1170px slot fell through to w=1920 and pulled
    // 682KB where w=1200 serves 277KB. For every <=1024 source, 1200 and 1920 are
    // still clamped down to 1024 -- that costs an extra cache key, never extra bytes,
    // and `maximumDiskCacheSize` below caps what those keys can add up to.
    deviceSizes: [640, 750, 828, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,

    // Without this Next falls back to `statfs(cacheDir).bavail * bsize / 2`, i.e.
    // HALF THE FREE DISK, so the LRU never evicts in practice and
    // `.next/cache/images` grows unbounded (360MB in 8h in production). The cost
    // is not only disk: `initCacheEntries` reads every entry's full buffer at
    // boot to size the LRU, so a large cache also inflates RSS on every restart.
    maximumDiskCacheSize: 200 * 1024 * 1024,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production" ? { properties: ["^data-test"] } : false,
  },
  productionBrowserSourceMaps: false,

  experimental: {
    // Client Router Cache lifetimes, in seconds. Next 15+ ships `dynamic: 0`,
    // which means a dynamic page is thrown away the moment you leave it: going
    // Back re-runs the whole server render and the remote API round trips with
    // it, so returning to a list felt exactly as slow as opening it. 30s covers
    // the read-an-article-then-go-back loop without letting a listing go stale
    // enough to show a removed property. `static` must be >= 30 per Next.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },

    // `viewTransition` is deliberately NOT enabled. It needs React's
    // <ViewTransition>, which only exists on the experimental React channel --
    // the installed react@19.2.7 does not export it, and Next only swaps in its
    // vendored experimental build for `taint`, `transitionIndicator` or
    // `gestureTransition`, not for this flag. Turning it on would therefore do
    // nothing except invite someone to install react@experimental in a
    // production app. Route enter animation is done in CSS instead; see
    // `.route-enter` in styles/globals.css.

    // `optimizeCss` (critters) was measured on this app and inlined no critical
    // CSS at all: same two render-blocking <link rel="stylesheet"> tags, same
    // CSS bytes, same HTML size with it on and off. critters is also deprecated
    // and unmaintained, so it was removed rather than kept as a no-op on the
    // build's critical path. `critters` can come out of devDependencies too.
    //
    // Rewrites barrel imports (`import { motion } from "framer-motion"`) into
    // deep imports so unused exports are dropped. Next already does this for a
    // built-in list that covers @headlessui/react and recharts; these are the
    // barrel packages this app uses that are not on it.
    optimizePackageImports: [
      "lodash",
      "framer-motion",
      "motion",
      "react-device-detect",
      "react-tooltip",
      "sonner",
    ],
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
