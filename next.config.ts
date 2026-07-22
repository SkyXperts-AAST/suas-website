import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    // Prevent Next from picking ~/package-lock.json as the workspace root
    root: path.join(__dirname),
  },
};

export default nextConfig;
