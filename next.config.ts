import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kian-dev-bucket.storage.iran.liara.space",
      },
    ],
  },
  eslint: {
    dirs: ["*"],
  },
};

export default nextConfig;
