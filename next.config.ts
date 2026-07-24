import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  // Static export ships no image-optimization server, so serve images as-is.
  // i.ytimg.com is still allowlisted: next/image validates remote hostnames
  // regardless of `unoptimized`. Used by the vehicles page's lite YouTube embed.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  turbopack: {
    // Prevent Next from picking ~/package-lock.json as the workspace root
    root: path.join(__dirname),
  },
};

export default nextConfig;
