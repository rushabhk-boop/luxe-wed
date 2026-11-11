import type { NextConfig } from "next";

// Static site: `npm run build` writes plain HTML/CSS/JS to ./out (no server, no database).
// On GitHub Pages the site lives under /<repo-name>, set with NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
