import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  // `next dev` refuses cross-origin requests for /_next/* assets, so opening
  // the dev server from a phone on the LAN served the HTML but 403'd every JS
  // chunk — the page rendered as static markup and React never hydrated.
  // Dev-only; the static export is unaffected.
  allowedDevOrigins: ["192.168.1.*"],
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
