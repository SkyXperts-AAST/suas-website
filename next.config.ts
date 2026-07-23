import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  // Static export ships no image-optimization server, so serve images as-is.
  images: { unoptimized: true },
  turbopack: {
    // Prevent Next from picking ~/package-lock.json as the workspace root
    root: path.join(__dirname),
  },
};

export default nextConfig;
